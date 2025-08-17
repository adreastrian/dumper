/**
 * HTML Dump Processor - Processes and enhances Symfony's HTML dump output
 */

import { DumpData, DumpCategory } from './types';
import chalk from 'chalk';

export interface ProcessedDump {
  id: string;
  timestamp: Date;
  source: {
    file: string;
    line: number;
    function?: string;
    class?: string;
  };
  category: DumpCategory;
  content: string;
  metadata: DumpMetadata;
  rawData?: string;
}

export interface DumpMetadata {
  size: number;
  hasExpandableContent: boolean;
  dataType: string;
  sourceContext?: string;
  executionTime?: number;
}

export class HTMLDumpProcessor {
  private static readonly SYMFONY_DUMP_CLASS = 'sf-dump';
  private static readonly EXPANDABLE_SELECTORS = [
    '.sf-dump-toggle',
    '.sf-dump-expanded',
    '.sf-dump-compact'
  ];

  /**
   * Process raw HTML dump content from Symfony
   */
  static processDump(rawHtml: string, sourceInfo?: any): ProcessedDump {
    try {
      const metadata = this.extractMetadata(rawHtml, sourceInfo);
      const sanitizedHtml = this.sanitizeHtml(rawHtml);
      const enhancedHtml = this.enhanceHtml(sanitizedHtml);
      
      return {
        id: this.generateId(),
        timestamp: new Date(),
        source: this.extractSourceInfo(rawHtml, sourceInfo),
        category: this.determineDumpCategory(rawHtml, sourceInfo),
        content: enhancedHtml,
        metadata,
        rawData: rawHtml
      };

    } catch (error) {
      return this.createFallbackDump(rawHtml, sourceInfo);
    }
  }

  /**
   * Extract metadata from HTML dump content
   */
  private static extractMetadata(html: string, sourceInfo?: any): DumpMetadata {
    const size = html.length;
    const hasExpandableContent = this.hasExpandableContent(html);
    const dataType = this.extractDataType(html);
    
    return {
      size,
      hasExpandableContent,
      dataType,
      sourceContext: this.extractSourceContext(html, sourceInfo),
      executionTime: this.extractExecutionTime(sourceInfo)
    };
  }

  /**
   * Sanitize HTML content for safe browser display
   */
  private static sanitizeHtml(html: string): string {
    // Preserve original Symfony VarDumper markup (including inline scripts)
    // so that built-in toggle behavior works as expected.
    return html;
  }

  /**
   * Enhance HTML with additional features for better display
   */
  private static enhanceHtml(html: string): string {
    const cleanedHtml = html.replace(/<!-- SOURCE_INFO:[^-]*-->/g, '');
    return cleanedHtml;
  }

  /**
   * Add copy-to-clipboard buttons
   */
  private static addCopyButtons(html: string): string {
    // Add copy button to the main dump container
    return html.replace(
      /(<div[^>]*class="[^"]*sf-dump[^"]*"[^>]*>)/,
      '$1<button class="dump-copy-btn" title="Copy to clipboard" data-copy-target="dump">📋</button>'
    );
  }

  /**
   * Enhance expandable sections with better controls
   */
  private static enhanceExpandableSections(html: string): string {
    let enhanced = html;

    // Add expand/collapse all buttons for complex dumps
    if (this.hasExpandableContent(html)) {
      enhanced = enhanced.replace(
        /(<div[^>]*class="[^"]*sf-dump[^"]*"[^>]*>)/,
        '$1<div class="dump-controls"><button class="dump-expand-all">Expand All</button><button class="dump-collapse-all">Collapse All</button></div>'
      );
    }

    // Enhance toggle buttons
    enhanced = enhanced.replace(
      /(<span[^>]*class="[^"]*sf-dump-toggle[^"]*"[^>]*>)/g,
      '$1<span class="toggle-indicator">▶</span>'
    );

    return enhanced;
  }

  /**
   * Add line numbers to code sections
   */
  private static addLineNumbers(html: string): string {
    // Add line numbers to code blocks if they don't already have them
    return html.replace(
      /(<pre[^>]*class="[^"]*sf-dump[^"]*"[^>]*>)(.*?)(<\/pre>)/gs,
      (match, openTag, content, closeTag) => {
        if (content.includes('\n')) {
          const lines = content.split('\n');
          const numberedLines = lines.map((line: string, index: number) => 
            `<span class="line-number">${index + 1}</span>${line}`
          ).join('\n');
          return `${openTag}${numberedLines}${closeTag}`;
        }
        return match;
      }
    );
  }

  /**
   * Enhance syntax highlighting
   */
  private static enhanceSyntaxHighlighting(html: string): string {
    let enhanced = html;

    // Add additional classes for better styling
    enhanced = enhanced
      .replace(/class="sf-dump-str"/g, 'class="sf-dump-str dump-string"')
      .replace(/class="sf-dump-num"/g, 'class="sf-dump-num dump-number"')
      .replace(/class="sf-dump-const"/g, 'class="sf-dump-const dump-constant"')
      .replace(/class="sf-dump-key"/g, 'class="sf-dump-key dump-key"')
      .replace(/class="sf-dump-public"/g, 'class="sf-dump-public dump-public"')
      .replace(/class="sf-dump-protected"/g, 'class="sf-dump-protected dump-protected"')
      .replace(/class="sf-dump-private"/g, 'class="sf-dump-private dump-private"');

    return enhanced;
  }

  /**
   * Check if HTML contains expandable content
   */
  private static hasExpandableContent(html: string): boolean {
    return this.EXPANDABLE_SELECTORS.some(selector => 
      html.includes(selector.replace('.', ''))
    );
  }

