#!/bin/bash

# Deployment script for reptrack-backend
# This script will be executed on the EC2 server after code is pulled

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /home/ubuntu/reptrack-backend

# Pull latest changes from GitHub
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
pm2 restart reptrack-backend

# Save PM2 configuration
pm2 save

echo "✅ Deployment completed successfully!"
echo "📊 Application status:"
pm2 status reptrack-backend
