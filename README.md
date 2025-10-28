# PrajaShakthi VDP Form 🇱🇰

A comprehensive web application for managing Village Development Plan (VDP) submissions and Community Development Council (CDC) information in Sri Lanka. This system provides trilingual support (Sinhala/Tamil/English) with advanced features for data collection, management, role-based access control, and comprehensive reporting.

## 🌟 Key Features Overview

### 🎯 Core Functionality
- **Dual Form System**: 
  - Community Council Information Form (CDC Member Management)
  - Development Planning Form (Sector-based Proposals)
- **Trilingual Support**: Full interface in Sinhala (සිංහල), Tamil (தமிழ்), and English
- **Role-Based Access Control (RBAC)**: Three-tier user hierarchy with granular permissions
- **Location-Based Data Management**: Three-tier administrative structure (District → DS Division → GN Division)
- **Real-time Form Validation**: Client-side and server-side validation with user-friendly error messages
- **Edit History Tracking**: Comprehensive audit trail for all data modifications
- **Activity Logging**: System-wide activity tracking for compliance and monitoring

---

## 👥 User Roles & Permissions

### 1. **Super Admin (සුපිරි පරිපාලක)**
**Full System Access**
- ✅ View all submissions across all districts
- ✅ Create, Edit, Delete any submission
- ✅ Manage users (Create District Admins and DS Users)
- ✅ Access activity logs and audit trails
- ✅ Export data (Excel/PDF) for all submissions
- ✅ View edit history of all submissions
- ✅ Filter by any District/DS Division/GN Division
- ✅ Access both form types (Council Info + Development Form)

### 2. **District Admin (දිස්ත්‍රික් පරිපාලක)**
**District-Level Access**
- ✅ View submissions within assigned district only
- ✅ Create, Edit, Delete submissions in their district
- ✅ Create DS Users for their district
- ✅ Export data for their district
- ✅ View edit history for their district's submissions
- ✅ Filter by DS Division/GN Division within their district
- ❌ Cannot access other districts' data
- ❌ Cannot create other District Admins

### 3. **DS User (ප්‍රාදේශීය ලේකම් කාර්යාලය)**
**Division-Level Access**
- ✅ View submissions within assigned DS Division only
- ✅ Create, Edit submissions in their DS Division
- ✅ Auto-populated location fields (District & DS locked)
- ✅ Export data for their DS Division
- ✅ View edit history for their division's submissions
- ❌ Cannot delete submissions
- ❌ Cannot create users
- ❌ Cannot access other divisions' data

---

## 📋 Form Features

### 🏛️ Community Council Information Form

#### **Updated Table Structure (2025)**
The Community Council form has been restructured with enhanced data fields:

**Table 1: Committee Members (කාරක සභා සාමාජිකයින්) - Rows 1-5**
- **Fixed Positions for Rows 1-4:**
  - Row 1: **සභාපති / President** (Auto-filled, Read-only)
  - Row 2: **ලේකම් / Secretary** (Auto-filled, Read-only)
  - Row 3: **ග්‍රාම නිලධාරී / Grama Niladhari** (Auto-filled, Read-only)
  - Row 4: **සමෘද්ධි සංවර්ධන නිලධාරි / Samurdhi Development Officer** (Auto-filled, Read-only)
- **Dropdown Position for Row 5:**
  - කෘෂිකර්ම නිලධාරි (Agricultural Officer)
  - ධීවර සංවර්ධන නිලධාරි (Fisheries Officer)
  - ජලජ සංවර්ධන නිලධාරි (Aquaculture Officer)
  - වෙනත් (Other - with custom text input)

**Table 2: Community Representatives (ප්‍රජා නියෝජිත කණ්ඩායම) - Rows 6-20**
- 15 member slots for community representation
- No position field (community members)

**Table 3: Strategic Members (උපාය මාර්ගික සාමාජික කණ්ඩායම) - Rows 21-25**
- 5 member slots for strategic planning members
- No position field

#### **Member Information Fields (All Tables)**
Required fields for each member:
1. **Name** (නම / பெயர்) - Text input
2. **Position** (තනතුර) - Fixed/Dropdown/Not applicable based on row
3. **Phone** (දුරකථන අංකය / தொலைபேசி) - 10-digit validation (07XXXXXXXX)
4. **WhatsApp** (වට්ස්ඇප් අංකය) - 10-digit validation
5. **NIC** (ජාතික හැඳුනුම්පත / தேசிய அடையாள அட்டை) - National ID number (NEW)
6. **Gender** (ස්ත්‍රී පුරුෂ භාවය / பாலினம்) - Dropdown: Male/Female/Other (NEW)
7. **Permanent Address** (ස්ථිර ලිපිනය / நிரந்தர முகவரி) - Textarea (NEW)

#### **Validation Rules**
- **Rows 1-5**: ALL fields mandatory (Name, Position, Phone, WhatsApp, NIC, Gender, Address)
- **Rows 6-25**: Position not required; all other fields mandatory if row is filled
- **Sequential Filling**: Must fill rows in order (cannot skip rows)
- **Phone Validation**: Sri Lankan mobile format (07[0-8]XXXXXXX)
- **Empty Row Detection**: At least one field must be filled to consider row as "used"

### 🏗️ Development Planning Form

#### **Sector-Based Categorization**
Multi-level sector selection system:
- **Primary Sectors**: Agriculture, Education, Health, Infrastructure, etc.
- **Sub-categories**: Up to 3 nested levels of specialization
- **Dynamic Content**: Form fields adapt based on sector selection

