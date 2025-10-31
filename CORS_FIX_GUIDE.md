# CORS and Deployment Fix Documentation

## Issues Fixed

### 1. CORS Policy Errors
**Problem**: Frontend couldn't communicate with backend due to missing CORS headers.

**Solution**: 
- Updated backend `server.js` with comprehensive CORS configuration
- Added all Vercel frontend URLs to allowed origins
- Added proper CORS headers in `vercel.json`

### 2. Double Slash in API URLs
**Problem**: URLs like `https://praja-shakthi-vdp-form.vercel.app//api/...` (double slash)

**Solution**:
- Ensured `.env.production` has NO trailing slash
- The `auth.js` file already strips trailing slashes with `.replace(/\/$/, "")`

### 3. 308 Permanent Redirect Error
**Problem**: Incorrect URL formatting causing redirects

**Solution**: Fixed URL construction in environment variables

## Files Modified

### Backend Changes:
1. **`PrajaShakthi-VDP-Form-backend/server.js`**
   - Enhanced CORS configuration with dynamic origin handling
   - Added logging for debugging CORS issues
   - Support for comma-separated CORS_ORIGIN environment variable

2. **`PrajaShakthi-VDP-Form-backend/vercel.json`**
   - Added CORS headers configuration
   - Ensures proper headers for all API routes

### Frontend Changes:
1. **`PrajaShakthi-VDP-Form-frontend/.env.production`**
   - Removed trailing slash from VITE_API_URL
   - Added clarifying comment

## Deployment Steps

### Step 1: Update Vercel Environment Variables

#### Backend Environment Variables (Vercel Dashboard):
Go to your backend Vercel project → Settings → Environment Variables

Add/Update:
```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
NODE_ENV=production
CORS_ORIGIN=https://praja-shakthi-vdp-form-5aaz.vercel.app,https://praja-shakthi-vdp-form-5aaz-git-main-thilinas-projects-98fabc7e.vercel.app
```

**Important**: Add ALL your frontend deployment URLs to CORS_ORIGIN (comma-separated, no spaces)

#### Frontend Environment Variables (Vercel Dashboard):
Go to your frontend Vercel project → Settings → Environment Variables

Add/Update:
```
VITE_API_URL=https://praja-shakthi-vdp-form.vercel.app
```

**Critical**: NO trailing slash!

### Step 2: Redeploy Both Applications

#### Backend:
```bash
cd PrajaShakthi-VDP-Form-backend
git add .
git commit -m "fix: CORS configuration and URL handling"
git push
```

Or use Vercel CLI:
```bash
cd PrajaShakthi-VDP-Form-backend
vercel --prod
```

#### Frontend:
```bash
cd PrajaShakthi-VDP-Form-frontend
git add .
git commit -m "fix: remove trailing slash from API URL"
git push
```

Or use Vercel CLI:
```bash
cd PrajaShakthi-VDP-Form-frontend
vercel --prod
```

### Step 3: Verify the Fix

1. **Check Backend Health**:
   - Visit: `https://praja-shakthi-vdp-form.vercel.app/api/health`
   - Should return: `{"status":"ok"}`

2. **Check Frontend Console**:
   - Open your frontend URL in browser
   - Open DevTools Console (F12)
   - Look for the log: "🔐 CORS Allowed Origins: [...]"
   - Verify NO CORS errors

3. **Test API Calls**:
   - Login to your application
   - Check that notifications load without errors
   - Verify no "ERR_FAILED 308" errors

## Local Development

For local development, ensure:

1. **Backend** runs on `http://localhost:5000`
2. **Frontend** runs on `http://localhost:5173`

The configuration already handles this automatically.

## Troubleshooting

### If CORS errors persist:

1. **Check Vercel Logs**:
   ```bash
   vercel logs <deployment-url>
   ```

2. **Verify Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure CORS_ORIGIN is set correctly
   - Redeploy after changing env vars

3. **Check URL Construction**:
   - In browser console, check the actual URLs being called
   - Ensure no double slashes (`//api/...`)

4. **Add New Frontend URLs**:
   If Vercel creates new deployment URLs, add them to:
   - Backend `server.js` allowedOrigins array, OR
   - Backend environment variable `CORS_ORIGIN`

### If 308 Redirect persists:

1. Check that `.env.production` has NO trailing slash
2. Clear browser cache
3. Verify the built frontend is using the correct API URL:
   ```bash
   # In the dist folder after build
   grep -r "VITE_API_URL" dist/
   ```

## Additional Notes

- **Wildcards in CORS**: For security, we're NOT using wildcards (`*`). Each origin must be explicitly listed.
- **Credentials**: `credentials: true` is required for cookie-based authentication.
- **Multiple Frontend URLs**: Vercel creates multiple URLs (git branch URLs, production URL). All must be in CORS config.

## Production Checklist

- [ ] Backend environment variables set in Vercel
- [ ] Frontend environment variables set in Vercel
- [ ] No trailing slashes in VITE_API_URL
- [ ] All frontend URLs added to CORS_ORIGIN
- [ ] Backend redeployed
- [ ] Frontend redeployed
- [ ] Health check endpoint working
- [ ] No CORS errors in browser console
- [ ] Login functionality working
- [ ] Notifications loading successfully
