# Kingdom Studios Apps - Complete Setup Script (PowerShell)
# This script sets up all 6 apps and the backend for launch

Write-Host "🚀 Kingdom Studios Apps - Complete Setup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Error "Please run this script from the Kingdom Studios root directory"
    exit 1
}

Write-Status "Starting complete setup for all Kingdom Studios apps..."

# ==============================================
# STEP 1: INSTALL GLOBAL DEPENDENCIES
# ==============================================

Write-Info "Step 1: Installing global dependencies..."

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is required but not installed"
    Write-Info "Please install Node.js from https://nodejs.org/"
    exit 1
}

# Check Node.js version
$nodeVersion = (node --version).Split('v')[1].Split('.')[0]
if ([int]$nodeVersion -lt 18) {
    Write-Error "Node.js version 18 or higher is required"
    Write-Info "Current version: $(node --version)"
    exit 1
}

Write-Status "Node.js version: $(node --version)"

# Install global tools
Write-Info "Installing global tools..."
npm install -g @expo/cli
npm install -g @expo/eas-cli
npm install -g @railway/cli

Write-Status "Global tools installed"

# ==============================================
# STEP 2: SETUP BACKEND
# ==============================================

Write-Info "Step 2: Setting up backend..."

Set-Location kingdom-studios-backend

# Install dependencies
Write-Info "Installing backend dependencies..."
npm install

# Create environment file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Info "Creating backend environment file..."
    Copy-Item "env-template.txt" ".env"
    Write-Warning "Please edit .env file with your actual values"
} else {
    Write-Status "Backend environment file already exists"
}

Set-Location ..

# ==============================================
# STEP 3: SETUP MAIN APP
# ==============================================

Write-Info "Step 3: Setting up main Kingdom Studios app..."

Set-Location kingdom-studios

# Install dependencies
Write-Info "Installing main app dependencies..."
npm install

# Create environment file if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Info "Creating main app environment file..."
    Copy-Item "env-template.txt" ".env.local"
    Write-Warning "Please edit .env.local file with your actual values"
} else {
    Write-Status "Main app environment file already exists"
}

Set-Location ..

# ==============================================
# STEP 4: SETUP INDIVIDUAL APPS
# ==============================================

Write-Info "Step 4: Setting up individual apps..."

$apps = @("kingdom-clips", "kingdom-voice", "kingdom-circle", "kingdom-lens", "kingdom-launchpad")

foreach ($app in $apps) {
    Write-Info "Setting up $app..."
    
    Set-Location "apps/$app"
    
    # Install dependencies
    npm install
    
    # Create environment file if it doesn't exist
    if (-not (Test-Path ".env.local")) {
        Copy-Item "env-template.txt" ".env.local"
        Write-Warning "Please edit apps/$app/.env.local file with your actual values"
    } else {
        Write-Status "$app environment file already exists"
    }
    
    Set-Location ../..
}

Write-Status "All individual apps configured"

# ==============================================
# STEP 5: CREATE DEPLOYMENT SCRIPTS
# ==============================================

Write-Info "Step 5: Creating deployment scripts..."

# Create main deployment script
$deployScript = @"
# Kingdom Studios Apps - Deployment Script
Write-Host "🚀 Deploying all Kingdom Studios apps..."

# Deploy backend first
Write-Host "📦 Deploying backend..."
Set-Location kingdom-studios-backend
npm run deploy

# Deploy main app
Write-Host "📱 Deploying main app..."
Set-Location ../kingdom-studios
eas build --platform all --profile production

# Deploy individual apps
`$apps = @("kingdom-clips", "kingdom-voice", "kingdom-circle", "kingdom-lens", "kingdom-launchpad")

foreach (`$app in `$apps) {
    Write-Host "📱 Deploying `$app..."
    Set-Location "../apps/`$app"
    eas build --platform all --profile production
}

Write-Host "✅ All apps deployed!"
"@

Set-Content "deploy-all.ps1" $deployScript

# Create quick start script
$quickStartScript = @"
# Kingdom Studios Apps - Quick Start Script
Write-Host "🚀 Quick start for Kingdom Studios apps..."

