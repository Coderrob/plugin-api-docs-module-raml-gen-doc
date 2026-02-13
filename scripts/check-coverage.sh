#!/usr/bin/env bash
#
# Coverage Validation Script
# 
# Description:
#   Validates test coverage meets specified threshold by parsing lcov.info file.
#   Checks line, branch, and function coverage metrics.
#
# Usage:
#   ./check-coverage.sh [coverage_file] [threshold]
#
# Arguments:
#   coverage_file - Path to lcov.info file (default: coverage/lcov.info)
#   threshold     - Minimum coverage percentage (default: 95)
#
# Exit Codes:
#   0 - Coverage meets threshold
#   1 - Coverage below threshold or file not found
#
# Example:
#   ./check-coverage.sh coverage/lcov.info 95

set -euo pipefail

# Constants
readonly COVERAGE_FILE="${1:-coverage/lcov.info}"
readonly THRESHOLD="${2:-95}"
readonly NA_VALUE="N/A"

#######################################
# Displays error message and exits
# Globals:
#   None
# Arguments:
#   Error message
# Returns:
#   None (exits with code 1)
#######################################
error_exit() {
  echo "❌ $1" >&2
  exit 1
}

#######################################
# Displays warning message
# Globals:
#   None
# Arguments:
#   Warning message
# Returns:
#   None
#######################################
warn() {
  echo "⚠️  $1" >&2
}

#######################################
# Extracts sum of metric values from lcov file
# Globals:
#   COVERAGE_FILE
# Arguments:
#   Metric pattern (e.g., "LF", "LH")
# Outputs:
#   Sum of all metric values
#######################################
extract_metric() {
  local pattern="$1"
  grep -o "${pattern}:[0-9]*" "$COVERAGE_FILE" | \
    cut -d: -f2 | \
    awk '{sum+=$1} END {print sum}'
}

#######################################
# Calculates percentage from hit/found values
# Globals:
#   None
# Arguments:
#   hit_count - Number of items covered
#   found_count - Total number of items
# Outputs:
#   Percentage with 2 decimal places
#######################################
calculate_percentage() {
  local hit_count="$1"
  local found_count="$2"
  echo "scale=2; ($hit_count / $found_count) * 100" | bc
}

#######################################
# Checks if percentage meets threshold
# Globals:
#   THRESHOLD
# Arguments:
#   percentage - Coverage percentage
# Outputs:
#   1 if meets threshold, 0 otherwise
#######################################
meets_threshold() {
  local percentage="$1"
  echo "$percentage >= $THRESHOLD" | bc
}

#######################################
# Validates coverage file exists
# Globals:
#   COVERAGE_FILE
# Arguments:
#   None
# Returns:
#   0 if file exists, exits otherwise
#######################################
validate_coverage_file() {
  [ -f "$COVERAGE_FILE" ] || error_exit "Coverage file not found: $COVERAGE_FILE"
}

#######################################
# Processes line coverage metric
# Globals:
#   COVERAGE_FILE, THRESHOLD
# Arguments:
#   None
# Outputs:
#   Sets LINES_PCT and LINES_OK variables
#######################################
process_line_coverage() {
  local lines_found
  local lines_hit
  
  lines_found=$(extract_metric "LF")
  lines_hit=$(extract_metric "LH")
  
  if [ -z "$lines_found" ] || [ "$lines_found" -eq 0 ]; then
    error_exit "No line coverage data found in $COVERAGE_FILE"
  fi
  
  LINES_PCT=$(calculate_percentage "$lines_hit" "$lines_found")
  LINES_OK=$(meets_threshold "$LINES_PCT")
  LINES_HIT="$lines_hit"
  LINES_FOUND="$lines_found"
}

#######################################
# Processes branch coverage metric
# Globals:
#   COVERAGE_FILE, THRESHOLD, NA_VALUE
# Arguments:
#   None
# Outputs:
#   Sets BRANCHES_PCT and BRANCHES_OK variables
#######################################
process_branch_coverage() {
  local branches_found
  local branches_hit
  
  branches_found=$(extract_metric "BRF")
  branches_hit=$(extract_metric "BRH")
  
  if [ -z "$branches_found" ] || [ "$branches_found" -eq 0 ]; then
    warn "No branch coverage data found in $COVERAGE_FILE"
    BRANCHES_PCT="$NA_VALUE"
    BRANCHES_OK=1
    BRANCHES_HIT=0
    BRANCHES_FOUND=0
  else
    BRANCHES_PCT=$(calculate_percentage "$branches_hit" "$branches_found")
    BRANCHES_OK=$(meets_threshold "$BRANCHES_PCT")
    BRANCHES_HIT="$branches_hit"
    BRANCHES_FOUND="$branches_found"
  fi
}

