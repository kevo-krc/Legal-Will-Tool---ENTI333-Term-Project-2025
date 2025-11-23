# System Architecture Diagram

**Legal Will Generation Tool** - Full-Stack Web Application  
**Last Updated:** November 23, 2025

---

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer (Port 5000)"
        A[React 18 + Vite<br/>SPA Frontend]
        A1[React Router<br/>Client Navigation]
        A2[React Context API<br/>Auth State]
        A3[Axios<br/>HTTP Client]
        A4[Supabase Client<br/>Direct DB Access]
    end

    subgraph "Server Layer (Port 3001)"
        B[Node.js + Express<br/>Backend API]
        B1[CORS Middleware]
        B2[PDF Generator<br/>PDFKit]
        B3[Email Service<br/>SendGrid]
        B4[AI Service<br/>Google Gemini]
        B5[Rate Limiter<br/>Exponential Backoff]
    end

    subgraph "Data Layer"
        C[Supabase PostgreSQL<br/>Database]
        C1[Profiles Table<br/>RLS Enabled]
        C2[Wills Table<br/>RLS Enabled]
        C3[Notifications Table<br/>RLS Enabled]
        D[Supabase Storage<br/>Private Buckets]
        D1[PDF Files<br/>Signed URLs]
        E[Supabase Auth<br/>JWT Tokens]
    end

    subgraph "External Services"
        F[Google Gemini API<br/>gemini-2.5-flash]
        G[SendGrid API<br/>Email Delivery]
        H[Replit Platform<br/>Hosting & Workflows]
    end

    A -->|HTTP Requests| B
    A4 -->|Direct Queries| C
    A4 -->|Auth State| E
    B --> B1
    B --> B2
    B --> B3
    B --> B4
    B4 --> B5
    B2 -->|Upload PDFs| D
    B3 -->|Send Emails| G
    B4 -->|AI Prompts| F
    C --> C1
    C --> C2
    C --> C3
    D --> D1
    H -->|Runs| A
    H -->|Runs| B

    style A fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style B fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style C fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style D fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style E fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style F fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    style G fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    style H fill:#607D8B,stroke:#37474F,stroke-width:2px,color:#fff
```

---

## Component Interaction Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User Browser
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant AI as Google Gemini
    participant DB as Supabase DB
    participant S as Supabase Storage
    participant E as SendGrid Email

    Note over U,F: Authentication Flow
    U->>F: Register/Login
    F->>DB: Create/Verify User (Supabase Auth)
    DB-->>F: JWT Token
    F->>F: Store Token in Context
    F-->>U: Redirect to Dashboard

    Note over U,E: Will Creation Flow
    U->>F: Start Will Creation
    F->>DB: Fetch User Profile
    DB-->>F: Profile Data
    F->>B: Request Compliance Statement
    B->>AI: Generate Compliance (Gemini API)
    AI-->>B: Compliance Statement
    B-->>F: Compliance Statement
    F-->>U: Display Disclaimer

    U->>F: Accept Disclaimer
    F->>DB: Save Consent
    F-->>U: Display Round 1 Questions

    U->>F: Submit Round 1 Answers
    F->>DB: Save Q&A Data
    F->>B: Request Round 2 Questions
    B->>AI: Generate Questions (Schema-aware)
    AI-->>B: Follow-up Questions
    B-->>F: Round 2 Questions
    F-->>U: Display Round 2 Questions

    U->>F: Submit Round 2 Answers
    F->>DB: Update Q&A Data
    F->>B: Request Round 3 Questions
    B->>AI: Generate Final Questions
    AI-->>B: Round 3 Questions (or "None needed")
    B-->>F: Round 3 Questions
    F-->>U: Display Summary

    Note over U,E: PDF Generation Flow
    U->>F: Finalize Will
    F->>B: Generate PDFs
    B->>AI: Generate Assessment Text
    AI-->>B: Assessment Content
    B->>B: Create Will PDF (PDFKit)
    B->>B: Create Assessment PDF (PDFKit)
    B->>S: Upload Will.pdf
    S-->>B: Will PDF URL
    B->>S: Upload Assessment.pdf
    S-->>B: Assessment PDF URL
    B->>DB: Update Will Status (pdf_generated=true)
    B-->>F: Generation Success
    F-->>U: Display "View Will" and "Share via Email"

    Note over U,E: Email Sharing Flow
    U->>F: Share via Email
    F->>B: Request Email Send
    B->>S: Get Signed URLs (Will + Assessment)
    S-->>B: Temporary URLs
    B->>E: Send Email with PDFs
    E-->>B: Email Sent Confirmation
    B->>DB: Create Notification
    B-->>F: Success Message
    F-->>U: "Email sent successfully!"

    Note over U,E: Data Deletion Flow
    U->>F: Delete Account
    F->>B: Request Account Deletion
    B->>S: Delete All PDF Files
    B->>DB: Delete Wills
    B->>DB: Delete Profile
    B->>DB: Delete Auth Account
    B->>E: Send Confirmation Email
    B-->>F: Deletion Complete
    F-->>U: Redirect to Homepage
```

