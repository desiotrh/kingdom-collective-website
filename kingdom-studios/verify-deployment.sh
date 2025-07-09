#!/bin/bash
# Kingdom Studios App - Deployment Verification Script

echo "🔍 Verifying Production Deployment..."

# Check backend health
echo "🏥 Checking backend health..."
BACKEND_URL="${EXPO_PUBLIC_API_URL:-http://localhost:3001}"
curl -f "$BACKEND_URL/health" || echo "⚠️ Backend health check failed"

# Check database connection
echo "🗄️ Checking database optimization..."
node database-optimizer.js

# Run performance validation
echo "⚡ Running performance validation..."
node final-validation.js

# Check app store build status
echo "📱 Checking build status..."
eas build:list --limit=5

echo "✅ Deployment verification complete!"
