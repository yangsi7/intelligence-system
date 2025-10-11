## Description

Provide a clear description of your changes.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] Test additions or improvements
- [ ] CI/CD improvements

## Components Modified

- [ ] Python scripts (scripts/*.py)
- [ ] JavaScript CLI (.claude/improved_intelligence/*.mjs)
- [ ] Agent definitions (.claude/agents/*.md)
- [ ] Slash commands (.claude/commands/*.md)
- [ ] Orchestrators (.claude/orchestrators/*.md)
- [ ] Workflows (.claude/workflows/*.json)
- [ ] Shell scripts (install.sh, uninstall.sh)
- [ ] Tests (tests/*.py)
- [ ] Documentation (*.md)
- [ ] GitHub Actions workflows (.github/workflows/*.yml)

## Testing Checklist

- [ ] All existing tests pass (`pytest tests/ -v`)
- [ ] New tests added for new functionality
- [ ] Tested on macOS (if applicable)
- [ ] Tested on Linux (if applicable)
- [ ] JavaScript CLI tested (`node .claude/improved_intelligence/code-intel.mjs help`)
- [ ] Installation tested (`./install.sh` or `./test-installation.sh`)
- [ ] Agent definitions validated (YAML frontmatter present)
- [ ] Code style checks pass (black, eslint, markdownlint)

## Documentation

- [ ] README.md updated (if user-facing changes)
- [ ] CHANGELOG.md updated
- [ ] Inline code comments added/updated
- [ ] Agent prompts updated (if agent behavior changed)

## Multi-Language Compatibility

If this PR affects multiple languages, confirm compatibility:

- [ ] Python changes are compatible with Python 3.8+
- [ ] JavaScript changes are compatible with Node.js 18+
- [ ] Shell scripts work on both macOS and Linux
- [ ] Markdown formatting is valid

## Related Issues

Closes #(issue number)
Relates to #(issue number)

## Additional Notes

Add any additional notes, context, or screenshots here.

## Reviewer Checklist (for maintainers)

- [ ] Code follows project style guidelines
- [ ] Changes are well-tested
- [ ] Documentation is complete
- [ ] No breaking changes (or properly documented)
- [ ] CI/CD passes
