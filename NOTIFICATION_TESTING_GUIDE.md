# Notification Feature - Testing Guide

## Quick Test Checklist

### Prerequisites
- [ ] Backend server running (`cd PrajaShakthi-VDP-Form-backend && npm start`)
- [ ] Frontend dev server running (`cd PrajaShakthi-VDP-Form-frontend && npm run dev`)
- [ ] MongoDB connected
- [ ] At least one Super Admin user exists
- [ ] At least one DS User exists

### Test Scenario 1: Create CDC Form Notification

**Steps:**
1. Log in as a DS User
2. Navigate to "Community Council Form"
3. Fill out all required fields
4. Submit the form
5. Log out
6. Log in as Super Admin
7. Check notification bell in header

**Expected Results:**
- ✅ Notification bell shows badge with count "1"
- ✅ Clicking bell shows dropdown with new notification
- ✅ Notification message: "New CDC Form submitted by [DS User Name] in [District]"
- ✅ Notification has green CREATE badge
- ✅ Notification is highlighted with blue background (unread)
- ✅ Blue dot appears next to unread notification
- ✅ Time shows "Just now" or "1m ago"

### Test Scenario 2: Update CDC Form Notification

**Steps:**
1. Log in as DS User (who created the form)
2. Navigate to "My Submissions"
3. Click "View" on a CDC form
4. Click "Edit"
5. Change some field values (e.g., Project Name)
6. Save the changes
7. Log out
8. Log in as Super Admin
9. Check notification bell

**Expected Results:**
- ✅ Notification count increases by 1
- ✅ New notification appears at the top
- ✅ Notification message: "CDC Form updated by [DS User Name] in [District]"
- ✅ Notification has yellow UPDATE badge
- ✅ Change details are visible (e.g., "Project Name changed")
- ✅ Previous notification still visible in dropdown

### Test Scenario 3: Delete CDC Form Notification

**Steps:**
1. Log in as Super Admin
2. Navigate to "View Submissions"
3. Find a CDC form
4. Click "Delete"
5. Confirm deletion
6. Check notification bell

**Expected Results:**
- ✅ Notification count increases by 1
- ✅ New notification appears at the top
- ✅ Notification message: "CDC Form deleted by [Your Name] in [District]"
- ✅ Notification has red DELETE badge
- ✅ Notification shows the Super Admin as triggeredBy

### Test Scenario 4: Mark as Read (Individual)

**Steps:**
1. Log in as Super Admin with unread notifications
2. Click notification bell
3. Click on an unread notification (blue background)

**Expected Results:**
- ✅ Blue background changes to white
- ✅ Blue dot disappears
- ✅ Badge count decreases by 1
- ✅ Notification remains in the dropdown
- ✅ Notification shows as read in full page view

### Test Scenario 5: Mark All as Read

**Steps:**
1. Log in as Super Admin with multiple unread notifications
2. Click notification bell
3. Click "Mark all read" button

**Expected Results:**
- ✅ All notifications lose blue background
- ✅ All blue dots disappear
- ✅ Badge count becomes 0 (no badge shown)
- ✅ All notifications marked as read in full page view

### Test Scenario 6: View All Notifications

**Steps:**
1. Log in as Super Admin
2. Click notification bell
3. Click "View all notifications" button

**Expected Results:**
- ✅ Navigates to full notifications page
- ✅ URL doesn't change (client-side routing)
- ✅ All notifications are displayed (up to 100)
- ✅ Filter tabs are visible (All, Unread, Read)
- ✅ Action filter dropdown is visible
- ✅ Bulk action buttons are visible

### Test Scenario 7: Filter Notifications

**Steps:**
1. On notifications page, click "Unread" tab
2. Verify only unread notifications shown
3. Click "Read" tab
4. Verify only read notifications shown
5. Click "All" tab
6. Use action filter dropdown
7. Select "CREATE_SUBMISSION"

**Expected Results:**
- ✅ Unread tab shows only unread items
- ✅ Read tab shows only read items
- ✅ All tab shows all notifications
- ✅ Action filter shows only CREATE notifications
- ✅ Filters work in combination

### Test Scenario 8: Delete Notification

**Steps:**
1. On notifications page
2. Find a notification
3. Click trash icon (🗑️)
4. Confirm deletion

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Notification disappears from list
- ✅ Total count updates
- ✅ If unread, badge count decreases
- ✅ Notification gone from dropdown too

### Test Scenario 9: Clear Read Notifications

**Steps:**
1. On notifications page with both read and unread notifications
2. Click "Clear Read" button
3. Confirm action

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ All read notifications are removed
- ✅ Unread notifications remain
- ✅ Page updates to show only unread
- ✅ Dropdown reflects the changes

### Test Scenario 10: Real-Time Polling

**Steps:**
1. Open two browser windows
2. Log in as Super Admin in Window 1
3. Log in as DS User in Window 2
4. Keep Window 1 on notifications page
5. In Window 2, create a CDC form
6. Wait up to 30 seconds
7. Observe Window 1

