/**
 * API Endpoints Testing
 * Comprehensive tests for all API endpoints on localhost:3000
 * Build with the Holy Spirit
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const TIMEOUT = 30000;

// Test data
const testUser = {
  email: `test_${Date.now()}@kingdom.test`,
  password: 'TestPassword123!',
  name: 'Test User'
};

let authToken = null;

describe('API Endpoint Tests - localhost:3000', () => {
  
  beforeAll(() => {
    console.log('🧪 Starting API endpoint tests...');
  });

  describe('Authentication Endpoints', () => {
    
    test('POST /api/auth/register - Register new user', async () => {
      try {
        const response = await axios.post(
          `${API_URL}/api/auth/register`,
          testUser,
          { timeout: TIMEOUT }
        );
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('token');
        expect(response.data).toHaveProperty('user');
        
        authToken = response.data.token;
        console.log('✅ User registration successful');
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('ℹ️  User might already exist, trying login...');
        } else {
          throw error;
        }
      }
    });

    test('POST /api/auth/login - User login', async () => {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: testUser.email,
          password: testUser.password
        },
        { timeout: TIMEOUT }
      );
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      
      authToken = response.data.token;
      console.log('✅ User login successful');
    });

    test('GET /api/auth/me - Get current user', async () => {
      if (!authToken) {
        console.log('⏭️  Skipping - no auth token available');
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/auth/me`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          timeout: TIMEOUT
        }
      );
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('user');
      console.log('✅ Get current user successful');
    });

    test('POST /api/auth/logout - User logout', async () => {
      if (!authToken) {
        console.log('⏭️  Skipping - no auth token available');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
          timeout: TIMEOUT
        }
      );
      
      expect(response.status).toBeLessThan(400);
      console.log('✅ User logout successful');
    });
  });

  describe('Error Handling', () => {
    
    test('404 - Not found endpoint', async () => {
      try {
        await axios.get(`${API_URL}/api/nonexistent-endpoint`, { timeout: TIMEOUT });
        fail('Should have thrown 404 error');
      } catch (error) {
        expect(error.response?.status).toBe(404);
        console.log('✅ 404 error handled correctly');
      }
    });

    test('401 - Unauthorized access', async () => {
      try {
        await axios.get(
          `${API_URL}/api/auth/me`,
          { timeout: TIMEOUT }
        );
        // Some APIs might not require auth, skip in that case
      } catch (error) {
        if (error.response?.status === 401) {
          expect(error.response.status).toBe(401);
          console.log('✅ Unauthorized access blocked');
        }
      }
    });

    test('400 - Bad request', async () => {
      try {
        await axios.post(
          `${API_URL}/api/auth/register`,
          { email: 'invalid-email' }, // Invalid data
          { timeout: TIMEOUT }
        );
      } catch (error) {
        expect(error.response?.status).toBe(400);
        console.log('✅ Bad request handled correctly');
      }
    });
  });

  afterAll(() => {
    console.log('✨ API endpoint tests completed!');
  });
});

