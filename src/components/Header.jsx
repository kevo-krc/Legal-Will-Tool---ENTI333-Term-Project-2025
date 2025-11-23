import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import './Header.css';

function Header() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img src="/logo.png" alt="Legal Will Generation Tool" className="logo-image" />
          <h1 className="header-title">Legal Will Generation Tool</h1>
        </div>
        <nav className={`header-nav ${!user ? 'header-nav-logged-out' : ''}`}>
          <div className="nav-tabs">
            <Link to="/" className={`nav-tab ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            {user && (
              <Link to="/dashboard" className={`nav-tab ${isActive('/dashboard') ? 'active' : ''}`}>
                Dashboard
              </Link>
            )}
          </div>
          <div className="nav-user-controls">
            {user ? (
              <>
                <NotificationBell />
                <span className="nav-username">
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
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
