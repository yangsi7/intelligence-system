# CLAUDE.md — Ultimate Intelligence System

## 0. ULTRA-CRITICAL INSTRUCTIONS

### 0.1 System Overview
```
SYSTEM: Intelligence-Powered Multi-Agent Orchestration System
COMPONENTS:
  • 3 Orchestrator Patterns (meta, normal, integrated)
  • 6 Specialized Agents (orchestrator, researcher, implementor, reviewer, tester, postflight)
  • Unified Intelligence CLI (29+ commands)
  • 5 Slash Commands (/intel, /orchestrate, /search, /validate, /workflow)
  • 6 Workflow Definitions (3 built-in + 3 custom)

PURPOSE: Coordinate multi-agent workflows with deep code intelligence
```

### 0.2 Quick Start Reflection Protocol
```
WHEN session starts OR receiving any user input:
ALWAYS START by reflecting:
  ✅ What's the task? (Classify: novel/standard/analysis-heavy)
  ✅ Which orchestrator? (Use @.claude/ORCHESTRATOR_SELECTION_GUIDE.md)
  ✅ Need intelligence first? (Check if codebase is unfamiliar)
  ✅ Which tools available? (/intel, /search, /workflow, /validate)

PRIME YOURSELF (if needed):
  node .claude/improved_intelligence/code-intel.mjs preset compact
  # OR use slash command:
  /intel compact

ASK YOURSELF:
  ❓ Do I need deep code analysis before proceeding?
  ❓ Is this a standard dev workflow or custom domain?
  ❓ Can I parallelize agent work for speed?
  ❓ Which workflows/presets match this task?
```

### 0.3 Critical Files to Load
```
LOADING PRIORITY:
  1. Orchestrator selection guide:
     → @.claude/ORCHESTRATOR_SELECTION_GUIDE.md

  2. Intelligence CLI reference:
     → @.claude/improved_intelligence/README.md

  3. Slash command documentation:
     → @.claude/commands/intel.md
     → @.claude/commands/orchestrate.md
     → @.claude/commands/search.md
     → @.claude/commands/validate.md
     → @.claude/commands/workflow.md

  4. Agent definitions (as needed):
     → @.claude/agents/*.md

  5. Orchestrator patterns (as needed):
     → @.claude/orchestrators/*.md

NEVER load directly:
  ✗ PROJECT_INDEX.json (use /intel or code-intel.mjs instead)
  ✗ All agent files simultaneously (load on demand)
  ✗ All orchestrator files (select one based on task)
```

### 0.4 Scope Discipline Guards
```
BEFORE ANY ACTION:
  STOP and VERIFY:
    □ Have I selected the right orchestrator for this task?
    □ Should I run intelligence analysis before proceeding?
    □ Am I using parallel agents when possible?
    □ Am I following file-based communication patterns?
    □ Am I avoiding token waste by loading full source files?

ANTI-PATTERNS to avoid:
  ❌ Loading PROJECT_INDEX.json directly (use agents/CLI instead)
  ❌ Reading full source files (use intelligence summaries)
  ❌ Sequential agent launches (parallelize when independent)
  ❌ Skipping intelligence phase for unfamiliar codebases
  ❌ Creating custom agents when standard ones suffice
```

## 1. ORCHESTRATOR SELECTION

### 1.1 Quick Decision Tree
```
START HERE:

1. Is your task domain-specific and unusual?
   YES → Use **META ORCHESTRATOR**
   NO → Continue to #2

2. Do you need deep codebase analysis before proceeding?
   YES → Use **INTEGRATED ORCHESTRATOR**
   NO → Continue to #3

3. Does your task fit standard dev workflow (plan/implement/review)?
   YES → Use **NORMAL ORCHESTRATOR**
   NO → Return to #1 or #2
```

### 1.2 Orchestrator Capabilities

#### Meta Orchestrator
**Best for:** Novel tasks requiring custom agent creation

**Use when:**
- Task requires domain-specific expertise
- Need specialized analysis (e.g., GraphQL, Stripe, accessibility)
- Workflow requires unique tool combinations
- Experimental or one-off analyses

