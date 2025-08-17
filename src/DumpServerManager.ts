/**
 * Dump Server Manager - Handles Symfony dump server lifecycle
 */

import { spawn, ChildProcess } from "child_process";
import { EventEmitter } from "events";
import { existsSync } from "fs";
import { join } from "path";
import { createServer } from "net";
import chalk from "chalk";
import { TempFileManager } from "./utils/TempFileManager";

export interface DumpServerOptions {
  port: number;
  host?: string;
}

export class DumpServerManager extends EventEmitter {
  private process: ChildProcess | null = null;
  private options: DumpServerOptions;
  private isRunning = false;
  private tempFileManager: TempFileManager;

  constructor(options: DumpServerOptions) {
    super();
    this.options = {
      host: "127.0.0.1",
      ...options,
    };
    this.tempFileManager = new TempFileManager();
  }

  /**
   * Check if required dependencies are available
   */
  async checkDependencies(): Promise<{
    composer: boolean;
    varDumper: boolean;
  }> {
    const composerAvailable = await this.checkComposer();
    const varDumperAvailable = await this.checkVarDumper();

    return {
      composer: composerAvailable,
      varDumper: varDumperAvailable,
    };
  }

  /**
   * Install Symfony VarDumper if not available
   */
  async installDependencies(): Promise<void> {
    const deps = await this.checkDependencies();

    if (!deps.composer) {
      throw new Error(
        "Composer is required but not found. Please install Composer first."
      );
    }

    if (!deps.varDumper) {
      await this.installVarDumper();
    }
  }

  /**
   * Check if a port is available
   */
  private async isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = createServer();

      server.listen(port, () => {
        server.close(() => {
          resolve(true);
        });
      });

