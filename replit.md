# Legal Will Generation Tool

## Overview
This project is a full-stack web application designed for the academic purpose of demonstrating AI-assisted legal document creation. It aims to provide a free, accessible tool for generating legally valid wills for Canada and the USA, leveraging AI for guidance and questionnaire generation. The application focuses on single-jurisdiction wills and provides region-specific compliance.

## User Preferences
- Use Vite (not Create React App)
- Brand Kit files must stay together in public/
- Backend uses 0.0.0.0 for Replit compatibility
- Province/State-level jurisdiction specificity

## System Architecture
The application is a full-stack React (Vite) and Node.js (Express) project.

### UI/UX Decisions
- Frontend is built with React 18 and Vite.
- Global styling is derived from a Brand Kit, ensuring a consistent aesthetic.
- Responsive design is implemented for web platforms.
- Key UI components include `Header`, `Footer`, `Home`, `Login`, `Register`, `Dashboard`, `PrivacyPolicy`, and `ProtectedRoute`.

### Technical Implementations
- **Authentication:** Supabase provides user authentication, session management, and protected routes. Account numbers are auto-generated.
- **Backend API:** An Express.js server handles API requests, with CORS enabled for frontend communication.
- **AI Integration:** Google Gemini API is integrated for generating compliance statements, dynamic multi-round questionnaires (initial and follow-up questions), and final will assessments. A `RateLimiter` class manages Gemini API requests to adhere to rate limits, enforcing a 6-second delay between requests and handling quota errors. The `gemini-2.5-flash` model is used.
- **Database Interaction:** Frontend communicates directly with Supabase, relying on Row Level Security (RLS) policies for data access control, rather than proxying through the backend.
- **Questionnaire Design:** A hybrid static/AI architecture for questionnaires involves static, curated initial questions (Round 1) and constrained AI follow-up questions (Rounds 2-3) to gather information for will creation.

### Feature Specifications
- User authentication with secure registration and login.
- Legal compliance checks based on user-selected jurisdiction (Canadian provinces/territories and US states).
- AI-guided dynamic questionnaire generation.
- Generation of a final assessment document summarizing legal compliance.
- User dashboard for managing created wills, including status tracking (draft, in_progress, completed, archived).
- Data privacy considerations, including GDPR/privacy law compliance and user data deletion.
- Future features include PDF generation, secure sharing via email, and download options.

### System Design Choices
- **Frontend Routing:** React Router is used for client-side navigation.
- **Database Schema:** Supabase PostgreSQL stores user profiles (`profiles` table) and will documents (`wills` table). The `wills` table includes fields for country, jurisdiction, compliance statement, Q&A data (as JSONB), questionnaire round tracking, assessment content, and status.
- **Security:** RLS policies are rigorously applied to `profiles` and `wills` tables, ensuring users can only access and modify their own data. Supabase client is configured with environment variables.
- **Environment:** Replit is used for hosting, with sensitive credentials managed via Replit Secrets.
- **Development Workflows:** Separate workflows are configured for frontend (Vite dev server on port 5000) and backend (Express API server on port 3001).

## External Dependencies
- **Database:** Supabase (PostgreSQL)
- **AI Provider:** Google Gemini API (`gemini-2.5-flash` model)
- **Email Service:** SendGrid (for future email delivery features)
- **Hosting:** Replit
- **Version Control:** GitHub

## Recent Implementation Updates (November 13, 2025)

### Consent Workflow & Disclaimer
- Users must now explicitly accept legal disclaimer before accessing questionnaire
- Consent screen shows compliance statement + strong liability warning ("NO legal liability whatsoever")
- Consent stored in database (`disclaimer_accepted`, `disclaimer_accepted_at` fields)
- Resume logic properly handles users with existing consent - bypasses consent screen
- Fixed critical bug where users resuming in-progress wills would get stuck on consent screen

### Lawyer-Style Follow-up Questions
- Reframed AI as "lawyer gathering information FROM client TO CREATE legal will"
- Focus on contingency "what if" scenarios:
  * Beneficiary death scenarios and per stirpes inheritance
  * Trusts for minors (age thresholds)
  * Executor willingness and compensation
  * Asset ownership clarifications (joint tenancy vs tenants in common)
