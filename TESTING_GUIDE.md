# Testing Guide - Legal Will Generation Tool

This comprehensive guide provides manual test cases for all features of the Legal Will Generation Tool from Phases 1-5.

## Prerequisites

### 1. Database Migrations
Before testing, ensure all database migrations are run in Supabase SQL Editor in order:

```sql
-- Run in Supabase SQL Editor (in order):
1. server/migrations/001_create_profiles_table.sql
2. server/migrations/002_create_wills_table.sql
3. server/migrations/003_create_storage_bucket.sql
4. server/migrations/004_add_storage_fields_to_wills.sql
```

### 2. Environment Configuration
Verify all secrets are configured in Replit Secrets:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `GEMINI_API_KEY`
- ✅ `SENDGRID_API_KEY`
- ✅ `SENDGRID_FROM_EMAIL` (must be verified sender in SendGrid)

### 3. Start the Application
```bash
# Development mode (two workflows)
npm run dev        # Frontend on port 5000
npm run server     # Backend on port 3001
```

---

## Phase 1-2: Authentication & User Management

### Test Case 1: User Registration
**Steps:**
1. Navigate to homepage → Click "Get Started"
2. Fill registration form:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Phone: "+1-555-0100"
   - Password: "SecurePass123!"
3. Click "Register"

**Expected Results:**
- ✅ Auto-generated account number (format: `WL{timestamp}{random}`)
- ✅ Redirected to Dashboard
- ✅ Header shows user name and logout button

### Test Case 2: User Login
**Steps:**
1. Click "Sign In" → Enter credentials → Click "Login"

**Expected Results:**
- ✅ Login successful → Redirected to Dashboard
- ✅ Profile displayed correctly

### Test Case 3: Profile Management
**Steps:**
1. Dashboard → "Edit Profile" → Update phone → "Save Changes"

**Expected Results:**
- ✅ Success message → Changes persisted

---

## Phase 3: AI-Powered Questionnaire

### Test Case 4: Creating a New Will
**Steps:**
1. Dashboard → "Create New Will"
2. Select Country: Canada → Province: Alberta → "Next"

**Expected Results:**
- ✅ AI generates compliance statement for Alberta
- ✅ "Begin Questionnaire" button appears

### Test Case 5: Completing the Questionnaire
**Round 1:**
1. Answer all 5-7 AI-generated questions → "Next Round"

**Expected Results:**
- ✅ All questions validated
- ✅ Progress indicator shows "Round 1 of 3"

**Round 2:**
1. Answer 3-5 follow-up questions → "Next Round"

**Expected Results:**
- ✅ Questions personalized based on Round 1
- ✅ Progress indicator shows "Round 2 of 3"

**Round 3:**
1. Answer 2-3 final questions → "Finish"

**Expected Results:**
- ✅ AI generates legal assessment
- ✅ Redirected to Will Summary page

---

## Phase 4: PDF Generation & Storage

### Test Case 6: PDF Download
**Steps:**
1. On Will Summary page, verify "✓ PDF Document Available"
2. Click "Download PDF" button

**Expected Results:**
- ✅ PDF downloads (filename: `will_{jurisdiction}_{date}.pdf`)
- ✅ PDF contains:
  - Will header with branding
  - Jurisdiction information
  - Compliance statement
  - All Q&A responses (3 rounds)
  - Legal assessment
  - Legal disclaimers
  - User account number, email, timestamp

---

## Phase 5: Data Management & Email

### Test Case 7: Email Delivery
**Steps:**
1. On Will Summary page, click "Email Me My Will" button
2. Wait for success message
3. Check email inbox (and spam folder)

**Expected Results:**
- ✅ Success alert: "Will sent successfully to your email!"
- ✅ Email received within 1-2 minutes
- ✅ Email contains:
  - Professional HTML formatting
  - Legal disclaimers prominently displayed
  - PDF attachment
  - Educational warnings
  - Document ID and generation date

**Verification:**
- Open attached PDF → Verify contents match downloaded version
- Check email body for legal disclaimers

### Test Case 8: Dual-Kill Deletion
**Steps:**
1. On Will Summary page, scroll to "Danger Zone"
2. Click "Delete This Will" button
3. Confirm deletion in browser dialog

**Expected Results:**
- ✅ Confirmation dialog with warning message
- ✅ Success alert: "Will deleted successfully."
- ✅ Redirected to Dashboard
- ✅ Will no longer listed in Dashboard

**Verification in Supabase:**

**A. Database Check:**
```sql
SELECT * FROM wills WHERE id = '{deleted_will_id}';
-- Should return 0 rows
```

**B. Storage Check:**
1. Supabase Dashboard → Storage → `will-documents` bucket
2. Verify folder `user_{user_id}/will_{will_id}/` is deleted
3. Verify no orphaned files remain

**Expected:**
- ✅ Database record removed
- ✅ All storage files deleted (filesRemoved count > 0 in response)
- ✅ No partial deletion state

---

## Additional Test Cases

### Test Case 9: Dashboard - View All Wills
**Steps:**
1. Create multiple wills (2-3)
2. Navigate to Dashboard

