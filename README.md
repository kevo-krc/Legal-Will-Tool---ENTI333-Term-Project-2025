# Legal Will Generation Tool

## 📌 Overview
A full-stack web application for creating legally valid wills for Canada and the USA using AI-assisted guidance. This tool provides a free, accessible platform for legal will generation with AI-powered questionnaires, PDF document generation, and secure storage.

**Academic Project**: University of Calgary - ENTI333 Term Project  
**Author**: Kevin Cooney  
**Status**: Phase 5 Complete - Production Ready

---

## 🎯 Goals
- **Accessibility**: Provide a free tool for legal will generation
- **AI-Powered**: Demonstrate AI-assisted legal document creation
- **Security**: Ensure secure data handling and privacy compliance
- **Educational**: Academic demonstration of modern web development

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - REST API server
- **Supabase** - PostgreSQL database with RLS
- **Google Gemini AI** - Question generation and compliance checks
- **SendGrid** - Email delivery service
- **PDFKit** - PDF document generation

### Infrastructure
- **Hosting**: Replit (Development & Deployment)
- **Storage**: Supabase Storage (PDF documents)
- **Authentication**: Supabase Auth
- **Version Control**: GitHub

---

## ✨ Features

### Phase 1-2: Authentication & User Management
- ✅ Secure user registration and login (Supabase Auth)
- ✅ Auto-generated account numbers
- ✅ Protected routes for authenticated pages
- ✅ Profile management with edit capabilities
- ✅ Row Level Security (RLS) policies

### Phase 3: AI-Powered Questionnaire
- ✅ Jurisdiction selection (13 Canadian provinces + 50 US states)
- ✅ AI-generated compliance statements (Gemini API)
- ✅ Dynamic multi-round questionnaire (max 3 rounds)
- ✅ Personalized follow-up questions based on answers
- ✅ Final legal assessment generation
- ✅ Q&A data stored as JSONB in PostgreSQL

### Phase 4: PDF Generation & Storage
- ✅ Professional PDF generation with branding
- ✅ Automatic PDF creation on questionnaire completion
- ✅ Secure storage in Supabase Storage
- ✅ Download functionality with proper formatting
- ✅ Storage path tracking in database

### Phase 5: Data Management & Deployment
- ✅ **Dual-kill deletion**: Database + storage cleanup
- ✅ **Email delivery**: SendGrid integration with PDF attachments
- ✅ **Deployment configuration**: Replit autoscale deployment
- ✅ **Comprehensive testing**: Full test suite documentation

---

## 📂 Project Structure

```
legal-will-generation-tool/
├── public/                      # Static assets
│   ├── Brand_Kit.html
│   ├── brand-kit.css
│   └── logo.png
├── src/                         # Frontend source
│   ├── components/
│   │   ├── Header.jsx           # Navigation and user state
│   │   └── Footer.jsx           # Privacy policy link
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Login.jsx            # Authentication
│   │   ├── Register.jsx         # User registration
│   │   ├── Dashboard.jsx        # User profile and wills
│   │   ├── CreateWill.jsx       # Jurisdiction selection
│   │   ├── Questionnaire.jsx    # AI-powered Q&A
│   │   ├── WillSummary.jsx      # PDF download, email, delete
│   │   └── PrivacyPolicy.jsx    # Privacy policy display
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication provider
│   ├── config/
│   │   └── api.js               # API configuration
│   ├── styles/
│   │   └── global.css           # Global styles
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── server/                      # Backend source
│   ├── lib/
│   │   ├── supabase.js          # Supabase client
│   │   └── gemini.js            # Gemini AI integration
│   ├── routes/
│   │   ├── wills.js             # Will CRUD + email + delete
│   │   └── ai.js                # AI endpoints
│   ├── services/
│   │   ├── pdfService.js        # PDF generation
│   │   └── emailService.js      # SendGrid email
│   ├── migrations/              # Database migrations
│   │   ├── 001_create_profiles_table.sql
│   │   ├── 002_create_wills_table.sql
│   │   ├── 003_create_storage_bucket.sql
│   │   └── 004_add_storage_fields_to_wills.sql
│   └── index.js                 # Express server
├── TESTING_GUIDE.md             # Comprehensive test cases
├── PROMPT_LOG.md                # AI prompt documentation
├── replit.md                    # Project documentation
├── package.json                 # Frontend dependencies
└── vite.config.js               # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
1. **Replit Account** (for hosting)
2. **Supabase Account** (for database and storage)
3. **Google AI Studio Account** (for Gemini API key)
4. **SendGrid Account** (for email delivery)

### Setup Instructions

**1. Clone the Repository**
```bash
git clone <repository-url>
cd legal-will-generation-tool
```

**2. Install Dependencies**
```bash
npm install
```

**3. Configure Environment Secrets**
Set these in Replit Secrets (or `.env` for local dev):
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=verified_sender@example.com
```

