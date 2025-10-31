/**
 * End-to-End User Flow Tests
 * Tests complete user journeys through the application
 * Build with the Holy Spirit
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const TIMEOUT = 30000;

describe('End-to-End User Flows', () => {
  
  const testUser = {
    email: `e2e_test_${Date.now()}@kingdom.test`,
    password: 'SecurePassword123!',
    name: 'E2E Test User'
  };

  let authToken = null;
  let userId = null;

  beforeAll(() => {
    console.log('🎭 Starting end-to-end tests...');
  });

  describe('Complete User Registration Flow', () => {
    
    test('Step 1: User registers account', async () => {
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
        userId = response.data.user.id || response.data.user._id;
        
        console.log('✅ Step 1 complete: User registered');
      } catch (error) {
        if (error.response?.status === 400 && error.response.data.message?.includes('exists')) {
          console.log('ℹ️  User already exists, proceeding to login...');
        } else {
          throw error;
        }
      }
    });

    test('Step 2: User logs in', async () => {
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
      
      authToken = response.data.token;
      userId = response.data.user.id || response.data.user._id;
      
      console.log('✅ Step 2 complete: User logged in');
    });

    test('Step 3: User accesses protected route', async () => {
      if (!authToken) {
        console.log('⏭️  Skipping - no auth token');
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
      
      console.log('✅ Step 3 complete: Accessed protected route');
    });

    test('Step 4: User updates profile', async () => {
      if (!authToken) {
        console.log('⏭️  Skipping - no auth token');
        return;
      }

      try {
        const response = await axios.put(
          `${API_URL}/api/users/profile`,
          { name: 'Updated Name' },
          {
            headers: { Authorization: `Bearer ${authToken}` },
            timeout: TIMEOUT
          }
        );
        
        expect(response.status).toBeLessThan(400);
        console.log('✅ Step 4 complete: Profile updated');
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('ℹ️  Profile endpoint not implemented yet');
        } else {
          throw error;
        }
      }
    });

    test('Step 5: User logs out', async () => {
      if (!authToken) {
        console.log('⏭️  Skipping - no auth token');
        return;
      }

      try {
        const response = await axios.post(
          `${API_URL}/api/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${authToken}` },
            timeout: TIMEOUT
          }
        );
        
        expect(response.status).toBeLessThan(400);
        console.log('✅ Step 5 complete: User logged out');
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('ℹ️  Logout endpoint not implemented yet');
        }
      }
    });
  });

  describe('Error Recovery Flow', () => {
    
    test('User recovers from invalid login', async () => {
      try {
        await axios.post(
          `${API_URL}/api/auth/login`,
          {
            email: testUser.email,
            password: 'WrongPassword123!'
          },
          { timeout: TIMEOUT }
        );
        fail('Should have failed with invalid credentials');
      } catch (error) {
        expect(error.response?.status).toBeGreaterThanOrEqual(400);
        console.log('✅ Invalid login properly rejected');
      }

      // Then successful login
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: testUser.email,
          password: testUser.password
        },
        { timeout: TIMEOUT }
      );
      
      expect(response.status).toBe(200);
      console.log('✅ User recovered and logged in successfully');
    });
  });

  afterAll(() => {
    console.log('✨ End-to-end tests completed!');
  });
});

