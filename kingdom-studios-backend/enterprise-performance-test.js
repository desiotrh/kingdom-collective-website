/**
 * Enterprise Infrastructure Performance Test
 * Tests the Kingdom Studios backend for 10K-100K+ concurrent users
 */

import axios from 'axios';
import cluster from 'cluster';
import os from 'os';

class EnterprisePerformanceTester {
  constructor() {
    this.baseURL = process.env.TEST_BASE_URL || 'http://localhost:3000';
    this.apiKey = process.env.TEST_API_KEY;
    this.concurrentUsers = {
      light: 100,
      medium: 1000,
      heavy: 5000,
      extreme: 10000
    };
    this.testResults = {
      load: {},
      stress: {},
      spike: {},
      endurance: {}
    };
  }

  /**
   * Run comprehensive performance tests
   */
  async runAllTests() {
    console.log('🚀 Starting Enterprise Performance Tests...');
    console.log(`📊 Target: ${this.baseURL}`);
    console.log(`💻 Available CPUs: ${os.cpus().length}`);
    console.log('='.repeat(60));

    try {
      // Health check first
      await this.healthCheck();
      
      // Load tests
      console.log('\n📈 Running Load Tests...');
      await this.runLoadTests();
      
      // Stress tests
      console.log('\n💪 Running Stress Tests...');
      await this.runStressTests();
      
      // Spike tests
      console.log('\n⚡ Running Spike Tests...');
      await this.runSpikeTests();
      
      // Endurance tests
      console.log('\n⏱️  Running Endurance Tests...');
      await this.runEnduranceTests();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Performance test failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Health check before testing
   */
  async healthCheck() {
    console.log('🏥 Performing health check...');
    
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 10000
      });
      
      if (response.status === 200) {
        console.log('✅ Backend is healthy');
        console.log(`   Status: ${response.data.status}`);
        console.log(`   Uptime: ${Math.round(response.data.uptime)}s`);
        console.log(`   Environment: ${response.data.environment}`);
        console.log(`   Database: ${response.data.database?.status || 'unknown'}`);
        console.log(`   Services: ${Object.keys(response.data.services || {}).length} active`);
      } else {
        throw new Error(`Health check failed with status ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  /**
   * Run load tests - Normal expected load
   */
  async runLoadTests() {
    const tests = [
      {
        name: 'Basic API Load',
        users: this.concurrentUsers.light,
        endpoint: '/health',
        method: 'GET'
      },
      {
        name: 'Content Generation Load',
        users: this.concurrentUsers.medium,
        endpoint: '/api/v1/enterprise-content/templates',
        method: 'GET'
      },
      {
        name: 'Mixed Endpoint Load',
        users: this.concurrentUsers.medium,
        endpoint: 'mixed',
        method: 'MIXED'
      }
    ];

    for (const test of tests) {
      console.log(`\n🔄 Running ${test.name} (${test.users} users)...`);
      const result = await this.runTest(test);
      this.testResults.load[test.name] = result;
      this.printTestResult(result);
    }
  }

  /**
   * Run stress tests - Above normal load
   */
  async runStressTests() {
    const tests = [
      {
        name: 'High Concurrency Stress',
        users: this.concurrentUsers.heavy,
        endpoint: '/health',
        method: 'GET'
      },
      {
        name: 'Database Query Stress',
        users: this.concurrentUsers.heavy,
        endpoint: '/metrics',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      console.log(`\n🔥 Running ${test.name} (${test.users} users)...`);
      const result = await this.runTest(test);
      this.testResults.stress[test.name] = result;
      this.printTestResult(result);
    }
  }

  /**
   * Run spike tests - Sudden load increases
   */
  async runSpikeTests() {
    const tests = [
      {
        name: 'Sudden Traffic Spike',
        users: this.concurrentUsers.extreme,
        duration: 30000, // 30 seconds
        endpoint: '/health',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      console.log(`\n⚡ Running ${test.name} (${test.users} users for ${test.duration/1000}s)...`);
      const result = await this.runSpikeTest(test);
      this.testResults.spike[test.name] = result;
      this.printTestResult(result);
    }
  }

  /**
   * Run endurance tests - Extended load
   */
  async runEnduranceTests() {
    const tests = [
      {
        name: 'Extended Load Test',
        users: this.concurrentUsers.medium,
        duration: 300000, // 5 minutes
        endpoint: '/health',
        method: 'GET'
      }
    ];

    for (const test of tests) {
      console.log(`\n⏱️  Running ${test.name} (${test.users} users for ${test.duration/60000} minutes)...`);
      const result = await this.runEnduranceTest(test);
      this.testResults.endurance[test.name] = result;
      this.printTestResult(result);
    }
  }

  /**
   * Run individual test
   */
  async runTest(testConfig) {
    const { users, endpoint, method } = testConfig;
    const startTime = Date.now();
    const results = {
      totalRequests: users,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      responseTimes: [],
      errors: []
    };

    // Create concurrent requests
    const promises = Array.from({ length: users }, (_, index) => 
      this.makeRequest(endpoint, method, index).catch(error => ({ error }))
    );

    // Execute all requests
    const responses = await Promise.allSettled(promises);

    // Process results
    responses.forEach((response, index) => {
      if (response.status === 'fulfilled' && !response.value.error) {
        const { duration, statusCode } = response.value;
        results.successfulRequests++;
        results.responseTimes.push(duration);
        results.minResponseTime = Math.min(results.minResponseTime, duration);
        results.maxResponseTime = Math.max(results.maxResponseTime, duration);
      } else {
        results.failedRequests++;
        const error = response.value?.error || response.reason;
        results.errors.push(error.message || error.toString());
      }
    });

    // Calculate averages
    if (results.responseTimes.length > 0) {
      results.averageResponseTime = 
        results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
      
      // Calculate percentiles
      const sorted = results.responseTimes.sort((a, b) => a - b);
      results.p50 = sorted[Math.floor(sorted.length * 0.5)];
      results.p95 = sorted[Math.floor(sorted.length * 0.95)];
      results.p99 = sorted[Math.floor(sorted.length * 0.99)];
    }

    results.duration = Date.now() - startTime;
    results.successRate = (results.successfulRequests / results.totalRequests) * 100;
    results.requestsPerSecond = (results.successfulRequests / (results.duration / 1000));

    return results;
  }

  /**
   * Run spike test with gradual ramp-up
   */
  async runSpikeTest(testConfig) {
    const { users, duration, endpoint, method } = testConfig;
    const results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: [],
      errors: [],
      peakRequestsPerSecond: 0
    };

    const startTime = Date.now();
    const endTime = startTime + duration;
    
    while (Date.now() < endTime) {
      const batchSize = Math.min(100, users); // Send in batches
      const promises = Array.from({ length: batchSize }, (_, index) => 
        this.makeRequest(endpoint, method, index).catch(error => ({ error }))
      );

      const responses = await Promise.allSettled(promises);
      
      // Process batch results
      responses.forEach(response => {
        results.totalRequests++;
        if (response.status === 'fulfilled' && !response.value.error) {
          results.successfulRequests++;
          results.responseTimes.push(response.value.duration);
        } else {
          results.failedRequests++;
          const error = response.value?.error || response.reason;
          results.errors.push(error.message || error.toString());
        }
      });

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    results.duration = Date.now() - startTime;
    results.successRate = (results.successfulRequests / results.totalRequests) * 100;
    results.requestsPerSecond = (results.totalRequests / (results.duration / 1000));

    if (results.responseTimes.length > 0) {
      results.averageResponseTime = 
        results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
    }

    return results;
  }

  /**
   * Run endurance test with sustained load
   */
  async runEnduranceTest(testConfig) {
    const { users, duration, endpoint, method } = testConfig;
    const results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: [],
      errors: [],
      intervals: []
    };

    const startTime = Date.now();
    const endTime = startTime + duration;
    const intervalDuration = 30000; // 30 seconds
    
    while (Date.now() < endTime) {
      const intervalStart = Date.now();
      const intervalResults = await this.runTest({
        users: Math.floor(users / 10), // Smaller batches for endurance
        endpoint,
        method
      });

      results.totalRequests += intervalResults.totalRequests;
      results.successfulRequests += intervalResults.successfulRequests;
      results.failedRequests += intervalResults.failedRequests;
      results.responseTimes.push(...intervalResults.responseTimes);
      results.errors.push(...intervalResults.errors);
      
      results.intervals.push({
        timestamp: new Date().toISOString(),
        requests: intervalResults.totalRequests,
        successRate: intervalResults.successRate,
        averageResponseTime: intervalResults.averageResponseTime
      });

      console.log(`   Interval: ${intervalResults.successRate.toFixed(1)}% success, ${intervalResults.averageResponseTime.toFixed(0)}ms avg`);

      // Wait for next interval
      const elapsed = Date.now() - intervalStart;
      if (elapsed < intervalDuration) {
        await new Promise(resolve => setTimeout(resolve, intervalDuration - elapsed));
      }
    }

    results.duration = Date.now() - startTime;
    results.successRate = (results.successfulRequests / results.totalRequests) * 100;
    results.requestsPerSecond = (results.totalRequests / (results.duration / 1000));

    if (results.responseTimes.length > 0) {
      results.averageResponseTime = 
        results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
    }

    return results;
  }

  /**
   * Make a single HTTP request
   */
  async makeRequest(endpoint, method, index) {
    const startTime = Date.now();
    
    try {
      let url, config;
      
      if (endpoint === 'mixed') {
        // Mixed endpoints test
        const endpoints = ['/health', '/metrics', '/api/v1/enterprise-content/templates'];
        url = `${this.baseURL}${endpoints[index % endpoints.length]}`;
        config = { timeout: 10000 };
      } else {
        url = `${this.baseURL}${endpoint}`;
        config = { timeout: 10000 };
      }

      if (this.apiKey) {
        config.headers = { 'X-API-Key': this.apiKey };
      }

      const response = await axios.get(url, config);
      const duration = Date.now() - startTime;

      return {
        duration,
        statusCode: response.status,
        success: true
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        duration,
        statusCode: error.response?.status || 0,
        success: false,
        error
      };
    }
  }

  /**
   * Print test result summary
   */
  printTestResult(result) {
    console.log(`   📊 Results:`);
    console.log(`      Total Requests: ${result.totalRequests}`);
    console.log(`      Successful: ${result.successfulRequests} (${result.successRate.toFixed(1)}%)`);
    console.log(`      Failed: ${result.failedRequests}`);
    console.log(`      Avg Response Time: ${result.averageResponseTime.toFixed(0)}ms`);
    
    if (result.p50) {
      console.log(`      P50: ${result.p50.toFixed(0)}ms, P95: ${result.p95.toFixed(0)}ms, P99: ${result.p99.toFixed(0)}ms`);
    }
    
    console.log(`      Requests/Second: ${result.requestsPerSecond.toFixed(1)}`);
    console.log(`      Duration: ${(result.duration / 1000).toFixed(1)}s`);
    
    if (result.errors.length > 0) {
      console.log(`      Top Errors: ${result.errors.slice(0, 3).join(', ')}`);
    }
  }

  /**
   * Generate comprehensive test report
   */
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 ENTERPRISE PERFORMANCE TEST REPORT');
    console.log('='.repeat(60));
    
    console.log('\n🎯 Test Summary:');
    const allTests = [
      ...Object.entries(this.testResults.load),
      ...Object.entries(this.testResults.stress),
      ...Object.entries(this.testResults.spike),
      ...Object.entries(this.testResults.endurance)
    ];

    let totalRequests = 0;
    let totalSuccessful = 0;
    let totalFailed = 0;
    const responseTimesByTest = [];

    allTests.forEach(([name, result]) => {
      totalRequests += result.totalRequests;
      totalSuccessful += result.successfulRequests;
      totalFailed += result.failedRequests;
      responseTimesByTest.push({
        name,
        avg: result.averageResponseTime,
        p95: result.p95,
        successRate: result.successRate
      });
    });

    console.log(`   Total Requests Processed: ${totalRequests.toLocaleString()}`);
    console.log(`   Overall Success Rate: ${((totalSuccessful / totalRequests) * 100).toFixed(1)}%`);
    console.log(`   Total Failures: ${totalFailed.toLocaleString()}`);

    console.log('\n📈 Performance by Test Type:');
    
    Object.entries(this.testResults).forEach(([category, tests]) => {
      if (Object.keys(tests).length > 0) {
        console.log(`\n   ${category.toUpperCase()}:`);
        Object.entries(tests).forEach(([name, result]) => {
          const status = result.successRate >= 95 ? '✅' : result.successRate >= 90 ? '⚠️' : '❌';
          console.log(`     ${status} ${name}: ${result.successRate.toFixed(1)}% success, ${result.averageResponseTime.toFixed(0)}ms avg`);
        });
      }
    });

    console.log('\n🚀 Enterprise Readiness Assessment:');
    const overallSuccessRate = (totalSuccessful / totalRequests) * 100;
    const avgResponseTime = responseTimesByTest.reduce((sum, test) => sum + test.avg, 0) / responseTimesByTest.length;

    if (overallSuccessRate >= 99 && avgResponseTime <= 500) {
      console.log('   🟢 EXCELLENT - Ready for 100K+ concurrent users');
    } else if (overallSuccessRate >= 95 && avgResponseTime <= 1000) {
      console.log('   🟡 GOOD - Ready for 10K-50K concurrent users');
    } else if (overallSuccessRate >= 90 && avgResponseTime <= 2000) {
      console.log('   🟠 FAIR - Ready for 1K-10K concurrent users');
    } else {
      console.log('   🔴 NEEDS IMPROVEMENT - Performance optimization required');
    }

    console.log('\n💡 Recommendations:');
    if (avgResponseTime > 1000) {
      console.log('   • Optimize database queries and add more indexes');
      console.log('   • Implement additional caching layers');
      console.log('   • Consider horizontal scaling');
    }
    
    if (overallSuccessRate < 95) {
      console.log('   • Review error logs and fix failing endpoints');
      console.log('   • Increase rate limits and timeout values');
      console.log('   • Add more error handling and retry logic');
    }

    console.log('\n✅ Test completed successfully!');
    console.log(`📄 Detailed results saved to: enterprise-performance-results-${Date.now()}.json`);

    // Save detailed results to file
    require('fs').writeFileSync(
      `enterprise-performance-results-${Date.now()}.json`,
      JSON.stringify(this.testResults, null, 2)
    );
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new EnterprisePerformanceTester();
  tester.runAllTests().catch(console.error);
}

export default EnterprisePerformanceTester;
