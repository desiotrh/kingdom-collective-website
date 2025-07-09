#!/bin/bash

# ==============================================
# KINGDOM STUDIOS BACKEND - PRODUCTION DEPLOYMENT
# Automated deployment to multiple cloud platforms
# ==============================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="kingdom-studios-backend"
VERSION=${1:-"latest"}
ENVIRONMENT=${2:-"production"}
PLATFORM=${3:-"auto"}

echo -e "${BLUE}🚀 Kingdom Studios Backend - Production Deployment${NC}"
echo -e "${BLUE}=================================================${NC}"
echo "Version: $VERSION"
echo "Environment: $ENVIRONMENT"
echo "Platform: $PLATFORM"
echo ""

# ==============================================
# HELPER FUNCTIONS
# ==============================================

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_requirements() {
    log_info "Checking deployment requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is required but not installed"
        exit 1
    fi
    
    # Check required files
    if [[ ! -f "Dockerfile.production" ]]; then
        log_error "Dockerfile.production not found"
        exit 1
    fi
    
    if [[ ! -f ".env.production" ]]; then
        log_error ".env.production not found"
        exit 1
    fi
    
    log_success "All requirements satisfied"
}

build_docker_image() {
    log_info "Building Docker image..."
    
    # Build production image
    docker build \
        -f Dockerfile.production \
        -t ${PROJECT_NAME}:${VERSION} \
        -t ${PROJECT_NAME}:latest \
        --build-arg NODE_ENV=production \
        --build-arg BUILD_VERSION=${VERSION} \
        --build-arg GIT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "unknown") \
        --build-arg BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
        .
    
    log_success "Docker image built successfully"
}

# ==============================================
# AWS DEPLOYMENT
# ==============================================

deploy_to_aws() {
    log_info "Deploying to AWS..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is required but not installed"
        return 1
    fi
    
    # ECR Login
    log_info "Logging into AWS ECR..."
    aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
    
    # Tag and push to ECR
    docker tag ${PROJECT_NAME}:${VERSION} 123456789012.dkr.ecr.us-east-1.amazonaws.com/${PROJECT_NAME}:${VERSION}
    docker tag ${PROJECT_NAME}:${VERSION} 123456789012.dkr.ecr.us-east-1.amazonaws.com/${PROJECT_NAME}:latest
    
    docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/${PROJECT_NAME}:${VERSION}
    docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/${PROJECT_NAME}:latest
    
    # Deploy to EKS
    if command -v kubectl &> /dev/null && [[ -d "k8s/production" ]]; then
        log_info "Deploying to EKS..."
        kubectl apply -f k8s/production/
        kubectl rollout status deployment/${PROJECT_NAME} -n production --timeout=300s
    fi
    
    # Deploy to ECS (Alternative)
    if [[ -f "aws-ecs-task-definition.json" ]]; then
        log_info "Updating ECS service..."
        aws ecs update-service \
            --cluster kingdom-studios-production \
            --service ${PROJECT_NAME} \
            --force-new-deployment
    fi
    
    log_success "AWS deployment completed"
}

# ==============================================
# GCP DEPLOYMENT
# ==============================================

deploy_to_gcp() {
    log_info "Deploying to Google Cloud Platform..."
    
    # Check gcloud CLI
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI is required but not installed"
        return 1
    fi
    
    # Configure Docker for GCR
    gcloud auth configure-docker
    
    # Tag and push to GCR
    docker tag ${PROJECT_NAME}:${VERSION} gcr.io/kingdom-studios-prod/${PROJECT_NAME}:${VERSION}
    docker tag ${PROJECT_NAME}:${VERSION} gcr.io/kingdom-studios-prod/${PROJECT_NAME}:latest
    
    docker push gcr.io/kingdom-studios-prod/${PROJECT_NAME}:${VERSION}
    docker push gcr.io/kingdom-studios-prod/${PROJECT_NAME}:latest
    
    # Deploy to GKE
    if command -v kubectl &> /dev/null && [[ -d "k8s/production" ]]; then
        log_info "Deploying to GKE..."
        gcloud container clusters get-credentials kingdom-studios-cluster --zone us-central1-a --project kingdom-studios-prod
        kubectl apply -f k8s/production/
        kubectl rollout status deployment/${PROJECT_NAME} -n production --timeout=300s
    fi
    
    # Deploy to Cloud Run (Alternative)
    if [[ -f "cloudbuild.yaml" ]]; then
        log_info "Deploying to Cloud Run..."
        gcloud run deploy ${PROJECT_NAME} \
            --image gcr.io/kingdom-studios-prod/${PROJECT_NAME}:${VERSION} \
            --platform managed \
            --region us-central1 \
            --allow-unauthenticated \
            --set-env-vars NODE_ENV=production \
            --memory 2Gi \
            --cpu 2 \
            --concurrency 1000 \
            --max-instances 100
    fi
    
    log_success "GCP deployment completed"
}

# ==============================================
# AZURE DEPLOYMENT
# ==============================================

