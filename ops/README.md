# Workflow Process Documentation

This directory contains documentation for the standardized workflow processes used in the Ultimate Intelligence System.

## Overview

The workflow process is adapted from Manus-inspired agentic principles and consists of 8 sequential modules that guide task execution from initial context gathering through final delivery.

## Process Flow

```
Context → Analysis → Research → Brainstorm → Planning → Execution → Review → Delivery
```

## Key Documents

### claude-process.md

**Comprehensive workflow process documentation covering:**
- 8 workflow modules (Context, Analysis, Research, Brainstorm, Planning, Execution, Review, Delivery)
- Integration with orchestrator patterns (Meta, Normal, Integrated)
- File-based communication protocols
- Shared resource management (session files, workbook, todos, events)
- Token optimization checkpoints
- Quality gates and validation
- Agent handoff protocols
- Error recovery procedures

**Use this document to:**
- Understand the full workflow process
- Learn module responsibilities and outputs
- Implement quality gates
- Coordinate multi-agent workflows
- Optimize token usage
- Handle errors and failures

## Core Principles

1. **Research First, Act Later** - Never implement without understanding context
2. **Intelligence Gathered Once** - Share analysis across all agents via file references
3. **File-Based Communication** - Agents communicate only through structured files
4. **Parallel Execution** - Maximize concurrency while respecting dependencies
5. **Quality Gates** - Validate before progressing to next phase
6. **Token Optimization** - Use `@` references, avoid duplicate analysis
7. **Complete Outputs** - Never use placeholders or incomplete sections
8. **Audit Trail** - Document every significant decision and action

## Quick Reference

### When to Use Each Module

| Module | Trigger | Key Actions | Output |
|--------|---------|-------------|--------|
| **Context** | Task received | Restate goals, classify task, select orchestrator | Planning docs |
| **Analysis** | Context complete | Run `/intel`, map architecture | Intelligence report |
| **Research** | Analysis complete | Gather external info, validate sources | Research report |
| **Brainstorm** | Research complete | Generate approaches, evaluate options | Decision doc |
| **Planning** | Approach selected | Decompose tasks, assign agents, allocate tokens | Implementation plan |
| **Execution** | Plan approved | Dispatch agents, monitor progress | Agent results |
| **Review** | All agents complete | Validate outputs, check requirements | Review report |
| **Delivery** | Review passed | Aggregate, integrate, validate | Final deliverable |

### Integration with Orchestrators

**Normal Orchestrator:**
- Skips Research for simple tasks
- Uses fixed 6-agent pipeline
- Fast execution

**Integrated Orchestrator:**
- Deep Analysis phase (multi-pass intelligence)
- Intelligence-informed Planning
- Comprehensive Review

**Meta Orchestrator:**
- Custom Analysis (creates specialized agents)
- Flexible workflow based on domain
- Maximum adaptability

## Session Management Integration

The process modules integrate with session management files:

- **planning-<sessionId>.json** - Tracks current phase and progress
- **todo-<sessionId>.json** - Maps tasks to modules and agents
- **workbook-<sessionId>.json** - Captures insights and decisions per module
- **events-<sessionId>.json** - Logs all module transitions and actions

## Getting Started

1. **Read:** `claude-process.md` (comprehensive process documentation)
2. **Review:** Process flow diagrams and module descriptions
3. **Understand:** Quality gates and validation requirements
4. **Apply:** Follow process for your next task
5. **Monitor:** Use session extraction to track progress

## Related Documentation

- **Coordination Rules:** `@principles/claude-rules.md`
- **Orchestrator Selection:** `@.claude/ORCHESTRATOR_SELECTION_GUIDE.md`
- **Intelligence System:** `@.claude/improved_intelligence/README.md`
- **System Architecture:** `@analysis/intelligence-system-tot.md`

---

**Version:** 1.0.0
**Last Updated:** 2025-10-12
