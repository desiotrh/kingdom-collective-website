#!/bin/bash

# ==============================================
# Kingdom Studios - Comprehensive Load Testing Script
# Runs all load tests with monitoring and reporting
# ==============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BASE_URL=${API_BASE_URL:-"http://localhost:3000"}
TEST_MODE=${TEST_MODE:-"comprehensive"} # comprehensive, performance, or both
PARALLEL_TESTS=${PARALLEL_TESTS:-"false"}
MONITORING_ENABLED=${MONITORING_ENABLED:-"true"}
REPORT_DIR="./load-test-reports"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create report directory
mkdir -p "$REPORT_DIR"

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}  Kingdom Studios - Load Testing Suite${NC}"
echo -e "${BLUE}=============================================${NC}"
echo -e "${CYAN}Timestamp:${NC} $TIMESTAMP"
echo -e "${CYAN}Base URL:${NC} $BASE_URL"
echo -e "${CYAN}Test Mode:${NC} $TEST_MODE"
echo -e "${CYAN}Parallel Tests:${NC} $PARALLEL_TESTS"
echo -e "${CYAN}Monitoring:${NC} $MONITORING_ENABLED"
echo -e "${CYAN}Report Directory:${NC} $REPORT_DIR"
echo ""

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "info") echo -e "${BLUE}[INFO]${NC} $message" ;;
        "success") echo -e "${GREEN}[SUCCESS]${NC} $message" ;;
        "warning") echo -e "${YELLOW}[WARNING]${NC} $message" ;;
        "error") echo -e "${RED}[ERROR]${NC} $message" ;;
        "step") echo -e "${PURPLE}[STEP]${NC} $message" ;;
    esac
}

# Function to check if service is running
check_service() {
    local service_name=$1
    local service_url=$2
    
    print_status "info" "Checking $service_name availability..."
    
    if curl -s --max-time 10 "$service_url/health" > /dev/null; then
        print_status "success" "$service_name is running"
        return 0
    else
        print_status "error" "$service_name is not responding"
        return 1
    fi
}

# Function to start monitoring
start_monitoring() {
    if [ "$MONITORING_ENABLED" = "true" ]; then
        print_status "step" "Starting monitoring..."
        
        # Start Prometheus monitoring
        if command -v prometheus > /dev/null; then
            print_status "info" "Prometheus monitoring available"
        else
            print_status "warning" "Prometheus not found, using basic monitoring"
        fi
        
        # Start Grafana monitoring
        if command -v grafana-server > /dev/null; then
            print_status "info" "Grafana monitoring available"
        else
            print_status "warning" "Grafana not found, using basic monitoring"
        fi
        
        # Start basic system monitoring
        start_system_monitoring
    fi
}

# Function to start system monitoring
start_system_monitoring() {
    print_status "info" "Starting system monitoring..."
    
    # Monitor CPU, Memory, Disk, Network
    (
        while true; do
            echo "$(date '+%Y-%m-%d %H:%M:%S') - CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)% - Memory: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}') - Disk: $(df / | tail -1 | awk '{print $5}')" >> "$REPORT_DIR/system_monitoring.log"
            sleep 5
        done
    ) &
    
    MONITORING_PID=$!
    print_status "success" "System monitoring started (PID: $MONITORING_PID)"
}

# Function to stop monitoring
stop_monitoring() {
    if [ ! -z "$MONITORING_PID" ]; then
        print_status "info" "Stopping system monitoring..."
        kill $MONITORING_PID 2>/dev/null || true
        print_status "success" "System monitoring stopped"
    fi
}

# Function to run comprehensive load testing
run_comprehensive_tests() {
    print_status "step" "Running comprehensive load testing..."
    
    local start_time=$(date +%s)
    
    # Run comprehensive load testing
    if node comprehensive-load-testing.js; then
        print_status "success" "Comprehensive load testing completed"
        
        # Move results to report directory
        if [ -f "comprehensive-load-test-report.json" ]; then
            mv comprehensive-load-test-report.json "$REPORT_DIR/comprehensive-load-test-report-$TIMESTAMP.json"
            print_status "info" "Comprehensive test report saved"
        fi
    else
        print_status "error" "Comprehensive load testing failed"
        return 1
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    print_status "info" "Comprehensive testing took ${duration} seconds"
}

