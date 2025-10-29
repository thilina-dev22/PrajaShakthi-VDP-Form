# 🔔 Notification System - Quick Visual Reference

## Icon Reference

### Category Icons
| Category | Icon | Color | Example Actions |
|----------|------|-------|-----------------|
| **Submissions** | 📝 | Green | Create, Update, Delete form |
| **Users** | 👤 | Purple | Create, Update, Delete user |
| **Security** | 🔒 | Red | Failed login, Suspicious activity |
| **System** | ⚙️ | Indigo | Pending reviews, Inactive users |
| **Exports** | 📊 | Cyan | PDF/Excel exports |
| **Summaries** | 📈 | Teal | Daily/Weekly/Monthly reports |

---

## Priority Levels

| Priority | Emoji | Color | Use Case | Badge |
|----------|-------|-------|----------|-------|
| **Critical** | 🔴 | Red | Account locked, Security breaches | `bg-red-100 text-red-800` |
| **High** | 🟠 | Orange | User deletion, Failed logins | `bg-orange-100 text-orange-800` |
| **Medium** | 🟡 | Yellow | Submissions, User updates | `bg-yellow-100 text-yellow-800` |
| **Low** | 🔵 | Blue | Summaries, Exports, Milestones | `bg-blue-100 text-blue-800` |

---

## All 27 Notification Types

### 📝 Submissions (3)
| Action | Icon | Priority | Description |
|--------|------|----------|-------------|
| CREATE_SUBMISSION | ➕ | Medium | New CDC form or Development Plan created |
| UPDATE_SUBMISSION | ✏️ | Medium | Form edited |
| DELETE_SUBMISSION | 🗑️ | Medium | Form deleted |

### 👤 Users (5)
| Action | Icon | Priority | Description |
|--------|------|----------|-------------|
| CREATE_USER | ➕ | Medium | New DS User created by District Admin |
| UPDATE_USER | ✏️ | Medium | User details updated |
| DELETE_USER | 🗑️ | High | User account deleted |
| ACTIVATE_USER | ✅ | Medium | User account activated |
| DEACTIVATE_USER | ⏸️ | Medium | User account deactivated |

### 🔒 Security (7)
| Action | Icon | Priority | Description |
|--------|------|----------|-------------|
| FAILED_LOGIN | 🔐 | High | 3+ failed login attempts |
| ACCOUNT_LOCKED | 🔐 | Critical | Account locked due to suspicious activity |
| SUSPICIOUS_LOGIN | ⚠️ | High | Login from unusual location |
| MULTIPLE_EDITS | ⚡ | Medium | Submission edited 3+ times |
| CRITICAL_FIELD_CHANGE | ⚡ | High | NIC, Position, or Gender changed |
| DUPLICATE_NIC | ⚠️ | Medium | Same NIC found in multiple submissions |
| DATA_ANOMALY | ⚠️ | Medium | Unusual data pattern detected |

### 📊 Exports (3)
| Action | Icon | Priority | Description |
|--------|------|----------|-------------|
| EXPORT_PDF | 📥 | Low | PDF export generated |
| EXPORT_EXCEL | 📥 | Low | Excel export generated |
| BULK_DELETE | 🗑️ | High | Multiple submissions deleted at once |

### 📈 Summaries (4)
| Action | Icon | Priority | Description |
|--------|------|----------|-------------|
| DAILY_SUMMARY | 📊 | Low | Daily submission report (6 PM) |
| WEEKLY_SUMMARY | 📊 | Low | Weekly submission report (Monday 9 AM) |
| MONTHLY_SUMMARY | 📊 | Low | Monthly submission report (1st 9 AM) |
| QUARTERLY_REPORT | 📊 | Low | Quarterly submission report |

### ⚙️ System (5)
| Action | Icon | Priority | Description |
|--------|------|----------|-------------|
| PENDING_REVIEW_REMINDER | ⏰ | Medium | Submissions older than 7 days (10 AM daily) |
| INACTIVE_USER_ALERT | 💤 | Medium | User inactive for 30+ days (Sunday 10 AM) |
| MILESTONE_REACHED | 🎉 | Low | District reached 50/100/250/500/1000 submissions |

---

## Filter Combinations Examples

### 🚨 Critical Issues
```
Priority: Critical
Shows: Account locked, critical security breaches
```

