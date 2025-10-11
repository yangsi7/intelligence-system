"""Tests for gitignore pattern handling"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from index_utils import (
    parse_gitignore, load_gitignore_patterns,
    matches_gitignore_pattern, should_index_file
)


class TestGitignoreHandling:
    def test_parse_gitignore(self, temp_project_dir):
        gitignore = temp_project_dir / '.gitignore'
        gitignore.write_text('*.log\nnode_modules/\n# comment\n')
        patterns = parse_gitignore(gitignore)
        assert '*.log' in patterns
        assert 'node_modules/' in patterns
        assert '# comment' not in patterns  # Comments filtered

    def test_load_gitignore_patterns(self, temp_project_dir):
        gitignore = temp_project_dir / '.gitignore'
        gitignore.write_text('dist/\nbuild/')
        patterns = load_gitignore_patterns(temp_project_dir)
        assert 'dist/' in patterns or 'dist' in patterns

    def test_matches_gitignore_pattern(self, temp_project_dir):
        patterns = {'*.log', 'node_modules', 'build'}
        test_file = temp_project_dir / 'test.log'
        test_file.touch()
        assert matches_gitignore_pattern(test_file, patterns, temp_project_dir)

    def test_should_index_file_code_extension(self, temp_project_dir):
        py_file = temp_project_dir / 'test.py'
        py_file.touch()
        assert should_index_file(py_file, temp_project_dir)

    def test_should_index_file_non_code(self, temp_project_dir):
        img_file = temp_project_dir / 'image.png'
        img_file.touch()
        assert not should_index_file(img_file, temp_project_dir)

    def test_should_index_file_ignore_dirs(self, temp_project_dir):
        node_dir = temp_project_dir / 'node_modules'
        node_dir.mkdir()
        js_file = node_dir / 'test.js'
        js_file.touch()
        assert not should_index_file(js_file, temp_project_dir)
