/**
 * 🧪 Kingdom Studios - Final Cleanup Verification
 * Verify that all Firebase dependencies have been removed
 */

const fs = require('fs');
const path = require('path');

function testFinalCleanup() {
  console.log('🧹 Testing Final Cleanup...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Check if old AuthContext.tsx was removed
  try {
    const oldAuthContextPath = path.join(__dirname, 'src/contexts/AuthContext.tsx');
    if (!fs.existsSync(oldAuthContextPath)) {
      console.log('✅ Test 1: Old AuthContext.tsx removed');
      results.passed++;
      results.tests.push('Old AuthContext removed');
    } else {
      console.log('❌ Test 1: Old AuthContext.tsx still exists');
      results.failed++;
      results.tests.push('Old AuthContext still exists');
    }
  } catch (error) {
    console.log('❌ Test 1: Error checking old AuthContext');
    results.failed++;
    results.tests.push('Old AuthContext check failed');
  }

  // Test 2: Check if Firebase packages were removed from package.json
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const content = fs.readFileSync(packageJsonPath, 'utf8');
      const firebasePackages = ['firebase', '@react-native-firebase/app', '@react-native-firebase/analytics', '@react-native-firebase/firestore'];
      const firebaseScripts = ['firebase:deploy', 'firebase:rules', 'firebase:indexes', 'firebase:storage'];
      
      let firebasePackagesFound = 0;
      let firebaseScriptsFound = 0;
      
      firebasePackages.forEach(pkg => {
        if (content.includes(pkg)) {
          firebasePackagesFound++;
        }
      });
      
      firebaseScripts.forEach(script => {
        if (content.includes(script)) {
          firebaseScriptsFound++;
        }
      });
      
      if (firebasePackagesFound === 0 && firebaseScriptsFound === 0) {
        console.log('✅ Test 2: Firebase packages and scripts removed from package.json');
        results.passed++;
        results.tests.push('Firebase packages removed');
      } else {
        console.log(`❌ Test 2: ${firebasePackagesFound} Firebase packages and ${firebaseScriptsFound} Firebase scripts still in package.json`);
        results.failed++;
        results.tests.push(`Firebase packages incomplete (${firebasePackagesFound} packages, ${firebaseScriptsFound} scripts)`);
      }
    } else {
      console.log('❌ Test 2: package.json missing');
      results.failed++;
      results.tests.push('package.json missing');
    }
  } catch (error) {
    console.log('❌ Test 2: Error checking package.json');
    results.failed++;
    results.tests.push('package.json check failed');
  }

  // Test 3: Check for Firebase imports in source files
  try {
    const srcPath = path.join(__dirname, 'src');
    const firebaseImports = [];
    
    function scanDirectory(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          scanDirectory(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
          const content = fs.readFileSync(filePath, 'utf8');
          // Check for actual Firebase import statements, not just mentions in comments
          const lines = content.split('\n');
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('import') && 
                (trimmedLine.includes('firebase') || trimmedLine.includes('Firebase'))) {
              firebaseImports.push(filePath.replace(__dirname, ''));
              break;
            }
          }
        }
      });
    }
    
    if (fs.existsSync(srcPath)) {
      scanDirectory(srcPath);
      
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
      console.log('❌ Test 3: src directory missing');
      results.failed++;
      results.tests.push('src directory missing');
    }
  } catch (error) {
    console.log('❌ Test 3: Error scanning source files');
    results.failed++;
    results.tests.push('Source files scan failed');
  }

  // Test 4: Check if unified API services exist
  try {
    const requiredServices = [
      'src/services/userProfileService.ts',
      'src/services/productService.ts',
      'src/services/contentService.ts',
      'src/contexts/UnifiedAuthContext.tsx'
    ];
    
    let servicesExist = 0;
    requiredServices.forEach(servicePath => {
      const fullPath = path.join(__dirname, servicePath);
      if (fs.existsSync(fullPath)) {
        servicesExist++;
      }
    });
    
    if (servicesExist === requiredServices.length) {
      console.log('✅ Test 4: All unified API services exist');
      results.passed++;
      results.tests.push('Unified API services exist');
    } else {
      console.log(`❌ Test 4: ${requiredServices.length - servicesExist} unified API services missing`);
      results.failed++;
      results.tests.push(`Unified API services incomplete (${servicesExist}/${requiredServices.length})`);
    }
  } catch (error) {
    console.log('❌ Test 4: Error checking unified API services');
    results.failed++;
    results.tests.push('Unified API services check failed');
  }

  // Test 5: Check if node_modules is clean (no Firebase)
  try {
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      const firebaseDir = path.join(nodeModulesPath, 'firebase');
      const reactNativeFirebaseDir = path.join(nodeModulesPath, '@react-native-firebase');
      
      if (!fs.existsSync(firebaseDir) && !fs.existsSync(reactNativeFirebaseDir)) {
        console.log('✅ Test 5: Firebase packages removed from node_modules');
        results.passed++;
        results.tests.push('Firebase packages removed from node_modules');
      } else {
        console.log('❌ Test 5: Firebase packages still exist in node_modules');
        results.failed++;
        results.tests.push('Firebase packages in node_modules');
      }
    } else {
      console.log('⚠️  Test 5: node_modules directory not found (run npm install first)');
      results.tests.push('node_modules not found');
    }
  } catch (error) {
    console.log('❌ Test 5: Error checking node_modules');
    results.failed++;
    results.tests.push('node_modules check failed');
  }

  console.log('');
  console.log('📊 Final Cleanup Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📋 Total: ${results.passed + results.failed}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 Final cleanup test PASSED!');
    console.log('');
    console.log('✅ Cleanup Status:');
    console.log('✅ Old AuthContext.tsx removed');
    console.log('✅ Firebase packages removed from package.json');
    console.log('✅ Firebase scripts removed from package.json');
    console.log('✅ No Firebase imports in source files');
    console.log('✅ All unified API services exist');
    console.log('✅ Firebase packages removed from node_modules');
    console.log('');
    console.log('🚀 Kingdom Studios is now completely Firebase-free!');
    console.log('');
    console.log('🔄 Ready for:');
    console.log('1. Start development server: npm start');
    console.log('2. Test authentication flows');
    console.log('3. Test user profile management');
    console.log('4. Test product management');
    console.log('5. Test content management');
    console.log('6. Deploy unified API backend');
  } else {
    console.log('⚠️  Final cleanup test has issues');
    console.log('');
    console.log('🔧 Issues to fix:');
    results.tests.forEach(test => {
      if (test.includes('failed') || test.includes('missing') || test.includes('incomplete') || test.includes('still exists')) {
        console.log(`- ${test}`);
      }
    });
  }
}

testFinalCleanup(); 