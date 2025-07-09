# Kingdom Studios Backend Startup Script
Write-Host "🚀 Starting Kingdom Studios Backend Server..." -ForegroundColor Green
Write-Host "=====================================`n" -ForegroundColor Yellow

# Navigate to backend directory
$backendPath = "c:\Users\dezme\Kingdom Studios App\kingdom-studios-backend"
Set-Location $backendPath
Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Cyan

# Check Node.js availability
Write-Host "`n🔍 Checking Node.js availability..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "✅ package.json found" -ForegroundColor Green
} else {
    Write-Host "❌ package.json not found in current directory" -ForegroundColor Red
    exit 1
}

# Check if server.js exists
if (Test-Path "src/server.js") {
    Write-Host "✅ Server file found: src/server.js" -ForegroundColor Green
} else {
    Write-Host "❌ Server file not found: src/server.js" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔧 Starting server with: node src/server.js" -ForegroundColor Yellow
Write-Host "=====================================`n" -ForegroundColor Yellow

# Start the server
try {
    node src/server.js
} catch {
    Write-Host "`n❌ Failed to start server: $_" -ForegroundColor Red
    exit 1
}
