// Kingdom Studios - Configuration Validation
const fs = require('fs');

console.log('🔍 Kingdom Studios App - Configuration Status');
console.log('============================================\n');

// Read .env.local
if (!fs.existsSync('.env.local')) {
    console.log('❌ .env.local file not found');
    process.exit(1);
}

const envContent = fs.readFileSync('.env.local', 'utf8');
const config = {};

envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...values] = trimmed.split('=');
        config[key] = values.join('=');
    }
});

console.log('🔥 CORE CONFIGURATION STATUS:');
console.log('===============================');

// Check Firebase
const firebaseKeys = {
    'EXPO_PUBLIC_FIREBASE_API_KEY': 'Firebase API Key',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID': 'Firebase Project ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID': 'Firebase App ID'
};

let firebaseReady = true;
Object.entries(firebaseKeys).forEach(([key, name]) => {
    const value = config[key];
    const isConfigured = value && !value.includes('your_') && value.length > 10;
    console.log(`${isConfigured ? '✅' : '❌'} ${name}: ${isConfigured ? 'Ready' : 'Missing'}`);
    if (!isConfigured) firebaseReady = false;
});

// Check OpenAI
const openaiKey = config['EXPO_PUBLIC_OPENAI_API_KEY'];
const openaiReady = openaiKey && openaiKey.startsWith('sk-') && openaiKey.length > 30;
console.log(`${openaiReady ? '✅' : '❌'} OpenAI API Key: ${openaiReady ? 'Ready' : 'Missing'}`);

console.log('\n📊 LAUNCH READINESS:');
console.log('====================');

if (firebaseReady && openaiReady) {
    console.log('🎉 READY TO LAUNCH!');
    console.log('   All core APIs are configured');
    console.log('   You can now run: npm start');
    console.log('\n🚀 Next commands:');
    console.log('   npm install    # Install dependencies');
    console.log('   npm start      # Launch your app');
} else {
    console.log('⚠️  Setup still needed:');
    if (!firebaseReady) console.log('   - Complete Firebase setup');
    if (!openaiReady) console.log('   - Add OpenAI API key');
}

console.log('\n🔧 OPTIONAL INTEGRATIONS:');
console.log('=========================');
console.log('   The OAuth clients you showed are useful for:');
console.log('   • Social media posting (Facebook, Instagram, etc.)');
console.log('   • Advanced authentication options');
console.log('   • Third-party integrations');
console.log('   These can be added later as needed.');

console.log('\n📱 YOUR CURRENT SETUP:');
console.log('======================');
console.log(`   Project: ${config['EXPO_PUBLIC_FIREBASE_PROJECT_ID'] || 'Not set'}`);
console.log(`   Environment: ${config['EXPO_PUBLIC_ENVIRONMENT'] || 'development'}`);
console.log(`   OpenAI: ${openaiReady ? 'Configured' : 'Not configured'}`);
console.log(`   Firebase: ${firebaseReady ? 'Configured' : 'Not configured'}`);

console.log('');