# Start backend
Write-Host "📦 Starting backend..."
Set-Location kingdom-studios-backend
Start-Process -NoNewWindow npm -ArgumentList "start"

# Wait for backend
Start-Sleep -Seconds 3

# Start main app
Write-Host "📱 Starting main app..."
Set-Location ../kingdom-studios
Start-Process -NoNewWindow npm -ArgumentList "start"

Write-Host "✅ Apps started!"
Write-Host "Backend: http://localhost:3000"
Write-Host "Main App: Expo dev server"
Write-Host ""
Write-Host "Press Ctrl+C to stop all apps"
"@

Set-Content "quick-start.ps1" $quickStartScript

# ==============================================
# STEP 6: CREATE CONFIGURATION GUIDE
# ==============================================

Write-Info "Step 6: Creating configuration guide..."

$configGuide = @"
# 🚀 Kingdom Studios Apps - Configuration Guide

## 📋 Required API Keys

### 🔥 Essential (Must Have)
1. **Firebase Project**
   - Go to: https://console.firebase.google.com/
   - Create project: "kingdom-studios-dev"
   - Enable Authentication, Firestore, Storage
   - Get config from Project Settings > Your apps

2. **OpenAI API Key**
   - Go to: https://platform.openai.com/api-keys
   - Create new secret key
   - Enable billing

3. **Stripe Account**
   - Go to: https://dashboard.stripe.com/
   - Get test keys from Developers > API Keys

## 📁 Environment Files to Configure

### Backend (.env)
- `kingdom-studios-backend/.env`

### Frontend Apps (.env.local)
- `kingdom-studios/.env.local`
- `apps/kingdom-clips/.env.local`
- `apps/kingdom-voice/.env.local`
- `apps/kingdom-circle/.env.local`
- `apps/kingdom-lens/.env.local`
- `apps/kingdom-launchpad/.env.local`

## 🚀 Quick Start Commands

```powershell
# Start backend
Set-Location kingdom-studios-backend
npm start

# Start main app
Set-Location kingdom-studios
npm start

# Start individual apps
Set-Location apps/kingdom-clips
npm start
```

## 📱 Build for Production

```powershell
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Build all apps
.\deploy-all.ps1
```

## 🔧 Troubleshooting

1. **Backend won't start**: Check MongoDB connection in .env
2. **Apps won't load**: Check Firebase config in .env.local
3. **AI features not working**: Check OpenAI API key
4. **Payments not working**: Check Stripe keys

## 📞 Support

For issues, check the logs in each app directory.
"@

Set-Content "CONFIGURATION_GUIDE.md" $configGuide

# ==============================================
# STEP 7: FINAL VALIDATION
# ==============================================

Write-Info "Step 7: Final validation..."

# Check if all required files exist
$requiredFiles = @(
    "kingdom-studios-backend/.env",
    "kingdom-studios/.env.local",
    "apps/kingdom-clips/.env.local",
    "apps/kingdom-voice/.env.local",
    "apps/kingdom-circle/.env.local",
    "apps/kingdom-lens/.env.local",
    "apps/kingdom-launchpad/.env.local"
)

$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Status "All environment files are present"
} else {
    Write-Warning "Missing environment files:"
    foreach ($file in $missingFiles) {
        Write-Host "  - $file"
    }
    Write-Info "Please copy the template files and configure them"
}

# ==============================================
# COMPLETION
# ==============================================

Write-Host ""
Write-Host "🎉 Kingdom Studios Apps Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Status "All 6 apps configured"
Write-Status "Backend configured"
Write-Status "Deployment scripts created"
Write-Status "Configuration guide created"
Write-Host ""
Write-Warning "Next steps:"
Write-Host "1. Configure API keys in environment files"
Write-Host "2. Test backend: Set-Location kingdom-studios-backend; npm start"
Write-Host "3. Test main app: Set-Location kingdom-studios; npm start"
Write-Host "4. Build for production: .\deploy-all.ps1"
Write-Host ""
Write-Info "Configuration guide: CONFIGURATION_GUIDE.md"
Write-Info "Quick start: .\quick-start.ps1"
Write-Info "Deploy all: .\deploy-all.ps1"
Write-Host ""
Write-Status "Setup complete! 🚀" 