#!/usr/bin/env node

/**
 * workflow-engine.js - High-level workflow orchestration
 * Chains operations for common development scenarios
 */

import { pathToFileURL } from 'node:url';

import JqExecutor from '../core/jq-executor.mjs';
import KnowledgeGraph from '../graph/knowledge-graph.mjs';
import PatternDetector from '../graph/pattern-detector.mjs';
import CentralityAnalyzer from '../graph/centrality-analyzer.mjs';

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|\[\]\\]/g, '\$&');

class WorkflowEngine {
  constructor(indexPath = 'PROJECT_INDEX.json') {
    this.jq = new JqExecutor(indexPath);
    this.graph = new KnowledgeGraph(indexPath);
    this.patterns = new PatternDetector(indexPath);
    this.centrality = new CentralityAnalyzer(indexPath);
  }

  /**
   * 30-60-90 Overview Generation
   */
  async overview(depth = 30) {
    const overview = {
      depth,
      timestamp: new Date().toISOString(),
      summary: {},
      details: {}
    };

    // 30-second overview
    if (depth >= 30) {
      overview.summary = {
        stats: this.jq.getStats(),
        fileCount: this.jq.getFileCount(),
        purposes: this.jq.getPurposes().slice(0, 5),
        topPages: this.jq.getPages().slice(0, 5),
        topAPIs: this.jq.getApiRoutes().slice(0, 5)
      };
    }

    // 60-second overview
    if (depth >= 60) {
      overview.details = {
        hotspots: await this.centrality.identifyHotspots(5),
        patterns: {
          circular: (await this.patterns.detectCircularDependencies()).files.length,
          orphans: (await this.patterns.detectOrphanFiles()).length,
          untested: (await this.patterns.detectMissingTests()).length
        },
        dependencies: this.jq.getDependencyHotspots(10)
      };
    }

    // 90-second overview
    if (depth >= 90) {
      await this.graph.initialize();

      overview.architecture = {
        graphStats: this.graph.getStats(),
        criticalPaths: await this.centrality.findCriticalPaths(),
        healthGrade: await this.getHealthGrade(),
        recommendations: await this.getArchitectureRecommendations()
      };
    }

    return overview;
  }

  /**
   * Feature Development Flow
   */
  async featureDevelopmentFlow(featureName) {
    const flow = {
      feature: featureName,
      timestamp: new Date().toISOString(),
      steps: []
    };

    // Step 1: Find related existing code
    flow.steps.push({
      step: 1,
      action: 'Search for related code',
      results: {
        files: this.jq.fuzzySearch(featureName, 10),
        symbols: this.searchSymbols(featureName)
      }
    });

    // Step 2: Analyze dependencies
    const relatedFiles = flow.steps[0].results.files;
    if (relatedFiles.length > 0) {
      flow.steps.push({
        step: 2,
        action: 'Analyze dependencies',
        results: {
          imports: relatedFiles.map(f => ({
            file: f,
            imports: this.jq.getImports(f)
          })),
          consumers: relatedFiles.map(f => ({
            file: f,
            consumers: this.jq.getConsumers(f)
          }))
        }
      });
    }

    // Step 3: Find integration points
    flow.steps.push({
      step: 3,
      action: 'Identify integration points',
      results: {
        routes: this.findRelevantRoutes(featureName),
        components: this.findRelevantComponents(featureName),
        tests: this.findRelevantTests(featureName)
      }
    });

    // Step 4: Impact analysis
    await this.graph.initialize();
    flow.steps.push({
      step: 4,
      action: 'Impact analysis',
      results: {
        impactedFiles: await this.calculateImpact(relatedFiles),
        riskAssessment: await this.assessRisk(featureName)
      }
    });

    // Step 5: Generate recommendations
    flow.steps.push({
      step: 5,
      action: 'Recommendations',
      results: await this.generateFeatureRecommendations(flow)
    });

    return flow;
  }

