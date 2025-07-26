# Kingdom Collective Website Deployment Script
# Run this script in the kingdom-website directory

Write-Host "🚀 Kingdom Collective Website Deployment" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Git is installed
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
}
catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the kingdom-website directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🔨 Building the website..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
}
else {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    exit 1
}

# Initialize Git repository
Write-Host "📝 Initializing Git repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "📁 Adding files to Git..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Initial Kingdom Collective website build"

# Set main branch
Write-Host "🌿 Setting main branch..." -ForegroundColor Yellow
git branch -M main

Write-Host ""
Write-Host "🎉 Git setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a GitHub repository at github.com" -ForegroundColor White
Write-Host "2. Run these commands (replace YOUR_USERNAME):" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/kingdom-collective-website.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host "3. Deploy to Vercel at vercel.com" -ForegroundColor White
Write-Host ""
Write-Host "📖 See DEPLOY_TO_VERCEL.md for detailed instructions" -ForegroundColor Cyan
Write-Host "" 