### 🔐 Security Dashboard
```
Category: Security
Shows: All failed logins, suspicious activity, data anomalies
```

### 👥 User Management
```
Category: User
Shows: All user creations, updates, deletions
```

### 📊 Today's Activity
```
Category: Submission
Filter: Unread
Shows: All new form submissions
```

### 📈 Reports Only
```
Category: Summary
Shows: All daily/weekly/monthly reports
```

### ⚠️ High Priority Alerts
```
Priority: High
Shows: User deletions, failed logins, critical changes
```

---

## Notification Card Example

```
┌──────────────────────────────────────────────────────────┐
│ 📝 [Created] [SUBMISSION] 🟡 MEDIUM  Jan 29, 2025 NEW   │
│                                                          │
│ New CDC Form submitted for Colombo District             │
│                                                          │
│ 📍 Colombo • Colombo North • Ward 5                    │
│ 📋 CDC Form                                             │
│ 👤 By: John Doe (DS User)                               │
│                                                          │
│ ┌────────────────────────────────────────┐             │
│ │ Changes:                               │             │
│ │ Added 5 new council members            │             │
│ └────────────────────────────────────────┘             │
│                                           [Mark Read]    │
│                                           [Delete]       │
└──────────────────────────────────────────────────────────┘
```

---

## NotificationBell Dropdown Example

```
┌────────────────────────────────────┐
│ Notifications    Mark all read    │
├────────────────────────────────────┤
│ 🔒               📝 SECURITY      │
│ 🔴               HIGH             │
│                                   │
│ 3 failed login attempts           │
│ 🌐 192.168.1.100                 │
│ 5m ago                           ●│
├────────────────────────────────────┤
│ 👤               📝 USER          │
│ 🟡               MEDIUM           │
│                                   │
│ New user created: Jane Smith      │
│ 👤 By: Admin User                │
│ 10m ago                            │
├────────────────────────────────────┤
│          View all notifications    │
└────────────────────────────────────┘
```

---

## Color Palette

### Action Badge Colors
```css
/* Submissions */
CREATE: bg-green-100 text-green-800
UPDATE: bg-blue-100 text-blue-800
DELETE: bg-red-100 text-red-800

/* Users */
USER_CREATE: bg-purple-100 text-purple-800
USER_UPDATE: bg-purple-100 text-purple-800
USER_DELETE: bg-red-100 text-red-800
ACTIVATE: bg-green-100 text-green-800
DEACTIVATE: bg-orange-100 text-orange-800

/* Security */
FAILED_LOGIN: bg-red-100 text-red-800
SUSPICIOUS: bg-orange-100 text-orange-800
ANOMALY: bg-yellow-100 text-yellow-800

/* Exports */
EXPORT: bg-cyan-100 text-cyan-800

/* Summaries */
SUMMARY: bg-teal-100 text-teal-800

/* System */
SYSTEM: bg-indigo-100 text-indigo-800
MILESTONE: bg-green-100 text-green-800
```

### Category Badge Colors
```css
submission: bg-green-100 text-green-800
user: bg-purple-100 text-purple-800
security: bg-red-100 text-red-800
system: bg-indigo-100 text-indigo-800
export: bg-cyan-100 text-cyan-800
summary: bg-teal-100 text-teal-800
```

---

## Quick Tips

### For Super Admins
- 🔴 **Check Critical first**: Filter by Priority: Critical
- 🔒 **Security monitoring**: Filter by Category: Security
- 📊 **Daily overview**: Check Daily Summary notifications
- ⏰ **Pending items**: Look for Pending Review reminders

### For District Admins
- 📍 **Your district only**: Notifications auto-filtered to your district
- 📝 **New submissions**: Check unread submission notifications
- 📈 **Weekly reports**: Review Weekly Summary every Monday

### Understanding Priorities
- 🔴 **Critical** = Immediate action needed (account locked)
- 🟠 **High** = Important, review soon (user deletion)
- 🟡 **Medium** = Normal activity (form updates)
- 🔵 **Low** = Informational (reports, milestones)

---

## Keyboard Shortcuts (Future Enhancement)

| Key | Action |
|-----|--------|
| `N` | Open notifications |
| `M` | Mark all as read |
| `↑` `↓` | Navigate notifications |
| `Enter` | Open selected notification |
| `Del` | Delete selected notification |

---

**Last Updated**: January 29, 2025
**Version**: 2.0 (Comprehensive Notification System)
