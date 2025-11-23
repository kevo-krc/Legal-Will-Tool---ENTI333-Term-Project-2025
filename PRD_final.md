# PRD (Final): Legal Will Generation Tool

**Version:** Final Delivered (November 23, 2025)  
**Project Team:** ENTI333 Final Project Team  
**Institution:** University of Calgary  
**Course:** ENTI333 - Final Project

---

## 1. Product Overview

### 1.1 Document Purpose

This document reflects the **actual delivered scope** of the Legal Will Generation Tool as of November 23, 2025. It documents the features that were successfully implemented and notes the features that were not included in the final submission.

### 1.2 Product Summary

The Legal Will Generation Tool is a **web-based application** (web-only, no mobile app) that helps users create legally valid wills for Canada (all 13 provinces/territories) and the USA (all 50 states). The tool uses **AI-guided questionnaires** powered by Google Gemini to gather information and generate region-specific legal compliance assessments.

**Platform:** Web application only (React + Vite frontend, Node.js + Express backend)  
**Hosting:** Replit  
**Database:** Supabase (PostgreSQL)  
**AI Provider:** Google Gemini API (gemini-2.5-flash model)  
**Email Service:** SendGrid  
**PDF Generation:** PDFKit

---

## 2. Goals

### 2.1 Project Goals (Achieved)

- ✅ Provide a free, accessible tool for legal will creation
- ✅ Demonstrate AI-assisted legal document creation for academic purposes
- ✅ Ensure secure data handling and privacy compliance
- ✅ Support jurisdiction-specific legal requirements (Canada & USA)
- ✅ Academic project showcasing full-stack development skills

### 2.2 User Goals (Achieved)

- ✅ Create a legally compliant will without requiring a lawyer
- ✅ Receive AI-guided assistance through the will creation process
- ✅ Understand legal compliance requirements for their jurisdiction
- ✅ Share generated documents securely via email
- ✅ Maintain full control over personal data with deletion capabilities

### 2.3 Non-Goals (Scope Exclusions)

The following were identified as non-goals or excluded from the final scope:

- ❌ **Mobile Applications:** No iOS or Android native apps (web-only)
- ❌ **Annual Will Review Reminders:** No automated yearly email follow-ups
- ❌ **Direct PDF Downloads:** Email-only delivery (no browser download buttons)
- ❌ **Active Notification System UI:** Backend exists but UI disabled and untested
- ❌ **Audit Logging System:** Not implemented (no detailed operation tracking)
- ❌ **Service-Role Key Management:** Not exposed to users
- ❌ **Multi-Language Support:** English only
- ❌ **Two-Factor Authentication (2FA):** Not implemented
- ❌ **Global Jurisdiction Support:** Limited to Canada and USA only
- ❌ **AI-Powered Help Chatbot:** Placeholder button only (not functional)
- ❌ **Document Versioning:** No version history tracking
- ❌ **Legal Professional Directory:** No lawyer referral integration

---

## 3. User Personas

### 3.1 Key User Types

- **Estate Planners:** Individuals who want to create a will for personal use
- **Academic Evaluators:** Professors and teaching assistants assessing the project
- **Future Developers:** Students or developers who might extend the project

### 3.2 Role-Based Access

- **Guest Users:** Can view homepage and privacy policy
- **Registered Users:** Can create wills, manage profile, view documents, delete account
- **No Admin Role:** All users have equal access (no administrative privileges)

---

## 4. Functional Requirements (Delivered)

### 4.1 User Authentication (High Priority) ✅

**Implemented Features:**
- Secure registration with email and password
- Login/logout functionality
- Session management with Supabase Auth
- Protected routes (dashboard, questionnaire, etc.)
- Password validation (minimum 6 characters)
- Email uniqueness enforcement
- Session timeout handling (10-second timeout for token retrieval)

**Not Implemented:**
- Two-factor authentication (2FA)
- Social login (Google, Facebook, etc.)
- Password reset functionality

### 4.2 User Profile Management (High Priority) ✅

**Implemented Features:**
- Auto-generated account numbers (format: `WL{timestamp}{random}`)
- Profile creation upon registration
- Edit profile capability (name, phone number)
- Profile data stored in Supabase with Row Level Security (RLS)

### 4.3 Legal Compliance Check (High Priority) ✅

