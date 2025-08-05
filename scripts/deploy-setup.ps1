# Kingdom Apps Deployment Setup Script
# This script sets up environment files and provides deployment commands

Write-Host "🚀 Setting up Kingdom Apps for deployment..." -ForegroundColor Green

# Create environment files for mobile apps
$apps = @("kingdom-clips", "kingdom-lens", "kingdom-circle", "kingdom-launchpad", "kingdom-voice")

foreach ($app in $apps) {
    $envFile = "apps/$app/.env.production"
    Write-Host "Creating $envFile..." -ForegroundColor Yellow
    
    $content = @"
API_URL=https://api.kingdomcollective.pro
EXPO_PUBLIC_API_URL=https://api.kingdomcollective.pro
"@
    
    $content | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "✅ Created $envFile" -ForegroundColor Green
}

Write-Host "`n📋 DEPLOYMENT COMMANDS:" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`n🌐 WEB DEPLOYMENT (Vercel):" -ForegroundColor Yellow
Write-Host "For each web app, run these commands:" -ForegroundColor White

$webApps = @("kingdom-clips", "kingdom-lens", "kingdom-circle", "kingdom-launchpad", "kingdom-voice")

foreach ($app in $webApps) {
    Write-Host "`n📱 $app:" -ForegroundColor Magenta
    Write-Host "cd $app" -ForegroundColor Gray
    Write-Host "vercel link" -ForegroundColor Gray
    Write-Host "vercel deploy --prod" -ForegroundColor Gray
}

Write-Host "`n📱 MOBILE DEPLOYMENT (Expo):" -ForegroundColor Yellow
Write-Host "For each mobile app, run these commands:" -ForegroundColor White

foreach ($app in $apps) {
    Write-Host "`n📱 $app:" -ForegroundColor Magenta
    Write-Host "cd apps/$app" -ForegroundColor Gray
    Write-Host "npx expo install eas-cli" -ForegroundColor Gray
    Write-Host "eas build:configure" -ForegroundColor Gray
    Write-Host "eas build -p android" -ForegroundColor Gray
    Write-Host "eas build -p ios" -ForegroundColor Gray
}

Write-Host "`n🎯 SUBDOMAIN MAPPING:" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "clips.kingdomcollective.pro → kingdom-clips" -ForegroundColor White
Write-Host "lens.kingdomcollective.pro → kingdom-lens" -ForegroundColor White
Write-Host "circle.kingdomcollective.pro → kingdom-circle" -ForegroundColor White
Write-Host "voice.kingdomcollective.pro → kingdom-voice" -ForegroundColor White
Write-Host "launchpad.kingdomcollective.pro → kingdom-launchpad" -ForegroundColor White

Write-Host "`n✅ Setup complete! Run the deployment commands above." -ForegroundColor Green 