#### **Proposal Management**
- **Multiple Proposals**: Add unlimited proposals per submission
- **Proposal Fields**:
  - Proposal Description (විස්තරය)
  - Estimated Cost (ඇස්තමේන්තු වියදම)
  - Responsible Agency (වගකිව යුතු ආයතනය)
- **Dynamic Addition**: Add/Remove proposals on the fly

---

## 🔐 Advanced Security Features

### Authentication & Authorization
- **JWT-Based Authentication**: Secure token-based system with HTTP-only cookies
- **Password Security**: bcryptjs hashing with salt rounds (10)
- **Session Management**: Automatic token expiration and refresh
- **Role-Based Middleware**: Endpoint-level access control
- **Protected Routes**: Client-side and server-side route protection

### Data Security
- **CORS Protection**: Restricted origins with credentials support
- **Environment Variable Isolation**: Sensitive data externalized
- **SQL Injection Prevention**: Mongoose parameterized queries
- **XSS Protection**: HTTP-only cookies prevent script access
- **Input Sanitization**: Server-side validation and sanitization

---

## 📊 Admin Dashboard Features

### 🔍 Advanced Filtering System
Filter submissions by:
- **Location**: District → DS Division → GN Division (cascading dropdowns)
- **Form Type**: Council Info / Development Form (tab-based)
- **Date Range**: Submission date filtering
- **User Role**: Automatic filtering based on user permissions

### 📈 Data Visualization
- **Submission Count**: Real-time submission statistics
- **Status Indicators**: Visual status badges
- **Location Summary**: Quick overview of submission distribution
- **Empty State Handling**: User-friendly "no data" messages

### ✏️ Edit Functionality
**Comprehensive Edit Modal** with:
- **Location Editing**: District, DS Division, GN Division (locked based on role)
- **Member Editing**: 
  - Rows 1-4: Name and other fields editable, Position locked
  - Row 5: Position dropdown with options
  - Rows 6-25: All fields editable (no position field)
- **Real-time Validation**: Instant feedback on input errors
- **Change Detection**: Only modified fields trigger updates
- **Edit History**: Automatic logging of all changes with user attribution

### 🗑️ Delete Functionality
- **Confirmation Dialog**: Prevent accidental deletions
- **Role-Based**: Only Super Admin and District Admin can delete
- **Cascade Handling**: Related data cleanup
- **Activity Logging**: Deletion events logged for audit

### 📜 Activity Logs
**Comprehensive Activity Tracking:**
- **User Actions**: Login, Logout, Form Submission, Edit, Delete
- **Detailed Context**: User info, IP address, timestamp, action details
- **Human-Readable Format**: Clear descriptions of changes made
- **Filterable**: Filter by user, action type, date range
- **Searchable**: Find specific activities quickly

### 📝 Edit History
**Granular Change Tracking:**
- **Field-Level Comparison**: Shows exactly what changed (old value → new value)
- **User Attribution**: Who made the change
- **Timestamp**: When the change was made
- **Change Description**: Auto-generated human-readable descriptions
- **Location Changes**: District, DS Division, GN Division updates
- **Member Changes**: Individual member field modifications
- **Timeline View**: Chronological display of all edits

---

## 📤 Export Capabilities

### 📊 Excel Export (.xlsx)
**Full Data Export with:**
- ✅ All filtered submissions included
- ✅ Structured worksheets with headers
- ✅ Complete member information (all 25 rows)
- ✅ Separate rows for each member with section labels
- ✅ Metadata: Submission ID, Location, Submitted Date
- ✅ **New Fields Included**: NIC, Gender, Permanent Address
- ✅ **Email Field Removed**: No longer exported
- ✅ Proper Unicode encoding for Sinhala/Tamil text
- ✅ Auto-formatted columns for readability
- ✅ Timestamp-based filenames

**Excel Structure:**
```
Submission ID | District | DS Division | GN Division | Section | Row # | Name | Position | Phone | WhatsApp | NIC | Gender | Permanent Address | Submitted
```

### 📄 PDF Export
**Professional PDF Generation:**
- ✅ Individual PDF per submission
- ✅ **Unicode Support**: Full Sinhala (සිංහල) and Tamil (தமிழ்) rendering
- ✅ Three-section layout:
  - Committee Members (1-5) with positions
  - Community Representatives (6-20)
  - Strategic Members (21-25)
- ✅ **New Columns**: NIC, Gender, Permanent Address (Address column in PDF)
- ✅ **Email Column Removed**: No longer in PDF exports
- ✅ Professional formatting with borders
- ✅ Alternating row colors for readability
- ✅ Auto-pagination for large datasets
- ✅ Header with submission metadata
- ✅ Canvas-based Unicode rendering (24px font → 0.12x scale)

**Technical Implementation:**
- **Unicode Detection**: Regex `/[\u0D80-\u0DFF\u0B80-\u0BFF]/` for Sinhala/Tamil
- **Canvas Rendering**: High-resolution text rendered to canvas, then embedded as image
- **Table Generation**: `jspdf-autotable` for structured layouts
- **Column Optimization**: Dynamic width allocation for new fields

---

### Frontend
- **React 19.1.1**: Modern UI with hooks and context
- **Vite 7.1.2**: Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.14**: Utility-first CSS framework with modern oklch colors
- **React Router**: Client-side routing
- **Export Libraries**:
  - `xlsx 0.18.5`: Excel/CSV generation
  - `jspdf 3.0.3` + `jspdf-autotable 5.0.2`: PDF generation with table support

### Backend
- **Node.js**: Runtime environment (requires >=22.0.0)
- **Express 5.1.0**: Web application framework
- **MongoDB 8.18.3**: NoSQL database with Mongoose ODM
- **Authentication**: JWT with bcryptjs password hashing
- **CORS**: Cross-origin resource sharing with secure cookie handling

