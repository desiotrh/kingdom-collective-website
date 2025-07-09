#!/bin/bash
# Kingdom Studios App - Production Build Script

echo "🚀 Building Kingdom Studios App for Production..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run final validation
echo "✅ Running final validation..."
node final-validation.js

# Check validation results
if [ $? -eq 0 ]; then
    echo "✅ Validation passed - proceeding with build"
else
    echo "❌ Validation failed - build aborted"
    exit 1
fi

# Build for production
echo "🏗️ Building for production..."
eas build --platform all --profile production --non-interactive

echo "🎉 Production build complete!"
echo "📱 Check EAS dashboard for build status"