- Explicit "DO NOT ASK" section: no questions about will document format, witnesses, or signing

### Enhanced JSON Parsing
- Robust error handling for Gemini API responses
- Automatic cleanup: removes control characters, trailing commas, adds quotes to unquoted keys
- Logs raw text on parse errors for debugging
- Retry with cleaned JSON if initial parse fails

### Hybrid Questionnaire Architecture
- **Round 1:** 15 comprehensive static questions (no AI generation for speed/consistency)
  * Personal: marital status, spouse name, children details (names & ages)
  * Executor: detailed info (name, age, relationship), compensation preference, alternate executor
  * Beneficiaries: specific distribution percentages, contingent beneficiaries, residue distribution
  * Assets: real estate (addresses & ownership), financial assets, debts/liabilities, digital assets
  * Other: guardian for minors, specific bequests, funeral preferences
  * Mix of required (12) and optional (3) fields
  * Gathers all essential information for creating a functional legal will
  * Fixed redundancy: Q8 and Q11 consolidated into single beneficiary/residue question
- **Round 2:** AI asks 4-6 questions to fill CRITICAL gaps only (missing executor details, unclear distributions, guardian info)
  * Prioritizes essential will requirements over fringe scenarios
  * Focuses on information needed for valid will creation
  * Includes all previously asked questions in prompt to prevent re-asking
- **Round 3:** AI asks 2-4 final questions for any remaining critical gaps
  * Minimal questions - assumes most info gathered
  * Only truly essential missing pieces
  * Explicitly instructed NOT to ask if users have "now" confirmed information (single-session context)
- **Assessment:** Summarizes key decisions + provides NEXT STEPS for will execution (printing, signing, witnesses)
  * Focuses on execution requirements rather than identifying gaps
  * Includes jurisdiction-specific witness and signature requirements
  * Strong liability disclaimers about legal review needed
- All prompts emphasize gathering functional will information over theoretical edge cases
- Enhanced token limit (4096) prevents AI response truncation

### PDF Generation (Completed November 13, 2025)
- **Backend Implementation:**
  * `pdfGenerator.js` - Creates formatted legal documents using PDFKit library
  * `generateWillPDF()` - Produces formal Last Will & Testament with proper legal structure:
    - Header with testator name and jurisdiction
    - Article 1: Declarations (marital status, family)
    - Article 2: Executor appointment with powers
    - Article 3: Guardian for minors (if applicable)
    - Article 4: Debt payment instructions
    - Article 5: Specific bequests
    - Article 6: Residue distribution with contingent beneficiaries
    - Article 7: Additional provisions (digital assets, funeral preferences)
    - Signature section for testator
    - Witness section with spaces for 2 witnesses
    - Legal disclaimers in footer
  * `generateAssessmentPDF()` - Produces legal assessment document with:
    - Header with user/jurisdiction info
    - Important legal notice and disclaimers
    - Compliance statement for jurisdiction
    - AI-generated assessment and next steps
    - Full Q&A summary from all questionnaire rounds
  * `storage.js` - Manages Supabase Storage operations:
    - Auto-creates 'will-documents' bucket if not exists
    - Uploads PDFs with upsert (overwrites old versions)
    - Generates signed URLs for secure downloads (1-hour expiry)
    - Organizes files by user_id/will_id structure
  * API endpoints in `wills.js`:
    - `POST /wills/:willId/generate-pdfs` - Generates both PDFs, uploads to storage, updates database
    - `GET /wills/:willId/download-pdfs` - Retrieves signed download URLs for existing PDFs
- **Frontend Implementation:**
  * `WillSummary.jsx` updated with:
    - Dynamic button states: "Generate PDF Documents" → "Download PDF Documents"
    - Loading states during generation/download
    - Error handling with user-friendly messages
    - Auto-download on successful generation (both PDFs open in new tabs)
    - Success/error feedback messaging
- **Database Updates:**
  * `will_pdf_path` stores Supabase Storage path for will document
  * `assessment_pdf_path` stores path for assessment document
  * Status updates to 'completed' after PDF generation
- **Security & Storage:**
  * Private Supabase Storage bucket (non-public)
  * Signed URLs expire after 1 hour for security
  * Files organized by user_id for isolation
  * 10MB file size limit per PDF
```