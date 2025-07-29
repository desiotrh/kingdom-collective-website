/**
 * 🧪 Kingdom Clips - Migration Verification
 * Verify that Firebase has been replaced with unified API
 */

const fs = require('fs');
const path = require('path');

function testClipsMigration() {
  console.log('🎬 Testing Kingdom Clips Migration...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Check if Firebase service was removed
  try {
    const firestoreServicePath = path.join(__dirname, 'services/firestoreService.ts');
    if (!fs.existsSync(firestoreServicePath)) {
      console.log('✅ Test 1: Firebase service removed');
      results.passed++;
      results.tests.push('Firebase service removed');
    } else {
      console.log('❌ Test 1: Firebase service still exists');
      results.failed++;
      results.tests.push('Firebase service still exists');
    }
  } catch (error) {
    console.log('❌ Test 1: Error checking Firebase service');
    results.failed++;
    results.tests.push('Firebase service check failed');
  }

  // Test 2: Check if unified API service exists
  try {
    const unifiedApiPath = path.join(__dirname, 'services/unifiedApiService.ts');
    if (fs.existsSync(unifiedApiPath)) {
      console.log('✅ Test 2: Unified API service exists');
      results.passed++;
      results.tests.push('Unified API service exists');
    } else {
      console.log('❌ Test 2: Unified API service missing');
      results.failed++;
      results.tests.push('Unified API service missing');
    }
  } catch (error) {
    console.log('❌ Test 2: Error checking unified API service');
    results.failed++;
    results.tests.push('Unified API service check failed');
  }

  // Test 3: Check if useClipsSync hook was updated
  try {
    const useClipsSyncPath = path.join(__dirname, 'hooks/useClipsSync.ts');
    if (fs.existsSync(useClipsSyncPath)) {
      const content = fs.readFileSync(useClipsSyncPath, 'utf8');
      if (content.includes('KingdomClipsApiService') && !content.includes('firestoreService')) {
        console.log('✅ Test 3: useClipsSync hook migrated to unified API');
        results.passed++;
        results.tests.push('useClipsSync hook migrated');
      } else {
        console.log('❌ Test 3: useClipsSync hook still uses Firebase');
        results.failed++;
        results.tests.push('useClipsSync hook not migrated');
      }
    } else {
      console.log('❌ Test 3: useClipsSync hook missing');
      results.failed++;
      results.tests.push('useClipsSync hook missing');
    }
  } catch (error) {
    console.log('❌ Test 3: Error checking useClipsSync hook');
    results.failed++;
    results.tests.push('useClipsSync hook check failed');
  }

  // Test 4: Check for Firebase imports in source files
  try {
    const srcPath = path.join(__dirname, 'app');
    const firebaseImports = [];
    
    function scanDirectory(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          scanDirectory(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.includes('import') && content.includes('firebase')) {
            firebaseImports.push(filePath.replace(__dirname, ''));
          }
        }
      });
    }
    
    if (fs.existsSync(srcPath)) {
      scanDirectory(srcPath);
      
      if (firebaseImports.length === 0) {
        console.log('✅ Test 4: No Firebase imports found in source files');
        results.passed++;
        results.tests.push('No Firebase imports');
      } else {
        console.log(`❌ Test 4: ${firebaseImports.length} files still have Firebase imports:`);
        firebaseImports.forEach(file => {
          console.log(`  - ${file}`);
        });
        results.failed++;
        results.tests.push(`${firebaseImports.length} Firebase imports found`);
      }
    } else {
      console.log('❌ Test 4: app directory missing');
      results.failed++;
      results.tests.push('app directory missing');
    }
  } catch (error) {
    console.log('❌ Test 4: Error scanning source files');
    results.failed++;
    results.tests.push('Source files scan failed');
  }

  // Test 5: Check if unified API package is installed
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const content = fs.readFileSync(packageJsonPath, 'utf8');
      if (content.includes('@kingdom-collective/api')) {
        console.log('✅ Test 5: Unified API package installed');
        results.passed++;
        results.tests.push('Unified API package installed');
      } else {
        console.log('❌ Test 5: Unified API package not installed');
        results.failed++;
        results.tests.push('Unified API package missing');
      }
    } else {
      console.log('❌ Test 5: package.json missing');
      results.failed++;
      results.tests.push('package.json missing');
    }
  } catch (error) {
    console.log('❌ Test 5: Error checking package.json');
    results.failed++;
    results.tests.push('package.json check failed');
  }

  console.log('');
  console.log('📊 Kingdom Clips Migration Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📋 Total: ${results.passed + results.failed}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 Kingdom Clips migration test PASSED!');
    console.log('');
    console.log('✅ Migration Status:');
    console.log('✅ Firebase service removed');
    console.log('✅ Unified API service exists');
    console.log('✅ useClipsSync hook migrated');
    console.log('✅ No Firebase imports in source files');
    console.log('✅ Unified API package installed');
    console.log('');
    console.log('🚀 Kingdom Clips is now Firebase-free!');
    console.log('');
    console.log('🔄 Ready for:');
    console.log('1. Test video upload and processing');
    console.log('2. Test clip management');
    console.log('3. Test analytics and tracking');
    console.log('4. Test social media integration');
  } else {
    console.log('⚠️  Kingdom Clips migration test has issues');
    console.log('');
    console.log('🔧 Issues to fix:');
    results.tests.forEach(test => {
      if (test.includes('failed') || test.includes('missing') || test.includes('still exists') || test.includes('not migrated')) {
        console.log(`- ${test}`);
      }
    });
  }
}

testClipsMigration(); 