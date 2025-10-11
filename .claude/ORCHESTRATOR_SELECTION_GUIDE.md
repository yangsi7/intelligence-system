# Orchestrator Selection Guide

## Overview

The merged intelligence system provides **three orchestrator patterns**, each optimized for different workflow scenarios. This guide helps you select the right orchestrator for your task.

## The Three Orchestrators

### 1. Meta Orchestrator (`meta_orchestrator.md`)

**Best for:** Novel tasks requiring custom agent creation

**Use when:**
- Task requires domain-specific expertise not covered by existing agents
- You need specialized analysis (e.g., database state, UI patterns, payment flows)
- Workflow requires agents with unique tool combinations
- Project involves experimental or one-off analyses

**Key capabilities:**
- **Dynamic agent creation** at runtime
- Uses meta-templates to generate new agent definitions
- Maximum flexibility for specialized domains
- Creates agents on-the-fly based on task requirements

**Example scenarios:**
- "Analyze our GraphQL schema and suggest optimizations"
- "Review our Stripe integration for PCI compliance"
- "Audit accessibility patterns in our React components"

### 2. Normal Orchestrator (`normal_orchestrator.md`)

**Best for:** Standard multi-agent workflows with predefined agents

**Use when:**
- Task fits standard development workflow (plan → implement → review → integrate)
- Using the 6 core agents (orchestrator, researcher, implementor, reviewer, tester, postflight)
- Need straightforward orchestration without intelligence aggregation
- Want simpler, more predictable execution flow

**Key capabilities:**
- **Predefined agent pipeline**
- File-based communication between agents
- Wave-based task decomposition (Wave 1, Wave 2+)
- Standard progress monitoring and aggregation

**Example scenarios:**
- "Implement user authentication feature"
- "Refactor the payment processing module"
- "Add unit tests for the API layer"

### 3. Integrated Orchestrator (`integrated_orchestrator.md`)

**Best for:** Complex tasks requiring deep codebase intelligence

**Use when:**
- Task requires understanding existing architecture before proceeding
- Need comprehensive code analysis and hotspot identification
- Working with unfamiliar or large codebases
- Require intelligence-driven planning and context packaging

**Key capabilities:**
- **Intelligence-first workflow** with automatic analysis
- Runs code-intel CLI (compact/standard/extended presets)
- Aggregates multiple analysis reports
- Provides intelligence context to all downstream agents
- Supports parallel analysis chains (audit, onboarding, investigate)

**Example scenarios:**
- "Investigate performance bottlenecks across the codebase"
- "Plan architecture refactoring for scalability"
- "Onboard to legacy system and identify tech debt"

## Decision Matrix

| Criterion | Meta | Normal | Integrated |
|-----------|------|--------|------------|
| **Task Complexity** | High (novel) | Medium (standard) | High (analysis-heavy) |
| **Agent Flexibility** | Maximum | Fixed | Fixed |
| **Intelligence Depth** | Manual | Basic | Automatic & Deep |
| **Setup Time** | Long | Short | Medium |
| **Best for** | Custom domains | Standard workflows | Code understanding |

## Quick Selection Guide

**Start here:**

1. **Is your task domain-specific and unusual?**
   - YES → **Meta Orchestrator**
   - NO → Continue to #2

2. **Do you need deep codebase analysis before proceeding?**
   - YES → **Integrated Orchestrator**
   - NO → Continue to #3

3. **Does your task fit standard dev workflow (plan/implement/review)?**
   - YES → **Normal Orchestrator**
   - NO → Return to #1 or #2

## Usage Examples

### Using Meta Orchestrator

```bash
# User request
"Analyze our Supabase integration and identify security issues"

# Claude response
I'll use the meta orchestrator to create a custom supabase-security-analyzer agent.
This agent will be equipped with database inspection tools and security audit capabilities.
```

### Using Normal Orchestrator

