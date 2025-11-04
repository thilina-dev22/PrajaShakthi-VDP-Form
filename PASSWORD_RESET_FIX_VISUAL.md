# Password Reset API Call - Before vs After Fix

## The Issue Visualized

### Before Fix ❌
```
Frontend (deployed): https://praja-shakthi-vdp-form-5aaz.vercel.app
Backend (deployed):  https://praja-shakthi-vdp-form.vercel.app

VITE_API_URL in Vercel: https://praja-shakthi-vdp-form-5aaz.vercel.app (WRONG!)

Password Reset API Call:
PUT https://praja-shakthi-vdp-form-5aaz.vercel.app/api/users/69098d4/reset-password
                        ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                        FRONTEND URL - Has no backend API!
                        
Result: 404 Not Found ❌
```

### After Fix ✅
```
Frontend (deployed): https://praja-shakthi-vdp-form-5aaz.vercel.app
Backend (deployed):  https://praja-shakthi-vdp-form.vercel.app

VITE_API_URL in Vercel: https://praja-shakthi-vdp-form.vercel.app (CORRECT!)

Password Reset API Call:
PUT https://praja-shakthi-vdp-form.vercel.app/api/users/69098d4/reset-password
                   ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                   BACKEND URL - Has the API!
                        
Result: 200 OK ✅
```

## Why It Worked Locally

In local development:
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000

VITE_API_URL (local): http://localhost:5000 ✅

Password Reset API Call:
PUT http://localhost:5000/api/users/69098d4/reset-password
          ↑↑↑↑↑↑↑↑↑
          Backend port - Correct!
```

## The Fix

### 1. Code Changes (Done ✅)
Made API URL configuration more robust across all components:

```javascript
// Old pattern (less safe)
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

// New pattern (more robust)
const API_BASE = (import.meta.env && import.meta.env.VITE_API_URL
    ? String(import.meta.env.VITE_API_URL)
    : "http://localhost:5000").replace(/\/+$/, '');
const API_URL = API_BASE;
```

### 2. Vercel Configuration (You Need to Do ⚠️)

**Step 1:** Find your backend URL
- Go to Vercel Dashboard
- Open backend project
- Copy URL (e.g., `https://praja-shakthi-vdp-form.vercel.app`)

**Step 2:** Update frontend environment variable
- Go to Vercel Dashboard
- Open frontend project
- Settings → Environment Variables
- Update `VITE_API_URL` to your backend URL
- NO trailing slash!

**Step 3:** Redeploy
- Must redeploy frontend after changing env vars
- Deployments → Redeploy latest

## How Other APIs Work

All these APIs should use the same backend URL:

```
GET  /api/users              → Fetch users
POST /api/users              → Create user
PUT  /api/users/:id          → Update user
PUT  /api/users/:id/reset-password  → Reset password ← This was broken
DELETE /api/users/:id        → Delete user

GET  /api/notifications      → Get notifications
PUT  /api/notifications/:id/read  → Mark as read

GET  /api/submissions        → Get submissions
```

All must point to: `https://praja-shakthi-vdp-form.vercel.app` (your backend URL)

## Quick Test

After fixing and redeploying, open browser console on live site:

```javascript
// Check what API URL is being used
console.log('API URL:', import.meta.env.VITE_API_URL);

// Should show your backend URL
// NOT your frontend URL!
```
