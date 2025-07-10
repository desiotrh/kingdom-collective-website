// Simple configuration validator for Kingdom Studios App
const fs = require('fs');
const path = require('path');

console.log('🔍 Kingdom Studios App - Quick Config Check');
console.log('==========================================\n');

// Read .env.local file
const envPath = '.env.local';
if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found!');
    console.log('   Please copy .env.local.template to .env.local first.');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

// Parse environment variables
const config = {};
envLines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...values] = trimmed.split('=');
        config[key] = values.join('=');
    }
});

console.log('📋 Configuration Status:');
console.log('========================\n');

// Check Firebase (Required)
const firebaseKeys = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID'
];

let firebaseConfigured = true;
firebaseKeys.forEach(key => {
    const value = config[key];
    const isConfigured = value && !value.includes('your_') && !value.includes('_here');
    if (!isConfigured) firebaseConfigured = false;
    
    console.log(`${isConfigured ? '✅' : '❌'} ${key.replace('EXPO_PUBLIC_', '')}: ${isConfigured ? 'Configured' : 'Not configured'}`);
});

console.log('');

// Check OpenAI (Required)
const openaiKey = config['EXPO_PUBLIC_OPENAI_API_KEY'];
const openaiConfigured = openaiKey && openaiKey.startsWith('sk-') && !openaiKey.includes('your_');

console.log(`${openaiConfigured ? '✅' : '❌'} OPENAI_API_KEY: ${openaiConfigured ? 'Configured' : 'Not configured'}`);

console.log('\n📊 Summary:');
console.log('===========');

if (firebaseConfigured && openaiConfigured) {
    console.log('🎉 All required APIs are configured!');
    console.log('   You can now run: npm start');
} else {
    console.log('⚠️  Required APIs still need configuration:');
    if (!firebaseConfigured) {
        console.log('   - Firebase: Setup required for authentication & database');
    }
    if (!openaiConfigured) {
        console.log('   - OpenAI: Setup required for AI content generation');
    }
    console.log('\n📝 Next steps:');
    console.log('   1. Edit .env.local with your actual API keys');
    console.log('   2. Run this script again to verify');
    console.log('   3. Start your app with: npm start');
}

console.log('\n🔗 Quick links:');
console.log('   Firebase Console: https://console.firebase.google.com/');
console.log('   OpenAI API Keys: https://platform.openai.com/api-keys');
console.log('');
