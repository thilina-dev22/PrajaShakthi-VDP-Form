# Role-Based Access Control Implementation Guide

## Overview

This system implements a three-tier hierarchical role-based access control (RBAC) system for the PrajaShakthi VDP Form application:

1. **Super Admin** - Top-level administrator with full system access
2. **District Admin** - Manages users and data for their assigned district (24 districts in Sri Lanka)
3. **DS User** - Divisional Secretariat users who create and manage form submissions for their DS division

## System Architecture

### User Hierarchy

```
Super Admin (1 account)
    ├── District Admin (Colombo)
    │   ├── DS User (Colombo - Kollupitiya)
    │   ├── DS User (Colombo - Thimbirigasyaya)
    │   └── ...
    ├── District Admin (Kandy)
    │   ├── DS User (Kandy - Gampola)
    │   └── ...
    └── ... (24 districts total)
```

### Role Permissions

#### Super Admin
- Create and manage District Admin accounts (one per district)
- View all submissions from all districts
- View all activity logs
- Cannot create DS Users directly
- Cannot create form submissions

#### District Admin
- Create and manage DS User accounts within their district
- View all submissions from their district
- View activity logs from their district
- Cannot create other District Admins
- Cannot create form submissions

#### DS User
- Create form submissions for their DS division
- View and edit their own submissions
- Cannot view other DS users' submissions
- Cannot create other users
- Limited access to activity logs (only their own)

## Database Schema

### User Model
```javascript
{
    username: String (unique),
    password: String (hashed),
    role: String ('superadmin' | 'district_admin' | 'ds_user'),
    district: String (required for district_admin and ds_user),
    divisionalSecretariat: String (required for ds_user),
    createdBy: ObjectId (ref: User),
    fullName: String,
    email: String,
    isActive: Boolean,
    timestamps: true
}
```

### Submission Model (Updated)
```javascript
{
    ...existing fields...,
    createdBy: ObjectId (ref: User),
    lastModifiedBy: ObjectId (ref: User),
    editHistory: [{
        editedBy: ObjectId,
        editedAt: Date,
        changes: String
    }],
    status: String ('draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'),
    timestamps: true
}
```

### Activity Log Model
```javascript
{
    user: ObjectId (ref: User),
    username: String,
    userRole: String,
    action: String (LOGIN, LOGOUT, CREATE_USER, UPDATE_USER, etc.),
    targetType: String (User, Submission, System),
    targetId: ObjectId,
    details: Mixed,
    ipAddress: String,
    userAgent: String,
    district: String,
    divisionalSecretariat: String,
    timestamp: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login (all roles)
- `POST /api/auth/logout` - User logout (requires auth)
- `GET /api/auth/status` - Check authentication status

### User Management
- `POST /api/users` - Create user (SuperAdmin/DistrictAdmin only)
- `GET /api/users` - List users (SuperAdmin/DistrictAdmin only)
- `PUT /api/users/:id` - Update user (SuperAdmin/DistrictAdmin only)
- `DELETE /api/users/:id` - Delete user (SuperAdmin/DistrictAdmin only)

### Submissions
- `POST /api/submissions` - Create submission (DS User only)
- `GET /api/submissions` - Get submissions (filtered by role)
- `PUT /api/submissions/:id` - Update submission (creator or district admin)
- `DELETE /api/submissions/:id` - Delete submission (creator or district admin)

### Activity Logs
- `GET /api/users/logs` - Get activity logs (filtered by role)

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd PrajaShakthi-VDP-Form-backend
npm install
```

#### Environment Variables
Ensure your `.env` file has:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

#### Create Super Admin Account
Run the initialization script:
```bash
node scripts/createSuperAdmin.js
```

Default credentials:
- Username: `superadmin`
- Password: `Admin@123`

**⚠️ IMPORTANT: Change this password immediately after first login!**

#### Migrate Existing Users (if applicable)
If you have existing admin users:
```bash
node scripts/migrateOldUsers.js
```

#### Start Backend Server
```bash
npm start
```