### Development Tools
- **Column Optimization**: Dynamic width allocation for new fields

---

## 🏗️ Tech Stack

### Frontend Technologies
- **React 19.1.1**: Modern UI library with hooks and context API
- **Vite 7.1.2**: Next-generation build tool and dev server
- **Tailwind CSS 4.1.14**: Utility-first CSS framework with modern oklch colors
- **React Router 7.2.0**: Client-side routing with protected routes
- **React i18next 15.3.3**: Internationalization framework for trilingual support
- **Export Libraries**:
  - `xlsx 0.18.5`: Excel/CSV generation with Unicode support
  - `jspdf 3.0.3`: PDF generation with custom fonts
  - `jspdf-autotable 5.0.2`: Professional table layouts in PDFs

### Backend Technologies
- **Node.js >= 22.0.0**: JavaScript runtime environment
- **Express 5.1.0**: Fast, unopinionated web framework
- **MongoDB 8.18.3**: NoSQL database for flexible data storage
- **Mongoose**: Elegant MongoDB object modeling with schema validation
- **Authentication Stack**:
  - `jsonwebtoken 9.0.2`: JWT token generation and verification
  - `bcryptjs 2.4.3`: Password hashing with salt
  - `cookie-parser 1.4.7`: Secure cookie management
- **CORS 2.8.5**: Cross-origin resource sharing with credentials
- **dotenv 16.4.7**: Environment variable management

### Development & DevOps
- **ESLint**: Code quality and consistency enforcement
- **Nodemon 3.1.10**: Auto-restart during backend development
- **Vercel**: Serverless deployment platform
- **Git**: Version control with branching strategy

---

## 📦 Detailed Project Structure

```
PrajaShakthi-VDP-Form/
├── 📁 PrajaShakthi-VDP-Form-backend/
│   ├── 📁 config/
│   │   └── db.js                           # MongoDB connection with retry logic
│   ├── 📁 controllers/
│   │   ├── authController.js               # Login, Logout, Token verification
│   │   ├── submissionController.js         # CRUD operations for submissions
│   │   └── userController.js               # User management (create, update, delete)
│   ├── 📁 middleware/
│   │   ├── authMiddleware.js               # JWT verification & role checking
│   │   └── loggingMiddleware.js            # Request/Response logging
│   ├── 📁 models/
│   │   ├── ActivityLogModel.js             # Activity tracking schema
│   │   ├── SubmissionModel.js              # Submission schema with edit history
│   │   └── UserModel.js                    # User schema with role hierarchy
│   ├── 📁 routes/
│   │   ├── authRoutes.js                   # Authentication endpoints
│   │   ├── submissionRoutes.js             # Submission CRUD endpoints
│   │   └── userRoutes.js                   # User management endpoints
│   ├── 📁 scripts/
│   │   ├── createSuperAdmin.js             # Initial super admin creation
│   │   └── migrateOldUsers.js              # Database migration scripts
│   ├── 📁 utils/
│   │   └── activityLogger.js               # Activity logging utilities
│   ├── .env.example                        # Environment template
│   ├── .gitignore                          # Git ignore rules
│   ├── package.json                        # Dependencies and scripts
│   ├── server.js                           # Express app entry point
│   └── vercel.json                         # Vercel deployment config
│
├── 📁 PrajaShakthi-VDP-Form-frontend/
│   ├── 📁 public/                          # Static assets
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   │   └── auth.js                     # API service layer with axios
│   │   ├── 📁 assets/                      # Images, fonts, icons
│   │   ├── 📁 components/
│   │   │   ├── ActivityLogs.jsx            # Activity log viewer
│   │   │   ├── AppRoutes.jsx               # Route configuration with protection
│   │   │   ├── CommunityCouncilForm.jsx    # CDC form with validation
│   │   │   ├── CommunityCouncilTable.jsx   # Dynamic member table component
│   │   │   ├── DevelopmentForm.jsx         # Development planning form
│   │   │   ├── DevelopmentFormLocation.jsx # Location selector for dev form
│   │   │   ├── DynamicContent.jsx          # Sector-based dynamic fields
│   │   │   ├── LocationSelectorBase.jsx    # Reusable location selector
│   │   │   ├── Login.jsx                   # Login page with role-based redirect
│   │   │   ├── Navigation.jsx              # Header with language switcher
│   │   │   ├── Proposals.jsx               # Proposal management component
│   │   │   ├── SectorSelector.jsx          # Multi-level sector selector
│   │   │   ├── SubmissionList.jsx          # Admin dashboard with filters
│   │   │   └── UserManagement.jsx          # User CRUD interface (Super Admin)
│   │   ├── 📁 context/
│   │   │   └── AuthContext.jsx             # Global auth state management
│   │   ├── 📁 data/
│   │   │   ├── provincial_data.json        # Sri Lankan administrative divisions
│   │   │   └── sectors_data.js             # Development sector hierarchy
│   │   ├── 📁 i18n/
│   │   │   ├── config.js                   # i18next configuration
│   │   │   └── 📁 locales/
│   │   │       ├── en.json                 # English translations
│   │   │       ├── si.json                 # Sinhala translations
│   │   │       └── ta.json                 # Tamil translations
│   │   ├── App.css                         # Global styles
│   │   ├── App.jsx                         # Root component
│   │   └── main.jsx                        # React entry point
│   ├── .gitignore                          # Git ignore rules
│   ├── eslint.config.js                    # ESLint configuration
│   ├── index.html                          # HTML template
│   ├── package.json                        # Dependencies and scripts
│   ├── tailwind.config.js                  # Tailwind CSS configuration
│   ├── vercel.json                         # Vercel deployment config
│   └── vite.config.js                      # Vite build configuration
│
├── 📄 Documentation Files/
│   ├── BUG_SCAN_SUMMARY.md                 # Known issues and resolutions
│   ├── BUGS_FIXED.md                       # Bug fix changelog
│   ├── CSS_MIGRATION_REPORT.md             # CSS framework migration notes
│   ├── I18N_IMPLEMENTATION.md              # Internationalization guide
│   ├── QUICK_DEPLOY.md                     # Quick deployment guide
│   ├── QUICK_START_RBAC.md                 # RBAC setup guide
│   ├── RBAC_IMPLEMENTATION_GUIDE.md        # Detailed RBAC documentation
│   ├── RBAC_IMPLEMENTATION_SUMMARY.md      # RBAC feature summary
│   ├── README.md                           # This file
│   ├── REMAINING_FIXES.md                  # Pending improvements
│   ├── TESTING_CHECKLIST.md                # QA testing checklist
│   ├── TESTING_COMMUNITY_COUNCIL_UPDATES.md # CDC form testing guide
│   ├── THEME_UPDATE.md                     # UI/UX theme changes
│   ├── VERCEL_DEPLOYMENT_GUIDE.md          # Deployment instructions
│   └── VERIFICATION_REPORT.md              # System verification results
│
└── .gitignore                              # Global git ignore
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22.0.0
- MongoDB (local or Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd PrajaShakthi-VDP-Form-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/prajashakthi?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd PrajaShakthi-VDP-Form-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update API endpoint (if needed)**
   
   Edit `src/api/auth.js` and set:
   ```javascript
   const API_BASE_URL = "http://localhost:5000";
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Application runs on `http://localhost:5173`

