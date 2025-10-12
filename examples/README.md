# Example Sessions

This directory contains realistic example sessions demonstrating the Ultimate Intelligence System's session management and workflow processes in action.

## Overview

Each example showcases a complete workflow from initial task receipt through final delivery, with all session state files demonstrating how the system tracks progress, coordinates agents, and maintains context.

## Examples

### 1. Feature Development Session (`feature-development/`)

**Scenario:** Adding a password reset feature to an authentication system

**Demonstrates:**
- Standard feature development workflow
- Normal orchestrator pattern
- TDD approach with parallel agent execution
- Quality gate validation
- Complete session lifecycle from Context → Delivery

**Key Learning Points:**
- How tasks are classified and decomposed
- Wave-based agent dispatch with dependencies
- Todo tracking with agent assignments
- Workbook usage for capturing decisions and architecture diagrams
- Event stream tracking of all major actions

**Orchestrator:** Normal (standard development workflow)

---

### 2. Code Analysis Session (`code-analysis/`)

**Scenario:** Investigating performance bottlenecks in API endpoints

**Demonstrates:**
- Analysis-heavy workflow
- Integrated orchestrator pattern
- Multi-pass intelligence analysis
- Research phase integration
- Intelligence-driven decision making

**Key Learning Points:**
- How intelligence gathering is performed once and shared
- Using compact/standard/extended presets
- Workbook patterns for insights and findings
- Deep code analysis workflows
- Token optimization through @ references

**Orchestrator:** Integrated (intelligence-first approach)

---

### 3. Product Spec Generation (`product-spec/`)

**Scenario:** Creating a comprehensive product specification for a new AI-powered search feature

**Demonstrates:**
- Novel task requiring custom agents
- Meta orchestrator pattern
- Custom agent creation and dispatch
- Research-heavy workflow with external information gathering
- Brainstorming and decision documentation

**Key Learning Points:**
- When and how to use Meta orchestrator
- Custom agent specialization
- Research phase with source validation
- Brainstorm phase with multiple approaches
- Comprehensive workbook usage for ideation

**Orchestrator:** Meta (custom domain work)

---

## File Structure

Each example directory contains:

```
<example-name>/
├── README.md                                    # Example-specific documentation
├── planning-<sessionId>.json                    # Task classification, phases, requirements
├── todo-<sessionId>.json                        # Task breakdown with agent assignments
├── workbook-<sessionId>.json                    # Insights, decisions, diagrams
└── events-<sessionId>.json                      # Complete audit trail
```

## How to Use These Examples

### 1. Reading the Examples

Start with each example's `README.md` to understand the scenario, then review the session files in this order:

1. **planning-<sessionId>.json** - Understand task classification and orchestrator selection
2. **todo-<sessionId>.json** - See task decomposition and agent assignments
3. **workbook-<sessionId>.json** - Review insights, decisions, and architectural thinking
4. **events-<sessionId>.json** - Follow the complete timeline of actions

### 2. Extracting Session Context

Use the extraction script to view a formatted summary:

```bash
# From project root
./scripts/extract-session-context.sh <sessionId>

# Example:
./scripts/extract-session-context.sh a7f3c8e2-9b1d-4f6a-8e2c-1d5a9f8b3c7e
```

### 3. Understanding the Workflow

Each example demonstrates one of the 8 workflow modules defined in `@ops/claude-process.md`:

1. **Context** - Task understanding and classification
2. **Analysis** - Intelligence gathering (if needed)
3. **Research** - External information gathering (if needed)
4. **Brainstorm** - Approach generation and evaluation
5. **Planning** - Task decomposition and agent allocation
6. **Execution** - Agent dispatch and monitoring
7. **Review** - Validation and quality checks
8. **Delivery** - Integration and final deliverable

### 4. Learning Agent Coordination

Study how agents communicate through files:

