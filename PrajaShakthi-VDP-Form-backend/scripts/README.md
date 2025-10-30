# Admin Account Management Scripts

## 📋 Overview

This folder contains scripts to manage district admin and DS user accounts for the PrajaShakthi VDP Form system.

## 🔧 Available Scripts

### 1. `listAllAdminAccounts.js` - List Existing Accounts
**Purpose**: Display all existing district admin and DS user accounts

**Usage**:
```bash
node scripts/listAllAdminAccounts.js
```

**Output**:
- Lists all district admin accounts with details
- Lists all DS user accounts grouped by district
- Shows summary statistics

**When to use**:
- Before running the reset script to see what will be deleted
- To audit current accounts
- To check account status

---

### 2. `resetAllAdminAccounts.js` - Reset All Admin Accounts
**Purpose**: Delete all existing district admin and DS user accounts, then create new accounts for all 25 districts and their DS divisions

**Usage**:
```bash
node scripts/resetAllAdminAccounts.js
```

**What it does**:
1. ✅ Connects to MongoDB
2. 🗑️ Deletes ALL existing district admin and DS user accounts
3. 👤 Creates district admin accounts for all 25 districts
4. 👥 Creates DS user accounts for all DS divisions in provincial_data.json
5. 📄 Generates a detailed report (`admin_accounts_report.json`)

**Default Passwords**:
- District Admins: `District@123`
- DS Users: `DSUser@123`

**⚠️ WARNING**:
- This script will DELETE all existing district admin and DS user accounts
- Make sure you have a database backup before running
- Super admin accounts are NOT affected

---

### 3. `createSuperAdmin.js` - Create Super Admin
**Purpose**: Create the super admin account (run once during initial setup)

**Usage**:
```bash
node scripts/createSuperAdmin.js
```

**Default Credentials**:
- Username: `superadmin`
- Password: `Admin@123`

---

## 📖 Step-by-Step Guide

### First Time Setup

```bash
# Step 1: Create super admin
node scripts/createSuperAdmin.js

# Step 2: Create all district admins and DS users
node scripts/resetAllAdminAccounts.js

# Step 3: Check the generated report
cat scripts/admin_accounts_report.json
```

### Reset All Admin Accounts

```bash
# Step 1: Review existing accounts
node scripts/listAllAdminAccounts.js

# Step 2: Backup database (IMPORTANT!)
# Use your MongoDB backup method

# Step 3: Reset all accounts
node scripts/resetAllAdminAccounts.js

# Step 4: Verify the report
cat scripts/admin_accounts_report.json
```

---

## 📊 Generated Report Structure

The `resetAllAdminAccounts.js` script generates `admin_accounts_report.json`:

```json
{
  "generatedAt": "2024-12-XX...",
  "summary": {
    "totalDistricts": 25,
    "totalDSUsers": 331,
    "deletedAccounts": 356
  },
  "districtAdmins": [
    {
      "district": "Colombo",
      "username": "admin_colombo",
      "password": "District@123",
      "email": "admin_colombo@prajashakthi.lk",
      "dsOfficesCount": 13
    },
    ...
  ],
  "dsUsers": [
    {
      "district": "Colombo",
      "dsOffice": "Colombo",
      "username": "ds_colombo_colombo",
      "password": "DSUser@123",
      "email": "ds_colombo_colombo@prajashakthi.lk"
    },
    ...
  ]
}
```

---

## 🔑 Account Naming Convention

### District Admin Accounts
- **Username Format**: `admin_[district_name]`
- **Example**: `admin_colombo`, `admin_gampaha`, `admin_kandy`
- **Email**: `[username]@prajashakthi.lk`
- **Full Name**: `[District] District Administrator`

### DS User Accounts
- **Username Format**: `ds_[district]_[ds_division]`
- **Example**: `ds_colombo_colombo`, `ds_gampaha_gampaha`
- **Email**: `[username]@prajashakthi.lk`
- **Full Name**: `[DS Division] DS User`

**Note**: All special characters and spaces in names are converted to underscores

---

## 🌍 Coverage

