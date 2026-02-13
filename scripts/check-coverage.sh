#!/bin/bash
set -e

# Coverage validation script
# Parses lcov.info file and validates coverage meets the specified threshold

COVERAGE_FILE="${1:-coverage/lcov.info}"
THRESHOLD="${2:-95}"

# Check if coverage file exists
if [ ! -f "$COVERAGE_FILE" ]; then
  echo "❌ Coverage file not found: $COVERAGE_FILE"
  exit 1
fi

# Extract coverage data from lcov.info
LINES_FOUND=$(grep -o "LF:[0-9]*" "$COVERAGE_FILE" | cut -d: -f2 | awk '{sum+=$1} END {print sum}')
LINES_HIT=$(grep -o "LH:[0-9]*" "$COVERAGE_FILE" | cut -d: -f2 | awk '{sum+=$1} END {print sum}')
BRANCHES_FOUND=$(grep -o "BRF:[0-9]*" "$COVERAGE_FILE" | cut -d: -f2 | awk '{sum+=$1} END {print sum}')
BRANCHES_HIT=$(grep -o "BRH:[0-9]*" "$COVERAGE_FILE" | cut -d: -f2 | awk '{sum+=$1} END {print sum}')
FUNCTIONS_FOUND=$(grep -o "FNF:[0-9]*" "$COVERAGE_FILE" | cut -d: -f2 | awk '{sum+=$1} END {print sum}')
FUNCTIONS_HIT=$(grep -o "FNH:[0-9]*" "$COVERAGE_FILE" | cut -d: -f2 | awk '{sum+=$1} END {print sum}')

# Validate that we have data to work with
if [ -z "$LINES_FOUND" ] || [ "$LINES_FOUND" -eq 0 ]; then
  echo "❌ No line coverage data found in $COVERAGE_FILE"
  exit 1
fi

if [ -z "$FUNCTIONS_FOUND" ] || [ "$FUNCTIONS_FOUND" -eq 0 ]; then
  echo "⚠️  No function coverage data found in $COVERAGE_FILE"
  FUNCTIONS_PCT="N/A"
  FUNCTIONS_OK=1  # Skip function check if no data
else
  FUNCTIONS_PCT=$(echo "scale=2; ($FUNCTIONS_HIT / $FUNCTIONS_FOUND) * 100" | bc)
  FUNCTIONS_OK=$(echo "$FUNCTIONS_PCT >= $THRESHOLD" | bc)
fi

if [ -z "$BRANCHES_FOUND" ] || [ "$BRANCHES_FOUND" -eq 0 ]; then
  echo "⚠️  No branch coverage data found in $COVERAGE_FILE"
  BRANCHES_PCT="N/A"
  BRANCHES_OK=1  # Skip branch check if no data
else
  BRANCHES_PCT=$(echo "scale=2; ($BRANCHES_HIT / $BRANCHES_FOUND) * 100" | bc)
  BRANCHES_OK=$(echo "$BRANCHES_PCT >= $THRESHOLD" | bc)
fi

# Calculate line coverage percentage (required)
LINES_PCT=$(echo "scale=2; ($LINES_HIT / $LINES_FOUND) * 100" | bc)
LINES_OK=$(echo "$LINES_PCT >= $THRESHOLD" | bc)

# Display coverage summary
echo "Coverage Summary:"
echo "  Lines: $LINES_PCT% ($LINES_HIT/$LINES_FOUND)"
[ "$BRANCHES_PCT" != "N/A" ] && echo "  Branches: $BRANCHES_PCT% ($BRANCHES_HIT/$BRANCHES_FOUND)"
[ "$FUNCTIONS_PCT" != "N/A" ] && echo "  Functions: $FUNCTIONS_PCT% ($FUNCTIONS_HIT/$FUNCTIONS_FOUND)"
echo ""

# Check if all metrics meet the threshold
if [ "$LINES_OK" -eq 1 ] && [ "$BRANCHES_OK" -eq 1 ] && [ "$FUNCTIONS_OK" -eq 1 ]; then
  echo "✅ Coverage meets ${THRESHOLD}% threshold!"
  exit 0
else
  echo "❌ Coverage is below ${THRESHOLD}% threshold!"
  [ "$LINES_OK" -eq 0 ] && echo "  - Lines coverage ($LINES_PCT%) is below $THRESHOLD%"
  [ "$BRANCHES_OK" -eq 0 ] && [ "$BRANCHES_PCT" != "N/A" ] && echo "  - Branches coverage ($BRANCHES_PCT%) is below $THRESHOLD%"
  [ "$FUNCTIONS_OK" -eq 0 ] && [ "$FUNCTIONS_PCT" != "N/A" ] && echo "  - Functions coverage ($FUNCTIONS_PCT%) is below $THRESHOLD%"
  exit 1
fi
