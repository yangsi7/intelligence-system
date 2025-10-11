#!/usr/bin/env node

/**
 * output-formatter.js - Format intelligence outputs for agents
 * Creates deep trees, JSON sidecars, and markdown reports
 */

import { pathToFileURL } from 'node:url';

class OutputFormatter {
  constructor() {
    this.indentChar = '  ';
    this.treeChars = {
      branch: '├─',
      lastBranch: '└─',
      vertical: '│ ',
      space: '  '
    };
  }

  /**
   * Format as deep tree structure
   */
  formatDeepTree(data, title = 'Code Intelligence Report') {
    const lines = [];
    lines.push(title);
    lines.push('=' .repeat(title.length));
    lines.push('');

    this.buildTree(data, lines, '', true);
    return lines.join('\n');
  }

  /**
   * Build tree recursively
   */
  buildTree(obj, lines, prefix = '', isLast = true) {
    if (obj === null || obj === undefined) {
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const isLastItem = index === obj.length - 1;
        const marker = isLastItem ? this.treeChars.lastBranch : this.treeChars.branch;
        const nextPrefix = prefix + (isLastItem ? this.treeChars.space : this.treeChars.vertical);

        if (typeof item === 'object') {
          lines.push(`${prefix}${marker} [${index}]`);
          this.buildTree(item, lines, nextPrefix, isLastItem);
        } else {
          lines.push(`${prefix}${marker} ${item}`);
        }
      });
    } else if (typeof obj === 'object') {
      const entries = Object.entries(obj);
      entries.forEach(([key, value], index) => {
        const isLastItem = index === entries.length - 1;
        const marker = isLastItem ? this.treeChars.lastBranch : this.treeChars.branch;
        const nextPrefix = prefix + (isLastItem ? this.treeChars.space : this.treeChars.vertical);

        if (value === null || value === undefined) {
          lines.push(`${prefix}${marker} ${key}: null`);
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            lines.push(`${prefix}${marker} ${key}: []`);
          } else if (value.every(v => typeof v === 'string' || typeof v === 'number')) {
            // Inline simple arrays
            lines.push(`${prefix}${marker} ${key}: [${value.slice(0, 3).join(', ')}${value.length > 3 ? '...' : ''}]`);
          } else {
            lines.push(`${prefix}${marker} ${key}: (${value.length} items)`);
            this.buildTree(value, lines, nextPrefix, isLastItem);
          }
        } else if (typeof value === 'object') {
          const size = Object.keys(value).length;
          lines.push(`${prefix}${marker} ${key}: {${size} props}`);
          this.buildTree(value, lines, nextPrefix, isLastItem);
        } else {
          const displayValue = typeof value === 'string' && value.length > 80
            ? value.substring(0, 77) + '...'
            : value;
          lines.push(`${prefix}${marker} ${key}: ${displayValue}`);
        }
      });
    } else {
      lines.push(`${prefix}└─ ${obj}`);
    }
  }

  /**
   * Format as JSON sidecar
   */
  formatJSONSidecar(data, metadata = {}) {
    const sidecar = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      metadata,
      data
    };

    return JSON.stringify(sidecar, null, 2);
  }

  /**
   * Format as Markdown report
   */
  formatMarkdownReport(data, options = {}) {
    const lines = [];
    const title = options.title || 'Code Intelligence Report';

    // Header
    lines.push(`# ${title}`);
    lines.push('');
    lines.push(`**Generated**: ${new Date().toISOString()}`);
    lines.push('');

    // Table of contents
    if (options.toc !== false && typeof data === 'object') {
      lines.push('## Table of Contents');
      lines.push('');
      Object.keys(data).forEach((key, index) => {
        const sectionTitle = this.humanizeKey(key);
        lines.push(`${index + 1}. [${sectionTitle}](#${key.toLowerCase().replace(/\s+/g, '-')})`);
      });
      lines.push('');
    }

    // Content sections
    this.buildMarkdownSections(data, lines);

    return lines.join('\n');
  }

  /**
   * Build markdown sections
   */
  buildMarkdownSections(data, lines, level = 2) {
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        if (typeof item === 'object') {
          lines.push(`${'#'.repeat(level + 1)} Item ${index + 1}`);
          lines.push('');
          this.buildMarkdownSections(item, lines, level + 1);
        } else {
          lines.push(`- ${item}`);
        }
      });
      lines.push('');
    } else if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([key, value]) => {
        const sectionTitle = this.humanizeKey(key);
        lines.push(`${'#'.repeat(level)} ${sectionTitle}`);
        lines.push('');

        if (value === null || value === undefined) {
          lines.push('*No data available*');
          lines.push('');
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            lines.push('*Empty list*');
          } else if (this.isTableData(value)) {
            this.buildMarkdownTable(value, lines);
          } else {
            this.buildMarkdownSections(value, lines, level + 1);
          }
        } else if (typeof value === 'object') {
          this.buildMarkdownSections(value, lines, level + 1);
        } else {
          lines.push(String(value));
          lines.push('');
        }
      });
    } else {
      lines.push(String(data));
      lines.push('');
    }
  }

  /**
   * Check if data can be formatted as table
   */
  isTableData(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    if (typeof arr[0] !== 'object' || arr[0] === null) return false;

    const firstKeys = Object.keys(arr[0]);
    return arr.every(item =>
      typeof item === 'object' &&
      item !== null &&
      Object.keys(item).length === firstKeys.length
    );
  }

  /**
   * Build markdown table
   */
  buildMarkdownTable(data, lines) {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);

    // Headers
    lines.push('| ' + headers.map(h => this.humanizeKey(h)).join(' | ') + ' |');
    lines.push('| ' + headers.map(() => '---').join(' | ') + ' |');

    // Rows
    data.slice(0, 20).forEach(row => { // Limit to 20 rows
      const values = headers.map(h => {
        const value = row[h];
        if (value === null || value === undefined) return '-';
        if (typeof value === 'object') return JSON.stringify(value);
        const str = String(value);
        return str.length > 50 ? str.substring(0, 47) + '...' : str;
      });
      lines.push('| ' + values.join(' | ') + ' |');
    });

    if (data.length > 20) {
      lines.push(`*... and ${data.length - 20} more rows*`);
    }

    lines.push('');
  }

  /**
   * Format for Chain of Drafts (CoD)
   */
  formatCoD(data, maxTokens = 500) {
    const concise = {
      s: this.summarizeData(data), // summary
      k: this.extractKeyPoints(data), // key points
      a: this.extractActionables(data) // actionables
    };

    const json = JSON.stringify(concise);
    if (json.length > maxTokens * 4) { // Rough token estimate
      // Further compress
      concise.s = concise.s.slice(0, 100);
      concise.k = concise.k.slice(0, 5);
      concise.a = concise.a.slice(0, 3);
    }

    return concise;
  }

  /**
   * Format file:line references
   */
  formatFileLineReferences(data) {
    const refs = [];

    const extract = (obj, currentFile = null) => {
      if (Array.isArray(obj)) {
        obj.forEach(item => extract(item, currentFile));
      } else if (typeof obj === 'object' && obj !== null) {
        if (obj.file) currentFile = obj.file;

        if (obj.line && currentFile) {
          refs.push(`${currentFile}:${obj.line}`);
        } else if (obj.symbol && currentFile) {
          const parts = obj.symbol.split(':');
          if (parts.length >= 2) {
            refs.push(`${currentFile}:${parts[1]}`);
          }
        }

        Object.values(obj).forEach(value => extract(value, currentFile));
      }
    };

    extract(data);
    return [...new Set(refs)].sort();
  }

  /**
   * Format as agent context
   */
  formatAgentContext(data, options = {}) {
    const context = {
      summary: this.summarizeData(data),
      keyFiles: this.extractKeyFiles(data),
      keyFunctions: this.extractKeyFunctions(data),
      risks: this.extractRisks(data),
      recommendations: this.extractRecommendations(data),
      fileLineRefs: this.formatFileLineReferences(data)
    };

    if (options.format === 'minimal') {
      return {
        files: context.keyFiles.slice(0, 5),
        refs: context.fileLineRefs.slice(0, 10)
      };
    }

    return context;
  }

  /**
   * Format as test plan
   */
  formatTestPlan(data) {
    const plan = [];
    plan.push('## Test Plan');
    plan.push('');

    // Extract test-related information
    const untested = this.extractUntestedFiles(data);
    const critical = this.extractCriticalPaths(data);
    const hotspots = this.extractHotspots(data);

    if (untested.length > 0) {
      plan.push('### Priority 1: Untested Files');
      untested.slice(0, 10).forEach(file => {
        plan.push(`- [ ] Add tests for ${file}`);
      });
      plan.push('');
    }

    if (critical.length > 0) {
      plan.push('### Priority 2: Critical Paths');
      critical.slice(0, 5).forEach(path => {
        plan.push(`- [ ] Test path: ${path.join(' → ')}`);
      });
      plan.push('');
    }

    if (hotspots.length > 0) {
      plan.push('### Priority 3: Hotspot Coverage');
      hotspots.slice(0, 5).forEach(hotspot => {
        plan.push(`- [ ] Ensure coverage for ${hotspot}`);
      });
      plan.push('');
    }

    return plan.join('\n');
  }

  /**
   * Helper: Humanize key names
   */
  humanizeKey(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim();
  }

  /**
   * Helper: Summarize data
   */
  summarizeData(data) {
    const summary = [];

    if (data.stats) {
      summary.push(`Project has ${data.stats.fileCount || 0} files, ${data.stats.functionCount || 0} functions`);
    }

    if (data.hotspots) {
      summary.push(`Found ${data.hotspots.length} code hotspots`);
    }

    if (data.problems) {
      const problemCount = Object.values(data.problems).filter(v => v).length;
      summary.push(`Detected ${problemCount} potential issues`);
    }

    return summary.join('. ');
  }

  /**
   * Helper: Extract key points
   */
  extractKeyPoints(data) {
    const points = [];

    const extract = (obj, prefix = '') => {
      if (Array.isArray(obj) && obj.length > 0) {
        points.push(`${prefix}${obj.length} items`);
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          if (key === 'recommendation' || key === 'suggestion') {
            points.push(String(value));
          } else if (key === 'risk' && value) {
            points.push(`Risk: ${value}`);
          }
        });
      }
    };

    extract(data);
    return points.slice(0, 10);
  }

  /**
   * Helper: Extract actionables
   */
  extractActionables(data) {
    const actions = [];

    const extract = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.recommendation) actions.push(obj.recommendation);
        if (obj.action) actions.push(obj.action);
        if (obj.suggestion) actions.push(obj.suggestion);
        if (obj.fix) actions.push(obj.fix);

        Object.values(obj).forEach(value => {
          if (typeof value === 'object') extract(value);
        });
      }
    };

    extract(data);
    return [...new Set(actions)].slice(0, 10);
  }

  /**
   * Helper: Extract key files
   */
  extractKeyFiles(data) {
    const files = new Set();

    const extract = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.file) files.add(obj.file);
        if (obj.path) files.add(obj.path);
        Object.values(obj).forEach(value => {
          if (typeof value === 'object') extract(value);
          else if (typeof value === 'string' && value.includes('.ts')) {
            files.add(value);
          }
        });
      }
    };

    extract(data);
    return Array.from(files);
  }

  /**
   * Helper: Extract key functions
   */
  extractKeyFunctions(data) {
    const functions = new Set();

    const extract = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.function) functions.add(obj.function);
        if (obj.fn) functions.add(obj.fn);
        if (obj.symbol) functions.add(obj.symbol.split(':')[0]);
        Object.values(obj).forEach(value => {
          if (typeof value === 'object') extract(value);
        });
      }
    };

    extract(data);
    return Array.from(functions);
  }

  /**
   * Helper: Extract risks
   */
  extractRisks(data) {
    const risks = [];

    const extract = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.risk) {
          risks.push(typeof obj.risk === 'object' ? obj.risk : { level: obj.risk });
        }
        Object.values(obj).forEach(value => {
          if (typeof value === 'object') extract(value);
        });
      }
    };

    extract(data);
    return risks;
  }

  /**
   * Helper: Extract recommendations
   */
  extractRecommendations(data) {
    const recommendations = [];

    const extract = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.recommendation || obj.recommendations) {
          const recs = obj.recommendation || obj.recommendations;
          if (Array.isArray(recs)) {
            recommendations.push(...recs);
          } else {
            recommendations.push(recs);
          }
        }
        Object.values(obj).forEach(value => {
          if (typeof value === 'object') extract(value);
        });
      }
    };

    extract(data);
    return recommendations;
  }

  /**
   * Helper: Extract untested files
   */
  extractUntestedFiles(data) {
    const untested = [];

    const extract = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.untested || obj.missingTests) {
          const files = obj.untested || obj.missingTests;
          if (Array.isArray(files)) {
            untested.push(...files.map(f => typeof f === 'object' ? f.file : f));
          }
        }
        Object.values(obj).forEach(value => {
          if (typeof value === 'object') extract(value);
        });
      }
    };

    extract(data);
    return untested;
  }

  /**
   * Helper: Extract critical paths
   */
  extractCriticalPaths(data) {
    const paths = [];

    const extract = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.criticalPath || obj.path) {
          const path = obj.criticalPath || obj.path;
          if (Array.isArray(path)) {
            paths.push(path);
          }
        }
        Object.values(obj).forEach(value => {
          if (typeof value === 'object') extract(value);
        });
      }
    };

    extract(data);
    return paths;
  }

  /**
   * Helper: Extract hotspots
   */
  extractHotspots(data) {
    const hotspots = [];

    const extract = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        if (obj.hotspot || obj.hotspots) {
          const hs = obj.hotspot || obj.hotspots;
          if (Array.isArray(hs)) {
            hotspots.push(...hs.map(h => typeof h === 'object' ? h.name || h.file : h));
          } else if (typeof hs === 'object') {
            hotspots.push(hs.name || hs.file);
          } else {
            hotspots.push(hs);
          }
        }
        Object.values(obj).forEach(value => {
          if (typeof value === 'object') extract(value);
        });
      }
    };

    extract(data);
    return hotspots;
  }
}

