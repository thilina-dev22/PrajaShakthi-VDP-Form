# Testing Guide: Community Council Form Updates

## Overview
This guide covers testing the updated Community Council form with the new table structure including NIC, Gender, and Permanent Address fields, along with fixed positions for rows 1-4.

---

## Prerequisites

### 1. Servers Running
Ensure both servers are running:

```powershell
# Terminal 1 - Frontend
cd PrajaShakthi-VDP-Form-frontend
npm run dev
# Frontend: http://localhost:5174/

# Terminal 2 - Backend
cd PrajaShakthi-VDP-Form-backend
npm start
# Backend: http://localhost:5000/
```

### 2. Test User Accounts
You need access to:
- **Super Admin** account (full access)
- **District Admin** account (district-level access)
- **DS User** account (division-level access)

---

## Test Cases

### ✅ Test 1: Form Structure Verification

**Objective:** Verify the new table structure is correct

**Steps:**
1. Navigate to http://localhost:5174/
2. Log in with any user role
3. Click on **"Community Council Info"** tab/form
4. Verify the table structure:

**Expected Results:**

#### Table 1: කාරක සභා සාමාජිකයින් (Committee Members - Rows 1-5)
- ✅ Row 1 - Position: **සභාපති / President** (Fixed, read-only, gray background)
- ✅ Row 2 - Position: **ලේකම් / Secretary** (Fixed, read-only, gray background)
- ✅ Row 3 - Position: **ග්‍රාම නිලධාරී / GN Officer** (Fixed, read-only, gray background)
- ✅ Row 4 - Position: **සමෘද්ධි සංවර්ධන නිලධාරි / Samurdhi Development Officer** (Fixed, read-only, gray background)
- ✅ Row 5 - Position: **Dropdown** with options:
  - කෘෂිකර්ම නිලධාරි (Agricultural Officer)
  - ධීවර සංවර්ධන නිලධාරි (Fisheries Officer)
  - ජලජ සංවර්ධන නිලධාරි (Aquaculture Officer)
  - වෙනත් (Other - with custom input)

#### All Tables Should Have These Columns:
- ✅ # (Row Number)
- ✅ Name
- ✅ Position (only in Table 1)
- ✅ Phone
- ✅ WhatsApp
- ✅ **NIC / හැඳුනුම්පත** (NEW)
- ✅ **Gender / ස්ත්‍රී පුරුෂ භාවය** (NEW - Dropdown)
- ✅ **Permanent Address / ස්ථිර ලිපිනය** (NEW - Textarea)
- ❌ Email column should NOT exist

---

### ✅ Test 2: Form Submission (New Data)

**Objective:** Submit a new form and verify all fields are saved

**Steps:**
1. Fill in location details:
   - District: Select any district
   - DS Division: Select a division
   - GN Division: Select a GN division

2. Fill in Committee Members (Rows 1-5):
   - **Row 1:**
     - Name: `Test President`
     - Position: (Auto-filled as "President" - cannot change)
     - Phone: `0711234567`
     - WhatsApp: `0711234567`
     - NIC: `123456789V`
     - Gender: Select `Male / පුරුෂ`
     - Permanent Address: `123 Main Street, Colombo`
   
   - **Row 2:**
     - Name: `Test Secretary`
     - Position: (Auto-filled as "Secretary" - cannot change)
     - Phone: `0722345678`
     - WhatsApp: `0722345678`
     - NIC: `987654321V`
     - Gender: Select `Female / ස්ත්‍රී`
     - Permanent Address: `456 Second Street, Kandy`
   
   - **Row 3:**
     - Name: `Test GN Officer`
     - Position: (Auto-filled as "GN Officer" - cannot change)
     - Phone: `0733456789`
     - WhatsApp: `0733456789`
     - NIC: `111222333V`
     - Gender: Select `Male / පුරුෂ`
     - Permanent Address: `789 Third Avenue, Galle`
   
   - **Row 4:**
     - Name: `Test Samurdhi Officer`
     - Position: (Auto-filled as "Samurdhi Development Officer" - cannot change)
     - Phone: `0744567890`
     - WhatsApp: `0744567890`
     - NIC: `444555666V`
     - Gender: Select `Female / ස්ත්‍රී`
     - Permanent Address: `321 Fourth Road, Matara`
   
   - **Row 5:**
     - Name: `Test Agricultural Officer`
     - Position: Select `කෘෂිකර්ම නිලධාරි (Agricultural Officer)` from dropdown
     - Phone: `0755678901`
     - WhatsApp: `0755678901`
     - NIC: `777888999V`
     - Gender: Select `Other / වෙනත්`
     - Permanent Address: `654 Fifth Lane, Jaffna`

