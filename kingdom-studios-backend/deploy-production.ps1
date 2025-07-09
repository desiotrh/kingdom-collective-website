# ==============================================
# KINGDOM STUDIOS BACKEND - PRODUCTION DEPLOYMENT (PowerShell)
# Automated deployment to multiple cloud platforms
# ==============================================

param(
    [string]$Version = "latest",
    [string]$Environment = "production",
    [string]$Platform = "auto"
)

# Configuration
$ProjectName = "kingdom-studios-backend"

Write-Host "🚀 Kingdom Studios Backend - Production Deployment" -ForegroundColor Blue
Write-Host "=================================================" -ForegroundColor Blue
Write-Host "Version: $Version"
Write-Host "Environment: $Environment"
Write-Host "Platform: $Platform"
Write-Host ""

# ==============================================
# HELPER FUNCTIONS
# ==============================================

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Success {
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

function Test-Requirements {
    Write-Info "Checking deployment requirements..."
    
    # Check Docker
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is required but not installed"
        exit 1
    }
    
    # Check required files
    if (-not (Test-Path "Dockerfile.production")) {
        Write-Error "Dockerfile.production not found"
        exit 1
    }
    
    if (-not (Test-Path ".env.production")) {
        Write-Error ".env.production not found"
        exit 1
    }
    
    Write-Success "All requirements satisfied"
}

function Build-DockerImage {
    Write-Info "Building Docker image..."
    
    $GitCommit = try { 
        git rev-parse HEAD 2>$null 
    }
    catch { 
        "unknown" 
    }
    
    $BuildDate = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    
    # Build production image
    docker build `
        -f Dockerfile.production `
        -t "${ProjectName}:${Version}" `
        -t "${ProjectName}:latest" `
        --build-arg NODE_ENV=production `
        --build-arg BUILD_VERSION=$Version `
        --build-arg GIT_COMMIT=$GitCommit `
        --build-arg BUILD_DATE=$BuildDate `
        .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Docker image built successfully"
    }
    else {
        Write-Error "Docker build failed"
        exit 1
    }
}

# ==============================================
# RENDER.COM DEPLOYMENT
# ==============================================

function Deploy-ToRender {
    Write-Info "Preparing Render.com deployment..."
    
    # Create render.yaml if it doesn't exist
    if (-not (Test-Path "render.yaml")) {
        Write-Info "Creating render.yaml configuration..."
        
        @"
services:
  - type: web
    name: kingdom-studios-backend
    env: node
    plan: pro
    region: oregon
    buildCommand: npm ci
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
    healthCheckPath: /health
    numInstances: 3
    scaling:
      minInstances: 3
      maxInstances: 50
      targetMemoryPercent: 80
      targetCPUPercent: 70
"@ | Out-File -FilePath "render.yaml" -Encoding UTF8
    }
    
    Write-Success "Render.com configuration ready"
    Write-Info "Please deploy manually through Render dashboard or configure GitHub integration"
    Write-Info "Render Dashboard: https://dashboard.render.com"
}

# ==============================================
# RAILWAY DEPLOYMENT
# ==============================================

function Deploy-ToRailway {
    Write-Info "Preparing Railway deployment..."
    
    if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
        Write-Warning "Railway CLI not found. Installing..."
        npm install -g @railway/cli
    }
    
    if (Get-Command railway -ErrorAction SilentlyContinue) {
        Write-Info "Railway CLI found, initiating deployment..."
        railway login
        railway link
        railway up --detach
        Write-Success "Railway deployment initiated"
    }
    else {
        Write-Warning "Railway CLI installation failed. Please install manually:"
        Write-Info "npm install -g @railway/cli"
    }
}

# ==============================================
# VERCEL DEPLOYMENT
# ==============================================