---

## Database Schema

```mermaid
erDiagram
    PROFILES {
        varchar id PK "UUID from Supabase Auth"
        text account_number UK "WL{timestamp}{random}"
        text full_name
        text email UK
        text phone
        timestamp created_at
        timestamp updated_at
    }

    WILLS {
        serial id PK
        varchar user_id FK "References profiles.id"
        text jurisdiction "Province/State"
        jsonb qa_data "All Q&A responses"
        text status "In Progress | Finalized | PDF Generated"
        text pdf_url "Supabase Storage URL"
        text assessment_pdf_url "Supabase Storage URL"
        boolean pdf_generated
        boolean consent_given
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATIONS {
        serial id PK
        varchar user_id FK "References profiles.id"
        text type "Email_Sent | Will_Created | etc."
        text message
        jsonb metadata
        text status "Pending | Success | Failed"
        timestamp created_at
    }

    PROFILES ||--o{ WILLS : "has many"
    PROFILES ||--o{ NOTIFICATIONS : "receives"
```

---

## Data Flow: Schema-Driven Architecture

```mermaid
graph LR
    subgraph "User Input"
        A[Round 1 Answers]
        B[Round 2 Answers]
        C[Round 3 Answers]
    end

    subgraph "Schema System"
        D[willSchema.js]
        D1[Type 1: Template Fields<br/>executor_details, beneficiary_distribution, etc.]
        D2[Type 2: Contextual Info<br/>life_insurance, business_interests, etc.]
    end

    subgraph "AI Processing"
        E[Google Gemini API]
        E1[Schema-Aware Prompts]
        E2[Template Field Questions]
        E3[Contextual Questions]
    end

    subgraph "PDF Generation"
        F[Will PDF<br/>9 Articles]
        F1[Article 1: Testator Info]
        F2[Article 2: Executor]
        F3[Article 3: Guardianship]
        F4[Article 4: Residuary Estate]
        F5[etc...]
        G[Assessment PDF<br/>Legal Guidance]
        G1[Legal Strengths]
        G2[Areas for Attention]
        G3[Non-Probate Assets]
        G4[Jurisdiction Compliance]
    end

    A --> D
    B --> D
    C --> D
    D --> D1
    D --> D2
    D1 --> E1
    D2 --> E1
    E1 --> E
    E --> E2
    E --> E3
    E2 --> F
    E3 --> G
    D1 --> F
    F --> F1
    F --> F2
    F --> F3
    F --> F4
    F --> F5
    D2 --> G
    G --> G1
    G --> G2
    G --> G3
    G --> G4

    style D fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style E fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    style F fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style G fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | Component-based UI |
| | Vite | Build tool and dev server |
| | React Router | Client-side routing |
| | Axios | HTTP client for API requests |
| | React Context API | Global auth state management |
| **Backend** | Node.js 20 | JavaScript runtime |
| | Express.js | Web framework |
| | PDFKit | PDF document generation |
| | CORS | Cross-origin resource sharing |
| **Database** | Supabase PostgreSQL | Relational database |
| | Row Level Security (RLS) | Data access control |
| | Supabase Auth | JWT-based authentication |
| | Supabase Storage | Private file storage |
| **AI/ML** | Google Gemini API | AI question generation |
| | gemini-2.5-flash model | Fast, cost-effective model |
| | Rate Limiter | Exponential backoff |
| **Email** | SendGrid | Transactional email service |
| **Hosting** | Replit | Cloud platform |
| | Dual Workflows | Frontend (5000) + Backend (3001) |
| **Version Control** | Git + GitHub | Source control |

---

## Security Architecture

```mermaid
graph TB
    subgraph "Authentication"
        A1[Supabase Auth<br/>JWT Tokens]
        A2[Session Management<br/>10-second timeout]
        A3[Password Hashing<br/>bcrypt via Supabase]
    end

    subgraph "Authorization"
        B1[Row Level Security<br/>RLS Policies]
        B2[User ID Verification<br/>Server-side checks]
        B3[JWT Validation<br/>Protected routes]
    end

    subgraph "Data Protection"
        C1[Encryption at Rest<br/>Supabase encryption]
        C2[HTTPS/SSL<br/>TLS 1.2+]
        C3[Input Validation<br/>Sanitization]
    end

    subgraph "Access Control"
        D1[Private Storage<br/>Signed URLs]
        D2[1-hour URL Expiration<br/>Time-limited access]
        D3[Rate Limiting<br/>5 emails/hour]
    end

    A1 --> B3
    A2 --> B3
    A3 --> A1
    B1 --> B2
    B2 --> B3
    C1 --> C2
    C2 --> C3
    D1 --> D2
    D2 --> D3

    style A1 fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style B1 fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style C1 fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style D1 fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
