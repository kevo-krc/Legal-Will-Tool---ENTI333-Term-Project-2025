import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ notification, onClose, onAction }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
      case 'email_failure':
      case 'pdf_failure':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast ${notification.type} ${isExiting ? 'exiting' : ''}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        <h4 className="toast-title">{notification.title}</h4>
        <p className="toast-message">{notification.message}</p>
        {notification.action_type && notification.action_type !== 'none' && onAction && (
          <div className="toast-actions">
            <button
              className="toast-action-btn primary"
              onClick={() => {
                onAction(notification);
                handleClose();
              }}
            >
              {notification.action_type === 'retry_email' && 'Retry Email'}
              {notification.action_type === 'retry_pdf' && 'Retry PDF'}
              {notification.action_type === 'download' && 'Download'}
            </button>
          </div>
        )}
      </div>
      <button className="toast-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;