**4. Run Database Migrations**
In Supabase SQL Editor, run migrations in order:
```sql
-- Run each file in Supabase Dashboard → SQL Editor
1. server/migrations/001_create_profiles_table.sql
2. server/migrations/002_create_wills_table.sql
3. server/migrations/003_create_storage_bucket.sql
4. server/migrations/004_add_storage_fields_to_wills.sql
```

**5. Start Development Servers**
```bash
# Terminal 1: Frontend (port 5000)
npm run dev

# Terminal 2: Backend (port 3001)
npm run server

# Or run both concurrently:
npm start
```

**6. Access the Application**
- **Local**: http://localhost:5000
- **Replit**: Your Replit webview URL

---

## 🧪 Testing

### Manual Testing
See `TESTING_GUIDE.md` for comprehensive test cases covering:
- Authentication flows
- Will creation and questionnaires
- PDF generation and download
- Email delivery
- Dual-kill deletion
- Security and RLS policies

### Quick Test Flow
1. Register new user → Auto-login to Dashboard
2. Create new will → Select jurisdiction (e.g., Canada - Alberta)
3. Complete 3-round questionnaire
4. Download PDF → Verify contents
5. Email will → Check inbox for PDF attachment
6. Delete will → Verify removal from dashboard and storage

---

## 📡 API Endpoints

### Health & Configuration
- `GET /api/health` - Server health check
- `GET /api/config/check` - Verify secrets configuration

### AI Services
- `POST /api/ai/compliance` - Generate compliance statement
- `POST /api/ai/questions/initial` - Generate Round 1 questions
- `POST /api/ai/questions/followup` - Generate follow-up questions
- `POST /api/ai/assessment` - Generate final legal assessment

### Will Management
- `POST /api/wills` - Create new will
- `GET /api/wills/user/:userId` - Get all user's wills
- `GET /api/wills/:willId` - Get specific will
- `PUT /api/wills/:willId` - Update will (triggers PDF generation)
- `GET /api/wills/:willId/download` - Download will PDF
- `POST /api/wills/:willId/email` - Send will via email
- `DELETE /api/wills/:willId` - Dual-kill deletion (storage + database)

---

## 🔐 Security Features

### Authentication
- Supabase Auth with JWT tokens
- Password hashing (handled by Supabase)
- Protected routes with AuthContext

### Row Level Security (RLS)
- Users can only access their own data
- Database-level security policies
- Storage-level access control

### Data Privacy
- GDPR/PIPEDA compliance ready
- User-controlled data deletion
- Secure PDF storage with RLS
- No cross-user data access

### API Security
- CORS enabled for frontend communication
- Input validation on all endpoints
- Error handling without sensitive data exposure

---

## 🌍 Supported Jurisdictions

### Canada (13 Provinces/Territories)
Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Northwest Territories, Nova Scotia, Nunavut, Ontario, Prince Edward Island, Quebec, Saskatchewan, Yukon

### United States (50 States)
All 50 US states supported with state-specific legal compliance

---

## 📄 Database Schema

### `profiles` Table
- `user_id` (UUID) - Supabase auth user ID
- `account_number` (VARCHAR) - Auto-generated (WL{timestamp}{random})
- `full_name` (VARCHAR)
- `email` (VARCHAR)
- `phone` (VARCHAR)
- Timestamps: `created_at`, `updated_at`

