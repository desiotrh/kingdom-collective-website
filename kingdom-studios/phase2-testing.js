/**
 * Kingdom Studios App - Phase 2 Testing Script
 * Comprehensive validation of frontend-backend integration
 */

console.log('🎯 Kingdom Studios App - Phase 2 Testing & Validation');
console.log('====================================================\n');

// Mock fetch for Node.js environment
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const API_BASE_URL = 'http://localhost:3001';
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

function addTestResult(testName, success, details = '') {
  testResults.total++;
  if (success) {
    testResults.passed++;
    console.log(`✅ ${testName}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName} - ${details}`);
  }
  testResults.details.push({
    name: testName,
    success,
    details
  });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testBackendHealth() {
  console.log('\n🔧 Testing Backend Health & Connectivity...');

  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();

    addTestResult('Backend Health Check', response.ok && data.status === 'healthy');

    if (data.status === 'healthy') {
      console.log(`   Status: ${data.status}`);
      console.log(`   Message: ${data.message}`);
    }

    return response.ok;
  } catch (error) {
    addTestResult('Backend Health Check', false, `Connection failed: ${error.message}`);
    return false;
  }
}

async function testSystemStatus() {
  console.log('\n⚙️ Testing System Status...');

  try {
    const response = await fetch(`${API_BASE_URL}/system/status`);
    const data = await response.json();

    addTestResult('System Status Check', response.ok);

    if (response.ok) {
      console.log(`   Overall Status: ${data.status}`);
      console.log(`   Database: ${data.database}`);
      console.log(`   AI Service: ${data.ai}`);
      console.log(`   Version: ${data.version}`);
    }

    return response.ok;
  } catch (error) {
    addTestResult('System Status Check', false, error.message);
    return false;
  }
}

async function testAuthenticationFlow() {
  console.log('\n🔐 Testing Authentication Flow...');

  // Test User Registration
  try {
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testuser@kingdomcollective.pro',
        password: 'SecurePass123!',
        name: 'Test User',
        faithMode: true
      })
    });

    const registerData = await registerResponse.json();
    addTestResult('User Registration', registerResponse.ok);

    if (registerResponse.ok) {
      console.log(`   User Created: ${registerData.user.name}`);
      console.log(`   Faith Mode: ${registerData.user.faithMode}`);
      console.log(`   Token Generated: ${registerData.token ? 'Yes' : 'No'}`);

      // Test Login with same credentials
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testuser@kingdomcollective.pro',
          password: 'SecurePass123!'
        })
      });

      const loginData = await loginResponse.json();
      addTestResult('User Login', loginResponse.ok);

      if (loginResponse.ok) {
        console.log(`   Login Successful: ${loginData.user.name}`);
        return loginData.token;
      }
    }
  } catch (error) {
    addTestResult('Authentication Flow', false, error.message);
  }

  return null;
}

async function testContentTemplates() {
  console.log('\n📋 Testing Content Templates System...');

  try {
    // Test template retrieval
    const templatesResponse = await fetch(`${API_BASE_URL}/content/templates`);
    const templates = await templatesResponse.json();

    addTestResult('Template Retrieval', templatesResponse.ok);

    if (templatesResponse.ok) {
      console.log(`   Templates Loaded: ${templates.length}`);

      if (templates.length > 0) {
        console.log(`   Sample Template: "${templates[0].name}"`);
        console.log(`   Categories Available: ${[...new Set(templates.map(t => t.category))].join(', ')}`);
      }

      // Test template categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/content/templates/categories`);
      const categories = await categoriesResponse.json();

      addTestResult('Template Categories', categoriesResponse.ok);

      if (categoriesResponse.ok) {
        console.log(`   Categories: ${categories.join(', ')}`);
      }
    }
  } catch (error) {
    addTestResult('Content Templates', false, error.message);
  }
}

