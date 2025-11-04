# API Configuration Architecture

## Before: Scattered Configuration ❌

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  UserManagement.jsx                                         │
│  ├─ API_URL = env.VITE_API_URL || localhost:5000           │
│  └─ calls: /api/users/...                                   │
│                                                              │
│  Profile.jsx                                                │
│  ├─ API_URL = env.VITE_API_URL || localhost:5000           │
│  └─ calls: /api/auth/...                                    │
│                                                              │
│  NotificationBell.jsx                                       │
│  ├─ API_URL = env.VITE_API_URL || localhost:5000           │
│  └─ calls: /api/notifications/...                           │
│                                                              │
│  ActivityLogs.jsx                                           │
│  ├─ API_URL = env.VITE_API_URL || localhost:5000           │
│  └─ calls: /api/activity-logs/...                           │
│                                                              │
│  NotificationsPage.jsx                                      │
│  ├─ API_URL = env.VITE_API_URL || localhost:5000           │
│  └─ calls: /api/notifications/...                           │
│                                                              │
│  api/auth.js                                                │
│  ├─ API_BASE = env.VITE_API_URL || ""                      │
│  └─ calls: /api/auth/..., /api/submissions/...             │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Issues:
❌ Duplicated configuration in every file
❌ Hard to maintain - changes needed in multiple places
❌ Prone to typos and inconsistencies
❌ Difficult to add new endpoints
```

---

## After: Centralized Configuration ✅

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────┐            │
│  │   src/config/api.js                        │            │
│  │   ═══════════════════════════════════════  │            │
│  │   API_BASE_URL = VITE_API_URL || localhost │            │
│  │                                             │            │
│  │   API_ENDPOINTS = {                        │            │
│  │     AUTH: { ... },                         │            │
│  │     USERS: { ... },                        │            │
│  │     SUBMISSIONS: { ... },                  │            │
│  │     NOTIFICATIONS: { ... },                │            │
│  │     ACTIVITY_LOGS: { ... }                 │            │
│  │   }                                        │            │
│  └────────────────────────────────────────────┘            │
│         ▲         ▲         ▲         ▲         ▲          │
│         │         │         │         │         │          │
│         │         │         │         │         │          │
│  ┌──────┴──┐ ┌───┴────┐ ┌──┴─────┐ ┌─┴──────┐ ┌┴──────┐  │
│  │ User    │ │Profile │ │Notif   │ │Activity│ │Notif  │  │
│  │Mgmt.jsx │ │.jsx    │ │Bell.jsx│ │Logs.jsx│ │Page   │  │
│  └─────────┘ └────────┘ └────────┘ └────────┘ └───────┘  │
│                                                              │
│  ┌──────────┐                                               │
│  │api/      │                                               │
│  │auth.js   │                                               │
│  └──────────┘                                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Benefits:
✅ Single source of truth
✅ Easy to maintain - one place to change
✅ Type-safe endpoints
✅ Autocomplete support
✅ Easy to add new endpoints
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Deployment Options                        │
└─────────────────────────────────────────────────────────────┘

Option 1: Vercel
═══════════════
┌──────────────┐     HTTPS     ┌──────────────┐
│   Frontend   │◄─────────────►│   Backend    │
│  Vercel App  │               │  Vercel App  │
└──────────────┘               └──────────────┘
     │                               │
     └─ VITE_API_URL ───────────────┘
        = https://backend.vercel.app


Option 2: Private Cloud VM
════════════════════════════
┌──────────────────────────────────────┐
│         VM: 192.168.1.100            │
│                                       │
│  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │   Backend    │ │
│  │  Nginx :80   │  │  Node :5000  │ │
│  └──────────────┘  └──────────────┘ │
│         │                 ▲          │
│         └─────────────────┘          │
│       VITE_API_URL                   │
│       = http://192.168.1.100:5000    │
└──────────────────────────────────────┘


Option 3: Docker Compose
═══════════════════════════
┌────────────────────────────────────────┐
│          Docker Network                │
│                                        │
│  ┌──────────────┐  ┌──────────────┐  │
│  │   Frontend   │  │   Backend    │  │
│  │  Container   │  │  Container   │  │
│  │    :3000     │  │    :5000     │  │
│  └──────────────┘  └──────────────┘  │
│         │                 ▲           │
│         └─────────────────┘           │
│       VITE_API_URL                    │
│       = http://backend:5000           │
└────────────────────────────────────────┘


Option 4: Production Server
═══════════════════════════════
Internet
    │
    ▼
┌──────────────────────────────────────┐
│      Load Balancer / Nginx           │
│      api.company.com                 │
└──────────────────────────────────────┘
    │                    │
    │ /                  │ /api
    ▼                    ▼
┌──────────┐      ┌──────────┐
│ Frontend │      │ Backend  │
│ Servers  │      │ Servers  │
└──────────┘      └──────────┘
     │                  ▲
     └──────────────────┘
   VITE_API_URL
   = https://api.company.com
```

---

## Environment Configuration Flow

```
Development:
═══════════
No .env file needed
    ↓
config/api.js uses default
    ↓
http://localhost:5000


Production (Vercel):
═══════════════════
Vercel Dashboard
    ↓
Set: VITE_API_URL=https://backend.vercel.app
    ↓
Build frontend
    ↓
config/api.js reads env var
    ↓
Uses production backend URL


Production (VM):
═══════════════
.env file in frontend:
VITE_API_URL=http://192.168.1.100:5000
    ↓
npm run build
    ↓
config/api.js reads env var
    ↓
Uses VM backend URL
```

---

## API Request Flow

```
User Action (Login)
    ↓
Component imports API_ENDPOINTS
    ↓
import { API_ENDPOINTS } from '../config/api'
    ↓
axios.post(API_ENDPOINTS.AUTH.LOGIN, {...})
    ↓
config/api.js returns full URL
    ↓
http://your-backend-url/api/auth/login
    ↓
Request sent to backend
    ↓
Response returned to component
```

---

## File Structure

```
PrajaShakthi-VDP-Form-frontend/
├── src/
│   ├── config/
│   │   └── api.js ◄─── SINGLE SOURCE OF TRUTH
│   │
│   ├── components/
│   │   ├── UserManagement.jsx ─┐
│   │   ├── Profile.jsx         │
│   │   ├── NotificationBell.jsx├─► Import from config/api.js
│   │   ├── ActivityLogs.jsx    │
│   │   └── NotificationsPage.jsx┘
│   │
│   └── api/
│       └── auth.js ─────────────► Import from config/api.js
│
└── .env
    └── VITE_API_URL=<backend-url>
```

---

## Benefits Summary

```
Before:                    After:
═══════                    ══════
6 files with              1 file with
API_URL config            API config
    │                         │
    ├─ Hard to maintain      ├─ Easy to maintain
    ├─ Typo-prone            ├─ Type-safe
    ├─ Inconsistent          ├─ Consistent
    └─ Scattered             └─ Centralized
        │                         │
        ▼                         ▼
    😫 Difficult              😊 Simple
```