### `wills` Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to profiles
- `country` (VARCHAR) - CA or US
- `jurisdiction` (VARCHAR) - Province/state code
- `jurisdiction_full_name` (TEXT)
- `compliance_statement` (TEXT)
- `qa_data` (JSONB) - Array of question/answer rounds
- `questionnaire_round` (INT) - Current round (1-3)
- `questionnaire_completed` (BOOLEAN)
- `assessment_content` (TEXT)
- `storage_base_path` (TEXT) - Supabase storage path
- `pdf_filename` (VARCHAR)
- `status` (VARCHAR) - draft, in_progress, completed, archived
- Timestamps: `created_at`, `updated_at`

### Storage Bucket: `will-documents`
- Path structure: `user_{user_id}/will_{will_id}/draft.pdf`
- RLS policies ensure users only access own documents

---

## 🚢 Deployment

### Replit Deployment (Configured)
The application is configured for Replit autoscale deployment:
- **Build**: `npm run build` (builds frontend)
- **Run**: Backend serves on port 5000
- **Environment**: All secrets must be configured in deployment settings

### Deployment Checklist
1. ✅ All database migrations run in production Supabase
2. ✅ All secrets configured in deployment environment
3. ✅ SendGrid sender email verified
4. ✅ Health endpoint accessible: `/api/health`
5. ✅ Frontend builds without errors: `npm run build`

---

## ⚠️ Important Disclaimers

### Legal Notice
**This application is an educational prototype and does NOT provide legal advice.**

- Generated wills should be reviewed by a qualified legal professional
- The tool is for academic demonstration purposes only
- Users should consult licensed attorneys for legal advice
- This is a University of Calgary term project (ENTI333)

### Data Handling
- User data stored securely in Supabase with encryption
- Users can delete all their data at any time
- Compliance with Canadian and US privacy laws
- No cross-border estate planning (single jurisdiction only)

---

## 🔧 Development

### Run in Development Mode
```bash
# Frontend dev server (with HMR)
npm run dev

# Backend dev server
npm run server
```

### Build for Production
```bash
# Build frontend assets
npm run build

# Preview production build
npm run preview
```

### Environment Variables
All sensitive configuration in Replit Secrets or `.env`:
- Never commit secrets to version control
- Use `.env.example` for reference (not included)
- Verify secrets with: `GET /api/config/check`

---

## 📚 Documentation

- **Testing Guide**: `TESTING_GUIDE.md` - Comprehensive test cases
- **Prompt Log**: `PROMPT_LOG.md` - AI prompt documentation
- **Project Documentation**: `replit.md` - Technical architecture
- **Privacy Policy**: Accessible via `/privacy` route

---

## 🐛 Known Issues

1. **SendGrid Email Delay**: Emails may take 1-5 minutes to arrive
2. **AI Response Variability**: Question generation times vary with API load
3. **Mobile Optimization**: Responsive design, but optimized for desktop

---

## 🔮 Future Enhancements

- Multi-language support (French, Spanish)
- Mobile app version (React Native)
- Advanced will templates
- Lawyer review integration
- Annual update reminders
- Cross-border estate planning

---

## 🙏 Acknowledgments

- **University of Calgary** - ENTI333 Course
- **Professor Mohammad Keyhani** - Project guidance
- **Technologies**: React, Node.js, Supabase, Google Gemini, SendGrid, Replit

---

## 📝 License

This project is for **academic purposes only** and is not intended to provide legal advice.

Copyright © 2025 Kevin Cooney - University of Calgary

---

## 👤 Author

**Kevin Cooney**  
University of Calgary - ENTI333 Term Project  
Academic Year: 2024-2025

---

## 📞 Support

For issues or questions related to this academic project, please refer to:
- `TESTING_GUIDE.md` for testing procedures
- `replit.md` for technical documentation
- Course instructor for project-specific guidance

---

**Version**: 1.0.0 (Phase 5 Complete)  
**Last Updated**: November 13, 2025
