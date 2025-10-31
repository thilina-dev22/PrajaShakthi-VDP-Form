# 🚀 Deployment Checklist - CORS Fix

## Pre-Deployment Checklist

### ✅ Code Changes (Already Done)
- [x] Updated `PrajaShakthi-VDP-Form-backend/server.js` with enhanced CORS
- [x] Updated `PrajaShakthi-VDP-Form-backend/vercel.json` with CORS headers
- [x] Updated `PrajaShakthi-VDP-Form-frontend/.env.production` (removed trailing slash)
- [x] Created documentation files

---

## 🎯 YOUR ACTION ITEMS

### Step 1: Configure Backend Environment Variables

**Go to**: Vercel Dashboard → Your Backend Project → Settings → Environment Variables

Add these 4 variables:

| Variable | Value | Action |
|----------|-------|--------|
| `MONGO_URI` | Your MongoDB connection string | [ ] Added |
| `JWT_SECRET` | A strong random secret (32+ chars) | [ ] Added |
| `NODE_ENV` | `production` | [ ] Added |
| `CORS_ORIGIN` | `https://praja-shakthi-vdp-form-5aaz.vercel.app,https://praja-shakthi-vdp-form-5aaz-git-main-thilinas-projects-98fabc7e.vercel.app` | [ ] Added |

**Important Notes**:
- [ ] CORS_ORIGIN has NO SPACES between URLs
- [ ] CORS_ORIGIN has NO TRAILING SLASHES on URLs
- [ ] All URLs in CORS_ORIGIN are comma-separated
- [ ] JWT_SECRET is at least 32 characters

### Step 2: Configure Frontend Environment Variables

**Go to**: Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

Add this 1 variable:

| Variable | Value | Action |
|----------|-------|--------|
| `VITE_API_URL` | `https://praja-shakthi-vdp-form.vercel.app` | [ ] Added |

**Important Notes**:
- [ ] VITE_API_URL has NO TRAILING SLASH
- [ ] URL is exactly your backend deployment URL

### Step 3: Commit and Push Changes

```powershell
# From project root
git add .
git commit -m "fix: CORS configuration and URL handling for Vercel deployment"
git push origin main
```

- [ ] Code committed
- [ ] Code pushed to GitHub
- [ ] Vercel auto-deployment started (check dashboard)

**OR** use Vercel CLI:

```powershell
# Backend
cd PrajaShakthi-VDP-Form-backend
vercel --prod

# Frontend  
cd ..\PrajaShakthi-VDP-Form-frontend
vercel --prod
```

- [ ] Backend deployed via CLI
- [ ] Frontend deployed via CLI

### Step 4: Wait for Deployment

- [ ] Backend deployment completed (green checkmark in Vercel)
- [ ] Frontend deployment completed (green checkmark in Vercel)

**Check at**: https://vercel.com/dashboard

### Step 5: Test Backend

**Test URL**: `https://praja-shakthi-vdp-form.vercel.app/api/health`

- [ ] Visited health endpoint
- [ ] Got response: `{"status":"ok"}`

**If not working**:
1. Check Vercel function logs
2. Verify environment variables are set
3. Try redeploying

### Step 6: Test Frontend

**Open your frontend URL**: `https://praja-shakthi-vdp-form-5aaz.vercel.app`

- [ ] Page loads successfully
- [ ] No errors in browser console (F12)
- [ ] Login page appears

**In Browser Console (F12), verify**:
- [ ] No CORS errors
- [ ] No "ERR_NETWORK" errors
- [ ] No "308 Permanent Redirect" errors
- [ ] No double slash URLs (`//api/...`)

### Step 7: Test Application Functionality

- [ ] Can login successfully
- [ ] Notifications load without errors
- [ ] Can view submission list
- [ ] Can submit new forms
- [ ] User management works (for admins)
- [ ] No console errors during usage

### Step 8: Verify Backend Logs

**Run**:
```powershell
vercel logs https://praja-shakthi-vdp-form.vercel.app
```

**Look for**:
- [ ] "🔐 CORS Allowed Origins: [...]" message
- [ ] List includes all your frontend URLs
- [ ] No "⚠️ CORS rejected origin" errors during normal usage

---

## 🐛 Troubleshooting

### If CORS Errors Still Occur:

**Action Plan**:
1. [ ] Check that CORS_ORIGIN environment variable is set
2. [ ] Verify NO SPACES between URLs in CORS_ORIGIN
3. [ ] Ensure all frontend URLs are in CORS_ORIGIN
4. [ ] Check backend logs for rejected origins
5. [ ] Redeploy backend after fixing CORS_ORIGIN
6. [ ] Clear browser cache and test again

**Get rejected origin from console**:
```
Look for: "Access to XMLHttpRequest at '...' from origin 'XXXXX' has been blocked"
The 'XXXXX' is the origin you need to add to CORS_ORIGIN
```

### If Double Slash URLs Occur:

**Action Plan**:
1. [ ] Check `.env.production` has NO trailing slash
2. [ ] Check VITE_API_URL in Vercel has NO trailing slash
3. [ ] Redeploy frontend
4. [ ] Hard refresh browser (Ctrl+Shift+R)

### If 308 Redirect Occurs:

**Action Plan**:
1. [ ] Verify VITE_API_URL is correct
2. [ ] Check vercel.json route configuration
3. [ ] Ensure no conflicting redirects in Vercel settings
4. [ ] Check browser Network tab for actual redirect

### If Environment Variables Don't Work:

**Action Plan**:
1. [ ] Verify variables are set for "Production" environment
2. [ ] Check variable names are EXACT (case-sensitive)
3. [ ] Redeploy after setting variables (REQUIRED!)
4. [ ] Use `vercel env ls` to list variables

---

## 📊 Success Criteria

✅ **Your deployment is successful when**:

1. Backend health endpoint returns `{"status":"ok"}`
2. Frontend loads with no console errors
3. Can login successfully
4. Notifications load and display
5. No CORS errors in console
6. No network errors in console
7. All features work as expected

---

## 🆘 Need Help?

### Quick Checks:
1. Environment variables set? → `vercel env ls`
2. Deployment successful? → Check Vercel dashboard
3. Correct URLs used? → Check FIX_SUMMARY.md

### Documentation:
- `FIX_SUMMARY.md` - Overview of all changes
- `CORS_FIX_GUIDE.md` - Detailed CORS troubleshooting
- `VERCEL_ENV_SETUP.md` - Environment variable guide

### Common Issues:
- **CORS errors** → Check CORS_ORIGIN includes all frontend URLs
- **308 redirect** → Remove trailing slashes from URLs
- **Env vars not working** → Redeploy after setting them
- **Double slashes** → Check .env.production has no trailing slash

---

## 📅 Completion

**Started**: _____________
**Environment Variables Set**: _____________
**Deployed**: _____________
**Tested**: _____________
**Completed**: _____________

**Status**: 
- [ ] In Progress
- [ ] Deployed, Testing
- [ ] ✅ Complete and Working

**Notes**:
_______________________________________
_______________________________________
_______________________________________

---

**Last Updated**: 2025-10-30
**Project**: PrajaShakthi VDP Form