  /**
   * Extract data type from HTML content
   */
  private static extractDataType(html: string): string {
    // Try to determine the data type from Symfony's classes
    if (html.includes('sf-dump-str')) return 'string';
    if (html.includes('sf-dump-num')) return 'number';
    if (html.includes('sf-dump-const')) return 'constant';
    if (html.includes('sf-dump-array')) return 'array';
    if (html.includes('sf-dump-object')) return 'object';
    if (html.includes('sf-dump-resource')) return 'resource';
    
    // Fallback to analyzing content
    if (html.includes('{') && html.includes('}')) return 'object';
    if (html.includes('[') && html.includes(']')) return 'array';
    if (html.includes('"') || html.includes("'")) return 'string';
    if (/\d+/.test(html)) return 'number';
    
    return 'mixed';
  }

  /**
   * Extract source information from HTML and context
   */
  private static extractSourceInfo(html: string, sourceInfo?: any): {
    file: string;
    line: number;
    function?: string;
    class?: string;
  } {
    if (sourceInfo) {
      return {
        file: sourceInfo.file || 'unknown',
        line: sourceInfo.line || 0,
        function: sourceInfo.function,
        class: sourceInfo.class
      };
    }

    const sourceMatch = html.match(/<!-- SOURCE_INFO:\s*([^>]+?)\s*-->/);
    
    if (sourceMatch) {
      const sourceText = sourceMatch[1].trim();
      const parseMatch = sourceText.match(/^(.+?)\s+on\s+line\s+(\d+)$/);
      
      if (parseMatch) {
        return {
          file: parseMatch[1],
          line: parseInt(parseMatch[2]),
          function: undefined,
          class: undefined
        };
      }
    }

    const fileMatch = html.match(/data-file="([^"]+)"/);
    const lineMatch = html.match(/data-line="(\d+)"/);
    const functionMatch = html.match(/data-function="([^"]+)"/);
    const classMatch = html.match(/data-class="([^"]+)"/);

    return {
      file: fileMatch ? fileMatch[1] : 'unknown',
      line: lineMatch ? parseInt(lineMatch[1]) : 0,
      function: functionMatch ? functionMatch[1] : undefined,
      class: classMatch ? classMatch[1] : undefined
    };
  }

  /**
   * Determine dump category based on content and context
   */
  private static determineDumpCategory(html: string, sourceInfo?: any): DumpCategory {
    const content = html.toLowerCase();
    const source = sourceInfo ? JSON.stringify(sourceInfo).toLowerCase() : '';
    const combined = content + ' ' + source;

    return DumpCategory.DUMP;

    // Check for SQL/database related content
    if (combined.includes('select ') || combined.includes('insert ') || 
        combined.includes('update ') || combined.includes('delete ') ||
        combined.includes('query') || combined.includes('sql')) {
      return DumpCategory.QUERY;
    }

    // Check for HTTP/request related content
    if (combined.includes('request') || combined.includes('response') ||
        combined.includes('http') || combined.includes('$_get') ||
        combined.includes('$_post') || combined.includes('headers')) {
      return DumpCategory.REQUEST;
    }

    // Check for job/queue related content
    if (combined.includes('job') || combined.includes('queue') ||
        combined.includes('dispatch') || combined.includes('worker')) {
      return DumpCategory.JOB;
    }

    // Check for view/template related content
    if (combined.includes('view') || combined.includes('template') ||
        combined.includes('blade') || combined.includes('twig')) {
      return DumpCategory.VIEW;
    }

    // Check for log/error related content
    if (combined.includes('log') || combined.includes('error') ||
        combined.includes('exception') || combined.includes('warning')) {
      return DumpCategory.LOG;
    }

    return DumpCategory.DUMP;
  }

  /**
   * Extract source context (surrounding code)
   */
  private static extractSourceContext(html: string, sourceInfo?: any): string | undefined {
    // This could be enhanced to show surrounding code lines
    // For now, just return the function/class context if available
    if (sourceInfo?.class && sourceInfo?.function) {
      return `${sourceInfo.class}::${sourceInfo.function}()`;
    }
    if (sourceInfo?.function) {
      return `${sourceInfo.function}()`;
    }
    return undefined;
  }

  /**
   * Extract execution time if available
   */
  private static extractExecutionTime(sourceInfo?: any): number | undefined {
    return sourceInfo?.executionTime || undefined;
  }

  /**
   * Generate unique ID for dump
   */
  private static generateId(): string {
    return `dump_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create fallback dump when processing fails
   */
  private static createFallbackDump(rawHtml: string, sourceInfo?: any): ProcessedDump {
    return {
      id: this.generateId(),
      timestamp: new Date(),
      source: {
        file: sourceInfo?.file || 'unknown',
        line: sourceInfo?.line || 0,
        function: sourceInfo?.function,
        class: sourceInfo?.class
      },
      category: DumpCategory.DUMP,
      content: `<div class="sf-dump sf-dump-fallback"><pre>${this.escapeHtml(rawHtml)}</pre></div>`,
      metadata: {
        size: rawHtml.length,
        hasExpandableContent: false,
        dataType: 'unknown'
      },
      rawData: rawHtml
    };
  }

  /**
   * Escape HTML for safe display
   */
  private static escapeHtml(html: string): string {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Get processing statistics
   */
  static getStats() {
    return {
      processedDumps: 0, // This could be tracked if needed
      failedProcessing: 0,
      averageProcessingTime: 0
    };
  }
}