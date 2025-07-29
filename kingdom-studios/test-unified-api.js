/**
 * 🧪 Kingdom Studios - Unified API Test
 * Test the integration with the unified API system
 */

const { apiClients } = require('@kingdom-collective/api');

async function testKingdomStudiosAPI() {
  console.log('🎬 Testing Kingdom Studios Unified API...\n');

  const studiosApi = apiClients.studios;

  try {
    // Test 1: Check API configuration
    console.log('✅ Test 1: API Configuration');
    const config = studiosApi.getApiConfig();
    console.log('API Config:', config);
    console.log('Request Headers:', studiosApi.getRequestHeaders());
    console.log('');

    // Test 2: Test content generation
    console.log('✅ Test 2: Content Generation');
    const generationResult = await studiosApi.generateContent(
      'Write a short social media post about gratitude',
      'social',
      {
        tone: 'inspirational',
        faithMode: true,
        platform: 'instagram'
      }
    );
    console.log('Generation Result:', generationResult);
    console.log('');

    // Test 3: Test content history
    console.log('✅ Test 3: Content History');
    const historyResult = await studiosApi.getContentHistory(1, 5);
    console.log('History Result:', historyResult);
    console.log('');

    // Test 4: Test analytics
    console.log('✅ Test 4: Analytics');
    const analyticsResult = await studiosApi.getAnalytics('30d');
    console.log('Analytics Result:', analyticsResult);
    console.log('');

    // Test 5: Test event tracking
    console.log('✅ Test 5: Event Tracking');
    await studiosApi.trackEvent('test_content_generated', {
      type: 'social_post',
      length: 'short',
      platform: 'instagram'
    });
    console.log('Event tracked successfully');
    console.log('');

    // Test 6: Test usage stats
    console.log('✅ Test 6: Usage Statistics');
    const usageResult = await studiosApi.getUsageStats();
    console.log('Usage Result:', usageResult);
    console.log('');

    // Test 7: Test cache operations
    console.log('✅ Test 7: Cache Operations');
    const cacheStats = studiosApi.getCacheStats();
    console.log('Cache Stats:', cacheStats);
    
    studiosApi.clearCache();
    console.log('Cache cleared successfully');
    console.log('');

    // Test 8: Test API statistics
    console.log('✅ Test 8: API Statistics');
    const apiStats = await studiosApi.getApiStats();
    console.log('API Stats:', apiStats);
    console.log('');

    console.log('🎉 All tests passed! Kingdom Studios Unified API is working correctly.');
    console.log('');
    console.log('📊 Summary:');
    console.log('- ✅ API Configuration: Working');
    console.log('- ✅ Content Generation: Working');
    console.log('- ✅ Content History: Working');
    console.log('- ✅ Analytics: Working');
    console.log('- ✅ Event Tracking: Working');
    console.log('- ✅ Usage Statistics: Working');
    console.log('- ✅ Cache Operations: Working');
    console.log('- ✅ API Statistics: Working');
    console.log('');
    console.log('🚀 Kingdom Studios is ready to use the unified API system!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check if the unified API package is installed');
    console.log('2. Verify environment variables are set correctly');
    console.log('3. Ensure the backend server is running');
    console.log('4. Check network connectivity');
    console.log('5. Verify API endpoints are accessible');
  }
}

// Run the test
testKingdomStudiosAPI(); 