**Location:** `.claude/orchestrators/meta_orchestrator.md`

#### Normal Orchestrator
**Best for:** Standard multi-agent workflows with predefined agents

**Use when:**
- Task fits standard development workflow
- Using the 6 core agents
- Need straightforward orchestration
- Want fast, predictable execution

**Location:** `.claude/orchestrators/normal_orchestrator.md`

#### Integrated Orchestrator
**Best for:** Complex tasks requiring deep codebase intelligence

**Use when:**
- Task requires understanding existing architecture
- Need comprehensive code analysis first
- Working with unfamiliar or large codebases
- Require intelligence-driven planning

**Location:** `.claude/orchestrators/integrated_orchestrator.md`

### 1.3 Invocation Examples
```bash
# Use slash command
/orchestrate meta "Analyze GraphQL schema for optimizations"
/orchestrate normal "Add password reset functionality"
/orchestrate integrated "Investigate API performance bottlenecks"

# Or invoke directly (main agent chooses orchestrator)
"I need to understand the authentication flow before refactoring"
→ Claude selects INTEGRATED orchestrator automatically
```

## 2. SLASH COMMANDS

### 2.1 Intelligence Analysis (/intel)
```bash
# Quick overview (2-3k tokens, ~1s)
/intel compact

# Standard analysis (8-10k tokens, ~3s)
/intel standard

# Comprehensive analysis (15-20k tokens, ~5s)
/intel extended

# Specific commands
/intel hotspots --limit 10
/intel graph cycles
/intel trace --entry src/api/handler.ts --depth 3

📚 See @.claude/commands/intel.md for full reference
```

### 2.2 Orchestration (/orchestrate)
```bash
# Specify orchestrator type
/orchestrate meta "task description"
/orchestrate normal "task description"
/orchestrate integrated "task description"

# Auto-select (Claude chooses based on task)
/orchestrate "task description"

📚 See @.claude/commands/orchestrate.md for full reference
```

### 2.3 Code Search (/search)
```bash
# Search file contents
/search content "useEffect" --type ts

# Find files
/search files "handler"

# Find symbols/functions
/search symbol "authenticate"

# Show directory structure
/search structure

📚 See @.claude/commands/search.md for full reference
```

### 2.4 Workflow Execution (/workflow)
```bash
# Run a workflow
/workflow run workflows/security-audit.json
/workflow run .claude/workflows/performance-check.json

# List available workflows
/workflow list

📚 See @.claude/commands/workflow.md for full reference
```

### 2.5 Validation (/validate)
```bash
# Validate orchestration plan
/validate plan

# Validate agent context package
/validate context agent_123_context.md

# Validate workflow definition
/validate workflow security-audit.json

📚 See @.claude/commands/validate.md for full reference
```

## 3. INTELLIGENCE TOOLKIT

### 3.1 Code Intelligence CLI

**Main Entry Point:**
```bash
node .claude/improved_intelligence/code-intel.mjs [command] [options]
```

**Key Commands:**
- `help` - Show all available commands
- `preset compact|standard|extended` - Run predefined analysis
- `chain <file.json>` - Execute workflow from JSON
- `overview [30|60|90]` - Quick project overview
- `hotspots [limit]` - List dependency hotspots
- `patterns [type]` - Detect code smells
- `graph stats|path|cycles` - Graph operations
- `callers <function>` - Find function callers
- `deps <file>` - Show dependencies
- `feature <name>` - Feature development workflow
- `bug <pattern>` - Bug investigation workflow
- `refactor <file>` - Refactoring workflow

📚 **See @.claude/improved_intelligence/README.md for comprehensive documentation**

### 3.2 Workflow Definitions

**Built-in Chains** (in `code-intel.mjs`):
- `onboarding.json` - Quick project orientation
- `investigate.json` - Bug investigation
- `audit.json` - Comprehensive code audit

**Custom Workflows** (in `.claude/workflows/`):
- `security-audit.json` - Security analysis
- `performance-check.json` - Performance profiling
- `quick-scan.json` - Fast code scan

**Execution:**
```bash
# Built-in
node .claude/improved_intelligence/code-intel.mjs chain onboarding.json

# Custom
/workflow run .claude/workflows/security-audit.json
```

