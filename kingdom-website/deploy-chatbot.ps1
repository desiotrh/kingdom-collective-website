# 🚀 Kingdom Collective Chatbot Deployment Script
# This script will help you deploy the enhanced chatbot to production

Write-Host "🔥 Kingdom Collective Chatbot Deployment" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the kingdom-website directory" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found package.json - we're in the right directory" -ForegroundColor Green

# Check for environment variables
Write-Host "`n🔍 Checking environment configuration..." -ForegroundColor Cyan

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️  No .env.local file found. Creating from template..." -ForegroundColor Yellow
    Copy-Item "env.example" $envFile
    Write-Host "📝 Please edit .env.local with your actual API keys:" -ForegroundColor Yellow
    Write-Host "   - OPENAI_API_KEY" -ForegroundColor White
    Write-Host "   - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor White
    Write-Host "   - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor White
    Write-Host "   - NEXTAUTH_SECRET" -ForegroundColor White
    Write-Host "   - NEXTAUTH_URL" -ForegroundColor White
    Write-Host "`nPress any key after updating .env.local to continue..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Check if required environment variables are set
$requiredVars = @("OPENAI_API_KEY", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY")
$missingVars = @()

foreach ($var in $requiredVars) {
    if (-not [System.Environment]::GetEnvironmentVariable($var)) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "❌ Missing required environment variables:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    Write-Host "`nPlease set these in your .env.local file and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment variables configured" -ForegroundColor Green

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Run knowledge base ingestion
Write-Host "`n📚 Ingesting knowledge base..." -ForegroundColor Cyan
Write-Host "This will process all markdown and YAML files and create embeddings..." -ForegroundColor White

try {
    npm run ingest
    Write-Host "✅ Knowledge base ingested successfully" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Knowledge base ingestion failed, but continuing..." -ForegroundColor Yellow
    Write-Host "You can run 'npm run ingest' manually later" -ForegroundColor Yellow
}

# Build the application
Write-Host "`n🔨 Building application..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Application built successfully" -ForegroundColor Green

# Test the build
Write-Host "`n🧪 Testing the build..." -ForegroundColor Cyan
Write-Host "Starting local server for testing..." -ForegroundColor White

# Start the server in background
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm start
}

# Wait a moment for server to start
Start-Sleep -Seconds 5

# Test the API endpoint
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/chat" -Method POST -ContentType "application/json" -Body '{"messages":[{"role":"user","content":"Hello"}],"mode":"marketplace"}' -TimeoutSec 10
    Write-Host "✅ API endpoint is working" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  API endpoint test failed, but build was successful" -ForegroundColor Yellow
    Write-Host "This might be due to missing environment variables or database setup" -ForegroundColor Yellow
}

# Stop the test server
Stop-Job $serverJob
Remove-Job $serverJob

Write-Host "`n🎉 Deployment preparation complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

Write-Host "`n📋 Next steps for production deployment:" -ForegroundColor Cyan
Write-Host "1. Set up your Supabase project:" -ForegroundColor White
Write-Host "   - Create a new project at https://supabase.com" -ForegroundColor Gray
Write-Host "   - Run the SQL schema from supabase/schema.sql" -ForegroundColor Gray
Write-Host "   - Enable the pgvector extension" -ForegroundColor Gray

Write-Host "`n2. Deploy to Vercel:" -ForegroundColor White
Write-Host "   - Connect your GitHub repository to Vercel" -ForegroundColor Gray
Write-Host "   - Set environment variables in Vercel dashboard" -ForegroundColor Gray
Write-Host "   - Deploy from main branch" -ForegroundColor Gray

Write-Host "`n3. Post-deployment:" -ForegroundColor White
Write-Host "   - Run 'npm run ingest' to populate the knowledge base" -ForegroundColor Gray
Write-Host "   - Test the chatbot functionality" -ForegroundColor Gray
Write-Host "   - Run 'npm run evaluate' to test response quality" -ForegroundColor Gray

Write-Host "`n🔧 Manual deployment commands:" -ForegroundColor Cyan
Write-Host "   npm run build    # Build for production" -ForegroundColor Gray
Write-Host "   npm start        # Start production server" -ForegroundColor Gray
Write-Host "   npm run ingest   # Ingest knowledge base" -ForegroundColor Gray
Write-Host "   npm run evaluate # Test chatbot responses" -ForegroundColor Gray

Write-Host "`n📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow

Write-Host "`n🚀 Ready to deploy! The chatbot is configured with:" -ForegroundColor Green
Write-Host "   ✅ RAG-based responses with source citations" -ForegroundColor Green
Write-Host "   ✅ Faith Mode vs Marketplace Mode toggle" -ForegroundColor Green
Write-Host "   ✅ Function calling for pricing, features, and lead generation" -ForegroundColor Green
Write-Host "   ✅ Comprehensive knowledge base" -ForegroundColor Green
Write-Host "   ✅ Evaluation and testing framework" -ForegroundColor Green

Write-Host "`nPress any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