3. Fill in Community Representatives (Rows 6-20) - At least 2 rows:
   - **Row 6:**
     - Name: `Community Rep 1`
     - Phone: `0766789012`
     - WhatsApp: `0766789012`
     - NIC: `123123123V`
     - Gender: Select `Male / පුරුෂ`
     - Permanent Address: `Community Area 1`
   
   - **Row 7:**
     - Name: `Community Rep 2`
     - Phone: `0777890123`
     - WhatsApp: `0777890123`
     - NIC: `456456456V`
     - Gender: Select `Female / ස්ත්‍රී`
     - Permanent Address: `Community Area 2`

4. Fill in Strategic Members (Rows 21-25) - At least 1 row:
   - **Row 21:**
     - Name: `Strategic Member 1`
     - Phone: `0788901234`
     - WhatsApp: `0788901234`
     - NIC: `789789789V`
     - Gender: Select `Male / පුරුෂ`
     - Permanent Address: `Strategic Location 1`

5. Click **Submit** button

**Expected Results:**
- ✅ Success message: "Form submitted successfully!"
- ✅ Form should reset or redirect
- ✅ No errors in browser console
- ✅ No errors in backend terminal

---

### ✅ Test 3: View Submission in Admin Panel

**Objective:** Verify submitted data appears correctly in admin view

**Steps:**
1. Log in as **Super Admin** (or any admin role)
2. Navigate to **"My Submissions"** or **"All Submissions"**
3. Click on **"Council Info Data"** tab
4. Find the submission you just created
5. Verify all fields are displayed:

**Expected Results:**

#### Table 1: කාරක සභා සාමාජිකයින් (1-5)
| # | Name | Position | Phone | WhatsApp | NIC | Gender | Permanent Address |
|---|------|----------|-------|----------|-----|--------|-------------------|
| 1 | Test President | President | 0711234567 | 0711234567 | 123456789V | Male / පුරුෂ | 123 Main Street, Colombo |
| 2 | Test Secretary | Secretary | 0722345678 | 0722345678 | 987654321V | Female / ස්ත්‍රී | 456 Second Street, Kandy |
| 3 | Test GN Officer | Grama Niladhari | 0733456789 | 0733456789 | 111222333V | Male / පුරුෂ | 789 Third Avenue, Galle |
| 4 | Test Samurdhi Officer | Samurdhi Development Officer | 0744567890 | 0744567890 | 444555666V | Female / ස්ත්‍රී | 321 Fourth Road, Matara |
| 5 | Test Agricultural Officer | කෘෂිකර්ම නිලධාරි | 0755678901 | 0755678901 | 777888999V | Other / වෙනත් | 654 Fifth Lane, Jaffna |

#### Table 2: ප්‍රජා නියෝජිතයින් කළඹයෝ (6-20)
| # | Name | Phone | WhatsApp | NIC | Gender | Permanent Address |
|---|------|-------|----------|-----|--------|-------------------|
| 6 | Community Rep 1 | 0766789012 | 0766789012 | 123123123V | Male / පුරුෂ | Community Area 1 |
| 7 | Community Rep 2 | 0777890123 | 0777890123 | 456456456V | Female / ස්ත්‍රී | Community Area 2 |

#### Table 3: උපාය මාර්ගික සාමාජිකයෝ (21-25)
| # | Name | Phone | WhatsApp | NIC | Gender | Permanent Address |
|---|------|-------|----------|-----|--------|-------------------|
| 21 | Strategic Member 1 | 0788901234 | 0788901234 | 789789789V | Male / පුරුෂ | Strategic Location 1 |

- ✅ All new fields (NIC, Gender, Permanent Address) should be visible
- ✅ Email column should NOT be present
- ✅ Data should match what was submitted

---

### ✅ Test 4: Edit Functionality

**Objective:** Verify editing works with new fields

