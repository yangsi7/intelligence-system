# Claude Rules: Multi-Agent Coordination Standards

**Version:** 1.0.0
**Last Updated:** 2025-10-12
**Purpose:** Operational rules and standards for multi-agent intelligence orchestration

---

## Overview

This document defines the operational rules governing agent behavior, coordination, and quality standards in the Ultimate Intelligence System. These rules ensure consistent, high-quality execution across all tasks while maintaining token efficiency and proper error handling.

---

## Core Coordination Rules

### Rule 1: File-Based Communication Only

**Principle:** Agents never communicate directly. All communication happens through files.

**Requirements:**
- Agents read context from `/workflow/packages/agent_{ID}_context.md`
- Agents write results to `/workflow/outputs/agent_{ID}_result.md`
- Agents signal completion with `/workflow/outputs/agent_{ID}_COMPLETE`
- Agents may read prior agent outputs via `@workflow/outputs/agent_X_result.md`

**Benefits:**
- Isolation: Each agent has independent context
- Auditability: All communication tracked in files
- Debuggability: Can inspect agent I/O
- Resumability: Can restart failed agents

**Example:**
```markdown
## Agent Context Package (agent_2_context.md)

## Inputs (via @ references)
- @workflow/intel/shared-context.md (intelligence)
- @workflow/outputs/agent_1_result.md (research findings)

## Outputs
Write to:
- /workflow/outputs/agent_2_result.md
- /workflow/outputs/agent_2_COMPLETE (when done)
```

---

### Rule 2: Intelligence Gathered Once

**Principle:** Never run intelligence analysis more than once per workflow.

**Requirements:**
- Run `/intel` at the start of workflow (Context or Analysis module)
- Write results to `/workflow/intel/shared-context.md`
- All agents load intelligence via `@workflow/intel/shared-context.md`
- Never re-analyze the same code

**Token Savings:**
- Running `/intel standard` once: 8k tokens
- 5 agents loading via `@` reference: ~0 tokens overhead
- Without this rule: 5 × 8k = 40k tokens wasted

**Example:**
```bash
# Orchestrator runs ONCE
/intel standard src/ > workflow/intel/shared-context.md

# All agents include in their context package:
@workflow/intel/shared-context.md
```

---

### Rule 3: Parallel Execution via Single Message

**Principle:** Launch independent agents in parallel using a single message with multiple Task calls.

**Requirements:**
- Identify independent agents (no dependencies)
- Use single message for all parallel Task calls
- Never launch parallel agents in separate messages

**Critical:**
```
✅ CORRECT (parallel - 2 min total):
Task({ subagent_type: "reviewer", description: "Review code", prompt: "..." })
Task({ subagent_type: "tester", description: "Test code", prompt: "..." })

❌ INCORRECT (sequential - 6 min total):
Task({ subagent_type: "reviewer", description: "Review code", prompt: "..." })
[wait for completion]
Task({ subagent_type: "tester", description: "Test code", prompt: "..." })
```

**Benefit:** 3x faster execution for independent agents

---

### Rule 4: Use @ References for Zero-Token Loading

**Principle:** Always use `@` notation to reference files instead of reading them directly.

**Requirements:**
- Use `@path/to/file.md` in prompts and context packages
- Never use Read tool to load shared context
- Reference files are loaded with near-zero token cost

**Token Savings:**
- Reading file directly: 3000 tokens
- Using `@` reference: ~10 tokens (just the path)

**Example:**
```markdown
## Context Package

Load these files (zero token cost):
- @workflow/intel/shared-context.md
- @workflow/outputs/agent_1_result.md
- @guides/authentication-patterns.md

Do NOT use Read tool on these files.
Claude Code loads them automatically via @ notation.
```

---

### Rule 5: Session State Management

**Principle:** All session state tracked in JSON files with unique session ID.

**Requirements:**
- Every session has unique UUID
- Session files:
  - `session/planning-<sessionId>.json`
  - `session/todo-<sessionId>.json`
  - `session/workbook-<sessionId>.json`
  - `session/events-<sessionId>.json`
