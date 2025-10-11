#!/usr/bin/env node

/**
 * centrality-analyzer.js - Analyze code centrality and identify hotspots
 * Implements various centrality metrics for code intelligence
 */

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import JqExecutor from '../core/jq-executor.mjs';
import KnowledgeGraph from './knowledge-graph.mjs';

class CentralityAnalyzer {
  constructor(indexPath = 'PROJECT_INDEX.json') {
    this.jq = new JqExecutor(indexPath);
    this.graph = new KnowledgeGraph(indexPath);
  }

  /**
   * Calculate all centrality metrics
   */
  async analyzeAll() {
    await this.graph.initialize();

    return {
      functionCentrality: await this.calculateFunctionCentrality(),
      fileCentrality: await this.calculateFileCentrality(),
      hotspots: await this.identifyHotspots(),
      criticalPaths: await this.findCriticalPaths(),
      bottlenecks: await this.identifyBottlenecks(),
      pageRank: await this.calculatePageRank(),
      betweenness: await this.calculateBetweenness(),
      closeness: await this.calculateCloseness()
    };
  }

  /**
   * Calculate function centrality (in-degree and out-degree)
   */
  async calculateFunctionCentrality(limit = 20) {
    const centrality = {
      byInDegree: [],
      byOutDegree: [],
      byCombined: []
    };

    // Most called functions (high in-degree)
    centrality.byInDegree = this.jq.getMostCalledFunctions(limit);

    // Functions that call many others (high out-degree)
    const outDegreeQuery = `
      [.g[]? | {from: .[0]}]
      | group_by(.from)
      | map({fn: .[0].from, calls: length})
      | sort_by(-.calls)[:${limit}]
    `.replace(/\n/g, ' ');

    const outDegreeResult = this.jq.jq(outDegreeQuery);
    if (outDegreeResult) {
      try {
        centrality.byOutDegree = JSON.parse(outDegreeResult);
      } catch (e) {
        centrality.byOutDegree = [];
      }
    }

    // Combined centrality score
    const combinedMap = new Map();

    for (const item of centrality.byInDegree) {
      combinedMap.set(item.fn, {
        fn: item.fn,
        inDegree: item.callers,
        outDegree: 0,
        combined: 0
      });
    }

    for (const item of centrality.byOutDegree) {
      if (combinedMap.has(item.fn)) {
        combinedMap.get(item.fn).outDegree = item.calls;
      } else {
        combinedMap.set(item.fn, {
          fn: item.fn,
          inDegree: 0,
          outDegree: item.calls,
          combined: 0
        });
      }
    }

    // Calculate combined score
    for (const [fn, data] of combinedMap) {
      data.combined = Math.sqrt(data.inDegree * data.inDegree + data.outDegree * data.outDegree);
    }

    centrality.byCombined = Array.from(combinedMap.values())
      .sort((a, b) => b.combined - a.combined)
      .slice(0, limit);

    return centrality;
  }

  /**
   * Calculate file centrality
   */
  async calculateFileCentrality(limit = 20) {
    const centrality = {
      byImports: [],
      byConsumers: [],
      byCombined: []
    };

    // Files imported by many (dependency hotspots)
    const normalize = (items = []) =>
      (items || []).filter(item => {
        if (!item || typeof item.file !== 'string') return false;
        const f = item.file;
        return f.startsWith('.') || f.startsWith('/') || f.includes('/') || f.startsWith('@');
      });

    centrality.byConsumers = normalize(this.jq.getDependencyHotspots(limit));

    // Files importing many (complex files)
    const importQuery = `
      .deps | to_entries
      | map({file: .key, imports: (.value | length)})
      | sort_by(-.imports)[:${limit}]
    `.replace(/\n/g, ' ');

    const importResult = this.jq.jq(importQuery);
    if (importResult) {
      try {
        centrality.byImports = normalize(JSON.parse(importResult));
      } catch (e) {
        centrality.byImports = [];
      }
    }

    // Combined file centrality
    const combinedMap = new Map();

    for (const item of centrality.byConsumers) {
      combinedMap.set(item.file, {
        file: item.file,
        consumers: item.consumers,
        imports: 0,
        combined: 0
      });
    }

    for (const item of centrality.byImports) {
      if (combinedMap.has(item.file)) {
        combinedMap.get(item.file).imports = item.imports;
      } else {
        combinedMap.set(item.file, {
          file: item.file,
          consumers: 0,
          imports: item.imports,
          combined: 0
        });
      }
    }

    // Calculate combined score
    for (const [file, data] of combinedMap) {
      data.combined = data.consumers * 2 + data.imports; // Weight consumers more
    }

    centrality.byCombined = Array.from(combinedMap.values())
      .sort((a, b) => b.combined - a.combined)
      .slice(0, limit);

    return centrality;
  }

