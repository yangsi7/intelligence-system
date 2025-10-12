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

## 6. SESSION MANAGEMENT & WORKFLOW PROCESSES

### 6.1 Session Management Overview

Every task execution is tracked through a unified session management system that maintains state across all workflow phases and agents. This ensures complete auditability, resumability, and progress tracking.

**Core Components:**
- **Planning State** - Task classification, phase tracking, token budget
- **Todo Tracking** - Granular task completion with agent assignments
- **Workbook** - Insights, decisions, diagrams, and notes
- **Event Stream** - Complete audit trail of all actions

### 6.2 Workflow Process Modules

The system follows an 8-module workflow process adapted from Manus-inspired agentic principles:

```
Context → Analysis → Research → Brainstorm → Planning → Execution → Review → Delivery
```

**Full Process Documentation:**
📚 @ops/claude-process.md

**Key Process Principles:**
1. **Research First, Act Later** - Never implement without context
2. **Intelligence Gathered Once** - Share via `@` references
3. **File-Based Communication** - Agents never communicate directly
4. **Parallel Execution** - Maximize concurrency
5. **Quality Gates** - Validate before each phase transition
6. **Complete Outputs** - Never use placeholders

**Module Overview:**

| Module | Purpose | Outputs |
|--------|---------|---------|
| **Context** | Understand goals, classify task, select orchestrator | Planning docs, session files |
| **Analysis** | Run intelligence analysis, map architecture | Shared intelligence context |
| **Research** | Gather external information, validate sources | Research report |
| **Brainstorm** | Generate approaches, evaluate alternatives | Decision documentation |
| **Planning** | Decompose tasks, assign agents, allocate tokens | Implementation plan, todos |
| **Execution** | Dispatch agents, monitor progress, handle failures | Agent results |
| **Review** | Validate outputs, check requirements | Review report, issues |
| **Delivery** | Aggregate results, apply changes, validate | Final deliverable |

### 6.3 Coordination Rules & Standards

Comprehensive operational rules govern agent behavior, communication, and quality:

📚 @principles/claude-rules.md

**Critical Rules:**
- **Rule 1:** File-Based Communication Only
- **Rule 2:** Intelligence Gathered Once
- **Rule 3:** Parallel Execution via Single Message
- **Rule 4:** Use @ References for Zero-Token Loading
- **Rule 5:** Session State Management
- **Rule 6:** Shared Resource Access Protocol

**Rule Categories:**
- Planning Rules (when/how to create plans)
- Todo Rules (tracking and updating)
- Writing Rules (formatting and completeness)
- Coding Rules (tests, style, documentation)
- File Rules (manipulation and cleanup)
- Shell Rules (command chaining, safety)
- Browser/Research Rules (source validation)
- Error Handling Rules (interpretation, recovery)
- Agent-Specific Rules (responsibilities by role)
- Quality Standards (completeness, coverage, security)
- Token Optimization Rules (progressive disclosure)
- Anti-Patterns (things to never do)

### 6.4 Session State Files

All session state is tracked in JSON files with unique session IDs to prevent collisions:

**Session Directory Structure:**
```
session/
├── planning-<sessionId>.json     # Task classification, phases, requirements
├── todo-<sessionId>.json          # Granular task tracking with agents
├── workbook-<sessionId>.json      # Insights, decisions, diagrams
└── events-<sessionId>.json        # Complete event audit trail
```

**Session File Templates:**
- @templates/planning-session.json
- @templates/todo-session.json
- @templates/workbook-session.json
- @templates/event-stream-session.json

**Session State Access Matrix:**

| Resource | Main Agent | Orchestrator | Agents |
|----------|------------|--------------|--------|
| planning-*.json | R/W | R/W | R (via @) |
| todo-*.json | R/W | R/W | R/W (own todos) |
| workbook-*.json | R/W | R/W | R/W (append only) |
| events-*.json | R/W | R/W | W (append only) |