- Update files in real-time as workflow progresses
- Never create sessions without unique ID

**Benefit:** No collisions, easy to inspect, supports resumability

**Example:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-10-12T14:30:00Z",
  "taskDescription": "Add password reset functionality",
  "orchestratorType": "normal"
}
```

---

### Rule 6: Shared Resource Access Protocol

**Principle:** Clear rules for who can read/write shared resources.

**Access Matrix:**

| Resource | Main Agent | Orchestrator | Individual Agents |
|----------|------------|--------------|-------------------|
| `workflow/planning/` | R/W | R/W | R (via @) |
| `workflow/intel/` | R/W | R | R (via @) |
| `workflow/packages/` | R/W | R/W | R (own package) |
| `workflow/outputs/` | R | R | W (own files) |
| `workflow/final/` | R/W | R/W | R (via @) |
| `session/planning*.json` | R/W | R/W | R (via @) |
| `session/todo*.json` | R/W | R/W | R/W (update own items) |
| `session/workbook*.json` | R/W | R/W | R/W (append only) |
| `session/events*.json` | R/W | R/W | W (append only) |

**Rules:**
- Main agent creates session structure
- Orchestrator manages workflow files
- Agents write to their designated output files
- Agents can append to workbook and events (never overwrite)
- Agents can update their assigned todos
- All reads via `@` notation when possible

---

## Planning Rules

### Planning Rule 1: Always Create Plan Before Execution

**Requirement:**
- Never implement without a plan
- Plan must include: goals, subtasks, dependencies, success criteria
- Save plan to `/workflow/planning/implementation_plan.md`
- Review plan before proceeding to execution

**Template:**
```markdown
# Implementation Plan

## Goal
<Clear description>

