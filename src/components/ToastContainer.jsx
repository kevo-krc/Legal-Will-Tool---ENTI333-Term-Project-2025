import React from 'react';
import Toast from './Toast';
import './Toast.css';

const ToastContainer = ({ toasts, onClose, onAction }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          notification={toast}
          onClose={onClose}
          onAction={onAction}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
