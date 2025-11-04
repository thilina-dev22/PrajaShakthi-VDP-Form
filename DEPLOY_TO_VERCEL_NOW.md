# 🚀 Quick Start - Deploy to Vercel NOW

## Step-by-Step Commands (Copy & Paste)

### 1️⃣ Install Vercel CLI (if not installed)

```powershell
npm install -g vercel
```

---

### 2️⃣ Deploy Backend

```powershell
# Navigate to backend
cd C:\Users\thili\Development\prajashakthi\PrajaShakthi-VDP-Form\PrajaShakthi-VDP-Form-backend

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Answer the prompts:
# Set up and deploy? Y
# Project name: prajashakthi-backend
# Directory: ./
# Modify settings? N

# Deploy to production
vercel --prod
```

**✅ Save the backend URL!** It will look like: `https://prajashakthi-backend.vercel.app`

---

### 3️⃣ Set Backend Environment Variables

Go to: https://vercel.com/dashboard

1. Select your **backend project** (prajashakthi-backend)
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | `your-super-secret-key-minimum-32-characters` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `https://yourfrontend.vercel.app` (update after frontend deploy) |

4. Click **Redeploy** after adding all variables

---

### 4️⃣ Test Backend

```powershell
# Replace with your actual backend URL
curl https://your-backend-url.vercel.app/api/health
```

Expected response: `{"status":"ok"}`

---

### 5️⃣ Deploy Frontend

```powershell
# Navigate to frontend
cd C:\Users\thili\Development\prajashakthi\PrajaShakthi-VDP-Form\PrajaShakthi-VDP-Form-frontend

# Deploy to preview
vercel

# Answer the prompts:
# Set up and deploy? Y
# Project name: prajashakthi-frontend
# Directory: ./
# Modify settings? N

# Deploy to production
vercel --prod
```

**✅ Save the frontend URL!** It will look like: `https://prajashakthi-frontend.vercel.app`

---

### 6️⃣ Set Frontend Environment Variable

Go to: https://vercel.com/dashboard

1. Select your **frontend project** (prajashakthi-frontend)
2. Go to **Settings** → **Environment Variables**
3. Add this variable:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-backend-url.vercel.app` (NO trailing slash) |

4. Click **Redeploy**

---

### 7️⃣ Update Backend CORS

1. Go back to **backend project** → **Settings** → **Environment Variables**
2. Update `CORS_ORIGIN` value:
   ```
   https://your-frontend-url.vercel.app
   ```
3. Click **Save**
4. Click **Redeploy**

---

### 8️⃣ Test Everything

Open your frontend URL: `https://your-frontend-url.vercel.app`

- ✅ Page loads
- ✅ No CORS errors in console (F12)
- ✅ API calls go to backend URL
- ✅ Login works (if super admin exists)

---

## 🎯 Summary of URLs

After deployment, you'll have:

```
Backend:  https://prajashakthi-backend-[hash].vercel.app
Frontend: https://prajashakthi-frontend-[hash].vercel.app
```

### Environment Variables Set:

**Backend:**
- `MONGO_URI` → Your MongoDB connection
- `JWT_SECRET` → Your secret key
- `NODE_ENV` → `production`
- `CORS_ORIGIN` → Your frontend URL

**Frontend:**
- `VITE_API_URL` → Your backend URL

---

## ⚡ Quick Troubleshooting

### Issue: Build fails
```powershell
# Test build locally first
npm run build
```

### Issue: 404 on API calls
- Check `VITE_API_URL` is set in frontend
- Redeploy frontend after setting env var

### Issue: CORS errors
- Check `CORS_ORIGIN` includes frontend URL
- No spaces, no trailing slashes
- Redeploy backend after updating

### Issue: Environment variables not working
- Must REDEPLOY after changing env vars
- Vercel reads them at build time

---

## 📞 Need Help?

See the complete guide: **`VERCEL_DEPLOYMENT_COMPLETE_GUIDE.md`**

---

**Ready? Start with Step 1! 🚀**

Total time: ~15 minutes
