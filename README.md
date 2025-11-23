# Legal Will Generation Tool

**Academic Project for University of Calgary (ENTI333)**  
**Team Project:** ENTI333 Final Project Team

---

## 📌 Overview

This is a full-stack web application that helps users create legally valid wills for Canada (all 13 provinces/territories) and the USA (all 50 states). The tool uses **AI-guided questionnaires** to gather information and generate region-specific legal compliance assessments.

### Current Status: All Core Features Complete ✅
- ✅ User authentication and profile management
- ✅ **Schema-driven architecture** with two-tier system (template fields vs contextual information)
- ✅ AI-powered questionnaire system (3 rounds with anti-repetition mechanisms)
- ✅ Jurisdiction-specific compliance checks (13 Canadian provinces/territories, 50 US states)
- ✅ Age verification for legal testamentary capacity
- ✅ PDF generation for will documents and assessment reports
- ✅ Email sharing via SendGrid with secure PDF attachments
- ✅ User data deletion with comprehensive cleanup
- ✅ Privacy policy and data handling compliance
- ✅ Contextual tooltip help system and multi-field person inputs

---

## 🎯 Project Goals

- Provide a **free, accessible tool** for legal will creation
- Demonstrate **AI-assisted legal document creation** using Google Gemini
- Ensure **secure data handling** and privacy compliance (PIPEDA, CCPA)
- Academic project showcasing full-stack development with modern technologies

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18 + Vite |
| **Backend** | Node.js + Express |
| **Database** | Supabase (PostgreSQL) |
| **AI** | Google Gemini API (gemini-2.5-flash) |
| **Email** | SendGrid |
| **PDF Generation** | PDFKit |
| **Hosting** | Replit |
| **Version Control** | GitHub |

---

## 🏗️ Architecture Overview

**📊 [View Complete Architecture Diagram →](ARCHITECTURE.md)**

The architecture diagram provides:
- High-level system architecture with all components
- Component interaction flow (authentication, will creation, PDF generation, email sharing)
- Database schema (ERD diagrams)
- Schema-driven data flow
- Technology stack breakdown
- Security architecture
- File structure overview

---

## Architecture Highlights

### Schema-Driven AI System

The application uses a **two-tier schema system** (`willSchema.js`) that separates:

**Type 1: Template Fields** (Goes IN the will PDF)
- Exact field names mapping to specific PDF Articles
- Examples: `marital_status`, `executor_details`, `beneficiary_distribution`
- These fields directly populate the final will document
- Missing required template fields = incomplete will

**Type 2: Contextual Information** (For legal assessment)
- Questions that inform legal guidance but don't appear in will template
- Categories:
  - **Non-Probate Assets:** Life insurance, retirement accounts, jointly-owned property
  - **Complex Estate Matters:** Business interests, trusts, foreign assets
  - **Family Complexity:** Previous marriages, blended families, estranged relatives
  - **Jurisdiction-Specific:** Common-law recognition, forced heirship, community property
- AI can ask comprehensive questions without forcing them into rigid template

**Benefits:**
- ✅ Clear separation: rigid PDF structure vs flexible AI guidance
- ✅ Single source of truth for data flow
- ✅ AI can be comprehensive (ask about life insurance) without being constraining
- ✅ Assessment explains non-probate assets and jurisdiction-specific requirements
- ✅ Easier to maintain and extend

---

## 📂 Project Structure

```
legal-will-generation-tool/
├── public/                    # Static assets
│   ├── Brand_Kit.html        # Visual branding reference
│   ├── brand-kit.css         # Brand styling
│   └── logo.png              # Project logo
├── src/                       # React frontend
│   ├── components/           # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/                # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CreateWill.jsx
│   │   ├── Questionnaire.jsx
│   │   ├── WillSummary.jsx
│   │   └── PrivacyPolicy.jsx
│   ├── context/              # React context
│   │   └── AuthContext.jsx
│   ├── lib/                  # Utilities
│   │   └── supabase.js
│   ├── config/               # Configuration
│   │   └── api.js
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── server/                    # Node.js backend
│   ├── index.js              # Express server
│   ├── routes/               # API routes
│   │   ├── ai.js             # AI endpoints
│   │   ├── wills.js          # Will management
│   │   ├── notifications.js  # Notification backend (UI disabled)
│   │   └── user.js           # User data deletion
│   ├── lib/                  # Backend utilities
│   │   ├── gemini.js         # Gemini AI integration
│   │   ├── willSchema.js     # Two-tier schema definition
│   │   ├── emailService.js   # SendGrid integration
│   │   └── pdfGenerator.js   # PDF generation
│   └── migrations/           # Database migrations
│       ├── 001_create_profiles_table.sql
│       ├── 002_create_wills_table.sql
│       └── 003_create_notifications_table.sql
├── database/                  # Additional migrations
│   └── migrations/
│       └── 001_create_increment_retry_function.sql
├── PRD.md                     # Product Requirements
├── Privacy_Policy.md          # Privacy policy
├── PROMPT_LOG.md              # Development log
├── TESTING_GUIDE.md           # Testing instructions
└── replit.md                  # Project documentation

```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- Supabase account with project created
- Google Gemini API key (paid tier recommended)
- SendGrid account with verified sender email
- Replit account (for hosting) or local development environment

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/legal-will-generation-tool.git
   cd legal-will-generation-tool
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create Replit Secrets or `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   GEMINI_API_KEY=your_gemini_api_key
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your_verified_sender_email
   ```

