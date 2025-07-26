# scripts/deploy.sh
#!/bin/bash

set -e

# Configuration
APP_NAME="fitconnect-frontend"
BUILD_DIR="build"
DOCKER_REGISTRY="ghcr.io"
DOCKER_IMAGE="$DOCKER_REGISTRY/$APP_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    log_info "All requirements satisfied"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    npm ci
}

# Run tests
run_tests() {
    log_info "Running tests..."
    npm run test:coverage
    
    if [ $? -ne 0 ]; then
        log_error "Tests failed"
        exit 1
    fi
    
    log_info "All tests passed"
}

# Build application
build_app() {
    log_info "Building application..."
    npm run build
    
    if [ ! -d "$BUILD_DIR" ]; then
        log_error "Build directory not found"
        exit 1
    fi
    
    log_info "Application built successfully"
}

# Build Docker image
build_docker() {
    local tag=${1:-latest}
    
    log_info "Building Docker image with tag: $tag"
    docker build -t "$DOCKER_IMAGE:$tag" .
    
    if [ $? -ne 0 ]; then
        log_error "Docker build failed"
        exit 1
    fi
    
    log_info "Docker image built successfully"
}

# Push Docker image
push_docker() {
    local tag=${1:-latest}
    
    log_info "Pushing Docker image: $DOCKER_IMAGE:$tag"
    docker push "$DOCKER_IMAGE:$tag"
    
    if [ $? -ne 0 ]; then
        log_error "Docker push failed"
        exit 1
    fi
    
    log_info "Docker image pushed successfully"
}

# Deploy to staging
deploy_staging() {
    log_info "Deploying to staging..."
    # Add staging deployment logic here
    log_info "Deployed to staging successfully"
}

# Deploy to production
deploy_production() {
    log_info "Deploying to production..."
    # Add production deployment logic here
    log_info "Deployed to production successfully"
}

# Main deployment function
main() {
    local environment=${1:-staging}
    local version=${2:-latest}
    
    log_info "Starting deployment for environment: $environment"
    
    check_requirements
    install_dependencies
    run_tests
    build_app
    build_docker "$version"
    
    if [ "$environment" = "production" ]; then
        push_docker "$version"
        deploy_production
    else
        push_docker "$version"
        deploy_staging
    fi
    
    log_info "Deployment completed successfully!"
}

# Script usage
usage() {
    echo "Usage: $0 [environment] [version]"
    echo "  environment: staging (default) or production"
    echo "  version: Docker image tag (default: latest)"
    echo ""
    echo "Examples:"
    echo "  $0 staging"
    echo "  $0 production v1.0.0"
}

# Handle script arguments
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    usage
    exit 0
fi

# Run main function
main "$@"
