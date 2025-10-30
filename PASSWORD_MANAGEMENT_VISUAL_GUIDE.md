# Password Management - Visual Guide

## User Interface Overview

### 1. Navigation Bar - All Users

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] PrajaShakthi                                             │
│                                                                 │
│  [Council Form]  [My Submissions]  [Password Management]  ...  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Navigation Bar - Admins

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] PrajaShakthi                                             │
│                                                                 │
│  [Submissions]  [User Management]  [Activity Logs]              │
│  [Password Management]  [Notifications]                         │
└─────────────────────────────────────────────────────────────────┘
```

## Password Management Page

### For DS Users (Own Password Only)

```
┌─────────────────────────────────────────────────────────┐
│                  Password Management                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [Change My Password]                              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Current Password                                       │
│  ┌────────────────────────────────────────────────┐    │
│  │ ••••••••                                        │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  New Password                                           │
│  ┌────────────────────────────────────────────────┐    │
│  │ ••••••••                                        │    │
│  └────────────────────────────────────────────────┘    │
│  Minimum 6 characters required                          │
│                                                         │
│  Confirm New Password                                   │
│  ┌────────────────────────────────────────────────┐    │
│  │ ••••••••                                        │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│           ┌──────────────────────┐                      │
│           │  Update Password     │                      │
│           └──────────────────────┘                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ⓘ Security Tips                                 │   │
│  │ • Use a strong password with letters, numbers   │   │
│  │ • Change your password regularly                │   │
│  │ • Never share your password with anyone         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### For Admins (Two Tabs Available)

```
┌─────────────────────────────────────────────────────────┐
│                  Password Management                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────┬─────────────────────────┐    │
│  │ Change My Password   │ Manage Subordinates     │    │
│  └──────────────────────┴─────────────────────────┘    │
│                                                         │
│  [Same form as DS User above]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Manage Subordinates Tab

```
┌─────────────────────────────────────────────────────────┐
│                  Password Management                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────┬─────────────────────────┐    │
│  │ Change My Password   │ [Manage Subordinates]   │    │
│  └──────────────────────┴─────────────────────────┘    │
│                                                         │
│  Select User to Reset Password                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ district_admin_colombo - District Admin ▼      │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Selected User                                   │   │
│  │                                                 │   │
│  │ Username:  district_admin_colombo              │   │
│  │ Role:      District Admin                       │   │
│  │ District:  Colombo                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  New Password                                           │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│  Minimum 6 characters required                          │
│                                                         │
│  Confirm New Password                                   │
│  ┌────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                                                         │
│           ┌──────────────────────┐                      │
│           │  Reset Password      │  (Red Button)        │
│           └──────────────────────┘                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ⓘ Security Tips                                 │   │
│  │ • Use a strong password with letters, numbers   │   │
│  │ • Change your password regularly                │   │
│  │ • Never share your password with anyone         │   │
│  │ • Inform subordinates immediately after reset   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Success Messages

### Own Password Changed
```
┌─────────────────────────────────────────────────────────┐
│  ✓ Your password has been changed successfully         │
└─────────────────────────────────────────────────────────┘
```

### Subordinate Password Reset
```
┌─────────────────────────────────────────────────────────┐
│  ✓ Password reset successfully for district_admin_col  │
└─────────────────────────────────────────────────────────┘
```

## Error Messages

### Current Password Incorrect
```
┌─────────────────────────────────────────────────────────┐
│  ✗ Current password is incorrect                        │
└─────────────────────────────────────────────────────────┘
```

### Password Too Short
```
┌─────────────────────────────────────────────────────────┐
│  ✗ New password must be at least 6 characters long     │
└─────────────────────────────────────────────────────────┘
```

### Passwords Don't Match
```
┌─────────────────────────────────────────────────────────┐
│  ✗ Passwords do not match                              │
└─────────────────────────────────────────────────────────┘
```

## Dropdown Options for Admins

### Super Admin Sees (District Admins)
```
┌────────────────────────────────────────────────────────┐
│ -- Select User --                                  ▼   │
├────────────────────────────────────────────────────────┤
│ district_admin_colombo - District Admin - Colombo      │
│ district_admin_gampaha - District Admin - Gampaha      │
│ district_admin_kalutara - District Admin - Kalutara    │
│ district_admin_kandy - District Admin - Kandy          │
│ ...                                                    │
└────────────────────────────────────────────────────────┘
```

### District Admin Sees (DS Users in Their District)
```
┌────────────────────────────────────────────────────────┐
│ -- Select User --                                  ▼   │
├────────────────────────────────────────────────────────┤
│ ds_user_colombo_01 - DS User - Colombo - Thimbirigasy │
│ ds_user_colombo_02 - DS User - Colombo - Dehiwala     │
│ ds_user_colombo_03 - DS User - Colombo - Homagama     │
│ ds_user_colombo_04 - DS User - Colombo - Kaduwela     │
│ ...                                                    │
└────────────────────────────────────────────────────────┘
```