### 2. Frontend Setup

#### Install Dependencies
```bash
cd PrajaShakthi-VDP-Form-frontend
npm install
```

#### Start Development Server
```bash
npm run dev
```

## Usage Workflow

### Initial Setup
1. Super Admin logs in with default credentials
2. Super Admin creates 24 District Admin accounts (one per district)
3. Each District Admin logs in and creates DS User accounts for their district's divisions

### Daily Operations

#### Super Admin Workflow
1. Login → User Management Dashboard
2. Create/Manage District Admins
3. View all submissions and activity logs
4. Monitor system-wide activity

#### District Admin Workflow
1. Login → User Management Dashboard
2. Create/Manage DS Users for their district
3. View submissions from their district
4. Monitor district activity logs

#### DS User Workflow
1. Login → Form Submission Interface
2. Create new submissions for GN divisions
3. View and edit their own submissions
4. Track submission status

## Security Features

### Authentication
- JWT-based authentication with HTTP-only cookies
- Passwords hashed with bcryptjs (10 salt rounds)
- Token expiration: 30 days
- Account status checking (active/inactive)

### Authorization
- Role-based middleware protection
- Resource ownership validation
- District-level data isolation
- Activity logging for all actions

### Activity Logging
All user actions are logged with:
- User information (ID, username, role)
- Action type
- Target resource
- Timestamp
- IP address and user agent
- District and DS division context

## Frontend Components

### New Components
1. **UserManagement.jsx** - Create and manage users
2. **ActivityLogs.jsx** - View system activity logs
3. **Updated Navigation.jsx** - Role-based navigation
4. **Updated AppRoutes.jsx** - Role-based routing

### Updated Context
**AuthContext** now provides:
- `isSuperAdmin` - Check if user is super admin
- `isDistrictAdmin` - Check if user is district admin
- `isDSUser` - Check if user is DS user
- `isAdmin` - Check if user is any admin (super or district)

## Troubleshooting

### Common Issues

#### Cannot create users
- Verify you're logged in with the correct role
- Super Admin can only create District Admins
- District Admins can only create DS Users for their district

#### Cannot see submissions
- DS Users only see their own submissions
- District Admins only see submissions from their district
- Super Admin sees all submissions

#### Activity logs not showing
- Ensure backend logging is working
- Check database connection
- Verify user has permission to view logs

### Database Indexes
The system creates indexes on:
- User: username (unique)
- ActivityLog: user, action, district (for efficient queries)
- Submission: createdBy, district, divisionalSec (for filtering)

## Migration from Old System

If migrating from the old two-tier system (user/admin):

1. Run migration script: `node scripts/migrateOldUsers.js`
2. Old 'admin' users become 'superadmin'
3. Old 'user' role is deprecated (no longer used)
4. Update existing submissions to add tracking fields

## Best Practices

### For Super Admin
- Create exactly 24 District Admin accounts (one per district)
- Use descriptive usernames (e.g., `district_colombo`)
- Provide secure initial passwords and require change on first login
- Regularly review activity logs
- Keep the super admin password secure and change it regularly

### For District Admins
- Create DS User accounts for all divisions in your district
- Use naming convention: `ds_<district>_<division>`
- Monitor your district's submission quality
- Review district activity logs weekly

### For DS Users
- Always fill in complete form information
- Add meaningful descriptions when editing submissions
- Review submissions before final submission
- Report any issues to District Admin

## Support and Maintenance

### Regular Maintenance Tasks
1. Weekly: Review activity logs
2. Monthly: Audit user accounts
3. Quarterly: Review and cleanup inactive accounts
4. Backup database regularly

### Monitoring
- Check activity logs for unusual patterns
- Monitor failed login attempts
- Track submission rates by district

## Future Enhancements

Potential improvements:
- Password reset functionality
- Email notifications for user creation
- Bulk user creation from CSV
- Advanced reporting and analytics
- Export functionality for submissions and logs
- Two-factor authentication
- Session management (force logout)
- User profile management

---

For technical support or questions, contact the system administrator.
