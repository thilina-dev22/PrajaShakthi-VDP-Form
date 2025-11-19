# 🖥️ VM Deployment Guide - PrajaShakthi VDP Application
## Production Deployment on Ubuntu 22.04 LTS

**Last Updated:** November 19, 2025  
**System:** Ubuntu 22.04.5 LTS (Jammy)  
**Architecture:** x86_64  
**Database:** MongoDB 7.0.25 (Local)  
**Web Server:** Nginx 1.18.0  
**Runtime:** Node.js v22.21.0  
**Process Manager:** PM2 6.0.13  
**Domain:** https://cdc_data.prajashakthi.gov.lk  
**SSL/CDN:** Cloudflare (Flexible SSL)

---

## 📋 Table of Contents
1. [System Specifications](#1-system-specifications)
2. [Prerequisites](#2-prerequisites)
3. [Connecting to Ubuntu VM](#3-connecting-to-ubuntu-vm)
4. [Initial System Setup](#4-initial-system-setup)
5. [Installing MongoDB 7.0](#5-installing-mongodb-70)
6. [Installing Node.js 22.x](#6-installing-nodejs-22x)
7. [Installing Nginx](#7-installing-nginx)
8. [Deploying the Application](#8-deploying-the-application)
9. [Configuring MongoDB Database](#9-configuring-mongodb-database)
10. [Configuring Nginx](#10-configuring-nginx)
11. [Setting Up PM2 Process Manager](#11-setting-up-pm2-process-manager)
12. [Firewall Configuration (UFW)](#12-firewall-configuration-ufw)
13. [Cloudflare Configuration](#13-cloudflare-configuration)
14. [Production Deployment Script](#14-production-deployment-script)
15. [Monitoring and Maintenance](#15-monitoring-and-maintenance)
16. [Troubleshooting](#16-troubleshooting)
17. [Security Best Practices](#17-security-best-practices)

---

## 1. System Specifications

### Production Server Configuration

```yaml
Operating System: Ubuntu 22.04.5 LTS (Jammy Jellyfish)
Architecture: x86_64
Kernel: 6.8.0-87-generic
CPU: Intel(R) Xeon(R) Silver 4309Y @ 2.80GHz
CPU Cores: 4
RAM: 7.8 GB
Storage: 18 GB (73% used)
Network Interface: eth0
Local IP: 192.168.4.7
Gateway: 192.168.4.1
```

### Software Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| **Ubuntu** | 22.04.5 LTS | Operating System |
| **MongoDB** | 7.0.25 | Database Server |
| **Node.js** | v22.21.0 | JavaScript Runtime |
| **npm** | 10.9.4 | Package Manager |
| **PM2** | 6.0.13 | Process Manager |
| **Nginx** | 1.18.0 | Web Server & Reverse Proxy |
| **Git** | 2.34.1 | Version Control |
| **UFW** | - | Firewall |

---

## 2. Prerequisites

### Required Access
- SSH access to Ubuntu 22.04 VM (using PuTTY or terminal)
- User with sudo privileges (e.g., `pjs`)
- Internet connectivity on the VM

### Local Machine Requirements
- PuTTY (Windows) or SSH client (Linux/Mac)
- Text editor for viewing/editing configuration files
- Git repository access: https://github.com/thilina-dev22/PrajaShakthi-VDP-Form.git

### Domain and SSL (Optional but Recommended)
- Domain name configured (e.g., cdc_data.prajashakthi.gov.lk)
- Cloudflare account with DNS management access
- SSL certificate (Cloudflare provides free SSL)

---

## 3. Connecting to Ubuntu VM

### Using PuTTY (Windows)

1. **Open PuTTY**
2. **Configure Connection:**
   ```
   Host Name: 192.168.4.7 (or your VM's IP)
   Port: 22
   Connection Type: SSH
   ```
3. **Click "Open"** to connect
4. **Login with credentials:**
   ```
   Username: pjs (or your username)
   Password: [your password]
   ```

### Using SSH (Linux/Mac)

```bash
ssh pjs@192.168.4.7
```

---

## 4. Initial System Setup

### Step 1: Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

**Expected Output:**
```
Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
...
Reading package lists... Done
Building dependency tree... Done
```

### Step 2: Install Essential Tools

```bash
# Install build tools and utilities
sudo apt install -y build-essential curl git ufw

# Verify installations
curl --version  # curl 7.81.0
git --version   # git version 2.34.1
```

### Step 3: Configure System Timezone (Optional)

```bash
# Check current timezone
timedatectl

# Set timezone if needed
sudo timedatectl set-timezone Asia/Colombo
```

### Step 4: Create Application Directory

```bash
# Create directory for application
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
```

## 5. Installing MongoDB 7.0

MongoDB will run locally on the VM and store all application data.

### Step 1: Import MongoDB GPG Key

```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
```

### Step 2: Add MongoDB Repository

```bash
# Add MongoDB 7.0 repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

### Step 3: Install MongoDB

```bash
# Update package index
sudo apt update

# Install MongoDB 7.0.25
sudo apt install -y mongodb-org
```

**Verify Installation:**
```bash
mongod --version
# Expected: db version v7.0.25
```

### Step 4: Configure MongoDB

Edit MongoDB configuration file:

```bash
sudo nano /etc/mongod.conf
```

**Production Configuration (`/etc/mongod.conf`):**

```yaml
# mongod.conf

# Where to store data
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

# Where to write log entries
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# Network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1  # Listen on localhost only (secure)

# Process management
processManagement:
  timeZoneInfo: /usr/share/zoneinfo

# Security
security:
  authorization: enabled  # Enable authentication
```

**Key Configuration Notes:**
- `bindIp: 127.0.0.1` - MongoDB only accepts local connections (secure)
- `authorization: enabled` - Requires username/password authentication
- `dbPath: /var/lib/mongodb` - Data storage location
- `logAppend: true` - Logs are appended, not overwritten

### Step 5: Start and Enable MongoDB

```bash
# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Check MongoDB status
sudo systemctl status mongod
```

**Expected Output:**
```
● mongod.service - MongoDB Database Server
     Loaded: loaded (/lib/systemd/system/mongod.service; enabled)
     Active: active (running)
```

### Step 6: Verify MongoDB is Running

```bash
# Check if MongoDB is listening on port 27017
sudo netstat -plntu | grep 27017

# Expected output:
# tcp  0  0  127.0.0.1:27017  0.0.0.0:*  LISTEN  1234/mongod
```

## 6. Installing Node.js 22.x

### Step 1: Download Node.js Binary

```bash
# Download Node.js v22.21.0 (production version)
cd /tmp
curl -O https://nodejs.org/dist/v22.21.0/node-v22.21.0-linux-x64.tar.xz
```

### Step 2: Extract and Install

```bash
# Extract archive
sudo tar -xJvf node-v22.21.0-linux-x64.tar.xz -C /usr/local --strip-components=1

# Clean up
rm node-v22.21.0-linux-x64.tar.xz
```

### Step 3: Verify Installation

```bash
# Check Node.js version
node --version
# Expected: v22.21.0

# Check npm version
npm --version
# Expected: 10.9.4
```

### Step 4: Install PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2@6.0.13

# Install PM2 log rotation module
pm2 install pm2-logrotate

# Verify PM2 installation
pm2 --version
# Expected: 6.0.13
```

---

## 7. Installing Nginx

### Step 1: Install Nginx

```bash
# Install Nginx web server
sudo apt install -y nginx

# Verify installation
nginx -v
# Expected: nginx version: nginx/1.18.0 (Ubuntu)
```

### Step 2: Start and Enable Nginx

```bash
# Start Nginx service
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx
```

**Expected Output:**
```
● nginx.service - A high performance web server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)
     Active: active (running)
```

### Step 3: Disable Default Site

```bash
# Remove default Nginx site
sudo rm /etc/nginx/sites-enabled/default
```

---

## 8. Deploying the Application

### Step 1: Clone Repository

```bash
# Navigate to web directory
cd /var/www

# Clone the application repository
git clone https://github.com/thilina-dev22/PrajaShakthi-VDP-Form.git

# Verify clone
cd PrajaShakthi-VDP-Form
git status
```

**Expected Structure:**
```
PrajaShakthi-VDP-Form/
├── PrajaShakthi-VDP-Form-backend/
├── PrajaShakthi-VDP-Form-frontend/
├── DEPLOYMENT_INSTRUCTIONS.md
└── README.md
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to backend directory
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend

# Install dependencies
npm install

# Verify installation
ls node_modules/ | wc -l
# Expected: ~130+ packages
```

**Key Dependencies Installed:**
- express: 5.1.0
- mongoose: 8.18.3
- bcryptjs: 2.4.3
- jsonwebtoken: 9.0.2
- cors: 2.8.5
- dotenv: 16.4.7
- node-cron: 3.0.3

### Step 3: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend

# Install dependencies
npm install

# Verify installation
ls node_modules/ | wc -l
# Expected: ~430+ packages
```

### Step 4: Build Frontend for Production

```bash
# Build frontend
npm run build

# Verify build output
ls -lh dist/
```

**Expected Output:**
```
dist/
├── index.html (463 bytes)
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── logo.png (19.2 KB)
├── PrajaShakthi CDC Data Collection Portal User Manual.pdf (985 KB)
└── vite.svg
```

---

## 9. Configuring MongoDB Database

### Step 1: Connect to MongoDB Shell

```bash
# Connect to MongoDB (no auth yet)
mongosh
```

### Step 2: Create Database and User

```javascript
// Switch to admin database
use admin

// Create admin user (for database management)
db.createUser({
  user: "prajashakthi_admin",
  pwd: "your_secure_password_here",  // Replace with strong password
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})

// Switch to application database
use prajashakthi

// Create application user
db.createUser({
  user: "prajashakthi_admin",
  pwd: "your_secure_password_here",  // Same or different password
  roles: [
    { role: "readWrite", db: "prajashakthi" },
    { role: "dbAdmin", db: "prajashakthi" }
  ]
})

// Exit MongoDB shell
exit
```

### Step 3: Test Authentication

```bash
# Test connection with authentication
mongosh "mongodb://prajashakthi_admin:your_secure_password_here@localhost:27017/prajashakthi"

# Should connect successfully
# Run a test command:
db.getName()
# Expected: prajashakthi

exit
```

### Step 4: Configure Backend Environment Variables

Create `.env` file in backend directory:

```bash
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend
nano .env
```

**Production `.env` Configuration:**

```env
# MongoDB Connection
# Format: mongodb://username:password@host:port/database
# IMPORTANT: URL-encode special characters in password
MONGO_URI=mongodb://prajashakthi_admin:your_secure_password_here@localhost:27017/prajashakthi

# JWT Secret (generate a random string)
JWT_SECRET=your_random_jwt_secret_here_minimum_32_characters_long

# Server Port
PORT=5000

# Node Environment
NODE_ENV=production

# CORS Origins (comma-separated, no spaces)
# Include all domain variations your application will use
CORS_ORIGIN=http://192.168.4.7,http://cdc_data.prajashakthi.gov.lk,https://cdc_data.prajashakthi.gov.lk
```

**Environment Variable Notes:**
- **MONGO_URI**: Use `localhost` for local MongoDB, URL-encode special characters in password
- **JWT_SECRET**: Generate a secure random string (min 32 characters)
- **PORT**: Backend API port (5000)
- **NODE_ENV**: Set to `production` for production deployment
- **CORS_ORIGIN**: Add all domain variations (HTTP/HTTPS, with/without www)

**Generate Secure JWT Secret:**
```bash
# Generate random 64-character secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 10. Configuring Nginx

Nginx serves the frontend and proxies API requests to the backend.

### Step 1: Create Nginx Site Configuration

```bash
# Create new site configuration
sudo nano /etc/nginx/sites-available/prajashakthi
```

### Step 2: Add Production Configuration

**Production Nginx Configuration (`/etc/nginx/sites-available/prajashakthi`):**

```nginx
# ==============================================
# Default Server Block - Blocks Direct IP Access
# ==============================================
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    # Return connection closed for any request to IP address
    return 444;
}

# ==============================================
# Cloudflare Real IP Configuration
# ==============================================
# Get client's real IP from Cloudflare headers
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 2400:cb00::/32;
real_ip_header CF-Connecting-IP;

# ==============================================
# Main Server Block - Application
# ==============================================
server {
    listen 80;
    listen [::]:80;
    server_name cdc_data.prajashakthi.gov.lk;  # Replace with your domain

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Backend Static Files (uploaded files, reports, etc.)
    location /public/ {
        alias /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend/public/;
        access_log off;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts (important for file uploads)
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
        
        # Buffering
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }

    # Frontend Static Files
    location / {
        root /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Disable caching for HTML files
        location = /index.html {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
    }
}

# ==============================================
# Localhost Server Block - For Testing
# ==============================================
server {
    listen 127.0.0.1:80;
    server_name localhost;

    # Same configuration as main server for local testing
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

**Configuration Breakdown:**

1. **Default Server Block:**
   - Catches all requests to direct IP addresses
   - Returns 444 (connection closed) to block IP access
   - Prevents bypassing domain-based access controls

2. **Cloudflare Real IP:**
   - Configures Nginx to trust Cloudflare proxy IPs
   - Extracts real client IP from `CF-Connecting-IP` header
   - Required for accurate logging and security

3. **Main Server Block:**
   - Serves domain `cdc_data.prajashakthi.gov.lk`
   - Security headers prevent XSS, clickjacking, MIME sniffing
   - `/public/` - Backend static files with 1-year cache
   - `/api/` - Proxies to backend with 300s timeout (for uploads)
   - `/` - Frontend SPA with HTML no-cache, assets 1-year cache

4. **Localhost Server Block:**
   - Allows testing via `http://localhost` on VM
   - Useful for debugging without DNS/Cloudflare

### Step 3: Enable Site Configuration

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/prajashakthi /etc/nginx/sites-enabled/

# Test Nginx configuration for syntax errors
sudo nginx -t
```

**Expected Output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Step 4: Reload Nginx

```bash
# Reload Nginx to apply changes
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx
```

### Step 5: Verify Nginx Configuration

```bash
# Check which sites are enabled
ls -l /etc/nginx/sites-enabled/

# View Nginx error log for issues
sudo tail -f /var/log/nginx/error.log
```

## 11. Setting Up PM2 Process Manager

PM2 keeps the backend Node.js application running continuously and restarts it automatically if it crashes.

### Step 1: Start Backend with PM2

```bash
# Navigate to backend directory
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend

# Start application with PM2
pm2 start server.js --name prajashakthi-backend

# Check process status
pm2 status
```

**Expected Output:**
```
┌─────┬────────────────────────┬─────────┬─────────┬──────────┬─────────┐
│ id  │ name                   │ mode    │ status  │ restart  │ uptime  │
├─────┼────────────────────────┼─────────┼─────────┼──────────┼─────────┤
│ 0   │ prajashakthi-backend   │ fork    │ online  │ 0        │ 0s      │
└─────┴────────────────────────┴─────────┴─────────┴──────────┴─────────┘
```

### Step 2: Configure PM2 Startup Script

```bash
# Generate startup script for systemd
pm2 startup systemd

# Copy and run the generated command (it will show something like):
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pjs --hp /home/pjs
```

Run the command shown by PM2 (copy-paste exactly):
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pjs --hp /home/pjs
```

### Step 3: Save PM2 Process List

```bash
# Save current PM2 processes
pm2 save

# Verify saved processes
cat ~/.pm2/dump.pm2
```

### Step 4: Configure PM2 Log Rotation

PM2 log rotation prevents log files from consuming too much disk space.

```bash
# Configure log rotation (already installed in section 6)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

# Verify log rotation settings
pm2 conf pm2-logrotate
```

**Log Rotation Settings:**
- `max_size`: Rotate when log reaches 10MB
- `retain`: Keep last 7 rotated logs
- `compress`: Gzip compressed logs
- `dateFormat`: Timestamp format for rotated logs
- `rotateInterval`: Rotate daily at midnight

### Step 5: Monitor PM2 Process

```bash
# View detailed process information
pm2 show prajashakthi-backend

# Monitor logs in real-time
pm2 logs prajashakthi-backend

# Monitor process metrics
pm2 monit
```

**Useful PM2 Commands:**

```bash
# View logs
pm2 logs                              # All processes
pm2 logs prajashakthi-backend        # Specific process
pm2 logs --lines 100                 # Last 100 lines

# Restart process
pm2 restart prajashakthi-backend

# Stop process
pm2 stop prajashakthi-backend

# Delete process from PM2
pm2 delete prajashakthi-backend

# Reload (zero-downtime restart)
pm2 reload prajashakthi-backend

# List all processes
pm2 list

# Clear logs
pm2 flush
```

### Step 6: Verify Backend is Running

```bash
# Test backend API directly
curl http://localhost:5000/api/test

# Check if process is listening on port 5000
sudo netstat -plntu | grep 5000

# Expected:
# tcp  0  0  127.0.0.1:5000  0.0.0.0:*  LISTEN  12345/node
```

---

## 12. Firewall Configuration (UFW)

Configure Ubuntu's firewall to allow only necessary traffic.

### Step 1: Enable UFW

```bash
# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Step 2: Allow SSH (IMPORTANT - Do this first!)

```bash
# Allow SSH to prevent lockout
sudo ufw allow 22/tcp
```

**⚠️ WARNING:** Always allow SSH (port 22) before enabling UFW to prevent being locked out!

### Step 3: Allow HTTP and HTTPS

```bash
# Allow HTTP (port 80)
sudo ufw allow 80/tcp

# Allow HTTPS (port 443)
sudo ufw allow 443/tcp
```

### Step 4: Allow Cloudflare IP Ranges (Optional but Recommended)

If using Cloudflare, restrict HTTP/HTTPS access to Cloudflare IPs only:

```bash
# Cloudflare IPv4 ranges
sudo ufw allow from 173.245.48.0/20 to any port 80 proto tcp
sudo ufw allow from 103.21.244.0/22 to any port 80 proto tcp
sudo ufw allow from 103.22.200.0/22 to any port 80 proto tcp
sudo ufw allow from 103.31.4.0/22 to any port 80 proto tcp
sudo ufw allow from 141.101.64.0/18 to any port 80 proto tcp
sudo ufw allow from 108.162.192.0/18 to any port 80 proto tcp
sudo ufw allow from 190.93.240.0/20 to any port 80 proto tcp
sudo ufw allow from 188.114.96.0/20 to any port 80 proto tcp
sudo ufw allow from 197.234.240.0/22 to any port 80 proto tcp
sudo ufw allow from 198.41.128.0/17 to any port 80 proto tcp
sudo ufw allow from 162.158.0.0/15 to any port 80 proto tcp
sudo ufw allow from 104.16.0.0/13 to any port 80 proto tcp
sudo ufw allow from 104.24.0.0/14 to any port 80 proto tcp
sudo ufw allow from 172.64.0.0/13 to any port 80 proto tcp
sudo ufw allow from 131.0.72.0/22 to any port 80 proto tcp
```

**Note:** These rules ensure only Cloudflare can access your origin server on port 80.

### Step 5: Verify Firewall Rules

```bash
# View all firewall rules
sudo ufw status verbose
```

**Expected Output:**
```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
80/tcp                     ALLOW       173.245.48.0/20
80/tcp                     ALLOW       103.21.244.0/22
...
```

### Step 6: Test Firewall

```bash
# Test SSH connection (from local machine)
ssh pjs@192.168.4.7

# Test HTTP access (from local machine)
curl http://192.168.4.7
```

---

## 13. Cloudflare Configuration

Configure Cloudflare to proxy traffic to your VM securely.

### DNS Configuration

1. **Login to Cloudflare Dashboard**
2. **Select your domain** (e.g., `prajashakthi.gov.lk`)
3. **Navigate to DNS settings**
4. **Add A record:**
   ```
   Type: A
   Name: cdc_data (or your subdomain)
   IPv4 Address: YOUR_PUBLIC_IP (e.g., 202.124.188.234)
   Proxy Status: Proxied (orange cloud)
   TTL: Auto
   ```

### SSL/TLS Configuration

1. **Navigate to SSL/TLS settings**
2. **Set SSL/TLS encryption mode:**
   ```
   Mode: Flexible
   ```
   - **Flexible Mode:** Cloudflare ↔ Client uses HTTPS, Cloudflare ↔ Origin uses HTTP
   - This is suitable since your VM serves HTTP on port 80

**SSL/TLS Modes Explained:**
- **Off:** No encryption (not recommended)
- **Flexible:** HTTPS between client and Cloudflare, HTTP between Cloudflare and origin
- **Full:** HTTPS end-to-end, but doesn't validate origin certificate
- **Full (Strict):** HTTPS end-to-end with valid origin certificate (best, but requires SSL on origin)

### Cloudflare Page Rules (Optional)

1. **Navigate to Rules → Page Rules**
2. **Create rule to enforce HTTPS:**
   ```
   URL: http://cdc_data.prajashakthi.gov.lk/*
   Setting: Always Use HTTPS
   ```

### Verify Cloudflare Configuration

```bash
# Check DNS resolution
nslookup cdc_data.prajashakthi.gov.lk

# Expected output:
# Non-authoritative answer:
# Name: cdc_data.prajashakthi.gov.lk
# Address: 104.26.6.138 (Cloudflare IP)
# Address: 104.26.7.138 (Cloudflare IP)
# Address: 172.67.74.151 (Cloudflare IP)

# Test HTTPS access
curl -I https://cdc_data.prajashakthi.gov.lk
```

**Expected Response:**
```
HTTP/2 200
server: cloudflare
...
```

### Important Cloudflare Notes

**⚠️ Known Issue: Error 522 (Connection Timed Out)**

If your VM is behind NAT (Network Address Translation) without proper port forwarding:
- Application works on local network (192.168.x.x)
- **Error 522** occurs when accessing from external networks
- **Root cause:** Cloudflare cannot establish connection to origin server

**Solutions:**
1. **Configure port forwarding** on your router (port 80 → 192.168.4.7:80)
2. **Use Cloudflare Tunnel** (recommended for NAT/firewall bypass):
   ```bash
   # Install cloudflared
   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared-linux-amd64.deb
   
   # Authenticate with Cloudflare
   cloudflared tunnel login
   
   # Create tunnel
   cloudflared tunnel create prajashakthi-tunnel
   
   # Configure tunnel to route to localhost:80
   # Follow Cloudflare Tunnel documentation for complete setup
   ```
3. **Contact network administrator** to configure NAT/firewall rules

## 14. Production Deployment Script

Complete automated deployment script for fresh installation.

### Full Deployment Script

Save this as `deploy-production.sh`:

```bash
#!/bin/bash
# ==============================================
# PrajaShakthi VDP Production Deployment Script
# Ubuntu 22.04 LTS with Local MongoDB
# ==============================================

set -e  # Exit on error

echo "======================================"
echo "PrajaShakthi VDP Production Deployment"
echo "======================================"

# Configuration
DOMAIN="cdc_data.prajashakthi.gov.lk"
APP_DIR="/var/www/PrajaShakthi-VDP-Form"
BACKEND_DIR="$APP_DIR/PrajaShakthi-VDP-Form-backend"
FRONTEND_DIR="$APP_DIR/PrajaShakthi-VDP-Form-frontend"
DB_NAME="prajashakthi"
DB_USER="prajashakthi_admin"

# Prompt for passwords
read -sp "Enter MongoDB password: " DB_PASSWORD
echo
read -sp "Enter JWT secret (min 32 chars): " JWT_SECRET
echo

# 1. Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install prerequisites
echo "🔧 Installing prerequisites..."
sudo apt install -y build-essential curl git ufw

# 3. Install MongoDB 7.0
echo "🗄️ Installing MongoDB 7.0..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# 4. Configure MongoDB authentication
echo "🔐 Configuring MongoDB authentication..."
sudo sed -i 's/#security:/security:\n  authorization: enabled/' /etc/mongod.conf
sudo systemctl restart mongod

# Wait for MongoDB to start
sleep 5

# Create MongoDB user
mongosh <<EOF
use admin
db.createUser({
  user: "$DB_USER",
  pwd: "$DB_PASSWORD",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
use $DB_NAME
db.createUser({
  user: "$DB_USER",
  pwd: "$DB_PASSWORD",
  roles: [
    { role: "readWrite", db: "$DB_NAME" },
    { role: "dbAdmin", db: "$DB_NAME" }
  ]
})
exit
EOF

# 5. Install Node.js 22.x
echo "📦 Installing Node.js 22.x..."
cd /tmp
curl -O https://nodejs.org/dist/v22.21.0/node-v22.21.0-linux-x64.tar.xz
sudo tar -xJvf node-v22.21.0-linux-x64.tar.xz -C /usr/local --strip-components=1
rm node-v22.21.0-linux-x64.tar.xz

# 6. Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2@6.0.13
pm2 install pm2-logrotate

# 7. Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 8. Clone repository
echo "📂 Cloning repository..."
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://github.com/thilina-dev22/PrajaShakthi-VDP-Form.git
cd PrajaShakthi-VDP-Form

# 9. Install backend dependencies
echo "📦 Installing backend dependencies..."
cd $BACKEND_DIR
npm install

# 10. Create backend .env file
echo "📝 Creating backend .env..."
cat > .env <<EOF
MONGO_URI=mongodb://$DB_USER:$DB_PASSWORD@localhost:27017/$DB_NAME
JWT_SECRET=$JWT_SECRET
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://192.168.4.7,http://$DOMAIN,https://$DOMAIN
EOF

# 11. Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd $FRONTEND_DIR
npm install
echo "🏗️ Building frontend..."
npm run build

# 12. Configure Nginx
echo "🌐 Configuring Nginx..."
sudo bash -c "cat > /etc/nginx/sites-available/prajashakthi" <<'NGINX_EOF'
# Default server - blocks direct IP access
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    return 444;
}

# Cloudflare real IP configuration
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
real_ip_header CF-Connecting-IP;

# Main server
server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location /public/ {
        alias /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend/public/;
        access_log off;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        send_timeout 300s;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }

    location / {
        root /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend/dist;
        try_files $uri $uri/ /index.html;
        
        location = /index.html {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
    }
}

# Localhost server for testing
server {
    listen 127.0.0.1:80;
    server_name localhost;

    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
NGINX_EOF

# Replace domain placeholder
sudo sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/prajashakthi

# Enable site
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/prajashakthi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 13. Start backend with PM2
echo "🚀 Starting backend with PM2..."
cd $BACKEND_DIR
pm2 start server.js --name prajashakthi-backend
pm2 startup systemd -u $USER --hp $HOME
pm2 save

# 14. Configure PM2 log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true

# 15. Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

echo "======================================"
echo "✅ Deployment completed successfully!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Configure Cloudflare DNS to point to this server"
echo "2. Set Cloudflare SSL/TLS to 'Flexible' mode"
echo "3. Test application: https://$DOMAIN"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check backend status"
echo "  pm2 logs                - View backend logs"
echo "  sudo nginx -t           - Test Nginx config"
echo "  sudo systemctl status nginx  - Check Nginx status"
echo "  mongosh mongodb://$DB_USER:$DB_PASSWORD@localhost:27017/$DB_NAME"
echo ""
```

### Run Deployment Script

```bash
# Make script executable
chmod +x deploy-production.sh

# Run script
./deploy-production.sh
```

---

## 15. Monitoring and Maintenance

### System Monitoring

#### Check Backend Status

```bash
# PM2 process status
pm2 status

# Detailed process info
pm2 show prajashakthi-backend

# Real-time monitoring
pm2 monit

# View logs
pm2 logs prajashakthi-backend --lines 50
```

#### Check MongoDB Status

```bash
# Service status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Connect to MongoDB
mongosh "mongodb://prajashakthi_admin:PASSWORD@localhost:27017/prajashakthi"

# Check database stats
db.stats()

# List collections
show collections
```

#### Check Nginx Status

```bash
# Service status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

#### Check System Resources

```bash
# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top

# Network connections
sudo netstat -tulpn

# Process list
ps aux | grep -E 'node|mongo|nginx'
```

### Application Updates

#### Update Application Code

```bash
# Navigate to repository
cd /var/www/PrajaShakthi-VDP-Form

# Pull latest changes
git pull origin main

# Update backend
cd PrajaShakthi-VDP-Form-backend
npm install  # Install new dependencies if any
pm2 restart prajashakthi-backend

# Update frontend
cd ../PrajaShakthi-VDP-Form-frontend
npm install  # Install new dependencies if any
npm run build  # Rebuild frontend

# Reload Nginx (if config changed)
sudo systemctl reload nginx
```

#### Database Backup

```bash
# Create backup directory
mkdir -p ~/backups/mongodb

# Backup database
mongodump \
  --uri="mongodb://prajashakthi_admin:PASSWORD@localhost:27017/prajashakthi" \
  --out=~/backups/mongodb/backup-$(date +%Y%m%d-%H%M%S)

# Compress backup
cd ~/backups/mongodb
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz backup-$(date +%Y%m%d-%H%M%S)/
rm -rf backup-$(date +%Y%m%d-%H%M%S)/
```

#### Restore Database

```bash
# Extract backup
cd ~/backups/mongodb
tar -xzf backup-20241119-123000.tar.gz

# Restore database
mongorestore \
  --uri="mongodb://prajashakthi_admin:PASSWORD@localhost:27017/prajashakthi" \
  --drop \
  backup-20241119-123000/prajashakthi/
```

### Log Management

#### PM2 Logs

```bash
# View all logs
pm2 logs

# View specific process logs
pm2 logs prajashakthi-backend

# Clear logs
pm2 flush

# Log file locations
ls -lh ~/.pm2/logs/
```

#### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Rotate logs manually
sudo logrotate -f /etc/logrotate.d/nginx
```

#### MongoDB Logs

```bash
# View logs
sudo tail -f /var/log/mongodb/mongod.log

# Check log size
ls -lh /var/log/mongodb/mongod.log

# Rotate logs
db.adminCommand({ logRotate: 1 })
```

---

## 16. Troubleshooting

### Common Issues and Solutions

#### 1. Backend Not Starting

**Symptoms:**
- PM2 shows status as `errored` or constantly restarting
- Application inaccessible

**Diagnosis:**
```bash
# Check PM2 logs
pm2 logs prajashakthi-backend

# Check error logs
pm2 logs prajashakthi-backend --err

# Test backend directly
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend
node server.js
```

**Common Causes:**
- MongoDB connection failed → Check `.env` MONGO_URI
- Port 5000 already in use → Kill conflicting process or change PORT in `.env`
- Missing environment variables → Verify `.env` file exists and is complete
- Syntax errors in code → Check logs for error details

**Solutions:**
```bash
# Fix MongoDB URI (check username/password)
nano .env

# Kill process on port 5000
sudo lsof -ti:5000 | xargs kill -9

# Restart with PM2
pm2 restart prajashakthi-backend

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
pm2 restart prajashakthi-backend
```

#### 2. Cloudflare Error 522 (Connection Timed Out)

**Symptoms:**
- Application works on local network (192.168.x.x)
- Error 522 when accessing from external networks
- Safari shows "Cannot connect to server"

**Diagnosis:**
```bash
# Check if server is behind NAT
curl ifconfig.me  # Public IP
ip addr show      # Local IP

# Test local access
curl http://localhost/api/test
curl http://192.168.4.7/api/test

# Check firewall
sudo ufw status verbose

# Check Nginx is listening
sudo netstat -tulpn | grep nginx
```

**Root Cause:**
- VM behind NAT without port forwarding
- Public IP (e.g., 202.124.188.234) not forwarding to local IP (192.168.4.7)
- Cloudflare cannot establish connection to origin server

**Solutions:**

**Option 1: Configure Port Forwarding (Router/Firewall)**
```
Router Configuration:
External Port: 80
Internal IP: 192.168.4.7
Internal Port: 80
Protocol: TCP
```

**Option 2: Use Cloudflare Tunnel (Recommended)**
```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create prajashakthi-tunnel

# Configure tunnel
cloudflared tunnel route dns prajashakthi-tunnel cdc_data.prajashakthi.gov.lk

# Run tunnel
cloudflared tunnel run prajashakthi-tunnel
```

**Option 3: Contact Network Administrator**
- Request port forwarding rule: `PUBLIC_IP:80 → 192.168.4.7:80`
- Provide public IP and local VM IP

#### 3. Direct IP Access Not Blocked

**Symptoms:**
- Application accessible via `http://192.168.4.7` or `http://202.124.188.234`
- Want to force domain-only access

**Solution:**
- Already configured in Nginx with default server block returning 444
- Verify configuration:

```bash
# Check Nginx config
sudo cat /etc/nginx/sites-available/prajashakthi | grep -A 5 "default_server"

# Should see:
# server {
#     listen 80 default_server;
#     server_name _;
#     return 444;
# }

# Test with curl
curl http://192.168.4.7
# Expected: curl: (52) Empty reply from server

curl http://cdc_data.prajashakthi.gov.lk
# Expected: HTTP 200 OK with HTML content
```

#### 4. Nginx 502 Bad Gateway

**Symptoms:**
- Nginx shows 502 error
- Backend API not responding

**Diagnosis:**
```bash
# Check if backend is running
pm2 status

# Check backend port
sudo netstat -tulpn | grep 5000

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

**Solutions:**
```bash
# Restart backend
pm2 restart prajashakthi-backend

# Check backend logs
pm2 logs prajashakthi-backend

# Verify proxy_pass in Nginx config
sudo grep proxy_pass /etc/nginx/sites-available/prajashakthi
# Should be: proxy_pass http://127.0.0.1:5000;
```

#### 5. Frontend Not Loading (404 Errors)

**Symptoms:**
- Accessing root URL shows 404 or Nginx default page
- Static files not found

**Diagnosis:**
```bash
# Check if frontend build exists
ls -la /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend/dist/

# Check Nginx configuration
sudo grep -A 5 "location /" /etc/nginx/sites-available/prajashakthi

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

**Solutions:**
```bash
# Rebuild frontend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend
npm run build

# Verify dist directory
ls -la dist/

# Check file permissions
sudo chown -R $USER:$USER dist/

# Reload Nginx
sudo systemctl reload nginx
```

#### 6. MongoDB Authentication Failed

**Symptoms:**
- Backend logs show "Authentication failed"
- Cannot connect to MongoDB

**Diagnosis:**
```bash
# Test MongoDB connection
mongosh "mongodb://prajashakthi_admin:PASSWORD@localhost:27017/prajashakthi"

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Check if authentication is enabled
sudo grep "authorization" /etc/mongod.conf
```

**Solutions:**
```bash
# Verify .env has correct credentials
cat /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend/.env | grep MONGO_URI

# URL-encode special characters in password
# Example: p@ssw0rd! → p%40ssw0rd%21

# Recreate MongoDB user if needed
mongosh
use admin
db.dropUser("prajashakthi_admin")
db.createUser({...})  # See section 9 for full command

# Restart backend
pm2 restart prajashakthi-backend
```

#### 7. CORS Errors in Browser Console

**Symptoms:**
- Browser console shows CORS policy errors
- API requests blocked

**Diagnosis:**
```bash
# Check CORS_ORIGIN in .env
cat /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend/.env | grep CORS_ORIGIN
```

**Solution:**
```bash
# Edit .env to include all domain variations
nano /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend/.env

# Add/update CORS_ORIGIN
CORS_ORIGIN=http://192.168.4.7,http://cdc_data.prajashakthi.gov.lk,https://cdc_data.prajashakthi.gov.lk

# Restart backend
pm2 restart prajashakthi-backend
```

### Diagnostic Commands

```bash
# Full system health check
echo "=== System Info ==="
uname -a
uptime
df -h
free -h

echo "=== Service Status ==="
sudo systemctl status mongod nginx

echo "=== PM2 Status ==="
pm2 status

echo "=== Port Usage ==="
sudo netstat -tulpn | grep -E ':(80|443|5000|27017)'

echo "=== Recent Logs ==="
pm2 logs --lines 20
sudo tail -20 /var/log/nginx/error.log
sudo tail -20 /var/log/mongodb/mongod.log

echo "=== Firewall ==="
sudo ufw status verbose

echo "=== Nginx Config Test ==="
sudo nginx -t
```

---

## 17. Security Best Practices

### MongoDB Security

1. **Use Strong Passwords**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   ```

2. **Restrict Network Access**
   - MongoDB configured to listen on `127.0.0.1` only (localhost)
   - No external database access

3. **Enable Authentication**
   - Already enabled with `security.authorization: enabled`

4. **Regular Backups**
   - Schedule daily backups with cron
   - Store backups securely off-server

### Application Security

1. **Environment Variables**
   ```bash
   # Protect .env file
   chmod 600 /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend/.env
   ```

2. **JWT Secret**
   - Use strong random secret (min 32 characters)
   - Never commit to version control

3. **HTTPS Only**
   - Cloudflare enforces HTTPS
   - Configure "Always Use HTTPS" page rule

4. **Input Validation**
   - Application validates all user inputs
   - Sanitize data before database operations

### System Security

1. **Firewall (UFW)**
   - Only allow necessary ports (22, 80, 443)
   - Restrict to Cloudflare IPs if possible

2. **SSH Security**
   ```bash
   # Disable root login
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   # Restart SSH: sudo systemctl restart sshd
   ```

3. **Regular Updates**
   ```bash
   # Update system weekly
   sudo apt update && sudo apt upgrade -y
   ```

4. **Fail2Ban (Optional)**
   ```bash
   # Install fail2ban to prevent brute-force attacks
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

### Nginx Security

1. **Hide Version**
   ```nginx
   # In /etc/nginx/nginx.conf
   http {
       server_tokens off;
   }
   ```

2. **Rate Limiting**
   ```nginx
   # Limit request rate to prevent DoS
   limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
   
   location /api/ {
       limit_req zone=api burst=20 nodelay;
       proxy_pass http://127.0.0.1:5000;
   }
   ```

3. **Security Headers**
   - Already configured in production Nginx config
   - X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

### Monitoring and Alerts

1. **Log Monitoring**
   ```bash
   # Watch for errors
   tail -f /var/log/nginx/error.log
   pm2 logs --err
   ```

2. **Disk Space Monitoring**
   ```bash
   # Check disk usage daily
   df -h | grep -E '(8|9)[0-9]%|100%' && echo "Disk almost full!"
   ```

3. **Process Monitoring**
   - PM2 automatically restarts crashed processes
   - Monitor restart count: `pm2 status`

---

## 📚 Additional Resources

### Official Documentation
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Cloudflare Documentation](https://developers.cloudflare.com/)

### Useful Commands Reference

```bash
# System
sudo systemctl status [service]    # Check service status
sudo systemctl restart [service]   # Restart service
sudo systemctl enable [service]    # Enable service on boot
journalctl -u [service] -f        # View service logs

# MongoDB
mongosh [uri]                      # Connect to MongoDB
db.stats()                         # Database statistics
show collections                   # List collections
db.collection.find()               # Query documents

# PM2
pm2 start [file]                   # Start process
pm2 restart [name]                 # Restart process
pm2 stop [name]                    # Stop process
pm2 delete [name]                  # Remove process
pm2 logs [name]                    # View logs
pm2 monit                          # Monitor processes

# Nginx
sudo nginx -t                      # Test configuration
sudo systemctl reload nginx        # Reload config
sudo tail -f /var/log/nginx/access.log  # Access logs
sudo tail -f /var/log/nginx/error.log   # Error logs

# Git
git pull origin main               # Pull latest changes
git status                         # Check status
git log --oneline -10              # Recent commits

# Firewall
sudo ufw status                    # Check firewall
sudo ufw allow [port]              # Allow port
sudo ufw delete allow [port]       # Remove rule
```

---

## ✅ Deployment Checklist

- [ ] Ubuntu 22.04.5 LTS installed and updated
- [ ] MongoDB 7.0.25 installed and configured
- [ ] MongoDB authentication enabled
- [ ] MongoDB database and user created
- [ ] Node.js 22.21.0 installed
- [ ] PM2 6.0.13 installed
- [ ] PM2 log rotation configured
- [ ] Nginx 1.18.0 installed
- [ ] Repository cloned to `/var/www/PrajaShakthi-VDP-Form`
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Frontend built (`dist/` directory exists)
- [ ] Backend `.env` file created with correct values
- [ ] Nginx site configuration created
- [ ] Nginx default site disabled
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] PM2 process started
- [ ] PM2 startup script configured
- [ ] UFW firewall enabled
- [ ] SSH (port 22) allowed
- [ ] HTTP (port 80) allowed
- [ ] HTTPS (port 443) allowed
- [ ] Cloudflare IPs allowed (optional)
- [ ] Cloudflare DNS configured
- [ ] Cloudflare SSL/TLS set to Flexible
- [ ] Application accessible via domain
- [ ] Backend API responding
- [ ] Database connection working
- [ ] User authentication working
- [ ] Direct IP access blocked

---

## 📞 Support and Contact

For issues or questions:
1. Check the [Troubleshooting](#16-troubleshooting) section
2. Review application logs (`pm2 logs`, Nginx logs)
3. Check system status (`systemctl status`, `pm2 status`)
4. Refer to official documentation links above

---

**Document Version:** 2.0  
**Last Updated:** November 19, 2025  
**Author:** PrajaShakthi Development Team  
**Production System:** Ubuntu 22.04.5 LTS | MongoDB 7.0.25 | Node.js 22.21.0 | Nginx 1.18.0

---

*This deployment guide reflects the actual production configuration running at https://cdc_data.prajashakthi.gov.lk with 7+ days of stable operation.*
<!-- 8. [Configuring Environment Variables](#configuring-environment-variables)
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

echo "✅ Deployment complete! Edit permissions updated." -->
