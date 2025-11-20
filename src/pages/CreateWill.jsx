import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JURISDICTIONS, getJurisdictions } from '../data/jurisdictions';
import { API_URL } from '../config/api';
import axios from 'axios';
import { supabase } from '../lib/supabase';
import './CreateWill.css';

function CreateWill() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsDOB, setNeedsDOB] = useState(false);
  
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    country: '',
    jurisdiction: ''
  });

  useEffect(() => {
    if (profile && !profile.date_of_birth) {
      setNeedsDOB(true);
    } else if (profile && profile.date_of_birth) {
      setFormData(prev => ({ ...prev, dateOfBirth: profile.date_of_birth }));
      setNeedsDOB(false);
    }
  }, [profile]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDOBSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.dateOfBirth) {
      setError('Please enter your date of birth');
      return;
    }

    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    
    if (birthDate > today) {
      setError('Date of birth cannot be in the future');
      return;
    }

    const age = calculateAge(formData.dateOfBirth);
    if (age > 120) {
      setError('Please enter a valid date of birth');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ date_of_birth: formData.dateOfBirth })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await refreshProfile();
      setNeedsDOB(false);
      setStep(2);
    } catch (err) {
      console.error('Error saving date of birth:', err);
      setError('Failed to save date of birth. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    setFormData({
      ...formData,
      country: e.target.value,
      jurisdiction: ''
    });
  };

  const handleJurisdictionChange = (e) => {
    setFormData({
      ...formData,
      jurisdiction: e.target.value
    });
  };

  const handleNext = async () => {
    if (!formData.country || !formData.jurisdiction) {
      setError('Please select both country and jurisdiction');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const jurisdictionName = getJurisdictions(formData.country).find(
        j => j.code === formData.jurisdiction
      )?.name;

      const dob = profile.date_of_birth || formData.dateOfBirth;
      const age = calculateAge(dob);

      const willData = {
        user_id: user.id,
        account_number: profile.account_number,
        user_name: profile.full_name,
        email: user.email,
        phone: profile.phone,
        country: formData.country,
        jurisdiction: formData.jurisdiction,
        jurisdiction_full_name: jurisdictionName
      };

      const willResponse = await axios.post(`${API_URL}/wills`, willData);
      const will = willResponse.data;

      const complianceResponse = await axios.post(`${API_URL}/ai/compliance`, {
        jurisdiction: jurisdictionName,
        country: formData.country,
        age: age
      });

      await axios.put(`${API_URL}/wills/${will.id}`, {
        compliance_statement: complianceResponse.data.compliance_statement,
        compliance_generated_at: complianceResponse.data.generated_at
      });

      navigate(`/questionnaire/${will.id}`);
    } catch (err) {
      console.error('Error creating will:', err);
      
      const retryInfo = err.response?.data?.retryMetadata || {};
      const retryMessage = retryInfo.attempts > 1 
        ? ` (Attempted ${retryInfo.attempts} times over ${Math.round(retryInfo.totalWaitMs / 1000)}s)`
        : '';
      
      if (err.response?.status === 429) {
        const errorData = err.response.data;
        if (errorData.errorType === 'RPM') {
          setError(`Rate limit exceeded: Too many requests per minute (max 10/min). Please wait a moment and try again.${retryMessage}`);
        } else if (errorData.errorType === 'RPD') {
          setError(`Daily quota exceeded: You have used all 250 AI requests for today. The quota resets at midnight Pacific Time. Please try again tomorrow.${retryMessage}`);
        } else {
          setError(`AI service quota exceeded: ${errorData.error || 'Please try again later.'}${retryMessage}`);
        }
      } else if (err.response?.status === 503) {
        setError(`Google AI service is temporarily overloaded. This is a temporary issue on Google's end. Please wait 30-60 seconds and try again.${retryMessage}`);
      } else {
        setError(`Failed to generate legal compliance statement. Please try again.${retryMessage}`);
      }
      
      setLoading(false);
    }
  };

  const jurisdictions = formData.country ? getJurisdictions(formData.country) : [];

  if (needsDOB) {
    return (
      <div className="create-will-page">
        <div className="container">
          <div className="create-will-container">
            <div className="card">
              <h2 className="text-center mb-3">Before We Begin</h2>
              <p className="text-center text-light mb-4">
                We need your date of birth to verify legal age requirements for your jurisdiction
              </p>

              {error && (
                <div style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #EF4444',
                  color: '#991B1B',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleDOBSubmit}>
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <small style={{ display: 'block', marginTop: '8px', color: '#6B7280' }}>
                    This information is used to determine age-related legal requirements for will creation
                  </small>
                </div>

                <div className="info-box mb-3">
                  <p>
                    <strong>Why we need this:</strong> Age requirements for creating a valid will vary by jurisdiction.
                    Even if you're underage, you can still continue - we'll note this in your legal assessment.
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Continue'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-will-page">
      <div className="container">
        <div className="create-will-container">
          <div className="card">
            <h2 className="text-center mb-3">Create Your Legal Will</h2>
            <p className="text-center text-light mb-4">
              Let's start by determining the legal requirements for your jurisdiction
            </p>

            {error && (
              <div style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #EF4444',
                color: '#991B1B',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}

            <div className="progress-bar mb-4">
              <div className="progress-step active">
                <div className="progress-circle">1</div>
                <div className="progress-label">Jurisdiction</div>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className="progress-circle">2</div>
                <div className="progress-label">Compliance</div>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className="progress-circle">3</div>
                <div className="progress-label">Questionnaire</div>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  required
                >
                  <option value="">Select a country</option>
                  <option value="CA">Canada</option>
                  <option value="US">United States</option>
                </select>
              </div>

              {formData.country && (
                <div className="form-group">
                  <label htmlFor="jurisdiction">
                    {formData.country === 'CA' ? 'Province/Territory' : 'State'}
                  </label>
                  <select
                    id="jurisdiction"
                    value={formData.jurisdiction}
                    onChange={handleJurisdictionChange}
                    required
                  >
                    <option value="">
                      Select a {formData.country === 'CA' ? 'province/territory' : 'state'}
                    </option>
                    {jurisdictions.map(j => (
                      <option key={j.code} value={j.code}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="info-box mb-3">
                <p>
                  <strong>Important:</strong> The legal requirements for wills vary by jurisdiction.
                  We will generate a compliance statement specific to your selected location.
                </p>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Continue to Compliance Statement'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWill;
