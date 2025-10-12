# Code Analysis Session Example

## Scenario

**Task:** Investigate performance bottlenecks in API endpoints

**User Request:**
> "Our API endpoints are responding slowly. Some users are reporting 5-10 second response times. Can you investigate what's causing the performance bottleneck? Focus on the /api/data and /api/search endpoints."

## Session Overview

- **Session ID:** `b8e4d9f3-0c2e-5a7f-9d3b-2e6f0a9c4d8f`
- **Task Type:** Analysis-heavy investigation
- **Complexity:** High
- **Orchestrator:** Integrated (intelligence-first approach)
- **Duration:** ~65 minutes
- **Total Tokens:** ~48,000 / 150,000 budget

## Workflow Progression

### Phase 1: Context (Completed)
- Restated user goals: identify and fix API performance bottlenecks
- Classified task as "analysis-heavy" requiring deep code understanding
- Selected Integrated orchestrator
- Initialized session files with extended intelligence budget
- Created planning document with 8 phases (includes Analysis phase)

### Phase 2: Analysis (Completed - Intelligence Phase)
This phase is unique to the Integrated orchestrator.

**Multi-Pass Intelligence Gathering:**
- Pass 1: Compact preset - Quick overview (2 minutes, 2,000 tokens)
- Pass 2: Standard preset - Identified top 20 hotspots (4 minutes, 8,000 tokens)
- Pass 3: Extended preset with scope - Deep dive on /api directory (8 minutes, 15,000 tokens)
- Pass 4: Graph analysis - Circular dependencies, call paths (3 minutes, 3,000 tokens)

**Intelligence Findings:**
- Identified 3 critical performance anti-patterns
- Found N+1 query problem in data endpoint
- Discovered missing database indexes
- Uncovered inefficient serialization in search endpoint
- Mapped circular dependency causing memory leaks

**Intelligence Shared:** All agents received @ reference to intelligence report (near-zero token cost)

### Phase 3: Research (Completed)
- External research on optimization best practices
- Gathered information on database indexing strategies
- Reviewed caching patterns for similar use cases
- Documented findings in workbook

### Phase 4: Brainstorm (Completed)
- Generated 5 potential approaches to fix bottlenecks
- Evaluated each approach (effort vs impact)
- Selected multi-pronged optimization strategy
- Documented decision rationale

### Phase 5: Planning (Completed)
- Decomposed fixes into 8 tasks
- Prioritized by impact (fix N+1 queries first)
- Allocated 2 waves of agent execution
- Created detailed implementation plan

### Phase 6: Execution (Completed)

**Wave 1: Critical Fixes** (parallel)
- Agent 1: implementor - Fix N+1 queries in data endpoint
- Agent 2: implementor - Add missing database indexes
- Agent 3: implementor - Optimize search serialization
- Duration: 18 minutes (parallel)

**Wave 2: Validation** (parallel)
- Agent 1: reviewer - Code review all optimizations
- Agent 2: tester - Run performance benchmarks
- Duration: 12 minutes (parallel)

### Phase 7: Review (Completed)
- Validated all optimizations working
- Confirmed no regressions introduced
- Verified performance improvements:
  - /api/data: 8.5s → 0.3s (96% improvement)
  - /api/search: 6.2s → 0.8s (87% improvement)
- Approved for deployment

### Phase 8: Delivery (Completed)
- Integrated all optimizations
- Generated performance comparison report
- Documented optimization techniques
- Created deployment checklist

## Key Learnings

### 1. Intelligence-First Approach
The Integrated orchestrator ran comprehensive intelligence analysis BEFORE any implementation:
- Multiple intelligence passes (compact → standard → extended)
- Scoped deep-dive on problem areas
- Graph analysis for architectural insights
- Token cost: 28,000 tokens for intelligence
- Token savings: Shared via @ references to 5 agents (near-zero cost)

### 2. Multi-Pass Intelligence Pattern
**Pass 1 (Compact):** Quick overview identified suspicious API directory
**Pass 2 (Standard):** Hotspot analysis pinpointed data.ts and search.ts
**Pass 3 (Extended + Scoped):** Deep analysis revealed N+1 queries, missing indexes
**Pass 4 (Graph):** Found circular dependency causing memory leak

