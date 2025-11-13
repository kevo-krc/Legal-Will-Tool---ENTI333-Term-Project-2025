import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';
import axios from 'axios';
import './Questionnaire.css';

function Questionnaire() {
  const { willId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [will, setWill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [showConsentScreen, setShowConsentScreen] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [allAnswers, setAllAnswers] = useState([]);

  useEffect(() => {
    loadWill();
  }, [willId]);

  const loadWill = async () => {
    try {
      const response = await axios.get(`${API_URL}/wills/${willId}`);
      const willData = response.data;
      
      const roundNumber = willData.questionnaire_round || 1;
      const qaData = willData.qa_data || [];
      
      setWill(willData);
      setCurrentRound(roundNumber);
      setAllAnswers(qaData);
      
      if (willData.questionnaire_completed) {
        navigate(`/will-summary/${willId}`);
        return;
      }

      if (!willData.disclaimer_accepted) {
        setShowConsentScreen(true);
        setConsentAccepted(false);
        setLoading(false);
        return;
      }

      setConsentAccepted(true);
      setShowConsentScreen(false);

      if (roundNumber === 1 && qaData.length === 0) {
        await loadInitialQuestions(willData);
      } else if (qaData.length > 0) {
        if (qaData.length < roundNumber) {
          await loadFollowUpQuestionsForResume(qaData, willData, roundNumber);
        } else {
          const lastRoundQuestions = qaData[qaData.length - 1]?.questions || [];
          setQuestions(lastRoundQuestions);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading will:', err);
      setError('Failed to load will data');
      setLoading(false);
    }
  };

  const loadFollowUpQuestionsForResume = async (qaData, willData, roundNumber) => {
    try {
      const response = await axios.post(`${API_URL}/ai/questions/followup`, {
        previousAnswers: qaData,
        jurisdiction: willData.jurisdiction_full_name,
        country: willData.country,
        roundNumber: roundNumber
      });

      setQuestions(response.data.questions);
      setAnswers({});
    } catch (err) {
      console.error('Error loading follow-up questions:', err);
      const retryInfo = err.response?.data?.retryMetadata || {};
      const retryMessage = retryInfo.attempts > 1 
        ? ` (Attempted ${retryInfo.attempts} times over ${Math.round((retryInfo.totalWaitMs || 0) / 1000)}s)`
        : '';
      if (err.response?.status === 503) {
        setError(`Google AI service is temporarily overloaded. Please wait 30-60 seconds and try again.${retryMessage}`);
      } else {
        setError(`Failed to generate follow-up questions${retryMessage}`);
      }
    }
  };

  const handleAcceptConsent = async () => {
    try {
      console.log('[Consent] Starting consent acceptance...');
      console.log('[Consent] Will ID:', willId);
      console.log('[Consent] Profile:', profile);
      
      setSubmitting(true);
      setError('');
      
      console.log('[Consent] Sending PUT request to update disclaimer_accepted...');
      const updateResponse = await axios.put(`${API_URL}/wills/${willId}`, {
        disclaimer_accepted: true,
        disclaimer_accepted_at: new Date().toISOString()
      });
      console.log('[Consent] PUT response:', updateResponse.data);
      
      setConsentAccepted(true);
      setShowConsentScreen(false);
      
      const updatedWill = { ...will, disclaimer_accepted: true };
      setWill(updatedWill);
      
      const qaData = updatedWill.qa_data || [];
      const roundNumber = updatedWill.questionnaire_round || 1;
      
      console.log('[Consent] QA Data length:', qaData.length);
      console.log('[Consent] Round number:', roundNumber);
      
      if (qaData.length === 0 && roundNumber === 1) {
        console.log('[Consent] Loading initial questions...');
        await loadInitialQuestions(updatedWill);
      } else if (qaData.length > 0) {
        if (qaData.length < roundNumber) {
          console.log('[Consent] Loading follow-up questions for resume...');
          await loadFollowUpQuestionsForResume(qaData, updatedWill, roundNumber);
        } else {
          console.log('[Consent] Loading existing questions from QA data...');
          const lastRoundQuestions = qaData[qaData.length - 1]?.questions || [];
          setQuestions(lastRoundQuestions);
        }
      }
      
      console.log('[Consent] Consent acceptance completed successfully!');
      setSubmitting(false);
    } catch (err) {
      console.error('[Consent] Error accepting consent:', err);
      console.error('[Consent] Error details:', err.response?.data);
      console.error('[Consent] Error status:', err.response?.status);
      setError('Failed to save consent. Please try again.');
      setSubmitting(false);
    }
  };

  const loadInitialQuestions = async (willData) => {
    try {
      const userName = profile?.full_name || profile?.display_name || 'User';
      
      const response = await axios.post(`${API_URL}/ai/questions/initial`, {
        jurisdiction: willData.jurisdiction_full_name,
        country: willData.country,
        userName: userName
      });
      
      setQuestions(response.data.questions);
    } catch (err) {
      console.error('Error loading questions:', err);
      const retryInfo = err.response?.data?.retryMetadata || {};
      const retryMessage = retryInfo.attempts > 1 
        ? ` (Attempted ${retryInfo.attempts} times over ${Math.round((retryInfo.totalWaitMs || 0) / 1000)}s)`
        : '';
      if (err.response?.status === 503) {
        setError(`Google AI service is temporarily overloaded. Please wait 30-60 seconds and try again.${retryMessage}`);
      } else {
        setError(`Failed to generate questions${retryMessage}`);
      }
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSubmitRound = async () => {
    const unansweredRequired = questions.filter(
      q => q.required && !answers[q.id]
    );

    if (unansweredRequired.length > 0) {
      setError('Please answer all required questions');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const roundData = {
        round: currentRound,
        questions: questions,
        answers: answers
      };

      const updatedQAData = [...allAnswers, roundData];

      await axios.put(`${API_URL}/wills/${willId}`, {
        qa_data: updatedQAData,
        questionnaire_round: currentRound,
        status: 'in_progress'
      });

      if (currentRound >= 3) {
        await completeQuestionnaire(updatedQAData);
      } else {
        await loadFollowUpQuestions(updatedQAData);
      }
    } catch (err) {
      console.error('Error submitting round:', err);
      setError('Failed to submit answers');
      setSubmitting(false);
    }
  };

  const loadFollowUpQuestions = async (qaData) => {
    try {
      const nextRound = currentRound + 1;
      
      const response = await axios.post(`${API_URL}/ai/questions/followup`, {
        previousAnswers: qaData,
        jurisdiction: will.jurisdiction_full_name,
        country: will.country,
        roundNumber: nextRound
      });

      await axios.put(`${API_URL}/wills/${willId}`, {
        questionnaire_round: nextRound
      });

      setQuestions(response.data.questions);
      setAnswers({});
      setCurrentRound(nextRound);
      setAllAnswers(qaData);
      setSubmitting(false);
    } catch (err) {
      console.error('Error loading follow-up questions:', err);
      const retryInfo = err.response?.data?.retryMetadata || {};
      const retryMessage = retryInfo.attempts > 1 
        ? ` (Attempted ${retryInfo.attempts} times over ${Math.round((retryInfo.totalWaitMs || 0) / 1000)}s)`
        : '';
      if (err.response?.status === 503) {
        setError(`Google AI service is temporarily overloaded. Please wait 30-60 seconds and try again.${retryMessage}`);
      } else {
        setError(`Failed to generate follow-up questions${retryMessage}`);
      }
      setSubmitting(false);
    }
  };

  const completeQuestionnaire = async (qaData) => {
    try {
      const assessmentResponse = await axios.post(`${API_URL}/ai/assessment`, {
        allAnswers: qaData,
        jurisdiction: will.jurisdiction_full_name,
        country: will.country
      });

      await axios.put(`${API_URL}/wills/${willId}`, {
        questionnaire_completed: true,
        assessment_content: assessmentResponse.data.assessment,
        status: 'completed'
      });

      navigate(`/will-summary/${willId}`);
    } catch (err) {
      console.error('Error completing questionnaire:', err);
      const retryInfo = err.response?.data?.retryMetadata || {};
      const retryMessage = retryInfo.attempts > 1 
        ? ` (Attempted ${retryInfo.attempts} times over ${Math.round((retryInfo.totalWaitMs || 0) / 1000)}s)`
        : '';
      if (err.response?.status === 503) {
        setError(`Google AI service is temporarily overloaded. Please wait 30-60 seconds and try again.${retryMessage}`);
      } else {
        setError(`Failed to generate assessment${retryMessage}`);
      }
      setSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            id={question.id}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={question.id}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
            min="0"
          />
        );

      case 'boolean':
        return (
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name={question.id}
                value="yes"
                checked={answers[question.id] === 'yes'}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                required={question.required}
              />
              Yes
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name={question.id}
                value="no"
                checked={answers[question.id] === 'no'}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                required={question.required}
              />
              No
            </label>
          </div>
        );

      case 'textarea':
        return (
          <textarea
            id={question.id}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
            rows="4"
          />
        );

      case 'select':
        return (
          <select
            id={question.id}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options && question.options.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'multi-select':
        return (
          <div className="checkbox-group">
            {question.options && question.options.map((option, idx) => (
              <label key={idx} className="checkbox-label">
                <input
                  type="checkbox"
                  value={option}
                  checked={(answers[question.id] || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = answers[question.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    handleAnswerChange(question.id, newValues);
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="questionnaire-page">
        <div className="container">
          <div className="loading-state">
            <p>Loading questionnaire...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!will) {
    return (
      <div className="questionnaire-page">
        <div className="container">
          <div className="error-state">
            <p>Will not found</p>
          </div>
        </div>
      </div>
    );
  }

  if (showConsentScreen) {
    return (
      <div className="questionnaire-page">
        <div className="container">
          <div className="questionnaire-container">
            <div className="card">
              <div className="questionnaire-header">
                <h2>Legal Compliance & Disclaimer</h2>
                <p className="text-light">
                  {will.jurisdiction_full_name}, {will.country === 'CA' ? 'Canada' : 'United States'}
                </p>
              </div>

              <div className="compliance-box mb-4">
                <h3>Requirements for a Valid Will in Your Jurisdiction</h3>
                <div className="compliance-text" style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>
                  {will.compliance_statement}
                </div>

                <div style={{ 
                  background: '#fff3cd', 
                  border: '2px solid #856404', 
                  padding: '1.5rem', 
                  borderRadius: '8px',
                  marginTop: '2rem'
                }}>
                  <h3 style={{ color: '#856404', marginTop: 0 }}>⚠️ Important Disclaimer</h3>
                  <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>
                    This tool is for academic and informational purposes only. It is NOT a substitute for professional legal advice.
                  </p>
                  <ul style={{ marginBottom: 0 }}>
                    <li>This tool and its creators assume <strong>NO legal liability whatsoever</strong></li>
                    <li>The generated will may not meet all legal requirements in your jurisdiction</li>
                    <li>Laws vary significantly by location and change over time</li>
                    <li>You <strong>MUST consult a licensed attorney</strong> before signing or executing any will</li>
                    <li>Do not rely on this tool for legal decisions affecting your estate</li>
                  </ul>
                </div>
              </div>

              {error && (
                <div className="error-message mb-3">
                  {error}
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                  By clicking "I Accept and Understand" below, you acknowledge that you have read and understood the legal requirements and disclaimer above.
                </p>
                <button
                  onClick={handleAcceptConsent}
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
                >
                  {submitting ? 'Processing...' : 'I Accept and Understand - Begin Questionnaire'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="questionnaire-page">
      <div className="container">
        <div className="questionnaire-container">
          <div className="card">
            <div className="questionnaire-header">
              <h2>Will Questionnaire - Round {currentRound} of 3</h2>
              <p className="text-light">
                {will.jurisdiction_full_name}, {will.country === 'CA' ? 'Canada' : 'United States'}
              </p>
            </div>

            {error && (
              <div className="error-message mb-3">
                {error}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSubmitRound(); }}>
              {questions.map((question, index) => (
                <div key={question.id} className="form-group">
                  <label htmlFor={question.id}>
                    {index + 1}. {question.question}
                    {question.required && <span className="required">*</span>}
                  </label>
                  {renderQuestion(question)}
                </div>
              ))}

              <div className="questionnaire-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting 
                    ? 'Processing...' 
                    : currentRound >= 3 
                      ? 'Complete & Generate Assessment' 
                      : 'Continue to Next Round'}
                </button>
              </div>

              <div className="progress-indicator">
                Round {currentRound} of 3 completed
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;
