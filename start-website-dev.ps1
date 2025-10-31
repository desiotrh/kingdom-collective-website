# Kingdom Website - Quick Start Development Server
# This script ensures dependencies are installed and starts the dev server

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Kingdom Website - Dev Server Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$websitePath = "D:\Kingdom Studios App\kingdom-website"

# Navigate to website directory
Set-Location $websitePath

# Check if next is installed
if (Test-Path "node_modules\next\dist\bin\next") {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}
else {
    Write-Host "📦 Installing dependencies (this may take 1-2 minutes)..." -ForegroundColor Yellow
    Write-Host ""
    
    # Clean install
    if (Test-Path "node_modules") {
        Write-Host "   Cleaning old node_modules..." -ForegroundColor Gray
        Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    }
    if (Test-Path ".next") {
        Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
    }
    
    Write-Host "   Running npm install..." -ForegroundColor Gray
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Write-Host "   Please check the error messages above" -ForegroundColor Yellow
        pause
        exit 1
    }
}

Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
Write-Host ""
Write-Host "   Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start the dev server
npm run dev


