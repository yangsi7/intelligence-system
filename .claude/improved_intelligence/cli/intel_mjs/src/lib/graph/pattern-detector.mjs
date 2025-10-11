#!/usr/bin/env node

/**
 * pattern-detector.js - Detect code patterns, smells, and anti-patterns
 * Identifies structural issues in the codebase
 */

import { pathToFileURL } from 'node:url';

import JqExecutor from '../core/jq-executor.mjs';
import KnowledgeGraph from './knowledge-graph.mjs';
import { loadConfig } from '../config.mjs';

// Determine if a file is managed by a front‑end framework (e.g., Next.js).  The
// default pattern matches common framework file names such as page, layout,
// template, loading, error and route.  A custom pattern can be supplied via
// the configuration file (.code-intel-config.json) using the
// `frameworkManagedPattern` property.
const config = loadConfig();
const defaultFrameworkPattern = /(page|layout|template|loading|error|route)\.(ts|tsx|js|jsx)$/;
const frameworkPattern = config.frameworkManagedPattern
  ? new RegExp(config.frameworkManagedPattern)
  : defaultFrameworkPattern;
const isFrameworkManagedFile = (file = '') => {
  if (!file) return false;
  // Allow custom root prefix via config or default to 'app/'.
  const root = config.frameworkRoot || 'app/';
  if (!file.startsWith(root)) return false;
  return frameworkPattern.test(file);
};

const shouldTrackTestCoverage = (file = '') => {
  if (!file) return false;
  // Exclude internal configuration and agent files by default
  if (file.startsWith('.claude/')) return false;
  // Use configured test patterns to determine which files should be covered by tests.
  const patterns = Array.isArray(config.testPatterns) && config.testPatterns.length > 0
    ? config.testPatterns
    : ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
  // Convert glob patterns to regex for simple matching.  This is a naive
  // conversion: ** → .*, * → [^/]*.  For more complex patterns a glob
  // library should be used, but this suffices for basic cases.
  const regexes = patterns.map((pat) => {
    const escaped = pat.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&');
    const regexStr = escaped
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*');
    return new RegExp('^' + regexStr + '$');
  });
  return regexes.some((re) => re.test(file));
};

class PatternDetector {
  constructor(indexPath = 'PROJECT_INDEX.json') {
    this.jq = new JqExecutor(indexPath);
    this.graph = new KnowledgeGraph(indexPath);
    this.patterns = [];
  }

  /**
   * Run all pattern detections
   */
  async detectAll() {
    await this.graph.initialize();

    const results = {
      godObjects: await this.detectGodObjects(),
      circularDependencies: await this.detectCircularDependencies(),
      deadCode: await this.detectDeadCode(),
      orphanFiles: await this.detectOrphanFiles(),
      deepNesting: await this.detectDeepNesting(),
      longFunctions: await this.detectLongFunctions(),
      unusedExports: await this.detectUnusedExports(),
      missingTests: await this.detectMissingTests(),
      singletonPatterns: await this.detectSingletons(),
      tightCoupling: await this.detectTightCoupling()
    };

    // Calculate severity scores
    results.summary = this.calculateSeverity(results);
    return results;
  }

  /**
   * Detect God Objects (files/functions with too many dependencies)
   */
  async detectGodObjects(threshold = 15) {
    const godObjects = {
      files: [],
      functions: []
    };

    // Files with too many imports
    const query = `
      .deps | to_entries
      | map(select(.value | length > ${threshold}))
      | map({file: .key, importCount: (.value | length), imports: .value[:5]})
      | sort_by(-.importCount)
    `.replace(/\n/g, ' ');

    const result = this.jq.jq(query);
    if (result) {
      try {
        godObjects.files = JSON.parse(result);
      } catch (e) {
        // Fallback to simpler detection
      }
    }

    // Functions with too many calls
    const callCounts = new Map();
    for (const [fn, node] of this.graph.nodes) {
      const callCount = node.callees.size;
      if (callCount > threshold) {
        callCounts.set(fn, callCount);
      }
    }

    godObjects.functions = Array.from(callCounts.entries())
      .map(([fn, count]) => ({ function: fn, callCount: count }))
      .sort((a, b) => b.callCount - a.callCount);

    return godObjects;
  }

