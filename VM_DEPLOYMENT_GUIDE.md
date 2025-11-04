# VM Deployment Guide - PrajaShakthi VDP Application

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Connecting to VM via PuTTY](#connecting-to-vm-via-putty)
3. [Initial VM Setup](#initial-vm-setup)
4. [Installing Required Software](#installing-required-software)
5. [Deploying the Application](#deploying-the-application)
6. [Setting Up the Database](#setting-up-the-database)
7. [Configuring Environment Variables](#configuring-environment-variables)
8. [Running the Application](#running-the-application)
9. [Setting Up as a Service (PM2)](#setting-up-as-a-service-pm2)
10. [Setting Up Nginx Reverse Proxy](#setting-up-nginx-reverse-proxy)
11. [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

### What You Need:
- ✅ VM IP Address (e.g., `192.168.1.100`)
- ✅ VM Username (e.g., `ubuntu` or `root`)
- ✅ VM Password
- ✅ PuTTY installed on your Windows computer
- ✅ Your application code (this repository)
- ✅ MongoDB connection string (MongoDB Atlas or local)

### Download PuTTY:
If you don't have PuTTY:
1. Visit: https://www.putty.org/
2. Download the installer
3. Install PuTTY on your computer

---

## 🔌 Connecting to VM via PuTTY

### Step 1: Open PuTTY

1. Launch **PuTTY** from Start Menu
2. You'll see the PuTTY Configuration window

### Step 2: Configure Connection

1. **In the "Host Name (or IP address)" field**:
   - Enter your VM's IP address
   - Example: `192.168.1.100`

2. **Port**:
   - Keep it as `22` (default SSH port)
   - Unless your admin specified a different port

3. **Connection type**:
   - Select **SSH** (should be selected by default)

4. **Save your session** (optional but recommended):
   - In "Saved Sessions" field, type a name
   - Example: `PrajaShakthi-VM`
   - Click **Save** button
   - Next time, just double-click the saved session!

### Step 3: Connect

1. Click the **Open** button at the bottom

2. **First time connecting?**
   - You'll see a security alert about the host key
   - This is normal for first connection
   - Click **Yes** or **Accept** to continue

### Step 4: Login

1. **Terminal window opens**, you'll see:
   ```
   login as:
   ```

2. **Type your username** and press Enter
   - Example: `ubuntu` or `root` or whatever username provided

3. **Enter password**:
   - Type your password (you won't see it as you type - this is normal!)
   - Press Enter

4. **You're in!** You should see a command prompt like:
   ```bash
   ubuntu@server:~$
   ```

---

## 🛠️ Initial VM Setup

### Step 1: Update System

```bash
# Update package lists
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y
```

**Note**: This may take 5-10 minutes depending on VM.

### Step 2: Check System Information

```bash
# Check Ubuntu version
lsb_release -a

# Check available disk space
df -h

# Check memory
free -h
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
