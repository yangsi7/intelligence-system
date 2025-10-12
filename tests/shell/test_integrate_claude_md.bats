#!/usr/bin/env bats

# Example BATS Test File for integrate_claude_md.sh
# This is a template showing how to test the integration script
# To use: rename to test_integrate_claude_md.bats and run with: bats tests/shell/test_integrate_claude_md.bats

# Load test helpers (create this file with utility functions)
# load test_helpers

#
# SETUP AND TEARDOWN
#

setup() {
    # Create temporary test directory
    export TEST_DIR="$(mktemp -d)"
    export ORIGINAL_PWD="$(pwd)"

    # Mock system installation directory
    export MOCK_SYSTEM_DIR="$TEST_DIR/.mock-intelligence-system"
    mkdir -p "$MOCK_SYSTEM_DIR/.claude"

    # Create mock USAGE_TEMPLATE.md
    cat > "$MOCK_SYSTEM_DIR/.claude/USAGE_TEMPLATE.md" <<'EOF'
# Intelligence System Usage Guide

This project uses the **Ultimate Intelligence System** for AI-powered development workflows.

## Quick Start
- `/index` - Generate project index
- `/intel compact` - Get codebase overview
EOF

    # Override environment variables for testing
    export SYSTEM_DIR="$MOCK_SYSTEM_DIR"
    export TEMPLATE_PATH="$MOCK_SYSTEM_DIR/.claude/USAGE_TEMPLATE.md"
    export IMPORT_LINE="@$MOCK_SYSTEM_DIR/.claude/USAGE_TEMPLATE.md"

    # Create test project directory
    export TEST_PROJECT="$TEST_DIR/test-project"
    mkdir -p "$TEST_PROJECT"
    cd "$TEST_PROJECT"
}

teardown() {
    # Return to original directory
    cd "$ORIGINAL_PWD"

    # Clean up test directory
    if [ -n "$TEST_DIR" ] && [ -d "$TEST_DIR" ]; then
        rm -rf "$TEST_DIR"
    fi
}

#
# UTILITY FUNCTIONS
#

# Source functions from the integration script
source_integration_script() {
    # Source the script to get access to functions
    # Note: This sources the entire script, so we need to prevent main() from running
    # You may need to modify the script to export functions for testing
    source "$ORIGINAL_PWD/scripts/integrate_claude_md.sh" 2>/dev/null || true
}

# Create a sample CLAUDE.md file
create_sample_claude_md() {
    local file="$1"
    local content="${2:-# Project Memory\n\nExisting project documentation.}"

    mkdir -p "$(dirname "$file")"
    echo -e "$content" > "$file"
}

#
# TEST GROUP 1: check_integration_exists()
#

@test "check_integration_exists: detects import line in file" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Add import line
    echo "" >> "$TEST_PROJECT/CLAUDE.md"
    echo "@$MOCK_SYSTEM_DIR/.claude/USAGE_TEMPLATE.md" >> "$TEST_PROJECT/CLAUDE.md"

    # Run function
    run check_integration_exists "$TEST_PROJECT/CLAUDE.md"

    # Assertions
    [ "$status" -eq 0 ]  # Should return success (0)
}

@test "check_integration_exists: detects inline markers" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Add inline markers
    cat >> "$TEST_PROJECT/CLAUDE.md" <<'EOF'

<!-- ULTIMATE_INTELLIGENCE_SYSTEM_START -->
Integration content here
<!-- ULTIMATE_INTELLIGENCE_SYSTEM_END -->
EOF

    # Run function
    run check_integration_exists "$TEST_PROJECT/CLAUDE.md"

    # Assertions
    [ "$status" -eq 0 ]
}

@test "check_integration_exists: returns false for non-existent file" {
    # Setup
    source_integration_script

    # Run function on non-existent file
    run check_integration_exists "$TEST_PROJECT/nonexistent.md"

    # Assertions
    [ "$status" -eq 1 ]  # Should return failure (1)
}

@test "check_integration_exists: returns false for file without integration" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md" "# Just regular content"

    # Run function
    run check_integration_exists "$TEST_PROJECT/CLAUDE.md"

    # Assertions
    [ "$status" -eq 1 ]
}

@test "check_integration_exists: handles empty file" {
    # Setup
    source_integration_script
    touch "$TEST_PROJECT/CLAUDE.md"

    # Run function
    run check_integration_exists "$TEST_PROJECT/CLAUDE.md"

    # Assertions
    [ "$status" -eq 1 ]
}

