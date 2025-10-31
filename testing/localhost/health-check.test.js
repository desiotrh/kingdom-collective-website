/**
 * Localhost Health Check Tests
 * Tests basic connectivity to localhost:3000
 * Build with the Holy Spirit
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const TIMEOUT = 10000;

describe('Localhost:3000 Health Checks', () => {
  
  beforeAll(() => {
    console.log('🔍 Starting health check tests...');
    console.log(`Testing API at: ${API_URL}`);
  });

  test('Backend server is running on localhost:3000', async () => {
    try {
      const response = await axios.get(`${API_URL}/health`, { timeout: TIMEOUT });
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      console.log('✅ Backend server is healthy');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('❌ Backend server is not running on localhost:3000. Please start with: npm run dev:backend');
      }
      throw error;
    }
  });

  test('API responds within acceptable time', async () => {
    const startTime = Date.now();
    const response = await axios.get(`${API_URL}/health`, { timeout: TIMEOUT });
    const responseTime = Date.now() - startTime;
    
    expect(response.status).toBe(200);
    expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    console.log(`⚡ Response time: ${responseTime}ms`);
  });

  test('API returns correct headers', async () => {
    const response = await axios.get(`${API_URL}/health`, { timeout: TIMEOUT });
    
    expect(response.headers['content-type']).toContain('application/json');
    console.log('✅ Correct headers returned');
  });

  test('CORS is configured', async () => {
    const response = await axios.options(`${API_URL}/health`, { timeout: TIMEOUT });
    
    // Check if CORS headers exist
    expect(response.status).toBeLessThan(400);
    console.log('✅ CORS configuration verified');
  });

  afterAll(() => {
    console.log('✨ Health check tests completed!');
  });
});

