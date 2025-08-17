/**
 * Express Server - Serves web interface and provides API endpoints
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { Server as HTTPServer, createServer } from 'http';
import { join } from 'path';
import chalk from 'chalk';
import { DumpData, ServerStatus } from './types';
import { DumpFilter } from './DumpStore';
import { Logger } from './utils/Logger';
import { SymfonyAssetManager } from './SymfonyAssetManager';
import path from 'path';

export interface ExpressServerOptions {
  port: number;
  staticPath?: string;
  enableCors?: boolean;
}

export interface APIEndpoints {
  getDumps: (filter?: DumpFilter) => DumpData[];
  getDumpById: (id: string) => DumpData | undefined;
  clearDumps: () => void;
  getServerStatus: () => ServerStatus;
  exportDumps: (filter?: DumpFilter) => string;
}

export class ExpressServer {
  private app: Express;
  private server: HTTPServer | null = null;
  private options: ExpressServerOptions;
  private apiEndpoints: APIEndpoints | null = null;
  private isRunning = false;
  private symfonyAssetManager: SymfonyAssetManager;

  constructor(options: ExpressServerOptions) {
    this.options = {
      staticPath: join(__dirname, '../public'),
      enableCors: true,
      ...options
    };
    
    this.app = express();
    this.symfonyAssetManager = new SymfonyAssetManager();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Start the Express server
   */
  async start(): Promise<HTTPServer> {
    if (this.isRunning) {

      return this.server!;
    }

    // Initialize Symfony assets before starting the server
    await this.initializeSymfonyAssets();

    return new Promise((resolve, reject) => {
      this.server = createServer(this.app);

      this.server.listen(this.options.port, () => {
        this.isRunning = true;
        // Express server started
        // Logger.info(`Express server listening on port ${this.options.port}`);
        resolve(this.server!);
      });

      this.server.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          console.error(chalk.red(`❌ Port ${this.options.port} is already in use`));
          reject(new Error(`Port ${this.options.port} is already in use`));
        } else {
          console.error(chalk.red('❌ Express server error:'), error);
          reject(error);
        }
      });
    });
  }

  /**
   * Stop the Express server
   */
  async stop(): Promise<void> {
    if (!this.server || !this.isRunning) {
      return;
    }

    return new Promise((resolve) => {
      this.server!.close(() => {
        this.isRunning = false;
        this.server = null;
  
        resolve();
      });
    });
  }

  /**
   * Get the HTTP server instance for WebSocket integration
   */
  getHTTPServer(): HTTPServer | null {
    return this.server;
  }

  /**
   * Set API endpoints for handling requests
   */
  setAPIEndpoints(endpoints: APIEndpoints): void {
    this.apiEndpoints = endpoints;
  }

  /**
   * Check if server is running
   */
  isServerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get server port
   */
  getPort(): number {
    return this.options.port;
  }

  /**
   * Setup Express middleware
   */
  private setupMiddleware(): void {
    // Enable CORS if requested
    if (this.options.enableCors) {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        
        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    }

    // Parse JSON bodies
    this.app.use(express.json({ limit: '10mb' }));
    
    // Parse URL-encoded bodies
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {

      next();
    });

    // Optional live reload in development
    if (process.env.LIVERELOAD === '1') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const connectLivereload = require('connect-livereload');
        this.app.use(connectLivereload());
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const livereload = require('livereload');
        const lrServer = livereload.createServer({
          exts: ['html', 'css', 'js', 'ts'],
          delay: 150,
        });
        lrServer.watch(this.options.staticPath!);

      } catch (_) {
        
      }
    }

    // Static file serving
    this.app.use(express.static(this.options.staticPath!));

    // Symfony VarDumper assets will be set up after initialization

    // Error handling middleware
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {

      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    });
  }

  /**
   * Setup Express routes
   */
  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // API Routes
    this.setupAPIRoutes();

    // Serve main application for all other routes (SPA support)
    this.app.get('*', (req: Request, res: Response) => {
      res.sendFile(join(this.options.staticPath!, 'index.html'));
    });
  }

  /**
   * Setup API routes
   */
  private setupAPIRoutes(): void {
    const apiRouter = express.Router();

    // Get all dumps with optional filtering
    apiRouter.get('/dumps', (req: Request, res: Response) => {
      try {
        if (!this.apiEndpoints) {
          return res.status(503).json({ error: 'API endpoints not configured' });
        }

        const filter: DumpFilter = {};
        
        // Parse query parameters for filtering
        if (req.query.category && req.query.category !== 'all') {
          filter.category = req.query.category as any;
        }
        if (req.query.search) {
          filter.searchTerm = req.query.search as string;
        }
        if (req.query.file) {
          filter.sourceFile = req.query.file as string;
        }
        if (req.query.from) {
          filter.dateFrom = new Date(req.query.from as string);
        }
        if (req.query.to) {
          filter.dateTo = new Date(req.query.to as string);
        }

        const dumps = this.apiEndpoints.getDumps(filter);
        res.json({
          dumps,
          total: dumps.length,
          filter
        });

      } catch (error) {

        res.status(500).json({ error: 'Failed to get dumps' });
      }
    });

    // Get specific dump by ID
    apiRouter.get('/dumps/:id', (req: Request, res: Response) => {
      try {
        if (!this.apiEndpoints) {
          return res.status(503).json({ error: 'API endpoints not configured' });
        }

        const dump = this.apiEndpoints.getDumpById(req.params.id);
        if (!dump) {
          return res.status(404).json({ error: 'Dump not found' });
        }

        res.json(dump);

      } catch (error) {

        res.status(500).json({ error: 'Failed to get dump' });
      }
    });

    // Clear all dumps
    apiRouter.delete('/dumps', (req: Request, res: Response) => {
      try {
        if (!this.apiEndpoints) {
          return res.status(503).json({ error: 'API endpoints not configured' });
        }

        this.apiEndpoints.clearDumps();
        res.json({ message: 'All dumps cleared' });

      } catch (error) {

        res.status(500).json({ error: 'Failed to clear dumps' });
      }
    });

    // Export dumps
    apiRouter.get('/export', (req: Request, res: Response) => {
      try {
        if (!this.apiEndpoints) {
          return res.status(503).json({ error: 'API endpoints not configured' });
        }

        const filter: DumpFilter = {};
        if (req.query.category && req.query.category !== 'all') {
          filter.category = req.query.category as any;
        }

        const exportData = this.apiEndpoints.exportDumps(filter);
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="dumps-${Date.now()}.json"`);
        res.send(exportData);

      } catch (error) {

        res.status(500).json({ error: 'Failed to export dumps' });
      }
    });

    // Get server status
    apiRouter.get('/status', (req: Request, res: Response) => {
      try {
        if (!this.apiEndpoints) {
          return res.status(503).json({ error: 'API endpoints not configured' });
        }

        const status = this.apiEndpoints.getServerStatus();
        res.json(status);

      } catch (error) {

        res.status(500).json({ error: 'Failed to get server status' });
      }
    });

    // Get server statistics
    apiRouter.get('/stats', (req: Request, res: Response) => {
      try {
        res.json({
          server: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            platform: process.platform,
            nodeVersion: process.version
          },
          timestamp: new Date().toISOString()
        });

      } catch (error) {

        res.status(500).json({ error: 'Failed to get server stats' });
      }
    });

    // Mount API router
    this.app.use('/api', apiRouter);
  }

  /**
   * Add custom middleware
   */
  addMiddleware(middleware: (req: Request, res: Response, next: NextFunction) => void): void {
    this.app.use(middleware);
  }

  /**
   * Add custom route
   */
  addRoute(method: 'get' | 'post' | 'put' | 'delete', path: string, handler: (req: Request, res: Response) => void): void {
    this.app[method](path, handler);
  }

  /**
   * Get Express app instance
   */
  getApp(): Express {
    return this.app;
  }

  /**
   * Initialize Symfony VarDumper assets
   */
  private async initializeSymfonyAssets(): Promise<void> {
    try {
      const initialized = await this.symfonyAssetManager.initialize();
      
      if (initialized) {
        // Set up asset serving routes
        this.symfonyAssetManager.serveAssets(this.app, {
          enableCaching: true,
          maxAge: 3600, // 1 hour cache
          enableGzip: true
        });
        
        // Symfony VarDumper assets initialized and served
      } else {

      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to initialize Symfony assets:'), error);
      
    }
  }

  /**
   * Get Symfony asset manager instance
   */
  getSymfonyAssetManager(): SymfonyAssetManager {
    return this.symfonyAssetManager;
  }

  /**
   * Get server statistics
   */
  getStats() {
    return {
      isRunning: this.isRunning,
      port: this.options.port,
      staticPath: this.options.staticPath,
      corsEnabled: this.options.enableCors,
      uptime: this.isRunning ? process.uptime() : 0,
      symfonyAssets: this.symfonyAssetManager.getStats()
    };
  }
}