Each pass refined the focus, avoiding wasteful broad analysis.

### 3. Research Phase Integration
After intelligence gathering, the Research phase:
- Validated findings against external best practices
- Gathered additional optimization techniques
- Ensured proposed fixes aligned with industry standards

### 4. Impact-Driven Prioritization
Brainstorm phase evaluated 5 approaches by effort/impact:
1. Fix N+1 queries (HIGH impact, MEDIUM effort) ✓ Selected
2. Add database indexes (HIGH impact, LOW effort) ✓ Selected
3. Implement caching layer (MEDIUM impact, HIGH effort) ✗ Deferred
4. Optimize serialization (HIGH impact, LOW effort) ✓ Selected
5. Scale horizontally (LOW impact, HIGH cost) ✗ Rejected

### 5. Performance Metrics Tracking
Tester agent ran benchmarks before/after:

| Endpoint | Before | After | Improvement |
|----------|--------|-------|-------------|
| /api/data (100 items) | 8.5s | 0.3s | 96% |
| /api/data (1000 items) | 45s | 2.1s | 95% |
| /api/search (simple) | 6.2s | 0.8s | 87% |
| /api/search (complex) | 12.4s | 1.6s | 87% |

## Files in This Example

### planning-b8e4d9f3-0c2e-5a7f-9d3b-2e6f0a9c4d8f.json
Contains:
- Task classification (analysis-heavy, high complexity)
- 8 phases with completion status (includes Analysis phase)
- 8 tasks with dependencies and impact scores
- Extended token budget for intelligence (50,000 allocated)
- Performance requirements and benchmarks
- Intelligence findings summary

### todo-b8e4d9f3-0c2e-5a7f-9d3b-2e6f0a9c4d8f.json
Contains:
- 18 todos across 8 tasks
- Intelligence gathering todos (4 passes)
- Implementation todos with priority
- Benchmark validation todos
- Agent assignments with intelligence references
- Before/after performance metrics

### workbook-b8e4d9f3-0c2e-5a7f-9d3b-2e6f0a9c4d8f.json
Contains:
- 12 insights from intelligence analysis
- 4 key decisions (approach selection, prioritization)
- 3 architecture diagrams (N+1 query pattern, optimized flow, index strategy)
- 2 performance benchmark tables
- Research findings on optimization patterns
- Root cause analysis documentation

### events-b8e4d9f3-0c2e-5a7f-9d3b-2e6f0a9c4d8f.json
Contains:
- 56 events chronicling intelligence-first workflow
- Multiple intelligence_started/intelligence_completed events
- Research phase events
- Brainstorm decision events
- Implementation and benchmarking events
- Performance improvement milestones

## Extracting This Session

```bash
cd /path/to/project
./scripts/extract-session-context.sh b8e4d9f3-0c2e-5a7f-9d3b-2e6f0a9c4d8f
```

Output will show:
- Task description and analysis-heavy classification
- 8 phases (including Analysis phase unique to Integrated orchestrator)
- Token usage (48,000 / 150,000 with 28K for intelligence)
- Intelligence findings summary
- Performance improvements achieved
- Recent insights and research findings

## Agent Coordination Pattern

This example demonstrates the **Intelligence-First Pattern** (Integrated Orchestrator):

```
orchestrator (planning)
    ↓
intelligence-analyzer (multi-pass analysis)
    ↓ @ reference shared to all
aggregator (synthesize findings)
    ↓
researcher (external validation)
    ↓
brainstormer (approach generation)
    ↓
planner (impact-driven prioritization)
    ↓
implementors (parallel critical fixes)
    ↓
reviewers + benchmarkers (parallel validation)
    ↓
integrator (final assembly)
    ↓
postflight (performance validation)
```

## Intelligence Analysis Highlights

### Finding 1: N+1 Query Problem
```markdown
**Severity:** Critical
**Location:** src/api/data.ts:45-67
**Pattern:** getData() makes 1 query for items, then N queries for relationships
**Impact:** 100 items = 101 database queries (8.5s response time)
**Solution:** Use JOIN or eager loading to fetch relationships in single query
**Expected Improvement:** ~95% reduction in database calls
```

