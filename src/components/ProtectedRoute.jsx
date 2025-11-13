import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, authError } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '18px',
        color: '#1E3A8A',
        gap: '20px'
      }}>
        <div>Loading...</div>
        <div style={{ fontSize: '14px', color: '#64748B' }}>
          If this takes too long, please refresh the page
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        padding: '20px',
        gap: '20px'
      }}>
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '1px solid #EF4444',
          color: '#991B1B',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginTop: 0 }}>Authentication Error</h3>
          <p>{authError}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#1E3A8A',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Retry
          </button>
          <button 
            onClick={() => navigate('/login')} 
            style={{
              backgroundColor: '#64748B',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