### Create Admin User

Use MongoDB Compass or mongo shell to create an admin user:

```javascript
// Connect to your database and insert:
db.users.insertOne({
  username: "admin",
  password: "$2a$10$your-bcrypt-hashed-password",
  role: "admin",
  createdAt: new Date()
})
```

Or use bcrypt to hash a password:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10));"
```

## 🌐 Deployment

### Vercel Deployment

Both frontend and backend can be deployed to Vercel. See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Summary:**

1. **Backend Deployment**
   - Deploy `PrajaShakthi-VDP-Form-backend` folder
   - Set environment variables in Vercel dashboard
   - Note the backend URL (e.g., `https://your-backend.vercel.app`)

2. **Frontend Deployment**
   - Update `API_BASE_URL` in `src/api/auth.js` to backend URL
   - Deploy `PrajaShakthi-VDP-Form-frontend` folder
   - Set `CORS_ORIGIN` in backend to frontend URL

3. **Environment Variables** (Backend)
   ```
   MONGO_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<secure-random-string>
   NODE_ENV=production
   CORS_ORIGIN=<your-frontend-vercel-url>
   ```

## 📊 Data Export Features

### Excel Export
- Exports all filtered submissions to `.xlsx` format
- Includes complete data structure:
  - Council Info: All member details with sections
  - Main Form: Proposals with costs and agencies
- Timestamp-based filenames

### PDF Export
- Individual PDF per submission (Council Info only)
- **Unicode Support**: Properly renders Sinhala (සිංහල) and Tamil (தமிழ்) text
- Three-section tables:
  1. Committee Members (1-5) with positions
  2. Community Representatives (6-20)
  3. Strategic Members (21-25)
- Professional formatting with borders and alternating row colors
- Canvas-based rendering for Unicode characters to ensure clarity

### Technical Implementation
- **Unicode Detection**: Regex pattern `/[\u0D80-\u0DFF\u0B80-\u0BFF]/` detects Sinhala/Tamil
- **Canvas Rendering**: 24px font size rendered to canvas, scaled to 0.12x in PDF
- **Table Generation**: Uses `jspdf-autotable` for clean, structured layouts
- **Column Width Optimization**: 10mm for row numbers to support two-digit values

---

## 🔐 Advanced Security Implementation

### Authentication & Authorization
- **JWT Token Strategy**:
  - HTTP-only cookies prevent XSS attacks
  - Secure flag enabled in production
  - Token expiration: 24 hours
  - Refresh mechanism on activity
- **Password Security**:
  - bcryptjs hashing with 10 salt rounds
  - Minimum password requirements enforced
  - No plaintext password storage
- **Role-Based Access Control**:
  - Middleware validates user role before route access
  - Hierarchical permission model
  - Action-level permission checks

### API Security
- **CORS Configuration**:
  - Whitelisted origins only
  - Credentials support enabled
  - Pre-flight request handling
- **Request Validation**:
  - Input sanitization on all endpoints
  - Schema validation with Mongoose
  - SQL injection prevention (NoSQL context)
- **Rate Limiting**: 
  - Planned implementation for production
  - DDoS protection via Vercel

### Data Security
- **Database Security**:
  - MongoDB Atlas with encrypted connections
  - Environment-based credentials
  - Connection pooling with retry logic
- **Sensitive Data Handling**:
  - Environment variables for secrets
  - .env files in .gitignore
  - No hardcoded credentials in codebase
- **Activity Logging**:
  - All CRUD operations logged with timestamps
  - User action tracking with IP addresses
  - Audit trail for compliance

### Frontend Security
- **State Management**:
  - AuthContext with secure token storage
  - Auto-logout on token expiration
  - Protected route wrappers
- **Form Validation**:
  - Client-side validation for UX
  - Server-side validation for security
  - Regex patterns for phone/NIC validation

---

## 🌐 Deployment Guide

### Environment Variables

#### Backend (.env)
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prajashakthi?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-recommended
JWT_EXPIRY=24h

