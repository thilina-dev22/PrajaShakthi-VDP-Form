# Bug Fix: Column-Wide Highlighting Issue

## 🐛 Problem

When editing a specific row in the Community Council table (e.g., updating row #23's name), the **entire column** was being highlighted instead of just the specific cell that was edited.

**Example:**
- Edit row 23, column "name" 
- **Bug**: ALL name cells in the table were highlighted (rows 1-25)
- **Expected**: Only row 23's name cell should be highlighted

---

## 🔍 Root Cause

The highlighting logic was storing field changes as generic keys like `"member.name"` without tracking:
1. Which specific section (committeeMembers, communityReps, strategicMembers)
2. Which specific row index within that section
3. Which field was changed

This caused the `getFieldHighlightClass` function to return the highlight class for **all** cells in that column, not just the edited one.

---

## ✅ Solution

Updated the highlighting system to be **row-specific**:

### 1. **Changed Data Structure** (`getUpdatedFields`)

**Before:** Used `Set` with generic keys
```javascript
updatedFields.add('member.name');  // Highlights ALL name cells
```

**After:** Use `Map` with specific row-based keys
```javascript
updatedFields.set('committeeMembers[4].name', true);  // Only row 5 (index 4)
```

### 2. **Enhanced Change Parsing**

Added regex pattern matching to extract:
- Section type (Committee Member, Community Rep, Strategic Member)
- Row number from change description
- Field name

**Example parsing:**
```javascript
Input: "Committee Member #23 name: old → new"
Output: 
  - sectionKey: 'committeeMembers'
  - arrayIndex: 22 (0-based)
  - fieldName: 'name'
  - Stored as: 'committeeMembers[22].name'
```

### 3. **Updated Highlight Function**

Modified `getFieldHighlightClass` to accept:
- `fieldPath` - The field name (e.g., 'name', 'phone')
- `updatedFields` - Map of updated field keys
- `sectionKey` - Which array (committeeMembers, communityReps, etc.)
- `memberIndex` - Which row in the array (0-based index)

**Logic:**
```javascript
const specificKey = `${sectionKey}[${memberIndex}].${fieldPath}`;
if (updatedFields.has(specificKey)) {
  return 'bg-yellow-100 border-l-4 border-l-yellow-500 font-semibold';
}
```

### 4. **Updated Render Calls**

Changed all `getFieldHighlightClass` calls in the table to pass section and index:

**Before:**
```jsx
<td className={`border p-2 ${getFieldHighlightClass('member.name', updatedFields)}`}>
```

**After:**
```jsx
<td className={`border p-2 ${getFieldHighlightClass('name', updatedFields, section.key, index)}`}>
```

---

## 📝 Changes Made

**File:** `PrajaShakthi-VDP-Form-frontend/src/components/SubmissionList.jsx`

### Change 1: Updated `getUpdatedFields` function (lines 826-886)

**Key improvements:**
- Changed from `Set` to `Map` for storing updated fields
- Added regex pattern matching: `/(committee member|community rep|strategic member)\s*#(\d+)\s+(\w+):/i`
- Extracts section type, row number, and field name from change description
- Creates row-specific keys: `${sectionKey}[${arrayIndex}].${fieldName}`
- Handles location fields separately (no row number needed)

### Change 2: Updated `getFieldHighlightClass` function (lines 888-901)

**Key improvements:**
- Added `sectionKey` and `memberIndex` parameters
- Different logic for location fields vs member fields
- Builds specific key and checks Map for exact match

### Change 3: Updated `renderCommunityCouncil` function signature (line 905)

**Change:**
```javascript
// Before
const renderCommunityCouncil = (councilData, updatedFields = new Set()) => {

// After
const renderCommunityCouncil = (councilData, updatedFields = new Map()) => {
```

### Change 4: Updated table cell rendering (lines 971-996)

**Changed all 7 field calls:**
- `name`: `getFieldHighlightClass('name', updatedFields, section.key, index)`
- `position`: `getFieldHighlightClass('position', updatedFields, section.key, index)`
- `phone`: `getFieldHighlightClass('phone', updatedFields, section.key, index)`
- `whatsapp`: `getFieldHighlightClass('whatsapp', updatedFields, section.key, index)`
- `nic`: `getFieldHighlightClass('nic', updatedFields, section.key, index)`
- `gender`: `getFieldHighlightClass('gender', updatedFields, section.key, index)`
- `permanentaddress`: `getFieldHighlightClass('permanentaddress', updatedFields, section.key, index)`

---

## 🧪 Testing

### Test Case 1: Edit Single Row
1. Edit row 23, change "name" field
2. **Expected**: Only row 23's name cell is highlighted
3. **Verify**: Other rows' name cells are NOT highlighted

### Test Case 2: Edit Multiple Fields in Same Row
1. Edit row 5, change "name" and "phone"
2. **Expected**: Row 5's name AND phone cells are highlighted
3. **Verify**: Other rows are NOT highlighted

### Test Case 3: Edit Different Sections
1. Edit Committee Member #3 (row 3)
2. Edit Community Rep #10 (row 10)
3. **Expected**: Only those specific cells are highlighted
4. **Verify**: Sections don't cross-contaminate

### Test Case 4: Edit Location Fields
1. Edit location district
2. **Expected**: District field is highlighted
3. **Verify**: Works independently of member highlighting

### Test Case 5: Expired Edits (>24 hours)
1. Wait 24 hours after edit (or mock the date)
2. **Expected**: No highlighting appears
3. **Verify**: Time-based filtering works

---

## 📊 Before vs After

### **Before Fix:**

```
Edit: Row 23, Name field

Result:
┌───┬───────────────┬──────────┐
│ # │ Name          │ Phone    │
├───┼───────────────┼──────────┤
│ 1 │ John (🟨)     │ 123456   │  ← WRONG: Highlighted
│ 2 │ Jane (🟨)     │ 234567   │  ← WRONG: Highlighted
│...│ ...           │ ...      │
│23 │ Bob (🟨)      │ 345678   │  ← CORRECT: Should be highlighted
│24 │ Alice (🟨)    │ 456789   │  ← WRONG: Highlighted
│25 │ Charlie (🟨)  │ 567890   │  ← WRONG: Highlighted
└───┴───────────────┴──────────┘
ALL name cells highlighted! ❌
```

### **After Fix:**

```
Edit: Row 23, Name field

Result:
┌───┬───────────────┬──────────┐
│ # │ Name          │ Phone    │
├───┼───────────────┼──────────┤
│ 1 │ John          │ 123456   │  ← Correct: Not highlighted
│ 2 │ Jane          │ 234567   │  ← Correct: Not highlighted
│...│ ...           │ ...      │
│23 │ Bob (🟨)      │ 345678   │  ← Correct: Only this highlighted
│24 │ Alice         │ 456789   │  ← Correct: Not highlighted
│25 │ Charlie       │ 567890   │  ← Correct: Not highlighted
└───┴───────────────┴──────────┘
Only row 23's name cell highlighted! ✅
```

---

## 🎯 Technical Details

### Change Description Format

The backend generates change descriptions in this format:
```
"Committee Member #5 name: oldValue → newValue; Committee Member #5 phone: old → new"
```

### Regex Pattern Breakdown

```javascript
/(committee member|community rep|strategic member)\s*#(\d+)\s+(\w+):/i
```

**Explanation:**
- `(committee member|community rep|strategic member)` - Capture section type
- `\s*#` - Optional whitespace then #
- `(\d+)` - Capture row number (one or more digits)
- `\s+` - Required whitespace
- `(\w+)` - Capture field name (word characters)
- `:` - Literal colon separator

**Match Groups:**
1. `match[1]` = Section type (e.g., "Committee Member")
2. `match[2]` = Row number (e.g., "23")
3. `match[3]` = Field name (e.g., "name")

### Section Key Mapping

```javascript
'Committee Member' → 'committeeMembers'
'Community Rep'    → 'communityReps'
'Strategic Member' → 'strategicMembers'
```

### Index Conversion

```javascript
const rowNumber = parseInt(match[2], 10);  // "23" → 23
const arrayIndex = rowNumber - 1;          // 23 → 22 (0-based)
```

---

## ✅ Verification

Run this checklist after deployment:

- [ ] Edit row 1 name → Only row 1 name highlighted
- [ ] Edit row 15 phone → Only row 15 phone highlighted
- [ ] Edit row 25 gender → Only row 25 gender highlighted
- [ ] Edit multiple fields in row 5 → All edited fields in row 5 highlighted
- [ ] Edit district → District field highlighted (no row number)
- [ ] Edit old submission (>24h) → No highlighting appears
- [ ] No console errors
- [ ] Highlighting clears after 24 hours

---

## 🚀 Deployment

1. **Test locally:**
   ```powershell
   cd PrajaShakthi-VDP-Form-frontend
   npm run dev
   ```

2. **Verify the fix:**
   - Edit a specific row in a council table
   - Confirm only that cell is highlighted

3. **Deploy:**
   - Commit changes with message: "Fix: Column-wide highlighting bug - now highlights only edited cells"
   - Push to repository
   - Deploy to production

---

## 📚 Related Files

- **Frontend:** `src/components/SubmissionList.jsx`
- **Backend:** `controllers/submissionController.js` (change description generation)
- **Model:** `models/SubmissionModel.js` (editHistory schema)

---

## 🔮 Future Enhancements (Optional)

### Option 1: Store Structured Changes in Database

Modify `SubmissionModel.js` to store structured data:

```javascript
editHistory: [{
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  editedAt: { type: Date, default: Date.now },
  changes: { type: String }, // Keep for backward compatibility
  detailedChanges: [{  // NEW: Structured data
    fieldKey: String,
    oldValue: String,
    newValue: String,
    category: String,
    section: String,
    memberIndex: Number,
    memberField: String
  }]
}]
```

**Benefits:**
- More precise highlighting
- No regex parsing needed
- Support for complex field paths

### Option 2: Add Visual Edit Indicator

Show edit icon on recently edited cells:

```jsx
{updatedFields.has(key) && (
  <span className="ml-1 text-yellow-600">✏️</span>
)}
```

---

**Status:** ✅ **Fixed and Ready for Testing**  
**Date:** January 30, 2025  
**Bug ID:** HIGHLIGHT-001
