# 🔧 Kingdom Collective Environment Setup Script

Write-Host "🔧 Setting up environment for Kingdom Collective Chatbot" -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Yellow

# Create .env.local from template if it doesn't exist
if (-not (Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local from template..." -ForegroundColor Cyan
    Copy-Item "env.example" ".env.local"
    Write-Host "✅ Created .env.local" -ForegroundColor Green
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

Write-Host "`n📋 Required Environment Variables:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

Write-Host "`n1. OpenAI API Key:" -ForegroundColor White
Write-Host "   Get from: https://platform.openai.com/api-keys" -ForegroundColor Gray
Write-Host "   Variable: OPENAI_API_KEY" -ForegroundColor Gray

Write-Host "`n2. Supabase Configuration:" -ForegroundColor White
Write-Host "   Get from: https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host "   Variables:" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Gray
Write-Host "   - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Gray

Write-Host "`n3. NextAuth Configuration:" -ForegroundColor White
Write-Host "   Generate a random secret for NEXTAUTH_SECRET" -ForegroundColor Gray
Write-Host "   Set NEXTAUTH_URL to your domain (e.g., https://yourdomain.com)" -ForegroundColor Gray

Write-Host "`n4. Optional - Stripe (for payments):" -ForegroundColor White
Write-Host "   Get from: https://dashboard.stripe.com/apikeys" -ForegroundColor Gray
Write-Host "   Variables: STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY" -ForegroundColor Gray

Write-Host "`n📝 Please edit .env.local and add your actual values:" -ForegroundColor Yellow
Write-Host "   The file is located at: $(Get-Location)\.env.local" -ForegroundColor Gray

# Open the .env.local file for editing
$openFile = Read-Host "`nWould you like to open .env.local for editing now? (y/n)"
if ($openFile -eq "y" -or $openFile -eq "Y") {
    try {
        Start-Process notepad ".env.local"
        Write-Host "✅ Opened .env.local in Notepad" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not open Notepad. Please manually edit .env.local" -ForegroundColor Yellow
    }
}

Write-Host "`n🔍 Current .env.local contents:" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "=") {
            $key = $_.Split("=")[0]
            $value = $_.Split("=")[1]
            if ($value -and $value -ne "your_*_here") {
                Write-Host "$key=***" -ForegroundColor Green
            } else {
                Write-Host "$key=NOT_SET" -ForegroundColor Red
            }
        } else {
            Write-Host $_ -ForegroundColor Gray
        }
    }
} else {
    Write-Host "❌ .env.local not found" -ForegroundColor Red
}

Write-Host "`n✅ Environment setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env.local with your actual API keys" -ForegroundColor White
Write-Host "2. Run: .\deploy-chatbot.ps1" -ForegroundColor White
Write-Host "3. Or run: npm run dev (for local testing)" -ForegroundColor White

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