```bash
# User request
"Add password reset functionality to the auth system"

# Claude response
I'll use the normal orchestrator with our standard agent pipeline:
1. Planner: Define password reset workflow
2. Implementor: Build the feature
3. Reviewer: Code review
4. Tester: Create test cases
5. Integrator: Merge changes
```

### Using Integrated Orchestrator

```bash
# User request
"Investigate why our API is slow and fix the bottlenecks"

# Claude response
I'll use the integrated orchestrator for this performance investigation:
1. Run code-intel compact analysis
2. Identify hotspots and dependency patterns
3. Launch performance-check workflow
4. Package intelligence for implementors
5. Execute fixes with full context
```

## Workflow Chains

Each orchestrator supports different workflow mechanisms:

### Meta Orchestrator Workflows
- **Custom agents** defined via meta-templates
- **Ad-hoc workflows** based on task requirements
- **Domain-specific** analysis sequences

### Normal Orchestrator Workflows
- **Fixed agent sequence**: orchestrator → planner → implementor → reviewer → tester → postflight
- **Wave-based** parallelization (Wave 1, Wave 2+)
- **Standard** progress tracking via `progress.json`

### Integrated Orchestrator Workflows
- **Built-in chains**: onboarding.json, investigate.json, audit.json
- **Custom workflows**: security-audit.json, performance-check.json, quick-scan.json
- **Preset analyses**: compact, standard, extended
- **Intelligence aggregation** before implementation

## Advanced: Combining Orchestrators

For complex projects, you may use multiple orchestrators sequentially:

```bash
# Phase 1: Understand codebase (Integrated)
/orchestrate integrated "Analyze codebase architecture"

# Phase 2: Implement features (Normal)
/orchestrate normal "Add new authentication endpoints"

# Phase 3: Custom domain work (Meta)
/orchestrate meta "Audit GraphQL schema design"
```

## File Locations

- **Meta Orchestrator**: `.claude/orchestrators/meta_orchestrator.md`
- **Normal Orchestrator**: `.claude/orchestrators/normal_orchestrator.md`
- **Integrated Orchestrator**: `.claude/orchestrators/integrated_orchestrator.md`

## Slash Command Integration

Use the `/orchestrate` slash command to invoke orchestrators:

```bash
# Specify orchestrator type
/orchestrate meta "task description"
/orchestrate normal "task description"
/orchestrate integrated "task description"

# Auto-select (Claude chooses based on task)
/orchestrate "task description"
```

## Best Practices

1. **Start with Integrated** for unfamiliar codebases
2. **Use Normal** for routine development tasks
3. **Reserve Meta** for truly specialized domains
4. **Chain orchestrators** for multi-phase projects
5. **Review intelligence reports** before proceeding with implementation
6. **Monitor progress.json** to track agent states
7. **Archive intermediate outputs** after completion

## Troubleshooting

### "I'm not sure which orchestrator to use"

**Default recommendation**: Start with **Integrated Orchestrator**. It provides comprehensive analysis and can transition smoothly to implementation. You can always switch to Normal or Meta if needed.

### "My task doesn't fit any orchestrator"

Use **Meta Orchestrator** to create a custom workflow. The meta-template system is designed for edge cases and novel requirements.

### "I want faster execution"

Use **Normal Orchestrator**. It skips intelligence analysis and goes straight to implementation, making it the fastest option.

### "I need deep code understanding"

Use **Integrated Orchestrator**. It runs multiple analysis passes (compact, standard, extended) and aggregates findings before proceeding.

## Summary

Choose your orchestrator based on **task type**, **intelligence requirements**, and **agent flexibility needs**:

- **Meta**: Custom domains, maximum flexibility
- **Normal**: Standard workflows, fast execution
- **Integrated**: Deep analysis, intelligence-driven planning

When in doubt, start with **Integrated** for its comprehensive approach, then optimize for speed with **Normal** or flexibility with **Meta** as needed.

---

*Last updated: 2025-10-11*
*Version: 1.0.0*
*Part of: Ultimate Unified Intelligence System*