### Districts (25)
The script creates district admin accounts for all 25 districts in Sri Lanka:
- Anuradhapura, Polonnaruwa, Matale, Kandy, Nuwara Eliya
- Galle, Matara, Hambantota, Jaffna, Kilinochchi
- Mannar, Vavuniya, Mullaitivu, Batticaloa, Ampara
- Trincomalee, Kurunegala, Puttalam, Ratnapura, Kegalle
- Colombo, Gampaha, Kalutara, Badulla, Monaragala

### DS Divisions (331+)
The script creates DS user accounts for all DS divisions found in `provincial_data.json`

---

## 🔒 Security Notes

1. **Default Passwords**: All accounts are created with default passwords
   - Users MUST change passwords after first login
   
2. **Report File**: `admin_accounts_report.json` contains all credentials
   - Keep this file SECURE
   - Do NOT commit to Git
   - Delete after distributing credentials
   
3. **Password Requirements**:
   - Default passwords meet basic security requirements
   - Users should set strong passwords on first login

---

## ⚠️ Important Warnings

1. **Database Backup**: Always backup your database before running `resetAllAdminAccounts.js`

2. **Super Admin Safety**: Super admin accounts are NOT affected by the reset script

3. **Active Submissions**: Deleting accounts does NOT delete their submissions
   - Existing submissions remain in the database
   - Historical data is preserved

4. **Git Ignore**: Make sure `admin_accounts_report.json` is in `.gitignore`

---

## 🐛 Troubleshooting

### Error: "Cannot find module '../models/UserModel'"
**Solution**: Make sure you're running the script from the backend root directory:
```bash
cd PrajaShakthi-VDP-Form-backend
node scripts/resetAllAdminAccounts.js
```

### Error: "provincial_data.json not found"
**Solution**: Ensure the frontend folder exists at the correct relative path:
```
PrajaShakthi-VDP-Form/
├── PrajaShakthi-VDP-Form-backend/
│   └── scripts/
└── PrajaShakthi-VDP-Form-frontend/
    └── src/data/provincial_data.json
```

### Error: "Duplicate key error"
**Solution**: Some accounts already exist. Either:
- Run `listAllAdminAccounts.js` to see existing accounts
- Delete specific accounts manually
- The script will skip duplicates and continue

---

## 📝 Example Output

```
✅ Connected to MongoDB

📊 Found 25 districts in provincial data

🗑️  STEP 1: Deleting existing accounts...
────────────────────────────────────────────────────────────────
✅ Deleted 356 existing accounts
   - District Admins and DS Users removed

👤 STEP 2: Creating District Admin accounts...
────────────────────────────────────────────────────────────────
✅ [1/25] Anuradhapura
   Username: admin_anuradhapura
   Email: admin_anuradhapura@prajashakthi.lk
   DS Divisions: 22

...

✅ Created 25 District Admin accounts

👥 STEP 3: Creating DS User accounts...
────────────────────────────────────────────────────────────────

📍 District: Anuradhapura (22 DS divisions)
  ✅ [1] Medawachchiya → ds_anuradhapura_medawachchiya
  ✅ [2] Horowpothana → ds_anuradhapura_horowpothana
  ...

✅ Created 331 DS User accounts

📋 STEP 4: Generating summary report...
────────────────────────────────────────────────────────────────
✅ Report saved to: /path/to/admin_accounts_report.json

════════════════════════════════════════════════════════════════
🎉 ACCOUNT RESET COMPLETE!
════════════════════════════════════════════════════════════════
📊 Summary:
   - Deleted accounts: 356
   - District Admins created: 25
   - DS Users created: 331
   - Total new accounts: 356

🔑 Default Passwords:
   - District Admins: District@123
   - DS Users: DSUser@123

⚠️  IMPORTANT:
   1. All users should change their passwords after first login
   2. Check admin_accounts_report.json for full credentials list
   3. Keep this report file secure!
════════════════════════════════════════════════════════════════
```

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review MongoDB connection settings in `.env`
3. Ensure all dependencies are installed: `npm install`
4. Check the error logs for specific issues

---

*Last Updated: December 2024*
