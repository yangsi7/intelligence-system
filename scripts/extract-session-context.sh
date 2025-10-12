#!/usr/bin/env bash

# extract-session-context.sh
# Extract and format current session context from JSON files
# Usage: ./extract-session-context.sh [session-id]
# If no session-id provided, uses most recent session

set -e

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Default session directory
SESSION_DIR="${SESSION_DIR:-./session}"

# Function to print colored header
print_header() {
    echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${BLUE}$1${NC}"
    echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"
}

# Function to print section header
print_section() {
    echo -e "\n${BOLD}## $1${NC}\n"
}

# Function to print subsection
print_subsection() {
    echo -e "${BOLD}### $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check dependencies
check_dependencies() {
    if ! command -v jq &> /dev/null; then
        print_error "jq is required but not installed. Please install it first."
        echo "  macOS: brew install jq"
        echo "  Linux: apt-get install jq or yum install jq"
        exit 1
    fi
}

# Find most recent session if no ID provided
find_recent_session() {
    local latest_file
    latest_file=$(ls -t "$SESSION_DIR"/planning-*.json 2>/dev/null | head -1)

    if [ -z "$latest_file" ]; then
        print_error "No session files found in $SESSION_DIR"
        exit 1
    fi

    # Extract session ID from filename
    basename "$latest_file" | sed 's/planning-\(.*\)\.json/\1/'
}

# Validate session exists
validate_session() {
    local session_id=$1

    if [ ! -f "$SESSION_DIR/planning-$session_id.json" ]; then
        print_error "Session $session_id not found"
        echo "Available sessions:"
        ls -1 "$SESSION_DIR"/planning-*.json 2>/dev/null | sed 's/.*planning-\(.*\)\.json/  \1/' || echo "  (none)"
        exit 1
    fi
}

# Extract planning context
extract_planning() {
    local session_id=$1
    local file="$SESSION_DIR/planning-$session_id.json"

    print_section "Planning Context"

    # Task description
    local task_desc=$(jq -r '.taskDescription' "$file")
    echo "**Task:** $task_desc"
    echo ""

    # Classification
    local task_type=$(jq -r '.taskClassification.type' "$file")
    local complexity=$(jq -r '.taskClassification.complexity' "$file")
    local intel_level=$(jq -r '.taskClassification.intelligenceLevel' "$file")
    local orchestrator=$(jq -r '.orchestratorType' "$file")

    echo "**Classification:**"
    echo "- Type: $task_type"
    echo "- Complexity: $complexity"
    echo "- Intelligence Level: $intel_level"
    echo "- Orchestrator: $orchestrator"
    echo ""

    # Current phase
    local current_phase=$(jq -r '.currentPhase' "$file")
    echo "**Current Phase:** $current_phase"
    echo ""

    # Phase progress
    print_subsection "Phase Progress"
    echo ""
    jq -r '.phases[] | "- [\(if .status == "completed" then "x" else " " end)] \(.name) (\(.status))"' "$file"
    echo ""

    # Token usage
    local total_budget=$(jq -r '.tokenBudget.total' "$file")
    local tokens_used=$(jq -r '.tokenBudget.used' "$file")
    local percentage=$((tokens_used * 100 / total_budget))

    echo "**Token Budget:**"
    echo "- Used: $tokens_used / $total_budget ($percentage%)"
    echo ""

    # Requirements status
    if jq -e '.requirements | length > 0' "$file" > /dev/null 2>&1; then
        print_subsection "Requirements"
        echo ""
        jq -r '.requirements[] | "- [\(if .status == "completed" then "x" else " " end)] \(.description) (\(.priority))"' "$file"
        echo ""
    fi

    # Deliverables status
    if jq -e '.deliverables | length > 0' "$file" > /dev/null 2>&1; then
        print_subsection "Deliverables"
        echo ""
        jq -r '.deliverables[] | "- [\(if .status == "completed" then "x" else " " end)] \(.description)"' "$file"
        echo ""
    fi
}

# Extract todo context
extract_todos() {
    local session_id=$1
    local file="$SESSION_DIR/todo-$session_id.json"

    if [ ! -f "$file" ]; then
        print_warning "Todo file not found for session $session_id"
        return
    fi

    print_section "Todo Progress"

    # Summary
    local total=$(jq -r '.summary.total // 0' "$file")
    local completed=$(jq -r '.summary.completed // 0' "$file")
    local in_progress=$(jq -r '.summary.inProgress // 0' "$file")
    local pending=$(jq -r '.summary.pending // 0' "$file")
    local failed=$(jq -r '.summary.failed // 0' "$file")

    echo "**Summary:** $completed/$total completed ($in_progress in progress, $pending pending, $failed failed)"
    echo ""

    # Current todo (in progress)
    if [ "$in_progress" -gt 0 ]; then
        print_subsection "Currently Working On"
        echo ""
        jq -r '.todos[] | select(.status == "in_progress") | "- **\(.content)** (assigned to: \(.assignedAgent))\n  Active form: \(.activeForm)"' "$file"
        echo ""
    fi

    # Recent completed todos (last 5)
    local completed_count=$(jq -r '[.todos[] | select(.status == "completed")] | length' "$file")
    if [ "$completed_count" -gt 0 ]; then
        print_subsection "Recently Completed (last 5)"
        echo ""
        jq -r '[.todos[] | select(.status == "completed")] | sort_by(.completedAt) | reverse | .[0:5] | .[] | "- ✓ \(.content) (by \(.assignedAgent))"' "$file"
        echo ""
    fi

    # Pending todos
    if [ "$pending" -gt 0 ]; then
        print_subsection "Pending Todos"
        echo ""
        jq -r '.todos[] | select(.status == "pending") | "- [ ] \(.content) (assigned to: \(.assignedAgent))"' "$file"
        echo ""
    fi

    # Failed todos
    if [ "$failed" -gt 0 ]; then
        print_subsection "Failed Todos"
        echo ""
        jq -r '.todos[] | select(.status == "failed") | "- ✗ \(.content) (assigned to: \(.assignedAgent))\n  Error: \(.errorMessage // "Unknown error")"' "$file"
        echo ""
    fi

    # Agent assignment breakdown
    print_subsection "Agent Assignments"
    echo ""
    jq -r '[.todos[] | .assignedAgent] | group_by(.) | .[] | "\(.[] | . | unique)[0]: \(length) todos"' "$file" | \
        while read line; do
            echo "- $line"
        done
    echo ""
}

# Extract workbook insights
extract_workbook() {
    local session_id=$1
    local file="$SESSION_DIR/workbook-$session_id.json"

    if [ ! -f "$file" ]; then
        print_warning "Workbook file not found for session $session_id"
        return
    fi

    local entry_count=$(jq -r '.entries | length' "$file")

    if [ "$entry_count" -eq 0 ]; then
        return
    fi

    print_section "Key Insights & Decisions"

    print_subsection "Recent Insights (last 5)"
    echo ""
    jq -r '[.entries[] | select(.type == "insight")] | sort_by(.timestamp) | reverse | .[0:5] | .[] | "**\(.title)** (\(.timestamp | split("T")[0]))\n\(.content)\n"' "$file" | \
        sed 's/^/  /'

    # Recent decisions
    local decision_count=$(jq -r '[.entries[] | select(.type == "decision")] | length' "$file")
    if [ "$decision_count" -gt 0 ]; then
        print_subsection "Recent Decisions (last 3)"
        echo ""
        jq -r '[.entries[] | select(.type == "decision")] | sort_by(.timestamp) | reverse | .[0:3] | .[] | "**\(.title)** (\(.timestamp | split("T")[0]))\n\(.content)\n"' "$file" | \
            sed 's/^/  /'
    fi

    # Diagrams
    local diagram_count=$(jq -r '[.entries[] | select(.type == "diagram")] | length' "$file")
    if [ "$diagram_count" -gt 0 ]; then
        print_subsection "Diagrams"
        echo ""
        jq -r '[.entries[] | select(.type == "diagram")] | .[] | "- \(.title) (\(.metadata.diagramType // "unknown"))"' "$file"
        echo ""
    fi

    # Questions needing answers
    local open_questions=$(jq -r '[.entries[] | select(.type == "question" and (.metadata.resolved // false) == false)] | length' "$file")
    if [ "$open_questions" -gt 0 ]; then
        print_subsection "Open Questions"
        echo ""
        jq -r '[.entries[] | select(.type == "question" and (.metadata.resolved // false) == false)] | .[] | "- \(.title)"' "$file"
        echo ""
    fi
}

# Extract recent events
extract_events() {
    local session_id=$1
    local file="$SESSION_DIR/events-$session_id.json"
    local limit=${2:-30}

    if [ ! -f "$file" ]; then
        print_warning "Events file not found for session $session_id"
        return
    fi

    local event_count=$(jq -r '.events | length' "$file")

    if [ "$event_count" -eq 0 ]; then
        return
    fi

    print_section "Recent Events (last $limit)"

    # Event summary
    local total_events=$(jq -r '.summary.totalEvents // 0' "$file")
    local errors=$(jq -r '.summary.totalErrors // 0' "$file")
    local warnings=$(jq -r '.summary.totalWarnings // 0' "$file")

    echo "**Summary:** $total_events total events ($errors errors, $warnings warnings)"
    echo ""

    # Recent events
    jq -r --arg limit "$limit" '
        .events |
        sort_by(.timestamp) |
        reverse |
        .[0:($limit | tonumber)] |
        .[] |
        "\(.timestamp | split("T")[1] | split(".")[0]) [\(.severity | ascii_upcase)] \(.eventType): \(.description)" +
        (if .details.errorMessage then "\n    Error: \(.details.errorMessage)" else "" end)
    ' "$file" | \
        while IFS= read -r line; do
            # Color code by severity
            if [[ $line =~ ERROR|CRITICAL ]]; then
                echo -e "${RED}$line${NC}"
            elif [[ $line =~ WARNING ]]; then
                echo -e "${YELLOW}$line${NC}"
            elif [[ $line =~ agent_completed|task_completed|phase_completed ]]; then
                echo -e "${GREEN}$line${NC}"
            else
                echo "$line"
            fi
        done
    echo ""

    # Agent activity summary
    local agents_launched=$(jq -r '.summary.agentsLaunched // 0' "$file")
    local agents_completed=$(jq -r '.summary.agentsCompleted // 0' "$file")
    local agents_failed=$(jq -r '.summary.agentsFailed // 0' "$file")

    if [ "$agents_launched" -gt 0 ]; then
        print_subsection "Agent Activity"
        echo ""
        echo "- Launched: $agents_launched"
        echo "- Completed: $agents_completed"
        echo "- Failed: $agents_failed"
        echo ""
    fi
}

# Generate session report
generate_report() {
    local session_id=$1

    print_header "Session Context Report"

    echo "**Session ID:** $session_id"
    echo "**Generated:** $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    echo ""

    extract_planning "$session_id"
    extract_todos "$session_id"
    extract_workbook "$session_id"
    extract_events "$session_id" 30

    print_header "End of Report"
}

# Main script
main() {
    check_dependencies

    local session_id="${1:-}"

    # If no session ID provided, find most recent
    if [ -z "$session_id" ]; then
        print_warning "No session ID provided, using most recent session"
        session_id=$(find_recent_session)
        echo "Found session: $session_id"
    fi

    validate_session "$session_id"
    generate_report "$session_id"
}

# Run main with all arguments
main "$@"
