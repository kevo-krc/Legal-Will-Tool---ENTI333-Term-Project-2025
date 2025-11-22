# AI Coding Prompt Log

## 1. Initial Project Setup and Foundation (2025-11-09)
### Goal: Create initial component structure.
- **Action:** Create PRD.md for inclusion in VSCODE, GitHub and for use in coding via Replit and React.
- **Prompt:** The goal is to create a legal will generation tool
Target Users are anyone the app is to be fully accessible.  Initially the app should be limited to Canada and the USA but we may wish to expand to globally later.  
Core features are guided legal will creation with an assessment of the legal will and then sharing of both those outputs
This will be a web app and a mobile app using REACT and REPLIT with a VS Code core folder called “ENTI333_FinalProject_VSCode_Folder” and a subfolder called “assets” for any images to include in the created files.  File names in the core folder are: .gitignore, Brand_Kit.html, LICENSE, PRD_Product_Requirements_Document.md, PROMPT_LOG.md, README.md.  The end state is sharing all this in GitHub
The app should adhere to regional legal compliance based upon user’s home address. An initial statement should be provided to the user letting them know what their regional legal compliance is before continuing on with the questions required to complete subsequent steps so that the user can decide to proceed or not proceed
User flow should be 
Either opening the web site or downloading the phone app
Being asked some generic who are you questions including legal name, phone number, email, home address
Based off home address a legal compliance statement should be provided to the user before continuing the questionnaire additionally the user should be made aware that the app will store the Q&A section of the app but not the will itself.  The will can be shared at the end of the app.  The user will either opt in or opt out at this point
After opting in the next set of questions should be regionally specific and AI generated in real time to adhere to the most recent legal standards for legal will generation in that region
After the next set of questions are answered there should be an AI check of those answers to ascertain if additional questions need to be asked from a legal perspective with the task of generating a legal will for the user
There should not be a fourth set of questions.  The experience should be a guided legal will generation specific to the region of the user’s home address
Outputs are: a legal will titled ‘users legal name – legal will’ and a short 1-page document speaking to the legal strengths and areas for more attention of the legal will document
Annually the app should email the user to ask pertinent questions that might lead to an update of their will.  These questions should be AI powered where AI reviews the current answers and any legal changes in that region over the past year.  This will require the questions and answers to be stored some where for the app to access
Security & Privacy:
Data Encryption: Use HTTPS and encrypt stored data. 
Authentication: Secure login (consider 2FA). 
Access Control: Limit who can view/edit wills. 
Audit Logs: Track access to sensitive data. 
Privacy Policy: Clear, plain-language explanation of data use. 
Consent Management: Let users opt in/out of data sharing. 
Data Retention: Define how long data is stored and when it’s deleted. 
Breach Response Plan: Outline steps in case of a data breach.
Collaboration or Review:  Users will be able to share their wills with others, lawyers, family members, themselves for review.  I do not want the app to store wills only to generate and then share.  The question and answer sections should be stored though
Monetization or Licensing:
This will be a free tool for now but eventually a fee will be required after the opt in stage immediately after the initial set of questions but before the initial legal compliance statement is delivered to the user
prd.md
Instructions for creating a product requirements document (PRD)
You are a senior product manager and an expert in creating product requirements documents (PRDs) for software development teams.
Your task is to create a comprehensive product requirements document (PRD) for the following project:
The goal is to create a legal will generation tool
Target Users are anyone it is to be fully accessible
Core features are guided legal will creation with an assessment of the legal will and then sharing of both those outputs
This will be a web app and a mobile app using REACT and REPLIT with a VS Code core folder called “ENTI333_FinalProject_VSCode_Folder” and a subfolder called “assets” for any images to include in the created files.  File names in the core folder are: .gitignore, Brand_Kit.html, LICENSE, PRD_Product_Requirements_Document.md, PROMPT_LOG.md, README.md.  The end state is sharing all this in GitHub
The app should adhere to regional legal compliance based upon user’s home address. An initial statement should be provided to the user letting them know what their regional legal compliance is before continuing on with the questions required to complete subsequent steps so that the user can decide to proceed or not proceed
User flow should be 
either opening the web site or downloading the phone app
Being asked some generic who are you questions including legal name, phone number, email, home address
Based off home address a legal compliance statement should be provided to the user before continuing the questionnaire additionally the user should be made aware that the app will store the Q&A section of the app but not the will itself.  The will can be shared at the end of the app.  The user will either opt in or opt out at this point
After opting in the next set of questions should be regionally specific and AI generated in real time to adhere to the most recent legal standards for legal will generation in that region
After the next set of questions are answered there should be an AI check of those answers to ascertain if additional questions need to be asked from a legal perspective with the task of generating a legal will for the user
There should not be a fourth set of questions.  The experience should be a guided legal will generation specific to the region of the user’s home address
Outputs are: a legal will titled ‘users legal name – legal will’ and a short 1-page document speaking to the legal strengths and areas for more attention of the legal will document
Annually the app should email the user to ask pertinent questions that might lead to an update of their will.  These questions should be AI powered where AI reviews the current answers and any legal changes in that region over the past year.  This will require the questions and answers to be stored some where for the app to access
Security & Privacy:
Data Encryption: Use HTTPS and encrypt stored data. 
Authentication: Secure login (consider 2FA). 
Access Control: Limit who can view/edit wills. 
Audit Logs: Track access to sensitive data. 
Privacy Policy: Clear, plain-language explanation of data use. 
Consent Management: Let users opt in/out of data sharing. 
Data Retention: Define how long data is stored and when it’s deleted. 
Breach Response Plan: Outline steps in case of a data breach.
Collaboration or Review:  Users will be able to share their wills with others, lawyers, family members, themselves for review.  I do not want the app to store wills only to generate and then share.  The question and answer sections should be stored though
Monetization or Licensing:
This will be a free tool for now but eventually a fee will be required after the opt in stage immediately after the initial set of questions but before the initial legal compliance statement is delivered to the user
Follow these steps to create the PRD:
Begin with a brief overview explaining the project and the purpose of the document.
Use sentence case for all headings except for the title of the document, which can be title case, including any you create that are not included in the prd_outline below.
Under each main heading include relevant subheadings and fill them with details derived from the prd_instructions
Organize your PRD into the sections as shown in the prd_outline below
For each section of prd_outline, provide detailed and relevant information based on the PRD instructions. Ensure that you:
Use clear and concise language
Provide specific details and metrics where required
Maintain consistency throughout the document
Address all points mentioned in each section
When creating user stories and acceptance criteria:
List ALL necessary user stories including primary, alternative, and edge-case scenarios.
Assign a unique requirement ID (e.g., US-001) to each user story for direct traceability
Include at least one user story specifically for secure access or authentication if the application requires user identification or access restrictions
Ensure no potential user interaction is omitted
Make sure each user story is testable
Review the user_story example below for guidance on how to structure your user stories
After completing the PRD, review it against this Final Checklist:
Is each user story testable?
Are acceptance criteria clear and specific?
Do we have enough user stories to build a fully functional application for it?
Have we addressed authentication and authorization requirements (if applicable)?
Format your PRD:
Maintain consistent formatting and numbering.
Do not use dividers or horizontal rules in the output.
List ALL User Stories in the output!
Format the PRD in valid Markdown, with no extraneous disclaimers.
Do not add a conclusion or footer. The user_story section is the last section.
Fix any grammatical errors in the prd_instructions and ensure proper casing of any names.
When referring to the project, do not use project_title. Instead, refer to it in a more simple and conversational way. For example, "the project", "this tool" etc.
<prd_outline>
PRD: {project_title}
1. Product overview
1.1 Document title and version
Bullet list with title and version number as different items. Use same title as {project_title}. Example:
PRD: {project_title}
Version: {version_number}
1.2 Product summary
Overview of the project broken down into 2-3 short paragraphs.
2. Goals
2.1 Business goals
Bullet list of business goals.
2.2 User goals
Bullet list of user goals.
2.3 Non-goals
Bullet list of non-goals that we don't want to achieve.
3. User personas
3.1 Key user types
Bullet list of key user types.
3.2 Basic persona details
Bullet list of basic persona details based on the key user types in the following format:
{persona_name}: {persona_description}
Example:
Guests: Casual visitors interested in reading public blog posts.
3.3 Role-based access
  - Briefly describe each user role (e.g., Admin, Registered User, Guest) and the main features/permissions available to that role in the following format:
  - **{role_name}**: {role_description}
  - Example:
  - **Guests**: Can view public blog posts and search for content.