- **Context Packages**: `/workflow/packages/agent_{ID}_context.md`
- **Results**: `/workflow/outputs/agent_{ID}_result.md`
- **Completion Signals**: `/workflow/outputs/agent_{ID}_COMPLETE`

### 5. Token Optimization Patterns

Notice how the examples demonstrate token-efficient patterns:

- Intelligence gathered once in Analysis phase
- Agents reference intelligence via `@` notation (near-zero tokens)
- Progressive disclosure (compact → standard → extended)
- Scoped analysis to relevant domains

## Mapping to Documentation

These examples implement the processes and rules defined in:

| Concept | Documentation | Example Usage |
|---------|--------------|---------------|
| **Workflow Process** | `@ops/claude-process.md` | All examples follow the 8-module flow |
| **Coordination Rules** | `@principles/claude-rules.md` | File-based communication, parallel execution, quality gates |
| **Orchestrator Selection** | `@.claude/ORCHESTRATOR_SELECTION_GUIDE.md` | Each example uses different orchestrator pattern |
| **Intelligence CLI** | `@.claude/improved_intelligence/README.md` | Code analysis example shows `/intel` usage |
| **Session Templates** | `@templates/*.json` | All examples follow template schemas |

## Common Patterns Demonstrated

### Pattern 1: Parallel Agent Execution

**Example:** Feature Development - Implementor + Reviewer in Wave 2

```json
// todo-session.json shows multiple agents launched simultaneously
{
  "todos": [
    {
      "id": "task_2_1",
      "assignedAgent": "agent_implementor_001",
      "status": "in_progress"
    },
    {
      "id": "task_2_2",
      "assignedAgent": "agent_implementor_002",
      "status": "in_progress"
    }
  ]
}
```

### Pattern 2: Intelligence Sharing

**Example:** Code Analysis - Intelligence gathered once, shared to all agents

```json
// workbook-session.json shows intelligence report referenced
{
  "entries": [
    {
      "type": "insight",
      "title": "Performance Bottleneck Identified",
      "references": [
        {
          "type": "file",
          "path": "@workflow/intel/intelligence_report.md"
        }
      ],
      "relevantAgents": ["agent_researcher_001", "agent_implementor_001"]
    }
  ]
}
```

### Pattern 3: Decision Documentation

**Example:** Product Spec - Brainstorming captured in workbook

```json
// workbook-session.json shows decision rationale
{
  "entries": [
    {
      "type": "decision",
      "title": "Selected Vector Search Approach",
      "content": "After evaluating 3 approaches, chose OpenAI embeddings with Pinecone for scalability...",
      "relatedPhase": "Brainstorm"
    }
  ]
}
```

### Pattern 4: Quality Gates

**Example:** Feature Development - Postflight validation

```json
// events-session.json shows quality gate checks
{
  "events": [
    {
      "eventType": "quality_gate_passed",
      "description": "All tests passing, coverage at 87%",
      "severity": "info"
    }
  ]
}
```

## Next Steps

After reviewing these examples:

1. **Understand the Templates** - Review `@templates/*.json` to see schema definitions
2. **Study the Process** - Read `@ops/claude-process.md` for complete workflow documentation
3. **Learn the Rules** - Study `@principles/claude-rules.md` for coordination standards
4. **Select Orchestrators** - Use `@.claude/ORCHESTRATOR_SELECTION_GUIDE.md` for decision tree
5. **Try It Yourself** - Start a new task and follow the patterns demonstrated

## Related Documentation

- **Session Management Overview**: `@CLAUDE.md` Section 6
- **Workflow Process**: `@ops/claude-process.md`
- **Coordination Rules**: `@principles/claude-rules.md`
- **Orchestrator Selection**: `@.claude/ORCHESTRATOR_SELECTION_GUIDE.md`
- **Intelligence CLI**: `@.claude/improved_intelligence/README.md`
- **Session Extraction**: `@scripts/extract-session-context.sh`

---

**Version:** 1.0.0
**Last Updated:** 2025-10-12
**Examples:** 3 complete session workflows
