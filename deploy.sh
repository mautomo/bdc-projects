#!/bin/bash

# BDC Projects Deployment Script for Hostinger VPS
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting BDC Projects deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on VPS
if [ ! -f /etc/hostinger ]; then
    print_warning "Not running on Hostinger VPS. Continuing anyway..."
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    print_status "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    print_status "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Clone or update repository
if [ ! -d "/var/www/bdc-projects" ]; then
    print_status "Cloning BDC Projects repository..."
    sudo git clone https://github.com/YOUR_USERNAME/bdc-projects.git /var/www/bdc-projects
    sudo chown -R $USER:$USER /var/www/bdc-projects
else
    print_status "Updating BDC Projects repository..."
    cd /var/www/bdc-projects
    git pull origin main
fi

cd /var/www/bdc-projects

# Install dependencies
print_status "Installing dependencies for BDC Competitive..."
cd bdc-competitive
npm install --production
cd ..

print_status "Installing dependencies for BDC Assessment..."
cd bdc-assessment
npm install --production
cd ..

# Build projects
print_status "Building projects..."
cd bdc-competitive && npm run build && cd ..
cd bdc-assessment && npm run build && cd ..

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down || true

# Build and start containers
print_status "Building and starting Docker containers..."
docker-compose up --build -d

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "✅ Deployment successful!"
    print_status "BDC Dashboard (Main App): https://bdcapp.vandoko.com"
    print_status "BDC Competitive: https://competitive.vandoko.com"
    print_status "BDC Assessment: https://assessment.vandoko.com"
else
    print_error "❌ Deployment failed. Check docker-compose logs."
    docker-compose logs
    exit 1
fi

# Set up SSL certificates (Let's Encrypt)
if command -v certbot &> /dev/null; then
    print_status "Setting up SSL certificates..."
    sudo certbot --nginx -d bdcapp.vandoko.com -d competitive.vandoko.com -d assessment.vandoko.com -d vandoko.com -d www.vandoko.com --non-interactive --agree-tos --email mdonovan@vandoko.ai
else
    print_warning "Certbot not found. Install it manually for SSL certificates."
fi

# Set up automatic updates
print_status "Setting up automatic deployment script..."
sudo tee /etc/cron.d/bdc-deploy > /dev/null <<EOL
# BDC Projects auto-deployment (daily at 2 AM)
0 2 * * * root cd /var/www/bdc-projects && ./deploy.sh > /var/log/bdc-deploy.log 2>&1
EOL

print_status "🎉 BDC Projects deployed successfully!"
print_status "Check logs: docker-compose logs -f"