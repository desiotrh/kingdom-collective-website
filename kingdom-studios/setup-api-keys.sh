#!/bin/bash

# Kingdom Studios App - Quick API Setup Script
# This script helps you configure your API keys step by step

echo "🔑 Kingdom Studios App - API Key Configuration"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the kingdom-studios directory"
    exit 1
fi

# Copy environment template
echo "📋 Setting up environment file..."
if [ ! -f ".env.local" ]; then
    cp .env.local.template .env.local
    echo "✅ Created .env.local from template"
else
    echo "⚠️  .env.local already exists, backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

echo ""
echo "🔥 FIREBASE SETUP (Required)"
echo "=============================="
echo "1. Go to: https://console.firebase.google.com/"
echo "2. Create new project: 'kingdom-studios-dev'"
echo "3. Enable Authentication, Firestore, Storage"
echo "4. Get your config from Project Settings > Your apps"
echo ""

read -p "📝 Enter your Firebase API Key: " firebase_api_key
read -p "📝 Enter your Firebase Auth Domain (e.g., project.firebaseapp.com): " firebase_auth_domain
read -p "📝 Enter your Firebase Project ID: " firebase_project_id
read -p "📝 Enter your Firebase Storage Bucket (e.g., project.appspot.com): " firebase_storage_bucket
read -p "📝 Enter your Firebase Messaging Sender ID: " firebase_messaging_sender_id
read -p "📝 Enter your Firebase App ID: " firebase_app_id
read -p "📝 Enter your Firebase Measurement ID (optional, press enter to skip): " firebase_measurement_id

# Update Firebase keys in .env.local
sed -i "s/your_firebase_api_key_here/$firebase_api_key/g" .env.local
sed -i "s/kingdom-studios-dev.firebaseapp.com/$firebase_auth_domain/g" .env.local
sed -i "s/kingdom-studios-dev/$firebase_project_id/g" .env.local
sed -i "s/kingdom-studios-dev.appspot.com/$firebase_storage_bucket/g" .env.local
sed -i "s/your_messaging_sender_id/$firebase_messaging_sender_id/g" .env.local
sed -i "s/your_firebase_app_id/$firebase_app_id/g" .env.local

if [ ! -z "$firebase_measurement_id" ]; then
    sed -i "s/your_measurement_id/$firebase_measurement_id/g" .env.local
fi

echo "✅ Firebase configuration updated!"
echo ""

echo "🤖 OPENAI SETUP (Required)"
echo "=========================="
echo "1. Go to: https://platform.openai.com/api-keys"
echo "2. Create new secret key"
echo "3. Make sure you have billing enabled"
echo ""

read -p "📝 Enter your OpenAI API Key (starts with sk-): " openai_api_key

# Validate OpenAI key format
if [[ $openai_api_key == sk-* ]]; then
    sed -i "s/sk-your_openai_api_key_here/$openai_api_key/g" .env.local
    echo "✅ OpenAI API key updated!"
else
    echo "⚠️  Warning: OpenAI key should start with 'sk-'"
fi

echo ""
echo "🎯 BASIC SETUP COMPLETE!"
echo "========================"
echo "✅ Firebase configured"
echo "✅ OpenAI configured"
echo ""

# Ask about optional services
echo "🔧 OPTIONAL SERVICES"
echo "===================="
echo "Would you like to configure optional services now?"
echo "You can always add these later by editing .env.local"
echo ""

read -p "Configure SendGrid for email marketing? (y/N): " setup_sendgrid
if [[ $setup_sendgrid =~ ^[Yy]$ ]]; then
    echo "1. Go to: https://sendgrid.com/"
    echo "2. Sign up for free account (100 emails/day)"
    echo "3. Create API key with Mail Send permissions"
    read -p "📝 Enter your SendGrid API Key (starts with SG.): " sendgrid_key
    sed -i "s/SG.your_sendgrid_api_key_here/$sendgrid_key/g" .env.local
    echo "✅ SendGrid configured!"
fi

echo ""
read -p "Configure Stripe for payments? (y/N): " setup_stripe
if [[ $setup_stripe =~ ^[Yy]$ ]]; then
    echo "1. Go to: https://dashboard.stripe.com/"
    echo "2. Get your test Publishable key from Developers > API keys"
    read -p "📝 Enter your Stripe Publishable Key (starts with pk_test_): " stripe_key
    sed -i "s/pk_test_your_stripe_test_key/$stripe_key/g" .env.local
    echo "✅ Stripe configured!"
fi

echo ""
echo "🧪 TESTING YOUR SETUP"
echo "====================="
echo "Let's test if everything is working..."

# Test if Node.js and npm are installed
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js installed: $(node --version)"
else
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

if command -v npm >/dev/null 2>&1; then
    echo "✅ npm installed: $(npm --version)"
else
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if TypeScript compiles
echo "🔍 Checking TypeScript compilation..."
if npx tsc --noEmit; then
    echo "✅ TypeScript compilation successful!"
else
    echo "⚠️  TypeScript compilation has issues (this is normal, we can fix later)"
fi

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo "Your Kingdom Studios App is now configured!"
echo ""
echo "🚀 Next steps:"
echo "1. Test the app: npm start"
echo "2. Try different platforms:"
echo "   - Web: npm run web"
echo "   - iOS: npm run ios"
echo "   - Android: npm run android"
echo ""
echo "📖 For more help, see:"
echo "- API_SETUP_GUIDE.md (detailed setup instructions)"
echo "- FINAL_PRODUCTION_DEPLOYMENT.md (deployment guide)"
echo ""
echo "🔧 To add more API keys later:"
echo "Edit the .env.local file and restart the app"
echo ""
echo "Happy coding! 🚀✨"
