# scripts/setup.sh
#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Welcome message
echo "======================================="
echo "  FitConnect Frontend Setup Script"
echo "======================================="
echo ""

# Check Node.js version
log_info "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    log_warn "Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    log_warn "Node.js version $NODE_VERSION is not supported. Please upgrade to Node.js 16 or higher."
    exit 1
fi

log_info "Node.js version: $(node -v) ✓"

# Check npm version
log_info "Checking npm version..."
log_info "npm version: $(npm -v) ✓"

# Install dependencies
log_info "Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    log_info "Creating .env file from template..."
    cp .env.example .env
    log_warn "Please update the .env file with your actual configuration values"
else
    log_info ".env file already exists ✓"
fi

# Setup git hooks (if using git)
if [ -d .git ]; then
    log_info "Setting up git hooks..."
    npx husky install 2>/dev/null || log_warn "Husky not configured"
fi

# Create necessary directories
log_info "Creating necessary directories..."
mkdir -p src/assets/images
mkdir -p src/assets/icons
mkdir -p public/assets/images

# Setup complete
echo ""
echo "======================================="
echo "  Setup Complete!"
echo "======================================="
echo ""
echo "Next steps:"
echo "1. Update your .env file with actual values"
echo "2. Run 'npm start' to start the development server"
echo "3. Run 'npm test' to run tests"
echo "4. Run 'npm run build' to build for production"
echo ""
echo "For more information, see README.md"
