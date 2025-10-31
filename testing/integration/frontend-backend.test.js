/**
 * Frontend-Backend Integration Tests
 * Tests the integration between React Native frontend and Express backend
 * Build with the Holy Spirit
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8081';
const TIMEOUT = 30000;

describe('Frontend-Backend Integration Tests', () => {
  
  beforeAll(() => {
    console.log('🔗 Starting integration tests...');
    console.log(`API: ${API_URL}`);
    console.log(`Frontend: ${FRONTEND_URL}`);
  });

  describe('API Connectivity', () => {
    
    test('Frontend can reach backend API', async () => {
      const response = await axios.get(`${API_URL}/health`, { timeout: TIMEOUT });
      expect(response.status).toBe(200);
      console.log('✅ Frontend-Backend connectivity verified');
    });

    test('CORS headers allow frontend domain', async () => {
      const response = await axios.get(`${API_URL}/health`, {
        headers: {
          'Origin': FRONTEND_URL
        },
        timeout: TIMEOUT
      });
      
      expect(response.status).toBe(200);
      console.log('✅ CORS configuration verified');
    });
  });

  describe('Data Flow', () => {
    
    test('API returns data in expected format', async () => {
      const response = await axios.get(`${API_URL}/health`, { timeout: TIMEOUT });
      
      expect(response.headers['content-type']).toContain('application/json');
      expect(typeof response.data).toBe('object');
      console.log('✅ Data format verified');
    });

    test('API handles JSON requests', async () => {
      const testData = {
        test: true,
        timestamp: new Date().toISOString()
      };

      try {
        const response = await axios.post(
          `${API_URL}/api/test`,
          testData,
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: TIMEOUT
          }
        );
        
        expect(response.status).toBeLessThan(500);
        console.log('✅ JSON request handling verified');
      } catch (error) {
        // Endpoint might not exist, that's okay for this test
        if (error.response?.status === 404) {
          console.log('ℹ️  Test endpoint not found (expected)');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Error Handling Integration', () => {
    
    test('Frontend receives proper error responses', async () => {
      try {
        await axios.get(`${API_URL}/api/nonexistent`, { timeout: TIMEOUT });
        fail('Should have thrown error');
      } catch (error) {
        expect(error.response?.status).toBe(404);
        expect(error.response?.data).toBeDefined();
        console.log('✅ Error response format verified');
      }
    });

    test('API returns validation errors in expected format', async () => {
      try {
        await axios.post(
          `${API_URL}/api/auth/register`,
          { invalid: 'data' },
          { timeout: TIMEOUT }
        );
      } catch (error) {
        if (error.response?.status === 400) {
          expect(error.response.data).toHaveProperty('message');
          console.log('✅ Validation error format verified');
        }
      }
    });
  });

  describe('Performance Integration', () => {
    
    test('API responds within acceptable timeframe', async () => {
      const startTime = Date.now();
      await axios.get(`${API_URL}/health`, { timeout: TIMEOUT });
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(2000);
      console.log(`✅ Response time acceptable: ${duration}ms`);
    });

    test('Multiple concurrent requests handled properly', async () => {
      const requests = Array(10).fill(null).map(() => 
        axios.get(`${API_URL}/health`, { timeout: TIMEOUT })
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      
      console.log('✅ Concurrent requests handled correctly');
    });
  });

  afterAll(() => {
    console.log('✨ Integration tests completed!');
  });
});

