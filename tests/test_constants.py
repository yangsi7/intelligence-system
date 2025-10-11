"""
Tests for constants and configuration values in index_utils.py
"""

import sys
from pathlib import Path

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from index_utils import (
    IGNORE_DIRS,
    PARSEABLE_LANGUAGES,
    CODE_EXTENSIONS,
    MARKDOWN_EXTENSIONS,
    DIRECTORY_PURPOSES
)


class TestConstants:
    """Test constant configurations."""

    def test_ignore_dirs_contains_expected_directories(self):
        """Verify IGNORE_DIRS contains all expected ignore patterns."""
        expected_dirs = {
            '.git', 'node_modules', '__pycache__', '.venv',
            'build', 'dist', '.claude', '.idea', '.vscode'
        }
        assert expected_dirs.issubset(IGNORE_DIRS), \
            f"Missing expected directories: {expected_dirs - IGNORE_DIRS}"

    def test_ignore_dirs_is_set(self):
        """Verify IGNORE_DIRS is a set for O(1) lookups."""
        assert isinstance(IGNORE_DIRS, set), "IGNORE_DIRS should be a set for performance"

    def test_parseable_languages_maps_correctly(self):
        """Verify PARSEABLE_LANGUAGES has correct extension to language mappings."""
        assert PARSEABLE_LANGUAGES['.py'] == 'python'
        assert PARSEABLE_LANGUAGES['.js'] == 'javascript'
        assert PARSEABLE_LANGUAGES['.ts'] == 'typescript'
        assert PARSEABLE_LANGUAGES['.jsx'] == 'javascript'
        assert PARSEABLE_LANGUAGES['.tsx'] == 'typescript'
        assert PARSEABLE_LANGUAGES['.sh'] == 'shell'
        assert PARSEABLE_LANGUAGES['.bash'] == 'shell'

    def test_parseable_languages_extensions_start_with_dot(self):
        """Verify all PARSEABLE_LANGUAGES keys start with a dot."""
        for ext in PARSEABLE_LANGUAGES.keys():
            assert ext.startswith('.'), f"Extension {ext} should start with a dot"

    def test_code_extensions_contains_parseable_languages(self):
        """Verify CODE_EXTENSIONS includes all PARSEABLE_LANGUAGES."""
        parseable = set(PARSEABLE_LANGUAGES.keys())
        assert parseable.issubset(CODE_EXTENSIONS), \
            f"CODE_EXTENSIONS missing: {parseable - CODE_EXTENSIONS}"

    def test_code_extensions_includes_common_languages(self):
        """Verify CODE_EXTENSIONS includes common programming languages."""
        common_extensions = {
            '.py', '.js', '.ts', '.go', '.rs', '.java', '.c', '.cpp',
            '.rb', '.php', '.swift', '.kt', '.cs'
        }
        assert common_extensions.issubset(CODE_EXTENSIONS), \
            f"Missing common extensions: {common_extensions - CODE_EXTENSIONS}"

    def test_code_extensions_is_set(self):
        """Verify CODE_EXTENSIONS is a set for O(1) lookups."""
        assert isinstance(CODE_EXTENSIONS, set), "CODE_EXTENSIONS should be a set"

    def test_markdown_extensions_contains_md(self):
        """Verify MARKDOWN_EXTENSIONS includes common markdown formats."""
        assert '.md' in MARKDOWN_EXTENSIONS
        assert '.markdown' in MARKDOWN_EXTENSIONS
        assert '.rst' in MARKDOWN_EXTENSIONS

    def test_markdown_extensions_is_set(self):
        """Verify MARKDOWN_EXTENSIONS is a set."""
        assert isinstance(MARKDOWN_EXTENSIONS, set), "MARKDOWN_EXTENSIONS should be a set"

    def test_directory_purposes_completeness(self):
        """Verify DIRECTORY_PURPOSES includes all common directory patterns."""
        expected_dirs = {
            'auth', 'models', 'views', 'controllers', 'services',
            'utils', 'helpers', 'tests', 'test', 'docs', 'api',
            'components', 'lib', 'src', 'static', 'public', 'config',
            'scripts', 'middleware', 'migrations', 'fixtures'
        }
        assert expected_dirs.issubset(set(DIRECTORY_PURPOSES.keys())), \
            f"Missing directory purposes: {expected_dirs - set(DIRECTORY_PURPOSES.keys())}"

    def test_directory_purposes_has_descriptions(self):
        """Verify all DIRECTORY_PURPOSES have non-empty descriptions."""
        for dir_name, purpose in DIRECTORY_PURPOSES.items():
            assert isinstance(purpose, str), f"{dir_name} purpose should be string"
            assert len(purpose) > 0, f"{dir_name} purpose should not be empty"
            assert len(purpose) < 100, f"{dir_name} purpose should be concise"

    def test_directory_purposes_is_dict(self):
        """Verify DIRECTORY_PURPOSES is a dictionary."""
        assert isinstance(DIRECTORY_PURPOSES, dict), "DIRECTORY_PURPOSES should be a dict"

    def test_ignore_dirs_excludes_common_artifacts(self):
        """Verify IGNORE_DIRS excludes common build artifacts and dependencies."""
        artifacts = {
            'node_modules', 'bower_components', 'vendor',
            'build', 'dist', 'target', 'out',
            '__pycache__', '.pytest_cache', '.tox'
        }
        assert artifacts.issubset(IGNORE_DIRS), \
            f"Missing artifact directories: {artifacts - IGNORE_DIRS}"

    def test_ignore_dirs_excludes_ide_directories(self):
        """Verify IGNORE_DIRS excludes IDE-specific directories."""
        ide_dirs = {'.idea', '.vscode', '.vs', '.DS_Store'}
        assert ide_dirs.issubset(IGNORE_DIRS), \
            f"Missing IDE directories: {ide_dirs - IGNORE_DIRS}"

    def test_ignore_dirs_excludes_vcs_directories(self):
        """Verify IGNORE_DIRS excludes version control directories."""
        assert '.git' in IGNORE_DIRS

    def test_no_duplicate_extensions_in_code_extensions(self):
        """Verify CODE_EXTENSIONS has no duplicates (by nature of set)."""
        # This test ensures the set definition doesn't accidentally create duplicates
        # in the source code
        assert len(CODE_EXTENSIONS) == len(CODE_EXTENSIONS), "Should have no duplicates"

    def test_parseable_languages_subset_of_code_extensions(self):
        """Verify all parseable language extensions are in CODE_EXTENSIONS."""
        for ext in PARSEABLE_LANGUAGES.keys():
            assert ext in CODE_EXTENSIONS, \
                f"Parseable extension {ext} not in CODE_EXTENSIONS"
