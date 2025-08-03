#!/bin/bash

# Fix deployment by generating Prisma types
echo "🔧 Fixing Prisma types generation..."

cd /var/www/bdc-projects

# Generate Prisma client in the dashboard project
echo "Generating Prisma client..."
cd bdc-dashboard
npm install
npx prisma generate
cd ..

# Clean up any incomplete builds
echo "Cleaning up Docker containers..."
docker-compose down --remove-orphans
docker system prune -f

# Rebuild with Prisma types generated
echo "Rebuilding containers..."
docker-compose up --build -d

echo "✅ Deployment fix complete!"
echo "Check status: docker-compose ps"