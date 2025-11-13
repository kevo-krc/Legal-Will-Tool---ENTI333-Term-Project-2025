import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const { user, profile, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });
  const [message, setMessage] = useState('');
  const [wills, setWills] = useState([]);
  const [loadingWills, setLoadingWills] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletingData, setDeletingData] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (user) {
      loadWills();
    } else {
      setLoadingWills(false);
    }
  }, [user]);

  const loadWills = async () => {
    try {
      const response = await axios.get(`${API_URL}/wills/user/${user.id}`);
      setWills(response.data);
      setLoadingWills(false);
    } catch (err) {
      console.error('Error loading wills:', err);
      setLoadingWills(false);
    }
  };

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

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm');
      return;
    }

    try {
      setDeletingData(true);
      setDeleteError(null);

      console.log('[Delete Account] Sending deletion request...');
      
      const response = await axios.delete(`${API_URL}/users/${user.id}/data`, {
        data: { requestingUserId: user.id }
      });
      
      console.log('[Delete Account] Deletion successful:', response.data);
      
      alert(`Account deleted successfully! A confirmation email has been sent to ${response.data.email}`);
      
      await logout();
      navigate('/');
      
    } catch (err) {
      console.error('[Delete Account] Error:', err);
      setDeleteError(err.response?.data?.error || 'Failed to delete account. Please try again.');
    } finally {
      setDeletingData(false);
    }
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
            <button 
              className="btn btn-primary mb-2" 
              style={{ width: '100%' }}
              onClick={() => navigate('/create-will')}
            >
              Create New Will
            </button>
          </div>
        </div>

        <div className="wills-section mt-4">
          <h2 className="mb-3">My Wills</h2>
          
          {loadingWills ? (
            <div className="card">
              <p className="text-light">Loading your wills...</p>
            </div>
          ) : wills.length === 0 ? (
            <div className="card">
              <p className="text-light">You haven't created any wills yet.</p>
              <p className="text-light">Click "Create New Will" above to get started!</p>
            </div>
          ) : (
            <div className="wills-grid">
              {wills.map((will) => (
                <div key={will.id} className="card will-card">
                  <div className="will-header">
                    <h4>Will for {will.jurisdiction_full_name}</h4>
                    <span className={`status-badge ${will.status}`}>
                      {will.status.charAt(0).toUpperCase() + will.status.slice(1)}
                    </span>
                  </div>
                  <div className="will-details">
                    <p><strong>Created:</strong> {new Date(will.created_at).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {will.questionnaire_completed ? 'Completed' : `Round ${will.questionnaire_round} of 3`}</p>
                  </div>
                  <div className="will-actions">
                    {will.questionnaire_completed ? (
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate(`/will-summary/${will.id}`)}
                      >
                        View Summary
                      </button>
                    ) : (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => navigate(`/questionnaire/${will.id}`)}
                      >
                        Continue Questionnaire
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="danger-zone mt-4">
          <div className="card" style={{ borderColor: '#EF4444' }}>
            <h2 style={{ color: '#EF4444', marginBottom: '15px' }}>⚠️ Danger Zone</h2>
            <p className="text-light mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button 
              className="btn"
              style={{
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontWeight: 'bold'
              }}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete My Account & All Data
            </button>
          </div>
        </div>

        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ color: '#EF4444', marginBottom: '20px' }}>
                ⚠️ Permanent Account Deletion
              </h2>
              
              <div style={{
                backgroundColor: '#FEE2E2',
                border: '2px solid #EF4444',
                color: '#991B1B',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontWeight: 'bold'
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                  WARNING: This action CANNOT be undone!
                </p>
                <p style={{ margin: 0, fontWeight: 'normal' }}>
                  All of your data will be permanently deleted, including:
                </p>
                <ul style={{ margin: '10px 0 0 20px', fontWeight: 'normal' }}>
                  <li>Your account and profile information</li>
                  <li>All created wills and assessments</li>
                  <li>All questionnaire responses</li>
                  <li>All generated PDF documents</li>
                </ul>
              </div>

              <p style={{ marginBottom: '20px', color: '#64748B' }}>
                To confirm deletion, type <strong style={{ color: '#EF4444' }}>DELETE</strong> in the box below:
              </p>

              {deleteError && (
                <div style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #EF4444',
                  color: '#991B1B',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '15px'
                }}>
                  {deleteError}
                </div>
              )}

              <input
                type="text"
                placeholder="Type DELETE to confirm"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '20px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                disabled={deletingData}
              />

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmation('');
                    setDeleteError(null);
                  }}
                  className="btn btn-secondary"
                  disabled={deletingData}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="btn"
                  style={{
                    backgroundColor: '#EF4444',
                    color: 'white',
                    border: 'none',
                    fontWeight: 'bold'
                  }}
                  disabled={deletingData || deleteConfirmation !== 'DELETE'}
                >
                  {deletingData ? 'Deleting...' : 'Permanently Delete Everything'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
