import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await updateProfile(formData);
    
    if (error) {
      setMessage('Failed to update profile');
    } else {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="mb-4">Dashboard</h1>
        
        <div className="dashboard-grid">
          <div className="card">
            <h3>Profile Information</h3>
            
            {message && (
              <div style={{
                backgroundColor: message.includes('success') ? '#D1FAE5' : '#FEE2E2',
                border: `1px solid ${message.includes('success') ? '#10B981' : '#EF4444'}`,
                color: message.includes('success') ? '#065F46' : '#991B1B',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                {message}
              </div>
            )}

            {!isEditing ? (
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Account Number:</strong>
                  <p style={{ color: '#FACC15', fontSize: '18px', margin: '5px 0' }}>
                    {profile?.account_number || 'Loading...'}
                  </p>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Full Name:</strong>
                  <p>{profile?.full_name || 'Not set'}</p>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Email:</strong>
                  <p>{user?.email}</p>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Phone:</strong>
                  <p>{profile?.phone || 'Not set'}</p>
                </div>
                <button 
                  onClick={() => {
                    setFormData({
                      full_name: profile?.full_name || '',
                      phone: profile?.phone || ''
                    });
                    setIsEditing(true);
                  }} 
                  className="btn btn-secondary"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="full_name">Full Name</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="card">
            <h3>Quick Actions</h3>
            <p className="text-light mb-3">Create and manage your legal will documents</p>
            <button className="btn btn-primary mb-2" style={{ width: '100%' }} disabled>
              Create New Will
            </button>
            <button className="btn btn-secondary mb-2" style={{ width: '100%' }} disabled>
              View My Documents
            </button>
            <p className="text-light" style={{ fontSize: '14px', marginTop: '20px' }}>
              <em>Will creation features coming in Phase 3</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