  /**
   * Bug Investigation Flow
   */
  async bugInvestigationFlow(errorPattern) {
    const investigation = {
      error: errorPattern,
      timestamp: new Date().toISOString(),
      findings: []
    };

    // Step 1: Search for error-related code
    investigation.findings.push({
      step: 1,
      action: 'Search for error patterns',
      results: {
        directMatches: this.searchForPattern(errorPattern),
        fuzzyMatches: this.jq.fuzzySearch(errorPattern, 10)
      }
    });

    // Step 2: Trace call chains
    const suspectFunctions = this.extractFunctions(investigation.findings[0].results);
    if (suspectFunctions.length > 0) {
      investigation.findings.push({
        step: 2,
        action: 'Trace call chains',
        results: suspectFunctions.map(fn => ({
          function: fn,
          callers: this.jq.getCallers(fn),
          callees: this.jq.getCallees(fn),
          neighborhood: this.jq.getTwoHopNeighborhood(fn)
        }))
      });
    }

    // Step 3: Find related tests
    investigation.findings.push({
      step: 3,
      action: 'Find related tests',
      results: {
        tests: this.findRelatedTests(investigation.findings[0].results.directMatches)
      }
    });

    // Step 4: Analyze patterns
    await this.graph.initialize();
    investigation.findings.push({
      step: 4,
      action: 'Pattern analysis',
      results: {
        commonPaths: await this.findCommonPaths(suspectFunctions),
        hotspots: await this.findNearbyHotspots(suspectFunctions)
      }
    });

    // Step 5: Generate hypothesis
    investigation.findings.push({
      step: 5,
      action: 'Generate hypothesis',
      results: await this.generateBugHypothesis(investigation)
    });

    return investigation;
  }

  /**
   * Refactoring Analysis Flow
   */
  async refactoringFlow(targetPath) {
    const analysis = {
      target: targetPath,
      timestamp: new Date().toISOString(),
      analysis: {}
    };

    // Step 1: Current state analysis
    analysis.analysis.currentState = {
      file: targetPath,
      symbols: this.getFileSymbols(targetPath),
      imports: this.jq.getImports(targetPath),
      consumers: this.jq.getConsumers(targetPath),
      tests: this.jq.getTestsForFile(targetPath)
    };

    // Step 2: Detect problems
    await this.patterns.detectAll();
    analysis.analysis.problems = {
      isGodObject: await this.checkGodObject(targetPath),
      hasCircularDeps: await this.checkCircularDeps(targetPath),
      complexity: await this.calculateComplexity(targetPath),
      coupling: await this.calculateCoupling(targetPath)
    };

    // Step 3: Impact radius
    await this.graph.initialize();
    analysis.analysis.impact = {
      directImpact: this.jq.getConsumers(targetPath),
      indirectImpact: this.graph.getImpactRadius(targetPath, 2),
      criticalPaths: await this.findPathsThroughFile(targetPath)
    };

    // Step 4: Refactoring suggestions
    analysis.analysis.suggestions = await this.generateRefactoringSuggestions(analysis);

    // Step 5: Risk assessment
    analysis.analysis.risk = {
      level: this.assessRefactoringRisk(analysis),
      mitigations: this.suggestMitigations(analysis)
    };

    return analysis;
  }

  /**
   * Helper: Search for symbols
   */
  searchSymbols(pattern) {
    return this.jq.searchSymbols(pattern);
  }



  /**
   * Helper: Find relevant routes
   */
  findRelevantRoutes(pattern) {
    if (!pattern) return [];
    const term = pattern.toLowerCase();
    const pages = this.jq.getPages();
    const apis = this.jq.getApiRoutes();
    return [...pages, ...apis].filter(route => route.toLowerCase().includes(term));
  }


  /**
   * Helper: Find relevant components
   */
  findRelevantComponents(pattern) {
    if (!pattern) return [];
    const term = pattern.toLowerCase();
    const results = this.jq.fuzzySearch(pattern, 40);
    return results.filter(file => file.includes('components/') && file.toLowerCase().includes(term));
  }


