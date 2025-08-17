/**
 * Main DumpViewer class that orchestrates all components
 */

import chalk from 'chalk';
import open from 'open';
import { DumpServerManager } from './DumpServerManager';
import { TCPClient } from './TCPClient';
import { DumpData, ServerStatus } from './types';
import { DumpStore, DumpFilter } from './DumpStore';
import { WebSocketServer } from './WebSocketServer';
import { ExpressServer } from './ExpressServer';
import { HTMLDumpProcessor } from './HTMLDumpProcessor';

export interface DumpViewerOptions {
  webPort: number;
  dumpPort: number;
  autoOpen: boolean;
}

export class DumpViewer {
  private options: DumpViewerOptions;
  private dumpServerManager: DumpServerManager;
  private tcpClient: TCPClient;
  private dumpStore: DumpStore;
  private webSocketServer: WebSocketServer;
  private expressServer: ExpressServer;

  constructor(options: DumpViewerOptions) {
    this.options = options;
    this.dumpServerManager = new DumpServerManager({
      port: options.dumpPort,
      host: '127.0.0.1'
    });
    this.tcpClient = new TCPClient({
      host: '127.0.0.1',
      port: options.dumpPort,
      reconnectInterval: 3000,
      maxReconnectAttempts: 10
    });
    this.dumpStore = new DumpStore(1000); // Keep last 1000 dumps
    this.webSocketServer = new WebSocketServer();
    this.expressServer = new ExpressServer({
      port: options.webPort,
      enableCors: true
    });
  }

  async start(): Promise<void> {
    console.log(chalk.blue.bold('🚀 Starting Symfony Dump Viewer...'));
    console.log(chalk.gray(`Web interface: http://localhost:${this.options.webPort}`));
    console.log(chalk.gray(`Dump server: 127.0.0.1:${this.options.dumpPort}`));

    try {
      await this.dumpServerManager.startServer();
      this.dumpServerManager.startHealthMonitoring();
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.dumpServerManager.on('dumpHtml', (html: string) => {
        try {
          const processed = HTMLDumpProcessor.processDump(html);
          const dumpData: DumpData = {
            id: processed.id,
            timestamp: processed.timestamp,
            source: processed.source,
            category: processed.category,
            content: processed.content,
            rawData: html
          };
          this.handleNewDump(dumpData);
        } catch (e) {
          // Silently handle processing errors
        }
      });

      this.dumpServerManager.on('error', (error: Error) => {
        // Handle dump server errors silently
      });

      // TCP client kept for compatibility but not required for Symfony flow
      await this.startTCPClient();



      this.setupGracefulShutdown();
      await this.startExpressServer();
      await this.startWebSocketServer();

    } catch (error) {
      console.error(chalk.red('❌ Failed to start dump viewer:'), error);
      throw error;
    }
  }

