# Kingdom Website - Development Server Startup Script (PowerShell)
# This script starts the Next.js development server

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Kingdom Collective - Dev Server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Change to the script's directory
Set-Location -Path $PSScriptRoot

# Start the dev server
npm run dev

