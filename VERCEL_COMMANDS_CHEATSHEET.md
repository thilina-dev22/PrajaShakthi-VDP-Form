# ⚡ Vercel Deployment - Command Cheat Sheet

## Copy-Paste These Commands

### 1️⃣ Install Vercel CLI (First Time Only)
```powershell
npm install -g vercel
```

### 2️⃣ Login to Vercel
```powershell
vercel login
```

### 3️⃣ Deploy Backend
```powershell
cd C:\Users\thili\Development\prajashakthi\PrajaShakthi-VDP-Form\PrajaShakthi-VDP-Form-backend
vercel --prod
```

### 4️⃣ Deploy Frontend
```powershell
cd C:\Users\thili\Development\prajashakthi\PrajaShakthi-VDP-Form\PrajaShakthi-VDP-Form-frontend
vercel --prod
```

### 5️⃣ Test Backend
```powershell
# Replace with your actual backend URL
curl https://your-backend.vercel.app/api/health
```

---

## Environment Variables to Set

### Backend (Vercel Dashboard)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/prajashakthi
JWT_SECRET=your-super-secret-key-minimum-32-characters
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Frontend (Vercel Dashboard)
```
VITE_API_URL=https://your-backend.vercel.app
```

---

## Useful Commands

```powershell
# View deployments
vercel ls

# View logs
vercel logs [deployment-url]

# Pull environment variables
vercel env pull

# Remove deployment
vercel remove [deployment-name]

# Check project info
vercel inspect [deployment-url]
```

---

## Quick URLs

- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com

---

**Remember:** After setting env vars, always **REDEPLOY**!
