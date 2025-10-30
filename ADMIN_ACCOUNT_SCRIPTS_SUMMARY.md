# 🔑 Admin Account Reset Scripts - Summary

## ✅ What Was Created

### 3 New Scripts

1. **`resetAllAdminAccounts.js`** - Main script
   - Deletes all district admin and DS user accounts
   - Creates accounts for all 25 districts
   - Creates accounts for all DS divisions (331+)
   - Generates detailed credentials report

2. **`listAllAdminAccounts.js`** - Audit script
   - Lists all existing district admin accounts
   - Lists all existing DS user accounts
   - Shows summary statistics

3. **`README.md`** - Documentation
   - Complete usage guide
   - Step-by-step instructions
   - Troubleshooting tips

---

## 🚀 Quick Start

### To Reset All Accounts:

```bash
# Navigate to backend folder
cd PrajaShakthi-VDP-Form-backend

# Review existing accounts (optional)
node scripts/listAllAdminAccounts.js

# Reset all accounts
node scripts/resetAllAdminAccounts.js

# Check generated report
cat scripts/admin_accounts_report.json
```

---

## 📊 What Gets Created

### District Admin Accounts (25)
- One for each of Sri Lanka's 25 districts
- Username: `admin_[district]` (e.g., `admin_colombo`)
- Password: `District@123`
- Email: `admin_colombo@prajashakthi.lk`

### DS User Accounts (331+)
- One for each DS division in provincial_data.json
- Username: `ds_[district]_[ds_division]` (e.g., `ds_colombo_colombo`)
- Password: `DSUser@123`
- Email: `ds_colombo_colombo@prajashakthi.lk`

---

## 🔐 Security Features

1. ✅ Generated report (`admin_accounts_report.json`) contains all credentials
2. ✅ Report file added to `.gitignore` (never committed to Git)
3. ✅ Default passwords require change on first login
4. ✅ Super admin accounts are NOT affected by reset

---

## ⚠️ Important Notes

### Before Running:
- [ ] Backup your MongoDB database
- [ ] Review existing accounts with `listAllAdminAccounts.js`
- [ ] Ensure `provincial_data.json` is up to date

### After Running:
- [ ] Secure the `admin_accounts_report.json` file
- [ ] Distribute credentials to appropriate users
- [ ] Delete the report file after distribution
- [ ] Ensure all users change default passwords

---

## 📋 Example Report Output

```json
{
  "generatedAt": "2024-12-15T10:30:00.000Z",
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
    }
  ],
  "dsUsers": [
    {
      "district": "Colombo",
      "dsOffice": "Colombo",
      "username": "ds_colombo_colombo",
      "password": "DSUser@123",
      "email": "ds_colombo_colombo@prajashakthi.lk"
    }
  ]
}
```

---

## 🎯 Use Cases

### When to Use `resetAllAdminAccounts.js`:
- Initial system setup
- After updating provincial_data.json with new divisions
- When district/DS structure changes
- To standardize all account credentials
- During system maintenance/cleanup

### When to Use `listAllAdminAccounts.js`:
- Auditing current accounts
- Before running reset script
- Checking account status
- Generating reports for management

---

## 🔄 Integration with Validations

This script works perfectly with the new validation system:

1. **Max 25 District Admins** ✅
   - Script creates exactly 25 accounts (one per district)
   - Aligns with validation limit

2. **One District Admin Per District** ✅
   - Script ensures each district gets only one admin
   - Prevents validation errors

3. **One DS User Per DS Office** ✅
   - Script creates one account per DS division
   - Matches validation requirements

---

## 📈 Expected Results

After running `resetAllAdminAccounts.js`:

```
📊 Summary:
   - Deleted accounts: 356
   - District Admins created: 25
   - DS Users created: 331
   - Total new accounts: 356

🔑 Default Passwords:
   - District Admins: District@123
   - DS Users: DSUser@123
```

---

## 🎉 Benefits

1. **Consistency**: All accounts follow same naming convention
2. **Complete Coverage**: All districts and DS divisions get accounts
3. **Documentation**: Full credentials report generated
4. **Security**: Credentials never committed to Git
5. **Auditability**: Can list accounts anytime with `listAllAdminAccounts.js`
6. **Validation Compliance**: Meets all new validation requirements

---

## 📞 Next Steps

1. **Test the script** in development environment first
2. **Backup production database** before running in production
3. **Run the script** when ready
4. **Distribute credentials** to appropriate users
5. **Monitor** first logins and password changes
6. **Delete report file** after credentials distributed

---

*Created: December 2024*
*Ready to use immediately!*
