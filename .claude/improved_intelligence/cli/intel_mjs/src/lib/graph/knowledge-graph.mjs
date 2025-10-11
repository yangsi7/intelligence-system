#!/usr/bin/env node

/**
 * knowledge-graph.js - Build and query code knowledge graph
 * Transforms PROJECT_INDEX.json into a navigable graph structure
 */

import { pathToFileURL } from 'node:url';

import JqExecutor from '../core/jq-executor.mjs';

class KnowledgeGraph {
  constructor(indexPath = 'PROJECT_INDEX.json') {
    this.jq = new JqExecutor(indexPath);
    this.nodes = new Map(); // symbol -> node
    this.edges = new Map(); // symbol -> Set of connected symbols
    this.fileNodes = new Map(); // file -> metadata
    this.initialized = false;
  }

  /**
   * Build graph from PROJECT_INDEX.json
   */
  async initialize() {
    if (this.initialized) return;

    // Build file nodes from .f
    const files = this.jq.jq('.f | keys[]');
    if (files) {
      files.split('\n').filter(Boolean).forEach(file => {
        this.fileNodes.set(file, {
          type: 'file',
          path: file,
          imports: [],
          exports: [],
          consumers: [],
          symbols: []
        });
      });
    }

    // Build symbol nodes and edges from .g (call graph)
    const edges = this.jq.jq('.g[]? | @json');
    if (edges) {
      edges.split('\n').filter(Boolean).forEach(edge => {
        try {
          const [caller, callee] = JSON.parse(edge);

          // Create nodes if they don't exist
          if (!this.nodes.has(caller)) {
            this.nodes.set(caller, {
              name: caller,
              type: 'function',
              callers: new Set(),
              callees: new Set(),
              file: this.findFileForSymbol(caller)
            });
          }
          if (!this.nodes.has(callee)) {
            this.nodes.set(callee, {
              name: callee,
              type: 'function',
              callers: new Set(),
              callees: new Set(),
              file: this.findFileForSymbol(callee)
            });
          }

          // Add edges
          this.nodes.get(caller).callees.add(callee);
          this.nodes.get(callee).callers.add(caller);

          // Build edge map for traversal
          if (!this.edges.has(caller)) {
            this.edges.set(caller, new Set());
          }
          this.edges.get(caller).add(callee);
        } catch (e) {
          // Skip malformed edges
        }
      });
    }

    // Build dependency edges from .deps
    const deps = this.jq.jq('.deps | to_entries[] | {from: .key, to: .value[]} | @json');
    if (deps) {
      deps.split('\n').filter(Boolean).forEach(dep => {
        try {
          const {from, to} = JSON.parse(dep);
          const fromNode = this.fileNodes.get(from);
          const toNode = this.fileNodes.get(to);

          if (fromNode && toNode) {
            fromNode.imports.push(to);
            toNode.consumers.push(from);
          }
        } catch (e) {
          // Skip malformed deps
        }
      });
    }

    this.initialized = true;
  }

  /**
   * Find which file contains a symbol
   */
  findFileForSymbol(symbol) {
    const query = `
      def syms(v):
        (if v|type=="array" then
          (if v[1]|type=="array" then v[1][] else [] end)
         elif (v|type=="object" and v.t?) then v.t[]
         else [] end);
      .f | to_entries[] | . as $e |
      syms($e.value) as $sym |
      select($sym|type=="string" and ($sym|contains(":"))) |
      select(($sym | split(":")[0]) == "${symbol.split(':')[0]}")
      | $e.key
    `.replace(/\n/g, ' ');

    const result = this.jq.jq(query);
    return result ? result.split('\n')[0] : null;
  }

