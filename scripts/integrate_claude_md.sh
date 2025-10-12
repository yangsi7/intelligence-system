#!/bin/bash
set -eo pipefail

# Ultimate Intelligence System - CLAUDE.md Integration Script
# Adds intelligence system usage guide to project CLAUDE.md files

# Configuration
SYSTEM_DIR="${SYSTEM_DIR:-$HOME/.claude-intelligence-system}"
TEMPLATE_PATH="${TEMPLATE_PATH:-$SYSTEM_DIR/.claude/USAGE_TEMPLATE.md}"
IMPORT_LINE="${IMPORT_LINE:-@$HOME/.claude-intelligence-system/.claude/USAGE_TEMPLATE.md}"
MARKER_START="<!-- ULTIMATE_INTELLIGENCE_SYSTEM_START -->"
MARKER_END="<!-- ULTIMATE_INTELLIGENCE_SYSTEM_END -->"
VERSION="v1.2.1"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Only run startup checks if being executed (not sourced for testing)
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    # Get target project directory
    TARGET_DIR="${1:-.}"
    TARGET_DIR="$(cd "$TARGET_DIR" && pwd)" 2>/dev/null || {
        echo -e "${RED}Error: Directory '$1' does not exist${NC}"
        exit 1
    }

    echo "Intelligence System Integration"
    echo "================================"
    echo ""
    echo "Target: $TARGET_DIR"
    echo ""

    # Check if system is installed
    if [[ ! -d "$SYSTEM_DIR" ]]; then
        echo -e "${RED}Error: Intelligence System not installed${NC}"
        echo "Install it first: curl -fsSL https://raw.githubusercontent.com/yangsi7/intelligence-system/main/install.sh | bash"
        exit 1
    fi

    # Check if template exists
    if [[ ! -f "$TEMPLATE_PATH" ]]; then
        echo -e "${RED}Error: Template file not found: $TEMPLATE_PATH${NC}"
        echo "Reinstall the system to fix this issue"
        exit 1
    fi
fi

# Function: Check if already integrated
check_integration_exists() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        return 1
    fi

    # Check for import line or markers
    # Use $SYSTEM_DIR to be test-friendly (tests override this variable)
    if grep -q "@.*USAGE_TEMPLATE.md" "$file" 2>/dev/null; then
        return 0
    fi
    if grep -q "ULTIMATE_INTELLIGENCE_SYSTEM" "$file" 2>/dev/null; then
        return 0
    fi

    return 1
}

# Function: Add import line to file
add_import_integration() {
    local file="$1"
    echo ""
    echo "Adding import-based integration to $file..."

    # Create backup
    cp "$file" "${file}.backup-$(date +%Y%m%d_%H%M%S)"

    # Add import at the end with clear section
    {
        echo ""
        echo "# Intelligence System Integration"
        echo ""
        echo "This project uses the Ultimate Intelligence System for enhanced development workflows."
        echo "For usage guide, see:"
        echo ""
        echo "$IMPORT_LINE"
    } >> "$file"

    echo -e "${GREEN}✓ Integration added successfully${NC}"
    echo "  Import line: $IMPORT_LINE"
}

# Function: Add inline integration
add_inline_integration() {
    local file="$1"

    # Check if template exists
    if [[ ! -f "$TEMPLATE_PATH" ]]; then
        echo -e "${RED}Error: Template file not found: $TEMPLATE_PATH${NC}"
        return 1
    fi

    echo ""
    echo "Adding inline integration to $file..."

    # Create backup
    cp "$file" "${file}.backup-$(date +%Y%m%d_%H%M%S)"

    # Add template content with markers
    {
        echo ""
        echo "$MARKER_START"
        echo "<!-- Installed: $(date +%Y-%m-%d) | Version: $VERSION -->"
        echo ""
        cat "$TEMPLATE_PATH"
        echo ""
        echo "$MARKER_END"
    } >> "$file"

    echo -e "${GREEN}✓ Integration added successfully${NC}"
    echo "  Mode: Inline (between marker comments)"
}