4. Functional requirements
Bullet list of the functional requirements with priority in brackets in the following format:
{feature_name} (Priority: {priority_level})
List of requirements for the feature.
Example:
Search the site: (Priority: High)
Allow users to search for content by keyword.
Allow users to filter content by category.
5. User experience
5.1. Entry points & first-time user flow
Bullet list of entry points and first-time user flow.
5.2. Core experience
Step by step bullet list of the core experience in the following format:
{step_1}: {explanation_of_step_1}
{how_to_make_it_a_good_first_experience}
Example:
Browse posts:: Guests and registered users navigate to the homepage to read public blog posts.
The homepage loads quickly and displays a list of posts with titles, short descriptions, and publication dates.
5.3. Advanced features & edge cases
Bullet list of advanced features and edge cases.
5.4. UI/UX highlights
Bullet list of UI/UX highlights.
6. Narrative
Describe the narrative of the project from the perspective of the user. For example: "{name} is a {role} who wants to {goal} because {reason}. {He/She} finds {project} and {reason_it_works_for_them}." Explain the users journey and the benefit they get from the end result. Limit the narrative to 1 paragraph only.
7. Success metrics
7.1. User-centric metrics
Bullet list of user-centric metrics.
7.2. Business metrics
Bullet list of business metrics.
7.3. Technical metrics
Bullet list of technical metrics.
8. Technical considerations
8.1. Integration points
Bullet list of integration points.
8.2. Data storage & privacy
Bullet list of data storage and privacy considerations.
8.3. Scalability & performance
Bullet list of scalability and performance considerations.
8.4. Potential challenges
Bullet list of potential challenges.
9. Milestones & sequencing
9.1. Project estimate
Bullet list of project estimate. i.e. "Medium: 2-4 weeks", eg:
{Small|Medium|Large}: {time_estimate}
9.2. Team size & composition
Bullet list of team size and composition. eg:
Medium Team: 1-3 total people
Product manager, 1-2 engineers, 1 designer, 1 QA specialist
9.3. Suggested phases
Bullet list of suggested phases in the following format:
{Phase 1}: {description_of_phase_1} ({time_estimate})
{key_deliverables}
{Phase 2}: {description_of_phase_2} ({time_estimate})
{key_deliverables}
Example:
Phase 1:: Develop core blogging functionality and user authentication (2 weeks)
Key deliverables: Landing page, blog post creation, public content viewing, user registration, login features.
10. User stories
Create a h3 and bullet list for each of the user stories in the following example format:
10.{x}. {user_story_title}
ID: {user_story_id}
Description: {user_story_description}
Acceptance criteria: {user_story_acceptance_criteria}
Example:
10.1. View public blog posts
ID: US-001
Description: As a guest, I want to view public blog posts so that I can read them.
Acceptance criteria:
The public blog posts are displayed on the homepage.
The posts are sorted by publication date in descending order.
The posts are displayed with a title, short description, and publication date.
</prd_outline>
<user_story>
ID
Title
Description
Acceptance criteria
</user_story>

- **AI Output Summary:** Successfully created `PRD_Product Requirements_Document.md`
- **Outcome:** Ready to start implementing requirements from PRD but first we need to create Brand.Kit.html.

## 2. Updating PRD.md (2025-11-10)
### Goal: Increase specifics regarding data retention and storage of the app.
- **Source PRD Requirement:** 
- **Prompt:** "Yesterday we created the attached PRD_Product_Requirements_Document.md but I would like to make some changes.  The goal of this document will be to use it for Replit and Reach to create a web based and android device app for legal will creation as well as ultimately sharing it via GitHub for the purposes of a graded university project.

