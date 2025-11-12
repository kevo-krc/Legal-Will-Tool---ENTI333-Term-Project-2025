import React from 'react';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="mb-4">Dashboard</h1>
        
        <div className="dashboard-grid">
          <div className="card">
            <h3>Welcome Back!</h3>
            <p>This is your dashboard where you can manage your will documents and personal data.</p>
            <p className="text-light">Feature implementation in progress...</p>
          </div>

          <div className="card">
            <h3>Quick Actions</h3>
            <button className="btn btn-primary mb-2" style={{ width: '100%' }}>
              Create New Will
            </button>
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              View My Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