# Server
PORT=5000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Optional: Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (Update in src/api/auth.js)
```javascript
const API_BASE_URL = "https://your-backend-domain.vercel.app";
```

### Vercel Deployment Steps

#### Backend Deployment
1. **Push code to GitHub repository**
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select `PrajaShakthi-VDP-Form-backend` as root directory

3. **Configure Environment Variables**
   - Navigate to Project Settings → Environment Variables
   - Add all variables from `.env` file
   - Ensure `NODE_ENV=production`

4. **Deploy**
   - Click "Deploy"
   - Note the production URL (e.g., `https://your-backend.vercel.app`)

5. **Verify Deployment**
   ```bash
   curl https://your-backend.vercel.app/api/auth/verify
   ```

#### Frontend Deployment
1. **Update API Base URL**
   - Edit `src/api/auth.js`
   - Set `API_BASE_URL` to your backend Vercel URL

2. **Commit Changes**
   ```bash
   git add src/api/auth.js
   git commit -m "Update API URL for production"
   git push origin main
   ```

3. **Import to Vercel**
   - Import GitHub repository again
   - Select `PrajaShakthi-VDP-Form-frontend` as root directory

4. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Deploy**
   - Click "Deploy"
   - Note the frontend URL (e.g., `https://your-app.vercel.app`)

6. **Update Backend CORS**
   - Go to backend Vercel project
   - Update `CORS_ORIGIN` environment variable to frontend URL
   - Redeploy backend

#### Post-Deployment Verification
1. **Create Super Admin** (if first deployment):
   ```bash
   # Connect to MongoDB and run:
   use prajashakthi
   db.users.insertOne({
     username: "superadmin",
     password: "$2a$10$hashed_password_here",
     role: "superadmin",
     district: null,
     dsDivision: null,
     createdAt: new Date()
   })
   ```

2. **Test Authentication**:
   - Visit your frontend URL
   - Login with super admin credentials
   - Verify dashboard loads correctly

3. **Test Form Submission**:
   - Create a test submission
   - Verify data appears in admin dashboard
   - Test Excel/PDF export

4. **Test RBAC**:
   - Create district admin user
   - Login and verify limited access
   - Test permission boundaries

### Common Deployment Issues