Specifically to the .md  file I would like more data to be stored, personal information, email, the will itself, the AI assessment of the will. Does that information need to be in this PRD.md?

Also data storage needs to meet regional regulations for privacy, should that be included in this .md file?

I may have some preferences for which apps and services get used/called by Replit and Reach during the coding phase.  Should that information be included in this .md file?"
- **AI Output Summary:** 
- **Debugging Prompt:** 
- **Outcome:** The PRD.md file now includes specifics about what types of data to be stored, what regulations need to be followed, and a selected data storage platform

## 3. Updating PRD.md (2025-11-10)
### Goal: Include data deletion privleges for users as per privacy law
- **Source PRD Requirement:** The application must allow full deletion of personal info by users.
- **Prompt:** "For functional requirements the user must be able to delete all their data whenever they want as per privacy law.  Does that need to be included?"
- **AI Output Summary:** Yes, that requirement absolutely should be included in your PRD under Functional Requirements and Data Storage & Privacy.
- **Debugging Prompt:** "
- **Outcome:** Functional Requirements section of the PRD.md is now updated

## 4. Updating PRD.md (2025-11-10)
### Goal: Include full auditing as per privacy law
- **Source PRD Requirement:** The application must keep an audit trail.
- **Prompt:** "Yes the markdown file absolutely needs to be updated.  Is audit logging required under privacy law?  If yes is it a full audit log and should that also be included in the PRD.md?"
- **AI Output Summary:** Yes, audit logging is strongly recommended and often required or implied under privacy laws like PIPEDA, Alberta FOIP, and U.S. CCPA, especially when handling sensitive personal data and enabling user data deletion.
- **Debugging Prompt:** 
- **Outcome:** Functional Requirements section of the PRD.md is now updated

## 5. QA of PRD.md (2025-11-10)
### Goal: Refine PRD.md for best results
- **Source PRD Requirement:** The PRD.md must be robust so AI was used to achieve this
- **Prompt:** "You are an extremely tough and unreasonable product executive who is tasked with critically analyzing product requirements. Your role is to be highly skeptical and to point out potential issues, inconsistencies, and strategic pitfalls in the proposed requirements. You should be particularly critical when it comes to cross-team collaboration, conflicting requirements, maintainability, and strategic implications.

You have the Updated_PRD_Legal_Will_App.md document presently with a set of product requirements. Your task is to thoroughly critique these requirements, focusing on the following areas:

1. Cross-team collaboration: Identify any areas where teams may not be working together effectively or where there's a lack of clear responsibility.
2. Conflicting requirements: Point out any requirements that seem to contradict each other or create potential conflicts in implementation.
3. Maintainability: Highlight any requirements that may be difficult to maintain or update across multiple pages or systems.
4. Strategic implications: Identify any requirements that might limit future flexibility or paint the company into a strategic corner.
5. Clarity and specificity: Point out any vague or ambiguous requirements that could lead to misinterpretation.
6. Feasibility: Question any requirements that seem unrealistic or overly ambitious given typical constraints.

Carefully read through these requirements and prepare your critique. Be harsh, unforgiving, and nitpicky in your analysis. Don't hold back – your role is to find every possible flaw and potential issue.

In your response, provide a detailed critique for each major point or section of the requirements. Use the following format for your critique:

