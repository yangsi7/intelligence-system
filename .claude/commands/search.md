---
description: Search files, content, and symbols in the codebase
argument-hint: <type> <query> [options]
allowed-tools: Bash
---

# Code Search

Fast search across your codebase using the intelligence CLI.

## Usage

**Search file contents (ripgrep):**
```bash
/search content "useEffect" --type ts
/search content "TODO" src/
```

**Find files (fd):**
```bash
/search files "handler"
/search files "test" --ext ts
```

**Find symbols/functions:**
```bash
/search symbol "authenticate"
/search symbol "User"
```

**Show directory structure:**
```bash
/search structure
/search structure 3
```

## Execution

!`PROJECT_INDEX=./PROJECT_INDEX.json node .claude/improved_intelligence/code-intel.mjs $ARGUMENTS`
