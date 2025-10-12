# Test Implementation Checklist

**Project:** v1.2.1 CLAUDE.md Integration System
**Component:** `scripts/integrate_claude_md.sh`
**Priority:** CRITICAL
**Estimated Time:** 18 hours

---

## Pre-Implementation Setup

### Tools Installation (30 minutes)
- [ ] Install BATS testing framework
  ```bash
  brew install bats-core
  bats --version  # Verify
  ```
- [ ] Install shellcheck for static analysis
  ```bash
  brew install shellcheck
  shellcheck --version  # Verify
  ```
- [ ] Install watchexec for continuous testing (optional)
  ```bash
  brew install watchexec
  ```

### Repository Setup (30 minutes)
- [ ] Create test directory structure
  ```bash
  mkdir -p tests/shell/fixtures
  mkdir -p tests/integration
  ```
- [ ] Copy example test file as starting point
  ```bash
  cp tests/shell/EXAMPLE_test_integrate_claude_md.bats \
     tests/shell/test_integrate_claude_md.bats
  ```
- [ ] Create test helpers file
  ```bash
  touch tests/shell/test_helpers.bash
  ```
- [ ] Create test fixtures
  ```bash
  mkdir -p tests/shell/fixtures/{sample_root,sample_dotclaude,sample_empty}
  ```

### Code Preparation (15 minutes)
- [ ] Modify `scripts/integrate_claude_md.sh` to export functions
  - Add sourcing detection logic at end of file
  - Export all 5 functions when sourced
  - Keep main() execution when run directly
- [ ] Run initial shellcheck
  ```bash
  shellcheck scripts/integrate_claude_md.sh > shellcheck_report.txt
  ```
- [ ] Review and fix any critical issues

---

## Phase 1: Unit Tests (6 hours)

### Test Group 1: check_integration_exists() (1 hour)
- [ ] Test 1.1: Detects import line
- [ ] Test 1.2: Detects inline markers
- [ ] Test 1.3: Non-existent file returns false
- [ ] Test 1.4: File without integration returns false
- [ ] Test 1.5: Empty file handling
- [ ] Test 1.6: Rejects incorrect patterns

**Validation:** Run `bats tests/shell/test_integrate_claude_md.bats --filter "check_integration_exists"`

### Test Group 2: add_import_integration() (1.5 hours)
- [ ] Test 2.1: Add import to existing file
- [ ] Test 2.2: Backup file creation with timestamp
- [ ] Test 2.3: Append to empty file
- [ ] Test 2.4: Permission denied handling
- [ ] Test 2.5: Section formatting validation

**Validation:** Run `bats tests/shell/test_integrate_claude_md.bats --filter "add_import_integration"`

### Test Group 3: add_inline_integration() (1.5 hours)
- [ ] Test 3.1: Add inline with markers
- [ ] Test 3.2: Marker format validation
- [ ] Test 3.3: Template content completeness
- [ ] Test 3.4: Backup creation

**Validation:** Run `bats tests/shell/test_integrate_claude_md.bats --filter "add_inline_integration"`

### Test Group 4: create_dotclaude_memory() (1 hour)
- [ ] Test 4.1: Create from scratch
- [ ] Test 4.2: Handle existing .claude/ directory
- [ ] Test 4.3: Content validation
- [ ] Test 4.4: No backup for new file

**Validation:** Run `bats tests/shell/test_integrate_claude_md.bats --filter "create_dotclaude_memory"`

### Test Group 5: main() scenarios (2 hours)
- [ ] Test 5.1: Scenario 1 - Root CLAUDE.md (interactive, import)
- [ ] Test 5.2: Scenario 1 - Root CLAUDE.md (interactive, inline)
- [ ] Test 5.3: Scenario 1 - Root CLAUDE.md (non-interactive)
- [ ] Test 5.4: Scenario 2 - .claude/CLAUDE.md (interactive, import)
- [ ] Test 5.5: Scenario 2 - .claude/CLAUDE.md (interactive, inline)
- [ ] Test 5.6: Scenario 2 - .claude/CLAUDE.md (non-interactive)
- [ ] Test 5.7: Scenario 3 - .claude/ exists, no CLAUDE.md
- [ ] Test 5.8: Scenario 4 - Nothing exists (interactive, .claude/)
- [ ] Test 5.9: Scenario 4 - Nothing exists (interactive, root)
- [ ] Test 5.10: Scenario 4 - Nothing exists (non-interactive)