      server.on("error", () => {
        resolve(false);
      });
    });
  }

  /**
   * Find an available port starting from the preferred port
   */
  private async findAvailablePort(startPort: number): Promise<number> {
    for (let port = startPort; port <= startPort + 10; port++) {
      if (await this.isPortAvailable(port)) {
        return port;
      }
    }
    throw new Error(
      `No available ports found in range ${startPort}-${startPort + 10}`
    );
  }

  /**
   * Kill any existing dump server processes on the port
   */
  private async killExistingProcesses(): Promise<void> {
    try {
      // Try to kill any existing var-dump-server processes
      const killProcess = spawn("pkill", ["-f", "var-dump-server"], {
        stdio: "pipe",
      });
      await new Promise((resolve) => {
        killProcess.on("close", () => resolve(undefined));
        killProcess.on("error", () => resolve(undefined));
      });

      // Wait a moment for processes to die
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      // Ignore errors - process might not exist
    }
  }

  /**
   * Start the Symfony dump server
   */
  async startServer(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    try {
      await this.installDependencies();

      const vendorPath = process.env.PHP_VENDOR_PATH || "./vendor";
      const dumpServerPath = join(vendorPath, "bin/var-dump-server");

      // Verify vendor directory exists
      if (!existsSync(vendorPath)) {
        throw new Error(`Vendor directory not found at: ${vendorPath}. Please ensure Symfony VarDumper is installed or set PHP_VENDOR_PATH environment variable.`);
      }

      // Verify var-dump-server exists
      if (!existsSync(dumpServerPath)) {
        throw new Error(`Symfony var-dump-server not found at: ${dumpServerPath}. Please ensure Symfony VarDumper is installed.`);
      }

      // Kill any existing dump server processes first
      await this.killExistingProcesses();

      // Check if port is available, find alternative if needed
      const availablePort = await this.findAvailablePort(this.options.port);
      if (availablePort !== this.options.port) {

        this.options.port = availablePort;
      }

      // Create a temporary PHP script to run the dump server
      const serverScript = this.tempFileManager.createDumpServerScript(
        this.options.host!,
        this.options.port
      );

      this.process = spawn("php", [serverScript], {
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env },
        }
      );

      this.setupProcessHandlers();
      this.isRunning = true;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(chalk.red("❌ Failed to start dump server:"), error);
      throw error;
    }
  }

  /**
   * Stop the dump server
   */
  async stopServer(): Promise<void> {
    if (!this.process || !this.isRunning) {
      return;
    }

    return new Promise((resolve) => {
      if (this.process) {
        this.process.on("exit", () => {
          this.isRunning = false;
          this.process = null;
          this.tempFileManager.cleanup();
          resolve();
        });

        this.process.kill("SIGTERM");

        setTimeout(() => {
          if (this.process && this.isRunning) {
            this.process.kill("SIGKILL");
          }
        }, 5000);
      } else {
        resolve();
      }
    });
  }

  /**
   * Check if the server is running
   */
  isServerRunning(): boolean {
    return this.isRunning && this.process !== null;
  }

  /**
   * Get the server port
   */
  getServerPort(): number {
    return this.options.port;
  }

  /**
   * Get the PHP helper file path for easy integration
   */
  getPhpHelperPath(): string {
    return this.tempFileManager.getPhpHelperPath(this.options.port);
  }

  /**
   * Monitor server health and restart if needed
   */
  startHealthMonitoring(): void {
    setInterval(() => {
      if (this.isRunning && this.process && this.process.killed) {
        this.restartServer();
      }
    }, 5000);
  }

  private async checkComposer(): Promise<boolean> {
    return new Promise((resolve) => {
      const composer = spawn("composer", ["--version"], { stdio: "pipe" });
      composer.on("close", (code) => {
        resolve(code === 0);
      });
      composer.on("error", () => {
        resolve(false);
      });
    });
  }

  private async checkVarDumper(): Promise<boolean> {
    // Check if symfony/var-dumper is available globally or in common locations
    const commonPaths = [
      join(process.cwd(), "vendor/symfony/var-dumper"),
      join(process.env.HOME || "", ".composer/vendor/symfony/var-dumper"),
      "/usr/local/lib/composer/vendor/symfony/var-dumper",
    ];

    for (const path of commonPaths) {
      if (existsSync(path)) {
        return true;
      }
    }

    // Try to run a simple PHP script to check if VarDumper is available
    return new Promise((resolve) => {
      const testScript = `<?php
try {
  if (class_exists('Symfony\\Component\\VarDumper\\VarDumper')) {
    echo 'available';
  } else {
    echo 'not_available';
  }
} catch (Exception $e) {
  echo 'not_available';
}`;

      const php = spawn("php", ["-r", testScript], { stdio: "pipe" });
      let output = "";

      php.stdout.on("data", (data) => {
        output += data.toString();
      });

      php.on("close", () => {
        resolve(output.trim() === "available");
      });

      php.on("error", () => {
        resolve(false);
      });
    });
  }

  private async installVarDumper(): Promise<void> {
    return new Promise((resolve, reject) => {
      const install = spawn(
        "composer",
        ["global", "require", "symfony/var-dumper"],
        {
          stdio: ["pipe", "pipe", "pipe"],
        }
      );

      install.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(
              `Failed to install Symfony VarDumper (exit code: ${code})`
            )
          );
        }
      });

      install.on("error", (error) => {
        reject(error);
      });
    });
  }

  private setupProcessHandlers(): void {
    if (!this.process) return;

    let buffer = '';
    this.process.stdout?.on("data", (data) => {
      const chunk = data.toString();
      buffer += chunk;
      const SEP = '<!-- __DUMP_SEPARATOR__ -->';
      for (;;) {
        const idx = buffer.indexOf(SEP);
        if (idx === -1) break;
        const html = buffer.slice(0, idx);
        buffer = buffer.slice(idx + SEP.length);
        if (html.trim()) {
          this.emit('dumpHtml', html);
        }
      }
    });

    this.process.stderr?.on("data", (data) => {
      // Log stderr but don't emit as error (might be PHP notices)
      const message = data.toString().trim();
      if (
        message &&
        !message.includes("PHP Notice") &&
        !message.includes("PHP Warning")
      ) {
        console.warn(chalk.yellow("Dump server stderr:"), message);
      }
    });

    this.process.on("exit", (code, signal) => {
      this.isRunning = false;
    });

    this.process.on("error", (error) => {
      this.isRunning = false;
      this.emit("error", error);
    });
  }

  private async restartServer(): Promise<void> {
    await this.stopServer();
    setTimeout(() => {
      this.startServer().catch(console.error);
    }, 2000);
  }
}