<critique>
<section>[Name or number of the section you're critiquing]</section>
<issue>[Describe the specific issue you've identified]</issue>
<impact>[Explain the potential negative impact of this issue]</impact>
<suggestion>[If applicable, provide a suggestion for improvement, but make it sound reluctant and skeptical]</suggestion>
</critique>

After providing individual critiques, summarize your overall assessment of the product requirements in a final paragraph. Be sure to emphasize the most critical issues you've identified and their potential impact on the product's success.

Remember, your goal is to be the toughest critic possible. Don't sugarcoat your feedback or provide unnecessary praise. Focus on identifying problems and potential pitfalls in the requirements.
Copilot said:
Copilot
Here is a ruthless, detailed critique of the PRD_Legal_Will_App.md document based on your request. I’ve dissected the requirements across the six dimensions you specified, and I’ve held nothing back.
"
- **AI Output Summary:**1.2 Product Summary  
The summary claims “regionally compliant legal wills” and “AI guidance” without specifying jurisdictions, legal validation methods, or AI model scope.  
This vagueness invites legal risk and undermines credibility. Developers and legal teams will be left guessing, and users may be misled into thinking their will is legally valid when it’s not.  
Reluctantly, I suggest explicitly listing supported jurisdictions and defining what “compliance” means. But I doubt this will be maintained properly without a dedicated legal team.  
  
3.3 Role-Based Access  
“Admin” is tasked with managing “legal compliance updates,” which is a legal function, not a technical one.  
This blurs the line between legal and technical responsibilities, creating confusion and potential liability. Who ensures the legal accuracy of updates? A developer?  
Split responsibilities between legal and technical roles. But expect resistance from teams unwilling to take ownership of compliance.  
  
4. Functional Requirements – Data Storage  
Contradiction: “Will documents stored only with user consent” vs. “Store Q&A responses securely” and “Do not store generated wills” in earlier versions.  
Conflicting statements will lead to implementation errors and potential privacy violations. Developers won’t know what to store or delete.  
Pick a clear stance and enforce it with technical constraints. But expect pushback from stakeholders who want flexibility without accountability.  
  
4. Functional Requirements – Audit Logging  
Audit logging is mentioned, but there’s no mention of log retention, access control, or review cadence.  
This turns a critical compliance feature into a superficial checkbox. Without retention policies, logs may be useless or even a liability.  
Define retention duration, access roles, and review frequency. But don’t expect this to be implemented unless forced by a breach or audit.  
  
5.2 Core Experience – AI Review  
“AI checks for completeness and legal gaps” is dangerously vague. What constitutes a legal gap? How is completeness defined?  
This could mislead users into thinking their will is legally sound. The company could face lawsuits if a will is invalidated due to AI errors.  
Define the scope of AI validation and include disclaimers. But realistically, this is a legal minefield that AI alone cannot navigate.  
  
8.2 Data Storage & Privacy  
Mentions compliance with PIPEDA, FOIP, and CCPA but doesn’t specify how Supabase meets data residency or cross-border data flow requirements.  
This exposes the company to regulatory risk. Supabase may not offer region-specific data residency guarantees, and this could violate local laws.  
Confirm Supabase’s compliance capabilities and document them. But don’t expect this to be simple or cheap.  
  
10. User Stories  
No user story for audit log access, data deletion confirmation, or Admin compliance workflows.  
Critical features may be overlooked during development, leading to gaps in functionality and compliance.  
Add user stories for Admins and compliance workflows. But brace for pushback from engineering on scope creep.  
  
9.3 Suggested Phases  
Phases are overly optimistic. “Core will creation and legal compliance flow” in 2 weeks is unrealistic given legal complexity and AI integration.  
This timeline sets the team up for failure, missed deadlines, and rushed implementation. Legal compliance alone could take months.  
Extend timelines and include legal review cycles. But expect stakeholders to resist any delay that threatens academic deadlines.  

Final Assessment
The Updated_PRD_Legal_Will_App.md is a well-intentioned but dangerously under-specified document. It suffers from vague language, conflicting requirements, unrealistic timelines, and a lack of clear cross-functional ownership. Legal compliance is treated as a technical checkbox, and AI is expected to perform tasks that require human judgment. Without major revisions and tighter coordination between legal, product, and engineering teams, this project risks delivering a legally invalid, non-compliant, and potentially harmful product. If this PRD were handed to a dev team today, expect confusion, rework, and finger-pointing. This needs a serious overhaul.
 
- **Debugging Prompt:** 
- **Outcome:**The PRD.md needs an overhaul.  There will be many changes and scope redefining that will be omitted from this prompt_log for brevity.  Intial finalized PRD.md will be added to first GitHub commit.


## 6. Phase 1: Frontend & Backend Foundation (2025-11-12)
### Goal: Set up basic React + Node.js architecture with routing and styling
- **Source PRD Requirement:** Full-stack application with React frontend and Node.js backend
- **Prompt:** "I have imported my entire project, including the full requirements in the PRD.md document. I am building a full-stack application using React (frontend), Node.js (backend), and Supabase (database). Create the initial structure with Header, Footer, Home, Login, Register, Dashboard, and PrivacyPolicy pages. Extract global styles from brand-kit.css and set up dual workflows for frontend (Vite on port 5000) and backend (Express on port 3001)."
- **AI Output Summary:** Created React + Vite frontend with routing, global CSS, and component structure. Set up Express backend with health check endpoints. Configured both workflows to run simultaneously.
- **Outcome:** Phase 1 complete - Basic UI and backend running
- **Commit:** Multiple commits establishing project structure

## 7. Phase 2: Authentication System (2025-11-13)
### Goal: Implement Supabase authentication with user profiles
- **Source PRD Requirement:** Secure user authentication and profile management
- **Prompt:** "Implement Supabase authentication with auto-generated account numbers (format: WL{timestamp}{random}). Create profiles table with RLS policies. Build AuthContext for session management, protected routes, and update Register/Login/Dashboard pages with full functionality."
- **AI Output Summary:** Implemented complete Supabase auth system with client-side direct communication (no backend proxy). Created profiles table with account_number, full_name, email, phone fields. Built protected routes and session management.
- **Debugging:** Fixed profile loading issues in Dashboard by handling undefined states properly
- **Outcome:** Phase 2 complete - Users can register, login, view/edit profiles
- **Commits:** 
  - "Add Supabase and Axios libraries for enhanced functionality"
  - Related authentication implementation commits

## 8. Phase 3: AI Questionnaire & Will Creation (2025-11-13)
### Goal: Implement Google Gemini AI for dynamic questionnaires and will generation
- **Source PRD Requirement:** AI-guided questionnaire with jurisdiction-specific questions
- **Prompt:** "Integrate Google Gemini AI to generate compliance statements, dynamic questions (3 rounds max), and final assessments. Create wills table to store Q&A data as JSONB. Build CreateWill, Questionnaire, and WillSummary pages. Support all 13 Canadian provinces/territories and 50 US states with jurisdiction-specific legal requirements."
- **AI Output Summary:** Implemented full AI questionnaire flow with gemini-2.0-flash-exp model. Created server/lib/gemini.js with 4 AI functions (compliance, initial questions, follow-up questions, assessment). Built wills table with RLS policies and Q&A storage.
- **Debugging:** Fixed state synchronization issues in Questionnaire component and answer persistence between rounds
- **Outcome:** Phase 3 complete - Users can create wills with AI-guided questionnaires
- **Commits:**
  - "Update AI model to improve response quality and accuracy"
  - "Add functionality to generate, store, and download PDF will documents"
  - Multiple commits for questionnaire implementation

## 9. Phase 3: Gemini API Rate Limiting (2025-11-13)
### Goal: Implement rate limiting to prevent API quota errors
- **Source PRD Requirement:** AI integration must handle API limits gracefully
- **Prompt:** "We're hitting Gemini API rate limits (10 requests per minute free tier). Implement a rate limiter using promise chain queue to serialize all API requests with 6-second minimum spacing. Add comprehensive error handling to distinguish between RPM (requests per minute) and RPD (requests per day) quota errors. Show user-friendly error messages on the frontend."
- **AI Output Summary:** Created RateLimiter class with promise chain queue. Implemented GeminiQuotaError custom error class. Added error parsing for 429 responses. Updated all 4 AI routes to return specific error types (RPM/RPD/UNKNOWN) with retryAfter timing. Frontend shows specific quota error messages.
- **Debugging:** Fixed race conditions where concurrent requests bypassed rate limiter. Architect reviews identified need for proper promise serialization and cleanup.
- **Outcome:** All Gemini API calls properly rate-limited with 6-second minimum spacing enforced
- **Commits:**
  - "Add rate limiting and error handling for AI requests"
  - "Update model to use Gemini Flash for more efficient processing"

## 10. Phase 3: Model Update & Authentication Timeouts (2025-11-13)
### Goal: Upgrade to paid Gemini tier and fix authentication hanging issues
- **Source PRD Requirement:** Reliable authentication and AI service
- **Prompt:** "Update Gemini model from gemini-2.0-flash-exp to gemini-2.5-flash for paid tier limits. Also, Dashboard shows 'Loading...' indefinitely when Supabase requests hang. Add 10-second timeout guards on ALL Supabase operations (getSession, fetchProfile, signIn, signUp, signOut, updateProfile) using a withTimeout helper. Ensure timeout errors show user-friendly error UI with Retry and Go to Login buttons."
- **AI Output Summary:** Updated Gemini model to gemini-2.5-flash. Created withTimeout helper that creates separate timeouts for each async call with proper cleanup. Wrapped all Supabase operations. Implemented authError state and enhanced ProtectedRoute with error UI. Fixed onAuthStateChange race condition that was clearing timeout errors.
- **Debugging:** Multiple architect reviews identified issues with:
  1. Shared timeout causing false negatives
  2. fetchProfile not rethrowing errors
  3. onAuthStateChange unconditionally clearing authError
  - All issues resolved through iterative fixes with architect validation
- **Outcome:** No more indefinite loading states. All Supabase requests have 10-second timeouts with clear error recovery options
- **Commits:**
  - "Update AI model to improve performance and overcome usage limits"
  - "Fix persistent loading issues by adding authentication timeouts and error handling"
  - "Improve authentication stability by adding timeouts to all Supabase operations"

---

## Summary by Phase
**Phase 1 (Complete):** React + Vite frontend, Node.js + Express backend, dual workflows, global styling
**Phase 2 (Complete):** Supabase authentication, user profiles, protected routes, RLS policies
**Phase 3 (Complete):** Google Gemini AI integration, multi-round questionnaires, rate limiting, comprehensive timeout handling
**Phase 4 (Planned):** PDF generation with pdfkit, Supabase Storage, download/email functionality
**Phase 5 (Planned):** Data deletion, email notifications (SendGrid), deployment configuration

## 11. Phase 4: PDF Generation & Storage (2025-11-14)
### Goal: Generate will documents and assessments as PDFs, store in Supabase
- **Source PRD Requirement:** PDF generation for legal documents and email sharing
- **Prompt:** "Implement PDF generation for will documents and assessment reports using PDFKit. Store PDFs in Supabase Storage bucket called 'will-documents'. Update WillSummary page to show download buttons. Include proper legal formatting with headers, sections, and signatures."
- **AI Output Summary:** Created server/lib/pdfGenerator.js with generateWillPDF and generateAssessmentPDF functions. Implemented legal document formatting with proper headers, jurisdiction info, sections (executors, guardians, beneficiaries, assets, special instructions). Added PDF upload to Supabase Storage with signed URLs for downloads.
- **Outcome:** Phase 4 complete - Will and assessment documents generated as downloadable PDFs
- **Commits:**
  - "Add PDF generation with legal formatting using PDFKit"
  - "Integrate Supabase Storage for PDF uploads and downloads"

## 12. Phase 5: Email Sharing via SendGrid (2025-11-14)
### Goal: Enable users to share generated PDFs via email
- **Source PRD Requirement:** Email delivery for will documents and assessments
- **Prompt:** "Integrate SendGrid to allow users to email their will and assessment PDFs. Add email input to WillSummary page. Create server/lib/emailService.js with SendGrid integration. Include both PDFs as attachments. Add email sharing button to Dashboard for each will."
- **AI Output Summary:** Created emailService.js using SendGrid API v3. Added POST /api/wills/:willId/email endpoint. Implemented email sharing with dual PDF attachments (will + assessment). Added email UI to both WillSummary and Dashboard pages. Used Replit SendGrid integration for automatic key management.
- **Debugging:** Fixed SendGrid configuration to use environment variables. Verified email delivery with PDF attachments.
- **Outcome:** Phase 5 email functionality complete - Users can share PDFs via email
- **Commits:**
  - "Add SendGrid integration for email sharing"
  - "Implement email sharing UI on Dashboard and WillSummary pages"

## 13. Phase 5: User Data Deletion (2025-11-14)
### Goal: Allow users to completely delete all their data
- **Source PRD Requirement:** Privacy compliance - users must be able to delete all data
- **Prompt:** "Implement complete user data deletion. Create DELETE /api/user/delete-all-data endpoint that deletes: user profile, all wills, all PDFs from storage, and Supabase Auth account. Add JWT authentication middleware. Create deletion UI in Dashboard with confirmation dialog. Prevent deletion if wills have generated PDFs (safeguard)."
- **AI Output Summary:** Created server/routes/user.js with comprehensive deletion logic. Implemented JWT-based auth middleware to verify user identity. Added PDF safeguard check - prevents deletion if any will has generated PDFs. Created deletion UI with multi-step confirmation. Deletes in order: PDFs from storage → wills from database → profile → Auth account.
- **Debugging:** Fixed auth middleware to properly extract and verify JWT tokens. Added proper error handling for partial failures.
- **Outcome:** Phase 5 data deletion complete - Users can delete all their data with safeguards
- **Commits:**
  - "Implement complete user data deletion with safeguards"
  - "Add JWT authentication middleware for secure endpoints"

## 14. AI Prompt Improvements: Anti-Repetition Mechanisms (2025-11-15)
### Goal: Prevent AI from asking redundant questions across rounds
- **Source PRD Requirement:** User feedback - AI was asking similar questions in Round 2 and Round 3
- **Prompt:** "The AI is asking redundant questions in follow-up rounds. Update prompts to explicitly track previously asked questions and prevent repetition. Add 'Already Captured' vs 'Missing' sections to the prompt. Use entity-specific language (e.g., 'registered name' vs 'full legal name' for organizations). Improve information gap detection."
- **AI Output Summary:** Significantly enhanced all AI prompts in server/lib/gemini.js:
  - Added structured tracking of previously asked questions
  - Explicit anti-repeat rules with "Already Captured" vs "Missing" sections
  - Entity-specific language for organizations (registered name vs full legal name)
  - Better information gap detection in follow-up rounds
  - Clearer instructions to avoid unnecessary questions
- **Outcome:** AI now generates unique, non-redundant questions across all rounds
- **Commits:**
  - "Enhance AI prompts to prevent question repetition across rounds"
  - "Add entity-specific language and information gap detection"

## 15. Automated Retry for Empty AI Responses (2025-11-15)
### Goal: Handle cases where Gemini returns empty or invalid responses
- **Source PRD Requirement:** Reliability - AI sometimes returns empty arrays
- **Prompt:** "Gemini occasionally returns empty question arrays. Implement automated retry mechanism with exponential backoff. Create custom EmptyGeminiResponseError. Retry up to 3 times with delays (1s, 2s, 4s). Apply to all AI endpoints (compliance, questions, assessment)."
- **AI Output Summary:** Updated server/lib/gemini.js with retry logic:
  - Created EmptyGeminiResponseError custom error class
  - Implemented exponential backoff (1s → 2s → 4s)
  - Added validation for empty/invalid responses
  - Retry up to 3 attempts before failing
  - Applied to all 4 AI functions
- **Debugging:** Tested retry mechanism with various failure scenarios
- **Outcome:** AI responses now automatically retry on empty/invalid data
- **Commits:**
  - "Add automated retry mechanism for empty Gemini responses"
  - "Implement exponential backoff for AI reliability"

## 16. Individual Will Deletion & PDF Safeguards (2025-11-16)
### Goal: Allow users to delete individual wills from Dashboard
- **Source PRD Requirement:** Data management - users should control individual wills
- **Prompt:** "Add delete functionality to Dashboard for individual wills. Only allow deletion of wills with status 'draft' or 'in_progress'. Prevent deletion if will has generated PDFs (will_pdf_url or assessment_pdf_url exists). Show confirmation dialog before deletion. Update UI to show delete button only for eligible wills."
- **AI Output Summary:** Enhanced DELETE /api/wills/:willId endpoint with:
  - PDF safeguard check (prevents deletion if PDFs exist)
  - Status validation (only draft/in_progress can be deleted)
  - Updated Dashboard UI with conditional delete button
  - Confirmation dialog with clear messaging
  - Real-time will list refresh after deletion
- **Debugging:** Fixed conditional rendering of delete button based on will status and PDF existence
- **Outcome:** Users can safely delete individual draft/in-progress wills
- **Commits:**
  - "Add individual will deletion with PDF safeguards"
  - "Implement confirmation dialog for will deletion"

## 17. Boolean Question Type Support (2025-11-16)
### Goal: Support Yes/No questions in the AI questionnaire
- **Source PRD Requirement:** User experience - some questions need boolean answers
- **Prompt:** "AI generates questions with type='boolean' but the UI doesn't support them. Add boolean question support to Questionnaire component with Yes/No radio buttons. Map boolean responses to 'Yes'/'No' strings for storage."
- **AI Output Summary:** Updated src/pages/Questionnaire.jsx:
  - Added boolean question rendering with Yes/No radio buttons
  - Mapped boolean values to string responses ('Yes'/'No')
  - Added proper styling for radio button layout
  - Maintained consistency with text question styling
- **Outcome:** Questionnaire now supports text and boolean question types
- **Commits:**
  - "Add boolean (Yes/No) question type support to questionnaire"

## 18. Notifications System Implementation (2025-11-16 - 2025-11-17)
### Goal: Track user actions and system events with persistent notifications
- **Source PRD Requirement:** User awareness of email successes/failures and system events
- **Prompt:** "Create a notifications system to track email successes/failures, PDF generation issues, and other events. Create notifications table with user_id, type, title, message, is_read, retry_count, metadata. Add notification bell icon in Header with unread count badge. Build notification dropdown panel. Create NotificationContext for real-time updates."
- **AI Output Summary:** Comprehensive notifications implementation:
  - Created server/migrations/003_create_notifications_table.sql with RLS policies
  - Created database/migrations/001_create_increment_retry_function.sql for atomic retry tracking
  - Built server/routes/notifications.js with GET, PUT (mark read), POST (retry) endpoints
  - Created src/components/NotificationBell.jsx with bell icon and dropdown panel
  - Created src/context/NotificationContext.jsx for real-time notification management
  - Integrated notification creation in email sharing endpoint (success/failure)
- **Debugging:** 
  - Fixed initial issue where notifications table was created in local PostgreSQL instead of Supabase
  - Created proper migration files for user to run in Supabase dashboard
  - Fixed NotificationContext API URL (changed from localhost:3001 to relative /api path)
  - Fixed notification dropdown positioning (changed from right: 0 to left: 0 for proper alignment)
- **Outcome:** Full notifications system operational - tracks email events and allows retry actions
- **Commits:**
  - "Implement notifications system with bell UI and dropdown"
  - "Create notifications table migration for Supabase"
  - "Fix NotificationContext API URL for Replit proxy routing"
  - "Update notification dropdown positioning for better UX"

## 19. Age Verification for Legal Compliance (2025-11-20)
### Goal: Integrate age verification into will creation to flag underage users
- **Source PRD Requirement:** Legal compliance - testamentary capacity based on age
- **Prompt:** "Add age verification to the will creation process. Collect date of birth just-in-time during CreateWill (not at registration). Calculate user's age and pass to AI compliance statement and final assessment. If user is underage for their jurisdiction, clearly state this in both documents while allowing them to continue. Store DOB in profiles table for future wills."
- **AI Output Summary:** Implemented comprehensive age verification:
  - Created server/migrations/004_add_date_of_birth_to_profiles.sql migration file
  - Updated src/pages/CreateWill.jsx to collect DOB before jurisdiction selection
  - Added DOB validation (not in future, not >120 years old)
  - Updated server/lib/gemini.js generateComplianceStatement() to accept age parameter
  - Updated server/lib/gemini.js generateWillAssessment() to accept age parameter
  - Modified AI prompts to compare user age against jurisdiction minimum requirements
  - Updated src/pages/Questionnaire.jsx to calculate age and pass to assessment endpoint
  - Enhanced server/routes/ai.js to accept age parameter in compliance and assessment endpoints
- **Technical Implementation:**
  - **Option A (Selected):** Just-in-time DOB collection in CreateWill component
  - If user has DOB saved → Skip directly to jurisdiction selection
  - If user lacks DOB → Show "Before We Begin" form to collect DOB first
  - Age calculation handles edge cases (birthdays, leap years)
  - AI clearly flags underage users in compliance statement and assessment
- **User Experience:**
  - Underage users receive clear messaging that they don't meet age requirements
  - Will notes that document may not be legally valid
  - Strong recommendation to consult licensed attorney
  - Of-age users see standard compliance statement without age commentary
- **Outcome:** Age verification integrated throughout will creation workflow
- **Migration Required:** User must run 004_add_date_of_birth_to_profiles.sql in Supabase dashboard
- **Commits:**
  - "Add age verification with DOB collection in CreateWill"
  - "Update AI prompts to include age compliance checks"
  - "Create migration for date_of_birth column in profiles table"

## 20. Bug Fixes: Auth Context and Timeout Improvements (2025-11-20)
### Goal: Fix date of birth save error and improve user experience when switching browser tabs
- **Source PRD Requirement:** Bug fixes identified during user testing
- **Prompt 1:** "When I test the date of birth I get a message: Failed to save date of birth. Please try again. Please fix that. Note that I have checked supabase and the database for profile has been updated to have a column for date of birth and the date of birth I entered during the test is confirmed to be there."
- **Issue Identified:** The `refreshProfile` function was missing from AuthContext export, causing the error even though the database update was succeeding
- **Prompt 2:** "When I tab between other open things on my computer the app asks for a 'retry' which might be authentication. Can that be fixed?"
- **Issue Identified:** 10-second authentication timeout was too aggressive and triggered when browser throttled background tabs
- **Prompt 3:** "If the 'retry' is due to being away too long perhaps the message when the user returns can say something like, 'You have been gone too long...'"
- **AI Output Summary:** Fixed two critical issues in src/context/AuthContext.jsx:
  1. **Missing refreshProfile Function:**
     - Added `refreshProfile` function to AuthContext
     - Function calls `fetchProfile(user.id)` to reload user profile data
     - Added to context export value for use in components
     - Fixes "Failed to save date of birth" error in CreateWill component
  2. **Timeout Improvements:**
     - Increased authentication timeout from 10 seconds → 30 seconds
     - Updated all timeout log messages to reflect new duration
     - Improved error messages for better user experience:
       - "Connection timeout..." → "You have been away too long. Please refresh the page or log in again."
       - "Connection timeout while loading profile..." → "Loading your profile is taking longer than expected. Please refresh the page."
- **Technical Details:**
  - `withTimeout` default parameter changed from 10000ms to 30000ms
  - Applied to: session retrieval, profile fetching, sign up, sign in, sign out, profile updates
  - New timeout accommodates browser tab throttling when user switches applications
- **User Experience:**
  - DOB now saves successfully without error messages
  - Users can switch browser tabs without triggering retry prompts
  - More user-friendly error messages when timeouts do occur
  - Clear messaging about what happened instead of suggesting internet issues
- **Outcome:** Both bugs resolved, improving overall user experience
- **Commits:**
  - "Fix missing refreshProfile function in AuthContext"
  - "Increase auth timeout to 30s and improve error messages"

## 21. UX Enhancement: Tooltip System and Help Button (2025-11-22)
### Goal: Add contextual help tooltips to guide users through questionnaire
- **Source PRD Requirement:** Improve user experience with contextual help information
- **Prompt 1:** "Can we add a 'help' that when hovered over explains why we are asking this question? And add a help button as well in case there is a live chatbot capability to help with a question. Scenario A: captures and stores additional data from user. Scenario B: doesn't capture data but helps user answer a question they are stuck on."
- **AI Output Summary:** Implemented two-tier tooltip system:
  1. **Static Tooltips for Round 1:**
     - Added `tooltip` field to all 15 static Round 1 questions
     - Explains legal necessity of each question (e.g., "Your marital status affects estate distribution")
     - Tooltip appears on hover with info icon (ℹ️) next to each question
  2. **AI-Generated Tooltips for Rounds 2-3:**
     - Updated Gemini prompts to include `tooltip` field in generated questions
     - AI provides contextual explanations for follow-up questions
     - Tooltips integrated into JSON response structure
  3. **Help Button (Visual Placeholder):**
     - Added green "HELP" button in top-right corner of questionnaire header
     - Distinct styling (green gradient) to differentiate from primary buttons
     - Currently shows placeholder alert for future chatbot implementation
     - Positioned responsively (moves below title on mobile)
- **Technical Implementation:**
  - Created tooltip CSS with dark bubble styling and proper positioning
  - Used FaInfoCircle icon from react-icons
  - Tooltips show/hide on hover with clean transitions
  - Help button styled with box shadow and hover animations
- **Prompt 2 (Bug Fix):** "The tooltips mostly look good but when a question is of a length to put the 'i' symbol on the left of the page the text pop up is cut off by the edge of the screen."
- **Fix Applied:**
  - Moved info icons to flex layout with `justify-content: space-between`
  - Info icon always stays on right side using `flex-shrink: 0`
  - Tooltip anchored to `right: 0` instead of centered
  - Tooltip arrow positioned on right side to match icon position
- **Outcome:** Users now have contextual help without leaving questionnaire flow, preventing tooltip cutoff issues
- **Commits:**
  - "Add tooltip help system and placeholder Help button"
  - "Fix tooltip positioning to prevent edge cutoff"

## 22. Bug Fixes: Date Input Field and AI Context Improvements (2025-11-22)
### Goal: Fix missing date input field and prevent AI from asking for user's existing data
- **Source PRD Requirement:** Bug fixes identified during user testing
- **Prompt:** "I tested our process and for some reason the third round of questions asked my full legal name. We already know the user's name from registration or signing in. Also date of birth is being asked but we should also already have this information from registration+sign in. Additionally there is no spot to enter information after the date of birth question."
- **Issues Identified:**
  1. **Missing Date Input Field:** Questionnaire had no `case 'date':` handler in `renderQuestion` function
  2. **AI Asking for User's Name:** Round 3 AI didn't know user's name was already in profile
  3. **AI Asking for Date of Birth:** Round 3 AI didn't know user's DOB was already in profile
- **AI Output Summary:** Implemented three critical fixes:
  1. **Added Date Input Type:**
     - Created `case 'date':` in `renderQuestion` function
     - Renders proper `<input type="date">` element
     - Includes required validation and proper value binding
  2. **Pass User Profile to AI:**
     - Updated `loadFollowUpQuestions` to include `userProfile` object
     - Updated `loadFollowUpQuestionsForResume` to include `userProfile` object
     - Profile data includes: `full_name` and `date_of_birth`
  3. **Enhanced AI Context:**
     - Modified `generateFollowUpQuestions` to accept `userProfile` parameter
     - User profile data added to "INFORMATION ALREADY PROVIDED" section
     - AI explicitly told: "DO NOT RE-ASK FOR THIS DATA"
     - Updated data tracking to recognize `address`, `spouse`, and `details` fields
- **Technical Details:**
  - Backend route `/questions/followup` now accepts `userProfile` in request body
  - `formatPersonAnswer` helper formats structured person data for AI prompts
  - User context prevents AI from asking for: full legal name, date of birth
- **Outcome:** Date questions now have input fields, AI never asks for data we already have
- **Commits:**
  - "Fix missing date input field and add user profile context to AI"
  - "Prevent AI from asking for user's name and DOB"

## 23. UX Enhancement: Multi-Field Person Input System (2025-11-22)
### Goal: Separate person information into structured fields for better data quality and AI/PDF generation
- **Source PRD Requirement:** Improve data collection and structured data for AI and PDF generation
- **Prompt 1:** "The first round of questions is static and so consistently asks for an executor and back up. The second AI powered round consistently asks for that individual's residential address. Can we make the residential address a component of the static questions? Anytime an individual is to be named their residential address, relationship to the user, and age should be asked for."
- **Initial Change:** Updated static Round 1 questions to ask for full information (name, relationship, age, address) in single textarea fields
- **Prompt 2:** "Instead of all that information being collected in one user filled text box can we separate those fields into their specific types of data? That way we can pass that more specific information on to AI and its question answer will be enhanced as well as the generated pdf. Is ok to combine the data for storage in supabase or should we update supabase for this as well?"
- **AI Output Summary:** Implemented structured multi-field person input system:
  1. **New Question Type: 'person'**
     - Created new question type with configurable fields array
     - Supports: `name`, `relationship`, `age`, `address`
     - Each question specifies which fields to display
  2. **Updated Static Round 1 Questions:**
     - **Spouse Details:** Age + Address fields (name already captured separately)
     - **Guardian for Minors:** Name + Relationship + Age + Address
     - **Primary Executor:** Name + Relationship + Age + Address
     - **Alternate Executor:** Name + Relationship + Age + Address
  3. **Multi-Field Rendering:**
     - Each field has its own label and input
     - Placeholders guide user input format
     - Age fields use `type="number"` with `min="18"`
     - Address fields are full-width text inputs
  4. **Data Storage Structure:**
     - Stored as JSON objects in Supabase `qa_data` field (no schema changes)
     - Example: `{"name": "John Smith", "relationship": "Brother", "age": "45", "address": "123 Main St..."}`
  5. **Data Formatting for AI & PDF:**
     - Created `formatPersonAnswer()` helper function
     - Converts objects to readable text: "Name: John Smith, Relationship: Brother, Age: 45, Address: 123 Main St..."
     - Applied in `summarizeAnswers()` and `providedInformation` tracking
  6. **Enhanced CSS Styling:**
     - Created `.person-fields` and `.person-field` classes
     - Clean vertical layout with proper spacing
     - Focus states with blue borders
     - Placeholder text styling
- **Benefits:**
  - **Better UX:** Clear labeled fields instead of confusing single text box
  - **Data Quality:** Users know exactly what to provide
  - **AI Enhancement:** Structured data improves AI understanding
  - **PDF Generation:** Easy field extraction for legal documents
  - **No Migration:** Kept existing Supabase schema, just improved data structure
- **Outcome:** Person information now collected in separate, validated fields with structured storage
- **Commits:**
  - "Update Round 1 questions to request complete person information"
  - "Implement multi-field person input system for structured data collection"

---

## Summary by Phase (Final)
**Phase 1 (Complete):** React + Vite frontend, Node.js + Express backend, dual workflows, global styling  
**Phase 2 (Complete):** Supabase authentication, user profiles, protected routes, RLS policies  
**Phase 3 (Complete):** Google Gemini AI integration, multi-round questionnaires, rate limiting, timeout handling, anti-repetition mechanisms, automated retry for empty responses  
**Phase 4 (Complete):** PDF generation with PDFKit, Supabase Storage, legal formatting, download functionality  
**Phase 5 (Complete):** Email sharing via SendGrid, comprehensive user data deletion, individual will deletion, notifications system, **age verification for legal compliance**  
**Phase 6 (Complete):** **Tooltip help system**, **Help button placeholder**, **user profile context for AI**, **multi-field person input system**  

---

**Last Updated:** November 22, 2025  
**Status:** All core features complete, UX enhancements implemented - production-ready
