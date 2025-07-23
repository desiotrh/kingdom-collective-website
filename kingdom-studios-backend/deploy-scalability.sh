#!/bin/bash

# ==============================================
# KINGDOM STUDIOS - SCALABILITY DEPLOYMENT SCRIPT
# Comprehensive deployment for 10K-100K concurrent users
# ==============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
NAMESPACE="production"
CLUSTER_NAME="kingdom-studios-cluster"
REGION="us-west-2"
NODE_GROUP_NAME="kingdom-studios-node-group"
MIN_NODES=3
MAX_NODES=20
NODE_TYPE="t3.xlarge"

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed"
        exit 1
    fi
    
    # Check aws CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed"
        exit 1
    fi
    
    # Check eksctl
    if ! command -v eksctl &> /dev/null; then
        log_error "eksctl is not installed"
        exit 1
    fi
    
    # Check helm
    if ! command -v helm &> /dev/null; then
        log_error "Helm is not installed"
        exit 1
    fi
    
    log_success "All prerequisites are installed"
}

# Create EKS cluster
create_cluster() {
    log_info "Creating EKS cluster..."
    
    eksctl create cluster \
        --name $CLUSTER_NAME \
        --region $REGION \
        --nodegroup-name $NODE_GROUP_NAME \
        --node-type $NODE_TYPE \
        --nodes-min $MIN_NODES \
        --nodes-max $MAX_NODES \
        --managed \
        --with-oidc \
        --ssh-access \
        --ssh-public-key kingdom-studios-key \
        --full-ecr-access \
        --appmesh-access \
        --alb-ingress-access
    
    log_success "EKS cluster created successfully"
}

# Setup namespace
setup_namespace() {
    log_info "Setting up namespace..."
    
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
    kubectl label namespace $NAMESPACE environment=production
    
    log_success "Namespace setup completed"
}

# Install monitoring stack
install_monitoring() {
    log_info "Installing monitoring stack..."
    
    # Add Prometheus Helm repository
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    
    # Install Prometheus
    helm install prometheus prometheus-community/kube-prometheus-stack \
        --namespace monitoring \
        --create-namespace \
        --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
        --set prometheus.prometheusSpec.podMonitorSelectorNilUsesHelmValues=false
    
    # Install Grafana
    helm install grafana grafana/grafana \
        --namespace monitoring \
        --set adminPassword=admin123 \
        --set service.type=LoadBalancer
    
    log_success "Monitoring stack installed"
}

# Install ingress controller
install_ingress() {
    log_info "Installing NGINX ingress controller..."
    
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    
    helm install ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace \
        --set controller.replicaCount=3 \
        --set controller.resources.requests.cpu=100m \
        --set controller.resources.requests.memory=128Mi \
        --set controller.resources.limits.cpu=500m \
        --set controller.resources.limits.memory=512Mi
    
    log_success "Ingress controller installed"
}

# Deploy Redis cluster
deploy_redis() {
    log_info "Deploying Redis cluster..."
    
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update
    
    helm install redis bitnami/redis \
        --namespace $NAMESPACE \
        --set architecture=replication \
        --set auth.enabled=true \
        --set auth.sentinel=true \
        --set master.persistence.size=20Gi \
        --set replica.persistence.size=20Gi \
        --set replica.replicaCount=3 \
        --set sentinel.persistence.size=5Gi
    
    log_success "Redis cluster deployed"
}

# Deploy MongoDB
deploy_mongodb() {
    log_info "Deploying MongoDB..."
    
    helm install mongodb bitnami/mongodb \
        --namespace $NAMESPACE \
        --set architecture=replicaset \
        --set auth.enabled=true \
        --set auth.rootPassword=kingdom-studios-mongo \
        --set persistence.size=50Gi \
        --set replicaCount=3
    
    log_success "MongoDB deployed"
}

# Build and push Docker image
build_and_push_image() {
    log_info "Building and pushing Docker image..."
    
    # Build image
    docker build -f Dockerfile.production -t kingdom-studios/backend:latest .
    
    # Tag for ECR
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com
    
    docker tag kingdom-studios/backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/kingdom-studios/backend:latest
    
    # Push to ECR
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/kingdom-studios/backend:latest
    
    log_success "Docker image built and pushed"
}

# Deploy application
deploy_application() {
    log_info "Deploying Kingdom Studios application..."
    
    # Apply Kubernetes configurations
    kubectl apply -f k8s/production/advanced-scalability.yaml -n $NAMESPACE
    
    # Wait for deployment to be ready
    kubectl wait --for=condition=available --timeout=300s deployment/kingdom-studios-backend -n $NAMESPACE
    
    log_success "Application deployed successfully"
}

# Setup secrets and configmaps
setup_secrets() {
    log_info "Setting up secrets and configmaps..."
    
    # Create secrets
    kubectl create secret generic kingdom-studios-secrets \
        --from-literal=JWT_SECRET=kingdom-studios-jwt-secret \
        --from-literal=REDIS_PASSWORD=redis-password \
        --from-literal=MONGODB_PASSWORD=kingdom-studios-mongo \
        --from-literal=API_KEY=kingdom-studios-api-key \
        --namespace $NAMESPACE \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # Create configmaps
    kubectl create configmap kingdom-studios-config \
        --from-literal=NODE_ENV=production \
        --from-literal=PORT=3000 \
        --from-literal=API_VERSION=v1 \
        --namespace $NAMESPACE \
        --dry-run=client -o yaml | kubectl apply -f -
    
    log_success "Secrets and configmaps created"
}