  /**
   * Helper: Find relevant tests
   */
  findRelevantTests(pattern) {
    if (!pattern) return [];
    const term = pattern.toLowerCase();
    const candidates = this.jq.fuzzySearch(pattern, 60);
    const testRegex = /(__tests__|\.test\.|\.spec\.)/i;
    return candidates.filter(file => testRegex.test(file) && file.toLowerCase().includes(term));
  }



  /**
   * Helper: Search for pattern
   */
  searchForPattern(pattern) {
    if (!pattern) return [];
    const safePattern = escapeRegex(pattern);
    const query = `
      .f | to_entries[] |
      select(.value | tostring | test("${safePattern}"; "i")) |
      .key
    `.replace(/\n/g, ' ');

    const result = this.jq.jq(query);
    return result ? result.split('\n').filter(Boolean) : [];
  }


  /**
   * Helper: Extract functions from search results
   */
  extractFunctions(results) {
    const functions = [];
    if (results.directMatches) {
      results.directMatches.forEach(file => {
        const symbols = this.getFileSymbols(file);
        functions.push(...symbols);
      });
    }
    return [...new Set(functions)];
  }

  /**
   * Helper: Get file symbols
   */
  getFileSymbols(file) {
    if (!file) return [];
    const safeFile = JSON.stringify(file);
    const query = `
      def syms(v):
        (if v|type=="array" then
          (if v[1]|type=="array" then v[1][] else [] end)
         elif (v|type=="object" and v.t?) then v.t[]
         else [] end);
      .f[${safeFile}] | syms(.) | map(split(":")[0])
    `.replace(/\n/g, ' ');

    const result = this.jq.jq(query);
    if (result) {
      try {
        return JSON.parse(result);
      } catch {
        return [];
      }
    }
    return [];
  }



  /**
   * Helper: Calculate impact
   */
  async calculateImpact(files) {
    const impacted = new Set();
    for (const file of files) {
      const consumers = this.jq.getConsumers(file);
      consumers.forEach(c => impacted.add(c));

      const radius = this.graph.getImpactRadius(file, 2);
      radius.forEach(r => impacted.add(r));
    }
    return Array.from(impacted);
  }

  /**
   * Helper: Assess risk
   */
  async assessRisk(featureName) {
    const hotspots = await this.centrality.identifyHotspots();
    const relatedHotspots = hotspots.filter(h =>
      h.name.toLowerCase().includes(featureName.toLowerCase())
    );

    if (relatedHotspots.length > 0) {
      return {
        level: 'HIGH',
        reason: 'Touches hotspot areas',
        hotspots: relatedHotspots
      };
    }

    return {
      level: 'MEDIUM',
      reason: 'Standard feature addition'
    };
  }

  /**
   * Helper: Generate feature recommendations
   */
  async generateFeatureRecommendations(flow) {
    const recommendations = [];

    // Check for existing patterns
    if (flow.steps[0].results.files.length > 0) {
      recommendations.push({
        type: 'PATTERN',
        message: 'Follow existing patterns in similar files',
        files: flow.steps[0].results.files.slice(0, 3)
      });
    }

    // Check for test requirements
    const untested = await this.patterns.detectMissingTests();
    if (untested.length > 0) {
      recommendations.push({
        type: 'TESTING',
        message: 'Add tests for new feature',
        suggestedLocation: '__tests__/' + flow.feature
      });
    }

    // Check for integration points
    if (flow.steps[2].results.routes.length > 0) {
      recommendations.push({
        type: 'INTEGRATION',
        message: 'Consider integration with existing routes',
        routes: flow.steps[2].results.routes
      });
    }

    return recommendations;
  }

  /**
   * Helper: Find related tests
   */
  findRelatedTests(files) {
    const tests = [];
    for (const file of files) {
      const fileTests = this.jq.getTestsForFile(file);
      tests.push(...fileTests);
    }
    return [...new Set(tests)];
  }

