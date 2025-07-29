/**
 * 🧪 Kingdom Studios - Auth Migration Verification
 * Verify that the authentication migration was completed successfully
 */

const fs = require('fs');
const path = require('path');

function verifyAuthMigration() {
  console.log('🔐 Verifying Kingdom Studios Auth Migration...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Check if UnifiedAuthContext exists
  try {
    const unifiedAuthPath = path.join(__dirname, 'src/contexts/UnifiedAuthContext.tsx');
    if (fs.existsSync(unifiedAuthPath)) {
      console.log('✅ Test 1: UnifiedAuthContext.tsx exists');
      results.passed++;
      results.tests.push('UnifiedAuthContext exists');
    } else {
      console.log('❌ Test 1: UnifiedAuthContext.tsx missing');
      results.failed++;
      results.tests.push('UnifiedAuthContext missing');
    }
  } catch (error) {
    console.log('❌ Test 1: Error checking UnifiedAuthContext');
    results.failed++;
    results.tests.push('UnifiedAuthContext check failed');
  }

  // Test 2: Check if FirebaseAuthContext was removed
  try {
    const firebaseAuthPath = path.join(__dirname, 'src/contexts/FirebaseAuthContext.tsx');
    if (!fs.existsSync(firebaseAuthPath)) {
      console.log('✅ Test 2: FirebaseAuthContext.tsx removed');
      results.passed++;
      results.tests.push('FirebaseAuthContext removed');
    } else {
      console.log('❌ Test 2: FirebaseAuthContext.tsx still exists');
      results.failed++;
      results.tests.push('FirebaseAuthContext still exists');
    }
  } catch (error) {
    console.log('❌ Test 2: Error checking FirebaseAuthContext');
    results.failed++;
    results.tests.push('FirebaseAuthContext check failed');
  }

  // Test 3: Check if firebase.ts was removed
  try {
    const firebaseConfigPath = path.join(__dirname, 'src/config/firebase.ts');
    if (!fs.existsSync(firebaseConfigPath)) {
      console.log('✅ Test 3: firebase.ts removed');
      results.passed++;
      results.tests.push('firebase.ts removed');
    } else {
      console.log('❌ Test 3: firebase.ts still exists');
      results.failed++;
      results.tests.push('firebase.ts still exists');
    }
  } catch (error) {
    console.log('❌ Test 3: Error checking firebase.ts');
    results.failed++;
    results.tests.push('firebase.ts check failed');
  }

  // Test 4: Check if authUtils.ts was removed
  try {
    const authUtilsPath = path.join(__dirname, 'src/utils/authUtils.ts');
    if (!fs.existsSync(authUtilsPath)) {
      console.log('✅ Test 4: authUtils.ts removed');
      results.passed++;
      results.tests.push('authUtils.ts removed');
    } else {
      console.log('❌ Test 4: authUtils.ts still exists');
      results.failed++;
      results.tests.push('authUtils.ts still exists');
    }
  } catch (error) {
    console.log('❌ Test 4: Error checking authUtils.ts');
    results.failed++;
    results.tests.push('authUtils.ts check failed');
  }

  // Test 5: Check if App.tsx was updated
  try {
    const appPath = path.join(__dirname, 'App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf8');
    if (appContent.includes('UnifiedAuthContext')) {
      console.log('✅ Test 5: App.tsx updated to use UnifiedAuthContext');
      results.passed++;
      results.tests.push('App.tsx updated');
    } else {
      console.log('❌ Test 5: App.tsx not updated');
      results.failed++;
      results.tests.push('App.tsx not updated');
    }
  } catch (error) {
    console.log('❌ Test 5: Error checking App.tsx');
    results.failed++;
    results.tests.push('App.tsx check failed');
  }

  // Test 6: Check if critical imports were updated
  const criticalFiles = [
    'src/hooks/usePayment.ts',
    'src/hooks/useNotifications.ts',
    'src/hooks/useAIGeneration.ts',
    'src/screens/NotificationSettingsScreen.tsx',
    'src/screens/SubscriptionUpgradeScreen.tsx',
    'src/screens/AIGenerationTestScreen.tsx'
  ];

  let importUpdatesPassed = 0;
  let importUpdatesFailed = 0;

  criticalFiles.forEach(file => {
    try {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('UnifiedAuthContext')) {
          console.log(`✅ ${file} updated`);
          importUpdatesPassed++;
        } else if (content.includes('FirebaseAuthContext')) {
          console.log(`❌ ${file} still uses FirebaseAuthContext`);
          importUpdatesFailed++;
        } else {
          console.log(`⚠️  ${file} doesn't import auth context`);
        }
      } else {
        console.log(`⚠️  ${file} not found`);
      }
    } catch (error) {
      console.log(`❌ Error checking ${file}`);
      importUpdatesFailed++;
    }
  });

  if (importUpdatesPassed > 0) {
    results.passed++;
    results.tests.push(`${importUpdatesPassed} critical imports updated`);
  }
  if (importUpdatesFailed > 0) {
    results.failed++;
    results.tests.push(`${importUpdatesFailed} imports still need updating`);
  }

  console.log('');
  console.log('📊 Migration Verification Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📋 Total: ${results.passed + results.failed}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 Auth migration verification PASSED!');
    console.log('');
    console.log('✅ Migration Status:');
    console.log('✅ UnifiedAuthContext created');
    console.log('✅ Firebase auth files removed');
    console.log('✅ App.tsx updated');
    console.log('✅ Critical imports updated');
    console.log('');
    console.log('🔄 Next Steps:');
    console.log('1. Update remaining useAuth() imports');
    console.log('2. Test login/register/logout flows');
    console.log('3. Verify user profile management');
    console.log('4. Test error handling');
  } else {
    console.log('⚠️  Auth migration verification has issues');
    console.log('');
    console.log('🔧 Issues to fix:');
    results.tests.forEach(test => {
      if (test.includes('failed') || test.includes('missing') || test.includes('not updated')) {
        console.log(`- ${test}`);
      }
    });
  }
}

verifyAuthMigration(); 