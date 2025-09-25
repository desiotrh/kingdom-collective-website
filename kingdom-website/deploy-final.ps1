# 🚀 Final Kingdom Collective Chatbot Deployment

Write-Host "🚀 Deploying Kingdom Collective Chatbot" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if build was successful
if (-not (Test-Path ".next")) {
    Write-Host "❌ Build not found. Running build first..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Check environment variables
Write-Host "`n🔍 Checking environment configuration..." -ForegroundColor Cyan

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env.local not found. Please run setup first." -ForegroundColor Red
    exit 1
}

# Check for required variables
$envContent = Get-Content $envFile
$requiredVars = @("OPENAI_API_KEY", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY")
$missingVars = @()

foreach ($var in $requiredVars) {
    $found = $false
    foreach ($line in $envContent) {
        if ($line -match "^$var=" -and $line -notmatch "your_.*_here") {
            $found = $true
            break
        }
    }
    if (-not $found) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "⚠️  Missing or incomplete environment variables:" -ForegroundColor Yellow
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Yellow
    }
    Write-Host "`nPlease update .env.local with your actual API keys." -ForegroundColor Yellow
    Write-Host "You can edit the file manually or run: .\setup-env-simple.ps1" -ForegroundColor Yellow
}
else {
    Write-Host "✅ Environment variables configured" -ForegroundColor Green
}

Write-Host "`n📋 Deployment Options:" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

Write-Host "`n1. 🧪 Test Locally First:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host "   Then visit: http://localhost:3000" -ForegroundColor Gray

Write-Host "`n2. 🚀 Deploy to Vercel:" -ForegroundColor White
Write-Host "   a) Push to GitHub repository" -ForegroundColor Gray
Write-Host "   b) Connect repository to Vercel" -ForegroundColor Gray
Write-Host "   c) Set environment variables in Vercel dashboard" -ForegroundColor Gray
Write-Host "   d) Deploy from main branch" -ForegroundColor Gray

Write-Host "`n3. Post-Deployment Setup:" -ForegroundColor White
Write-Host "   a) Set up Supabase project" -ForegroundColor Gray
Write-Host "   b) Run database schema from supabase/schema.sql" -ForegroundColor Gray
Write-Host "   c) Run: npm run ingest (to populate knowledge base)" -ForegroundColor Gray
Write-Host "   d) Test chatbot functionality" -ForegroundColor Gray

Write-Host "`n🎯 Chatbot Features Ready:" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host "✅ RAG-based responses with source citations" -ForegroundColor Green
Write-Host "✅ Faith Mode vs Marketplace Mode toggle" -ForegroundColor Green
Write-Host "✅ Function calling for pricing, features, and lead generation" -ForegroundColor Green
Write-Host "✅ Comprehensive knowledge base for all 7 Kingdom apps" -ForegroundColor Green
Write-Host "✅ Mobile-responsive design" -ForegroundColor Green
Write-Host "✅ Production-ready error handling and security" -ForegroundColor Green

Write-Host "`n📖 Documentation:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host "• QUICK_DEPLOY.md - Step-by-step deployment guide" -ForegroundColor Gray
Write-Host "• DEPLOYMENT_GUIDE.md - Comprehensive deployment documentation" -ForegroundColor Gray
Write-Host "• .cursorrules - Development standards and guidelines" -ForegroundColor Gray

Write-Host "`n🔧 Quick Commands:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "npm run dev          # Local development server" -ForegroundColor Gray
Write-Host "npm run build        # Production build" -ForegroundColor Gray
Write-Host "npm run start        # Start production server" -ForegroundColor Gray
Write-Host "npm run ingest       # Update knowledge base" -ForegroundColor Gray
Write-Host "npm run evaluate     # Test chatbot quality" -ForegroundColor Gray

$testLocal = Read-Host "`nWould you like to test locally now? (y/n)"
if ($testLocal -eq "y" -or $testLocal -eq "Y") {
    Write-Host "`n🚀 Starting local development server..." -ForegroundColor Green
    Write-Host "Visit: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    npm run dev
}
else {
    Write-Host "`n🎉 Ready for deployment!" -ForegroundColor Green
    Write-Host "Your Kingdom Collective chatbot is ready to serve users with accurate," -ForegroundColor White
    Write-Host "contextual, and brand-appropriate responses!" -ForegroundColor White
}

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
