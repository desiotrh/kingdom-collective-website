#!/usr/bin/env node

/**
 * API Connection Testing Script
 * Tests all API connections before deployment
 */

const axios = require('axios');
const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const OpenAI = require('openai');
const Stripe = require('stripe');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

console.log('\n🚀 API Connection Testing Script');
console.log('================================\n');

// Load environment variables
require('dotenv').config();

// Test results
const results = {
  firebase: false,
  openai: false,
  stripe: false,
  backend: false,
  social: false
};

/**
 * Test Firebase Connection
 */
async function testFirebase() {
  log.info('Testing Firebase connection...');
  
  try {
    const firebaseConfig = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
    };

    if (!firebaseConfig.apiKey) {
      throw new Error('Firebase API key not found in environment variables');
    }

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Test authentication
    await signInAnonymously(auth);
    log.success('Firebase authentication working');

    // Test Firestore
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    log.success('Firebase Firestore working');

    results.firebase = true;
    log.success('Firebase connection successful!');
  } catch (error) {
    log.error(`Firebase test failed: ${error.message}`);
    results.firebase = false;
  }
}

/**
 * Test OpenAI Connection
 */
async function testOpenAI() {
  log.info('Testing OpenAI connection...');
  
  try {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not found in environment variables');
    }

    const openai = new OpenAI({
      apiKey: apiKey
    });

    // Test simple completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'Hello from Kingdom Studios!'"
        }
      ],
      max_tokens: 50
    });

    if (completion.choices[0].message.content) {
      log.success('OpenAI API working');
      results.openai = true;
    }
  } catch (error) {
    log.error(`OpenAI test failed: ${error.message}`);
    results.openai = false;
  }
}

/**
 * Test Stripe Connection
 */
async function testStripe() {
  log.info('Testing Stripe connection...');
  
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error('Stripe secret key not found in environment variables');
    }

    const stripe = new Stripe(secretKey);

    // Test API connection
    const account = await stripe.accounts.retrieve();
    log.success('Stripe API working');
    results.stripe = true;
  } catch (error) {
    log.error(`Stripe test failed: ${error.message}`);
    results.stripe = false;
  }
}

/**
 * Test Backend Server
 */
async function testBackend() {
  log.info('Testing backend server...');
  
  try {
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    
    // Test health endpoint
    const healthResponse = await axios.get(`${baseUrl}/health`, {
      timeout: 5000
    });

    if (healthResponse.status === 200) {
      log.success('Backend server responding');
      results.backend = true;
    }
  } catch (error) {
    log.warning(`Backend server not responding: ${error.message}`);
    log.info('Make sure backend server is running on port 3000');
    results.backend = false;
  }
}

/**
 * Test Social Media APIs
 */
async function testSocialAPIs() {
  log.info('Testing social media APIs...');
  
  const socialAPIs = {
    instagram: process.env.EXPO_PUBLIC_INSTAGRAM_APP_ID,
    twitter: process.env.EXPO_PUBLIC_TWITTER_API_KEY,
    facebook: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID
  };

  let workingAPIs = 0;
  const totalAPIs = Object.keys(socialAPIs).length;

  for (const [platform, apiKey] of Object.entries(socialAPIs)) {
    if (apiKey) {
      log.success(`${platform} API key configured`);
      workingAPIs++;
    } else {
      log.warning(`${platform} API key not configured (optional)`);
    }
  }

  if (workingAPIs > 0) {
    results.social = true;
    log.success(`${workingAPIs}/${totalAPIs} social APIs configured`);
  } else {
    log.warning('No social media APIs configured (optional)');
  }
}

/**
 * Test Environment Variables
 */
function testEnvironmentVariables() {
  log.info('Checking environment variables...');
  
  const requiredVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_OPENAI_API_KEY',
    'STRIPE_SECRET_KEY'
  ];

  const optionalVars = [
    'EXPO_PUBLIC_INSTAGRAM_APP_ID',
    'EXPO_PUBLIC_TWITTER_API_KEY',
    'EXPO_PUBLIC_FACEBOOK_APP_ID',
    'EXPO_PUBLIC_GA4_MEASUREMENT_ID'
  ];

  let missingRequired = 0;
  let missingOptional = 0;

  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      log.error(`Missing required: ${varName}`);
      missingRequired++;
    } else {
      log.success(`Found: ${varName}`);
    }
  });

  optionalVars.forEach(varName => {
    if (!process.env[varName]) {
      log.warning(`Missing optional: ${varName}`);
      missingOptional++;
    } else {
      log.success(`Found: ${varName}`);
    }
  });

  if (missingRequired > 0) {
    log.error(`${missingRequired} required environment variables missing`);
  } else {
    log.success('All required environment variables found');
  }
}

/**
 * Generate Test Report
 */
function generateReport() {
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${test.toUpperCase()}: ${status}`);
  });
  
  if (passedTests === totalTests) {
    log.success('\n🎉 All API connections working! Ready for deployment.');
  } else {
    log.error('\n⚠️  Some API connections failed. Please fix before deployment.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Fix any failed API connections');
  console.log('2. Test each app individually');
  console.log('3. Run integration tests');
  console.log('4. Deploy to Firebase/Vercel');
}

/**
 * Main Test Function
 */
async function runTests() {
  try {
    // Test environment variables first
    testEnvironmentVariables();
    
    // Test API connections
    await testFirebase();
    await testOpenAI();
    await testStripe();
    await testBackend();
    await testSocialAPIs();
    
    // Generate report
    generateReport();
    
  } catch (error) {
    log.error(`Test script failed: ${error.message}`);
    process.exit(1);
  }
}

// Run tests if script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, results }; 