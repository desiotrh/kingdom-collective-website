/**
 * Stress Testing for localhost:3000
 * Tests system breaking points and recovery
 * Build with the Holy Spirit
 */

const autocannon = require('autocannon');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const DURATION = parseInt(process.env.STRESS_TEST_DURATION) || 120;
const MAX_CONNECTIONS = parseInt(process.env.STRESS_TEST_USERS) || 100;

console.log('🔥 Starting stress test...');
console.log(`URL: ${API_URL}/health`);
console.log(`Duration: ${DURATION} seconds`);
console.log(`Max connections: ${MAX_CONNECTIONS}`);
console.log('\nThis test will gradually increase load to find breaking points...\n');

// Phase 1: Warm-up
console.log('📈 Phase 1: Warm-up (10 connections)');
runPhase(10, 30);

// Helper function to run test phases
async function runPhase(connections, duration) {
  return new Promise((resolve, reject) => {
    const config = {
      url: `${API_URL}/health`,
      connections: connections,
      duration: duration,
      pipelining: 1,
      title: `Stress Test - ${connections} connections`
    };

    const instance = autocannon(config, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      console.log(`\n📊 Phase Results (${connections} connections):`);
      console.log(`  Requests/sec: ${result.requests.average.toFixed(2)}`);
      console.log(`  Latency (avg): ${result.latency.mean.toFixed(2)}ms`);
      console.log(`  Errors: ${result.errors}`);
      console.log(`  5xx: ${result['5xx']}`);

      // Save phase results
      const reportPath = path.join(__dirname, `../reports/stress-test-${connections}-connections.json`);
      fs.mkdirSync(path.dirname(reportPath), { recursive: true });
      fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));

      resolve(result);
    });

    autocannon.track(instance, { renderProgressBar: true });
  });
}

// Run all phases sequentially
(async () => {
  try {
    const results = [];

    // Phase 1: Warm-up
    results.push(await runPhase(10, 20));

    // Phase 2: Normal load
    console.log('\n📈 Phase 2: Normal load (25 connections)');
    results.push(await runPhase(25, 30));

    // Phase 3: High load
    console.log('\n📈 Phase 3: High load (50 connections)');
    results.push(await runPhase(50, 30));

    // Phase 4: Stress
    console.log('\n📈 Phase 4: Stress (100 connections)');
    results.push(await runPhase(100, 40));

    // Analysis
    console.log('\n\n═══════════════════════════════════════════');
    console.log('📊 STRESS TEST SUMMARY');
    console.log('═══════════════════════════════════════════\n');

    const phases = [10, 25, 50, 100];
    phases.forEach((connections, index) => {
      const result = results[index];
      console.log(`${connections} connections:`);
      console.log(`  Requests/sec: ${result.requests.average.toFixed(2)}`);
      console.log(`  Latency: ${result.latency.mean.toFixed(2)}ms`);
      console.log(`  Error rate: ${((result.errors / result.requests.total) * 100).toFixed(2)}%`);
      console.log('');
    });

    // Determine breaking point
    const breakingPoint = results.findIndex(r => 
      r.errors > 0 || r['5xx'] > 0 || r.latency.mean > 5000
    );

    if (breakingPoint === -1) {
      console.log('✅ System handled all stress levels successfully!');
      console.log(`   Recommended max capacity: ${MAX_CONNECTIONS} concurrent users`);
    } else {
      const maxSafeConnections = phases[breakingPoint - 1] || 10;
      console.log('⚠️  Breaking point detected!');
      console.log(`   Recommended max capacity: ${maxSafeConnections} concurrent users`);
    }

    console.log('\n═══════════════════════════════════════════\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Stress test failed:', error);
    process.exit(1);
  }
})();