**Steps:**
1. In the submission list, click **"Edit"** button on the test submission
2. Edit modal should open
3. Verify all fields are editable:
   - Name, Position, Phone, WhatsApp (existing)
   - **NIC** (text input - new)
   - **Gender** (dropdown - new)
   - **Permanent Address** (textarea - new)

4. Make changes:
   - Change Row 1 Gender from `Male` to `Female`
   - Change Row 1 NIC from `123456789V` to `999888777V`
   - Change Row 1 Permanent Address to `Updated Address 123`

5. Click **"Save Changes"**

**Expected Results:**
- ✅ Success message: "Submission updated successfully"
- ✅ Modal closes
- ✅ Changes are reflected in the submission list immediately
- ✅ Edit history is recorded (check "View History" button)

---

### ✅ Test 5: Export to Excel

**Objective:** Verify Excel export includes new fields

**Steps:**
1. In the submission list, click **"Export PDF"** button dropdown
2. Select **"Export to Excel"**
3. Download the Excel file
4. Open the file

**Expected Results:**
- ✅ Excel file downloads successfully
- ✅ Columns include:
  - Submission ID
  - District
  - DS Division
  - GN Division
  - Section
  - Row #
  - Name
  - Position
  - Phone
  - WhatsApp
  - **NIC** (NEW)
  - **Gender** (NEW)
  - **Permanent Address** (NEW)
  - Submitted
- ✅ Email column should NOT be present
- ✅ All data is correctly populated

---

### ✅ Test 6: Export to PDF

**Objective:** Verify PDF export includes new fields

**Steps:**
1. Click **"Export PDF"** button on a submission
2. PDF should download
3. Open the PDF file

**Expected Results:**
- ✅ PDF file opens successfully
- ✅ Headers include: #, Name, Position (Table 1 only), Phone, WhatsApp, **NIC**, **Gender**, **Address**
- ✅ All three tables are present:
  - Committee Members (1-5)
  - Community Representatives (6-20)
  - Strategic Members (21-25)
- ✅ Email column should NOT be present
- ✅ Data is properly formatted and readable

---

### ✅ Test 7: Role-Based Access (DS User)

**Objective:** Verify DS users see auto-populated fields and fixed positions

**Steps:**
1. Log out from admin account
2. Log in as **DS User**
3. Navigate to Community Council form

**Expected Results:**
- ✅ District field is **auto-populated** and **read-only** (locked)
- ✅ DS Division field is **auto-populated** and **read-only** (locked)
- ✅ GN Division field is editable dropdown with correct divisions
- ✅ Rows 1-4 positions are **fixed and read-only**
- ✅ Row 5 position has dropdown
- ✅ All new fields (NIC, Gender, Permanent Address) are visible and editable

---

### ✅ Test 8: Validation Testing

**Objective:** Verify form validation works correctly

**Steps:**
1. Try to submit form without filling any data
2. Try to submit with incomplete data (e.g., only Row 1 filled)
3. Try to submit with invalid phone numbers (e.g., `123`)
4. Try to skip rows (e.g., fill Row 1, skip Row 2, fill Row 3)

**Expected Results:**
- ✅ Form should NOT submit if required fields are empty
- ✅ Error messages should appear for invalid data
- ✅ Phone validation: Must be 10 digits starting with `07`
- ✅ Sequential validation: Cannot skip rows (Row 2 required if Row 3 is filled)
- ✅ Required fields for rows 1-5: Name, Position, Phone, WhatsApp, NIC, Gender, Permanent Address
- ✅ Required fields for rows 6-25: Name, Phone, WhatsApp, NIC, Gender, Permanent Address (no position)

---

### ✅ Test 9: Edit History Tracking

**Objective:** Verify edit history captures changes to new fields

**Steps:**
1. Edit a submission and change:
   - NIC from `123456789V` to `000111222V`
   - Gender from `Male` to `Female`
   - Permanent Address from `Old Address` to `New Address`
2. Save changes
3. Click **"View History"** button

**Expected Results:**
- ✅ Edit history modal opens
- ✅ Latest edit entry shows:
  - Edited by: (Your username)
  - Date/Time: (Current timestamp)
  - Changes: Details showing NIC, Gender, and Permanent Address changes
- ✅ All previous edits are preserved in chronological order

---

### ✅ Test 10: Multiple Browser/Device Testing

**Objective:** Verify responsive design and cross-browser compatibility

