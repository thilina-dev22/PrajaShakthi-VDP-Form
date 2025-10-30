# Activity Log Cleanup - Quick Testing Guide

## 🚀 Quick Start

### 1. Start the Server
```bash
cd PrajaShakthi-VDP-Form-backend
npm start
```

**Expected Output:**
```
Server running on port 5000
✅ Activity log cleanup scheduler initialized
Cleanup reminder scheduled for: [next 27th at 9:00 AM]
Cleanup deletion scheduled for: [last day of month at 11:59 PM]
```

### 2. Verify Routes are Working

#### Test 1: Get Activity Logs
```bash
# Login first to get token, then:
curl -X GET "http://localhost:5000/api/activity-logs?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --cookie "token=YOUR_TOKEN"
```

**Expected:** List of activity logs (JSON)

#### Test 2: Get Logs Statistics
```bash
curl -X GET "http://localhost:5000/api/activity-logs/stats" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --cookie "token=YOUR_TOKEN"
```

**Expected:** Stats with total logs, pending deletion count, etc.

#### Test 3: Preview Pending Deletion (Super Admin Only)
```bash
curl -X GET "http://localhost:5000/api/activity-logs/pending-deletion" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --cookie "token=YOUR_TOKEN"
```

**Expected:** Count and preview of logs older than 1 month

#### Test 4: Export Activity Logs
```bash
curl -X GET "http://localhost:5000/api/activity-logs/export?includeOldLogs=true" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --cookie "token=YOUR_TOKEN" \
  -o activity-logs-export.json
```

**Expected:** Downloaded JSON file

---

## 🧪 Manual Testing (Without Waiting for Month End)

### Test Deletion Function Manually

Open Node.js REPL or create a test script:

```javascript
// test-cleanup.js
const mongoose = require('mongoose');
const { deleteOldActivityLogs, notifyUpcomingLogDeletion } = require('./utils/activityLogCleanup');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Test 1: Preview logs to be deleted
    console.log('\n--- Testing Log Count ---');
    const { getLogsToDeleteCount } = require('./utils/activityLogCleanup');
    const count = await getLogsToDeleteCount();
    console.log(`Logs to be deleted: ${count}`);
    
    // Test 2: Send warning notification
    console.log('\n--- Testing Warning Notification ---');
    await notifyUpcomingLogDeletion();
    console.log('Warning notification sent!');
    
    // Test 3: Perform deletion (UNCOMMENT ONLY IF YOU WANT TO TEST ACTUAL DELETION)
    // console.log('\n--- Testing Deletion ---');
    // await deleteOldActivityLogs();
    // console.log('Deletion complete!');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
```

Run:
```bash
node test-cleanup.js
```

---

## 🎨 Frontend Testing

### 1. Login as Super Admin
Navigate to: `http://localhost:5173/login`

### 2. Go to Notifications Page
Click on the bell icon → "View All Notifications"

### 3. Test Download Button

**Expected UI Elements:**
- **Top Action Bar**: Purple "📥 Download Logs" button (Super Admin only)
- **Notification Filters**: New options in System category:
  - "Log Cleanup Warning"
  - "System Cleanup"

### 4. Test Log Download

1. Click "Download Logs" button
2. Browser should download: `activity-logs-YYYY-MM-DD.json`
3. Open file to verify contents

### 5. Test LOG_DELETION_REMINDER Notification

If you manually triggered the warning notification:

1. You should see a notification with:
   - **Icon**: ⚠️
   - **Badge**: Yellow "Log Cleanup Warning"
   - **Message**: "⚠️ Activity Log Cleanup: X logs will be deleted..."
   - **Action Button**: "📥 Download Old Logs"

2. Click "Download Old Logs" button
3. Browser should download: `activity-logs-old-YYYY-MM-DD.json`

---

## 📊 Monitoring Cron Jobs

### Check Next Execution Time

Add this temporary endpoint to `server.js` (for testing only):

