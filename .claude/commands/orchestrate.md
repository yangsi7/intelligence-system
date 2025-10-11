---
description: Orchestrate multi-agent workflow for complex tasks
argument-hint: [workflow-type] [scope]
allowed-tools: Read, Write, Bash, SlashCommand
---

# Multi-Agent Workflow Orchestration

Coordinate specialized agents to accomplish complex development tasks.

## Usage

Feature implementation:
```bash
/orchestrate feature src/components/UserProfile
```

Bug investigation and fix:
```bash
/orchestrate bugfix src/api/authentication
```

Code refactoring:
```bash
/orchestrate refactor src/utils/helpers.ts
```

Comprehensive audit:
```bash
/orchestrate audit src/
```

## Available Workflows

### 1. Feature Implementation (`feature`)

**Workflow:**
```
Orchestrator → Intelligence Gathering
  ↓
Researcher (external sources)
  ↓
Implementor (code implementation)
  ↓
Reviewer (quality check)
  ↓
Tester (TDD validation)
  ↓
Postflight (acceptance validation)
```

**Outputs:**
- Research findings
- Implementation code
- Review comments
- Test results
- Validation report

**Typical Duration:** 30-60 minutes
**Token Budget:** ~100k

---

### 2. Bug Investigation (`bugfix`)

**Workflow:**
```
Orchestrator → Intelligence Analysis
  ↓
Pattern Analysis (/intel)
  ↓
Root Cause Identification
  ↓
Implementor (fix)
  ↓
Tester (validation)
  ↓
Postflight (regression check)
```

**Outputs:**
- Bug analysis
- Root cause report
- Fix implementation
- Test validation
- Regression report

**Typical Duration:** 20-40 minutes
**Token Budget:** ~60k

---

### 3. Code Refactoring (`refactor`)

**Workflow:**
```
Orchestrator → Pattern Detection
  ↓
/intel analyze-patterns
  ↓
Refactor Planning
  ↓
Implementor (refactor)
  ↓
Reviewer (impact check)
  ↓
Tester (validation)
  ↓
Postflight (quality verification)
```

**Outputs:**
- Pattern analysis
- Refactor plan
- Refactored code
- Impact analysis
- Test validation

**Typical Duration:** 30-50 minutes
**Token Budget:** ~80k

---

### 4. Code Audit (`audit`)

**Workflow:**
```
Orchestrator → Comprehensive Intel
  ↓
/intel extended
  ↓
Pattern Analysis
  ↓
Hotspot Review
  ↓
Architecture Assessment
  ↓
Report Generation
```

**Outputs:**
- Comprehensive analysis report
- Identified issues
- Recommendations
- Action items

**Typical Duration:** 15-25 minutes
**Token Budget:** ~40k

---

## Workflow Execution

When you run `/orchestrate <workflow> <scope>`, the orchestrator:

1. **Creates Workflow Directory Structure:**
   ```
   /workflow/
   ├── planning/
   │   ├── orchestration-plan.md
   │   ├── requirements.md
   │   └── dependency-graph.json
   ├── intel/
   │   ├── shared-context.md
   │   ├── quick-reference.md
   │   └── dependency-graph.md
   ├── packages/
   │   ├── agent_1_context.md
   │   └── agent_2_context.md
   ├── outputs/
   │   ├── agent_1_result.md
   │   ├── agent_1_COMPLETE
   │   └── agent_2_result.md
   └── final/
       ├── integrated-solution.md
       └── validation-report.md
   ```

2. **Gathers Intelligence:**
   - Runs `/intel compact` or `/intel standard` based on workflow
   - Writes results to `/workflow/intel/shared-context.md`
   - All agents reference this via `@workflow/intel/shared-context.md`

3. **Dispatches Agents:**
   - Creates context packages for each agent
   - Spawns agents in parallel where possible
   - Monitors for `_COMPLETE` signal files

4. **Aggregates Results:**
   - Waits for all agents to complete
   - Integrates results
   - Validates against requirements

5. **Cleanup:**
   - Removes temporary files
   - Preserves final outputs and audit trail

## Monitoring Progress

Check workflow status:
```bash
ls -la workflow/outputs/*_COMPLETE
cat workflow/outputs/agent_*_result.md
```

## Error Handling

If an agent fails:
- Orchestrator waits for timeout (default: 30 minutes)
- Reads partial output if available
- Logs error to `/workflow/errors/`
- Options: Retry, Skip, Abort
- Default: Retry once with extended timeout

## Token Optimization

The orchestrator ensures token efficiency by:
- Gathering intelligence ONCE
- All agents load `@workflow/intel/shared-context.md` (0 token overhead)
- Agents only analyze their specific scope
- Progressive disclosure (start compact, expand if needed)
- Result caching for repeated queries

## See Also

- Agent documentation: @docs/agent-guides/
- Protocol definitions: @docs/protocols/
- Workflow examples: @docs/workflow-examples/
- Quick reference: @docs/PROJECT_INDEX_QUICK_REFERENCE.md

## Orchestrator Selection

The system will automatically select:
- **Normal Orchestrator** - For workflows using predefined agents
- **Meta Orchestrator** - If dynamic agent creation needed (rare)

You don't need to specify which orchestrator to use.

## Arguments

Workflow type: $1 (required)
Scope: $2 (optional, defaults to current directory)

```bash
# Examples
/orchestrate feature src/components
/orchestrate bugfix .
/orchestrate refactor src/utils/helpers.ts
/orchestrate audit src/api
```

## Execution

Invoke the orchestrator agent to handle this workflow:

Use the `orchestrator` subagent to handle workflow type "$1" with scope "$2".

@workflow/planning/orchestration-plan.md should contain:
- Workflow type: $1
- Scope: $2
- Requirements: (inferred from user request)
- Acceptance criteria: (inferred from user request)