export default OutputFormatter;

const isMain = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

// CLI interface
if (isMain) {
  const formatter = new OutputFormatter();

  // Example data for testing
  const exampleData = {
    overview: {
      stats: {
        fileCount: 150,
        functionCount: 500
      },
      hotspots: [
        { name: 'auth.ts', score: 95 },
        { name: 'api.ts', score: 87 }
      ]
    },
    problems: {
      circular: true,
      orphans: 5,
      untested: 12
    },
    recommendations: [
      'Add tests for critical paths',
      'Refactor god objects',
      'Break circular dependencies'
    ]
  };

  const format = process.argv[2] || 'tree';

  switch (format) {
    case 'tree':
      console.log(formatter.formatDeepTree(exampleData));
      break;
    case 'markdown':
      console.log(formatter.formatMarkdownReport(exampleData));
      break;
    case 'json':
      console.log(formatter.formatJSONSidecar(exampleData));
      break;
    case 'cod':
      console.log(JSON.stringify(formatter.formatCoD(exampleData), null, 2));
      break;
    case 'context':
      console.log(JSON.stringify(formatter.formatAgentContext(exampleData), null, 2));
      break;
    case 'test':
      console.log(formatter.formatTestPlan(exampleData));
      break;
    default:
      console.log('Usage: node output-formatter.mjs [tree|markdown|json|cod|context|test]');
  }
}
