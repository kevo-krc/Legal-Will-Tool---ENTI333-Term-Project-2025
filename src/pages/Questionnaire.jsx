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
      if (err.response?.status === 503) {
        setError('Google AI service is temporarily overloaded. Please wait 30-60 seconds and try again.');
      } else {
        setError('Failed to generate follow-up questions');
      }
    }
  };

  const loadInitialQuestions = async (willData) => {
    try {
      const response = await axios.post(`${API_URL}/ai/questions/initial`, {
        jurisdiction: willData.jurisdiction_full_name,
        country: willData.country,
        userName: willData.user_name
      });
      
      setQuestions(response.data.questions);
    } catch (err) {
      console.error('Error loading questions:', err);
      if (err.response?.status === 503) {
        setError('Google AI service is temporarily overloaded. Please wait 30-60 seconds and try again.');
      } else {
        setError('Failed to generate questions');
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
      if (err.response?.status === 503) {
        setError('Google AI service is temporarily overloaded. Please wait 30-60 seconds and try again.');
      } else {
        setError('Failed to generate follow-up questions');
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
      if (err.response?.status === 503) {
        setError('Google AI service is temporarily overloaded. Please wait 30-60 seconds and try again.');
      } else {
        setError('Failed to generate assessment');
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

            <div className="compliance-box mb-4">
              <h3>Legal Compliance Information</h3>
              <div className="compliance-text">
                {will.compliance_statement}
              </div>
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