**Implemented Features:**
- Jurisdiction selection (13 Canadian provinces/territories, 50 US states)
- AI-generated compliance statements specific to selected jurisdiction
- Age verification for legal testamentary capacity (18+ for most jurisdictions, 19+ for certain provinces)
- Disclaimer and consent workflow
- Opt-in/opt-out decision tracking

### 4.4 AI-Guided Will Creation (High Priority) ✅

**Implemented Features:**
- **Schema-driven architecture** with two-tier system:
  - **Type 1 - Template Fields:** Questions that map directly to PDF template (executor, beneficiaries, etc.)
  - **Type 2 - Contextual Information:** Questions for legal assessment (life insurance, business interests, etc.)
- **Three-round questionnaire:**
  - Round 1: Static initial questions (15 questions covering basics)
  - Round 2: AI-generated follow-up questions (based on Round 1 answers and schema)
  - Round 3: Final clarification questions (if needed, based on Round 2 answers)
- **Multi-field person input system:** Structured data collection for spouse, executor, guardian, beneficiaries (name, relationship, age, address)
- **Contextual tooltip help:** Static tooltips for initial questions, AI-generated tooltips for follow-up questions
- **User profile context:** AI receives prior answers to avoid redundant questions
- **Anti-repetition mechanisms:** AI explicitly instructed not to repeat known information
- **Rate limiting:** Exponential backoff for API requests to Google Gemini
- **Empty response retry:** Automatic retry if AI returns empty/invalid response

**Not Implemented:**
- Real-time AI chatbot assistance (placeholder button exists but not functional)
- More than 3 rounds of questions

### 4.5 PDF Generation and Document Sharing (High Priority) ✅

**Implemented Features:**
- **Will PDF:** Legally formatted will document with 9 articles (testator info, executor, guardianship, residuary estate, etc.)
- **Assessment PDF:** 300-500 word legal guidance document analyzing the will's strengths and areas for attention
- **Human-readable filenames:** `Will_UserName_MM_DD_YYYY.pdf` and `Assessment_UserName_MM_DD_YYYY.pdf`
- **Supabase Storage:** PDFs uploaded to private buckets with signed URLs (1-hour expiration)
- **Email Sharing:** SendGrid integration for secure PDF delivery
- **Rate limiting:** 5 emails per hour per user to prevent abuse

**Not Implemented:**
- Direct browser download functionality (email-only delivery)
- PDF editing or regeneration after initial creation
- Document versioning

### 4.6 Data Management and Deletion (High Priority) ✅

**Implemented Features:**
- **View all wills:** Dashboard displays all created wills with status tracking
- **Individual will deletion:** Delete specific wills (blocked if PDF already generated)
- **Comprehensive account deletion:**
  - Deletes user profile
  - Deletes all will records
  - Deletes all PDF files from Supabase Storage
  - Deletes Supabase Auth account
  - Sends confirmation email
- **JWT-based authentication:** Secure API endpoints for deletion operations

### 4.7 Privacy and Security (High Priority) ✅

**Implemented Features:**
- **Row Level Security (RLS):** Database policies ensure users only access their own data
- **HTTPS encryption:** All communication secured via SSL/TLS
- **Password hashing:** Supabase Auth handles secure password storage
- **Data encryption at rest:** Supabase encryption services
- **Privacy Policy:** Comprehensive notice and disclaimer accessible via link in footer
- **Consent management:** Users must explicitly accept disclaimer before proceeding
- **Private PDF storage:** Files not publicly accessible (signed URLs with expiration)

**Not Implemented:**
- Audit logging system (no operation tracking)
- Service-role key exposure to users
- Two-factor authentication (2FA)

### 4.8 Notifications System (Medium Priority) ⚠️ **Partially Implemented**

**Implemented in Backend:**
- Notifications table with RLS policies
- Notification creation for key events (will creation, deletion, email sharing)
- Retry action tracking

**Not Implemented in Frontend:**
- Notification bell icon removed from header
- No UI for viewing or managing notifications
- System exists but untested and disabled

### 4.9 Annual Will Review (Medium Priority) ❌ **Not Implemented**

**Planned but Not Delivered:**
- Annual email reminders to users
- AI-powered update questions based on legal changes
- Will comparison or change detection

---

## 5. User Experience

### 5.1 User Journey (Implemented)

