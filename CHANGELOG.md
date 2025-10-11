# Changelog

All notable changes to the Ultimate Intelligence System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-11

### Added
- **PROJECT_INDEX Integration** - Absorbed claude-code-project-index into unified system
- index-analyzer agent with enhanced intelligence CLI support
- /index slash command for creating/updating PROJECT_INDEX.json
- Auto-indexing with -i flag (`fix bug -i50`, `-i75d10`, etc.)
- Clipboard export with -ic flag for external AI
- Python 3.8+ detection in installer
- Automatic hook configuration for -i flag and session-end refresh
- PROJECT_INDEX scripts (project_index.py, index_utils.py, hooks)
- Migration detection and cleanup for old claude-code-project-index installations

### Changed
- Agent count: 6 → 7 (added index-analyzer)
- Slash command count: 5 → 6 (added /index)
- Installation now includes PROJECT_INDEX scripts and hooks
- Enhanced documentation with PROJECT_INDEX usage examples
- index-analyzer agent now references unified intelligence system
- Updated install.sh with comprehensive PROJECT_INDEX setup

### Features
- **Deep Code Intelligence**: Functions, classes, signatures with type annotations
- **Call Graph Analysis**: What calls what, complete execution paths
- **Dependency Mapping**: Import relationships and module coupling
- **Auto-Refresh**: Hooks keep index current on session end
- **Smart Regeneration**: Only regenerates when files change or size differs
- **Size Control**: `-i50` (50k tokens), `-i75d10` (75k with depth 10)
- **External AI Export**: `-ic200` exports up to 800k tokens for external AI

### Removed
- Dependency on separate claude-code-project-index installation
- External installation step for PROJECT_INDEX

### Fixed
- GitHub repository URLs updated to correct username (yangsi7)

## [1.0.0] - 2025-10-11

### Added
- Initial release of Ultimate Intelligence System
- 3 orchestrator patterns (meta, normal, integrated)
- 6 specialized agents (orchestrator, researcher, implementor, reviewer, tester, postflight)
- System-installer agent for installation verification and repair
- Unified intelligence CLI with 29+ commands
- 5 slash commands (/intel, /orchestrate, /search, /validate, /workflow)
- 6 workflow definitions (3 built-in + 3 custom)
- One-line installer (`curl | bash`)
- Comprehensive documentation (CLAUDE.md, ORCHESTRATOR_SELECTION_GUIDE.md)
- Uninstaller script
- Token optimization strategies (90% savings via @-references)
- Complete migration from two separate systems (zero feature loss)

### Features
- **Meta Orchestrator**: Dynamic agent creation for novel tasks
- **Normal Orchestrator**: Standard workflow for routine development
- **Integrated Orchestrator**: Intelligence-first for complex analysis
- **Intelligence CLI**: Presets (compact, standard, extended)
- **Workflow Chains**: Custom analysis sequences
- **Pattern Detection**: Code smells, circular dependencies, dead code
- **Dependency Analysis**: Call graphs, hotspots, centrality
- **File-Based Communication**: Agent isolation and coordination
- **Parallel Agent Execution**: Optimized performance
- **Comprehensive Validation**: Postflight quality gates

### Documentation
- Installation guide
- Usage examples
- Orchestrator selection guide
- CLI reference
- Agent capability definitions
- Best practices
- Troubleshooting guide

### Installer
- Detects OS (macOS/Linux)
- Checks dependencies (Node.js ≥18, git, jq)
- Interactive and non-interactive modes
- Backup existing installations
- Clone from GitHub or copy from local
- Clean macOS artifacts automatically
- Set executable permissions
- Install agents to ~/.claude/agents/
- Install commands to ~/.claude/commands/
- Verification test after installation

### Requirements
- Node.js ≥18
- Claude Code with subagent support
- macOS or Linux
- git and jq (for installation)

---

## Future Enhancements

### Planned for v1.2.0
- GitHub Actions integration
- CI/CD workflow examples
- Additional workflow definitions
- Enhanced error handling
- Performance optimizations
- Extended CLI commands

### Planned for v2.0.0
- VS Code extension integration
- Plugin system for custom orchestrators
- Web dashboard for monitoring
- Advanced analytics
- ML-powered code analysis

### Community Requests
- Windows support
- Docker containerization
- Multi-project orchestration
- Real-time collaboration features
- Cloud deployment options

---

For full release notes and updates, see: https://github.com/yangsi7/intelligence-system/releases
