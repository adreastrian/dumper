#!/usr/bin/env node

/**
 * Symfony Dump Viewer - Main Entry Point
 * A beautiful debugging tool for PHP applications
 */

import { program } from 'commander';
import chalk from 'chalk';
import { DumpViewer } from './DumpViewer';

program
  .name('symfony-dump-viewer')
  .description('Beautiful PHP debugging tool with Laravel Herd-style interface')
  .version('1.0.0')
  .option('-p, --port <port>', 'Port for the web interface', '3000')
  .option('-d, --dump-port <port>', 'Port for the Symfony dump server', '9912')
  .option('--no-open', 'Don\'t automatically open browser')
  .action(async (options) => {
    
    const viewer = new DumpViewer({
      webPort: parseInt(options.port),
      dumpPort: parseInt(options.dumpPort),
      autoOpen: options.open
    });

    try {
      await viewer.start();

      
    } catch (error) {
      console.error(chalk.red('❌ Failed to start:'), error);
      process.exit(1);
    }
  });

program.parse();