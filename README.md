# Ultimate Intelligence System for Claude Code

[![Tests](https://github.com/yangsi7/intelligence-system/workflows/Test%20Python%20Scripts/badge.svg)](https://github.com/yangsi7/intelligence-system/actions)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 18+](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![macOS](https://img.shields.io/badge/macOS-supported-success.svg)](https://www.apple.com/macos/)
[![Linux](https://img.shields.io/badge/Linux-supported-success.svg)](https://www.linux.org/)

**Intelligence-Powered Multi-Agent Orchestration System**

Coordinate specialized AI agents with deep code intelligence for complex development tasks.

## Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/yangsi7/intelligence-system/main/install.sh | bash
```

## What You Get

### 3 Orchestrator Patterns
- **Meta Orchestrator** - Dynamic agent creation for novel/specialized tasks
- **Normal Orchestrator** - Standard workflow for routine development
- **Integrated Orchestrator** - Intelligence-first for complex analysis

### 7 Specialized Agents
- **Orchestrator** - Multi-agent workflow coordinator
- **Researcher** - Code intelligence gatherer
- **Implementor** - Code implementation specialist
- **Reviewer** - Code review specialist
- **Tester** - Test creation and execution
- **Postflight** - Final validation and quality checks
- **Index-Analyzer** - PROJECT_INDEX.json deep code intelligence

### Unified Intelligence CLI
- 29+ commands for code analysis
- Presets: compact, standard, extended
- Custom workflow chains
- Pattern detection
- Dependency analysis
- Call graph generation

### PROJECT_INDEX Integration
- **Integrated indexer** from claude-code-project-index
- **Auto-indexing with -i flag** - `fix bug -i50`
- **Deep code intelligence** - Functions, classes, call graphs
- **Automatic refresh** - Keeps index current
- **Clipboard export** - `-ic` for external AI

### 6 Slash Commands
- `/intel` - Code intelligence analysis
- `/orchestrate` - Orchestrator invocation
- `/search` - Code search utilities
- `/validate` - Validation operations
- `/workflow` - Workflow execution
- `/index` - Create/update PROJECT_INDEX.json

### 6 Workflow Definitions
- **Built-in:** onboarding, investigate, audit
- **Custom:** security-audit, performance-check, quick-scan

## Usage

After installation, these commands become available:

```bash
# PROJECT_INDEX - Deep code understanding
/index                            # Create/update PROJECT_INDEX.json
fix auth bug -i                   # Auto-index (default 50k)
fix auth bug -i75                 # Custom size (75k tokens)
fix auth bug -i50d10              # With depth limit
analyze codebase -ic200           # Clipboard export for external AI

# Quick code intelligence
/intel compact                    # Fast overview (2-3k tokens, ~1s)
/intel standard                   # Balanced analysis (8-10k tokens, ~3s)
/intel extended                   # Comprehensive (15-20k tokens, ~5s)

# Orchestrate multi-agent workflows
/orchestrate integrated "Refactor authentication system"
/orchestrate normal "Add user profile feature"
/orchestrate meta "Analyze GraphQL schema"

# Search codebase
/search content "authenticate"    # Search file contents
/search files "handler"           # Find files
/search symbol "UserAuth"         # Find symbols

# Run custom workflows
/workflow run .claude/workflows/security-audit.json
/workflow list                    # List available workflows

# Validate components
/validate plan                    # Validate orchestration plan
/validate workflow security-audit.json
```

## Installation

The installer will:

1. Install to `~/.claude-intelligence-system/`
2. Copy 7 agents to `~/.claude/agents/`
3. Copy 6 slash commands to `~/.claude/commands/`
4. Set up intelligence CLI
5. Install PROJECT_INDEX scripts
6. Configure hooks for auto-indexing
7. Configure all components

**Requirements:**
- Node.js ≥18 (required)
- Claude Code with subagent support (required)
- macOS or Linux (required)
- git and jq (for installation)
- Python ≥3.8 (recommended for PROJECT_INDEX)

## Verify Installation

After installation, verify everything works:

```bash
# In Claude Code
> Verify my intelligence system
```

The `system-installer` agent will check all components and report status.

## Orchestrator Selection

Choose the right orchestrator for your task:

| Task Type | Orchestrator | Use Case |
|-----------|-------------|----------|
| Novel/specialized | **Meta** | GraphQL schema analysis, custom domains |
| Standard dev workflow | **Normal** | Feature implementation, bug fixes |
| Analysis-heavy | **Integrated** | Performance investigations, refactoring |

**Quick Decision Tree:**

1. Is your task domain-specific and unusual? → **Meta**
2. Do you need deep codebase analysis first? → **Integrated**
3. Does your task fit standard dev workflow? → **Normal**

## Intelligence CLI

The unified intelligence CLI provides 29+ commands:

```bash
# Direct CLI usage
node ~/.claude-intelligence-system/improved_intelligence/code-intel.mjs help

# Or use slash command
/intel help

# Presets
/intel compact              # Quick overview
/intel standard src/        # Standard analysis with scope
/intel extended             # Comprehensive audit

# Specific commands
/intel hotspots --limit 10      # Top 10 hotspots
/intel graph cycles             # Circular dependencies
/intel trace --entry src/api/handler.ts --depth 3
/intel patterns --scope src/
```

## Workflows

Execute pre-defined analysis sequences:

**Built-in workflows:**
- `onboarding.json` - Quick project orientation
- `investigate.json` - Bug investigation
- `audit.json` - Comprehensive code audit

**Custom workflows:**
- `security-audit.json` - Security analysis
- `performance-check.json` - Performance profiling
- `quick-scan.json` - Fast code scan

```bash
# Execute workflow
/workflow run .claude/workflows/security-audit.json

# Custom workflow definition (JSON)
[
  {
    "command": "overview",
    "args": ["60"]
  },
  {
    "command": "patterns",
    "args": ["all"]
  },
  {
    "command": "hotspots",
    "args": ["15"]
  }
]
```

## File Locations

```
~/.claude-intelligence-system/      # Installation directory
├── README.md                       # This file
├── CLAUDE.md                       # System guide
├── ORCHESTRATOR_SELECTION_GUIDE.md # Decision tree
├── install.sh                      # Installer
├── uninstall.sh                    # Uninstaller
├── orchestrators/                  # 3 orchestrator patterns
├── improved_intelligence/          # Intelligence CLI
│   ├── code-intel.mjs
│   ├── README.md
│   └── cli/intel_mjs/...
└── workflows/                      # Workflow definitions

~/.claude/agents/                   # Installed agents
├── orchestrator.md
├── researcher.md
├── implementor.md
├── reviewer.md
├── tester.md
├── postflight.md
└── system-installer.md             # Verification/repair agent

~/.claude/commands/                 # Installed slash commands
├── intel.md
├── orchestrate.md
├── search.md
├── validate.md
└── workflow.md
```

## Troubleshooting

### Verify Installation
```bash
# Ask Claude
> Verify my intelligence system

# Or run manually
~/.claude-intelligence-system/install.sh
```

### Repair Installation
```bash
# Ask Claude
> Fix my intelligence system

# Components will be restored from installation directory
```

### Update to Latest
```bash
# Ask Claude
> Update the intelligence system

# Or reinstall
curl -fsSL https://raw.githubusercontent.com/yangsi7/intelligence-system/main/install.sh | bash
```

### Common Issues

**Issue: Node.js version too old**
- Solution: Upgrade to Node.js ≥18

**Issue: Slash commands not working**
- Solution: Reinstall or copy commands manually from `~/.claude-intelligence-system/.claude/commands/`

**Issue: CLI not executable**
- Solution: `chmod +x ~/.claude-intelligence-system/improved_intelligence/code-intel.mjs`

**Issue: Agents not responding**
- Solution: Verify agents exist in `~/.claude/agents/` and restart Claude Code

## Examples

### Example 1: Feature Implementation

```bash
# Quick codebase overview
/intel compact

# Identify hotspots
/intel hotspots --limit 10

# Orchestrate feature implementation
/orchestrate integrated "Implement user authentication with JWT"

# The orchestrator will:
# 1. Run intelligence analysis
# 2. Dispatch researcher, implementor, reviewer, tester agents
# 3. Aggregate results
# 4. Validate implementation
```

### Example 2: Bug Investigation

```bash
# Search for the issue
/search content "TypeError"

# Investigate with workflow
/workflow run .claude/workflows/investigate.json

# Orchestrate bug fix
/orchestrate normal "Fix TypeError in authentication handler"
```

### Example 3: Architecture Audit

```bash
# Comprehensive analysis
/intel extended

# Run audit workflow
/workflow run .claude/workflows/security-audit.json

# Review findings and orchestrate fixes
/orchestrate integrated "Refactor based on audit findings"
```

## Best Practices

1. **Start with intelligence** - Run `/intel compact` before complex tasks
2. **Choose right orchestrator** - Follow the decision tree
3. **Use workflows** - Leverage pre-defined analysis sequences
4. **Verify after install** - Always check installation health
5. **Update regularly** - Get latest features and fixes

## Token Optimization

The system uses intelligent token optimization:

- **@-reference notation** (90% savings)
- **Shared intelligence** across agents
- **Preset selection** for appropriate depth
- **Workflow chains** to avoid redundant analysis

Example:
```bash
# Instead of reading full files (5000+ tokens)
# Use intelligence summary via @-reference (200 tokens)
@workflow/intel/shared-context.md
```

## Uninstall

```bash
~/.claude-intelligence-system/uninstall.sh
```

This removes:
- Installation directory (`~/.claude-intelligence-system/`)
- All agents from `~/.claude/agents/`
- All commands from `~/.claude/commands/`

## Documentation

- **System Guide:** `~/.claude-intelligence-system/CLAUDE.md`
- **Orchestrator Guide:** `~/.claude-intelligence-system/ORCHESTRATOR_SELECTION_GUIDE.md`
- **CLI Reference:** `~/.claude-intelligence-system/improved_intelligence/README.md`
- **Agent Definitions:** `~/.claude/agents/*.md`

## Contributing

We welcome contributions! Please see:
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Development setup and guidelines
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community guidelines
- **[SECURITY.md](SECURITY.md)** - Reporting issues
- **[TESTING.md](TESTING.md)** - Testing guide

This system is designed to be forked and customized for your needs.

## License

MIT License - See LICENSE file

## Credits

Inspired by the excellent work of Eric Buess on [claude-code-project-index](https://github.com/ericbuess/claude-code-project-index).

## Support

For issues or questions:
1. Verify installation: `Verify my intelligence system`
2. Check documentation: `~/.claude-intelligence-system/CLAUDE.md`
3. Repair if needed: `Fix my intelligence system`
4. Open an issue on GitHub

---

**Installation:** One line
**Verification:** One command
**Usage:** Immediate

Get started now:
```bash
curl -fsSL https://raw.githubusercontent.com/yangsi7/intelligence-system/main/install.sh | bash
```
