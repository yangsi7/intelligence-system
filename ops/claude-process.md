# Claude Process: Multi-Agent Workflow Orchestration

**Version:** 1.0.0
**Last Updated:** 2025-10-12
**Purpose:** Standardized process for multi-agent task execution in the Ultimate Intelligence System

---

## Overview

This document defines the standardized workflow process adapted from Manus-inspired agentic principles for use with the multi-agent intelligence orchestration framework. The process ensures consistent, high-quality execution across all task types while optimizing for token efficiency and parallel execution.

---

## Core Principles

1. **Research First, Act Later** - Never implement without understanding context
2. **Intelligence Gathered Once** - Share analysis across all agents via file references
3. **File-Based Communication** - Agents communicate only through structured files
4. **Parallel Execution** - Maximize concurrency while respecting dependencies
5. **Quality Gates** - Validate before progressing to next phase
6. **Token Optimization** - Use `@` references, avoid duplicate analysis
7. **Complete Outputs** - Never use placeholders or incomplete sections
8. **Audit Trail** - Document every significant decision and action

---

## Process Modules

The workflow consists of eight sequential modules, each with specific inputs, outputs, and quality gates. Modules can be executed by the main agent or delegated to specialized subagents through orchestrators.

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Context  │───▶│ Analysis │───▶│ Research │───▶│Brainstorm│
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                       │
                ┌──────────┐    ┌──────────┐    ┌────▼─────┐
                │ Deliver  │◀───│  Review  │◀───│ Planning │
                └──────────┘    └──────────┘    └────┬─────┘
                                                     │
                                              ┌──────▼───────┐
                                              │  Execution   │
                                              └──────────────┘
