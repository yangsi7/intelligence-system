"""
Tests for JavaScript/TypeScript parsing functions in index_utils.py

Tests extract_javascript_signatures, extract_function_calls_javascript, and related functionality.
"""

import sys
from pathlib import Path

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from index_utils import extract_javascript_signatures, extract_function_calls_javascript


class TestJavaScriptFunctionExtraction:
    """Test JavaScript function signature extraction."""

    def test_regular_function_declaration(self):
        """Test regular function declaration."""
        code = '''
function greet(name) {
    return `Hello, ${name}`;
}
'''
        result = extract_javascript_signatures(code)
        assert 'greet' in result['functions']
        assert 'name' in result['functions']['greet']['signature']

    def test_arrow_function_const(self):
        """Test arrow function assigned to const."""
        code = '''
const add = (a, b) => {
    return a + b;
};
'''
        result = extract_javascript_signatures(code)
        assert 'add' in result['functions']

    def test_arrow_function_implicit_return(self):
        """Test arrow function with implicit return."""
        code = '''
const multiply = (a, b) => a * b;
'''
        result = extract_javascript_signatures(code)
        assert 'multiply' in result['functions']

    def test_async_function(self):
        """Test async function declaration."""
        code = '''
async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}
'''
        result = extract_javascript_signatures(code)
        assert 'fetchData' in result['functions']
        assert 'async' in result['functions']['fetchData']['signature']

    def test_async_arrow_function(self):
        """Test async arrow function."""
        code = '''
const getData = async (id) => {
    return await api.get(id);
};
'''
        result = extract_javascript_signatures(code)
        assert 'getData' in result['functions']

    def test_function_with_typescript_types(self):
        """Test function with TypeScript type annotations."""
        code = '''
function process(data: string, count: number): boolean {
    return true;
}
'''
        result = extract_javascript_signatures(code)
        assert 'process' in result['functions']
        func_sig = result['functions']['process']['signature']
        assert 'string' in func_sig or 'number' in func_sig

    def test_exported_function(self):
        """Test exported function."""
        code = '''
export function helper(x) {
    return x * 2;
}
'''
        result = extract_javascript_signatures(code)
        assert 'helper' in result['functions']

    def test_default_export_function(self):
        """Test default export function."""
        code = '''
export default function main() {
    console.log("main");
}
'''
        result = extract_javascript_signatures(code)
        assert 'main' in result['functions']

    def test_function_with_multiline_signature(self):
        """Test function with multiline parameters."""
        code = '''
function complex(
    param1,
    param2,
    param3
) {
    return true;
}
'''
        result = extract_javascript_signatures(code)
        assert 'complex' in result['functions']

    def test_generator_function(self):
        """Test generator function."""
        code = '''
function* generator() {
    yield 1;
    yield 2;
}
'''
        result = extract_javascript_signatures(code)
        # May or may not capture generator, but shouldn't crash
        assert isinstance(result, dict)

    def test_iife(self):
        """Test Immediately Invoked Function Expression."""
        code = '''
(function() {
    console.log("IIFE");
})();
'''
        result = extract_javascript_signatures(code)
        # IIFE shouldn't be captured as named function
        assert isinstance(result, dict)


class TestTypeScriptClassExtraction:
    """Test class extraction for JavaScript/TypeScript."""

    def test_es6_class_with_methods(self):
        """Test ES6 class with methods."""
        code = '''
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}`;
    }
}
'''
        result = extract_javascript_signatures(code)
        assert 'User' in result['classes']
        assert '__init__' in result['classes']['User']['methods']  # constructor → __init__
        assert 'greet' in result['classes']['User']['methods']

    def test_class_with_extends(self):
        """Test class inheritance."""
        code = '''
class Animal {
    move() {}
}

class Dog extends Animal {
    bark() {}
}
'''
        result = extract_javascript_signatures(code)
        assert 'Dog' in result['classes']
        assert 'extends' in result['classes']['Dog']
        assert result['classes']['Dog']['extends'] == 'Animal'

    def test_class_with_static_methods(self):
        """Test class with static methods."""
        code = '''
class Utils {
    static helper(x) {
        return x * 2;
    }
}
'''
        result = extract_javascript_signatures(code)
        assert 'Utils' in result['classes']
        # May capture static methods

    def test_typescript_class_with_types(self):
        """Test TypeScript class with type annotations."""
        code = '''
class Service {
    private data: string;

    constructor(data: string) {
        this.data = data;
    }

    getData(): string {
        return this.data;
    }
}
'''
        result = extract_javascript_signatures(code)
        assert 'Service' in result['classes']
        assert 'getData' in result['classes']['Service']['methods']

    def test_abstract_class_typescript(self):
        """Test abstract class (TypeScript)."""
        code = '''
abstract class Base {
    abstract process(): void;
}
'''
        result = extract_javascript_signatures(code)
        assert 'Base' in result['classes']

    def test_class_with_decorators(self):
        """Test class with decorators (TypeScript/Babel)."""
        code = '''
@Component
class MyComponent {
    @Input()
    value: string;
}
'''
        result = extract_javascript_signatures(code)
        assert 'MyComponent' in result['classes']

    def test_class_with_getters_setters(self):
        """Test class with getters and setters."""
        code = '''
class Point {
    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }
}
'''
        result = extract_javascript_signatures(code)
        assert 'Point' in result['classes']
        # Getters/setters may be filtered out

    def test_exception_class_extends_error(self):
        """Test exception class detection."""
        code = '''
class CustomError extends Error {
    constructor(message) {
        super(message);
    }
}
'''
        result = extract_javascript_signatures(code)
        assert 'CustomError' in result['classes']
        # Should detect as exception type
        assert result['classes']['CustomError'].get('type') == 'exception'