#######################################
# Processes function coverage metric
# Globals:
#   COVERAGE_FILE, THRESHOLD, NA_VALUE
# Arguments:
#   None
# Outputs:
#   Sets FUNCTIONS_PCT and FUNCTIONS_OK variables
#######################################
process_function_coverage() {
  local functions_found
  local functions_hit
  
  functions_found=$(extract_metric "FNF")
  functions_hit=$(extract_metric "FNH")
  
  if [ -z "$functions_found" ] || [ "$functions_found" -eq 0 ]; then
    warn "No function coverage data found in $COVERAGE_FILE"
    FUNCTIONS_PCT="$NA_VALUE"
    FUNCTIONS_OK=1
    FUNCTIONS_HIT=0
    FUNCTIONS_FOUND=0
  else
    FUNCTIONS_PCT=$(calculate_percentage "$functions_hit" "$functions_found")
    FUNCTIONS_OK=$(meets_threshold "$FUNCTIONS_PCT")
    FUNCTIONS_HIT="$functions_hit"
    FUNCTIONS_FOUND="$functions_found"
  fi
}

#######################################
# Displays coverage summary
# Globals:
#   LINES_PCT, BRANCHES_PCT, FUNCTIONS_PCT, etc.
# Arguments:
#   None
# Outputs:
#   Coverage summary to stdout
#######################################
display_coverage_summary() {
  echo "Coverage Summary:"
  echo "  Lines: ${LINES_PCT}% (${LINES_HIT}/${LINES_FOUND})"
  
  [ "$BRANCHES_PCT" != "$NA_VALUE" ] && \
    echo "  Branches: ${BRANCHES_PCT}% (${BRANCHES_HIT}/${BRANCHES_FOUND})"
  
  [ "$FUNCTIONS_PCT" != "$NA_VALUE" ] && \
    echo "  Functions: ${FUNCTIONS_PCT}% (${FUNCTIONS_HIT}/${FUNCTIONS_FOUND})"
  
  echo ""
}

#######################################
# Displays failed coverage metrics
# Globals:
#   LINES_OK, BRANCHES_OK, FUNCTIONS_OK, etc.
# Arguments:
#   None
# Outputs:
#   Failed metrics to stdout
#######################################
display_failures() {
  [ "$LINES_OK" -eq 0 ] && \
    echo "  - Lines coverage (${LINES_PCT}%) is below ${THRESHOLD}%"
  
  [ "$BRANCHES_OK" -eq 0 ] && [ "$BRANCHES_PCT" != "$NA_VALUE" ] && \
    echo "  - Branches coverage (${BRANCHES_PCT}%) is below ${THRESHOLD}%"
  
  [ "$FUNCTIONS_OK" -eq 0 ] && [ "$FUNCTIONS_PCT" != "$NA_VALUE" ] && \
    echo "  - Functions coverage (${FUNCTIONS_PCT}%) is below ${THRESHOLD}%"
}

#######################################
# Validates all coverage metrics meet threshold
# Globals:
#   LINES_OK, BRANCHES_OK, FUNCTIONS_OK, THRESHOLD
# Arguments:
#   None
# Returns:
#   0 if all metrics meet threshold, 1 otherwise
#######################################
validate_coverage_threshold() {
  if [ "$LINES_OK" -eq 1 ] && \
     [ "$BRANCHES_OK" -eq 1 ] && \
     [ "$FUNCTIONS_OK" -eq 1 ]; then
    echo "✅ Coverage meets ${THRESHOLD}% threshold!"
    return 0
  else
    echo "❌ Coverage is below ${THRESHOLD}% threshold!"
    display_failures
    return 1
  fi
}

#######################################
# Main execution function
# Globals:
#   All coverage variables
# Arguments:
#   None
# Returns:
#   0 on success, 1 on failure
#######################################
main() {
  validate_coverage_file
  
  process_line_coverage
  process_branch_coverage
  process_function_coverage
  
  display_coverage_summary
  validate_coverage_threshold
}

# Execute main function
main
