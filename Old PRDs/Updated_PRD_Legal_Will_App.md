## PRD: Legal Will Generation Tool

### 1. Product Overview
#### 1.1 Document Title and Version
- PRD: Legal Will Generation Tool
- Version: 1.1

#### 1.2 Product Summary
This document outlines the product requirements for a legal will generation tool designed to assist users in creating regionally compliant legal wills. The tool will be accessible via both web and Android platforms and will utilize AI to guide users through the process of will creation.

The application will be built using React and hosted on Replit, with mobile development supported by Reach. Supabase will be used for secure data storage. The final product will be shared via GitHub for academic evaluation, under the folder `ENTI333_FinalProject_VSCode_Folder`.

### 2. Goals
#### 2.1 Business Goals
- Provide a free, accessible tool for legal will generation.
- Expand user base across Canada and the USA, with future global reach.
- Establish a foundation for monetization through premium features.

#### 2.2 User Goals
- Easily create a legally compliant will.
- Receive guidance and legal assessment of their will.
- Share the will securely with relevant parties.

#### 2.3 Non-Goals
- Provide legal advice or representation.

### 3. User Personas
#### 3.1 Key User Types
- Individuals planning their estate.
- Legal professionals.
- Family members assisting with will creation.

#### 3.2 Basic Persona Details
- **Estate Planner**: A user who wants to create a will for personal use.
- **Legal Advisor**: A professional reviewing wills for clients.
- **Family Member**: Assisting a relative in creating or reviewing a will.

#### 3.3 Role-Based Access
- **Guest**: Can browse the app and view general information.
- **Registered User**: Can create and share wills, access stored Q&A data.
- **Admin**: Manages app settings, user permissions, and legal compliance updates.

### 4. Functional Requirements
- **User Registration and Login** (High)
  - Secure login with optional 2FA.
  - User profile creation.
- **Legal Compliance Check** (High)
  - Determine region based on home address.
  - Display legal compliance statement.
- **Guided Will Creation** (High)
  - Initial generic questions.
  - Region-specific AI-generated questions.
  - AI validation of responses.
- **Will Generation and Sharing** (High)
  - Generate will document titled `User Legal Name – Legal Will`.
  - Generate 1-page legal assessment document.
  - Allow sharing via email or download.
- **Annual Review** (Medium)
  - Email user annually with AI-generated update questions.
- **Data Storage** (High)
  - Store Q&A responses securely in Supabase.
  - Store personal information (name, address, DOB, email).
  - Store AI-generated legal assessment.
  - Will documents stored only with user consent.

### 5. User Experience
#### 5.1 Entry Points & First-Time User Flow
- Open website or download mobile app.
- Register or log in.
- Begin guided will creation.

#### 5.2 Core Experience
- **Start**: User accesses the app via web or mobile.
- **Profile Setup**: User enters legal name, phone, email, home address.
- **Legal Compliance Check**: Based on address, show legal compliance statement.
- **Questionnaire**: AI generates region-specific questions.
- **Review**: AI checks for completeness and legal gaps.
- **Output**: Generate and share will and legal assessment.

#### 5.3 Advanced Features & Edge Cases
- AI adapts to legal changes annually.
- Handles incomplete or ambiguous answers.
- Supports multiple jurisdictions.

#### 5.4 UI/UX Highlights
- Clean, accessible interface.
- Responsive design for mobile and desktop.
- Progress indicators during questionnaire.

### 6. Narrative
Alex is a Canadian resident who wants to create a legal will to ensure their assets are distributed according to their wishes. They find the will generation tool online and are guided through a personalized questionnaire. The app provides a legal compliance summary and generates a will and assessment document. Alex shares the will with their lawyer and receives annual reminders to update it.

### 7. Success Metrics
#### 7.1 User-Centric Metrics
- Number of wills generated.
- User satisfaction ratings.
- Opt-in conversion rate.

#### 7.2 Business Metrics
- Monthly active users.
- Growth in registered users.
- Revenue from premium features.

#### 7.3 Technical Metrics
- System uptime.
- Response time for AI-generated questions.
- Data breach incidents.

### 8. Technical Considerations
#### 8.1 Integration Points
- Replit for hosting and AI coding.
- Reach for Android app development.
- Supabase for secure data storage.
- GitHub for version control and academic sharing.
- Email service for annual reminders.

#### 8.2 Data Storage & Privacy
- Supabase will store user data with encryption.
- RLS (Row Level Security) policies will be implemented to restrict access to user-specific data.
- Data storage will comply with Canadian PIPEDA, Alberta FOIP, and U.S. CCPA.
- Clear privacy policy and consent management.
- Will documents stored only with explicit user consent.

#### 8.3 Scalability & Performance
- Support for increasing user base.
- Efficient AI processing.
- Responsive UI across devices.

#### 8.4 Potential Challenges
- Ensuring legal compliance across regions.
- Managing sensitive user data securely.
- Handling ambiguous or incomplete user input.

### 9. Milestones & Sequencing
#### 9.1 Project Estimate
- Medium: 4–6 weeks

#### 9.2 Team Size & Composition
- Medium Team: 3–5 people
  - Product Manager
  - 2 React Developers
  - 1 Designer
  - 1 QA Specialist

#### 9.3 Suggested Phases
- **Phase 1**: Core will creation and legal compliance flow (2 weeks)
  - User registration, questionnaire, AI integration.
- **Phase 2**: Output generation and sharing (2 weeks)
  - Will and assessment document creation.
- **Phase 3**: Annual review and email system (2 weeks)
  - AI-powered updates and notifications.

### 10. User Stories
#### 10.1 Register and Log In
**ID**: US-001
**Description**: As a user, I want to register and log in securely so that I can access my data.
**Acceptance Criteria**:
- User can register with email and password.
- User can log in and log out.
- 2FA is available as an option.

#### 10.2 View Legal Compliance Statement
**ID**: US-002
**Description**: As a user, I want to see a legal compliance statement based on my address so I can decide whether to proceed.
**Acceptance Criteria**:
- User enters home address.
- App displays region-specific legal compliance info.
- User can opt in or out.

#### 10.3 Complete Guided Questionnaire
**ID**: US-003
**Description**: As a user, I want to answer guided questions to generate my will.
**Acceptance Criteria**:
- Initial generic questions are shown.
- Region-specific questions are generated by AI.
- AI validates responses and suggests additional questions.

#### 10.4 Generate and Share Will
**ID**: US-004
**Description**: As a user, I want to generate and share my will securely.
**Acceptance Criteria**:
- Will is generated with user’s legal name.
- Assessment document is created.
- User can download or email documents.

#### 10.5 Annual Review
**ID**: US-005
**Description**: As a user, I want to receive annual reminders to update my will.
**Acceptance Criteria**:
- App sends email annually.
- AI generates update questions based on legal changes and previous answers.

#### 10.6 Secure Data Handling
**ID**: US-006
**Description**: As a user, I want my data to be stored securely and privately.
**Acceptance Criteria**:
- Q&A data is encrypted and stored securely.
- Will documents are stored only with consent.
- Privacy policy is accessible.
- Users can manage consent and data retention.
