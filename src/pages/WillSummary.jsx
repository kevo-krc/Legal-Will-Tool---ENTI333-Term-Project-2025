import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import './WillSummary.css';

function WillSummary() {
  const { willId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { fetchNotifications } = useNotifications();
  
  const [will, setWill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDFs, setGeneratingPDFs] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [downloadUrls, setDownloadUrls] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState(null);

  useEffect(() => {
    loadWill();
  }, [willId]);

  const loadWill = async () => {
    try {
      const response = await axios.get(`${API_URL}/wills/${willId}`);
      setWill(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading will:', err);
      setLoading(false);
    }
  };
  
  const handleGeneratePDFs = async () => {
    try {
      setGeneratingPDFs(true);
      setPdfError(null);
      
      console.log('[PDF Generation] Requesting PDF generation for will:', willId);
      
      const response = await axios.post(`${API_URL}/wills/${willId}/generate-pdfs`);
      
      console.log('[PDF Generation] PDFs generated successfully:', response.data);
      
      setDownloadUrls(response.data.downloadUrls);
      setWill(response.data.will);
      
      // Download both PDFs using anchor elements to avoid popup blockers
      if (response.data.downloadUrls.willPdf) {
        const willLink = document.createElement('a');
        willLink.href = response.data.downloadUrls.willPdf;
        willLink.download = 'will.pdf';
        willLink.target = '_blank';
        document.body.appendChild(willLink);
        willLink.click();
        document.body.removeChild(willLink);
      }
      
      if (response.data.downloadUrls.assessmentPdf) {
        setTimeout(() => {
          const assessmentLink = document.createElement('a');
          assessmentLink.href = response.data.downloadUrls.assessmentPdf;
          assessmentLink.download = 'assessment.pdf';
          assessmentLink.target = '_blank';
          document.body.appendChild(assessmentLink);
          assessmentLink.click();
          document.body.removeChild(assessmentLink);
        }, 500);
      }
      
    } catch (err) {
      console.error('[PDF Generation] Error:', err);
      setPdfError(err.response?.data?.error || 'Failed to generate PDFs. Please try again.');
    } finally {
      setGeneratingPDFs(false);
    }
  };
  
  const handleDownloadPDFs = async () => {
    try {
      setGeneratingPDFs(true);
      setPdfError(null);
      
      console.log('[PDF Download] Fetching PDF URLs...');
      const response = await axios.get(`${API_URL}/wills/${willId}/download-pdfs`);
      
      console.log('[PDF Download] Response:', {
        hasWillPdf: !!response.data.downloadUrls.willPdf,
        hasAssessmentPdf: !!response.data.downloadUrls.assessmentPdf
      });
      
      setDownloadUrls(response.data.downloadUrls);
      
      // Generate user-friendly filenames
      const userName = will?.profile?.full_name || 'User';
      const safeUserName = userName.replace(/[^a-zA-Z0-9]/g, '_');
      const currentDate = new Date();
      const formattedDate = `${currentDate.getMonth() + 1}_${currentDate.getDate()}_${currentDate.getFullYear()}`;
      
      // Download both PDFs using anchor elements to avoid popup blockers
      if (response.data.downloadUrls.willPdf) {
        console.log('[PDF Download] Downloading will.pdf...');
        const willLink = document.createElement('a');
        willLink.href = response.data.downloadUrls.willPdf;
        willLink.download = `Will_${safeUserName}_${formattedDate}.pdf`;
        willLink.target = '_blank';
        document.body.appendChild(willLink);
        willLink.click();
        document.body.removeChild(willLink);
      }
      
      if (response.data.downloadUrls.assessmentPdf) {
        console.log('[PDF Download] Scheduling assessment.pdf download...');
        setTimeout(() => {
          console.log('[PDF Download] Downloading assessment.pdf...');
          const assessmentLink = document.createElement('a');
          assessmentLink.href = response.data.downloadUrls.assessmentPdf;
          assessmentLink.download = `Assessment_${safeUserName}_${formattedDate}.pdf`;
          assessmentLink.target = '_blank';
          document.body.appendChild(assessmentLink);
          assessmentLink.click();
          document.body.removeChild(assessmentLink);
        }, 500);
      } else {
        console.warn('[PDF Download] No assessment PDF URL found!');
      }
      
    } catch (err) {
      console.error('[PDF Download] Error:', err);
      setPdfError(err.response?.data?.error || 'Failed to download PDFs. Please try again.');
    } finally {
      setGeneratingPDFs(false);
    }
  };
  
  const handleShareEmail = () => {
    setShowEmailModal(true);
    setEmailSuccess(false);
    setEmailError(null);
    setEmailAddress('');
  };
  
  const handleSendEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailAddress || !emailRegex.test(emailAddress)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    try {
      setSendingEmail(true);
      setEmailError(null);
      
      console.log('[Email Share] Sending will documents to:', emailAddress);
      
      const response = await axios.post(`${API_URL}/wills/${willId}/share-email`, {
        recipientEmail: emailAddress,
        userId: will.user_id
      });
      
      console.log('[Email Share] Email sent successfully:', response.data);
      
      setEmailSuccess(true);
      
      // Refresh notifications to show the email success notification immediately
      console.log('[Notifications] Calling fetchNotifications after email send');
      if (fetchNotifications) {
        // Add a small delay to ensure backend has created the notification
        setTimeout(async () => {
          await fetchNotifications();
          console.log('[Notifications] fetchNotifications completed');
        }, 500);
      } else {
        console.error('[Notifications] fetchNotifications is not available');
      }
      
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('[Email Share] Error:', err);
      setEmailError(err.response?.data?.error || 'Failed to send email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="will-summary-page">
        <div className="container">
          <div className="loading-state">
            <p>Loading will summary...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!will) {
    return (
      <div className="will-summary-page">
        <div className="container">
          <div className="error-state">
            <p>Will not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="will-summary-page">
      <div className="container">
        <div className="summary-container">
          <div className="card">
            <div className="summary-header">
              <h2>Will Assessment & Summary</h2>
              <div className="status-badge">Questionnaire Completed</div>
            </div>

            <div className="info-section">
              <h3>Jurisdiction Information</h3>
              <p>
                <strong>Location:</strong> {will.jurisdiction_full_name}, {will.country === 'CA' ? 'Canada' : 'United States'}
              </p>
              <p>
                <strong>Account Number:</strong> {profile?.account_number || 'Loading...'}
              </p>
            </div>

            <div className="assessment-section">
              <h3>Legal Assessment</h3>
              <div className="assessment-content">
                {will.assessment_content}
              </div>
            </div>

            <div className="next-steps-section">
              <h3>Next Steps</h3>
              
              {pdfError && (
                <div className="error-message" style={{ 
                  padding: '12px', 
                  marginBottom: '16px', 
                  backgroundColor: '#fee', 
                  border: '1px solid #fcc',
                  borderRadius: '4px',
                  color: '#c33'
                }}>
                  {pdfError}
                </div>
              )}
              
              {will && !will.will_pdf_path && (
                <>
                  <p className="text-light mb-3">
                    Your questionnaire is complete! Generate your official legal documents:
                  </p>
                  <ul className="next-steps-list">
                    <li>Generate your official will document (PDF)</li>
                    <li>Generate your legal assessment document (PDF)</li>
                    <li>Download both documents for your records</li>
                    <li>Review with a licensed attorney before execution</li>
                  </ul>
                </>
              )}
              
              {will && will.will_pdf_path && (
                <>
                  <p className="text-light mb-3" style={{ color: '#0a0' }}>
                    ✓ Your PDF documents have been generated successfully!
                  </p>
                  <ul className="next-steps-list">
                    <li>Download your documents using the button below</li>
                    <li>Review the will document carefully</li>
                    <li>Consult with a licensed attorney before signing</li>
                    <li>Follow the witness requirements for your jurisdiction</li>
                  </ul>
                </>
              )}
              
              <div className="action-buttons">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn btn-secondary"
                >
                  Return to Dashboard
                </button>
                
                {will && !will.will_pdf_path ? (
                  <button 
                    onClick={handleGeneratePDFs}
                    className="btn btn-primary" 
                    disabled={generatingPDFs}
                  >
                    {generatingPDFs ? 'Generating PDFs...' : 'Generate PDF Documents'}
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleDownloadPDFs}
                      className="btn btn-primary" 
                      disabled={generatingPDFs}
                    >
                      {generatingPDFs ? 'Loading...' : 'View Will'}
                    </button>
                    <button 
                      onClick={handleShareEmail}
                      className="btn btn-secondary" 
                      style={{ marginLeft: '10px' }}
                    >
                      Share via Email
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {showEmailModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '8px',
                  maxWidth: '500px',
                  width: '90%'
                }}>
                  <h3 style={{ marginTop: 0, color: '#1E3A8A' }}>Share Will Documents via Email</h3>
                  
                  {emailSuccess ? (
                    <div style={{
                      backgroundColor: '#D1FAE5',
                      border: '1px solid #10B981',
                      color: '#065F46',
                      padding: '15px',
                      borderRadius: '4px',
                      marginBottom: '20px'
                    }}>
                      ✓ Email sent successfully!
                    </div>
                  ) : (
                    <>
                      <div style={{
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #F59E0B',
                        color: '#92400E',
                        padding: '12px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '14px'
                      }}>
                        <strong>⚠️ Privacy Notice:</strong> Your will documents contain sensitive legal and personal information. 
                        Only share with trusted recipients. Email is not encrypted.
                      </div>
                      
                      <p style={{ color: '#64748B', marginBottom: '20px' }}>
                        Both the Will PDF and Assessment PDF will be sent as email attachments. 
                        Please verify the email address carefully before sending.
                      </p>
                      
                      {emailError && (
                        <div style={{
                          backgroundColor: '#FEE2E2',
                          border: '1px solid #EF4444',
                          color: '#991B1B',
                          padding: '12px',
                          borderRadius: '4px',
                          marginBottom: '15px'
                        }}>
                          {emailError}
                        </div>
                      )}
                      
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontWeight: 'bold',
                          color: '#1E3A8A'
                        }}>
                          Recipient Email Address:
                        </label>
                        <input
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="example@email.com"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            fontSize: '16px'
                          }}
                          disabled={sendingEmail}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setShowEmailModal(false)}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#E5E7EB',
                            color: '#374151',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                          disabled={sendingEmail}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSendEmail}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#1E3A8A',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: sendingEmail ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            opacity: sendingEmail ? 0.6 : 1
                          }}
                          disabled={sendingEmail}
                        >
                          {sendingEmail ? 'Sending...' : 'Send Email'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="qa-review-section">
              <h3>Your Responses</h3>
              {will.qa_data && will.qa_data.map((round, roundIdx) => (
                <div key={roundIdx} className="round-review">
                  <h4>Round {round.round}</h4>
                  {round.questions && round.questions.map((q, qIdx) => {
                    const answer = round.answers[q.id];
                    let displayAnswer;
                    
                    if (!answer || answer === '') {
                      displayAnswer = 'Not answered';
                    } else if (Array.isArray(answer)) {
                      displayAnswer = answer.join(', ');
                    } else if (typeof answer === 'object') {
                      // Format person objects (name, relationship, age, address)
                      const parts = [];
                      if (answer.name) parts.push(`Name: ${answer.name}`);
                      if (answer.relationship) parts.push(`Relationship: ${answer.relationship}`);
                      if (answer.age) parts.push(`Age: ${answer.age}`);
                      if (answer.address) parts.push(`Address: ${answer.address}`);
                      displayAnswer = parts.join(', ');
                    } else {
                      displayAnswer = answer;
                    }
                    
                    return (
                      <div key={qIdx} className="qa-item">
                        <p className="question-text"><strong>Q:</strong> {q.question}</p>
                        <p className="answer-text">
                          <strong>A:</strong> {displayAnswer}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WillSummary;
