---
description: Validate implementation against requirements and acceptance criteria
argument-hint: [target]
allowed-tools: Read, Bash, SlashCommand
---

# Validation Command

Run postflight validation checks to ensure quality and completeness.

## Usage

Validate implementation:
```bash
/validate implementation
```

Validate test coverage:
```bash
/validate tests
```

Check deployment:
```bash
/validate deployment
```

Full validation suite:
```bash
/validate all
```

## Validation Targets

### 1. Implementation Validation

Checks:
- ✓ All requirements met
- ✓ Acceptance criteria satisfied
- ✓ No regressions introduced
- ✓ Code follows best practices
- ✓ Documentation complete

Command:
```bash
/validate implementation
```

Runs:
1. `/intel analyze-patterns` - Check for new code smells
2. `/intel hotspots` - Verify architectural health
3. Compare against requirements
4. Check acceptance criteria
5. Generate validation report

---

### 2. Test Validation

Checks:
- ✓ Unit tests pass
- ✓ Integration tests pass
- ✓ E2E tests pass (if applicable)
- ✓ Test coverage meets threshold
- ✓ No flaky tests

Command:
```bash
/validate tests
```

Runs:
1. Execute test suite
2. Check coverage report
3. Identify failures
4. Generate test report

---

### 3. Deployment Validation

Checks:
- ✓ Build succeeds
- ✓ No deployment errors
- ✓ Services healthy
- ✓ Logs clean
- ✓ Performance acceptable

Command:
```bash
/validate deployment
```

Runs:
1. Check build status
2. Review deployment logs (Vercel MCP if available)
3. Check service health
4. Generate deployment report

---

### 4. Full Validation

Runs all validation checks in sequence:
1. Implementation validation
2. Test validation
3. Deployment validation
4. Final comprehensive report

Command:
```bash
/validate all
```

---

## Output

Validation results are written to:
```
/workflow/final/validation-report.md
```

Report includes:
- **Pass/Fail Status**
- **Checks Performed**
- **Issues Found**
- **Recommendations**
- **Follow-up Actions**

## Validation Criteria

### Implementation Must:
1. Satisfy all stated requirements
2. Pass all acceptance criteria
3. Introduce no new code smells
4. Follow coding best practices
5. Include proper documentation

### Tests Must:
1. All tests pass
2. Coverage ≥ existing baseline
3. No flaky tests
4. Performance tests pass (if applicable)

### Deployment Must:
1. Build successfully
2. Deploy without errors
3. Services start correctly
4. No critical log errors

## Integration with Workflows

Validation is automatically run at the end of orchestrated workflows:

```
Implementor → Reviewer → Tester → /validate → Postflight
```

You can also run it manually anytime:

```bash
/validate implementation
```

## Error Handling

If validation fails:
1. Detailed failure report generated
2. Specific failures highlighted
3. Recommendations provided
4. Follow-up tasks created

Orchestrator will:
- Log failures
- Optionally retry with fixes
- Report to user

## See Also

- Postflight agent: @.claude/agents/postflight.md
- Acceptance criteria template: @templates/acceptance-criteria.md
- Validation checklist: @templates/validation-checklist.md

## Arguments

Target: $ARGUMENTS (defaults to "implementation")

Valid targets:
- `implementation`
- `tests`
- `deployment`
- `all`

## Execution

Use the `postflight` subagent to validate target: "$ARGUMENTS"

Load context:
- @workflow/final/integrated-solution.md
- @workflow/planning/requirements.md
- @workflow/planning/acceptance-criteria.md

Output:
- /workflow/final/validation-report.md
- /workflow/final/VALIDATION_COMPLETE (signal file)