# Setup auto-scaling
setup_autoscaling() {
    log_info "Setting up auto-scaling..."
    
    # Install cluster autoscaler
    helm repo add autoscaler https://kubernetes.github.io/autoscaler
    helm repo update
    
    helm install cluster-autoscaler autoscaler/cluster-autoscaler \
        --namespace kube-system \
        --set autoDiscovery.clusterName=$CLUSTER_NAME \
        --set awsRegion=$REGION \
        --set rbac.serviceAccount.annotations."eks\.amazonaws\.com/role-arn"=arn:aws:iam::$AWS_ACCOUNT_ID:role/AmazonEKSClusterAutoscalerRole
    
    log_success "Auto-scaling configured"
}

# Setup monitoring and alerting
setup_monitoring() {
    log_info "Setting up monitoring and alerting..."
    
    # Deploy custom metrics server
    kubectl apply -f k8s/production/custom-metrics-server.yaml -n $NAMESPACE
    
    # Setup Prometheus rules
    kubectl apply -f k8s/production/prometheus-rules.yaml -n monitoring
    
    # Setup Grafana dashboards
    kubectl apply -f k8s/production/grafana-dashboards.yaml -n monitoring
    
    log_success "Monitoring and alerting configured"
}

# Run load tests
run_load_tests() {
    log_info "Running load tests..."
    
    # Install Artillery for load testing
    npm install -g artillery
    
    # Run load tests
    artillery run load-testing-config.yml
    
    log_success "Load tests completed"
}

# Setup SSL certificates
setup_ssl() {
    log_info "Setting up SSL certificates..."
    
    # Install cert-manager
    helm repo add jetstack https://charts.jetstack.io
    helm repo update
    
    helm install cert-manager jetstack/cert-manager \
        --namespace cert-manager \
        --create-namespace \
        --set installCRDs=true
    
    # Create cluster issuer
    kubectl apply -f k8s/production/cluster-issuer.yaml
    
    log_success "SSL certificates configured"
}

# Setup backup and disaster recovery
setup_backup() {
    log_info "Setting up backup and disaster recovery..."
    
    # Install Velero for backup
    helm repo add vmware-tanzu https://vmware-tanzu.github.io/helm-charts
    helm repo update
    
    helm install velero vmware-tanzu/velero \
        --namespace velero \
        --create-namespace \
        --set configuration.provider=aws \
        --set configuration.backupStorageLocation.bucket=kingdom-studios-backups \
        --set configuration.backupStorageLocation.config.region=$REGION
    
    log_success "Backup and disaster recovery configured"
}

# Performance optimization
optimize_performance() {
    log_info "Optimizing performance..."
    
    # Enable node taints for better scheduling
    kubectl taint nodes --all node-role.kubernetes.io/master:NoSchedule-
    
    # Setup resource quotas
    kubectl apply -f k8s/production/resource-quotas.yaml -n $NAMESPACE
    
    # Setup network policies
    kubectl apply -f k8s/production/network-policies.yaml -n $NAMESPACE
    
    log_success "Performance optimizations applied"
}

# Health checks
perform_health_checks() {
    log_info "Performing health checks..."
    
    # Check cluster health
    kubectl get nodes
    kubectl get pods -n $NAMESPACE
    
    # Check application health
    kubectl get svc -n $NAMESPACE
    kubectl get ingress -n $NAMESPACE
    
    # Check monitoring
    kubectl get pods -n monitoring
    
    log_success "Health checks completed"
}

# Main deployment function
main() {
    log_info "Starting Kingdom Studios scalability deployment..."
    
    # Get AWS account ID
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    
    # Execute deployment steps
    check_prerequisites
    create_cluster
    setup_namespace
    install_monitoring
    install_ingress
    deploy_redis
    deploy_mongodb
    build_and_push_image
    setup_secrets
    deploy_application
    setup_autoscaling
    setup_monitoring
    setup_ssl
    setup_backup
    optimize_performance
    perform_health_checks
    run_load_tests
    
    log_success "🎉 Kingdom Studios scalability deployment completed successfully!"
    
    # Display deployment information
    echo ""
    echo "=============================================="
    echo "DEPLOYMENT INFORMATION"
    echo "=============================================="
    echo "Cluster Name: $CLUSTER_NAME"
    echo "Namespace: $NAMESPACE"
    echo "Region: $REGION"
    echo "Min Nodes: $MIN_NODES"
    echo "Max Nodes: $MAX_NODES"
    echo "Node Type: $NODE_TYPE"
    echo ""
    echo "Access URLs:"
    echo "- Application: https://api.kingdomstudios.app"
    echo "- Grafana: http://$(kubectl get svc grafana -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')"
    echo "- Prometheus: http://$(kubectl get svc prometheus-operated -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')"
    echo ""
    echo "Monitoring Credentials:"
    echo "- Grafana: admin/admin123"
    echo ""
    echo "Next Steps:"
    echo "1. Configure DNS for api.kingdomstudios.app"
    echo "2. Set up monitoring alerts"
    echo "3. Run comprehensive load tests"
    echo "4. Monitor performance metrics"
    echo "=============================================="
}

# Error handling
trap 'log_error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@" 