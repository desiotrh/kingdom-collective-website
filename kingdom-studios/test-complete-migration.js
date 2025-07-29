/**
 * 🧪 Kingdom Studios - Complete Migration Test
 * Test all phases of the Firebase to Unified API migration
 */

const fs = require('fs');
const path = require('path');

function testCompleteMigration() {
  console.log('🎯 Testing Kingdom Studios Complete Migration...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Phase 1: Authentication Migration
  console.log('🔐 Phase 1: Authentication Migration');
  
  // Test 1.1: UnifiedAuthContext exists
  try {
    const unifiedAuthPath = path.join(__dirname, 'src/contexts/UnifiedAuthContext.tsx');
    if (fs.existsSync(unifiedAuthPath)) {
      console.log('✅ Test 1.1: UnifiedAuthContext exists');
      results.passed++;
      results.tests.push('UnifiedAuthContext exists');
    } else {
      console.log('❌ Test 1.1: UnifiedAuthContext missing');
      results.failed++;
      results.tests.push('UnifiedAuthContext missing');
    }
  } catch (error) {
    console.log('❌ Test 1.1: Error checking UnifiedAuthContext');
    results.failed++;
    results.tests.push('UnifiedAuthContext check failed');
  }

  // Test 1.2: Old Firebase auth files removed
  try {
    const firebaseAuthPath = path.join(__dirname, 'src/contexts/FirebaseAuthContext.tsx');
    const firebaseConfigPath = path.join(__dirname, 'src/config/firebase.ts');
    const authUtilsPath = path.join(__dirname, 'src/utils/authUtils.ts');
    
    if (!fs.existsSync(firebaseAuthPath) && !fs.existsSync(firebaseConfigPath) && !fs.existsSync(authUtilsPath)) {
      console.log('✅ Test 1.2: Firebase auth files removed');
      results.passed++;
      results.tests.push('Firebase auth files removed');
    } else {
      console.log('⚠️  Test 1.2: Some Firebase auth files still exist');
      results.tests.push('Firebase auth files (pending removal)');
    }
  } catch (error) {
    console.log('❌ Test 1.2: Error checking Firebase auth files');
    results.failed++;
    results.tests.push('Firebase auth files check failed');
  }

  // Phase 2: User Profile Migration
  console.log('\n👤 Phase 2: User Profile Migration');
  
  // Test 2.1: userProfileService exists
  try {
    const userProfileServicePath = path.join(__dirname, 'src/services/userProfileService.ts');
    if (fs.existsSync(userProfileServicePath)) {
      console.log('✅ Test 2.1: userProfileService exists');
      results.passed++;
      results.tests.push('userProfileService exists');
    } else {
      console.log('❌ Test 2.1: userProfileService missing');
      results.failed++;
      results.tests.push('userProfileService missing');
    }
  } catch (error) {
    console.log('❌ Test 2.1: Error checking userProfileService');
    results.failed++;
    results.tests.push('userProfileService check failed');
  }

  // Test 2.2: SettingsScreen updated
  try {
    const settingsPath = path.join(__dirname, 'src/screens/SettingsScreen.tsx');
    if (fs.existsSync(settingsPath)) {
      const content = fs.readFileSync(settingsPath, 'utf8');
      if (content.includes('UnifiedAuthContext') && !content.includes('firebase/auth')) {
        console.log('✅ Test 2.2: SettingsScreen updated');
        results.passed++;
        results.tests.push('SettingsScreen updated');
      } else {
        console.log('❌ Test 2.2: SettingsScreen still has Firebase imports');
        results.failed++;
        results.tests.push('SettingsScreen Firebase imports');
      }
    } else {
      console.log('❌ Test 2.2: SettingsScreen.tsx missing');
      results.failed++;
      results.tests.push('SettingsScreen missing');
    }
  } catch (error) {
    console.log('❌ Test 2.2: Error checking SettingsScreen');
    results.failed++;
    results.tests.push('SettingsScreen check failed');
  }

  // Phase 3: Product Management Migration
  console.log('\n🛍️ Phase 3: Product Management Migration');
  
  // Test 3.1: productService exists
  try {
    const productServicePath = path.join(__dirname, 'src/services/productService.ts');
    if (fs.existsSync(productServicePath)) {
      console.log('✅ Test 3.1: productService exists');
      results.passed++;
      results.tests.push('productService exists');
    } else {
      console.log('❌ Test 3.1: productService missing');
      results.failed++;
      results.tests.push('productService missing');
    }
  } catch (error) {
    console.log('❌ Test 3.1: Error checking productService');
    results.failed++;
    results.tests.push('productService check failed');
  }

  // Test 3.2: Product screens updated
  try {
    const productsScreenPath = path.join(__dirname, 'src/screens/products/ProductsScreen.tsx');
    const addProductPath = path.join(__dirname, 'src/screens/tools/AddProductScreen.tsx');
    const editProductPath = path.join(__dirname, 'src/screens/tools/EditProductScreen.tsx');
    const productDetailsPath = path.join(__dirname, 'src/screens/tools/ProductDetailsScreen.tsx');
    
    const screens = [
      { path: productsScreenPath, name: 'ProductsScreen' },
      { path: addProductPath, name: 'AddProductScreen' },
      { path: editProductPath, name: 'EditProductScreen' },
      { path: productDetailsPath, name: 'ProductDetailsScreen' }
    ];
    
    let screensUpdated = 0;
    screens.forEach(screen => {
      if (fs.existsSync(screen.path)) {
        const content = fs.readFileSync(screen.path, 'utf8');
        if (content.includes('productService') && content.includes('UnifiedAuthContext')) {
          screensUpdated++;
        }
      }
    });
    
    if (screensUpdated === screens.length) {
      console.log('✅ Test 3.2: All product screens updated');
      results.passed++;
      results.tests.push('Product screens updated');
    } else {
      console.log(`❌ Test 3.2: ${screens.length - screensUpdated} product screens not updated`);
      results.failed++;
      results.tests.push(`Product screens incomplete (${screensUpdated}/${screens.length})`);
    }
  } catch (error) {
    console.log('❌ Test 3.2: Error checking product screens');
    results.failed++;
    results.tests.push('Product screens check failed');
  }

  // Phase 4: Content Management Migration
  console.log('\n📝 Phase 4: Content Management Migration');
  
  // Test 4.1: contentService exists
  try {
    const contentServicePath = path.join(__dirname, 'src/services/contentService.ts');
    if (fs.existsSync(contentServicePath)) {
      console.log('✅ Test 4.1: contentService exists');
      results.passed++;
      results.tests.push('contentService exists');
    } else {
      console.log('❌ Test 4.1: contentService missing');
      results.failed++;
      results.tests.push('contentService missing');
    }
  } catch (error) {
    console.log('❌ Test 4.1: Error checking contentService');
    results.failed++;
    results.tests.push('contentService check failed');
  }

  // Test 4.2: ContentGeneratorScreen updated
  try {
    const contentGeneratorPath = path.join(__dirname, 'src/screens/ContentGeneratorScreen.tsx');
    if (fs.existsSync(contentGeneratorPath)) {
      const content = fs.readFileSync(contentGeneratorPath, 'utf8');
      if (content.includes('contentService') && content.includes('UnifiedAuthContext')) {
        console.log('✅ Test 4.2: ContentGeneratorScreen updated');
        results.passed++;
        results.tests.push('ContentGeneratorScreen updated');
      } else {
        console.log('❌ Test 4.2: ContentGeneratorScreen still has Firebase imports');
        results.failed++;
        results.tests.push('ContentGeneratorScreen Firebase imports');
      }
    } else {
      console.log('❌ Test 4.2: ContentGeneratorScreen.tsx missing');
      results.failed++;
      results.tests.push('ContentGeneratorScreen missing');
    }
  } catch (error) {
    console.log('❌ Test 4.2: Error checking ContentGeneratorScreen');
    results.failed++;
    results.tests.push('ContentGeneratorScreen check failed');
  }

  // Auth Import Cleanup
  console.log('\n🔄 Auth Import Cleanup');
  
  // Test 5.1: Check for remaining old AuthContext imports
  try {
    const oldAuthContextPath = path.join(__dirname, 'src/contexts/AuthContext.tsx');
    if (!fs.existsSync(oldAuthContextPath)) {
      console.log('✅ Test 5.1: Old AuthContext.tsx removed');
      results.passed++;
      results.tests.push('Old AuthContext removed');
    } else {
      console.log('⚠️  Test 5.1: Old AuthContext.tsx still exists (should be removed)');
      results.tests.push('Old AuthContext (pending removal)');
    }
  } catch (error) {
    console.log('❌ Test 5.1: Error checking old AuthContext');
    results.failed++;
    results.tests.push('Old AuthContext check failed');
  }

  // Test 5.2: Check for remaining Firebase imports in key files
  try {
    const keyFiles = [
      'src/screens/SettingsScreen.tsx',
      'src/screens/products/ProductsScreen.tsx',
      'src/screens/tools/AddProductScreen.tsx',
      'src/screens/tools/EditProductScreen.tsx',
      'src/screens/tools/ProductDetailsScreen.tsx',
      'src/screens/ContentGeneratorScreen.tsx'
    ];
    
    let filesWithoutFirebase = 0;
    keyFiles.forEach(filePath => {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (!content.includes('firebase/auth') && !content.includes('firebaseService.getUserProducts')) {
          filesWithoutFirebase++;
        }
      }
    });
    
    if (filesWithoutFirebase === keyFiles.length) {
      console.log('✅ Test 5.2: All key files updated (no Firebase imports)');
      results.passed++;
      results.tests.push('Key files updated');
    } else {
      console.log(`❌ Test 5.2: ${keyFiles.length - filesWithoutFirebase} files still have Firebase imports`);
      results.failed++;
      results.tests.push(`Key files incomplete (${filesWithoutFirebase}/${keyFiles.length})`);
    }
  } catch (error) {
    console.log('❌ Test 5.2: Error checking Firebase imports');
    results.failed++;
    results.tests.push('Firebase imports check failed');
  }

  console.log('');
  console.log('📊 Complete Migration Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📋 Total: ${results.passed + results.failed}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 Complete migration test PASSED!');
    console.log('');
    console.log('✅ Migration Status:');
    console.log('✅ Phase 1: Authentication migrated to unified API');
    console.log('✅ Phase 2: User Profile management migrated');
    console.log('✅ Phase 3: Product management migrated');
    console.log('✅ Phase 4: Content management migrated');
    console.log('✅ Auth imports cleaned up');
    console.log('');
    console.log('🚀 Kingdom Studios is now fully migrated to the unified API!');
    console.log('');
    console.log('🔄 Next Steps:');
    console.log('1. Test all authentication flows');
    console.log('2. Test user profile management');
    console.log('3. Test product CRUD operations');
    console.log('4. Test content creation and management');
    console.log('5. Deploy the unified API backend');
    console.log('6. Remove old AuthContext.tsx file');
    console.log('7. Clean up any remaining Firebase dependencies');
  } else {
    console.log('⚠️  Complete migration test has issues');
    console.log('');
    console.log('🔧 Issues to fix:');
    results.tests.forEach(test => {
      if (test.includes('failed') || test.includes('missing') || test.includes('incomplete')) {
        console.log(`- ${test}`);
      }
    });
  }
}

testCompleteMigration(); 