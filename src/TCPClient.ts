/**
 * TCP Client - Connects to Symfony dump server and captures dump data
 */

import { Socket } from 'net';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import { DumpData, DumpCategory } from './types';
import { HTMLDumpProcessor, ProcessedDump } from './HTMLDumpProcessor';

export interface TCPClientOptions {
  host: string;
  port: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export class TCPClient extends EventEmitter {
  private socket: Socket | null = null;
  private options: TCPClientOptions;
  private isConnected = false;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private buffer = '';

  constructor(options: TCPClientOptions) {
    super();
    this.options = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      ...options
    };
  }

  /**
   * Connect to the Symfony dump server
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      
      return;
    }

    return new Promise((resolve, reject) => {
      // Connecting to dump server

      this.socket = new Socket();
      
      this.socket.on('connect', () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        // Connected to Symfony dump server
        this.emit('connected');
        resolve();
      });

      this.socket.on('data', (data) => {
        this.handleData(data);
      });

      this.socket.on('close', () => {
        this.isConnected = false;

        this.emit('disconnected');
        this.attemptReconnect();
      });

      this.socket.on('error', (error) => {
        console.error(chalk.red('❌ TCP connection error:'), error.message);
        this.emit('error', error);
        
        if (!this.isConnected) {
          reject(error);
        }
      });

      // Attempt connection
      this.socket.connect(this.options.port, this.options.host);

      // Set connection timeout
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error(`Connection timeout to ${this.options.host}:${this.options.port}`));
        }
      }, 5000);
    });
  }

  /**
   * Disconnect from the dump server
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }

    this.isConnected = false;
    
  }

  /**
   * Check if connected
   */
  isClientConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Handle incoming data from the dump server
   */
  private handleData(data: Buffer): void {
    try {
      // Append new data to buffer
      this.buffer += data.toString();

      // Process complete messages (Symfony sends data in specific format)
      this.processBuffer();

    } catch (error) {
      console.error(chalk.red('❌ Error processing dump data:'), error);
      this.emit('error', error);
    }
  }

