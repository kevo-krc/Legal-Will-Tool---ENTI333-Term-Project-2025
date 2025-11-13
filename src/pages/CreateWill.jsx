import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JURISDICTIONS, getJurisdictions } from '../data/jurisdictions';
import { API_URL } from '../config/api';
import axios from 'axios';
import './CreateWill.css';

function CreateWill() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    country: '',
    jurisdiction: ''
  });

  const handleCountryChange = (e) => {
    setFormData({
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
        country: formData.country
      });

      await axios.put(`${API_URL}/wills/${will.id}`, {
        compliance_statement: complianceResponse.data.compliance_statement,
        compliance_generated_at: complianceResponse.data.generated_at
      });

      navigate(`/questionnaire/${will.id}`);
    } catch (err) {
      console.error('Error creating will:', err);
      
      if (err.response?.status === 429) {
        const errorData = err.response.data;
        if (errorData.errorType === 'RPM') {
          setError('Rate limit exceeded: Too many requests per minute (max 10/min). Please wait a moment and try again.');
        } else if (errorData.errorType === 'RPD') {
          setError('Daily quota exceeded: You have used all 250 AI requests for today. The quota resets at midnight Pacific Time. Please try again tomorrow.');
        } else {
          setError(`AI service quota exceeded: ${errorData.error || 'Please try again later.'}`);
        }
      } else {
        setError('Failed to create will. Please try again.');
      }
      
      setLoading(false);
    }
  };

  const jurisdictions = formData.country ? getJurisdictions(formData.country) : [];

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