  /**
   * Identify hotspots (high centrality + high change frequency)
   */
  async identifyHotspots(limit = 10) {
    const hotspots = [];

    // Get function centrality
    const functionCentrality = await this.calculateFunctionCentrality(limit * 2);

    // Get file centrality
    const fileCentrality = await this.calculateFileCentrality(limit * 2);

    // Combine and score
    for (const fn of functionCentrality.byCombined.slice(0, limit)) {
      const file = this.graph.findFileForSymbol(fn.fn);
      const fileData = fileCentrality.byCombined.find(f => f.file === file);

      hotspots.push({
        type: 'function',
        name: fn.fn,
        file: file,
        score: fn.combined,
        risk: this.calculateRisk(fn.combined, fileData?.combined || 0),
        recommendation: this.getHotspotRecommendation('function', fn)
      });
    }

    for (const file of fileCentrality.byCombined.slice(0, limit)) {
      hotspots.push({
        type: 'file',
        name: file.file,
        score: file.combined,
        risk: this.calculateRisk(file.combined, file.consumers),
        recommendation: this.getHotspotRecommendation('file', file)
      });
    }

    return hotspots.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  /**
   * Find critical paths in the codebase
   */
  async findCriticalPaths() {
    const paths = {
      longest: null,
      mostTraversed: [],
      entryToHotspot: []
    };

    // Longest path in the graph
    paths.longest = this.graph.getCriticalPath();

    // Most traversed paths (between popular nodes)
    const topFunctions = await this.calculateFunctionCentrality(5);
    for (let i = 0; i < topFunctions.byInDegree.length - 1; i++) {
      for (let j = i + 1; j < topFunctions.byInDegree.length; j++) {
        const from = topFunctions.byInDegree[i].fn;
        const to = topFunctions.byInDegree[j].fn;
        const path = this.graph.dijkstra(from, to);
        if (path && path.length > 2) {
          paths.mostTraversed.push({
            from,
            to,
            path,
            length: path.length
          });
        }
      }
    }

    // Paths from entry points to hotspots
    const entryPoints = await this.findEntryPoints();
    const hotspots = await this.identifyHotspots(3);

    for (const entry of entryPoints.slice(0, 3)) {
      for (const hotspot of hotspots) {
        if (hotspot.type === 'function') {
          const path = this.graph.dijkstra(entry, hotspot.name);
          if (path && path.length > 1) {
            paths.entryToHotspot.push({
              entry,
              hotspot: hotspot.name,
              path,
              length: path.length
            });
          }
        }
      }
    }

    return paths;
  }

  /**
   * Identify bottlenecks
   */
  async identifyBottlenecks() {
    const bottlenecks = [];

    // Functions that are on many paths (high betweenness)
    const betweenness = await this.calculateBetweenness(10);

    for (const item of betweenness) {
      const neighborhood = this.graph.getNeighborhood(item.node, 2);
      bottlenecks.push({
        node: item.node,
        betweenness: item.score,
        impactRadius: neighborhood.nodes.length,
        type: this.classifyBottleneck(item.score, neighborhood.nodes.length)
      });
    }

    return bottlenecks;
  }

  /**
   * Calculate PageRank-style centrality
   */
  async calculatePageRank(iterations = 20, dampingFactor = 0.85) {
    const pageRank = new Map();
    const nodes = Array.from(this.graph.nodes.keys());
    const N = nodes.length;

    if (N === 0) return [];

    // Initialize PageRank values
    for (const node of nodes) {
      pageRank.set(node, 1 / N);
    }

    // Iterate
    for (let iter = 0; iter < iterations; iter++) {
      const newRank = new Map();

      for (const node of nodes) {
        let rank = (1 - dampingFactor) / N;

        // Sum contributions from incoming links
        const nodeData = this.graph.nodes.get(node);
        if (nodeData) {
          for (const caller of nodeData.callers) {
            const callerData = this.graph.nodes.get(caller);
            if (callerData) {
              const outDegree = callerData.callees.size || 1;
              rank += dampingFactor * (pageRank.get(caller) || 0) / outDegree;
            }
          }
        }

        newRank.set(node, rank);
      }

      // Update PageRank values
      for (const [node, rank] of newRank) {
        pageRank.set(node, rank);
      }
    }

    // Sort and return top results
    return Array.from(pageRank.entries())
      .map(([node, score]) => ({ node, score: score * 1000 })) // Scale for readability
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  /**
   * Calculate Betweenness Centrality
   */
  async calculateBetweenness(limit = 10) {
    const betweenness = new Map();
    const nodes = Array.from(this.graph.nodes.keys());

    // Initialize scores
    for (const node of nodes) {
      betweenness.set(node, 0);
    }

    // Sample pairs for efficiency (full calculation is O(n^3))
    const sampleSize = Math.min(50, nodes.length);
    const sampledNodes = this.sampleNodes(nodes, sampleSize);

    for (const source of sampledNodes) {
      for (const target of sampledNodes) {
        if (source === target) continue;

        const paths = this.graph.getAllPaths(source, target, 5);
        const shortestLength = Math.min(...paths.map(p => p.length));
        const shortestPaths = paths.filter(p => p.length === shortestLength);

        if (shortestPaths.length > 0) {
          for (const path of shortestPaths) {
            for (const node of path) {
              if (node !== source && node !== target) {
                betweenness.set(node, (betweenness.get(node) || 0) + 1 / shortestPaths.length);
              }
            }
          }
        }
      }
    }

    // Normalize and return top results
    const maxBetweenness = Math.max(...betweenness.values()) || 1;
    return Array.from(betweenness.entries())
      .map(([node, score]) => ({ node, score: score / maxBetweenness * 100 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Calculate Closeness Centrality
   */
  async calculateCloseness(limit = 10) {
    const closeness = new Map();
    const nodes = Array.from(this.graph.nodes.keys());

    for (const node of nodes) {
      let totalDistance = 0;
      let reachableCount = 0;

      for (const other of nodes) {
        if (node === other) continue;

        const path = this.graph.dijkstra(node, other);
        if (path) {
          totalDistance += path.length - 1;
          reachableCount++;
        }
      }

      if (reachableCount > 0) {
        closeness.set(node, reachableCount / totalDistance);
      } else {
        closeness.set(node, 0);
      }
    }

    return Array.from(closeness.entries())
      .map(([node, score]) => ({ node, score: score * 100 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Find entry points (functions with no callers)
   */
  async findEntryPoints() {
    const query = `
      [.g[]? | .[0]] as $callers |
      [.g[]? | .[1]] as $callees |
      ($callers | unique) - ($callees | unique)
    `.replace(/\n/g, ' ');

    const result = this.jq.jq(query);
    if (result) {
      try {
        return JSON.parse(result);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  /**
   * Calculate risk score
   */
  calculateRisk(centralityScore, dependencyCount) {
    const normalized = Math.min(centralityScore / 100, 1);
    const depNormalized = Math.min(dependencyCount / 20, 1);
    const risk = (normalized * 0.7 + depNormalized * 0.3) * 100;

    if (risk > 80) return 'CRITICAL';
    if (risk > 60) return 'HIGH';
    if (risk > 40) return 'MEDIUM';
    if (risk > 20) return 'LOW';
    return 'MINIMAL';
  }

  /**
   * Get hotspot recommendation
   */
  getHotspotRecommendation(type, data) {
    if (type === 'function') {
      if (data.inDegree > 20) {
        return 'Consider splitting this function or creating a facade';
      }
      if (data.outDegree > 15) {
        return 'This function has high complexity, consider refactoring';
      }
      return 'Monitor for changes and test thoroughly';
    } else {
      if (data.consumers > 15) {
        return 'Central dependency - ensure backward compatibility';
      }
      if (data.imports > 20) {
        return 'High coupling - consider splitting into modules';
      }
      return 'Key file - maintain good test coverage';
    }
  }

  /**
   * Classify bottleneck type
   */
  classifyBottleneck(betweenness, impactRadius) {
    if (betweenness > 50 && impactRadius > 30) {
      return 'CRITICAL_PATH';
    }
    if (betweenness > 30) {
      return 'COORDINATION_POINT';
    }
    if (impactRadius > 40) {
      return 'HUB';
    }
    return 'BRIDGE';
  }

  /**
   * Sample nodes for efficiency
   */
  sampleNodes(nodes, sampleSize) {
    if (nodes.length <= sampleSize) return nodes;

    const sampled = [];
    const step = Math.floor(nodes.length / sampleSize);

    for (let i = 0; i < nodes.length && sampled.length < sampleSize; i += step) {
      sampled.push(nodes[i]);
    }

    return sampled;
  }
}

export default CentralityAnalyzer;

const isMain = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

// CLI interface
if (isMain) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const analyzer = new CentralityAnalyzer(
    path.resolve(__dirname, '../../../PROJECT_INDEX.json'),
  );

  const command = process.argv[2];

  const commands = {
    all: async () => {
      const results = await analyzer.analyzeAll();
      console.log(JSON.stringify(results, null, 2));
    },
    functions: async () => {
      const results = await analyzer.calculateFunctionCentrality();
      console.log(JSON.stringify(results, null, 2));
    },
    files: async () => {
      const results = await analyzer.calculateFileCentrality();
      console.log(JSON.stringify(results, null, 2));
    },
    hotspots: async () => {
      const results = await analyzer.identifyHotspots();
      console.log(JSON.stringify(results, null, 2));
    },
    pagerank: async () => {
      const results = await analyzer.calculatePageRank();
      console.log(JSON.stringify(results, null, 2));
    },
    betweenness: async () => {
      const results = await analyzer.calculateBetweenness();
      console.log(JSON.stringify(results, null, 2));
    },
    bottlenecks: async () => {
      const results = await analyzer.identifyBottlenecks();
      console.log(JSON.stringify(results, null, 2));
    }
  };

  if (commands[command]) {
    commands[command]();
  } else {
    console.log('Available commands:', Object.keys(commands).join(', '));
  }
}
