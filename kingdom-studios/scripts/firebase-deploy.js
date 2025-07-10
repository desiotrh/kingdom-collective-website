#!/usr/bin/env node

/**
 * 🚀 KINGDOM STUDIOS - FIREBASE DEPLOYMENT SCRIPT
 * Sets up production Firebase environment with all necessary services
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏛️ Kingdom Studios Firebase Setup');
console.log('=====================================\n');

// Check if Firebase CLI is installed
function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'ignore' });
    console.log('✅ Firebase CLI found');
    return true;
  } catch (error) {
    console.log('❌ Firebase CLI not found');
    console.log('Please install Firebase CLI: npm install -g firebase-tools');
    return false;
  }
}

// Check if user is logged in
function checkFirebaseAuth() {
  try {
    const result = execSync('firebase projects:list', { encoding: 'utf8' });
    if (result.includes('kingdom-studios-0kzeje')) {
      console.log('✅ Firebase authenticated and project found');
      return true;
    } else {
      console.log('❌ Kingdom Studios project not found');
      console.log('Please ensure you have access to kingdom-studios-0kzeje project');
      return false;
    }
  } catch (error) {
    console.log('❌ Firebase authentication failed');
    console.log('Please run: firebase login');
    return false;
  }
}

// Deploy Firestore rules
function deployFirestoreRules() {
  try {
    console.log('📋 Deploying Firestore security rules...');
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
    console.log('✅ Firestore rules deployed successfully');
    return true;
  } catch (error) {
    console.log('❌ Failed to deploy Firestore rules');
    console.error(error.message);
    return false;
  }
}

// Deploy Firestore indexes
function deployFirestoreIndexes() {
  try {
    console.log('🔍 Deploying Firestore indexes...');
    execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
    console.log('✅ Firestore indexes deployed successfully');
    return true;
  } catch (error) {
    console.log('❌ Failed to deploy Firestore indexes');
    console.error(error.message);
    return false;
  }
}

// Deploy Storage rules
function deployStorageRules() {
  try {
    console.log('💾 Deploying Storage security rules...');
    execSync('firebase deploy --only storage', { stdio: 'inherit' });
    console.log('✅ Storage rules deployed successfully');
    return true;
  } catch (error) {
    console.log('❌ Failed to deploy Storage rules');
    console.error(error.message);
    return false;
  }
}

// Create initial admin user
function createInitialData() {
  console.log('👤 Initial admin user setup required');
  console.log('After deployment, sign in to the app to create your admin account');
  console.log('The first user will automatically be granted super_admin role');
}

// Main deployment function
function main() {
  console.log('Starting Firebase deployment process...\n');
  
  // Pre-deployment checks
  if (!checkFirebaseCLI()) return;
  if (!checkFirebaseAuth()) return;
  
  console.log('\n📦 Deploying Firebase services...\n');
  
  let success = true;
  
  // Deploy Firestore rules
  if (!deployFirestoreRules()) success = false;
  
  // Deploy Firestore indexes
  if (!deployFirestoreIndexes()) success = false;
  
  // Deploy Storage rules
  if (!deployStorageRules()) success = false;
  
  console.log('\n=====================================');
  
  if (success) {
    console.log('🎉 Firebase deployment completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Test authentication in your app');
    console.log('2. Create your admin account by signing in');
    console.log('3. Verify Firestore collections are created');
    console.log('4. Test file uploads to Storage');
    console.log('5. Monitor Firebase console for any issues');
    
    createInitialData();
  } else {
    console.log('💥 Deployment completed with errors');
    console.log('Please check the error messages above and retry');
  }
}

// Run the deployment
main();
