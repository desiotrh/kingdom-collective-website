# 🔍 Kingdom Studios - API Discovery Tools Installation Script
# PowerShell script to install and setup API discovery tools

Write-Host "🏛️ Kingdom Studios - API Discovery Tools Installation" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing required packages..." -ForegroundColor Yellow

# Install global packages for API discovery
$globalPackages = @(
    "axios",
    "cheerio",
    "puppeteer",
    "@vscode/vsce"
)

foreach ($package in $globalPackages) {
    Write-Host "Installing $package..." -ForegroundColor White
    npm install -g $package
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $package installed successfully" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ Warning: Failed to install $package globally" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🔧 Setting up API Discovery Tool..." -ForegroundColor Yellow

# Make the API discovery tool executable
$scriptPath = Join-Path $PSScriptRoot "api-discovery-tool.js"
if (Test-Path $scriptPath) {
    Write-Host "✅ API Discovery Tool found at: $scriptPath" -ForegroundColor Green
}
else {
    Write-Host "❌ API Discovery Tool not found. Please ensure api-discovery-tool.js exists." -ForegroundColor Red
}

Write-Host ""
Write-Host "🔌 Setting up VS Code Extension..." -ForegroundColor Yellow

$extensionPath = Join-Path $PSScriptRoot "vscode-extension"
if (Test-Path $extensionPath) {
    Set-Location $extensionPath
    
    Write-Host "Installing extension dependencies..." -ForegroundColor White
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Extension dependencies installed" -ForegroundColor Green
        
        Write-Host "Compiling extension..." -ForegroundColor White
        npm run compile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Extension compiled successfully" -ForegroundColor Green
            
            # Ask if user wants to package the extension
            $packageExtension = Read-Host "Do you want to package the VS Code extension? (y/N)"
            if ($packageExtension -eq "y" -or $packageExtension -eq "Y") {
                Write-Host "Packaging extension..." -ForegroundColor White
                npm run package
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Extension packaged successfully" -ForegroundColor Green
                    Write-Host "📦 Extension package created: kingdom-api-discovery-1.0.0.vsix" -ForegroundColor Cyan
                    Write-Host "To install: code --install-extension kingdom-api-discovery-1.0.0.vsix" -ForegroundColor Yellow
                }
                else {
                    Write-Host "⚠️ Extension packaging failed" -ForegroundColor Yellow
                }
            }
        }
        else {
            Write-Host "⚠️ Extension compilation failed" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "⚠️ Failed to install extension dependencies" -ForegroundColor Yellow
    }
    
    # Return to original directory
    Set-Location $PSScriptRoot
}
else {
    Write-Host "❌ VS Code extension directory not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Creating output directories..." -ForegroundColor Yellow

# Create directories for API discovery results
$outputDirs = @(
    "../docs/discovered-apis",
    "../docs/api-integrations",
    "../docs/api-templates"
)

foreach ($dir in $outputDirs) {
    $fullPath = Join-Path $PSScriptRoot $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "✅ Created directory: $dir" -ForegroundColor Green
    }
    else {
        Write-Host "✅ Directory exists: $dir" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎯 Creating quick start script..." -ForegroundColor Yellow

$quickStartScript = @"
#!/usr/bin/env node

/**
 * 🚀 Quick Start - API Discovery
 * Run this script to quickly discover APIs for Kingdom Studios
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Starting API Discovery...');
console.log('This will discover APIs from Amazon, Etsy, Shopify, Stripe, and more...\n');

try {
    const scriptPath = path.join(__dirname, 'api-discovery-tool.js');
    execSync(`node "`${scriptPath}`" discover`, { stdio: 'inherit' });
    
    console.log('\n🎉 API Discovery completed!');
    console.log('📁 Check the docs/discovered-apis folder for results');
    console.log('📖 Read the INTEGRATION_GUIDE.md for next steps');
    
} catch (error) {
    console.error('❌ Error during API discovery:', error.message);
    process.exit(1);
}
"@

$quickStartPath = Join-Path $PSScriptRoot "quick-start-api-discovery.js"
$quickStartScript | Out-File -FilePath $quickStartPath -Encoding UTF8
Write-Host "✅ Created quick start script: quick-start-api-discovery.js" -ForegroundColor Green

Write-Host ""
Write-Host "📚 Creating documentation..." -ForegroundColor Yellow

$readmeContent = @"
# 🔍 Kingdom Studios - API Discovery Tools

This directory contains automated tools to help you discover and integrate APIs from various platforms like Amazon, Etsy, Shopify, and more.

## 🚀 Quick Start

1. **Install Tools** (run once):
   ```powershell
   .\install-api-tools.ps1
   ```

2. **Discover APIs**:
   ```bash
   node quick-start-api-discovery.js
   ```

3. **Check Results**:
   - View discovered APIs in `docs/discovered-apis/`
   - Read integration guide: `docs/discovered-apis/INTEGRATION_GUIDE.md`

## 🛠️ Tools Available

### 1. API Discovery Tool (`api-discovery-tool.js`)
- Automatically discovers API endpoints from documentation
- Generates integration code examples
- Creates environment variable templates
- Supports: Amazon, Etsy, Shopify, Stripe, Printify, ConvertKit

### 2. VS Code Extension (`vscode-extension/`)
- Visual interface for API discovery
- Integration with Kingdom Studios workspace
- One-click API integration
- API management dashboard

## 📋 Supported Platforms

- ✅ **Amazon Product Advertising API** - Product search and affiliate links
- ✅ **Etsy Open API** - Handmade marketplace integration
- ✅ **Shopify Admin API** - E-commerce store management
- ✅ **Stripe API** - Payment processing
- ✅ **Printify API** - Print-on-demand products
- ✅ **ConvertKit API** - Email marketing automation

## 🔧 Manual Usage

### Discover All APIs:
```bash
node api-discovery-tool.js discover
```

### View Help:
```bash
node api-discovery-tool.js help
```

## 📁 Output Structure

```
docs/discovered-apis/
├── api-discovery-results.json    # Master results file
├── discovery-summary.json        # Summary statistics
├── INTEGRATION_GUIDE.md          # Step-by-step integration guide
├── amazon-api.json              # Amazon API details
├── etsy-api.json                # Etsy API details
└── ... (other platform files)
```

## 🔗 Integration with Kingdom Studios

The discovered APIs can be integrated into your unified API system at:
- `packages/api/sharedApiClient.ts`

Follow the generated integration guide for specific implementation steps.

## 🆘 Troubleshooting

1. **Node.js not found**: Install Node.js from https://nodejs.org
2. **Permission errors**: Run PowerShell as Administrator
3. **Network errors**: Check internet connection and firewall settings
4. **VS Code extension issues**: Ensure VS Code is installed and updated

## 📞 Support

For issues or questions, refer to the generated integration guides or check the official documentation links provided in the discovered API files.
"@

$readmePath = Join-Path $PSScriptRoot "README.md"
$readmeContent | Out-File -FilePath $readmePath -Encoding UTF8
Write-Host "✅ Created README.md with usage instructions" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Installation Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run: node quick-start-api-discovery.js" -ForegroundColor White
Write-Host "2. Check results in docs/discovered-apis/" -ForegroundColor White
Write-Host "3. Follow the integration guide" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see: scripts/README.md" -ForegroundColor Yellow
Write-Host ""
