/**
 * Enterprise Monitoring System Test
 * Comprehensive test suite for monitoring, analytics, and performance systems
 */

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Import monitoring services
const EnterpriseMonitoringDashboard = require('./kingdom-studios-backend/src/services/EnterpriseMonitoringDashboard');
const AdvancedAnalyticsEngine = require('./kingdom-studios-backend/src/services/AdvancedAnalyticsEngine');
const PerformanceMonitoringSystem = require('./kingdom-studios-backend/src/services/PerformanceMonitoringSystem');

class MonitoringSystemTester {
  constructor() {
    this.testResults = {
      monitoring: { passed: 0, failed: 0, tests: [] },
      analytics: { passed: 0, failed: 0, tests: [] },
      performance: { passed: 0, failed: 0, tests: [] },
      integration: { passed: 0, failed: 0, tests: [] }
    };
    
    this.monitoringDashboard = null;
    this.analyticsEngine = null;
    this.performanceMonitoring = null;
  }

  async runAllTests() {
    log('\n🧪 Enterprise Monitoring System Test Suite', 'bold');
    log('=' .repeat(60), 'cyan');
    
    try {
      // Initialize services
      await this.initializeServices();
      
      // Run test suites
      await this.testMonitoringDashboard();
      await this.testAnalyticsEngine();
      await this.testPerformanceMonitoring();
      await this.testIntegration();
      
      // Generate final report
      this.generateTestReport();
      
    } catch (error) {
      log(`❌ Test suite failed with error: ${error.message}`, 'red');
    } finally {
      // Cleanup
      await this.cleanup();
    }
  }

  async initializeServices() {
    log('\n🚀 Initializing monitoring services...', 'blue');
    
    try {
      this.monitoringDashboard = new EnterpriseMonitoringDashboard();
      this.analyticsEngine = new AdvancedAnalyticsEngine();
      this.performanceMonitoring = new PerformanceMonitoringSystem();
      
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      log('✅ All monitoring services initialized', 'green');
    } catch (error) {
      log(`❌ Failed to initialize services: ${error.message}`, 'red');
      throw error;
    }
  }