deploy_to_azure() {
    log_info "Deploying to Microsoft Azure..."
    
    # Check Azure CLI
    if ! command -v az &> /dev/null; then
        log_error "Azure CLI is required but not installed"
        return 1
    fi
    
    # Login to ACR
    az acr login --name kingdomstudiosregistry
    
    # Tag and push to ACR
    docker tag ${PROJECT_NAME}:${VERSION} kingdomstudiosregistry.azurecr.io/${PROJECT_NAME}:${VERSION}
    docker tag ${PROJECT_NAME}:${VERSION} kingdomstudiosregistry.azurecr.io/${PROJECT_NAME}:latest
    
    docker push kingdomstudiosregistry.azurecr.io/${PROJECT_NAME}:${VERSION}
    docker push kingdomstudiosregistry.azurecr.io/${PROJECT_NAME}:latest
    
    # Deploy to AKS
    if command -v kubectl &> /dev/null && [[ -d "k8s/production" ]]; then
        log_info "Deploying to AKS..."
        az aks get-credentials --resource-group kingdom-studios-rg --name kingdom-studios-cluster
        kubectl apply -f k8s/production/
        kubectl rollout status deployment/${PROJECT_NAME} -n production --timeout=300s
    fi
    
    # Deploy to Container Instances (Alternative)
    if [[ -f "azure-container-group.yaml" ]]; then
        log_info "Deploying to Azure Container Instances..."
        az container create \
            --resource-group kingdom-studios-rg \
            --file azure-container-group.yaml
    fi
    
    log_success "Azure deployment completed"
}

# ==============================================
# RENDER.COM DEPLOYMENT
# ==============================================

deploy_to_render() {
    log_info "Deploying to Render.com..."
    
    # Create render.yaml if it doesn't exist
    if [[ ! -f "render.yaml" ]]; then
        log_info "Creating render.yaml configuration..."
        cat > render.yaml << EOF
services:
  - type: web
    name: kingdom-studios-backend
    env: node
    plan: pro
    buildCommand: npm ci && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
    healthCheckPath: /health
    numInstances: 3
    scaling:
      minInstances: 3
      maxInstances: 50
      targetMemoryPercent: 80
      targetCPUPercent: 70
EOF
    fi
    
    log_success "Render.com configuration ready"
    log_info "Please deploy manually through Render dashboard or configure webhook"
}

# ==============================================
# RAILWAY DEPLOYMENT
# ==============================================

deploy_to_railway() {
    log_info "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        log_error "Railway CLI is required but not installed"
        log_info "Install with: npm install -g @railway/cli"
        return 1
    fi
    
    # Login and deploy
    railway login
    railway link
    railway up --detach
    
    log_success "Railway deployment initiated"
}

# ==============================================
# VERCEL DEPLOYMENT (for serverless)
# ==============================================

deploy_to_vercel() {
    log_info "Deploying to Vercel (Serverless)..."
    
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI is required but not installed"
        log_info "Install with: npm install -g vercel"
        return 1
    fi
    
    # Create vercel.json if it doesn't exist
    if [[ ! -f "vercel.json" ]]; then
        log_info "Creating vercel.json configuration..."
        cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/server.js": {
      "maxDuration": 30
    }
  }
}
EOF
    fi
    
    # Deploy
    vercel --prod --confirm
    
    log_success "Vercel deployment completed"
}

# ==============================================
# MAIN DEPLOYMENT LOGIC
# ==============================================

main() {
    check_requirements
    build_docker_image
    
    case $PLATFORM in
        "aws")
            deploy_to_aws
            ;;
        "gcp")
            deploy_to_gcp
            ;;
        "azure")
            deploy_to_azure
            ;;
        "render")
            deploy_to_render
            ;;
        "railway")
            deploy_to_railway
            ;;
        "vercel")
            deploy_to_vercel
            ;;
        "all")
            log_info "Deploying to all platforms..."
            deploy_to_aws || log_warning "AWS deployment failed"
            deploy_to_gcp || log_warning "GCP deployment failed"
            deploy_to_azure || log_warning "Azure deployment failed"
            deploy_to_render || log_warning "Render deployment failed"
            deploy_to_railway || log_warning "Railway deployment failed"
            deploy_to_vercel || log_warning "Vercel deployment failed"
            ;;
        "auto")
            log_info "Auto-detecting deployment platform..."
            if command -v aws &> /dev/null; then
                deploy_to_aws
            elif command -v gcloud &> /dev/null; then
                deploy_to_gcp
            elif command -v az &> /dev/null; then
                deploy_to_azure
            elif command -v railway &> /dev/null; then
                deploy_to_railway
            elif command -v vercel &> /dev/null; then
                deploy_to_vercel
            else
                log_warning "No deployment platform detected, using Render"
                deploy_to_render
            fi
            ;;
        *)
            log_error "Unsupported platform: $PLATFORM"
            log_info "Supported platforms: aws, gcp, azure, render, railway, vercel, all, auto"
            exit 1
            ;;
    esac
    
    log_success "🎉 Production deployment completed successfully!"
    log_info "Monitor your deployment at the respective platform dashboard"
}

# ==============================================
# SCRIPT EXECUTION
# ==============================================

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
