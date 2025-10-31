# Vercel Environment Variables Setup

## ⚠️ CRITICAL: Set these in Vercel Dashboard BEFORE deploying

### Backend Project Environment Variables
**Location**: Vercel Dashboard → Backend Project → Settings → Environment Variables

| Variable Name | Example Value | Required | Notes |
|--------------|---------------|----------|-------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` | ✅ Yes | Your MongoDB connection string |
| `JWT_SECRET` | `your-super-secret-key-here-min-32-chars` | ✅ Yes | Strong random string (32+ characters) |
| `NODE_ENV` | `production` | ✅ Yes | Set to "production" |
| `CORS_ORIGIN` | `https://praja-shakthi-vdp-form-5aaz.vercel.app,https://praja-shakthi-vdp-form-5aaz-git-main-thilinas-projects-98fabc7e.vercel.app` | ✅ Yes | Comma-separated frontend URLs (NO SPACES, NO TRAILING SLASHES) |
| `PORT` | `5000` | ❌ No | Optional, defaults to 5000 |

### Frontend Project Environment Variables
**Location**: Vercel Dashboard → Frontend Project → Settings → Environment Variables

| Variable Name | Example Value | Required | Notes |
|--------------|---------------|----------|-------|
| `VITE_API_URL` | `https://praja-shakthi-vdp-form.vercel.app` | ✅ Yes | Your backend URL (NO TRAILING SLASH) |

---

## 🎯 Quick Setup Checklist

### Backend Setup:
- [ ] Create/Open backend project in Vercel
- [ ] Go to Settings → Environment Variables
- [ ] Add `MONGO_URI` (get from MongoDB Atlas)
- [ ] Add `JWT_SECRET` (generate a strong random string)
- [ ] Add `NODE_ENV` = `production`
- [ ] Add `CORS_ORIGIN` with ALL frontend URLs
- [ ] Click "Save"
- [ ] Redeploy if needed

### Frontend Setup:
- [ ] Create/Open frontend project in Vercel
- [ ] Go to Settings → Environment Variables
- [ ] Add `VITE_API_URL` = Your backend URL
- [ ] Ensure NO trailing slash
- [ ] Click "Save"
- [ ] Redeploy if needed

---

## 🔧 How to Set Environment Variables in Vercel

### Method 1: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Select your project (Backend or Frontend)
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar
5. Add each variable:
   - Enter Variable Name
   - Enter Variable Value
   - Select Environment: Production, Preview, Development (or all)
   - Click "Add"
6. After adding all variables, redeploy your project

### Method 2: Vercel CLI
```bash
# Set a single environment variable
vercel env add VARIABLE_NAME

# Example for backend:
cd PrajaShakthi-VDP-Form-backend
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add CORS_ORIGIN
vercel env add NODE_ENV

# Example for frontend:
cd PrajaShakthi-VDP-Form-frontend
vercel env add VITE_API_URL
```

### Method 3: Import from .env file
```bash
# In your project directory
vercel env pull .env.production
# Edit the file, then:
vercel env push .env.production
```

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T:
- Add trailing slashes: `https://example.com/` ❌
- Add spaces in CORS_ORIGIN: `url1, url2, url3` ❌
- Forget to redeploy after changing env vars
- Use weak JWT secrets like "secret" or "12345"
- Expose JWT_SECRET in frontend code

### ✅ DO:
- Use clean URLs: `https://example.com` ✅
- No spaces in CORS_ORIGIN: `url1,url2,url3` ✅
- Redeploy after every env variable change
- Generate strong random JWT secrets (32+ characters)
- Keep secrets only in backend

---

## 🔐 Generating a Secure JWT Secret

### Option 1: Node.js
```javascript
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Option 2: OpenSSL
```bash
openssl rand -hex 64
```

### Option 3: Online (use with caution)
Visit: https://www.uuidgenerator.net/api/guid

---

## 📋 Example Complete Setup

### Backend Environment Variables:
```
MONGO_URI=mongodb+srv://admin:MyPassword123@cluster0.abcdef.mongodb.net/prajashakthi?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
NODE_ENV=production
CORS_ORIGIN=https://praja-shakthi-vdp-form-5aaz.vercel.app,https://praja-shakthi-vdp-form-5aaz-git-main-thilinas-projects-98fabc7e.vercel.app
```

### Frontend Environment Variables:
```
VITE_API_URL=https://praja-shakthi-vdp-form.vercel.app
```

---

## 🔄 After Setting Environment Variables

### You MUST redeploy for changes to take effect:

#### Option 1: Git Push (triggers auto-deploy)
```bash
git add .
git commit -m "Update configuration"
git push
```

#### Option 2: Vercel Dashboard
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

#### Option 3: Vercel CLI
```bash
vercel --prod
```

---

## 🐛 Troubleshooting

### Variables not working after setting them?
→ **Solution**: Redeploy the project

### CORS errors persist?
→ **Solution**: Check CORS_ORIGIN has ALL frontend URLs (including git branch URLs)

### Frontend can't reach backend?
→ **Solution**: Verify VITE_API_URL is correct and has NO trailing slash

### Backend returning 500 errors?
→ **Solution**: Check Vercel logs: `vercel logs <deployment-url>`

### How to view current environment variables?
```bash
vercel env ls
```

### How to remove an environment variable?
```bash
vercel env rm VARIABLE_NAME
```

---

## 📞 Need Help?

1. Check Vercel logs: https://vercel.com/docs/concepts/deployments/logs
2. Verify environment variables: `vercel env ls`
3. Check function logs: Dashboard → Deployments → Click deployment → Functions tab
4. Review CORS_FIX_GUIDE.md in project root

---

**Last Updated**: 2025-10-30
**Project**: PrajaShakthi VDP Form