@test "check_integration_exists: matches any USAGE_TEMPLATE.md path" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Add import line with different path (still valid)
    echo "@/different/path/USAGE_TEMPLATE.md" >> "$TEST_PROJECT/CLAUDE.md"

    # Run function
    run check_integration_exists "$TEST_PROJECT/CLAUDE.md"

    # Assertions
    [ "$status" -eq 0 ]  # Should match any USAGE_TEMPLATE.md
}

#
# TEST GROUP 2: add_import_integration()
#

@test "add_import_integration: adds import to existing file" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md" "# My Project\n\nExisting content."

    # Run function
    run add_import_integration "$TEST_PROJECT/CLAUDE.md"

    # Assertions
    [ "$status" -eq 0 ]

    # Verify original content preserved
    grep -q "Existing content" "$TEST_PROJECT/CLAUDE.md"

    # Verify import added
    grep -q "@$MOCK_SYSTEM_DIR" "$TEST_PROJECT/CLAUDE.md"

    # Verify section header added
    grep -q "# Intelligence System Integration" "$TEST_PROJECT/CLAUDE.md"
}

@test "add_import_integration: creates backup file" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Run function
    add_import_integration "$TEST_PROJECT/CLAUDE.md"

    # Check backup exists (using glob pattern)
    run bash -c "ls $TEST_PROJECT/CLAUDE.md.backup-* 2>/dev/null"
    [ "$status" -eq 0 ]

    # Verify backup contains original content
    run bash -c "grep 'Project Memory' $TEST_PROJECT/CLAUDE.md.backup-*"
    [ "$status" -eq 0 ]
}

@test "add_import_integration: backup file has timestamp format" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Run function
    add_import_integration "$TEST_PROJECT/CLAUDE.md"

    # Check backup filename format: CLAUDE.md.backup-YYYYMMDD_HHMMSS
    run bash -c "ls $TEST_PROJECT/CLAUDE.md.backup-[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]_[0-9][0-9][0-9][0-9][0-9][0-9]"
    [ "$status" -eq 0 ]
}

@test "add_import_integration: appends to empty file" {
    # Setup
    source_integration_script
    touch "$TEST_PROJECT/CLAUDE.md"

    # Run function
    add_import_integration "$TEST_PROJECT/CLAUDE.md"

    # Verify file is no longer empty
    [ -s "$TEST_PROJECT/CLAUDE.md" ]

    # Verify contains import
    grep -q "@$MOCK_SYSTEM_DIR" "$TEST_PROJECT/CLAUDE.md"
}

@test "add_import_integration: section formatting is correct" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Run function
    add_import_integration "$TEST_PROJECT/CLAUDE.md"

    # Verify blank line before section (file should end with import section)
    tail -10 "$TEST_PROJECT/CLAUDE.md" | grep -q "# Intelligence System Integration"

    # Verify description text present
    grep -q "Ultimate Intelligence System" "$TEST_PROJECT/CLAUDE.md"

    # Verify "For usage guide, see:" present
    grep -q "For usage guide, see:" "$TEST_PROJECT/CLAUDE.md"

    # Verify import line is last non-empty line
    tail -1 "$TEST_PROJECT/CLAUDE.md" | grep -q "@$MOCK_SYSTEM_DIR"
}

#
# TEST GROUP 3: add_inline_integration()
#

@test "add_inline_integration: adds inline content to existing file" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md" "# My Project\n\nExisting content."

    # Run function
    run add_inline_integration "$TEST_PROJECT/CLAUDE.md"

    # Assertions
    [ "$status" -eq 0 ]

    # Verify original content preserved
    grep -q "Existing content" "$TEST_PROJECT/CLAUDE.md"

    # Verify markers present
    grep -q "ULTIMATE_INTELLIGENCE_SYSTEM_START" "$TEST_PROJECT/CLAUDE.md"
    grep -q "ULTIMATE_INTELLIGENCE_SYSTEM_END" "$TEST_PROJECT/CLAUDE.md"

    # Verify template content embedded
    grep -q "Intelligence System Usage Guide" "$TEST_PROJECT/CLAUDE.md"
}

