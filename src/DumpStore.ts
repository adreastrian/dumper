/**
 * Dump Store - Manages storage and filtering of dump data
 */

import { DumpData, DumpCategory } from './types';
import { Logger } from './utils/Logger';

export interface DumpFilter {
  category?: DumpCategory | 'all';
  searchTerm?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sourceFile?: string;
}

export interface DumpStats {
  total: number;
  byCategory: Record<DumpCategory, number>;
  totalSize: number;
  oldestDump?: Date;
  newestDump?: Date;
}

export class DumpStore {
  private dumps: DumpData[] = [];
  private maxDumps: number;

  constructor(maxDumps: number = 1000) {
    this.maxDumps = maxDumps;
  }

  /**
   * Add a new dump to the store
   */
  addDump(dump: DumpData): void {
    this.dumps.push(dump);
    
    // Maintain size limit
    if (this.dumps.length > this.maxDumps) {
      const removed = this.dumps.splice(0, this.dumps.length - this.maxDumps);
      
    }

    
  }

  /**
   * Get all dumps
   */
  getAllDumps(): DumpData[] {
    return [...this.dumps];
  }

  /**
   * Get filtered dumps
   */
  getFilteredDumps(filter: DumpFilter = {}): DumpData[] {
    let filtered = [...this.dumps];

    // Filter by category
    if (filter.category && filter.category !== 'all') {
      filtered = filtered.filter(dump => dump.category === filter.category);
    }

    // Filter by search term
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(dump => 
        dump.content.toLowerCase().includes(searchLower) ||
        dump.source.file.toLowerCase().includes(searchLower) ||
        (dump.source.function && dump.source.function.toLowerCase().includes(searchLower)) ||
        (dump.source.class && dump.source.class.toLowerCase().includes(searchLower))
      );
    }

    // Filter by date range
    if (filter.dateFrom) {
      filtered = filtered.filter(dump => dump.timestamp >= filter.dateFrom!);
    }
    if (filter.dateTo) {
      filtered = filtered.filter(dump => dump.timestamp <= filter.dateTo!);
    }

    // Filter by source file
    if (filter.sourceFile) {
      filtered = filtered.filter(dump => 
        dump.source.file.includes(filter.sourceFile!)
      );
    }

    return filtered;
  }

  /**
   * Get dump by ID
   */
  getDumpById(id: string): DumpData | undefined {
    return this.dumps.find(dump => dump.id === id);
  }

  /**
   * Get recent dumps (last N dumps)
   */
  getRecentDumps(count: number = 10): DumpData[] {
    return this.dumps.slice(-count);
  }

  /**
   * Clear all dumps
   */
  clearDumps(): void {
    const count = this.dumps.length;
    this.dumps = [];
    // Logger.info(`Cleared ${count} dumps from store`);
  }

  /**
   * Remove dumps older than specified date
   */
  removeOldDumps(olderThan: Date): number {
    const initialCount = this.dumps.length;
    this.dumps = this.dumps.filter(dump => dump.timestamp > olderThan);
    const removedCount = initialCount - this.dumps.length;
    
    if (removedCount > 0) {
      // Logger.info(`Removed ${removedCount} old dumps`);
    }
    
    return removedCount;
  }

  /**
   * Get dump statistics
   */
  getStats(): DumpStats {
    const byCategory: Record<DumpCategory, number> = {
      [DumpCategory.DUMP]: 0,
      [DumpCategory.QUERY]: 0,
      [DumpCategory.LOG]: 0,
      [DumpCategory.REQUEST]: 0,
      [DumpCategory.VIEW]: 0,
      [DumpCategory.JOB]: 0
    };

    let totalSize = 0;
    let oldestDump: Date | undefined;
    let newestDump: Date | undefined;

    for (const dump of this.dumps) {
      byCategory[dump.category]++;
      totalSize += dump.content.length;
      
      if (!oldestDump || dump.timestamp < oldestDump) {
        oldestDump = dump.timestamp;
      }
      if (!newestDump || dump.timestamp > newestDump) {
        newestDump = dump.timestamp;
      }
    }

    return {
      total: this.dumps.length,
      byCategory,
      totalSize,
      oldestDump,
      newestDump
    };
  }

  /**
   * Get dumps grouped by category
   */
  getDumpsByCategory(): Record<DumpCategory, DumpData[]> {
    const grouped: Record<DumpCategory, DumpData[]> = {
      [DumpCategory.DUMP]: [],
      [DumpCategory.QUERY]: [],
      [DumpCategory.LOG]: [],
      [DumpCategory.REQUEST]: [],
      [DumpCategory.VIEW]: [],
      [DumpCategory.JOB]: []
    };

    for (const dump of this.dumps) {
      grouped[dump.category].push(dump);
    }

    return grouped;
  }

  /**
   * Get dumps from specific source file
   */
  getDumpsByFile(filename: string): DumpData[] {
    return this.dumps.filter(dump => 
      dump.source.file.includes(filename)
    );
  }

  /**
   * Get unique source files
   */
  getUniqueSourceFiles(): string[] {
    const files = new Set<string>();
    for (const dump of this.dumps) {
      files.add(dump.source.file);
    }
    return Array.from(files).sort();
  }

  /**
   * Export dumps as JSON
   */
  exportDumps(filter?: DumpFilter): string {
    const dumps = filter ? this.getFilteredDumps(filter) : this.dumps;
    return JSON.stringify(dumps, null, 2);
  }

  /**
   * Import dumps from JSON
   */
  importDumps(jsonData: string): number {
    try {
      const importedDumps: DumpData[] = JSON.parse(jsonData);
      let importedCount = 0;

      for (const dump of importedDumps) {
        // Validate dump structure
        if (this.isValidDump(dump)) {
          this.addDump(dump);
          importedCount++;
        }
      }

      // Logger.info(`Imported ${importedCount} dumps`);
      return importedCount;

    } catch (error) {
      
      throw new Error('Invalid JSON format');
    }
  }

  /**
   * Validate dump structure
   */
  private isValidDump(dump: any): dump is DumpData {
    return (
      dump &&
      typeof dump.id === 'string' &&
      dump.timestamp &&
      dump.source &&
      typeof dump.source.file === 'string' &&
      typeof dump.source.line === 'number' &&
      dump.category &&
      typeof dump.content === 'string'
    );
  }

  /**
   * Get memory usage information
   */
  getMemoryUsage(): { dumps: number; totalSize: number; averageSize: number } {
    const stats = this.getStats();
    return {
      dumps: stats.total,
      totalSize: stats.totalSize,
      averageSize: stats.total > 0 ? Math.round(stats.totalSize / stats.total) : 0
    };
  }
}