4. **Run database migrations:**
   
   Execute the SQL files in `server/migrations/` and `database/migrations/` in your Supabase SQL Editor in order:
   - `server/migrations/001_create_profiles_table.sql`
   - `server/migrations/002_create_wills_table.sql`
   - `server/migrations/003_create_notifications_table.sql`
   - `server/migrations/004_add_date_of_birth_to_profiles.sql`
   - `database/migrations/001_create_increment_retry_function.sql`

5. **Start development servers:**
   ```bash
   # Frontend (Vite dev server on port 5000)
   npm run dev

   # Backend (Express API on port 3001)
   cd server && node index.js
   ```

6. **Access the application:**
   - Open `http://localhost:5000` in your browser
   - Or access via Replit's webview

---

## ✅ Completed Features

### Phase 1: Foundation
- ✅ React + Vite frontend with routing
- ✅ Node.js + Express backend
- ✅ Dual workflows (frontend on port 5000, backend on port 3001)
- ✅ Global styling from Brand Kit
- ✅ Header, Footer, and page components

### Phase 2: Authentication
- ✅ Supabase authentication (email/password)
- ✅ Auto-generated account numbers (format: `WL{timestamp}{random}`)
- ✅ User profile management (name, email, phone)
- ✅ Protected routes with authentication guards
- ✅ Row-Level Security (RLS) policies on database
- ✅ 10-second timeout guards on all Supabase operations
- ✅ Error UI with retry options for connection issues

### Phase 3: AI Questionnaire
- ✅ Jurisdiction selection (13 Canadian provinces/territories, 50 US states)
- ✅ AI-generated legal compliance statements with age verification
- ✅ Dynamic multi-round questionnaires (max 3 rounds)
- ✅ **Schema-driven AI prompts** distinguishing template fields from contextual information
- ✅ AI follows up based on previous answers with anti-repetition mechanisms
- ✅ Automated retry mechanism for empty/invalid AI responses (up to 3 attempts with exponential backoff)
- ✅ Boolean (Yes/No) question type support
- ✅ Multi-field person input system (structured data collection)
- ✅ Contextual tooltip help system (static + AI-generated)
- ✅ Final legal assessment generation with age compliance checks
- ✅ Just-in-time date of birth collection during will creation
- ✅ Age verification flags underage users while allowing continuation
- ✅ Q&A data storage in Supabase (JSONB format)
- ✅ Rate limiting (10 requests/minute) with queue serialization
- ✅ Comprehensive quota error handling (RPM vs RPD errors)

### Phase 4: PDF Generation
- ✅ Generate will documents as formatted PDFs (using PDFKit)
- ✅ **Template-driven PDF generation** using exact schema field mappings
- ✅ Generate assessment reports as PDFs with flexible sections
- ✅ **Enhanced assessments** include "Assets Passing Outside the Will" and jurisdiction-specific compliance
- ✅ Upload PDFs to Supabase Storage (`will-documents` bucket)
- ✅ View will PDF functionality in browser
- ✅ Proper legal formatting with headers and sections
- ✅ Common-law partnership duration in Article 1

### Phase 5: Email & Data Management
- ✅ Email delivery integration (SendGrid)
- ✅ Secure PDF attachment sharing via email
- ✅ User data deletion (comprehensive: profiles, wills, PDFs, Auth accounts)
- ✅ PDF safeguards preventing deletion of wills with generated documents
- ✅ Individual will deletion from Dashboard (draft/in_progress wills only)
- ✅ JWT-based authentication and authorization for deletion endpoints
- ✅ Age verification for testamentary capacity (integrated into compliance and assessment)

