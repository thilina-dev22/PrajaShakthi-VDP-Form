# Data Validation & Manual Entry Implementation

## 📋 Overview

This document outlines the comprehensive data validation system and manual entry feature implemented for the PrajaShakthi VDP Form system.

## ✅ Implemented Validations

### 1. **One CDC Form Per GN Division** ✅
**Business Rule**: Each GN Division can only have ONE Community Council (CDC) form.

**Implementation**:
- **Location**: `submissionController.js`
- **Functions**: `createSubmission()` and `updateSubmission()`

**Create Validation**:
```javascript
// Check if a council_info submission already exists for this GN Division
const existingSubmission = await Submission.findOne({
  formType: 'council_info',
  'location.district': req.body.location?.district,
  'location.divisionalSec': req.body.location?.divisionalSec,
  'location.gnDivision': req.body.location?.gnDivision
});

if (existingSubmission) {
  return res.status(400).json({ 
    message: `A Community Council form already exists for ${gnDivision} GN Division in ${divisionalSec}, ${district}. Each GN Division can only have one Community Council form.` 
  });
}
```

**Update Validation**:
```javascript
// When editing location, prevent changing to a GN Division that already has a form
if (submission.formType === 'council_info' && req.body.location) {
  const isLocationChanging = /* check if any location field changed */;
  
  if (isLocationChanging) {
    const existingSubmission = await Submission.findOne({
      _id: { $ne: submission._id }, // Exclude current submission
      formType: 'council_info',
      'location.district': newDistrict,
      'location.divisionalSec': newDS,
      'location.gnDivision': newGN
    });

    if (existingSubmission) {
      return res.status(400).json({ /* error message */ });
    }
  }
}
```

**Error Response**:
- **Status**: 400 Bad Request
- **Message**: "A Community Council form already exists for [GN Division] GN Division in [DS Division], [District]. Each GN Division can only have one Community Council form."

---