1. **Homepage:** Guest user lands on homepage with "Get Started" button
2. **Registration:** User creates account (name, email, phone, password)
3. **Dashboard:** User redirected to dashboard showing account number and profile
4. **Legal Disclaimer:** User initiates will creation, selects jurisdiction, reads compliance statement
5. **Consent:** User accepts or rejects disclaimer (must accept to proceed)
6. **Round 1 Questions:** 15 static questions with tooltips covering basic information
7. **Round 2 Questions:** AI-generated follow-up questions specific to jurisdiction and answers
8. **Round 3 Questions:** (Optional) Final clarification questions if needed
9. **Summary Review:** User reviews all answers before finalizing
10. **PDF Generation:** Will and assessment PDFs created and uploaded to storage
11. **Post-Generation:** User can view will PDF or share both documents via email
12. **Data Management:** User can delete individual wills or entire account from dashboard

### 5.2 Visual Design

**Brand Kit:**
- Global styling with consistent color scheme
- Responsive design for desktop, tablet, mobile web browsers
- Header with navigation tabs (Home, Dashboard, Privacy Policy)
- Footer with privacy policy link and copyright notice
- Tooltip icons for contextual help

**Key UI Components:**
- `Header.jsx`: Navigation bar with conditional rendering based on auth state
- `Footer.jsx`: Privacy policy link and copyright
- `Home.jsx`: Landing page with project overview
- `Login.jsx`: Login form with error handling
- `Register.jsx`: Registration form with validation
- `Dashboard.jsx`: Profile management and will list
- `Questionnaire.jsx`: Multi-round question display with tooltips
- `WillSummary.jsx`: Answer review and "Next Steps" section
- `PrivacyPolicy.jsx`: Comprehensive privacy notice with auto-scroll to top

---

## 6. Technical Considerations

### 6.1 Architecture

**Frontend:**
- React 18 + Vite (port 5000)
- React Router for client-side navigation
- Axios for API requests
- React Context API for authentication state
- Direct Supabase client integration for database operations

**Backend:**
- Node.js + Express (port 3001)
- CORS enabled for frontend communication
- Google Gemini API integration with rate limiting
- PDFKit for document generation
- SendGrid for email delivery
- Supabase Admin SDK for file uploads and auth operations

**Database:**
- Supabase PostgreSQL with Row Level Security (RLS)
- Tables: `profiles`, `wills`, `notifications`
- Migrations stored in `server/migrations/` and `database/migrations/`

**Hosting:**
- Replit platform with dual workflow setup (frontend + backend)

### 6.2 Schema-Driven Design

**Key Innovation:**
- Two-tier schema system (`server/lib/willSchema.js`) separates:
  - **Template Fields:** Data that goes IN the will PDF (executor, beneficiaries, etc.)
  - **Contextual Information:** Data that informs legal assessment but doesn't appear in will template (life insurance, business interests, etc.)
- AI prompts explicitly reference schema to ensure alignment
- Single source of truth for data flow: Questions → Schema → PDF Articles

### 6.3 Security Measures

- JWT-based authentication for API endpoints
- Row Level Security (RLS) policies on all sensitive tables
- Input validation and sanitization
- Rate limiting on email sharing (5/hour per user)
- Private file storage with signed URLs (1-hour expiration)
- HTTPS/SSL encryption for all communication
- Password hashing via Supabase Auth

---

## 7. Scope Reductions from Original PRD

### 7.1 Platform Limitations

**Original Plan:** Web and mobile (Android) applications  
**Delivered:** Web-only application (React + Vite)  
**Reason:** Team decided to focus on perfecting web experience first

### 7.2 Feature Exclusions

**Annual Will Review:**
- **Original Plan:** Email users annually with AI-generated update questions
- **Delivered:** Not implemented
- **Reason:** Requires scheduled job infrastructure beyond project scope

**Direct PDF Downloads:**
- **Original Plan:** Allow users to download PDFs directly to their device
- **Delivered:** Email-only delivery
- **Reason:** Security and simplicity (email provides audit trail)

**Notification UI:**
- **Original Plan:** Active notification system with bell icon and notification list
- **Delivered:** Backend exists but UI disabled and untested
- **Reason:** Time constraints, prioritized core features

**AI Chatbot:**
- **Original Plan:** Real-time AI assistant during questionnaire
- **Delivered:** Placeholder "AI-Help" button with "under development" message
- **Reason:** Complex implementation, tooltips provide sufficient guidance

**Audit Logging:**
- **Original Plan:** Detailed operation tracking for security and compliance
- **Delivered:** Not implemented
- **Reason:** Academic project doesn't require production-level auditing

### 7.3 Jurisdiction Limitations