```

---

## File Structure

```
Legal-Will-Generation-Tool/
├── public/                    # Static assets
│   ├── Brand_Kit.html        # Global styling reference
│   └── favicon.svg
├── src/                       # Frontend source
│   ├── components/           # React components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/                # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Questionnaire.jsx
│   │   ├── WillSummary.jsx
│   │   └── PrivacyPolicy.jsx
│   ├── context/              # React Context
│   │   └── AuthContext.jsx
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── server/                    # Backend source
│   ├── index.js              # Express server
│   ├── lib/                  # Core libraries
│   │   ├── gemini.js         # AI integration
│   │   ├── pdfGenerator.js   # PDF creation
│   │   ├── willSchema.js     # Schema definitions
│   │   └── supabase.js       # Supabase client
│   └── migrations/           # Database migrations
│       └── 001_create_profiles_table.sql
├── database/                  # Database documentation
│   └── migrations/
├── Old PRDs/                  # Historical documents
├── ARCHITECTURE.md            # This file
├── PRD_final.md              # Final PRD
├── PROMPT_LOG.md             # Development log
├── README.md                 # Project overview
├── TESTING_GUIDE.md          # Testing instructions
├── Privacy_Policy.md         # Privacy notice
├── package.json              # Frontend dependencies
└── server/package.json       # Backend dependencies
```

---

## Deployment Configuration

### Replit Workflows

**Frontend Workflow:**
```bash
Command: npm run dev
Port: 5000 (exposed to internet)
Output: webview
Description: Vite dev server with HMR
```

**Backend Workflow:**
```bash
Command: cd server && node index.js
Port: 3001 (internal)
Output: console
Description: Express API server
```

### Environment Variables

**Shared Environment (Development & Production):**
- `VITE_SUPABASE_URL` → Frontend Supabase connection
- `VITE_SUPABASE_ANON_KEY` → Frontend public API key

**Secrets (Encrypted):**
- `SUPABASE_SERVICE_ROLE_KEY` → Backend admin operations
- `GOOGLE_GENERATIVE_AI_API_KEY` → Gemini API access
- `SENDGRID_API_KEY` → Email delivery

---

## Key Architectural Decisions

### 1. Schema-Driven AI System
**Decision:** Separate template fields from contextual information  
**Rationale:** AI needed guidance on what goes IN the will vs what informs the assessment  
**Impact:** Single source of truth for data flow, easier maintenance, clearer AI alignment

### 2. Dual Database Access Pattern
**Decision:** Frontend uses Supabase Client directly, Backend uses Admin SDK  
**Rationale:** Leverage RLS for security, admin SDK for privileged operations (file upload, auth deletion)  
**Impact:** Reduced backend API surface area, better security model

### 3. Email-Only PDF Delivery
**Decision:** No direct download buttons, email sharing only  
**Rationale:** Security (audit trail), simplicity (no client-side file handling)  
**Impact:** Rate limiting required, better tracking of document distribution

### 4. Three-Round Questionnaire Limit
**Decision:** Maximum 3 rounds of AI questions  
**Rationale:** Prevent infinite loops, balance completeness with user experience  
**Impact:** AI must be efficient, users complete process in reasonable time

### 5. Notification Backend Without UI
**Decision:** Build notifications table and backend but disable UI  
**Rationale:** Future-proofing, time constraints prioritized core features  
**Impact:** System scalable for future notification panel

---

## Performance Considerations

### Frontend Optimization
- Vite's fast HMR for development
- React.lazy() for code splitting (if needed in future)
- Axios interceptors for centralized error handling
- Context API for minimal re-renders

### Backend Optimization
- Rate limiting with exponential backoff (Google Gemini)
- Timeout handling (10 seconds for auth token retrieval)
- CORS pre-flight caching
- PDF generation on-demand (not pre-generated)

### Database Optimization
- Indexes on frequently queried columns (user_id, account_number)
- RLS policies with efficient WHERE clauses
- JSONB for flexible Q&A storage
- Auto-update triggers for timestamps

---

## Scalability Path (Future)

### Horizontal Scaling
- Stateless backend allows multiple instances
- Supabase handles database scaling
- SendGrid handles email throughput
- Replit autoscaling for traffic spikes

### Feature Expansion
- Mobile apps (React Native) using same backend API
- Notification UI activation (backend ready)
- AI chatbot integration (infrastructure exists)
- Global jurisdictions (schema extensible)
- Document versioning (database schema supports)

---

**Last Updated:** November 23, 2025  
**Status:** Production architecture documented and deployed