## Subtasks
1. <Task> (Agent: <type>, Wave: <#>, Dependencies: <list>)
2. <Task> (Agent: <type>, Wave: <#>, Dependencies: <list>)

## Success Criteria
- [ ] <Criterion>
- [ ] <Criterion>

## Token Budget
Total: 200k
- Intelligence: 8k (4%)
- Task 1: 20k (10%)
- ...
```

---

### Planning Rule 2: Update Plan When Requirements Change

**Requirement:**
- If user adds/changes requirements mid-session
- Pause execution
- Update plan document
- Get user confirmation
- Resume with updated plan

**Process:**
```
User: "Actually, also add 2FA support"
Agent: "I'll update the implementation plan to include 2FA."
       [Updates plan]
       "Updated plan includes:
        - New subtask: Implement 2FA flow
        - Modified dependencies
        - Adjusted token budget
        Proceed with updated plan?"
User: "Yes"
Agent: [Resumes with new plan]
```

---

### Planning Rule 3: Document Dependency Graph

**Requirement:**
- Create `dependency_graph.json` showing task dependencies
- Use graph to determine wave assignments
- Validate no circular dependencies

**Format:**
```json
{
  "tasks": {
    "task_1": {
      "name": "Research patterns",
      "dependencies": [],
      "wave": 1
    },
    "task_2": {
      "name": "Implement feature",
      "dependencies": ["task_1"],
      "wave": 2
    },
    "task_3": {
      "name": "Review code",
      "dependencies": ["task_2"],
      "wave": 3
    },
    "task_4": {
      "name": "Test feature",
      "dependencies": ["task_2"],
      "wave": 3
    }
  }
}
```

---

## Todo Rules

### Todo Rule 1: Create Todos from Plan

**Requirement:**
- Extract todos from implementation plan
- Each subtask becomes a todo
- Assign to appropriate agent
- Track in `session/todo-<sessionId>.json`

**Format:**
```json
{
  "sessionId": "<uuid>",
  "todos": [
    {
      "id": "<uuid>",
      "content": "Research authentication patterns",
      "activeForm": "Researching authentication patterns",
      "status": "pending",
      "assignedAgent": "researcher",
      "dependencies": [],
      "createdAt": "2025-10-12T14:30:00Z",
      "completedAt": null
    }
  ]
}
```

---

### Todo Rule 2: Update Todos in Real-Time

**Requirement:**
- Mark todo as `in_progress` when agent starts
- Mark todo as `completed` when agent finishes
- Add `completedAt` timestamp
- Never batch todo updates

**Process:**
```
Agent starts task →
  Update todo status: "in_progress"

Agent completes task →
  Update todo status: "completed"
  Add completedAt timestamp
  Write completion signal file
```

---

### Todo Rule 3: One Todo In-Progress at a Time (Per Agent)

**Requirement:**
- Each agent works on exactly ONE todo at a time
- Never mark multiple todos as `in_progress` for same agent
- Complete current todo before starting next

**Example:**
```json
// ✅ CORRECT
{
  "todos": [
    {"id": "1", "status": "completed", "assignedAgent": "implementor"},
    {"id": "2", "status": "in_progress", "assignedAgent": "implementor"},
    {"id": "3", "status": "pending", "assignedAgent": "implementor"}
  ]
}

// ❌ INCORRECT (multiple in-progress for same agent)
{
  "todos": [
    {"id": "1", "status": "in_progress", "assignedAgent": "implementor"},
    {"id": "2", "status": "in_progress", "assignedAgent": "implementor"}
  ]
}
```

---

### Todo Rule 4: Mark Failed Todos Explicitly

**Requirement:**
- If agent fails, mark todo as `failed` (not `completed`)
- Add error details to `errorMessage` field
- Log error to `/workflow/errors/agent_{ID}_error.md`

**Format:**
```json
{
  "id": "uuid-2",
  "content": "Implement password reset",
  "status": "failed",
  "assignedAgent": "implementor",
  "errorMessage": "Timeout after 30 minutes",
  "failedAt": "2025-10-12T15:30:00Z"
}
```

---

## Writing Rules

### Writing Rule 1: Use Paragraphs, Not Bullet Lists

**Requirement:**
- Write explanatory content in coherent paragraphs
- Use varied sentence structure
- Only use bullet lists for:
  - Actual lists of items
  - Step-by-step procedures
  - Checklists (todos)

**Example:**
```markdown
❌ INCORRECT:
- The system uses token optimization
- It reduces token usage by 90%
- This is achieved through @ references

✅ CORRECT:
The system achieves 90% token optimization through the use of @ references.
When agents load shared context files using the @ notation, Claude Code includes
the file content with near-zero token overhead, compared to reading files directly
which can consume thousands of tokens per reference.
```

---

### Writing Rule 2: Provide Thorough, Detailed Explanations

**Requirement:**
- Default to comprehensive, detailed explanations
- Include context, rationale, and examples
- Only be brief when user explicitly requests brevity
- Multi-thousand-word outputs are acceptable for complex topics

**Guideline:**
- Simple concept: 200-500 words
- Medium concept: 500-1500 words
- Complex concept: 1500-5000+ words

---

### Writing Rule 3: Cite Sources

**Requirement:**
- When referencing external sources, cite them
- Include source links or file references
- Format: [Description](URL) or @path/to/file.md

**Example:**
```markdown
Password reset tokens should be cryptographically random and expire after 1 hour
[OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).
The existing authentication module follows this pattern (@src/auth/token-manager.ts:45-67).
```

---

### Writing Rule 4: No Placeholders or Incomplete Sections

**Requirement:**
- Never use placeholders like "TODO", "...", "[implementation here]"
- Never leave sections incomplete
- Never use pseudocode unless explicitly requested
- Complete all outputs fully

**Example:**
```typescript
❌ INCORRECT:
function resetPassword(email: string) {
  // TODO: Implement this
  // ...
}

✅ CORRECT:
function resetPassword(email: string): Promise<void> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 3600000); // 1 hour
  await db.passwordResetTokens.create({ email, token, expiry });
  await emailService.sendPasswordResetEmail(email, token);
}
```

---

### Writing Rule 5: Maintain Logical Flow with Headings

**Requirement:**
- Use markdown headings to structure content
- Create clear hierarchy (H1 → H2 → H3)
- Use headings to break up long sections
- Make documents scannable

**Example:**
```markdown
# Main Topic

