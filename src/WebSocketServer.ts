/**
 * WebSocket Server - Bridges TCP dump data to browser clients in real-time
 */

import { WebSocketServer as WSServer, WebSocket } from 'ws';
import { Server as HTTPServer } from 'http';
import { EventEmitter } from 'events';
import chalk from 'chalk';
import { DumpData, WebSocketMessage, ServerStatus } from './types';
import { Logger } from './utils/Logger';

export interface WebSocketServerOptions {
  port?: number;
  server?: HTTPServer;
}

export interface ConnectedClient {
  id: string;
  ws: WebSocket;
  connectedAt: Date;
  lastPing?: Date;
}

export class WebSocketServer extends EventEmitter {
  private wss: WSServer | null = null;
  private clients: Map<string, ConnectedClient> = new Map();
  private options: WebSocketServerOptions;
  private pingInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(options: WebSocketServerOptions = {}) {
    super();
    this.options = options;
  }

  /**
   * Start the WebSocket server
   */
  async start(httpServer?: HTTPServer): Promise<void> {
    if (this.isRunning) {

      return;
    }

    try {
      const serverOptions: any = {};
      
      if (httpServer) {
        serverOptions.server = httpServer;
        // Starting WebSocket server with HTTP server integration
      } else if (this.options.port) {
        serverOptions.port = this.options.port;
        // Starting WebSocket server on port
      } else {
        throw new Error('Either HTTP server or port must be provided');
      }

      this.wss = new WSServer(serverOptions);
      this.setupWebSocketHandlers();
      this.startPingInterval();
      this.isRunning = true;

      // WebSocket server started successfully
      this.emit('started');

    } catch (error) {
      console.error(chalk.red('❌ Failed to start WebSocket server:'), error);
      throw error;
    }
  }

  /**
   * Stop the WebSocket server
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    // Logger.info('Stopping WebSocket server...');

    // Stop ping interval
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    // Close all client connections
    for (const [clientId, client] of this.clients) {
      try {
        client.ws.close(1000, 'Server shutting down');
      } catch (error) {
  
      }
    }
    this.clients.clear();

    // Close WebSocket server
    if (this.wss) {
      await new Promise<void>((resolve) => {
        this.wss!.close(() => {
          this.wss = null;
          this.isRunning = false;
          console.log(chalk.green('Server stopped'));
          this.emit('stopped');
          resolve();
        });
      });
    }
  }

  /**
   * Broadcast dump data to all connected clients
   */
  broadcastDump(dumpData: DumpData): void {
    const message: WebSocketMessage = {
      type: 'dump',
      data: dumpData,
      timestamp: new Date()
    };

    this.broadcastMessage(message);
    
  }

  /**
   * Broadcast server status to all clients
   */
  broadcastStatus(status: ServerStatus): void {
    const message: WebSocketMessage = {
      type: 'status',
      data: status,
      timestamp: new Date()
    };

    this.broadcastMessage(message);
  }

  /**
   * Broadcast error message to all clients
   */
  broadcastError(error: string): void {
    const message: WebSocketMessage = {
      type: 'error',
      data: { message: error },
      timestamp: new Date()
    };

    this.broadcastMessage(message);
  }

  /**
   * Send dumps list to a specific client
   */
  sendDumpsToClient(clientId: string, dumps: DumpData[]): void {
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }

    const message: WebSocketMessage = {
      type: 'dumps',
      data: dumps,
      timestamp: new Date()
    };

