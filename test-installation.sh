#!/bin/bash
set -eo pipefail

# Test Installation Script for Ultimate Intelligence System
# Runs comprehensive tests to validate the installation

echo "=========================================="
echo "Intelligence System Installation Test"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_check() {
    local test_name="$1"
    local test_command="$2"

    if eval "$test_command" &>/dev/null; then
        echo -e "${GREEN}✓${NC} $test_name"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $test_name"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test Prerequisites
echo "1. Testing Prerequisites..."
test_check "Node.js ≥18 installed" "node --version | grep -E 'v(1[8-9]|[2-9][0-9])'"
test_check "git installed" "command -v git"
test_check "jq installed" "command -v jq"
echo ""

# Test Installation Directory
echo "2. Testing Installation Directory..."
test_check "Installation directory exists" "test -d ~/.claude-intelligence-system"
test_check "README.md exists" "test -f ~/.claude-intelligence-system/README.md"
test_check "CLAUDE.md exists" "test -f ~/.claude-intelligence-system/CLAUDE.md"
test_check "install.sh exists" "test -f ~/.claude-intelligence-system/install.sh"
test_check "uninstall.sh exists" "test -f ~/.claude-intelligence-system/uninstall.sh"
test_check "ORCHESTRATOR_SELECTION_GUIDE.md exists" "test -f ~/.claude-intelligence-system/ORCHESTRATOR_SELECTION_GUIDE.md"
echo ""

# Test Orchestrators
echo "3. Testing Orchestrators..."
test_check "Orchestrators directory exists" "test -d ~/.claude-intelligence-system/orchestrators"
test_check "meta_orchestrator.md exists" "test -f ~/.claude-intelligence-system/orchestrators/meta_orchestrator.md"
test_check "normal_orchestrator.md exists" "test -f ~/.claude-intelligence-system/orchestrators/normal_orchestrator.md"
test_check "integrated_orchestrator.md exists" "test -f ~/.claude-intelligence-system/orchestrators/integrated_orchestrator.md"
echo ""

# Test Intelligence CLI
echo "4. Testing Intelligence CLI..."
test_check "Intelligence CLI directory exists" "test -d ~/.claude-intelligence-system/improved_intelligence"
test_check "code-intel.mjs exists" "test -f ~/.claude-intelligence-system/improved_intelligence/code-intel.mjs"
test_check "code-intel.mjs is executable" "test -x ~/.claude-intelligence-system/improved_intelligence/code-intel.mjs"
test_check "CLI README exists" "test -f ~/.claude-intelligence-system/improved_intelligence/README.md"
test_check "CLI help command works" "node ~/.claude-intelligence-system/improved_intelligence/code-intel.mjs help | grep -q 'code-intel'"
echo ""

# Test Workflows
echo "5. Testing Workflows..."
test_check "Workflows directory exists" "test -d ~/.claude-intelligence-system/workflows"
test_check "security-audit.json exists" "test -f ~/.claude-intelligence-system/workflows/security-audit.json"
test_check "performance-check.json exists" "test -f ~/.claude-intelligence-system/workflows/performance-check.json"
test_check "quick-scan.json exists" "test -f ~/.claude-intelligence-system/workflows/quick-scan.json"
test_check "security-audit.json valid JSON" "jq empty ~/.claude-intelligence-system/workflows/security-audit.json"
test_check "performance-check.json valid JSON" "jq empty ~/.claude-intelligence-system/workflows/performance-check.json"
test_check "quick-scan.json valid JSON" "jq empty ~/.claude-intelligence-system/workflows/quick-scan.json"
echo ""

# Test Agents
echo "6. Testing Agents..."
test_check "Agents directory exists" "test -d ~/.claude/agents"
test_check "orchestrator.md exists" "test -f ~/.claude/agents/orchestrator.md"
test_check "researcher.md exists" "test -f ~/.claude/agents/researcher.md"
test_check "implementor.md exists" "test -f ~/.claude/agents/implementor.md"
test_check "reviewer.md exists" "test -f ~/.claude/agents/reviewer.md"
test_check "tester.md exists" "test -f ~/.claude/agents/tester.md"
test_check "postflight.md exists" "test -f ~/.claude/agents/postflight.md"
test_check "system-installer.md exists" "test -f ~/.claude/agents/system-installer.md"
echo ""

# Test Slash Commands
echo "7. Testing Slash Commands..."
test_check "Commands directory exists" "test -d ~/.claude/commands"
test_check "intel.md exists" "test -f ~/.claude/commands/intel.md"
test_check "orchestrate.md exists" "test -f ~/.claude/commands/orchestrate.md"
test_check "search.md exists" "test -f ~/.claude/commands/search.md"
test_check "validate.md exists" "test -f ~/.claude/commands/validate.md"
test_check "workflow.md exists" "test -f ~/.claude/commands/workflow.md"
echo ""

# Test Path References
echo "8. Testing Path References..."
test_check "No old .intelligence paths" "! grep -r '.claude/intelligence[^/]' ~/.claude-intelligence-system/"
echo ""

# Summary
echo "=========================================="
echo "Test Results Summary"
echo "=========================================="
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
echo -e "${RED}Failed:${NC} $TESTS_FAILED"
echo ""

if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo ""
    echo "Installation is HEALTHY and ready to use!"
    echo ""
    echo "🚀 Try these commands:"
    echo "   /intel compact              # Quick code analysis"
    echo "   /orchestrate \"task\"         # Multi-agent workflow"
    echo "   > Verify my intelligence system"
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    echo ""
    echo "Please review the failures above."
    echo "Run repair: > Fix my intelligence system"
    exit 1
fi