  async stop(): Promise<void> {

    
    try {
      // Stop WebSocket server
      await this.webSocketServer.stop();
      
      // Stop Express server
      await this.expressServer.stop();
      
      // Stop TCP client
      this.tcpClient.disconnect();
      
      // Stop dump server
      await this.dumpServerManager.stopServer();
      

    } catch (error) {
      console.error(chalk.red('❌ Error during shutdown:'), error);
    }
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
  
      await this.stop();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  getDumpServerStatus() {
    return {
      isRunning: this.dumpServerManager.isServerRunning(),
      port: this.dumpServerManager.getServerPort()
    };
  }

  getPhpHelperPath(): string {
    return this.dumpServerManager.getPhpHelperPath();
  }



  /**
   * Start the TCP client and set up event handlers
   */
  private async startTCPClient(): Promise<void> {
    this.tcpClient.on('dump', (dumpData: DumpData) => {
      this.handleNewDump(dumpData);
    });

    await this.tcpClient.connect();
  }

  /**
   * Handle new dump data received from TCP client
   */
  private handleNewDump(dumpData: DumpData): void {
    this.dumpStore.addDump(dumpData);
    this.webSocketServer.broadcastDump(dumpData);
    this.broadcastServerStatus();
  }

  /**
   * Get all stored dumps
   */
  getDumps(): DumpData[] {
    return this.dumpStore.getAllDumps();
  }

  /**
   * Get filtered dumps
   */
  getFilteredDumps(filter: DumpFilter): DumpData[] {
    return this.dumpStore.getFilteredDumps(filter);
  }

  /**
   * Get dump by ID
   */
  getDumpById(id: string): DumpData | undefined {
    return this.dumpStore.getDumpById(id);
  }

  /**
   * Clear all stored dumps
   */
  clearDumps(): void {
    this.dumpStore.clearDumps();
  }

  /**
   * Get dump statistics
   */
  getDumpStats() {
    return this.dumpStore.getStats();
  }

  /**
   * Export dumps
   */
  exportDumps(filter?: DumpFilter): string {
    return this.dumpStore.exportDumps(filter);
  }

  /**
   * Get TCP client connection status
   */
  getTCPClientStatus() {
    return this.tcpClient.getStats();
  }

  /**
   * Start Express server and set up API endpoints
   */
  private async startExpressServer(): Promise<void> {


    // Set up API endpoints
    this.expressServer.setAPIEndpoints({
      getDumps: (filter?: DumpFilter) => {
        return filter ? this.dumpStore.getFilteredDumps(filter) : this.dumpStore.getAllDumps();
      },
      getDumpById: (id: string) => {
        return this.dumpStore.getDumpById(id);
      },
      clearDumps: () => {
        this.clearDumps();
      },
      getServerStatus: () => {
        return this.getServerStatus();
      },
      exportDumps: (filter?: DumpFilter) => {
        return this.dumpStore.exportDumps(filter);
      }
    });

    const httpServer = await this.expressServer.start();

    if (this.options.autoOpen) {
      try {
        await open(`http://localhost:${this.options.webPort}`);
      } catch (error) {
        // Browser opening failed
      }
    }
  }

  /**
   * Start WebSocket server integrated with Express HTTP server
   */
  private async startWebSocketServer(): Promise<void> {




    // Set up WebSocket event handlers
    this.webSocketServer.on('clientConnected', (client) => {
      const dumps = this.dumpStore.getAllDumps();
      if (dumps.length > 0) {
        this.webSocketServer.sendDumpsToClient(client.id, dumps);
      }
      this.broadcastServerStatus();
    });

    this.webSocketServer.on('clientDisconnected', (client) => {
      // Client disconnected
    });

    this.webSocketServer.on('requestStatus', (clientId) => {
      const status = this.getServerStatus();
      this.webSocketServer.sendToClient(clientId, {
        type: 'status',
        data: status,
        timestamp: new Date()
      });
    });

    this.webSocketServer.on('requestDumps', (clientId, filter) => {
      const dumps = filter ? this.dumpStore.getFilteredDumps(filter) : this.dumpStore.getAllDumps();
      this.webSocketServer.sendDumpsToClient(clientId, dumps);
    });

    this.webSocketServer.on('clearDumps', (clientId) => {
      this.clearDumps();
      this.webSocketServer.broadcast({
        type: 'clear',
        timestamp: new Date()
      });
    });

    this.webSocketServer.on('filterDumps', (clientId, filter) => {
      const filteredDumps = this.dumpStore.getFilteredDumps(filter);
      this.webSocketServer.sendDumpsToClient(clientId, filteredDumps);
    });

    const httpServer = this.expressServer.getHTTPServer();
    if (httpServer) {
      await this.webSocketServer.start(httpServer);
    } else {
      throw new Error('HTTP server not available for WebSocket integration');
    }
  }

  /**
   * Broadcast server status to all connected clients
   */
  private broadcastServerStatus(): void {
    const status: ServerStatus = {
      dumpServerRunning: this.dumpServerManager.isServerRunning(),
      dumpServerPort: this.dumpServerManager.getServerPort(),
      webServerPort: this.options.webPort,
      connectedClients: this.webSocketServer.getConnectedClientsCount(),
      tcpClientConnected: this.tcpClient.isClientConnected(),
      totalDumps: this.dumpStore.getStats().total
    };

    this.webSocketServer.broadcastStatus(status);
  }

  /**
   * Get WebSocket server status
   */
  getWebSocketServerStatus() {
    return this.webSocketServer.getStats();
  }

  /**
   * Process dump message from the dump server
   */
  private processDumpMessage(message: any): DumpData {
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
   * Extract HTML content from dump message
   */
  private extractHtmlContent(message: any): string {
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
   * Extract source information from dump message
   */
  private extractSourceInfo(message: any): { file: string; line: number; function?: string; class?: string } {
    const context = message.context || {};
    
    return {
      file: context.file || 'unknown',
      line: context.line || 0,
      function: context.function,
      class: context.class
    };
  }

  /**
   * Get complete server status
   */
  getServerStatus(): ServerStatus {
    return {
      dumpServerRunning: this.dumpServerManager.isServerRunning(),
      dumpServerPort: this.dumpServerManager.getServerPort(),
      webServerPort: this.options.webPort,
      connectedClients: this.webSocketServer.getConnectedClientsCount(),
      tcpClientConnected: this.tcpClient.isClientConnected(),
      totalDumps: this.dumpStore.getStats().total
    };
  }
}