  /**
   * Detect Circular Dependencies
   */
  async detectCircularDependencies() {
    const circulars = {
      files: [],
      functions: []
    };

    // File-level circular dependencies
    const fileQuery = `
      .deps as $deps |
      [$deps | to_entries[] | . as $e1 |
       $deps | to_entries[] | . as $e2 |
       select($e1.key < $e2.key and
              ($e1.value[]? == $e2.key) and
              ($e2.value[]? == $e1.key)) |
       {cycle: [$e1.key, $e2.key]}] | unique
    `.replace(/\n/g, ' ');

    const fileResult = this.jq.jq(fileQuery);
    if (fileResult) {
      try {
        circulars.files = JSON.parse(fileResult);
      } catch (e) {
        circulars.files = [];
      }
    }

    // Function-level circular dependencies
    circulars.functions = this.graph.findCycles().map(cycle => ({
      cycle,
      length: cycle.length
    }));

    return circulars;
  }

  /**
   * Detect Dead Code
   */
  async detectDeadCode() {
    const dead = {
      functions: [],
      files: [],
      exports: []
    };

    // Dead functions (never called)
    dead.functions = this.jq.getDeadCode().map(fn => ({
      function: fn,
      file: this.graph.findFileForSymbol(fn)
    }));

    // Orphan files (no imports/exports)
    dead.files = this.jq.getOrphanFiles();

    // Unused exports
    const exportQuery = `
      def syms(v):
        (if v|type=="array" then
          (if v[1]|type=="array" then v[1][] else [] end)
         elif (v|type=="object" and v.t?) then v.t[]
         else [] end);
      .f | to_entries[] | . as $e |
      syms($e.value) as $sym |
      select($sym|type=="string") |
      ($sym | split(":")[0]) as $name |
      select([.g[]? | select(.[1] == $name)] | length == 0) |
      {file: $e.key, symbol: $name}
    `.replace(/\n/g, ' ');

    const exportResult = this.jq.jq(exportQuery);
    if (exportResult) {
      exportResult.split('\n').filter(Boolean).forEach(line => {
        try {
          dead.exports.push(JSON.parse(line));
        } catch (e) {
          // Skip malformed
        }
      });
    }

    return dead;
  }

  /**
   * Detect Orphan Files
   */
  async detectOrphanFiles() {
    return this.jq.getOrphanFiles()
      .filter(file => !isFrameworkManagedFile(file))
      .map(file => ({
        file,
        type: this.classifyFileType(file),
        suggestion: this.suggestOrphanFix(file)
      }));
  }



  /**
   * Detect Deep Nesting (complex control flow)
   */
  async detectDeepNesting(maxDepth = 5) {
    const deepNested = [];

    // Use graph paths to find deep call chains
    for (const node of this.graph.nodes.keys()) {
      const neighborhood = this.graph.getNeighborhood(node, maxDepth);
      if (neighborhood.levels[maxDepth] && neighborhood.levels[maxDepth].length > 0) {
        deepNested.push({
          root: node,
          depth: maxDepth,
          leafCount: neighborhood.levels[maxDepth].length
        });
      }
    }

    return deepNested.sort((a, b) => b.leafCount - a.leafCount).slice(0, 10);
  }

  /**
   * Detect Long Functions
   */
  async detectLongFunctions(lineThreshold = 100) {
    const query = `
      def syms(v):
        (if v|type=="array" then
          (if v[1]|type=="array" then v[1][] else [] end)
         elif (v|type=="object" and v.t?) then v.t[]
         else [] end);
      def parse($s):
        if $s|type=="string" and ($s|contains(":")) then
          ($s | split(":")) as $parts |
          if ($parts|length) >= 2 then
            {name: $parts[0], line: (try ($parts[1] | tonumber) catch 0)}
          else null end
        else null end;
      .f | to_entries[] | . as $e |
      [syms($e.value)] as $syms |
      [$syms[] | select(type=="string") | parse(.)] as $parsed |
      [$parsed[] | select(. != null)] | group_by(.name) |
      map(select(length > 1)) |
      map({
        file: $e.key,
        function: .[0].name,
        lines: ((.[[-1]].line - .[0].line) | if . > ${lineThreshold} then . else empty end)
      })[]
    `.replace(/\n/g, ' ');

    const result = this.jq.jq(query);
    const longFunctions = [];

    if (result) {
      result.split('\n').filter(Boolean).forEach(line => {
        try {
          longFunctions.push(JSON.parse(line));
        } catch (e) {
          // Skip malformed
        }
      });
    }

    return longFunctions;
  }

