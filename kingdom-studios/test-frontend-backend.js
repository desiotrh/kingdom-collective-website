/**
 * Frontend-Backend Integration Test
 * Tests the connection between the React Native frontend and Express backend
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001';

async function testIntegration() {
  console.log('🧪 Testing Frontend-Backend Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);

    // Test 2: System Status
    console.log('\n2. Testing System Status...');
    const statusResponse = await fetch(`${API_BASE_URL}/system/status`);
    const statusData = await statusResponse.json();
    console.log('✅ System Status:', statusData.status);
    console.log('   Database:', statusData.database);
    console.log('   AI Service:', statusData.ai);

    // Test 3: Content Templates
    console.log('\n3. Testing Content Templates...');
    const templatesResponse = await fetch(`${API_BASE_URL}/content/templates`);
    const templatesData = await templatesResponse.json();
    console.log('✅ Templates loaded:', templatesData.length, 'templates');
    if (templatesData.length > 0) {
      console.log('   Sample template:', templatesData[0].name);
    }

    // Test 4: Template Categories
    console.log('\n4. Testing Template Categories...');
    const categoriesResponse = await fetch(`${API_BASE_URL}/content/templates/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Categories:', categoriesData.join(', '));

    // Test 5: User Registration (Mock)
    console.log('\n5. Testing User Registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        faithMode: true,
      }),
    });
    const registerData = await registerResponse.json();
    console.log('✅ Registration successful:', registerData.user.name);
    const token = registerData.token;

    // Test 6: Content Generation
    console.log('\n6. Testing Content Generation...');
    const contentResponse = await fetch(`${API_BASE_URL}/content/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        contentType: 'post',
        platform: 'instagram',
        prompt: 'Create a faith-based business post about perseverance',
        tone: 'inspirational',
        length: 'medium',
      }),
    });
    const contentData = await contentResponse.json();
    console.log('✅ Content generated successfully');
    console.log('   Content preview:', contentData.content.substring(0, 100) + '...');

    // Test 7: Add to Favorites
    console.log('\n7. Testing Add to Favorites...');
    const favoriteResponse = await fetch(`${API_BASE_URL}/content/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: contentData.content,
        contentType: 'post',
        platform: 'instagram',
        title: 'Test Favorite Content',
      }),
    });
    const favoriteData = await favoriteResponse.json();
    console.log('✅ Added to favorites:', favoriteData.id);

    // Test 8: Get Favorites
    console.log('\n8. Testing Get Favorites...');
    const getFavoritesResponse = await fetch(`${API_BASE_URL}/content/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const getFavoritesData = await getFavoritesResponse.json();
    console.log('✅ Favorites retrieved:', getFavoritesData.length, 'items');

    // Test 9: Analytics Tracking
    console.log('\n9. Testing Analytics Tracking...');
    const analyticsResponse = await fetch(`${API_BASE_URL}/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        contentType: 'post',
        platform: 'instagram',
        success: true,
      }),
    });
    const analyticsData = await analyticsResponse.json();
    console.log('✅ Analytics tracked:', analyticsData.message);

    console.log('\n🎉 All integration tests passed! Frontend can successfully communicate with backend.');
    console.log('\n📱 Next steps:');
    console.log('   1. Start the React Native frontend: npx expo start');
    console.log('   2. Test the UI components with real backend data');
    console.log('   3. Verify authentication flow works end-to-end');
    console.log('   4. Test content generation with the enhanced UI');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure backend is running: cd kingdom-studios-backend && npm start');
    console.log('   2. Check if port 3001 is available');
    console.log('   3. Verify environment variables are set correctly');
  }
}

testIntegration();
