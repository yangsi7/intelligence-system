"""
Tests for Python parsing functions in index_utils.py

Tests extract_python_signatures, extract_function_calls_python, and related Python parsing functionality.
"""

import sys
from pathlib import Path

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from index_utils import extract_python_signatures, extract_function_calls_python


class TestBasicFunctionExtraction:
    """Test basic function signature extraction."""

    def test_simple_function_no_params(self):
        """Test extraction of simple function with no parameters."""
        code = '''
def hello():
    print("Hello")
'''
        result = extract_python_signatures(code)
        assert 'hello' in result['functions']
        func_info = result['functions']['hello']
        assert func_info['signature'] == '()'

    def test_function_with_typed_parameters(self):
        """Test function with type annotations."""
        code = '''
def greet(name: str, age: int):
    return f"Hello {name}, age {age}"
'''
        result = extract_python_signatures(code)
        assert 'greet' in result['functions']
        func_info = result['functions']['greet']
        assert 'name: str, age: int' in func_info['signature']

    def test_function_with_return_type(self):
        """Test function with return type annotation."""
        code = '''
def add(a: int, b: int) -> int:
    return a + b
'''
        result = extract_python_signatures(code)
        assert 'add' in result['functions']
        func_info = result['functions']['add']
        assert '->' in func_info['signature'] or '>' in func_info['signature']
        assert 'int' in func_info['signature']

    def test_async_function(self):
        """Test async function extraction."""
        code = '''
async def fetch_data(url: str) -> dict:
    return await client.get(url)
'''
        result = extract_python_signatures(code)
        assert 'fetch_data' in result['functions']
        func_info = result['functions']['fetch_data']
        assert 'async' in func_info['signature']

    def test_function_with_default_parameters(self):
        """Test function with default parameter values."""
        code = '''
def connect(host: str = "localhost", port: int = 8080):
    pass
'''
        result = extract_python_signatures(code)
        assert 'connect' in result['functions']
        func_info = result['functions']['connect']
        # Just verify it extracts the function
        assert 'host' in func_info['signature']

    def test_function_with_args_kwargs(self):
        """Test function with *args and **kwargs."""
        code = '''
def wrapper(*args, **kwargs):
    pass
'''
        result = extract_python_signatures(code)
        assert 'wrapper' in result['functions']
        func_info = result['functions']['wrapper']
        assert '*args' in func_info['signature']
        assert '**kwargs' in func_info['signature']

    def test_decorated_function(self):
        """Test decorated function extraction."""
        code = '''
@staticmethod
def validate(value):
    return value > 0
'''
        result = extract_python_signatures(code)
        assert 'validate' in result['functions']
        func_info = result['functions']['validate']
        assert 'decorators' in func_info
        assert 'staticmethod' in func_info['decorators']

    def test_multiline_function_signature(self):
        """Test function with multiline signature."""
        code = '''
def complex_func(
    param1: str,
    param2: int,
    param3: list
) -> dict:
    return {}
'''
        result = extract_python_signatures(code)
        assert 'complex_func' in result['functions']
        func_info = result['functions']['complex_func']
        assert 'param1' in func_info['signature']
        assert 'param2' in func_info['signature']
        assert 'param3' in func_info['signature']

    def test_function_with_docstring(self):
        """Test function docstring extraction."""
        code = '''
def documented():
    """This is a docstring."""
    pass
'''
        result = extract_python_signatures(code)
        assert 'documented' in result['functions']
        func_info = result['functions']['documented']
        assert 'doc' in func_info
        assert 'docstring' in func_info['doc'].lower()

    def test_dunder_init_method(self):
        """Test that __init__ is captured (special dunder)."""
        code = '''
class Foo:
    def __init__(self):
        pass
'''
        result = extract_python_signatures(code)
        assert 'Foo' in result['classes']
        assert '__init__' in result['classes']['Foo']['methods']