**Note:** These tests require full script execution, may need integration test approach

**Validation:** Run `bats tests/shell/test_integrate_claude_md.bats`

---

## Phase 2: Integration Tests (4 hours)

### Test Group 6: Idempotency (1 hour)
- [ ] Test 6.1: Run twice with import method
  - Verify no duplicate content
  - Verify "Already integrated" message
  - Verify exit code 0
- [ ] Test 6.2: Run twice with inline method
  - Verify no duplicate markers
  - Verify "Already integrated" message
- [ ] Test 6.3: Run on both root and .claude/
  - Verify detects first integration
  - Verify doesn't modify second location

**Validation:** Run integration test suite

### Test Group 7: Error Handling (1.5 hours)
- [ ] Test 7.1: Invalid target directory
  - Verify error message
  - Verify exit code 1
- [ ] Test 7.2: System not installed
  - Mock missing ~/.claude-intelligence-system/
  - Verify error with instructions
- [ ] Test 7.3: Template file missing
  - Mock missing USAGE_TEMPLATE.md
  - Verify error with reinstall suggestion
- [ ] Test 7.4: No write permissions
  - Create read-only directory
  - Verify graceful failure
- [ ] Test 7.5: Disk full scenario (optional)

**Validation:** Test error scenarios

### Test Group 8: Edge Cases (1.5 hours)
- [ ] Test 8.1: Directory with spaces
- [ ] Test 8.2: Special characters in path
- [ ] Test 8.3: Non-ASCII content (unicode, emoji)
- [ ] Test 8.4: Very large CLAUDE.md (>1MB)
- [ ] Test 8.5: Multiple existing backups
- [ ] Test 8.6: Concurrent execution
- [ ] Test 8.7: Template is symlink

**Validation:** Edge case test suite

---

## Phase 3: End-to-End Tests (4 hours)

### Test Group 9: Installation Flow (2 hours)
- [ ] Test 9.1: Fresh installation with integration
  - Mock install.sh execution
  - Verify integration called
  - Verify success
- [ ] Test 9.2: Fresh installation without integration
  - Decline integration prompt
  - Verify no project modification
- [ ] Test 9.3: Non-interactive installation
  - Mock pipe input
  - Verify skips integration
  - Verify instructions shown

**Validation:** E2E installation tests

### Test Group 10: Slash Command (1.5 hours)
- [ ] Test 10.1: /integrate in current directory
- [ ] Test 10.2: /integrate with path argument
- [ ] Test 10.3: /integrate with relative path
- [ ] Test 10.4: /integrate with invalid path

**Validation:** Slash command tests

### Test Group 11: Content Validation (0.5 hours)
- [ ] Test 11.1: Import line format exact match
- [ ] Test 11.2: Section header format
- [ ] Test 11.3: Inline marker format
- [ ] Test 11.4: Template completeness
- [ ] Test 11.5: Success message format

**Validation:** Content validation tests

---

## Phase 4: Documentation & CI/CD (2 hours)

### Static Analysis (30 minutes)
- [ ] Run shellcheck on all shell scripts
  ```bash
  shellcheck scripts/integrate_claude_md.sh
  shellcheck scripts/find_python.sh
  shellcheck scripts/run_python.sh
  ```
- [ ] Fix all critical issues
- [ ] Document any false positives
- [ ] Create `.shellcheckrc` configuration file

### CI/CD Setup (1 hour)
- [ ] Create `.github/workflows/shell-tests.yml`
- [ ] Configure BATS installation
- [ ] Configure shellcheck installation
- [ ] Add test execution steps
- [ ] Add test result upload
- [ ] Test workflow locally with `act` (optional)

