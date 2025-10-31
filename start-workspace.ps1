# Kingdom Studios App - Workspace Startup Script
# This script ensures you're always in the correct workspace directory

$workspacePath = "D:\Kingdom Studios App"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Kingdom Studios App - Workspace" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if workspace exists
if (Test-Path $workspacePath) {
    Set-Location $workspacePath
    Write-Host "✅ Workspace directory set to:" -ForegroundColor Green
    Write-Host "   $workspacePath" -ForegroundColor White
    Write-Host ""
    
    # Verify kingdom-website exists
    if (Test-Path "kingdom-website") {
        Write-Host "✅ kingdom-website directory found" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Warning: kingdom-website directory not found" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "You can now run commands like:" -ForegroundColor Cyan
    Write-Host "  npm run build" -ForegroundColor White
    Write-Host "  npm --prefix kingdom-website install" -ForegroundColor White
    Write-Host "  npm --prefix kingdom-website run dev" -ForegroundColor White
    Write-Host ""
}
else {
    Write-Host "❌ Error: Workspace directory not found!" -ForegroundColor Red
    Write-Host "   Expected: $workspacePath" -ForegroundColor White
    Write-Host ""
    Write-Host "Please update the `$workspacePath variable in this script." -ForegroundColor Yellow
    Write-Host ""
}

