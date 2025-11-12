import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            &copy; {currentYear} Legal Will Generation Tool - University of Calgary Academic Project
          </p>
          <p className="footer-disclaimer">
            This is an academic project and does not constitute legal advice.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
          <a 
            href="https://github.com/yourusername/legal-will-tool" 
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