```javascript
// Testing endpoint - REMOVE IN PRODUCTION
app.get('/api/test/cron-status', (req, res) => {
  const { getNextLastDayOfMonth } = require('./utils/activityLogCleanup');
  const nextDeletion = getNextLastDayOfMonth();
  
  res.json({
    message: 'Cron job status',
    nextWarning: 'Every month on 27th at 9:00 AM',
    nextDeletion: nextDeletion.toLocaleString(),
    currentDate: new Date().toLocaleString(),
    daysUntilDeletion: Math.ceil((nextDeletion - new Date()) / (1000 * 60 * 60 * 24))
  });
});
```

Visit: `http://localhost:5000/api/test/cron-status`

---

## 🐛 Debugging Tips

### Check Server Logs

**Successful Initialization:**
```
Server running on port 5000
✅ Activity log cleanup scheduler initialized
Cleanup reminder scheduled for: [Date]
Cleanup deletion scheduled for: [Date]
```

**On 27th at 9 AM:**
```
📧 Sending LOG_DELETION_REMINDER notification to Super Admins
Logs to be deleted: 5432
Deletion scheduled for: [last day of month]
```

**On Last Day at 11:59 PM:**
```
🗑️ Deleting activity logs older than 1 month
Deleted 5432 activity logs
📧 Sending SYSTEM_CLEANUP notification to Super Admins
```

### Check MongoDB

```javascript
// Connect to MongoDB shell
use your_database_name

// Count total activity logs
db.activitylogs.countDocuments()

// Count logs older than 1 month
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
db.activitylogs.countDocuments({ createdAt: { $lt: oneMonthAgo } })

// Check recent notifications
db.notifications.find({ 
  action: { $in: ['LOG_DELETION_REMINDER', 'SYSTEM_CLEANUP'] } 
}).sort({ createdAt: -1 }).limit(5)
```

---

## ✅ Test Checklist

### Backend Tests
- [ ] Server starts without errors
- [ ] Scheduler initialization message appears
- [ ] GET /api/activity-logs returns data
- [ ] GET /api/activity-logs/stats returns correct stats
- [ ] GET /api/activity-logs/pending-deletion shows accurate count
- [ ] GET /api/activity-logs/export downloads JSON file
- [ ] Role-based filtering works (District Admin sees only their district)
- [ ] Manual execution of `notifyUpcomingLogDeletion()` creates notification
- [ ] Manual execution of `deleteOldActivityLogs()` deletes logs

### Frontend Tests
- [ ] "Download Logs" button appears for Super Admin
- [ ] "Download Logs" button NOT visible for non-Super Admins
- [ ] Clicking download button triggers file download
- [ ] Downloaded file has correct format and data
- [ ] LOG_DELETION_REMINDER notifications display correctly
- [ ] Yellow badge and ⚠️ icon appear
- [ ] "Download Old Logs" button appears on reminder notifications
- [ ] Clicking "Download Old Logs" downloads file with old logs
- [ ] SYSTEM_CLEANUP notifications display with blue badge and 🧹 icon
- [ ] Filter dropdown includes new notification types

### Integration Tests
- [ ] Create test activity logs with old dates
- [ ] Verify they appear in pending deletion
- [ ] Execute manual deletion
- [ ] Verify logs are actually deleted from database
- [ ] Verify notification is created after deletion
- [ ] Check notification appears on frontend

---

## 🎯 Production Deployment Checklist

Before deploying to production:

- [ ] Remove any test/debug endpoints
- [ ] Verify cron timezone matches server timezone
- [ ] Ensure MongoDB indexes exist on ActivityLog.createdAt
- [ ] Test notification delivery to all Super Admins
- [ ] Verify backup/export functionality works
- [ ] Document the feature in User Manual
- [ ] Inform Super Admins about the new feature
- [ ] Set up monitoring for cron job execution
- [ ] Test on staging environment first
- [ ] Verify server has enough resources for monthly cleanup

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: Cron jobs not running  
**Solution**: Check server timezone, verify scheduler initialization

**Issue**: Download button not appearing  
**Solution**: Verify user has Super Admin role, check browser console for errors

**Issue**: Notifications not received  
**Solution**: Check Super Admin users exist, verify notifySuperAdmins() function

**Issue**: Export endpoint returns 403  
**Solution**: Verify authentication token is valid and user has proper role

---

**Last Updated**: January 2025  
**Status**: Ready for Testing  
**Contact**: [Your Contact Info]
