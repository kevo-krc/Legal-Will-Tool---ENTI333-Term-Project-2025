import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';

const NotificationPanel = ({ onClose }) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    retryAction
  } = useNotifications();
  const navigate = useNavigate();
  const [loadingActions, setLoadingActions] = React.useState({});

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const handleAction = async (notification) => {
    if (loadingActions[notification.id]) return;
    
    if (notification.action_type === 'retry_email' || notification.action_type === 'retry_pdf') {
      setLoadingActions(prev => ({ ...prev, [notification.id]: true }));
      try {
        const success = await retryAction(notification);
        if (success) {
          onClose();
        }
      } finally {
        setLoadingActions(prev => ({ ...prev, [notification.id]: false }));
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
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

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="notification-panel">
      <div className="notification-panel-header">
        <h3 className="notification-panel-title">Notifications</h3>
        <div className="notification-panel-actions">
          {notifications.some((n) => !n.is_read) && (
            <button className="panel-action-btn" onClick={markAllAsRead}>
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="panel-action-btn" onClick={deleteAllNotifications}>
              Clear all
            </button>
          )}
        </div>
      </div>
      <div className="notification-panel-list">
        {notifications.length === 0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">🔔</div>
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={`notification-type-icon ${notification.type}`}>
                {getTypeIcon(notification.type)}
              </div>
              <div className="notification-item-content">
                <div className="notification-item-header">
                  <h4 className="notification-item-title">{notification.title}</h4>
                  <span className="notification-item-time">
                    {getTimeAgo(notification.created_at)}
                  </span>
                </div>
                <p className="notification-item-message">{notification.message}</p>
                {notification.action_type && notification.action_type !== 'none' && (
                  <div className="notification-item-actions">
                    <button
                      className="notification-action-btn primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(notification);
                      }}
                      disabled={loadingActions[notification.id]}
                      style={{ 
                        opacity: loadingActions[notification.id] ? 0.6 : 1, 
                        cursor: loadingActions[notification.id] ? 'not-allowed' : 'pointer' 
                      }}
                    >
                      {loadingActions[notification.id] ? 'Processing...' : (
                        <>
                          {notification.action_type === 'retry_email' && 'Retry Email'}
                          {notification.action_type === 'retry_pdf' && 'Retry PDF'}
                          {notification.action_type === 'download' && 'Download'}
                        </>
                      )}
                    </button>
                    <button
                      className="notification-action-btn secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      disabled={loadingActions[notification.id]}
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
