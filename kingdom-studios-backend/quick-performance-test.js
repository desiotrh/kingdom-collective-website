/**
 * Simple Performance Test Runner
 * Quick validation of server performance
 */

import axios from 'axios';

const baseURL = 'http://localhost:3000';
const testResults = {};

console.log('🚀 Starting Quick Performance Validation...');
console.log(`📊 Testing: ${baseURL}`);
console.log('='.repeat(50));

// Health check
async function healthCheck() {
  console.log('\n🏥 Health Check...');
  try {
    const response = await axios.get(`${baseURL}/health`, { timeout: 5000 });
    console.log('✅ Server is healthy');
    console.log(`   Status: ${response.data.status}`);
    console.log(`   Uptime: ${response.data.uptime}s`);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

// Basic load test
async function basicLoadTest() {
  console.log('\n📈 Basic Load Test (100 concurrent requests)...');
  
  const promises = [];
  const startTime = Date.now();
  
  for (let i = 0; i < 100; i++) {
    promises.push(
      axios.get(`${baseURL}/health`, { timeout: 10000 })
        .then(response => ({ success: true, status: response.status, time: Date.now() }))
        .catch(error => ({ success: false, error: error.message, time: Date.now() }))
    );
  }
  
  const results = await Promise.all(promises);
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`   Duration: ${duration}ms`);
  console.log(`   Successful: ${successful}/100 (${(successful/100*100).toFixed(1)}%)`);
  console.log(`   Failed: ${failed}/100`);
  console.log(`   Avg Response Time: ${(duration/100).toFixed(2)}ms per request`);
  console.log(`   Throughput: ${(100/(duration/1000)).toFixed(2)} requests/second`);
  
  return { successful, failed, duration, throughput: 100/(duration/1000) };
}

// API endpoint test
async function apiEndpointTest() {
  console.log('\n🔌 API Endpoint Test...');
  
  const endpoints = [
    '/health',
    '/metrics',
    '/api/v1/enterprise-content/templates',
    '/api/v1/enterprise-content/stats'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${baseURL}${endpoint}`, { timeout: 5000 });
      const duration = Date.now() - startTime;
      
      console.log(`   ✅ ${endpoint}: ${response.status} (${duration}ms)`);
    } catch (error) {
      console.log(`   ❌ ${endpoint}: ${error.response?.status || 'Error'} - ${error.message}`);
    }
  }
}

// Stress test
async function stressTest() {
  console.log('\n💪 Stress Test (500 concurrent requests)...');
  
  const promises = [];
  const startTime = Date.now();
  
  for (let i = 0; i < 500; i++) {
    promises.push(
      axios.get(`${baseURL}/health`, { timeout: 15000 })
        .then(response => ({ success: true, status: response.status }))
        .catch(error => ({ success: false, error: error.message }))
    );
  }
  
  const results = await Promise.all(promises);
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`   Duration: ${duration}ms`);
  console.log(`   Successful: ${successful}/500 (${(successful/500*100).toFixed(1)}%)`);
  console.log(`   Failed: ${failed}/500`);
  console.log(`   Avg Response Time: ${(duration/500).toFixed(2)}ms per request`);
  console.log(`   Throughput: ${(500/(duration/1000)).toFixed(2)} requests/second`);
  
  return { successful, failed, duration, throughput: 500/(duration/1000) };
}

// Content generation test
async function contentGenerationTest() {
  console.log('\n🎨 Content Generation Test...');
  
  try {
    const startTime = Date.now();
    const response = await axios.post(`${baseURL}/api/v1/enterprise-content/generate`, {
      type: 'test',
      parameters: { theme: 'performance' }
    }, { timeout: 10000 });
    
    const duration = Date.now() - startTime;
    console.log(`   ✅ Content generated: ${response.status} (${duration}ms)`);
    console.log(`   Content ID: ${response.data.id}`);
    console.log(`   Processing Time: ${response.data.processingTime}ms`);
    
    return { success: true, duration, processingTime: response.data.processingTime };
  } catch (error) {
    console.log(`   ❌ Content generation failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runTests() {
  try {
    // Health check first
    const isHealthy = await healthCheck();
    if (!isHealthy) {
      console.log('❌ Server is not healthy, aborting tests');
      process.exit(1);
    }
    
    // Run tests
    const loadResult = await basicLoadTest();
    await apiEndpointTest();
    const stressResult = await stressTest();
    const contentResult = await contentGenerationTest();
    
    // Summary
    console.log('\n📊 Test Summary');
    console.log('='.repeat(50));
    console.log(`✅ Basic Load Test: ${loadResult.successful}/100 requests successful`);
    console.log(`   Throughput: ${loadResult.throughput.toFixed(2)} req/s`);
    console.log(`✅ Stress Test: ${stressResult.successful}/500 requests successful`);
    console.log(`   Throughput: ${stressResult.throughput.toFixed(2)} req/s`);
    console.log(`✅ Content Generation: ${contentResult.success ? 'Success' : 'Failed'}`);
    
    // Performance assessment
    console.log('\n🎯 Performance Assessment');
    console.log('='.repeat(50));
    
    if (loadResult.throughput > 50) {
      console.log('✅ Load Test: EXCELLENT (>50 req/s)');
    } else if (loadResult.throughput > 20) {
      console.log('⚠️  Load Test: GOOD (20-50 req/s)');
    } else {
      console.log('❌ Load Test: NEEDS IMPROVEMENT (<20 req/s)');
    }
    
    if (stressResult.throughput > 30) {
      console.log('✅ Stress Test: EXCELLENT (>30 req/s)');
    } else if (stressResult.throughput > 15) {
      console.log('⚠️  Stress Test: GOOD (15-30 req/s)');
    } else {
      console.log('❌ Stress Test: NEEDS IMPROVEMENT (<15 req/s)');
    }
    
    if (loadResult.successful >= 95 && stressResult.successful >= 90) {
      console.log('✅ Reliability: EXCELLENT (>90% success rate)');
    } else if (loadResult.successful >= 80 && stressResult.successful >= 70) {
      console.log('⚠️  Reliability: GOOD (70-90% success rate)');
    } else {
      console.log('❌ Reliability: NEEDS IMPROVEMENT (<70% success rate)');
    }
    
    console.log('\n🎉 Performance validation complete!');
    
  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();
