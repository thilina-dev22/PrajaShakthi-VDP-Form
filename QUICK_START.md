# ⚡ QUICK START - Fix CORS Issues Now!

## 🎯 TL;DR - Do This NOW

### 1️⃣ Set Backend Environment Variables (2 minutes)

**Go to**: https://vercel.com/dashboard → Backend Project → Settings → Environment Variables

**Add**:
```
MONGO_URI = <your-mongodb-connection>
JWT_SECRET = <random-32-char-string>
NODE_ENV = production
CORS_ORIGIN = https://praja-shakthi-vdp-form-5aaz.vercel.app,https://praja-shakthi-vdp-form-5aaz-git-main-thilinas-projects-98fabc7e.vercel.app
```

**Important**: 
- No spaces in CORS_ORIGIN
- No trailing slashes on URLs

### 2️⃣ Set Frontend Environment Variable (1 minute)

**Go to**: https://vercel.com/dashboard → Frontend Project → Settings → Environment Variables

**Add**:
```
VITE_API_URL = https://praja-shakthi-vdp-form.vercel.app
```

**Important**: No trailing slash!

### 3️⃣ Deploy (30 seconds)

**Option A - Git Push**:
```powershell
git add .
git commit -m "fix: CORS configuration"
git push
```

**Option B - Vercel CLI**:
```powershell
cd PrajaShakthi-VDP-Form-backend
vercel --prod

cd ..\PrajaShakthi-VDP-Form-frontend
vercel --prod
```

### 4️⃣ Test (1 minute)

1. Visit: `https://praja-shakthi-vdp-form.vercel.app/api/health`
   - Expected: `{"status":"ok"}` ✅

2. Visit your frontend URL
3. Press F12 (open console)
4. Login to your app
5. Check: No CORS errors ✅

---

## 🆘 Still Having Issues?

### CORS Error?
→ Add your frontend URL to `CORS_ORIGIN` in backend env vars
→ Redeploy backend

### Double Slash in URLs?
→ Check `VITE_API_URL` has NO trailing slash
→ Redeploy frontend

### 308 Redirect?
→ Clear browser cache (Ctrl + Shift + Delete)
→ Hard refresh (Ctrl + Shift + R)

### Environment Variables Not Working?
→ **YOU MUST REDEPLOY** after setting them!

---

## 📚 Need More Help?

**Read These**:
1. `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
2. `FIX_SUMMARY.md` - What was changed and why
3. `CORS_FIX_GUIDE.md` - Detailed troubleshooting
4. `VERCEL_ENV_SETUP.md` - Environment variable guide
5. `ARCHITECTURE_DIAGRAM.md` - Visual explanation

---

## ✅ Success Checklist

- [ ] Backend env vars set
- [ ] Frontend env vars set
- [ ] Code deployed
- [ ] Health endpoint returns OK
- [ ] Frontend loads without errors
- [ ] Can login
- [ ] Notifications work
- [ ] No CORS errors

---

**That's it!** Your CORS issues should be fixed. 🎉

If you still have problems after following these steps, check the detailed guides listed above.

**Last Updated**: 2025-10-30
