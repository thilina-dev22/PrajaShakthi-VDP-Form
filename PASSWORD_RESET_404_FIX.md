# Password Reset 404 Error Fix

## Problem
The password reset endpoint was returning a 404 error in production (Vercel), but working fine locally:
```
PUT https://praja-shakthi-vdp-form.vercel.app/api/users/{userId}/reset-password 404 (Not Found)
```

## Root Cause
The issue was that the frontend was calling the **frontend URL** instead of the **backend URL** for the API. This happened because:

1. The `VITE_API_URL` environment variable in Vercel might not be set correctly
2. The API URL construction pattern was inconsistent across components

## Solution Applied

### 1. Updated API URL Configuration
Changed all components to use a more robust API URL configuration pattern (matching `auth.js`):

**Before:**
```javascript
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
```

**After:**
```javascript
const API_BASE = (import.meta.env && import.meta.env.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL)
    : "http://localhost:5000").replace(/\/+$/, '');
const API_URL = API_BASE;
```

### 2. Added Better Error Handling
Enhanced the `handleResetUserPassword` function with:
- Proper error logging
- Content-Type headers
- Better error messages
- Debug logging in development mode

### 3. Files Updated
- ✅ `UserManagement.jsx` - Main fix for password reset
- ✅ `Profile.jsx` - Consistency update
- ✅ `NotificationBell.jsx` - Consistency update
- ✅ `ActivityLogs.jsx` - Consistency update
- ✅ `NotificationsPage.jsx` - Consistency update

## Required Actions in Vercel

### ⚠️ CRITICAL: Verify Environment Variables

Go to **Vercel Dashboard → Frontend Project → Settings → Environment Variables** and ensure:

| Variable | Required Value | Current Status |
|----------|---------------|----------------|
| `VITE_API_URL` | `https://praja-shakthi-vdp-form.vercel.app` (Backend URL) | ❓ CHECK THIS |

### Common Mistakes
❌ **WRONG:** `https://praja-shakthi-vdp-form-5aaz.vercel.app` (Frontend URL)  
✅ **CORRECT:** `https://praja-shakthi-vdp-form.vercel.app` (Backend URL)

The backend URL should point to where your `PrajaShakthi-VDP-Form-backend` is deployed.

### Steps to Fix in Vercel

1. **Check Current Backend URL:**
   - Go to Vercel Dashboard
   - Open your **backend project** (PrajaShakthi-VDP-Form-backend)
   - Copy the deployment URL (e.g., `https://praja-shakthi-vdp-form.vercel.app`)

2. **Update Frontend Environment Variable:**
   - Go to Vercel Dashboard
   - Open your **frontend project** (PrajaShakthi-VDP-Form-frontend)
   - Go to Settings → Environment Variables
   - Find `VITE_API_URL`
   - Update it to your backend URL (without trailing slash)
   - Save the changes

3. **Redeploy Frontend:**
   - After changing the environment variable, you MUST redeploy
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - OR push a new commit to trigger deployment

## Verification Steps

After deploying the fix:

1. **Open Browser Console** on the live site
2. **Check the API URL** - In development, you'll see: `UserManagement API_URL: <url>`
3. **Test Password Reset** on a user
4. **Check Network Tab** - The request should go to your backend URL, not frontend URL

### Expected Behavior
✅ **Correct Request:**
```
PUT https://praja-shakthi-vdp-form.vercel.app/api/users/{userId}/reset-password
```

❌ **Wrong Request (before fix):**
```
PUT https://praja-shakthi-vdp-form-5aaz.vercel.app/api/users/{userId}/reset-password
```

## Testing Checklist

- [ ] Verify `VITE_API_URL` is set to backend URL in Vercel
- [ ] Redeploy frontend after environment variable change
- [ ] Test password reset on production
- [ ] Check browser console for any errors
- [ ] Verify request goes to correct backend URL in Network tab
- [ ] Test other API calls (notifications, users, etc.) to ensure they still work

## Additional Notes

### Why This Works
- More explicit type conversion with `String()`
- Checks for both `import.meta.env` existence and `VITE_API_URL` value
- Consistent pattern across all components
- Better error handling and logging

### Backend Route Configuration
The backend route is correctly configured in `userRoutes.js`:
```javascript
router.put('/:id/reset-password', protect, adminOnly, resetUserPassword);
```

Mounted at `/api/users` in `server.js`, making the full endpoint:
```
/api/users/:id/reset-password
```

## Troubleshooting

### If still getting 404:
1. Check browser console for the actual URL being called
2. Verify backend is deployed and accessible
3. Check CORS settings in backend match frontend URL
4. Ensure backend route is correctly mounted
5. Check Vercel deployment logs for errors

### Quick Debug:
Add this to browser console on the live site:
```javascript
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
```

If it shows `undefined` or the wrong URL, the environment variable is not set correctly in Vercel.
