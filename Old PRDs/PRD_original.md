## PRD: Legal Will Generation Tool

### 1. Product Overview

#### 1.1 Document Title and Version

- PRD: Legal Will Generation Tool

#### 1.2 Product Summary

This document outlines the product requirements for a legal will generation tool designed to assist users in creating legally valid wills that meet jurisdictional standards. The tool will be accessible via web platforms and will utilize AI to guide users through the process of will creation.

The application will be built using **React** and a **Node.js** backend, hosted on Replit. **Supabase** will be used for secure data storage. The Node.js backend will implement **PDF document generation utilities** to create the final, non-editable legal documents.

The final product will be shared via GitHub for academic evaluation, under the folder `ENTI333_FinalProject_VSCode_Folder`.

The tool aims to remove the need for a lawyer in the will creation process by replacing legal services with AI-powered guidance. A legal will does not require a lawyer, only that it meets a base set of statutory requirements to be deemed valid. The AI will determine the legal requirements based on the user's home address and present a summary of findings, including any necessary disclaimers.

Supported jurisdictions at launch will include Canada and USA. Legal compliance in this context refers specifically to:

- Ensuring the generated will meets the minimum statutory requirements for validity in the user's jurisdiction.
- Ensuring user data is handled in accordance with applicable privacy laws.
- Ensuring the app clearly communicates its limitations and obtains user acknowledgement and consent.

Users will be presented with a summary of legal requirements and disclaimers. They must explicitly opt in to proceed, acknowledging that the app and its owners are not responsible for the legal validity or outcome of the will. If the user opts out, the application session ends with a professional farewell message.

The summary of findings and opt-in decision will be stored along with all other collected data in accordance with the strictest applicable privacy laws of Canada and the USA.

The app will include a user dashboard for managing documents, notifications, and personal data.

### 2. Goals

#### 2.1 Project Goals

- Provide a free, accessible tool for legal will generation.
- Support academic exploration of AI-assisted legal document creation.
- Demonstrate cross-platform functionality and secure data handling.

#### 2.2 User Goals

- Easily create a legally compliant will.
- Receive guidance and legal assessment of their will.
- Share the will securely with relevant parties.

#### 2.3 Non-Goals

- Provide legal advice or representation.
- Monetize the application.

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
- **Registered User**: Can create and share their individual wills, access, read only, their individual stored Q&A data.
- **Admin**: Manages app settings and user permissions. 

### 4. Functional Requirements

- **User Registration and Login** (High)
    - Secure login.
    - User profile creation with automated account number creation.

- **Dashboard Interface** (Medium)
    - Display user’s will and assessment documents
    - Show notifications 
    - Provide access to data management tools (e.g., delete data)

