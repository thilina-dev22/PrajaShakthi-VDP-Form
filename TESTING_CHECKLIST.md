# RBAC System Testing Checklist

## 🧪 Complete Testing Guide

Use this checklist to verify all features of the RBAC system are working correctly.

## Pre-Testing Setup

- [ ] Backend server is running (`npm start` in backend folder)
- [ ] Frontend server is running (`npm run dev` in frontend folder)
- [ ] MongoDB is connected
- [ ] Super admin account created (`node scripts/createSuperAdmin.js`)
- [ ] Browser console is open (F12) to check for errors

## Phase 1: Super Admin Testing

### Login & Authentication
- [ ] Navigate to `http://localhost:5173`
- [ ] See login page
- [ ] Login with `superadmin` / `Admin@123`
- [ ] Successfully redirected to dashboard
- [ ] See "Super Admin" in top right corner
- [ ] No console errors

### Navigation (Super Admin)
- [ ] See "View Submissions" button
- [ ] See "User Management" button
- [ ] See "Activity Logs" button
- [ ] See logout button
- [ ] Do NOT see "Community Council Form" button

### User Management (Create District Admin)
- [ ] Click "User Management"
- [ ] See "Create District Admin" button
- [ ] Click "Create District Admin"
- [ ] Form appears with fields:
  - [ ] Username (required)
  - [ ] Password (required)
  - [ ] Full Name
  - [ ] Email
  - [ ] District (dropdown with all 24 districts)
- [ ] Fill form:
  - Username: `district_colombo`
  - Password: `Test@123`
  - Full Name: `Colombo District Admin`
  - Email: `colombo@test.lk`
  - District: Select "කොළඹ/ கொழும்பு/ Colombo"
- [ ] Click "Create User"
- [ ] See success message
- [ ] New user appears in the table
- [ ] User shows as "Active"

### Create Multiple District Admins
- [ ] Create at least 3 district admins for different districts
- [ ] Verify all appear in the list
- [ ] Verify district names are correct

### User Management (Actions)
- [ ] Click "Deactivate" on a user
- [ ] Status changes to "Inactive"
- [ ] Click "Activate" on the same user
- [ ] Status changes back to "Active"
- [ ] Create a test user to delete
- [ ] Click "Delete" on test user
- [ ] Confirm deletion dialog appears
- [ ] Confirm deletion
- [ ] User removed from list

### View All Submissions
- [ ] Click "View Submissions"
- [ ] See empty list or existing submissions
- [ ] No errors in console

### Activity Logs (Super Admin)
- [ ] Click "Activity Logs"
- [ ] See your login activity
- [ ] See user creation activities
- [ ] See filters: Action Type, Start Date, End Date
- [ ] Filter by action type "CREATE_USER"
- [ ] See only user creation logs
- [ ] Clear filters
- [ ] See all logs again
- [ ] Verify pagination works (if more than 50 logs)

### Logout
- [ ] Click logout button
- [ ] Redirected to login page
- [ ] Cannot access dashboard by going back

---

## Phase 2: District Admin Testing

### Login as District Admin
- [ ] Login with district admin credentials created earlier
  - Username: `district_colombo`
  - Password: `Test@123`
- [ ] Successfully logged in
- [ ] See "District Admin - <district name>" in top right

### Navigation (District Admin)
- [ ] See "View Submissions" button
- [ ] See "User Management" button
- [ ] See "Activity Logs" button
- [ ] Do NOT see options to create other District Admins

### User Management (Create DS User)
- [ ] Click "User Management"
- [ ] See "Create DS User" button
- [ ] Click "Create DS User"
- [ ] Form appears with:
  - [ ] Username (required)
  - [ ] Password (required)
  - [ ] Full Name
  - [ ] Email
  - [ ] District (auto-selected, cannot change)
  - [ ] Divisional Secretariat (dropdown)