#### CORS Errors
- **Symptom**: Network requests blocked in browser console
- **Solution**: Verify `CORS_ORIGIN` matches exact frontend URL (with https://)

#### 500 Server Errors
- **Symptom**: API requests fail with "Internal Server Error"
- **Solution**: Check Vercel function logs for MongoDB connection issues

#### JWT Verification Failures
- **Symptom**: User gets logged out immediately
- **Solution**: Ensure `JWT_SECRET` is identical in all environments and minimum 32 characters

#### Build Failures
- **Symptom**: Frontend build fails on Vercel
- **Solution**: 
  - Check Node.js version compatibility
  - Verify all dependencies in `package.json`
  - Check for environment-specific code paths

### Monitoring & Maintenance

#### Vercel Analytics
- Enable Analytics in Vercel dashboard
- Monitor page load times and error rates

#### Database Monitoring
- Use MongoDB Atlas monitoring
- Set up alerts for connection failures
- Monitor database size and performance

#### Log Monitoring
- Check Vercel function logs regularly
- Monitor activity logs in admin dashboard
- Set up error alerting

---

## 🌍 Internationalization (i18n)

### Supported Languages
- **Sinhala (සිංහල)**: Primary language, full Unicode support
- **Tamil (தமிழ்)**: Full Unicode support with proper rendering
- **English**: Technical terms and admin interface

### Translation Structure
All translations stored in `src/i18n/locales/`:
- `si.json`: Sinhala translations
- `ta.json`: Tamil translations
- `en.json`: English translations

### Language Switching
- Language selector in Navigation component
- Persisted in localStorage
- Dynamic content updates without page reload

### Adding New Translations
1. Add key-value pairs to all three locale files:
   ```json
   // si.json
   {
     "newKey": "නව පරිවර්තනය"
   }
   
   // ta.json
   {
     "newKey": "புதிய மொழிபெயர்ப்பு"
   }
   
   // en.json
   {
     "newKey": "New Translation"
   }
   ```

2. Use in components:
   ```jsx
   import { useTranslation } from 'react-i18next';
   
   const { t } = useTranslation();
   return <h1>{t('newKey')}</h1>;
   ```

### Unicode Rendering in Exports
- **PDF Export**: Canvas-based rendering ensures proper Sinhala/Tamil character display
- **Excel Export**: UTF-8 encoding with BOM for Unicode compatibility
- **Browser Display**: Native Unicode support in modern browsers

---

## 📝 API Endpoints

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```
**Response Success (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673abc123def456789",
    "username": "admin",
    "role": "superadmin",
    "district": "Colombo",
    "dsDivision": "Colombo"
  }
}
```
**Response Error (401)**:
```json
{
  "error": "Invalid credentials"
}
```

#### Logout
```http
POST /api/auth/logout
Cookie: token=<jwt-token>
```
**Response Success (200)**:
```json
{
  "message": "Logged out successfully"
}
```

#### Verify Token
```http
GET /api/auth/verify
Cookie: token=<jwt-token>
```
**Response Success (200)**:
```json
{
  "valid": true,
  "user": {
    "id": "673abc123def456789",
    "username": "admin",
    "role": "superadmin"
  }
}
```

---

### User Management Endpoints (Super Admin Only)

#### Create User
```http
POST /api/users
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "username": "district_admin_colombo",
  "password": "SecurePass123!",
  "role": "district_admin",
  "district": "Colombo",
  "dsDivision": null
}
```
**Response Success (201)**:
```json
{
  "message": "User created successfully",
  "userId": "673abc123def456790"
}
```

#### Get All Users
```http
GET /api/users
Cookie: token=<jwt-token>
```
**Response Success (200)**:
```json
{
  "users": [
    {
      "_id": "673abc123def456789",
      "username": "superadmin",
      "role": "superadmin",
      "district": null,
      "dsDivision": null,
      "createdAt": "2024-11-18T10:30:00.000Z"
    },
    {
      "_id": "673abc123def456790",
      "username": "district_admin_colombo",
      "role": "district_admin",
      "district": "Colombo",
      "dsDivision": null,
      "createdAt": "2024-11-20T14:45:00.000Z"
    }
  ]
}
```

#### Update User
```http
PUT /api/users/:id
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "username": "updated_username",
  "password": "NewPassword123!",  // Optional
  "role": "ds_user",
  "district": "Gampaha",
  "dsDivision": "Gampaha"
}
```

#### Delete User
```http
DELETE /api/users/:id
Cookie: token=<jwt-token>
```
**Response Success (200)**:
```json
{
  "message": "User deleted successfully"
}
```

---

### Submission Endpoints

#### Create Submission
```http
POST /api/submissions
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "district": "Colombo",
  "divisionalSec": "Colombo",
  "gnDivision": "Colombo Ward 1",
  "formType": "council_info",
  "committeeMembers": [
    {
      "name": "John Doe",
      "position": "President",
      "phone": "0771234567",
      "whatsapp": "0771234567",
      "nic": "199012345678",
      "gender": "Male",
      "permanentAddress": "123 Main St, Colombo"
    }
    // ... more members (rows 1-5)
  ],
  "communityReps": [
    // ... rows 6-20
  ],
  "strategicMembers": [
    // ... rows 21-25
  ]
}
```
**Response Success (201)**:
```json
{
  "message": "Submission created successfully",
  "submissionId": "673abc123def456791"
}
```

#### Get All Submissions (with filters)
```http
GET /api/submissions?district=Colombo&divisionalSec=Colombo&formType=council_info
Cookie: token=<jwt-token>
```
**Query Parameters**:
- `district` (optional): Filter by district name
- `divisionalSec` (optional): Filter by DS division name
- `gnDivision` (optional): Filter by GN division name
- `formType` (optional): `council_info` or `main_form`
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response Success (200)**:
```json
{
  "submissions": [
    {
      "_id": "673abc123def456791",
      "district": "Colombo",
      "divisionalSec": "Colombo",
      "gnDivision": "Colombo Ward 1",
      "formType": "council_info",
      "committeeMembers": [...],
      "communityReps": [...],
      "strategicMembers": [...],
      "createdAt": "2024-11-21T09:15:00.000Z",
      "createdBy": {
        "userId": "673abc123def456789",
        "username": "admin"
      },
      "editHistory": []
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

#### Update Submission (Edit)
```http
PUT /api/submissions/:id
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "committeeMembers": [...],  // Updated members
  "communityReps": [...],
  "strategicMembers": [...]
}
```
**Response Success (200)**:
```json
{
  "message": "Submission updated successfully",
  "submission": {
    "_id": "673abc123def456791",
    "editHistory": [
      {
        "editedAt": "2024-11-21T10:30:00.000Z",
        "editedBy": {
          "userId": "673abc123def456789",
          "username": "admin"
        }
      }
    ]
  }
}
```

#### Delete Submission
```http
DELETE /api/submissions/:id
Cookie: token=<jwt-token>
```
**Response Success (200)**:
```json
{
  "message": "Submission deleted successfully"
}
```

---

### Activity Log Endpoints (Super Admin Only)

#### Get Activity Logs
```http
GET /api/activity-logs?action=CREATE_SUBMISSION&userId=673abc123def456789
Cookie: token=<jwt-token>
```
**Query Parameters**:
- `action` (optional): Filter by action type (CREATE_SUBMISSION, UPDATE_SUBMISSION, DELETE_SUBMISSION, LOGIN, LOGOUT, CREATE_USER, etc.)
- `userId` (optional): Filter by user ID
- `startDate` (optional): Filter from date (ISO 8601)
- `endDate` (optional): Filter to date (ISO 8601)
- `limit` (optional): Number of logs to return (default: 100)

**Response Success (200)**:
```json
{
  "logs": [
    {
      "_id": "673abc123def456792",
      "action": "CREATE_SUBMISSION",
      "userId": "673abc123def456789",
      "username": "admin",
      "details": {
        "submissionId": "673abc123def456791",
        "district": "Colombo",
        "formType": "council_info"
      },
      "timestamp": "2024-11-21T09:15:00.000Z",
      "ipAddress": "192.168.1.100"
    }
  ],
  "total": 1
}
```

---

### Error Responses

All endpoints may return these common error responses:

**401 Unauthorized**:
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden**:
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found**:
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

## 🐛 Known Issues & Solutions

### Resolved Issues ✅

#### PDF Export Unicode Rendering
- **Issue**: Sinhala and Tamil characters not displaying in PDF exports
- **Root Cause**: jsPDF default fonts don't support Unicode; html2canvas failed with oklch colors
- **Solution**: Implemented canvas-based image rendering for Unicode text
- **Implementation**: Characters detected via regex, rendered to canvas at 24px, embedded as images at 0.12x scale

#### Row Number Column Wrapping
- **Issue**: Two-digit row numbers (10-25) wrapping to second line in PDF tables
- **Root Cause**: Column width too narrow (8mm)
- **Solution**: Increased column width to 10mm with proper alignment

#### Oklahoma Color (oklch) Parsing
- **Issue**: html2canvas couldn't parse Tailwind CSS 4.x oklch color values
- **Root Cause**: Legacy library doesn't support modern CSS color functions
- **Solution**: Migrated from html2canvas to jspdf-autotable for table generation

#### Edit History Not Saving
- **Issue**: Submission edits not tracked in database
- **Root Cause**: Missing editHistory push in controller
- **Solution**: Added editHistory array updates with timestamp and user info

### Active Issues & Workarounds ⚠️

#### Large Dataset Performance
- **Status**: Monitoring
- **Description**: Admin dashboard may slow down with 1000+ submissions
- **Workaround**: 
  - Implemented pagination (20 items per page)
  - Added district/DS/GN filters to reduce result set
  - Plan: Add server-side search and indexing

#### Mobile Responsiveness
- **Status**: Partial support
- **Description**: Complex forms not fully optimized for mobile screens
- **Workaround**: 
  - Recommend desktop/tablet for form submission
  - Mobile view works for admin dashboard viewing
  - Plan: Implement responsive table scrolling

#### Export Large Datasets
- **Status**: Investigating
- **Description**: Excel export of 500+ submissions may cause browser memory issues
- **Workaround**: 
  - Use filters to reduce export size
  - Export by district/division
  - Plan: Implement server-side export generation

### Future Enhancements 🚀

1. **Performance Optimization**
   - Database indexing on location fields
   - Virtual scrolling for large tables
   - Lazy loading for submissions list

2. **Feature Additions**
   - Bulk import from Excel template
   - Advanced search with multiple criteria
   - Dashboard analytics with charts
   - Email notifications for submissions
   - File attachment support for proposals

3. **UX Improvements**
   - Autosave drafts for forms
   - Progress indicators for multi-step forms
   - Inline validation with error messages
   - Dark mode support

4. **Security Enhancements**
   - Two-factor authentication (2FA)
   - Password reset via email
   - Session management dashboard
   - API rate limiting

---

## 🤝 Contributing

### Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/PrajaShakthi-VDP-Form.git
   cd PrajaShakthi-VDP-Form
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **Make Changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update relevant documentation

4. **Test Thoroughly**
   - Run frontend: `npm run dev` in frontend folder
   - Run backend: `npm start` in backend folder
   - Test all RBAC scenarios
   - Verify exports (Excel/PDF)
   - Test form validation

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: Add amazing new feature
   
   - Detailed description of changes
   - Why the change was needed
   - Any breaking changes"
   ```

