#!/bin/bash
set -eo pipefail

# Ultimate Intelligence System Installer
# Installs Intelligence System to ~/.claude-intelligence-system

echo "Ultimate Intelligence System Installer"
echo "======================================"
echo ""

# Fixed installation location
INSTALL_DIR="$HOME/.claude-intelligence-system"

# Detect OS type
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS_TYPE="macos"
    echo "✓ Detected macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS_TYPE="linux"
    echo "✓ Detected Linux"
else
    echo "❌ Error: Unsupported OS type: $OSTYPE"
    echo "This installer supports macOS and Linux only"
    exit 1
fi

# Check dependencies
echo ""
echo "Checking dependencies..."

# Check for git, jq, and Node.js
for cmd in git jq; do
    if ! command -v "$cmd" &> /dev/null; then
        echo "❌ Error: $cmd is required but not installed"
        echo "Please install $cmd and try again"
        exit 1
    fi
done

# Check Node.js version (need >=18)
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ "$NODE_VERSION" -ge 18 ]]; then
        echo "✓ Node.js $NODE_VERSION (required: ≥18)"
    else
        echo "❌ Error: Node.js ≥18 required, found v$NODE_VERSION"
        echo "Please upgrade Node.js and try again"
        exit 1
    fi
else
    echo "❌ Error: Node.js is required but not installed"
    echo "Please install Node.js ≥18 and try again"
    exit 1
fi

echo "✓ All dependencies satisfied"

# Check for Python 3.8+ (for PROJECT_INDEX)
PYTHON_CMD=""
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | grep -oE '[0-9]+\.[0-9]+' | head -1)
    PYTHON_MAJOR=$(echo "$PYTHON_VERSION" | cut -d'.' -f1)
    PYTHON_MINOR=$(echo "$PYTHON_VERSION" | cut -d'.' -f2)

    if [[ "$PYTHON_MAJOR" -ge 3 ]] && [[ "$PYTHON_MINOR" -ge 8 ]]; then
        PYTHON_CMD="python3"
        echo "✓ Python $PYTHON_VERSION (required: ≥3.8 for PROJECT_INDEX)"
    else
        echo "⚠️  Python $PYTHON_VERSION found (PROJECT_INDEX needs ≥3.8)"
        echo "   PROJECT_INDEX features will be limited"
    fi
else
    echo "⚠️  Python 3.8+ not found (recommended for PROJECT_INDEX)"
    echo "   Install Python 3.8+ for full indexing capabilities"
fi

# Check if already installed
if [[ -d "$INSTALL_DIR" ]]; then
    echo ""
    echo "⚠️  Found existing installation at $INSTALL_DIR"

    # Check if we're running interactively or via pipe
    if [ -t 0 ]; then
        # Interactive mode - can use read
        read -p "Remove and reinstall? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Installation cancelled"
            exit 0
        fi
    else
        # Non-interactive mode (curl | bash) - auto-reinstall
        echo "Running in non-interactive mode, removing and reinstalling..."
    fi

    echo "Removing existing installation..."
    rm -rf "$INSTALL_DIR"
fi

# Detect if running from repo or need to clone
SCRIPT_DIR=""
if [[ -n "${BASH_SOURCE[0]:-}" ]]; then
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi

# Clone or copy repository
echo ""
echo "Installing Intelligence System..."

