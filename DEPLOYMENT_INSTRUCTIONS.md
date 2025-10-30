# Deployment Instructions for Vercel

## ✅ Code Changes Applied

The following fixes have been applied to resolve the production deployment issues:

1. ✅ Updated `auth.js` to use `VITE_API_URL` instead of `VITE_API_BASE_URL`
2. ✅ Fixed `UserManagement.jsx` to import JSON directly (no more fetch errors)
3. ✅ Updated `.env.production` with correct environment variable name
4. ✅ Updated `.env.example` for future reference

## 🚀 Next Steps: Configure Vercel

### Frontend Deployment (Already Deployed)

**Your Frontend URLs:** 
- Main: `https://praja-shakthi-vdp-form-5aaz.vercel.app`
- Git Branch URL: `https://praja-shakthi-vdp-form-5aaz-git-main-thilinas-projects-98fabc7e.vercel.app`

1. Go to your frontend project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add/Update the following environment variable:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_API_URL` | `https://praja-shakthi-vdp-form.vercel.app` | Production, Preview, Development |

4. **Redeploy** your frontend:
   - Go to **Deployments** tab
   - Click the **⋮** menu on the latest deployment
   - Select **Redeploy**
   - ✅ Check "Use existing build cache" (faster rebuild)

### Backend Deployment

**Your Backend URL:** `https://praja-shakthi-vdp-form.vercel.app`

Make sure the following environment variables are set in your backend Vercel project:

| Name | Value | Required |
|------|-------|----------|
| `JWT_SECRET` | Your secure secret key | ✅ Yes |
| `MONGODB_URI` | Your MongoDB connection string | ✅ Yes |
| `NODE_ENV` | `production` | ✅ Yes |
| `CORS_ORIGIN` | `https://praja-shakthi-vdp-form-5aaz-git-main-thilinas-projects-98fabc7e.vercel.app` | Optional |

### Verify CORS Configuration

The backend `server.js` now includes both your frontend URLs in the CORS allowedOrigins:
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://praja-shakthi-vdp-form-5aaz-git-main-thilinas-projects-98fabc7e.vercel.app",
  "https://praja-shakthi-vdp-form-5aaz.vercel.app", // New production URL
  process.env.CORS_ORIGIN,
].filter(Boolean);
```

✅ This is correct and already pushed to GitHub!

## 🧪 Testing After Deployment

1. Open your frontend URL: `https://praja-shakthi-vdp-form-5aaz.vercel.app`
2. Open **Browser DevTools** (F12) → **Console** tab
3. Try to login
4. Check for errors:
   - ❌ `ERR_CONNECTION_REFUSED` → Backend environment variable not set
   - ❌ `CORS error` → Backend needs to be redeployed (already pushed to GitHub)
   - ✅ No errors → Everything is working!

## 🔍 Troubleshooting

### If you still see localhost:5000 errors:

1. **Clear Vercel build cache:**
   - Go to Vercel Dashboard → Your Project
   - Settings → General
   - Scroll to "Build & Development Settings"
   - Clear build cache
   - Redeploy

2. **Verify environment variable is set:**
   ```bash
   # In Vercel Dashboard → Settings → Environment Variables
   # Make sure VITE_API_URL is set for all environments
   ```

3. **Check the build logs:**
   - Go to Deployments → Click on latest deployment
   - View build logs to ensure environment variables are loaded

### If you see CORS errors:

1. Make sure backend `NODE_ENV=production` is set
2. Verify both frontend and backend URLs are using HTTPS
3. Check that your frontend URL exactly matches the one in `allowedOrigins`

## 📝 Summary of Changes

**Files Modified:**
- `PrajaShakthi-VDP-Form-frontend/src/api/auth.js` - Changed `VITE_API_BASE_URL` to `VITE_API_URL`
- `PrajaShakthi-VDP-Form-frontend/src/components/UserManagement.jsx` - Fixed JSON import
- `PrajaShakthi-VDP-Form-frontend/.env.production` - Updated environment variable
- `PrajaShakthi-VDP-Form-frontend/.env.example` - Updated for consistency

**Vercel Configuration Needed:**
- Set `VITE_API_URL` environment variable in frontend project
- Redeploy frontend after setting the variable

---

**Note:** After setting the environment variable and redeploying, your application should work correctly in production! 🎉