### 3.3 Analysis Presets

**Compact Preset** (~1 second, 2-3k tokens):
- File statistics
- Top 5 hotspots
- Directory structure

**Standard Preset** (~3 seconds, 8-10k tokens):
- Full overview
- Pattern detection
- Top 10 hotspots
- Basic graph statistics

**Extended Preset** (~5 seconds, 15-20k tokens):
- Everything in standard
- Detailed pattern analysis
- Top 20 hotspots
- Full graph analysis
- Circular dependency detection

**Usage:**
```bash
/intel compact        # Fast overview
/intel standard       # Balanced analysis
/intel extended       # Comprehensive audit
```

## 4. AGENT ORCHESTRATION

### 4.1 The Six Core Agents

**Orchestrator** (`.claude/agents/orchestrator.md`)
- Coordinates multi-agent workflows
- Decomposes tasks into waves
- Monitors progress and handles failures

**Researcher** (`.claude/agents/researcher.md`)
- Gathers code intelligence
- Produces analysis reports
- Maps architecture and dependencies

**Implementor** (`.claude/agents/implementor.md`)
- Executes implementation tasks
- Writes code based on specifications
- Follows TDD approach

**Reviewer** (`.claude/agents/reviewer.md`)
- Performs code review
- Validates against requirements
- Checks quality standards

**Tester** (`.claude/agents/tester.md`)
- Creates test cases
- Executes test suites
- Validates coverage

**Postflight** (`.claude/agents/postflight.md`)
- Final validation before completion
- Checks all quality gates
- Generates completion reports

### 4.2 Agent Invocation Patterns

**Parallel Pattern** (CRITICAL for performance):
```
✅ CORRECT - All Task calls in ONE message (parallel):
  Task({ subagent_type: "researcher", description: "Analyze auth" })
  Task({ subagent_type: "researcher", description: "Analyze PDF" })
  → Completes in ~2 min (parallel), not 6 min (sequential)

❌ INCORRECT - Sequential messages:
  Task({ subagent_type: "researcher", description: "Analyze auth" })
  [wait for completion]
  Task({ subagent_type: "researcher", description: "Analyze PDF" })
  → Takes 6 min total (3 min each)
```

**Sequential Pattern** (when dependencies exist):
```
1. Launch orchestrator → creates plan
2. Wait for plan completion
3. Launch implementors (parallel) → based on plan
4. Wait for implementations
5. Launch reviewers (parallel) → review implementations
6. Launch integrator → merge approved changes
```

### 4.3 Common Orchestration Workflows

**Standard Feature Development** (Normal Orchestrator):
```
orchestrator → planner → implementors (parallel) → reviewers (parallel) → integrator → postflight
```

**Intelligence-Driven Development** (Integrated Orchestrator):
```
intelligence-analyzer → aggregator → planner → implementors → reviewers → integrator → postflight
```

**Custom Domain Work** (Meta Orchestrator):
```
meta → create custom agents → dispatch custom workflow → aggregate → postflight
```

## 5. EXECUTION STANDARDS

### 5.1 Token Optimization Strategy

**Core Principle:** Never load full source files - use intelligence summaries

**Optimization Techniques:**
1. **@-reference Notation** (90% token savings):
   ```
   Instead of reading full file:
   ❌ Read entire auth.ts (5000 tokens)

   Use intelligence reference:
   ✅ @.claude/improved_intelligence/README.md (200 tokens)
   ✅ /intel hotspots --scope auth (500 tokens)
   ```

2. **Preset Selection**:
   - Use `compact` for quick context
   - Use `standard` for balanced analysis
   - Use `extended` only for comprehensive audits

3. **Workflow Chains**:
   - Define reusable analysis sequences in JSON
   - Avoid redundant scans
   - Cache results in `/workflow/outputs/`

4. **Agent Context Packages**:
   - Include only relevant excerpts
   - Reference intelligence reports via `@` notation
   - Provide line ranges instead of full files

### 5.2 File-Based Communication

**Principle:** Agents communicate only through files, never directly

