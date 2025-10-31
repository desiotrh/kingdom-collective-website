# Kingdom Collective Tools Installation Script
# Build with the Holy Spirit

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Kingdom Collective Tools Setup" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js $nodeVersion detected" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Gray
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "[OK] npm $npmVersion detected" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing Phase 1: Foundation Tools..." -ForegroundColor Cyan
Write-Host "   - Husky (Git hooks)" -ForegroundColor Gray
Write-Host "   - Commitlint (Commit standards)" -ForegroundColor Gray
Write-Host "   - lint-staged (Pre-commit linting)" -ForegroundColor Gray
Write-Host "   - bundlesize (Performance budgets)" -ForegroundColor Gray
Write-Host "   - depcheck (Unused dependencies)" -ForegroundColor Gray
Write-Host ""

# Install to kingdom-website to avoid workspace symlink issues
Write-Host "Installing to kingdom-website workspace..." -ForegroundColor Yellow

cd kingdom-website

# Install dev dependencies
npm install --save-dev `
    husky `
    @commitlint/cli `
    @commitlint/config-conventional `
    lint-staged `
    bundlesize `
    depcheck `
    @lhci/cli `
    @axe-core/playwright `
    @axe-core/react

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Installation failed. Check the error messages above." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[OK] Phase 1 tools installed successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "Initializing Husky git hooks..." -ForegroundColor Cyan

# Go back to root
cd ..

# Initialize Husky
npm run prepare

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Husky initialized successfully!" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] Husky initialization had issues. You may need to run 'npm run prepare' manually." -ForegroundColor Yellow
}

# Make hooks executable (on Unix systems - not needed on Windows but doesn't hurt)
Write-Host ""
Write-Host "Configuring git hooks..." -ForegroundColor Cyan

if (Test-Path .husky/pre-commit) {
    Write-Host "[OK] pre-commit hook ready" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] pre-commit hook not found" -ForegroundColor Yellow
}

if (Test-Path .husky/pre-push) {
    Write-Host "[OK] pre-push hook ready" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] pre-push hook not found" -ForegroundColor Yellow
}

if (Test-Path .husky/commit-msg) {
    Write-Host "[OK] commit-msg hook ready" -ForegroundColor Green
}
else {
    Write-Host "[WARNING] commit-msg hook not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Review the setup guide:" -ForegroundColor White
Write-Host "   Read TOOLS_SETUP_GUIDE.md for complete documentation" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Configure GitHub teams (if using CODEOWNERS):" -ForegroundColor White
Write-Host "   Create teams in your GitHub organization:" -ForegroundColor Gray
Write-Host "   - core-team" -ForegroundColor Gray
Write-Host "   - frontend-team" -ForegroundColor Gray
Write-Host "   - backend-team" -ForegroundColor Gray
Write-Host "   - devops-team" -ForegroundColor Gray
Write-Host "   - qa-team" -ForegroundColor Gray
Write-Host "   - docs-team" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test the git hooks:" -ForegroundColor White
Write-Host "   Make a test commit to verify hooks are working" -ForegroundColor Gray
Write-Host "   Example: git commit -m 'test: verify git hooks'" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Run the audits:" -ForegroundColor White
Write-Host "   npm run lint          # Lint check" -ForegroundColor Gray
Write-Host "   npm run typecheck     # Type check" -ForegroundColor Gray
Write-Host "   npm run test:all      # Run tests" -ForegroundColor Gray
Write-Host "   npm run bundlesize    # Check bundle sizes" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Review CI/CD workflows:" -ForegroundColor White
Write-Host "   Check .github/workflows/ for all automated checks" -ForegroundColor Gray
Write-Host ""

Write-Host "Helpful Resources:" -ForegroundColor Cyan
Write-Host "   - KINGDOM_MANIFESTO.md  (Complete standards)" -ForegroundColor Gray
Write-Host "   - TOOLS_SETUP_GUIDE.md  (This installation)" -ForegroundColor Gray
Write-Host "   - KINGDOM_AUDIT.md      (Latest audit results)" -ForegroundColor Gray
Write-Host ""

Write-Host "'Unless the LORD builds the house, the builders labor in vain.' - Psalm 127:1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Build with the Holy Spirit!" -ForegroundColor Yellow

