# Intelligence System Usage Guide

This project uses the **Ultimate Intelligence System** for AI-powered development workflows.

## Quick Start

**First-time setup:**
1. Generate project index: `/index`
2. Get codebase overview: `/intel compact`
3. Review orchestrator guide: `@~/.claude-intelligence-system/ORCHESTRATOR_SELECTION_GUIDE.md`

**Key slash commands:**
- `/intel compact|standard|extended` - Code intelligence analysis (use before major work)
- `/orchestrate integrated "task"` - Deep codebase analysis + implementation
- `/orchestrate normal "task"` - Standard development workflow
- `/search content|files|symbol "query"` - Find code quickly
- `/index` - Regenerate PROJECT_INDEX.json when structure changes

## Essential Documentation

- **System Guide**: `@~/.claude-intelligence-system/CLAUDE.md`
- **Orchestrator Selection**: `@~/.claude-intelligence-system/ORCHESTRATOR_SELECTION_GUIDE.md`
- **CLI Reference**: `@~/.claude-intelligence-system/improved_intelligence/README.md`

## Critical Patterns

**✅ DO:**
- **Run intelligence first** for unfamiliar code: `/intel compact`
- **Parallelize agents**: Launch multiple agents in ONE message for speed
- **Use @-references**: Reference files with `@path/to/file` instead of asking Claude to read
- **Auto-index**: Use `-i` flag in prompts: `"fix auth bug -i50"` (auto-generates 50k token index)

**❌ AVOID:**
- **Don't load PROJECT_INDEX.json directly** (use `/intel` or agents instead)
- **Don't launch agents sequentially** (launch in parallel when tasks are independent)
- **Don't read full source files** (use `/intel hotspots` or `/search` instead)
- **Don't skip intelligence analysis** for complex refactoring or unfamiliar code

## Common Workflows

**Bug Investigation:**
```
1. /intel compact                    # Understand codebase
2. /search symbol "functionName"     # Find relevant code
3. /orchestrate integrated "fix bug" # Intelligence-driven fix
```

**New Feature:**
```
1. /orchestrate normal "implement feature X"  # Standard workflow
2. Agents work in parallel automatically
3. Review /workflow/integration/final_deliverable.md
```

**Code Review:**
```
1. Make changes
2. reviewer agent invoked automatically (proactive)
3. Address feedback, re-run tests
```

**Performance Optimization:**
```
1. /intel hotspots --limit 20        # Find bottlenecks
2. /intel graph cycles               # Check circular deps
3. /orchestrate integrated "optimize" # Deep analysis + refactor
```

## Agent Invocation

**Parallel (FAST):**
```
✅ Launch multiple agents in single message:
   "Use researcher to analyze auth AND implementor to add feature"
   → Completes in ~2 min (parallel)
```

**Sequential (SLOW):**
```
❌ Launch one, wait, launch next:
   "Use researcher to analyze auth"
   [wait for result]
   "Now use implementor..."
   → Takes 6 min (3 min each)
```

## More Information

Run `cat ~/.claude-intelligence-system/CLAUDE.md` for comprehensive guide with 10 sections covering orchestrator selection, intelligence toolkit, execution standards, and troubleshooting.
