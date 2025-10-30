# Validation & Manual Entry - Quick Reference

## 🚫 What Gets Blocked?

| Action | Gets Blocked When... | Error Message |
|--------|---------------------|---------------|
| **Create CDC Form** | GN Division already has a CDC form | "A Community Council form already exists for [GN] in [DS], [District]" |
| **Edit CDC Form** | Changing location to GN Division with existing CDC form | Same as above |
| **Create District Admin** | Already 25 district admins exist | "Maximum limit of 25 District Admin accounts reached" |
| **Create District Admin** | District already has a district admin | "A District Admin already exists for [District]" |
| **Create DS User** | DS office already has a DS user | "A DS User already exists for [DS Office] in [District]" |

---

## ✅ What's Allowed?

| Action | Allowed When... |
|--------|----------------|
| **Create CDC Form** | GN Division has no existing CDC form |
| **Edit CDC Form** | New location has no existing CDC form |
| **Create District Admin** | Less than 25 admins AND district has no admin |
| **Create DS User** | DS office has no existing DS user |
| **Manual Entry** | Always available for DS/GN divisions |

---

## 🔧 Manual Entry Trigger

**How to Use**:
1. Open DS Division or GN Division dropdown
2. Scroll to bottom
3. Select **"-- Other (Enter Manually) --"**
4. Text input appears → Type custom name
5. Click **"Back to dropdown"** to cancel

**Translations**:
- **English**: "Other (Enter Manually)"
- **Sinhala**: "වෙනත් (අතින් ඇතුළත් කරන්න)"
- **Tamil**: "மற்றவை (கைமுறையாக உள்ளிடவும்)"

---

## 📊 System Limits

| Resource | Limit | Reason |
|----------|-------|--------|
| District Admin Accounts | 25 | Sri Lanka has 25 districts |
| District Admins per District | 1 | One responsible person per district |
| DS Users per DS Office | 1 | One responsible person per office |
| CDC Forms per GN Division | 1 | One council per administrative area |

---

## 🎯 User Roles & Permissions

| Role | Can Create | Validations Applied |
|------|-----------|---------------------|
| **Super Admin** | District Admins | Max 25, One per district |
| **District Admin** | DS Users | One per DS office |
| **DS User** | CDC Forms | One per GN Division |

---

## 🔄 Validation Flow

### Creating CDC Form
```
User fills form with location
    ↓
Backend checks: Does this GN Division already have a CDC form?
    ↓
YES → Reject with error message
NO  → Save form successfully
```

### Creating District Admin
```
Super Admin creates district admin account
    ↓
Backend checks: Are there already 25 district admins?
    ↓
YES → Reject with error message
NO  → Check: Does this district already have an admin?
    ↓
    YES → Reject with error message
    NO  → Create account successfully
```

### Creating DS User
```
District Admin creates DS user account
    ↓
Backend checks: Does this DS office already have a DS user?
    ↓
YES → Reject with error message
NO  → Create account successfully
```

---

## 📝 Manual Entry Data Flow

```
User selects "Other (Enter Manually)"
    ↓
Text input appears
    ↓
User types custom DS/GN name
    ↓
Value saved to form state
    ↓
Form submitted with manual value
    ↓
Backend saves manual value as regular location data
    ↓
No special handling - treated same as dropdown selections
```

---

## 🔍 Quick Troubleshooting

### "Can't create CDC form"
✅ Check: Does the GN Division already have a CDC form?  
🔧 Solution: Choose different GN Division or contact admin

### "Can't create district admin"
✅ Check: Are there already 25 district admins?  
✅ Check: Does this district already have an admin?  
🔧 Solution: Delete inactive admin or choose different district

### "Can't create DS user"
✅ Check: Does this DS office already have a DS user?  
🔧 Solution: Delete inactive DS user or choose different DS office

### "Manual entry not working"
✅ Check: Did you select "Other (Enter Manually)" option?  
✅ Check: Is the text input visible?  
🔧 Solution: Refresh page, try again, check browser console

---

## 📞 Developer Reference

### Files Modified

**Backend**:
- `controllers/submissionController.js` - CDC form validation
- `controllers/userController.js` - User account validation

**Frontend**:
- `components/LocationSelectorBase.jsx` - Manual entry UI
- `i18n/locales/en.json` - English translations
- `i18n/locales/si.json` - Sinhala translations
- `i18n/locales/ta.json` - Tamil translations

### Database Queries

**Check existing CDC form**:
```javascript
await Submission.findOne({
  formType: 'council_info',
  'location.district': district,
  'location.divisionalSec': ds,
  'location.gnDivision': gn
});
```

**Count district admins**:
```javascript
await User.countDocuments({ role: 'district_admin' });
```

**Check existing district admin**:
```javascript
await User.findOne({ 
  role: 'district_admin', 
  district: district 
});
```

**Check existing DS user**:
```javascript
await User.findOne({ 
  role: 'ds_user', 
  district: district,
  divisionalSecretariat: ds 
});
```

---

## 🎨 UI States

### Manual Entry Active
- Dropdown hidden
- Text input visible
- "Back to dropdown" button visible
- Parent selection (district) enabled

### Manual Entry Inactive
- Dropdown visible
- Text input hidden
- Standard dropdown options
- "Other (Enter Manually)" option at bottom

---

## 🌐 API Responses

### Success (201)
```json
{
  "message": "Submission saved successfully!",
  "data": { ... }
}
```

### Validation Error (400)
```json
{
  "message": "A Community Council form already exists for [GN]..."
}
```

### Validation Error with Extra Info (400)
```json
{
  "message": "A District Admin already exists for [District]",
  "existingUser": "username"
}
```

### Permission Error (403)
```json
{
  "message": "Not authorized to..."
}
```

---

*Quick reference for developers and testers*