---

## 🌐 API Endpoints

### Authentication (via Supabase direct)
- Frontend communicates directly with Supabase using RLS policies
- No backend proxy for auth operations

### AI Routes (`/api/ai/`)
- **POST** `/api/ai/compliance` - Generate jurisdiction-specific compliance statement
  - Body: `{ country, jurisdiction, jurisdictionFullName, age? }`
  - Response: `{ complianceStatement }`
- **POST** `/api/ai/questions/initial` - Generate Round 1 questions (15 static questions)
  - Body: `{ jurisdiction, jurisdictionFullName }`
  - Response: `{ questions: [...] }`
- **POST** `/api/ai/questions/followup` - Generate follow-up questions (3-5 questions)
  - Body: `{ jurisdiction, jurisdictionFullName, previousQA }`
  - Response: `{ questions: [...] }`
- **POST** `/api/ai/assessment` - Generate final legal assessment
  - Body: `{ jurisdiction, jurisdictionFullName, allQA, age? }`
  - Response: `{ assessment }`

### Will Management (`/api/wills/`)
- **POST** `/api/wills` - Create new will
- **GET** `/api/wills/user/:userId` - Get all user's wills
- **GET** `/api/wills/:willId` - Get specific will
- **PUT** `/api/wills/:willId` - Update will data
- **DELETE** `/api/wills/:willId` - Delete will (with PDF safeguards)
- **POST** `/api/wills/:willId/email` - Share will PDFs via email

### Notifications (`/api/notifications/`) ⚠️ **Backend Only - UI Disabled**
- **GET** `/api/notifications` - Get user's notifications
- **PUT** `/api/notifications/:id/read` - Mark notification as read
- **POST** `/api/notifications/:id/retry` - Retry failed action
- **Note:** Notification system exists in backend but UI is disabled and untested

### User Management (`/api/user/`)
- **DELETE** `/api/user/delete-all-data` - Complete user data deletion

### Health Check
- **GET** `/api/health` - Server health status
- **GET** `/api/config/check` - Verify environment configuration

---

## 🔒 Privacy & Security

### Data Storage
- **User Profiles:** Full name, email, phone, account number, date of birth (for age verification)
- **Q&A Data:** All questions and answers from questionnaires (JSONB format)
- **Will Metadata:** Country, jurisdiction, compliance statements, assessment content
- **Will Documents:** PDFs stored in Supabase Storage with secure URLs

### Security Measures
- ✅ HTTPS encryption via Replit/Supabase
- ✅ Row-Level Security (RLS) policies - users can only access their own data
- ✅ Service Role Key used only for admin deletion operations
- ✅ JWT-based authentication for sensitive endpoints
- ✅ No plaintext passwords (Supabase handles auth)
- ✅ 30-second authentication timeouts prevent indefinite hanging requests
- ✅ Environment variables for all sensitive credentials
- ✅ PDF safeguards prevent accidental data loss

### Privacy Compliance
- Users can view and edit their profile data
- Users can delete all their data (profiles, wills, PDFs, Auth accounts)
- Privacy Policy available at `/privacy-policy`
- See `Privacy_Policy.md` for complete details

---

## ⚙️ Configuration

### Rate Limiting
- **Gemini API:** 10 requests per minute (free tier)
- **Implementation:** Promise chain queue with 6-second minimum spacing
- **Error Handling:** Specific messages for RPM vs RPD quota errors
- **Retry Logic:** Automated retry for empty/invalid AI responses (up to 3 attempts)

### Timeouts
- **All Supabase Operations:** 30-second timeout
- **Implementation:** `withTimeout` helper wraps all async Supabase calls
- **Error Recovery:** User-friendly error messages ("You have been away too long...") with Retry and Go to Login buttons
- **Browser Tab Switching:** Timeout accommodates browser throttling when switching applications

### Workflows
1. **Frontend:** `npm run dev` (Vite dev server, port 5000, webview)
2. **Backend:** `cd server && node index.js` (Express API, port 3001, console)

---

## 🧪 Testing

See `TESTING_GUIDE.md` for comprehensive testing instructions.

### Quick Test Checklist
1. ✅ Register new user (auto-generates account number)
2. ✅ Login with credentials
3. ✅ View and edit profile
4. ✅ Create new will (select jurisdiction)
5. ✅ Answer Round 1 questions (15 static questions)
6. ✅ Answer Round 2 questions (AI-generated follow-up based on Round 1)
7. ✅ Complete Round 3 if needed (AI-generated final clarifications)
8. ✅ View final assessment
9. ✅ View will PDF in browser
10. ✅ Share documents (Will + Assessment) via email
11. ✅ Delete individual will (draft/in_progress only)
12. ✅ Delete all user data

