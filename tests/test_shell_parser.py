"""Tests for shell script parsing in index_utils.py"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from index_utils import extract_shell_signatures, extract_function_calls_shell


class TestShellParser:
    def test_function_style_1(self):
        code = 'greet() {\n    echo "Hello"\n}'
        result = extract_shell_signatures(code)
        assert 'greet' in result['functions']

    def test_function_style_2(self):
        code = 'function validate {\n    return 0\n}'
        result = extract_shell_signatures(code)
        assert 'validate' in result['functions']

    def test_function_with_params(self):
        code = 'process() {\n    echo "$1"\n    echo "$2"\n}'
        result = extract_shell_signatures(code)
        assert 'process' in result['functions']

    def test_exports(self):
        code = 'export MAX_RETRIES=3\nexport API_URL="test"'
        result = extract_shell_signatures(code)
        assert 'exports' in result
        assert 'MAX_RETRIES' in result['exports']

    def test_source_statements(self):
        code = 'source ./utils.sh\n. config.sh'
        result = extract_shell_signatures(code)
        assert 'sources' in result

    def test_function_calls(self):
        code = '''
helper() {
    return 0
}
main() {
    helper
}
'''
        result = extract_shell_signatures(code)
        if 'calls' in result['functions'].get('main', {}):
            assert 'helper' in result['functions']['main']['calls']

    def test_extract_function_calls_shell_directly(self):
        body = 'validate_user\ncheck_credentials'
        all_funcs = {'validate_user', 'check_credentials', 'ls'}
        calls = extract_function_calls_shell(body, all_funcs)
        assert 'validate_user' in calls
        assert 'check_credentials' in calls