**Original Plan:** Potential global expansion (UK, Australia, EU, etc.)  
**Delivered:** Canada (13 provinces/territories) and USA (50 states) only  
**Reason:** Legal research required for each new jurisdiction

---

## 8. Testing and Validation

### 8.1 Testing Documentation

**Files:**
- `TESTING_GUIDE.md`: Step-by-step authentication testing guide
- `QUICK_TEST_CHECKLIST.md`: Rapid testing checklist for all features

### 8.2 Key Test Scenarios

1. **Authentication:** Registration, login, logout, session persistence
2. **Profile Management:** Edit profile, view account details
3. **Will Creation:** All 3 rounds of questions, answer validation
4. **PDF Generation:** Will and assessment PDF creation
5. **Email Sharing:** SendGrid delivery with PDF attachments
6. **Data Deletion:** Individual will deletion, account deletion
7. **Privacy Policy:** Link accessibility, scroll behavior
8. **Protected Routes:** Redirect to login if not authenticated

---

## 9. Future Improvements (Not Implemented)

See `README.md` section 13 for comprehensive list, including:

- Audit logging system
- Service-role key management
- AI-powered help chatbot (functional)
- Direct PDF download feature
- Global jurisdiction expansion
- Mobile platform support (iOS/Android native apps)
- Notification system UI integration
- Multi-language support
- Two-factor authentication (2FA)
- Document versioning and comparison
- Legal professional directory integration
- Blockchain-based will verification
- Estate value calculator
- Digital asset management
- Testamentary trusts for complex estates

---

## 10. User Stories (Delivered)

### US-001: User Registration ✅
**As a new user**, I want to register for an account so that I can create and save my will.  
**Acceptance Criteria:**
- User provides name, email, phone (optional), password
- System validates email uniqueness and password strength
- Account created with auto-generated account number
- User redirected to dashboard after successful registration

### US-002: User Login ✅
**As a registered user**, I want to log in securely so that I can access my saved wills.  
**Acceptance Criteria:**
- User provides email and password
- System validates credentials via Supabase Auth
- Session token created upon successful login
- User redirected to dashboard
- Login button resets properly after authentication completes

### US-003: Jurisdiction Selection ✅
**As a user**, I want to select my jurisdiction (province/state) so that I receive region-specific legal guidance.  
**Acceptance Criteria:**
- Dropdown menu displays all 13 Canadian provinces/territories and 50 US states
- AI generates compliance statement based on selected jurisdiction
- Age verification performed according to jurisdiction rules
- Disclaimer includes jurisdiction-specific language

### US-004: Legal Disclaimer Acceptance ✅
**As a user**, I want to review and accept a legal disclaimer so that I understand the tool's limitations.  
**Acceptance Criteria:**
- Compliance statement displayed before questionnaire
- User must explicitly accept or reject disclaimer
- Acceptance tracked in database
- User can opt out (redirects to dashboard with message)

### US-005: AI-Guided Questionnaire ✅
**As a user**, I want to answer AI-generated questions so that my will reflects my intentions accurately.  
**Acceptance Criteria:**
- Round 1: 15 static questions displayed with tooltips
- Round 2: AI generates follow-up questions based on Round 1 answers and schema
- Round 3: AI generates final clarification questions if needed (optional)
- System prevents more than 3 rounds
- User can edit answers before finalizing

### US-006: Will PDF Generation ✅
**As a user**, I want to generate a legally formatted will PDF so that I have a valid legal document.  
**Acceptance Criteria:**
- Will PDF includes 9 articles covering all legal requirements
- Human-readable filename: `Will_UserName_MM_DD_YYYY.pdf`
- PDF uploaded to Supabase Storage (private bucket)
- Signed URL generated with 1-hour expiration
- "View Will" button displays PDF in browser

### US-007: Assessment PDF Generation ✅
**As a user**, I want to receive a legal assessment document so that I understand my will's strengths and weaknesses.  
**Acceptance Criteria:**
- Assessment PDF generated by AI (300-500 words)
- Includes sections: Legal Strengths, Areas for Attention, Assets Passing Outside Will, Jurisdiction-Specific Compliance
- Human-readable filename: `Assessment_UserName_MM_DD_YYYY.pdf`
- PDF uploaded to Supabase Storage (private bucket)
- Available via email sharing only (not directly downloadable)

