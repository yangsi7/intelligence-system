"""Tests for file/directory purpose inference"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from index_utils import infer_file_purpose, infer_directory_purpose, get_language_name


class TestInference:
    def test_infer_file_purpose(self, temp_project_dir):
        assert infer_file_purpose(Path('index.js')) == 'Application entry point'
        assert infer_file_purpose(Path('test_user.py')) == 'Test file'
        assert infer_file_purpose(Path('config.yml')) == 'Configuration'
        assert infer_file_purpose(Path('routes.js')) == 'Route definitions'
        assert infer_file_purpose(Path('user_model.py')) == 'Data model'
        assert infer_file_purpose(Path('utils.py')) == 'Utility functions'
        assert infer_file_purpose(Path('middleware.js')) == 'Middleware'
        assert infer_file_purpose(Path('unknown.foo')) is None

    def test_infer_directory_purpose(self, temp_project_dir):
        assert 'Authentication' in infer_directory_purpose(Path('auth'), [])
        assert 'Data models' in infer_directory_purpose(Path('models'), [])
        assert 'Test' in infer_directory_purpose(Path('tests'), [])
        assert 'utility' in infer_directory_purpose(Path('utils'), []).lower()
        assert 'UI components' in infer_directory_purpose(Path('components'), [])

    def test_infer_from_contents(self):
        files = ['test_auth.py', 'test_user.py']
        result = infer_directory_purpose(Path('unknown'), files)
        assert 'Test' in result

    def test_get_language_name(self):
        assert get_language_name('.py') == 'python'
        assert get_language_name('.js') == 'javascript'
        assert get_language_name('.ts') == 'typescript'
        assert get_language_name('.unknown') == 'unknown'