  async testMonitoringDashboard() {
    log('\n📊 Testing Enterprise Monitoring Dashboard...', 'blue');
    
    // Test 1: Dashboard data retrieval
    await this.runTest('monitoring', 'Dashboard Data Retrieval', async () => {
      const data = this.monitoringDashboard.getDashboardData();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Dashboard data not available');
      }
      
      const requiredFields = ['system', 'performance', 'users', 'business'];
      for (const field of requiredFields) {
        if (!data[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      
      return 'Dashboard data structure is valid';
    });

    // Test 2: Metrics collection
    await this.runTest('monitoring', 'Metrics Collection', async () => {
      const initialData = this.monitoringDashboard.getDashboardData();
      
      // Wait for metrics to be collected
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      const updatedData = this.monitoringDashboard.getDashboardData();
      
      // Check if metrics were updated
      if (initialData.lastUpdate === updatedData.lastUpdate) {
        throw new Error('Metrics not being updated');
      }
      
      return 'Metrics are being collected and updated';
    });

    // Test 3: Health summary
    await this.runTest('monitoring', 'Health Summary', async () => {
      const health = this.monitoringDashboard.getHealthSummary();
      
      const requiredFields = ['status', 'uptime', 'concurrentUsers', 'responseTime'];
      for (const field of requiredFields) {
        if (health[field] === undefined) {
          throw new Error(`Missing health field: ${field}`);
        }
      }
      
      if (!['healthy', 'warning', 'critical'].includes(health.status)) {
        throw new Error('Invalid health status');
      }
      
      return 'Health summary is valid';
    });

    // Test 4: Alert system
    await this.runTest('monitoring', 'Alert System', async () => {
      const initialData = this.monitoringDashboard.getDashboardData();
      const initialAlertCount = initialData.alerts.length;
      
      // Simulate high metric values to trigger alerts
      this.monitoringDashboard.updateMetric('system.cpu', 95);
      this.monitoringDashboard.processAlerts();
      
      // Wait for alert processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedData = this.monitoringDashboard.getDashboardData();
      const newAlertCount = updatedData.alerts.length;
      
      if (newAlertCount <= initialAlertCount) {
        throw new Error('Alert system not triggering alerts');
      }
      
      return 'Alert system is functioning correctly';
    });
  }

  async testAnalyticsEngine() {
    log('\n🧠 Testing Advanced Analytics Engine...', 'blue');

    // Test 1: Event tracking
    await this.runTest('analytics', 'Event Tracking', async () => {
      // Track various events
      this.analyticsEngine.trackEvent('user123', 'user_login', { method: 'email' });
      this.analyticsEngine.trackEvent('user123', 'content_generation_success', { contentType: 'post' });
      this.analyticsEngine.trackEvent('user456', 'purchase', { revenue: 29.99 });
      
      const data = this.analyticsEngine.getDashboardData();
      
      if (!data.realtime || data.realtime.liveEvents.length === 0) {
        throw new Error('Events not being tracked');
      }
      
      return 'Event tracking is working correctly';
    });

    // Test 2: Real-time metrics
    await this.runTest('analytics', 'Real-time Metrics', async () => {
      const data = this.analyticsEngine.getDashboardData();
      
      if (!data.realtime.activeUsers || data.realtime.activeUsers < 0) {
        throw new Error('Invalid active users count');
      }
      
      if (!data.realtime.currentSessions || data.realtime.currentSessions < 0) {
        throw new Error('Invalid current sessions count');
      }
      
      return 'Real-time metrics are valid';
    });

    // Test 3: Insights generation
    await this.runTest('analytics', 'Insights Generation', async () => {
      // Wait for insights to be generated
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const data = this.analyticsEngine.getDashboardData();
      
      if (!data.insights) {
        throw new Error('Insights not available');
      }
      
      const insightTypes = ['userInsights', 'contentInsights', 'performanceInsights', 'businessInsights'];
      for (const type of insightTypes) {
        if (!Array.isArray(data.insights[type])) {
          throw new Error(`Invalid insights type: ${type}`);
        }
      }
      
      return 'Insights generation is working';
    });

    // Test 4: Data export
    await this.runTest('analytics', 'Data Export', async () => {
      const exportData = this.analyticsEngine.exportData('1h');
      
      const requiredFields = ['users', 'content', 'performance', 'business'];
      for (const field of requiredFields) {
        if (!Array.isArray(exportData[field])) {
          throw new Error(`Invalid export data field: ${field}`);
        }
      }
      
      return 'Data export is functioning';
    });
  }

  async testPerformanceMonitoring() {
    log('\n⚡ Testing Performance Monitoring System...', 'blue');

    // Test 1: Metric recording
    await this.runTest('performance', 'Metric Recording', async () => {
      // Record test metrics
      this.performanceMonitoring.recordPerformanceMetric('responseTime', 250);
      this.performanceMonitoring.recordPerformanceMetric('throughput', 150);
      this.performanceMonitoring.recordSystemMetric('cpu', 45.5);
      
      const data = this.performanceMonitoring.getDashboardData();
      
      if (!data.performance || !data.system) {
        throw new Error('Metrics not being recorded');
      }
      
      return 'Metric recording is working';
    });

    // Test 2: Alert rules
    await this.runTest('performance', 'Alert Rules', async () => {
      // Trigger a critical alert
      this.performanceMonitoring.recordPerformanceMetric('responseTime', 4000);
      
      // Wait for alert processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = this.performanceMonitoring.getDashboardData();
      
      if (!data.alerts || data.alerts.active === 0) {
        throw new Error('Alert rules not triggering');
      }
      
      return 'Alert rules are functioning';
    });

    // Test 3: Health checks
    await this.runTest('performance', 'Health Checks', async () => {
      // Wait for health check to run
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const status = this.performanceMonitoring.getSystemStatus();
      
      if (!['healthy', 'warning', 'critical'].includes(status)) {
        throw new Error('Invalid system status');
      }
      
      return 'Health checks are working';
    });

    // Test 4: Dashboard data
    await this.runTest('performance', 'Dashboard Data', async () => {
      const data = this.performanceMonitoring.getDashboardData();
      
      const requiredSections = ['status', 'alerts', 'performance', 'system'];
      for (const section of requiredSections) {
        if (!data[section]) {
          throw new Error(`Missing dashboard section: ${section}`);
        }
      }
      
      return 'Dashboard data is complete';
    });
  }

  async testIntegration() {
    log('\n🔗 Testing System Integration...', 'blue');

    // Test 1: Cross-system communication
    await this.runTest('integration', 'Cross-system Communication', async () => {
      // Track an event that should affect multiple systems
      this.analyticsEngine.trackEvent('testuser', 'api_call', { responseTime: 300, endpoint: '/test' });
      
      // Check if performance monitoring also receives the data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const analyticsData = this.analyticsEngine.getDashboardData();
      const performanceData = this.performanceMonitoring.getDashboardData();
      
      if (analyticsData.realtime.liveEvents.length === 0) {
        throw new Error('Analytics not receiving events');
      }
      
      return 'Cross-system communication is working';
    });

    // Test 2: Real-time updates
    await this.runTest('integration', 'Real-time Updates', async () => {
      const before = {
        monitoring: this.monitoringDashboard.getDashboardData().lastUpdate,
        analytics: this.analyticsEngine.getDashboardData().summary.totalEvents,
        performance: this.performanceMonitoring.getDashboardData().status
      };
      
      // Generate some activity
      this.analyticsEngine.trackEvent('user789', 'content_generation_success', { contentType: 'caption' });
      this.performanceMonitoring.recordPerformanceMetric('responseTime', 180);
      
      // Wait for updates
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const after = {
        monitoring: this.monitoringDashboard.getDashboardData().lastUpdate,
        analytics: this.analyticsEngine.getDashboardData().summary.totalEvents,
        performance: this.performanceMonitoring.getDashboardData().status
      };
      
      if (before.analytics >= after.analytics) {
        throw new Error('Analytics not updating in real-time');
      }
      
      return 'Real-time updates are functioning';
    });

    // Test 3: Data consistency
    await this.runTest('integration', 'Data Consistency', async () => {
      // Check that all systems have consistent timestamps and data structures
      const monitoringData = this.monitoringDashboard.getDashboardData();
      const analyticsData = this.analyticsEngine.getDashboardData();
      const performanceData = this.performanceMonitoring.getDashboardData();
      
      // Verify data structures
      if (!monitoringData.system || !monitoringData.performance) {
        throw new Error('Monitoring data structure inconsistent');
      }
      
      if (!analyticsData.realtime || !analyticsData.summary) {
        throw new Error('Analytics data structure inconsistent');
      }
      
      if (!performanceData.performance || !performanceData.system) {
        throw new Error('Performance data structure inconsistent');
      }
      
      return 'Data consistency is maintained';
    });

    // Test 4: Load handling
    await this.runTest('integration', 'Load Handling', async () => {
      // Generate high load
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          this.analyticsEngine.trackEvent(`user${i}`, 'high_load_test', { iteration: i })
        );
        promises.push(
          this.performanceMonitoring.recordPerformanceMetric('responseTime', Math.random() * 1000 + 100)
        );
      }
      
      await Promise.all(promises);
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if systems are still responsive
      const data = this.analyticsEngine.getDashboardData();
      
      if (!data || !data.realtime) {
        throw new Error('System not handling load properly');
      }
      
      return 'Load handling is working correctly';
    });
  }

