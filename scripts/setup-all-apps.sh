#!/bin/bash

# Kingdom Studios Apps - Complete Setup Script
# This script sets up all 6 apps and the backend for launch

echo "🚀 Kingdom Studios Apps - Complete Setup Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the Kingdom Studios root directory"
    exit 1
fi

print_status "Starting complete setup for all Kingdom Studios apps..."

# ==============================================
# STEP 1: INSTALL GLOBAL DEPENDENCIES
# ==============================================

print_info "Step 1: Installing global dependencies..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed"
    print_info "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required"
    print_info "Current version: $(node --version)"
    exit 1
fi

print_status "Node.js version: $(node --version)"

# Install global tools
print_info "Installing global tools..."
npm install -g @expo/cli
npm install -g @expo/eas-cli
npm install -g @railway/cli

print_status "Global tools installed"

# ==============================================
# STEP 2: SETUP BACKEND
# ==============================================

print_info "Step 2: Setting up backend..."

cd kingdom-studios-backend

# Install dependencies
print_info "Installing backend dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    print_info "Creating backend environment file..."
    cp env-template.txt .env
    print_warning "Please edit .env file with your actual values"
else
    print_status "Backend environment file already exists"
fi

# Test backend
print_info "Testing backend..."
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Test backend health
if curl -f http://localhost:3000/health &> /dev/null; then
    print_status "Backend is running successfully"
else
    print_warning "Backend health check failed - make sure to configure .env file"
fi

# Stop backend for now
kill $BACKEND_PID 2>/dev/null

cd ..

# ==============================================
# STEP 3: SETUP MAIN APP
# ==============================================

print_info "Step 3: Setting up main Kingdom Studios app..."

cd kingdom-studios

# Install dependencies
print_info "Installing main app dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_info "Creating main app environment file..."
    cp env-template.txt .env.local
    print_warning "Please edit .env.local file with your actual values"
else
    print_status "Main app environment file already exists"
fi

cd ..

# ==============================================
# STEP 4: SETUP INDIVIDUAL APPS
# ==============================================

print_info "Step 4: Setting up individual apps..."

APPS=("kingdom-clips" "kingdom-voice" "kingdom-circle" "kingdom-lens" "kingdom-launchpad")

for app in "${APPS[@]}"; do
    print_info "Setting up $app..."
    
    cd "apps/$app"
    
    # Install dependencies
    npm install
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env.local" ]; then
        cp env-template.txt .env.local
        print_warning "Please edit apps/$app/.env.local file with your actual values"
    else
        print_status "$app environment file already exists"
    fi
    
    cd ../..
done

print_status "All individual apps configured"

# ==============================================
# STEP 5: CREATE DEPLOYMENT SCRIPTS
# ==============================================

print_info "Step 5: Creating deployment scripts..."

# Create main deployment script
cat > deploy-all.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying all Kingdom Studios apps..."

# Deploy backend first
echo "📦 Deploying backend..."
cd kingdom-studios-backend
npm run deploy

# Deploy main app
echo "📱 Deploying main app..."
cd ../kingdom-studios
eas build --platform all --profile production

# Deploy individual apps
APPS=("kingdom-clips" "kingdom-voice" "kingdom-circle" "kingdom-lens" "kingdom-launchpad")

for app in "${APPS[@]}"; do
    echo "📱 Deploying $app..."
    cd "../apps/$app"
    eas build --platform all --profile production
done

echo "✅ All apps deployed!"
EOF

chmod +x deploy-all.sh

# Create quick start script
cat > quick-start.sh << 'EOF'
#!/bin/bash

echo "🚀 Quick start for Kingdom Studios apps..."

# Start backend
echo "📦 Starting backend..."
cd kingdom-studios-backend
npm start &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Start main app
echo "📱 Starting main app..."
cd ../kingdom-studios
npm start &
MAIN_PID=$!

echo "✅ Apps started!"
echo "Backend: http://localhost:3000"
echo "Main App: Expo dev server"
echo ""
echo "Press Ctrl+C to stop all apps"

# Wait for interrupt
trap "kill $BACKEND_PID $MAIN_PID 2>/dev/null; exit" INT
wait
EOF

chmod +x quick-start.sh

# ==============================================
# STEP 6: CREATE CONFIGURATION GUIDE
# ==============================================

print_info "Step 6: Creating configuration guide..."

cat > CONFIGURATION_GUIDE.md << 'EOF'
# 🚀 Kingdom Studios Apps - Configuration Guide

## 📋 Required API Keys

### 🔥 Essential (Must Have)
1. **Firebase Project**
   - Go to: https://console.firebase.google.com/
   - Create project: "kingdom-studios-dev"
   - Enable Authentication, Firestore, Storage
   - Get config from Project Settings > Your apps

2. **OpenAI API Key**
   - Go to: https://platform.openai.com/api-keys
   - Create new secret key
   - Enable billing

3. **Stripe Account**
   - Go to: https://dashboard.stripe.com/
   - Get test keys from Developers > API Keys

## 📁 Environment Files to Configure

### Backend (.env)
- `kingdom-studios-backend/.env`

### Frontend Apps (.env.local)
- `kingdom-studios/.env.local`
- `apps/kingdom-clips/.env.local`
- `apps/kingdom-voice/.env.local`
- `apps/kingdom-circle/.env.local`
- `apps/kingdom-lens/.env.local`
- `apps/kingdom-launchpad/.env.local`

## 🚀 Quick Start Commands

```bash
# Start backend
cd kingdom-studios-backend
npm start

# Start main app
cd kingdom-studios
npm start

# Start individual apps
cd apps/kingdom-clips
npm start
```

## 📱 Build for Production

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Build all apps
./deploy-all.sh
```

## 🔧 Troubleshooting

1. **Backend won't start**: Check MongoDB connection in .env
2. **Apps won't load**: Check Firebase config in .env.local
3. **AI features not working**: Check OpenAI API key
4. **Payments not working**: Check Stripe keys

## 📞 Support

For issues, check the logs in each app directory.
EOF

# ==============================================
# STEP 7: FINAL VALIDATION
# ==============================================

print_info "Step 7: Final validation..."

# Check if all required files exist
REQUIRED_FILES=(
    "kingdom-studios-backend/.env"
    "kingdom-studios/.env.local"
    "apps/kingdom-clips/.env.local"
    "apps/kingdom-voice/.env.local"
    "apps/kingdom-circle/.env.local"
    "apps/kingdom-lens/.env.local"
    "apps/kingdom-launchpad/.env.local"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    print_status "All environment files are present"
else
    print_warning "Missing environment files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    print_info "Please copy the template files and configure them"
fi

# ==============================================
# COMPLETION
# ==============================================

echo ""
echo "🎉 Kingdom Studios Apps Setup Complete!"
echo "========================================"
echo ""
print_status "All 6 apps configured"
print_status "Backend configured"
print_status "Deployment scripts created"
print_status "Configuration guide created"
echo ""
print_warning "Next steps:"
echo "1. Configure API keys in environment files"
echo "2. Test backend: cd kingdom-studios-backend && npm start"
echo "3. Test main app: cd kingdom-studios && npm start"
echo "4. Build for production: ./deploy-all.sh"
echo ""
print_info "Configuration guide: CONFIGURATION_GUIDE.md"
print_info "Quick start: ./quick-start.sh"
print_info "Deploy all: ./deploy-all.sh"
echo ""
print_status "Setup complete! 🚀" 