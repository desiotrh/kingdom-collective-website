# ==============================================
# KINGDOM STUDIOS BACKEND - SIMPLE DEPLOYMENT TEST
# Test Docker build and local deployment
# ==============================================

param(
    [string]$Version = "v1.0.0"
)

$ProjectName = "kingdom-studios-backend"

Write-Host "🚀 Kingdom Studios Backend - Local Deployment Test" -ForegroundColor Blue
Write-Host "=================================================" -ForegroundColor Blue
Write-Host "Version: $Version" -ForegroundColor White
Write-Host ""

function Write-Info($msg) { Write-Host "ℹ️  $msg" -ForegroundColor Blue }
function Write-Success($msg) { Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error($msg) { Write-Host "❌ $msg" -ForegroundColor Red }

try {
    # Check Docker
    Write-Info "Checking Docker..."
    docker --version
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker not found"
        exit 1
    }
    Write-Success "Docker is available"

    # Build Docker image
    Write-Info "Building production Docker image..."
    docker build -f Dockerfile.production -t "${ProjectName}:${Version}" .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker build failed"
        exit 1
    }
    Write-Success "Docker image built successfully"

    # Stop any existing test container
    Write-Info "Cleaning up existing containers..."
    docker stop kingdom-studios-test 2>$null
    docker rm kingdom-studios-test 2>$null

    # Run production container locally
    Write-Info "Starting production container on port 3001..."
    docker run -d --name kingdom-studios-test -p 3001:3000 --env NODE_ENV=production "${ProjectName}:${Version}"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to start container"
        exit 1
    }
    Write-Success "Production container started"

    # Wait for container to be ready
    Write-Info "Waiting for container to be ready..."
    Start-Sleep -Seconds 10

    # Test health endpoint
    Write-Info "Testing health endpoint..."
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get -TimeoutSec 10
        Write-Success "Health check passed"
        Write-Host "  Status: $($response.status)" -ForegroundColor White
        Write-Host "  Environment: $($response.environment)" -ForegroundColor White
        Write-Host "  Version: $($response.version)" -ForegroundColor White
    } catch {
        Write-Error "Health check failed: $_"
        
        # Show container logs for debugging
        Write-Info "Container logs:"
        docker logs kingdom-studios-test
        exit 1
    }

    # Test metrics endpoint
    Write-Info "Testing metrics endpoint..."
    try {
        $metrics = Invoke-RestMethod -Uri "http://localhost:3001/metrics" -Method Get -TimeoutSec 10
        Write-Success "Metrics endpoint working"
        Write-Host "  Memory Usage: $([math]::Round($metrics.memory.heapUsed / 1024 / 1024, 2))MB" -ForegroundColor White
    } catch {
        Write-Error "Metrics test failed: $_"
    }

    # Run quick performance test if available
    if (Test-Path "quick-performance-test.js") {
        Write-Info "Running performance validation..."
        $env:TEST_BASE_URL = "http://localhost:3001"
        node quick-performance-test.js
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Performance validation passed"
        } else {
            Write-Error "Performance validation failed"
        }
    }

    Write-Success "🎉 Local deployment test completed successfully!"
    Write-Info "Production container is running on http://localhost:3001"
    Write-Info "To stop the test container, run: docker stop kingdom-studios-test"

} catch {
    Write-Error "Deployment test failed: $_"
    exit 1
}
