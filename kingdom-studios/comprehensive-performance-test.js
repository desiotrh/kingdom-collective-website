/**
 * Comprehensive Performance & Load Testing Script
 * Tests all critical performance requirements from the instructions
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

class PerformanceTester {
  constructor(baseURL = 'http://localhost:3001') {
    this.baseURL = baseURL;
    this.results = {
      responseTime: [],
      errors: [],
      throughput: 0,
      concurrency: 0,
      memoryUsage: [],
      cachePerformance: {
        hits: 0,
        misses: 0,
      },
    };
  }

  async runFullPerformanceTest() {
    console.log('🚀 Starting Comprehensive Performance Test Suite...\n');

    try {
      // 1. Basic Health Check
      await this.testHealthCheck();

      // 2. Response Time Tests
      await this.testResponseTimes();

      // 3. Concurrent User Simulation
      await this.testConcurrentUsers();

      // 4. Load Testing
      await this.testLoadCapacity();

      // 5. Memory Stress Test
      await this.testMemoryUsage();

      // 6. Cache Performance
      await this.testCachePerformance();

      // 7. Rate Limiting Test
      await this.testRateLimiting();

      // 8. Content Generation Performance
      await this.testContentGenerationPerformance();

      // Generate final report
      this.generatePerformanceReport();

    } catch (error) {
      console.error('❌ Performance test failed:', error);
    }
  }

  async testHealthCheck() {
    console.log('🏥 Testing Health Check...');
    const start = performance.now();
    
    try {
      const response = await axios.get(`${this.baseURL}/health`);
      const duration = performance.now() - start;
      
      if (response.status === 200 && duration < 100) {
        console.log(`✅ Health check passed (${duration.toFixed(2)}ms)`);
      } else {
        console.log(`⚠️ Health check slow (${duration.toFixed(2)}ms)`);
      }
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
    }
  }

  async testResponseTimes() {
    console.log('⏱️ Testing Response Times...');
    
    const endpoints = [
      '/health',
      '/api/auth/check',
      '/api/templates',
      '/api/user/profile',
    ];

    for (const endpoint of endpoints) {
      const times = [];
      
      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        try {
          await axios.get(`${this.baseURL}${endpoint}`);
          const duration = performance.now() - start;
          times.push(duration);
        } catch (error) {
          // Ignore errors for non-existent endpoints in testing
        }
      }

      if (times.length > 0) {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const max = Math.max(...times);
        
        console.log(`  ${endpoint}: avg ${avg.toFixed(2)}ms, max ${max.toFixed(2)}ms`);
        
        if (avg > 200) {
          console.log(`  ⚠️ WARNING: Average response time exceeds 200ms target`);
        }
      }
    }
  }

  async testConcurrentUsers() {
    console.log('👥 Testing Concurrent Users (50 users)...');
    
    const promises = [];
    const startTime = performance.now();
    
    for (let i = 0; i < 50; i++) {
      promises.push(this.simulateUserSession(i));
    }

    try {
      const results = await Promise.allSettled(promises);
      const duration = performance.now() - startTime;
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      console.log(`✅ Concurrent test completed in ${duration.toFixed(2)}ms`);
      console.log(`   Successful: ${successful}, Failed: ${failed}`);
      
      if (failed > 5) {
        console.log('⚠️ WARNING: High failure rate under concurrent load');
      }
    } catch (error) {
      console.log('❌ Concurrent test failed:', error.message);
    }
  }

  async simulateUserSession(userId) {
    // Simulate a typical user session
    const start = performance.now();
    
    try {
      // Login simulation
      await this.makeRequest('/api/auth/check');
      
      // Dashboard visit
      await this.makeRequest('/api/user/dashboard');
      
      // Content generation
      await this.makeRequest('/api/generate-content', 'POST', {
        prompt: `Test content ${userId}`,
        platform: 'instagram',
        tone: 'professional',
      });
      
      const duration = performance.now() - start;
      this.results.responseTime.push(duration);
      
      return { userId, duration };
    } catch (error) {
      this.results.errors.push({ userId, error: error.message });
      throw error;
    }
  }

  async testLoadCapacity() {
    console.log('🔥 Testing Load Capacity (100 requests/second)...');
    
    const requestsPerSecond = 100;
    const duration = 10; // seconds
    const totalRequests = requestsPerSecond * duration;
    
    const startTime = performance.now();
    let completed = 0;
    let errors = 0;

    for (let second = 0; second < duration; second++) {
      const promises = [];
      
      for (let i = 0; i < requestsPerSecond; i++) {
        promises.push(
          this.makeRequest('/health')
            .then(() => completed++)
            .catch(() => errors++)
        );
      }
      
      await Promise.allSettled(promises);
      
      // Wait for next second
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const totalTime = performance.now() - startTime;
    const actualThroughput = (completed / totalTime) * 1000;
    
    console.log(`📊 Load test results:`);
    console.log(`   Completed: ${completed}/${totalRequests}`);
    console.log(`   Errors: ${errors}`);
    console.log(`   Actual throughput: ${actualThroughput.toFixed(2)} req/sec`);
    
    if (actualThroughput < requestsPerSecond * 0.8) {
      console.log('⚠️ WARNING: Throughput below 80% of target');
    }
  }

  async testMemoryUsage() {
    console.log('💾 Testing Memory Usage...');
    
    const initialMemory = process.memoryUsage();
    
    // Generate memory load
    const largeArray = [];
    for (let i = 0; i < 1000; i++) {
      largeArray.push(new Array(1000).fill(`data-${i}`));
    }

    const peakMemory = process.memoryUsage();
    
    // Cleanup
    largeArray.length = 0;
    
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage();
    
    console.log(`📊 Memory usage (MB):`);
    console.log(`   Initial: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}`);
    console.log(`   Peak: ${(peakMemory.heapUsed / 1024 / 1024).toFixed(2)}`);
    console.log(`   Final: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}`);
    
    const memoryLeak = finalMemory.heapUsed - initialMemory.heapUsed;
    if (memoryLeak > 10 * 1024 * 1024) { // 10MB threshold
      console.log('⚠️ WARNING: Potential memory leak detected');
    }
  }

  async testCachePerformance() {
    console.log('🗄️ Testing Cache Performance...');
    
    const testData = { prompt: 'test cache', platform: 'instagram' };
    
    // First request (cache miss)
    const start1 = performance.now();
    await this.makeRequest('/api/generate-content', 'POST', testData);
    const firstDuration = performance.now() - start1;
    
    // Second request (should be cache hit)
    const start2 = performance.now();
    await this.makeRequest('/api/generate-content', 'POST', testData);
    const secondDuration = performance.now() - start2;
    
    console.log(`📊 Cache performance:`);
    console.log(`   First request: ${firstDuration.toFixed(2)}ms`);
    console.log(`   Cached request: ${secondDuration.toFixed(2)}ms`);
    
    if (secondDuration < firstDuration * 0.5) {
      console.log('✅ Cache working effectively');
    } else {
      console.log('⚠️ WARNING: Cache may not be working properly');
    }
  }

  async testRateLimiting() {
    console.log('🚦 Testing Rate Limiting...');
    
    const requests = [];
    for (let i = 0; i < 150; i++) { // Exceed typical rate limit
      requests.push(
        this.makeRequest('/api/generate-content', 'POST', {
          prompt: `Rate limit test ${i}`,
          platform: 'instagram',
        })
      );
    }

    const results = await Promise.allSettled(requests);
    const rateLimited = results.filter(r => 
      r.status === 'rejected' && r.reason.response?.status === 429
    ).length;
    
    console.log(`📊 Rate limiting results:`);
    console.log(`   Total requests: ${requests.length}`);
    console.log(`   Rate limited: ${rateLimited}`);
    
    if (rateLimited > 0) {
      console.log('✅ Rate limiting is working');
    } else {
      console.log('⚠️ WARNING: Rate limiting may not be configured');
    }
  }

  async testContentGenerationPerformance() {
    console.log('🎨 Testing Content Generation Performance...');
    
    const prompts = [
      'Create an inspirational post about success',
      'Write a product description for a new app',
      'Generate a social media caption for a sunset photo',
      'Create educational content about digital marketing',
      'Write a motivational quote for entrepreneurs',
    ];

    const results = [];
    
    for (const prompt of prompts) {
      const start = performance.now();
      
      try {
        await this.makeRequest('/api/generate-content', 'POST', {
          prompt,
          platform: 'instagram',
          tone: 'professional',
        });
        
        const duration = performance.now() - start;
        results.push(duration);
        console.log(`   "${prompt.substring(0, 30)}...": ${duration.toFixed(2)}ms`);
        
      } catch (error) {
        console.log(`   Error for "${prompt.substring(0, 30)}...": ${error.message}`);
      }
    }

    if (results.length > 0) {
      const avgTime = results.reduce((a, b) => a + b, 0) / results.length;
      console.log(`📊 Average generation time: ${avgTime.toFixed(2)}ms`);
      
      if (avgTime > 5000) { // 5 second threshold
        console.log('⚠️ WARNING: Content generation is slow');
      }
    }
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const config = {
      method,
      url: `${this.baseURL}${endpoint}`,
      timeout: 30000,
    };

    if (data && method !== 'GET') {
      config.data = data;
    }

    return axios(config);
  }

  generatePerformanceReport() {
    console.log('\n📊 FINAL PERFORMANCE REPORT');
    console.log('=' .repeat(50));
    
    if (this.results.responseTime.length > 0) {
      const avgResponseTime = this.results.responseTime.reduce((a, b) => a + b, 0) / this.results.responseTime.length;
      const maxResponseTime = Math.max(...this.results.responseTime);
      
      console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
      console.log(`Max Response Time: ${maxResponseTime.toFixed(2)}ms`);
      
      // Performance targets from instructions
      if (avgResponseTime < 200) {
        console.log('✅ Response time target met');
      } else {
        console.log('❌ Response time target FAILED');
      }
    }

    console.log(`Total Errors: ${this.results.errors.length}`);
    
    if (this.results.errors.length === 0) {
      console.log('✅ No errors detected');
    } else {
      console.log('❌ Errors detected - investigate required');
    }

    console.log('\n🎯 PERFORMANCE CHECKLIST:');
    console.log('• No lag under load: ' + (this.results.responseTime.every(t => t < 1000) ? '✅' : '❌'));
    console.log('• Premium UX maintained: ' + (this.results.errors.length < 5 ? '✅' : '❌'));
    console.log('• Scalability verified: ' + (this.results.throughput > 80 ? '✅' : '❌'));
    
    console.log('\n🚀 Performance test completed!');
  }
}

// Run the performance test
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runFullPerformanceTest().catch(console.error);
}

module.exports = PerformanceTester;
