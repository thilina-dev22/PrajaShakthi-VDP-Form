# Validation & Manual Entry Testing Guide

## 🎯 Quick Test Plan

This guide helps you test all the validation rules and manual entry features.

---

## Test 1: One CDC Form Per GN Division

### Test 1.1: Create Duplicate CDC Form (Should FAIL)
**Steps**:
1. Login as DS User
2. Create a CDC form for:
   - District: Colombo
   - DS Division: Colombo
   - GN Division: Maligawatte
3. Submit successfully
4. Try to create ANOTHER CDC form with same location
5. **Expected**: Error message "A Community Council form already exists for Maligawatte GN Division in Colombo, Colombo. Each GN Division can only have one Community Council form."

### Test 1.2: Create CDC Form for Different GN Division (Should SUCCEED)
**Steps**:
1. Create CDC form for:
   - District: Colombo
   - DS Division: Colombo
   - GN Division: **Borella** (different from Test 1.1)
2. **Expected**: Form submits successfully

### Test 1.3: Edit CDC Form to Duplicate Location (Should FAIL)
**Steps**:
1. Open existing CDC form for Borella
2. Click "Edit"
3. Change GN Division to "Maligawatte" (which already has a form)
4. Try to save
5. **Expected**: Error message preventing update

### Test 1.4: Edit CDC Form to New Location (Should SUCCEED)
**Steps**:
1. Open existing CDC form for Borella
2. Click "Edit"
3. Change GN Division to "Pettah" (new location)
4. Save
5. **Expected**: Update successful

---

## Test 2: Maximum 25 District Admin Accounts

### Test 2.1: Create 25 District Admins (Should SUCCEED)
**Steps**:
1. Login as Super Admin
2. Go to "Create User"
3. Create district admin for each of Sri Lanka's 25 districts:
   - Colombo, Gampaha, Kalutara, Kandy, Matale, Nuwara Eliya, Galle, Matara, Hambantota, Jaffna, Kilinochchi, Mannar, Vavuniya, Mullaitivu, Batticaloa, Ampara, Trincomalee, Kurunegala, Puttalam, Anuradhapura, Polonnaruwa, Badulla, Monaragala, Ratnapura, Kegalle
4. **Expected**: All 25 accounts created successfully

### Test 2.2: Try to Create 26th District Admin (Should FAIL)
**Steps**:
1. Login as Super Admin
2. Try to create another district admin
3. **Expected**: Error message "Maximum limit of 25 District Admin accounts reached. Sri Lanka has only 25 districts."

---

## Test 3: One District Admin Per District

### Test 3.1: Create 2nd District Admin for Same District (Should FAIL)
**Steps**:
1. Login as Super Admin
2. Create district admin for "Colombo" with username "colombo_admin1"
3. Try to create ANOTHER district admin for "Colombo" with username "colombo_admin2"
4. **Expected**: Error message "A District Admin already exists for Colombo district." + shows existing username "colombo_admin1"

### Test 3.2: Create District Admin for Different District (Should SUCCEED)
**Steps**:
1. Login as Super Admin
2. Create district admin for "Gampaha"
3. **Expected**: Account created successfully

---

## Test 4: One DS User Per DS Office

### Test 4.1: Create 2nd DS User for Same DS Office (Should FAIL)
**Steps**:
1. Login as District Admin (e.g., Colombo)
2. Create DS user for "Colombo" DS office with username "colombo_ds_user1"
3. Try to create ANOTHER DS user for "Colombo" DS office with username "colombo_ds_user2"
4. **Expected**: Error message "A DS User already exists for Colombo office in Colombo district." + shows existing username "colombo_ds_user1"

### Test 4.2: Create DS User for Different DS Office (Should SUCCEED)
**Steps**:
1. Login as District Admin (Colombo)
2. Create DS user for "Thimbirigasyaya" DS office
3. **Expected**: Account created successfully

---

## Test 5: Manual Entry for Missing Divisions

