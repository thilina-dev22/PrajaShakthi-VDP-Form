# Architecture & CORS Fix Visualization

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  https://praja-shakthi-vdp-form-5aaz.vercel.app                │
│  https://...-git-main-thilinas-projects-98fabc7e.vercel.app   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ API Requests
                         │ (with credentials)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CORS MIDDLEWARE                              │
│                  (Backend - server.js)                          │
│                                                                 │
│  1. Check if origin is in allowedOrigins[]                     │
│  2. If yes → Allow request + Send CORS headers                 │
│  3. If no → Reject with CORS error                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Allowed
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND SERVER                              │
│                                                                 │
│  https://praja-shakthi-vdp-form.vercel.app                     │
│                                                                 │
│  Routes:                                                        │
│  • /api/health                                                  │
│  • /api/auth/*                                                  │
│  • /api/users/*                                                 │
│  • /api/notifications/*                                         │
│  • /api/submissions/*                                           │
│  • /api/activity-logs/*                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Database Queries
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MONGODB ATLAS                               │
│                                                                 │
│  Collections:                                                   │
│  • users                                                        │
│  • submissions                                                  │
│  • notifications                                                │
│  • activitylogs                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❌ BEFORE THE FIX - Problems

### Problem 1: CORS Error
```
┌──────────────┐          ┌──────────────┐
│   Frontend   │─────X───▶│   Backend    │
│ (Vercel URL) │          │ (Vercel URL) │
└──────────────┘          └──────────────┘
                ▲
                │
                └─ Error: "No 'Access-Control-Allow-Origin' header"
```

**Why?** Backend's CORS configuration didn't include the frontend URL.

### Problem 2: Double Slash in URL
```
Incorrect URL Construction:
https://praja-shakthi-vdp-form.vercel.app/ + /api/notifications
                                           ↑   ↑
                                    Trailing slash + Leading slash = //
Result: https://praja-shakthi-vdp-form.vercel.app//api/notifications
                                                  ↑↑
                                           Double slash causes 308 redirect
```

### Problem 3: Missing Frontend URLs
```
Backend allowedOrigins = [
  "http://localhost:5173",     ✅ Local dev
  "http://localhost:5174",     ✅ Local dev
]

Frontend requests from:
  "https://praja-shakthi-vdp-form-5aaz.vercel.app"  ❌ Not in list!
  "https://...-git-main-...vercel.app"               ❌ Not in list!

Result: CORS blocks all production requests
```

---

## ✅ AFTER THE FIX - Solution

### Solution 1: Enhanced CORS Configuration
```javascript
Backend server.js:

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://praja-shakthi-vdp-form-5aaz.vercel.app",                    ✅
  "https://...-git-main-thilinas-projects-98fabc7e.vercel.app",       ✅
];

// PLUS: Dynamic origins from environment variable
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(...process.env.CORS_ORIGIN.split(','));         ✅
}
```

**Flow**:
```
┌──────────────┐          ┌──────────────┐
│   Frontend   │─────✓───▶│   Backend    │
│ (Vercel URL) │          │ (Vercel URL) │
└──────────────┘          └──────────────┘
                ▲
                │
                └─ Success: CORS headers sent ✅
```

### Solution 2: Fixed URL Construction
```javascript
// .env.production - NO trailing slash
VITE_API_URL=https://praja-shakthi-vdp-form.vercel.app
                                                      ↑
                                              No slash here!

// auth.js - Already strips trailing slashes
const API_BASE = import.meta.env.VITE_API_URL.replace(/\/$/, "");

Result: 
https://praja-shakthi-vdp-form.vercel.app + /api/notifications ✅
                                          ↑ ↑
                                    No trailing + Leading = Single slash
```

### Solution 3: Comprehensive CORS Headers
```javascript
// vercel.json - Added CORS headers
{
  "headers": [{
    "source": "/api/(.*)",
    "headers": [
      { "key": "Access-Control-Allow-Credentials", "value": "true" },  ✅
      { "key": "Access-Control-Allow-Origin", "value": "*" },          ✅
      { "key": "Access-Control-Allow-Methods", "value": "..." },       ✅
      { "key": "Access-Control-Allow-Headers", "value": "..." }        ✅
    ]
  }]
}
```

---

## 🔄 Request Flow (After Fix)

### Successful API Request:

```
1. User Action (Frontend)
   └─▶ Click "View Notifications"

2. API Call Construction
   ├─▶ Base URL: https://praja-shakthi-vdp-form.vercel.app
   ├─▶ Endpoint: /api/notifications/unread-count
   └─▶ Full URL: https://praja-shakthi-vdp-form.vercel.app/api/notifications/unread-count ✅

3. Preflight Request (OPTIONS)
   ├─▶ Browser sends OPTIONS request
   ├─▶ Backend checks origin in allowedOrigins
   ├─▶ Origin found → Send CORS headers ✅
   └─▶ Browser receives OK response

4. Actual Request (GET)
   ├─▶ Browser sends GET request
   ├─▶ Backend processes request
   ├─▶ Backend sends response with CORS headers ✅
   └─▶ Browser receives data

5. Frontend Updates
   └─▶ Notification count displayed ✅
```

---

## 🔐 Environment Variables Flow

### Backend Environment Variables:
```
Vercel Dashboard
     │
     ├─▶ MONGO_URI ────────────────▶ MongoDB connection
     ├─▶ JWT_SECRET ───────────────▶ Token encryption
     ├─▶ NODE_ENV=production ──────▶ Production mode
     └─▶ CORS_ORIGIN ──────────────▶ Additional allowed origins
                                     │
                                     └─▶ Merged with hardcoded origins
```

### Frontend Environment Variables:
```
Vercel Dashboard
     │
     └─▶ VITE_API_URL ─────────────▶ Backend URL
                                     │
                                     └─▶ Used in all API calls
```

---

## 📊 Debug Flow

### How to Debug CORS Issues:

```
1. Check Browser Console (F12)
   ├─▶ CORS error? → Check backend CORS config
   ├─▶ 308 redirect? → Check for double slashes
   ├─▶ ERR_NETWORK? → Check backend is running
   └─▶ 500 error? → Check backend logs

2. Check Backend Logs
   └─▶ vercel logs <url>
       ├─▶ Look for: "🔐 CORS Allowed Origins: [...]"
       ├─▶ Look for: "⚠️ CORS rejected origin: ..."
       └─▶ Verify your frontend URL is in the list

3. Check Network Tab (F12)
   ├─▶ Click on failed request
   ├─▶ Check Request URL (double slash?)
   ├─▶ Check Request Headers (correct origin?)
   └─▶ Check Response Headers (CORS headers present?)

4. Verify Environment Variables
   └─▶ vercel env ls
       ├─▶ CORS_ORIGIN set?
       ├─▶ VITE_API_URL set?
       └─▶ Values correct?
```

---

## 🎯 Key Takeaways

### URLs Must Be Exact:
```
✅ GOOD: https://praja-shakthi-vdp-form.vercel.app
❌ BAD:  https://praja-shakthi-vdp-form.vercel.app/
                                                  ↑
                                          Trailing slash causes issues
```

### CORS_ORIGIN Format:
```
✅ GOOD: url1,url2,url3
❌ BAD:  url1, url2, url3  (spaces)
❌ BAD:  url1,url2,url3,   (trailing comma)
```

### All Frontend URLs Must Be Listed:
```
Vercel creates multiple URLs:
✅ Production: https://project-name.vercel.app
✅ Git Branch: https://project-name-git-branch-user.vercel.app
✅ Deployment: https://project-name-hash.vercel.app

ALL must be in CORS configuration!
```

---

**Visual Guide Created**: 2025-10-30
**Project**: PrajaShakthi VDP Form