**Communication Files:**
- `/workflow/planning/orchestration_plan.md` - Overall plan
- `/workflow/agent_packages/agent_{ID}_context.md` - Agent context
- `/workflow/outputs/agent_{ID}_result.md` - Agent results
- `/workflow/integration/raw_combined.md` - Aggregated results
- `/workflow/integration/final_deliverable.md` - Final output
- `/workflow/monitoring/progress.json` - Progress tracking
- `agent_{ID}_COMPLETE` - Completion signals

**Workflow:**
1. Orchestrator creates context packages
2. Agents read their context files
3. Agents execute tasks independently
4. Agents write result files
5. Agents create completion signal files
6. Orchestrator aggregates results
7. Integrator produces final deliverable

### 5.3 Intelligence-First Workflow

**When to Run Intelligence Analysis:**
- Unfamiliar codebases
- Complex refactoring tasks
- Architecture audits
- Performance investigations
- Security reviews
- Large-scale changes

**Intelligence Workflow:**
```
1. Run compact analysis:
   /intel compact
   → Get quick overview (2-3k tokens)

2. Identify areas needing deep analysis:
   Review hotspots, patterns, graph stats

3. Run targeted deep analysis:
   /intel extended --scope src/problematic-area
   → Comprehensive analysis of specific domain

4. Aggregate findings:
   Store in /workflow/outputs/intelligence_report.md

5. Package for downstream agents:
   Reference via @-notation in context packages

6. Proceed with implementation:
   Agents use intelligence context for informed decisions
```

### 5.4 Quality Gates

**Before Phase Transitions:**
```
CHECK:
  ✓ Current phase objectives met
  ✓ Required deliverables present
  ✓ Intelligence reports generated (if needed)
  ✓ Agent results validated
  ✓ Tests passing (if applicable)
  ✓ Documentation updated
```

**Before Task Completion:**
```
RUN Postflight Validation:
  □ All tests passing
  □ Type checking clean
  □ Linting passed
  □ Coverage maintained
  □ Documentation complete
  □ No architectural drift
  □ Security best practices followed
  □ Performance benchmarks met
```

## 6. BEST PRACTICES

### 6.1 Orchestrator Selection
- **Default to Integrated** for unfamiliar codebases
- **Use Normal** for routine development tasks
- **Reserve Meta** for truly specialized domains
- **Chain orchestrators** for multi-phase projects

### 6.2 Intelligence Gathering
- **Run compact first** for quick context
- **Use targeted analysis** for specific domains
- **Aggregate reports** before implementation
- **Reference via @-notation** to save tokens

### 6.3 Agent Coordination
- **Parallelize independent work** (single message, multiple Task calls)
- **Sequential for dependencies** (wait for results before next agent)
- **Monitor progress.json** to track agent states
- **Use completion signals** to coordinate waves

### 6.4 Workflow Definition
- **Create custom workflows** for repeated patterns
- **Use built-in chains** when applicable
- **Store workflows in** `.claude/workflows/`
- **Execute via** `/workflow run <file>`

