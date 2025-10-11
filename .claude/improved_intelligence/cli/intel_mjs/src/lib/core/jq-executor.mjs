#!/usr/bin/env node

/**
 * jq-executor.js - Core query engine for PROJECT_INDEX.json
 * Implements all 8 GAP-ANALYSIS command packs with caching
 */

import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const flatten = (strings, ...values) => String.raw(strings, ...values).replaceAll('\n', ' ');

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
const jqString = (value) => JSON.stringify(value ?? '');

const parseSymbolString = (symbol) => {
  if (typeof symbol !== 'string') {
    return { raw: symbol };
  }
  const match = symbol.match(/^(?<name>[^:]+):(?<line>[0-9]+):\((?<signature>[^)]*)\):(?<returnType>[^:]*)?:(?<calls>.*)$/);
  if (!match) {
    return { name: symbol, raw: symbol };
  }
  const { name, line, signature, returnType = '', calls = '' } = match.groups;
  return {
    name,
    line: Number.parseInt(line, 10),
    signature: signature || '',
    returnType: returnType || '',
    calls: calls
      ? calls.split(',')
          .map(call => call.trim())
          .filter(Boolean)
          .map(call => call.replace(/:$/, ''))
      : [],
    raw: symbol
  };
};

class JqExecutor {
  constructor(indexPath = 'PROJECT_INDEX.json') {
    this.indexPath = path.resolve(indexPath);
    this.cache = new Map();
    this.cacheTimeout = 60_000; // 1 minute TTL
    this.maxBuffer = 10 * 1024 * 1024; // 10MB
    this.validateIndex();
  }

  validateIndex() {
    if (!existsSync(this.indexPath)) {
      throw new Error(`PROJECT_INDEX.json not found at ${this.indexPath}. Run '/index' to generate.`);
    }
    const stats = statSync(this.indexPath);
    this.indexSize = stats.size;
    if (this.indexSize > 5 * 1024 * 1024) {
      console.warn(`Large index detected (${(this.indexSize / 1024 / 1024).toFixed(2)}MB). Queries may be slower.`);
    }
  }