  /**
   * Process the data buffer to extract complete dump messages
   */
  private processBuffer(): void {
    // Symfony dump server sends data in a specific format
    // Look for complete dump messages in the buffer
    
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || ''; // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.trim()) {
        this.processDumpLine(line);
      }
    }
  }

  /**
   * Process a single dump line from Symfony
   */
  private processDumpLine(line: string): void {
    try {
      // Symfony dump server sends JSON-encoded data
      const dumpMessage = JSON.parse(line);
      
      if (dumpMessage && dumpMessage.data) {
        const dumpData = this.parseDumpMessage(dumpMessage);
        this.emit('dump', dumpData);
      }

    } catch (error) {
      // If it's not JSON, it might be raw HTML dump data
      // In that case, treat it as a simple dump
      if (line.includes('<') && line.includes('>')) {
        const dumpData = this.parseHtmlDump(line);
        this.emit('dump', dumpData);
      } else {
        console.warn(chalk.yellow('⚠️  Received unrecognized dump format:'), line.substring(0, 100));
      }
    }
  }

  /**
   * Parse structured dump message from Symfony
   */
  private parseDumpMessage(message: any): DumpData {
    const htmlContent = this.extractHtmlContent(message);
    const sourceInfo = this.extractSourceInfo(message);
    
    // Use HTMLDumpProcessor to process the dump
    const processedDump = HTMLDumpProcessor.processDump(htmlContent, sourceInfo);
    
    return {
      id: processedDump.id,
      timestamp: processedDump.timestamp,
      source: processedDump.source,
      category: processedDump.category,
      content: processedDump.content,
      rawData: JSON.stringify(message)
    };
  }

  /**
   * Parse HTML dump data (fallback for direct HTML)
   */
  private parseHtmlDump(htmlContent: string): DumpData {
    // Use HTMLDumpProcessor to process the raw HTML
    const processedDump = HTMLDumpProcessor.processDump(htmlContent);
    
    return {
      id: processedDump.id,
      timestamp: processedDump.timestamp,
      source: processedDump.source,
      category: processedDump.category,
      content: processedDump.content,
      rawData: htmlContent
    };
  }

  /**
   * Extract source information from dump message
   */
  private extractSourceInfo(message: any): { file: string; line: number; function?: string; class?: string } {
    // Try to extract source info from various possible locations in the message
    const context = message.context || {};
    const trace = context.trace || [];
    
    if (trace.length > 0) {
      const firstFrame = trace[0];
      return {
        file: firstFrame.file || 'unknown',
        line: firstFrame.line || 0,
        function: firstFrame.function,
        class: firstFrame.class
      };
    }

    // Fallback to context info
    return {
      file: context.file || 'unknown',
      line: context.line || 0,
      function: context.function,
      class: context.class
    };
  }

  /**
   * Extract source info from HTML content (fallback)
   */
  private extractSourceFromHtml(html: string): { file: string; line: number } {
    // Try to extract file and line info from HTML comments or attributes
    const fileMatch = html.match(/data-file="([^"]+)"/);
    const lineMatch = html.match(/data-line="(\d+)"/);
    
    return {
      file: fileMatch ? fileMatch[1] : 'unknown',
      line: lineMatch ? parseInt(lineMatch[1]) : 0
    };
  }

  /**
   * Determine dump category based on content
   */
  private determineDumpCategory(message: any): DumpCategory {
    const content = JSON.stringify(message).toLowerCase();
    
    if (content.includes('query') || content.includes('sql')) {
      return DumpCategory.QUERY;
    }
    if (content.includes('request') || content.includes('http')) {
      return DumpCategory.REQUEST;
    }
    if (content.includes('job') || content.includes('queue')) {
      return DumpCategory.JOB;
    }
    if (content.includes('view') || content.includes('template')) {
      return DumpCategory.VIEW;
    }
    if (content.includes('log') || content.includes('error')) {
      return DumpCategory.LOG;
    }
    
    return DumpCategory.DUMP;
  }

  /**
   * Extract HTML content from dump message
   */
  private extractHtmlContent(message: any): string {
    // Symfony VarDumper provides formatted HTML in the data
    if (message.data && typeof message.data === 'string') {
      return message.data;
    }
    
    // If data is an object, try to render it as HTML
    if (message.data && typeof message.data === 'object') {
      return this.renderObjectAsHtml(message.data);
    }
    
    // Fallback to JSON representation
    return `<pre>${JSON.stringify(message.data, null, 2)}</pre>`;
  }

  /**
   * Render object data as HTML (fallback)
   */
  private renderObjectAsHtml(data: any): string {
    try {
      return `<div class="sf-dump">
        <pre class="sf-dump-code">${JSON.stringify(data, null, 2)}</pre>
      </div>`;
    } catch (error) {
      return `<div class="sf-dump">
        <pre class="sf-dump-code">[Object - could not serialize]</pre>
      </div>`;
    }
  }

  /**
   * Generate unique dump ID
   */
  private generateDumpId(): string {
    return `dump_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Attempt to reconnect to the dump server
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts!) {
      console.error(chalk.red(`❌ Max reconnection attempts (${this.options.maxReconnectAttempts}) reached`));
      this.emit('maxReconnectAttemptsReached');
      return;
    }

    this.reconnectAttempts++;


    this.reconnectTimer = setTimeout(() => {
      this.connect().catch((error) => {
        console.error(chalk.red('❌ Reconnection failed:'), error.message);
        this.emit('reconnectFailed', error);
      });
    }, this.options.reconnectInterval);

    this.emit('reconnecting', this.reconnectAttempts);
  }

  /**
   * Get connection statistics
   */
  getStats() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      host: this.options.host,
      port: this.options.port
    };
  }
}