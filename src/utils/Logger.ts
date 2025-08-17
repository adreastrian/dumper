/**
 * Simple logging utility for development and debugging
 */

import chalk from 'chalk';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private static level: LogLevel = LogLevel.INFO;

  static setLevel(level: LogLevel): void {
    Logger.level = level;
  }

  static debug(message: string, ...args: any[]): void {
    if (Logger.level <= LogLevel.DEBUG) {
      console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
    }
  }

  static info(message: string, ...args: any[]): void {
    if (Logger.level <= LogLevel.INFO) {
      console.log(chalk.blue(`[INFO] ${message}`), ...args);
    }
  }

  static warn(message: string, ...args: any[]): void {
    if (Logger.level <= LogLevel.WARN) {
      console.log(chalk.yellow(`[WARN] ${message}`), ...args);
    }
  }

  static error(message: string, ...args: any[]): void {
    if (Logger.level <= LogLevel.ERROR) {
      console.error(chalk.red(`[ERROR] ${message}`), ...args);
    }
  }

  static dump(label: string, data: any): void {
    if (Logger.level <= LogLevel.DEBUG) {
      console.log(chalk.magenta(`[DUMP] ${label}:`));
      console.log(JSON.stringify(data, null, 2));
    }
  }
}