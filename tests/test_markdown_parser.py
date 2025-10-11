"""Tests for markdown parsing in index_utils.py"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from index_utils import extract_markdown_structure


class TestMarkdownParser:
    def test_header_extraction(self, temp_project_dir):
        md_file = temp_project_dir / 'test.md'
        md_file.write_text('# Title\n## Section\n### Subsection')
        result = extract_markdown_structure(md_file)
        assert len(result['sections']) == 3
        assert 'Title' in result['sections']

    def test_architecture_hints(self, temp_project_dir):
        md_file = temp_project_dir / 'test.md'
        md_file.write_text('Code is located in src/main.py')
        result = extract_markdown_structure(md_file)
        assert len(result['architecture_hints']) > 0

    def test_limit_headers(self, temp_project_dir):
        md_file = temp_project_dir / 'test.md'
        headers = '\n'.join([f'# Header {i}' for i in range(20)])
        md_file.write_text(headers)
        result = extract_markdown_structure(md_file)
        assert len(result['sections']) <= 10  # Limited to 10

    def test_empty_file(self, temp_project_dir):
        md_file = temp_project_dir / 'empty.md'
        md_file.write_text('')
        result = extract_markdown_structure(md_file)
        assert 'sections' in result
