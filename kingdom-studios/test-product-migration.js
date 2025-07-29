/**
 * 🧪 Kingdom Studios - Product Migration Test
 * Test the migration from Firebase product management to unified API
 */

const fs = require('fs');
const path = require('path');

function testProductMigration() {
  console.log('🛍️ Testing Kingdom Studios Product Migration...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Check if productService exists
  try {
    const productServicePath = path.join(__dirname, 'src/services/productService.ts');
    if (fs.existsSync(productServicePath)) {
      console.log('✅ Test 1: productService.ts exists');
      results.passed++;
      results.tests.push('productService exists');
    } else {
      console.log('❌ Test 1: productService.ts missing');
      results.failed++;
      results.tests.push('productService missing');
    }
  } catch (error) {
    console.log('❌ Test 1: Error checking productService');
    results.failed++;
    results.tests.push('productService check failed');
  }

  // Test 2: Check if ProductsScreen was updated
  try {
    const productsScreenPath = path.join(__dirname, 'src/screens/products/ProductsScreen.tsx');
    if (fs.existsSync(productsScreenPath)) {
      const content = fs.readFileSync(productsScreenPath, 'utf8');
      if (content.includes('productService') && content.includes('UnifiedAuthContext') && !content.includes('firebaseService.getUserProducts')) {
        console.log('✅ Test 2: ProductsScreen updated to use unified API');
        results.passed++;
        results.tests.push('ProductsScreen updated');
      } else {
        console.log('❌ Test 2: ProductsScreen still has Firebase imports or missing unified API');
        results.failed++;
        results.tests.push('ProductsScreen Firebase imports');
      }
    } else {
      console.log('❌ Test 2: ProductsScreen.tsx missing');
      results.failed++;
      results.tests.push('ProductsScreen missing');
    }
  } catch (error) {
    console.log('❌ Test 2: Error checking ProductsScreen');
    results.failed++;
    results.tests.push('ProductsScreen check failed');
  }

  // Test 3: Check if AddProductScreen was updated
  try {
    const addProductScreenPath = path.join(__dirname, 'src/screens/tools/AddProductScreen.tsx');
    if (fs.existsSync(addProductScreenPath)) {
      const content = fs.readFileSync(addProductScreenPath, 'utf8');
      if (content.includes('productService') && content.includes('UnifiedAuthContext') && content.includes('ProductCreateData')) {
        console.log('✅ Test 3: AddProductScreen updated to use unified API');
        results.passed++;
        results.tests.push('AddProductScreen updated');
      } else {
        console.log('❌ Test 3: AddProductScreen still has Firebase imports or missing unified API');
        results.failed++;
        results.tests.push('AddProductScreen Firebase imports');
      }
    } else {
      console.log('❌ Test 3: AddProductScreen.tsx missing');
      results.failed++;
      results.tests.push('AddProductScreen missing');
    }
  } catch (error) {
    console.log('❌ Test 3: Error checking AddProductScreen');
    results.failed++;
    results.tests.push('AddProductScreen check failed');
  }

  // Test 4: Check if EditProductScreen was updated
  try {
    const editProductScreenPath = path.join(__dirname, 'src/screens/tools/EditProductScreen.tsx');
    if (fs.existsSync(editProductScreenPath)) {
      const content = fs.readFileSync(editProductScreenPath, 'utf8');
      if (content.includes('productService') && content.includes('UnifiedAuthContext') && content.includes('ProductUpdateData')) {
        console.log('✅ Test 4: EditProductScreen updated to use unified API');
        results.passed++;
        results.tests.push('EditProductScreen updated');
      } else {
        console.log('❌ Test 4: EditProductScreen still has Firebase imports or missing unified API');
        results.failed++;
        results.tests.push('EditProductScreen Firebase imports');
      }
    } else {
      console.log('❌ Test 4: EditProductScreen.tsx missing');
      results.failed++;
      results.tests.push('EditProductScreen missing');
    }
  } catch (error) {
    console.log('❌ Test 4: Error checking EditProductScreen');
    results.failed++;
    results.tests.push('EditProductScreen check failed');
  }

  // Test 5: Check if ProductDetailsScreen was updated
  try {
    const productDetailsScreenPath = path.join(__dirname, 'src/screens/tools/ProductDetailsScreen.tsx');
    if (fs.existsSync(productDetailsScreenPath)) {
      const content = fs.readFileSync(productDetailsScreenPath, 'utf8');
      if (content.includes('productService') && content.includes('UnifiedAuthContext')) {
        console.log('✅ Test 5: ProductDetailsScreen updated to use unified API');
        results.passed++;
        results.tests.push('ProductDetailsScreen updated');
      } else {
        console.log('❌ Test 5: ProductDetailsScreen still has Firebase imports or missing unified API');
        results.failed++;
        results.tests.push('ProductDetailsScreen Firebase imports');
      }
    } else {
      console.log('❌ Test 5: ProductDetailsScreen.tsx missing');
      results.failed++;
      results.tests.push('ProductDetailsScreen missing');
    }
  } catch (error) {
    console.log('❌ Test 5: Error checking ProductDetailsScreen');
    results.failed++;
    results.tests.push('ProductDetailsScreen check failed');
  }

  // Test 6: Check if firebaseService product methods were removed
  try {
    const firebaseServicePath = path.join(__dirname, 'src/services/firebaseService.ts');
    if (fs.existsSync(firebaseServicePath)) {
      const content = fs.readFileSync(firebaseServicePath, 'utf8');
      if (!content.includes('saveProduct') && !content.includes('getUserProducts')) {
        console.log('✅ Test 6: Firebase product methods removed');
        results.passed++;
        results.tests.push('Firebase product methods removed');
      } else {
        console.log('⚠️  Test 6: Firebase product methods still present (will be removed in Phase 4)');
        results.tests.push('Firebase product methods (pending removal)');
      }
    } else {
      console.log('✅ Test 6: firebaseService.ts removed');
      results.passed++;
      results.tests.push('firebaseService removed');
    }
  } catch (error) {
    console.log('❌ Test 6: Error checking firebaseService');
    results.failed++;
    results.tests.push('firebaseService check failed');
  }

  // Test 7: Check if productService has all required methods
  try {
    const productServicePath = path.join(__dirname, 'src/services/productService.ts');
    if (fs.existsSync(productServicePath)) {
      const content = fs.readFileSync(productServicePath, 'utf8');
      const requiredMethods = [
        'createProduct',
        'getUserProducts',
        'getProduct',
        'updateProduct',
        'deleteProduct',
        'syncProductWithPlatforms',
        'getProductAnalytics',
        'uploadProductImages',
        'validateProductData',
        'getDefaultProductData',
        'getProductCategories',
        'getProductStatuses',
        'getSupportedPlatforms'
      ];
      
      let methodsFound = 0;
      requiredMethods.forEach(method => {
        if (content.includes(method)) {
          methodsFound++;
        }
      });
      
      if (methodsFound === requiredMethods.length) {
        console.log('✅ Test 7: productService has all required methods');
        results.passed++;
        results.tests.push('productService complete');
      } else {
        console.log(`❌ Test 7: productService missing ${requiredMethods.length - methodsFound} methods`);
        results.failed++;
        results.tests.push(`productService incomplete (${methodsFound}/${requiredMethods.length})`);
      }
    } else {
      console.log('❌ Test 7: productService.ts missing');
      results.failed++;
      results.tests.push('productService missing');
    }
  } catch (error) {
    console.log('❌ Test 7: Error checking productService methods');
    results.failed++;
    results.tests.push('productService methods check failed');
  }

  console.log('');
  console.log('📊 Product Migration Test Results:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📋 Total: ${results.passed + results.failed}`);
  console.log('');

  if (results.failed === 0) {
    console.log('🎉 Product migration test PASSED!');
    console.log('');
    console.log('✅ Migration Status:');
    console.log('✅ productService created');
    console.log('✅ ProductsScreen updated');
    console.log('✅ AddProductScreen updated');
    console.log('✅ EditProductScreen updated');
    console.log('✅ ProductDetailsScreen updated');
    console.log('✅ Product methods migrated to unified API');
    console.log('');
    console.log('🔄 Next Steps:');
    console.log('1. Test product creation');
    console.log('2. Test product listing and filtering');
    console.log('3. Test product updates and deletion');
    console.log('4. Test platform integration');
    console.log('5. Test product analytics');
    console.log('6. Remove remaining Firebase product methods');
  } else {
    console.log('⚠️  Product migration test has issues');
    console.log('');
    console.log('🔧 Issues to fix:');
    results.tests.forEach(test => {
      if (test.includes('failed') || test.includes('missing') || test.includes('incomplete')) {
        console.log(`- ${test}`);
      }
    });
  }
}

testProductMigration(); 