### 2. **Maximum 25 District Admin Accounts** ✅
**Business Rule**: Maximum 25 District Admin accounts (matches Sri Lanka's 25 districts).

**Implementation**:
- **Location**: `userController.js`
- **Function**: `createUser()`

**Validation Logic**:
```javascript
if (role === 'district_admin') {
  const districtAdminCount = await User.countDocuments({ role: 'district_admin' });
  
  if (districtAdminCount >= 25) {
    return res.status(400).json({ 
      message: 'Maximum limit of 25 District Admin accounts reached. Sri Lanka has only 25 districts.' 
    });
  }
}
```

**Error Response**:
- **Status**: 400 Bad Request
- **Message**: "Maximum limit of 25 District Admin accounts reached. Sri Lanka has only 25 districts."

---

### 3. **One District Admin Per District** ✅
**Business Rule**: Each district can only have ONE District Admin account.

**Implementation**:
- **Location**: `userController.js`
- **Function**: `createUser()`

**Validation Logic**:
```javascript
if (role === 'district_admin') {
  const existingDistrictAdmin = await User.findOne({ 
    role: 'district_admin', 
    district: district 
  });
  
  if (existingDistrictAdmin) {
    return res.status(400).json({ 
      message: `A District Admin already exists for ${district} district.`,
      existingUser: existingDistrictAdmin.username
    });
  }
}
```

**Error Response**:
- **Status**: 400 Bad Request
- **Message**: "A District Admin already exists for [District] district."
- **Extra Info**: Returns username of existing admin

---

### 4. **One DS User Per DS Office** ✅
**Business Rule**: Each Divisional Secretariat office can only have ONE DS User account.

**Implementation**:
- **Location**: `userController.js`
- **Function**: `createUser()`

**Validation Logic**:
```javascript
if (role === 'ds_user') {
  const existingDSUser = await User.findOne({ 
    role: 'ds_user', 
    district: district,
    divisionalSecretariat: divisionalSecretariat 
  });
  
  if (existingDSUser) {
    return res.status(400).json({ 
      message: `A DS User already exists for ${divisionalSecretariat} office in ${district} district.`,
      existingUser: existingDSUser.username
    });
  }
}
```

**Error Response**:
- **Status**: 400 Bad Request
- **Message**: "A DS User already exists for [DS Office] office in [District] district."
- **Extra Info**: Returns username of existing DS user

---

## 🆕 Manual Entry Feature

### Purpose
Allow users to manually enter DS Division and GN Division names when they're not available in `provincial_data.json`.

### Implementation

**Component**: `LocationSelectorBase.jsx`

**Features**:
1. **"Other (Enter Manually)" Option** in DS and GN dropdowns
2. **Text Input Field** appears when "Other" is selected
3. **Switch Back Button** to return to dropdown mode
4. **Auto-reset** when parent selection changes (e.g., changing district resets DS manual entry)

**State Management**:
```javascript
const [isDSManual, setIsDSManual] = useState(false);
const [isGNManual, setIsGNManual] = useState(false);
const [manualDSValue, setManualDSValue] = useState('');
const [manualGNValue, setManualGNValue] = useState('');
```

**Dropdown Structure**:
```jsx
<select value={divisionalSec} onChange={handleDSDropdownChange}>
  <option value="">-- {t('form.selectDs')} --</option>
  {dsDivisions.map((ds) => (
    <option key={ds.ds_division_name} value={ds.ds_division_name}>
      {ds.ds_division_name}
    </option>
  ))}
  <option value="__MANUAL_ENTRY__" className="text-[#A8234A] font-medium">
    -- {t('form.otherManualEntry')} --
  </option>
</select>
```

**Manual Input UI**:
```jsx
{isDSManual ? (
  <>
    <input
      type="text"
      value={manualDSValue}
      onChange={handleManualDSChange}
      placeholder={t('form.enterDsManually')}
      className="w-full px-3 py-3 border border-gray-300 rounded-md..."
    />
    <button onClick={() => setIsDSManual(false)}>
      {t('form.backToDropdown')}
    </button>
  </>
) : (
  <select>...</select>
)}
```

### User Flow

1. **User selects district** → DS dropdown enabled
2. **User selects "Other (Enter Manually)"** in DS dropdown
3. **Text input appears** for manual DS entry
4. **User types DS Division name** → Value passed to parent component
5. **GN dropdown enabled** with same manual entry option
6. **User can switch back** to dropdown mode anytime

### Translations

**English**:
- `otherManualEntry`: "Other (Enter Manually)"
- `enterDsManually`: "Enter DS Division name"
- `enterGnManually`: "Enter GN Division name"
- `backToDropdown`: "Back to dropdown"

**Sinhala**:
- `otherManualEntry`: "වෙනත් (අතින් ඇතුළත් කරන්න)"
- `enterDsManually`: "ප්‍රාදේශීය ලේකම් කොට්ඨාසයේ නම ඇතුළත් කරන්න"
- `enterGnManually`: "ග්‍රාම නිලධාරී කොට්ඨාසයේ නම ඇතුළත් කරන්න"
- `backToDropdown`: "විකල්ප ලැයිස්තුවට ආපසු යන්න"

**Tamil**:
- `otherManualEntry`: "மற்றவை (கைமுறையாக உள்ளிடவும்)"
- `enterDsManually`: "பிரதேச செயலாளர் பிரிவின் பெயரை உள்ளிடவும்"
- `enterGnManually`: "கிராம சேவகர் பிரிவின் பெயரை உள்ளிடவும்"
- `backToDropdown`: "பட்டியலுக்குத் திரும்பு"

---

## 🔄 Backend Handling of Manual Entries

### Storage
Manual entries are stored in the database **exactly as typed** by the user:
```javascript
{
  location: {
    district: "Colombo",
    divisionalSec: "Custom DS Division Name",  // Manual entry
    gnDivision: "Custom GN Division Name"       // Manual entry
  }
}
```

### Validation
- **No special flag** needed in database
- Manual entries are treated **identically** to dropdown selections
- CDC form uniqueness validation applies **regardless** of whether location was manually entered or selected

---

## 📊 Validation Summary

| Validation | Scope | Error Code | Location |
|-----------|-------|-----------|----------|
| One CDC per GN Division | Create & Update | 400 | `submissionController.js` |
| Max 25 District Admins | Create | 400 | `userController.js` |
| One District Admin per District | Create | 400 | `userController.js` |
| One DS User per DS Office | Create | 400 | `userController.js` |

---

## 🧪 Testing Checklist

### CDC Form Validation
- [ ] Try creating 2nd CDC form for same GN Division → Should fail with error message
- [ ] Create CDC form for different GN Division → Should succeed
- [ ] Edit existing CDC form location to GN Division with existing form → Should fail
- [ ] Edit existing CDC form location to new GN Division → Should succeed

### User Account Validations
- [ ] Create 25 district admins → All should succeed
- [ ] Try creating 26th district admin → Should fail with error message
- [ ] Try creating 2nd district admin for same district → Should fail with existing username
- [ ] Try creating 2nd DS user for same DS office → Should fail with existing username
- [ ] Create DS user for different DS office in same district → Should succeed

### Manual Entry Feature
- [ ] Select "Other (Enter Manually)" in DS dropdown → Text input appears
- [ ] Type manual DS Division name → Value updates in form
- [ ] Click "Back to dropdown" → Returns to dropdown mode
- [ ] Select "Other (Enter Manually)" in GN dropdown → Text input appears
- [ ] Type manual GN Division name → Value updates in form
- [ ] Change district selection → DS and GN manual entries reset
- [ ] Submit form with manual entries → Data saved correctly
- [ ] View submission with manual entries → Manual values display correctly
- [ ] Test in all 3 languages (EN, SI, TA) → Translations work

---

## 🎯 Benefits

### Data Integrity
- **No duplicate CDC forms** for same GN Division
- **Controlled number** of admin accounts
- **One responsible person** per administrative unit

### User Experience
- **Clear error messages** when validation fails
- **Existing user info** shown in error (helps identify conflicts)
- **Flexible location entry** for incomplete data

### System Reliability
- **Prevents data conflicts** before they occur
- **Enforces business rules** at database level
- **Maintains data quality** for government use

---

## 🔧 Technical Details

### Database Queries
All validations use MongoDB queries for efficiency:
- `findOne()` for checking existence
- `countDocuments()` for counting records
- Indexed fields for fast lookups

### Performance Impact
- **Minimal**: One additional query per validation
- **Optimized**: Uses existing database indexes
- **Async**: Non-blocking operations

### Error Handling
- Consistent 400 status code for validation failures
- 403 status code for permission issues
- 500 status code for server errors
- Clear, actionable error messages

---

## 📝 Notes

1. **Manual entries are permanent** - Once saved, they're stored as regular location values
2. **No migration needed** - Works with existing submissions
3. **Backward compatible** - Existing submissions unaffected
4. **Multilingual** - All UI text translated to Sinhala and Tamil
5. **Scalable** - Can easily add more validations using same pattern

---

## 🚀 Next Steps (Optional Enhancements)

1. **Admin Panel** to view and manage manual entries
2. **Bulk Import** of missing divisions into `provincial_data.json`
3. **Audit Log** for manual entries (who entered what, when)
4. **Validation Reports** showing duplicate attempts
5. **Auto-suggest** for manual entries based on existing data

---

*Last Updated: December 2024*