**Expected Results:**
- ✅ All wills listed with jurisdiction, status, creation date
- ✅ "Create New Will" button available

### Test Case 10: Logout
**Steps:**
1. Click "Logout" → Verify redirection

**Expected Results:**
- ✅ Redirected to homepage
- ✅ Cannot access protected routes

---

## Error Handling Tests

### Test Case 11: Invalid Login
1. Enter incorrect password → Click "Login"

**Expected:** Error message, no redirect

### Test Case 12: Unanswered Questions
1. In questionnaire, leave questions blank → Click "Next Round"

**Expected:** Validation error

### Test Case 13: Email Without PDF
1. Create will but don't complete questionnaire
2. Try to email (manually via API)

**Expected:** Error: "PDF not generated yet"

### Test Case 14: Delete Non-Existent Will
1. Delete a will → Try to delete same will again

**Expected:** Error: "Will not found"

### Test Case 15: Email Configuration Missing
1. Remove `SENDGRID_FROM_EMAIL` from secrets
2. Try to email will

**Expected:** Error: "SENDGRID_FROM_EMAIL is not configured"

---

## Performance Tests

### Test Case 16: AI Response Times
- **Compliance Statement**: < 10 seconds
- **Round 1 Questions**: < 15 seconds
- **Round 2/3 Questions**: < 10 seconds
- **Final Assessment**: < 15 seconds

### Test Case 17: PDF Generation Time
- **Expected**: PDF generated immediately upon questionnaire completion
- **File Size**: 50-200 KB

### Test Case 18: Email Delivery Time
- **Expected**: Email sent within 1-5 minutes
- **Check**: SendGrid dashboard for delivery status

---

## Security Tests

### Test Case 19: RLS Policy Verification
1. Create will as User A
2. Login as User B
3. Try to access User A's will URL directly

**Expected:** 404 or access denied (RLS prevents cross-user access)

### Test Case 20: Protected Routes
1. Without login, navigate to `/dashboard`, `/create-will`, `/will/{id}`

**Expected:** Redirected to login page

### Test Case 21: Storage Access Control
1. Create will with User A
2. Get PDF storage path from database
3. Login as User B
4. Try to download User A's PDF via storage path

**Expected:** Access denied (RLS blocks cross-user storage access)

---

## Edge Cases

### Test Case 22: Multiple Simultaneous Deletions
1. Open same will in two browser tabs
2. Delete in Tab 1 → Try to delete in Tab 2

**Expected:** Tab 2 shows "Will not found"

### Test Case 23: Long Text Answers
1. Enter very long answers (500+ words) in questionnaire
2. Complete questionnaire → Download PDF

**Expected:** Answers saved correctly, PDF renders properly

### Test Case 24: Special Characters in Answers
1. Enter answers with special characters: `@#$%^&*()`, emojis, unicode
2. Complete questionnaire → Download PDF

**Expected:** Characters displayed correctly in PDF

### Test Case 25: Email to Invalid Address
1. Update profile email to invalid format
2. Try to email will

**Expected:** SendGrid validation error or bounce notification

---

## Regression Tests

After any code changes, run these critical path tests:

1. ✅ **Auth Flow**: Register → Login → Logout
2. ✅ **Will Creation Flow**: Create → Questionnaire (3 rounds) → Summary
3. ✅ **PDF Flow**: Download → Verify contents
4. ✅ **Email Flow**: Send → Receive → Verify attachment
5. ✅ **Deletion Flow**: Delete → Verify database & storage cleanup

---

## Test Data Cleanup

### Cleanup Test User Data:

**1. Delete User Profile:**
```sql
-- In Supabase SQL Editor
DELETE FROM profiles WHERE email = 'test@example.com';
```

**2. Clear Storage Files:**
- Supabase Dashboard → Storage → `will-documents` bucket
- Delete test user folders manually

**3. Verify Cleanup:**
```sql
SELECT COUNT(*) FROM wills; -- Should be 0 for test user
```

---

## Known Issues & Limitations

1. **SendGrid Email Delay**: Emails may take 1-5 minutes (SendGrid processing time)
2. **AI Response Variability**: Question generation times vary based on Gemini API load
3. **Browser Compatibility**: Tested on Chrome, Firefox, Safari (latest versions)
4. **Mobile Support**: Responsive design optimized for desktop

---

## Reporting Issues

When reporting bugs, include:
1. Test case number
2. Steps to reproduce
3. Expected vs. actual results
4. Browser and OS
5. Screenshots or error logs
6. Account number (if applicable)
7. Will ID (if applicable)

---

## API Testing with curl

### Test Email Endpoint:
```bash
curl -X POST http://localhost:3001/api/wills/{willId}/email \
  -H "Content-Type: application/json"
```

### Test Delete Endpoint:
```bash
curl -X DELETE http://localhost:3001/api/wills/{willId}
```

### Test Download Endpoint:
```bash
curl -X GET http://localhost:3001/api/wills/{willId}/download \
  --output test_will.pdf
```

---

**Last Updated**: November 13, 2025  
**Version**: Phase 5 Complete - All Features Implemented
