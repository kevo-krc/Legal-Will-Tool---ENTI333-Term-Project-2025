# Legal Will Generation Tool - Replit Project

## Overview
This is a documentation and planning repository for a Legal Will Generation Tool. The project is an academic initiative designed to help users create legally valid wills for Canada and the USA using AI-assisted guidance.

**Current Status:** Documentation phase - Application code to be implemented

## Project Information
- **Author:** Kevin Cooney
- **Institution:** University of Calgary
- **Purpose:** Academic term project (ENTI333)
- **Type:** Free, accessible legal will generation tool

## Planned Tech Stack
- **Frontend:** React
- **Backend:** Node.js
- **Database:** Supabase
- **Hosting:** Replit
- **Version Control:** GitHub

## Current Setup
The repository currently contains:
- Project documentation (PRD, Privacy Policy, README)
- Brand Kit (visual identity and UI guidelines)
- Planning documents and requirements

A basic Node.js static server is configured to display the Brand Kit HTML page on port 5000.

## Architecture (Planned)

### Frontend
- React-based web application
- Responsive design for web platforms
- AI-guided questionnaire interface
- User dashboard for document management
- PDF document viewing and download

### Backend
- Node.js server
- PDF generation utilities
- AI integration for questionnaire generation and legal compliance checks
- Email delivery system for document sharing
- RESTful API endpoints

### Database
- Supabase (PostgreSQL)
- Secure storage with encryption at rest
- Row Level Security (RLS) policies
- Storage for:
  - User profiles and authentication
  - Q&A data from questionnaires
  - AI-generated legal assessments
  - Consent and disclaimer acknowledgments
  - Generated will documents (with user consent)
  - Audit logs

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
- Canada
- USA

## Recent Changes
- **2025-11-12:** Initial Replit setup with static server for Brand Kit display
- **2025-11-12:** Configured Node.js 20 environment
- **2025-11-12:** Set up workflow to serve content on port 5000

## Development Workflow
Currently configured workflow:
- **Name:** server
- **Command:** `node server.js`
- **Port:** 5000
- **Type:** Static file server (displays Brand Kit)

## User Preferences
None documented yet (this is a fresh import)

## Important Notes
- This is an academic project and does not provide legal advice
- All user data handling will comply with Canadian and US privacy laws
- Cross-border estate planning is out of scope
- The tool is designed for single-jurisdiction wills only

## Next Steps
When ready to implement the application:
1. Set up React project structure
2. Configure Supabase database and authentication
3. Implement user registration and login
4. Build questionnaire flow with AI integration
5. Implement PDF generation
6. Create user dashboard
7. Set up email delivery system
8. Implement data privacy and deletion features
9. Configure deployment settings

## Privacy & Security Considerations
- Environment variable required: `PRIVACY_POLICY_URL`
- All sensitive data must be encrypted
- RLS policies for data access control
- User consent tracking and storage
- Audit logging for all data operations
- Secure PDF generation and delivery
