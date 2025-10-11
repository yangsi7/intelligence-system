"""
Pytest configuration and shared fixtures for index_utils tests.
"""

import pytest
import tempfile
import shutil
from pathlib import Path
from typing import Dict


@pytest.fixture
def temp_project_dir():
    """Create a temporary project directory for testing."""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir)


@pytest.fixture
def sample_python_code():
    """Dictionary of Python code samples for testing."""
    return {
        'simple_function': '''
def greet(name: str) -> str:
    """Greet a user."""
    return f"Hello, {name}"
''',
        'async_function': '''
async def fetch_data(url: str) -> dict:
    """Fetch data from URL."""
    return await client.get(url)
''',
        'class_with_methods': '''
class UserManager:
    """Manage user operations."""

    def __init__(self, db_connection):
        self.db = db_connection

    def create_user(self, username: str, email: str) -> int:
        """Create a new user."""
        return self.db.insert(username, email)

    def delete_user(self, user_id: int) -> bool:
        """Delete a user by ID."""
        return self.db.delete(user_id)
''',
        'function_with_calls': '''
def validate_credentials(username: str, password: str) -> bool:
    """Validate user credentials."""
    return check_password(password)

def authenticate_user(username: str, password: str) -> bool:
    """Authenticate a user."""
    if validate_credentials(username, password):
        return True
    return False

def check_password(password: str) -> bool:
    """Check password strength."""
    return len(password) >= 8
''',
        'imports_and_constants': '''
import os
import sys
from typing import List, Dict
from pathlib import Path

MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30
API_ENDPOINTS = {
    "users": "/api/users",
    "posts": "/api/posts"
}

config: Dict[str, str] = {
    "env": "production"
}
''',
        'enum_class': '''
from enum import Enum

class Status(Enum):
    """Status enumeration."""
    PENDING = 1
    APPROVED = 2
    REJECTED = 3
''',
        'decorated_function': '''
@property
def name(self):
    """Get name property."""
    return self._name

@staticmethod
def validate_email(email: str) -> bool:
    """Validate email format."""
    return '@' in email
''',
        'multiline_signature': '''
def complex_function(
    param1: str,
    param2: int,
    param3: List[Dict[str, any]],
    param4: Optional[str] = None
) -> Tuple[bool, str]:
    """Complex function with multiline signature."""
    return True, "success"
''',
    }


@pytest.fixture
def sample_js_code():
    """Dictionary of JavaScript/TypeScript code samples."""
    return {
        'simple_function': '''
function greet(name) {
    return `Hello, ${name}`;
}
''',
        'arrow_function': '''
const add = (a, b) => {
    return a + b;
};

const multiply = (a, b) => a * b;
''',
        'async_function': '''
async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}
''',
        'class_with_methods': '''
class UserManager {
    constructor(dbConnection) {
        this.db = dbConnection;
    }

    createUser(username, email) {
        return this.db.insert(username, email);
    }

    deleteUser(userId) {
        return this.db.delete(userId);
    }
}
''',
        'typescript_types': '''
interface User {
    id: number;
    name: string;
    email: string;
}

type UserRole = 'admin' | 'user' | 'guest';

enum Status {
    Pending,
    Approved,
    Rejected
}

function processUser(user: User, role: UserRole): boolean {
    return true;
}
''',
        'imports': '''
import { Component } from 'react';
import * as utils from './utils';
const fs = require('fs');
''',
        'type_alias': '''
type ComplexType = {
    id: number;
    data: {
        items: string[];
        count: number;
    };
};
''',
    }


@pytest.fixture
def sample_shell_code():
    """Dictionary of shell script samples."""
    return {
        'simple_function': '''
greet() {
    echo "Hello, $1"
}
''',
        'function_with_params': '''
process_file() {
    local filename="$1"
    local output_dir="$2"
    echo "Processing $filename to $output_dir"
}
''',
        'function_style_2': '''
function validate_input {
    if [ -z "$1" ]; then
        return 1
    fi
    return 0
}
''',
        'exports': '''
export MAX_RETRIES=3
export DEFAULT_TIMEOUT=30
API_URL="https://api.example.com"
''',
        'source_statements': '''
source ./utils.sh
. "${SCRIPT_DIR}/config.sh"
source "$(dirname "$0")/helpers.sh"
''',
        'function_with_calls': '''
validate_user() {
    check_credentials "$1" "$2"
}

check_credentials() {
    echo "Validating..."
}
''',
    }


@pytest.fixture
def sample_markdown():
    """Markdown content sample."""
    return '''# Project Title

## Installation

Instructions for installation.

## Architecture

The project is structured as follows:
- Main code is located in `src/main.py`
- Tests are in `tests/` directory
- Configuration can be found in `config/settings.yml`

### Components

See `src/components/` for UI components.

## API Reference

Check `api/routes.py` for API endpoints.
'''


@pytest.fixture
def mock_gitignore():
    """Sample .gitignore content."""
    return '''
# Dependencies
node_modules/
bower_components/
*.pyc
__pycache__/

# Build artifacts
dist/
build/
*.log

# IDE
.vscode/
.idea/

# Environment
.env
.env.local

# Specific files
debug.log
temp-*.txt
'''


@pytest.fixture
def sample_files_structure(temp_project_dir, sample_python_code, sample_js_code):
    """Create a sample project structure with files."""
    # Create directories
    (temp_project_dir / 'src').mkdir()
    (temp_project_dir / 'tests').mkdir()
    (temp_project_dir / 'config').mkdir()

    # Create Python files
    (temp_project_dir / 'src' / 'main.py').write_text(sample_python_code['simple_function'])
    (temp_project_dir / 'src' / 'user.py').write_text(sample_python_code['class_with_methods'])
    (temp_project_dir / 'tests' / 'test_user.py').write_text('# Test file')

    # Create JS files
    (temp_project_dir / 'src' / 'app.js').write_text(sample_js_code['simple_function'])

    # Create config
    (temp_project_dir / 'config' / 'settings.json').write_text('{}')

    # Create README
    (temp_project_dir / 'README.md').write_text('# Test Project')

    return temp_project_dir
