"""Tests for call graph building"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / 'scripts'))

from index_utils import build_call_graph


class TestCallGraph:
    def test_build_forward_call_map(self):
        functions = {
            'main': {'calls': ['helper', 'process']},
            'helper': {'calls': []},
            'process': {'calls': ['validate']}
        }
        classes = {}
        calls_map, called_by_map = build_call_graph(functions, classes)

        assert 'main' in calls_map
        assert 'helper' in calls_map['main']
        assert 'process' in calls_map['main']

    def test_build_reverse_called_by_map(self):
        functions = {
            'main': {'calls': ['helper']},
            'helper': {'calls': []}
        }
        classes = {}
        calls_map, called_by_map = build_call_graph(functions, classes)

        assert 'helper' in called_by_map
        assert 'main' in called_by_map['helper']

    def test_handle_class_methods(self):
        functions = {}
        classes = {
            'Service': {
                'methods': {
                    'process': {'calls': ['validate']},
                    'validate': {'calls': []}
                }
            }
        }
        calls_map, called_by_map = build_call_graph(functions, classes)

        assert 'Service.process' in calls_map
        assert 'validate' in called_by_map

    def test_empty_graph(self):
        functions = {}
        classes = {}
        calls_map, called_by_map = build_call_graph(functions, classes)

        assert isinstance(calls_map, dict)
        assert isinstance(called_by_map, dict)
        assert len(calls_map) == 0
        assert len(called_by_map) == 0