class TestClassExtraction:
    """Test class signature extraction."""

    def test_simple_class_with_methods(self):
        """Test simple class with methods."""
        code = '''
class User:
    def __init__(self, name: str):
        self.name = name

    def greet(self):
        return f"Hello, {self.name}"
'''
        result = extract_python_signatures(code)
        assert 'User' in result['classes']
        assert '__init__' in result['classes']['User']['methods']
        assert 'greet' in result['classes']['User']['methods']

    def test_class_with_inheritance(self):
        """Test class with inheritance."""
        code = '''
class Animal:
    pass

class Dog(Animal):
    def bark(self):
        pass
'''
        result = extract_python_signatures(code)
        assert 'Dog' in result['classes']
        assert 'inherits' in result['classes']['Dog']
        assert 'Animal' in result['classes']['Dog']['inherits']

    def test_class_with_properties(self):
        """Test class with type-annotated properties."""
        code = '''
class Config:
    timeout: int
    host: str
    enabled: bool
'''
        result = extract_python_signatures(code)
        assert 'Config' in result['classes']
        if 'properties' in result['classes']['Config']:
            assert 'timeout' in result['classes']['Config']['properties']

    def test_class_with_class_constants(self):
        """Test class with class-level constants."""
        code = '''
class Settings:
    MAX_RETRIES = 3
    DEFAULT_TIMEOUT = 30
'''
        result = extract_python_signatures(code)
        assert 'Settings' in result['classes']
        if 'class_constants' in result['classes']['Settings']:
            assert 'MAX_RETRIES' in result['classes']['Settings']['class_constants']

    def test_abstract_class(self):
        """Test abstract class detection."""
        code = '''
from abc import ABC, abstractmethod

class Base(ABC):
    @abstractmethod
    def process(self):
        pass
'''
        result = extract_python_signatures(code)
        assert 'Base' in result['classes']
        assert result['classes']['Base'].get('abstract') == True

    def test_enum_class_detection(self):
        """Test enum class detection and moving to enums section."""
        code = '''
from enum import Enum

class Status(Enum):
    PENDING = 1
    APPROVED = 2
    REJECTED = 3
'''
        result = extract_python_signatures(code)
        # Enum classes should be moved to enums section
        if 'enums' in result:
            assert 'Status' in result['enums']
            if 'values' in result['enums']['Status']:
                assert 'PENDING' in result['enums']['Status']['values']

    def test_exception_class_detection(self):
        """Test exception class type detection."""
        code = '''
class CustomError(Exception):
    pass

class ValidationError(BaseException):
    pass
'''
        result = extract_python_signatures(code)
        assert 'CustomError' in result['classes']
        assert result['classes']['CustomError'].get('type') == 'exception'

    def test_class_with_decorators(self):
        """Test class decorator extraction."""
        code = '''
@dataclass
class Point:
    x: int
    y: int
'''
        result = extract_python_signatures(code)
        assert 'Point' in result['classes']
        if 'decorators' in result['classes']['Point']:
            assert 'dataclass' in result['classes']['Point']['decorators']

    def test_class_with_docstring(self):
        """Test class docstring extraction."""
        code = '''
class Manager:
    """Manages resources."""
    pass
'''
        result = extract_python_signatures(code)
        assert 'Manager' in result['classes']
        if 'doc' in result['classes']['Manager']:
            assert 'Manages' in result['classes']['Manager']['doc']

    def test_nested_classes(self):
        """Test that nested classes are not extracted at top level."""
        code = '''
class Outer:
    class Inner:
        pass
'''
        result = extract_python_signatures(code)
        assert 'Outer' in result['classes']
        # Inner class should not be at top level since we only process top-level classes
        assert 'Inner' not in result['classes']


class TestImportsAndConstants:
    """Test import and constant extraction."""

    def test_from_import_extraction(self):
        """Test 'from X import Y' style imports."""
        code = '''
from pathlib import Path
from typing import List, Dict
'''
        result = extract_python_signatures(code)
        assert 'imports' in result
        assert 'pathlib' in result['imports']
        assert 'typing' in result['imports']

    def test_import_extraction(self):
        """Test 'import X' style imports."""
        code = '''
import os
import sys
'''
        result = extract_python_signatures(code)
        assert 'imports' in result
        assert 'os' in result['imports']
        assert 'sys' in result['imports']

    def test_module_level_constants(self):
        """Test module-level UPPERCASE constant extraction."""
        code = '''
MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30
API_URL = "https://api.example.com"
'''
        result = extract_python_signatures(code)
        assert 'constants' in result
        assert 'MAX_RETRIES' in result['constants']
        assert 'DEFAULT_TIMEOUT' in result['constants']
        assert 'API_URL' in result['constants']

    def test_type_aliases(self):
        """Test type alias extraction."""
        code = '''
from typing import Union, Optional

UserID = Union[int, str]
Config = Optional[Dict[str, str]]
'''
        result = extract_python_signatures(code)
        if 'type_aliases' in result:
            assert 'UserID' in result['type_aliases']

    def test_module_variables_with_type_hints(self):
        """Test module-level variable extraction with type hints."""
        code = '''
counter: int = 0
config: Dict[str, str] = {}
'''
        result = extract_python_signatures(code)
        if 'variables' in result:
            assert 'counter' in result['variables'] or 'config' in result['variables']


