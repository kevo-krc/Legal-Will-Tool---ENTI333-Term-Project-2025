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
- **Authentication:** Supabase provides user authentication, session management, and protected routes.
- **Backend API:** An Express.js server handles API requests with CORS enabled.
- **AI Integration:** Google Gemini API (`gemini-2.5-flash` model) generates compliance statements, dynamic multi-round questionnaires, and final will assessments. A `RateLimiter` class manages API requests to adhere to rate limits. Includes automated retry mechanism with exponential backoff (up to 3 attempts) for empty/invalid AI responses.
- **Database Interaction:** Frontend communicates directly with Supabase, using Row Level Security (RLS) for data access control.
- **Questionnaire Design:** A hybrid architecture combines static initial questions (Round 1) with AI-constrained follow-up questions (Rounds 2-3) to gather information for will creation. AI prompts include anti-repetition mechanisms to prevent redundant questions across rounds.
- **PDF Generation:** Backend uses PDFKit to generate formatted legal will documents and assessment reports, which are then uploaded to Supabase Storage.
- **Email Sharing:** Integration with SendGrid allows users to securely share generated PDFs via email, with rate limiting and security controls. Creates both immediate success/failure notifications and persistent database notifications.
- **User Data Deletion:** A secure mechanism allows users to completely delete their data, including profiles, wills, PDFs, and Supabase Auth accounts, with JWT-based authentication and authorization. Includes safeguards preventing deletion of wills with generated PDFs.
- **Notifications System:** A robust system with a `notifications` table (with RLS) tracks various events like email successes/failures or PDF generation issues, allowing users to retry actions. Includes atomic retry increment function.

### Feature Specifications
- User authentication with secure registration and login.
- Legal compliance checks based on user-selected jurisdiction.
- AI-guided dynamic questionnaire generation for gathering comprehensive will information.
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

## External Dependencies
- **Database:** Supabase (PostgreSQL)
- **AI Provider:** Google Gemini API (`gemini-2.5-flash` model)
- **Email Service:** SendGrid
- **Hosting:** Replit
- **Version Control:** GitHub
- **PDF Generation Library:** PDFKit