### Test 5.1: Enter DS Division Manually (English)
**Steps**:
1. Login as DS User
2. Start creating CDC form
3. Select "Colombo" district
4. In DS Division dropdown, scroll to bottom and select "-- Other (Enter Manually) --"
5. **Expected**: 
   - Dropdown disappears
   - Text input field appears with placeholder "Enter DS Division name"
   - "Back to dropdown" link appears

### Test 5.2: Type Manual DS Division Name
**Steps**:
1. Continue from Test 5.1
2. Type "Custom DS Division" in text input
3. **Expected**: 
   - Value updates as you type
   - GN Division dropdown becomes enabled

### Test 5.3: Switch Back to Dropdown
**Steps**:
1. Continue from Test 5.2
2. Click "Back to dropdown" link
3. **Expected**:
   - Text input disappears
   - Dropdown reappears
   - Manual value cleared
   - GN Division reset

### Test 5.4: Enter GN Division Manually
**Steps**:
1. Select or manually enter DS Division
2. In GN Division dropdown, select "-- Other (Enter Manually) --"
3. Type "Custom GN Division" in text input
4. **Expected**: 
   - Same behavior as DS manual entry
   - Value updates correctly

### Test 5.5: Submit Form with Manual Entries
**Steps**:
1. Fill entire CDC form with manual DS and GN Division names
2. Fill all required committee member fields
3. Submit form
4. **Expected**:
   - Form submits successfully
   - Manual values saved to database

### Test 5.6: View Submission with Manual Entries
**Steps**:
1. Login as District Admin
2. Go to "Submission List"
3. Find submission created in Test 5.5
4. Click "View"
5. **Expected**:
   - Manual DS Division displays correctly
   - Manual GN Division displays correctly
   - All data intact

### Test 5.7: Edit Submission with Manual Entries
**Steps**:
1. Open submission from Test 5.5
2. Click "Edit"
3. **Expected**:
   - Manual DS and GN values show in dropdowns
   - Can change to other manual values
   - Can change to dropdown values

### Test 5.8: Manual Entry Auto-Reset on District Change
**Steps**:
1. Start creating CDC form
2. Select "Colombo" district
3. Select "-- Other (Enter Manually) --" for DS Division
4. Type "Custom DS Division"
5. Change district to "Gampaha"
6. **Expected**:
   - DS Division manual entry cleared
   - DS Division dropdown reset to default
   - GN Division dropdown disabled

---

## Test 6: Manual Entry Translations

### Test 6.1: Sinhala Manual Entry
**Steps**:
1. Switch language to Sinhala (සිංහල)
2. Create CDC form
3. Select "-- වෙනත් (අතින් ඇතුළත් කරන්න) --" in DS dropdown
4. **Expected**:
   - Placeholder text: "ප්‍රාදේශීය ලේකම් කොට්ඨාසයේ නම ඇතුළත් කරන්න"
   - Button text: "විකල්ප ලැයිස්තුවට ආපසු යන්න"

### Test 6.2: Tamil Manual Entry
**Steps**:
1. Switch language to Tamil (தமிழ்)
2. Create CDC form
3. Select "-- மற்றவை (கைமுறையாக உள்ளிடவும்) --" in DS dropdown
4. **Expected**:
   - Placeholder text: "பிரதேச செயலாளர் பிரிவின் பெயரை உள்ளிடவும்"
   - Button text: "பட்டியலுக்குத் திரும்பு"

### Test 6.3: Switch Language Mid-Entry
**Steps**:
1. Start manual entry in English
2. Type "Custom DS Division"
3. Switch language to Sinhala
4. **Expected**:
   - Value remains in input field
   - UI text changes to Sinhala
   - Functionality unchanged

---

## Test 7: Combined Validation Scenarios

### Test 7.1: Manual Entry + Duplicate CDC Check
**Steps**:
1. Create CDC form with manual entries:
   - DS Division: "Manual DS Office"
   - GN Division: "Manual GN Area"