- [ ] Verify district is pre-filled with your district
- [ ] Select a DS division from dropdown
- [ ] Fill form:
  - Username: `ds_colombo_kollupitiya`
  - Password: `Test@123`
  - Full Name: `Kollupitiya DS Officer`
  - Email: `kollupitiya@test.lk`
  - DS Division: Select one from dropdown
- [ ] Click "Create User"
- [ ] See success message
- [ ] New DS user appears in table

### Create Multiple DS Users
- [ ] Create at least 3 DS users for different divisions
- [ ] Verify all show correct DS division
- [ ] Verify all belong to your district

### Verify Restrictions
- [ ] Try to view only users from your district
- [ ] Cannot see users from other districts
- [ ] Cannot create District Admin accounts

### View District Submissions
- [ ] Click "View Submissions"
- [ ] Should see only submissions from your district
- [ ] If no submissions yet, list is empty

### Activity Logs (District Level)
- [ ] Click "Activity Logs"
- [ ] See only logs from your district
- [ ] See your login and user creation activities
- [ ] Do NOT see activities from other districts

### Logout
- [ ] Logout successfully
- [ ] Redirected to login page

---

## Phase 3: DS User Testing

### Login as DS User
- [ ] Login with DS user credentials
  - Username: `ds_colombo_kollupitiya`
  - Password: `Test@123`
- [ ] Successfully logged in
- [ ] See "DS User - <DS division>" in top right

### Navigation (DS User)
- [ ] See "Community Council Form" button
- [ ] See "My Submissions" button
- [ ] Do NOT see "User Management"
- [ ] Do NOT see "Activity Logs" (or only own logs)

### Create Submission
- [ ] Click "Community Council Form"
- [ ] Form loads correctly
- [ ] Fill in GN Division information
<!-- - [ ] Note: District and DS should be auto-populated -->
- [ ] Fill Community Council members
- [ ] Click "Submit"
- [ ] See success message

<!-- ### View Own Submissions
- [ ] Click "My Submissions"
- [ ] See the submission just created
- [ ] Verify all information is correct
- [ ] See created by your username

### Edit Own Submission
- [ ] Find edit button on submission
- [ ] Click edit
- [ ] Modify some fields
- [ ] Save changes
- [ ] See success message
- [ ] Changes reflected in submission list -->

### Create Multiple Submissions
- [ ] Create 2-3 more submissions
- [ ] Verify all appear in "My Submissions"
- [ ] Verify all show correct district and DS

### Delete Own Submission
- [ ] Click delete on a test submission
- [ ] Confirm deletion
- [ ] Submission removed from list

### Verify Restrictions
- [ ] Cannot see submissions from other DS users
- [ ] Cannot see "User Management"
- [ ] Cannot create other users

### Logout
- [ ] Logout successfully

---

## Phase 4: Cross-Role Testing

### District Admin Viewing Submissions
- [ ] Login as District Admin
- [ ] Navigate to submissions
- [ ] Should see ALL submissions from all DS users in the district
- [ ] Verify DS user's submissions appear here

### Super Admin Viewing Everything
- [ ] Login as Super Admin
- [ ] Navigate to submissions
- [ ] Should see submissions from ALL districts
- [ ] Navigate to users
- [ ] Should see all District Admins
- [ ] Should NOT see DS users (they belong to District Admins)
- [ ] Navigate to Activity Logs
- [ ] Should see ALL activities from all users

---

## Phase 5: Security Testing

### Authentication Required
- [ ] Logout from all accounts
- [ ] Try accessing `http://localhost:5173` (should show login)
- [ ] Try manually navigating (should require login)

### Role-Based Access
- [ ] Login as DS User
- [ ] Try to access user management (should not be available)
- [ ] Logout

- [ ] Login as District Admin
- [ ] Try to create another District Admin (should fail)
- [ ] Logout

- [ ] Login as Super Admin
- [ ] Try to create DS User directly (should not be available)

### Data Isolation
- [ ] Login as District Admin (Colombo)
- [ ] Verify you only see Colombo submissions
- [ ] Logout

- [ ] Login as District Admin (Kandy) if created
- [ ] Verify you only see Kandy submissions
- [ ] Verify you cannot see Colombo data