### Known Limitations
- SendGrid accepts valid email formats regardless of mailbox existence (actual bounces happen asynchronously)
- Rate limited to 10 Gemini API requests/minute
- Email failure testing requires invalid email formats (prevented by frontend validation)

---

## ⚠️ Error Handling

### Authentication Errors
- **Connection Timeout:** Shows error UI with Retry button after 10 seconds
- **Invalid Credentials:** Clear error message on login form
- **Profile Load Failure:** Graceful degradation, user can retry

### AI Quota Errors
- **RPM Error (Rate Limit):** "Too many requests per minute (max 10/min). Please wait and try again."
- **RPD Error (Daily Quota):** "Daily quota exceeded (250 requests/day). Resets at midnight Pacific Time."
- **Empty/Invalid Responses:** Automated retry with exponential backoff (up to 3 attempts)
- **Network Errors:** Retry with exponential backoff

### Database Errors
- **RLS Policy Violations:** Returns 403, user shown clear error
- **Connection Failures:** 10-second timeout with retry option

### PDF & Email Errors
- **PDF Generation Failure:** Error logged to backend (notification backend tracks event but UI disabled)
- **Email Send Failure:** Error logged to backend with detailed message (notification backend tracks event but UI disabled)
- **Deletion Safeguards:** Cannot delete wills with generated PDFs

---

## 📚 Additional Documentation

### Core Documentation
- **[PRD_final.md](./PRD_final.md)** - Final Product Requirements Document reflecting actual delivered scope (features implemented vs. excluded)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture with Mermaid diagrams, data flow, component interactions, and technical decisions
- **[Privacy_Policy.md](./Privacy_Policy.md)** - Comprehensive privacy notice and legal disclaimer (also available in-app at `/privacy-policy`)
- **[PROMPT_LOG.md](./PROMPT_LOG.md)** - Complete development history documenting all 26 AI coding phases from initial setup to production-ready state
- **[replit.md](./replit.md)** - Replit-specific system architecture, user preferences, and recent changes log

### Testing & Validation
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Step-by-step testing instructions for authentication, questionnaire, PDF generation, and email sharing
- **[QUICK_TEST_CHECKLIST.md](./QUICK_TEST_CHECKLIST.md)** - Rapid testing checklist for all core features

### Historical Documents
- **[Old PRDs/](./Old%20PRDs/)** - Previous versions of Product Requirements Documents showing project evolution

---

## 🙌 Acknowledgements

- **University of Calgary** - ENTI333 Term Project
- **Professor Mohammad Keyhani** - Course instructor
- **AI Development Assistance:**
  - Replit Agent (powered by Google Gemini) - Ideation, problem solving, debugging, and code implementation
  - GitHub Copilot - Code completion and suggestions
- **Technologies:**
  - React + Vite
  - Node.js + Express
  - Supabase (Database & Auth)
  - Google Gemini AI (gemini-2.5-flash)
  - SendGrid (Email)
  - PDFKit (PDF Generation)
  - Replit (Hosting platform and development environment)
  - GitHub (Version Control)

---

## 📄 License

This project is for **academic purposes only** and is **not intended to provide legal advice**. Users should consult with a licensed attorney for legal matters.

**License:** Academic Use Only  
See `LICENSE.txt` for details.

---

## 👥 Team

**ENTI333 Final Project Team**  
University of Calgary  
ENTI333 - Final Term Project  
2025

---

## 🚧 Future Improvements

The following features were considered but not implemented in the current version. These are potential areas for future development:

### Audit Logging System
- **Purpose:** Comprehensive logging of all critical operations (user actions, data modifications, deletions)
- **Benefits:** 
  - Enhanced security and accountability
  - Compliance tracking for regulatory requirements
  - Debugging and troubleshooting support
  - Forensic analysis capabilities
- **Implementation Considerations:**
  - Create `audit_logs` table with fields: `id`, `user_id`, `action_type`, `resource_type`, `resource_id`, `changes`, `ip_address`, `timestamp`
  - Log events: user registration, profile updates, will creation/updates/deletion, PDF generation, email sharing, account deletion
  - Retention policy: 90 days for active users, permanent for deleted accounts
  - RLS policies ensuring users cannot view/modify audit logs
  - Admin dashboard for audit log review

