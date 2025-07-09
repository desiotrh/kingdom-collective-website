/**
 * Enhanced Backend Feature Testing
 * Tests new features like templates, favorites, and content refinement
 */

const BASE_URL = 'http://localhost:3000/api/v1';

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: `testenhanced${Date.now()}@kingdom.com`,
  password: 'TestPass123!',
  faithMode: true
};

let authToken = '';
let testContentId = '';

async function makeRequest(endpoint, options = {}) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (authToken && !options.skipAuth) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`API Error: ${data.error || response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ Request failed for ${endpoint}:`, error.message);
    throw error;
  }
}

async function testEnhancedFeatures() {
  console.log('🧪 Testing Enhanced Kingdom Studios Backend Features...\n');

  try {
    // Step 1: Register and login
    console.log('1️⃣ Registering test user...');
    const registerResponse = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser),
      skipAuth: true
    });
    
    authToken = registerResponse.token;
    console.log('✅ Registration successful');

    // Step 2: Test content templates
    console.log('\n2️⃣ Testing content templates...');
    const templatesResponse = await makeRequest('/content/templates');
    console.log(`✅ Templates retrieved: ${templatesResponse.data.length} templates found`);
    console.log('📋 Template categories:', [...new Set(templatesResponse.data.map(t => t.category))]);

    // Step 3: Test filtered templates (faith category)
    console.log('\n3️⃣ Testing filtered templates (faith category)...');
    const faithTemplatesResponse = await makeRequest('/content/templates?category=faith');
    console.log(`✅ Faith templates: ${faithTemplatesResponse.data.length} templates found`);

    // Step 4: Generate content using a template
    console.log('\n4️⃣ Testing enhanced content generation...');
    const contentResponse = await makeRequest('/content/generate', {
      method: 'POST',
      body: JSON.stringify({
        type: 'text',
        prompt: 'Share a Kingdom business principle that transforms how we handle challenges',
        faithMode: true,
        platform: 'instagram',
        settings: {
          contentSubtype: 'post',
          tone: 'inspirational',
          length: 'medium',
          targetAudience: 'Christian entrepreneurs'
        }
      })
    });
    
    testContentId = contentResponse.data.contentId;
    console.log('✅ Enhanced content generated:', {
      contentId: testContentId,
      length: contentResponse.data.content.length,
      platform: 'instagram',
      preview: contentResponse.data.content.substring(0, 100) + '...'
    });

    // Step 5: Test favorites functionality
    console.log('\n5️⃣ Testing favorites functionality...');
    const favoriteResponse = await makeRequest(`/content/${testContentId}/favorite`, {
      method: 'POST'
    });
    console.log('✅ Content added to favorites');

    // Step 6: Get favorites
    console.log('\n6️⃣ Testing get favorites...');
    const favoritesResponse = await makeRequest('/content/favorites');
    console.log(`✅ Favorites retrieved: ${favoritesResponse.data.length} items`);

    // Step 7: Test content refinement
    console.log('\n7️⃣ Testing content refinement...');
    const refinementResponse = await makeRequest(`/content/${testContentId}/refine`, {
      method: 'PUT',
      body: JSON.stringify({
        refinementPrompt: 'Make it more action-oriented with specific steps people can take today',
        settings: {
          platform: 'instagram',
          tone: 'urgent'
        }
      })
    });
    console.log('✅ Content refined successfully:', {
      newContentId: refinementResponse.data.contentId,
      originalId: refinementResponse.data.originalContentId
    });

    // Step 8: Test content history
    console.log('\n8️⃣ Testing content history...');
    const historyResponse = await makeRequest('/content/history');
    console.log(`✅ Content history retrieved: ${historyResponse.data.length} items`);

    console.log('\n🎯 Enhanced Features Test Complete!');
    console.log('\n📊 Summary:');
    console.log('✅ Content templates working');
    console.log('✅ Enhanced content generation with settings');
    console.log('✅ Favorites system functional');
    console.log('✅ Content refinement working');
    console.log('✅ Content history accessible');
    console.log('🚀 All new features are ready for frontend integration!');

  } catch (error) {
    console.error('❌ Enhanced features test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testEnhancedFeatures().catch(console.error);
