/**
 * 🧪 TEST: Delete Account Features Implementation
 * Verify that all Kingdom apps have the delete account feature implemented
 */

const fs = require('fs');
const path = require('path');

function testDeleteAccountFeatures() {
  console.log('🗑️ Testing Delete Account Features Implementation...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  const apps = [
    { name: 'Kingdom Studios', path: 'kingdom-studios/src' },
    { name: 'Kingdom Clips', path: 'apps/kingdom-clips' },
    { name: 'Kingdom Voice', path: 'apps/kingdom-voice' },
    { name: 'Kingdom Launchpad', path: 'apps/kingdom-launchpad' },
    { name: 'Kingdom Circle', path: 'apps/kingdom-circle' },
    { name: 'Kingdom Lens', path: 'apps/kingdom-lens' }
  ];

  apps.forEach(app => {
    console.log(`📱 Testing ${app.name}...`);

    // Test 1: Check if delete user method exists in API service
    try {
      const apiServicePath = path.join(app.path, 'services/unifiedApiService.ts');
      if (fs.existsSync(apiServicePath)) {
        const content = fs.readFileSync(apiServicePath, 'utf8');
        if (content.includes('deleteUser') && content.includes('async deleteUser()')) {
          console.log(`✅ ${app.name}: Delete user method found in API service`);
          results.passed++;
          results.tests.push(`${app.name}: API service has deleteUser method`);
        } else {
          console.log(`❌ ${app.name}: Delete user method missing in API service`);
          results.failed++;
          results.tests.push(`${app.name}: API service missing deleteUser method`);
        }
      } else {
        console.log(`❌ ${app.name}: API service file not found`);
        results.failed++;
        results.tests.push(`${app.name}: API service file missing`);
      }
    } catch (error) {
      console.log(`❌ ${app.name}: Error checking API service`);
      results.failed++;
      results.tests.push(`${app.name}: API service check failed`);
    }

    // Test 2: Check if settings screen has delete account button
    try {
      let settingsPath;
      if (app.name === 'Kingdom Studios') {
        settingsPath = path.join(app.path, 'screens/SettingsScreen.tsx');
      } else if (app.name === 'Kingdom Clips') {
        settingsPath = path.join(app.path, 'app/(tabs)/SettingsScreen.tsx');
      } else {
        settingsPath = path.join(app.path, 'app/(tabs)/settings.tsx');
      }
      
      if (fs.existsSync(settingsPath)) {
        const content = fs.readFileSync(settingsPath, 'utf8');
        if (content.includes('Delete My Account') || content.includes('deleteAccount')) {
          console.log(`✅ ${app.name}: Delete account button found in settings`);
          results.passed++;
          results.tests.push(`${app.name}: Settings has delete account button`);
        } else {
          console.log(`❌ ${app.name}: Delete account button missing in settings`);
          results.failed++;
          results.tests.push(`${app.name}: Settings missing delete account button`);
        }
      } else {
        console.log(`❌ ${app.name}: Settings screen not found at ${settingsPath}`);
        results.failed++;
        results.tests.push(`${app.name}: Settings screen missing`);
      }
    } catch (error) {
      console.log(`❌ ${app.name}: Error checking settings screen`);
      results.failed++;
      results.tests.push(`${app.name}: Settings screen check failed`);
    }

    // Test 3: Check if confirmation modal exists
    try {
      let settingsPath;
      if (app.name === 'Kingdom Studios') {
        settingsPath = path.join(app.path, 'screens/SettingsScreen.tsx');
      } else if (app.name === 'Kingdom Clips') {
        settingsPath = path.join(app.path, 'app/(tabs)/SettingsScreen.tsx');
      } else {
        settingsPath = path.join(app.path, 'app/(tabs)/settings.tsx');
      }
      
      if (fs.existsSync(settingsPath)) {
        const content = fs.readFileSync(settingsPath, 'utf8');
        if (content.includes('Modal') && content.includes('showDeleteModal')) {
          console.log(`✅ ${app.name}: Delete confirmation modal found`);
          results.passed++;
          results.tests.push(`${app.name}: Settings has confirmation modal`);
        } else {
          console.log(`❌ ${app.name}: Delete confirmation modal missing`);
          results.failed++;
          results.tests.push(`${app.name}: Settings missing confirmation modal`);
        }
      } else {
        console.log(`❌ ${app.name}: Settings screen not found for modal check`);
        results.failed++;
        results.tests.push(`${app.name}: Settings screen missing for modal check`);
      }
    } catch (error) {
      console.log(`❌ ${app.name}: Error checking confirmation modal`);
      results.failed++;
      results.tests.push(`${app.name}: Modal check failed`);
    }

    // Test 4: Check if AsyncStorage clear is implemented
    try {
      let settingsPath;
      if (app.name === 'Kingdom Studios') {
        settingsPath = path.join(app.path, 'screens/SettingsScreen.tsx');
      } else if (app.name === 'Kingdom Clips') {
        settingsPath = path.join(app.path, 'app/(tabs)/SettingsScreen.tsx');
      } else {
        settingsPath = path.join(app.path, 'app/(tabs)/settings.tsx');
      }
      
      if (fs.existsSync(settingsPath)) {
        const content = fs.readFileSync(settingsPath, 'utf8');
        if (content.includes('AsyncStorage.clear()')) {
          console.log(`✅ ${app.name}: AsyncStorage clear implemented`);
          results.passed++;
          results.tests.push(`${app.name}: AsyncStorage clear implemented`);
        } else {
          console.log(`❌ ${app.name}: AsyncStorage clear missing`);
          results.failed++;
          results.tests.push(`${app.name}: AsyncStorage clear missing`);
        }
      } else {
        console.log(`❌ ${app.name}: Settings screen not found for AsyncStorage check`);
        results.failed++;
        results.tests.push(`${app.name}: Settings screen missing for AsyncStorage check`);
      }
    } catch (error) {
      console.log(`❌ ${app.name}: Error checking AsyncStorage clear`);
      results.failed++;
      results.tests.push(`${app.name}: AsyncStorage check failed`);
    }

    // Test 5: Check if error handling is implemented
    try {
      let settingsPath;
      if (app.name === 'Kingdom Studios') {
        settingsPath = path.join(app.path, 'screens/SettingsScreen.tsx');
      } else if (app.name === 'Kingdom Clips') {
        settingsPath = path.join(app.path, 'app/(tabs)/SettingsScreen.tsx');
      } else {
        settingsPath = path.join(app.path, 'app/(tabs)/settings.tsx');
      }
      
      if (fs.existsSync(settingsPath)) {
        const content = fs.readFileSync(settingsPath, 'utf8');
        if (content.includes('catch (error)') && content.includes('Alert.alert')) {
          console.log(`✅ ${app.name}: Error handling implemented`);
          results.passed++;
          results.tests.push(`${app.name}: Error handling implemented`);
        } else {
          console.log(`❌ ${app.name}: Error handling missing`);
          results.failed++;
          results.tests.push(`${app.name}: Error handling missing`);
        }
      } else {
        console.log(`❌ ${app.name}: Settings screen not found for error handling check`);
        results.failed++;
        results.tests.push(`${app.name}: Settings screen missing for error handling check`);
      }
    } catch (error) {
      console.log(`❌ ${app.name}: Error checking error handling`);
      results.failed++;
      results.tests.push(`${app.name}: Error handling check failed`);
    }

    console.log('');
  });

  console.log('📊 Delete Account Features Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📋 Total: ${results.passed + results.failed}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 All Kingdom apps have delete account features implemented!');
    console.log('');
    console.log('✅ Implementation Summary:');
    console.log('✅ All apps have deleteUser method in API service');
    console.log('✅ All apps have delete account button in settings');
    console.log('✅ All apps have confirmation modal');
    console.log('✅ All apps clear AsyncStorage on deletion');
    console.log('✅ All apps have proper error handling');
    console.log('');
    console.log('🚀 Ready for production deployment!');
  } else {
    console.log('⚠️  Some delete account features are missing');
    console.log('');
    console.log('🔧 Issues to fix:');
    results.tests.forEach(test => {
      if (test.includes('missing') || test.includes('failed')) {
        console.log(`- ${test}`);
      }
    });
  }
}

testDeleteAccountFeatures(); 