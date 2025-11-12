import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Create Your Legal Will with AI Guidance</h1>
            <p className="hero-subtitle">
              A free, accessible tool for creating legally compliant wills for Canada and the USA
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="text-center mb-4">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">1</div>
              <h3>Register & Profile Setup</h3>
              <p>Create an account and enter your basic information securely</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">2</div>
              <h3>Legal Compliance Check</h3>
              <p>Receive jurisdiction-specific legal requirements and disclaimers</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">3</div>
              <h3>AI-Guided Questionnaire</h3>
              <p>Answer customized questions tailored to your jurisdiction</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">4</div>
              <h3>Generate Documents</h3>
              <p>Receive your will and legal assessment as PDF documents</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">5</div>
              <h3>Download & Share</h3>
              <p>Download or email your documents securely</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon">6</div>
              <h3>Manage Your Data</h3>
              <p>Full control over your data with deletion options</p>
            </div>
          </div>
        </div>
      </section>

      <section className="disclaimer-section">
        <div className="container">
          <div className="card disclaimer-card">
            <h3 className="text-center">Important Notice</h3>
            <p className="text-center">
              This is an academic project for demonstration purposes only. 
              It does not constitute legal advice. Always consult with a qualified 
              attorney for legal matters concerning your estate.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
