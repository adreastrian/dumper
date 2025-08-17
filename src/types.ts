/**
 * Type definitions for Symfony Dump Viewer
 */

export interface DumpData {
  id: string;
  timestamp: Date;
  source: {
    file: string;
    line: number;
    function?: string;
    class?: string;
  };
  category: DumpCategory;
  content: string; // HTML content from Symfony dump server
  rawData?: string; // Original raw data if needed
}

export enum DumpCategory {
  DUMP = 'dumps',
  QUERY = 'queries',
  LOG = 'logs',
  REQUEST = 'requests',
  VIEW = 'views',
  JOB = 'jobs'
}

export interface WebSocketMessage {
  type: 'dump' | 'status' | 'error' | 'clear' | 'dumps';
  data?: any;
  timestamp?: Date;
}

export interface ServerStatus {
  dumpServerRunning: boolean;
  dumpServerPort: number;
  webServerPort: number;
  connectedClients: number;
  tcpClientConnected: boolean;
  totalDumps: number;
}

export interface TCPClientStats {
  isConnected: boolean;
  reconnectAttempts: number;
  host: string;
  port: number;
}