  /**
   * Helper: Find common paths
   */
  async findCommonPaths(functions) {
    if (functions.length < 2) return [];

    const paths = [];
    for (let i = 0; i < functions.length - 1; i++) {
      for (let j = i + 1; j < functions.length; j++) {
        const path = this.graph.dijkstra(functions[i], functions[j]);
        if (path) {
          paths.push({
            from: functions[i],
            to: functions[j],
            path,
            length: path.length
          });
        }
      }
    }

    return paths.sort((a, b) => a.length - b.length);
  }

  /**
   * Helper: Find nearby hotspots
   */
  async findNearbyHotspots(functions) {
    const hotspots = await this.centrality.identifyHotspots();
    const nearby = [];

    for (const fn of functions) {
      const neighborhood = this.graph.getNeighborhood(fn, 2);
      for (const hotspot of hotspots) {
        if (neighborhood.nodes.includes(hotspot.name)) {
          nearby.push({
            function: fn,
            hotspot: hotspot.name,
            distance: this.graph.dijkstra(fn, hotspot.name)?.length || -1
          });
        }
      }
    }

    return nearby;
  }

  /**
   * Helper: Generate bug hypothesis
   */
  async generateBugHypothesis(investigation) {
    const hypotheses = [];

    // Check for circular dependencies
    const circular = await this.patterns.detectCircularDependencies();
    if (circular.functions.length > 0) {
      const relevantCycles = circular.functions.filter(c =>
        c.cycle.some(fn => investigation.findings[0].results.directMatches.includes(fn))
      );
      if (relevantCycles.length > 0) {
        hypotheses.push({
          type: 'CIRCULAR_DEPENDENCY',
          confidence: 'HIGH',
          description: 'Circular dependency may cause unexpected behavior',
          evidence: relevantCycles
        });
      }
    }

    // Check for missing error handling
    const errorHandling = investigation.findings[0].results.directMatches.filter(f =>
      f.includes('error') || f.includes('catch') || f.includes('try')
    );
    if (errorHandling.length === 0) {
      hypotheses.push({
        type: 'MISSING_ERROR_HANDLING',
        confidence: 'MEDIUM',
        description: 'Missing error handling in error path'
      });
    }

    // Check for hotspot involvement
    const hotspots = investigation.findings[3].results.hotspots;
    if (hotspots.length > 0) {
      hypotheses.push({
        type: 'HOTSPOT_ISSUE',
        confidence: 'MEDIUM',
        description: 'Error occurs near high-centrality code',
        hotspots
      });
    }

    return hypotheses;
  }

  /**
   * Helper: Get health grade
   */
  async getHealthGrade() {
    const patterns = await this.patterns.detectAll();
    return patterns.summary.healthGrade;
  }

  /**
   * Helper: Get architecture recommendations
   */
  async getArchitectureRecommendations() {
    const patterns = await this.patterns.detectAll();
    return patterns.summary.recommendations;
  }

  /**
   * Helper: Check if file is god object
   */
  async checkGodObject(file) {
    const godObjects = await this.patterns.detectGodObjects();
    return godObjects.files.some(g => g.file === file);
  }

  /**
   * Helper: Check circular dependencies
   */
  async checkCircularDeps(file) {
    const circular = await this.patterns.detectCircularDependencies();
    return circular.files.some(c => c.cycle.includes(file));
  }

  /**
   * Helper: Calculate complexity
   */
  async calculateComplexity(file) {
    const symbols = this.getFileSymbols(file);
    const imports = this.jq.getImports(file);
    const consumers = this.jq.getConsumers(file);

    return {
      symbolCount: symbols.length,
      importCount: imports.length,
      consumerCount: consumers.length,
      complexityScore: symbols.length + imports.length * 2 + consumers.length * 3
    };
  }