@test "add_inline_integration: marker format is correct" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Run function
    add_inline_integration "$TEST_PROJECT/CLAUDE.md"

    # Verify exact marker format
    grep -q "<!-- ULTIMATE_INTELLIGENCE_SYSTEM_START -->" "$TEST_PROJECT/CLAUDE.md"
    grep -q "<!-- ULTIMATE_INTELLIGENCE_SYSTEM_END -->" "$TEST_PROJECT/CLAUDE.md"

    # Verify metadata comment exists (with version and date)
    grep -q "Installed:.*Version: v1.2.1" "$TEST_PROJECT/CLAUDE.md"
}

@test "add_inline_integration: creates backup file" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Run function
    add_inline_integration "$TEST_PROJECT/CLAUDE.md"

    # Check backup exists
    run bash -c "ls $TEST_PROJECT/CLAUDE.md.backup-* 2>/dev/null"
    [ "$status" -eq 0 ]
}

@test "add_inline_integration: embedded template content is complete" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Run function
    add_inline_integration "$TEST_PROJECT/CLAUDE.md"

    # Verify key sections from template are present
    grep -q "Intelligence System Usage Guide" "$TEST_PROJECT/CLAUDE.md"
    grep -q "Quick Start" "$TEST_PROJECT/CLAUDE.md"
    grep -q "/index" "$TEST_PROJECT/CLAUDE.md"
    grep -q "/intel compact" "$TEST_PROJECT/CLAUDE.md"
}

#
# TEST GROUP 4: create_dotclaude_memory()
#

@test "create_dotclaude_memory: creates .claude/CLAUDE.md from scratch" {
    # Setup
    source_integration_script
    # No .claude/ directory exists yet

    # Run function with explicit target directory
    run create_dotclaude_memory "$TEST_PROJECT"

    # Assertions
    [ "$status" -eq 0 ]

    # Verify .claude/ directory created
    [ -d "$TEST_PROJECT/.claude" ]

    # Verify CLAUDE.md created
    [ -f "$TEST_PROJECT/.claude/CLAUDE.md" ]

    # Verify content
    grep -q "# Project Memory" "$TEST_PROJECT/.claude/CLAUDE.md"
    grep -q "# Intelligence System Integration" "$TEST_PROJECT/.claude/CLAUDE.md"
    grep -q "@$MOCK_SYSTEM_DIR" "$TEST_PROJECT/.claude/CLAUDE.md"
}

@test "create_dotclaude_memory: works when .claude/ already exists" {
    # Setup
    source_integration_script
    mkdir -p "$TEST_PROJECT/.claude"  # Directory exists, but no CLAUDE.md

    # Run function with explicit target directory
    run create_dotclaude_memory "$TEST_PROJECT"

    # Assertions
    [ "$status" -eq 0 ]
    [ -f "$TEST_PROJECT/.claude/CLAUDE.md" ]
}

@test "create_dotclaude_memory: content has correct structure" {
    # Setup
    source_integration_script

    # Run function with explicit target directory
    create_dotclaude_memory "$TEST_PROJECT"

    # Verify structure
    # Should have exactly these sections in order:
    grep -q "^# Project Memory$" "$TEST_PROJECT/.claude/CLAUDE.md"
    grep -q "^# Intelligence System Integration$" "$TEST_PROJECT/.claude/CLAUDE.md"
    grep -q "^@$MOCK_SYSTEM_DIR" "$TEST_PROJECT/.claude/CLAUDE.md"
}

@test "create_dotclaude_memory: no backup file created (new file)" {
    # Setup
    source_integration_script

    # Run function with explicit target directory
    create_dotclaude_memory "$TEST_PROJECT"

    # No backup should exist (file is new)
    run bash -c "ls $TEST_PROJECT/.claude/CLAUDE.md.backup-* 2>/dev/null"
    [ "$status" -ne 0 ]  # Should fail (no backup files)
}

#
# TEST GROUP 5: Idempotency
#

@test "idempotency: running twice with import method does not duplicate" {
    skip "Requires full script execution - implement in integration tests"
    # This test requires running the full main() function
    # See integration test suite for implementation
}

@test "idempotency: running twice with inline method does not duplicate" {
    skip "Requires full script execution - implement in integration tests"
}

#
# TEST GROUP 6: Edge Cases
#

@test "edge case: handles directory with spaces in path" {
    # Setup
    source_integration_script
    TEST_SPACE_DIR="$TEST_DIR/dir with spaces"
    mkdir -p "$TEST_SPACE_DIR"

    create_sample_claude_md "$TEST_SPACE_DIR/CLAUDE.md"

    # Run function
    run add_import_integration "$TEST_SPACE_DIR/CLAUDE.md"

    # Should succeed
    [ "$status" -eq 0 ]
    [ -f "$TEST_SPACE_DIR/CLAUDE.md" ]
    grep -q "@$MOCK_SYSTEM_DIR" "$TEST_SPACE_DIR/CLAUDE.md"
}