6. **Push & Create PR**
   ```bash
   git push origin feature/amazing-new-feature
   ```
   - Create Pull Request on GitHub
   - Fill out PR template
   - Wait for code review

### Code Style Guidelines

#### Frontend (React)
- Use functional components with hooks
- Follow React naming conventions (PascalCase for components)
- Keep components under 300 lines (split if larger)
- Use meaningful variable names
- Add PropTypes or TypeScript for type safety (future)

#### Backend (Express)
- Use async/await for asynchronous operations
- Handle errors with try-catch blocks
- Return consistent response formats
- Add JSDoc comments for functions
- Follow RESTful API conventions

#### General
- Use ESLint for code quality
- Format with Prettier (if configured)
- Write self-documenting code
- Add comments only where necessary

### Testing Requirements

Before submitting PR, ensure:
- [ ] Forms validate correctly (required fields, phone/NIC format)
- [ ] RBAC permissions work (super admin, district admin, DS user)
- [ ] Excel export includes all new fields
- [ ] PDF export renders Unicode correctly
- [ ] Edit modal shows correct fields based on role
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Location cascading works (Province → District → DS → GN)
- [ ] Authentication/logout works
- [ ] Activity logs capture actions

### Documentation

When adding features:
- Update relevant `.md` files (README, implementation guides)
- Add inline code comments for complex logic
- Update API documentation if endpoints change
- Document environment variables if added

### Reporting Bugs

Use GitHub Issues with this template:
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Node Version: [e.g., 22.0.0]
```

---

## 📚 Documentation Reference

- **[RBAC_IMPLEMENTATION_GUIDE.md](./RBAC_IMPLEMENTATION_GUIDE.md)**: Detailed role-based access control
- **[TESTING_COMMUNITY_COUNCIL_UPDATES.md](./TESTING_COMMUNITY_COUNCIL_UPDATES.md)**: CDC form testing guide
- **[VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)**: Step-by-step deployment
- **[I18N_IMPLEMENTATION.md](./I18N_IMPLEMENTATION.md)**: Internationalization setup
- **[BUG_SCAN_SUMMARY.md](./BUG_SCAN_SUMMARY.md)**: Known issues tracker
- **[VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md)**: System verification results

---

---

## ⚡ Quick Reference

### Common Commands

#### Development
```bash
# Frontend
cd PrajaShakthi-VDP-Form-frontend
npm install
npm run dev          # Runs on http://localhost:5173

# Backend
cd PrajaShakthi-VDP-Form-backend
npm install
npm start            # Runs on http://localhost:5000
```

#### Production Build
```bash
# Frontend
npm run build        # Output: dist/ folder

# Backend
# No build needed - runs directly with Node.js
```

#### Database Operations
```bash
# Create super admin
node scripts/createSuperAdmin.js

# Migrate old users (if needed)
node scripts/migrateOldUsers.js

