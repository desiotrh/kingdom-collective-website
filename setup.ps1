# Kingdom Collective Website - Setup Script (PowerShell)
# This script sets up the Kingdom Collective website for development and deployment

Write-Host "🏰 Kingdom Collective Website Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$nodeMajorVersion = (node --version).Split('.')[0].Substring(1)
if ([int]$nodeMajorVersion -lt 18) {
    Write-Host "❌ Node.js version 18+ is required. Current version: $(node --version)" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

# Create environment file
if (-not (Test-Path ".env.local")) {
    Write-Host "🔧 Creating environment file..." -ForegroundColor Yellow
    Copy-Item "env-template.txt" ".env.local"
    Write-Host "✅ Environment file created (.env.local)" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env.local with your actual API keys" -ForegroundColor Yellow
}
else {
    Write-Host "✅ Environment file already exists" -ForegroundColor Green
}

# Create public directory if it doesn't exist
if (-not (Test-Path "public")) {
    Write-Host "📁 Creating public directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "public" -Force | Out-Null
}

# Create placeholder favicon
if (-not (Test-Path "public/favicon.ico")) {
    Write-Host "🎨 Creating placeholder favicon..." -ForegroundColor Yellow
    "<!-- Placeholder favicon -->" | Out-File -FilePath "public/favicon.ico" -Encoding ASCII
}

# Test build
Write-Host "🔨 Testing build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
}
else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Create deployment script
Write-Host "📝 Creating deployment script..." -ForegroundColor Yellow
@"
# Kingdom Collective Website - Deployment Script

Write-Host "🚀 Deploying Kingdom Collective Website..." -ForegroundColor Cyan

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Deploy to Vercel
Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌍 Your website should be live at: https://kingdomcollective.pro" -ForegroundColor Cyan
"@ | Out-File -FilePath "deploy.ps1" -Encoding UTF8

# Create development script
Write-Host "📝 Creating development script..." -ForegroundColor Yellow
@"
# Kingdom Collective Website - Development Script

Write-Host "🔧 Starting development server..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Warning: .env.local not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item "env-template.txt" ".env.local"
    Write-Host "⚠️  Please edit .env.local with your actual API keys" -ForegroundColor Yellow
}

# Start development server
npm run dev
"@ | Out-File -FilePath "dev.ps1" -Encoding UTF8

# Create README for quick start
Write-Host "📝 Creating quick start guide..." -ForegroundColor Yellow
@"
# 🚀 Quick Start Guide

## Development
```powershell
.\dev.ps1
```

## Deployment
```powershell
.\deploy.ps1
```

## Manual Commands
```powershell
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
"@ | Out-File -FilePath "QUICK_START.md" -Encoding UTF8

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your API keys" -ForegroundColor White
Write-Host "2. Run '.\dev.ps1' to start development" -ForegroundColor White
Write-Host "3. Run '.\deploy.ps1' to deploy to Vercel" -ForegroundColor White
Write-Host "4. Configure domain in Vercel dashboard" -ForegroundColor White
Write-Host "5. Set up DNS in GoDaddy" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "- README.md - Full documentation" -ForegroundColor White
Write-Host "- DEPLOYMENT_GUIDE.md - Deployment instructions" -ForegroundColor White
Write-Host "- QUICK_START.md - Quick reference" -ForegroundColor White
Write-Host ""
Write-Host "🏰 Kingdom Collective Website is ready!" -ForegroundColor Green
Write-Host ""
Write-Host '"Unless the Lord builds the house, the builders labor in vain." - Psalm 127:1' -ForegroundColor Yellow 