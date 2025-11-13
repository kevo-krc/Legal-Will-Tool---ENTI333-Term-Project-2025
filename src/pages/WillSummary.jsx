import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import axios from 'axios';
import './WillSummary.css';

function WillSummary() {
  const { willId } = useParams();
  const navigate = useNavigate();
  
  const [will, setWill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDFs, setGeneratingPDFs] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [downloadUrls, setDownloadUrls] = useState(null);

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
      
      // Auto-download both PDFs
      if (response.data.downloadUrls.willPdf) {
        window.open(response.data.downloadUrls.willPdf, '_blank');
      }
      
      if (response.data.downloadUrls.assessmentPdf) {
        setTimeout(() => {
          window.open(response.data.downloadUrls.assessmentPdf, '_blank');
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
      
      const response = await axios.get(`${API_URL}/wills/${willId}/download-pdfs`);
      
      setDownloadUrls(response.data.downloadUrls);
      
      // Auto-download both PDFs
      if (response.data.downloadUrls.willPdf) {
        window.open(response.data.downloadUrls.willPdf, '_blank');
      }
      
      if (response.data.downloadUrls.assessmentPdf) {
        setTimeout(() => {
          window.open(response.data.downloadUrls.assessmentPdf, '_blank');
        }, 500);
      }
      
    } catch (err) {
      console.error('[PDF Download] Error:', err);
      setPdfError(err.response?.data?.error || 'Failed to download PDFs. Please try again.');
    } finally {
      setGeneratingPDFs(false);
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
                <strong>Account Number:</strong> {will.account_number}
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
                      {generatingPDFs ? 'Loading...' : 'Download PDF Documents'}
                    </button>
                    <button 
                      onClick={handleGeneratePDFs}
                      className="btn btn-secondary" 
                      disabled={generatingPDFs}
                      style={{ marginLeft: '10px' }}
                    >
                      {generatingPDFs ? 'Regenerating...' : 'Regenerate PDFs'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="qa-review-section">
              <h3>Your Responses</h3>
              {will.qa_data && will.qa_data.map((round, roundIdx) => (
                <div key={roundIdx} className="round-review">
                  <h4>Round {round.round}</h4>
                  {round.questions && round.questions.map((q, qIdx) => (
                    <div key={qIdx} className="qa-item">
                      <p className="question-text"><strong>Q:</strong> {q.question}</p>
                      <p className="answer-text">
                        <strong>A:</strong> {
                          Array.isArray(round.answers[q.id])
                            ? round.answers[q.id].join(', ')
                            : round.answers[q.id] || 'Not answered'
                        }
                      </p>
                    </div>
                  ))}
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