**Expected Results:**
- ✅ After ~30 seconds, badge count updates in Window 1
- ✅ No page refresh needed
- ✅ New notification appears in dropdown
- ✅ Polling continues in background

### Test Scenario 11: Access Control

**Steps:**
1. Log in as DS User
2. Try to access notification bell
3. Try manually navigating to notifications page
4. Log in as District Admin
5. Try to access notification bell

**Expected Results:**
- ✅ DS User: No notification bell visible
- ✅ DS User: Notifications page shows "Access Denied"
- ✅ District Admin: Notification bell visible
- ✅ District Admin: Can access notifications page

### Test Scenario 12: Empty States

**Steps:**
1. Log in as a new Super Admin with no notifications
2. Click notification bell

**Expected Results:**
- ✅ No badge shown
- ✅ Dropdown shows empty state icon
- ✅ Message: "No notifications yet"
- ✅ "View all notifications" button not shown
- ✅ Full page shows similar empty state

### Test Scenario 13: Non-CDC Form (Negative Test)

**Steps:**
1. Log in as DS User
2. Navigate to "Development Form" (if enabled)
3. Submit a development form
4. Log in as Super Admin
5. Check notification bell

**Expected Results:**
- ✅ NO notification created
- ✅ Badge count unchanged
- ✅ Dropdown doesn't show development form notification
- ✅ Only CDC forms trigger notifications

### Test Scenario 14: Multiple Super Admins

**Steps:**
1. Create two Super Admin accounts
2. Log in as DS User
3. Create a CDC form
4. Log in as Super Admin 1
5. Check notifications
6. Log out
7. Log in as Super Admin 2
8. Check notifications

**Expected Results:**
- ✅ Both Super Admins receive the notification
- ✅ Each has their own unread count
- ✅ Marking read in one account doesn't affect the other
- ✅ Deleting in one account doesn't affect the other

### Test Scenario 15: Bell Icon UI

**Steps:**
1. Log in as Super Admin
2. Observe notification bell
3. Create some notifications
4. Check badge display

**Expected Results:**
- ✅ Bell icon is visible and properly styled
- ✅ Badge appears at top-right of bell
- ✅ Badge shows correct count (1-99)
- ✅ For 100+ notifications, shows "99+"
- ✅ Badge has red background
- ✅ Bell is clickable with hover effect

## Performance Testing

### Load Test
**Steps:**
1. Create 100+ notifications
2. Open notifications page
3. Check load time
4. Test filtering performance

**Expected Results:**
- ✅ Page loads in < 2 seconds
- ✅ Filters apply instantly
- ✅ No lag when scrolling
- ✅ Smooth animations

### Polling Test
**Steps:**
1. Open browser dev tools (Network tab)
2. Log in as Super Admin
3. Observe network requests every 30 seconds
4. Let it run for 5 minutes

**Expected Results:**
- ✅ GET /api/notifications/unread-count every ~30s
- ✅ Requests complete quickly (< 500ms)
- ✅ No errors in console
- ✅ No memory leaks

## Browser Compatibility

Test in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

## Known Issues to Check

1. **Timezone Display**: Check if times are displayed in user's local timezone
2. **Long Names**: Test with very long user names or district names
3. **Special Characters**: Test with names containing special characters
4. **Concurrent Actions**: Test rapid create/update/delete actions
5. **Network Errors**: Test behavior when API is down

## Debugging Tips

### Backend Issues
```bash
# Check notification creation
db.notifications.find().sort({createdAt: -1}).limit(5)

# Check indexes
db.notifications.getIndexes()

# Count notifications by user
db.notifications.countDocuments({recipientId: ObjectId("...")})
```

### Frontend Issues
```javascript
// Check polling in browser console
localStorage.setItem('debug', 'notifications:*')

// Check unread count
console.log('Unread count:', document.querySelector('.notification-badge')?.textContent)

// Check API calls
// Network tab -> Filter by "notifications"
```

### Common Problems

**Problem**: No notifications appearing
- Solution: Check MongoDB connection, verify Super Admin role, check console errors

**Problem**: Badge count not updating
- Solution: Check polling interval, verify API endpoint, check network tab

**Problem**: "Access Denied" for Super Admin
- Solution: Clear cookies, re-login, verify role in database

**Problem**: Notifications not marked as read
- Solution: Check API response, verify notification ID, check authentication

## Success Criteria

All tests must pass:
- ✅ All 15 test scenarios completed successfully
- ✅ No console errors during testing
- ✅ All UI elements render correctly
- ✅ All API endpoints respond correctly
- ✅ Real-time polling works consistently
- ✅ Access control enforced properly
- ✅ Performance is acceptable
- ✅ Works across all supported browsers

## Reporting Issues

When reporting bugs, include:
1. Test scenario number
2. Steps to reproduce
3. Expected vs actual result
4. Browser and version
5. Console errors (if any)
6. Network response (if API error)
7. User role used for testing

---

**Last Updated**: December 2024
**Version**: 1.0
**Status**: Ready for Testing
