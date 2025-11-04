# 🖥️ VM Deployment Guide Using PuTTY
## Complete Guide for PrajaShakthi VDP Application

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Part 1: Connecting via PuTTY](#part-1-connecting-via-putty)
3. [Part 2: Initial Server Setup](#part-2-initial-server-setup)
4. [Part 3: Installing Software](#part-3-installing-software)
5. [Part 4: Deploying Backend](#part-4-deploying-backend)
6. [Part 5: Deploying Frontend](#part-5-deploying-frontend)
7. [Part 6: Web Server Setup (Nginx)](#part-6-web-server-setup-nginx)
8. [Part 7: Making it Production-Ready](#part-7-making-it-production-ready)
9. [Part 8: Testing & Verification](#part-8-testing--verification)
10. [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

### Information You Need:
- ✅ **VM IP Address**: Example: `192.168.1.100`
- ✅ **Username**: Example: `ubuntu`, `root`, or custom username
- ✅ **Password**: Provided by your IT admin
- ✅ **MongoDB Connection String**: Either MongoDB Atlas URL or local MongoDB

### Software to Install on Windows:
1. **PuTTY** - For SSH connection
   - Download: https://www.putty.org/
   - Or: https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html

2. **WinSCP** (Optional - for file transfer)
   - Download: https://winscp.net/
   - Makes uploading files easier

---

## 🔌 Part 1: Connecting via PuTTY

### Step 1.1: Install and Launch PuTTY

1. Download PuTTY installer
2. Run the installer
3. Launch **PuTTY** from Start Menu

### Step 1.2: Configure PuTTY Session

1. **PuTTY Configuration Window Opens**

2. **Enter Connection Details**:
   ```
   Host Name (or IP address): 192.168.1.100  (your VM IP)
   Port: 22
   Connection type: SSH  (select this)
   ```

3. **Save Session** (Recommended):
   - Scroll down to "Saved Sessions"
   - Type a name: `PrajaShakthi-VM`
   - Click "Save"
   - Next time just double-click to connect!

4. **Click "Open"** button

### Step 1.3: First Connection Warning

**You'll see a security alert:**
```
The server's host key is not cached in the registry
```

- This is NORMAL for first-time connections
- Click **"Yes"** to trust and continue

### Step 1.4: Login

1. **Terminal window opens**, showing:
   ```
   login as:
   ```

2. **Type your username** (e.g., `ubuntu`) and press Enter

3. **Enter password**:
   - Type your password
   - **You won't see anything as you type** - this is normal for security!
   - Press Enter

4. **Success!** You should see:
   ```bash
   ubuntu@server:~$
   ```
   
   You're now connected to your VM! 🎉

---

## 🛠️ Part 2: Initial Server Setup

### Step 2.1: Update the System

Copy and paste these commands (right-click in PuTTY to paste):

```bash
# Update package lists
sudo apt update
```

Press Enter. If asked for password, type it again.

```bash
# Upgrade packages (may take 5-10 minutes)
sudo apt upgrade -y
```

Wait for it to complete.

### Step 2.2: Check System Info

```bash
# Check Ubuntu version
lsb_release -a

# Check disk space
df -h

# Check memory
free -h
```

**Note down**: How much disk space and RAM you have.

---

## 💿 Part 3: Installing Software

### Step 3.1: Install Node.js 22

```bash
# Add Node.js repository
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
```

Should show: `v22.x.x`

```bash
npm --version
```

Should show npm version number.

### Step 3.2: Install Git

```bash
# Install Git
sudo apt install -y git

# Verify
git --version
```

### Step 3.3: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify
pm2 --version
```

### Step 3.4: Install Nginx (Web Server)

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable auto-start on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

Press `q` to exit status view.

### Step 3.5: Test Nginx

Open browser on your computer and visit:
```
http://your-vm-ip
```

You should see "Welcome to nginx!" page.

---

## 📁 Part 4: Deploying Backend

### Step 4.1: Create Application Directory

```bash
# Create directory
sudo mkdir -p /var/www

# Go there
cd /var/www

# Clone your repository
sudo git clone https://github.com/thilina-dev22/PrajaShakthi-VDP-Form.git

# Check it downloaded
ls -la
```

You should see `PrajaShakthi-VDP-Form` folder.

### Step 4.2: Set Permissions

```bash
# Give yourself ownership
sudo chown -R $USER:$USER /var/www/PrajaShakthi-VDP-Form

# Set proper permissions
sudo chmod -R 755 /var/www/PrajaShakthi-VDP-Form
```

### Step 4.3: Install Backend Dependencies

```bash
# Go to backend folder
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend

# Install packages (takes 2-5 minutes)
npm install
```

Wait for installation to complete.

### Step 4.4: Create Backend Environment File

```bash
# Create .env file
nano .env
```

**Nano text editor opens. Type/paste this:**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prajashakthi?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_very_long_random_secret_key_at_least_32_characters
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://your-vm-ip
```

**IMPORTANT**: Replace:
- `MONGO_URI` with your actual MongoDB connection string
- `JWT_SECRET` with a secure random string
- `your-vm-ip` with your actual VM IP address

**To save in nano**:
1. Press `Ctrl + O` (letter O, not zero)
2. Press `Enter` to confirm
3. Press `Ctrl + X` to exit

### Step 4.5: Generate Secure JWT Secret (Optional)

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and update JWT_SECRET in your .env file:
```bash
nano .env
```

### Step 4.6: Test Backend

```bash
# Try starting backend
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: ...
```

**Press Ctrl+C** to stop (we'll use PM2 instead).

---

## 🎨 Part 5: Deploying Frontend

### Step 5.1: Navigate to Frontend

```bash
# Go to frontend folder
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend
```

### Step 5.2: Create Frontend Environment File

```bash
# Create .env file
nano .env
```

**Type this**:

```env
VITE_API_URL=http://your-vm-ip:5000
```

**Replace `your-vm-ip`** with your actual VM IP!

Example: `VITE_API_URL=http://192.168.1.100:5000`

**Save** (Ctrl+O, Enter, Ctrl+X)

### Step 5.3: Install Frontend Dependencies

```bash
# Install packages (takes 3-7 minutes)
npm install
```

### Step 5.4: Build Frontend for Production

```bash
# Build (takes 1-2 minutes)
npm run build
```

This creates a `dist` folder with optimized files.

```bash
# Check dist folder exists
ls -la dist/
```

You should see files like `index.html`, `assets`, etc.

---

## 🌐 Part 6: Web Server Setup (Nginx)

### Step 6.1: Create Nginx Configuration

```bash
# Create new site config
sudo nano /etc/nginx/sites-available/prajashakthi
```

**Paste this configuration** (update `your-vm-ip`):

```nginx
server {
    listen 80;
    server_name your-vm-ip;

    # Serve frontend static files
    location / {
        root /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static files
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
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Save** (Ctrl+O, Enter, Ctrl+X)

### Step 6.2: Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/prajashakthi /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t
```

Should say: `syntax is ok` and `test is successful`

### Step 6.3: Restart Nginx

```bash
# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

Should show "active (running)". Press `q` to exit.

### Step 6.4: Update Frontend .env

Now that Nginx proxies everything:

```bash
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend
nano .env
```

**Change to** (remove :5000 port):
```env
VITE_API_URL=http://your-vm-ip
```

**Save, then rebuild**:
```bash
npm run build
```

---

## 🚀 Part 7: Making it Production-Ready

### Step 7.1: Start Backend with PM2

```bash
# Go to backend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend

# Start with PM2
pm2 start server.js --name "prajashakthi-backend"

# Check status
pm2 status
```

You should see your app running!

### Step 7.2: Configure PM2 Auto-Start

```bash
# Save PM2 configuration
pm2 save

# Generate startup script
pm2 startup
```

**Copy and run the command shown**. It will look like:
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### Step 7.3: Configure Firewall

```bash
# Allow SSH (IMPORTANT!)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (for future)
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

Type `y` and press Enter when prompted.

```bash
# Check firewall status
sudo ufw status
```

### Step 7.4: Create Super Admin User

```bash
# Go to backend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend

# Run create admin script
node scripts/createSuperAdmin.js
```

Follow the prompts to create your first admin user!

---

## ✅ Part 8: Testing & Verification

### Step 8.1: Check Backend is Running

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs prajashakthi-backend --lines 50
```

Should show "Server running" and "MongoDB Connected".

### Step 8.2: Check Nginx

```bash
# Check Nginx status
sudo systemctl status nginx
```

Should be "active (running)".

### Step 8.3: Test from Browser

On your computer:

1. Open browser
2. Go to: `http://your-vm-ip`
3. You should see the login page!
4. Try logging in with super admin credentials
5. Open browser console (F12) → Network tab
6. Check API calls are working (no errors)

### Step 8.4: Verify Everything

**Checklist**:
- [ ] Login page loads
- [ ] Can login successfully
- [ ] No CORS errors in console
- [ ] Can navigate to different pages
- [ ] Forms work properly
- [ ] Data saves to database

---

## 🔧 Useful Commands

### PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs

# Restart backend
pm2 restart prajashakthi-backend

# Stop backend
pm2 stop prajashakthi-backend

# Monitor in real-time
pm2 monit
```

### Nginx Commands

```bash
# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### System Commands

```bash
# Check disk space
df -h

# Check memory
free -h

# Check running processes
htop  # Install with: sudo apt install htop
```

---

## 🔄 Updating Your Application

When you make code changes:

### Update Backend:

```bash
# Connect to VM via PuTTY
cd /var/www/PrajaShakthi-VDP-Form

# Pull latest code
git pull origin main

# Go to backend
cd PrajaShakthi-VDP-Form-backend

# Install new dependencies (if any)
npm install

# Restart with PM2
pm2 restart prajashakthi-backend

# Check logs
pm2 logs prajashakthi-backend
```

### Update Frontend:

```bash
# Go to frontend
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend

# Install new dependencies (if any)
npm install

# Rebuild
npm run build

# Nginx serves the new files automatically!
```

---

## 🐛 Troubleshooting

### Problem: Can't Connect with PuTTY

**Solutions**:
1. Verify VM IP address is correct
2. Check VM is running (contact admin)
3. Try pinging VM from Windows CMD: `ping 192.168.1.100`
4. Verify port 22 is allowed in firewall
5. Confirm your IP is whitelisted

### Problem: Permission Denied

**Solution**:
```bash
# Use sudo for system commands
sudo your-command-here
```

### Problem: Backend Won't Start

**Check logs**:
```bash
pm2 logs prajashakthi-backend
```

**Common issues**:
1. MongoDB connection - check MONGO_URI in .env
2. Port in use - change PORT in .env
3. Missing dependencies - run `npm install`

**Test manually**:
```bash
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend
node server.js
```

### Problem: Frontend Shows Blank Page

**Solutions**:
```bash
# Check if dist folder exists
ls -la /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend/dist/

# Rebuild if needed
cd /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend
npm run build

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Problem: API Calls Failing (CORS)

**Check**:
1. Backend .env has correct CORS_ORIGIN
2. Frontend .env has correct VITE_API_URL
3. Nginx proxies /api correctly

**Fix**:
```bash
# Edit backend .env
nano /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend/.env
```

Set: `CORS_ORIGIN=http://your-vm-ip`

Then restart:
```bash
pm2 restart prajashakthi-backend
```

### Problem: MongoDB Connection Failed

**For MongoDB Atlas**:
1. Check connection string is correct
2. Whitelist VM IP in MongoDB Atlas
3. Test connection: `ping cluster.mongodb.net`

**For Local MongoDB**:
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Start if stopped
sudo systemctl start mongodb
```

### Problem: Port Already in Use

```bash
# Find what's using port 5000
sudo lsof -i :5000

# Kill the process (replace PID)
sudo kill -9 PID

# Or change port in .env
```

---

## 📊 Monitoring

### Check Application Health

```bash
# PM2 status
pm2 status

# Real-time monitoring
pm2 monit

# View logs
pm2 logs
```

### Check System Resources

```bash
# Disk usage
df -h

# Memory usage
free -h

# Install and use htop
sudo apt install htop
htop
```

### View Logs

```bash
# Backend logs
pm2 logs prajashakthi-backend --lines 100

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 💾 Backup

### Backup Database

**For MongoDB Atlas**: Use built-in backup features

**For Local MongoDB**:
```bash
# Install MongoDB tools
sudo apt install mongodb-database-tools

# Backup
mongodump --db prajashakthi --out ~/backups/mongo-$(date +%Y%m%d)
```

### Backup Application

```bash
# Create backup
tar -czf ~/backups/app-backup-$(date +%Y%m%d).tar.gz /var/www/PrajaShakthi-VDP-Form
```

---

## 📞 Quick Reference

### Connection Info:
```
VM IP: your-vm-ip
SSH Port: 22
Backend Port: 5000 (internal)
Frontend Port: 80 (via Nginx)
```

### Important Paths:
```
Application: /var/www/PrajaShakthi-VDP-Form
Backend: /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-backend
Frontend: /var/www/PrajaShakthi-VDP-Form/PrajaShakthi-VDP-Form-frontend
Nginx Config: /etc/nginx/sites-available/prajashakthi
Logs: /var/log/nginx/
```

### Key Commands:
```bash
# PM2
pm2 status
pm2 logs
pm2 restart all

# Nginx
sudo systemctl status nginx
sudo systemctl restart nginx

# View logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

---

## ✅ Deployment Checklist

- [ ] Connected to VM via PuTTY
- [ ] Updated system packages
- [ ] Installed Node.js, Git, PM2, Nginx
- [ ] Cloned repository
- [ ] Created backend .env with MongoDB URI
- [ ] Created frontend .env with API URL
- [ ] Installed backend dependencies
- [ ] Installed frontend dependencies
- [ ] Built frontend
- [ ] Configured Nginx
- [ ] Started backend with PM2
- [ ] Configured PM2 auto-start
- [ ] Set up firewall
- [ ] Created super admin user
- [ ] Tested in browser
- [ ] Verified all features work

---

## 🎉 Success!

Your PrajaShakthi VDP Application is now deployed and running!

Access it at: `http://your-vm-ip`

**Next Steps**:
1. Set up SSL certificate (HTTPS) for production
2. Configure regular backups
3. Set up monitoring alerts
4. Document your admin credentials securely

---

**For questions, refer to troubleshooting section or contact your system administrator.**

**Created for**: PrajaShakthi VDP Project  
**Last Updated**: November 2025
