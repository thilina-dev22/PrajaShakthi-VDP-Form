# 🖥️ VM Deployment Guide - Ubuntu with Local MongoDB
## Complete Guide for PrajaShakthi VDP Application

**System:** Ubuntu Server  
**Database:** Local MongoDB  
**Access:** PuTTY via SSH

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Connecting to Ubuntu VM via PuTTY](#connecting-to-ubuntu-vm-via-putty)
3. [Initial Ubuntu Setup](#initial-ubuntu-setup)
4. [Installing MongoDB Locally](#installing-mongodb-locally)
5. [Installing Node.js and Required Software](#installing-nodejs-and-required-software)
6. [Deploying the Application](#deploying-the-application)
7. [Setting Up MongoDB Database](#setting-up-mongodb-database)
8. [Configuring Environment Variables](#configuring-environment-variables)
9. [Running with PM2](#running-with-pm2)
10. [Setting Up Nginx Reverse Proxy](#setting-up-nginx-reverse-proxy)
11. [Production Configuration](#production-configuration)
12. [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

### What You Need:
- ✅ **Ubuntu VM** (Ubuntu 20.04 or 22.04)
- ✅ **VM IP Address**: `192.168.4.7`
- ✅ **Username**: `pjs` (your actual username)
- ✅ **Password** (provided by your IT admin)
- ✅ **PuTTY** installed on Windows
- ✅ **Internet access** on VM (for installing packages)
- ✅ **At least 2GB RAM** and **20GB disk space**

### Your VM Details:
```
Username: pjs
VM IP: 192.168.4.7
Ubuntu Version: 22.04.5 LTS (Jammy)
Available Disk: 6.6GB free
RAM: 7.8GB
CPU: Intel Xeon Silver 4309Y @ 2.80GHz
```

**Important Note**: Throughout this guide, replace `ubuntu` with `pjs` in commands where username is referenced!

### Download PuTTY:
If you don't have PuTTY installed:
1. Visit: https://www.putty.org/
2. Download the Windows installer (64-bit recommended)
3. Install PuTTY on your computer

---

## 🔌 Connecting to Ubuntu VM via PuTTY

### Step 1: Launch PuTTY

1. Open **PuTTY** from Start Menu
2. You'll see the PuTTY Configuration window

### Step 2: Configure Connection

1. **Host Name (or IP address)**:
   - Enter: `192.168.4.7` (or your VM IP)

2. **Port**: 
   - Keep as `22` (SSH default port)

3. **Connection type**: 
   - Select **SSH**

4. **Save Session** (recommended):
   - In "Saved Sessions", type: `Ubuntu-PrajaShakthi`
   - Click **Save**
   - Next time, just double-click to connect!

### Step 3: Connect

1. Click **Open** button

2. **First-time Security Alert**:
   - Message: "The server's host key is not cached..."
   - This is normal for first connection
   - Click **Yes** to trust and continue

### Step 4: Login to Ubuntu

1. Terminal window opens with:
   ```
   login as:
   ```

2. Type `pjs` and press Enter

3. Type your password and press Enter
   - **Note**: You won't see the password as you type (security feature)

4. **Success!** You'll see:
   ```bash
   pjs@pjs:~$
   ```

You're now connected to your Ubuntu VM! 🎉

---

## 🛠️ Initial Ubuntu Setup

### Step 1: Update Ubuntu System

**Always start with system updates:**

```bash
# Update package lists
sudo apt update

# Upgrade all packages
sudo apt upgrade -y
```

This may take 5-10 minutes. Wait for completion.

### Step 2: Check Ubuntu Version

```bash
# Check Ubuntu version
lsb_release -a
```

Should show Ubuntu 20.04 or 22.04.

### Step 3: Check System Resources

```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU
lscpu | grep "Model name"
```

**Minimum requirements**:
- Disk space: At least 10GB free
- RAM: At least 2GB

---

## 💾 Installing MongoDB Locally

### Step 1: Install curl (Required)

```bash
# Install curl first
sudo apt install curl -y

# Verify curl is installed
curl --version
```

### Step 2: Import MongoDB GPG Key

```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
```

### Step 3: Add MongoDB Repository

**For Ubuntu 22.04 (Jammy)** - Use this one:
```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

**For Ubuntu 20.04 (Focal)** - Skip this if you're on 22.04:
```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

### Step 4: Install MongoDB

```bash
# Update package lists
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Verify installation
mongod --version
```

Should show MongoDB version 7.0.x.

### Step 5: Start MongoDB Service

```bash
# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

Should show **"active (running)"** in green. Press `q` to exit.

### Step 6: Verify MongoDB is Running

```bash
# Connect to MongoDB shell
mongosh

# You should see MongoDB shell prompt:
# test>
```

Type `exit` to leave MongoDB shell.

**MongoDB is now installed and running!** ✅

---

## 💿 Installing Node.js and Required Software

### Step 1: Install Node.js 22

**Note**: If you haven't installed `curl` yet, do it first:
```bash
sudo apt install curl -y
```

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

Should show Node v22.x.x and npm version.

### Step 2: Install Git

```bash
# Install Git
sudo apt install -y git

# Verify
git --version
```

### Step 3: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify
pm2 --version
```

### Step 4: Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable auto-start
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

Should show "active (running)". Press `q` to exit.

### Step 5: Install Build Tools (for npm packages)

```bash
# Install build essentials
sudo apt install -y build-essential

# Verify
gcc --version
```

---

## 📁 Deploying the Application

### Step 1: Create Application Directory

```bash
# Create directory
sudo mkdir -p /var/www

# Give ownership to pjs user
sudo chown -R pjs:pjs /var/www

# Navigate there
cd /var/www
```

### Step 2: Clone Repository

```bash
# Clone from GitHub
git clone https://github.com/thilina-dev22/PrajaShakthi-VDP-Form.git

# Navigate into project
cd PrajaShakthi-VDP-Form

# Check files
ls -la
```

You should see both frontend and backend folders.

### Step 3: Install Backend Dependencies

```bash
# Go to backend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend

# Install packages (takes 2-5 minutes)
npm install
```

Wait for installation to complete.

### Step 4: Install Frontend Dependencies

```bash
# Go to frontend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend

# Install packages (takes 3-7 minutes)
npm install
```

---

## 🗄️ Setting Up MongoDB Database

### Step 1: Access MongoDB Shell

```bash
# Connect to MongoDB
mongosh
```

### Step 2: Create Database and User

In the MongoDB shell, run these commands:

```javascript
// Switch to prajashakthi database
use prajashakthi

// Create admin user for the database
db.createUser({
  user: "prajashakthi_admin",
  pwd: "dbAdmin@prajashakthi.gov.lk",  // Changed this to a strong password!
  roles: [
    { role: "readWrite", db: "prajashakthi" },
    { role: "dbAdmin", db: "prajashakthi" }
  ]
})
```

**Important**: Replace `SecurePassword123!` with a strong password. Save this password!

### Step 3: Verify User Creation

```javascript
// Show users
db.getUsers()
```

You should see your newly created user.

### Step 4: Exit MongoDB Shell

```javascript
exit
```

### Step 5: Test Connection with Authentication

```bash
# Test connection
mongosh "mongodb://prajashakthi_admin:SecurePassword123!@localhost:27017/prajashakthi"
```

Replace `SecurePassword123!` with your actual password.

If successful, you'll connect to the database. Type `exit` to leave.

**Your MongoDB database is ready!** ✅

---

## ⚙️ Configuring Environment Variables

### Step 1: Create Backend .env File

```bash
# Navigate to backend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend

# Create .env file
nano .env
```

### Step 2: Add Backend Configuration

Type or paste this (update password and secret):

```env
# MongoDB Local Connection
# Password is URL-encoded: @ becomes %40
MONGO_URI=mongodb://prajashakthi_admin:dbAdmin%40prajashakthi.gov.lk@localhost:27017/prajashakthi

# JWT Secret
JWT_SECRET=c5d4b8e3a2f7109d6e4c8f3a5b2e7d1c9a8f4e2d6c0b5a1f8e3c7d6b9a2f4e8c

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration (your VM IP)
CORS_ORIGIN=http://192.168.4.7
```

**Important**: 
- Replace `SecurePassword123!` with your MongoDB password
- Replace `192.168.4.7` with your actual VM IP
- Replace JWT_SECRET with a random secure string

**Generate JWT Secret**:
```bash
# In another terminal or before editing .env, run:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as JWT_SECRET.

**Save file**:
- Press `Ctrl + O` (save)
- Press `Enter` (confirm)
- Press `Ctrl + X` (exit)

### Step 3: Create Frontend .env File

```bash
# Navigate to frontend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend

# Create .env file
nano .env
```

### Step 4: Add Frontend Configuration

```env
# Backend API URL (your VM IP)
VITE_API_URL=http://192.168.4.7:5000
```

Replace `192.168.4.7` with your VM IP.

**Save file** (Ctrl+O, Enter, Ctrl+X)

### Step 5: Build Frontend

```bash
# Build for production
npm run build
```

This creates an optimized `dist` folder (takes 1-2 minutes).

```bash
# Verify dist folder
ls -la dist/
```

Should show `index.html`, `assets` folder, etc.

---

## 🚀 Running with PM2

### Step 1: Start Backend with PM2

```bash
# Navigate to backend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend

# Start with PM2
pm2 start server.js --name "prajashakthi-backend"

# Check status
pm2 status
```

You should see your app running!

### Step 2: View Backend Logs

```bash
# View logs
pm2 logs prajashakthi-backend --lines 50
```

Should show:
- "Server running on port 5000"
- "MongoDB Connected: localhost:27017/prajashakthi"

Press `Ctrl+C` to exit logs.

### Step 3: Save PM2 Configuration

```bash
# Save current PM2 processes
pm2 save

# Generate startup script
pm2 startup
```

**Copy and run the command shown**. It looks like:
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pjs --hp /home/pjs
```

**Important**: Use the exact command shown by PM2, which will include your username `pjs`.

This ensures PM2 starts automatically on server reboot.

### Step 4: Test Backend API

```bash
# Test health endpoint
curl http://localhost:5000/api/health
```

Should return: `{"status":"ok"}`

---

## 🌐 Setting Up Nginx Reverse Proxy

### Step 1: Create Nginx Configuration

```bash
# Create new site config
sudo nano /etc/nginx/sites-available/prajashakthi
```

### Step 2: Add Configuration

Paste this (replace IP with your VM IP):

```nginx
server {
    listen 80;
    server_name 192.168.4.7;  # Your VM IP

    # Serve frontend static files
    location / {
        root /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:5000/api/health;
    }
}
```

**Save** (Ctrl+O, Enter, Ctrl+X)

### Step 3: Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/prajashakthi /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
```

Should say: "syntax is ok" and "test is successful"

### Step 4: Restart Nginx

```bash
# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

Should be "active (running)". Press `q` to exit.

### Step 5: Update Frontend .env for Nginx

Since Nginx now proxies everything:

```bash
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend
nano .env
```

**Change to** (remove :5000 port):
```env
VITE_API_URL=http://192.168.4.7
```

**Rebuild frontend**:
```bash
npm run build
```

---

## 🔒 Production Configuration

### Step 1: Configure Firewall (UFW)

```bash
# Allow SSH (IMPORTANT!)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (for future SSL)
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

Type `y` when prompted.

```bash
# Check status
sudo ufw status
```

### Step 2: Secure MongoDB

```bash
# Edit MongoDB config
sudo nano /etc/mongod.conf
```

**Find the section** `# network interfaces` and update:

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1  # Only localhost access
```

**Find the section** `#security:` and add:

```yaml
security:
  authorization: enabled  # Require authentication
```

**Save** (Ctrl+O, Enter, Ctrl+X)

**Restart MongoDB**:
```bash
sudo systemctl restart mongod
sudo systemctl status mongod
```

### Step 3: Create Super Admin User

```bash
# Navigate to backend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend

# Run create admin script
node scripts/createSuperAdmin.js
```

Follow prompts to create your first admin user!

### Step 4: Set Up Log Rotation

```bash
# Create PM2 log rotation config
pm2 install pm2-logrotate

# Configure (keep last 30 days)
pm2 set pm2-logrotate:retain 30
```

---

## ✅ Testing & Verification

### Test 1: Check All Services

```bash
# Check PM2
pm2 status

# Check Nginx
sudo systemctl status nginx

# Check MongoDB
sudo systemctl status mongod
```

All should show "active (running)".

### Test 2: Test from Browser

On your computer:

1. Open browser
2. Go to: `http://192.168.4.7` (your VM IP)
3. Should see login page
4. Login with super admin credentials
5. Test all features

### Test 3: Check Logs

```bash
# Backend logs
pm2 logs prajashakthi-backend --lines 50

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

Press `Ctrl+C` to exit logs.

---

## 🔧 Useful Commands

### PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs

# View specific app logs
pm2 logs prajashakthi-backend

# Restart app
pm2 restart prajashakthi-backend

# Stop app
pm2 stop prajashakthi-backend

# Real-time monitoring
pm2 monit

# List all processes
pm2 list
```

### MongoDB Commands

```bash
# Start MongoDB
sudo systemctl start mongod

# Stop MongoDB
sudo systemctl stop mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check status
sudo systemctl status mongod

# Connect to MongoDB shell
mongosh "mongodb://prajashakthi_admin:YourPassword@localhost:27017/prajashakthi"

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx (without stopping)
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### System Commands

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU and processes
htop  # Install with: sudo apt install htop

# Check Ubuntu version
lsb_release -a

# Reboot system
sudo reboot
```

---

## 🔄 Updating Application

When you make code changes:

### Update Backend:

```bash
# Go to project root
cd /var/www/PrajaShakthi-VDP-Form

# Pull latest code
git pull origin main

# Go to backend
cd PrajaShakthi-VDP-Form-backend

# Install any new dependencies
npm install

# Restart with PM2
pm2 restart prajashakthi-backend

# Check logs
pm2 logs prajashakthi-backend --lines 50
```

### Update Frontend:

```bash
# Go to frontend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend

# Install new dependencies
npm install

# Rebuild
npm run build

# Nginx serves new files automatically!
```

### Quick Update Script:

Create a convenient update script:

```bash
# Create script
nano ~/update-app.sh
```

Paste this:

```bash
#!/bin/bash

echo "🔄 Updating PrajaShakthi VDP Application..."

cd /var/www/PrajaShakthi-VDP-Form

# Pull latest
echo "📥 Pulling latest code..."
git pull origin main

# Update backend
echo "🔧 Updating backend..."
cd PrajaShakthi-VDP-Form-backend
npm install
pm2 restart prajashakthi-backend

# Update frontend
echo "🎨 Updating frontend..."
cd ../PrajaShakthi-VDP-Form-frontend
npm install
npm run build

echo "✅ Update complete!"
pm2 status
```

Make executable and run:

```bash
chmod +x ~/update-app.sh
~/update-app.sh
```

---

## 💾 Backup & Recovery

### Backup MongoDB Database

```bash
# Create backup directory
mkdir -p ~/backups

# Backup database
mongodump --uri="mongodb://prajashakthi_admin:YourPassword@localhost:27017/prajashakthi" --out=~/backups/mongo-backup-$(date +%Y%m%d)

# List backups
ls -lh ~/backups/
```

### Restore MongoDB Database

```bash
# Restore from backup
mongorestore --uri="mongodb://prajashakthi_admin:YourPassword@localhost:27017/prajashakthi" ~/backups/mongo-backup-20251104/prajashakthi
```

### Backup Application Files

```bash
# Backup entire application
tar -czf ~/backups/app-backup-$(date +%Y%m%d).tar.gz /var/www/PrajaShakthi-VDP-Form

# Check backup size
ls -lh ~/backups/app-backup-*.tar.gz
```

### Automated Backup Script

```bash
# Create backup script
nano ~/backup.sh
```

Paste:

```bash
#!/bin/bash

BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d)
MONGO_PASSWORD="YourMongoDBPassword"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --uri="mongodb://prajashakthi_admin:$MONGO_PASSWORD@localhost:27017/prajashakthi" --out=$BACKUP_DIR/mongo-$DATE

# Compress MongoDB backup
tar -czf $BACKUP_DIR/mongo-$DATE.tar.gz $BACKUP_DIR/mongo-$DATE
rm -rf $BACKUP_DIR/mongo-$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "mongo-*.tar.gz" -mtime +7 -delete

echo "Backup completed: mongo-$DATE.tar.gz"
```

Make executable:

```bash
chmod +x ~/backup.sh
```

Set up daily automatic backup with cron:

```bash
# Edit crontab
crontab -e
```

Add this line (runs daily at 2 AM):

```
0 2 * * * /home/pjs/backup.sh >> /home/pjs/backup.log 2>&1
```

---

## 🐛 Troubleshooting

### Problem: Can't Connect with PuTTY

**Solutions**:
1. Verify VM IP is correct (`192.168.4.7`)
2. Check VM is running (contact admin)
3. Ping VM from Windows: `ping 192.168.4.7`
4. Verify port 22 is open
5. Check your IP is whitelisted

### Problem: MongoDB Won't Start

```bash
# Check status
sudo systemctl status mongod

# View logs
sudo tail -50 /var/log/mongodb/mongod.log

# Common fixes:
# 1. Check disk space
df -h

# 2. Fix permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock

# 3. Restart service
sudo systemctl restart mongod
```

### Problem: Backend Won't Start

```bash
# Check PM2 logs
pm2 logs prajashakthi-backend

# Common issues:
# 1. MongoDB not running
sudo systemctl status mongod

# 2. Wrong MONGO_URI in .env
nano /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend/.env

# 3. Port 5000 in use
sudo lsof -i :5000
# Kill process: sudo kill -9 PID

# Test manually
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend
node server.js
```

### Problem: Frontend Shows Blank Page

```bash
# Check if dist folder exists
ls -la /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend/dist/

# Rebuild if needed
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend
npm run build

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Problem: CORS Errors

**Check backend .env**:
```bash
nano /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend/.env
```

Ensure: `CORS_ORIGIN=http://192.168.4.7` (your VM IP)

**Restart backend**:
```bash
pm2 restart prajashakthi-backend
```

### Problem: Cannot Access from Browser

**Check firewall**:
```bash
sudo ufw status
```

Ensure port 80 is allowed:
```bash
sudo ufw allow 80/tcp
```

**Check Nginx is running**:
```bash
sudo systemctl status nginx
```

**Check you're using correct IP**:
```bash
# Get your IP
hostname -I
```

### Problem: Permission Denied Errors

```bash
# Fix ownership (use your username)
sudo chown -R pjs:pjs /var/www/PrajaShakthi-VDP-Form

# Or use sudo for system operations
sudo your-command-here
```

### Problem: Out of Disk Space

```bash
# Check disk usage
df -h

# Find large files
sudo du -sh /* | sort -h

# Clean up
sudo apt clean
sudo apt autoremove

# Clean PM2 logs
pm2 flush

# Clean old backups
rm ~/backups/old-backup.tar.gz
```

---

## 📊 Monitoring

### Check System Health

```bash
# CPU and Memory
htop

# Disk usage
df -h

# Disk I/O
iotop  # Install: sudo apt install iotop

# Network connections
sudo netstat -tulpn
```

### Monitor Application

```bash
# PM2 monitoring
pm2 monit

# PM2 detailed info
pm2 show prajashakthi-backend

# Resource usage
pm2 status
```

### Monitor MongoDB

```bash
# MongoDB stats
mongosh "mongodb://prajashakthi_admin:YourPassword@localhost:27017/prajashakthi" --eval "db.stats()"

# Database size
mongosh "mongodb://prajashakthi_admin:YourPassword@localhost:27017/prajashakthi" --eval "db.stats().dataSize"

# Collection counts
mongosh "mongodb://prajashakthi_admin:YourPassword@localhost:27017/prajashakthi" --eval "db.submissions.countDocuments()"
```

---

## 📞 Quick Reference

### Connection Info
```
VM IP: 192.168.4.7
SSH Port: 22
Username: pjs
```

### Service Ports
```
Frontend: 80 (via Nginx)
Backend: 5000 (internal)
MongoDB: 27017 (localhost only)
```

### Important Paths
```
Application: /var/www/PrajaShakthi-VDP-Form
Backend: /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend
Frontend: /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend
Nginx Config: /etc/nginx/sites-available/prajashakthi
MongoDB Config: /etc/mongod.conf
MongoDB Data: /var/lib/mongodb
Logs: /var/log/nginx/, /var/log/mongodb/
```

### MongoDB Connection String
```
mongodb://prajashakthi_admin:YourPassword@localhost:27017/prajashakthi
```

---

## ✅ Deployment Checklist

- [ ] Connected to Ubuntu VM via PuTTY
- [ ] Updated Ubuntu system
- [ ] Installed MongoDB locally
- [ ] Installed Node.js 22
- [ ] Installed Git, PM2, Nginx
- [ ] Cloned repository
- [ ] Created MongoDB database and user
- [ ] Created backend .env file
- [ ] Created frontend .env file
- [ ] Installed backend dependencies
- [ ] Installed frontend dependencies
- [ ] Built frontend for production
- [ ] Configured Nginx
- [ ] Started backend with PM2
- [ ] Configured PM2 auto-start
- [ ] Configured UFW firewall
- [ ] Secured MongoDB
- [ ] Created super admin user
- [ ] Tested in browser
- [ ] All features working
- [ ] Set up backup script

---

## 🎉 Success!

Your PrajaShakthi VDP Application is deployed on Ubuntu with local MongoDB!

**Access**: `http://192.168.4.7`

**Next Steps**:
1. Configure SSL/HTTPS for security
2. Set up automated backups (daily)
3. Monitor system resources
4. Document admin credentials securely
5. Train users with USER_MANUAL.md

---

**Ubuntu VM Deployment Guide**  
**Database**: Local MongoDB  
**Created**: November 2025  
**For**: PrajaShakthi VDP Project
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
- 


------changes---------


db.createUser({
  user: "prajashakthi_admin",
  pwd: "dbAdmin@prajashakthi.gov.lk",  
  roles: [
    { role: "readWrite", db: "prajashakthi" },
    { role: "dbAdmin", db: "prajashakthi" }
  ]
})

mongosh "mongodb://prajashakthi_admin:dbAdmin@prajashakthi.gov.lk@localhost:27017/prajashakthi"


# MongoDB Local Connection
MONGO_URI=mongodb://prajashakthi_admin:dbAdmin.prajashakthi.gov.lk@localhost:27017/prajashakthi

# JWT Secret (generate a random string)
JWT_SECRET=c5d4b8e3a2f7109d6e4c8f3a5b2e7d1c9a8f4e2d6c0b5a1f8e3c7d6b9a2f4e8c

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration (your VM IP)
CORS_ORIGIN=http://192.168.4.7




# MongoDB Local Connection
MONGO_URI=mongodb://prajashakthi_admin:dbAdmin@prajashakthi.gov.lk@localhost:27017/prajashakthi

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_random_string_min_32_characters_change_this_now

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration (your VM IP)
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://192.168.4.7


-----changes deploy-------
cd /var/www/PrajaShakthi-VDP-Form

# Pull latest changes
git pull origin main

# Rebuild frontend
cd PrajaShakthi-VDP-Form-frontend
rm -rf dist
npm run build

# Restart services
sudo systemctl restart nginx
pm2 restart prajashakthi-backend

echo "✅ Deployment complete! Edit permissions updated."
