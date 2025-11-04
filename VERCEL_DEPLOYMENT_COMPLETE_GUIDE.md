# 🚀 Complete Vercel Deployment Guide - From Scratch

## Prerequisites Checklist

- [x] Application tested and working on localhost
- [x] MongoDB database ready (MongoDB Atlas recommended for Vercel)
- [x] Vercel account created (https://vercel.com)
- [x] Vercel CLI installed globally: `npm install -g vercel`
- [x] Git repository pushed to GitHub

---

## Part 1: Deploy Backend to Vercel

### Step 1: Prepare Backend for Vercel

#### 1.1 Update package.json

The backend package.json needs a production start script:

```bash
cd PrajaShakthi-VDP-Form-backend
```

Add this to your `package.json` scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

#### 1.2 Verify vercel.json

Your current `vercel.json` looks good! It's already configured correctly.

#### 1.3 Create .vercelignore (Optional but Recommended)

Create a `.vercelignore` file in the backend folder:
```
node_modules
.env
.git
*.log
```

### Step 2: Deploy Backend

#### Option A: Deploy via Vercel CLI (Recommended)

```bash
# Make sure you're in the backend directory
cd PrajaShakthi-VDP-Form-backend

# Login to Vercel (if not already logged in)
vercel login

# Deploy to preview first (to test)
vercel

# Follow the prompts:
# ? Set up and deploy "~/PrajaShakthi-VDP-Form-backend"? [Y/n] Y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] N
# ? What's your project's name? prajashakthi-backend
# ? In which directory is your code located? ./
# ? Want to modify these settings? [y/N] N

# If preview works, deploy to production
vercel --prod
```

#### Option B: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `PrajaShakthi-VDP-Form-backend`
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`
5. Click "Deploy"

### Step 3: Configure Backend Environment Variables

**CRITICAL:** Set these in Vercel Dashboard → Your Backend Project → Settings → Environment Variables

| Variable | Value | Example | Required |
|----------|-------|---------|----------|
| `MONGO_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/prajashakthi` | ✅ Yes |
| `JWT_SECRET` | Strong secret key (32+ characters) | `your-super-secret-jwt-key-min-32-chars-long` | ✅ Yes |
| `NODE_ENV` | `production` | `production` | ✅ Yes |
| `CORS_ORIGIN` | Frontend URLs (comma-separated, NO SPACES) | See below | ✅ Yes |
| `PORT` | `5000` | `5000` | ❌ Optional |

**For CORS_ORIGIN:** You'll add the frontend URL after deploying it. For now, use:
```
https://yourfrontend.vercel.app
```
*(You'll update this in Step 6)*

#### How to Set Environment Variables:

1. Go to Vercel Dashboard
2. Select your backend project
3. Go to **Settings** → **Environment Variables**
4. For each variable:
   - Click "Add New"
   - Enter Key (e.g., `MONGO_URI`)
   - Enter Value
   - Select "Production, Preview, Development" (or just Production)
   - Click "Add"
5. After adding all variables, click **Redeploy**

### Step 4: Note Your Backend URL

After deployment, Vercel will give you URLs like:
- Production: `https://prajashakthi-backend.vercel.app`
- Preview: `https://prajashakthi-backend-abc123.vercel.app`

**Save your production URL!** You'll need it for the frontend.

### Step 5: Test Backend

```bash
# Test health endpoint
curl https://your-backend-url.vercel.app/api/health

# Expected response:
{"status":"ok"}
```

---

## Part 2: Deploy Frontend to Vercel

### Step 6: Prepare Frontend for Vercel

#### 6.1 Update package.json

Make sure your `package.json` has the build script:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

#### 6.2 Verify vercel.json

Your current `vercel.json` looks good!

#### 6.3 Create .vercelignore

Create a `.vercelignore` file in the frontend folder:
```
node_modules
.env
.env.local
.git
*.log
dist
```

### Step 7: Deploy Frontend

#### Option A: Deploy via Vercel CLI (Recommended)

```bash
# Navigate to frontend directory
cd ../PrajaShakthi-VDP-Form-frontend

# Deploy to preview first
vercel

# Follow the prompts:
# ? Set up and deploy "~/PrajaShakthi-VDP-Form-frontend"? [Y/n] Y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] N
# ? What's your project's name? prajashakthi-frontend
# ? In which directory is your code located? ./
# ? Want to modify these settings? [y/N] N

# If preview works, deploy to production
vercel --prod
```

#### Option B: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your Git repository (if different from backend)
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `PrajaShakthi-VDP-Form-frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. **DO NOT DEPLOY YET** - First, add environment variable (next step)

### Step 8: Configure Frontend Environment Variable

**CRITICAL:** Set this environment variable BEFORE first deployment:

Go to Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Your backend production URL (NO trailing slash) | `https://prajashakthi-backend.vercel.app` |

**Steps:**
1. Click "Add New"
2. Key: `VITE_API_URL`
3. Value: Your backend URL from Step 4 (e.g., `https://prajashakthi-backend.vercel.app`)
4. Environment: Production, Preview, Development
5. Click "Add"
6. Click "Deploy" (if first time) or "Redeploy" (if already deployed)

### Step 9: Update Backend CORS_ORIGIN

Now that you have your frontend URL, update the backend:

1. Go to Vercel Dashboard → Backend Project → Settings → Environment Variables
2. Find `CORS_ORIGIN`
3. Update its value to include BOTH:
   - Your frontend production URL
   - Your frontend preview URLs (optional but recommended)

Example:
```
https://prajashakthi-frontend.vercel.app,https://prajashakthi-frontend-git-main-youraccount.vercel.app
```

**Important:** 
- NO spaces between URLs
- NO trailing slashes
- Comma-separated

4. Click "Save"
5. **Redeploy backend** (Deployments → Click "..." → Redeploy)

---

## Part 3: Verify Deployment

### Step 10: Test Everything

#### 10.1 Test Backend

```bash
# Health check
curl https://your-backend.vercel.app/api/health

# Should return: {"status":"ok"}
```

#### 10.2 Test Frontend

1. Open your frontend URL in browser: `https://your-frontend.vercel.app`
2. Open Browser DevTools (F12) → Console
3. You should see: `🔧 API Configuration: Base URL: https://your-backend.vercel.app`
4. Try to login with super admin credentials
5. Check Network tab - all API calls should go to your backend URL

#### 10.3 Verify CORS

- No CORS errors in browser console
- API calls successful
- Login works
- All features functional

---

## Part 4: Post-Deployment Setup

### Step 11: Create Super Admin

Since this is a fresh database, create the super admin:

**Option A: Via Backend Script (If you have access)**

```bash
# SSH/Connect to your backend or run locally pointing to production DB
node scripts/createSuperAdmin.js
```

**Option B: Via MongoDB Atlas Interface**

1. Go to MongoDB Atlas
2. Browse Collections → Users collection
3. Insert document with this structure:
```json
{
  "username": "superadmin",
  "password": "$2a$10$YourHashedPasswordHere",
  "fullName": "Super Administrator",
  "email": "admin@yourcompany.com",
  "role": "superadmin",
  "isActive": true,
  "createdAt": {"$date": "2025-11-04T00:00:00.000Z"}
}
```

**Option C: Use Local Script Pointing to Production DB**

```bash
# Temporarily update .env to point to production MongoDB
MONGO_URI=your-production-mongodb-uri

# Run create super admin script
node scripts/createSuperAdmin.js

# Change .env back to local DB
```

### Step 12: Configure Custom Domains (Optional)

#### Backend Domain
1. Vercel Dashboard → Backend Project → Settings → Domains
2. Add: `api.yourcompany.com`
3. Configure DNS as instructed by Vercel
4. Update frontend `VITE_API_URL` to `https://api.yourcompany.com`

#### Frontend Domain
1. Vercel Dashboard → Frontend Project → Settings → Domains
2. Add: `yourcompany.com` or `app.yourcompany.com`
3. Configure DNS as instructed by Vercel
4. Update backend `CORS_ORIGIN` to include new domain

---

## Complete Environment Variables Reference

### Backend Environment Variables

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prajashakthi

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Environment
NODE_ENV=production

# CORS - Your frontend URLs (NO SPACES, NO TRAILING SLASHES)
CORS_ORIGIN=https://prajashakthi-frontend.vercel.app,https://prajashakthi-frontend-git-main-youraccount.vercel.app

# Optional
PORT=5000
```

### Frontend Environment Variables

```env
# Backend API URL (NO TRAILING SLASH)
VITE_API_URL=https://prajashakthi-backend.vercel.app
```

---

## Troubleshooting

### Issue 1: Build Fails

**Frontend:**
```bash
# Check build locally first
npm run build

# If successful locally, check Vercel build logs
```

**Backend:**
```bash
# Backend doesn't need build, check deployment logs in Vercel
```

### Issue 2: API Returns 404

**Check:**
- ✅ Backend is deployed and accessible
- ✅ `VITE_API_URL` is set correctly in frontend
- ✅ No trailing slash in `VITE_API_URL`
- ✅ Frontend was redeployed after setting env var

### Issue 3: CORS Errors

**Check:**
- ✅ `CORS_ORIGIN` in backend includes frontend URL
- ✅ No spaces in `CORS_ORIGIN`
- ✅ No trailing slashes in `CORS_ORIGIN`
- ✅ Backend was redeployed after updating `CORS_ORIGIN`

### Issue 4: Environment Variables Not Working

**Solution:**
- Environment variables are read at BUILD time for frontend
- Must REDEPLOY after changing env vars
- Clear browser cache if needed

### Issue 5: Database Connection Failed

**Check:**
- ✅ `MONGO_URI` is correct
- ✅ MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- ✅ MongoDB user has correct permissions
- ✅ Database name is correct in connection string

---

## Useful Vercel CLI Commands

```bash
# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View environment variables
vercel env ls

# Add environment variable
vercel env add VITE_API_URL production

# Pull environment variables locally
vercel env pull

# Check logs
vercel logs [deployment-url]

# Link to existing project
vercel link

# Remove deployment
vercel remove [deployment-name]
```

---

## Quick Deployment Checklist

### Before Deployment
- [ ] Code tested locally
- [ ] MongoDB Atlas database created
- [ ] MongoDB allows connections from 0.0.0.0/0
- [ ] Super admin creation script ready
- [ ] Git repository is up to date

### Backend Deployment
- [ ] Deploy backend to Vercel
- [ ] Set `MONGO_URI` environment variable
- [ ] Set `JWT_SECRET` environment variable (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Set `CORS_ORIGIN` (temporary, will update later)
- [ ] Verify deployment: `curl https://backend-url/api/health`
- [ ] Note backend URL

### Frontend Deployment
- [ ] Set `VITE_API_URL` to backend URL (before first deploy)
- [ ] Deploy frontend to Vercel
- [ ] Verify build successful
- [ ] Note frontend URL

### Final Configuration
- [ ] Update backend `CORS_ORIGIN` with frontend URL
- [ ] Redeploy backend
- [ ] Test login on frontend
- [ ] Verify API calls in browser Network tab
- [ ] Create super admin user
- [ ] Test all features

---

## Your Deployment URLs

After deployment, save these URLs:

```
Backend Production:  https://prajashakthi-backend.vercel.app
Frontend Production: https://prajashakthi-frontend.vercel.app

Backend URL for VITE_API_URL: https://prajashakthi-backend.vercel.app
Frontend URL for CORS_ORIGIN: https://prajashakthi-frontend.vercel.app
```

---

## Next Steps After Successful Deployment

1. ✅ Test all features thoroughly
2. ✅ Create district admin users
3. ✅ Configure custom domains (optional)
4. ✅ Set up monitoring/alerts
5. ✅ Document your deployment URLs for team
6. ✅ Set up automated deployments from Git (if not already)

---

**You're ready to deploy! 🚀**

Start with Step 1 and follow each step carefully. The entire process should take about 15-20 minutes.