### 6.5 File Management
- **Archive temporary files** after completion
- **Retain planning files** for audit
- **Use .archive/** for superseded files
- **Clean up completion signals** after aggregation

## 7. TROUBLESHOOTING

### 7.1 Common Issues

**"I'm not sure which orchestrator to use"**
→ Start with **Integrated Orchestrator** (comprehensive approach)

**"Task doesn't fit any orchestrator"**
→ Use **Meta Orchestrator** to create custom workflow

**"I need faster execution"**
→ Use **Normal Orchestrator** (skips intelligence analysis)

**"I need deep code understanding"**
→ Use **Integrated Orchestrator** (runs multiple analysis passes)

**"Agents aren't finishing"**
→ Check `/workflow/monitoring/progress.json` and completion signals

**"Intelligence analysis taking too long"**
→ Use `compact` preset instead of `extended`

**"Token budget exceeded"**
→ Use @-references instead of loading full files

### 7.2 Error Recovery

**Agent Timeout:**
1. Check agent context package for errors
2. Verify completion signal file created
3. Relaunch with corrected context
4. Document in progress.json

**Intelligence Analysis Failure:**
1. Verify PROJECT_INDEX.json exists
2. Run `/index` to regenerate
3. Check Node.js version (>=18 required)
4. Use simpler preset (compact vs extended)

**Workflow Execution Failure:**
1. Validate workflow JSON syntax
2. Check all required files exist
3. Verify slash command permissions
4. Review error logs in agent outputs

## 8. FILE LOCATIONS REFERENCE

```
.claude/
├── orchestrators/
│   ├── meta_orchestrator.md
│   ├── normal_orchestrator.md
│   └── integrated_orchestrator.md
├── agents/
│   ├── orchestrator.md
│   ├── researcher.md
│   ├── implementor.md
│   ├── reviewer.md
│   ├── tester.md
│   └── postflight.md
├── commands/
│   ├── intel.md
│   ├── orchestrate.md
│   ├── search.md
│   ├── validate.md
│   └── workflow.md
├── improved_intelligence/
│   ├── code-intel.mjs (main CLI)
│   ├── README.md (comprehensive docs)
│   └── cli/intel_mjs/src/cli/
│       ├── quick-search.mjs
│       ├── gap-analysis.mjs
│       └── sync-memory.mjs
├── workflows/
│   ├── security-audit.json
│   ├── performance-check.json
│   └── quick-scan.json
└── ORCHESTRATOR_SELECTION_GUIDE.md

/workflow/
├── planning/
│   ├── orchestration_plan.md
│   └── dependency_graph.json
├── agent_packages/
│   └── agent_{ID}_context.md
├── outputs/
│   └── agent_{ID}_result.md
├── integration/
│   ├── raw_combined.md
│   └── final_deliverable.md
└── monitoring/
    └── progress.json
```

## 9. QUICK COMMAND REFERENCE

```bash
# Intelligence Analysis
/intel compact                    # Quick overview
/intel standard src/              # Standard analysis with scope
/intel extended                   # Comprehensive audit
/intel hotspots --limit 10        # Top 10 hotspots
/intel graph cycles               # Circular dependencies

# Orchestration
/orchestrate integrated "task"    # Intelligence-first
/orchestrate normal "task"        # Standard workflow
/orchestrate meta "task"          # Custom agents

# Search
/search content "pattern"         # Search file contents
/search files "name"              # Find files
/search symbol "function"         # Find symbols
/search structure                 # Show directory tree

# Workflows
/workflow run workflows/security-audit.json
/workflow list

# Validation
/validate plan
/validate context agent_123_context.md
/validate workflow security-audit.json

# Direct CLI
node .claude/improved_intelligence/code-intel.mjs help
node .claude/improved_intelligence/code-intel.mjs preset compact
node .claude/improved_intelligence/code-intel.mjs chain onboarding.json
```

## 10. GETTING STARTED

**First-Time Setup:**
1. Ensure Node.js ≥18 installed
2. Run `/index` to generate PROJECT_INDEX.json
3. Review `@.claude/ORCHESTRATOR_SELECTION_GUIDE.md`
4. Run `/intel compact` for quick overview

**For Each New Task:**
1. Classify task type (novel/standard/analysis-heavy)
2. Select appropriate orchestrator
3. Run intelligence analysis if needed
4. Invoke orchestrator with task description
5. Monitor progress via progress.json
6. Validate with postflight checks

**Example Session:**
```bash
# 1. Get quick codebase overview
/intel compact

# 2. Identify hotspots needing attention
/intel hotspots --limit 10

# 3. Run comprehensive audit
/intel extended

# 4. Invoke orchestrator with intelligence
/orchestrate integrated "Refactor authentication system for better security"

# 5. Monitor progress
[Orchestrator coordinates agents automatically]

# 6. Review final deliverable
[Check /workflow/integration/final_deliverable.md]
```

---

**System Version:** 1.0.0
**Last Updated:** 2025-10-11
**Documentation:** See `.claude/improved_intelligence/README.md` and `.claude/ORCHESTRATOR_SELECTION_GUIDE.md`
**Support:** Review agent definitions in `.claude/agents/*.md` for detailed capabilities

---

*Ultimate Intelligence System — Intelligence-Driven Multi-Agent Orchestration*