**Creating Session Files:**
```bash
# Generate new session ID
SESSION_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')

# Initialize from templates
cp templates/planning-session.json session/planning-$SESSION_ID.json
cp templates/todo-session.json session/todo-$SESSION_ID.json
cp templates/workbook-session.json session/workbook-$SESSION_ID.json
cp templates/event-stream-session.json session/events-$SESSION_ID.json

# Update sessionId in all files
for file in session/*-$SESSION_ID.json; do
  # Use jq to update sessionId field
  jq --arg sid "$SESSION_ID" '.sessionId = $sid' "$file" > "$file.tmp"
  mv "$file.tmp" "$file"
done
```

### 6.5 Session Context Extraction

Extract and view current session context with a single command:

**Usage:**
```bash
# Extract most recent session
./scripts/extract-session-context.sh

# Extract specific session
./scripts/extract-session-context.sh <session-id>
```

**Output Includes:**
- Task summary and classification
- Phase progress
- Token usage
- Requirements status
- Todo progress (completed, in-progress, pending)
- Key insights and decisions
- Recent events (last 30)
- Agent activity summary

**Example Output:**
```
═══════════════════════════════════════════════════════════════
Session Context Report
═══════════════════════════════════════════════════════════════

Session ID: 550e8400-e29b-41d4-a716-446655440000
Generated: 2025-10-12T14:30:00Z

## Planning Context

Task: Add password reset functionality
Classification: standard, medium, standard
Orchestrator: normal
Current Phase: Execution

Phase Progress:
- [x] Context (completed)
- [x] Analysis (completed)
- [ ] Research (skipped)
- [x] Brainstorm (completed)
- [x] Planning (completed)
- [ ] Execution (in_progress)
- [ ] Review (pending)
- [ ] Delivery (pending)

Token Budget: 45k / 200k (22%)

## Todo Progress

Summary: 2/5 completed (1 in progress, 2 pending, 0 failed)

Currently Working On:
- Implement password reset endpoint (assigned to: implementor)
  Active form: Implementing password reset endpoint

Recently Completed:
- ✓ Research auth patterns (by researcher)
- ✓ Create implementation plan (by orchestrator)

...
```

### 6.6 Workbook Usage

The workbook serves as a shared scratchpad for capturing insights, decisions, and diagrams:

**Entry Types:**
- **note** - General observations or reminders
- **insight** - Key discoveries or realizations
- **decision** - Architectural or implementation choices
- **diagram** - ASCII art or visual representations
- **brainstorm** - Generated ideas or approaches
- **question** - Open questions needing answers
- **answer** - Answers to previously asked questions
- **reflection** - Meta-analysis of progress or approach

**Adding Workbook Entries:**
```json
{
  "entries": [{
    "id": "<uuid>",
    "timestamp": "2025-10-12T14:30:00Z",
    "type": "decision",
    "title": "Use JWT for password reset tokens",
    "content": "After evaluating options, chose JWT with 1-hour expiry...",
    "author": "main",
    "relatedPhase": "Brainstorm",
    "tags": ["security", "architecture"],
    "priority": "high"
  }]
}
```

**Agents can read workbook entries to understand context and decisions made earlier in the workflow.**

### 6.7 Event Stream Tracking

Every significant action is logged to the event stream for complete auditability:

**Event Types:**
- Session lifecycle (started, ended)
- Phase transitions (started, completed)
- Agent operations (launched, completed, failed)
- Task operations (started, completed, failed)
- Todo updates (created, updated, completed, failed)
- Intelligence operations (started, completed)
- Errors and warnings
- Quality gate results
- Decisions made
- File operations
- User interactions

**Querying Events:**
```bash
# Get recent events
jq '.events | sort_by(.timestamp) | reverse | .[0:30]' session/events-<sessionId>.json

# Get errors only
jq '.events[] | select(.severity == "error")' session/events-<sessionId>.json

# Get agent activity
jq '.events[] | select(.eventType | startswith("agent_"))' session/events-<sessionId>.json

# Get events for specific phase
jq '.events[] | select(.details.phaseId == "Execution")' session/events-<sessionId>.json
```

## 7. BEST PRACTICES

### 7.1 Orchestrator Selection
- **Default to Integrated** for unfamiliar codebases
- **Use Normal** for routine development tasks
- **Reserve Meta** for truly specialized domains
- **Chain orchestrators** for multi-phase projects

### 7.2 Intelligence Gathering
- **Run compact first** for quick context
- **Use targeted analysis** for specific domains
- **Aggregate reports** before implementation
- **Reference via @-notation** to save tokens