### Service-Role Key Management
- **Purpose:** Advanced admin operations and elevated permissions
- **Benefits:**
  - Separation of user and admin operations
  - Enhanced security through privilege separation
  - Support for administrative tasks without exposing service keys to frontend
- **Implementation Considerations:**
  - Dedicated admin backend routes with service-role authentication
  - Admin dashboard for system monitoring
  - Bulk operations and maintenance tasks
  - Advanced reporting and analytics

### Notification System (UI Integration)
- **Purpose:** Display user notifications for system events and actions
- **Current Status:** Backend and context fully implemented but **UI disabled and untested**
- **What Exists:**
  - Complete notification backend API (`/api/notifications/`)
  - NotificationContext for state management
  - Notification bell component (removed from UI)
  - Database table with RLS policies
  - Email success/failure tracking
- **What's Needed:**
  - Re-enable notification bell in Header
  - Test notification dropdown panel
  - Verify mark-as-read functionality
  - Test retry mechanism for failed actions
  - User acceptance testing

### AI-Powered Help Chatbot
- **Purpose:** Real-time assistance during questionnaire and will creation process
- **Current Status:** Placeholder button present with "under development" message
- **Benefits:**
  - Answer user questions about legal terminology
  - Explain jurisdiction-specific requirements
  - Provide guidance on complex estate planning scenarios
  - Reduce user confusion and abandonment
- **Implementation Considerations:**
  - Context-aware chatbot using Google Gemini AI
  - Session history tracking for coherent conversations
  - Pre-loaded knowledge base of common legal questions
  - Integration with current questionnaire state
  - Rate limiting to manage API costs

### Direct PDF Download Feature
- **Purpose:** Allow users to download PDFs directly from browser instead of email-only access
- **Current Status:** PDFs only available via email sharing
- **Benefits:**
  - Immediate access to documents without email delay
  - Offline storage for users
  - Reduced dependency on email service
  - Better user control over document access
- **Implementation Considerations:**
  - Add download buttons to Dashboard and WillSummary pages
  - Generate temporary signed URLs (1-hour expiration)
  - Track download events for user activity monitoring
  - Implement browser-based PDF viewer

### Global Jurisdiction Expansion
- **Purpose:** Extend legal will support beyond Canada and USA
- **Current Status:** Supports 13 Canadian provinces/territories and 50 US states
- **Potential Regions:**
  - United Kingdom (England, Scotland, Wales, Northern Ireland)
  - Australia (6 states, 2 territories)
  - New Zealand
  - European Union countries
  - Other common law jurisdictions
- **Implementation Considerations:**
  - Research jurisdiction-specific legal requirements
  - Translate AI prompts for non-English regions
  - Partner with international legal experts for validation
  - Expand willSchema.js to support region-specific fields
  - Update compliance checks for international probate laws

### Mobile Platform Support
- **Purpose:** Native mobile applications for iOS and Android
- **Current Status:** Web-only application (mobile-responsive design)
- **Benefits:**
  - Better mobile user experience
  - Offline questionnaire drafting
  - Push notifications for will review reminders
  - Biometric authentication (fingerprint, Face ID)
  - Wider accessibility and reach
- **Implementation Considerations:**
  - React Native or Flutter for cross-platform development
  - Secure local storage for draft wills
  - Sync mechanism with backend database
  - Mobile-optimized PDF viewer
  - App store compliance and legal disclaimers

### Other Potential Enhancements
- Multi-language support (French, Spanish, Mandarin)
- Two-factor authentication (2FA)
- Document versioning and history tracking
- In-app will comparison tool
- Legal attorney directory integration
- Scheduled will review reminders
- Beneficiary notification system (alert beneficiaries of will existence)
- Digital asset management (social media, crypto wallets)
- Integration with estate planning services

---

## 📚 Complete Documentation Index

All project documentation is organized in the **[📚 Additional Documentation](#-additional-documentation)** section above, including:

**Core Documentation:** PRD_final.md, ARCHITECTURE.md, Privacy_Policy.md, PROMPT_LOG.md, replit.md  
**Testing & Validation:** TESTING_GUIDE.md, QUICK_TEST_CHECKLIST.md  
**Historical:** Old PRDs/ folder with previous versions

---

## 🔗 Links

- **GitHub Repository:** [Your Repo URL]
- **Replit Project:** [Your Replit URL]
- **Demo Video:** [To be added]

---

**Last Updated:** November 23, 2025 (Schema-Driven Architecture + Enhanced AI Guidance - Production Ready)
