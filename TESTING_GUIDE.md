# Authentication System Testing Guide

## Step 1: Database Setup (Required First!)

**You must complete this step before testing authentication:**

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of `server/migrations/001_create_profiles_table.sql`
6. Paste it into the SQL Editor
7. Click **Run** to execute the migration
8. You should see: "Success. No rows returned"

**What this creates:**
- `profiles` table for user data
- Row Level Security (RLS) policies for data protection
- Indexes for performance
- Auto-update triggers for timestamps

## Step 2: Test User Registration

1. **Navigate to Registration Page**
   - Click "Get Started" button in the header, OR
   - Click "Sign In" → then "Register here" link
   - URL: `http://localhost:5000/register`

2. **Fill Out Registration Form**
   - Full Name: `John Doe` (or your name)
   - Email: `test@example.com` (use a real email if you want to receive confirmation)
   - Phone: `+1 234 567 8900` (optional)
   - Password: `password123` (minimum 6 characters)
   - Confirm Password: `password123` (must match)

3. **Expected Result**
   - Button shows "Creating Account..." while processing
   - You should be automatically redirected to Dashboard
   - Your account number appears (format: WL...)
   - Header shows your name and "Logout" button

4. **Test Error Handling**
   - Try registering with same email again → Should show error
   - Try passwords that don't match → Should show "Passwords do not match"
   - Try password < 6 characters → Should show "Password must be at least 6 characters long"

## Step 3: Test Dashboard & Profile

1. **View Profile Information**
   - You should see:
     - Account Number (yellow text, format: WL{timestamp}{random})
     - Full Name
     - Email
     - Phone (or "Not set")

2. **Edit Profile**
   - Click "Edit Profile" button
   - Change your Full Name to something else
   - Update your Phone Number
   - Click "Save Changes"
   - Should see green success message: "Profile updated successfully!"
   - Profile should show updated information

3. **Test Edit Cancellation**
   - Click "Edit Profile"
   - Make changes
   - Click "Cancel"
   - Changes should be discarded

## Step 4: Test Logout

1. **Log Out**
   - Click "Logout" button in header
   - You should be redirected to home page
   - Header should now show "Login" and "Get Started" buttons

2. **Test Protected Route**
   - Try manually navigating to: `http://localhost:5000/dashboard`
   - You should be automatically redirected to Login page
   - This confirms protected routes are working

## Step 5: Test Login

1. **Navigate to Login Page**
   - Click "Login" in header, OR
   - URL: `http://localhost:5000/login`

2. **Log In with Your Credentials**
   - Email: The email you registered with
   - Password: The password you used
   - Click "Sign In"

3. **Expected Result**
   - Button shows "Signing In..." while processing
   - You should be redirected to Dashboard
   - Your profile information should be preserved
   - Header shows your name and "Logout" button

4. **Test Error Handling**
   - Try wrong password → Should show error message
   - Try non-existent email → Should show error message

## Step 6: Test Session Persistence

1. **Refresh the Page**
   - While logged in, refresh the browser
   - You should remain logged in
   - Dashboard should still display your information

2. **Navigate Between Pages**
   - Click "Home" in header → Go to home page
   - Click "Dashboard" → Return to dashboard
   - Your session should persist throughout

## Step 7: Test Browser Storage

1. **Check Browser Console (Optional)**
   - Press F12 to open Developer Tools
   - Go to "Application" tab
   - Check "Local Storage" → Should see Supabase auth token
   - Check "Console" tab → Should see no errors (warnings about React Router are okay)

## Expected User Flow Summary

✅ **Registration Flow**
Register → Auto-login → Redirect to Dashboard → See Account Number

✅ **Login Flow**  
Login Page → Enter credentials → Redirect to Dashboard → See Profile

✅ **Profile Management Flow**
Dashboard → Edit Profile → Save Changes → See Success Message → View Updated Profile

✅ **Logout Flow**
Click Logout → Redirect to Home → Session cleared → Protected routes inaccessible

✅ **Protected Routes**
Try accessing /dashboard while logged out → Auto-redirect to /login

## Common Issues & Solutions

### Issue: "Error creating account"
- **Cause**: Database table not created yet
- **Solution**: Run the SQL migration in Supabase dashboard (Step 1)

### Issue: "Profile not found" after registration
- **Cause**: RLS policies not enabled or configured incorrectly
- **Solution**: Re-run the SQL migration, ensure all policies are created

### Issue: "Session expired" message
- **Cause**: Supabase session token expired (normal after 1 hour)
- **Solution**: Log out and log back in

### Issue: Can't see profile after login
- **Cause**: Network issue or Supabase connection problem
- **Solution**: Check browser console for errors, verify Supabase URL and keys are correct

## Security Verification

✅ **Row Level Security (RLS) is Working**
- Users can only see/edit their own profile
- No user can access another user's data
- All database operations respect RLS policies

✅ **Password Security**
- Passwords are hashed by Supabase (never stored in plain text)
- Password validation enforced on frontend

✅ **Session Security**
- JWT tokens managed by Supabase
- Auto-refresh tokens for persistent sessions
- Secure logout clears all session data

## Next Steps After Testing

Once you've confirmed everything works:
1. ✅ Phase 2 is complete and fully functional
2. 🚀 Ready to proceed with Phase 3: Legal Compliance & Questionnaire
3. 📝 Consider backing up your test data (optional)