### Password Security
- [ ] Verify passwords are not visible in:
  - [ ] Browser console
  - [ ] Network tab (should be sent over HTTPS in production)
  - [ ] Database (should be hashed)

---

## Phase 6: Activity Logging Verification

### Verify All Actions Are Logged
- [ ] Login as Super Admin
- [ ] Go to Activity Logs
- [ ] Verify you see:
  - [ ] LOGIN events
  - [ ] LOGOUT events
  - [ ] CREATE_USER events
  - [ ] UPDATE_USER events (if you deactivated/activated users)
  - [ ] DELETE_USER events (if you deleted users)
  - [ ] CREATE_SUBMISSION events
  - [ ] UPDATE_SUBMISSION events (if you edited)
  - [ ] DELETE_SUBMISSION events (if you deleted)
  - [ ] VIEW_SUBMISSIONS events

### Check Log Details
- [ ] Each log shows:
  - [ ] Date and time
  - [ ] Username
  - [ ] User role
  - [ ] Action type
  - [ ] District (if applicable)
  - [ ] DS Division (if applicable)

---

## Phase 7: Error Handling

### Invalid Login
- [ ] Try login with wrong username
- [ ] See error message: "Invalid username or password"
- [ ] Try login with wrong password
- [ ] See same error message

### Duplicate Username
- [ ] As Super Admin, try creating District Admin with existing username
- [ ] See error: "Username already exists"

### Missing Required Fields
- [ ] Try creating user without username
- [ ] Form validation prevents submission
- [ ] Try creating user without password
- [ ] Form validation prevents submission

### Inactive Account
- [ ] As Super Admin, deactivate a District Admin
- [ ] Logout
- [ ] Try login with deactivated account
- [ ] See error: "Account is deactivated"
- [ ] Login as Super Admin again
- [ ] Reactivate the account

---

## Phase 8: UI/UX Testing

### Responsive Design
- [ ] Resize browser window to mobile size
- [ ] Navigation collapses appropriately
- [ ] Forms are usable on mobile
- [ ] Tables are scrollable/responsive

### Loading States
- [ ] When creating user, see "Creating..." on button
- [ ] When loading submissions, see "Loading..."
- [ ] No flickering or UI jumps

### Error Messages
- [ ] Errors display in red
- [ ] Success messages display in green
- [ ] Messages are clear and helpful

### Language Switching
- [ ] Switch between Sinhala, Tamil, English
- [ ] Text changes appropriately
- [ ] No broken translations

---

## Phase 9: Data Integrity

### Submission Ownership
- [ ] Verify createdBy field is set correctly
- [ ] Verify lastModifiedBy updates on edit
- [ ] Verify editHistory is maintained

### User Hierarchy
- [ ] Verify createdBy shows who created each user
- [ ] Verify district assignment is correct
- [ ] Verify DS division assignment is correct

---

## Phase 10: Performance

### Large Dataset
- [ ] Create 20+ submissions
- [ ] Verify list loads quickly
- [ ] Verify pagination works
- [ ] No performance degradation

### Multiple Users
- [ ] Have 3-4 users logged in from different browsers
- [ ] Verify no conflicts
- [ ] Each sees correct data

---

## Final Checklist

### Documentation
- [ ] README is up to date
- [ ] RBAC_IMPLEMENTATION_GUIDE.md is complete
- [ ] QUICK_START_RBAC.md is accurate

### Code Quality
- [ ] No console errors in browser
- [ ] No linter errors
- [ ] Code is properly commented

### Deployment Ready
- [ ] Environment variables configured
- [ ] Database backups set up
- [ ] CORS configured for production
- [ ] Default password changed

---

## 🎉 Testing Complete!

If all items are checked ✅, your RBAC system is fully functional and ready for production!

## 📝 Test Results

**Date Tested**: _______________
**Tested By**: _______________
**Result**: Pass ⃣ / Fail ⃣
**Notes**:
_____________________________
_____________________________
_____________________________
