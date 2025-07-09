# Kingdom Studios Development Environment Starter
# Run this script to start both backend and frontend for testing

Write-Host "🚀 Kingdom Studios App - Development Environment" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Yellow

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $Port -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    } catch {
        return $false
    }
}

Write-Host "`n🔍 Checking environment..." -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}

# Check Expo CLI
try {
    $expoVersion = npx expo --version
    Write-Host "✅ Expo CLI: $expoVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Expo CLI not found, will install via npx" -ForegroundColor Yellow
}

# Check if backend is already running
Write-Host "`n🔍 Checking if backend is already running..." -ForegroundColor Cyan
if (Test-Port -Port 3001) {
    Write-Host "✅ Backend server is already running on port 3001" -ForegroundColor Green
    $backendRunning = $true
} else {
    Write-Host "❌ Backend server is not running" -ForegroundColor Yellow
    $backendRunning = $false
}

# Backend paths
$backendPath = "c:\Users\dezme\Kingdom Studios App\kingdom-studios-backend"
$frontendPath = "c:\Users\dezme\Kingdom Studios App\kingdom-studios"

# Start Backend if not running
if (-not $backendRunning) {
    Write-Host "`n🔧 Starting Backend Server..." -ForegroundColor Yellow
    
    if (Test-Path $backendPath) {
        Write-Host "📁 Backend directory found: $backendPath" -ForegroundColor Green
        
        if (Test-Path "$backendPath\src\server.js") {
            Write-Host "📄 Server file found" -ForegroundColor Green
            
            Write-Host "`n🚀 Starting backend in new window..." -ForegroundColor Cyan
            
            # Start backend in new PowerShell window
            $backendScript = @"
Write-Host '🚀 Kingdom Studios Backend Server' -ForegroundColor Green
Set-Location '$backendPath'
Write-Host 'Starting server...' -ForegroundColor Yellow
node src/server.js
Read-Host 'Press Enter to close this window'
"@
            
            Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript
            
            Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
            
            # Check if backend started successfully
            $attempts = 0
            while ($attempts -lt 6 -and -not (Test-Port -Port 3001)) {
                Write-Host "." -NoNewline -ForegroundColor Yellow
                Start-Sleep -Seconds 2
                $attempts++
            }
            
            if (Test-Port -Port 3001) {
                Write-Host "`n✅ Backend server started successfully!" -ForegroundColor Green
            } else {
                Write-Host "`n❌ Backend server failed to start. Please start manually:" -ForegroundColor Red
                Write-Host "   cd '$backendPath'" -ForegroundColor Cyan
                Write-Host "   node src/server.js" -ForegroundColor Cyan
                exit 1
            }
        } else {
            Write-Host "❌ Server file not found: $backendPath\src\server.js" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ Backend directory not found: $backendPath" -ForegroundColor Red
        exit 1
    }
}

# Quick backend health check
Write-Host "`n🏥 Testing backend health..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend health check passed: $($healthResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend health check failed: $_" -ForegroundColor Red
    Write-Host "   Please check if backend is running properly" -ForegroundColor Yellow
}

# Frontend setup
Write-Host "`n📱 Preparing Frontend..." -ForegroundColor Yellow

if (Test-Path $frontendPath) {
    Write-Host "📁 Frontend directory found: $frontendPath" -ForegroundColor Green
    
    Set-Location $frontendPath
    
    Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. ✅ Backend server is running on http://localhost:3001" -ForegroundColor Green
    Write-Host "2. 📱 Start the frontend with: npx expo start" -ForegroundColor Cyan
    Write-Host "3. 📋 Follow the manual testing guide in MANUAL_TESTING_GUIDE.md" -ForegroundColor Cyan
    Write-Host "4. 🧪 Run automated tests with: node phase2-testing.js" -ForegroundColor Cyan
    
    Write-Host "`n🚀 Ready to start frontend? (y/N)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "`n🎉 Starting Expo development server..." -ForegroundColor Green
        npx expo start
    } else {
        Write-Host "`n📋 To start frontend manually, run:" -ForegroundColor Cyan
        Write-Host "   cd '$frontendPath'" -ForegroundColor White
        Write-Host "   npx expo start" -ForegroundColor White
    }
} else {
    Write-Host "❌ Frontend directory not found: $frontendPath" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎯 Development environment ready!" -ForegroundColor Green
Write-Host "Happy coding! 🚀✨" -ForegroundColor Yellow
