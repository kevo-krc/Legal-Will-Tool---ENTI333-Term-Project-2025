import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img src="/logo.png" alt="Legal Will Generation Tool" className="logo-image" />
          <h1 className="header-title">Legal Will Generation Tool</h1>
        </div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <span className="nav-link" style={{ color: '#FACC15' }}>
                {profile?.full_name || user.email}
              </span>
              <button onClick={signOut} className="nav-link btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link btn btn-primary">Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