# Function to run performance test scenarios
run_performance_tests() {
    print_status "step" "Running performance test scenarios..."
    
    local start_time=$(date +%s)
    
    # Run performance test scenarios
    if node performance-test-scenarios.js; then
        print_status "success" "Performance test scenarios completed"
        
        # Move results to report directory
        if [ -f "performance-test-report.json" ]; then
            mv performance-test-report.json "$REPORT_DIR/performance-test-report-$TIMESTAMP.json"
            print_status "info" "Performance test report saved"
        fi
    else
        print_status "error" "Performance test scenarios failed"
        return 1
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    print_status "info" "Performance testing took ${duration} seconds"
}

# Function to run app-specific tests
run_app_specific_tests() {
    print_status "step" "Running app-specific load tests..."
    
    local apps=("kingdom-lens" "kingdom-launchpad" "kingdom-clips" "kingdom-circle" "kingdom-voice")
    local test_scenarios=("10k" "50k" "100k")
    
    for app in "${apps[@]}"; do
        print_status "info" "Testing $app..."
        
        for scenario in "${test_scenarios[@]}"; do
            print_status "info" "Running $scenario users scenario for $app..."
            
            # Run app-specific test
            if node app-specific-load-test.js --app="$app" --users="$scenario"; then
                print_status "success" "$app $scenario users test completed"
            else
                print_status "error" "$app $scenario users test failed"
            fi
        done
    done
}

# Function to run cross-app tests
run_cross_app_tests() {
    print_status "step" "Running cross-app integration tests..."
    
    # Test unified authentication
    print_status "info" "Testing unified authentication..."
    if node cross-app-test.js --feature="auth"; then
        print_status "success" "Unified authentication test completed"
    else
        print_status "error" "Unified authentication test failed"
    fi
    
    # Test shared storage
    print_status "info" "Testing shared storage..."
    if node cross-app-test.js --feature="storage"; then
        print_status "success" "Shared storage test completed"
    else
        print_status "error" "Shared storage test failed"
    fi
    
    # Test cross-app messaging
    print_status "info" "Testing cross-app messaging..."
    if node cross-app-test.js --feature="messaging"; then
        print_status "success" "Cross-app messaging test completed"
    else
        print_status "error" "Cross-app messaging test failed"
    fi
}

# Function to run stress tests
run_stress_tests() {
    print_status "step" "Running stress tests..."
    
    # Test beyond capacity scenarios
    local stress_scenarios=("150k" "200k" "250k")
    
    for scenario in "${stress_scenarios[@]}"; do
        print_status "info" "Running stress test with $scenario users..."
        
        if node stress-test.js --users="$scenario"; then
            print_status "success" "Stress test $scenario users completed"
        else
            print_status "error" "Stress test $scenario users failed"
        fi
    done
}