## Subtopic 1

### Detail 1.1
Content...

### Detail 1.2
Content...

## Subtopic 2

### Detail 2.1
Content...
```

---

## Coding Rules

### Coding Rule 1: Use Appropriate Language for Task

**Requirement:**
- Python for: data analysis, scripting, AI/ML
- TypeScript/JavaScript for: web apps, Node.js, full-stack
- Bash for: system automation, CLI tools
- SQL for: database queries
- Match language to project context

---

### Coding Rule 2: Generate Tests with Code

**Requirement:**
- When writing code, also write tests
- Test coverage should be comprehensive
- Include: unit tests, integration tests (if applicable), edge cases
- Use project's testing framework
- Tests must pass before considering task complete

**Example:**
```typescript
// Implementation
export function resetPassword(email: string, token: string, newPassword: string): Promise<void> {
  // ... implementation
}

// Tests (in separate file)
describe('resetPassword', () => {
  it('should reset password with valid token', async () => {
    // Test implementation
  });

  it('should reject expired token', async () => {
    // Test implementation
  });

  it('should reject invalid token', async () => {
    // Test implementation
  });

  it('should hash new password', async () => {
    // Test implementation
  });
});
```

---

### Coding Rule 3: Follow Project Style and Patterns

**Requirement:**
- Review existing code to understand style
- Use same naming conventions
- Follow established patterns
- Use same libraries/frameworks
- Match indentation, formatting

**Process:**
```
1. Search for similar existing code:
   /search content "auth" --type ts

2. Read examples:
   @src/auth/auth.controller.ts

3. Identify patterns:
   - Async/await pattern
   - Error handling approach
   - Validation strategy
   - Logging format

4. Follow identified patterns in new code
```

---

### Coding Rule 4: Document Code Appropriately

**Requirement:**
- Add comments for complex logic
- Use JSDoc/docstrings for public APIs
- Include examples in documentation
- Document assumptions and limitations

**Example:**
```typescript
/**
 * Initiates password reset flow by generating a secure token and sending reset email.
 *
 * @param email - User's email address
 * @returns Promise that resolves when email is sent
 * @throws {UserNotFoundError} If email doesn't exist in database
 * @throws {RateLimitError} If too many reset attempts (max 3 per hour)
 *
 * @example
 * ```typescript
 * await resetPassword('user@example.com');
 * ```
 */
export async function resetPassword(email: string): Promise<void> {
  // Validate email format
  if (!isValidEmail(email)) {
    throw new ValidationError('Invalid email format');
  }

  // Check rate limit (max 3 attempts per hour per email)
  const recentAttempts = await getRateLimitAttempts(email, 3600);
  if (recentAttempts >= 3) {
    throw new RateLimitError('Too many reset attempts');
  }

  // ... rest of implementation
}
```

---

### Coding Rule 5: Search Before Implementing

**Requirement:**
- Before implementing, search for existing implementations
- Don't reinvent the wheel
- Reuse existing utilities and patterns
- Extract common logic into shared functions

**Process:**
```bash
# Search for similar functionality
/search content "password.*reset" --type ts

# Check if utility already exists
/search symbol "generateSecureToken"

# If found, reuse:
import { generateSecureToken } from '@/utils/crypto';

# If not found, implement once and make reusable
```

---

## File Rules

### File Rule 1: Use Claude Code File Tools

**Requirement:**
- Use Read, Write, Edit, Glob, Grep tools
- Never construct file content via bash echo or cat
- Never use bash redirection for file creation (avoid `>` or `>>`)

**Example:**
```bash
❌ INCORRECT:
echo "content" > file.txt
cat << EOF > file.txt
content
EOF

