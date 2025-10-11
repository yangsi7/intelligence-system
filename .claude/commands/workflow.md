---
description: Execute custom intelligence workflows from JSON definitions
argument-hint: <command> [file]
allowed-tools: Bash, Read
---

# Workflow Management

Run custom analysis workflows defined in JSON files.

## Usage

**Run a workflow:**
```bash
/workflow run workflows/security-audit.json
/workflow run .claude/workflows/performance-check.json
```

**List available workflows:**
```bash
/workflow list
```

## Built-in Workflows

The system includes several built-in workflow chains:
- `onboarding.json` - Quick project orientation
- `investigate.json` - Bug investigation
- `audit.json` - Comprehensive code audit

## Execution

Command: $1
File: $2

If running a workflow:
!`PROJECT_INDEX=./PROJECT_INDEX.json node .claude/improved_intelligence/code-intel.mjs chain "$2"`

If listing workflows:
!`find workflows .claude/workflows -name "*.json" 2>/dev/null | head -20`
