/**
 * 🧪 Kingdom Studios - Profile Migration Test
 * Test the migration from Firebase user profiles to unified API
 */

const fs = require('fs');
const path = require('path');

function testProfileMigration() {
  console.log('👤 Testing Kingdom Studios Profile Migration...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Check if userProfileService exists
  try {
    const userProfileServicePath = path.join(__dirname, 'src/services/userProfileService.ts');
    if (fs.existsSync(userProfileServicePath)) {
      console.log('✅ Test 1: userProfileService.ts exists');
      results.passed++;
      results.tests.push('userProfileService exists');
    } else {
      console.log('❌ Test 1: userProfileService.ts missing');
      results.failed++;
      results.tests.push('userProfileService missing');
    }
  } catch (error) {
    console.log('❌ Test 1: Error checking userProfileService');
    results.failed++;
    results.tests.push('userProfileService check failed');
  }

  // Test 2: Check if UnifiedAuthContext was updated with profile support
  try {
    const authContextPath = path.join(__dirname, 'src/contexts/UnifiedAuthContext.tsx');
    if (fs.existsSync(authContextPath)) {
      const content = fs.readFileSync(authContextPath, 'utf8');
      if (content.includes('userProfileService') && content.includes('UserProfile')) {
        console.log('✅ Test 2: UnifiedAuthContext updated with profile support');
        results.passed++;
        results.tests.push('UnifiedAuthContext profile support');
      } else {
        console.log('❌ Test 2: UnifiedAuthContext not updated with profile support');
        results.failed++;
        results.tests.push('UnifiedAuthContext profile support missing');
      }
    } else {
      console.log('❌ Test 2: UnifiedAuthContext.tsx missing');
      results.failed++;
      results.tests.push('UnifiedAuthContext missing');
    }
  } catch (error) {
    console.log('❌ Test 2: Error checking UnifiedAuthContext');
    results.failed++;
    results.tests.push('UnifiedAuthContext check failed');
  }

  // Test 3: Check if SettingsScreen was updated
  try {
    const settingsPath = path.join(__dirname, 'src/screens/SettingsScreen.tsx');
    if (fs.existsSync(settingsPath)) {
      const content = fs.readFileSync(settingsPath, 'utf8');
      if (content.includes('UnifiedAuthContext') && !content.includes('firebase/auth')) {
        console.log('✅ Test 3: SettingsScreen updated to use unified API');
        results.passed++;
        results.tests.push('SettingsScreen updated');
      } else {
        console.log('❌ Test 3: SettingsScreen still has Firebase imports');
        results.failed++;
        results.tests.push('SettingsScreen Firebase imports');
      }
    } else {
      console.log('❌ Test 3: SettingsScreen.tsx missing');
      results.failed++;
      results.tests.push('SettingsScreen missing');
    }
  } catch (error) {
    console.log('❌ Test 3: Error checking SettingsScreen');
    results.failed++;
    results.tests.push('SettingsScreen check failed');
  }

  // Test 4: Check if firebaseService still has user profile methods
  try {
    const firebaseServicePath = path.join(__dirname, 'src/services/firebaseService.ts');
    if (fs.existsSync(firebaseServicePath)) {
      const content = fs.readFileSync(firebaseServicePath, 'utf8');
      if (content.includes('createUserProfile') || content.includes('getUserProfile') || content.includes('updateUserProfile')) {
        console.log('⚠️  Test 4: firebaseService still has user profile methods (will be removed in Phase 3)');
        results.tests.push('firebaseService profile methods (pending removal)');
      } else {
        console.log('✅ Test 4: firebaseService user profile methods removed');
        results.passed++;
        results.tests.push('firebaseService profile methods removed');
      }
    } else {
      console.log('✅ Test 4: firebaseService.ts removed');
      results.passed++;
      results.tests.push('firebaseService removed');
    }
  } catch (error) {
    console.log('❌ Test 4: Error checking firebaseService');
    results.failed++;
    results.tests.push('firebaseService check failed');
  }

  // Test 5: Check if userProfileService has all required methods
  try {
    const userProfileServicePath = path.join(__dirname, 'src/services/userProfileService.ts');
    if (fs.existsSync(userProfileServicePath)) {
      const content = fs.readFileSync(userProfileServicePath, 'utf8');
      const requiredMethods = [
        'getUserProfile',
        'createUserProfile', 
        'updateUserProfile',
        'updatePreferences',
        'updateNotificationSettings',
        'updatePrivacySettings',
        'updateFaithMode',
        'completeOnboarding',
        'validateProfileData'
      ];
      
      let methodsFound = 0;
      requiredMethods.forEach(method => {
        if (content.includes(method)) {
          methodsFound++;
        }
      });
      
      if (methodsFound === requiredMethods.length) {
        console.log('✅ Test 5: userProfileService has all required methods');
        results.passed++;
        results.tests.push('userProfileService complete');
      } else {
        console.log(`❌ Test 5: userProfileService missing ${requiredMethods.length - methodsFound} methods`);
        results.failed++;
        results.tests.push(`userProfileService incomplete (${methodsFound}/${requiredMethods.length})`);
      }
    } else {
      console.log('❌ Test 5: userProfileService.ts missing');
      results.failed++;
      results.tests.push('userProfileService missing');
    }
  } catch (error) {
    console.log('❌ Test 5: Error checking userProfileService methods');
    results.failed++;
    results.tests.push('userProfileService methods check failed');
  }

  console.log('');
  console.log('📊 Profile Migration Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📋 Total: ${results.passed + results.failed}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 Profile migration test PASSED!');
    console.log('');
    console.log('✅ Migration Status:');
    console.log('✅ userProfileService created');
    console.log('✅ UnifiedAuthContext updated with profile support');
    console.log('✅ SettingsScreen updated');
    console.log('✅ Profile methods migrated to unified API');
    console.log('');
    console.log('🔄 Next Steps:');
    console.log('1. Test profile creation during registration');
    console.log('2. Test profile loading after login');
    console.log('3. Test profile updates in settings');
    console.log('4. Test profile validation and error handling');
    console.log('5. Remove remaining Firebase profile methods');
  } else {
    console.log('⚠️  Profile migration test has issues');
    console.log('');
    console.log('🔧 Issues to fix:');
    results.tests.forEach(test => {
      if (test.includes('failed') || test.includes('missing') || test.includes('incomplete')) {
        console.log(`- ${test}`);
      }
    });
  }
}

testProfileMigration(); 