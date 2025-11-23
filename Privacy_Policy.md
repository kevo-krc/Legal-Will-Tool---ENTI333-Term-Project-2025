# ACADEMIC PROJECT PRIVACY NOTICE & DISCLAIMER

**Effective Date:** November 13, 2025  
**Last Updated:** November 23, 2025

---

## 1. ACADEMIC PROJECT STATUS & LEGAL DISCLAIMER

This application, **Legal Will Generation Tool**, is a **student academic project** created for the course **ENTI333** at the University of Calgary.

**THIS IS NOT A PRODUCTION SERVICE AND DOES NOT CONSTITUTE LEGAL ADVICE.** The application is intended solely for demonstrating AI-driven legal document creation functionality and meeting academic requirements.

### Important Limitations

- **Not Legal Advice**: This tool does not provide legal advice. It generates draft legal documents based on user input and AI analysis.
- **No Attorney-Client Relationship**: Use of this application does not create an attorney-client relationship.
- **No Liability**: The application owners, developers, and the University of Calgary assume **NO legal liability** for the validity, enforceability, or legal consequences of any documents generated using this tool.
- **Professional Review Recommended**: All generated documents should be reviewed by a qualified legal professional before use.
- **Academic Purpose Only**: This application is designed for academic evaluation and demonstration purposes.

---

## 2. INFORMATION COLLECTION AND USE

This application collects and processes **highly sensitive personal data** strictly for the purpose of generating legal will documents and assessments. We take data privacy very seriously.

### 2.1 Data We Collect

* **Personal Information**: Full name, email address, phone number, home address, date of birth
* **Legal Information**: Marital status, spouse name, children details (names and ages)
* **Estate Planning Data**: 
  - Executor and alternate executor information
  - Beneficiary details and distribution percentages
  - Guardian information for minor children
  - Asset information (real estate, financial assets, digital assets)
  - Specific bequests and funeral preferences
* **Legal Documents**: Generated will PDFs and assessment documents
* **Account Data**: Questionnaire responses (Q&A data), consent acknowledgments, disclaimer acceptance records
* **Technical Data**: Account numbers (auto-generated), authentication tokens, session data

### 2.2 How We Use Your Data

* **Document Generation**: To create your personalized legal will and assessment documents
* **Compliance Verification**: To perform jurisdiction-specific legal compliance checks based on your location and age
* **AI Processing**: To generate region-specific questions and analyze responses using Google Gemini AI
* **Communication**: To send generated documents via email when requested
* **Data Management**: To provide access to your stored information via the dashboard

### 2.3 Third-Party Services

**NO personal data is shared, sold, or distributed to advertising partners or analytics providers.** We use the following third-party services:

