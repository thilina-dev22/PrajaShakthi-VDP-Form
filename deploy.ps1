# Quick Deployment Script for Vercel (PowerShell)
# This script helps deploy both frontend and backend

Write-Host "🚀 PrajaShakthi VDP Form - Deployment Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "PrajaShakthi-VDP-Form-backend") -or -not (Test-Path "PrajaShakthi-VDP-Form-frontend")) {
    Write-Host "❌ Error: This script must be run from the project root directory" -ForegroundColor Red
    exit 1
}

# Function to deploy backend
function Deploy-Backend {
    Write-Host "📦 Deploying Backend..." -ForegroundColor Yellow
    Set-Location PrajaShakthi-VDP-Form-backend
    
    # Check if vercel CLI is installed
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
    if (-not $vercelInstalled) {
        Write-Host "⚠️  Vercel CLI not found. Please install it: npm i -g vercel" -ForegroundColor Red
        Set-Location ..
        return $false
    }
    
    vercel --prod
    Set-Location ..
    Write-Host "✅ Backend deployment initiated" -ForegroundColor Green
    return $true
}

# Function to deploy frontend
function Deploy-Frontend {
    Write-Host "📦 Deploying Frontend..." -ForegroundColor Yellow
    Set-Location PrajaShakthi-VDP-Form-frontend
    
    # Check if vercel CLI is installed
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
    if (-not $vercelInstalled) {
        Write-Host "⚠️  Vercel CLI not found. Please install it: npm i -g vercel" -ForegroundColor Red
        Set-Location ..
        return $false
    }
    
    vercel --prod
    Set-Location ..
    Write-Host "✅ Frontend deployment initiated" -ForegroundColor Green
    return $true
}

# Main menu
Write-Host "Select deployment option:" -ForegroundColor Cyan
Write-Host "1) Deploy Backend only"
Write-Host "2) Deploy Frontend only"
Write-Host "3) Deploy Both (Backend first, then Frontend)"
Write-Host "4) Exit"
Write-Host ""
$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Deploy-Backend
    }
    "2" {
        Deploy-Frontend
    }
    "3" {
        Deploy-Backend
        Write-Host ""
        Deploy-Frontend
    }
    "4" {
        Write-Host "👋 Exiting..." -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "✅ Deployment process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Check Vercel dashboard for deployment status"
Write-Host "2. Verify environment variables are set correctly"
Write-Host "3. Test your application at the production URL"
Write-Host "4. Check browser console for any errors"
Write-Host ""
