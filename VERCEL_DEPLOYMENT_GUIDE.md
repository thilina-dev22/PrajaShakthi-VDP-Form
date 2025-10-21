# Vercel Deployment Guide for PrajaShakthi VDP Form

## Prerequisites
1. GitHub account
2. Vercel account (sign up at https://vercel.com)
3. MongoDB Atlas account (for database)
4. Push your code to GitHub repository

## Deployment Steps

### Part 1: Deploy Backend API

#### 1. Create MongoDB Atlas Database
```bash
1. Go to https://cloud.mongodb.com
2. Create a new cluster (free tier available)
3. Create a database user with password
4. Whitelist all IPs (0.0.0.0/0) for Vercel access
5. Get your connection string
```

#### 2. Deploy Backend to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to backend folder
cd PrajaShakthi-VDP-Form-backend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: prajashakthi-vdp-backend
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**
```bash
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the backend folder: PrajaShakthi-VDP-Form-backend
4. Framework Preset: Other
5. Root Directory: PrajaShakthi-VDP-Form-backend
6. Build Command: (leave empty)
7. Output Directory: (leave empty)
8. Click "Deploy"
```

#### 3. Configure Backend Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Required Environment Variables
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prajashakthi?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=production

# Optional (if using)
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

**Important:** After adding environment variables, redeploy the backend!

#### 4. Note Your Backend URL
After deployment, you'll get a URL like:
```
https://prajashakthi-vdp-backend.vercel.app
```

### Part 2: Deploy Frontend

#### 1. Update Frontend Environment Variable

Update `.env.production`:
```bash
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

Or create it if it doesn't exist:
```bash
# In PrajaShakthi-VDP-Form-frontend folder
echo "VITE_API_BASE_URL=https://prajashakthi-vdp-backend.vercel.app" > .env.production
```

#### 2. Deploy Frontend to Vercel

**Option A: Using Vercel CLI**
```bash
# Navigate to frontend folder
cd PrajaShakthi-VDP-Form-frontend

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: prajashakthi-vdp-form
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**
```bash
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the frontend folder: PrajaShakthi-VDP-Form-frontend
4. Framework Preset: Vite
5. Root Directory: PrajaShakthi-VDP-Form-frontend
6. Build Command: npm run build
7. Output Directory: dist
8. Click "Deploy"
```

#### 3. Configure Frontend Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
VITE_API_BASE_URL=https://prajashakthi-vdp-backend.vercel.app
```

**Important:** After adding environment variables, redeploy the frontend!

### Part 3: Configure CORS (Backend)

Update your backend's CORS configuration to allow your frontend domain:

```javascript
// In server.js or where CORS is configured
const corsOptions = {
  origin: [
    'https://prajashakthi-vdp-form.vercel.app',
    'https://your-custom-domain.com', // if you have one
    'http://localhost:5173' // for local development
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

## Verification Steps

### 1. Test Backend
```bash
# Test your backend API
curl https://your-backend-url.vercel.app/api/health

# Should return: {"status": "ok"} or similar
```

### 2. Test Frontend
```bash
# Open your frontend URL in browser
https://prajashakthi-vdp-form.vercel.app

# Check:
# ✓ Page loads correctly
# ✓ Logo appears
# ✓ Background styling shows
# ✓ Forms are functional
# ✓ Can submit data
```

### 3. Check Browser Console
```bash
# Open Developer Tools (F12)
# Check for any CORS or API connection errors
# All API calls should succeed
```

## Custom Domain (Optional)

### Add Custom Domain to Frontend
```bash
1. Go to Vercel Dashboard → Your Frontend Project
2. Settings → Domains
3. Add your custom domain (e.g., forms.prajashakthi.gov.lk)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take 24-48 hours)
```

### Add Custom Domain to Backend
```bash
1. Go to Vercel Dashboard → Your Backend Project
2. Settings → Domains
3. Add subdomain (e.g., api.prajashakthi.gov.lk)
4. Update frontend environment variable with new backend URL
5. Redeploy frontend
```

## Troubleshooting

### Backend Issues

**Error: "Cannot connect to database"**
```bash
Solution:
1. Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
2. Verify MONGO_URI in Vercel environment variables
3. Ensure database user has correct permissions
```

**Error: "Function invocation timeout"**
```bash
Solution:
1. Optimize database queries
2. Add indexes to MongoDB collections
3. Reduce API response payload size
```

### Frontend Issues

**Error: "Failed to fetch" or CORS errors**
```bash
Solution:
1. Check VITE_API_BASE_URL is correct
2. Verify backend CORS configuration includes frontend domain
3. Redeploy backend after CORS changes
```

**Error: "Logo not showing"**
```bash
Solution:
1. Ensure logo.png is in public folder
2. Check file path is /logo.png (not ./logo.png)
3. Verify logo file is committed to git
```

## Continuous Deployment

### Automatic Deployments
```bash
Once connected to GitHub:
1. Any push to main branch triggers deployment
2. Pull requests create preview deployments
3. Merging PR deploys to production
```

### Manual Deployments
```bash
# Using Vercel CLI
vercel --prod

# Or through Vercel Dashboard
# Go to Deployments → Redeploy
```

## Environment Variables Summary

### Backend (.env)
```bash
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend (.env.production)
```bash
VITE_API_BASE_URL=https://your-backend.vercel.app
```

## Monitoring & Logs

### View Logs
```bash
# Backend logs
1. Vercel Dashboard → Backend Project
2. Click on latest deployment
3. View "Functions" or "Logs" tab

# Frontend logs
1. Browser Developer Tools → Console
2. Network tab for API calls
```

### Set Up Monitoring
```bash
1. Vercel Analytics (built-in)
2. Error tracking: Sentry, LogRocket
3. Uptime monitoring: UptimeRobot, Pingdom
```

## Security Best Practices

1. **Never commit .env files** (already in .gitignore)
2. **Use strong JWT secrets** (generate with: openssl rand -base64 32)
3. **Enable MongoDB IP whitelist** after testing
4. **Use HTTPS only** (Vercel provides this automatically)
5. **Implement rate limiting** on backend APIs
6. **Regular security updates** (npm audit fix)

## Cost Estimation

### Vercel Free Tier Includes:
- ✓ Unlimited deployments
- ✓ 100GB bandwidth/month
- ✓ Automatic HTTPS
- ✓ Preview deployments
- ✓ Edge functions

### MongoDB Atlas Free Tier:
- ✓ 512MB storage
- ✓ Shared cluster
- ✓ Good for development/small production

## Next Steps After Deployment

1. ✅ Test all form submissions
2. ✅ Verify admin login works
3. ✅ Check data persistence in MongoDB
4. ✅ Test on mobile devices
5. ✅ Share URLs with stakeholders
6. ✅ Set up custom domains (if needed)
7. ✅ Configure backup strategy for database
8. ✅ Monitor application performance

## Support & Resources

- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Vercel Support: https://vercel.com/support
- Community: https://github.com/vercel/vercel/discussions

---

**Your Deployment URLs:**
- Frontend: `https://prajashakthi-vdp-form.vercel.app`
- Backend: `https://prajashakthi-vdp-backend.vercel.app`

Good luck with your deployment! 🚀
