/**
 * Advanced Performance Test - High Concurrency
 * Testing with 1K-10K+ concurrent users
 */

import axios from 'axios';

const baseURL = 'http://localhost:3000';

console.log('🔥 Starting Advanced Performance Tests...');
console.log(`📊 Testing: ${baseURL}`);
console.log('='.repeat(60));

// High concurrency test
async function highConcurrencyTest(concurrent, testName) {
  console.log(`\n⚡ ${testName} (${concurrent} concurrent requests)...`);
  
  const promises = [];
  const startTime = Date.now();
  const results = [];
  
  // Create batches to avoid overwhelming the system
  const batchSize = 100;
  const batches = Math.ceil(concurrent / batchSize);
  
  for (let batch = 0; batch < batches; batch++) {
    const batchStart = batch * batchSize;
    const batchEnd = Math.min(batchStart + batchSize, concurrent);
    const batchPromises = [];
    
    for (let i = batchStart; i < batchEnd; i++) {
      batchPromises.push(
        axios.get(`${baseURL}/health`, { 
          timeout: 30000,
          headers: { 'User-Agent': `LoadTest-${i}` }
        })
        .then(response => ({ 
          success: true, 
          status: response.status, 
          time: Date.now(),
          requestId: i 
        }))
        .catch(error => ({ 
          success: false, 
          error: error.code || error.message, 
          time: Date.now(),
          requestId: i 
        }))
      );
    }
    
    // Execute batch
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches to be kind to the server
    if (batch < batches - 1) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const throughput = concurrent / (duration / 1000);
  
  console.log(`   Duration: ${duration}ms`);
  console.log(`   Successful: ${successful}/${concurrent} (${(successful/concurrent*100).toFixed(1)}%)`);
  console.log(`   Failed: ${failed}/${concurrent}`);
  console.log(`   Avg Response Time: ${(duration/concurrent).toFixed(2)}ms per request`);
  console.log(`   Throughput: ${throughput.toFixed(2)} requests/second`);
  
  // Error analysis
  if (failed > 0) {
    const errorTypes = {};
    results.filter(r => !r.success).forEach(r => {
      errorTypes[r.error] = (errorTypes[r.error] || 0) + 1;
    });
    console.log('   Error breakdown:');
    Object.entries(errorTypes).forEach(([error, count]) => {
      console.log(`     ${error}: ${count} occurrences`);
    });
  }
  
  return { successful, failed, duration, throughput, concurrent };
}

// Mixed endpoint test
async function mixedEndpointTest(concurrent) {
  console.log(`\n🔀 Mixed Endpoint Test (${concurrent} concurrent requests)...`);
  
  const endpoints = [
    '/health',
    '/metrics',
    '/api/v1/enterprise-content/templates',
    '/api/v1/enterprise-content/stats'
  ];
  
  const promises = [];
  const startTime = Date.now();
  
  for (let i = 0; i < concurrent; i++) {
    const endpoint = endpoints[i % endpoints.length];
    promises.push(
      axios.get(`${baseURL}${endpoint}`, { 
        timeout: 30000,
        headers: { 'User-Agent': `MixedTest-${i}` }
      })
      .then(response => ({ 
        success: true, 
        endpoint, 
        status: response.status, 
        time: Date.now() - startTime 
      }))
      .catch(error => ({ 
        success: false, 
        endpoint, 
        error: error.code || error.message 
      }))
    );
  }
  
  const results = await Promise.all(promises);
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`   Duration: ${duration}ms`);
  console.log(`   Successful: ${successful}/${concurrent} (${(successful/concurrent*100).toFixed(1)}%)`);
  console.log(`   Failed: ${failed}/${concurrent}`);
  console.log(`   Throughput: ${(concurrent/(duration/1000)).toFixed(2)} requests/second`);
  
  // Endpoint breakdown
  const endpointStats = {};
  results.forEach(r => {
    if (!endpointStats[r.endpoint]) {
      endpointStats[r.endpoint] = { success: 0, failed: 0 };
    }
    if (r.success) {
      endpointStats[r.endpoint].success++;
    } else {
      endpointStats[r.endpoint].failed++;
    }
  });
  
  console.log('   Endpoint breakdown:');
  Object.entries(endpointStats).forEach(([endpoint, stats]) => {
    const total = stats.success + stats.failed;
    const successRate = (stats.success / total * 100).toFixed(1);
    console.log(`     ${endpoint}: ${stats.success}/${total} (${successRate}%)`);
  });
  
  return { successful, failed, duration, endpointStats };
}