2. Submit successfully
3. Try to create another CDC form with EXACT same manual entries
4. **Expected**: Error message preventing duplicate

### Test 7.2: Max District Admins + Create DS User
**Steps**:
1. Create 25 district admins (max limit)
2. Try to create 26th district admin → Should fail
3. Login as one of the 25 district admins
4. Create DS user → Should succeed
5. **Expected**: Max district admin limit doesn't affect DS user creation

### Test 7.3: Duplicate DS User + Manual Entry Form
**Steps**:
1. Create DS user for "Colombo" office
2. Try to create 2nd DS user for "Colombo" office → Should fail
3. Login as the first DS user
4. Create CDC form with manual entries → Should succeed
5. **Expected**: User validation and form manual entry work independently

---

## 🔍 Error Message Verification

### Checklist
- [ ] All error messages are clear and actionable
- [ ] Error messages show specific details (district name, username, etc.)
- [ ] Error messages appear in user's selected language
- [ ] Success messages appear after valid operations
- [ ] Loading states show during async operations

---

## 📊 Test Results Template

```
Date: __________
Tester: __________

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | Duplicate CDC Form | ☐ Pass ☐ Fail | |
| 1.2 | Different GN Division | ☐ Pass ☐ Fail | |
| 1.3 | Edit to Duplicate Location | ☐ Pass ☐ Fail | |
| 1.4 | Edit to New Location | ☐ Pass ☐ Fail | |
| 2.1 | Create 25 District Admins | ☐ Pass ☐ Fail | |
| 2.2 | Try 26th District Admin | ☐ Pass ☐ Fail | |
| 3.1 | 2nd Admin Same District | ☐ Pass ☐ Fail | |
| 3.2 | Admin Different District | ☐ Pass ☐ Fail | |
| 4.1 | 2nd DS User Same Office | ☐ Pass ☐ Fail | |
| 4.2 | DS User Different Office | ☐ Pass ☐ Fail | |
| 5.1 | Manual DS Entry UI | ☐ Pass ☐ Fail | |
| 5.2 | Type Manual DS Name | ☐ Pass ☐ Fail | |
| 5.3 | Switch Back to Dropdown | ☐ Pass ☐ Fail | |
| 5.4 | Manual GN Entry | ☐ Pass ☐ Fail | |
| 5.5 | Submit with Manual Entries | ☐ Pass ☐ Fail | |
| 5.6 | View Manual Entries | ☐ Pass ☐ Fail | |
| 5.7 | Edit Manual Entries | ☐ Pass ☐ Fail | |
| 5.8 | Auto-Reset on District Change | ☐ Pass ☐ Fail | |
| 6.1 | Sinhala Translations | ☐ Pass ☐ Fail | |
| 6.2 | Tamil Translations | ☐ Pass ☐ Fail | |
| 6.3 | Language Switch Mid-Entry | ☐ Pass ☐ Fail | |
| 7.1 | Manual Entry + Duplicate Check | ☐ Pass ☐ Fail | |
| 7.2 | Max Admins + Create DS User | ☐ Pass ☐ Fail | |
| 7.3 | Duplicate DS + Manual Form | ☐ Pass ☐ Fail | |

Overall Result: ☐ All Pass ☐ Some Failures
```

---

## 🐛 Known Issues / Edge Cases

1. **Long Manual Entry Names**: Very long DS/GN names may overflow UI
2. **Special Characters**: Test with Unicode characters (Sinhala/Tamil)
3. **Whitespace**: Leading/trailing spaces in manual entries
4. **Case Sensitivity**: "Colombo" vs "colombo" treated as different
5. **Network Errors**: Test validation error handling when offline

---

## ✅ Sign-off

- [ ] All tests passed
- [ ] Error messages verified
- [ ] Translations verified
- [ ] Edge cases tested
- [ ] Production ready

---

*Last Updated: December 2024*