# If we're running from the repo, copy files
if [[ -f "$SCRIPT_DIR/.claude/improved_intelligence/code-intel.mjs" || -f "$SCRIPT_DIR/CLAUDE.md" ]]; then
    echo "Installing from local repository..."

    # Create install directory
    mkdir -p "$INSTALL_DIR"

    # Copy core files
    cp "$SCRIPT_DIR/install.sh" "$INSTALL_DIR/" 2>/dev/null || true
    cp "$SCRIPT_DIR/uninstall.sh" "$INSTALL_DIR/" 2>/dev/null || true
    cp "$SCRIPT_DIR/README.md" "$INSTALL_DIR/" 2>/dev/null || true
    cp "$SCRIPT_DIR/LICENSE" "$INSTALL_DIR/" 2>/dev/null || true
    cp "$SCRIPT_DIR/CLAUDE.md" "$INSTALL_DIR/" 2>/dev/null || true

    # Copy .claude directory structure
    if [[ -d "$SCRIPT_DIR/.claude" ]]; then
        # Copy orchestrators
        if [[ -d "$SCRIPT_DIR/.claude/orchestrators" ]]; then
            mkdir -p "$INSTALL_DIR/orchestrators"
            cp -r "$SCRIPT_DIR/.claude/orchestrators"/* "$INSTALL_DIR/orchestrators/" 2>/dev/null || true
        fi

        # Copy intelligence CLI
        if [[ -d "$SCRIPT_DIR/.claude/improved_intelligence" ]]; then
            mkdir -p "$INSTALL_DIR/improved_intelligence"
            cp -r "$SCRIPT_DIR/.claude/improved_intelligence"/* "$INSTALL_DIR/improved_intelligence/" 2>/dev/null || true
        fi

        # Copy workflows
        if [[ -d "$SCRIPT_DIR/.claude/workflows" ]]; then
            mkdir -p "$INSTALL_DIR/workflows"
            cp -r "$SCRIPT_DIR/.claude/workflows"/* "$INSTALL_DIR/workflows/" 2>/dev/null || true
        fi

        # Copy orchestrator selection guide
        if [[ -f "$SCRIPT_DIR/.claude/ORCHESTRATOR_SELECTION_GUIDE.md" ]]; then
            cp "$SCRIPT_DIR/.claude/ORCHESTRATOR_SELECTION_GUIDE.md" "$INSTALL_DIR/" 2>/dev/null || true
        fi
    fi

    # Copy PROJECT_INDEX scripts
    if [[ -d "$SCRIPT_DIR/scripts" ]]; then
        mkdir -p "$INSTALL_DIR/scripts"
        cp -r "$SCRIPT_DIR/scripts"/* "$INSTALL_DIR/scripts/" 2>/dev/null || true
    fi

    # Clean macOS artifacts
    find "$INSTALL_DIR" -name ".DS_Store" -delete 2>/dev/null || true
    find "$INSTALL_DIR" -name "__MACOSX" -type d -exec rm -rf {} + 2>/dev/null || true

    echo "✓ Files copied to $INSTALL_DIR"
else
    # Clone from GitHub
    echo "Cloning from GitHub..."
    git clone --depth 1 https://github.com/yangsi7/intelligence-system.git "$INSTALL_DIR"

    # Reorganize structure (move .claude/* to root of install dir)
    if [[ -d "$INSTALL_DIR/.claude" ]]; then
        # Move orchestrators
        if [[ -d "$INSTALL_DIR/.claude/orchestrators" ]]; then
            mv "$INSTALL_DIR/.claude/orchestrators" "$INSTALL_DIR/" 2>/dev/null || true
        fi

        # Move intelligence CLI
        if [[ -d "$INSTALL_DIR/.claude/improved_intelligence" ]]; then
            mv "$INSTALL_DIR/.claude/improved_intelligence" "$INSTALL_DIR/" 2>/dev/null || true
        fi

        # Move workflows
        if [[ -d "$INSTALL_DIR/.claude/workflows" ]]; then
            mv "$INSTALL_DIR/.claude/workflows" "$INSTALL_DIR/" 2>/dev/null || true
        fi

        # Move orchestrator guide
        if [[ -f "$INSTALL_DIR/.claude/ORCHESTRATOR_SELECTION_GUIDE.md" ]]; then
            mv "$INSTALL_DIR/.claude/ORCHESTRATOR_SELECTION_GUIDE.md" "$INSTALL_DIR/" 2>/dev/null || true
        fi
    fi

    # Ensure scripts directory exists
    if [[ ! -d "$INSTALL_DIR/scripts" ]] && [[ -d "$INSTALL_DIR/.claude/scripts" ]]; then
        mv "$INSTALL_DIR/.claude/scripts" "$INSTALL_DIR/" 2>/dev/null || true
    fi

    # Clean macOS artifacts
    find "$INSTALL_DIR" -name ".DS_Store" -delete 2>/dev/null || true
    find "$INSTALL_DIR" -name "__MACOSX" -type d -exec rm -rf {} + 2>/dev/null || true

    echo "✓ Repository cloned to $INSTALL_DIR"
fi

# Make CLI scripts executable
echo ""
echo "Setting executable permissions..."
chmod +x "$INSTALL_DIR/install.sh" 2>/dev/null || true
chmod +x "$INSTALL_DIR/uninstall.sh" 2>/dev/null || true
chmod +x "$INSTALL_DIR/improved_intelligence/code-intel.mjs" 2>/dev/null || true
chmod +x "$INSTALL_DIR/improved_intelligence/cli/intel_mjs/src/cli"/*.mjs 2>/dev/null || true

# Make PROJECT_INDEX scripts executable
if [[ -d "$INSTALL_DIR/scripts" ]]; then
    chmod +x "$INSTALL_DIR/scripts"/*.py 2>/dev/null || true
    chmod +x "$INSTALL_DIR/scripts"/*.sh 2>/dev/null || true
fi

echo "✓ Permissions set"

# Configure PROJECT_INDEX integration
if [[ -n "$PYTHON_CMD" ]] && [[ -d "$INSTALL_DIR/scripts" ]]; then
    echo ""
    echo "Configuring PROJECT_INDEX integration..."

    # Save Python command
    echo "$PYTHON_CMD" > "$INSTALL_DIR/.python_cmd"
    echo "   ✓ Python command saved"

    # Configure hooks in settings.json
    SETTINGS_FILE="$HOME/.claude/settings.json"

    # Ensure settings.json exists
    mkdir -p "$HOME/.claude"
    if [[ ! -f "$SETTINGS_FILE" ]]; then
        echo "{}" > "$SETTINGS_FILE"
    fi

    # Backup settings.json
    cp "$SETTINGS_FILE" "${SETTINGS_FILE}.backup-$(date +%Y%m%d_%H%M%S)"

    # Update hooks with jq
    if command -v jq &> /dev/null; then
        # Create temporary jq script
        JQ_SCRIPT='
        # Initialize hooks if not present
        if .hooks == null then .hooks = {} else . end |

        # UserPromptSubmit hook (for -i flag detection)
        .hooks.UserPromptSubmit = (
          if .hooks.UserPromptSubmit == null then [] else .hooks.UserPromptSubmit end |
          # Remove old PROJECT_INDEX hooks
          [.[] | select(
            all(.hooks[]?.command // "";
              (contains("i_flag_hook.py") or contains("claude-code-project-index")) | not)
          )] +
          # Add new hook
          [{
            "hooks": [{
              "type": "command",
              "command": "'"$HOME"'/.claude-intelligence-system/scripts/run_python.sh '"$HOME"'/.claude-intelligence-system/scripts/i_flag_hook.py",
              "timeout": 20
            }]
          }]
        ) |

        # Stop hook (for index refresh on session end)
        .hooks.Stop = (
          if .hooks.Stop == null then [] else .hooks.Stop end |
          # Remove old PROJECT_INDEX hooks
          [.[] | select(
            all(.hooks[]?.command // "";
              (contains("stop_hook.py") or contains("claude-code-project-index")) | not)
          )] +
          # Add new hook
          [{
            "matcher": "",
            "hooks": [{
              "type": "command",
              "command": "'"$HOME"'/.claude-intelligence-system/scripts/run_python.sh '"$HOME"'/.claude-intelligence-system/scripts/stop_hook.py",
              "timeout": 10
            }]
          }]
        )
        '

        # Apply jq script
        if jq "$JQ_SCRIPT" "$SETTINGS_FILE" > "${SETTINGS_FILE}.tmp"; then
            mv "${SETTINGS_FILE}.tmp" "$SETTINGS_FILE"
            echo "   ✓ Hooks configured in settings.json"
        else
            echo "   ⚠️  Could not update hooks automatically"
            echo "      You can configure manually if needed"
            rm "${SETTINGS_FILE}.tmp" 2>/dev/null || true
        fi
    else
        echo "   ⚠️  jq not available, skipping hook configuration"
        echo "      Hooks can be configured manually if needed"
    fi

    echo "✓ PROJECT_INDEX integration configured"
elif [[ ! -n "$PYTHON_CMD" ]]; then
    echo ""
    echo "⚠️  Skipping PROJECT_INDEX integration (Python 3.8+ not found)"
    echo "   Install Python 3.8+ and re-run installer for full capabilities"
fi

# Install agents to ~/.claude/agents/
echo ""
echo "Installing agents..."
mkdir -p "$HOME/.claude/agents"

# Check if .claude/agents exists in source
if [[ -d "$SCRIPT_DIR/.claude/agents" ]]; then
    # Local installation
    cp "$SCRIPT_DIR/.claude/agents"/*.md "$HOME/.claude/agents/" 2>/dev/null || true
    echo "✓ Agents installed to ~/.claude/agents/"
elif [[ -d "$INSTALL_DIR/.claude/agents" ]]; then
    # GitHub installation
    cp "$INSTALL_DIR/.claude/agents"/*.md "$HOME/.claude/agents/" 2>/dev/null || true
    echo "✓ Agents installed to ~/.claude/agents/"
else
    echo "⚠️  No agents directory found, skipping agent installation"
fi

# Install slash commands to ~/.claude/commands/
echo ""
echo "Installing slash commands..."
mkdir -p "$HOME/.claude/commands"

# Check if .claude/commands exists in source
if [[ -d "$SCRIPT_DIR/.claude/commands" ]]; then
    # Local installation
    cp "$SCRIPT_DIR/.claude/commands"/*.md "$HOME/.claude/commands/" 2>/dev/null || true
    echo "✓ Commands installed to ~/.claude/commands/"
elif [[ -d "$INSTALL_DIR/.claude/commands" ]]; then
    # GitHub installation
    cp "$INSTALL_DIR/.claude/commands"/*.md "$HOME/.claude/commands/" 2>/dev/null || true
    echo "✓ Commands installed to ~/.claude/commands/"
else
    echo "⚠️  No commands directory found, skipping command installation"
fi

# Test installation
echo ""
echo "Testing installation..."
if node "$INSTALL_DIR/improved_intelligence/code-intel.mjs" help 2>/dev/null | grep -q "code-intel"; then
    echo "✓ Installation test passed"
else
    echo "⚠️  CLI test warning, but installation completed"
    echo "   You can still use the system normally"
fi

echo ""
echo "=========================================="
echo "✅ Intelligence System installed successfully!"
echo "=========================================="
echo ""
echo "📁 Installation location: $INSTALL_DIR"
echo ""
echo "🤖 Installed Components:"
echo "   • 3 Orchestrator patterns (meta, normal, integrated)"
echo "   • 7 Specialized agents (orchestrator, researcher, implementor, reviewer, tester, postflight, index-analyzer)"
echo "   • 1 System installer agent (for verification/repair)"
echo "   • 6 Slash commands (/intel, /orchestrate, /search, /validate, /workflow, /index)"
echo "   • Intelligence CLI (29+ commands)"
echo "   • PROJECT_INDEX integration (auto-indexing with -i flag)"
echo "   • 6 Workflow definitions"
echo ""
echo "🚀 Quick Start:"
echo "   • Create project index: /index"
echo "   • Use -i flag: 'fix auth bug -i'"
echo "   • Verify installation: 'Verify my intelligence system'"
echo "   • Quick code analysis: /intel compact"
echo "   • Orchestrate workflow: /orchestrate integrated \"your task\""
echo "   • Read guide: cat $INSTALL_DIR/ORCHESTRATOR_SELECTION_GUIDE.md"
echo ""
echo "📚 Documentation:"
echo "   • System guide: $INSTALL_DIR/CLAUDE.md"
echo "   • Orchestrator guide: $INSTALL_DIR/ORCHESTRATOR_SELECTION_GUIDE.md"
echo "   • CLI reference: $INSTALL_DIR/improved_intelligence/README.md"
echo ""
echo "🔧 Troubleshooting:"
echo "   • Verify: Ask Claude 'Verify my intelligence system'"
echo "   • Repair: Ask Claude 'Fix my intelligence system'"
echo "   • Uninstall: $INSTALL_DIR/uninstall.sh"
echo ""

# Check for old claude-code-project-index installation
if [[ -d "$HOME/.claude-code-project-index" ]]; then
    echo "=========================================="
    echo "📁 Old PROJECT_INDEX Installation Detected"
    echo "=========================================="
    echo ""
    echo "Found separate claude-code-project-index installation at:"
    echo "   ~/.claude-code-project-index/"
    echo ""
    echo "This has been superseded by the integrated PROJECT_INDEX in"
    echo "the Ultimate Intelligence System. Your old installation can"
    echo "be safely removed."
    echo ""

    if [ -t 0 ]; then
        # Interactive mode
        read -p "Remove old installation? (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$HOME/.claude-code-project-index"
            echo "✓ Removed old installation"
            echo ""
        else
            echo "ℹ️  Old installation kept (can be removed manually)"
            echo "   To remove: rm -rf ~/.claude-code-project-index"
            echo ""
        fi
    else
        # Non-interactive mode
        echo "ℹ️  To remove old installation, run:"
        echo "   rm -rf ~/.claude-code-project-index"
        echo ""
    fi
fi
