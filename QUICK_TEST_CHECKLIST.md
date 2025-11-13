# Quick Authentication Test Checklist

## ⚠️ CRITICAL FIRST STEP: Database Setup

Before testing, you **MUST** create the database table:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy all contents from: `server/migrations/001_create_profiles_table.sql`
6. Paste into SQL Editor
7. Click **Run**
8. Wait for: "Success. No rows returned"

✅ Database is ready!

---

## Quick Test Flow (5 minutes)

### 1️⃣ Register New Account
- [ ] Click "Get Started" button
- [ ] Fill in registration form:
  - Full Name: `Your Name`
  - Email: `youremail@example.com`
  - Phone: `+1 234 567 8900` (optional)
  - Password: `password123`
  - Confirm Password: `password123`
- [ ] Click "Create Account"
- [ ] ✅ Should redirect to Dashboard automatically
- [ ] ✅ Should see your Account Number (format: WL...)
- [ ] ✅ Header should show your name + "Logout" button

### 2️⃣ View & Edit Profile
- [ ] Check profile information displayed:
  - Account Number (yellow text)
  - Full Name
  - Email
  - Phone
- [ ] Click "Edit Profile"
- [ ] Change your name
- [ ] Click "Save Changes"
- [ ] ✅ Should see green success message
- [ ] ✅ Profile should show new name

### 3️⃣ Test Logout
- [ ] Click "Logout" button in header
- [ ] ✅ Should redirect to home page
- [ ] ✅ Header should show "Login" and "Get Started" buttons

### 4️⃣ Test Protected Routes
- [ ] While logged out, try to visit: `/dashboard`
- [ ] ✅ Should redirect to Login page

### 5️⃣ Test Login
- [ ] Click "Login" in header
- [ ] Enter your email and password
- [ ] Click "Sign In"
- [ ] ✅ Should redirect to Dashboard
- [ ] ✅ Profile data should be preserved
- [ ] ✅ Should see your name in header

### 6️⃣ Test Session Persistence
- [ ] Refresh the browser page
- [ ] ✅ Should stay logged in
- [ ] ✅ Dashboard still displays your info

---

## ✅ All Tests Passed?

If all checkboxes are checked, **Phase 2 is working perfectly!**

Ready to proceed with **Phase 3: Legal Compliance & AI Questionnaire**

---

## 🚨 Troubleshooting

**Problem: "Error creating account"**
→ Run the database migration (see Critical First Step above)

**Problem: "Profile not found"**
→ Re-run the database migration

**Problem: Can't login after registration**
→ Check browser console (F12) for errors
→ Verify Supabase URL and keys are correct in Replit Secrets

**Problem: Error messages in browser console**
→ Warnings about React Router are normal (safe to ignore)
→ Any errors about "supabase" mean migration wasn't run yet