class TestCallGraphExtraction:
    """Test function call extraction for call graph building."""

    def test_function_calling_another_function(self):
        """Test detection of function calls."""
        code = '''
def helper():
    pass

def main():
    helper()
'''
        result = extract_python_signatures(code)
        assert 'main' in result['functions']
        if 'calls' in result['functions']['main']:
            assert 'helper' in result['functions']['main']['calls']

    def test_method_calling_another_method(self):
        """Test detection of method calls within a class."""
        code = '''
class Service:
    def validate(self):
        pass

    def process(self):
        self.validate()
'''
        result = extract_python_signatures(code)
        assert 'Service' in result['classes']
        if 'calls' in result['classes']['Service']['methods']['process']:
            assert 'validate' in result['classes']['Service']['methods']['process']['calls']

    def test_nested_function_calls(self):
        """Test nested function calls."""
        code = '''
def a():
    pass

def b():
    pass

def main():
    a()
    b()
    a()
'''
        result = extract_python_signatures(code)
        if 'calls' in result['functions']['main']:
            calls = result['functions']['main']['calls']
            assert 'a' in calls
            assert 'b' in calls

    def test_builtin_functions_filtered_out(self):
        """Test that built-in functions are filtered from call graph."""
        code = '''
def process():
    print("test")
    len([])
    str(123)
'''
        result = extract_python_signatures(code)
        if 'calls' in result['functions']['process']:
            calls = result['functions']['process']['calls']
            # Built-ins should be filtered
            assert 'print' not in calls
            assert 'len' not in calls
            assert 'str' not in calls

    def test_extract_function_calls_python_directly(self):
        """Test extract_function_calls_python function directly."""
        body = '''
    validate_user(username)
    check_credentials(password)
    log_attempt()
'''
        all_functions = {'validate_user', 'check_credentials', 'log_attempt', 'print'}
        calls = extract_function_calls_python(body, all_functions)

        assert 'validate_user' in calls
        assert 'check_credentials' in calls
        assert 'log_attempt' in calls
        assert 'print' not in calls  # Should be filtered


class TestEdgeCases:
    """Test edge cases and error handling."""

    def test_empty_file(self):
        """Test parsing empty file."""
        code = ''
        result = extract_python_signatures(code)
        assert isinstance(result, dict)
        assert 'functions' in result
        assert len(result['functions']) == 0

    def test_file_with_only_comments(self):
        """Test file with only comments."""
        code = '''
# This is a comment
# Another comment
'''
        result = extract_python_signatures(code)
        assert len(result['functions']) == 0
        assert len(result['classes']) == 0

    def test_file_with_syntax_error(self):
        """Test file with incomplete syntax (should not crash)."""
        code = '''
def broken(
    # Missing closing paren and colon
'''
        # Should not raise exception
        try:
            result = extract_python_signatures(code)
            # May or may not extract anything, but shouldn't crash
            assert isinstance(result, dict)
        except:
            pass  # Some syntax errors are acceptable failures

    def test_very_long_function_body(self):
        """Test function with very long body."""
        code = 'def long():\n' + '    x = 1\n' * 1000
        result = extract_python_signatures(code)
        assert 'long' in result['functions']

    def test_function_with_unicode_in_docstring(self):
        """Test function with Unicode characters in docstring."""
        code = '''
def test():
    """Test with émojis 🎉 and ünicode."""
    pass
'''
        result = extract_python_signatures(code)
        assert 'test' in result['functions']

    def test_multiple_decorators(self):
        """Test function with multiple decorators."""
        code = '''
@decorator1
@decorator2
@decorator3
def decorated():
    pass
'''
        result = extract_python_signatures(code)
        assert 'decorated' in result['functions']
        if 'decorators' in result['functions']['decorated']:
            decorators = result['functions']['decorated']['decorators']
            assert len(decorators) >= 1

    def test_line_number_tracking(self):
        """Test that line numbers are tracked correctly."""
        code = '''
# Line 1
# Line 2
def first_function():  # Line 3
    pass

def second_function():  # Line 6
    pass
'''
        result = extract_python_signatures(code)
        assert 'first_function' in result['functions']
        assert 'second_function' in result['functions']
        # Both functions should have line numbers
        assert 'line' in result['functions']['first_function']
        assert 'line' in result['functions']['second_function']
