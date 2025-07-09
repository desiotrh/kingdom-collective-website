/**
 * Kingdom Studios App - Performance & Load Testing Suite
 * Validates app performance under massive user load
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = 'http://localhost:3001';

class PerformanceTestSuite {
  constructor() {
    this.results = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      performanceMetrics: {},
      loadTestResults: {},
      memoryResults: {},
      errors: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '📊',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'performance': '⚡'
    }[type] || '📊';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async testApiResponseTime(endpoint, method = 'GET', body = null, expectedTime = 1000) {
    const testName = `API Response Time: ${method} ${endpoint}`;
    this.results.totalTests++;

    try {
      const startTime = Date.now();
      
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      this.results.performanceMetrics[endpoint] = {
        responseTime,
        status: response.status,
        success: response.ok
      };

      if (responseTime <= expectedTime && response.ok) {
        this.results.passedTests++;
        this.log(`${testName}: ${responseTime}ms (✅ Under ${expectedTime}ms)`, 'success');
        return true;
      } else {
        this.results.failedTests++;
        this.log(`${testName}: ${responseTime}ms (❌ Over ${expectedTime}ms or failed)`, 'error');
        return false;
      }
    } catch (error) {
      this.results.failedTests++;
      this.results.errors.push({ test: testName, error: error.message });
      this.log(`${testName}: Failed - ${error.message}`, 'error');
      return false;
    }
  }

  async testConcurrentRequests(endpoint, concurrentUsers = 50, expectedSuccessRate = 95) {
    this.log(`🚀 Testing concurrent load: ${concurrentUsers} users on ${endpoint}`, 'performance');
    
    const requests = Array.from({ length: concurrentUsers }, async (_, index) => {
      const startTime = Date.now();
      
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const endTime = Date.now();
        
        return {
          success: response.ok,
          responseTime: endTime - startTime,
          status: response.status,
          userIndex: index
        };
      } catch (error) {
        return {
          success: false,
          responseTime: Date.now() - startTime,
          error: error.message,
          userIndex: index
        };
      }
    });

    const results = await Promise.all(requests);
    
    const successfulRequests = results.filter(r => r.success).length;
    const successRate = (successfulRequests / concurrentUsers) * 100;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
    const maxResponseTime = Math.max(...results.map(r => r.responseTime));
    const minResponseTime = Math.min(...results.map(r => r.responseTime));

    this.results.loadTestResults[endpoint] = {
      concurrentUsers,
      successfulRequests,
      successRate,
      avgResponseTime,
      maxResponseTime,
      minResponseTime
    };

    this.log(`Load Test Results for ${endpoint}:`, 'performance');
    this.log(`  Success Rate: ${successRate.toFixed(1)}% (${successfulRequests}/${concurrentUsers})`, 'info');
    this.log(`  Avg Response Time: ${avgResponseTime.toFixed(0)}ms`, 'info');
    this.log(`  Min/Max Response Time: ${minResponseTime}ms / ${maxResponseTime}ms`, 'info');

    if (successRate >= expectedSuccessRate) {
      this.log(`✅ Load test passed: ${successRate.toFixed(1)}% success rate`, 'success');
      return true;
    } else {
      this.log(`❌ Load test failed: ${successRate.toFixed(1)}% success rate (expected ${expectedSuccessRate}%)`, 'error');
      return false;
    }
  }

  async testContentGenerationUnderLoad() {
    this.log('🤖 Testing content generation under load...', 'performance');
    
    // First, register a test user
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'loadtest@example.com',
        password: 'LoadTest123!',
        name: 'Load Test User',
        faithMode: true
      })
    });

    if (!registerResponse.ok) {
      this.log('❌ Failed to register test user for load testing', 'error');
      return false;
    }

    const { token } = await registerResponse.json();

    // Test concurrent content generation
    const concurrentGenerations = 20;
    const generationRequests = Array.from({ length: concurrentGenerations }, async (_, index) => {
      const startTime = Date.now();
      
      try {
        const response = await fetch(`${API_BASE_URL}/content/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            contentType: 'post',
            platform: 'instagram',
            prompt: `Test content generation ${index + 1}`,
            tone: 'inspirational',
            length: 'medium'
          })
        });

        const endTime = Date.now();
        const data = await response.json();

        return {
          success: response.ok,
          responseTime: endTime - startTime,
          contentLength: data.content ? data.content.length : 0,
          index
        };
      } catch (error) {
        return {
          success: false,
          responseTime: Date.now() - startTime,
          error: error.message,
          index
        };
      }
    });

    const results = await Promise.all(generationRequests);
    
    const successfulGenerations = results.filter(r => r.success).length;
    const successRate = (successfulGenerations / concurrentGenerations) * 100;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    this.results.loadTestResults['content_generation'] = {
      concurrentGenerations,
      successfulGenerations,
      successRate,
      avgResponseTime
    };

    this.log(`Content Generation Load Test:`, 'performance');
    this.log(`  Success Rate: ${successRate.toFixed(1)}% (${successfulGenerations}/${concurrentGenerations})`, 'info');
    this.log(`  Avg Generation Time: ${avgResponseTime.toFixed(0)}ms`, 'info');

    return successRate >= 90; // Expect 90% success rate for content generation
  }

  async testMemoryUsage() {
    this.log('🧠 Testing memory usage patterns...', 'performance');
    
    const memoryBefore = process.memoryUsage();
    
    // Simulate heavy operations
    const heavyOperations = Array.from({ length: 100 }, async (_, index) => {
      // Simulate content generation with large responses
      const largeContent = 'A'.repeat(10000); // 10KB content
      const mockResponse = {
        content: largeContent,
        metadata: { index, timestamp: Date.now() }
      };
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 10));
      
      return mockResponse;
    });

    await Promise.all(heavyOperations);
    
    const memoryAfter = process.memoryUsage();
    
    const memoryIncrease = {
      rss: memoryAfter.rss - memoryBefore.rss,
      heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
      heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal
    };

    this.results.memoryResults = {
      before: memoryBefore,
      after: memoryAfter,
      increase: memoryIncrease
    };

    this.log(`Memory Usage Test:`, 'performance');
    this.log(`  RSS Increase: ${Math.round(memoryIncrease.rss / 1024 / 1024)}MB`, 'info');
    this.log(`  Heap Used Increase: ${Math.round(memoryIncrease.heapUsed / 1024 / 1024)}MB`, 'info');
    this.log(`  Heap Total Increase: ${Math.round(memoryIncrease.heapTotal / 1024 / 1024)}MB`, 'info');

    // Memory increase should be reasonable (under 50MB for test operations)
    const heapIncreaseMB = memoryIncrease.heapUsed / 1024 / 1024;
    return heapIncreaseB < 50;
  }

  async testDatabasePerformance() {
    this.log('🗄️ Testing database operation performance...', 'performance');
    
    const dbTests = [
      { endpoint: '/content/templates', operation: 'Template Retrieval' },
      { endpoint: '/content/templates/categories', operation: 'Category Listing' }
    ];

    let allPassed = true;

    for (const test of dbTests) {
      const passed = await this.testApiResponseTime(test.endpoint, 'GET', null, 500);
      if (!passed) allPassed = false;
    }

    return allPassed;
  }

  async testApiScalability() {
    this.log('📈 Testing API scalability...', 'performance');
    
    const scalabilityTests = [
      { endpoint: '/health', users: 100, expectedSuccessRate: 99 },
      { endpoint: '/system/status', users: 50, expectedSuccessRate: 95 },
      { endpoint: '/content/templates', users: 75, expectedSuccessRate: 95 }
    ];

    let allPassed = true;

    for (const test of scalabilityTests) {
      const passed = await this.testConcurrentRequests(test.endpoint, test.users, test.expectedSuccessRate);
      if (!passed) allPassed = false;
      
      // Wait between tests to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return allPassed;
  }

  async runPerformanceTestSuite() {
    this.log('🚀 Starting Kingdom Studios Performance Test Suite', 'performance');
    this.log('='.repeat(60), 'info');

    const startTime = Date.now();

    // 1. Basic API Response Time Tests
    this.log('\n📊 Phase 1: API Response Time Tests', 'performance');
    await this.testApiResponseTime('/health', 'GET', null, 500);
    await this.testApiResponseTime('/system/status', 'GET', null, 1000);
    await this.testApiResponseTime('/content/templates', 'GET', null, 1000);

    // 2. Database Performance Tests
    this.log('\n🗄️ Phase 2: Database Performance Tests', 'performance');
    await this.testDatabasePerformance();

    // 3. Load Testing
    this.log('\n🚀 Phase 3: Load & Scalability Tests', 'performance');
    await this.testApiScalability();

    // 4. Content Generation Under Load
    this.log('\n🤖 Phase 4: Content Generation Load Tests', 'performance');
    await this.testContentGenerationUnderLoad();

    // 5. Memory Usage Tests
    this.log('\n🧠 Phase 5: Memory Usage Tests', 'performance');
    await this.testMemoryUsage();

    const endTime = Date.now();
    const totalTestTime = endTime - startTime;

    // Generate final report
    this.generatePerformanceReport(totalTestTime);
  }

  generatePerformanceReport(totalTestTime) {
    this.log('\n📋 PERFORMANCE TEST SUMMARY', 'performance');
    this.log('='.repeat(60), 'info');
    
    const successRate = (this.results.passedTests / this.results.totalTests) * 100;
    
    this.log(`Total Tests: ${this.results.totalTests}`, 'info');
    this.log(`Passed: ${this.results.passedTests} ✅`, 'success');
    this.log(`Failed: ${this.results.failedTests} ❌`, 'error');
    this.log(`Success Rate: ${successRate.toFixed(1)}%`, successRate >= 90 ? 'success' : 'warning');
    this.log(`Total Test Time: ${totalTestTime}ms`, 'info');

    this.log('\n⚡ Performance Metrics:', 'performance');
    Object.entries(this.results.performanceMetrics).forEach(([endpoint, metrics]) => {
      this.log(`  ${endpoint}: ${metrics.responseTime}ms (${metrics.success ? '✅' : '❌'})`, 'info');
    });

    this.log('\n🚀 Load Test Results:', 'performance');
    Object.entries(this.results.loadTestResults).forEach(([endpoint, results]) => {
      this.log(`  ${endpoint}:`, 'info');
      this.log(`    Success Rate: ${results.successRate.toFixed(1)}%`, 'info');
      this.log(`    Avg Response: ${results.avgResponseTime.toFixed(0)}ms`, 'info');
    });

    if (this.results.memoryResults.increase) {
      this.log('\n🧠 Memory Usage:', 'performance');
      this.log(`  Heap Increase: ${Math.round(this.results.memoryResults.increase.heapUsed / 1024 / 1024)}MB`, 'info');
    }

    // Performance verdict
    this.log('\n🎯 PERFORMANCE VERDICT:', 'performance');
    
    if (successRate >= 95) {
      this.log('🚀 EXCELLENT: App is ready for massive scale!', 'success');
    } else if (successRate >= 85) {
      this.log('✅ GOOD: App performs well with minor optimizations needed', 'success');
    } else if (successRate >= 70) {
      this.log('⚠️ NEEDS IMPROVEMENT: Several performance issues to address', 'warning');
    } else {
      this.log('❌ CRITICAL: Major performance issues must be fixed', 'error');
    }

    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      totalTestTime,
      successRate,
      ...this.results
    };

    const fs = require('fs');
    const reportFileName = `performance-report-${Date.now()}.json`;
    
    try {
      fs.writeFileSync(reportFileName, JSON.stringify(reportData, null, 2));
      this.log(`\n📄 Detailed report saved: ${reportFileName}`, 'info');
    } catch (error) {
      this.log(`\n⚠️ Could not save report: ${error.message}`, 'warning');
    }

    this.log('\n🎉 Performance testing complete!', 'success');
  }
}

// Run the performance test suite
const performanceTest = new PerformanceTestSuite();
performanceTest.runPerformanceTestSuite().catch(error => {
  console.error('💥 Performance testing failed:', error);
  process.exit(1);
});