### 7.3 Agent Coordination
- **Parallelize independent work** (single message, multiple Task calls)
- **Sequential for dependencies** (wait for results before next agent)
- **Monitor progress.json** to track agent states
- **Use completion signals** to coordinate waves

### 7.4 Workflow Definition
- **Create custom workflows** for repeated patterns
- **Use built-in chains** when applicable
- **Store workflows in** `.claude/workflows/`
- **Execute via** `/workflow run <file>`

### 7.5 File Management
- **Archive temporary files** after completion
- **Retain planning files** for audit
- **Use .archive/** for superseded files
- **Clean up completion signals** after aggregation

### 7.6 Session Management
- **Initialize session files** at task start
- **Update todos in real-time** as work progresses
- **Document decisions** in workbook
- **Log significant events** to event stream
- **Extract context** regularly to review progress
- **Archive completed sessions** for future reference

## 8. TROUBLESHOOTING

### 8.1 Common Issues

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

**"Session files not found"**
→ Initialize session files from templates (see Section 6.4)

**"Can't extract session context"**
→ Ensure jq is installed, check session ID is correct

### 8.2 Error Recovery

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

**Session State Corruption:**
1. Extract what you can with extract-session-context.sh
2. Archive corrupted files
3. Reinitialize from templates
4. Document what was lost in workbook

## 9. FILE LOCATIONS REFERENCE

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

/session/
├── planning-<sessionId>.json
├── todo-<sessionId>.json
├── workbook-<sessionId>.json
└── events-<sessionId>.json

/templates/
├── planning-session.json
├── todo-session.json
├── workbook-session.json
└── event-stream-session.json

/ops/
├── claude-process.md (workflow process documentation)
└── README.md (process overview)

/principles/
├── claude-rules.md (coordination rules and standards)
└── README.md (rules overview)

/scripts/
└── extract-session-context.sh (session context extraction)

/analysis/
└── intelligence-system-tot.md (system architecture analysis)
```

## 10. QUICK COMMAND REFERENCE

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

## 11. GETTING STARTED

**First-Time Setup:**
1. Ensure Node.js ≥18 installed
2. Run `/index` to generate PROJECT_INDEX.json
3. Review `@.claude/ORCHESTRATOR_SELECTION_GUIDE.md`
4. Review `@ops/claude-process.md` and `@principles/claude-rules.md`
5. Run `/intel compact` for quick overview

**For Each New Task:**
1. Initialize session files from templates (see Section 6.4)
2. Classify task type (novel/standard/analysis-heavy)
3. Select appropriate orchestrator
4. Run intelligence analysis if needed
5. Invoke orchestrator with task description
6. Monitor progress via session files and progress.json
7. Extract context regularly with `./scripts/extract-session-context.sh`
8. Validate with postflight checks
9. Archive completed session

**Example Session:**
```bash
# 1. Initialize session
SESSION_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
cp templates/*.json session/
# Update sessionIds in files...

# 2. Get quick codebase overview
/intel compact

# 3. Identify hotspots needing attention
/intel hotspots --limit 10

# 4. Run comprehensive audit
/intel extended

# 5. Invoke orchestrator with intelligence
/orchestrate integrated "Refactor authentication system for better security"

# 6. Monitor progress
./scripts/extract-session-context.sh $SESSION_ID

# 7. Check orchestrator coordinates agents
[Orchestrator coordinates agents automatically]

# 8. Review final deliverable
[Check /workflow/integration/final_deliverable.md]

# 9. Archive session
tar -czf archives/session-$SESSION_ID.tar.gz workflow/ session/
```

---

**System Version:** 1.1.0
**Last Updated:** 2025-10-12
**Documentation:**
- Intelligence System: `.claude/improved_intelligence/README.md`
- Orchestrator Selection: `.claude/ORCHESTRATOR_SELECTION_GUIDE.md`
- Workflow Process: `ops/claude-process.md`
- Coordination Rules: `principles/claude-rules.md`
- System Architecture: `analysis/intelligence-system-tot.md`

**Support:** Review agent definitions in `.claude/agents/*.md` for detailed capabilities

---

*Ultimate Intelligence System — Intelligence-Driven Multi-Agent Orchestration with Session Management*
