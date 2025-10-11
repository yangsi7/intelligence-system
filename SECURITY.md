# Project Safety Policy

## Supported Versions

We release patches for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |
| < 1.0   | :x:                |

## Reporting Issues

If you discover a safety issue, please report it by:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers or use GitHub's private reporting feature
3. Include as much detail as possible:
   - Description of the issue
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes

## Response Timeline

- Initial response: Within 48 hours
- Status update: Within 7 days
- Fix timeline: Depends on severity (critical issues prioritized)

## Important Notes

### Hook Execution

This system uses Claude Code hooks that execute shell commands automatically. Users should:
- Review all hook commands before enabling
- Only use hooks from trusted sources
- Test hooks in safe environments first
- Understand that hooks can access any files your user account can access

### Installation Scripts

The installation script (`install.sh`) performs system modifications:
- Creates directories in your home folder
- Copies files to `~/.claude/` directory
- Modifies settings files
- Always review scripts before running with elevated privileges

### Best Practices

1. **Review code before installation**: Always inspect scripts before running
2. **Verify source**: Only install from official repository
3. **Keep updated**: Use latest versions with patches applied
4. **Report issues**: Help improve safety by reporting concerns

## Disclosure Policy

When we receive a report:
1. Confirm receipt within 48 hours
2. Investigate and validate the issue
3. Develop and test a fix
4. Release the patch
5. Credit the reporter (if desired)

## Comments

This project is designed as a development tool for Claude Code users. Users should understand the system's capabilities and potential impacts before installation.

Thank you for helping keep this project safe!
