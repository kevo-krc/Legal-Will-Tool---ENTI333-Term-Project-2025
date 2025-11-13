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
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sending, setSending] = useState(false);

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

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const response = await axios.get(`${API_URL}/wills/${willId}/download`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `will_${will.jurisdiction}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloading(false);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF. Please try again.');
      setDownloading(false);
    }
  };

  const handleEmailWill = async () => {
    if (sending) return;
    
    try {
      setSending(true);
      await axios.post(`${API_URL}/wills/${willId}/email`);
      
      alert('Will sent successfully to your email! Please check your inbox (and spam folder).');
    } catch (err) {
      console.error('Error sending email:', err);
      const errorMsg = err.response?.data?.error || 'Failed to send email. Please try again or contact support.';
      alert(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteWill = async () => {
    if (deleting) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete this will? This action cannot be undone. All associated documents will be permanently removed.'
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      const response = await axios.delete(`${API_URL}/wills/${willId}`);
      
      alert(`Will deleted successfully. ${response.data.filesRemoved} file(s) removed from storage.`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting will:', err);
      alert('Failed to delete will. Please try again.');
      setDeleting(false);
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
              <h3>Download Your Will</h3>
              <p className="text-light mb-3">
                Your will document has been generated and is ready for download. This PDF includes your complete questionnaire responses, legal assessment, and important disclaimers.
              </p>
              {will.storage_base_path && will.pdf_filename ? (
                <div className="pdf-available">
                  <p style={{ color: '#10B981', marginBottom: '10px' }}>
                    ✓ PDF Document Available
                  </p>
                </div>
              ) : (
                <p style={{ color: '#F59E0B', marginBottom: '10px' }}>
                  ⚠ PDF generation in progress...
                </p>
              )}
              
              <div className="action-buttons">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn btn-secondary"
                >
                  Return to Dashboard
                </button>
                <button 
                  onClick={handleDownloadPdf}
                  className="btn btn-primary" 
                  disabled={!will.storage_base_path || !will.pdf_filename || downloading}
                >
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </button>
                <button 
                  onClick={handleEmailWill}
                  className="btn btn-primary" 
                  disabled={!will.storage_base_path || !will.pdf_filename || sending}
                  style={{ backgroundColor: '#10B981' }}
                >
                  {sending ? 'Sending...' : 'Email Me My Will'}
                </button>
              </div>
            </div>

            <div className="danger-zone-section" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #EF4444' }}>
              <h3 style={{ color: '#EF4444' }}>Danger Zone</h3>
              <p className="text-light mb-3">
                Deleting this will is permanent. All associated documents and data will be removed from our system.
              </p>
              {willId && (
                <button 
                  onClick={handleDeleteWill}
                  className="btn" 
                  style={{ 
                    backgroundColor: '#EF4444', 
                    color: 'white',
                    border: 'none'
                  }}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete This Will'}
                </button>
              )}
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
