# PRD: Legal Will Generation Tool

## 1. Product overview

### 1.1 Document title and version
- PRD: Legal Will Generation Tool
- Version: 1.0

### 1.2 Product summary
This document outlines the product requirements for a legal will generation tool designed to assist users in creating regionally compliant legal wills. The tool will be accessible via both web and mobile platforms and will utilize AI to guide users through the process of will creation.

The application will be built using React and hosted on Replit, with development managed in a VS Code workspace. The final product will be shared via GitHub and will include a structured folder named `ENTI333_FinalProject_VSCode_Folder` with relevant assets and documentation.

## 2. Goals

### 2.1 Business goals
- Provide a free, accessible tool for legal will generation.
- Expand user base across Canada and the USA, with future global reach.
- Establish a foundation for monetization through premium features.

### 2.2 User goals
- Easily create a legally compliant will.
- Receive guidance and legal assessment of their will.
- Share the will securely with relevant parties.

### 2.3 Non-goals
- Store the actual will document.
- Provide legal advice or representation.

## 3. User personas

### 3.1 Key user types
- Individuals planning their estate.
- Legal professionals.
- Family members assisting with will creation.

### 3.2 Basic persona details
- **Estate Planner**: A user who wants to create a will for personal use.
- **Legal Advisor**: A professional reviewing wills for clients.
- **Family Member**: Assisting a relative in creating or reviewing a will.

### 3.3 Role-based access
- **Guest**: Can browse the app and view general information.
- **Registered User**: Can create and share wills, access stored Q&A data.
- **Admin**: Manages app settings, user permissions, and legal compliance updates.

## 4. Functional requirements

- **User registration and login** (Priority: High)
  - Secure login with optional 2FA.
  - User profile creation.

- **Legal compliance check** (Priority: High)
  - Determine region based on home address.
  - Display legal compliance statement.

- **Guided will creation** (Priority: High)
  - Initial generic questions.
  - Region-specific AI-generated questions.
  - AI validation of responses.

- **Will generation and sharing** (Priority: High)
  - Generate will document titled `User Legal Name – Legal Will`.
  - Generate 1-page legal assessment document.
  - Allow sharing via email or download.

- **Annual review** (Priority: Medium)
  - Email user annually with AI-generated update questions.

- **Data storage** (Priority: High)
  - Store Q&A responses securely.
  - Do not store generated wills.

## 5. User experience

### 5.1 Entry points & first-time user flow
- Open website or download mobile app.
- Register or log in.
- Begin guided will creation.

### 5.2 Core experience
- **Start**: User accesses the app via web or mobile.
  - Clear onboarding instructions.
- **Profile Setup**: User enters legal name, phone, email, home address.
  - Simple form with validation.
- **Legal Compliance Check**: Based on address, show legal compliance statement.
  - User chooses to opt in or out.
- **Questionnaire**: AI generates region-specific questions.
  - Real-time adaptation based on responses.
- **Review**: AI checks for completeness and legal gaps.
  - Suggests additional questions if needed.
- **Output**: Generate and share will and legal assessment.
  - Download or email options.

### 5.3 Advanced features & edge cases
- AI adapts to legal changes annually.
- Handles incomplete or ambiguous answers.
- Supports multiple jurisdictions.

### 5.4 UI/UX highlights
- Clean, accessible interface.
- Responsive design for mobile and desktop.
- Progress indicators during questionnaire.

## 6. Narrative
Alex is a Canadian resident who wants to create a legal will to ensure their assets are distributed according to their wishes. They find the will generation tool online and are guided through a personalized questionnaire. The app provides a legal compliance summary and generates a will and assessment document. Alex shares the will with their lawyer and receives annual reminders to update it.

## 7. Success metrics

### 7.1 User-centric metrics
- Number of wills generated.
- User satisfaction ratings.
- Opt-in conversion rate.

### 7.2 Business metrics
- Monthly active users.
- Growth in registered users.
- Revenue from premium features.

### 7.3 Technical metrics
- System uptime.
- Response time for AI-generated questions.
- Data breach incidents.

## 8. Technical considerations

### 8.1 Integration points
- Replit for hosting and AI coding.
- GitHub for version control.
- Email service for annual reminders.

### 8.2 Data storage & privacy
- Store Q&A responses securely.
- Do not store generated wills.
- Use HTTPS and encryption.
- Clear privacy policy and consent management.

### 8.3 Scalability & performance
- Support for increasing user base.
- Efficient AI processing.
- Responsive UI across devices.

### 8.4 Potential challenges
- Ensuring legal compliance across regions.
- Managing sensitive user data securely.
- Handling ambiguous or incomplete user input.

## 9. Milestones & sequencing

### 9.1 Project estimate
- Medium: 4–6 weeks

### 9.2 Team size & composition
- Medium Team: 3–5 people
  - Product Manager
  - 2 React Developers
  - 1 Designer
  - 1 QA Specialist

### 9.3 Suggested phases
- **Phase 1**: Core will creation and legal compliance flow (2 weeks)
  - User registration, questionnaire, AI integration.
- **Phase 2**: Output generation and sharing (2 weeks)
  - Will and assessment document creation.
- **Phase 3**: Annual review and email system (2 weeks)
  - AI-powered updates and notifications.

## 10. User stories

### 10.1. Register and log in
**ID**: US-001  
**Description**: As a user, I want to register and log in securely so that I can access my data.  
**Acceptance criteria**:  
- User can register with email and password.  
- User can log in and log out.  
- 2FA is available as an option.

### 10.2. View legal compliance statement
**ID**: US-002  
**Description**: As a user, I want to see a legal compliance statement based on my address so I can decide whether to proceed.  
**Acceptance criteria**:  
- User enters home address.  
- App displays region-specific legal compliance info.  
- User can opt in or out.

### 10.3. Complete guided questionnaire
**ID**: US-003  
**Description**: As a user, I want to answer guided questions to generate my will.  
**Acceptance criteria**:  
- Initial generic questions are shown.  
- Region-specific questions are generated by AI.  
- AI validates responses and suggests additional questions.

### 10.4. Generate and share will
**ID**: US-004  
**Description**: As a user, I want to generate and share my will securely.  
**Acceptance criteria**:  
- Will is generated with user’s legal name.  
- Assessment document is created.  
- User can download or email documents.

### 10.5. Annual review
**ID**: US-005  
**Description**: As a user, I want to receive annual reminders to update my will.  
**Acceptance criteria**:  
- App sends email annually.  
- AI generates update questions based on legal changes and previous answers.

### 10.6. Secure data handling
**ID**: US-006  
**Description**: As a user, I want my data to be stored securely and privately.  
**Acceptance criteria**:  
- Q&A data is encrypted and stored securely.  
- Will documents are not stored.  
- Privacy policy is accessible.  
- Users can manage consent and data retention.
