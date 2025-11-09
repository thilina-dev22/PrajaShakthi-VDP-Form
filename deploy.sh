#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project
cd /var/www/PrajaShakthi-VDP-Form

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Backend deployment
echo "🔧 Deploying backend..."
cd PrajaShakthi-VDP-Form-backend
npm install
pm2 restart prajashakthi-backend

# Frontend deployment
echo "🎨 Deploying frontend..."
cd ../PrajaShakthi-VDP-Form-frontend
npm install
rm -rf dist
npm run build

# Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# Check status
echo "✅ Deployment complete!"
echo ""
echo "Backend status:"
pm2 list | grep prajashakthi-backend
echo ""
echo "Nginx status:"
sudo systemctl status nginx --no-pager -l | head -5

echo ""
echo "🎉 Deployment successful!"
echo "Check logs with: pm2 logs prajashakthi-backend"