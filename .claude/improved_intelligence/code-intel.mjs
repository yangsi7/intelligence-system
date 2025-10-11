#!/usr/bin/env node

/**
 * code-intel - Unified code intelligence CLI
 * Main entry point for all code intelligence operations
 */

import fs from 'node:fs';
import { loadConfig } from './cli/intel_mjs/src/lib/config.mjs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Core modules
import JqExecutor from './cli/intel_mjs/src/lib/core/jq-executor.mjs';
import * as projectUtils from './cli/intel_mjs/src/lib/project-utils.mjs';

// Graph modules
import KnowledgeGraph from './cli/intel_mjs/src/lib/graph/knowledge-graph.mjs';
import PatternDetector from './cli/intel_mjs/src/lib/graph/pattern-detector.mjs';
import CentralityAnalyzer from './cli/intel_mjs/src/lib/graph/centrality-analyzer.mjs';

// Workflow modules
import WorkflowEngine from './cli/intel_mjs/src/lib/workflows/workflow-engine.mjs';
import OutputFormatter from './cli/intel_mjs/src/lib/workflows/output-formatter.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line
const cliArgs = process.argv.slice(2);
const [command, ...args] = cliArgs;

// Initialize modules
const envIndex = process.env.PROJECT_INDEX;
const projectRoot = envIndex
  ? path.resolve(path.dirname(envIndex))
  : process.cwd();
const indexPath = envIndex
  ? path.resolve(envIndex)
  : path.join(projectRoot, 'PROJECT_INDEX.json');
const jq = new JqExecutor(indexPath);
const graph = new KnowledgeGraph(indexPath);
const patterns = new PatternDetector(indexPath);
const centrality = new CentralityAnalyzer(indexPath);
const workflows = new WorkflowEngine(indexPath);
const formatter = new OutputFormatter();

// Load user configuration once at startup.  The config may define custom
// presets, domain keywords and test patterns.  If the config file is
// missing or invalid, defaults are returned.
const userConfig = loadConfig();