### US-008: Email Document Sharing ✅
**As a user**, I want to share my documents via email so that I can send them to myself or others.  
**Acceptance Criteria:**
- User enters email address(es) in "Share via Email" form
- System sends email with both Will.pdf and Assessment.pdf attachments
- Rate limiting: Maximum 5 emails per hour per user
- Confirmation message displayed after successful send
- Error handling for invalid email addresses

### US-009: Profile Management ✅
**As a user**, I want to edit my profile information so that I can keep my details up to date.  
**Acceptance Criteria:**
- User can edit full name and phone number
- Changes saved to Supabase database
- Success message displayed after update
- Changes reflected immediately in dashboard

### US-010: Will Deletion ✅
**As a user**, I want to delete individual wills so that I can remove outdated drafts.  
**Acceptance Criteria:**
- Delete button available for wills in "In Progress" or "Finalized" status
- Cannot delete wills with generated PDFs (safeguard)
- Confirmation prompt before deletion
- Will record removed from database
- Success message displayed

### US-011: Account Deletion ✅
**As a user**, I want to delete my account and all data so that I can exercise my right to be forgotten.  
**Acceptance Criteria:**
- "Danger Zone" section in dashboard with clear warning
- User confirms deletion via typed confirmation
- System deletes:
  - User profile
  - All will records
  - All PDF files from storage
  - Supabase Auth account
- Confirmation email sent
- User logged out and redirected to homepage

### US-012: Privacy Policy Access ✅
**As a user**, I want to read the privacy policy so that I understand how my data is handled.  
**Acceptance Criteria:**
- Link accessible from footer on all pages
- Privacy policy page loads with comprehensive disclosure
- Page auto-scrolls to top when loaded
- Team attribution displayed (ENTI333 Final Project Team)
- Accurate description of features (email delivery, no audit logging, etc.)

---

## 11. Acceptance Criteria Summary

### Core Features (All Met ✅)

1. ✅ User can register, login, and logout securely
2. ✅ User can select jurisdiction and receive region-specific compliance statement
3. ✅ User must accept disclaimer before proceeding
4. ✅ User answers 3 rounds of AI-guided questions
5. ✅ System generates legally formatted Will PDF
6. ✅ System generates Assessment PDF with legal guidance
7. ✅ User can share documents via email (with rate limiting)
8. ✅ User can edit profile information
9. ✅ User can delete individual wills (with safeguards)
10. ✅ User can delete entire account (comprehensive cleanup)
11. ✅ Privacy policy accessible and accurate
12. ✅ All data protected with Row Level Security (RLS)
13. ✅ Schema-driven architecture ensures AI alignment with PDF template

### Features Excluded from Final Scope

1. ❌ Mobile applications (iOS/Android)
2. ❌ Annual will review reminders
3. ❌ Direct PDF downloads (email-only)
4. ❌ Active notification UI (backend exists but disabled)
5. ❌ AI chatbot (placeholder only)
6. ❌ Audit logging system
7. ❌ Two-factor authentication (2FA)
8. ❌ Global jurisdictions (beyond Canada/USA)

---

## 12. Version History

**Version 1.0 (November 9, 2025):** Initial PRD created with full scope (web + mobile, all features)  
**Version 2.0 (November 23, 2025):** Final PRD reflecting actual delivered scope (web-only, reduced features)

---

## 13. Conclusion

The Legal Will Generation Tool successfully delivers a **production-ready web application** for creating legally valid wills for Canada and the USA. While some features from the original PRD were excluded due to scope and time constraints, all core functionality is complete and polished:

✅ **Authentication & Security:** Fully functional with session management  
✅ **AI-Guided Questionnaire:** Schema-driven 3-round system with anti-repetition  
✅ **PDF Generation:** Legally formatted will and assessment documents  
✅ **Email Sharing:** Secure delivery via SendGrid  
✅ **Data Management:** Comprehensive deletion capabilities  
✅ **Privacy Compliance:** RLS policies and clear privacy policy  

**Academic Goals Met:**
- Demonstrates full-stack development skills (React, Node.js, Express, Supabase)
- Showcases AI integration with Google Gemini
- Implements security best practices (RLS, JWT, encryption)
- Provides comprehensive documentation (README, TESTING_GUIDE, PROMPT_LOG, PRD_final)

**Ready for:**
- Academic submission and evaluation
- GitHub portfolio showcase
- Potential future expansion (see Future Improvements in README.md)

---

**Last Updated:** November 23, 2025  
**Status:** Production-ready for academic submission