  /**
   * Detect Unused Exports
   */
  async detectUnusedExports() {
    const query = `
      def syms(v):
        (if v|type=="array" then
          (if v[1]|type=="array" then v[1][] else [] end)
         elif (v|type=="object" and v.t?) then v.t[]
         else [] end);
      .f | to_entries[] | . as $e |
      syms($e.value) as $sym |
      select($sym|type=="string" and ($sym|contains(":"))) |
      ($sym | split(":")[0]) as $name |
      select($name | test("^export|^default")) |
      select([.g[]? | select(.[1] == $name)] | length == 0) |
      {file: $e.key, export: $name}
    `.replace(/\n/g, ' ');

    const result = this.jq.jq(query);
    const unusedExports = [];

    if (result) {
      result.split('\n').filter(Boolean).forEach(line => {
        try {
          unusedExports.push(JSON.parse(line));
        } catch (e) {
          // Skip
        }
      });
    }

    return unusedExports;
  }

  /**
   * Detect Missing Tests
   */
  async detectMissingTests() {
    const untested = [];

    // Get all source files
    const sourceFiles = this.jq.jq(".f | keys[] | select(test(\"\\\\.(ts|tsx|js|jsx)$\") and (test(\"test|spec|__tests__|node_modules\") | not))");
    if (!sourceFiles) return untested;

    const sources = sourceFiles.split('\n').filter(Boolean);

    for (const file of sources) {
      if (!shouldTrackTestCoverage(file)) {
        continue;
      }

      const tests = this.jq.getTestsForFile(file);
      if (tests.length === 0) {
        untested.push({
          file,
          suggestedTestFile: this.suggestTestFile(file)
        });
      }
    }

    return untested;
  }



  /**
   * Detect Singleton Patterns
   */
  async detectSingletons() {
    const singletons = [];

    const query = `
      def syms(v):
        (if v|type=="array" then v[1]
         elif (v|type=="object" and v.t?) then v.t
         else [] end);
      .f | to_entries[] | . as $e |
      select($e.value | tostring | test("getInstance|singleton|Singleton|INSTANCE")) |
      {file: $e.key, pattern: "singleton", confidence: "high"}
    `.replace(/\n/g, ' ');

    const result = this.jq.jq(query);
    if (result) {
      result.split('\n').filter(Boolean).forEach(line => {
        try {
          singletons.push(JSON.parse(line));
        } catch (e) {
          // Skip
        }
      });
    }

    return singletons;
  }

  /**
   * Detect Tight Coupling
   */
  async detectTightCoupling(threshold = 0.3) {
    const tightlyCoupled = [];

    // Calculate coupling coefficient for each file
    const files = Array.from(this.graph.fileNodes.keys());

    for (const file of files) {
      const imports = this.graph.fileNodes.get(file).imports;
      const consumers = this.graph.fileNodes.get(file).consumers;

      // High coupling = many imports AND many consumers
      if (imports.length > 5 && consumers.length > 5) {
        const couplingScore = (imports.length * consumers.length) / (files.length * 2);
        if (couplingScore > threshold) {
          tightlyCoupled.push({
            file,
            imports: imports.length,
            consumers: consumers.length,
            couplingScore: couplingScore.toFixed(3)
          });
        }
      }
    }

    return tightlyCoupled.sort((a, b) => b.couplingScore - a.couplingScore);
  }

