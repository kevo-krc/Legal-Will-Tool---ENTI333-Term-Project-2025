# Legal Will Generation Tool

**Academic Project for University of Calgary (ENTI333)**  
**Author:** Kevin Cooney

---

## 📌 Overview

This is a full-stack web application that helps users create legally valid wills for Canada (all 13 provinces/territories) and the USA (all 50 states). The tool uses **AI-guided questionnaires** to gather information and generate region-specific legal compliance assessments.

### Current Status: Phase 3 Complete ✅
- ✅ User authentication and profile management
- ✅ AI-powered questionnaire system (up to 3 rounds)
- ✅ Jurisdiction-specific compliance checks
- ✅ Q&A data storage with full audit trail
- 🔜 PDF generation and document delivery (Phase 4)

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
| **Email** | SendGrid (planned for Phase 5) |
| **Hosting** | Replit |
| **Version Control** | GitHub |

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
│   │   └── wills.js          # Will management
│   ├── lib/                  # Backend utilities
│   │   └── gemini.js         # Gemini AI integration
│   └── migrations/           # Database migrations
│       ├── 001_create_profiles_table.sql
│       └── 002_create_wills_table.sql
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
   SENDGRID_API_KEY=your_sendgrid_api_key (optional, for Phase 5)
   SENDGRID_FROM_EMAIL=your_verified_sender_email (optional, for Phase 5)
   ```

4. **Run database migrations:**
   
   Execute the SQL files in `server/migrations/` in your Supabase SQL Editor:
   - `001_create_profiles_table.sql`
   - `002_create_wills_table.sql`

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

## ✅ Current Features (Phases 1-3)

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
- ✅ AI-generated legal compliance statements
- ✅ Dynamic multi-round questionnaires (max 3 rounds)
- ✅ AI follows up based on previous answers
- ✅ Final legal assessment generation
- ✅ Q&A data storage in Supabase (JSONB format)
- ✅ Rate limiting (10 requests/minute) with queue serialization
- ✅ Comprehensive quota error handling (RPM vs RPD errors)
- ✅ User-friendly error messages for API limits

---

## 🔮 Upcoming Features (Phases 4-5)

### Phase 4: PDF Generation (Next)
- 🔜 Generate will documents as non-editable PDFs (using pdfkit)
- 🔜 Generate assessment documents as PDFs
- 🔜 Upload PDFs to Supabase Storage (`will-documents` bucket)
- 🔜 Download functionality for user documents
- 🔜 Email delivery integration (SendGrid)

### Phase 5: Data Management & Deployment
- 🔜 User data deletion (dual-kill: storage + database)
- 🔜 Email notifications for will updates
- 🔜 Audit logging for all data operations
- 🔜 Deployment configuration and publishing
- 🔜 Production-ready error handling

---

## 🌐 API Endpoints

### Authentication (via Supabase direct)
- Frontend communicates directly with Supabase using RLS policies
- No backend proxy for auth operations

### AI Routes (`/api/ai/`)
- **POST** `/api/ai/compliance` - Generate jurisdiction-specific compliance statement
  - Body: `{ country, jurisdiction, jurisdictionFullName }`
  - Response: `{ complianceStatement }`
- **POST** `/api/ai/questions/initial` - Generate Round 1 questions (5-7 questions)
  - Body: `{ jurisdiction, jurisdictionFullName }`
  - Response: `{ questions: [...] }`
- **POST** `/api/ai/questions/followup` - Generate follow-up questions (3-5 questions)
  - Body: `{ jurisdiction, jurisdictionFullName, previousQA }`
  - Response: `{ questions: [...] }`
- **POST** `/api/ai/assessment` - Generate final legal assessment
  - Body: `{ jurisdiction, jurisdictionFullName, allQA }`
  - Response: `{ assessment }`

### Will Management (`/api/wills/`)
- **POST** `/api/wills` - Create new will
- **GET** `/api/wills/user/:userId` - Get all user's wills
- **GET** `/api/wills/:willId` - Get specific will
- **PUT** `/api/wills/:willId` - Update will data
- **DELETE** `/api/wills/:willId` - Delete will

### Health Check
- **GET** `/api/health` - Server health status
- **GET** `/api/config/check` - Verify environment configuration

---

## 🔒 Privacy & Security

### Data Storage
- **User Profiles:** Full name, email, phone, account number
- **Q&A Data:** All questions and answers from questionnaires (JSONB format)
- **Will Metadata:** Country, jurisdiction, compliance statements, assessment content
- **Will Documents:** *Phase 4 - PDFs stored in Supabase Storage*

### Security Measures
- ✅ HTTPS encryption via Replit/Supabase
- ✅ Row-Level Security (RLS) policies - users can only access their own data
- ✅ Service Role Key used only for admin deletion operations
- ✅ No plaintext passwords (Supabase handles auth)
- ✅ 10-second timeouts prevent indefinite hanging requests
- ✅ Environment variables for all sensitive credentials

### Privacy Compliance
- Users can view and edit their profile data
- *Phase 5:* Users will be able to delete all their data
- Privacy Policy available at `/privacy-policy`
- See `Privacy_Policy.md` for complete details

---

## ⚙️ Configuration

### Rate Limiting
- **Gemini API:** 10 requests per minute (free tier)
- **Implementation:** Promise chain queue with 6-second minimum spacing
- **Error Handling:** Specific messages for RPM vs RPD quota errors

### Timeouts
- **All Supabase Operations:** 10-second timeout
- **Implementation:** `withTimeout` helper wraps all async Supabase calls
- **Error Recovery:** User-friendly error UI with Retry and Go to Login buttons

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
5. ✅ Answer Round 1 questions (5-7 questions)
6. ✅ Answer Round 2 questions (follow-up based on Round 1)
7. ✅ Complete Round 3 (if needed)
8. ✅ View final assessment
9. ✅ Check Dashboard shows will with status

### Known Limitations (Current Phase)
- Will documents are stored as text only (PDF generation in Phase 4)
- No email delivery yet (Phase 5)
- No data deletion feature yet (Phase 5)
- Rate limited to 10 Gemini API requests/minute

---

## ⚠️ Error Handling

### Authentication Errors
- **Connection Timeout:** Shows error UI with Retry button after 10 seconds
- **Invalid Credentials:** Clear error message on login form
- **Profile Load Failure:** Graceful degradation, user can retry

### AI Quota Errors
- **RPM Error (Rate Limit):** "Too many requests per minute (max 10/min). Please wait and try again."
- **RPD Error (Daily Quota):** "Daily quota exceeded (250 requests/day). Resets at midnight Pacific Time."
- **Network Errors:** Retry with exponential backoff

### Database Errors
- **RLS Policy Violations:** Returns 403, user shown clear error
- **Connection Failures:** 10-second timeout with retry option

---

## 📚 Additional Documentation

- **[PRD.md](./PRD.md)** - Complete Product Requirements Document
- **[Privacy_Policy.md](./Privacy_Policy.md)** - Privacy policy and data handling
- **[PROMPT_LOG.md](./PROMPT_LOG.md)** - Development log and prompts
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Comprehensive testing guide
- **[replit.md](./replit.md)** - Project architecture and technical details

---

## 🙌 Acknowledgements

- **University of Calgary** - ENTI333 Term Project
- **Professor Mohammad Keyhani** - Course instructor
- **Technologies:**
  - React + Vite
  - Node.js + Express
  - Supabase (Database & Auth)
  - Google Gemini AI
  - Replit (Hosting)
  - GitHub Copilot (Development assistance)

---

## 📄 License

This project is for **academic purposes only** and is **not intended to provide legal advice**. Users should consult with a licensed attorney for legal matters.

**License:** Academic Use Only  
See `LICENSE.txt` for details.

---

## 👨‍💻 Author

**Kevin Cooney**  
University of Calgary  
ENTI333 - Final Term Project  
2025

---

## 🔗 Links

- **GitHub Repository:** [Your Repo URL]
- **Replit Project:** [Your Replit URL]
- **Demo Video:** [To be added after Phase 5]

---

**Last Updated:** November 13, 2025 (Phase 3 Complete)