✅ CORRECT:
Use Write tool with file_path and content parameters
```

---

### File Rule 2: Organize Intermediate Outputs

**Requirement:**
- Save intermediate outputs to organized directories
- Use clear, descriptive filenames
- Don't lose data due to context size limits
- Clean up temporary files after completion

**Structure:**
```
workflow/
├── planning/ (keep)
├── intel/ (keep)
├── packages/ (delete after completion)
├── outputs/ (keep result files, delete signals)
├── final/ (keep)
└── errors/ (keep if any)

session/
├── planning-<sessionId>.json (keep)
├── todo-<sessionId>.json (keep)
├── workbook-<sessionId>.json (keep)
└── events-<sessionId>.json (keep)
```

---

### File Rule 3: Clean Up Responsibly

**Requirement:**
- Remove temporary files after task completion
- Keep audit trail (planning, intelligence, outputs, final)
- Never delete session files
- Create archive if needed for long-term storage

**Cleanup Checklist:**
```bash
# Remove temporary context packages
rm -rf workflow/packages/*

# Remove completion signals
rm -f workflow/outputs/*_COMPLETE

# Keep these:
# ✓ workflow/planning/
# ✓ workflow/intel/
# ✓ workflow/outputs/*.md
# ✓ workflow/final/
# ✓ session/

# Optional: Create archive
tar -czf archives/session-<sessionId>.tar.gz workflow/ session/
```

---

### File Rule 4: Never Load Full Source Files

**Requirement:**
- Use intelligence summaries instead of reading full source
- Use `@` references for context
- Only read specific functions or excerpts when needed
- Request line ranges: `@src/auth.ts:45-67`

**Token Savings:**
```
Reading full file (1000 lines): 5000 tokens
Reading intelligence summary: 500 tokens
Reading specific excerpt (20 lines): 100 tokens

Savings: 98% (using excerpt vs full file)
```

---

## Shell Rules

### Shell Rule 1: Avoid Interactive Commands

**Requirement:**
- Never use commands requiring interactive input
- Use `-y` or `-f` flags for auto-confirmation
- Avoid `vim`, `nano`, interactive prompts

**Example:**
```bash
❌ INCORRECT:
apt-get install package  # Prompts for confirmation

✅ CORRECT:
apt-get install -y package  # Auto-confirms
```

---

### Shell Rule 2: Chain Commands for Efficiency

**Requirement:**
- Use `&&` to chain dependent commands
- Use `;` for independent commands (if order doesn't matter)
- Use `|` for piping
- Minimize separate tool calls

**Example:**
```bash
❌ INCORRECT (3 separate tool calls):
mkdir -p workflow
cd workflow
touch plan.md

✅ CORRECT (1 tool call):
mkdir -p workflow && touch workflow/plan.md
```

---

### Shell Rule 3: Quote File Paths with Spaces

**Requirement:**
- Always quote paths containing spaces
- Use double quotes
- Prevents word splitting errors

**Example:**
```bash
❌ INCORRECT:
cd /Users/name/My Documents  # Fails

✅ CORRECT:
cd "/Users/name/My Documents"  # Works
```

---

### Shell Rule 4: Use Appropriate Tools for Calculations

**Requirement:**
- Use `bc` for arithmetic
- Use Python for complex math
- Don't calculate mentally
- Don't guess numbers

**Example:**
```bash
# Simple arithmetic
echo "scale=2; 100 / 3" | bc  # 33.33

# Complex calculation
python3 -c "import math; print(math.sqrt(144))"  # 12.0
```

---

### Shell Rule 5: Be Cautious with Destructive Commands

**Requirement:**
- Never run `rm -rf` on critical directories
- No modifications to system settings without explicit permission
- Verify paths before deletion
- Always err on side of caution

**Dangerous Commands:**
```bash
❌ NEVER RUN:
rm -rf /
rm -rf /*
rm -rf ~/
chmod -R 777 /

✅ SAFE (with verification):
rm -f /path/to/specific/temp/file.txt  # After verifying path
```

---

## Browser/Research Rules

### Browser Rule 1: Use MCP Tools for Documentation

**Requirement:**
- Use context7 or ref MCP tools for library documentation
- Faster and more reliable than web search
- Get official, up-to-date docs

**Example:**
```
# Instead of web search
❌ WebSearch "Next.js API routes"

# Use MCP
✅ /mcp__context7__get-library-docs "/vercel/next.js" "API routes"
```

---

### Browser Rule 2: Validate Search Results

**Requirement:**
- Don't trust search engine snippets
- Click through to original source
- Verify information from full article
- Cross-check multiple sources

**Process:**
```
1. WebSearch returns snippets
2. Identify 2-3 most relevant sources
3. Use WebFetch to read full articles
4. Cross-validate information
5. Document sources in research report
```

---

### Browser Rule 3: Prioritize Authoritative Sources

**Requirement:**
- Prefer official documentation over blog posts
- Prefer established sources over unknown sites
- Check author credentials
- Verify publication date (prefer recent)

**Source Priority:**
```
1. Official library/framework documentation
2. Official language/platform documentation
3. Established tech publications (MDN, Stack Overflow Docs)
4. Reputable tech blogs (LogRocket, Smashing Magazine)
5. Individual blog posts (verify author expertise)
6. Forums/discussions (cross-validate)
```

---

### Browser Rule 4: Respect Rate Limits

**Requirement:**
- Don't overwhelm sites with rapid requests
- Space out requests if fetching multiple pages
- Respect robots.txt
- Use appropriate delays

**Guideline:**
```
Single page fetch: No delay needed
2-5 pages: 1 second delay between
5+ pages: 2-3 second delay between
```

---

## Error Handling Rules

### Error Rule 1: Interpret Error Messages

**Requirement:**
- Read error messages carefully
- Identify root cause
- Don't guess solutions
- Research error if unfamiliar

**Process:**
```
1. Error occurs
2. Read full error message and stack trace
3. Identify error type and location
4. Determine root cause
5. Research if needed
6. Implement fix
7. Verify fix works
```

---

### Error Rule 2: Try Alternative Approaches

**Requirement:**
- If first fix doesn't work, try alternative
- Don't repeat same failed attempt
- Try at least 2-3 different approaches
- Document what you tried

**Example:**
```
Attempt 1: Install package with npm → Failed (network error)
Attempt 2: Install with yarn → Failed (same error)
Attempt 3: Check if package name is correct → Found typo
Attempt 4: Install with correct name → Success
```

---

### Error Rule 3: Don't Get Stuck in Loops

**Requirement:**
- If 3 attempts fail, stop and ask for help
- Explain what you tried and why it failed
- Provide error details to user
- Ask for guidance or permission to try different approach

**Example:**
```
Agent: "I've attempted to fix the build error 3 times:
1. Updated dependency versions → Still failing
2. Cleared node_modules and reinstalled → Still failing
3. Checked for syntax errors → None found

The error persists: [error details]

Would you like me to:
A) Continue trying different approaches
B) Proceed without this fix
C) Seek additional information about the error"
```

---

### Error Rule 4: Log Errors Properly

**Requirement:**
- Write errors to `/workflow/errors/agent_{ID}_error.md`
- Include: timestamp, error message, stack trace, attempted fixes
- Update todo status to "failed"
- Update event log

**Error Log Format:**
```markdown
# Error Report: Agent 2 (Implementor)

## Timestamp
2025-10-12T15:45:00Z

## Task
Implement password reset endpoint

## Error
Build failed with TypeScript error:
```
TS2339: Property 'sendPasswordResetEmail' does not exist on type 'EmailService'
```

## Stack Trace
[full stack trace]

## Attempted Fixes
1. Checked EmailService interface → Missing method
2. Added method declaration → Build still failing
3. Realized method not implemented yet → Required dependency

## Resolution
Task blocked by missing EmailService implementation.
Requires Agent 3 to implement email service first.

## Status
Failed - Dependency blocker
```

---

## Agent-Specific Rules

### Rule: Orchestrator Agent

**Responsibilities:**
- Run intelligence ONCE at start
- Create context packages for all agents
- Dispatch agents in waves
- Monitor for completion signals
- Aggregate results
- Handle failures

**Must NOT:**
- Implement code (that's implementor's job)
- Write tests (that's tester's job)
- Skip intelligence gathering

---

### Rule: Researcher Agent

**Responsibilities:**
- Gather external information
- Validate sources
- Synthesize findings
- Document with citations

**Must NOT:**
- Implement code
- Make architectural decisions (provide options, not decisions)
- Skip source validation

---

### Rule: Implementor Agent

**Responsibilities:**
- Write code following specs
- Follow TDD when possible
- Update documentation
- Follow project patterns

**Must NOT:**
- Skip tests
- Ignore architectural decisions
- Use placeholders

---

### Rule: Reviewer Agent

**Responsibilities:**
- Review code for quality
- Check against requirements
- Identify issues
- Provide specific feedback

**Must NOT:**
- Auto-approve without review
- Focus only on style (check functionality first)
- Reject without clear reasoning

---

### Rule: Tester Agent

**Responsibilities:**
- Create comprehensive test suites
- Test edge cases
- Validate coverage
- Document test results

**Must NOT:**
- Skip edge cases
- Accept failing tests
- Write tests without running them

---

### Rule: Postflight Agent

**Responsibilities:**
- Final validation before delivery
- Check all acceptance criteria
- Verify no regressions
- Generate completion report

**Must NOT:**
- Skip validation steps
- Approve if criteria not met
- Skip regression checks

---

## Quality Standards

### Standard 1: Completeness

**Requirement:**
- All requirements must be met
- All todos must be completed
- No placeholders or unfinished work
- Documentation up-to-date

**Verification:**
```
✓ All requirements in requirements.md addressed
✓ All todos in todo.json marked completed
✓ No "TODO" or "..." in deliverables
✓ Documentation reflects changes
```

---

### Standard 2: Test Coverage

**Requirement:**
- Minimum 80% code coverage (or project standard)
- All critical paths tested
- Edge cases covered
- Tests passing

**Verification:**
```
✓ Coverage report shows >= 80%
✓ All new functions have tests
✓ Edge cases included
✓ All tests pass
```

---

### Standard 3: Code Quality

**Requirement:**
- Follows project style guide
- No code smells
- Proper error handling
- Clear variable/function names

**Verification:**
```
✓ Linter passes
✓ No complex functions (cyclomatic complexity < 10)
✓ Try-catch blocks for error-prone operations
✓ Descriptive names (no x, y, temp, etc.)
```

---

### Standard 4: Documentation

**Requirement:**
- Public APIs documented
- Complex logic explained
- README updated if needed
- Examples provided

**Verification:**
```
✓ All exported functions have JSDoc/docstrings
✓ Complex algorithms have explanatory comments
✓ README reflects new features
✓ Usage examples included
```

---

### Standard 5: Security

**Requirement:**
- No exposed secrets
- Input validation
- Output sanitization
- Secure defaults

**Verification:**
```
✓ No API keys, passwords in code
✓ User input validated
✓ SQL injection prevention
✓ XSS prevention
✓ HTTPS/secure connections
```

---

## Token Optimization Rules

### Optimization Rule 1: Progressive Disclosure

**Principle:** Start with minimal info, expand only when needed.

**Application:**
```
Step 1: Run /intel compact (2-3k tokens)
Step 2: Review output - is it sufficient?
  YES → Proceed
  NO → Run /intel standard (8-10k tokens)
Step 3: Still need more?
  YES → Run /intel extended (15-20k tokens)
  NO → Proceed
```

---

### Optimization Rule 2: Scope Intelligence to Relevant Areas

**Principle:** Don't analyze entire codebase if only working on small area.

**Application:**
```bash
# Instead of:
❌ /intel standard

# Scope to relevant directory:
✅ /intel standard src/auth
```

**Savings:** 50-70% tokens on large codebases

---

### Optimization Rule 3: Cache and Reuse Analysis

**Principle:** If intelligence already exists, reuse it.

**Application:**
```
Check if /workflow/intel/shared-context.md exists:
  YES → Reuse existing analysis
  NO → Run new analysis
```

---

### Optimization Rule 4: Load Only What's Needed

**Principle:** Don't load files unless required for task.

**Application:**
```
Agent task: "Review auth module"

Load:
✓ @workflow/intel/shared-context.md (overview)
✓ @src/auth/ (specific scope)

Don't load:
✗ @src/database/ (not relevant)
✗ @src/frontend/ (not relevant)
✗ Full test files (not needed for review)
```

---

## Anti-Patterns (Things to NEVER Do)

### Anti-Pattern 1: Reading PROJECT_INDEX.json Directly

**Why wrong:** Large file (100k+ tokens), not human-readable

**Instead:** Use `/intel` commands or `code-intel.mjs` CLI

---

### Anti-Pattern 2: Sequential Agent Launches When Parallel Possible

**Why wrong:** 3x slower execution time

**Instead:** Single message with multiple Task calls

---

### Anti-Pattern 3: Re-running Intelligence Analysis

**Why wrong:** Wastes 8-20k tokens

**Instead:** Load shared-context.md via `@` reference

---

### Anti-Pattern 4: Reading Full Source Files

**Why wrong:** Wastes thousands of tokens

**Instead:** Use intelligence summaries and specific excerpts

---

### Anti-Pattern 5: Skipping Quality Gates

**Why wrong:** Produces low-quality output, creates technical debt

**Instead:** Validate at each module transition

---

### Anti-Pattern 6: Using Placeholders

**Why wrong:** Incomplete deliverable, requires rework

**Instead:** Complete all implementations fully

---

### Anti-Pattern 7: Ignoring Errors and Moving On

**Why wrong:** Accumulates blockers, leads to failure

**Instead:** Fix errors immediately or document blockers

---

### Anti-Pattern 8: Creating Agents Without Context Packages

**Why wrong:** Agents don't know what to do

**Instead:** Always create detailed context packages

---

### Anti-Pattern 9: Forgetting to Update Session State

**Why wrong:** Lose track of progress, can't resume

**Instead:** Update todos, workbook, events in real-time

---

### Anti-Pattern 10: Batch Completing Todos

**Why wrong:** No granular progress tracking

**Instead:** Mark each todo complete immediately after finishing

---

## Appendix: Rules Quick Reference

### File-Based Communication
- ✓ Agents communicate only through files
- ✓ Context packages in `/workflow/packages/`
- ✓ Results in `/workflow/outputs/`
- ✓ Signals via `_COMPLETE` files

### Intelligence
- ✓ Run `/intel` ONCE per workflow
- ✓ Share via `@workflow/intel/shared-context.md`
- ✓ Use appropriate preset (compact/standard/extended)
- ✓ Scope to relevant areas

### Parallel Execution
- ✓ Single message with multiple Task calls
- ✓ Identify independent agents
- ✓ Respect dependencies

### Token Optimization
- ✓ Use `@` references for files
- ✓ Progressive disclosure
- ✓ Load only what's needed
- ✓ Never read PROJECT_INDEX.json directly

### Session Management
- ✓ Unique session ID
- ✓ Update state in real-time
- ✓ Track todos, workbook, events
- ✓ Clean up responsibly

### Code Quality
- ✓ Write tests with code
- ✓ Follow project patterns
- ✓ Document appropriately
- ✓ No placeholders

### Error Handling
- ✓ Interpret errors
- ✓ Try alternatives
- ✓ Log errors properly
- ✓ Don't get stuck

### Quality Gates
- ✓ Validate at each module
- ✓ Check requirements coverage
- ✓ Verify tests pass
- ✓ Review before delivery

---

**Rules Version:** 1.0.0
**Last Updated:** 2025-10-12
**Related Documents:**
- @ops/claude-process.md
- @analysis/intelligence-system-tot.md
- @.claude/ORCHESTRATOR_SELECTION_GUIDE.md