  /**
   * Execute jq query with caching
   */
  jq(query, useCache = true) {
    const cacheKey = query;

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.result;
      }
      this.cache = new Map(
        [...this.cache.entries()].filter(([existingKey]) => existingKey !== cacheKey)
      );
    }

    const result = spawnSync('jq', ['-r', query, this.indexPath], {
      encoding: 'utf8',
      maxBuffer: this.maxBuffer
    });

    if (result.status !== 0) {
      const stderr = result.stderr?.trim();
      const errorMessage = stderr || result.error?.message || 'jq failed';
      console.error(`jq query failed: ${errorMessage}`);
      return;
    }

    const output = (result.stdout || '').trim();

    this.cache.set(cacheKey, {
      result: output,
      timestamp: Date.now()
    });

    return output;
  }


  /**
   * GAP-ANALYSIS Pack A: Purpose-Scoped Lists
   */
  getPurposes() {
    const query = String.raw`.dir_purposes | to_entries[] | "\(.key)\t\(.value)"`;
    const result = this.jq(query);
    if (!result) return [];
    return result.split('\n').map(line => {
      const [dir, purpose] = line.split('\t');
      return { dir, purpose };
    });
  }

  getFilesByPurpose(purpose) {
    if (!purpose) return [];
    const safePurpose = escapeRegex(purpose);
    const query = `.f | keys[] | select(test("^${safePurpose}/"))`;
    const result = this.jq(query);
    return result ? result.split('\n').filter(Boolean) : [];
  }

  getPages() {
    const query = String.raw`.f | keys[] | select(test("^app/.*/page\\.(ts|tsx)$"))`;
    const result = this.jq(query);
    return result ? result.split('\n').filter(Boolean) : [];
  }

  getApiRoutes() {
    const query = String.raw`.f | keys[] | select(test("^app/api/.*/route\\.(ts|tsx)$"))`;
    const result = this.jq(query);
    return result ? result.split('\n').filter(Boolean) : [];
  }

  /**
   * GAP-ANALYSIS Pack B: Symbol Catalog
   */
  getSymbolCatalog(limit = 100) {
    const query = flatten`
      def syms(v):
        (if v|type=="array" then v[1]
         elif (v|type=="object" and v.t?) then v.t
         else [] end);
      def parse($s):
        ($s|capture("^(?<name>[^:]+):(?<line>[0-9]+):\\((?<sig>[^)]*)\\):(?<ret>[^:]*)?:(?<calls>.*)$"))
        | .line|=tonumber
        | .calls=(if .calls=="" then [] else (.calls|split(",")|map(select(length>0))) end);
      .f|to_entries[:${limit}] | . as $e | syms($e.value)[]? as $s
      | parse($s) | {file:$e.key} + .
    `;

    const result = this.jq(query);
    if (!result) return [];

    try {
      return result.split('\n')
        .filter(Boolean)
        .map(line => JSON.parse(line));
    } catch {
      return [];
    }
  }

  /**
   * GAP-ANALYSIS Pack C: Call Centrality
   */
  getMostCalledFunctions(limit = 20) {
    const query = flatten`
      [.g[]?|{to:.[1]}]
      | group_by(.to)
      | map({fn:.[0].to, callers:length})
      | sort_by(-.callers)[:${limit}]
    `;

    const result = this.jq(query);
    if (!result) return [];

    try {
      const parsed = JSON.parse(result);
      return parsed
        .filter(item => item && typeof item.fn === 'string')
        .map(item => ({
          fn: item.fn,
          callers: item.callers,
          file: this.findFileForSymbol(item.fn)
        }))
        .filter(item => typeof item.file === 'string' && item.file.length > 0);
    } catch {
      return [];
    }
  }

  getTwoHopNeighborhood(fn) {
    if (!fn) return [];
    const safeFn = jqString(fn);
    const query = flatten`
      def succ($x): [.g[]?|select(.[0]==$x)|.[1]];
      (succ(${safeFn})|unique) as $n1
      | [$n1[]?,([$n1[]?|succ(.)[]]|unique[])]|unique
    `;

    const result = this.jq(query);
    if (!result) return [];

    try {
      return JSON.parse(result);
    } catch {
      return [];
    }
  }

  getCallers(fn) {
    if (!fn) return [];
    const query = `.g[]? | select(.[1]==${jqString(fn)}) | .[0]`;
    const result = this.jq(query);
    return result ? result.split('\n').filter(Boolean) : [];
  }

  getCallees(fn) {
    if (!fn) return [];
    const query = `.g[]? | select(.[0]==${jqString(fn)}) | .[1]`;
    const result = this.jq(query);
    return result ? result.split('\n').filter(Boolean) : [];
  }

  /**
   * GAP-ANALYSIS Pack D: Dependency Hotspots
   */
  getDependencyHotspots(limit = 20) {
    const query = flatten`
      .deps|to_entries
      | map(. as $e | ($e.value[]?|{from:$e.key,to:.}))
      | group_by(.to)
      | map({file:.[0].to,consumers:length})
      | sort_by(-.consumers)[:${limit}]
    `;

    const result = this.jq(query);
    if (!result) return [];

    try {
      return JSON.parse(result);
    } catch {
      return [];
    }
  }

  getImports(file) {
    if (!file) return [];
    const query = `.deps[${jqString(file)}]//[]`;
    const result = this.jq(query);
    if (!result) return [];

    try {
      return JSON.parse(result);
    } catch {
      return result.split('\n').filter(Boolean);
    }
  }

  getConsumers(file) {
    if (!file) return [];
    const query = flatten`
      .deps|to_entries[]
      |select(.value[]?==${jqString(file)})
      |.key
    `;

    const result = this.jq(query);
    return result ? result.split('\n').filter(Boolean) : [];
  }

  /**
   * GAP-ANALYSIS Pack E: Route→Flow
   */
  getRouteFlow(routePath) {
    const imports = this.getImports(routePath);
    const flow = {
      route: routePath,
      imports: imports,
      handlers: [],
      core: []
    };

    // Trace through imports to find handlers and core logic
    for (const imp of imports) {
      if (imp.includes('/actions') || imp.includes('/handlers')) {
        flow.handlers.push(imp);
      } else if (imp.includes('/lib/') || imp.includes('/core/')) {
        flow.core.push(imp);
      }
    }

    return flow;
  }

  /**
   * GAP-ANALYSIS Pack F: Test Linkage
   */
  getTestsForFile(file) {
    if (!file) return [];
    const query = flatten`
      .deps|to_entries[]
      |select((.value[]?==${jqString(file)}) and (.key|test("^__tests__/")))
      |.key
    `;

    const result = this.jq(query);
    return result ? result.split('\n').filter(Boolean) : [];
  }

  getTestCoverage() {
    const allFiles = this.jq('.f|keys[]');
    const testFiles = this.jq('.f|keys[]|select(test("test|spec"))');

    if (!allFiles || !testFiles) return { coverage: 0, tested: 0, total: 0 };

    const totalCount = allFiles.split('\n').filter(Boolean).length;
    const testCount = testFiles.split('\n').filter(Boolean).length;

    return {
      coverage: Math.round((testCount / totalCount) * 100),
      tested: testCount,
      total: totalCount
    };
  }

  /**
   * GAP-ANALYSIS Pack G: Orphan Detection
   */
  getOrphanFiles() {
    const query = flatten`
      .deps as $D
      | (.f|keys[]) as $k
      | select([$D|to_entries[]|select(.value[]?==$k)|.key]|length==0)
      | select((if ($k|type)=="string" then ($k|test("test|spec"))|not else false end))
      | $k
    `;

    const result = this.jq(query);
    return result ? result.split('\n').filter(Boolean) : [];
  }

  getDeadCode() {
    // Functions never called
    const allFunctions = this.jq('.g[]?|.[0]');
    const calledFunctions = this.jq('.g[]?|.[1]');

    if (!allFunctions || !calledFunctions) return [];

    const all = new Set(allFunctions.split('\n').filter(Boolean));
    const called = new Set(calledFunctions.split('\n').filter(Boolean));

    return [...all].filter(fn => !called.has(fn));
  }

  /**
   * GAP-ANALYSIS Pack H: Fuzzy Search
   */
  fuzzySearch(pattern, limit = 20) {
    const term = (pattern ?? '').trim();
    if (!term) {
      const result = this.jq(`.f|keys[:${limit}]|.[]`);
      return result ? result.split('\n').filter(Boolean) : [];
    }

    const fuzzyPattern = [...term.toLowerCase()]
      .map(character => character.replaceAll(/[.*+?^${}()|\[\]\\]/g, String.raw`\$&`))
      .join('.*');

    const query = `.f|keys|map(select(test("${fuzzyPattern}";"i")))|.[:${limit}]|.[]`;
    const result = this.jq(query);
    return result ? result.split('\n').filter(Boolean) : [];
  }

  searchSymbols(pattern) {
    const term = (pattern ?? '').trim();
    if (!term) return [];

    const fuzzyPattern = [...term.toLowerCase()]
      .map(character => character.replaceAll(/[.*+?^${}()|\[\]\\]/g, String.raw`\$&`))
      .join('.*');

    const query = flatten`
      def syms(v):
        (if v|type=="array" then
          (if v[1]|type=="array" then v[1][] else [] end)
         elif (v|type=="object" and v.t?) then v.t[]
         else [] end);
      .f|to_entries[]
      | . as $e
      | syms($e.value) as $sym
      | select($sym|type=="string" and ($sym|test("${fuzzyPattern}";"i")))
      | {file:$e.key, symbol:$sym} | @json
    `;

    const result = this.jq(query);
    if (!result) return [];

    return result.split('\n')
      .filter(Boolean)
      .map(line => {
        try {
          const parsed = JSON.parse(line);
          const details = parseSymbolString(parsed.symbol);
          return {
            file: parsed.file,
            ...details
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  findFileForSymbol(symbol) {
    if (!symbol) return null;
    const name = typeof symbol === 'string' ? symbol.split(':')[0] : symbol;
    const query = flatten`
      def syms(v):
        (if v|type=="array" then
          (if v[1]|type=="array" then v[1][] else [] end)
         elif (v|type=="object" and v.t?) then v.t[]
         else [] end);
      .f|to_entries[]
      | . as $e
      | syms($e.value) as $sym
      | select($sym|type=="string" and (($sym|split(":"))|first == ${jqString(name)}))
      | $e.key
    `;

    const result = this.jq(query);
    if (!result) return null;

    const [first] = result.split('\n').filter(Boolean);
    return first ?? null;
  }


  /**
   * Utility methods
   */
  getStats() {
    const query = '.stats';
    const result = this.jq(query);
    if (!result) return;

    try {
      return JSON.parse(result);
    } catch {
      return;
    }
  }

  getFileCount() {
    const query = '.f|keys|length';
    const result = this.jq(query);
    return result ? Number.parseInt(result, 10) : 0;
  }

  clearCache() {
    this.cache.clear();
  }
}

export default JqExecutor;

// CLI interface if run directly
const isMain = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

if (isMain) {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const envIndex = process.env.PROJECT_INDEX;
  const projectRoot = envIndex
    ? path.resolve(path.dirname(envIndex))
    : path.resolve(moduleDir, '..', '..', '..', '..');
  const indexPath = envIndex
    ? path.resolve(envIndex)
    : path.join(projectRoot, 'PROJECT_INDEX.json');
  const jq = new JqExecutor(indexPath);

  const command = process.argv[2];
  const arg = process.argv[3];

  const commands = {
    purposes: () => console.log(jq.getPurposes()),
    pages: () => console.log(jq.getPages()),
    apis: () => console.log(jq.getApiRoutes()),
    hotspots: () => console.log(jq.getMostCalledFunctions()),
    deps: () => console.log(jq.getDependencyHotspots()),
    orphans: () => console.log(jq.getOrphanFiles()),
    dead: () => console.log(jq.getDeadCode()),
    fuzzy: () => console.log(jq.fuzzySearch(arg ?? '')),
    tests: () => console.log(jq.getTestsForFile(arg ?? '')),
    callers: () => console.log(jq.getCallers(arg ?? '')),
    callees: () => console.log(jq.getCallees(arg ?? '')),
    stats: () => console.log(jq.getStats()),
  };

  if (!command || !commands[command]) {
    console.log('Available commands:');
    console.log(Object.keys(commands).join(', '));
    process.exit(command ? 1 : 0);
  }

  commands[command]();
}
