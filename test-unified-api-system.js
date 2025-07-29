/**
 * 🧪 KINGDOM COLLECTIVE - UNIFIED API SYSTEM TEST
 * Comprehensive test suite for all six Kingdom apps
 * 
 * This test verifies that all apps can successfully use the unified API system
 */

const { apiClients } = require('@kingdom-collective/api');

async function testUnifiedApiSystem() {
  console.log('🏛️ KINGDOM COLLECTIVE - UNIFIED API SYSTEM TEST\n');
  console.log('Testing all six Kingdom apps with unified API...\n');

  const results = {
    studios: { passed: 0, failed: 0, tests: [] },
    clips: { passed: 0, failed: 0, tests: [] },
    voice: { passed: 0, failed: 0, tests: [] },
    launchpad: { passed: 0, failed: 0, tests: [] },
    circle: { passed: 0, failed: 0, tests: [] },
    lens: { passed: 0, failed: 0, tests: [] }
  };

  // ================================
  // 🎬 KINGDOM STUDIOS TESTS
  // ================================
  console.log('🎬 Testing Kingdom Studios...');
  
  try {
    const studiosApi = apiClients.studios;
    
    // Test 1: API Configuration
    try {
      const config = studiosApi.getApiConfig();
      const headers = studiosApi.getRequestHeaders();
      console.log('✅ Studios API Config:', config);
      console.log('✅ Studios Headers:', headers);
      results.studios.passed++;
      results.studios.tests.push('API Configuration');
    } catch (error) {
      console.log('❌ Studios API Config failed:', error.message);
      results.studios.failed++;
      results.studios.tests.push('API Configuration');
    }

    // Test 2: Content Generation
    try {
      const generationResult = await studiosApi.generateContent(
        'Write a short social media post about gratitude',
        'social',
        {
          tone: 'inspirational',
          faithMode: true,
          platform: 'instagram'
        }
      );
      console.log('✅ Studios Content Generation:', generationResult.success);
      results.studios.passed++;
      results.studios.tests.push('Content Generation');
    } catch (error) {
      console.log('❌ Studios Content Generation failed:', error.message);
      results.studios.failed++;
      results.studios.tests.push('Content Generation');
    }

    // Test 3: Analytics
    try {
      const analytics = await studiosApi.getAnalytics('30d');
      console.log('✅ Studios Analytics:', analytics.success);
      results.studios.passed++;
      results.studios.tests.push('Analytics');
    } catch (error) {
      console.log('❌ Studios Analytics failed:', error.message);
      results.studios.failed++;
      results.studios.tests.push('Analytics');
    }

  } catch (error) {
    console.log('❌ Kingdom Studios tests failed:', error.message);
  }

  console.log('');

  // ================================
  // 🎬 KINGDOM CLIPS TESTS
  // ================================
  console.log('🎬 Testing Kingdom Clips...');
  
  try {
    const clipsApi = apiClients.clips;
    
    // Test 1: API Configuration
    try {
      const config = clipsApi.getApiConfig();
      const headers = clipsApi.getRequestHeaders();
      console.log('✅ Clips API Config:', config);
      console.log('✅ Clips Headers:', headers);
      results.clips.passed++;
      results.clips.tests.push('API Configuration');
    } catch (error) {
      console.log('❌ Clips API Config failed:', error.message);
      results.clips.failed++;
      results.clips.tests.push('API Configuration');
    }

    // Test 2: Video Upload (Mock)
    try {
      const uploadResult = await clipsApi.uploadVideo(
        { name: 'test-video.mp4', size: 1024 },
        (progress) => console.log('Upload progress:', progress)
      );
      console.log('✅ Clips Video Upload:', uploadResult.success);
      results.clips.passed++;
      results.clips.tests.push('Video Upload');
    } catch (error) {
      console.log('❌ Clips Video Upload failed:', error.message);
      results.clips.failed++;
      results.clips.tests.push('Video Upload');
    }

    // Test 3: Analytics
    try {
      const analytics = await clipsApi.getVideoAnalytics('test-video-id', '30d');
      console.log('✅ Clips Analytics:', analytics.success);
      results.clips.passed++;
      results.clips.tests.push('Analytics');
    } catch (error) {
      console.log('❌ Clips Analytics failed:', error.message);
      results.clips.failed++;
      results.clips.tests.push('Analytics');
    }

  } catch (error) {
    console.log('❌ Kingdom Clips tests failed:', error.message);
  }

  console.log('');

  // ================================
  // 🎤 KINGDOM VOICE TESTS
  // ================================
  console.log('🎤 Testing Kingdom Voice...');
  
  try {
    const voiceApi = apiClients.voice;
    
    // Test 1: API Configuration
    try {
      const config = voiceApi.getApiConfig();
      const headers = voiceApi.getRequestHeaders();
      console.log('✅ Voice API Config:', config);
      console.log('✅ Voice Headers:', headers);
      results.voice.passed++;
      results.voice.tests.push('API Configuration');
    } catch (error) {
      console.log('❌ Voice API Config failed:', error.message);
      results.voice.failed++;
      results.voice.tests.push('API Configuration');
    }

    // Test 2: Audio Recording
    try {
      const recording = await voiceApi.startRecording();
      console.log('✅ Voice Recording Started:', recording.recordingId);
      results.voice.passed++;
      results.voice.tests.push('Audio Recording');
    } catch (error) {
      console.log('❌ Voice Recording failed:', error.message);
      results.voice.failed++;
      results.voice.tests.push('Audio Recording');
    }

    // Test 3: Devotional Generation
    try {
      const devotional = await voiceApi.generateDevotional(
        'Gratitude',
        'Psalm 100:4',
        'reflection'
      );
      console.log('✅ Voice Devotional Generation:', devotional.devotional.title);
      results.voice.passed++;
      results.voice.tests.push('Devotional Generation');
    } catch (error) {
      console.log('❌ Voice Devotional Generation failed:', error.message);
      results.voice.failed++;
      results.voice.tests.push('Devotional Generation');
    }

  } catch (error) {
    console.log('❌ Kingdom Voice tests failed:', error.message);
  }

  console.log('');

  // ================================
  // 🚀 KINGDOM LAUNCHPAD TESTS
  // ================================
  console.log('🚀 Testing Kingdom Launchpad...');
  
  try {
    const launchpadApi = apiClients.launchpad;
    
    // Test 1: API Configuration
    try {
      const config = launchpadApi.getApiConfig();
      const headers = launchpadApi.getRequestHeaders();
      console.log('✅ Launchpad API Config:', config);
      console.log('✅ Launchpad Headers:', headers);
      results.launchpad.passed++;
      results.launchpad.tests.push('API Configuration');
    } catch (error) {
      console.log('❌ Launchpad API Config failed:', error.message);
      results.launchpad.failed++;
      results.launchpad.tests.push('API Configuration');
    }

    // Test 2: Product Creation
    try {
      const product = await launchpadApi.createProduct({
        name: 'Test Product',
        description: 'A test product',
        price: 29.99,
        currency: 'USD',
        category: 'digital',
        platform: 'etsy',
        status: 'draft',
        images: [],
        tags: ['test', 'digital']
      });
      console.log('✅ Launchpad Product Creation:', product.id);
      results.launchpad.passed++;
      results.launchpad.tests.push('Product Creation');
    } catch (error) {
      console.log('❌ Launchpad Product Creation failed:', error.message);
      results.launchpad.failed++;
      results.launchpad.tests.push('Product Creation');
    }

    // Test 3: Content Generation
    try {
      const content = await launchpadApi.generateMarketingContent(
        'Product Launch',
        'social',
        {
          tone: 'professional',
          platform: 'instagram',
          includeCallToAction: true
        }
      );
      console.log('✅ Launchpad Content Generation:', content.content);
      results.launchpad.passed++;
      results.launchpad.tests.push('Content Generation');
    } catch (error) {
      console.log('❌ Launchpad Content Generation failed:', error.message);
      results.launchpad.failed++;
      results.launchpad.tests.push('Content Generation');
    }

  } catch (error) {
    console.log('❌ Kingdom Launchpad tests failed:', error.message);
  }

  console.log('');

  // ================================
  // ⭕ KINGDOM CIRCLE TESTS
  // ================================
  console.log('⭕ Testing Kingdom Circle...');
  
  try {
    const circleApi = apiClients.circle;
    
    // Test 1: API Configuration
    try {
      const config = circleApi.getApiConfig();
      const headers = circleApi.getRequestHeaders();
      console.log('✅ Circle API Config:', config);
      console.log('✅ Circle Headers:', headers);
      results.circle.passed++;
      results.circle.tests.push('API Configuration');
    } catch (error) {
      console.log('❌ Circle API Config failed:', error.message);
      results.circle.failed++;
      results.circle.tests.push('API Configuration');
    }

    // Test 2: Group Creation
    try {
      const group = await circleApi.createGroup({
        name: 'Test Prayer Group',
        description: 'A test prayer group',
        category: 'prayer',
        privacy: 'public',
        ownerId: 'user123',
        moderators: [],
        members: [],
        tags: ['prayer', 'community'],
        imageUrl: undefined,
        isActive: true
      });
      console.log('✅ Circle Group Creation:', group.id);
      results.circle.passed++;
      results.circle.tests.push('Group Creation');
    } catch (error) {
      console.log('❌ Circle Group Creation failed:', error.message);
      results.circle.failed++;
      results.circle.tests.push('Group Creation');
    }

    // Test 3: Prayer Request
    try {
      const prayer = await circleApi.createPrayerRequest({
        title: 'Test Prayer Request',
        description: 'A test prayer request',
        requesterId: 'user123',
        requesterName: 'Test User',
        category: 'personal',
        urgency: 'medium',
        isAnonymous: false,
        isAnswered: false,
        tags: ['test', 'personal']
      });
      console.log('✅ Circle Prayer Request:', prayer.id);
      results.circle.passed++;
      results.circle.tests.push('Prayer Request');
    } catch (error) {
      console.log('❌ Circle Prayer Request failed:', error.message);
      results.circle.failed++;
      results.circle.tests.push('Prayer Request');
    }

  } catch (error) {
    console.log('❌ Kingdom Circle tests failed:', error.message);
  }

  console.log('');

  // ================================
  // 📸 KINGDOM LENS TESTS
  // ================================
  console.log('📸 Testing Kingdom Lens...');
  
  try {
    const lensApi = apiClients.lens;
    
    // Test 1: API Configuration
    try {
      const config = lensApi.getApiConfig();
      const headers = lensApi.getRequestHeaders();
      console.log('✅ Lens API Config:', config);
      console.log('✅ Lens Headers:', headers);
      results.lens.passed++;
      results.lens.tests.push('API Configuration');
    } catch (error) {
      console.log('❌ Lens API Config failed:', error.message);
      results.lens.failed++;
      results.lens.tests.push('API Configuration');
    }

    // Test 2: Photo Upload (Mock)
    try {
      const photo = await lensApi.uploadPhoto(
        { name: 'test-photo.jpg', size: 2048 },
        {
          title: 'Test Photo',
          description: 'A test photo',
          tags: ['test', 'portrait'],
          category: 'portrait',
          isPublic: true
        },
        (progress) => console.log('Upload progress:', progress)
      );
      console.log('✅ Lens Photo Upload:', photo.photoId);
      results.lens.passed++;
      results.lens.tests.push('Photo Upload');
    } catch (error) {
      console.log('❌ Lens Photo Upload failed:', error.message);
      results.lens.failed++;
      results.lens.tests.push('Photo Upload');
    }

    // Test 3: Gallery Creation
    try {
      const gallery = await lensApi.createGallery({
        title: 'Test Gallery',
        description: 'A test gallery',
        category: 'portrait',
        privacy: 'public',
        isActive: true
      });
      console.log('✅ Lens Gallery Creation:', gallery.id);
      results.lens.passed++;
      results.lens.tests.push('Gallery Creation');
    } catch (error) {
      console.log('❌ Lens Gallery Creation failed:', error.message);
      results.lens.failed++;
      results.lens.tests.push('Gallery Creation');
    }

  } catch (error) {
    console.log('❌ Kingdom Lens tests failed:', error.message);
  }

  console.log('');

  // ================================
  // 📊 TEST RESULTS SUMMARY
  // ================================
  console.log('📊 UNIFIED API SYSTEM TEST RESULTS\n');

  const totalTests = Object.values(results).reduce((sum, app) => sum + app.passed + app.failed, 0);
  const totalPassed = Object.values(results).reduce((sum, app) => sum + app.passed, 0);
  const totalFailed = Object.values(results).reduce((sum, app) => sum + app.failed, 0);

  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${totalPassed} ✅`);
  console.log(`Failed: ${totalFailed} ❌`);
  console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%\n`);

  // Individual app results
  Object.entries(results).forEach(([app, result]) => {
    const successRate = result.passed + result.failed > 0 
      ? ((result.passed / (result.passed + result.failed)) * 100).toFixed(1)
      : '0.0';
    
    console.log(`${getAppIcon(app)} ${app.toUpperCase()}: ${result.passed}✅ ${result.failed}❌ (${successRate}%)`);
    result.tests.forEach(test => {
      console.log(`  - ${test}`);
    });
  });

  console.log('\n🎉 UNIFIED API SYSTEM TEST COMPLETE!');
  
  if (totalFailed === 0) {
    console.log('✅ All tests passed! The unified API system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the backend implementation and network connectivity.');
  }

  return {
    totalTests,
    totalPassed,
    totalFailed,
    successRate: (totalPassed / totalTests) * 100,
    results
  };
}

function getAppIcon(app) {
  const icons = {
    studios: '🎬',
    clips: '🎬',
    voice: '🎤',
    launchpad: '🚀',
    circle: '⭕',
    lens: '📸'
  };
  return icons[app] || '📱';
}

// Run the test
testUnifiedApiSystem()
  .then(results => {
    console.log('\n📋 Test Summary:');
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(error => {
    console.error('❌ Test suite failed:', error);
  }); 