# Quick Test Checklist - Highlight Bug Fix

## ⚡ Quick Test (2 minutes)

### Test 1: Single Cell Highlight ✅
1. Navigate to View Submissions
2. Select a Council Info submission
3. Click "Edit" on the submission
4. Edit **row 23** → Change the **name** field
5. Save changes
6. View the submission details

**Expected Result:**
- ✅ Only row 23's "Name" cell should have yellow background
- ✅ All other "Name" cells (rows 1-22, 24-25) should be normal (no highlight)

**Visual Check:**
```
┌────┬──────────────┬─────────┐
│ #  │ Name         │ Phone   │
├────┼──────────────┼─────────┤
│ 22 │ John         │ 123456  │  ← Normal (no highlight)
│ 23 │ Bob 🟨       │ 234567  │  ← HIGHLIGHTED ✅
│ 24 │ Alice        │ 345678  │  ← Normal (no highlight)
└────┴──────────────┴─────────┘
```

---

### Test 2: Multiple Fields in Same Row ✅
1. Edit **row 5** → Change **both** name AND phone
2. Save and view

**Expected Result:**
- ✅ Row 5's name cell: Highlighted
- ✅ Row 5's phone cell: Highlighted
- ✅ All other rows: NOT highlighted

---

### Test 3: Different Sections ✅
1. Edit Committee Member (row 3) → Change name
2. Edit Community Rep (row 10) → Change phone
3. Save and view

**Expected Result:**
- ✅ Row 3 name: Highlighted (Committee section)
- ✅ Row 10 phone: Highlighted (Community Reps section)
- ✅ All other cells: NOT highlighted
- ✅ Sections don't interfere with each other

---

### Test 4: Location Fields Still Work ✅
1. Edit location → Change district
2. Save and view

**Expected Result:**
- ✅ District field shows yellow highlight
- ✅ Works independently from member highlights

---

## 🐛 Bug Indicators (If Still Broken)

If you see these, the bug is NOT fixed:

❌ **Entire column highlighted** when editing one cell
❌ **All name cells yellow** after editing row 23's name
❌ **Multiple rows highlighted** when only edited one
❌ **Console errors** about Map vs Set

---

## ✅ Success Indicators

You'll know the fix works when:

✅ Only the **specific cell** you edited is highlighted (yellow background + left border)
✅ Other cells in the **same column** are NOT highlighted
✅ Other cells in the **same row** are only highlighted if you edited them
✅ Highlighting **expires after 24 hours**
✅ No console errors

---

## 🔍 Visual Comparison

### ❌ BEFORE (Bug):
```
Edit Row 23, Name Column

Result: ALL name cells highlighted
┌────┬──────────────┬─────────┐
│ #  │ Name         │ Phone   │
├────┼──────────────┼─────────┤
│ 1  │ Alice  🟨    │ 111111  │ ← WRONG
│ 2  │ Bob    🟨    │ 222222  │ ← WRONG
│ .. │ ...          │ ...     │
│ 23 │ Charlie 🟨   │ 233333  │ ← Correct
│ 24 │ David  🟨    │ 244444  │ ← WRONG
│ 25 │ Eve    🟨    │ 255555  │ ← WRONG
└────┴──────────────┴─────────┘
```

### ✅ AFTER (Fixed):
```
Edit Row 23, Name Column

Result: Only row 23 name cell highlighted
┌────┬──────────────┬─────────┐
│ #  │ Name         │ Phone   │
├────┼──────────────┼─────────┤
│ 1  │ Alice        │ 111111  │ ← Correct
│ 2  │ Bob          │ 222222  │ ← Correct
│ .. │ ...          │ ...     │
│ 23 │ Charlie 🟨   │ 233333  │ ← Correct (only this)
│ 24 │ David        │ 244444  │ ← Correct
│ 25 │ Eve          │ 255555  │ ← Correct
└────┴──────────────┴─────────┘
```

---

## 🖥️ Browser Console Check

Press **F12** and check Console tab:

✅ **Good:** No errors
❌ **Bad:** Errors like:
- `Cannot read property 'has' of undefined`
- `updatedFields.add is not a function`
- `TypeError: Expected Set but got Map`

---

## 📝 Test Results

**Date:** _______________  
**Tester:** _______________

| Test | Status | Notes |
|------|--------|-------|
| Single cell highlight | ☐ Pass / ☐ Fail | |
| Multiple fields same row | ☐ Pass / ☐ Fail | |
| Different sections | ☐ Pass / ☐ Fail | |
| Location fields | ☐ Pass / ☐ Fail | |

**Overall:** ☐ **All Pass** / ☐ **Some Failures**

---

**If all tests pass:** ✅ Bug is fixed! Deploy to production.  
**If tests fail:** ⚠️ Check `HIGHLIGHT_BUG_FIX.md` for detailed debugging steps.
