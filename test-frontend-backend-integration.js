/**
 * Frontend-Backend Integration Test
 * Tests the complete flow of authentication and content generation
 */

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Test user credentials - use timestamp to make email unique
const timestamp = Date.now();
const testUser = {
  email: `test${timestamp}@kingdomstudios.com`,
  password: 'testPassword123',
  firstName: 'John',
  lastName: 'Doe',
  faithMode: true
};

let authToken = null;
let userId = null;

async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    },
    ...options
  };

  console.log(`🔗 ${config.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || data.error || 'Request failed'}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`);
    throw error;
  }
}

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  try {
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testUserRegistration() {
  console.log('\n👤 Testing User Registration...');
  try {
    const response = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    
    console.log('✅ Registration successful');
    console.log('📧 User email:', response.user.email);
    console.log('👑 Faith mode:', response.user.faithMode);
    console.log('🔑 Token received:', !!response.token);
    
    authToken = response.token;
    userId = response.user.id;
    return response;
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    throw error;
  }
}

async function testUserLogin() {
  console.log('\n🔐 Testing User Login...');
  try {
    // Clear token to test fresh login
    authToken = null;
    
    const response = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    console.log('✅ Login successful');
    console.log('👤 User name:', `${response.user.firstName} ${response.user.lastName}`);
    console.log('📧 User email:', response.user.email);
    console.log('✝️ Faith mode:', response.user.faithMode);
    console.log('🔑 Token received:', !!response.token);
    
    authToken = response.token;
    userId = response.user.id;
    return response;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
}

async function testGetProfile() {
  console.log('\n👤 Testing Get Profile...');
  try {
    const response = await makeRequest('/auth/me');
    
    console.log('✅ Profile retrieval successful');
    console.log('👤 Full name:', `${response.user.firstName} ${response.user.lastName}`);
    console.log('📧 Email:', response.user.email);
    console.log('✝️ Faith mode:', response.user.faithMode);
    console.log('📅 Created:', new Date(response.user.createdAt).toLocaleDateString());
    
    return response;
  } catch (error) {
    console.error('❌ Profile retrieval failed:', error.message);
    throw error;
  }
}

async function testContentGeneration() {
  console.log('\n✨ Testing Content Generation...');
  try {
    const contentRequest = {
      type: 'text',
      prompt: 'Generate a social media post for a Faith Over Fear T-Shirt priced at $29.99. Include faith-based and inspirational messaging that aligns with Christian values.',
      faithMode: true,
      platform: 'instagram',
      settings: {
        productId: 'test-product-1',
        contentType: 'post',
        tone: 'inspirational-faith'
      }
    };

    const response = await makeRequest('/content/generate', {
      method: 'POST',
      body: JSON.stringify(contentRequest)
    });
    
    console.log('✅ Content generation successful');
    console.log('🆔 Content ID:', response.data.id);
    console.log('📝 Content type:', response.data.type);
    console.log('📊 Content length:', response.data.content.length, 'characters');
    console.log('📋 Content preview:', response.data.content.substring(0, 100) + '...');
    
    return response;
  } catch (error) {
    console.error('❌ Content generation failed:', error.message);
    throw error;
  }
}

async function testAnalyticsTracking() {
  console.log('\n📊 Testing Analytics Tracking...');
  try {
    const analyticsEvent = {
      name: 'frontend_test_event',
      properties: {
        testType: 'integration',
        timestamp: new Date().toISOString(),
        userAgent: 'Frontend Integration Test',
        faithMode: true
      },
      userId: userId
    };

    const response = await makeRequest('/analytics/track', {
      method: 'POST',
      body: JSON.stringify(analyticsEvent)
    });
    
    console.log('✅ Analytics tracking successful');
    console.log('📊 Event tracked:', analyticsEvent.name);
    console.log('👤 User ID:', analyticsEvent.userId);
    
    return response;
  } catch (error) {
    console.error('❌ Analytics tracking failed:', error.message);
    throw error;
  }
}

async function testTokenRefresh() {
  console.log('\n🔄 Testing Token Refresh...');
  try {
    const response = await makeRequest('/auth/refresh', {
      method: 'POST'
    });
    
    console.log('✅ Token refresh successful');
    console.log('🔑 New token received:', !!response.token);
    console.log('👤 User still valid:', !!response.user);
    
    authToken = response.token;
    return response;
  } catch (error) {
    console.error('❌ Token refresh failed:', error.message);
    throw error;
  }
}

async function testLogout() {
  console.log('\n🚪 Testing User Logout...');
  try {
    const response = await makeRequest('/auth/logout', {
      method: 'POST'
    });
    
    console.log('✅ Logout successful');
    console.log('📤 Message:', response.message);
    
    // Clear token
    authToken = null;
    userId = null;
    
    return response;
  } catch (error) {
    console.error('❌ Logout failed:', error.message);
    throw error;
  }
}

async function runIntegrationTests() {
  console.log('🚀 Starting Frontend-Backend Integration Tests');
  console.log('=' .repeat(60));
  
  try {
    // 1. Health check
    const healthOk = await testHealthCheck();
    if (!healthOk) {
      throw new Error('Backend server is not healthy');
    }
    
    // 2. User registration
    await testUserRegistration();
    
    // 3. User profile
    await testGetProfile();
    
    // 4. Content generation
    await testContentGeneration();
    
    // 5. Analytics tracking
    await testAnalyticsTracking();
    
    // 6. Token refresh
    await testTokenRefresh();
    
    // 7. Test login with existing user (logout first)
    await testLogout();
    await testUserLogin();
    
    // 8. Final profile check
    await testGetProfile();
    
    // 9. Final logout
    await testLogout();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL INTEGRATION TESTS PASSED!');
    console.log('✅ Backend API is fully functional');
    console.log('✅ Authentication flow works correctly');
    console.log('✅ Content generation is operational');
    console.log('✅ Analytics tracking is working');
    console.log('✅ Token refresh mechanism works');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.log('\n' + '='.repeat(60));
    console.error('💥 INTEGRATION TESTS FAILED!');
    console.error('❌ Error:', error.message);
    console.log('=' .repeat(60));
    process.exit(1);
  }
}

// Run the tests
runIntegrationTests();
