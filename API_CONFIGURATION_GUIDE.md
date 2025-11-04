# Centralized API Configuration Guide

## Overview

All API URLs are now centralized in a single configuration file: `src/config/api.js`

This makes it much easier to deploy the application on different servers (Vercel, private cloud, VM, etc.) because you only need to set **ONE environment variable** and all API calls will automatically use the correct backend URL.

## 📁 File Location

```
PrajaShakthi-VDP-Form-frontend/
  └── src/
      └── config/
          └── api.js  ← Single source of truth for all API endpoints
```

## 🔧 Configuration

### Environment Variable (Required for Production)

Set this **ONE** environment variable based on your deployment:

| Deployment Type | Variable | Example Value |
|----------------|----------|---------------|
| **Local Development** | Not needed | Uses default `http://localhost:5000` |
| **Vercel** | `VITE_API_URL` | `https://your-backend.vercel.app` |
| **Private Cloud VM** | `VITE_API_URL` | `http://192.168.1.100:5000` |
| **Company Server** | `VITE_API_URL` | `https://api.yourcompany.com` |
| **Docker/Container** | `VITE_API_URL` | `http://backend-service:5000` |

**Important:** NO trailing slash!

### Setting Environment Variable

#### For Vercel:
1. Go to Vercel Dashboard → Frontend Project
2. Settings → Environment Variables
3. Add: `VITE_API_URL` = `https://your-backend-url.com`
4. Redeploy

#### For Private Cloud/VM:
1. Create `.env` file in frontend root:
   ```bash
   VITE_API_URL=http://your-vm-ip:5000
   ```

2. Or set system environment variable:
   ```bash
   # Linux/Mac
   export VITE_API_URL=http://your-server:5000
   
   # Windows PowerShell
   $env:VITE_API_URL="http://your-server:5000"
   ```

#### For Docker:
```yaml
# docker-compose.yml
services:
  frontend:
    environment:
      - VITE_API_URL=http://backend:5000
```

## 📝 Usage in Components

All components now import from the centralized config:

```javascript
// Import the centralized API configuration
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

// Use predefined endpoints
axios.get(API_ENDPOINTS.USERS.BASE);
axios.put(API_ENDPOINTS.USERS.RESET_PASSWORD(userId), { newPassword });
axios.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
```

## 🔗 Available Endpoints

### Authentication
```javascript
API_ENDPOINTS.AUTH.LOGIN          // POST /api/auth/login
API_ENDPOINTS.AUTH.LOGOUT         // POST /api/auth/logout
API_ENDPOINTS.AUTH.REGISTER       // POST /api/auth/register
API_ENDPOINTS.AUTH.STATUS         // GET  /api/auth/status
API_ENDPOINTS.AUTH.RESET_PASSWORD // PUT  /api/auth/reset-password
```

### Users
```javascript
API_ENDPOINTS.USERS.BASE                    // /api/users
API_ENDPOINTS.USERS.BY_ID(id)              // /api/users/:id
API_ENDPOINTS.USERS.RESET_PASSWORD(id)     // /api/users/:id/reset-password
API_ENDPOINTS.USERS.LOGS                   // /api/users/logs
```

### Submissions
```javascript
API_ENDPOINTS.SUBMISSIONS.BASE      // /api/submissions
API_ENDPOINTS.SUBMISSIONS.BY_ID(id) // /api/submissions/:id
```

### Notifications
```javascript
API_ENDPOINTS.NOTIFICATIONS.BASE               // /api/notifications
API_ENDPOINTS.NOTIFICATIONS.BY_ID(id)         // /api/notifications/:id
API_ENDPOINTS.NOTIFICATIONS.READ(id)          // /api/notifications/:id/read
API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT      // /api/notifications/unread-count
API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ     // /api/notifications/mark-all-read
API_ENDPOINTS.NOTIFICATIONS.CLEAR_READ        // /api/notifications/clear-read
```

