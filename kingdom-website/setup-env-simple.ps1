# Kingdom Collective Environment Setup Script

Write-Host "Setting up environment for Kingdom Collective Chatbot" -ForegroundColor Yellow

# Create .env.local from template if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host "Creating .env.local from template..." -ForegroundColor Cyan
    Copy-Item "env.example" ".env.local"
    Write-Host "Created .env.local" -ForegroundColor Green
} else {
    Write-Host ".env.local already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Required Environment Variables:" -ForegroundColor Cyan
Write-Host "1. OpenAI API Key - Get from: https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "2. Supabase URL and Service Role Key - Get from: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "3. NextAuth Secret - Generate a random secret" -ForegroundColor White
Write-Host "4. NextAuth URL - Set to your domain" -ForegroundColor White

Write-Host ""
Write-Host "Please edit .env.local with your actual values:" -ForegroundColor Yellow
Write-Host "The file is located at: $(Get-Location)\.env.local" -ForegroundColor Gray

# Open the .env.local file for editing
$openFile = Read-Host "Would you like to open .env.local for editing now? (y/n)"
if ($openFile -eq "y" -or $openFile -eq "Y") {
    try {
        Start-Process notepad ".env.local"
        Write-Host "Opened .env.local in Notepad" -ForegroundColor Green
    } catch {
        Write-Host "Could not open Notepad. Please manually edit .env.local" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Environment setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env.local with your actual API keys" -ForegroundColor White
Write-Host "2. Run: npm run dev (for local testing)" -ForegroundColor White
Write-Host "3. Or deploy to Vercel for production" -ForegroundColor White

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
