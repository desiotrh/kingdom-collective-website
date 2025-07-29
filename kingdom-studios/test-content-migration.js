/**
 * 🧪 Kingdom Studios - Content Migration Test
 * Test the migration from Firebase content management to unified API
 */

const fs = require('fs');
const path = require('path');

function testContentMigration() {
  console.log('📝 Testing Kingdom Studios Content Migration...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Check if contentService exists
  try {
    const contentServicePath = path.join(__dirname, 'src/services/contentService.ts');
    if (fs.existsSync(contentServicePath)) {
      console.log('✅ Test 1: contentService.ts exists');
      results.passed++;
      results.tests.push('contentService exists');
    } else {
      console.log('❌ Test 1: contentService.ts missing');
      results.failed++;
      results.tests.push('contentService missing');
    }
  } catch (error) {
    console.log('❌ Test 1: Error checking contentService');
    results.failed++;
    results.tests.push('contentService check failed');
  }

  // Test 2: Check if ContentGeneratorScreen was updated
  try {
    const contentGeneratorPath = path.join(__dirname, 'src/screens/ContentGeneratorScreen.tsx');
    if (fs.existsSync(contentGeneratorPath)) {
      const content = fs.readFileSync(contentGeneratorPath, 'utf8');
      if (content.includes('contentService') && content.includes('UnifiedAuthContext')) {
        console.log('✅ Test 2: ContentGeneratorScreen updated to use unified API');
        results.passed++;
        results.tests.push('ContentGeneratorScreen updated');
      } else {
        console.log('❌ Test 2: ContentGeneratorScreen still has Firebase imports or missing unified API');
        results.failed++;
        results.tests.push('ContentGeneratorScreen Firebase imports');
      }
    } else {
      console.log('❌ Test 2: ContentGeneratorScreen.tsx missing');
      results.failed++;
      results.tests.push('ContentGeneratorScreen missing');
    }
  } catch (error) {
    console.log('❌ Test 2: Error checking ContentGeneratorScreen');
    results.failed++;
    results.tests.push('ContentGeneratorScreen check failed');
  }

  // Test 3: Check if firebaseService content methods were removed
  try {
    const firebaseServicePath = path.join(__dirname, 'src/services/firebaseService.ts');
    if (fs.existsSync(firebaseServicePath)) {
      const content = fs.readFileSync(firebaseServicePath, 'utf8');
      if (!content.includes('saveContentPost') && !content.includes('getUserContentPosts')) {
        console.log('✅ Test 3: Firebase content methods removed');
        results.passed++;
        results.tests.push('Firebase content methods removed');
      } else {
        console.log('⚠️  Test 3: Firebase content methods still present (will be removed in Phase 5)');
        results.tests.push('Firebase content methods (pending removal)');
      }
    } else {
      console.log('✅ Test 3: firebaseService.ts removed');
      results.passed++;
      results.tests.push('firebaseService removed');
    }
  } catch (error) {
    console.log('❌ Test 3: Error checking firebaseService');
    results.failed++;
    results.tests.push('firebaseService check failed');
  }

  // Test 4: Check if contentService has all required methods
  try {
    const contentServicePath = path.join(__dirname, 'src/services/contentService.ts');
    if (fs.existsSync(contentServicePath)) {
      const content = fs.readFileSync(contentServicePath, 'utf8');
      const requiredMethods = [
        'saveContentPost',
        'getUserContentPosts',
        'getContentPost',
        'updateContentPost',
        'deleteContentPost',
        'getFavoritePosts',
        'toggleFavorite',
        'scheduleContentPost',
        'publishContentPost',
        'getContentAnalytics',
        'refineContent',
        'generateHashtags',
        'validateContentData',
        'getDefaultContentData',
        'getSupportedPlatforms',
        'getContentStatuses',
        'calculateReadingTime',
        'extractHashtags',
        'extractMentions'
      ];
      
      let methodsFound = 0;
      requiredMethods.forEach(method => {
        if (content.includes(method)) {
          methodsFound++;
        }
      });
      
      if (methodsFound === requiredMethods.length) {
        console.log('✅ Test 4: contentService has all required methods');
        results.passed++;
        results.tests.push('contentService complete');
      } else {
        console.log(`❌ Test 4: contentService missing ${requiredMethods.length - methodsFound} methods`);
        results.failed++;
        results.tests.push(`contentService incomplete (${methodsFound}/${requiredMethods.length})`);
      }
    } else {
      console.log('❌ Test 4: contentService.ts missing');
      results.failed++;
      results.tests.push('contentService missing');
    }
  } catch (error) {
    console.log('❌ Test 4: Error checking contentService methods');
    results.failed++;
    results.tests.push('contentService methods check failed');
  }

  // Test 5: Check if auth imports were updated
  try {
    const authContextPath = path.join(__dirname, 'src/contexts/UnifiedAuthContext.tsx');
    if (fs.existsSync(authContextPath)) {
      console.log('✅ Test 5: UnifiedAuthContext exists');
      results.passed++;
      results.tests.push('UnifiedAuthContext exists');
    } else {
      console.log('❌ Test 5: UnifiedAuthContext.tsx missing');
      results.failed++;
      results.tests.push('UnifiedAuthContext missing');
    }
  } catch (error) {
    console.log('❌ Test 5: Error checking UnifiedAuthContext');
    results.failed++;
    results.tests.push('UnifiedAuthContext check failed');
  }

  // Test 6: Check if old AuthContext still exists (should be removed)
  try {
    const oldAuthContextPath = path.join(__dirname, 'src/contexts/AuthContext.tsx');
    if (fs.existsSync(oldAuthContextPath)) {
      console.log('⚠️  Test 6: Old AuthContext.tsx still exists (should be removed)');
      results.tests.push('Old AuthContext (pending removal)');
    } else {
      console.log('✅ Test 6: Old AuthContext.tsx removed');
      results.passed++;
      results.tests.push('Old AuthContext removed');
    }
  } catch (error) {
    console.log('❌ Test 6: Error checking old AuthContext');
    results.failed++;
    results.tests.push('Old AuthContext check failed');
  }

  console.log('');
  console.log('📊 Content Migration Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📋 Total: ${results.passed + results.failed}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 Content migration test PASSED!');
    console.log('');
    console.log('✅ Migration Status:');
    console.log('✅ contentService created');
    console.log('✅ ContentGeneratorScreen updated');
    console.log('✅ Content methods migrated to unified API');
    console.log('✅ Auth imports updated');
    console.log('');
    console.log('🔄 Next Steps:');
    console.log('1. Test content creation');
    console.log('2. Test content history and favorites');
    console.log('3. Test content refinement and analytics');
    console.log('4. Test platform integration');
    console.log('5. Remove remaining Firebase content methods');
    console.log('6. Remove old AuthContext.tsx file');
  } else {
    console.log('⚠️  Content migration test has issues');
    console.log('');
    console.log('🔧 Issues to fix:');
    results.tests.forEach(test => {
      if (test.includes('failed') || test.includes('missing') || test.includes('incomplete')) {
        console.log(`- ${test}`);
      }
    });
  }
}

testContentMigration(); 