### Documentation (30 minutes)
- [ ] Create `tests/shell/README.md`
  - Explain test structure
  - Document how to run tests
  - List all test cases
  - Provide examples
- [ ] Update main README with testing section
- [ ] Create `SHELL_TEST_COVERAGE.md` report
  - List coverage metrics
  - Show test counts
  - Document known limitations

---

## Phase 5: Validation & Sign-off (1 hour)

### Final Testing
- [ ] Run full test suite
  ```bash
  bats tests/shell/*.bats tests/integration/*.bats
  ```
- [ ] Verify all 67 tests pass
- [ ] Check test execution time (<2 minutes total)
- [ ] Review test output for clarity

### Quality Gates
- [ ] All BATS tests passing
- [ ] Shellcheck reports no critical errors
- [ ] Code coverage ≥ 80%
- [ ] No flaky tests (run 3 times, all pass)
- [ ] CI/CD pipeline green

### Documentation Review
- [ ] Test plan reviewed
- [ ] Test documentation complete
- [ ] Examples provided
- [ ] Known issues documented

### Stakeholder Sign-off
- [ ] Demo test suite to project lead
- [ ] Present coverage metrics
- [ ] Review risk mitigation
- [ ] Get approval for merge

---

## Success Metrics

**Completion Criteria:**
- ✅ 67/67 test cases implemented
- ✅ 100% function coverage (5/5)
- ✅ 80%+ scenario coverage
- ✅ CI/CD pipeline operational
- ✅ Documentation complete

**Quality Metrics:**
- ✅ All tests pass consistently
- ✅ No false positives/negatives
- ✅ Test execution < 2 minutes
- ✅ Clear failure messages
- ✅ Easy to add new tests

---

## Troubleshooting

### Common Issues

**BATS not found:**
```bash
# Reinstall
brew reinstall bats-core
# Or add to PATH
export PATH="/usr/local/bin:$PATH"
```

**Shellcheck errors:**
```bash
# Ignore specific check
# shellcheck disable=SC2155
```

**Tests failing intermittently:**
- Check for timing issues
- Verify cleanup in teardown()
- Use fixed timestamps in tests

**Can't source script:**
- Verify function export logic
- Check BASH_SOURCE detection
- Test sourcing manually

### Getting Help

**Resources:**
- BATS docs: https://bats-core.readthedocs.io/
- Shellcheck wiki: https://github.com/koalaman/shellcheck/wiki
- Example tests: `tests/shell/EXAMPLE_test_integrate_claude_md.bats`
- Test plan: `TEST_PLAN_INTEGRATION_SYSTEM.md`

**Contact:**
- Review test plan documents
- Check existing Python tests for patterns
- Ask in team chat

---

## Quick Commands

```bash
# Install everything
brew install bats-core shellcheck watchexec

# Run all tests
bats tests/shell/*.bats

# Run with watch mode
watchexec -e sh,bats "bats tests/shell/*.bats"

# Run specific test
bats tests/shell/test_integrate_claude_md.bats --filter "test_name"

# Static analysis
shellcheck scripts/*.sh

# Generate coverage report
grep -r "@test" tests/shell/ | wc -l  # Count tests
```

---

## Progress Tracking

**Start Date:** _________________
**Target Completion:** _________________

**Phase Completion:**
- [ ] Phase 0: Setup (1 hour)
- [ ] Phase 1: Unit Tests (6 hours)
- [ ] Phase 2: Integration Tests (4 hours)
- [ ] Phase 3: E2E Tests (4 hours)
- [ ] Phase 4: Documentation (2 hours)
- [ ] Phase 5: Validation (1 hour)

**Total Time:** _____ / 18 hours

**Blockers:**
- _________________
- _________________

**Notes:**
- _________________
- _________________

---

**Checklist Version:** 1.0
**Last Updated:** 2025-10-12
**Owner:** _________________
**Status:** PENDING
