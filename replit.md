# Legal Will Generation Tool

## Overview
This project is a full-stack web application designed for academic purposes to demonstrate AI-assisted legal document creation. It provides a free, accessible tool for generating legally valid wills for Canada and the USA, focusing on single-jurisdiction wills and ensuring region-specific compliance. The application aims to provide a reliable and accessible legal tool with AI guidance for document creation.

## User Preferences
- Use Vite (not Create React App)
- Brand Kit files must stay together in public/
- Backend uses 0.0.0.0 for Replit compatibility
- Province/State-level jurisdiction specificity

## System Architecture
The application is a full-stack React (Vite) and Node.js (Express) project.

### UI/UX Decisions
- Frontend is built with React 18 and Vite, utilizing a Brand Kit for consistent global styling.
- Responsive design is implemented.
- Key UI components include `Header`, `Footer`, `Home`, `Login`, `Register`, `Dashboard`, `PrivacyPolicy`, and `ProtectedRoute`.

### Technical Implementations
- **Authentication:** Supabase provides user authentication, session management, and protected routes. 30-second timeout with improved error messaging.
- **Backend API:** An Express.js server handles API requests with CORS enabled.
- **AI Integration:** Google Gemini API (`gemini-2.5-flash` model) generates compliance statements, dynamic multi-round questionnaires, and final will assessments. A `RateLimiter` class manages API requests to adhere to rate limits. Includes automated retry mechanism with exponential backoff (up to 3 attempts) for empty/invalid AI responses. **User profile context** (name, DOB) passed to AI to prevent asking for existing data.
- **Database Interaction:** Frontend communicates directly with Supabase, using Row Level Security (RLS) for data access control.
- **Questionnaire Design:** A hybrid architecture combines static initial questions (Round 1) with AI-constrained follow-up questions (Rounds 2-3) to gather information for will creation. AI prompts include anti-repetition mechanisms to prevent redundant questions across rounds. **Multi-field person inputs** collect structured data (name, relationship, age, address) stored as JSON objects.
- **UX Enhancements:** **Tooltip system** provides contextual help (static for Round 1, AI-generated for Rounds 2-3). **Help button** placeholder for future chatbot integration. Tooltips positioned to prevent edge cutoff.
- **PDF Generation:** Backend uses PDFKit to generate formatted legal will documents and assessment reports, which are then uploaded to Supabase Storage. Structured person data enables precise field extraction.
- **Email Sharing:** Integration with SendGrid allows users to securely share generated PDFs via email, with rate limiting and security controls. Creates both immediate success/failure notifications and persistent database notifications.
- **User Data Deletion:** A secure mechanism allows users to completely delete their data, including profiles, wills, PDFs, and Supabase Auth accounts, with JWT-based authentication and authorization. Includes safeguards preventing deletion of wills with generated PDFs.
- **Notifications System:** A robust system with a `notifications` table (with RLS) tracks various events like email successes/failures or PDF generation issues, allowing users to retry actions. Includes atomic retry increment function.

### Feature Specifications
- User authentication with secure registration and login.
- Legal compliance checks based on user-selected jurisdiction.
- AI-guided dynamic questionnaire generation for gathering comprehensive will information.
- **Contextual tooltip help system** - Static tooltips for Round 1, AI-generated tooltips for Rounds 2-3.
- **Multi-field person input system** - Structured data collection for individuals (name, relationship, age, address).
- **Help button placeholder** - Visual element for future chatbot assistance feature.
- Generation of a final assessment document summarizing legal compliance and next steps.
- User dashboard for managing created wills, including status tracking (draft, in_progress, completed, archived).
- Generation of legally structured will documents and detailed assessment reports in PDF format.
- Secure email sharing of generated PDF documents.
- Comprehensive user data deletion capabilities.
- Real-time notification and alert system for user actions and system events.

### System Design Choices
- **Frontend Routing:** React Router is used for client-side navigation.
- **Database Schema:** Supabase PostgreSQL stores user profiles (`profiles` table), will documents (`wills` table), and notifications (`notifications` table). Database migrations are stored in `server/migrations/` and `database/migrations/`.
- **Security:** RLS policies are applied to all sensitive tables. JWT-based authentication is used for API endpoints. Sensitive credentials are managed via Replit Secrets.
- **Environment:** Replit is used for hosting, with separate development workflows for frontend (Vite on port 5000) and backend (Express on port 3001).

## Recent Changes (November 2025)

