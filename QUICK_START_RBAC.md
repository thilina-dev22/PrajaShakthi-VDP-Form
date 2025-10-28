# Quick Start Guide - RBAC System

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running
- Both frontend and backend environments configured

## Step-by-Step Setup

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd PrajaShakthi-VDP-Form-backend

# Install dependencies (if not already done)
npm install

# Create the Super Admin account
node scripts/createSuperAdmin.js

# Start the backend server
npm start
```

**Expected Output:**
```
✅ Super Admin created successfully!
Username: superadmin
Password: Admin@123
⚠️  IMPORTANT: Please change this password after first login!
Server running on port 5000
```

### 2. Frontend Setup (2 minutes)

```bash
# Navigate to frontend
cd PrajaShakthi-VDP-Form-frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

### 3. First Login

1. Open browser: `http://localhost:5173`
2. You'll see the Login page
3. Enter credentials:
   - Username: `superadmin`
   - Password: `Admin@123`
4. Click "Login"

### 4. Create District Admins

Once logged in as Super Admin:

1. Click **"User Management"** in the navigation
2. Click **"Create District Admin"**
3. Fill in the form:
   - **Username**: `district_colombo` (or any name)
   - **Password**: Create a secure password
   - **Full Name**: `Colombo District Administrator`
   - **Email**: `colombo@admin.lk`
   - **District**: Select from dropdown (e.g., "කොළඹ/ கொழும்பு/ Colombo")
4. Click **"Create User"**
5. Repeat for all 24 districts

**Sri Lanka's 24 Districts:**
1. Colombo
2. Gampaha
3. Kalutara
4. Kandy
5. Matale
6. Nuwara Eliya
7. Galle
8. Matara
9. Hambantota
10. Jaffna
11. Kilinochchi
12. Mannar
13. Vavuniya
14. Mullaitivu
15. Batticaloa
16. Ampara
17. Trincomalee
18. Kurunegala
19. Puttalam
20. Anuradhapura
21. Polonnaruwa
22. Badulla
23. Monaragala
24. Ratnapura
25. Kegalle

### 5. District Admin Creates DS Users

Log out and login as a District Admin:

1. Logout from Super Admin
2. Login with District Admin credentials
3. Click **"User Management"**
4. Click **"Create DS User"**
5. Fill in the form:
   - **Username**: `ds_colombo_kollupitiya`
   - **Password**: Secure password
   - **Full Name**: `Kollupitiya DS Officer`
   - **Email**: `kollupitiya@ds.lk`
   - **District**: (Auto-selected based on your district)
   - **Divisional Secretariat**: Select from dropdown
6. Click **"Create User"**

### 6. DS User Creates Submissions

Log in as a DS User:

1. Logout from District Admin
2. Login with DS User credentials
3. You'll see the **Community Council Form**
4. Fill in the form with GN Division data
5. Click **"Submit"**
6. View your submissions in **"My Submissions"**

## 📊 Dashboard Access

### Super Admin Dashboard
- **View Submissions**: All submissions from all districts
- **User Management**: Create/manage District Admins (24)
- **Activity Logs**: View all system activities

### District Admin Dashboard
- **View Submissions**: Submissions from their district only
- **User Management**: Create/manage DS Users in their district
- **Activity Logs**: View district activities

### DS User Dashboard
- **Community Council Form**: Create new submissions
- **My Submissions**: View/edit their own submissions

## 🔒 Security Notes

### Change Default Password
**IMPORTANT:** After first Super Admin login:
1. Go to Activity Logs (to verify you're logged in)
2. Use a database tool or create a password change feature
3. Update the password immediately

### Password Requirements
- Minimum 8 characters
- Include uppercase, lowercase, numbers recommended
- Change passwords every 90 days

## 🔍 Verify Installation

### Check Super Admin
```bash
# In MongoDB
db.users.findOne({ role: 'superadmin' })
```

### Check Activity Logs
```bash
# In MongoDB
db.activitylogs.find().sort({ createdAt: -1 }).limit(10)
```

## 📝 Common Tasks

### Create All 24 District Admins (Script)
You can create a script or do it manually through the UI.

### View All Users
Super Admin → User Management → See all District Admins

### View Activity Logs
Any Admin → Activity Logs → Filter by action/date

### Edit Submission
DS User → My Submissions → Click Edit → Make changes → Save

## 🐛 Troubleshooting

### Cannot Login
- Check MongoDB is running
- Check backend is running on port 5000
- Verify credentials
- Check browser console for errors

### Cannot Create Users
- Verify your role (Super Admin can only create District Admins)
- Check if username already exists
- Ensure all required fields are filled

### Cannot See Submissions
- DS Users: Only see their own
- District Admins: Only see their district
- Super Admin: Sees all

### Activity Logs Empty
- Perform some actions (login, create user, etc.)
- Refresh the page
- Check MongoDB connection

## 📞 Support

For issues:
1. Check the detailed `RBAC_IMPLEMENTATION_GUIDE.md`
2. Review error messages in browser console
3. Check backend logs
4. Verify MongoDB connection

## 🎯 Quick Reference

| Role | Can Create | Can View | Can Edit |
|------|-----------|----------|----------|
| Super Admin | District Admins | All submissions, all logs | All district admins |
| District Admin | DS Users (own district) | District submissions, district logs | Own DS users |
| DS User | Form submissions | Own submissions | Own submissions |

## ⚡ Next Steps

1. ✅ Create all 24 District Admin accounts
2. ✅ Have each District Admin create DS User accounts
3. ✅ DS Users start creating form submissions
4. ✅ Monitor activity logs regularly
5. ✅ Review and approve submissions

---

**Setup Complete!** You now have a fully functional three-tier RBAC system.
