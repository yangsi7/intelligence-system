# Coordination Rules & Standards

This directory contains operational rules and standards that govern agent behavior, coordination, and quality in the Ultimate Intelligence System.

## Overview

The rules system provides comprehensive guidance for all aspects of multi-agent coordination, from file-based communication to token optimization and error handling.

## Key Documents

### claude-rules.md

**Comprehensive rules covering:**
- Core Coordination Rules (6 fundamental rules)
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

**Use this document to:**
- Understand agent coordination protocols
- Follow file-based communication patterns
- Optimize token usage
- Handle errors properly
- Ensure code quality
- Avoid common pitfalls

## Core Coordination Rules

### Rule 1: File-Based Communication Only
Agents never communicate directly. All communication happens through files.

### Rule 2: Intelligence Gathered Once
Never run intelligence analysis more than once per workflow. Share via `@` references.

### Rule 3: Parallel Execution via Single Message
Launch independent agents in parallel using a single message with multiple Task calls.

### Rule 4: Use @ References for Zero-Token Loading
Always use `@` notation to reference files instead of reading them directly.

### Rule 5: Session State Management
All session state tracked in JSON files with unique session ID.

### Rule 6: Shared Resource Access Protocol
Clear rules for who can read/write shared resources (planning, todos, workbook, events).

## Rule Categories

### Planning Rules
- Always create plan before execution
- Update plan when requirements change
- Document dependency graph
- Allocate token budget

### Todo Rules
- Create todos from plan
- Update in real-time
- One todo in-progress per agent
- Mark failed todos explicitly

### Writing Rules
- Use paragraphs, not bullet lists (for explanatory content)
- Provide thorough, detailed explanations
- Cite sources
- No placeholders or incomplete sections
- Maintain logical flow with headings

### Coding Rules
- Use appropriate language for task
- Generate tests with code
- Follow project style and patterns
- Document code appropriately
- Search before implementing

### File Rules
- Use Claude Code file tools (not bash redirection)
- Organize intermediate outputs
- Clean up responsibly
- Never load full source files (use intelligence summaries)

### Token Optimization Rules
- Progressive disclosure (start small, expand if needed)
- Scope intelligence to relevant areas
- Cache and reuse analysis
- Load only what's needed

## Quality Standards

1. **Completeness** - All requirements met, no placeholders
2. **Test Coverage** - Minimum 80%, all critical paths tested
3. **Code Quality** - Follows style, no smells, proper error handling
4. **Documentation** - Public APIs documented, complex logic explained
5. **Security** - No exposed secrets, input validation, output sanitization

## Anti-Patterns (Never Do)

1. ❌ Reading PROJECT_INDEX.json directly
2. ❌ Sequential agent launches when parallel possible
3. ❌ Re-running intelligence analysis
4. ❌ Reading full source files
5. ❌ Skipping quality gates
6. ❌ Using placeholders
7. ❌ Ignoring errors and moving on
8. ❌ Creating agents without context packages
9. ❌ Forgetting to update session state
10. ❌ Batch completing todos

## Quick Reference Matrix

### File Access Rights

| Resource | Main Agent | Orchestrator | Agents |
|----------|------------|--------------|--------|
| workflow/planning/ | R/W | R/W | R (via @) |
| workflow/intel/ | R/W | R | R (via @) |
| workflow/packages/ | R/W | R/W | R (own package) |
| workflow/outputs/ | R | R | W (own files) |
| session/planning*.json | R/W | R/W | R (via @) |
| session/todo*.json | R/W | R/W | R/W (own items) |
| session/workbook*.json | R/W | R/W | R/W (append only) |
| session/events*.json | R/W | R/W | W (append only) |

### Token Optimization Checklist

- [ ] Run `/intel` ONCE per workflow
- [ ] Use `@` references for all file loads
- [ ] Load intelligence via shared-context.md
- [ ] Start with compact, expand only if needed
- [ ] Scope analysis to relevant areas
- [ ] Never read PROJECT_INDEX.json directly
- [ ] Never load full source files
- [ ] Use progressive disclosure

### Error Handling Checklist

- [ ] Read error message carefully
- [ ] Identify root cause
- [ ] Try at least 2-3 approaches
- [ ] Log errors properly
- [ ] Update todo status if failed
- [ ] Document in events stream
- [ ] Ask for help after 3 failed attempts

## Agent-Specific Rules Summary

| Agent | Must Do | Must Not Do |
|-------|---------|-------------|
| **Orchestrator** | Run intelligence once, create context packages, monitor signals | Implement code, skip intelligence |
| **Researcher** | Validate sources, synthesize findings, cite references | Implement code, make final decisions |
| **Implementor** | Follow TDD, update docs, follow patterns | Skip tests, use placeholders, ignore architecture |
| **Reviewer** | Check functionality, provide specific feedback | Auto-approve, focus only on style |
| **Tester** | Test edge cases, validate coverage, run tests | Skip edge cases, accept failing tests |
| **Postflight** | Final validation, check all criteria, verify no regressions | Skip validation, approve if criteria not met |

## Getting Started

1. **Read:** `claude-rules.md` (comprehensive rules documentation)
2. **Learn:** Core coordination rules (Rules 1-6)
3. **Review:** Rule categories relevant to your role
4. **Apply:** Follow rules during task execution
5. **Avoid:** Anti-patterns listed in the guide

## Integration with Process

The rules in this directory complement the workflow process defined in `@ops/claude-process.md`:

- **Process** defines WHAT to do (modules and phases)
- **Rules** define HOW to do it (standards and protocols)

Together, they provide complete guidance for multi-agent coordination.

## Related Documentation

- **Workflow Process:** `@ops/claude-process.md`
- **Orchestrator Selection:** `@.claude/ORCHESTRATOR_SELECTION_GUIDE.md`
- **Intelligence System:** `@.claude/improved_intelligence/README.md`
- **System Architecture:** `@analysis/intelligence-system-tot.md`

---

**Version:** 1.0.0
**Last Updated:** 2025-10-12
