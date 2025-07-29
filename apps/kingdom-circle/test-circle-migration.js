/**
 * 🧪 Kingdom Circle - Migration Verification
 * Verify that Kingdom Circle is Firebase-free and ready for production
 */

const fs = require('fs');
const path = require('path');

function testCircleMigration() {
  console.log('👥 Testing Kingdom Circle Migration...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Check if Firebase service doesn't exist (should not exist)
  try {
    const firestoreServicePath = path.join(__dirname, 'services/firestoreService.ts');
    if (!fs.existsSync(firestoreServicePath)) {
      console.log('✅ Test 1: No Firebase service (as expected)');
      results.passed++;
      results.tests.push('No Firebase service');
    } else {
      console.log('❌ Test 1: Firebase service exists (should not)');
      results.failed++;
      results.tests.push('Firebase service exists');
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

  // Test 3: Check for Firebase imports in source files
  try {
    const appPath = path.join(__dirname, 'app');
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
    
    if (fs.existsSync(appPath)) {
      scanDirectory(appPath);
      
      if (firebaseImports.length === 0) {
        console.log('✅ Test 3: No Firebase imports found in source files');
        results.passed++;
        results.tests.push('No Firebase imports');
      } else {
        console.log(`❌ Test 3: ${firebaseImports.length} files still have Firebase imports:`);
        firebaseImports.forEach(file => {
          console.log(`  - ${file}`);
        });
        results.failed++;
        results.tests.push(`${firebaseImports.length} Firebase imports found`);
      }
    } else {
      console.log('❌ Test 3: app directory missing');
      results.failed++;
      results.tests.push('app directory missing');
    }
  } catch (error) {
    console.log('❌ Test 3: Error scanning source files');
    results.failed++;
    results.tests.push('Source files scan failed');
  }

  // Test 4: Check if package.json has Firebase dependencies
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const content = fs.readFileSync(packageJsonPath, 'utf8');
      if (!content.includes('firebase')) {
        console.log('✅ Test 4: No Firebase dependencies in package.json');
        results.passed++;
        results.tests.push('No Firebase dependencies');
      } else {
        console.log('❌ Test 4: Firebase dependencies found in package.json');
        results.failed++;
        results.tests.push('Firebase dependencies in package.json');
      }
    } else {
      console.log('❌ Test 4: package.json missing');
      results.failed++;
      results.tests.push('package.json missing');
    }
  } catch (error) {
    console.log('❌ Test 4: Error checking package.json');
    results.failed++;
    results.tests.push('package.json check failed');
  }

  // Test 5: Check if app uses basic React Native components
  try {
    const indexPath = path.join(__dirname, 'app/(tabs)/index.tsx');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      if (content.includes('react-native') && !content.includes('firebase')) {
        console.log('✅ Test 5: App uses basic React Native components');
        results.passed++;
        results.tests.push('Uses React Native components');
      } else {
        console.log('❌ Test 5: App has Firebase dependencies');
        results.failed++;
        results.tests.push('App has Firebase dependencies');
      }
    } else {
      console.log('❌ Test 5: index.tsx missing');
      results.failed++;
      results.tests.push('index.tsx missing');
    }
  } catch (error) {
    console.log('❌ Test 5: Error checking index.tsx');
    results.failed++;
    results.tests.push('index.tsx check failed');
  }

  console.log('');
  console.log('📊 Kingdom Circle Migration Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📋 Total: ${results.passed + results.failed}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 Kingdom Circle migration test PASSED!');
    console.log('');
    console.log('✅ Migration Status:');
    console.log('✅ No Firebase service (as expected)');
    console.log('✅ Unified API service exists');
    console.log('✅ No Firebase imports in source files');
    console.log('✅ No Firebase dependencies in package.json');
    console.log('✅ App uses basic React Native components');
    console.log('');
    console.log('🚀 Kingdom Circle is already Firebase-free!');
    console.log('');
    console.log('🔄 Ready for:');
    console.log('1. Test community features and networking');
    console.log('2. Test accountability and check-ins');
    console.log('3. Test prayer board and group features');
    console.log('4. Test profile and settings management');
  } else {
    console.log('⚠️  Kingdom Circle migration test has issues');
    console.log('');
    console.log('🔧 Issues to fix:');
    results.tests.forEach(test => {
      if (test.includes('failed') || test.includes('missing') || test.includes('exists') || test.includes('found')) {
        console.log(`- ${test}`);
      }
    });
  }
}

testCircleMigration(); 