  /**
   * Helper: Calculate coupling
   */
  async calculateCoupling(file) {
    const imports = this.jq.getImports(file);
    const consumers = this.jq.getConsumers(file);
    const totalFiles = this.jq.getFileCount();

    return {
      afferentCoupling: consumers.length,
      efferentCoupling: imports.length,
      instability: imports.length / (imports.length + consumers.length + 1),
      couplingRatio: (imports.length + consumers.length) / totalFiles
    };
  }

  /**
   * Helper: Find paths through file
   */
  async findPathsThroughFile(file) {
    const symbols = this.getFileSymbols(file);
    const paths = [];

    for (const symbol of symbols.slice(0, 5)) { // Limit for performance
      const callers = this.jq.getCallers(symbol);
      const callees = this.jq.getCallees(symbol);

      if (callers.length > 0 && callees.length > 0) {
        paths.push({
          through: symbol,
          inbound: callers.length,
          outbound: callees.length
        });
      }
    }

    return paths;
  }

  /**
   * Helper: Generate refactoring suggestions
   */
  async generateRefactoringSuggestions(analysis) {
    const suggestions = [];

    if (analysis.analysis.problems.isGodObject) {
      suggestions.push({
        type: 'SPLIT_MODULE',
        priority: 'HIGH',
        description: 'Split this module into smaller, focused modules'
      });
    }

    if (analysis.analysis.problems.hasCircularDeps) {
      suggestions.push({
        type: 'BREAK_CIRCULAR',
        priority: 'HIGH',
        description: 'Introduce abstraction to break circular dependency'
      });
    }

    if (analysis.analysis.problems.complexity.complexityScore > 100) {
      suggestions.push({
        type: 'REDUCE_COMPLEXITY',
        priority: 'MEDIUM',
        description: 'Extract functions to reduce complexity'
      });
    }

    if (analysis.analysis.problems.coupling.instability > 0.7) {
      suggestions.push({
        type: 'STABILIZE',
        priority: 'MEDIUM',
        description: 'Reduce dependencies to stabilize module'
      });
    }

    return suggestions;
  }

  /**
   * Helper: Assess refactoring risk
   */
  assessRefactoringRisk(analysis) {
    const consumerCount = analysis.analysis.currentState.consumers.length;
    const hasTests = analysis.analysis.currentState.tests.length > 0;
    const complexity = analysis.analysis.problems.complexity.complexityScore;

    if (consumerCount > 20 || complexity > 150) return 'HIGH';
    if (consumerCount > 10 || complexity > 100 || !hasTests) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Helper: Suggest mitigations
   */
  suggestMitigations(analysis) {
    const mitigations = [];

    if (!analysis.analysis.currentState.tests.length) {
      mitigations.push('Add comprehensive tests before refactoring');
    }

    if (analysis.analysis.impact.directImpact.length > 10) {
      mitigations.push('Create compatibility layer during transition');
    }

    if (analysis.analysis.risk.level === 'HIGH') {
      mitigations.push('Consider incremental refactoring approach');
      mitigations.push('Set up feature flags for gradual rollout');
    }

    return mitigations;
  }
}

export default WorkflowEngine;

const isMain = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

// CLI interface
if (isMain) {
  const engine = new WorkflowEngine();

  const command = process.argv[2];
  const arg = process.argv[3];

  const commands = {
    overview: async () => {
      const depth = parseInt(arg) || 30;
      const result = await engine.overview(depth);
      console.log(JSON.stringify(result, null, 2));
    },
    feature: async () => {
      const result = await engine.featureDevelopmentFlow(arg || 'newFeature');
      console.log(JSON.stringify(result, null, 2));
    },
    bug: async () => {
      const result = await engine.bugInvestigationFlow(arg || 'error');
      console.log(JSON.stringify(result, null, 2));
    },
    refactor: async () => {
      const result = await engine.refactoringFlow(arg || 'lib/utils.ts');
      console.log(JSON.stringify(result, null, 2));
    }
  };

  if (commands[command]) {
    commands[command]();
  } else {
    console.log('Available commands:', Object.keys(commands).join(', '));
    console.log('Usage: node workflow-engine.js <command> [arg]');
  }
}