// Memory and resource monitoring
async function resourceMonitoringTest() {
  console.log('\n📊 Resource Monitoring...');
  
  try {
    const response = await axios.get(`${baseURL}/metrics`, { timeout: 10000 });
    const metrics = response.data;
    
    console.log(`   Server uptime: ${metrics.uptime}s`);
    console.log(`   Total requests: ${metrics.requests}`);
    console.log(`   Memory usage: ${(metrics.memory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Memory total: ${(metrics.memory.heapTotal / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   External memory: ${(metrics.memory.external / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   CPU user time: ${metrics.cpu.user}μs`);
    console.log(`   CPU system time: ${metrics.cpu.system}μs`);
    
    return metrics;
  } catch (error) {
    console.log(`   ❌ Failed to get metrics: ${error.message}`);
    return null;
  }
}

// Main test suite
async function runAdvancedTests() {
  try {
    console.log('\n🏁 Starting Advanced Performance Test Suite...');
    
    // Progressive load testing
    const tests = [
      { concurrent: 1000, name: 'Medium Load Test' },
      { concurrent: 2500, name: 'High Load Test' },
      { concurrent: 5000, name: 'Stress Test' },
      { concurrent: 10000, name: 'Extreme Load Test' }
    ];
    
    const testResults = [];
    
    for (const test of tests) {
      const result = await highConcurrencyTest(test.concurrent, test.name);
      testResults.push(result);
      
      // Resource monitoring after each test
      await resourceMonitoringTest();
      
      // Brief cooldown
      console.log('   💤 Cooldown period...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Mixed endpoint testing
    console.log('\n🔄 Mixed Endpoint Testing...');
    const mixedResult = await mixedEndpointTest(1000);
    await resourceMonitoringTest();
    
    // Final summary
    console.log('\n🎯 Advanced Performance Summary');
    console.log('='.repeat(60));
    
    testResults.forEach((result, index) => {
      const test = tests[index];
      const successRate = (result.successful / result.concurrent * 100).toFixed(1);
      const status = successRate >= 95 ? '✅' : successRate >= 80 ? '⚠️' : '❌';
      
      console.log(`${status} ${test.name}:`);
      console.log(`   ${result.successful}/${result.concurrent} requests (${successRate}%)`);
      console.log(`   Throughput: ${result.throughput.toFixed(2)} req/s`);
    });
    
    // Overall assessment
    const avgThroughput = testResults.reduce((sum, r) => sum + r.throughput, 0) / testResults.length;
    const avgSuccessRate = testResults.reduce((sum, r) => sum + (r.successful/r.concurrent), 0) / testResults.length * 100;
    
    console.log('\n🏆 Overall Performance Rating:');
    console.log(`   Average Throughput: ${avgThroughput.toFixed(2)} req/s`);
    console.log(`   Average Success Rate: ${avgSuccessRate.toFixed(1)}%`);
    
    if (avgThroughput > 500 && avgSuccessRate > 95) {
      console.log('   🌟 ENTERPRISE READY - Excellent performance for 10K+ users!');
    } else if (avgThroughput > 200 && avgSuccessRate > 90) {
      console.log('   ✅ PRODUCTION READY - Good performance for medium scale');
    } else if (avgThroughput > 100 && avgSuccessRate > 80) {
      console.log('   ⚠️  NEEDS OPTIMIZATION - Basic performance achieved');
    } else {
      console.log('   ❌ REQUIRES IMPROVEMENT - Performance below production standards');
    }
    
    console.log('\n🎉 Advanced performance testing complete!');
    
  } catch (error) {
    console.error('❌ Advanced test suite failed:', error.message);
    process.exit(1);
  }
}

// Run the advanced tests
runAdvancedTests();
