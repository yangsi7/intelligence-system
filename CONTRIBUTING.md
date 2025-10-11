# Contributing to Ultimate Intelligence System

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

### Prerequisites

- Node.js >= 18
- Python >= 3.8
- git, jq (for installation testing)

### Local Development

1. Fork and clone the repository
2. Install development dependencies:
   ```bash
   pip install pytest pytest-cov pytest-mock pytest-timeout
   ```

3. Run tests to verify setup:
   ```bash
   # Python tests
   python -m pytest tests/ -v

   # JavaScript CLI test
   node .claude/improved_intelligence/code-intel.mjs help
   ```

## Project Structure

This is a multi-language Claude Code extension system:

- **Python**: `scripts/*.py` - PROJECT_INDEX utilities (tested with 125 tests)
- **JavaScript/MJS**: `.claude/improved_intelligence/*.mjs` - Intelligence CLI
- **Markdown**: `.claude/agents/*.md` - Agent definitions with YAML frontmatter
- **Markdown**: `.claude/commands/*.md` - Slash command definitions
- **Shell**: `install.sh`, `uninstall.sh` - Installation scripts

## Making Changes

### For Python Code

1. Write tests first (TDD approach)
2. Follow PEP 8 style guidelines
3. Run tests: `pytest tests/ -v`
4. Check formatting: `black --check scripts/ tests/`

### For JavaScript/MJS Code

1. Ensure ES module syntax is correct
2. Test with Node.js 18+
3. Check syntax: `node --check file.mjs`

### For Agent Definitions

Agent files must have YAML frontmatter:

```markdown
---
name: agent-name
description: When this agent should be invoked
tools: Read, Write, Bash
model: sonnet
---

Agent system prompt goes here.
```

### For Slash Commands

Slash commands are markdown files that define Claude Code commands.

## Testing

### Running Tests Locally

```bash
# All Python tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=scripts --cov-report=term

# Specific test file
pytest tests/test_python_parser.py -v
```

### Adding New Tests

1. Create test file in `tests/` directory
2. Name it `test_*.py`
3. Use pytest fixtures from `tests/conftest.py`
4. Aim for comprehensive coverage

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear commits
3. Add/update tests as needed
4. Ensure all tests pass locally
5. Update documentation if needed
6. Submit PR with clear description

### PR Checklist

- [ ] Tests pass locally
- [ ] Code follows project style
- [ ] Documentation updated (if applicable)
- [ ] CHANGELOG.md updated (if applicable)
- [ ] Multi-language compatibility checked

## Code Style

### Python

- Use Black for formatting (line length: 100)
- Follow PEP 8
- Use type hints where appropriate
- Document functions with docstrings

### JavaScript/MJS

- Use ES modules syntax
- 2-space indentation
- Clear variable names
- Comment complex logic

### Markdown

- Use clear headings
- Keep line length reasonable
- Check formatting with markdownlint

## Commit Messages

- Use clear, descriptive commit messages
- Start with verb in present tense
- Examples:
  - "Add Python parser tests"
  - "Fix TypeScript type alias regex"
  - "Update README with installation instructions"

## Questions?

Feel free to open an issue for:
- Questions about contributing
- Suggestions for improvement
- Discussion of major changes before implementing

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