### Activity Logs
```javascript
API_ENDPOINTS.ACTIVITY_LOGS.BASE    // /api/activity-logs
API_ENDPOINTS.ACTIVITY_LOGS.EXPORT  // /api/activity-logs/export
```

### Health Check
```javascript
API_ENDPOINTS.HEALTH  // /api/health
```

## 🎯 Components Updated

All these components now use the centralized configuration:

- ✅ `UserManagement.jsx`
- ✅ `Profile.jsx`
- ✅ `NotificationBell.jsx`
- ✅ `ActivityLogs.jsx`
- ✅ `NotificationsPage.jsx`
- ✅ `auth.js` (API utility)

## 🚀 Deployment Scenarios

### Scenario 1: Deploying to Company Private Cloud

```bash
# On your VM/Server
cd PrajaShakthi-VDP-Form-frontend

# Set the environment variable
export VITE_API_URL=http://your-company-server:5000

# Build the frontend
npm run build

# Deploy the dist folder to your web server
```

### Scenario 2: Deploying to Vercel

```bash
# Set in Vercel Dashboard:
VITE_API_URL=https://your-backend.vercel.app

# Deploy will automatically use this
vercel deploy --prod
```

### Scenario 3: Docker Deployment

```dockerfile
# Dockerfile for frontend
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build
```

```bash
# Build with backend URL
docker build --build-arg VITE_API_URL=http://backend:5000 -t frontend .
```

## 🔍 Debugging

### Check Current API URL

In development mode, the API configuration logs to console:

```javascript
🔧 API Configuration:
  Base URL: http://localhost:5000
  Environment: development
```

### Manual Check

Open browser console and run:

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

### Verify Endpoints

Check what endpoint a component is using (in development):

```javascript
// UserManagement component logs this:
console.log('Reset password API endpoint:', API_ENDPOINTS.USERS.RESET_PASSWORD(userId));
```

## ✨ Benefits

### Before (Decentralized)
```javascript
// In UserManagement.jsx
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

// In Profile.jsx
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

// In NotificationBell.jsx
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

// ... repeated in every component 😓
```

### After (Centralized) ✅
```javascript
// In config/api.js (ONCE!)
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

// In ALL components
import { API_ENDPOINTS } from '../config/api';
```

**Advantages:**
- ✅ Single source of truth
- ✅ Easier to maintain
- ✅ Consistent across all components
- ✅ Easy to add new endpoints
- ✅ Type-safe endpoint construction
- ✅ Prevents typos in URL paths
- ✅ Better for team collaboration
- ✅ Easier debugging

## 📋 Checklist for Deployment

### Pre-Deployment
- [ ] Backend is deployed and accessible
- [ ] Note the backend URL (e.g., `https://backend.yourcompany.com`)
- [ ] Ensure NO trailing slash in URL

### Frontend Configuration
- [ ] Set `VITE_API_URL` environment variable to backend URL
- [ ] Verify environment variable is set correctly
- [ ] Build frontend: `npm run build`

### Post-Deployment
- [ ] Test login functionality
- [ ] Test API calls in browser Network tab
- [ ] Verify all requests go to correct backend URL
- [ ] Check browser console for errors
- [ ] Test password reset feature
- [ ] Test notifications
- [ ] Test user management

### Troubleshooting
If API calls fail:
1. Check browser Network tab - where are requests going?
2. Verify `VITE_API_URL` is set in deployment environment
3. Check backend is accessible from frontend server
4. Verify CORS settings on backend allow frontend domain
5. Check backend logs for errors

## 🔒 Security Notes

- Never commit `.env` file with production URLs
- Use environment variables for all deployments
- Backend URL should use HTTPS in production
- Ensure backend CORS settings match frontend domain

## 📚 Related Documentation

- `VERCEL_ENV_SETUP.md` - Vercel deployment guide
- `PASSWORD_RESET_404_FIX.md` - Original issue that led to this improvement
- `DEPLOYMENT_INSTRUCTIONS.md` - General deployment guide