## Mobile Responsive View

### Compact Layout (Phone)
```
┌──────────────────────┐
│ Password Management  │
├──────────────────────┤
│                      │
│ ┌──────────────────┐ │
│ │ Change Password  │ │
│ └──────────────────┘ │
│                      │
│ Current Password     │
│ ┌──────────────────┐ │
│ │                  │ │
│ └──────────────────┘ │
│                      │
│ New Password         │
│ ┌──────────────────┐ │
│ │                  │ │
│ └──────────────────┘ │
│                      │
│ Confirm Password     │
│ ┌──────────────────┐ │
│ │                  │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ Update Password  │ │
│ └──────────────────┘ │
│                      │
└──────────────────────┘
```

## Multi-Language Support

The entire interface is available in:

### English
- "Password Management"
- "Change My Password"
- "Manage Subordinate Passwords"
- etc.

### Sinhala (සිංහල)
- "මුරපද කළමනාකරණය"
- "මගේ මුරපදය වෙනස් කරන්න"
- "යටත් පරිශීලකයින්ගේ මුරපද කළමනාකරණය"
- etc.

### Tamil (தமிழ்)
- "கடவுச்சொல் மேலாண்மை"
- "எனது கடவுச்சொல்லை மாற்று"
- "கீழ் பயனர்களின் கடவுச்சொற்களை மேலாண்மை செய்"
- etc.

## Color Scheme

- **Primary Action (Update Own Password)**: Blue (`bg-blue-600`)
- **Destructive Action (Reset Subordinate)**: Red (`bg-red-600`)
- **Success Messages**: Green background
- **Error Messages**: Red background
- **Information/Tips**: Blue background
- **Navigation Buttons**: Burgundy (`bg-[#680921]`)

## Workflow Diagram

### Own Password Change Flow
```
User clicks "Password Management"
        ↓
Enters current password
        ↓
Enters new password (2x)
        ↓
Clicks "Update Password"
        ↓
Backend verifies current password
        ↓
    ┌───────┐
    │Success│ → Password updated
    └───────┘   Activity logged
                User notified
    ┌───────┐
    │Failure│ → Error shown
    └───────┘   User tries again
```

### Subordinate Password Reset Flow
```
Admin clicks "Password Management"
        ↓
Switches to "Manage Subordinates" tab
        ↓
Selects user from dropdown
        ↓
Reviews user details
        ↓
Enters new password (2x)
        ↓
Clicks "Reset Password"
        ↓
Backend checks permissions
        ↓
    ┌───────┐
    │Success│ → Password reset
    └───────┘   Activity logged
                Super admin notified
                Admin informs user
    ┌───────┐
    │Failure│ → Permission error
    └───────┘   or validation error
```

## Activity Log Entries

### When User Changes Own Password
```
┌─────────────────────────────────────────────────────────┐
│ Action:     CHANGE_OWN_PASSWORD                         │
│ User:       ds_user_colombo_01                          │
│ Timestamp:  2024-01-15 14:30:22                         │
│ IP:         192.168.1.10                                │
│ Details:    User changed their own password             │
└─────────────────────────────────────────────────────────┘
```

### When Admin Resets Subordinate Password
```
┌─────────────────────────────────────────────────────────┐
│ Action:     RESET_SUBORDINATE_PASSWORD                  │
│ User:       district_admin_colombo                      │
│ Target:     ds_user_colombo_05                          │
│ Timestamp:  2024-01-15 14:35:10                         │
│ IP:         192.168.1.11                                │
│ Details:    Reset password for ds_user_colombo_05       │
└─────────────────────────────────────────────────────────┘
```

## Permission Enforcement

```
DS User attempts to:
  - Change own password        → ✅ Allowed
  - View subordinates         → ❌ Blocked (403 Forbidden)
  - Reset another user        → ❌ Blocked (403 Forbidden)

District Admin attempts to:
  - Change own password        → ✅ Allowed
  - View DS users (own dist)  → ✅ Allowed
  - View DS users (other dist)→ ❌ Blocked (no data returned)
  - Reset DS user (own dist)  → ✅ Allowed
  - Reset DS user (other dist)→ ❌ Blocked (403 Forbidden)
  - Reset district admin      → ❌ Blocked (403 Forbidden)

Super Admin attempts to:
  - Change own password        → ✅ Allowed
  - View district admins      → ✅ Allowed
  - Reset district admin      → ✅ Allowed
  - Reset DS user directly    → ❌ Blocked (403 Forbidden)
                                  (must be done by district admin)
```

This visual guide shows exactly how the password management system appears and functions for all user roles!
