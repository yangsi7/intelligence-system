---
name: index
description: Create or update PROJECT_INDEX.json for the current project
---

# PROJECT_INDEX Command

Creates or updates a PROJECT_INDEX.json file for deep architectural awareness.

## What It Does

The PROJECT_INDEX creates a comprehensive map of your project including:
- Directory structure and file organization
- Function and class signatures with type annotations
- Call graphs showing what calls what
- Import dependencies
- Documentation structure
- Directory purposes

## Usage

Simply type `/index` in any project directory to create or update the index.

The indexer will:
1. Scan your codebase (respecting .gitignore)
2. Extract functions, classes, and their signatures
3. Build call graphs and dependencies
4. Generate PROJECT_INDEX.json

## Integration with Intelligence System

PROJECT_INDEX.json is automatically detected and used by:
- `/intel` commands (enhanced intelligence analysis)
- `index-analyzer` agent (deep code intelligence)
- Intelligence CLI (unified analysis)

When present, these tools provide richer insights by understanding your code structure.

## Alternative: -i Flag

You can also generate the index automatically by adding `-i` to any prompt:

```bash
fix auth bug -i              # Default size (50k), depth 5
fix auth bug -i75            # 75k tokens, depth 5
fix auth bug -i50d           # 50k tokens, unlimited depth
fix auth bug -i50d10         # 50k tokens, depth 10
```

The `-i` flag intelligently regenerates the index only when files change or size differs.

## Clipboard Export for External AI

Use `-ic` to export index for use with external AI (Gemini, ChatGPT, etc.):

```bash
analyze codebase -ic200      # Export up to 200k tokens
architecture review -ic800   # Export up to 800k tokens (external max)
```

This copies the index + instructions to your clipboard for pasting into external AI tools.

## Implementation

The indexer script is located at:
`~/.claude-intelligence-system/scripts/project_index.py`

When you run `/index`, Claude will:
1. Check if indexer is installed
2. Run the indexer script to create/update PROJECT_INDEX.json
3. Provide feedback on what was indexed

## Index Refresh

The index is automatically refreshed:
- **On session end** (Stop hook) - keeps index current
- **When using -i flag** (if files changed or different size requested)
- **Manual refresh** - run `/index` again

## Configuration

**Exclusions:**
Index automatically excludes:
- .git, node_modules, __pycache__
- build/, dist/, target/
- Files in .gitignore

Full list: See `~/.claude-intelligence-system/scripts/index_utils.py`

**Tree Depth Control:**
```bash
export TREE_DEPTH=10         # Global depth limit
```

Or use flag: `-i50d10` (50k tokens, depth 10)

## Troubleshooting

**Index not creating?**
```bash
# Check Python version
python3 --version  # Must be ≥3.8

# Manual generation
python3 ~/.claude-intelligence-system/scripts/project_index.py

# Check hooks
cat ~/.claude/settings.json | jq '.hooks'
```

**Index too large?**
- Add patterns to .gitignore to reduce scope
- Use depth limit: `-i50d5`
- Ask Claude to modify MAX_FILES in project_index.py

**-i flag not working?**
- Verify hooks configured: `cat ~/.claude/settings.json`
- Reinstall system: `~/.claude-intelligence-system/install.sh`

## Benefits

With PROJECT_INDEX.json:
- **Faster analysis** - No need to read all files
- **Better architecture understanding** - See the big picture
- **Smarter recommendations** - Know where code lives
- **Dependency awareness** - Understand impacts
- **Call graph analysis** - Trace execution paths

Without index:
- Limited to grepping files
- No architectural overview
- Must ask where things are
- Cannot see dependencies
- No call graph insights