- **Legal Compliance Check and Disclaimer** (High)
    - Determine region based on home address and age based on DOB.
    - AI will dynamically generate the complete text of the legal compliance statement and disclaimer for on-screen display before the user proceeds. (This is Output #1).
    - User acceptance and acknowledgement of disclaimer is required to continue. (This decision is Output #2: Data Flag).
    - Legal will compliance statement, disclaimer, user acceptance and acknowledgement are to be stored data if the user accepts the disclaimer.

- **Guided Will Creation** (High)
    - Initial generic questions including home address, email, and personal information.
    - Region-specific AI-generated questions.
    - AI analysis of responses and generation of the next set of questions.
    - No more than three sets of questions followed by user answers

- **Will Generation and Sharing** (High)
    - AI Generated will document titled Account Number- User Legal Name – Legal Will must be generated as a final, non-editable PDF file.
    - AI Generate 1-page **assessment document** (must be a PDF file) confirming legal will compliance statement criteria have been met and informing user of all regional steps required for validity (e.g., printing and signing instructions, required number and type of witnesses, seeking external counsel, and a final restatement of the original disclaimer component of the legal compliance check and disclaimer).
    - Allow sharing via email or download. (This will apply to the generated PDF files).

- **Data Storage** (High)
    - Store all Q&A questions and responses, AI-generated content, and user decisions securely in Supabase.
    - Store personal information (name, address, DOB, email).
    - Store AI-generated legal assessments.
    - Store AI generated will documents.
    - Store opt-in acknowledgements and disclaimers.

- **User Data Deletion** (High)
    - Users can delete all stored data at any time.
    - Deletion is permanent and confirmed via email.
    - Supabase RLS policies will ensure only the user can trigger manual deletion of their own data.
 

### 5. User Experience

#### 5.1 Entry Points & First-Time User Flow

- Open website app.
- Register or log in.
- Begin guided will creation.

#### 5.2 Core Experience

- **Start**: User accesses the app via web or mobile.
- **Profile Setup**: User enters legal name, phone, email, home address, DOB.
- **Legal Compliance Check**: Based on address and DOB, show legal compliance statement.
- **Questionnaire**: AI generates region-specific questions.
- **Review**: AI checks for completeness and legal gaps.
    - *Completeness* is defined as meeting the minimum legal requirements for a valid will in the user's jurisdiction.
    - *Legal gaps* are defined as areas where the AI-generated will require additional outside of app steps to become a legal will.
    - AI generates a separate document summarizing the completeness and identifying any legal gaps.
    - This document includes disclaimers and recommendations for seeking legal advice if needed.
    - The document is named consistently and stored with user-specific identifiers alongside all other user data.
    - User acknowledgement of disclaimers is required and stored to remove liability from the app and its owners.
- **Output**: Generate and share will and legal assessment.

#### 5.3 Advanced Features & Edge Cases

- AI adapts to legal changes via its training.
- Handles incomplete or ambiguous answers.
- Supports multiple jurisdictions.
- Users with cross-border estates are advised to consult legal professionals. The app is designed for single-jurisdiction wills based on the user's home address.

#### 5.4 UI/UX Highlights

- Clean, accessible interface.
- Responsive design for web app.
- Progress indicators during questionnaire.


#### 5.5 Dashboard Features

The Legal Will Generation Tool will include a user dashboard accessible after login. This dashboard serves as the central hub for managing user interactions and data. Key features include:

- **Document Access**
  - View, download, or email the latest generated legal will and assessment documents.
  - Display document status (e.g., draft, finalized, shared).

- **Notifications & Alerts**
    - Notify users of failed operations (e.g., email delivery issues) with retry options.

- **Data Management**
  - Allow users to view and manage personal information (name, address, DOB, email).
  - Provide options to delete stored data with confirmation and audit logging.
  - Display consent status.

- **Audit & Activity Logs**
  - Show a summary of recent actions (e.g., document generation, data deletion).
  - Allow users to view their own audit trail for transparency.

The dashboard will be built using React components and styled according to the app’s **Brand_Kit.html** It will be responsive across web based platforms and integrated with Supabase for secure data retrieval.


### 6. Narrative

Alex is a Canadian resident who wants to create a legal will to ensure their assets are distributed according to their wishes. They find the will generation tool online and are guided through a personalized questionnaire. The app provides a legal compliance summary and generates a will and assessment document. Alex shares the will with their lawyer.

### 7. Success Metrics

#### 7.1 User-Centric Metrics

- Number of wills generated.
- User satisfaction ratings.
- Opt-in conversion rate.

#### 7.2 Academic Metrics

- Completion of project milestones.
- Quality of AI-generated legal assessments.
- Feedback from academic reviewers.

#### 7.3 Technical Metrics

- System uptime.
- Response time for AI-generated questions.
- Data breach incidents.

#### 7.4 Document Generation & Delivery

- 7.4.1 Format: All final legal documents—the Legal Will and the Assessment Document—must be generated as non-editable PDF files.
- 7.4.2 Content: Both generated PDF documents must dynamically insert all user-provided data, the AI’s legal assessment summary, and all necessary disclaimers.
- 7.4.3 Download: A "Download All Documents" button must be available on the final review screen, triggering a secure file download from the Node.js backend.
- 7.4.4 Sharing: The only method for sharing the generated documents will be email. A feature to securely email the generated PDF files (as an attachment or secure link) must be provided.


### 8. Technical Considerations

#### 8.1 Integration Points

- Replit for hosting and AI coding.
- React for web app development.
- Supabase for secure data storage.
- GitHub for version control and academic sharing.

#### 8.2 Data Storage & Privacy

- Supabase will store all user data with encryption at rest.
- RLS (Row Level Security) policies must be implemented to ensure only the user can access or modify their specific data.
- The application will implement industry-standard privacy best practices for secure consent and data handling.
- Will documents are stored only with explicit user consent, as defined in the Secure Data Handling requirements (US-006).


#### 8.3 Scalability & Performance

- Support for increasing user base.
- Efficient AI processing.
- Responsive UI across devices.

#### 8.4 Potential Challenges

- Ensuring legal compliance across regions.
- Managing sensitive user data securely.
- Handling ambiguous or incomplete user input.


### 9. User Stories

#### 9.1 Register and Log In
**ID**: US-001  
**Description**: As a user, I want to register and log in securely so that I can access my data.  
**Acceptance Criteria**:
- User can register with email and password.
- User can log in and log out.

#### 9.2 View Legal Compliance Statement
**ID**: US-002  
**Description**: As a user, I want to see a legal compliance statement based on my address so I can decide whether to proceed.  
**Acceptance Criteria**:
- User enters home address and DOB.
- App displays notification of age restriction or region-specific legal compliance info with disclaimer.
- User can opt in or out.

#### 9.3 Complete Guided Questionnaire
**ID**: US-003  
**Description**: As a user, I want to answer guided questions to generate my will.  
**Acceptance Criteria**:
- Initial generic questions are shown.
- Region-specific questions are generated by AI.
- AI validates responses and suggests additional questions.

#### 9.4 Generate and Share Will
**ID**: US-004  
**Description**: As a user, I want to generate and share my will securely.  
**Acceptance Criteria**:
- Will is generated with user’s legal name.
- Assessment document is created.
- User can download or email documents.

#### 9.5 Secure Data Handling
**ID**: US-006  
**Description**: As a user, I want my data to be stored securely and privately.  
**Acceptance Criteria**:
- Q&A data is encrypted and stored securely.
- Will documents are stored only with consent.
- Users can manage consent and data retention.
- Privacy Policy Link: A clear link to the Privacy Policy must be present in the application footer. The application must retrieve the Privacy Policy URL from the environment variable PRIVACY_POLICY_URL (stored in Replit Secrets).

#### 9.6 Confirm Data Deletion
**ID**: US-008  
**Description**: As a user, I want confirmation when my personal data is deleted so I can be assured of privacy compliance.  
**Acceptance Criteria**:
- User receives email confirmation after deletion.
- Deleted data is no longer accessible via the app.
- Audit log records the deletion event.

#### 9.7 Cross-Border Estate Handling
**ID**: US-010  
**Description**: As a user with assets in multiple jurisdictions, I want to understand how to handle cross-border estate planning.  
**Acceptance Criteria**:
- App informs user that it supports single-jurisdiction wills.
- App recommends seeking legal advice for cross-border estates.
- Disclaimer is presented and stored with user acknowledgement.



### 10. Error Handling & Recovery

This section outlines how the Legal Will Generation Tool will detect, handle, and recover from errors to ensure a reliable and secure user experience.

#### 10.1 Registration & Login Errors
- **Invalid input**: Show inline validation messages (e.g., “Invalid email format”).
- **Failed login attempts**: Lock account after 5 failed attempts; notify user via email with unlock instructions.

#### 10.2 Legal Compliance Check
- **Missing or invalid address/DOB**: Prompt user to correct input with contextual help.
- **Unsupported jurisdiction**: Display message explaining limitations and suggest consulting a legal professional.
- **AI failure to retrieve requirements**: Retry once; if still failing, show a fallback message and terminate the session, requiring the user to try again later.

#### 10.3 Questionnaire Flow
- **Ambiguous or incomplete answers**: Prompt user to clarify; highlight missing fields.
- **AI question generation failure**: Retry with simplified logic; if persistent, offer manual question set.
- **Timeouts**: Notify user and retry automatically; log incident for review.

#### 10.4 Will Generation
- **Missing data**: Alert user to complete required fields before proceeding.
- **AI generation failure**: Retry up to 3 times; if unsuccessful, offer to save progress and notify user when resolved.
- **Formatting issues**: Validate output before display; if formatting fails, retry PDF generation once, otherwise alert the user of a fatal document generation error

#### 10.5 Review & Assessment
- **AI assessment failure**: Retry once; if still failing, notify user and offer manual review checklist.
- **Document generation issues**: Log error, notify user, and allow download of partial results if available.

#### 10.6 Sharing & Download
- **Email failure**: Retry with delay; notify user and offer alternative (e.g., download link).
- **Download issues**: Provide alternate formats (PDF, TXT); retry download or offer email delivery.

#### 10.7 Data Storage & Privacy
- **Supabase connection failure**: Retry with exponential backoff; notify user if persistent.
- **Encryption errors**: Halt data operations; log incident and alert admin.
- **Unauthorized access attempts**: Block access, log event, and notify admin immediately.

#### 10.8 Data Deletion
- **Deletion failure**: Retry; if unsuccessful, notify user and escalate to admin.
- **Confirmation email not sent**: Allow user to resend; log and monitor email service.
- **Audit log update failure**: Retry and alert admin if unresolved.

#### 10.9 Audit Logging
- **Log entry failure**: Retry and store locally until Supabase is available.
- **AI summary failure**: Notify admin and offer manual review tools.
- **Admin access issues**: Provide fallback access via secure backup dashboard.