### November 23, 2025 - Schema-Driven Architecture & Enhanced AI Guidance
- **Will Schema System (`willSchema.js`):**
  - Created two-tier schema distinguishing template fields (goes IN will PDF) vs contextual information (for legal assessment)
  - Template fields map directly to PDF Articles with exact field names, types, and requirements
  - Contextual categories include non-probate assets, complex estate matters, family complexity, and jurisdiction-specific items
  - AI now understands which questions populate the rigid will template vs which inform flexible legal guidance
- **Enhanced AI Prompts with Schema Integration:**
  - Follow-up questions now receive full schema showing template structure and contextual guidelines
  - AI instructed to use EXACT template field names for will content
  - AI can ask about contextual items (life insurance, retirement accounts, business interests) for comprehensive assessment
  - Maintained strict anti-hallucination rules while allowing common asset questions once in Round 2
  - Round 2 targets 3-5 questions to "clarify and complete" instead of conservative "critical only" approach
- **Jurisdiction-Aware Assessment Generation:**
  - Assessment AI has increased flexibility (300-500 words vs previous 250-350)
  - New section: "Assets Passing Outside the Will" explains non-probate transfers
  - Dedicated section for jurisdiction-specific legal compliance (Alberta common-law, Louisiana forced heirship, etc.)
  - Enhanced estate planning considerations for complex situations (blended families, special needs, foreign assets)
  - Regional terminology awareness (Personal Representative vs Executor)
- **UX Improvements:**
  - Added smooth scroll-to-top when accepting disclaimer and advancing between rounds
  - Common-law partnership duration now appears in Article 1 of Will PDF
  - Ensures all AI-collected data appears in appropriate document sections
- **Architectural Benefits:**
  - Clear separation between rigid PDF structure and flexible AI guidance
  - AI can be comprehensive (ask about life insurance) without being constraining (trying to fit it into template)
  - Easier to maintain and extend - schema is single source of truth
  - Better documentation of data flow from questions → template fields → PDF articles

### November 22, 2025 - UX Enhancement & Data Structure Improvements
- **Tooltip Help System:**
  - Static tooltips for all 15 Round 1 questions explaining legal necessity
  - AI-generated tooltips for Rounds 2-3 questions with contextual explanations
  - Info icons (ℹ️) positioned on right side to prevent screen edge cutoff
  - Clean dark bubble styling with proper positioning
- **Help Button Placeholder:**
  - Green "HELP" button in top-right corner of questionnaire header
  - Visual placeholder for future chatbot functionality
  - Responsive design (moves below title on mobile)
- **Bug Fixes:**
  - Added missing `date` input type for date of birth questions
  - Fixed AI asking for user's name and DOB by passing user profile context to follow-up questions
  - User profile data (full_name, date_of_birth) added to AI's "INFORMATION ALREADY PROVIDED" section
- **Multi-Field Person Input System:**
  - Created new `person` question type with configurable fields (name, relationship, age, address)
  - Separated person information into labeled, validated fields instead of single text boxes
  - Applied to: Spouse Details, Guardian, Primary Executor, Alternate Executor
  - Structured data stored as JSON objects in existing `qa_data` field (no schema migration needed)
  - Created `formatPersonAnswer()` helper for AI and PDF data formatting
  - Enhanced CSS with `.person-fields` and `.person-field` classes
  - Benefits: Better UX, improved data quality, enhanced AI understanding, easier PDF generation

### November 20, 2025 - Authentication & Age Verification
- Fixed NotificationContext API URL configuration (changed from localhost:3001 to relative `/api` path for proper Replit proxy routing)
- Added success notification creation for email sharing endpoint
- Implemented automated retry mechanism for empty/invalid Gemini AI responses using `EmptyGeminiResponseError` with exponential backoff
- Enhanced DELETE endpoint with PDF safeguards preventing deletion of wills with generated PDFs
- Implemented delete functionality in Dashboard UI with confirmation dialog for draft/in_progress wills
- Significantly improved AI prompts to prevent redundant questions:
  - Added structured tracking of previously asked questions
  - Explicit anti-repeat rules with "Already Captured" vs "Missing" sections
  - Entity-specific language for organizations (registered name vs full legal name)
  - Better information gap detection
- Created missing `003_create_notifications_table.sql` migration for Supabase
- Added boolean (Yes/No) question type support in questionnaire UI
- Increased authentication timeout from 10s to 30s to accommodate browser tab throttling
- Improved error messages: "You have been away too long..." instead of generic connection errors
- Added `refreshProfile` function to AuthContext for proper DOB save handling

## External Dependencies
- **Database:** Supabase (PostgreSQL)
- **AI Provider:** Google Gemini API (`gemini-2.5-flash` model)
- **Email Service:** SendGrid
- **Hosting:** Replit
- **Version Control:** GitHub
- **PDF Generation Library:** PDFKit