# Function to generate summary report
generate_summary_report() {
    print_status "step" "Generating summary report..."
    
    local report_file="$REPORT_DIR/load-test-summary-$TIMESTAMP.md"
    
    cat > "$report_file" << EOF
# Kingdom Studios Load Test Summary Report

**Generated:** $(date)
**Test Mode:** $TEST_MODE
**Base URL:** $BASE_URL

## Test Results Summary

### Comprehensive Load Testing
- **Status:** $(if [ -f "$REPORT_DIR/comprehensive-load-test-report-$TIMESTAMP.json" ]; then echo "✅ Completed"; else echo "❌ Failed"; fi)
- **Report:** $(if [ -f "$REPORT_DIR/comprehensive-load-test-report-$TIMESTAMP.json" ]; then echo "Available"; else echo "Not available"; fi)

### Performance Test Scenarios
- **Status:** $(if [ -f "$REPORT_DIR/performance-test-report-$TIMESTAMP.json" ]; then echo "✅ Completed"; else echo "❌ Failed"; fi)
- **Report:** $(if [ -f "$REPORT_DIR/performance-test-report-$TIMESTAMP.json" ]; then echo "Available"; else echo "Not available"; fi)

### App-Specific Tests
- **Kingdom Lens:** $(if [ -f "$REPORT_DIR/kingdom-lens-test-$TIMESTAMP.json" ]; then echo "✅ Completed"; else echo "❌ Failed"; fi)
- **Kingdom Launchpad:** $(if [ -f "$REPORT_DIR/kingdom-launchpad-test-$TIMESTAMP.json" ]; then echo "✅ Completed"; else echo "❌ Failed"; fi)
- **Kingdom Clips:** $(if [ -f "$REPORT_DIR/kingdom-clips-test-$TIMESTAMP.json" ]; then echo "✅ Completed"; else echo "❌ Failed"; fi)
- **Kingdom Circle:** $(if [ -f "$REPORT_DIR/kingdom-circle-test-$TIMESTAMP.json" ]; then echo "✅ Completed"; else echo "❌ Failed"; fi)
- **Kingdom Voice:** $(if [ -f "$REPORT_DIR/kingdom-voice-test-$TIMESTAMP.json" ]; then echo "✅ Completed"; else echo "❌ Failed"; fi)

### Cross-App Integration Tests
- **Unified Authentication:** $(if [ -f "$REPORT_DIR/cross-app-auth-test-$TIMESTAMP.json" ]; then echo "✅ Completed"; else echo "❌ Failed"; fi)
- **Shared Storage:** $(if [ -f "$REPORT_DIR/cross-app-storage-test-$TIMESTAMP.json" ]; then echo "✅ Completed"; else echo "❌ Failed"; fi)
- **Cross-App Messaging:** $(if [ -f "$REPORT_DIR/cross-app-messaging-test-$TIMESTAMP.json" ]; then echo "✅ Completed"; else echo "❌ Failed"; fi)

## System Monitoring

### Resource Usage
- **CPU Usage:** $(grep "CPU:" "$REPORT_DIR/system_monitoring.log" | tail -1 | awk '{print $4}' || echo "N/A")
- **Memory Usage:** $(grep "Memory:" "$REPORT_DIR/system_monitoring.log" | tail -1 | awk '{print $6}' || echo "N/A")
- **Disk Usage:** $(grep "Disk:" "$REPORT_DIR/system_monitoring.log" | tail -1 | awk '{print $8}' || echo "N/A")

## Recommendations

$(if [ -f "$REPORT_DIR/recommendations-$TIMESTAMP.txt" ]; then cat "$REPORT_DIR/recommendations-$TIMESTAMP.txt"; else echo "No specific recommendations available."; fi)

## Next Steps

1. Review detailed reports in the $REPORT_DIR directory
2. Analyze performance bottlenecks
3. Implement recommended optimizations
4. Re-run tests after optimizations
5. Monitor production performance

---
*Report generated by Kingdom Studios Load Testing Suite*
EOF

    print_status "success" "Summary report generated: $report_file"
}

# Function to cleanup
cleanup() {
    print_status "info" "Cleaning up..."
    
    # Stop monitoring
    stop_monitoring
    
    # Kill any remaining background processes
    jobs -p | xargs -r kill
    
    print_status "success" "Cleanup completed"
}

# Main execution
main() {
    print_status "info" "Starting Kingdom Studios Load Testing Suite..."
    
    # Check prerequisites
    print_status "step" "Checking prerequisites..."
    
    if ! command -v node > /dev/null; then
        print_status "error" "Node.js is required but not installed"
        exit 1
    fi
    
    if ! command -v curl > /dev/null; then
        print_status "error" "curl is required but not installed"
        exit 1
    fi
    
    # Check service availability
    print_status "step" "Checking service availability..."
    
    if ! check_service "API" "$BASE_URL"; then
        print_status "error" "API service is not available. Please start the backend service first."
        exit 1
    fi
    
    # Start monitoring
    start_monitoring
    
    # Run tests based on mode
    case $TEST_MODE in
        "comprehensive")
            print_status "info" "Running comprehensive load testing only..."
            run_comprehensive_tests
            ;;
        "performance")
            print_status "info" "Running performance test scenarios only..."
            run_performance_tests
            ;;
        "both")
            print_status "info" "Running both comprehensive and performance tests..."
            run_comprehensive_tests
            run_performance_tests
            ;;
        "full")
            print_status "info" "Running full test suite..."
            run_comprehensive_tests
            run_performance_tests
            run_app_specific_tests
            run_cross_app_tests
            run_stress_tests
            ;;
        *)
            print_status "error" "Invalid test mode: $TEST_MODE"
            print_status "info" "Valid modes: comprehensive, performance, both, full"
            exit 1
            ;;
    esac
    
    # Generate summary report
    generate_summary_report
    
    print_status "success" "Load testing completed successfully!"
    print_status "info" "Reports available in: $REPORT_DIR"
}

# Trap cleanup on exit
trap cleanup EXIT

# Run main function
main "$@" 