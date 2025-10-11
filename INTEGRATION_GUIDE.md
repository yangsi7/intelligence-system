# Intelligence System Integration Guide

This guide explains how to integrate the Ultimate Intelligence System's usage instructions into your project's CLAUDE.md file for easy reference during development.

## Table of Contents

1. [Overview](#overview)
2. [Integration Methods](#integration-methods)
3. [Quick Start](#quick-start)
4. [Integration Scenarios](#integration-scenarios)
5. [Manual Integration](#manual-integration)
6. [Troubleshooting](#troubleshooting)
7. [Frequently Asked Questions](#frequently-asked-questions)

## Overview

The Intelligence System provides concise usage instructions that can be automatically added to your project's CLAUDE.md file. This ensures the system's capabilities are always available to Claude during development sessions.

### What Gets Integrated

The integration adds a **lightweight usage guide** (~500 tokens) that includes:

- **Quick Start**: First-time setup and essential commands
- **Key Slash Commands**: `/intel`, `/orchestrate`, `/search`, `/index`
- **Documentation References**: Using `@` imports to the full system guide
- **Critical Patterns**: DO's and DON'Ts for optimal usage
- **Common Workflows**: Examples for bug investigation, feature development, etc.
- **Agent Invocation**: Parallel vs sequential patterns

### Benefits

- **Always Up-to-Date**: Uses `@` import system pointing to canonical source
- **Minimal Token Usage**: ~500 tokens vs 8000+ from full CLAUDE.md
- **Non-Intrusive**: Single import line or clearly marked section
- **Team-Shareable**: Checked into version control for team consistency
- **Reversible**: Easy to remove if needed

## Integration Methods

### Method 1: Import-Based (Recommended)

**How it works**: Adds a single import line referencing the template:
```markdown
@/Users/you/.claude-intelligence-system/.claude/USAGE_TEMPLATE.md
```

**Advantages**:
- Always current (references canonical source)
- Minimal file size impact (1 line)
- Follows Claude Code best practices
- Automatic updates when system is upgraded

**Best for**: Most projects, especially those using modern Claude Code features

### Method 2: Inline

**How it works**: Embeds the full template content with version markers:
```markdown
<!-- ULTIMATE_INTELLIGENCE_SYSTEM_START -->
<!-- Installed: 2025-10-11 | Version: v1.2.1 -->
[Full template content]
<!-- ULTIMATE_INTELLIGENCE_SYSTEM_END -->
```

**Advantages**:
- Works without import system
- Content visible in file
- Self-contained

**Disadvantages**:
- Larger file size
- Manual updates required
- Can become outdated

**Best for**: Projects not using Claude Code import features, legacy setups

## Quick Start

### Option 1: During Installation

When running the installer, answer "y" when prompted:

```
Install the Intelligence System using the quick install script:
curl -fsSL https://raw.githubusercontent.com/yangsi7/intelligence-system/main/install.sh | bash
```

The installer will ask:

```bash
========================================
📝 Project Integration (Optional)
========================================

The Intelligence System can add usage instructions to your
project's CLAUDE.md file for easy reference during development.

Integrate into a project now? (y/N):
```

Answer `y` and provide the project directory path.

### Option 2: Using /integrate Slash Command

From within any Claude Code session:

```
> /integrate
```

Or for a specific project:

```
> /integrate /path/to/your/project
```

### Option 3: Command Line Script

```bash
~/.claude-intelligence-system/scripts/integrate_claude_md.sh /path/to/project
```

## Integration Scenarios

### Scenario 1: No CLAUDE.md Exists

**What happens**: Creates `.claude/CLAUDE.md` with import

**Result**:
```markdown
# Project Memory

This file contains project-specific instructions for Claude Code.

# Intelligence System Integration

This project uses the Ultimate Intelligence System for enhanced development workflows.
For usage guide, see:

@/Users/you/.claude-intelligence-system/.claude/USAGE_TEMPLATE.md
```

**Location**: `.claude/CLAUDE.md` (follows Claude Code hierarchy)

### Scenario 2: Root CLAUDE.md Exists

**What happens**: Adds integration section to existing file

**Interactive prompt**:
```
Found existing CLAUDE.md

Integration method:
  1) Import (recommended) - Single line reference, always up-to-date
  2) Inline - Full template embedded in file

Choose method (1/2, default: 1):
```

**Result** (Import method):
```markdown
[Your existing CLAUDE.md content]

# Intelligence System Integration

This project uses the Ultimate Intelligence System for enhanced development workflows.
For usage guide, see:

@/Users/you/.claude-intelligence-system/.claude/USAGE_TEMPLATE.md
```

### Scenario 3: .claude/CLAUDE.md Exists

**What happens**: Same as Scenario 2, but adds to `.claude/CLAUDE.md`

**Why**: Respects existing hierarchical structure

### Scenario 4: Already Integrated

**What happens**: Detects existing integration and skips

**Output**:
```
✓ Already integrated in CLAUDE.md
  No changes needed
```

**Idempotent**: Safe to run multiple times

## Manual Integration

If you prefer manual control, you can integrate by editing your CLAUDE.md directly:

### Manual Method 1: Import Reference

Add this to your CLAUDE.md:

```markdown
# Intelligence System

Usage guide: @~/.claude-intelligence-system/.claude/USAGE_TEMPLATE.md
```

Or view the full system guide:

```markdown
# Intelligence System

@~/.claude-intelligence-system/CLAUDE.md
```

### Manual Method 2: Copy Template

Copy the template content:

```bash
cat ~/.claude-intelligence-system/.claude/USAGE_TEMPLATE.md >> your-project/CLAUDE.md
```

Or use inline with markers:

```bash
cat >> your-project/CLAUDE.md << 'EOF'

<!-- ULTIMATE_INTELLIGENCE_SYSTEM_START -->
$(cat ~/.claude-intelligence-system/.claude/USAGE_TEMPLATE.md)
<!-- ULTIMATE_INTELLIGENCE_SYSTEM_END -->
EOF
```

## Troubleshooting

### Issue: Integration Script Not Found

**Error**:
```
bash: /Users/you/.claude-intelligence-system/scripts/integrate_claude_md.sh: No such file or directory
```

**Solution**:
```bash
# Reinstall the system
curl -fsSL https://raw.githubusercontent.com/yangsi7/intelligence-system/main/install.sh | bash
```

### Issue: Import Not Resolving

**Symptom**: Claude says "Cannot find file referenced by @..."

**Cause**: Path in import doesn't match your system

**Solution**: Check actual path and update:
```bash
# Find correct path
ls -la ~/.claude-intelligence-system/.claude/USAGE_TEMPLATE.md

# Update import in CLAUDE.md to match
```

### Issue: Duplicate Integration

**Symptom**: Multiple import lines or sections in CLAUDE.md

**Cause**: Running integration script multiple times with different methods

**Solution**: Manually edit CLAUDE.md and remove duplicates, keeping one import line

### Issue: Permission Denied

**Error**:
```
Permission denied: CLAUDE.md
```

**Solution**:
```bash
# Check file permissions
ls -la CLAUDE.md

# Fix if needed
chmod 644 CLAUDE.md
```

### Issue: Integration Not Showing in Claude Code

**Symptom**: Integration added but Claude doesn't seem to have access

**Cause**: CLAUDE.md not in active session's context hierarchy

**Solution**:
- Ensure CLAUDE.md is in project root or `.claude/` directory
- Restart Claude Code session
- Run `/memory` to verify loaded files

## Frequently Asked Questions

### Q: Will integration modify my existing CLAUDE.md content?

**A**: No. The script only appends new content or adds a single import line. Your existing content is never modified. Backups are created before any changes.

### Q: Can I remove the integration later?

**A**: Yes. Simply delete the import line or the marked section from your CLAUDE.md. Or remove the entire `.claude/CLAUDE.md` file if it only contains the integration.

### Q: Does the integration work for team projects?

**A**: Yes. The integration is designed for team use:
- **Import method**: Each team member must have the system installed
- **Inline method**: Works immediately for all team members (no installation required)

**Best practice**: Use import method and document system installation in your README

### Q: How do I update to a newer version?

**A**: If using **import method** - automatic (references latest template)

If using **inline method**:
```bash
# Re-run integration with force flag (when available)
# Or manually copy new template content
```

### Q: Can I customize the integration?

**A**: Yes:
- **Fork the template**: Copy USAGE_TEMPLATE.md to your project and customize
- **Partial import**: Reference only specific sections you need
- **Extend**: Add your own sections after the integration

### Q: Does it work with CLAUDE.local.md?

**A**: CLAUDE.local.md is deprecated in favor of imports. Use:
```markdown
# In CLAUDE.md
@~/.claude/my-local-instructions.md
```

### Q: What if my project has multiple CLAUDE.md files in subdirectories?

**A**: Claude Code loads CLAUDE.md recursively. Integration in root CLAUDE.md provides system-wide availability. Subdirectory CLAUDE.md files can also have their own imports if needed.

### Q: Can I use a different template?

**A**: Yes. Create your own template and point the import to it:
```markdown
@/path/to/your/custom-template.md
```

### Q: Does integration affect token usage?

**A**: Yes, positively:
- **Import method**: ~500 tokens (template size)
- **Inline method**: ~500 tokens (same content, but static)
- **Without integration**: Requires Claude to search/deduce system capabilities (inconsistent)

**Savings**: Provides consistent context efficiently

## See Also

- [Main README](README.md) - Installation and overview
- [System Guide (CLAUDE.md)](CLAUDE.md) - Comprehensive usage documentation
- [Usage Template](.claude/USAGE_TEMPLATE.md) - The template that gets integrated
- [Integration Script](scripts/integrate_claude_md.sh) - Technical implementation

## Support

If you encounter issues not covered in this guide:

1. **Check Installation**: Run `ls -la ~/.claude-intelligence-system`
2. **Verify System**: Ask Claude: "Verify my intelligence system"
3. **Review Logs**: Check integration script output for errors
4. **Report Issues**: [GitHub Issues](https://github.com/yangsi7/intelligence-system/issues)

---

**Version**: 1.2.1
**Last Updated**: 2025-10-12