  /**
   * Breadth-First Search
   */
  bfs(start, target = null, maxDepth = -1) {
    if (!this.edges.has(start)) return [];

    const visited = new Set();
    const queue = [{node: start, depth: 0, path: [start]}];
    const paths = [];

    while (queue.length > 0) {
      const {node, depth, path} = queue.shift();

      if (visited.has(node)) continue;
      visited.add(node);

      if (node === target) {
        return path; // Return first path found
      }

      if (maxDepth !== -1 && depth >= maxDepth) continue;

      const neighbors = this.edges.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push({
            node: neighbor,
            depth: depth + 1,
            path: [...path, neighbor]
          });
        }
      }
    }

    return target ? null : Array.from(visited);
  }

  /**
   * Depth-First Search
   */
  dfs(start, target = null, visited = new Set(), path = []) {
    if (visited.has(start)) return null;

    visited.add(start);
    path.push(start);

    if (start === target) {
      return [...path];
    }

    const neighbors = this.edges.get(start) || new Set();
    for (const neighbor of neighbors) {
      const result = this.dfs(neighbor, target, visited, path);
      if (result) return result;
    }

    path.pop();
    return null;
  }

  /**
   * Dijkstra's shortest path
   * All edges have weight 1 for now
   */
  dijkstra(start, target) {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set(this.nodes.keys());

    // Initialize distances
    for (const node of this.nodes.keys()) {
      distances.set(node, node === start ? 0 : Infinity);
    }

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let current = null;
      let minDistance = Infinity;
      for (const node of unvisited) {
        if (distances.get(node) < minDistance) {
          current = node;
          minDistance = distances.get(node);
        }
      }

      if (!current || minDistance === Infinity) break;
      if (current === target) break;

      unvisited.delete(current);

      // Update distances to neighbors
      const neighbors = this.edges.get(current) || new Set();
      for (const neighbor of neighbors) {
        if (!unvisited.has(neighbor)) continue;

        const alt = distances.get(current) + 1; // Weight = 1
        if (alt < distances.get(neighbor)) {
          distances.set(neighbor, alt);
          previous.set(neighbor, current);
        }
      }
    }

    // Reconstruct path
    if (!previous.has(target)) return null;

    const path = [];
    let current = target;
    while (current !== undefined) {
      path.unshift(current);
      current = previous.get(current);
    }

    return path[0] === start ? path : null;
  }

  /**
   * Get all paths between two nodes
   */
  getAllPaths(start, target, maxLength = 10) {
    const paths = [];
    const visited = new Set();

    const dfsAllPaths = (node, currentPath) => {
      if (currentPath.length > maxLength) return;
      if (node === target) {
        paths.push([...currentPath]);
        return;
      }

      visited.add(node);
      const neighbors = this.edges.get(node) || new Set();

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfsAllPaths(neighbor, [...currentPath, neighbor]);
        }
      }
      visited.delete(node);
    };

    dfsAllPaths(start, [start]);
    return paths;
  }

  /**
   * Get k-hop neighborhood
   */
  getNeighborhood(node, k = 2) {
    const visited = new Set();
    const levels = [];

    for (let hop = 0; hop <= k; hop++) {
      const currentLevel = new Set();

      if (hop === 0) {
        currentLevel.add(node);
      } else {
        const prevLevel = levels[hop - 1];
        for (const prevNode of prevLevel) {
          const neighbors = this.edges.get(prevNode) || new Set();
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              currentLevel.add(neighbor);
            }
          }
        }
      }

      levels.push(currentLevel);
      currentLevel.forEach(n => visited.add(n));
    }

    return {
      nodes: Array.from(visited),
      levels: levels.map(level => Array.from(level))
    };
  }

  /**
   * Get strongly connected components
   */
  getStronglyConnectedComponents() {
    const components = [];
    const visited = new Set();

    for (const node of this.nodes.keys()) {
      if (visited.has(node)) continue;

      const component = new Set();
      const stack = [node];

      while (stack.length > 0) {
        const current = stack.pop();
        if (visited.has(current)) continue;

        visited.add(current);
        component.add(current);

        // Add all reachable nodes
        const neighbors = this.edges.get(current) || new Set();
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }

      if (component.size > 1) {
        components.push(Array.from(component));
      }
    }

    return components;
  }

  /**
   * Find cycles in the graph
   */
  findCycles() {
    const cycles = [];
    const visited = new Set();
    const recursionStack = new Set();

    const hasCycle = (node, path = []) => {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const neighbors = this.edges.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (hasCycle(neighbor, [...path])) {
            return true;
          }
        } else if (recursionStack.has(neighbor)) {
          // Found a cycle
          const cycleStart = path.indexOf(neighbor);
          if (cycleStart !== -1) {
            cycles.push(path.slice(cycleStart));
          }
          return true;
        }
      }

      recursionStack.delete(node);
      return false;
    };

    for (const node of this.nodes.keys()) {
      if (!visited.has(node)) {
        hasCycle(node);
      }
    }

    return cycles;
  }

  /**
   * Get impact radius of changes to a file
   */
  getImpactRadius(file, maxHops = 2) {
    const impacted = new Set();
    const queue = [{file, hop: 0}];
    const visited = new Set();

    while (queue.length > 0) {
      const {file: currentFile, hop} = queue.shift();

      if (visited.has(currentFile) || hop > maxHops) continue;
      visited.add(currentFile);

      const fileNode = this.fileNodes.get(currentFile);
      if (!fileNode) continue;

      // Add consumers
      for (const consumer of fileNode.consumers) {
        impacted.add(consumer);
        if (hop < maxHops) {
          queue.push({file: consumer, hop: hop + 1});
        }
      }
    }

    return Array.from(impacted);
  }

  /**
   * Get critical path (longest path) in DAG
   */
  getCriticalPath() {
    const topological = this.topologicalSort();
    if (!topological) return null; // Has cycles

    const distances = new Map();
    const previous = new Map();

    // Initialize distances
    for (const node of topological) {
      distances.set(node, 0);
    }

    // Process in topological order
    for (const node of topological) {
      const neighbors = this.edges.get(node) || new Set();
      for (const neighbor of neighbors) {
        const newDist = distances.get(node) + 1;
        if (newDist > distances.get(neighbor)) {
          distances.set(neighbor, newDist);
          previous.set(neighbor, node);
        }
      }
    }

    // Find node with maximum distance
    let maxDist = 0;
    let endNode = null;
    for (const [node, dist] of distances) {
      if (dist > maxDist) {
        maxDist = dist;
        endNode = node;
      }
    }

    // Reconstruct path
    const path = [];
    let current = endNode;
    while (current !== undefined) {
      path.unshift(current);
      current = previous.get(current);
    }

    return path;
  }

  /**
   * Topological sort (returns null if cycle exists)
   */
  topologicalSort() {
    const visited = new Set();
    const stack = [];
    const recursionStack = new Set();

    const visit = (node) => {
      visited.add(node);
      recursionStack.add(node);

      const neighbors = this.edges.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (recursionStack.has(neighbor)) {
          return false; // Cycle detected
        }
        if (!visited.has(neighbor)) {
          if (!visit(neighbor)) return false;
        }
      }

      recursionStack.delete(node);
      stack.unshift(node);
      return true;
    };

    for (const node of this.nodes.keys()) {
      if (!visited.has(node)) {
        if (!visit(node)) return null;
      }
    }

    return stack;
  }

  /**
   * Export to DOT format for visualization
   */
  toDOT(subgraph = null) {
    const nodes = subgraph || this.nodes.keys();
    let dot = 'digraph G {\n';
    dot += '  rankdir=LR;\n';
    dot += '  node [shape=box];\n';

    const included = new Set(nodes);

    for (const node of included) {
      const neighbors = this.edges.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (included.has(neighbor)) {
          dot += `  "${node}" -> "${neighbor}";\n`;
        }
      }
    }

    dot += '}\n';
    return dot;
  }

  /**
   * Get graph statistics
   */
  getStats() {
    const stats = {
      nodeCount: this.nodes.size,
      edgeCount: 0,
      fileCount: this.fileNodes.size,
      avgDegree: 0,
      maxInDegree: 0,
      maxOutDegree: 0,
      componentCount: 0,
      cycleCount: 0
    };

    // Count edges and degrees
    let totalDegree = 0;
    for (const [node, data] of this.nodes) {
      const outDegree = data.callees.size;
      const inDegree = data.callers.size;

      stats.edgeCount += outDegree;
      totalDegree += outDegree + inDegree;
      stats.maxOutDegree = Math.max(stats.maxOutDegree, outDegree);
      stats.maxInDegree = Math.max(stats.maxInDegree, inDegree);
    }

    stats.avgDegree = stats.nodeCount > 0 ? totalDegree / stats.nodeCount : 0;
    stats.componentCount = this.getStronglyConnectedComponents().length;
    stats.cycleCount = this.findCycles().length;

    return stats;
  }
}

export default KnowledgeGraph;

const isMain = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

// CLI interface
if (isMain) {
  const graph = new KnowledgeGraph();

  graph.initialize().then(() => {
    const command = process.argv[2];
    const arg1 = process.argv[3];
    const arg2 = process.argv[4];

    const commands = {
      stats: () => console.log(graph.getStats()),
      path: () => console.log(graph.dijkstra(arg1, arg2)),
      allpaths: () => console.log(graph.getAllPaths(arg1, arg2)),
      neighborhood: () => console.log(graph.getNeighborhood(arg1, parseInt(arg2) || 2)),
      cycles: () => console.log(graph.findCycles()),
      components: () => console.log(graph.getStronglyConnectedComponents()),
      impact: () => console.log(graph.getImpactRadius(arg1, parseInt(arg2) || 2)),
      critical: () => console.log(graph.getCriticalPath()),
      dot: () => console.log(graph.toDOT())
    };

    if (commands[command]) {
      commands[command]();
    } else {
      console.log('Available commands:', Object.keys(commands).join(', '));
    }
  });
}