### Finding 2: Missing Database Indexes
```markdown
**Severity:** High
**Tables:** items, users, relationships
**Missing Indexes:**
  - items.user_id (foreign key not indexed)
  - users.email (frequently queried)
  - relationships.item_id (join key)
**Impact:** Full table scans on every query
**Solution:** Add composite indexes on frequently queried columns
**Expected Improvement:** ~80% query time reduction
```

### Finding 3: Inefficient Serialization
```markdown
**Severity:** High
**Location:** src/api/search.ts:89-102
**Pattern:** JSON.stringify() called on every object in loop
**Impact:** O(n) serialization performance for n items
**Solution:** Batch serialize or use streaming serialization
**Expected Improvement:** ~70% serialization time reduction
```

## Workbook Highlights

### Decision: Multi-Pronged Optimization
```markdown
**Title:** Prioritize quick wins over architectural refactoring
**Rationale:** Analysis showed three HIGH impact, LOW/MEDIUM effort fixes that could be completed in one session:
1. Fix N+1 queries (MEDIUM effort, HIGH impact) - 18 min
2. Add database indexes (LOW effort, HIGH impact) - 10 min
3. Optimize serialization (LOW effort, HIGH impact) - 12 min

Total: 40 minutes of work for 90%+ performance improvement.

Deferred caching layer (HIGH effort, MEDIUM impact) to future iteration.

**Related Phase:** Brainstorm
**Tags:** prioritization, quick-wins, technical-debt
```

### Insight: Intelligence Token Efficiency
```markdown
**Title:** 28K intelligence tokens saved 50K+ implementation tokens
**Content:** Running comprehensive intelligence analysis up-front (28,000 tokens across 4 passes) allowed all downstream agents to reference findings via @ notation. Estimated savings:
- 5 agents × 10K tokens each = 50K tokens if each ran own analysis
- Actual cost: 28K (intelligence) + ~0K (@ references) = 28K tokens
- Net savings: 22K tokens (44% reduction)

Additionally, precise problem identification prevented wasted implementation effort on wrong solutions.

**Related Phase:** Analysis
**Tags:** token-optimization, efficiency, intelligence
```

## Success Metrics

- ✓ Performance bottlenecks identified (3 critical issues)
- ✓ Root causes documented with code locations
- ✓ Optimizations implemented and tested
- ✓ 96% improvement in /api/data response time (8.5s → 0.3s)
- ✓ 87% improvement in /api/search response time (6.2s → 0.8s)
- ✓ Zero regressions introduced
- ✓ Test coverage maintained (91%)
- ✓ Performance benchmarks documented
- ✓ Deployment checklist created
- ✓ Token budget: 48K / 150K (32% usage)

## Intelligence vs Standard Orchestrator Comparison

| Aspect | Integrated (This Example) | Normal Orchestrator |
|--------|---------------------------|---------------------|
| Intelligence Phase | ✓ Multi-pass analysis (28K tokens) | ✗ Skipped or minimal |
| Problem Identification | Precise (N+1, indexes, serialization) | Trial-and-error |
| Token Efficiency | @ references save 22K tokens | Each agent analyzes independently |
| Implementation Accuracy | High (targeted fixes) | Medium (broader exploration) |
| Total Duration | 65 minutes | ~90 minutes (more iterations) |
| Wasted Effort | Minimal (intelligence-guided) | Higher (some false starts) |

## Next Steps (Post-Session)

1. Deploy optimizations to staging
2. Run load tests with production traffic patterns
3. Monitor performance metrics (response times, database load)
4. Evaluate caching layer implementation (deferred HIGH effort item)
5. Document optimization patterns for team

---

**Related Documentation:**
- Process followed: `@ops/claude-process.md` (full 8-module flow)
- Rules applied: `@principles/claude-rules.md` (intelligence gathered once)
- Orchestrator used: `@.claude/orchestrators/integrated_orchestrator.md`
- Intelligence CLI: `@.claude/improved_intelligence/README.md` (multi-pass analysis)
