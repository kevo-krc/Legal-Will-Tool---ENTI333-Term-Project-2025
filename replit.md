# Legal Will Generation Tool - Replit Project

## Overview
This is a full-stack web application for creating legally valid wills for Canada and the USA using AI-assisted guidance. The project is an academic initiative demonstrating AI-driven legal document creation.

**Current Status:** Phase 2 Complete - Authentication & User Management Implemented

## Project Information
- **Author:** Kevin Cooney
- **Institution:** University of Calgary
- **Purpose:** Academic term project (ENTI333)
- **Type:** Free, accessible legal will generation tool

## Tech Stack
- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Database:** Supabase (PostgreSQL)
- **AI Provider:** Google Gemini API
- **Email Service:** SendGrid
- **Hosting:** Replit
- **Version Control:** GitHub

## Current Setup
The application is a full-stack React + Node.js project with:
- **Frontend**: React app with Vite dev server on port 5000
- **Backend**: Express API server on port 3001
- **Routing**: React Router for SPA navigation with protected routes
- **Styling**: Global CSS extracted from Brand Kit
- **Authentication**: Fully functional Supabase authentication with auto-generated account numbers
- **Database**: Supabase PostgreSQL with RLS policies (migration ready)
- **Brand Assets**: Logo and brand kit files in public/ folder

## Architecture

### Frontend (Implemented)
- React 18 + Vite for fast development
- React Router for client-side routing
- **Authentication System:**
  - Supabase client configured with environment variables
  - AuthContext providing session management and auth functions
  - Auto-generated account numbers (format: WL{timestamp}{random})
  - Protected routes for authenticated pages
- **Component structure:**
  - `Header.jsx` - Logo, navigation, user state display, logout
  - `Footer.jsx` - Privacy Policy link
  - `Home.jsx` - Landing page with hero and features
  - `Login.jsx` - Functional login with error handling
  - `Register.jsx` - Full registration form (name, email, phone, password)
  - `Dashboard.jsx` - User profile display and edit functionality
  - `PrivacyPolicy.jsx` - Privacy policy display
  - `ProtectedRoute.jsx` - Authentication guard component
- Global styling based on Brand Kit colors
- Responsive design for web platforms

### Backend (Implemented)
- Express.js server on port 3001 (bound to 0.0.0.0)
- CORS enabled for frontend communication
- Supabase admin client for future server-side operations
- **Architecture Decision**: No auth proxy routes - frontend communicates directly with Supabase using RLS
- API endpoints:
  - `GET /api/health` - Health check
  - `GET /api/config/check` - Verify secrets configuration
- Future endpoints: AI/Gemini integration, PDF generation, email delivery

### Database (Migration Ready)
- Supabase (PostgreSQL)
- **Implemented Tables:**
  - `profiles` - User profile data with account_number, full_name, email, phone (SQL migration ready)
- **RLS Policies Implemented:**
  - Users can view only their own profile
  - Users can update only their own profile
  - Users can insert only their own profile
- **Future Tables:**
  - `wills` - Will documents and Q&A data
- **Future Storage Bucket:** `will-documents`
- Storage for:
  - User profiles (implemented)
  - Q&A data from questionnaires (Phase 3)
  - AI-generated legal assessments (Phase 3)
  - Consent and disclaimer acknowledgments (Phase 3)
  - Generated will documents (Phase 4)
  - Audit logs (Phase 5)

## Key Features (Planned)
1. **User Authentication** - Secure registration and login
2. **Legal Compliance Check** - Region-specific requirements based on address
3. **AI-Guided Questionnaire** - Dynamic question generation
4. **Will Generation** - Non-editable PDF documents
5. **Assessment Document** - Legal compliance summary
6. **User Dashboard** - Document management and data control
7. **Data Privacy** - GDPR/privacy law compliance with user data deletion
8. **Secure Sharing** - Email delivery and download options

## Supported Jurisdictions
- **Canada**: All 13 provinces/territories (province-specific laws)
- **USA**: All 50 states (state-specific laws)