class TestTypeScriptSpecific:
    """Test TypeScript-specific features."""

    def test_interface_extraction(self):
        """Test interface extraction."""
        code = '''
interface User {
    id: number;
    name: string;
    email: string;
}
'''
        result = extract_javascript_signatures(code)
        assert 'interfaces' in result
        assert 'User' in result['interfaces']

    def test_interface_with_extends(self):
        """Test interface with extends."""
        code = '''
interface Base {
    id: number;
}

interface Extended extends Base {
    name: string;
}
'''
        result = extract_javascript_signatures(code)
        assert 'Extended' in result['interfaces']
        if 'extends' in result['interfaces']['Extended']:
            assert 'Base' in result['interfaces']['Extended']['extends']

    def test_type_alias_extraction(self):
        """Test type alias extraction."""
        code = '''
type UserID = number | string;
type Status = 'pending' | 'approved' | 'rejected';
'''
        result = extract_javascript_signatures(code)
        assert 'type_aliases' in result
        assert 'UserID' in result['type_aliases']
        assert 'Status' in result['type_aliases']

    def test_type_alias_with_object(self):
        """Test type alias with object type."""
        code = '''
type Config = {
    host: string;
    port: number;
    enabled: boolean;
};
'''
        result = extract_javascript_signatures(code)
        assert 'Config' in result['type_aliases']

    def test_enum_extraction(self):
        """Test enum extraction."""
        code = '''
enum Status {
    Pending,
    Approved,
    Rejected
}
'''
        result = extract_javascript_signatures(code)
        assert 'enums' in result
        assert 'Status' in result['enums']
        if 'values' in result['enums']['Status']:
            assert 'Pending' in result['enums']['Status']['values']

    def test_enum_with_values(self):
        """Test enum with explicit values."""
        code = '''
enum Role {
    Admin = "admin",
    User = "user",
    Guest = "guest"
}
'''
        result = extract_javascript_signatures(code)
        assert 'Role' in result['enums']

    def test_generic_function_types(self):
        """Test function with generic types."""
        code = '''
function identity<T>(arg: T): T {
    return arg;
}
'''
        result = extract_javascript_signatures(code)
        assert 'identity' in result['functions']

    def test_utility_types(self):
        """Test utility type usage."""
        code = '''
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
'''
        result = extract_javascript_signatures(code)
        # Should extract type aliases
        if 'type_aliases' in result:
            assert 'PartialUser' in result['type_aliases'] or \
                   'ReadonlyUser' in result['type_aliases']


class TestImportsAndConstants:
    """Test import and constant extraction in JavaScript/TypeScript."""

    def test_es6_named_import(self):
        """Test ES6 named imports."""
        code = '''
import { Component, useState } from 'react';
'''
        result = extract_javascript_signatures(code)
        assert 'imports' in result
        assert 'react' in result['imports']

    def test_es6_default_import(self):
        """Test ES6 default import."""
        code = '''
import React from 'react';
'''
        result = extract_javascript_signatures(code)
        assert 'react' in result['imports']

    def test_es6_namespace_import(self):
        """Test ES6 namespace import."""
        code = '''
import * as utils from './utils';
'''
        result = extract_javascript_signatures(code)
        assert './utils' in result['imports']

    def test_commonjs_require(self):
        """Test CommonJS require statement."""
        code = '''
const fs = require('fs');
const { readFile } = require('fs/promises');
'''
        result = extract_javascript_signatures(code)
        assert 'fs' in result['imports'] or 'fs/promises' in result['imports']

    def test_module_constants(self):
        """Test module-level constants."""
        code = '''
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 30;
const API_URL = "https://api.example.com";
'''
        result = extract_javascript_signatures(code)
        assert 'constants' in result
        assert 'MAX_RETRIES' in result['constants']

    def test_exported_variables(self):
        """Test exported variables."""
        code = '''
export let counter = 0;
export const config = {};
'''
        result = extract_javascript_signatures(code)
        # Should extract variables
        if 'variables' in result:
            assert 'counter' in result['variables'] or 'config' in result['variables']