async function testContentGeneration(token) {
  console.log('\n🤖 Testing Content Generation...');

  if (!token) {
    addTestResult('Content Generation', false, 'No authentication token available');
    return;
  }

  const testCases = [
    {
      name: 'Instagram Post Generation',
      request: {
        contentType: 'post',
        platform: 'instagram',
        prompt: 'Create a faith-based business post about perseverance',
        tone: 'inspirational',
        length: 'medium'
      }
    },
    {
      name: 'LinkedIn Professional Content',
      request: {
        contentType: 'post',
        platform: 'linkedin',
        prompt: 'Share business wisdom with biblical principles',
        tone: 'professional',
        length: 'long'
      }
    },
    {
      name: 'TikTok Video Idea',
      request: {
        contentType: 'reel',
        platform: 'tiktok',
        prompt: 'Creative video idea for faith-based entrepreneur',
        tone: 'playful',
        length: 'short'
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      const response = await fetch(`${API_BASE_URL}/content/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testCase.request)
      });

      const data = await response.json();
      addTestResult(testCase.name, response.ok);

      if (response.ok) {
        console.log(`   Content Length: ${data.content.length} characters`);
        console.log(`   Platform: ${data.platform}`);
        console.log(`   Preview: ${data.content.substring(0, 100)}...`);
      }

      await delay(1000); // Rate limiting consideration
    } catch (error) {
      addTestResult(testCase.name, false, error.message);
    }
  }
}

async function testFavoritesSystem(token) {
  console.log('\n⭐ Testing Favorites System...');

  if (!token) {
    addTestResult('Favorites System', false, 'No authentication token available');
    return;
  }

  try {
    // Add to favorites
    const addFavoriteResponse = await fetch(`${API_BASE_URL}/content/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content: 'This is a test favorite content piece that showcases our faith-based business approach.',
        contentType: 'post',
        platform: 'instagram',
        title: 'Test Favorite Content'
      })
    });

    const favoriteData = await addFavoriteResponse.json();
    addTestResult('Add to Favorites', addFavoriteResponse.ok);

    if (addFavoriteResponse.ok) {
      console.log(`   Favorite Added: ${favoriteData.title}`);
      console.log(`   Favorite ID: ${favoriteData.id}`);

      // Retrieve favorites
      const getFavoritesResponse = await fetch(`${API_BASE_URL}/content/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const favorites = await getFavoritesResponse.json();
      addTestResult('Retrieve Favorites', getFavoritesResponse.ok);

      if (getFavoritesResponse.ok) {
        console.log(`   Total Favorites: ${favorites.length}`);

        if (favorites.length > 0) {
          console.log(`   Recent Favorite: ${favorites[0].title}`);
        }
      }
    }
  } catch (error) {
    addTestResult('Favorites System', false, error.message);
  }
}

async function testContentRefinement(token) {
  console.log('\n🔄 Testing Content Refinement...');

  if (!token) {
    addTestResult('Content Refinement', false, 'No authentication token available');
    return;
  }

  const originalContent = 'Faith-based entrepreneurs should remember that success comes through serving others and building with integrity.';

  const refinementTests = [
    { type: 'shorten', instructions: 'Make it more concise' },
    { type: 'expand', instructions: 'Add more biblical context' },
    { type: 'improve', instructions: 'Make it more engaging' },
    { type: 'tone_change', instructions: 'Make it more professional' }
  ];

  for (const test of refinementTests) {
    try {
      const response = await fetch(`${API_BASE_URL}/content/refine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: originalContent,
          refinementType: test.type,
          instructions: test.instructions
        })
      });

      const data = await response.json();
      addTestResult(`Content Refinement (${test.type})`, response.ok);

      if (response.ok) {
        console.log(`   Original: ${originalContent.length} chars`);
        console.log(`   Refined: ${data.refinedContent.length} chars`);
        console.log(`   Preview: ${data.refinedContent.substring(0, 100)}...`);
      }

      await delay(1000);
    } catch (error) {
      addTestResult(`Content Refinement (${test.type})`, false, error.message);
    }
  }
}

async function testAnalyticsTracking(token) {
  console.log('\n📊 Testing Analytics Tracking...');

  if (!token) {
    addTestResult('Analytics Tracking', false, 'No authentication token available');
    return;
  }

  try {
    const trackResponse = await fetch(`${API_BASE_URL}/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        contentType: 'post',
        platform: 'instagram',
        success: true
      })
    });

    const trackData = await trackResponse.json();
    addTestResult('Analytics Event Tracking', trackResponse.ok);

    if (trackResponse.ok) {
      console.log(`   Event Tracked: ${trackData.message}`);

      // Get analytics data
      const analyticsResponse = await fetch(`${API_BASE_URL}/analytics/data`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const analyticsData = await analyticsResponse.json();
      addTestResult('Analytics Data Retrieval', analyticsResponse.ok);

      if (analyticsResponse.ok) {
        console.log(`   Total Generations: ${analyticsData.totalGenerations}`);
        console.log(`   Recent Activity Entries: ${analyticsData.recentActivity.length}`);
        console.log(`   Top Content Types: ${analyticsData.topContentTypes.length}`);
      }
    }
  } catch (error) {
    addTestResult('Analytics Tracking', false, error.message);
  }
}

async function generateTestReport() {
  console.log('\n📊 Test Results Summary');
  console.log('======================');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.details
      .filter(test => !test.success)
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.details}`);
      });
  }

  console.log('\n🎯 Next Steps:');
  if (testResults.failed === 0) {
    console.log('   ✅ All tests passed! Ready for frontend testing with:');
    console.log('   📱 npx expo start');
    console.log('   🧪 Complete user flow testing');
    console.log('   🎨 UI/UX validation');
    console.log('   📊 Performance testing');
  } else {
    console.log('   🔧 Fix failing tests before proceeding');
    console.log('   📝 Review error details above');
    console.log('   🔄 Re-run tests after fixes');
  }

  // Save test results
  const fs = require('fs');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = `test-results-${timestamp}.json`;

  try {
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results: testResults,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        apiBaseUrl: API_BASE_URL
      }
    }, null, 2));

    console.log(`\n📄 Detailed report saved: ${reportPath}`);
  } catch (error) {
    console.log(`\n⚠️ Could not save report: ${error.message}`);
  }
}

async function runPhase2Tests() {
  console.log('🚀 Starting Phase 2 Integration Testing...\n');

  const backendHealthy = await testBackendHealth();

  if (!backendHealthy) {
    console.log('\n🛑 Backend is not accessible. Please ensure:');
    console.log('   1. Backend server is running: cd kingdom-studios-backend && npm start');
    console.log('   2. Port 3001 is available');
    console.log('   3. Environment variables are configured');
    return;
  }

  await testSystemStatus();
  const authToken = await testAuthenticationFlow();
  await testContentTemplates();
  await testContentGeneration(authToken);
  await testFavoritesSystem(authToken);
  await testContentRefinement(authToken);
  await testAnalyticsTracking(authToken);

  await generateTestReport();
}

// Run the tests
runPhase2Tests().catch(error => {
  console.error('\n💥 Testing failed with error:', error.message);
  process.exit(1);
});
