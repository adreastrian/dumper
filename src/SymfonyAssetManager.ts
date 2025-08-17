/**
 * Symfony Asset Manager - Manages Symfony VarDumper CSS and JavaScript assets
 */

import { Express } from 'express';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import chalk from 'chalk';
import { Logger } from './utils/Logger';

export interface SymfonyAssetPaths {
  css: string | null;
  js: string | null;
  resourcesDir: string | null;
}

export interface AssetServeOptions {
  enableCaching: boolean;
  maxAge: number; // in seconds
  enableGzip: boolean;
}

export class SymfonyAssetManager {
  private assetPaths: SymfonyAssetPaths;
  private isInitialized = false;
  private readonly defaultOptions: AssetServeOptions = {
    enableCaching: true,
    maxAge: 3600, // 1 hour
    enableGzip: true
  };

  constructor() {
    this.assetPaths = {
      css: null,
      js: null,
      resourcesDir: null
    };
  }

  /**
   * Initialize the asset manager by discovering Symfony VarDumper assets
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    // Discovering Symfony VarDumper assets

    try {
      this.assetPaths = await this.discoverAssets();
      
      if (this.assetPaths.css && this.assetPaths.js) {
        // Symfony VarDumper assets found
        this.isInitialized = true;
        return true;
      } else {


        return false;
      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to discover Symfony VarDumper assets:'), error);
      
      return false;
    }
  }

  /**
   * Discover Symfony VarDumper asset paths in common locations
   */
  private async discoverAssets(): Promise<SymfonyAssetPaths> {
    const searchPaths = this.getSearchPaths();
    
    for (const basePath of searchPaths) {
      const resourcesDir = join(basePath, 'symfony', 'var-dumper', 'Resources');
      
      if (existsSync(resourcesDir)) {
        const cssPath = join(resourcesDir, 'css', 'htmlDescriptor.css');
        const jsPath = join(resourcesDir, 'js', 'htmlDescriptor.js');
        
        const cssExists = existsSync(cssPath);
        const jsExists = existsSync(jsPath);

        return {
          css: cssExists ? cssPath : null,
          js: jsExists ? jsPath : null,
          resourcesDir: resourcesDir
        };
      }
    }

    return { css: null, js: null, resourcesDir: null };
  }

  /**
   * Get common search paths for Symfony VarDumper installation
   */
  private getSearchPaths(): string[] {
    const cwd = process.cwd();
    
    return [
      // Current project vendor directory
      join(cwd, 'vendor'),
      
      // Parent directories (for nested projects)
      join(cwd, '..', 'vendor'),
      join(cwd, '..', '..', 'vendor'),
      join(cwd, '..', '..', '..', 'vendor'),
      
      // Dump viewer specific paths
      join(cwd, 'dump-viewer', 'vendor'),
      join(cwd, 'dump-viewer', '..', 'vendor'),
      
      // Global Composer installation
      join(process.env.HOME || '', '.composer', 'vendor'),
      join(process.env.HOME || '', '.config', 'composer', 'vendor'),
      
      // System-wide installations
      '/usr/local/lib/composer/vendor',
      '/usr/share/composer/vendor'
    ];
  }

  /**
   * Set up Express middleware to serve Symfony VarDumper assets
   */
  serveAssets(app: Express, options: Partial<AssetServeOptions> = {}): void {
    if (!this.isInitialized || !this.assetPaths.css || !this.assetPaths.js) {
      
      return;
    }

    const opts = { ...this.defaultOptions, ...options };

    // Setting up Symfony VarDumper asset serving

    // Serve CSS file
    app.get('/symfony-dump/css/htmlDescriptor.css', (req, res) => {
      this.serveAssetFile(res, this.assetPaths.css!, 'text/css', opts);
    });

    // Serve JavaScript file
    app.get('/symfony-dump/js/htmlDescriptor.js', (req, res) => {
      this.serveAssetFile(res, this.assetPaths.js!, 'application/javascript', opts);
    });

    // Health check endpoint for assets
    app.get('/symfony-dump/health', (req, res) => {
      res.json({
        status: 'ok',
        assetsAvailable: this.areAssetsAvailable(),
        paths: {
          css: this.assetPaths.css ? '/symfony-dump/css/htmlDescriptor.css' : null,
          js: this.assetPaths.js ? '/symfony-dump/js/htmlDescriptor.js' : null
        }
      });
    });

    // Symfony VarDumper assets available
  }

  /**
   * Serve an individual asset file with proper headers
   */
  private serveAssetFile(res: any, filePath: string, contentType: string, options: AssetServeOptions): void {
    try {
      // Validate file path to prevent directory traversal
      const resolvedPath = resolve(filePath);
      if (!resolvedPath.includes('symfony/var-dumper/Resources')) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      if (!existsSync(resolvedPath)) {
        res.status(404).json({ error: 'Asset not found' });
        return;
      }

      const content = readFileSync(resolvedPath, 'utf8');
      
      // Set content type
      res.setHeader('Content-Type', contentType);
      
      // Set caching headers if enabled
      if (options.enableCaching) {
        res.setHeader('Cache-Control', `public, max-age=${options.maxAge}`);
        res.setHeader('ETag', this.generateETag(content));
      }

      // Set security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      
      // Note: Gzip compression is typically handled by Express middleware or reverse proxy

      res.send(content);
      
    } catch (error) {
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Generate ETag for content caching
   */
  private generateETag(content: string): string {
    const crypto = require('crypto');
    return `"${crypto.createHash('md5').update(content).digest('hex')}"`;
  }

  /**
   * Check if Symfony VarDumper assets are available
   */
  areAssetsAvailable(): boolean {
    return this.isInitialized && 
           this.assetPaths.css !== null && 
           this.assetPaths.js !== null &&
           existsSync(this.assetPaths.css) && 
           existsSync(this.assetPaths.js);
  }

  /**
   * Get the CSS file path
   */
  getCssPath(): string | null {
    return this.assetPaths.css;
  }

  /**
   * Get the JavaScript file path
   */
  getJsPath(): string | null {
    return this.assetPaths.js;
  }

  /**
   * Get the CSS content for inline inclusion
   */
  getCssContent(): string | null {
    if (!this.assetPaths.css || !existsSync(this.assetPaths.css)) {
      return null;
    }

    try {
      return readFileSync(this.assetPaths.css, 'utf8');
    } catch (error) {
      
      return null;
    }
  }

  /**
   * Get the JavaScript content for inline inclusion
   */
  getJsContent(): string | null {
    if (!this.assetPaths.js || !existsSync(this.assetPaths.js)) {
      return null;
    }

    try {
      return readFileSync(this.assetPaths.js, 'utf8');
    } catch (error) {
      
      return null;
    }
  }

  /**
   * Get URLs for the served assets
   */
  getAssetUrls(): { css: string | null; js: string | null } {
    if (!this.areAssetsAvailable()) {
      return { css: null, js: null };
    }

    return {
      css: '/symfony-dump/css/htmlDescriptor.css',
      js: '/symfony-dump/js/htmlDescriptor.js'
    };
  }

  /**
   * Get asset manager statistics
   */
  getStats() {
    return {
      initialized: this.isInitialized,
      assetsAvailable: this.areAssetsAvailable(),
      paths: this.assetPaths,
      searchPaths: this.getSearchPaths()
    };
  }

  /**
   * Reset the asset manager (useful for testing)
   */
  reset(): void {
    this.isInitialized = false;
    this.assetPaths = {
      css: null,
      js: null,
      resourcesDir: null
    };
  }
}