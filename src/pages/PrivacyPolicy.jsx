import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
      <div className="container">
        <div className="card" style={{ maxWidth: '900px', margin: '2rem auto', padding: '2.5rem' }}>
          <h1 className="mb-4">ACADEMIC PROJECT PRIVACY NOTICE & DISCLAIMER</h1>
          <p><strong>Effective Date:</strong> November 11, 2025</p>

          <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <h2>1. ACADEMIC PROJECT STATUS & LEGAL DISCLAIMER</h2>
          <p>
            This application, <strong>Legal Will Generation Tool</strong>, is a <strong>student academic project</strong> created 
            for the course <strong>ENTI333</strong> at the University of Calgary.
          </p>
          <p className="text-accent" style={{ fontWeight: 'bold' }}>
            THIS IS NOT A PRODUCTION SERVICE AND DOES NOT CONSTITUTE LEGAL ADVICE.
          </p>
          <p>
            The application is intended solely for demonstrating AI-driven product functionality and meeting academic requirements.
          </p>
          <p>
            <strong>This document is a placeholder.</strong> It is intended to fulfill the technical requirement of displaying 
            a Privacy Policy link within the application's user interface. It is not a legally binding agreement and should 
            not be relied upon as such.
          </p>

          <h2 className="mt-4">2. INFORMATION COLLECTION AND USE</h2>
          <p>
            This application collects and processes <strong>highly sensitive personal data</strong> (names, addresses, 
            asset information, guardian information) strictly for the purpose of generating the legal will document 
            and the final assessment.
          </p>
          <ul>
            <li><strong>Data Collected:</strong> User inputs (Q&A data), home address, date of birth (DOB), and asset details.</li>
            <li><strong>Purpose:</strong> To dynamically generate the Legal Will Document and Assessment Document, and to 
            perform region/age-based compliance checks.</li>
            <li><strong>Third-Party Sharing:</strong> <strong>NO personal data is shared, sold, or distributed to any external 
            third parties</strong>, including advertising partners or analytics providers. The only external service utilized 
            is Supabase for secure storage, which is governed by the service's own privacy policies.</li>
          </ul>

          <h2 className="mt-4">3. DATA RETENTION AND DELETION</h2>
          <p>We recognize the highly sensitive nature of the data involved in will creation.</p>
          <ul>
            <li><strong>Storage Location:</strong> All Q&A data and generated documents are stored securely in a 
            dedicated <strong>Supabase</strong> database.</li>
            <li><strong>Retention:</strong> Data is retained only with explicit user consent, as acknowledged when 
            accepting the initial disclaimer.</li>
            <li><strong>Deletion:</strong> Users have the right to request the complete deletion of their account and 
            all associated personal and document data at any time via the user account management screen.</li>
          </ul>

          <h2 className="mt-4">4. SECURITY MEASURES</h2>
          <p>The application employs the following technical safeguards, implemented via the Node.js backend:</p>
          <ul>
            <li><strong>Encryption:</strong> Data is stored using encryption-at-rest provided by the Supabase service.</li>
            <li><strong>Access Control:</strong> Row-Level Security (RLS) is used to ensure users can only access their own data.</li>
            <li><strong>Secure Transport:</strong> All communication between the front-end (React) and back-end 
            (Node.js/Supabase) is secured via HTTPS/SSL.</li>
          </ul>

          <h2 className="mt-4">5. CONTACT INFORMATION</h2>
          <p>For all questions regarding this privacy notice or the security of the application, please contact the project developer:</p>
          <ul>
            <li><strong>Project Developer:</strong> Kevin Cooney</li>
            <li><strong>Contact Email:</strong> kevin.cooney@ucalgary.ca</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
