#!/bin/bash

# Quick Deployment Script for Vercel
# This script helps deploy both frontend and backend

echo "🚀 PrajaShakthi VDP Form - Deployment Script"
echo "============================================="
echo ""

# Check if we're in the right directory
if [ ! -d "PrajaShakthi-VDP-Form-backend" ] || [ ! -d "PrajaShakthi-VDP-Form-frontend" ]; then
    echo "❌ Error: This script must be run from the project root directory"
    exit 1
fi

# Function to deploy backend
deploy_backend() {
    echo "📦 Deploying Backend..."
    cd PrajaShakthi-VDP-Form-backend
    
    # Check if vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "⚠️  Vercel CLI not found. Please install it: npm i -g vercel"
        cd ..
        return 1
    fi
    
    vercel --prod
    cd ..
    echo "✅ Backend deployment initiated"
}

# Function to deploy frontend
deploy_frontend() {
    echo "📦 Deploying Frontend..."
    cd PrajaShakthi-VDP-Form-frontend
    
    # Check if vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "⚠️  Vercel CLI not found. Please install it: npm i -g vercel"
        cd ..
        return 1
    fi
    
    vercel --prod
    cd ..
    echo "✅ Frontend deployment initiated"
}

# Main menu
echo "Select deployment option:"
echo "1) Deploy Backend only"
echo "2) Deploy Frontend only"
echo "3) Deploy Both (Backend first, then Frontend)"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        deploy_backend
        ;;
    2)
        deploy_frontend
        ;;
    3)
        deploy_backend
        echo ""
        deploy_frontend
        ;;
    4)
        echo "👋 Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "============================================="
echo "✅ Deployment process completed!"
echo ""
echo "Next steps:"
echo "1. Check Vercel dashboard for deployment status"
echo "2. Verify environment variables are set correctly"
echo "3. Test your application at the production URL"
echo "4. Check browser console for any errors"
echo ""
