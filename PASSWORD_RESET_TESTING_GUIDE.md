# Password Reset Feature - Testing Guide

## Quick Test Scenarios

### Test 1: DS User Self Password Reset
**Purpose:** Verify DS users can reset their own password

**Steps:**
1. Log in as a DS User
2. Click "Profile" button in navigation
3. Click "Reset Password" button
4. Enter current password: `[current_password]`
5. Enter new password: `newpass123`
6. Confirm new password: `newpass123`
7. Click "Reset Password"
8. Verify success message appears
9. Log out
10. Log in with new password
11. Verify login successful

**Expected Result:** ✅ Password reset successful, can log in with new password

---

### Test 2: District Admin Self Password Reset
**Purpose:** Verify District Admins can reset their own password

**Steps:**
1. Log in as a District Admin
2. Click "Profile" button in navigation
3. Click "Reset Password" button
4. Enter current password: `[current_password]`
5. Enter new password: `newpass456`
6. Confirm new password: `newpass456`
7. Click "Reset Password"
8. Verify success message appears
9. Log out
10. Log in with new password
11. Verify login successful

**Expected Result:** ✅ Password reset successful, can log in with new password

---

### Test 3: Super Admin Self Password Reset
**Purpose:** Verify Super Admins can reset their own password

**Steps:**
1. Log in as Super Admin
2. Click "Profile" button in navigation
3. Click "Reset Password" button
4. Enter current password: `[current_password]`
5. Enter new password: `newpass789`
6. Confirm new password: `newpass789`
7. Click "Reset Password"
8. Verify success message appears
9. Log out
10. Log in with new password
11. Verify login successful

**Expected Result:** ✅ Password reset successful, can log in with new password

---

### Test 4: Super Admin Resets District Admin Password
**Purpose:** Verify Super Admin can reset District Admin passwords

**Steps:**
1. Log in as Super Admin
2. Click "User Management" in navigation
3. Find a District Admin user in the table
4. Click "Reset Password" button for that user
5. Enter new password in prompt: `resetpass123`
6. Click OK
7. Verify success message appears
8. Log out
9. Log in as that District Admin with new password: `resetpass123`
10. Verify login successful

**Expected Result:** ✅ Password reset by admin successful, user can log in with new password

---

### Test 5: District Admin Resets DS User Password
**Purpose:** Verify District Admin can reset DS User passwords in their district

**Steps:**
1. Log in as District Admin
2. Click "User Management" in navigation
3. Find a DS User in the table (should only show users in same district)
4. Click "Reset Password" button for that user
5. Enter new password in prompt: `resetpass456`
6. Click OK
7. Verify success message appears
8. Log out
9. Log in as that DS User with new password: `resetpass456`
10. Verify login successful

**Expected Result:** ✅ Password reset by admin successful, user can log in with new password

---

### Test 6: Password Validation (Too Short)
**Purpose:** Verify password length validation works

**Steps:**
1. Log in as any user
2. Click "Profile" button
3. Click "Reset Password" button
4. Enter current password: `[current_password]`
5. Enter new password: `12345` (only 5 characters)
6. Confirm new password: `12345`
7. Click "Reset Password"
8. Verify error message: "Password must be at least 6 characters long"

**Expected Result:** ✅ Error message shown, password not changed

---

### Test 7: Password Mismatch
**Purpose:** Verify password confirmation validation works

**Steps:**
1. Log in as any user
2. Click "Profile" button
3. Click "Reset Password" button
4. Enter current password: `[current_password]`
5. Enter new password: `newpass123`
6. Confirm new password: `newpass456` (different)
7. Click "Reset Password"
8. Verify error message: "New password and confirm password do not match"

**Expected Result:** ✅ Error message shown, password not changed

---

### Test 8: Wrong Current Password
**Purpose:** Verify current password validation works

**Steps:**
1. Log in as any user
2. Click "Profile" button
3. Click "Reset Password" button
4. Enter current password: `wrongpassword`
5. Enter new password: `newpass123`
6. Confirm new password: `newpass123`
7. Click "Reset Password"
8. Verify error message: "Current password is incorrect"

**Expected Result:** ✅ Error message shown, password not changed

---

### Test 9: Permission Check - Super Admin Cannot Reset DS User
**Purpose:** Verify permission restrictions work

**Steps:**
1. Log in as Super Admin
2. Note: Super Admin should only see District Admins in User Management
3. Verify no DS Users are shown in the table

