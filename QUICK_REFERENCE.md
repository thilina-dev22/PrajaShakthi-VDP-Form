# 🚀 Quick Reference - API Configuration

## ONE Environment Variable for All Deployments

```bash
VITE_API_URL=<your-backend-url>
```

## Examples

| Environment | VITE_API_URL |
|-------------|-------------|
| Local Dev | *(not needed, uses localhost:5000)* |
| Vercel | `https://your-backend.vercel.app` |
| VM/Private Cloud | `http://192.168.1.100:5000` |
| Production Server | `https://api.yourcompany.com` |
| Docker | `http://backend:5000` |

**Important:** NO trailing slash!

---

## Quick Deploy to VM

```bash
# 1. Backend
cd PrajaShakthi-VDP-Form-backend
nano .env  # Set MONGO_URI, JWT_SECRET, CORS_ORIGIN
npm install
pm2 start server.js --name backend
pm2 save

# 2. Frontend
cd PrajaShakthi-VDP-Form-frontend
nano .env  # Set VITE_API_URL=http://your-vm-ip:5000
npm install
npm run build
# Copy dist/* to /var/www/html/

# 3. Done!
```

---

## Verify Deployment

```bash
# Check backend
curl http://localhost:5000/api/health

# Check frontend
# Open browser → http://your-vm-ip
# F12 → Console → Should see "API Configuration: ..."
# Try login → Network tab → API calls should go to backend URL
```

---

## Files You Changed

- ✨ `src/config/api.js` - Central API config (NEW)
- 🔄 6 components updated to use it
- 📚 3 documentation files created

## Files You Need to Read

1. **`API_CENTRALIZATION_SUMMARY.md`** - Start here!
2. **`VM_DEPLOYMENT_GUIDE.md`** - For VM deployment
3. **`API_CONFIGURATION_GUIDE.md`** - Detailed reference

---

## Troubleshooting

**Problem:** API 404 errors  
**Fix:** Set `VITE_API_URL` in frontend environment

**Problem:** CORS errors  
**Fix:** Add frontend URL to backend `CORS_ORIGIN`

**Problem:** Can't connect to backend  
**Fix:** Check backend is running, firewall allows port

---

## That's It! 🎉

One environment variable. Works everywhere.