## Recent Changes
- **2025-11-13 (Phase 2):**
  - Implemented Supabase authentication system
  - Created AuthContext with session management and auth functions
  - Built auto-generated account number system (WL{timestamp}{random})
  - Implemented protected routes for authenticated pages
  - Updated Register page with full form (name, email, phone, password)
  - Updated Login page with error handling and loading states
  - Enhanced Dashboard with profile display and edit functionality
  - Modified Header to show user state and logout button
  - Created SQL migration for profiles table with RLS policies
  - **Security Architecture**: Frontend → Supabase direct (no backend proxy)
  - Installed @supabase/supabase-js on frontend and backend
  - Documented backend architecture decision in server/README.md

- **2025-11-12 (Phase 1):** 
  - Created React + Vite frontend structure
  - Set up Express backend with health/config endpoints
  - Moved Brand Kit files to public/ folder
  - Extracted global styles from brand-kit.css
  - Created initial UI components (Header, Footer, Home, Auth pages)
  - Configured dual workflows (frontend + backend)
  - Fixed backend networking (0.0.0.0 binding)
  - Verified all Replit Secrets are configured

## Development Workflows
Two workflows configured:
1. **Frontend**
   - Command: `npm run dev`
   - Port: 5000 (webview)
   - Type: Vite dev server with HMR
   - Host: 0.0.0.0

2. **Backend**
   - Command: `cd server && node index.js`
   - Port: 3001 (console)
   - Type: Express API server
   - Host: 0.0.0.0

## Environment Configuration (Replit Secrets)
All sensitive credentials are stored in Replit Secrets:
- ✅ `SUPABASE_URL` - Supabase project URL
- ✅ `SUPABASE_ANON_KEY` - Supabase anonymous key
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - For deletion operations
- ✅ `GEMINI_API_KEY` - Google Gemini AI API key
- ✅ `SENDGRID_API_KEY` - SendGrid email service key
- ⚠️ `SENDGRID_FROM_EMAIL` - Verified sender email (to be set)

## Database Schema (To Be Implemented)
**Table:** `wills`
- Columns: id, user_id, account_number, user_name, email, phone, address, dob, jurisdiction, compliance_statement, disclaimer_accepted, qa_data, will_content, assessment_content, pdf_paths, status, created_at, updated_at

**Storage Bucket:** `will-documents`
- Path structure: `will-documents/user_[user_id]/will_[will_id]/[document_type].pdf`

## User Preferences
- Use Vite (not Create React App)
- Brand Kit files must stay together in public/
- Backend uses 0.0.0.0 for Replit compatibility
- Province/State-level jurisdiction specificity

## Important Notes
- This is an academic project and does not provide legal advice
- All user data handling will comply with Canadian and US privacy laws
- Cross-border estate planning is out of scope
- The tool is designed for single-jurisdiction wills only
- Deletion uses "dual-kill": storage files + database record

## Next Steps (Implementation Roadmap)
**Phase 2:** Authentication & User Management
1. Implement Supabase authentication (register/login)
2. Create protected routes
3. Build user profile management
4. Auto-generate account numbers

**Phase 3:** Legal Compliance & Questionnaire
5. Implement jurisdiction detection (province/state level)
6. Integrate Gemini AI for compliance statements
7. Build dynamic questionnaire flow (3 rounds max)
8. Store Q&A data in Supabase

**Phase 4:** PDF Generation & Storage
9. Implement PDF generation (pdfkit)
10. Upload PDFs to Supabase Storage
11. Implement download/email functionality

**Phase 5:** Data Management & Deployment
12. Implement dual-kill deletion
13. Set up email notifications (SendGrid)
14. Configure deployment settings
15. Final testing and documentation

## Privacy & Security Considerations
- Privacy Policy served from local Privacy_Policy.md file
- All sensitive data encrypted at rest (Supabase)
- RLS policies ensure users only access own data
- Service Role Key used only for admin deletion operations
- User consent tracking and storage
- Audit logging for all data operations
- Secure PDF generation and delivery
