# Quick Deployment Commands

## Initial Setup (One-time)

```powershell
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login
```

## Deploy Backend

```powershell
# Navigate to backend folder
cd PrajaShakthi-VDP-Form-backend

# Deploy to production
vercel --prod

# After deployment, copy the URL (e.g., https://xxx.vercel.app)
```

## Deploy Frontend

```powershell
# Navigate to frontend folder
cd ..\PrajaShakthi-VDP-Form-frontend

# Update the backend URL in .env.production
# Replace the URL with your actual backend URL from previous step
echo "VITE_API_BASE_URL=https://your-backend-url.vercel.app" > .env.production

# Deploy to production
vercel --prod
```

## Post-Deployment

1. Add environment variables in Vercel Dashboard for backend:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string
   - `NODE_ENV=production`

2. Add environment variables in Vercel Dashboard for frontend:
   - `VITE_API_BASE_URL` - Your backend Vercel URL

3. Redeploy both projects after adding environment variables

## Quick Commands

```powershell
# Redeploy backend
cd PrajaShakthi-VDP-Form-backend && vercel --prod

# Redeploy frontend  
cd PrajaShakthi-VDP-Form-frontend && vercel --prod

# View logs
vercel logs [deployment-url]
```

## Need Help?

Check VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions!