**Steps:**
1. Test on different browsers:
   - Google Chrome
   - Microsoft Edge
   - Firefox
   - Safari (if available)

2. Test on different screen sizes:
   - Desktop (1920x1080)
   - Laptop (1366x768)
   - Tablet (768px width)
   - Mobile (375px width)

**Expected Results:**
- ✅ Form renders correctly on all browsers
- ✅ Tables are horizontally scrollable on small screens
- ✅ All input fields are accessible and functional
- ✅ No layout breaking or overlapping elements
- ✅ Dropdowns work properly on mobile devices

---

### ✅ Test 11: Old Data Compatibility

**Objective:** Verify old submissions (before update) still display

**Steps:**
1. View old submissions created before the update
2. Check if they display without errors

**Expected Results:**
- ✅ Old submissions display without errors
- ✅ Old data shows in Name, Position, Phone, WhatsApp columns
- ✅ New columns (NIC, Gender, Permanent Address) show as **empty** for old data
- ✅ No broken layouts or missing tables
- ✅ Edit functionality still works (can add new fields to old submissions)

---

### ✅ Test 12: Activity Logs

**Objective:** Verify activity logs capture form submissions with new fields

**Steps:**
1. Log in as **Super Admin**
2. Navigate to **Activity Logs** page
3. Find the submission activity
4. Click to view details

**Expected Results:**
- ✅ Activity log entry exists for the submission
- ✅ Details show action type: "Form Submitted"
- ✅ Details include all new fields in readable format
- ✅ Timestamp is correct
- ✅ User information is captured

---

## Known Issues / Expected Behavior

### Old Submissions
- **Issue:** Old submissions show empty NIC, Gender, and Permanent Address columns
- **Reason:** These fields didn't exist when the data was submitted
- **Solution:** This is expected behavior. Old data can be edited to add the new information if needed.

### Email Field
- **Issue:** Old submissions may still have email data in the database
- **Status:** Email field is no longer displayed in the UI or available for editing
- **Impact:** No impact on functionality; old email data is simply ignored

---

## Test Result Checklist

Use this checklist to track your testing progress:

- [ ] Test 1: Form Structure Verification
- [ ] Test 2: Form Submission (New Data)
- [ ] Test 3: View Submission in Admin Panel
- [ ] Test 4: Edit Functionality
- [ ] Test 5: Export to Excel
- [ ] Test 6: Export to PDF
- [ ] Test 7: Role-Based Access (DS User)
- [ ] Test 8: Validation Testing
- [ ] Test 9: Edit History Tracking
- [ ] Test 10: Multiple Browser/Device Testing
- [ ] Test 11: Old Data Compatibility
- [ ] Test 12: Activity Logs

---

## Reporting Issues

If you find any bugs or unexpected behavior:

1. **Document the issue:**
   - What were you doing?
   - What did you expect to happen?
   - What actually happened?
   - Screenshot (if applicable)

2. **Check browser console:**
   - Press F12 to open Developer Tools
   - Check Console tab for errors
   - Copy error messages

3. **Check backend logs:**
   - Look at the terminal running the backend server
   - Check for error messages or warnings

4. **Create a bug report** with:
   - Test case number
   - Steps to reproduce
   - Expected vs actual results
   - Screenshots
   - Console/backend errors

---

## Success Criteria

The testing is successful if:

✅ All 12 test cases pass without critical errors
✅ New fields (NIC, Gender, Permanent Address) are saved and displayed correctly
✅ Fixed positions work for rows 1-4
✅ Row 5 dropdown works with custom input option
✅ Email column is completely removed from UI
✅ Export functions include new fields
✅ Edit functionality works with new fields
✅ Edit history tracks changes to new fields
✅ Old data displays without breaking the system
✅ Role-based access works (DS User auto-population)
✅ Validation prevents invalid submissions
✅ No console errors during normal operation

---

## Post-Testing Steps

After successful testing:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: Update Community Council form with NIC, Gender, and Permanent Address fields"
   ```

2. **Push to repository:**
   ```bash
   git push origin column-update-fix
   ```

3. **Create Pull Request** to merge into main branch

4. **Deploy to production** (if applicable)

5. **Notify stakeholders** of the new features

---

## Contact

If you need help during testing, contact the development team.

**Happy Testing! 🚀**
