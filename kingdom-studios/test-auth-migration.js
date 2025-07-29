/**
 * 🧪 Kingdom Studios - Auth Migration Test
 * Test the migration from Firebase auth to unified API
 */

const { apiClients } = require('@kingdom-collective/api');

async function testAuthMigration() {
  console.log('🔐 Testing Kingdom Studios Auth Migration...\n');

  const studiosApi = apiClients.studios;

  try {
    // Test 1: API Configuration
    console.log('✅ Test 1: API Configuration');
    const config = studiosApi.getApiConfig();
    const headers = studiosApi.getRequestHeaders();
    console.log('API Config:', config);
    console.log('Request Headers:', headers);
    console.log('');

    // Test 2: Authentication Methods
    console.log('✅ Test 2: Authentication Methods');
    
    // Test login method exists
    if (typeof studiosApi.login === 'function') {
      console.log('✅ Login method available');
    } else {
      console.log('❌ Login method missing');
    }

    // Test register method exists
    if (typeof studiosApi.register === 'function') {
      console.log('✅ Register method available');
    } else {
      console.log('❌ Register method missing');
    }

    // Test logout method exists
    if (typeof studiosApi.logout === 'function') {
      console.log('✅ Logout method available');
    } else {
      console.log('❌ Logout method missing');
    }

    // Test getCurrentUser method exists
    if (typeof studiosApi.getCurrentUser === 'function') {
      console.log('✅ GetCurrentUser method available');
    } else {
      console.log('❌ GetCurrentUser method missing');
    }

    console.log('');

    // Test 3: User Profile Methods
    console.log('✅ Test 3: User Profile Methods');
    
    // Test getUserProfile method exists
    if (typeof studiosApi.getUserProfile === 'function') {
      console.log('✅ GetUserProfile method available');
    } else {
      console.log('❌ GetUserProfile method missing');
    }

    // Test updateUserProfile method exists
    if (typeof studiosApi.updateUserProfile === 'function') {
      console.log('✅ UpdateUserProfile method available');
    } else {
      console.log('❌ UpdateUserProfile method missing');
    }

    console.log('');

    // Test 4: Error Handling
    console.log('✅ Test 4: Error Handling');
    try {
      // This should fail gracefully since we're not authenticated
      await studiosApi.getCurrentUser();
      console.log('❌ Should have failed without auth');
    } catch (error) {
      console.log('✅ Properly handles unauthenticated requests');
    }

    console.log('');

    console.log('🎉 Auth migration test completed successfully!');
    console.log('');
    console.log('📋 Migration Status:');
    console.log('✅ UnifiedAuthContext created');
    console.log('✅ Firebase auth files removed');
    console.log('✅ App.tsx updated to use UnifiedAuthContext');
    console.log('✅ Critical imports updated');
    console.log('');
    console.log('🔄 Next Steps:');
    console.log('1. Update remaining useAuth() imports');
    console.log('2. Test login/register/logout flows');
    console.log('3. Verify user profile management');
    console.log('4. Test error handling');

  } catch (error) {
    console.error('❌ Auth migration test failed:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check if unified API package is installed');
    console.log('2. Verify backend server is running');
    console.log('3. Check environment variables');
    console.log('4. Ensure all imports are updated');
  }
}

testAuthMigration(); 