# Password Reset Feature - User Guide

## How to Reset Your Own Password

### Step 1: Access Your Profile
1. Log in to the application
2. Look for the **"Profile"** button in the top navigation bar (next to the notification bell)
3. Click the **"Profile"** button

### Step 2: View Your Profile
You will see your profile information including:
- Username
- Role (Super Admin / District Admin / DS User)
- Full Name (if set)
- Email (if set)
- District (if applicable)
- Divisional Secretariat (if applicable)

### Step 3: Reset Your Password
1. In the "Password Settings" section, click the **"Reset Password"** button
2. A form will appear with three fields:
   - **Current Password** - Enter your current password
   - **New Password** - Enter your new password (minimum 6 characters)
   - **Confirm New Password** - Re-enter your new password
3. Fill in all three fields
4. Click **"Reset Password"** to submit
5. If successful, you'll see a green success message
6. If there's an error, you'll see a red error message explaining the issue

### Common Errors:
- "Current password is incorrect" - Your current password is wrong
- "New password and confirm password do not match" - Passwords don't match
- "Password must be at least 6 characters long" - Password too short

---

## How Admins Can Reset User Passwords

### For Super Admin (Resetting District Admin Passwords):

1. Log in as Super Admin
2. Click **"User Management"** in the navigation bar
3. Find the District Admin user in the table
4. Click the **"Reset Password"** button (orange text) next to the user
5. A prompt will appear asking for the new password
6. Enter the new password (minimum 6 characters)
7. Click **OK** to confirm
8. If successful, you'll see a green success message at the top

### For District Admin (Resetting DS User Passwords):

1. Log in as District Admin
2. Click **"User Management"** in the navigation bar
3. Find the DS User in the table (only users in your district are shown)
4. Click the **"Reset Password"** button (orange text) next to the user
5. A prompt will appear asking for the new password
6. Enter the new password (minimum 6 characters)
7. Click **OK** to confirm
8. If successful, you'll see a green success message at the top

### Permission Rules:
- **Super Admin** can reset passwords for **District Admins only**
- **District Admin** can reset passwords for **DS Users in their district only**
- **DS Users** can only reset **their own password** (via Profile page)

### Important Notes:
- All password reset actions are logged in the Activity Logs
- Super Admins receive notifications when passwords are reset
- The user whose password was reset will need to use the new password on their next login
- It's recommended to inform the user when their password has been reset

---

## Security Best Practices

### For All Users:
1. **Keep your password secure** - Don't share it with anyone
2. **Use a strong password** - Mix letters, numbers, and special characters
3. **Change your password regularly** - Update it every few months
4. **Don't reuse passwords** - Use unique passwords for different systems
5. **Log out when finished** - Especially on shared computers

### For Admins:
1. **Only reset passwords upon request** - Don't reset passwords without a valid reason
2. **Verify user identity** - Confirm the user's identity before resetting
3. **Use strong temporary passwords** - When resetting for users
4. **Inform users immediately** - Let them know their password was reset
5. **Document the reason** - Keep a record of why the password was reset

---

## Troubleshooting

### "Profile button not showing"
- Make sure you're logged in
- Refresh the page
- Clear browser cache and try again

### "Reset Password button not working"
- Check your internet connection
- Make sure you filled in all required fields
- Verify password meets minimum requirements (6 characters)

### "Not authorized to reset this password"
- Super Admin: You can only reset District Admin passwords
- District Admin: You can only reset DS User passwords in your district
- DS User: You can only reset your own password via Profile page

### "Password reset failed"
- Check your internet connection
- Verify you have permission to reset this password
- Try again or contact technical support

---

## Feature Availability by Role

| Feature | Super Admin | District Admin | DS User |
|---------|-------------|----------------|---------|
| View own profile | ✓ | ✓ | ✓ |
| Reset own password | ✓ | ✓ | ✓ |
| Reset District Admin password | ✓ | ✗ | ✗ |
| Reset DS User password | ✗ | ✓* | ✗ |

*District Admin can only reset DS Users in their own district

---

## Questions or Issues?

If you encounter any problems with the password reset feature:
1. Check this guide for common solutions
2. Review the error message carefully
3. Contact your system administrator
4. For technical issues, contact the development team

---

## Change Log

### Version 1.0 (Current)
- Initial implementation of password reset feature
- Self password reset for all users
- Admin password reset functionality
- Profile page with user information
- Activity logging for all password reset actions
- Notifications for Super Admins
