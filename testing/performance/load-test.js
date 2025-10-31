/**
 * Load Testing for localhost:3000
 * Tests system performance under normal and heavy load
 * Build with the Holy Spirit
 */

const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const DURATION = parseInt(process.env.LOAD_TEST_DURATION) || 60;
const CONNECTIONS = parseInt(process.env.LOAD_TEST_USERS) || 10;

// Test configuration
const testConfig = {
  url: `${API_URL}/health`,
  connections: CONNECTIONS,
  duration: DURATION,
  pipelining: 1,
  title: 'Kingdom Studios API Load Test'
};

console.log('🔥 Starting load test...');
console.log(`URL: ${testConfig.url}`);
console.log(`Duration: ${DURATION} seconds`);
console.log(`Concurrent connections: ${CONNECTIONS}`);
console.log('');

// Run load test
const instance = autocannon(testConfig, (err, result) => {
  if (err) {
    console.error('❌ Load test failed:', err);
    process.exit(1);
  }

  console.log('\n📊 Load Test Results:');
  console.log('════════════════════════════════════════');
  console.log(`Total Requests: ${result.requests.total}`);
  console.log(`Requests/sec: ${result.requests.average}`);
  console.log(`Latency (avg): ${result.latency.mean}ms`);
  console.log(`Latency (p99): ${result.latency.p99}ms`);
  console.log(`Throughput: ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
  console.log(`Errors: ${result.errors}`);
  console.log(`Timeouts: ${result.timeouts}`);
  console.log(`2xx responses: ${result['2xx']}`);
  console.log(`4xx responses: ${result['4xx']}`);
  console.log(`5xx responses: ${result['5xx']}`);
  console.log('════════════════════════════════════════\n');

  // Determine if test passed
  const passed = result.errors === 0 && 
                 result['5xx'] === 0 && 
                 result.latency.mean < 1000;

  if (passed) {
    console.log('✅ Load test PASSED');
  } else {
    console.log('❌ Load test FAILED');
    if (result.errors > 0) console.log('   - Errors detected');
    if (result['5xx'] > 0) console.log('   - Server errors detected');
    if (result.latency.mean >= 1000) console.log('   - High latency detected');
  }

  // Save results
  const reportPath = path.join(__dirname, '../reports/load-test-results.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(`\n📄 Full report saved to: ${reportPath}`);

  process.exit(passed ? 0 : 1);
});

// Track progress
autocannon.track(instance, {
  renderProgressBar: true,
  renderResultsTable: true,
  renderLatencyTable: true
});

// Handle interruption
process.on('SIGINT', () => {
  console.log('\n⚠️  Load test interrupted by user');
  instance.stop();
});

