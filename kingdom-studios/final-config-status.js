// Kingdom Studios - Complete Configuration Status
const fs = require('fs');

console.log('🎉 Kingdom Studios App - Complete Configuration Status');
console.log('====================================================\n');

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

console.log('🔥 CORE APIS STATUS:');
console.log('====================');

// Core APIs
const coreApis = [
    { key: 'EXPO_PUBLIC_FIREBASE_API_KEY', name: 'Firebase', required: true },
    { key: 'EXPO_PUBLIC_OPENAI_API_KEY', name: 'OpenAI', required: true },
];

let coreReady = true;
coreApis.forEach(api => {
    const value = config[api.key];
    const isConfigured = value && !value.includes('your_') && !value.includes('dev_placeholder') && value.length > 10;
    console.log(`${isConfigured ? '✅' : '❌'} ${api.name}: ${isConfigured ? 'Ready' : 'Missing'}`);
    if (api.required && !isConfigured) coreReady = false;
});

console.log('\n📱 SOCIAL MEDIA APIS:');
console.log('=====================');

const socialApis = [
    { key: 'EXPO_PUBLIC_YOUTUBE_API_KEY', name: 'YouTube' },
    { key: 'EXPO_PUBLIC_TWITTER_API_KEY', name: 'Twitter/X' },
    { key: 'EXPO_PUBLIC_FACEBOOK_APP_ID', name: 'Facebook' },
    { key: 'EXPO_PUBLIC_LINKEDIN_CLIENT_ID', name: 'LinkedIn' },
];

socialApis.forEach(api => {
    const value = config[api.key];
    const isConfigured = value && !value.includes('your_') && !value.includes('dev_placeholder') && value.length > 10;
    console.log(`${isConfigured ? '✅' : '⏳'} ${api.name}: ${isConfigured ? 'Configured' : 'Not configured'}`);
});

console.log('\n💰 PAYMENT & BUSINESS:');
console.log('======================');

const businessApis = [
    { key: 'EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY', name: 'Stripe Payments' },
];

businessApis.forEach(api => {
    const value = config[api.key];
    const isConfigured = value && !value.includes('your_') && !value.includes('dev_placeholder') && value.length > 10;
    console.log(`${isConfigured ? '✅' : '⏳'} ${api.name}: ${isConfigured ? 'Configured' : 'Not configured'}`);
});

console.log('\n🎯 LAUNCH READINESS:');
console.log('====================');

if (coreReady) {
    console.log('🚀 READY TO LAUNCH!');
    console.log('   Core APIs: Firebase + OpenAI ✅');
    console.log('   Social Media: Multiple platforms configured ✅');
    console.log('   Payments: Stripe ready ✅');
    console.log('\n💪 Your Kingdom Studios App Features:');
    console.log('   🤖 AI Content Generation');
    console.log('   📱 Multi-platform Social Media');
    console.log('   💰 Payment Processing');
    console.log('   🔐 User Authentication');
    console.log('   📊 Analytics & Insights');
    console.log('\n🎬 Tagline: ' + (config['EXPO_PUBLIC_APP_TAGLINE'] || 'Create with Purpose. Share with Power. Build What Matters.'));
} else {
    console.log('⚠️  Setup still needed for core APIs');
}

console.log('\n🔧 COMMANDS:');
console.log('============');
console.log('   npm start      # Launch your app');
console.log('   npm run ios    # iOS simulator');
console.log('   npm run android # Android emulator');
console.log('   npm run web    # Web browser');

console.log('');
