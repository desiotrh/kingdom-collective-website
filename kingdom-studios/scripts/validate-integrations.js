#!/usr/bin/env node

/**
 * Integration Validation Script
 * Tests all major app integrations and reports status
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Kingdom Studios App - Integration Validation\n');

// Check environment configuration
function checkEnvironment() {
  console.log('📋 Checking Environment Configuration...');
  
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const requiredKeys = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_OPENAI_API_KEY'
  ];
  
  let allPresent = true;
  requiredKeys.forEach(key => {
    if (envContent.includes(`${key}=`) && !envContent.includes(`${key}=your_`)) {
      console.log(`✅ ${key} configured`);
    } else {
      console.log(`❌ ${key} needs configuration`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// Check TypeScript configuration
function checkTypeScript() {
  console.log('\n📋 Checking TypeScript Configuration...');
  
  const tsconfigPath = path.join(__dirname, '../tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    console.log('❌ tsconfig.json not found');
    return false;
  }
  
  console.log('✅ TypeScript configuration present');
  return true;
}

// Check Firebase configuration
function checkFirebaseConfig() {
  console.log('\n📋 Checking Firebase Configuration...');
  
  const firebaseConfigPath = path.join(__dirname, '../firebase.json');
  const firestoreRulesPath = path.join(__dirname, '../firestore.rules');
  
  if (!fs.existsSync(firebaseConfigPath)) {
    console.log('❌ firebase.json not found');
    return false;
  }
  
  if (!fs.existsSync(firestoreRulesPath)) {
    console.log('❌ firestore.rules not found');
    return false;
  }
  
  console.log('✅ Firebase configuration files present');
  return true;
}

// Check key services
function checkKeyServices() {
  console.log('\n📋 Checking Key Services...');
  
  const keyServices = [
    '../src/services/aiService.ts',
    '../src/services/notificationService.ts',
    '../src/services/paymentService.ts',
    '../src/services/databaseService.ts'
  ];
  
  let allPresent = true;
  keyServices.forEach(servicePath => {
    const fullPath = path.join(__dirname, servicePath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${path.basename(servicePath)} present`);
    } else {
      console.log(`❌ ${path.basename(servicePath)} missing`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// Check key screens
function checkKeyScreens() {
  console.log('\n📋 Checking Key Screens...');
  
  const keyScreens = [
    '../src/screens/AIGenerationTestScreen.tsx',
    '../src/screens/SubscriptionUpgradeScreen.tsx',
    '../src/screens/NotificationSettingsScreen.tsx',
    '../src/screens/TierSystemScreen.tsx'
  ];
  
  let allPresent = true;
  keyScreens.forEach(screenPath => {
    const fullPath = path.join(__dirname, screenPath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${path.basename(screenPath)} present`);
    } else {
      console.log(`❌ ${path.basename(screenPath)} missing`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// Main validation
async function main() {
  const results = {
    environment: checkEnvironment(),
    typescript: checkTypeScript(),
    firebase: checkFirebaseConfig(),
    services: checkKeyServices(),
    screens: checkKeyScreens()
  };
  
  console.log('\n📊 VALIDATION SUMMARY');
  console.log('=' .repeat(50));
  
  Object.entries(results).forEach(([category, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${category.toUpperCase()}: ${passed ? 'PASS' : 'FAIL'}`);
  });
  
  const overallPass = Object.values(results).every(result => result);
  
  console.log('\n🎯 OVERALL STATUS:', overallPass ? '✅ READY' : '❌ NEEDS ATTENTION');
  
  if (!overallPass) {
    console.log('\n🔧 NEXT ACTIONS NEEDED:');
    if (!results.environment) {
      console.log('- Configure OpenAI API key in .env');
    }
    if (!results.services) {
      console.log('- Check missing service files');
    }
    if (!results.screens) {
      console.log('- Check missing screen files');
    }
  } else {
    console.log('\n🚀 READY FOR TESTING AND DEPLOYMENT!');
  }
}

main().catch(console.error);
