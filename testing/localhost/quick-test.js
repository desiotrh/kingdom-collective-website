#!/usr/bin/env node

/**
 * Quick Localhost Test
 * Fast health check for localhost:3000
 * Build with the Holy Spirit
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

console.log('🔍 Quick localhost:3000 test...\n');

async function quickTest() {
  try {
    // Test 1: Server is running
    console.log('Testing: Server connectivity...');
    const startTime = Date.now();
    const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
    const responseTime = Date.now() - startTime;
    
    if (response.status === 200) {
      console.log(`✅ Server is running`);
      console.log(`⚡ Response time: ${responseTime}ms`);
    } else {
      console.log(`⚠️  Server responded with status: ${response.status}`);
    }

    // Test 2: Response format
    console.log('\nTesting: Response format...');
    if (response.headers['content-type'].includes('application/json')) {
      console.log('✅ JSON response confirmed');
    }

    // Test 3: Response time
    console.log('\nTesting: Performance...');
    if (responseTime < 100) {
      console.log('✅ Excellent response time!');
    } else if (responseTime < 500) {
      console.log('✅ Good response time');
    } else if (responseTime < 1000) {
      console.log('⚠️  Acceptable response time');
    } else {
      console.log('❌ Slow response time');
    }

    // Summary
    console.log('\n═══════════════════════════════════════');
    console.log('📊 QUICK TEST SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`Status: PASSED ✅`);
    console.log(`URL: ${API_URL}`);
    console.log(`Response Time: ${responseTime}ms`);
    console.log(`Status Code: ${response.status}`);
    console.log('═══════════════════════════════════════\n');

    process.exit(0);

  } catch (error) {
    console.log('\n❌ QUICK TEST FAILED\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('Error: Cannot connect to localhost:3000');
      console.log('\n💡 Solution:');
      console.log('   Start the backend server with:');
      console.log('   npm run dev:backend');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('Error: Connection timeout');
      console.log('\n💡 Solution:');
      console.log('   The server is too slow to respond');
      console.log('   Check server logs for issues');
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('');
    process.exit(1);
  }
}

quickTest();

