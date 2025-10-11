---
description: Run code intelligence analysis on PROJECT_INDEX.json
argument-hint: [preset|command] [options]
allowed-tools: Bash
---

# Code Intelligence Analysis

Run automated code analysis using the intelligence CLI system.

## Quick Usage

Basic analysis:
```bash
/intel compact
```

Detailed analysis with scope:
```bash
/intel standard src/api
```

Specific command:
```bash
/intel analyze-patterns --patterns circular,dead-code
```

## Available Presets

- **compact** - Quick overview (2-3k tokens, ~1s)
  - File statistics
  - Top 5 hotspots
  - Directory structure

- **standard** - Standard analysis (8-10k tokens, ~3s)
  - Full overview
  - Pattern detection
  - Top 10 hotspots
  - Basic graph statistics

- **extended** - Comprehensive analysis (15-20k tokens, ~5s)
  - Everything in standard
  - Detailed pattern analysis
  - Top 20 hotspots
  - Full graph analysis
  - Circular dependency detection

## Specific Commands

- **analyze-patterns** - Detect code smells
  ```bash
  /intel analyze-patterns --scope src/ --patterns circular,dead-code,god
  ```

- **hotspots** - Find high-centrality modules
  ```bash
  /intel hotspots --limit 10 --min-centrality 0.3
  ```

- **trace** - Trace dependencies
  ```bash
  /intel trace --entry src/api/handler.ts --depth 3
  ```

- **query** - Query index structure
  ```bash
  /intel query --scope src/ --type modules
  ```

- **graph** - Graph operations
  ```bash
  /intel graph stats
  /intel graph cycles
  ```

## Commands with Arguments

All commands support the `$ARGUMENTS` variable:

```bash
/intel $ARGUMENTS
```

## Output Format

Results are written to `/workflow/intel/` directory:
- **shared-context.md** - General intelligence for all agents
- **analysis-detailed.md** - Full analysis results
- **hotspots.json** - Machine-readable hotspot data

## See Also

For detailed CLI documentation, see:
@.claude/improved_intelligence/README.md

For quick reference on using PROJECT_INDEX.json:
@docs/PROJECT_INDEX_QUICK_REFERENCE.md

## Technical Details

The `/intel` command wraps the Node.js CLI at:
`.claude/improved_intelligence/cli/intel_mjs/src/cli/code-intel.mjs`

Prerequisites:
- Node.js ≥ 18
- PROJECT_INDEX.json in repository root
- Run `/index` first if PROJECT_INDEX.json doesn't exist

## Execution

!`node .claude/improved_intelligence/cli/intel_mjs/src/cli/code-intel.mjs $ARGUMENTS`

Store results for agent consumption:

!`mkdir -p workflow/intel && node .claude/improved_intelligence/cli/intel_mjs/src/cli/code-intel.mjs $ARGUMENTS > workflow/intel/shared-context.md`