  /**
   * Calculate severity scores
   */
  calculateSeverity(results) {
    const scores = {
      godObjects: (results.godObjects.files.length + results.godObjects.functions.length) * 3,
      circular: (results.circularDependencies.files.length + results.circularDependencies.functions.length) * 5,
      deadCode: (results.deadCode.functions.length + results.deadCode.files.length) * 2,
      orphans: results.orphanFiles.length * 1,
      deepNesting: results.deepNesting.length * 2,
      longFunctions: results.longFunctions.length * 2,
      unusedExports: results.unusedExports.length * 1,
      missingTests: results.missingTests.length * 3,
      singletons: results.singletonPatterns.length * 1,
      tightCoupling: results.tightCoupling.length * 4
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    return {
      scores,
      totalScore,
      healthGrade: this.getHealthGrade(totalScore),
      recommendations: this.getRecommendations(scores)
    };
  }

  /**
   * Get health grade based on score
   */
  getHealthGrade(score) {
    if (score < 10) return 'A - Excellent';
    if (score < 25) return 'B - Good';
    if (score < 50) return 'C - Fair';
    if (score < 100) return 'D - Poor';
    return 'F - Critical';
  }

  /**
   * Get recommendations based on scores
   */
  getRecommendations(scores) {
    const recommendations = [];

    if (scores.circular > 0) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Circular Dependencies',
        action: 'Refactor to break circular imports/calls'
      });
    }

    if (scores.godObjects > 15) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'God Objects',
        action: 'Split large files/functions into smaller modules'
      });
    }

    if (scores.missingTests > 20) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Missing Tests',
        action: 'Add unit tests for untested files'
      });
    }

    if (scores.deadCode > 10) {
      recommendations.push({
        priority: 'LOW',
        issue: 'Dead Code',
        action: 'Remove unused functions and files'
      });
    }

    return recommendations;
  }

  /**
   * Helper: Classify file type
   */
  classifyFileType(file) {
    if (file.includes('test') || file.includes('spec')) return 'test';
    if (file.includes('.config')) return 'config';
    if (file.includes('component')) return 'component';
    if (file.includes('page')) return 'page';
    if (file.includes('api')) return 'api';
    if (file.includes('lib')) return 'library';
    if (file.includes('util')) return 'utility';
    return 'other';
  }

  /**
   * Helper: Suggest orphan fix
   */
  suggestOrphanFix(file) {
    const type = this.classifyFileType(file);
    const suggestions = {
      test: 'Ensure test is importing the file it tests',
      config: 'May be okay if loaded at runtime',
      component: 'Export and use in a page or parent component',
      page: 'Add to routing configuration',
      api: 'Add to API route configuration',
      library: 'Import in files that need this functionality',
      utility: 'Import where utility functions are needed',
      other: 'Review if file is still needed'
    };
    return suggestions[type] || 'Review usage';
  }

  /**
   * Helper: Suggest test file name
   */
  suggestTestFile(sourceFile) {
    // Replace src/ with __tests__/ and add .test
    const testFile = sourceFile
      .replace(/^(app|lib|components)\//, '__tests__/$1/')
      .replace(/\.(ts|tsx|js|jsx)$/, '.test.$1');
    return testFile;
  }
}

export default PatternDetector;

const isMain = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

// CLI interface
if (isMain) {
  const detector = new PatternDetector();

  const command = process.argv[2];

  const commands = {
    all: async () => {
      const results = await detector.detectAll();
      console.log(JSON.stringify(results, null, 2));
    },
    god: async () => {
      const results = await detector.detectGodObjects();
      console.log(JSON.stringify(results, null, 2));
    },
    circular: async () => {
      const results = await detector.detectCircularDependencies();
      console.log(JSON.stringify(results, null, 2));
    },
    dead: async () => {
      const results = await detector.detectDeadCode();
      console.log(JSON.stringify(results, null, 2));
    },
    orphans: async () => {
      const results = await detector.detectOrphanFiles();
      console.log(JSON.stringify(results, null, 2));
    },
    untested: async () => {
      const results = await detector.detectMissingTests();
      console.log(JSON.stringify(results, null, 2));
    },
    coupling: async () => {
      const results = await detector.detectTightCoupling();
      console.log(JSON.stringify(results, null, 2));
    }
  };

  if (commands[command]) {
    commands[command]();
  } else {
    console.log('Available commands:', Object.keys(commands).join(', '));
  }
}