@test "edge case: handles CLAUDE.md with unicode characters" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md" "# 项目文档 🚀\n\nEmoji and unicode: 日本語"

    # Run function
    add_import_integration "$TEST_PROJECT/CLAUDE.md"

    # Verify original unicode preserved
    grep -q "项目文档" "$TEST_PROJECT/CLAUDE.md"
    grep -q "🚀" "$TEST_PROJECT/CLAUDE.md"
    grep -q "日本語" "$TEST_PROJECT/CLAUDE.md"

    # Verify import added
    grep -q "@$MOCK_SYSTEM_DIR" "$TEST_PROJECT/CLAUDE.md"
}

@test "edge case: handles multiple existing backup files" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Create fake old backups
    touch "$TEST_PROJECT/CLAUDE.md.backup-20240101_120000"
    touch "$TEST_PROJECT/CLAUDE.md.backup-20240102_120000"

    # Count backups before
    backup_count_before=$(ls "$TEST_PROJECT"/CLAUDE.md.backup-* 2>/dev/null | wc -l)

    # Run function
    add_import_integration "$TEST_PROJECT/CLAUDE.md"

    # Count backups after
    backup_count_after=$(ls "$TEST_PROJECT"/CLAUDE.md.backup-* 2>/dev/null | wc -l)

    # Should have one more backup
    [ "$backup_count_after" -eq $((backup_count_before + 1)) ]

    # Old backups should still exist
    [ -f "$TEST_PROJECT/CLAUDE.md.backup-20240101_120000" ]
    [ -f "$TEST_PROJECT/CLAUDE.md.backup-20240102_120000" ]
}

#
# TEST GROUP 7: Error Handling
#

@test "error handling: fails gracefully on read-only file" {
    skip "Requires permission manipulation - implement carefully"
    # This test needs to:
    # 1. Create file
    # 2. Make it read-only (chmod)
    # 3. Attempt integration
    # 4. Verify error
    # 5. Restore permissions in teardown
}

@test "error handling: detects missing template file" {
    # Setup
    source_integration_script
    create_sample_claude_md "$TEST_PROJECT/CLAUDE.md"

    # Remove template file
    rm "$MOCK_SYSTEM_DIR/.claude/USAGE_TEMPLATE.md"

    # Run function (will fail because template doesn't exist)
    run add_inline_integration "$TEST_PROJECT/CLAUDE.md"

    # Should fail
    [ "$status" -ne 0 ]
}

#
# HELPER TEST (verify test infrastructure)
#

@test "test infrastructure: mock system directory exists" {
    [ -d "$MOCK_SYSTEM_DIR" ]
    [ -d "$MOCK_SYSTEM_DIR/.claude" ]
    [ -f "$MOCK_SYSTEM_DIR/.claude/USAGE_TEMPLATE.md" ]
}

@test "test infrastructure: test project directory exists" {
    [ -d "$TEST_PROJECT" ]
}

@test "test infrastructure: environment variables are set" {
    [ -n "$SYSTEM_DIR" ]
    [ -n "$TEMPLATE_PATH" ]
    [ -n "$IMPORT_LINE" ]
}

#
# NOTES FOR IMPLEMENTATION
#

# To make this test file work, you need to:
#
# 1. Modify integrate_claude_md.sh to export functions:
#    - Add this at the end of the script:
#      if [ "${BASH_SOURCE[0]}" != "${0}" ]; then
#          # Script is being sourced, export functions
#          export -f check_integration_exists
#          export -f add_import_integration
#          export -f add_inline_integration
#          export -f create_dotclaude_memory
#      else
#          # Script is being executed, run main
#          main "$@"
#      fi
#
# 2. Create test_helpers.bash with utility functions:
#    - Mock user input functions
#    - File comparison utilities
#    - Assertion helpers
#
# 3. Install BATS:
#    brew install bats-core
#
# 4. Run tests:
#    bats tests/shell/test_integrate_claude_md.bats
#
# 5. For debugging:
#    bats -t tests/shell/test_integrate_claude_md.bats  # TAP output
#    bats --verbose-run tests/shell/test_integrate_claude_md.bats  # Verbose