# Connect to MongoDB
mongosh "mongodb+srv://cluster.mongodb.net/prajashakthi" --username <user>
```

### Default User Roles

| Role | Access Level | Permissions |
|------|--------------|-------------|
| `superadmin` | Full system access | All CRUD, user management, all districts |
| `district_admin` | District-level | CRUD within assigned district, user creation for district |
| `ds_user` | DS Division-level | View/create within DS division, no editing |

### Environment Variables Checklist

#### Backend
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Minimum 32 characters
- [ ] `PORT` - Default 5000
- [ ] `NODE_ENV` - development/production
- [ ] `CORS_ORIGIN` - Frontend URL

#### Frontend
- [ ] Update `API_BASE_URL` in `src/api/auth.js`

### Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend Dev | 5173 | http://localhost:5173 |
| Backend Dev | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 (local) |

### File Upload Limits (Current)

| Type | Max Size | Note |
|------|----------|------|
| Form Submission | ~100KB | JSON payload only (no files yet) |
| Excel Export | Unlimited | Client-side generation |
| PDF Export | ~5MB | Canvas-based Unicode rendering |

### Data Validation Rules

#### Phone Numbers
- Pattern: `^0[0-9]{9}$`
- Example: `0771234567`

#### NIC Numbers
- Old format: `123456789V` or `123456789X`
- New format: `200012345678` (12 digits)

#### Required Fields (Community Council)
- Committee Members (Rows 1-5): Name, Position (auto/dropdown), Phone, WhatsApp, NIC, Gender, Permanent Address
- Community Reps (Rows 6-20): Name, Phone, WhatsApp, NIC, Gender, Permanent Address
- Strategic Members (Rows 21-25): Name, Phone, WhatsApp, NIC, Gender, Permanent Address

---

## 📊 System Statistics

### Current Features
- ✅ 3-tier RBAC system
- ✅ 25-row Community Council form with 7 fields per member
- ✅ Trilingual support (Sinhala, Tamil, English)
- ✅ Location hierarchy (Province → District → DS → GN)
- ✅ Excel export with Unicode support
- ✅ PDF export with canvas-based Unicode rendering
- ✅ Edit history tracking
- ✅ Activity logging
- ✅ User management dashboard
- ✅ Secure JWT authentication

### Database Collections
1. **users** - User accounts with RBAC roles
2. **submissions** - Form submissions with edit history
3. **activitylogs** - System-wide activity tracking

### API Endpoints Count
- Authentication: 3 endpoints
- Users: 4 endpoints (Super Admin only)
- Submissions: 4 endpoints (role-based access)
- Activity Logs: 1 endpoint (Super Admin only)
- **Total: 12 REST API endpoints**

---

## 📄 License & Acknowledgments

### License
This project is proprietary software developed for the **PrajaShakthi** community development initiative in Sri Lanka. All rights reserved.

### Development Team
- **Backend Architecture**: Express.js, MongoDB, JWT Authentication
- **Frontend Development**: React 19, Vite, Tailwind CSS
- **Internationalization**: React i18next with Sinhala/Tamil support
- **Export Features**: Canvas-based Unicode rendering for PDFs
- **RBAC System**: Role-based access control with hierarchical permissions

### Data Sources
- **Provincial Data**: Based on Sri Lankan government administrative divisions
- **Development Sectors**: Aligned with national development priorities
- **Community Framework**: Grassroots governance models

### Technologies Used
Special thanks to the open-source community for:
- React & React Router - UI framework
- Express.js - Backend framework
- MongoDB & Mongoose - Database
- jsPDF & jspdf-autotable - PDF generation
- SheetJS (xlsx) - Excel generation
- i18next - Internationalization
- Tailwind CSS - Styling framework

---

## 📞 Support & Contact

### Getting Help
1. **Documentation**: Check relevant `.md` files in the repository
2. **GitHub Issues**: Report bugs or request features
3. **Testing Guide**: Use `TESTING_COMMUNITY_COUNCIL_UPDATES.md` for QA
4. **Deployment Help**: Refer to `VERCEL_DEPLOYMENT_GUIDE.md`

### Reporting Security Issues
If you discover a security vulnerability:
1. **DO NOT** open a public GitHub issue
2. Contact the development team directly
3. Provide detailed reproduction steps
4. Allow reasonable time for fix before disclosure

### Feature Requests
Open a GitHub Issue with:
- Clear description of the feature
- Use case and benefits
- Any relevant mockups or examples
- Priority level (nice-to-have vs critical)

---

## 🎯 Project Roadmap

### Phase 1: Core Features ✅ COMPLETED
- [x] RBAC implementation
- [x] Community Council form with new fields
- [x] Excel/PDF export with Unicode
- [x] Edit history tracking
- [x] Activity logging

### Phase 2: Enhancements 🔄 IN PROGRESS
- [ ] Performance optimization for large datasets
- [ ] Advanced search and filtering
- [ ] Dashboard analytics
- [ ] Mobile responsiveness improvements

### Phase 3: Advanced Features 📅 PLANNED
- [ ] Bulk import from Excel templates
- [ ] Email notifications
- [ ] File attachment support
- [ ] Two-factor authentication
- [ ] API rate limiting
- [ ] Automated backup system

### Phase 4: Scale & Polish 🔮 FUTURE
- [ ] Multi-language admin interface
- [ ] Real-time collaboration
- [ ] Offline mode with sync
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics

---

**Built with ❤️ for Sri Lankan communities by the PrajaShakthi Development Team**

*Last Updated: November 2024*
*Version: 2.0.0 (Community Council Major Update)*

---

## 🔗 Quick Links

- [Testing Guide](./TESTING_COMMUNITY_COUNCIL_UPDATES.md)
- [RBAC Documentation](./RBAC_IMPLEMENTATION_GUIDE.md)
- [Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md)
- [Known Issues](./BUG_SCAN_SUMMARY.md)
- [Internationalization](./I18N_IMPLEMENTATION.md)

---