    this.sendToClient(client.id, message);
  }

  /**
   * Get connected clients count
   */
  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  /**
   * Get connected clients info
   */
  getConnectedClients(): ConnectedClient[] {
    return Array.from(this.clients.values());
  }

  /**
   * Check if server is running
   */
  isServerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupWebSocketHandlers(): void {
    if (!this.wss) return;

    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = this.generateClientId();
      const client: ConnectedClient = {
        id: clientId,
        ws,
        connectedAt: new Date()
      };

      this.clients.set(clientId, client);
      



      // Send welcome message
      this.sendToClient(client.id, {
        type: 'status',
        data: { message: 'Connected to Symfony Dump Viewer' },
        timestamp: new Date()
      });

      // Setup client event handlers
      this.setupClientHandlers(client);

      this.emit('clientConnected', client);
    });

    this.wss.on('error', (error) => {
      console.error(chalk.red('❌ WebSocket server error:'), error);
      this.emit('error', error);
    });
  }

  /**
   * Setup individual client event handlers
   */
  private setupClientHandlers(client: ConnectedClient): void {
    client.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleClientMessage(client, message);
      } catch (error) {

        this.sendToClient(client.id, {
          type: 'error',
          data: { message: 'Invalid message format' },
          timestamp: new Date()
        });
      }
    });

    client.ws.on('close', (code, reason) => {
      this.clients.delete(client.id);


      this.emit('clientDisconnected', client);
    });

    client.ws.on('error', (error) => {
      Logger.warn(`Client ${client.id} error:`, error);
      this.clients.delete(client.id);
    });

    client.ws.on('pong', () => {
      client.lastPing = new Date();
    });
  }

  /**
   * Handle messages from clients
   */
  private handleClientMessage(client: ConnectedClient, message: any): void {
    Logger.debug(`Message from client ${client.id}:`, message);

    switch (message.type) {
      case 'ping':
              this.sendToClient(client.id, {
        type: 'status',
        data: { message: 'pong' },
        timestamp: new Date()
      });
        break;

      case 'requestStatus':
        // Client is requesting server status - will be handled by DumpViewer
        this.emit('requestStatus', client.id);
        break;

      case 'requestDumps':
        // Client is requesting current dumps - will be handled by DumpViewer
        this.emit('requestDumps', client.id, message.data);
        break;

      case 'clearDumps':
        // Client wants to clear dumps
        this.emit('clearDumps', client.id);
        break;

      case 'filterDumps':
        // Client wants to filter dumps
        this.emit('filterDumps', client.id, message.data);
        break;

      default:
        Logger.warn(`Unknown message type from client ${client.id}: ${message.type}`);
    }
  }

  /**
   * Public method to broadcast custom messages
   */
  broadcast(message: WebSocketMessage): void {
    this.broadcastMessage(message);
  }

  /**
   * Broadcast message to all connected clients
   */
  private broadcastMessage(message: WebSocketMessage): void {
    const messageStr = JSON.stringify(message);
    let sentCount = 0;
    let errorCount = 0;

    for (const [clientId, client] of this.clients) {
      try {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(messageStr);
          sentCount++;
        } else {
          // Remove disconnected clients
          this.clients.delete(clientId);
        }
      } catch (error) {

        this.clients.delete(clientId);
        errorCount++;
      }
    }


  }

  /**
   * Send message to specific client
   */
  sendToClient(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }
    try {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      } else {

        this.clients.delete(client.id);
      }
    } catch (error) {
      
      this.clients.delete(client.id);
    }
  }

  /**
   * Start ping interval to keep connections alive
   */
  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      for (const [clientId, client] of this.clients) {
        try {
          if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.ping();
          } else {
            this.clients.delete(clientId);
          }
        } catch (error) {

          this.clients.delete(clientId);
        }
      }
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Generate unique client ID
   */
  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get server statistics
   */
  getStats() {
    const clients = Array.from(this.clients.values());
    const now = new Date();

    return {
      isRunning: this.isRunning,
      connectedClients: this.clients.size,
      totalConnections: clients.length,
      averageConnectionTime: clients.length > 0 
        ? clients.reduce((sum, client) => sum + (now.getTime() - client.connectedAt.getTime()), 0) / clients.length
        : 0,
      oldestConnection: clients.length > 0 
        ? Math.min(...clients.map(c => c.connectedAt.getTime()))
        : null
    };
  }
}