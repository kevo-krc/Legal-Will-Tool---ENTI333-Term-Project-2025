# Legal Will Generation Tool

## Overview
This project is an academic, full-stack web application demonstrating AI-assisted legal document creation. Its purpose is to provide a free, accessible tool for generating legally valid wills for Canada and the USA, focusing on single-jurisdiction wills and ensuring region-specific compliance. The application aims to provide a reliable legal tool with AI guidance for document creation.

## User Preferences
- Use Vite (not Create React App)
- Brand Kit files must stay together in public/
- Backend uses 0.0.0.0 for Replit compatibility
- Province/State-level jurisdiction specificity

## System Architecture
The application is a full-stack React (Vite) and Node.js (Express) project.

### UI/UX Decisions
The frontend is built with React 18 and Vite, utilizing a Brand Kit for consistent global styling and responsive design. Key UI components include `Header`, `Footer`, `Home`, `Login`, `Register`, `Dashboard`, `PrivacyPolicy`, and `ProtectedRoute`. A tooltip system provides contextual help, with static tooltips for initial questions and AI-generated ones for dynamic follow-ups. A "Help" button placeholder is included for future chatbot integration.

### Technical Implementations
- **Authentication:** Supabase handles user authentication, session management, and protected routes with a 30-second timeout and improved error messaging.
- **Backend API:** An Express.js server handles API requests with CORS enabled.
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`) generates compliance statements, dynamic multi-round questionnaires, and final will assessments. A `RateLimiter` with exponential backoff manages API requests, and user profile context is passed to prevent redundant questions. AI prompts include anti-repetition mechanisms.
- **Database Interaction:** The frontend communicates directly with Supabase, using Row Level Security (RLS).
- **Questionnaire Design:** Combines static initial questions with AI-constrained follow-up questions. A multi-field person input system collects structured data (name, relationship, age, address) stored as JSON objects.
- **PDF Generation:** The backend uses PDFKit to generate formatted legal will documents and assessment reports, which are then uploaded to Supabase Storage. PDF filenames are human-readable (e.g., `Will_UserName_MM_DD_YYYY.pdf`).
- **Email Sharing:** SendGrid integration allows secure sharing of generated PDFs via email, with rate limiting and notifications.
- **User Data Deletion:** A secure mechanism allows users to delete their data, including profiles, wills, PDFs, and Supabase Auth accounts, with JWT-based authentication and safeguards preventing deletion of wills with generated PDFs.
- **Notifications System:** A robust system with a `notifications` table (with RLS) tracks various events, allowing users to retry actions.

### Feature Specifications
- User authentication with secure registration and login.
- Legal compliance checks based on user-selected jurisdiction.
- AI-guided dynamic questionnaire generation.
- Contextual tooltip help system (static and AI-generated).
- Multi-field person input system for structured data collection.
- Placeholder for a future AI chatbot feature.
- Generation of a final assessment document summarizing legal compliance.
- User dashboard for managing wills, including status tracking.
- Generation of legally structured will documents and detailed assessment reports in PDF format.
- Secure email sharing of generated PDF documents.
- Comprehensive user data deletion capabilities.
- Real-time notification and alert system.

### System Design Choices
- **Frontend Routing:** React Router is used for client-side navigation.
- **Database Schema:** Supabase PostgreSQL stores user profiles (`profiles`), will documents (`wills`), and notifications (`notifications`), with database migrations stored in `server/migrations/` and `database/migrations/`. A two-tier `willSchema.js` distinguishes template fields from contextual information, guiding AI and PDF generation.
- **Security:** RLS policies are applied to sensitive tables. JWT-based authentication is used for API endpoints. Sensitive credentials are managed via Replit Secrets.
- **Environment:** Replit is used for hosting, with separate development workflows for frontend (Vite on port 5000) and backend (Express on port 3001).

## External Dependencies
- **Database:** Supabase (PostgreSQL)
- **AI Provider:** Google Gemini API (`gemini-2.5-flash` model)
- **Email Service:** SendGrid
- **Hosting:** Replit
- **Version Control:** GitHub
- **PDF Generation Library:** PDFKit