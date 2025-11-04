# ✅ Vercel Deployment Checklist

Print this and check off each step as you complete it!

---

## 🎯 Pre-Deployment

- [ ] Application tested on localhost - everything works
- [ ] MongoDB Atlas database created
- [ ] MongoDB Atlas network access: Allow from anywhere (0.0.0.0/0)
- [ ] Vercel account created at https://vercel.com
- [ ] Vercel CLI installed: `npm install -g vercel`
- [ ] Latest code committed to Git

---

## 🔧 Backend Deployment

### Step 1: Deploy Backend
- [ ] Navigate to backend folder
- [ ] Run `vercel login`
- [ ] Run `vercel` (preview deployment)
- [ ] Verify preview works
- [ ] Run `vercel --prod` (production deployment)
- [ ] **Copy and save backend URL:** ________________

### Step 2: Configure Backend Environment Variables
Go to: Vercel Dashboard → Backend Project → Settings → Environment Variables

- [ ] Add `MONGO_URI` = ____________________________
- [ ] Add `JWT_SECRET` = ____________________________
- [ ] Add `NODE_ENV` = `production`
- [ ] Add `CORS_ORIGIN` = (temporary, will update later)
- [ ] Click **Redeploy**

### Step 3: Verify Backend
- [ ] Test health endpoint: `curl https://[backend-url]/api/health`
- [ ] Response shows: `{"status":"ok"}`

---

## 🎨 Frontend Deployment

### Step 4: Deploy Frontend
- [ ] Navigate to frontend folder
- [ ] Run `vercel` (preview deployment)
- [ ] Verify preview works
- [ ] Run `vercel --prod` (production deployment)
- [ ] **Copy and save frontend URL:** ________________

### Step 5: Configure Frontend Environment Variable
Go to: Vercel Dashboard → Frontend Project → Settings → Environment Variables

- [ ] Add `VITE_API_URL` = [Your backend URL]
- [ ] NO trailing slash in URL
- [ ] Click **Redeploy**

### Step 6: Update Backend CORS
Go to: Vercel Dashboard → Backend Project → Settings → Environment Variables

- [ ] Update `CORS_ORIGIN` = [Your frontend URL]
- [ ] NO trailing slash
- [ ] NO spaces if multiple URLs
- [ ] Click **Redeploy**

---

## 🧪 Testing

### Step 7: Verify Deployment
- [ ] Open frontend URL in browser
- [ ] Open DevTools (F12) → Console
- [ ] See: `🔧 API Configuration: Base URL: [backend-url]`
- [ ] No errors in console
- [ ] Try to login (if super admin exists)
- [ ] Check Network tab - API calls go to backend URL
- [ ] No CORS errors

---

## 👤 Post-Deployment

### Step 8: Create Super Admin (if needed)
- [ ] Connect to production MongoDB
- [ ] Run create super admin script
- [ ] Or insert user manually in MongoDB Atlas
- [ ] Verify can login with super admin

### Step 9: Final Checks
- [ ] All features work (login, users, submissions, etc.)
- [ ] Notifications working
- [ ] Password reset working
- [ ] User management working
- [ ] Activity logs working
- [ ] Forms submission working

---

## 📝 Record Your Deployment

**Date Deployed:** ____________________

**Backend URL:**
```
https://_________________________________.vercel.app
```

**Frontend URL:**
```
https://_________________________________.vercel.app
```

**MongoDB Database:** ____________________

**Super Admin Username:** ____________________

**Super Admin Password:** ____________________ (Keep secure!)

---

## 🔐 Environment Variables Summary

### Backend Environment Variables:
```
MONGO_URI=_________________________________________________
JWT_SECRET=________________________________________________
NODE_ENV=production
CORS_ORIGIN=_______________________________________________
```

### Frontend Environment Variables:
```
VITE_API_URL=______________________________________________
```

---

## 🚨 Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Build fails | Test `npm run build` locally first |
| API 404 errors | Check `VITE_API_URL` is set, redeploy frontend |
| CORS errors | Check `CORS_ORIGIN` includes frontend URL, redeploy backend |
| Env vars not working | Must redeploy after changing env vars |
| Database connection fails | Check `MONGO_URI` and MongoDB network access |

---

## ✅ Deployment Complete!

- [ ] All steps completed
- [ ] All tests passed
- [ ] URLs documented
- [ ] Team notified
- [ ] Ready for use! 🎉

---

**Time to complete:** ~15-20 minutes

**Need detailed help?** See `VERCEL_DEPLOYMENT_COMPLETE_GUIDE.md`
