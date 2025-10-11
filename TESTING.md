# Testing Guide

## Overview

This project uses comprehensive testing across multiple languages:
- **Python**: 125 tests using pytest (100% pass rate)
- **JavaScript/MJS**: Syntax validation and module loading
- **Shell**: Installation and script testing
- **Markdown**: Agent and command definition validation

## Running Tests Locally

### Python Tests (Recommended)

The Python test suite is comprehensive and fully functional:

```bash
# Activate virtual environment
source .venv/bin/activate

# Run all 125 tests
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ --cov=scripts --cov-report=term --cov-report=html

# Run specific test file
python -m pytest tests/test_python_parser.py -v

# Run specific test
python -m pytest tests/test_python_parser.py::TestBasicFunctionExtraction::test_simple_function_no_params -v
```

**Expected result:** All 125 tests pass in ~0.08 seconds

### JavaScript CLI Testing

**Known Issue**: The JavaScript CLI currently has import path issues that need refactoring. The CLI works when installed via `install.sh` but has broken imports when run from the repository directly.

To test JavaScript syntax checking:

```bash
# Check all MJS files for syntax errors
find .claude/improved_intelligence -name "*.mjs" -type f -exec node --check {} \;
```

### Installation Testing

Test the full installation process:

```bash
# Run installation test script
./test-installation.sh

# Or manually test installation
bash install.sh
node ~/.claude-intelligence-system/improved_intelligence/code-intel.mjs help
bash ~/.claude-intelligence-system/uninstall.sh
```

### Linting

```bash
# Python linting
black --check scripts/ tests/
flake8 scripts/ tests/ --max-line-length=100

# JavaScript linting
eslint '.claude/improved_intelligence/**/*.mjs'

# Markdown linting
markdownlint '**/*.md' --ignore node_modules --ignore .venv
```

## Test Structure

```
tests/
├── conftest.py              # Shared fixtures
├── test_constants.py        # Configuration constants (17 tests)
├── test_python_parser.py    # Python code parsing (37 tests)
├── test_javascript_parser.py # JavaScript/TypeScript parsing (46 tests)
├── test_shell_parser.py     # Shell script parsing (7 tests)
├── test_markdown_parser.py  # Markdown structure (4 tests)
├── test_inference.py        # File/directory inference (4 tests)
├── test_gitignore.py        # Pattern matching (6 tests)
└── test_call_graph.py       # Call graph building (4 tests)
```

## Coverage

Current Python test coverage:
- **scripts/index_utils.py**: Comprehensive coverage of all parsing functions
- **Line coverage**: >95% for utility functions
- **Branch coverage**: >90% for complex logic

To generate coverage report:

```bash
pytest tests/ --cov=scripts --cov-report=html
open htmlcov/index.html  # View coverage report in browser
```

## CI/CD Testing

GitHub Actions runs tests automatically on:
- Every push to `main` and `develop` branches
- Every pull request
- Multiple OS: Ubuntu and macOS
- Multiple Python versions: 3.8, 3.9, 3.10, 3.11, 3.12, 3.13
- Multiple Node.js versions: 18, 20, 22

See `.github/workflows/` for workflow definitions.

## Adding New Tests

### For Python Code

1. Create test file in `tests/` directory
2. Name it `test_*.py`
3. Use pytest fixtures from `conftest.py`
4. Follow existing test patterns

Example:

```python
from scripts.index_utils import your_function

def test_your_function():
    result = your_function('input')
    assert result == 'expected'
```

### For Agent Definitions

Agents are Markdown files with YAML frontmatter. To validate:

```bash
# Check frontmatter exists
grep -q "^---$" .claude/agents/your-agent.md

# Validate YAML structure manually
```

## Known Issues

### JavaScript CLI Import Paths

The JavaScript CLI (`code-intel.mjs`) has import path issues when run from the repository:
- **Issue**: Imports reference `../lib/` but `lib/` is at `cli/intel_mjs/src/lib/`
- **Workaround**: CLI works correctly when installed via `install.sh`
- **Status**: Pre-existing issue, requires refactoring
- **Tracking**: Will be addressed in future release

### Workaround for Local Testing

To test the JavaScript CLI locally:

```bash
# Install the system
bash install.sh

# Test from installed location
node ~/.claude-intelligence-system/improved_intelligence/code-intel.mjs help
```

## Debugging Test Failures

### Python Test Failures

```bash
# Run with verbose output and stop on first failure
pytest tests/ -vv -x

# Run with full traceback
pytest tests/ --tb=long

# Run specific failing test with debug output
pytest tests/test_file.py::test_name -vv -s
```

### Import Errors

If you see import errors:
1. Ensure virtual environment is activated: `source .venv/bin/activate`
2. Check Python path: `python -c "import sys; print(sys.path)"`
3. Verify test dependencies installed: `pip install -r requirements-test.txt`

### Coverage Issues

If coverage seems incorrect:
1. Delete `.coverage` file: `rm .coverage`
2. Re-run with coverage: `pytest tests/ --cov=scripts`
3. Check for excluded files in `pyproject.toml`

## Continuous Integration

All tests run automatically in CI/CD:

- **test-python.yml**: Python tests across matrix of OS and Python versions
- **test-javascript.yml**: JavaScript syntax validation
- **test-installation.yml**: Full installation test
- **integration.yml**: End-to-end integration tests
- **lint-*.yml**: Code quality checks
- **security.yml**: Security scanning

View workflow runs: https://github.com/yangsi7/intelligence-system/actions

## Performance Benchmarks

- Python test suite: ~0.08 seconds for 125 tests
- Installation test: ~30-60 seconds
- Integration test: ~2-3 minutes

## Getting Help

If tests are failing:
1. Check this guide for known issues
2. Review test output carefully
3. Check CI/CD logs for differences between local and CI
4. Open an issue with full test output

For questions about testing, see [CONTRIBUTING.md](CONTRIBUTING.md).