function Deploy-ToVercel {
    Write-Info "Preparing Vercel deployment (Serverless)..."
    
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    }
    
    # Create vercel.json if it doesn't exist
    if (-not (Test-Path "vercel.json")) {
        Write-Info "Creating vercel.json configuration..."
        
        @"
{
  "version": 2,
  "name": "kingdom-studios-backend",
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/server.js": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1", "sfo1"]
}
"@ | Out-File -FilePath "vercel.json" -Encoding UTF8
    }
    
    if (Get-Command vercel -ErrorAction SilentlyContinue) {
        # Deploy
        vercel --prod --confirm
        Write-Success "Vercel deployment completed"
    }
    else {
        Write-Warning "Vercel CLI installation failed. Please install manually:"
        Write-Info "npm install -g vercel"
    }
}

# ==============================================
# DOCKER HUB DEPLOYMENT
# ==============================================

function Deploy-ToDockerHub {
    Write-Info "Deploying to Docker Hub..."
    
    # Tag for Docker Hub
    docker tag "${ProjectName}:${Version}" "kingdomstudios/${ProjectName}:${Version}"
    docker tag "${ProjectName}:${Version}" "kingdomstudios/${ProjectName}:latest"
    
    Write-Info "Docker images tagged for Docker Hub"
    Write-Info "To push to Docker Hub, run:"
    Write-Info "docker login"
    Write-Info "docker push kingdomstudios/${ProjectName}:${Version}"
    Write-Info "docker push kingdomstudios/${ProjectName}:latest"
}

# ==============================================
# LOCAL DEPLOYMENT TEST
# ==============================================

function Test-LocalDeployment {
    Write-Info "Testing local deployment..."
    
    # Stop any existing container
    docker stop kingdom-studios-test 2>$null
    docker rm kingdom-studios-test 2>$null
    
    # Run the production container locally
    docker run -d `
        --name kingdom-studios-test `
        -p 3001:3000 `
        --env-file .env.production `
        "${ProjectName}:${Version}"
    
    # Wait for container to start
    Start-Sleep -Seconds 10
    
    # Test health endpoint
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get -TimeoutSec 10
        Write-Success "Local deployment test passed"
        Write-Info "Health check response: $($response.status)"
        Write-Info "Test container running on http://localhost:3001"
    }
    catch {
        Write-Error "Local deployment test failed: $_"
    }
}

# ==============================================
# PERFORMANCE VALIDATION
# ==============================================

function Test-Performance {
    Write-Info "Running performance validation..."
    
    if (Test-Path "quick-performance-test.js") {
        $env:TEST_BASE_URL = "http://localhost:3001"
        node quick-performance-test.js
        Write-Success "Performance validation completed"
    }
    else {
        Write-Warning "Performance test file not found, skipping validation"
    }
}

# ==============================================
# MAIN DEPLOYMENT LOGIC
# ==============================================

function Start-Deployment {
    Test-Requirements
    Build-DockerImage
    
    switch ($Platform) {
        "render" {
            Deploy-ToRender
        }
        "railway" {
            Deploy-ToRailway
        }
        "vercel" {
            Deploy-ToVercel
        }
        "docker" {
            Deploy-ToDockerHub
        }
        "local" {
            Test-LocalDeployment
            Test-Performance
        }
        "all" {
            Write-Info "Preparing all deployment configurations..."
            Deploy-ToRender
            Deploy-ToRailway
            Deploy-ToVercel
            Deploy-ToDockerHub
            Test-LocalDeployment
        }
        "auto" {
            Write-Info "Auto-detecting deployment platform..."
            if (Get-Command railway -ErrorAction SilentlyContinue) {
                Deploy-ToRailway
            }
            elseif (Get-Command vercel -ErrorAction SilentlyContinue) {
                Deploy-ToVercel
            }
            else {
                Write-Info "No deployment CLI detected, using Render"
                Deploy-ToRender
            }
        }
        default {
            Write-Error "Unsupported platform: $Platform"
            Write-Info "Supported platforms: render, railway, vercel, docker, local, all, auto"
            exit 1
        }
    }
    
    Write-Success "🎉 Production deployment preparation completed!"
    Write-Info "Monitor your deployment at the respective platform dashboard"
}

# ==============================================
# SCRIPT EXECUTION
# ==============================================

try {
    Start-Deployment
}
catch {
    Write-Error "Deployment failed: $_"
    exit 1
}
