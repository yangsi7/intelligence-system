---
description: Add Intelligence System usage guide to project CLAUDE.md
argument-hint: [project-dir]
allowed-tools: Bash, Read, Edit, Write
---

# Integrate Intelligence System into Project

Add the Ultimate Intelligence System usage guide to this project's CLAUDE.md file for easy reference during development.

## What This Does

The integration adds concise usage instructions to your project's CLAUDE.md:
- Quick start guide for agents and slash commands
- Essential file references (using `@` import notation)
- Critical anti-patterns to avoid
- Common workflow examples

## Integration Methods

**1. Import-based (Recommended)**
- Adds single import line: `@~/.claude-intelligence-system/.claude/USAGE_TEMPLATE.md`
- Always up-to-date (references canonical source)
- Minimal file size impact
- Follows Claude Code best practices

**2. Inline**
- Embeds full template in CLAUDE.md
- Works without import system
- Larger file size
- Needs manual updates

## Your Task

1. **Determine project directory**: Use $ARGUMENTS if provided, otherwise current directory

2. **Run the integration script**:
   ```bash
   ~/.claude-intelligence-system/scripts/integrate_claude_md.sh $ARGUMENTS
   ```

3. **Show the output** to the user

4. **Verify integration** by checking if the import line or inline content was added

## Important Notes

- **Safe to run multiple times** - Script is idempotent
- **Non-destructive** - Creates backups before modifying files
- **Respects existing content** - Never overwrites user's CLAUDE.md
- **Interactive mode** - Prompts user for integration method preference

## Example Usage

```
> /integrate
```
Integrates into current directory

```
> /integrate /path/to/project
```
Integrates into specified project directory

After integration, users can access the guide via their CLAUDE.md imports, or you can reference it directly with:
```
@~/.claude-intelligence-system/.claude/USAGE_TEMPLATE.md
```
