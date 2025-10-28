# PrajaShakthi VDP Form - User Manual 📖

**Version**: 2.0.0  
**Last Updated**: October 28, 2025  
**Document Type**: Comprehensive User Guide

---

## 📑 Table of Contents

1. [Introduction](#-introduction)
2. [Getting Started](#-getting-started)
3. [User Roles Overview](#-user-roles-overview)
4. [DS User Guide](#-ds-user-guide-divisional-secretariat-user)
5. [District Admin Guide](#-district-admin-guide)
6. [Super Admin Guide](#-super-admin-guide)
7. [Community Council Form Guide](#-community-council-form-guide)
8. [Development Planning Form Guide](#-development-planning-form-guide)
9. [Viewing & Managing Submissions](#-viewing--managing-submissions)
10. [Export Features](#-export-features)
11. [Language Settings](#-language-settings)
12. [Troubleshooting](#-troubleshooting)
13. [FAQ](#-frequently-asked-questions)
14. [Support & Contact](#-support--contact)

---

## 📋 Introduction

### What is PrajaShakthi VDP Form?

The PrajaShakthi VDP (Village Development Plan) Form is a comprehensive digital platform designed to streamline community development planning and council management in Sri Lanka. The system supports:

- **Community Development Council** formation and member management
- **Development Planning** with sector-based proposals
- **Multi-level governance** with role-based access control
- **Trilingual support** (Sinhala, Tamil, English)
- **Data export** capabilities (Excel, PDF)

### System Benefits

✅ **Paperless Process**: Digital forms replace manual paperwork  
✅ **Centralized Database**: All data stored securely in one place  
✅ **Real-time Access**: Instant submission viewing and management  
✅ **Language Flexibility**: Switch between Sinhala, Tamil, and English  
✅ **Export Ready**: Generate reports in Excel and PDF formats  
✅ **Secure Access**: Role-based permissions ensure data security  

### Who Should Use This Manual?

- **DS Users**: Field officers who submit council and development forms
- **District Admins**: District-level administrators who manage submissions
- **Super Admins**: System administrators with full access

---

## 🚀 Getting Started

### Step 1: Access the System

1. **Open your web browser** (Chrome, Firefox, Edge, or Safari recommended)
2. **Navigate to the application URL** provided by your administrator
   - Example: `https://prajashakthi-vdp.vercel.app`
3. You will see the **Home Page** with language selection

### Step 2: Choose Your Language

At the top-right corner of the page, you'll see language options:
- **සිංහල** (Sinhala)
- **தமிழ்** (Tamil)
- **English**

Click your preferred language. The entire interface will update instantly.

### Step 3: Login (For Admin Users)

If you are a DS User, District Admin, or Super Admin:

1. Click **"Login"** or **"Log in as admin"** button
2. Enter your **Username** (provided by your administrator)
3. Enter your **Password**
4. Click **"Login"** button
5. You will be redirected to your dashboard

### Step 4: First-Time Login

**For DS Users (First Login):**
- You will see the form submission page
- Your District and DS Division will be pre-selected
- Start by selecting your GN Division

**For District Admins:**
- You will see the Admin Dashboard
- View all submissions from your district

**For Super Admins:**
- Full system access
- User management panel available

---

## 👥 User Roles Overview

### Role Comparison Table

| Feature | DS User | District Admin | Super Admin |
|---------|---------|----------------|-------------|
| **View Forms** | ✅ Own DS Division | ✅ Entire District | ✅ All Districts |
| **Submit Forms** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Edit Submissions** | ❌ No | ✅ Within District | ✅ All Submissions |
| **Delete Submissions** | ❌ No | ✅ Within District | ✅ All Submissions |
| **Export Data** | ❌ No | ✅ District Data | ✅ All Data |
| **Create Users** | ❌ No | ⚠️ DS Users Only | ✅ All User Types |
| **View Activity Logs** | ❌ No | ❌ No | ✅ Yes |
| **System Configuration** | ❌ No | ❌ No | ✅ Yes |

### Permission Details

#### DS User (Divisional Secretariat User)
- **Purpose**: Field-level data entry and submission
- **Scope**: Limited to assigned DS Division
- **Capabilities**:
  - Submit Community Council forms
  - Submit Development Planning forms
  - View own submissions only
- **Restrictions**:
  - Cannot edit or delete submissions
  - Cannot view other DS divisions' data
  - Cannot create users

#### District Admin
- **Purpose**: District-level management and oversight
- **Scope**: All DS Divisions within assigned district
- **Capabilities**:
  - All DS User capabilities
  - View all submissions in the district
  - Edit submissions within the district
  - Delete submissions within the district
  - Export district data to Excel/PDF
  - Create DS Users for the district
- **Restrictions**:
  - Cannot access other districts' data
  - Cannot create District Admins or Super Admins
  - Cannot view system-wide activity logs

#### Super Admin
- **Purpose**: System-wide administration
- **Scope**: Entire system across all districts
- **Capabilities**:
  - All District Admin capabilities
  - Access all districts and DS divisions
  - Create all user types (DS User, District Admin, Super Admin)
  - View system-wide activity logs
  - Delete users
  - System configuration and maintenance
- **Restrictions**: None

---

## 📝 DS User Guide (Divisional Secretariat User)

### Your Dashboard

When you log in as a DS User, you will see:

1. **Navigation Menu** with options:
   - Community Development Council
   - Development Planning (if enabled)
   - View My Submissions
   - Logout

2. **Pre-filled Location**:
   - Your District is automatically selected
   - Your DS Division is automatically selected
   - You only need to select the GN Division

### Submitting a Community Council Form

Follow these steps to submit a council form:

#### Step 1: Select Location

1. **GN Division**: Click the dropdown and select your Grama Niladhari Division
   - The list shows only GN Divisions in your DS Division

#### Step 2: Fill Committee Members (Rows 1-5)

These are the core committee members with **fixed positions**:

| Row | Position | Required Fields |
|-----|----------|----------------|
| 1 | President | Name, Phone, WhatsApp, NIC, Gender, Address |
| 2 | Secretary | Name, Phone, WhatsApp, NIC, Gender, Address |
| 3 | Grama Niladhari | Name, Phone, WhatsApp, NIC, Gender, Address |
| 4 | Samurdhi Development Officer | Name, Phone, WhatsApp, NIC, Gender, Address |
| 5 | Choose from dropdown | Name, Phone, WhatsApp, NIC, Gender, Address |

**Row 5 Position Options:**
- Agricultural Research Production Assistant
- Fisheries Officer
- Aquaculture Extension Officer
- Other

**Field Guidelines:**

- **Name**: Full name in Sinhala, Tamil, or English
- **Position**: Auto-filled for rows 1-4, dropdown for row 5
- **Phone Number**: 
  - Must start with `07`
  - Total 10 digits
  - Example: `0771234567`
- **WhatsApp Number**: Same format as phone number
- **NIC**: 
  - Old format: `123456789V` or `123456789X`
  - New format: `200012345678` (12 digits)
- **Gender**: Select from dropdown
  - Male
  - Female
  - Other
- **Permanent Address**: Complete residential address

⚠️ **Important**: All fields are mandatory for rows 1-5. You cannot submit if any field is empty.

#### Step 3: Fill Community Representatives (Rows 6-20)

These are community members representing various groups:

- **Fields**: Name, Phone, WhatsApp, NIC, Gender, Permanent Address
- **Position**: Not required (you can leave it blank)
- **Sequential Filling**: Fill rows in order (6, 7, 8...). Don't skip rows.
- **Optional**: You can fill as few as 1 or as many as 15 members

**Example**:
```
Row 6: ✅ Filled
Row 7: ✅ Filled
Row 8: ❌ Empty  ← Must fill this before row 9
Row 9: Cannot fill yet
```

#### Step 4: Fill Strategic Members (Rows 21-25)

Similar to Community Representatives:

- **Fields**: Same as rows 6-20
- **Maximum**: 5 strategic members
- **Sequential**: Fill 21, 22, 23, 24, 25 in order

#### Step 5: Review and Submit

1. **Review all entries** for accuracy
2. **Check phone numbers** (must start with 07)
3. **Verify NIC numbers** are correct
4. Click **"Submit"** button
5. Wait for **success message**
6. Your form is now submitted and visible to admins

### Validation Errors

If you see errors, check:

- ❌ **"Invalid phone number format"**: Phone must be 10 digits starting with 07
- ❌ **"[Field] is required"**: Fill all mandatory fields in rows 1-5
- ❌ **"Please fill rows in sequential order"**: Don't skip rows
- ❌ **"Please select GN Division"**: Choose your GN Division from dropdown

### Tips for DS Users

✅ **Prepare Data**: Collect all member information before starting  
✅ **Use Copy-Paste**: You can paste from Excel for faster entry  
✅ **Check Spelling**: Names will appear in official reports  
✅ **Save Draft**: The system does not auto-save; complete in one session  
✅ **Submit Early**: Don't wait until the deadline  
✅ **Keep Records**: Take a screenshot after successful submission  

---

## 👨‍💼 District Admin Guide

### Your Dashboard

As a District Admin, you have access to:

1. **Navigation Menu**:
   - Community Development Council Form
   - Development Planning Form
   - **Admin Dashboard** (View/Edit/Delete submissions)
   - **User Management** (Create DS Users)
   - Activity Logs
   - Logout

2. **Admin Dashboard Tabs**:
   - Council Info (Community Council submissions)
   - Main Form (Development Planning submissions)

### Viewing Submissions

#### Step 1: Navigate to Admin Dashboard

Click **"Admin Dashboard"** or **"Submission List"** in the menu.

#### Step 2: Choose Tab

- **Council Info**: View all Community Council submissions
- **Main Form**: View all Development Planning submissions

#### Step 3: Apply Filters

Use the filter panel at the top:

1. **District**: Pre-selected to your district (cannot change)
2. **DS Division**: Filter by specific DS Division (optional)
3. **GN Division**: Filter by specific GN Division (optional)

Click **"Search"** or filters apply automatically.

#### Step 4: View Submission Details

Each submission shows:

- **District, DS Division, GN Division**: Location information
- **Submitted At**: Date and time of submission
- **Submitted By**: Username of the submitter
- **Actions**: View, Edit, Delete buttons

### Editing Submissions

#### Step 1: Click "Edit" Button

- The edit modal will open with all form data

#### Step 2: Make Changes

**Editable Fields:**
- ✅ Name
- ✅ Phone Number
- ✅ WhatsApp Number
- ✅ NIC
- ✅ Gender
- ✅ Permanent Address
- ✅ Position (Row 5 dropdown; Rows 1-4 are fixed)

**Non-Editable Fields:**
- ❌ District (locked)
- ❌ DS Division (locked)
- ❌ GN Division (locked)
- ❌ Position for rows 1-4 (fixed values)

#### Step 3: Save Changes

1. Make your edits
2. Click **"Save Changes"** button
3. Wait for confirmation message
4. The edit is now logged with your username and timestamp

### Deleting Submissions

⚠️ **Warning**: Deletion is permanent and cannot be undone.

#### Step 1: Click "Delete" Button

- You'll see a confirmation prompt

#### Step 2: Confirm Deletion

- Click **"OK"** to confirm
- Click **"Cancel"** to abort

The submission will be permanently removed from the database.

### Exporting Data

#### Export to Excel

1. **Apply filters** to select data range (optional)
2. Click **"Export to Excel"** button
3. File downloads as `council_submissions_[timestamp].xlsx`
4. Open with Microsoft Excel, Google Sheets, or LibreOffice

**Excel File Contents:**
- **Committee Members** sheet (Rows 1-5)
- **Community Representatives** sheet (Rows 6-20)
- **Strategic Members** sheet (Rows 21-25)
- All fields included: Name, Position, Phone, WhatsApp, NIC, Gender, Address

#### Export to PDF

1. **Select a specific submission** you want to export
2. Click **"Export PDF"** button for that submission
3. File downloads as `council_info_[gnDivision]_[timestamp].pdf`

**PDF File Contents:**
- Header with District, DS Division, GN Division
- **Committee Members** table
- **Community Representatives** table
- **Strategic Members** table
- Unicode support for Sinhala (සිංහල) and Tamil (தமிழ்) names

### Creating DS Users

#### Step 1: Navigate to User Management

Click **"User Management"** in the navigation menu.

#### Step 2: Click "Create New User"

A form will appear with the following fields:

#### Step 3: Fill User Details

1. **Username**: 
   - Must be unique
   - 4-20 characters
   - Example: `ds_user_colombo_1`

2. **Password**: 
   - Minimum 8 characters
   - Use a strong password
   - Share securely with the user

3. **Full Name**: 
   - User's complete name
   - Example: `Kasun Perera`

4. **Email**: 
   - Valid email address
   - Example: `kasun.perera@example.com`

5. **District**: 
   - Automatically set to your district
   - Cannot select other districts

6. **Divisional Secretariat**: 
   - Select the DS Division from dropdown
   - User will only have access to this DS Division

#### Step 4: Submit

1. Review all fields
2. Click **"Create User"** button
3. User is created immediately
4. Share credentials with the new user **securely**

### Managing Existing Users

In the User Management page, you can:

- **View all users** in your district
- **See user details**: Username, role, district, DS Division
- **Delete users** you created (DS Users only)

⚠️ **Note**: You cannot delete District Admins or Super Admins.

### Best Practices for District Admins

✅ **Regular Monitoring**: Check submissions daily during peak periods  
✅ **Quality Control**: Review and edit submissions for accuracy  
✅ **Timely Exports**: Generate reports regularly for your records  
✅ **User Management**: Create users only when officially requested  
✅ **Secure Passwords**: Use strong passwords and share securely  
✅ **Document Changes**: Keep notes when editing submissions  
✅ **Backup Data**: Export to Excel weekly for backup  

---

## 🔐 Super Admin Guide

### Full System Access

As a Super Admin, you have unrestricted access to:

1. **All Districts**: No geographical limitations
2. **All User Types**: Create Super Admins, District Admins, DS Users
3. **Activity Logs**: System-wide action tracking
4. **System Configuration**: Advanced settings and maintenance

### Dashboard Overview

Your navigation menu includes:

- Community Development Council Form
- Development Planning Form
- **Admin Dashboard** (All submissions nationwide)
- **User Management** (All user types)
- **Activity Logs** (System-wide tracking)
- Logout

### Viewing All Submissions

#### Step 1: Access Admin Dashboard

Click **"Admin Dashboard"** from the menu.

#### Step 2: Filter by District (Optional)

Unlike District Admins, you can:

1. **Leave filters blank**: View all submissions nationwide
2. **Select specific district**: View only that district
3. **Drill down**: District → DS Division → GN Division

#### Step 3: Manage Submissions

You can:

- ✅ **View** any submission
- ✅ **Edit** any submission (all fields except location)
- ✅ **Delete** any submission
- ✅ **Export** filtered or all data

### Creating Users (All Roles)

#### Creating a Super Admin

⚠️ **Warning**: Super Admins have full system access. Create sparingly.

1. Navigate to **User Management**
2. Click **"Create New User"**
3. Fill in details:
   - **Username**: Choose carefully (cannot be changed)
   - **Password**: Strong password (minimum 8 characters)
   - **Full Name**: Official name
   - **Email**: Valid email address
   - **Role**: Select **"Super Admin"**
   - **District**: Leave blank (not applicable)
   - **DS Division**: Leave blank (not applicable)
4. Click **"Create User"**

#### Creating a District Admin

1. Navigate to **User Management**
2. Click **"Create New User"**
3. Fill in details:
   - **Username**: Example: `admin_colombo`
   - **Password**: Strong password
   - **Full Name**: Admin's full name
   - **Email**: Valid email
   - **Role**: Select **"District Admin"**
   - **District**: **Required** - Select from dropdown
   - **DS Division**: Leave blank
4. Click **"Create User"**

**Note**: The District Admin will only have access to the selected district.

#### Creating a DS User

1. Navigate to **User Management**
2. Click **"Create New User"**
3. Fill in details:
   - **Username**: Example: `ds_colombo_division1`
   - **Password**: Strong password
   - **Full Name**: User's full name
   - **Email**: Valid email
   - **Role**: Select **"DS User"**
   - **District**: **Required**
   - **DS Division**: **Required**
4. Click **"Create User"**

### Viewing Activity Logs

Activity logs track all system actions for audit purposes.

#### Step 1: Navigate to Activity Logs

Click **"Activity Logs"** in the navigation menu.

#### Step 2: Filter Logs

Available filters:

1. **Action Type**:
   - CREATE_SUBMISSION
   - UPDATE_SUBMISSION
   - DELETE_SUBMISSION
   - LOGIN
   - LOGOUT
   - CREATE_USER
   - DELETE_USER

2. **User**: Filter by specific username

3. **Date Range**: Start and end dates

4. **Limit**: Number of logs to display (default: 100)

#### Step 3: Review Logs

Each log entry shows:

- **Timestamp**: Date and time of action
- **Action**: Type of action performed
- **User**: Username who performed the action
- **Details**: Additional information (submission ID, district, etc.)
- **IP Address**: Source IP address

### Deleting Users

⚠️ **Warning**: Deleting users is permanent. Their submissions remain, but they cannot log in.

#### Step 1: Navigate to User Management

View the list of all users in the system.

#### Step 2: Find the User

Use filters or scroll to find the user to delete.

#### Step 3: Click "Delete"

1. Click the **"Delete"** button next to the user
2. Confirm deletion in the prompt
3. User is immediately removed

**Impact**:
- User cannot log in anymore
- Their past submissions remain in the database
- Their username is freed for reuse

### System Maintenance

#### Database Backup

Regularly export all data:

1. Go to Admin Dashboard
2. **Clear all filters** (to get all data)
3. Click **"Export to Excel"**
4. Save file with date: `backup_YYYYMMDD.xlsx`
5. Store securely (cloud storage, external drive)

**Recommended**: Weekly backups

#### User Cleanup

Periodically review users:

1. Navigate to User Management
2. Identify inactive users (check Activity Logs)
3. Delete or disable inactive accounts

#### Performance Monitoring

Monitor system performance:

1. Check submission count in Activity Logs
2. Watch for slow load times
3. Report issues to technical team

### Super Admin Best Practices

✅ **Limit Super Admins**: Only create when absolutely necessary  
✅ **Strong Passwords**: Enforce 12+ character passwords  
✅ **Regular Backups**: Export all data weekly  
✅ **Monitor Activity**: Review logs for suspicious actions  
✅ **User Audits**: Quarterly review of all users  
✅ **Secure Credentials**: Never share Super Admin passwords  
✅ **Document Changes**: Keep notes of system-wide changes  
✅ **Test First**: Test new features in a safe environment  

---

## 📋 Community Council Form Guide

### Form Structure

The Community Council Form has **25 rows** divided into three sections:

#### Section 1: Committee Members (Rows 1-5)

**Purpose**: Core leadership team of the council

| Row | Position | Status |
|-----|----------|--------|
| 1 | President | Fixed |
| 2 | Secretary | Fixed |
| 3 | Grama Niladhari | Fixed |
| 4 | Samurdhi Development Officer | Fixed |
| 5 | Selected from dropdown | Dropdown |

**All fields mandatory**: Name, Position, Phone, WhatsApp, NIC, Gender, Permanent Address

#### Section 2: Community Representatives (Rows 6-20)

**Purpose**: Representatives from community groups

- **Total Slots**: 15 members
- **Position**: Optional (can be left blank)
- **Fields**: Name, Phone, WhatsApp, NIC, Gender, Permanent Address
- **Flexibility**: Fill as many or as few as needed

#### Section 3: Strategic Members (Rows 21-25)

**Purpose**: Key stakeholders and advisors

- **Total Slots**: 5 members
- **Similar to Section 2**: Position optional
- **Fields**: Same as Community Representatives

### Field Descriptions

#### 1. Name (නම / பெயர் / Name)

- **Format**: Full legal name
- **Languages**: Sinhala, Tamil, or English accepted
- **Example**: 
  - `සමන් කුමාර පෙරේරා`
  - `குமார் பெரேரா`
  - `Saman Kumara Perera`
- **Tips**: 
  - Use consistent spelling
  - Include middle names if official
  - Unicode characters supported

#### 2. Position (තනතුර / நிலை / Position)

- **Rows 1-4**: Auto-filled (cannot edit during submission)
- **Row 5**: Select from dropdown
  - Agricultural Research Production Assistant
  - Fisheries Officer
  - Aquaculture Extension Officer
  - Other
- **Rows 6-25**: Optional (can leave blank)

#### 3. Phone Number (දුරකථන අංකය / தொலைபேசி எண் / Phone)

- **Format**: Sri Lankan mobile number
- **Pattern**: `07XXXXXXXX` (10 digits total)
- **Examples**:
  - ✅ `0771234567`
  - ✅ `0712345678`
  - ❌ `771234567` (missing 0)
  - ❌ `+94771234567` (no +94)
  - ❌ `0112345678` (landline not accepted)
- **Validation**: Must start with `07`

#### 4. WhatsApp Number (වට්ස්ඇප් අංකය / வாட்ஸ்அப் எண் / WhatsApp)

- **Format**: Same as phone number
- **Can be same**: Often the same as phone number
- **Copy allowed**: You can copy phone number to WhatsApp field
- **Pattern**: `07XXXXXXXX`

#### 5. NIC (ජාතික හැඳුනුම්පත් අංකය / தேசிய அடையாள அட்டை / NIC)

National Identity Card number in either format:

**Old Format** (10 characters):
- 9 digits + V or X
- Example: `123456789V` or `123456789X`

**New Format** (12 digits):
- Year (4 digits) + Day (3 digits) + Serial (5 digits)
- Example: `200012345678`

**Validation**:
- ✅ `912345678V`
- ✅ `912345678X`
- ✅ `199212345678`
- ❌ `91234567` (too short)
- ❌ `91234567VA` (invalid characters)

#### 6. Gender (ස්ත්‍රී පුරුෂ භාවය / பாலினம் / Gender)

Select from dropdown:
- **Male** (පුරුෂ / ஆண்)
- **Female** (ස්ත්‍රී / பெண்)
- **Other** (වෙනත් / பிற)

#### 7. Permanent Address (ස්ථීර ලිපිනය / நிரந்தர முகவரி / Permanent Address)

- **Format**: Complete residential address
- **Include**: 
  - House number/name
  - Street/Road name
  - Village/Town
  - Postal code (optional)
- **Example**:
  ```
  123/A, Main Street,
  Colombo 07
  ```
- **Languages**: Any language accepted
- **Length**: No character limit

### Filling Tips

#### Before You Start

1. ✅ **Collect Data**: Gather all member information
2. ✅ **Verify Numbers**: Double-check phone numbers
3. ✅ **Prepare NIC**: Have NIC numbers ready
4. ✅ **Stable Connection**: Ensure good internet connection

#### During Entry

1. ✅ **Sequential Order**: Fill rows 1, 2, 3... without skipping
2. ✅ **Copy-Paste**: Use Excel data if available
3. ✅ **Save Progress**: No auto-save; complete in one session
4. ✅ **Check Validation**: Fix red error messages immediately

#### After Submission

1. ✅ **Screenshot**: Take confirmation screenshot
2. ✅ **Record ID**: Note submission ID if provided
3. ✅ **Notify Admin**: Inform your supervisor
4. ✅ **Follow-up**: Check for approval/edits

### Common Mistakes

❌ **Skipping Rows**: Filling row 7 before row 6  
❌ **Wrong Phone Format**: Using landline numbers  
❌ **Incomplete NIC**: Missing last character in old format  
❌ **Missing Fields**: Leaving mandatory fields empty in rows 1-5  
❌ **Different Languages**: Mixing Sinhala and English in one form  

### Validation Messages

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Invalid phone number format" | Phone doesn't start with 07 | Enter 10-digit number starting with 07 |
| "[Field] is required" | Mandatory field empty | Fill the highlighted field |
| "Please fill rows in sequential order" | Gap in row numbers | Fill missing row first |
| "Please select GN Division" | Location not selected | Choose GN Division from dropdown |

---

## 🏗️ Development Planning Form Guide

### Form Overview

The Development Planning Form collects:

1. **Location Details**: District, DS Division, GN Division
2. **Sector Selection**: Multi-level sector hierarchy
3. **Problem Analysis**: Current issues and challenges
4. **Proposals**: Solutions with cost estimates and agencies

### Step-by-Step Guide

#### Step 1: Select Location

1. **District**: Select from dropdown (or pre-filled for DS Users)
2. **DS Division**: Select from dropdown (or pre-filled)
3. **GN Division**: Choose your Grama Niladhari Division

#### Step 2: Choose Development Sector

The system uses a **4-level hierarchy**:

**Level 1: Main Sector**
- Agriculture and Rural Development
- Infrastructure and Transport
- Education and Skills Development
- Health and Social Welfare
- Environment and Natural Resources
- Economic Development
- Tourism and Culture
- Technology and Innovation

**Level 2: Sub-Category**
- Appears after selecting main sector
- Example: Under "Agriculture" → "Crop Production", "Livestock", "Irrigation"

**Level 3: Sub-Sub-Category**
- Appears after selecting sub-category
- Example: Under "Crop Production" → "Rice Farming", "Vegetable Cultivation"

**Level 4: Sub-Sub-Sub-Category**
- Appears after selecting sub-sub-category
- Most specific level

**Navigation**:
- Select each level in sequence
- Click "Reset" to start over
- Dropdowns update dynamically

#### Step 3: Describe Problems

A table appears based on your sector selection.

**Fields**:
- **Problem Description**: Describe the current issue
- **Impact**: Explain how it affects the community
- **Priority**: High, Medium, Low

**Example**:
```
Problem: Lack of irrigation for paddy fields
Impact: Crop yield reduced by 40%
Priority: High
```

#### Step 4: Add Proposals

For each problem, add one or more proposals.

**Fields**:

1. **Proposal**: 
   - Detailed description of the solution
   - Example: "Construct new irrigation canal from main reservoir"

2. **Estimated Cost**: 
   - Budget in LKR
   - Example: `5000000` (5 million rupees)
   - Use numbers only (no commas)

3. **Implementing Agency**: 
   - Organization responsible
   - Example: "Department of Agrarian Development"

**Adding Multiple Proposals**:
- Click **"Add Proposal"** button
- Fill in the new row
- Click **"Remove"** to delete a proposal

#### Step 5: Review and Submit

1. **Check all fields** for accuracy
2. **Verify cost estimates** are realistic
3. **Confirm agency names** are correct
4. Click **"Submit"** button
5. Wait for **success confirmation**

### Development Sectors

#### 1. Agriculture and Rural Development

**Sub-categories include**:
- Crop Production
- Livestock and Dairy
- Fisheries and Aquaculture
- Irrigation and Water Management
- Agricultural Extension Services

**Common Proposals**:
- Irrigation infrastructure
- Seed distribution programs
- Training for farmers
- Market access improvements

#### 2. Infrastructure and Transport

**Sub-categories include**:
- Roads and Bridges
- Water Supply
- Electricity and Energy
- Drainage and Sanitation
- Public Buildings

**Common Proposals**:
- Road rehabilitation
- Water pipeline extension
- Street lighting
- Community center construction

#### 3. Education and Skills Development

**Sub-categories include**:
- School Infrastructure
- Vocational Training
- IT and Digital Literacy
- Sports and Recreation

**Common Proposals**:
- School building upgrades
- Computer labs
- Skill training centers

#### 4. Health and Social Welfare

**Sub-categories include**:
- Primary Healthcare
- Maternal and Child Health
- Elderly Care
- Disability Support

**Common Proposals**:
- Health clinic establishment
- Medical equipment
- Ambulance services

### Tips for Development Forms

✅ **Be Specific**: Provide detailed problem descriptions  
✅ **Realistic Costs**: Research typical project costs  
✅ **Correct Agencies**: Name actual implementing organizations  
✅ **Evidence-Based**: Include data (population affected, area size)  
✅ **Prioritize**: Mark urgent needs as "High" priority  
✅ **Consult Community**: Gather input from residents  

---

## 📊 Viewing & Managing Submissions

### For All Users

#### Viewing Your Own Submissions

1. Navigate to **"View Submissions"** or **"My Submissions"**
2. See a list of all your submitted forms
3. View details by clicking **"View"** button

**Information Displayed**:
- District, DS Division, GN Division
- Form Type (Council Info or Main Form)
- Submission Date and Time
- Status (if applicable)

### For District Admins & Super Admins

#### Admin Dashboard

The Admin Dashboard has two main tabs:

**1. Council Info Tab**
- Shows all Community Council form submissions
- Filterable by location
- Actions: View, Edit, Delete, Export PDF

**2. Main Form Tab**
- Shows all Development Planning submissions
- Filterable by location and sector
- Actions: View, Edit, Delete, Export

#### Filtering Submissions

**Filter Panel** (top of page):

1. **District**: 
   - Super Admin: All districts available
   - District Admin: Only your district

2. **DS Division**: 
   - Dropdown updates based on district
   - Optional (leave blank to see all)

3. **GN Division**: 
   - Dropdown updates based on DS Division
   - Optional

4. **Search/Apply**: 
   - Click to apply filters
   - Results update in table below

#### Submission Table

**Columns**:
- **#**: Row number
- **District**: Submission district
- **DS Division**: DS Division name
- **GN Division**: GN Division name
- **Submitted At**: Date and time
- **Submitted By**: Username (visible to admins)
- **Actions**: View | Edit | Delete | Export PDF

**Sorting**:
- Click column headers to sort
- Default: Most recent first

#### Viewing Submission Details

Click **"View"** button:

**Council Info View**:
- Three tables displayed:
  - Committee Members (Rows 1-5)
  - Community Representatives (Rows 6-20)
  - Strategic Members (Rows 21-25)
- All fields visible: Name, Position, Phone, WhatsApp, NIC, Gender, Address

**Development Form View**:
- Location details
- Selected sector hierarchy
- Problems table
- Proposals table with costs and agencies

#### Edit History

For edited submissions, you can view:

- **Edit Count**: Number of times edited
- **Last Edited**: Date and time of last edit
- **Edited By**: Username of editor
- **View History**: Click to see all edit timestamps

**History Details**:
- Each edit entry shows:
  - Date and time
  - Username of editor
  - Changes made (if logged)

---

## 📤 Export Features

### Excel Export

#### For District Admins

**Export District Data**:

1. Go to Admin Dashboard
2. **Council Info Tab**: 
   - Apply filters (optional)
   - Click **"Export to Excel"** button
3. **Main Form Tab**: 
   - Apply filters (optional)
   - Click **"Export to Excel"** button

**File Name Format**:
- `council_submissions_YYYYMMDD_HHMMSS.xlsx`
- `development_submissions_YYYYMMDD_HHMMSS.xlsx`

**Excel File Structure (Council Info)**:

**Sheet 1: Committee Members**
| # | Name | Position | Phone | WhatsApp | NIC | Gender | Permanent Address |
|---|------|----------|-------|----------|-----|--------|-------------------|
| 1 | ... | President | ... | ... | ... | Male | ... |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Sheet 2: Community Representatives**
- Same columns as Sheet 1
- Rows 6-20 data

**Sheet 3: Strategic Members**
- Same columns as Sheet 1
- Rows 21-25 data

**Unicode Support**:
- ✅ Sinhala characters display correctly
- ✅ Tamil characters display correctly
- ✅ Mixed languages supported

#### For Super Admins

Same process as District Admins, but:
- Can export **all districts** at once
- Clear filters to get nationwide data
- Larger file sizes possible

### PDF Export

#### Exporting Individual Submissions

**Council Info PDF**:

1. Find the submission in Admin Dashboard
2. Click **"Export PDF"** button for that row
3. PDF downloads immediately

**File Name Format**:
- `council_info_[GN_Division]_YYYYMMDD_HHMMSS.pdf`

**PDF Contents**:

**Header**:
```
Community Development Council
District: [Name]
DS Division: [Name]
GN Division: [Name]
Submitted: [Date and Time]
```

**Table 1: Committee Members (Rows 1-5)**
- Professional table with borders
- Columns: #, Name, Position, Phone, WhatsApp, NIC, Gender, Address
- Alternating row colors for readability

**Table 2: Community Representatives (Rows 6-20)**
- Same format as Table 1
- Only filled rows shown

**Table 3: Strategic Members (Rows 21-25)**
- Same format as Table 1
- Only filled rows shown

**Unicode Rendering**:
- ✅ Sinhala (සිංහල) text appears correctly
- ✅ Tamil (தமிழ்) text appears correctly
- ✅ Canvas-based rendering ensures clarity
- ✅ All characters readable in PDF readers

#### PDF Quality

**Features**:
- **Font Size**: 10-12pt for readability
- **Table Borders**: Clear black borders
- **Row Colors**: Alternating white/light gray
- **Page Size**: A4 landscape
- **Margins**: Standard (10mm all sides)

**Best Practices**:
- ✅ Open with Adobe Reader for best display
- ✅ Print at 100% scale (don't fit to page)
- ✅ Check Unicode characters before final print
- ✅ Save PDF for archival purposes

### Export Use Cases

#### Weekly Reports

1. **Every Monday**:
   - Export all submissions from previous week
   - Filter by date range
   - Save to archive folder

2. **Monthly Summary**:
   - Export entire district data
   - Generate statistics in Excel
   - Share with supervisors

#### Official Records

1. **Submission Confirmation**:
   - Export PDF of specific submission
   - Email to stakeholders
   - Print for physical filing

2. **Audit Trail**:
   - Export Excel with all submissions
   - Include edit history
   - Store for compliance

---

## 🌐 Language Settings

### Changing Language

The system supports **trilingual interface**:

**Languages**:
- **සිංහල** (Sinhala)
- **தமிழ்** (Tamil)
- **English**

**How to Change**:

1. **Look at top-right corner** of any page
2. You'll see language buttons: **සිංහල | தமிழ் | English**
3. **Click your preferred language**
4. The entire interface updates **instantly**

**What Changes**:
- ✅ Navigation menu labels
- ✅ Form field labels
- ✅ Button text
- ✅ Validation messages
- ✅ Success/error notifications
- ✅ Table headers
- ✅ Dropdown options

**What Doesn't Change**:
- ❌ User-entered data (names, addresses)
- ❌ Location names (districts, divisions)
- ❌ Username and password fields

### Language Persistence

Your language choice is **saved automatically**:

- **Browser Storage**: Choice stored in localStorage
- **Persists**: Language remains selected after:
  - Page refresh
  - Logout and login
  - Browser restart
- **Device-Specific**: Each device/browser has its own setting

### Data Entry Language

You can **enter data in any language**:

**Examples**:

**Sinhala Entry**:
```
නම: සමන් කුමාර පෙරේරා
ස්ථීර ලිපිනය: 123/අ, පළමු පටුමග, කොළඹ 07
```

**Tamil Entry**:
```
பெயர்: குமார் பெரேரா
நிரந்தர முகவரி: 123/A, முதல் வீதி, கொழும்பு 07
```

**English Entry**:
```
Name: Saman Kumara Perera
Permanent Address: 123/A, First Lane, Colombo 07
```

**Mixed Entry** (Not Recommended):
```
Name: සමන් කුමාර Perera  ← Avoid mixing
```

**Best Practice**: 
- ✅ Use one language consistently per form
- ✅ Match the language of your community
- ✅ Official documents typically use Sinhala or Tamil

### Export Language

**Excel Export**:
- Data appears **exactly as entered**
- Sinhala text: සිංහල
- Tamil text: தமிழ்
- English text: English
- Headers in selected interface language

**PDF Export**:
- **Unicode rendering** ensures proper display
- Sinhala and Tamil characters **clearly visible**
- No garbled or square box characters
- Print-ready quality

### Troubleshooting Language Issues

**Problem**: Characters appear as squares (□□□)

**Solution**:
- Your browser may lack necessary fonts
- Install Unicode font pack
- Use Chrome or Firefox (best support)

**Problem**: Interface not changing language

**Solution**:
- Hard refresh the page (Ctrl+F5)
- Clear browser cache
- Check internet connection
- Try another browser

**Problem**: Mixed languages in dropdown

**Solution**:
- This is normal for location names
- Some names are official and don't translate
- Example: "Colombo" stays "Colombo" in all languages

---

## 🔧 Troubleshooting

### Login Issues

#### Cannot Login - "Invalid Credentials"

**Causes**:
- Wrong username or password
- Caps Lock is on
- Extra spaces in username/password

**Solutions**:
1. ✅ Check Caps Lock key (should be OFF)
2. ✅ Re-type username carefully
3. ✅ Re-type password carefully
4. ✅ Copy-paste carefully (no extra spaces)
5. ✅ Contact your admin for password reset

#### "Session Expired" Message

**Cause**: You've been logged in for 24 hours (token expired)

**Solution**:
1. ✅ Click "Logout" (if available)
2. ✅ Login again with same credentials
3. ✅ Continue your work

#### Account Locked

**Cause**: Multiple failed login attempts (security feature)

**Solution**:
1. ✅ Wait 15 minutes
2. ✅ Try again
3. ✅ Contact admin if issue persists

### Form Submission Issues

#### "Please fill rows in sequential order"

**Cause**: You've skipped a row

**Example**:
```
Row 6: Filled ✅
Row 7: Empty ❌
Row 8: Filled ← Error! Fill row 7 first
```

**Solution**:
1. ✅ Find the empty row
2. ✅ Fill it with data
3. ✅ Continue from there

#### "Invalid phone number format"

**Cause**: Phone number doesn't match pattern `07XXXXXXXX`

**Common Mistakes**:
- ❌ `771234567` (missing leading 0)
- ❌ `+94771234567` (includes country code)
- ❌ `0112345678` (landline number)
- ❌ `07-1234567` (includes hyphen)

**Solution**:
1. ✅ Remove any non-numeric characters
2. ✅ Ensure it starts with `07`
3. ✅ Ensure exactly 10 digits total
4. ✅ Example: `0771234567`

#### Form Won't Submit - No Error Message

**Causes**:
- Internet connection lost
- Server is down
- Browser issue

**Solutions**:
1. ✅ Check internet connection
2. ✅ Try refreshing the page (⚠️ you'll lose unsaved data)
3. ✅ Try different browser
4. ✅ Wait 5 minutes and try again
5. ✅ Contact technical support

#### Data Not Saving After Submit

**Cause**: Server error or timeout

**Solution**:
1. ✅ Check if success message appeared
2. ✅ Navigate to "View Submissions" to verify
3. ✅ If not there, submit again
4. ✅ Take screenshot of success message

### Display Issues

#### Page Layout Broken

**Causes**:
- Browser cache issue
- Old browser version
- JavaScript disabled

**Solutions**:
1. ✅ Hard refresh: Press `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
2. ✅ Clear browser cache:
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Options → Privacy → Clear Data
3. ✅ Update browser to latest version
4. ✅ Enable JavaScript in browser settings

#### Table Not Showing Data

**Cause**: Filter applied or no data in selection

**Solution**:
1. ✅ Check filter panel
2. ✅ Click "Clear Filters" or "Reset"
3. ✅ Refresh the page
4. ✅ Try different district/division

#### Export Button Not Working

**Causes**:
- Pop-up blocker enabled
- Browser permission issue
- No data to export

**Solutions**:
1. ✅ Allow pop-ups for this site
2. ✅ Check if any data exists in filtered view
3. ✅ Try different browser
4. ✅ Disable browser extensions temporarily

### Performance Issues

#### Slow Loading

**Causes**:
- Slow internet connection
- Large dataset
- Server load

**Solutions**:
1. ✅ Check internet speed
2. ✅ Apply filters to reduce data
3. ✅ Wait patiently (may take 30-60 seconds)
4. ✅ Try during off-peak hours

#### Excel Export Takes Too Long

**Cause**: Exporting 500+ submissions

**Solutions**:
1. ✅ Apply district/division filters first
2. ✅ Export in smaller batches
3. ✅ Use PDF export for single submissions
4. ✅ Wait for progress bar (if available)

### Browser Compatibility

**Recommended Browsers**:
- ✅ **Google Chrome** 90+ (Best performance)
- ✅ **Mozilla Firefox** 88+
- ✅ **Microsoft Edge** 90+
- ✅ **Safari** 14+ (Mac only)

**Not Recommended**:
- ❌ Internet Explorer (not supported)
- ❌ Old browser versions (<2 years old)

---

## ❓ Frequently Asked Questions

### General Questions

**Q1: Who can access this system?**

**A**: Only authorized users with login credentials:
- DS Users (field officers)
- District Admins
- Super Admins

Public access is not available for security reasons.

---

**Q2: Is my data secure?**

**A**: Yes. The system uses:
- ✅ JWT token authentication
- ✅ HTTP-only cookies (prevents XSS)
- ✅ Password hashing (bcrypt)
- ✅ HTTPS encryption (in production)
- ✅ Role-based access control
- ✅ Activity logging for audit

---

**Q3: Can I edit a submission after submitting?**

**A**: 
- **DS Users**: No, you cannot edit after submission
- **District Admins**: Yes, within your district
- **Super Admins**: Yes, any submission

---

**Q4: How long does data stay in the system?**

**A**: Permanently, unless deleted by an admin. Regular backups are maintained for disaster recovery.

---

**Q5: Can I submit forms offline?**

**A**: No, you need an active internet connection. The system does not support offline mode currently.

---

### Form-Related Questions

**Q6: Do I have to fill all 25 rows?**

**A**: 
- **Rows 1-5**: Yes, all mandatory
- **Rows 6-25**: No, fill only as many as you have members

---

**Q7: What if I don't know someone's WhatsApp number?**

**A**: WhatsApp is mandatory. You can:
- Use their phone number (if same)
- Ask the person for their WhatsApp number
- If they don't have WhatsApp, use phone number

---

**Q8: Can I use the same phone number for multiple members?**

**A**: Technically yes, but not recommended. Each member should have their own contact number for communication purposes.

---

**Q9: What gender option should I select if the person prefers not to say?**

**A**: Select "Other" from the dropdown.

---

**Q10: Can I submit multiple forms for the same GN Division?**

**A**: 
- **Council Info**: Usually only one per GN Division
- **Development Form**: Yes, multiple for different sectors
- Check with your supervisor for policy

---

### Technical Questions

**Q11: What browsers are supported?**

**A**: 
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ❌ Internet Explorer (not supported)

---

**Q12: Why do I see squares (□) instead of Sinhala/Tamil text?**

**A**: Your device lacks Unicode fonts. Solutions:
- Update your operating system
- Install Unicode font pack
- Use a modern browser (Chrome/Firefox)

---

**Q13: Can I export to Word or PDF from Excel?**

**A**: Yes, after exporting to Excel:
1. Open in Microsoft Excel
2. File → Save As → PDF
3. Or File → Save As → Word Document

---

**Q14: How do I know my submission was successful?**

**A**: You'll see a **green success message** saying "Your form has been submitted successfully." Take a screenshot for your records.

---

**Q15: Can I delete my own submission?**

**A**: No, only District Admins and Super Admins can delete submissions.

---

### Admin-Specific Questions

**Q16: How many DS Users can I create as a District Admin?**

**A**: Unlimited, but create only as many as officially needed for your district.

---

**Q17: Can I edit submissions from other districts?**

**A**: 
- **District Admin**: No, only your district
- **Super Admin**: Yes, all districts

---

**Q18: What happens to submissions if I delete a user?**

**A**: Their past submissions remain in the database. Only their login access is removed.

---

**Q19: Can I export a specific date range?**

**A**: Currently, the system doesn't have date range filters. Export all, then filter in Excel:
1. Export to Excel
2. Use Excel's filter feature on "Submitted At" column
3. Select your date range

---

**Q20: How do I generate a district-wide report?**

**A**: 
1. Go to Admin Dashboard
2. Clear all filters (or select your district)
3. Click "Export to Excel"
4. Open Excel file
5. Create pivot tables or charts as needed

---

## 📞 Support & Contact

### Technical Support

**For System Issues**:
- Login problems
- Form submission errors
- Export failures
- Display issues

**Contact**:
- **Email**: support@prajashakthi.lk (example)
- **Phone**: +94 XX XXX XXXX (during business hours)
- **Hours**: Monday-Friday, 8:30 AM - 4:30 PM

### Administrative Support

**For Policy Questions**:
- User role assignments
- Data access permissions
- Form requirements
- Reporting procedures

**Contact**:
- Your District Administrator
- Provincial Coordinator
- National Project Office

### Training & Capacity Building

**For Training Requests**:
- New user orientation
- Refresher training
- Advanced features training

**Contact**:
- District Training Coordinator
- Request through official channels

### Reporting Bugs

**If you find a bug**:

1. **Document the Issue**:
   - What were you trying to do?
   - What happened instead?
   - Take screenshots if possible

2. **Provide Details**:
   - Browser name and version
   - Operating system
   - Date and time of occurrence
   - Your username (don't share password)

3. **Report Via**:
   - Email to support team
   - GitHub Issues (if you have access)
   - Through your supervisor

**Example Bug Report**:
```
Subject: PDF Export Not Working

Description: When I click "Export PDF" for a submission,
nothing happens. No download starts.

Browser: Chrome Version 120.0
OS: Windows 10
Date: October 28, 2025, 2:30 PM
Username: ds_user_colombo_1

Steps to Reproduce:
1. Login as DS User
2. Go to View Submissions
3. Click "Export PDF" for submission #123
4. Nothing happens

Expected: PDF should download
Actual: No action occurs
```

### Feature Requests

**To Request New Features**:

1. **Check if feature exists**:
   - Read this manual thoroughly
   - Ask supervisor if feature is already available

2. **Submit formal request**:
   - Describe the feature
   - Explain why it's needed
   - Estimate how many users would benefit

3. **Send to**:
   - Project Management Office
   - Via official channels

### Emergency Contacts

**For Urgent Issues**:
- System completely down
- Data loss
- Security breach

**Contact**:
- **24/7 Hotline**: +94 XX XXX XXXX (if available)
- **Email**: emergency@prajashakthi.lk
- **Escalation**: Provincial Director

---

## 📚 Appendix

### Glossary of Terms

| Term | Sinhala | Tamil | Definition |
|------|---------|-------|------------|
| **DS Division** | ප්‍රාදේශීය ලේකම් කොට්ඨාසය | பிரதேச செயலக பிரிவு | Divisional Secretariat Division |
| **GN Division** | ග්‍රාම නිලධාරී කොට්ඨාසය | கிராம சேவகர் பிரிவு | Grama Niladhari Division |
| **NIC** | ජාතික හැඳුනුම්පත | தேசிய அடையாள அட்டை | National Identity Card |
| **VDP** | ගම්මාන සංවර්ධන සැලැස්ම | கிராம அபிவிருத்தி திட்டம் | Village Development Plan |
| **RBAC** | - | - | Role-Based Access Control |
| **Admin** | පරිපාලක | நிர்வாகி | Administrator |
| **Submission** | ඉදිරිපත් කිරීම | சமர்ப்பிப்பு | Form Submission |

### Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | June 15, 2024 | Initial release |
| 1.5 | September 20, 2024 | Added Development Form guide |
| 2.0 | October 28, 2025 | Major update: New fields (NIC, Gender, Address), Updated screenshots, Enhanced troubleshooting |

### Related Documents

- **[README.md](./README.md)** - Technical documentation for developers
- **[RBAC_IMPLEMENTATION_GUIDE.md](./RBAC_IMPLEMENTATION_GUIDE.md)** - Detailed RBAC system guide
- **[TESTING_COMMUNITY_COUNCIL_UPDATES.md](./TESTING_COMMUNITY_COUNCIL_UPDATES.md)** - Testing procedures
- **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)** - Deployment instructions

---

## 🎓 Training Checklist

### For DS Users

After reading this manual, you should be able to:

- [ ] Login to the system
- [ ] Change language preference
- [ ] Select GN Division correctly
- [ ] Fill Committee Members (Rows 1-5)
- [ ] Add Community Representatives
- [ ] Validate phone numbers
- [ ] Enter NIC numbers correctly
- [ ] Submit form successfully
- [ ] View your submissions

### For District Admins

After reading this manual, you should be able to:

- [ ] All DS User tasks
- [ ] Access Admin Dashboard
- [ ] Apply filters to view data
- [ ] Edit submissions
- [ ] Delete submissions (with caution)
- [ ] Export to Excel
- [ ] Export to PDF
- [ ] Create DS Users
- [ ] View edit history

### For Super Admins

After reading this manual, you should be able to:

- [ ] All District Admin tasks
- [ ] View all districts' data
- [ ] Create all user types
- [ ] Delete users
- [ ] View activity logs
- [ ] Export nationwide data
- [ ] Perform system backups
- [ ] Monitor system health

---

**End of User Manual**

*For technical support, contact your system administrator or refer to the support section above.*

**Document Prepared By**: PrajaShakthi Development Team  
**Document Owner**: Project Management Office  
**Next Review Date**: April 28, 2026

---

**© 2025 PrajaShakthi Initiative. All Rights Reserved.**