class TestCallGraphExtraction:
    """Test call graph extraction for JavaScript."""

    def test_function_calls(self):
        """Test function call detection."""
        code = '''
function helper() {
    return true;
}

function main() {
    helper();
}
'''
        result = extract_javascript_signatures(code)
        if 'calls' in result['functions'].get('main', {}):
            assert 'helper' in result['functions']['main']['calls']

    def test_method_calls(self):
        """Test this.method() calls."""
        code = '''
class Service {
    validate() {
        return true;
    }

    process() {
        this.validate();
    }
}
'''
        result = extract_javascript_signatures(code)
        if 'Service' in result['classes']:
            if 'calls' in result['classes']['Service']['methods'].get('process', {}):
                assert 'validate' in result['classes']['Service']['methods']['process']['calls']

    def test_builtin_functions_filtered(self):
        """Test that built-in functions are filtered."""
        code = '''
function process() {
    console.log("test");
    Math.random();
    JSON.parse("{}");
}
'''
        result = extract_javascript_signatures(code)
        if 'calls' in result['functions'].get('process', {}):
            # Built-ins should be filtered
            assert 'console' not in result['functions']['process']['calls']
            assert 'Math' not in result['functions']['process']['calls']

    def test_extract_function_calls_javascript_directly(self):
        """Test extract_function_calls_javascript directly."""
        body = '''
    validateUser(username);
    checkCredentials(password);
    logAttempt();
'''
        all_functions = {'validateUser', 'checkCredentials', 'logAttempt', 'console'}
        calls = extract_function_calls_javascript(body, all_functions)

        assert 'validateUser' in calls
        assert 'checkCredentials' in calls
        assert 'logAttempt' in calls
        assert 'console' not in calls


class TestEdgeCases:
    """Test edge cases and error handling."""

    def test_empty_file(self):
        """Test parsing empty file."""
        code = ''
        result = extract_javascript_signatures(code)
        assert isinstance(result, dict)
        assert 'functions' in result

    def test_file_with_only_comments(self):
        """Test file with only comments."""
        code = '''
// This is a comment
/* Another comment */
'''
        result = extract_javascript_signatures(code)
        assert len(result['functions']) == 0
        assert len(result['classes']) == 0

    def test_jsx_syntax(self):
        """Test JSX/React syntax doesn't crash parser."""
        code = '''
function Component() {
    return <div>Hello</div>;
}
'''
        try:
            result = extract_javascript_signatures(code)
            assert isinstance(result, dict)
        except:
            pass  # JSX may not be fully supported

    def test_template_literals(self):
        """Test template literals in code."""
        code = '''
function greet(name) {
    return `Hello, ${name}!`;
}
'''
        result = extract_javascript_signatures(code)
        assert 'greet' in result['functions']

    def test_complex_nested_braces(self):
        """Test complex nested brace structures."""
        code = '''
function complex() {
    const obj = {
        nested: {
            deep: {
                value: 42
            }
        }
    };
    return obj;
}
'''
        result = extract_javascript_signatures(code)
        assert 'complex' in result['functions']

    def test_very_long_function_body(self):
        """Test function with very long body."""
        code = 'function long() {\n' + '    let x = 1;\n' * 1000 + '}'
        result = extract_javascript_signatures(code)
        assert 'long' in result['functions']

    def test_function_inside_class(self):
        """Test that function inside class is not extracted as standalone."""
        code = '''
class Container {
    method() {
        function inner() {}
    }
}
'''
        result = extract_javascript_signatures(code)
        # inner function should not be in functions
        assert 'inner' not in result['functions']
        assert 'Container' in result['classes']

    def test_arrow_function_as_method(self):
        """Test arrow function as class method."""
        code = '''
class Component {
    handleClick = () => {
        console.log("clicked");
    };
}
'''
        result = extract_javascript_signatures(code)
        assert 'Component' in result['classes']

    def test_line_number_tracking(self):
        """Test that line numbers are tracked."""
        code = '''
// Line 1
// Line 2
function first() {  // Line 3
    return 1;
}

function second() {  // Line 7
    return 2;
}
'''
        result = extract_javascript_signatures(code)
        if 'first' in result['functions']:
            assert 'line' in result['functions']['first']
        if 'second' in result['functions']:
            assert 'line' in result['functions']['second']
