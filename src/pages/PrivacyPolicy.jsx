import React, { useEffect } from 'react';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-policy-page">
      <div className="container">
        <div className="privacy-policy-content">
          <h1>Academic Project Privacy Notice & Disclaimer</h1>
          
          <div className="policy-meta">
            <p><strong>Effective Date:</strong> November 13, 2025</p>
            <p><strong>Last Updated:</strong> November 13, 2025</p>
          </div>

          <section className="policy-section">
            <h2>1. Academic Project Status & Legal Disclaimer</h2>
            <p>
              This application, <strong>Legal Will Generation Tool</strong>, is a <strong>student academic project</strong> created 
              for the course <strong>ENTI333</strong> at the University of Calgary.
            </p>
            <p className="disclaimer-text">
              <strong>THIS IS NOT A PRODUCTION SERVICE AND DOES NOT CONSTITUTE LEGAL ADVICE.</strong> The application is intended 
              solely for demonstrating AI-driven legal document creation functionality and meeting academic requirements.
            </p>

            <h3>Important Limitations</h3>
            <ul>
              <li><strong>Not Legal Advice:</strong> This tool does not provide legal advice. It generates draft legal documents based on user input and AI analysis.</li>
              <li><strong>No Attorney-Client Relationship:</strong> Use of this application does not create an attorney-client relationship.</li>
              <li><strong>No Liability:</strong> The application owners, developers, and the University of Calgary assume <strong>NO legal liability</strong> for the validity, enforceability, or legal consequences of any documents generated using this tool.</li>
              <li><strong>Professional Review Recommended:</strong> All generated documents should be reviewed by a qualified legal professional before use.</li>
              <li><strong>Academic Purpose Only:</strong> This application is designed for academic evaluation and demonstration purposes.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>2. Information Collection and Use</h2>
            <p>
              This application collects and processes <strong>highly sensitive personal data</strong> strictly for the purpose of 
              generating legal will documents and assessments. We take data privacy very seriously.
            </p>

            <h3>2.1 Data We Collect</h3>
            <ul>
              <li><strong>Personal Information:</strong> Full name, email address, phone number, home address, date of birth</li>
              <li><strong>Legal Information:</strong> Marital status, spouse name, children details (names and ages)</li>
              <li><strong>Estate Planning Data:</strong>
                <ul>
                  <li>Executor and alternate executor information</li>
                  <li>Beneficiary details and distribution percentages</li>
                  <li>Guardian information for minor children</li>
                  <li>Asset information (real estate, financial assets, digital assets)</li>
                  <li>Specific bequests and funeral preferences</li>
                </ul>
              </li>
              <li><strong>Legal Documents:</strong> Generated will PDFs and assessment documents</li>
              <li><strong>Account Data:</strong> Questionnaire responses, consent acknowledgments, disclaimer acceptance</li>
              <li><strong>Technical Data:</strong> Account numbers (auto-generated), authentication tokens, session data</li>
            </ul>

            <h3>2.2 How We Use Your Data</h3>
            <ul>
              <li><strong>Document Generation:</strong> Create personalized legal will and assessment documents</li>
              <li><strong>Compliance Verification:</strong> Perform jurisdiction-specific legal compliance checks</li>
              <li><strong>AI Processing:</strong> Generate region-specific questions using Google Gemini AI</li>
              <li><strong>Communication:</strong> Send generated documents via email when requested</li>
              <li><strong>Data Management:</strong> Provide access to stored information via the dashboard</li>
            </ul>

            <h3>2.3 Third-Party Services</h3>
            <p>
              <strong>NO personal data is shared, sold, or distributed to advertising partners or analytics providers.</strong> We use:
            </p>
            <ul>
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Google Gemini AI:</strong> Question generation and legal analysis (API calls only)</li>
              <li><strong>SendGrid:</strong> Email delivery service for document sharing</li>
              <li><strong>Replit:</strong> Application hosting platform</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Data Retention and Deletion</h2>

            <h3>3.1 Storage Location</h3>
            <ul>
              <li><strong>Database:</strong> Supabase PostgreSQL database (encrypted at rest)</li>
              <li><strong>File Storage:</strong> Supabase Storage with private access controls</li>
            </ul>

            <h3>3.2 Retention Policy</h3>
            <ul>
              <li><strong>User Consent Required:</strong> Data stored only after accepting legal disclaimer</li>
              <li><strong>Indefinite Storage:</strong> Data retained indefinitely unless you request deletion</li>
              <li><strong>No Automatic Expiration:</strong> Documents remain accessible until you delete them</li>
            </ul>

            <h3>3.3 Your Right to Delete</h3>
            <p>You have <strong>complete control</strong> over your data:</p>
            <ul>
              <li><strong>How to Delete:</strong> Access "Danger Zone" in Dashboard</li>
              <li><strong>What Gets Deleted:</strong> Profile, will documents, PDFs, questionnaire responses, auth credentials</li>
              <li><strong>Confirmation:</strong> Email confirmation sent after deletion</li>
              <li><strong>Permanence:</strong> Deletion is <strong>permanent and irreversible</strong></li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Security Measures</h2>

            <h3>4.1 Data Protection</h3>
            <ul>
              <li><strong>Encryption at Rest:</strong> All database records and files encrypted</li>
              <li><strong>Encryption in Transit:</strong> HTTPS/SSL (TLS 1.2+)</li>
              <li><strong>Secure Authentication:</strong> JWT-based authentication</li>
              <li><strong>Password Security:</strong> Hashed and salted (never stored in plain text)</li>
            </ul>

            <h3>4.2 Access Controls</h3>
            <ul>
              <li><strong>Row-Level Security:</strong> Users can only access their own data</li>
              <li><strong>Authentication Required:</strong> All endpoints require valid tokens</li>
              <li><strong>Authorization Checks:</strong> Server-side validation for all operations</li>
            </ul>

            <h3>4.3 Application Security</h3>
            <ul>
              <li><strong>Input Validation:</strong> All inputs validated and sanitized</li>
              <li><strong>Rate Limiting:</strong> Email sharing limited to 5 per hour per user</li>
              <li><strong>CORS Protection:</strong> Restricted to authorized domains</li>
            </ul>

            <h3>4.4 Privacy by Design</h3>
            <ul>
              <li><strong>Minimal Data Collection:</strong> Only necessary information collected</li>
              <li><strong>No Tracking:</strong> No analytics or tracking beyond essential functionality</li>
              <li><strong>Private Storage:</strong> PDFs with signed URLs (1-hour expiration)</li>
              <li><strong>User Control:</strong> You control when and how documents are shared</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Your Rights and Choices</h2>

            <h3>5.1 Access and Control</h3>
            <ul>
              <li><strong>View Your Data:</strong> Access all information via Dashboard</li>
              <li><strong>Email Documents:</strong> Share PDFs via email at any time</li>
              <li><strong>Update Information:</strong> Edit profile through Dashboard</li>
              <li><strong>Delete Account:</strong> Permanently delete via "Danger Zone"</li>
            </ul>

            <h3>5.2 Email Communications</h3>
            <ul>
              <li><strong>Document Delivery Only:</strong> Emails sent only when you request</li>
              <li><strong>No Marketing:</strong> No promotional emails</li>
              <li><strong>Confirmation Emails:</strong> Account deletion confirmations</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Jurisdictional Compliance</h2>

            <h3>Supported Jurisdictions</h3>
            <ul>
              <li><strong>Canada:</strong> All 13 provinces and territories</li>
              <li><strong>United States:</strong> All 50 states</li>
            </ul>

            <h3>Privacy Law Compliance</h3>
            <p>While this is an academic project, we follow privacy best practices:</p>
            <ul>
              <li><strong>Canadian Compliance:</strong> PIPEDA principles</li>
              <li><strong>US Compliance:</strong> State privacy law principles</li>
              <li><strong>Data Minimization:</strong> Only necessary information collected</li>
              <li><strong>Transparency:</strong> Clear disclosure of practices</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>7. Contact Information</h2>
            <p>For questions or concerns regarding this privacy policy:</p>
            <ul>
              <li><strong>Project Team:</strong> ENTI333 Final Project Team</li>
              <li><strong>Institution:</strong> University of Calgary</li>
              <li><strong>Course:</strong> ENTI333 - Final Project</li>
            </ul>
          </section>

          <section className="policy-section acknowledgment">
            <h2>8. Acknowledgment</h2>
            <p>By using the Legal Will Generation Tool, you acknowledge that:</p>
            <ol>
              <li>You have read and understood this Privacy Policy</li>
              <li>You understand this is an academic project, not a production service</li>
              <li>You consent to the collection and processing of your data as described</li>
              <li>You understand generated documents should be reviewed by legal professionals</li>
              <li>You acknowledge developers assume no legal liability for document validity</li>
            </ol>
            <p className="review-date"><strong>Last Review Date:</strong> November 13, 2025</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