```

---

## Module 1: Context Module

### Purpose
Understand user objectives, gather initial context, and restate goals clearly before any analysis or implementation.

### Responsibilities
- Parse user request and extract core objectives
- Identify deliverables and success criteria
- Gather context from attachments, repositories, and CLAUDE.md
- Determine task classification (novel / standard / analysis-heavy)
- Select appropriate orchestrator pattern

### Inputs
- User request (natural language)
- Attached files, images, or URLs
- @CLAUDE.md (project memory)
- @~/.claude/CLAUDE.md (user memory)
- Session history (if resuming)

### Process

1. **Restate User Goals**
   ```
   Original Request: "Add password reset functionality"

   Restated Goals:
   - Implement secure password reset flow
   - Include email verification
   - Follow existing authentication patterns
   - Add comprehensive tests
   ```

2. **Classify Task Type**
   ```
   Decision Tree:
   ┌─────────────────────┐
   │ Is task novel or    │
   │ domain-specific?    │
   └─────┬───────────────┘
         │
    ┌────┴────┐
   YES       NO
    │         │
   META   ┌───▼────────┐
          │ Need deep  │
          │ analysis?  │
          └──┬─────────┘
         ┌───┴───┐
        YES     NO
         │       │
    INTEGRATED NORMAL
   ```

3. **Create Session Structure**
   ```bash
   mkdir -p workflow/{planning,intel,packages,outputs,final,errors}
   mkdir -p session/{planning,todos,workbook,events}
   ```

4. **Initialize Session Files**
   - `session/planning-<sessionId>.json` (from template)
   - `session/todo-<sessionId>.json` (from template)
   - `session/workbook-<sessionId>.json` (from template)
   - `session/events-<sessionId>.json` (from template)

5. **Write Planning Document**
   ```markdown
   # Task Planning: <Task Name>

   ## Session Info
   - Session ID: <uuid>
   - Timestamp: <ISO-8601>
   - Orchestrator: <meta|normal|integrated>

   ## User Goals (Restated)
   <Clear restatement in own words>

   ## Deliverables
   1. ...
   2. ...

   ## Success Criteria
   - [ ] ...
   - [ ] ...

   ## Task Classification
   Type: <novel|standard|analysis-heavy>
   Complexity: <low|medium|high>
   Intelligence Needed: <compact|standard|extended>
   ```

### Outputs
- `workflow/planning/orchestration_plan.md` - Overall strategy
- `workflow/planning/requirements.md` - User requirements
- `session/planning-<sessionId>.json` - Session plan state
- Orchestrator selection decision

### Quality Gate
✓ Goals clearly restated and understood
✓ Deliverables identified
✓ Success criteria defined
✓ Orchestrator selected
✓ Session files initialized

**Gate Keeper:** Main agent reviews context summary before proceeding

---

## Module 2: Analysis Module

### Purpose
Build a hierarchical map of entities, relationships, and dependencies using intelligence toolkit and tree-of-thought reasoning.

### Responsibilities
- Run code intelligence analysis (`/intel`)
- Map system architecture relevant to task
- Identify key files, modules, and dependencies
- Detect patterns, hotspots, and potential issues
- Create visual representations (ASCII diagrams)

### Inputs
- `@workflow/planning/orchestration_plan.md`
- `@workflow/planning/requirements.md`
- PROJECT_INDEX.json (via intelligence CLI)

### Process

1. **Select Intelligence Preset**
   ```
   Based on task complexity:
   - Simple task (bug fix, small feature) → compact (2-3k tokens)
   - Medium task (feature, refactor) → standard (8-10k tokens)
   - Complex task (architecture, audit) → extended (15-20k tokens)
   ```

2. **Run Intelligence Analysis**
   ```bash
   # For integrated orchestrator
   /intel <preset> <scope>

   # Or directly
   node .claude/improved_intelligence/code-intel.mjs preset <preset>
   ```

3. **Write Shared Context**
   ```bash
   # Output goes to shared location
   /intel standard src/ > workflow/intel/shared-context.md
   ```

4. **Create Tree-of-Thought Map**
   ```markdown
   # System Architecture Map

   ## Components
   <List relevant modules, files, functions>

   ## Relationships
   <Dependency graph, call paths>

   ## Hotspots
   <High-centrality modules that need attention>

   ## Patterns
   <Code smells, circular dependencies, dead code>
   ```

5. **Document in Workbook**
   ```json
   {
     "sessionId": "<uuid>",
     "entries": [{
       "type": "diagram",
       "title": "System Architecture",
       "content": "<ASCII diagram>",
       "timestamp": "<ISO-8601>"
     }]
   }
   ```

### Outputs
- `workflow/intel/shared-context.md` - Intelligence report (SHARED by all agents)
- `workflow/intel/quick-reference.md` - How to use `/intel` commands
- `session/workbook-<sessionId>.json` - Architecture diagrams
- Analysis summary in event stream

### Quality Gate
✓ Intelligence analysis complete
✓ Shared context file created
✓ Key entities and relationships mapped
✓ Hotspots identified
✓ No critical blockers discovered

**Gate Keeper:** Review intelligence report for completeness before proceeding

---

## Module 3: Research Module

### Purpose
Collect evidence from authoritative sources, synthesize findings, and validate assumptions before implementation.

### Responsibilities
- Search for best practices and patterns
- Query documentation and examples
- Cross-validate information from multiple sources
- Synthesize research into actionable insights
- Document findings with citations

### Inputs
- `@workflow/planning/requirements.md`
- `@workflow/intel/shared-context.md`
- External sources (web, documentation, MCP tools)

### Process

1. **Identify Research Needs**
   ```
   Questions to answer:
   - What are best practices for this feature?
   - Are there existing patterns in the codebase?
   - What are common pitfalls to avoid?
   - What external libraries/tools should we use?
   ```

2. **Execute Research** (if needed - may skip for simple tasks)
   ```
   Methods:
   - /search content "<pattern>" (internal)
   - WebSearch for best practices
   - MCP tools for documentation (context7, ref)
   - Browser tool for detailed articles
   ```

3. **Validate Information**
   ```
   Priority hierarchy:
   1. Direct code analysis (Read tool)
   2. Internal documentation (CLAUDE.md, READMEs)
   3. Official library docs (MCP tools)
   4. Validated web sources
   5. Internal knowledge (use sparingly)
   ```

4. **Synthesize Findings**
   ```markdown
   # Research Summary

   ## Key Findings
   1. <Finding with source citation>
   2. <Finding with source citation>

   ## Best Practices
   - <Practice> [Source: <URL or file>]
   - <Practice> [Source: <URL or file>]

   ## Recommended Approach
   <Synthesis of research into concrete recommendation>

   ## Risks and Mitigations
   - Risk: <description>
     Mitigation: <strategy>
   ```

5. **Update Workbook**
   ```json
   {
     "entries": [{
       "type": "insight",
       "title": "Research Findings",
       "content": "Key insights...",
       "tags": ["research", "best-practices"]
     }]
   }
   ```

### Outputs
- `workflow/outputs/research_report.md` (if research agent used)
- `session/workbook-<sessionId>.json` (research insights)
- Updated event stream with research findings

### Quality Gate
✓ Research questions answered
✓ Best practices identified
✓ Risks assessed
✓ Approach validated
✓ Sources cited

**Gate Keeper:** Researcher agent (if used) or main agent validation

---

## Module 4: Brainstorm Module

### Purpose
Generate potential solutions, evaluate alternatives, and rank approaches by feasibility and impact.

### Responsibilities
- Generate multiple solution approaches
- Evaluate pros and cons of each approach
- Score solutions on relevant dimensions
- Select recommended approach
- Document decision rationale

### Inputs
- `@workflow/intel/shared-context.md`
- `@workflow/outputs/research_report.md`
- `@workflow/planning/requirements.md`

### Process

1. **Generate Approaches**
   ```markdown
   # Solution Brainstorming

   ## Approach A: <Name>
   Description: <How it works>
   Pros:
   - <Advantage>
   - <Advantage>
   Cons:
   - <Disadvantage>
   - <Disadvantage>
   Complexity: <low|medium|high>
   Impact: <low|medium|high>

   ## Approach B: <Name>
   ...

   ## Approach C: <Name>
   ...
   ```

2. **Evaluate and Score**
   ```
   Scoring Dimensions:
   - Feasibility (1-10)
   - Maintainability (1-10)
   - Performance (1-10)
   - Security (1-10)
   - Alignment with existing patterns (1-10)
   ```

3. **Rank and Select**
   ```
   Rankings:
   1. Approach B (Score: 45/50)
   2. Approach A (Score: 38/50)
   3. Approach C (Score: 32/50)

   Recommendation: Approach B
   Rationale: <Why this is the best choice>
   ```

4. **Document in Workbook**
   ```json
   {
     "entries": [{
       "type": "brainstorm",
       "title": "Solution Approaches",
       "content": "Evaluated 3 approaches...",
       "tags": ["brainstorm", "decision"]
     }, {
       "type": "decision",
       "title": "Selected Approach B",
       "content": "Rationale: ...",
       "tags": ["decision", "architecture"]
     }]
   }
   ```

### Outputs
- `session/workbook-<sessionId>.json` (brainstorming + decision)
- `workflow/planning/approach-decision.md`
- Updated event stream

### Quality Gate
✓ Multiple approaches considered
✓ Trade-offs evaluated
✓ Decision documented with rationale
✓ Approach aligns with requirements
✓ Risks identified and acceptable

**Gate Keeper:** Main agent or orchestrator reviews decision before proceeding

---

## Module 5: Planning Module

### Purpose
Create detailed implementation plan with subtasks, dependencies, agent assignments, and success criteria.

### Responsibilities
- Decompose task into actionable subtasks
- Identify dependencies between subtasks
- Assign subtasks to agents (Wave 1, 2, 3, 4)
- Define success criteria for each subtask
- Estimate token budget allocation

### Inputs
- `@workflow/planning/orchestration_plan.md`
- `@workflow/planning/approach-decision.md`
- `@workflow/intel/shared-context.md`

### Process

1. **Task Decomposition**
   ```markdown
   # Implementation Plan

   ## Overview
   Task: <High-level description>
   Approach: <Selected approach>
   Estimated Duration: <time>
   Estimated Token Budget: <tokens>

   ## Subtasks

   ### Subtask 1: <Name>
   Description: <What needs to be done>
   Agent: <researcher|implementor|reviewer|tester|postflight>
   Dependencies: <None|Subtask X>
   Wave: <1|2|3|4>
   Success Criteria:
   - [ ] <Criterion>
   - [ ] <Criterion>
   Files in Scope:
   - <file1>
   - <file2>
   Estimated Tokens: <number>

   ### Subtask 2: <Name>
   ...
   ```

2. **Create Dependency Graph**
   ```json
   {
     "tasks": {
       "task_1": {
         "name": "Research authentication patterns",
         "agent": "researcher",
         "dependencies": [],
         "wave": 1
       },
       "task_2": {
         "name": "Implement password reset",
         "agent": "implementor",
         "dependencies": ["task_1"],
         "wave": 2
       },
       "task_3": {
         "name": "Review implementation",
         "agent": "reviewer",
         "dependencies": ["task_2"],
         "wave": 3
       },
       "task_4": {
         "name": "Create tests",
         "agent": "tester",
         "dependencies": ["task_2"],
         "wave": 3
       },
       "task_5": {
         "name": "Final validation",
         "agent": "postflight",
         "dependencies": ["task_3", "task_4"],
         "wave": 4
       }
     }
   }
   ```

3. **Identify Parallel Execution Opportunities**
   ```
   Wave 1 (parallel): task_1
   Wave 2 (sequential): task_2 (depends on task_1)
   Wave 3 (parallel): task_3, task_4 (both depend on task_2)
   Wave 4 (sequential): task_5 (depends on task_3, task_4)
   ```

4. **Allocate Token Budget**
   ```
   Total Budget: 200k tokens

   Allocation:
   - Orchestrator setup: 5k (2.5%)
   - Intelligence (shared): 8k (4%)
   - Task 1 (Researcher): 25k (12.5%)
   - Task 2 (Implementor): 50k (25%)
   - Task 3 (Reviewer): 20k (10%)
   - Task 4 (Tester): 25k (12.5%)
   - Task 5 (Postflight): 15k (7.5%)
   - Integration: 10k (5%)
   - Buffer: 42k (21%)
   ```

5. **Update Session Planning**
   ```json
   {
     "sessionId": "<uuid>",
     "phases": [
       {
         "name": "Context",
         "status": "completed"
       },
       {
         "name": "Analysis",
         "status": "completed"
       },
       {
         "name": "Research",
         "status": "completed"
       },
       {
         "name": "Brainstorm",
         "status": "completed"
       },
       {
         "name": "Planning",
         "status": "in_progress"
       },
       {
         "name": "Execution",
         "status": "pending"
       }
     ],
     "tasks": {
       "task_1": {...},
       "task_2": {...}
     }
   }
   ```

6. **Create TODO Items**
   ```json
   {
     "sessionId": "<uuid>",
     "todos": [
       {
         "id": "uuid-1",
         "content": "Research authentication patterns",
         "activeForm": "Researching authentication patterns",
         "status": "pending",
         "assignedAgent": "researcher",
         "dependencies": []
       },
       {
         "id": "uuid-2",
         "content": "Implement password reset endpoint",
         "activeForm": "Implementing password reset endpoint",
         "status": "pending",
         "assignedAgent": "implementor",
         "dependencies": ["uuid-1"]
       }
     ]
   }
   ```

### Outputs
- `workflow/planning/implementation_plan.md` - Detailed plan
- `workflow/planning/dependency_graph.json` - Task dependencies
- `session/planning-<sessionId>.json` - Updated session plan
- `session/todo-<sessionId>.json` - Task checklist
- Updated event stream

### Quality Gate
✓ All subtasks defined with clear success criteria
✓ Dependencies identified and validated
✓ Agent assignments appropriate
✓ Token budget allocated and within limits
✓ Plan reviewed by orchestrator or main agent

**Gate Keeper:** Orchestrator or main agent reviews plan completeness

---

## Module 6: Execution Module

### Purpose
Execute implementation plan by dispatching agents, monitoring progress, and handling failures.

### Responsibilities
- Create agent context packages
- Dispatch agents in waves (respecting dependencies)
- Monitor for completion signals
- Handle agent failures and timeouts
- Track token usage
- Update todos and workbook in real-time

### Inputs
- `@workflow/planning/implementation_plan.md`
- `@workflow/planning/dependency_graph.json`
- `@workflow/intel/shared-context.md`
- `session/todo-<sessionId>.json`

### Process

1. **Create Context Packages**

   For each agent, create `/workflow/packages/agent_{ID}_context.md`:

   ```markdown
   # Agent Context: {AgentType} {ID}

   ## Mission
   {Specific task for this agent}

   ## Scope
   Files/directories to focus on:
   - {file1}
   - {file2}

   ## Inputs (use @ notation for zero-token loading)
   Required context:
   - @workflow/intel/shared-context.md (codebase intelligence)
   - @workflow/intel/quick-reference.md (how to use /intel)
   - @workflow/outputs/agent_X_result.md (prior agent results, if applicable)

   ## Tools Available
   - {List of tools this agent needs}

   ## Intelligence Commands Available
   Recommended /intel commands:
   - /intel trace <file> (understand dependencies)
   - /intel analyze-patterns --scope {scope}

   ## Success Criteria
   This agent succeeds when:
   - [ ] {Deliverable produced}
   - [ ] {Quality criteria met}
   - [ ] {Tests pass (if applicable)}

   ## Output Files
   Write results to:
   - /workflow/outputs/agent_{ID}_result.md
   - /workflow/outputs/agent_{ID}_COMPLETE (signal file)

   ## Timeout
   {Agent-specific timeout, default: 30 minutes}

   ## Session Context
   Update session files:
   - Mark todos complete: session/todo-<sessionId>.json
   - Add insights to: session/workbook-<sessionId>.json
   - Log events to: session/events-<sessionId>.json
   ```

2. **Dispatch Agents by Wave**

   **Wave 1 (Parallel)**
   ```
   # CRITICAL: Single message with multiple Task calls!
   Task({ subagent_type: "researcher", description: "Research auth patterns", prompt: "@workflow/packages/agent_1_context.md" })
   ```

   Wait for completion signal:
   ```bash
   while [ ! -f workflow/outputs/agent_1_COMPLETE ]; do
     sleep 10
   done
   ```

   **Wave 2 (Sequential - depends on Wave 1)**
   ```
   # Only launch after Wave 1 complete
   Task({ subagent_type: "implementor", description: "Implement password reset", prompt: "@workflow/packages/agent_2_context.md" })
   ```

   **Wave 3 (Parallel - both depend on Wave 2)**
   ```
   # Single message, multiple Task calls
   Task({ subagent_type: "reviewer", description: "Review implementation", prompt: "@workflow/packages/agent_3_context.md" })
   Task({ subagent_type: "tester", description: "Test implementation", prompt: "@workflow/packages/agent_4_context.md" })
   ```

   **Wave 4 (Sequential - depends on Wave 3)**
   ```
   Task({ subagent_type: "postflight", description: "Final validation", prompt: "@workflow/packages/agent_5_context.md" })
   ```

3. **Monitor Progress**

   Check completion signals:
   ```bash
   # List completed agents
   ls -1 workflow/outputs/*_COMPLETE

   # Check progress
   cat session/todo-<sessionId>.json | jq '.todos[] | select(.status=="completed") | .content'
   ```

   Update monitoring file:
   ```json
   {
     "sessionId": "<uuid>",
     "timestamp": "<ISO-8601>",
     "agents": {
       "agent_1": {
         "type": "researcher",
         "status": "completed",
         "startTime": "<ISO-8601>",
         "endTime": "<ISO-8601>",
         "tokensUsed": 20000
       },
       "agent_2": {
         "type": "implementor",
         "status": "in_progress",
         "startTime": "<ISO-8601>"
       }
     }
   }
   ```

4. **Handle Failures**

   If agent fails (timeout or error):

   ```
   1. Check for partial output in workflow/outputs/agent_{ID}_result.md
   2. Log error to workflow/errors/agent_{ID}_error.md
   3. Update todo status to "failed"
   4. Decision:
      - Retry once with extended timeout
      - Skip agent and continue
      - Abort entire workflow
   5. Default: Retry once
   ```

5. **Update Session State**

   After each agent completion:

   ```json
   // Update todos
   {
     "todos": [{
       "id": "uuid-1",
       "status": "completed",
       "completedAt": "<ISO-8601>"
     }]
   }

   // Add events
   {
     "entries": [{
       "type": "event",
       "timestamp": "<ISO-8601>",
       "event": "agent_completed",
       "agentId": "agent_1",
       "agentType": "researcher",
       "success": true
     }]
   }
   ```

### Outputs
- `/workflow/outputs/agent_*_result.md` - Agent results
- `/workflow/outputs/agent_*_COMPLETE` - Completion signals
- `session/todo-<sessionId>.json` - Updated todos
- `session/workbook-<sessionId>.json` - Insights and notes
- `session/events-<sessionId>.json` - Event log
- `/workflow/monitoring/progress.json` - Real-time progress

### Quality Gate (per agent)
✓ Agent context package complete and accurate
✓ Agent executed successfully
✓ Output files created
✓ Completion signal present
✓ Success criteria met
✓ Todo marked complete
✓ No critical errors

**Gate Keeper:** Orchestrator validates each agent completion before launching dependent agents

---

## Module 7: Review Module

### Purpose
Critically evaluate outputs using expert perspectives, identify issues, and ensure quality standards are met.

### Responsibilities
- Review all agent outputs for completeness
- Validate against requirements and success criteria
- Check for conflicts or inconsistencies
- Identify critical issues requiring remediation
- Document review findings
- Decide: approve, request changes, or reject

### Inputs
- `@workflow/outputs/agent_*_result.md` (all agent outputs)
- `@workflow/planning/requirements.md`
- `@workflow/planning/orchestration_plan.md`
- `session/todo-<sessionId>.json`

### Process

1. **Collect All Outputs**
   ```bash
   # List all result files
   ls -1 workflow/outputs/*_result.md

   # Verify all expected agents completed
   expected_agents=("agent_1" "agent_2" "agent_3" "agent_4" "agent_5")
   for agent in "${expected_agents[@]}"; do
     if [ ! -f "workflow/outputs/${agent}_COMPLETE" ]; then
       echo "Warning: $agent did not complete"
     fi
   done
   ```

2. **Validate Against Requirements**
   ```markdown
   # Review Checklist

   ## Requirements Coverage
   - [ ] Requirement 1: Password reset endpoint implemented
     Status: ✓ Covered by agent_2
     Evidence: /workflow/outputs/agent_2_result.md:45-120

   - [ ] Requirement 2: Email verification included
     Status: ✓ Covered by agent_2
     Evidence: /workflow/outputs/agent_2_result.md:121-180

   - [ ] Requirement 3: Tests created
     Status: ✓ Covered by agent_4
     Evidence: /workflow/outputs/agent_4_result.md

   ## Success Criteria
   - [ ] All tests passing: ✓ (agent_4 reports 100% pass rate)
   - [ ] Code review approved: ✓ (agent_3 approved with minor suggestions)
   - [ ] Documentation updated: ✓ (agent_2 updated README)
   ```

3. **Check for Conflicts**
   ```
   Review for:
   - Conflicting implementations between agents
   - Dependency issues
   - Integration problems
   - Contradictory recommendations
   ```

4. **Expert Panel Critique** (Virtual)
   ```markdown
   # Virtual Expert Panel Review

   ## Requirements Expert
   Assessment: All requirements met. Implementation aligns with spec.
   Score: 9/10

   ## Architecture Expert
   Assessment: Clean design. Follows existing patterns. Minor coupling issue in auth module.
   Recommendations:
   - Extract token validation to separate service
   Score: 8/10

   ## Security Expert
   Assessment: Good security practices. Password reset tokens properly randomized. Rate limiting in place.
   Concerns:
   - Token expiration should be configurable
   Score: 9/10

   ## Performance Expert
   Assessment: Efficient implementation. No N+1 queries. Proper indexing.
   Score: 9/10

   ## Testing Expert
   Assessment: Comprehensive test coverage. Edge cases covered. Integration tests included.
   Score: 10/10

   ## Overall Score: 45/50 (90%)
   Recommendation: APPROVED with minor improvements
   ```

5. **Document Critical Issues**
   ```markdown
   # Critical Issues (Must Fix)
   None.

   # Important Issues (Should Fix)
   1. Extract token validation to separate service (agent_2)
   2. Make token expiration configurable (agent_2)

   # Suggestions (Nice to Have)
   1. Add logging for security events
   2. Consider adding metrics
   ```

6. **Update Workbook**
   ```json
   {
     "entries": [{
       "type": "insight",
       "title": "Review Findings",
       "content": "Overall excellent implementation. 2 important improvements identified.",
       "tags": ["review", "quality"]
     }]
   }
   ```

### Outputs
- `workflow/final/review_report.md` - Comprehensive review
- `workflow/final/issues.md` - Issues requiring attention
- `session/workbook-<sessionId>.json` - Review insights
- Updated event stream

### Quality Gate
✓ All agent outputs reviewed
✓ Requirements coverage validated
✓ Conflicts identified and resolved
✓ Critical issues documented
✓ Review decision made (approve/request changes/reject)
✓ If issues found, remediation plan created

**Gate Keeper:** Main agent or postflight agent validates review completeness

---

## Module 8: Delivery Module

### Purpose
Aggregate all outputs, integrate changes, validate final deliverable, and produce user-facing results.

### Responsibilities
- Aggregate all agent outputs into unified solution
- Apply approved changes to codebase
- Update documentation
- Run final validation (postflight)
- Generate completion report
- Clean up temporary files
- Archive session artifacts

### Inputs
- All `@workflow/outputs/agent_*_result.md`
- `@workflow/final/review_report.md`
- `@workflow/planning/requirements.md`
- All session files

### Process

1. **Aggregate Outputs**
   ```bash
   # Combine all agent results
   cat workflow/outputs/agent_*_result.md > workflow/integration/raw_combined.md
   ```

   Create integration summary:
   ```markdown
   # Integrated Solution

   ## Summary
   Task: Add password reset functionality
   Status: Completed
   Overall Quality: 90% (45/50)

   ## Agent Contributions

   ### Agent 1 (Researcher)
   - Researched password reset best practices
   - Identified security requirements
   - Recommended implementation approach
   Output: @workflow/outputs/agent_1_result.md

   ### Agent 2 (Implementor)
   - Implemented password reset endpoint
   - Added email verification
   - Updated authentication module
   Output: @workflow/outputs/agent_2_result.md
   Files Modified:
   - src/auth/password-reset.ts (created)
   - src/auth/auth.controller.ts (modified)
   - src/email/templates/password-reset.html (created)

   ### Agent 3 (Reviewer)
   - Code review completed
   - Approved with minor suggestions
   - Identified 2 improvements
   Output: @workflow/outputs/agent_3_result.md

   ### Agent 4 (Tester)
   - Created comprehensive test suite
   - 100% test pass rate
   - Coverage: 98%
   Output: @workflow/outputs/agent_4_result.md
   Files Created:
   - tests/auth/password-reset.spec.ts
   - tests/integration/password-reset-flow.spec.ts

   ### Agent 5 (Postflight)
   - Final validation passed
   - All acceptance criteria met
   - Ready for deployment
   Output: @workflow/outputs/agent_5_result.md

   ## Changes Applied
   Files Created: 4
   Files Modified: 2
   Tests Added: 12
   Documentation Updated: Yes

   ## Recommendations for Next Steps
   1. Deploy to staging environment
   2. Conduct user acceptance testing
   3. Monitor for errors after production deployment
   ```

2. **Apply Final Changes** (if not already done by implementor)
   ```
   Review and apply any remaining changes
   Update PROJECT_INDEX.json if significant changes made
   ```

3. **Run Final Validation**
   ```bash
   # Already done by postflight agent, verify:
   [ -f workflow/outputs/agent_5_COMPLETE ] && echo "Validation passed"
   ```

4. **Generate Completion Report**
   ```markdown
   # Task Completion Report

   ## Task Overview
   - Task: Add password reset functionality
   - Session ID: <uuid>
   - Started: <timestamp>
   - Completed: <timestamp>
   - Duration: 42 minutes
   - Tokens Used: 158k / 200k (79%)

   ## Deliverables
   ✓ Password reset endpoint implemented
   ✓ Email verification included
   ✓ Comprehensive tests created
   ✓ Documentation updated
   ✓ Code review approved

   ## Quality Metrics
   - Test Coverage: 98%
   - Code Review Score: 8/10
   - Security Review Score: 9/10
   - Overall Quality: 90%

   ## Files Changed
   Created:
   - src/auth/password-reset.ts
   - src/email/templates/password-reset.html
   - tests/auth/password-reset.spec.ts
   - tests/integration/password-reset-flow.spec.ts

   Modified:
   - src/auth/auth.controller.ts
   - docs/API.md

   ## Known Issues
   None critical.
   2 improvements suggested (see @workflow/final/issues.md)

   ## Next Steps
   1. Deploy to staging
   2. Conduct UAT
   3. Monitor production deployment

   ## Session Artifacts
   - Planning: @workflow/planning/
   - Intelligence: @workflow/intel/shared-context.md
   - Agent Outputs: @workflow/outputs/
   - Final Solution: @workflow/final/integrated-solution.md
   - Session State: @session/planning-<sessionId>.json
   - Todo History: @session/todo-<sessionId>.json
   - Workbook: @session/workbook-<sessionId>.json
   - Events: @session/events-<sessionId>.json
   ```

5. **Mark All Todos Complete**
   ```json
   {
     "sessionId": "<uuid>",
     "todos": [
       // All todos marked "completed"
     ],
     "summary": {
       "total": 5,
       "completed": 5,
       "failed": 0
     }
   }
   ```

6. **Clean Up Temporary Files**
   ```bash
   # Remove temporary context packages
   rm -rf workflow/packages/*

   # Remove completion signals
   rm -f workflow/outputs/*_COMPLETE

   # Keep audit trail
   # - workflow/planning/ (keep)
   # - workflow/intel/ (keep)
   # - workflow/outputs/ (keep result files)
   # - workflow/final/ (keep)
   # - session/ (keep all)
   ```

7. **Archive Session** (optional)
   ```bash
   # Create session archive
   tar -czf archives/session-<sessionId>.tar.gz \
     workflow/ \
     session/
   ```

8. **Create Final Signal**
   ```bash
   touch workflow/final/ORCHESTRATION_COMPLETE
   ```

### Outputs
- `workflow/final/integrated-solution.md` - Complete solution
- `workflow/final/completion-report.md` - Completion report
- `workflow/final/ORCHESTRATION_COMPLETE` - Completion signal
- All session files (preserved)
- User-facing summary message

### Quality Gate
✓ All agent outputs integrated
✓ Changes applied successfully
✓ Final validation passed
✓ All todos completed
✓ Completion report generated
✓ Temporary files cleaned up
✓ Audit trail preserved

**Gate Keeper:** Main agent validates final deliverable before presenting to user

---

## Integration with Orchestrator Patterns

### Meta Orchestrator Flow

```
User Request (Novel/Domain-Specific)
    │
    ▼
Context Module (Main Agent)
    │
    ▼
Meta Orchestrator Invoked
    │
    ├─→ Analysis Module (Creates custom agents)
    ├─→ Research Module (Gathers domain knowledge)
    ├─→ Brainstorm Module (Evaluates approaches)
    ├─→ Planning Module (Defines custom workflow)
    │
    ▼
Execution Module (Dispatches custom agents)
    │
    ▼
Review Module (Validates with domain experts)
    │
    ▼
Delivery Module (Produces specialized deliverable)
```

### Normal Orchestrator Flow

```
User Request (Standard Task)
    │
    ▼
Context Module (Main Agent)
    │
    ▼
Normal Orchestrator Invoked
    │
    ├─→ Analysis Module (Runs /intel standard)
    ├─→ [Skip Research for simple tasks]
    ├─→ [Skip Brainstorm - use standard approach]
    ├─→ Planning Module (Uses fixed agent pipeline)
    │
    ▼
Execution Module (Wave-based dispatch)
    │
    ▼
Review Module (Automated quality checks)
    │
    ▼
Delivery Module (Standard deliverable format)
```

### Integrated Orchestrator Flow

```
User Request (Analysis-Heavy Task)
    │
    ▼
Context Module (Main Agent)
    │
    ▼
Integrated Orchestrator Invoked
    │
    ├─→ Analysis Module (Multi-pass intelligence)
    │     │
    │     ├─→ /intel compact (Overview)
    │     ├─→ /intel hotspots (Identify issues)
    │     ├─→ /intel patterns (Code smells)
    │     ├─→ /intel graph (Dependencies)
    │     └─→ Custom workflows (Domain-specific)
    │
    ├─→ Intelligence Aggregation (Synthesize findings)
    ├─→ Research Module (External sources)
    ├─→ Brainstorm Module (Solution approaches)
    ├─→ Planning Module (Intelligence-informed plan)
    │
    ▼
Execution Module (Intelligence-rich context)
    │
    ▼
Review Module (Deep architectural review)
    │
    ▼
Delivery Module (Comprehensive report + solution)
```

---

## Shared Resources Management

### Session Files

All session files use unique session ID to prevent collisions:

```
session/
├── planning-<sessionId>.json
├── todo-<sessionId>.json
├── workbook-<sessionId>.json
└── events-<sessionId>.json
```

### Access Patterns

**Main Agent:**
- Read/Write: All session files
- Create: Session structure
- Update: Planning, todos, workbook, events
- Archive: Completed sessions

**Orchestrator:**
- Read: Planning, todos
- Write: Progress updates, event log
- Update: Todo status

**Individual Agents:**
- Read: Via `@` references in context package
  - `@workflow/intel/shared-context.md`
  - `@session/planning-<sessionId>.json`
  - `@session/workbook-<sessionId>.json`
- Write: Result files, completion signals
- Optional Update: Workbook (add insights), Events (log actions)

### File Reference Protocol

**Use `@` notation for zero-token loading:**

```markdown
## Context for Agent

Load shared intelligence:
- @workflow/intel/shared-context.md

Load prior agent results:
- @workflow/outputs/agent_1_result.md

Load session context (if needed):
- @session/workbook-<sessionId>.json

Load project patterns:
- @guides/authentication-patterns.md
```

**Benefits:**
- Near-zero token cost for file references
- Agents get full context without redundant analysis
- Easy to inspect and debug
- Supports resumable workflows

---

## Quality Gates Summary

| Module | Gate Keeper | Key Validation |
|--------|-------------|----------------|
| Context | Main Agent | Goals clear, orchestrator selected |
| Analysis | Main Agent / Orchestrator | Intelligence complete, no blockers |
| Research | Researcher Agent / Main | Questions answered, sources cited |
| Brainstorm | Main Agent | Approaches evaluated, decision documented |
| Planning | Orchestrator | Plan complete, dependencies valid |
| Execution (per agent) | Orchestrator | Agent succeeded, output valid |
| Review | Main Agent / Postflight | Requirements met, quality acceptable |
| Delivery | Main Agent | Final deliverable validated |

---

## Token Optimization Checkpoints

### Checkpoint 1: After Context Module
**Check:** Are we loading unnecessary context?
**Action:** Load only what's needed for orchestrator selection

### Checkpoint 2: After Analysis Module
**Check:** Did we run appropriate intelligence preset?
**Action:** Verify preset matches task complexity

### Checkpoint 3: Before Execution Module
**Check:** Are agent context packages optimized?
**Action:** Use `@` references, include only relevant excerpts

### Checkpoint 4: During Execution Module
**Check:** Are we re-analyzing the same code?
**Action:** Ensure all agents load shared intelligence via `@`

### Checkpoint 5: After Execution Module
**Check:** Did we stay within token budget?
**Action:** Review usage, identify optimization opportunities

---

## Error Recovery Protocols

### Agent Failure

```
1. Detect: No COMPLETE signal after timeout
2. Inspect: Check partial output
3. Log: Write to /workflow/errors/agent_{ID}_error.md
4. Analyze: Determine cause
5. Decide:
   - Retry with extended timeout (default)
   - Skip agent and continue with warning
   - Abort workflow if critical
6. Document: Update events log
```

### Intelligence Failure

```
1. Detect: /intel command fails
2. Log: Error details
3. Fallback: Proceed without automated intelligence
4. Inform: Add note to planning
5. Continue: With degraded capability
6. Document: Mark in completion report
```

### Orchestrator Deadlock

```
1. Detect: Wave timeout exceeded (default: 60 min)
2. Identify: Which agents are stuck
3. Kill: Terminate stuck agents
4. Decide: Proceed with partial results OR abort
5. Default: Proceed with warning
6. Document: Mark incomplete in report
```

---

## Best Practices

1. **Always restate user goals** - Ensure mutual understanding before proceeding
2. **Run intelligence ONCE** - Share via `@` references
3. **Use file-based communication** - Never direct agent-to-agent communication
4. **Parallelize aggressively** - Single message, multiple Task calls
5. **Update session state continuously** - Todos, workbook, events in real-time
6. **Document decisions** - Capture rationale in workbook
7. **Validate at gates** - Don't skip quality checks
8. **Clean up responsibly** - Remove temporary files, preserve audit trail
9. **Monitor token usage** - Stay within budget
10. **Complete outputs only** - Never use placeholders

---

## Appendix: Process Checklist

Use this checklist to ensure all steps are followed:

- [ ] **Context Module**
  - [ ] User goals restated
  - [ ] Task classified
  - [ ] Orchestrator selected
  - [ ] Session files initialized
  - [ ] Planning document created

- [ ] **Analysis Module**
  - [ ] Intelligence preset selected
  - [ ] `/intel` analysis run
  - [ ] Shared context file created
  - [ ] Architecture mapped
  - [ ] Hotspots identified

- [ ] **Research Module** (if applicable)
  - [ ] Research questions identified
  - [ ] Information gathered
  - [ ] Sources validated
  - [ ] Findings synthesized
  - [ ] Report documented

- [ ] **Brainstorm Module**
  - [ ] Multiple approaches generated
  - [ ] Alternatives evaluated
  - [ ] Approach selected
  - [ ] Decision documented

- [ ] **Planning Module**
  - [ ] Task decomposed into subtasks
  - [ ] Dependencies identified
  - [ ] Agents assigned
  - [ ] Success criteria defined
  - [ ] Token budget allocated
  - [ ] Todos created

- [ ] **Execution Module**
  - [ ] Context packages created
  - [ ] Agents dispatched by wave
  - [ ] Progress monitored
  - [ ] Failures handled
  - [ ] Todos updated
  - [ ] All agents completed

- [ ] **Review Module**
  - [ ] All outputs collected
  - [ ] Requirements validated
  - [ ] Conflicts checked
  - [ ] Quality assessed
  - [ ] Issues documented
  - [ ] Decision made

- [ ] **Delivery Module**
  - [ ] Outputs aggregated
  - [ ] Changes applied
  - [ ] Final validation passed
  - [ ] Completion report generated
  - [ ] Todos all completed
  - [ ] Cleanup performed
  - [ ] Artifacts archived

---

**Process Version:** 1.0.0
**Last Updated:** 2025-10-12
**Related Documents:**
- @analysis/intelligence-system-tot.md
- @principles/claude-rules.md
- @.claude/ORCHESTRATOR_SELECTION_GUIDE.md
- @templates/ (session templates)
