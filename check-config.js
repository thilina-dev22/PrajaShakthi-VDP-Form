#!/usr/bin/env node

/**
 * Configuration Checker for Production Deployment
 * Run this script to verify your environment is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Production Configuration...\n');

// Check frontend .env.production file
const frontendEnvPath = path.join(__dirname, 'PrajaShakthi-VDP-Form-frontend', '.env.production');
let frontendEnvCorrect = false;

if (fs.existsSync(frontendEnvPath)) {
  const content = fs.readFileSync(frontendEnvPath, 'utf8');
  if (content.includes('VITE_API_URL=')) {
    console.log('✅ Frontend .env.production exists and uses VITE_API_URL');
    frontendEnvCorrect = true;
  } else if (content.includes('VITE_API_BASE_URL=')) {
    console.log('❌ Frontend .env.production still uses old VITE_API_BASE_URL');
    console.log('   Please update to VITE_API_URL\n');
  }
} else {
  console.log('⚠️  Frontend .env.production not found');
  console.log('   Create it with: VITE_API_URL=https://your-backend-url.vercel.app\n');
}

// Check frontend auth.js
const authJsPath = path.join(__dirname, 'PrajaShakthi-VDP-Form-frontend', 'src', 'api', 'auth.js');
let authJsCorrect = false;

if (fs.existsSync(authJsPath)) {
  const content = fs.readFileSync(authJsPath, 'utf8');
  if (content.includes('VITE_API_URL')) {
    console.log('✅ auth.js uses VITE_API_URL');
    authJsCorrect = true;
  } else if (content.includes('VITE_API_BASE_URL')) {
    console.log('❌ auth.js still uses old VITE_API_BASE_URL');
    console.log('   File needs to be updated\n');
  }
}

// Check UserManagement.jsx
const userMgmtPath = path.join(__dirname, 'PrajaShakthi-VDP-Form-frontend', 'src', 'components', 'UserManagement.jsx');
let userMgmtCorrect = false;

if (fs.existsExists(userMgmtPath)) {
  const content = fs.readFileSync(userMgmtPath, 'utf8');
  if (content.includes('import provincialData from')) {
    console.log('✅ UserManagement.jsx imports provincial_data.json correctly');
    userMgmtCorrect = true;
  } else if (content.includes('fetch(\'/src/data/provincial_data.json\')')) {
    console.log('❌ UserManagement.jsx still uses fetch for JSON (will fail in production)');
    console.log('   Should import the JSON file directly\n');
  }
}

// Check backend server.js CORS
const serverJsPath = path.join(__dirname, 'PrajaShakthi-VDP-Form-backend', 'server.js');
let corsConfigured = false;

if (fs.existsSync(serverJsPath)) {
  const content = fs.readFileSync(serverJsPath, 'utf8');
  if (content.includes('praja-shakthi-vdp-form-5aaz-git-main-thilinas-projects-98fabc7e.vercel.app')) {
    console.log('✅ Backend CORS includes production frontend URL');
    corsConfigured = true;
  } else {
    console.log('⚠️  Backend CORS might not include production frontend URL');
    console.log('   Add your frontend URL to allowedOrigins in server.js\n');
  }
}

console.log('\n' + '='.repeat(60));
console.log('Summary:');
console.log('='.repeat(60));

const allCorrect = frontendEnvCorrect && authJsCorrect && userMgmtCorrect && corsConfigured;

if (allCorrect) {
  console.log('✅ All checks passed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Go to Vercel Dashboard → Frontend Project → Settings → Environment Variables');
  console.log('2. Set VITE_API_URL to your backend URL');
  console.log('3. Redeploy your frontend');
  console.log('4. Test the application\n');
} else {
  console.log('⚠️  Some issues found. Please review the messages above.\n');
}