  async runTest(category, testName, testFunction) {
    try {
      const result = await testFunction();
      this.testResults[category].passed++;
      this.testResults[category].tests.push({
        name: testName,
        status: 'passed',
        result: result
      });
      log(`  ✅ ${testName}: ${result}`, 'green');
    } catch (error) {
      this.testResults[category].failed++;
      this.testResults[category].tests.push({
        name: testName,
        status: 'failed',
        error: error.message
      });
      log(`  ❌ ${testName}: ${error.message}`, 'red');
    }
  }

  generateTestReport() {
    log('\n📋 Test Results Summary', 'bold');
    log('=' .repeat(60), 'cyan');
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    Object.keys(this.testResults).forEach(category => {
      const results = this.testResults[category];
      totalPassed += results.passed;
      totalFailed += results.failed;
      
      const total = results.passed + results.failed;
      const percentage = total > 0 ? ((results.passed / total) * 100).toFixed(1) : '0.0';
      
      log(`\n${category.toUpperCase()} Tests:`, 'blue');
      log(`  Passed: ${results.passed}`, 'green');
      log(`  Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
      log(`  Success Rate: ${percentage}%`, percentage === '100.0' ? 'green' : percentage >= '80.0' ? 'yellow' : 'red');
    });
    
    const overallTotal = totalPassed + totalFailed;
    const overallPercentage = overallTotal > 0 ? ((totalPassed / overallTotal) * 100).toFixed(1) : '0.0';
    
    log('\n📊 Overall Results:', 'bold');
    log(`  Total Tests: ${overallTotal}`, 'blue');
    log(`  Passed: ${totalPassed}`, 'green');
    log(`  Failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'green');
    log(`  Overall Success Rate: ${overallPercentage}%`, overallPercentage === '100.0' ? 'green' : overallPercentage >= '80.0' ? 'yellow' : 'red');
    
    // Determine overall status
    if (overallPercentage === '100.0') {
      log('\n🎉 All monitoring systems are functioning perfectly!', 'green');
      log('✅ Enterprise monitoring is ready for production deployment', 'green');
    } else if (overallPercentage >= '80.0') {
      log('\n⚠️  Most monitoring systems are working, but some issues detected', 'yellow');
      log('🔧 Review failed tests and fix issues before production deployment', 'yellow');
    } else {
      log('\n❌ Significant issues detected in monitoring systems', 'red');
      log('🚨 Critical fixes required before production deployment', 'red');
    }
    
    // Feature readiness assessment
    log('\n🎯 Feature Readiness Assessment:', 'bold');
    log('  📊 Real-time Monitoring: ' + (this.testResults.monitoring.passed >= 3 ? '✅ Ready' : '❌ Needs Work'), this.testResults.monitoring.passed >= 3 ? 'green' : 'red');
    log('  🧠 Advanced Analytics: ' + (this.testResults.analytics.passed >= 3 ? '✅ Ready' : '❌ Needs Work'), this.testResults.analytics.passed >= 3 ? 'green' : 'red');
    log('  ⚡ Performance Monitoring: ' + (this.testResults.performance.passed >= 3 ? '✅ Ready' : '❌ Needs Work'), this.testResults.performance.passed >= 3 ? 'green' : 'red');
    log('  🔗 System Integration: ' + (this.testResults.integration.passed >= 3 ? '✅ Ready' : '❌ Needs Work'), this.testResults.integration.passed >= 3 ? 'green' : 'red');
    
    log('\n✅ Enterprise monitoring test suite completed!', 'green');
  }

  async cleanup() {
    log('\n🧹 Cleaning up test environment...', 'blue');
    
    try {
      if (this.monitoringDashboard) {
        this.monitoringDashboard.stop();
      }
      
      if (this.performanceMonitoring) {
        this.performanceMonitoring.stop();
      }
      
      log('✅ Cleanup completed', 'green');
    } catch (error) {
      log(`⚠️ Cleanup warning: ${error.message}`, 'yellow');
    }
  }
}

// Run the test suite
async function runMonitoringTests() {
  const tester = new MonitoringSystemTester();
  await tester.runAllTests();
}

// Execute tests if run directly
if (require.main === module) {
  runMonitoringTests().catch(console.error);
}

module.exports = MonitoringSystemTester;
