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
              <p className="text-light mb-3">
                Your questionnaire is complete! In Phase 4, you'll be able to:
              </p>
              <ul className="next-steps-list">
                <li>Generate your official will document (PDF)</li>
                <li>Generate your legal assessment document (PDF)</li>
                <li>Download and email your documents</li>
                <li>Manage and update your will</li>
              </ul>
              
              <div className="action-buttons">
                <button 
                  onClick={() => navigate('/dashboard')} 
                  className="btn btn-secondary"
                >
                  Return to Dashboard
                </button>
                <button 
                  className="btn btn-primary" 
                  disabled
                  title="Coming in Phase 4"
                >
                  Generate PDF Documents
                </button>
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
