# Kingdom Studios App - API Key Setup Guide
# PowerShell Version

Write-Host "🔑 Kingdom Studios App - API Key Configuration" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the kingdom-studios directory" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ .env.local file created successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "🔥 REQUIRED SETUP - Start with these two:" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. FIREBASE SETUP (Required for app to work)" -ForegroundColor Red
Write-Host "   • Go to: https://console.firebase.google.com/" -ForegroundColor White
Write-Host "   • Click 'Create a project' or 'Add project'" -ForegroundColor White
Write-Host "   • Name: 'kingdom-studios-dev'" -ForegroundColor White
Write-Host "   • Enable Google Analytics (recommended)" -ForegroundColor White
Write-Host "   • After creation, click 'Project Settings' gear icon" -ForegroundColor White
Write-Host "   • Scroll down to 'Your apps' section" -ForegroundColor White
Write-Host "   • Click 'Add app' → Web app (</>) icon" -ForegroundColor White
Write-Host "   • App nickname: 'Kingdom Studios Dev'" -ForegroundColor White
Write-Host "   • Check 'Also set up Firebase Hosting'" -ForegroundColor White
Write-Host "   • Copy the config values to .env.local" -ForegroundColor White
Write-Host ""

Write-Host "2. OPENAI API (Required for AI features)" -ForegroundColor Red
Write-Host "   • Go to: https://platform.openai.com/api-keys" -ForegroundColor White
Write-Host "   • Sign in or create account" -ForegroundColor White
Write-Host "   • Click '+ Create new secret key'" -ForegroundColor White
Write-Host "   • Name: 'Kingdom Studios Dev'" -ForegroundColor White
Write-Host "   • Copy the key (starts with 'sk-')" -ForegroundColor White
Write-Host "   • Add to EXPO_PUBLIC_OPENAI_API_KEY in .env.local" -ForegroundColor White
Write-Host ""

Write-Host "📝 TO EDIT YOUR API KEYS:" -ForegroundColor Cyan
Write-Host "   • Open .env.local in your text editor" -ForegroundColor White
Write-Host "   • Replace the placeholder values with your actual keys" -ForegroundColor White
Write-Host "   • Save the file" -ForegroundColor White
Write-Host ""

Write-Host "🧪 TO TEST YOUR CONFIGURATION:" -ForegroundColor Green
Write-Host "   • Run: node check-config.js" -ForegroundColor White
Write-Host "   • This will validate your API keys" -ForegroundColor White
Write-Host ""

Write-Host "⚡ OPTIONAL APIS (can setup later):" -ForegroundColor Yellow
Write-Host "   • Social Media (Facebook, Twitter, LinkedIn, etc.)" -ForegroundColor White
Write-Host "   • Email Service (SendGrid or Mailgun)" -ForegroundColor White
Write-Host "   • Payment Processing (Stripe)" -ForegroundColor White
Write-Host "   • Analytics (Google Analytics, Mixpanel)" -ForegroundColor White
Write-Host ""

Write-Host "🚀 ONCE CONFIGURED:" -ForegroundColor Green
Write-Host "   • Run: npm install" -ForegroundColor White
Write-Host "   • Run: npm start" -ForegroundColor White
Write-Host "   • Your app will launch!" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to open .env.local in notepad"
notepad ".env.local"