**Expected Result:** ✅ Only District Admins shown, no DS Users visible

---

### Test 10: Permission Check - District Admin Cannot Access Other District
**Purpose:** Verify district-based restrictions work

**Steps:**
1. Log in as District Admin (e.g., District A)
2. Click "User Management"
3. Verify only DS Users from District A are shown
4. Verify no DS Users from other districts are shown

**Expected Result:** ✅ Only DS Users from same district shown

---

### Test 11: Activity Logging
**Purpose:** Verify password reset actions are logged

**Steps:**
1. Log in as Super Admin
2. Reset a District Admin password (see Test 4)
3. Click "Activity Logs" in navigation
4. Look for recent log entry
5. Verify log shows:
   - Action: "RESET_USER_PASSWORD"
   - Username of admin who reset it
   - Target user whose password was reset
   - Timestamp

**Expected Result:** ✅ Activity logged correctly with all details

---

### Test 12: Profile Information Display
**Purpose:** Verify profile page shows correct user information

**Steps:**
1. Log in as DS User
2. Click "Profile" button
3. Verify displayed information:
   - Username is correct
   - Role shows "DS User"
   - District is correct
   - Divisional Secretariat is correct
   - Full Name is shown (if set)
   - Email is shown (if set)

**Expected Result:** ✅ All user information displayed correctly

---

### Test 13: Navigation Profile Button
**Purpose:** Verify profile button is visible and works

**Steps:**
1. Log in as any user
2. Look at navigation bar
3. Verify "Profile" button is visible
4. Click "Profile" button
5. Verify profile page loads

**Expected Result:** ✅ Profile button visible and functional

---

### Test 14: Cancel Password Reset
**Purpose:** Verify cancel button works

**Steps:**
1. Log in as any user
2. Click "Profile" button
3. Click "Reset Password" button
4. Fill in some fields
5. Click "Cancel" button
6. Verify form disappears
7. Verify no password change occurred

**Expected Result:** ✅ Form closed, no changes made

---

## Automated Test Script (Optional)

If you want to create automated tests, here's a template:

```javascript
describe('Password Reset Feature', () => {
  
  describe('Self Password Reset', () => {
    it('should allow DS user to reset own password', async () => {
      // Test 1 implementation
    });
    
    it('should validate password length', async () => {
      // Test 6 implementation
    });
    
    it('should validate password confirmation', async () => {
      // Test 7 implementation
    });
    
    it('should verify current password', async () => {
      // Test 8 implementation
    });
  });
  
  describe('Admin Password Reset', () => {
    it('should allow Super Admin to reset District Admin password', async () => {
      // Test 4 implementation
    });
    
    it('should allow District Admin to reset DS User password', async () => {
      // Test 5 implementation
    });
    
    it('should enforce permission restrictions', async () => {
      // Test 9 implementation
    });
    
    it('should log password reset activity', async () => {
      // Test 11 implementation
    });
  });
  
  describe('Profile Page', () => {
    it('should display user information correctly', async () => {
      // Test 12 implementation
    });
    
    it('should show profile button in navigation', async () => {
      // Test 13 implementation
    });
  });
});
```

---

## Test Results Template

Use this template to record your test results:

| Test # | Test Name | Date | Tester | Status | Notes |
|--------|-----------|------|--------|--------|-------|
| 1 | DS User Self Reset | | | ☐ | |
| 2 | District Admin Self Reset | | | ☐ | |
| 3 | Super Admin Self Reset | | | ☐ | |
| 4 | Super Admin Resets District Admin | | | ☐ | |
| 5 | District Admin Resets DS User | | | ☐ | |
| 6 | Password Too Short | | | ☐ | |
| 7 | Password Mismatch | | | ☐ | |
| 8 | Wrong Current Password | | | ☐ | |
| 9 | Permission Check - Super Admin | | | ☐ | |
| 10 | Permission Check - District Admin | | | ☐ | |
| 11 | Activity Logging | | | ☐ | |
| 12 | Profile Display | | | ☐ | |
| 13 | Profile Button | | | ☐ | |
| 14 | Cancel Reset | | | ☐ | |

---

## Report Issues

If any test fails, please document:
1. Test number and name
2. Steps taken
3. Expected result
4. Actual result
5. Error messages (if any)
6. Screenshots (if possible)
7. Browser and version
8. Date and time

Submit issues to the development team for resolution.