# Function: Create new .claude/CLAUDE.md with import
create_dotclaude_memory() {
    local target_dir="${1:-$TARGET_DIR}"
    local dotclaude_dir="$target_dir/.claude"
    local claude_md="$dotclaude_dir/CLAUDE.md"

    echo ""
    echo "Creating $claude_md..."

    mkdir -p "$dotclaude_dir"

    cat > "$claude_md" << EOF
# Project Memory

This file contains project-specific instructions for Claude Code.

# Intelligence System Integration

This project uses the Ultimate Intelligence System for enhanced development workflows.
For usage guide, see:

$IMPORT_LINE
EOF

    echo -e "${GREEN}✓ Created $claude_md with integration${NC}"
}

# Main integration logic
main() {
    local root_claude_md="$TARGET_DIR/CLAUDE.md"
    local dotclaude_claude_md="$TARGET_DIR/.claude/CLAUDE.md"
    local dotclaude_dir="$TARGET_DIR/.claude"

    # Check if already integrated
    if check_integration_exists "$root_claude_md"; then
        echo -e "${YELLOW}✓ Already integrated in CLAUDE.md${NC}"
        echo "  No changes needed"
        exit 0
    fi

    if check_integration_exists "$dotclaude_claude_md"; then
        echo -e "${YELLOW}✓ Already integrated in .claude/CLAUDE.md${NC}"
        echo "  No changes needed"
        exit 0
    fi

    # Scenario 1: Root CLAUDE.md exists
    if [[ -f "$root_claude_md" ]]; then
        echo "Found existing CLAUDE.md"

        # Check if running interactively
        if [ -t 0 ]; then
            echo ""
            echo "Integration method:"
            echo "  1) Import (recommended) - Single line reference, always up-to-date"
            echo "  2) Inline - Full template embedded in file"
            echo ""
            read -p "Choose method (1/2, default: 1): " -n 1 -r
            echo ""

            if [[ $REPLY == "2" ]]; then
                add_inline_integration "$root_claude_md"
            else
                add_import_integration "$root_claude_md"
            fi
        else
            # Non-interactive: use import by default
            add_import_integration "$root_claude_md"
        fi

    # Scenario 2: .claude/CLAUDE.md exists
    elif [[ -f "$dotclaude_claude_md" ]]; then
        echo "Found existing .claude/CLAUDE.md"

        if [ -t 0 ]; then
            echo ""
            echo "Integration method:"
            echo "  1) Import (recommended)"
            echo "  2) Inline"
            echo ""
            read -p "Choose method (1/2, default: 1): " -n 1 -r
            echo ""

            if [[ $REPLY == "2" ]]; then
                add_inline_integration "$dotclaude_claude_md"
            else
                add_import_integration "$dotclaude_claude_md"
            fi
        else
            add_import_integration "$dotclaude_claude_md"
        fi

    # Scenario 3: .claude directory exists but no CLAUDE.md
    elif [[ -d "$dotclaude_dir" ]]; then
        create_dotclaude_memory

    # Scenario 4: Nothing exists
    else
        echo "No CLAUDE.md found"

        if [ -t 0 ]; then
            echo ""
            echo "Where to create integration?"
            echo "  1) .claude/CLAUDE.md (recommended for projects)"
            echo "  2) CLAUDE.md (root level)"
            echo ""
            read -p "Choose location (1/2, default: 1): " -n 1 -r
            echo ""

            if [[ $REPLY == "2" ]]; then
                cat > "$root_claude_md" << EOF
# Project Memory

$IMPORT_LINE
EOF
                echo -e "${GREEN}✓ Created $root_claude_md with integration${NC}"
            else
                create_dotclaude_memory
            fi
        else
            # Non-interactive: create .claude/CLAUDE.md by default
            create_dotclaude_memory
        fi
    fi

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Integration Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "The Intelligence System usage guide is now available in your project."
    echo ""
    echo "Next steps:"
    echo "  1. Run: /index (generate PROJECT_INDEX.json)"
    echo "  2. Try: /intel compact (quick codebase overview)"
    echo "  3. Read: cat ~/.claude-intelligence-system/CLAUDE.md"
    echo ""
}

# Run main function only if script is executed (not sourced)
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
else
    # Script is being sourced (for testing), export functions
    export -f check_integration_exists
    export -f add_import_integration
    export -f add_inline_integration
    export -f create_dotclaude_memory
fi