// Command handlers
const commands = {
  // Quick queries (Layer 1)
  find: {
    description: 'Find files matching pattern',
    usage: 'find <pattern>',
    handler: async (pattern) => {
      const files = jq.fuzzySearch(pattern || '', 20);
      console.log(formatter.formatDeepTree({ files }, 'Files Found'));
    }
  },

  content: {
    description: 'Search file contents via ripgrep',
    usage: 'content <pattern> [path] [--glob "*.ts"] [--type ts] [--ci] [--context N]',
    handler: async (pattern, ...restArgs) => {
      if (!pattern) {
        console.error('Pattern required: code-intel content <pattern> [path]');
        return;
      }

      if (!projectUtils.hasRg()) {
        console.error('rg (ripgrep) not found on PATH. Install ripgrep to use content search.');
        return;
      }

      const opts = { paths: [], glob: [], types: [] };
      let i = 0;
      while (i < restArgs.length) {
        const token = restArgs[i];
        switch (token) {
          case '--glob': {
            opts.glob.push(restArgs[i + 1]);
            i += 2;
            break;
          }
          case '--type': {
            opts.types.push(restArgs[i + 1]);
            i += 2;
            break;
          }
          case '--ci': {
            opts.caseInsensitive = true;
            i += 1;
            break;
          }
          case '--context': {
            const contextValue = Number.parseInt(restArgs[i + 1] ?? '0', 10);
            opts.context = Number.isNaN(contextValue) ? 0 : contextValue;
            i += 2;
            break;
          }
          case '--before': {
            const beforeValue = Number.parseInt(restArgs[i + 1] ?? '0', 10);
            opts.before = Number.isNaN(beforeValue) ? 0 : beforeValue;
            i += 2;
            break;
          }
          case '--after': {
            const afterValue = Number.parseInt(restArgs[i + 1] ?? '0', 10);
            opts.after = Number.isNaN(afterValue) ? 0 : afterValue;
            i += 2;
            break;
          }
          case '--literal': {
            opts.literal = true;
            i += 1;
            break;
          }
          default: {
            opts.paths.push(token);
            i += 1;
          }
        }
      }

      if (opts.paths.length === 0) {
        opts.paths = ['.'];
      }

      try {
        const matches = projectUtils.rgSearch(pattern, opts);
        console.log(formatter.formatDeepTree({ matches }, `rg matches: "${pattern}"`));
      } catch (error) {
        console.error(`rg search failed: ${error.message}`);
      }
    }
  },

  files: {
    description: 'Find files via fd',
    usage: 'files [pattern] [path] [--ext ts] [--type f] [--hidden] [--depth N]',
    handler: async (...args) => {
      if (!projectUtils.hasFd()) {
        console.error('fd not found on PATH. Install fd (or fdfind) to use file search.');
        return;
      }

      const opts = { paths: [], hidden: false };
      let pattern = '';
      let i = 0;
      while (i < args.length) {
        const token = args[i];
        switch (token) {
          case '--ext': {
            opts.extension = args[i + 1];
            i += 2;
            break;
          }
          case '--type': {
            opts.type = args[i + 1];
            i += 2;
            break;
          }
          case '--hidden': {
            opts.hidden = true;
            i += 1;
            break;
          }
          case '--no-ignore': {
            opts.noIgnore = true;
            i += 1;
            break;
          }
          case '--depth': {
            const depthValue = Number.parseInt(args[i + 1] ?? '', 10);
            opts.depth = Number.isNaN(depthValue) ? undefined : depthValue;
            i += 2;
            break;
          }
          default: {
            if (pattern === '') {
              pattern = token;
            } else {
              opts.paths.push(token);
            }
            i += 1;
          }
        }
      }

      if (opts.paths.length === 0) {
        opts.paths = ['.'];
      }

      try {
        const results = projectUtils.fdSearch(pattern, opts);
        console.log(formatter.formatDeepTree({ files: results }, pattern ? `fd files: "${pattern}"` : 'fd files'));
      } catch (error) {
        console.error(`fd search failed: ${error.message}`);
      }
    }
  },

  structure: {
    description: 'Show shallow directory tree via fd',
    usage: 'structure [depth] [path] [--files] [--hidden]',
    handler: async (...args) => {
      if (!projectUtils.hasFd()) {
        console.error('fd not found on PATH. Install fd (or fdfind) to use structure view.');
        return;
      }

      let depth = 2;
      const options = { root: '.', includeFiles: false, hidden: false };
      let i = 0;
      while (i < args.length) {
        const token = args[i];
        switch (token) {
          case '--files': {
            options.includeFiles = true;
            i += 1;
            break;
          }
          case '--hidden': {
            options.hidden = true;
            i += 1;
            break;
          }
          case '--depth': {
            const next = Number.parseInt(args[i + 1] ?? '', 10);
            if (!Number.isNaN(next)) {
              depth = next;
            }
            i += 2;
            break;
          }
          default: {
            const numeric = Number.parseInt(token ?? '', 10);
            if (!Number.isNaN(numeric) && String(numeric) === token) {
              depth = numeric;
            } else {
              options.root = token;
            }
            i += 1;
          }
        }
      }

      options.depth = depth;

      try {
        const tree = projectUtils.directoryStructure(options);
        const structured = tree.map((pathEntry, index) => ({
          index: index + 1,
          path: pathEntry
        }));
        console.log(formatter.formatDeepTree({ entries: structured }, `Directory structure (${options.root})`));
      } catch (error) {
        console.error(error.message);
      }
    }
  },

  symbol: {
    description: 'Find symbols/functions',
    usage: 'symbol <name>',
    handler: async (name) => {
      const symbols = jq.searchSymbols(name || '');
      console.log(formatter.formatDeepTree({ symbols }, 'Symbols Found'));
    }
  },

  callers: {
    description: 'Find who calls a function',
    usage: 'callers <function>',
    handler: async (fn) => {
      const callers = jq.getCallers(fn || '');
      console.log(formatter.formatDeepTree({ callers }, `Callers of ${fn}`));
    }
  },

  deps: {
    description: 'Show file dependencies',
    usage: 'deps <file>',
    handler: async (file) => {
      const imports = jq.getImports(file || '');
      const consumers = jq.getConsumers(file || '');
      console.log(formatter.formatDeepTree({ imports, consumers }, `Dependencies: ${file}`));
    }
  },

  // Graph analysis (Layer 2)
  hotspots: {
    description: 'Identify code hotspots',
    usage: 'hotspots [limit]',
    handler: async (limit) => {
      const parsedLimit = Number.parseInt(limit ?? '', 10);
      const normalizedLimit = Number.isNaN(parsedLimit) ? 10 : parsedLimit;
      const hotspots = await centrality.identifyHotspots(normalizedLimit);
      console.log(formatter.formatMarkdownReport({ hotspots }, { title: 'Code Hotspots' }));
    }
  },

  patterns: {
    description: 'Detect code patterns and smells',
    usage: 'patterns [type]',
    handler: async (type) => {
      let results;
      switch (type) {
        case 'circular': {
          results = await patterns.detectCircularDependencies();
          break;
        }
        case 'dead': {
          results = await patterns.detectDeadCode();
          break;
        }
        case 'god': {
          results = await patterns.detectGodObjects();
          break;
        }
        default: {
          results = await patterns.detectAll();
        }
      }
      console.log(formatter.formatMarkdownReport(results, { title: 'Pattern Analysis' }));
    }
  },

  graph: {
    description: 'Graph operations',
    usage: 'graph <stats|path|cycles> [args]',
    handler: async (op, ...rest) => {
      await graph.initialize();

      switch (op) {
        case 'stats': {
          console.log(formatter.formatDeepTree(graph.getStats(), 'Graph Statistics'));
          break;
        }
        case 'path': {
          const [from, to] = rest;
          const pathResult = graph.dijkstra(from, to);
          console.log(formatter.formatDeepTree({ path: pathResult }, `Path: ${from} → ${to}`));
          break;
        }
        case 'cycles': {
          const cycles = graph.findCycles();
          console.log(formatter.formatDeepTree({ cycles }, 'Dependency Cycles'));
          break;
        }
        default: {
          console.log('Available: stats, path <from> <to>, cycles');
        }
      }
    }
  },

  // Workflows (Layer 3)
  overview: {
    description: 'Generate project overview',
    usage: 'overview [30|60|90]',
    handler: async (depth) => {
      const parsedDepth = Number.parseInt(depth ?? '', 10);
      const normalizedDepth = Number.isNaN(parsedDepth) ? 30 : parsedDepth;
      const overview = await workflows.overview(normalizedDepth);
      console.log(formatter.formatMarkdownReport(overview, { title: `${depth || 30}-Second Overview` }));
    }
  },

  feature: {
    description: 'Analyze feature development',
    usage: 'feature <name>',
    handler: async (name) => {
      const flow = await workflows.featureDevelopmentFlow(name || 'feature');
      console.log(formatter.formatMarkdownReport(flow, { title: 'Feature Development Analysis' }));
    }
  },

  bug: {
    description: 'Investigate bug patterns',
    usage: 'bug <pattern>',
    handler: async (pattern) => {
      const investigation = await workflows.bugInvestigationFlow(pattern || 'error');
      console.log(formatter.formatMarkdownReport(investigation, { title: 'Bug Investigation' }));
    }
  },

  refactor: {
    description: 'Analyze refactoring impact',
    usage: 'refactor <file>',
    handler: async (file) => {
      const analysis = await workflows.refactoringFlow(file || '');
      console.log(formatter.formatMarkdownReport(analysis, { title: 'Refactoring Analysis' }));
    }
  },

  // Output formats
  format: {
    description: 'Format last result',
    usage: 'format <tree|markdown|json|cod>',
    handler: async (format) => {
      // This would format the last result in memory
      console.log(`Format mode: ${format}`);
    }
  },

  fzf: {
    description: 'Interactive file picker via fd + fzf',
    usage: 'fzf [pattern] [path] [--type f|d] [--depth N] [--hidden]',
    handler: async (...args) => {
      if (!projectUtils.hasFzf()) {
        console.error('fzf not found on PATH. Install fzf to use interactive picker.');
        return;
      }
      if (!projectUtils.hasFd()) {
        console.error('fd not found on PATH. Install fd to enumerate files.');
        return;
      }

      let pattern = '';
      const options = { root: '.', hidden: false };
      let i = 0;
      while (i < args.length) {
        const token = args[i];
        switch (token) {
          case '--type': {
            options.type = args[i + 1] ?? undefined;
            i += 2;
            break;
          }
          case '--depth': {
            const depthValue = Number.parseInt(args[i + 1] ?? '', 10);
            if (!Number.isNaN(depthValue)) {
              options.depth = depthValue;
            }
            i += 2;
            break;
          }
          case '--hidden': {
            options.hidden = true;
            i += 1;
            break;
          }
          default: {
            if (!pattern) {
              pattern = token;
            } else {
              options.root = token;
            }
            i += 1;
          }
        }
      }

      try {
        const selection = projectUtils.interactiveFileSelect(pattern, options);
        if (selection) {
          console.log(selection);
        } else {
          console.log('No selection made.');
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  },

  // Preset runner: orchestrate analyses into compact/standard/extended
  preset: {
    description: 'Run preset analyses (compact|standard|extended)',
    usage: 'preset <compact|standard|extended>',
    handler: async (presetName) => {
      const preset = (presetName || '').toLowerCase();
      const sequence = (userConfig.presets && userConfig.presets[preset])
        || userConfig.presets?.[preset] || null;
      if (!sequence) {
        console.error(`Unknown preset: ${presetName}`);
        const available = Object.keys(userConfig.presets || {}).join(', ');
        console.error(`Available presets: ${available}`);
        return;
      }
      for (const step of sequence) {
        // Each step may be a string like 'graph stats' or 'overview'.  Split
        // into command and sub-arguments (if any).
        const parts = step.split(' ');
        const cmdName = parts[0];
        const cmdArgs = parts.slice(1);
        if (!commands[cmdName]) {
          console.error(`Unknown command in preset: ${cmdName}`);
          continue;
        }
        // eslint-disable-next-line no-await-in-loop
        await commands[cmdName].handler(...cmdArgs);
      }
    }
  },

  // Execute an analysis chain defined in a JSON file
  chain: {
    description: 'Run a sequence of analyses from a JSON file',
    usage: 'chain <file>',
    handler: async (filePath) => {
      if (!filePath) {
        console.error('Chain file path is required');
        return;
      }
      try {
        const fsPromises = await import('node:fs/promises');
        const content = await fsPromises.readFile(filePath, 'utf8');
        const steps = JSON.parse(content);
        if (!Array.isArray(steps)) {
          console.error('Chain file must contain a JSON array');
          return;
        }
        for (const step of steps) {
          const { command: cmdName, args: cmdArgs = [] } = step;
          if (!commands[cmdName]) {
            console.error(`Unknown command in chain: ${cmdName}`);
            continue;
          }
          // eslint-disable-next-line no-await-in-loop
          await commands[cmdName].handler(...cmdArgs);
        }
      } catch (err) {
        console.error(`Failed to run chain: ${err.message}`);
      }
    }
  },

  // Advanced queries
  query: {
    description: 'Run raw jq query',
    usage: 'query <jq-expression>',
    handler: async (...query) => {
      const expression = query.join(' ');
      const result = jq.jq(expression);
      console.log(result);
    }
  },

  // Chain of Drafts mode
  cod: {
    description: 'Chain of Drafts mode',
    usage: 'cod <command> [args]',
    handler: async (cmd, ...cmdArgs) => {
      // Run command in CoD mode
      if (commands[cmd]) {
        const result = await commands[cmd].handler(...cmdArgs);
        const codFormat = formatter.formatCoD(result);
        console.log(JSON.stringify(codFormat));
      }
    }
  },

  // Help
  help: {
    description: 'Show help',
    usage: 'help [command]',
    handler: async (cmd) => {
      if (cmd && commands[cmd]) {
        console.log(`${cmd}: ${commands[cmd].description}`);
        console.log(`Usage: code-intel ${commands[cmd].usage}`);
      } else {
        console.log('Code Intelligence CLI v3.0');
        console.log('=========================');
        console.log('');
        console.log('Commands:');
        for (const [name, info] of Object.entries(commands)) {
          console.log(`  ${name.padEnd(12)} ${info.description}`);
        }
        console.log('');
        console.log('Examples:');
        console.log('  code-intel find payment        # Fuzzy find payment files');
        console.log('  code-intel hotspots 5          # Top 5 hotspots');
        console.log('  code-intel overview 90         # 90-second overview');
        console.log('  code-intel files "decision"    # fd search for files');
        console.log('  code-intel content "use client" --type ts  # rg content search');
        console.log('  code-intel bug "undefined"     # Investigate undefined errors');
        console.log('  code-intel graph path fn1 fn2  # Find path between functions');
        console.log('  code-intel preset compact      # Run the compact preset (overview + hotspots)');
        console.log('  code-intel chain workflow.json # Run a custom analysis chain from JSON');
      }
    }
  }
};

// Validate index exists
function validateIndex() {
  if (!fs.existsSync(indexPath)) {
    console.error('❌ PROJECT_INDEX.json not found');
    console.error('Run /index first to generate the codebase index');
    process.exit(1);
  }

  const stats = fs.statSync(indexPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

  // Show index info
  if (!command || command === 'help') {
    console.log(`📊 Index: ${sizeMB}MB | Updated: ${stats.mtime.toLocaleString()}`);
  }
}

// Main execution
async function main() {
  validateIndex();

  if (!command || command === 'help') {
    await commands.help.handler();
    return;
  }

  if (!commands[command]) {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Run "code-intel help" for available commands');
    process.exit(1);
  }

  try {
    await commands[command].handler(...args);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error.message);
  process.exit(1);
});

const isMain = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

// Run
if (isMain) {
  await main();
}
