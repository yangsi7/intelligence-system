#!/bin/bash
set -eo pipefail

# Ultimate Intelligence System Uninstaller
# Removes Intelligence System from ~/.claude-intelligence-system and ~/.claude/

echo "Ultimate Intelligence System Uninstaller"
echo "========================================"
echo ""

# Check if installed
if [[ ! -d "$HOME/.claude-intelligence-system" ]]; then
    echo "⚠️  Intelligence System not found at ~/.claude-intelligence-system"
    echo "Nothing to uninstall."
    exit 0
fi

# Confirm uninstallation
if [ -t 0 ]; then
    # Interactive mode
    echo "This will remove:"
    echo "  • Installation directory: ~/.claude-intelligence-system"
    echo "  • 7 agents from ~/.claude/agents/"
    echo "  • 5 slash commands from ~/.claude/commands/"
    echo ""
    read -p "Continue with uninstallation? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Uninstallation cancelled"
        exit 0
    fi
fi

echo ""
echo "Uninstalling Intelligence System..."

# Remove installation directory
if [[ -d "$HOME/.claude-intelligence-system" ]]; then
    rm -rf "$HOME/.claude-intelligence-system"
    echo "✓ Removed installation directory"
fi

# Remove agents
echo ""
echo "Removing agents..."
AGENTS=("orchestrator" "researcher" "implementor" "reviewer" "tester" "postflight" "system-installer")
for agent in "${AGENTS[@]}"; do
    if [[ -f "$HOME/.claude/agents/${agent}.md" ]]; then
        rm -f "$HOME/.claude/agents/${agent}.md"
        echo "  ✓ Removed ${agent}.md"
    fi
done

# Remove slash commands
echo ""
echo "Removing slash commands..."
COMMANDS=("intel" "orchestrate" "search" "validate" "workflow")
for cmd in "${COMMANDS[@]}"; do
    if [[ -f "$HOME/.claude/commands/${cmd}.md" ]]; then
        rm -f "$HOME/.claude/commands/${cmd}.md"
        echo "  ✓ Removed /${cmd}"
    fi
done

echo ""
echo "=========================================="
echo "✅ Intelligence System uninstalled"
echo "=========================================="
echo ""
echo "To reinstall:"
echo "curl -fsSL https://raw.githubusercontent.com/simonpierreboucher0/intelligence-system/main/install.sh | bash"
echo ""
