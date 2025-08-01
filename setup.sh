#!/bin/bash

# Kingdom Collective Website - Setup Script
# This script sets up the Kingdom Collective website for development and deployment

echo "🏰 Kingdom Collective Website Setup"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment file..."
    cp env-template.txt .env.local
    echo "✅ Environment file created (.env.local)"
    echo "⚠️  Please edit .env.local with your actual API keys"
else
    echo "✅ Environment file already exists"
fi

# Create public directory if it doesn't exist
if [ ! -d public ]; then
    echo "📁 Creating public directory..."
    mkdir -p public
fi

# Create placeholder favicon
if [ ! -f public/favicon.ico ]; then
    echo "🎨 Creating placeholder favicon..."
    # This is a placeholder - you should replace with actual favicon
    echo "<!-- Placeholder favicon -->" > public/favicon.ico
fi

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Create deployment script
echo "📝 Creating deployment script..."
cat > deploy.sh << 'EOF'
#!/bin/bash

# Kingdom Collective Website - Deployment Script

echo "🚀 Deploying Kingdom Collective Website..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌍 Your website should be live at: https://kingdomcollective.pro"
EOF

chmod +x deploy.sh

# Create development script
echo "📝 Creating development script..."
cat > dev.sh << 'EOF'
#!/bin/bash

# Kingdom Collective Website - Development Script

echo "🔧 Starting development server..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found. Creating from template..."
    cp env-template.txt .env.local
    echo "⚠️  Please edit .env.local with your actual API keys"
fi

# Start development server
npm run dev
EOF

chmod +x dev.sh

# Create README for quick start
echo "📝 Creating quick start guide..."
cat > QUICK_START.md << 'EOF'
# 🚀 Quick Start Guide

## Development
```bash
./dev.sh
```

## Deployment
```bash
./deploy.sh
```

## Manual Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Environment Setup
1. Copy `env-template.txt` to `.env.local`
2. Fill in your actual API keys
3. Test locally with `npm run dev`

## Domain Setup
1. Add `kingdomcollective.pro` to Vercel
2. Configure DNS in GoDaddy
3. Add subdomains for each app

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
EOF

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Run './dev.sh' to start development"
echo "3. Run './deploy.sh' to deploy to Vercel"
echo "4. Configure domain in Vercel dashboard"
echo "5. Set up DNS in GoDaddy"
echo ""
echo "📚 Documentation:"
echo "- README.md - Full documentation"
echo "- DEPLOYMENT_GUIDE.md - Deployment instructions"
echo "- QUICK_START.md - Quick reference"
echo ""
echo "🏰 Kingdom Collective Website is ready!"
echo ""
echo '"Unless the Lord builds the house, the builders labor in vain." - Psalm 127:1' 