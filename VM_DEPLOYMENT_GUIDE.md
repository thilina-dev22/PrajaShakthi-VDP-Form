# 🚀 Quick Deployment Guide - Private Cloud VM

## Step-by-Step Deployment to Company Private Cloud/VM

### Prerequisites
- Backend server deployed and accessible
- Frontend build tools installed (Node.js, npm)
- Web server (Nginx, Apache, or similar) configured

---

## 1️⃣ Backend Deployment

### Deploy Backend to VM

```bash
# SSH into your VM
ssh user@your-vm-ip

# Clone or copy backend code
cd /path/to/deployment
git clone <repo-url> or scp -r PrajaShakthi-VDP-Form-backend

# Navigate to backend
cd PrajaShakthi-VDP-Form-backend

# Install dependencies
npm install

# Create .env file
nano .env
```

### Backend .env Configuration

```env
# MongoDB connection
MONGO_URI=mongodb://localhost:27017/prajashakthi
# Or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/prajashakthi

# Security
JWT_SECRET=your-super-secret-key-min-32-characters-long

# Environment
NODE_ENV=production

# Port
PORT=5000

# CORS - Your frontend URL(s)
CORS_ORIGIN=http://your-vm-ip:3000,https://your-domain.com
```

### Start Backend

```bash
# Using PM2 (recommended for production)
npm install -g pm2
pm2 start server.js --name prajashakthi-backend
pm2 save
pm2 startup

# Or using node directly
node server.js

# Or using systemd service (better for production)
# Create service file: /etc/systemd/system/prajashakthi-backend.service
```

**Backend will run on:** `http://your-vm-ip:5000`

---

## 2️⃣ Frontend Deployment

### Configure Frontend

```bash
# On your development machine or VM
cd PrajaShakthi-VDP-Form-frontend

# Create .env file
nano .env
```

### Frontend .env Configuration

```env
# IMPORTANT: Point to your BACKEND URL
VITE_API_URL=http://your-vm-ip:5000

# For production domain:
# VITE_API_URL=https://api.yourcompany.com
```

### Build Frontend

```bash
# Install dependencies
npm install

# Build for production
npm run build

# This creates a 'dist' folder with optimized files
```

### Deploy Built Files

```bash
# Option 1: Copy to web server directory
cp -r dist/* /var/www/html/prajashakthi/

# Option 2: SCP to VM
scp -r dist/* user@your-vm-ip:/var/www/html/prajashakthi/

# Option 3: Serve with Node.js
npm install -g serve
serve -s dist -p 3000
```

---

## 3️⃣ Web Server Configuration

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/prajashakthi

server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html/prajashakthi;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/prajashakthi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Apache Configuration

```apache
# /etc/apache2/sites-available/prajashakthi.conf

<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html/prajashakthi

    <Directory /var/www/html/prajashakthi>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router support
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Proxy API requests
    ProxyRequests Off
    ProxyPreserveHost On
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api
</VirtualHost>
```

```bash
# Enable modules and site
sudo a2enmod proxy proxy_http rewrite
sudo a2ensite prajashakthi
sudo systemctl reload apache2
```

---

## 4️⃣ Verification Checklist

### Backend Health Check
```bash
# Test backend is running
curl http://localhost:5000/api/health

# Expected: {"status":"ok"}
```

### Frontend Access
```bash
# Open in browser
http://your-vm-ip
# or
http://your-domain.com
```

### API Connectivity
1. Open browser developer tools (F12)
2. Go to Network tab
3. Try to login
4. Check API requests go to correct backend URL

### Database Connection
```bash
# Check MongoDB is running
systemctl status mongod

# Or for MongoDB Atlas, verify connection string
```

---

## 5️⃣ Environment Variables Summary

| Component | Variable | Value |
|-----------|----------|-------|
| **Backend** | `MONGO_URI` | MongoDB connection string |
| | `JWT_SECRET` | Secure secret key (32+ chars) |
| | `NODE_ENV` | `production` |
| | `PORT` | `5000` |
| | `CORS_ORIGIN` | Frontend URL(s) |
| **Frontend** | `VITE_API_URL` | Backend URL (e.g., `http://your-vm-ip:5000`) |

---

## 6️⃣ Systemd Service (Production)

### Backend Service

```bash
# Create service file
sudo nano /etc/systemd/system/prajashakthi-backend.service
```

```ini
[Unit]
Description=PrajaShakthi VDP Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/PrajaShakthi-VDP-Form-backend
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
EnvironmentFile=/path/to/PrajaShakthi-VDP-Form-backend/.env

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable prajashakthi-backend
sudo systemctl start prajashakthi-backend
sudo systemctl status prajashakthi-backend
```

---

## 7️⃣ Firewall Configuration

```bash
# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow backend port (if accessing directly)
sudo ufw allow 5000/tcp

# Enable firewall
sudo ufw enable
```

---

## 8️⃣ SSL/HTTPS Setup (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

Update `.env` files:
```env
# Backend .env
CORS_ORIGIN=https://your-domain.com

# Frontend .env  
VITE_API_URL=https://api.your-domain.com
```

---

## 9️⃣ Monitoring & Logs

### Backend Logs
```bash
# PM2
pm2 logs prajashakthi-backend

# Systemd
sudo journalctl -u prajashakthi-backend -f

# Log files
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Health Monitoring
```bash
# Backend health
curl http://localhost:5000/api/health

# Check all services
systemctl status prajashakthi-backend
systemctl status nginx
systemctl status mongod
```

---

## 🔥 Common Issues & Solutions

### Issue 1: 404 on API Calls
**Solution:** Check `VITE_API_URL` is set correctly in frontend

### Issue 2: CORS Errors
**Solution:** Update `CORS_ORIGIN` in backend .env to include frontend URL

### Issue 3: Database Connection Failed
**Solution:** Verify MongoDB is running and `MONGO_URI` is correct

### Issue 4: Can't Access Frontend
**Solution:** Check firewall allows port 80/443, verify web server is running

### Issue 5: API Requests Timeout
**Solution:** Ensure backend is running, check backend logs for errors

---

## 📞 Quick Commands Reference

```bash
# Restart backend
pm2 restart prajashakthi-backend
# or
sudo systemctl restart prajashakthi-backend

# Restart web server
sudo systemctl restart nginx
# or
sudo systemctl restart apache2

# Check status
pm2 status
sudo systemctl status prajashakthi-backend
sudo systemctl status nginx

# View logs
pm2 logs
sudo journalctl -u prajashakthi-backend -f
tail -f /var/log/nginx/error.log
```

---

## ✅ Deployment Complete!

Your application should now be accessible at:
- **Frontend:** http://your-domain.com (or http://your-vm-ip)
- **Backend API:** http://your-domain.com/api (or http://your-vm-ip:5000/api)

**Default Super Admin:**
- Username: `superadmin`
- Password: (set during initial setup with `npm run create-superadmin`)