* **Supabase**: Database and authentication services (governed by their [privacy policy](https://supabase.com/privacy))
* **Google Gemini AI**: AI-powered question generation and legal analysis (API calls only, no data retention by Google)
* **SendGrid**: Email delivery service for document sharing (governed by their [privacy policy](https://www.twilio.com/legal/privacy))
* **Replit**: Application hosting platform

---

## 3. DATA RETENTION AND DELETION

We recognize the highly sensitive nature of the data involved in will creation and provide comprehensive data management controls.

### 3.1 Storage Location

* **Database**: All user data, Q&A responses, and metadata stored in Supabase PostgreSQL database
* **File Storage**: Generated PDF documents stored in Supabase Storage with private access controls
* **Encryption**: All data encrypted at rest using Supabase's encryption services

### 3.2 Retention Policy

* **User Consent Required**: Data is stored only after you explicitly accept the legal disclaimer and consent to data collection
* **Indefinite Storage**: Data is retained indefinitely unless you request deletion
* **No Automatic Expiration**: Your will documents and account data remain accessible until you delete them

### 3.3 Your Right to Delete

You have **complete control** over your data:

* **How to Delete**: Access the "Danger Zone" section in your Dashboard to delete your account and all associated data
* **What Gets Deleted**: 
  - Your user profile and account information
  - All created will documents and assessment PDFs
  - All questionnaire responses and Q&A data
  - All generated PDF files from storage
  - Your authentication credentials and account access
* **Confirmation**: You will receive an email confirmation after successful deletion
* **Permanence**: Data deletion is **permanent and irreversible**
* **Immediate Effect**: Deleted data is immediately removed from our systems and cannot be recovered

---

## 4. SECURITY MEASURES

The application employs comprehensive technical safeguards to protect your sensitive data:

### 4.1 Data Protection

* **Encryption at Rest**: All database records and stored files encrypted using Supabase's encryption services
* **Encryption in Transit**: All communication secured via HTTPS/SSL (TLS 1.2+)
* **Secure Authentication**: JWT-based authentication with session tokens
* **Password Security**: Passwords hashed and salted by Supabase Auth (never stored in plain text)

### 4.2 Access Controls

* **Row-Level Security (RLS)**: Database policies ensure users can only access their own data
* **Authentication Required**: All endpoints require valid authentication tokens
* **Authorization Checks**: Server-side validation ensures users can only modify their own resources

### 4.3 Application Security

* **Input Validation**: All user inputs validated and sanitized to prevent injection attacks
* **Rate Limiting**: Email sharing limited to 5 emails per hour per user to prevent abuse
* **CORS Protection**: Cross-origin requests restricted to authorized domains

### 4.4 Privacy by Design

* **Minimal Data Collection**: We only collect data necessary for will generation
* **No Tracking**: No analytics, cookies, or tracking scripts beyond essential functionality
* **Private Storage**: PDF documents stored in private buckets with signed URLs (1-hour expiration)
* **User Control**: You control when and how your documents are shared

---

## 5. YOUR RIGHTS AND CHOICES

### 5.1 Access and Control

* **View Your Data**: Access all stored information via your Dashboard
* **Email Documents**: Share generated will and assessment PDFs via email at any time
* **Update Information**: Edit your profile information (name, phone) through the Dashboard
* **Delete Account**: Permanently delete all data through the "Danger Zone" section

### 5.2 Email Communications

* **Document Delivery Only**: We only send emails when you request to share documents
* **No Marketing**: We do not send promotional or marketing emails
* **Confirmation Emails**: You receive email confirmations for account deletion

### 5.3 Consent Withdrawal

* **How to Withdraw**: Delete your account to withdraw consent for data processing
* **Effect**: All data will be permanently deleted and you will lose access to the application

---

## 6. JURISDICTIONAL COMPLIANCE

### 6.1 Supported Jurisdictions

This application supports will creation for:
* **Canada**: All 13 provinces and territories
* **United States**: All 50 states

Legal compliance checks are performed based on your home address to ensure jurisdiction-specific requirements are met.

### 6.2 Privacy Law Compliance

While this is an academic project, we strive to follow privacy best practices:
* **Canadian Compliance**: Follows principles from PIPEDA (Personal Information Protection and Electronic Documents Act)
* **US Compliance**: Follows principles from state privacy laws
* **Data Minimization**: Collect only necessary information
* **Transparency**: Clear disclosure of data practices
* **User Control**: Robust data deletion and access controls

---

## 7. CHANGES TO THIS PRIVACY POLICY

We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.

* **Notification**: Material changes will be communicated via email or prominent notice in the application
* **Effective Date**: Changes take effect on the updated "Effective Date" shown at the top of this document
* **Continued Use**: Your continued use of the application after changes constitutes acceptance of the updated policy

---

## 8. CONTACT INFORMATION

For questions, concerns, or requests regarding this privacy policy or the security of your data, please contact:

* **Project Team**: ENTI333 Final Project Team
* **Institution**: University of Calgary
* **Course**: ENTI333 - Final Project

---

## 9. ACKNOWLEDGMENT

By using the Legal Will Generation Tool, you acknowledge that:

1. You have read and understood this Privacy Policy
2. You understand this is an academic project, not a production service
3. You consent to the collection and processing of your data as described
4. You understand that generated documents should be reviewed by legal professionals
5. You acknowledge the developers assume no legal liability for document validity or outcomes

**Last Review Date**: November 23, 2025