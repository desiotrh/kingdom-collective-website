#!/bin/bash
# Deployment script for Kingdom Studios App

echo "📦 Deploying Kingdom Studios App..."

# Backend deployment
cd ../kingdom-studios-backend
npm run deploy

# Frontend deployment
cd ../kingdom-studios
eas submit --platform all

echo "🎉 Deployment complete!"
