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
- **Round 1:** 8 static curated questions (no AI generation for speed/consistency)
  * Marital status, children, executor (name & relationship), alternate executor, primary beneficiary, specific gifts, major assets
  * Semantic IDs (marital_status, executor_name, etc.) for data organization
  * Mix of required (5) and optional (3) fields
- **Rounds 2-3:** Constrained AI follow-ups for missing/ambiguous data only
- **Assessment:** Enumerates key decisions, assesses completeness, identifies critical gaps
- All prompts emphasize brevity and minimum legal requirements only
```