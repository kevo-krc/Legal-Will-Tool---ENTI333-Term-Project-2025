import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, getSessionToken } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const addToast = useCallback((type, title, message, actionType = 'none', relatedId = null) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = {
      id,
      type,
      title,
      message,
      action_type: actionType,
      related_id: relatedId
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const token = await getSessionToken();
      if (!token) return;

      const response = await axios.get(`${apiUrl}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNotifications(response.data);
    } catch (error) {
      console.error('[Notifications] Error fetching notifications:', error);
    }
  }, [user, apiUrl, getSessionToken]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const token = await getSessionToken();
      if (!token) return;

      const response = await axios.get(`${apiUrl}/api/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('[Notifications] Error fetching unread count:', error);
    }
  }, [user, apiUrl, getSessionToken]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const token = await getSessionToken();
      if (!token) return;

      await axios.patch(
        `${apiUrl}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      fetchUnreadCount();
    } catch (error) {
      console.error('[Notifications] Error marking as read:', error);
    }
  }, [apiUrl, getSessionToken, fetchUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    try {
      const token = await getSessionToken();
      if (!token) return;

      await axios.patch(
        `${apiUrl}/api/notifications/mark-all-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      fetchUnreadCount();
    } catch (error) {
      console.error('[Notifications] Error marking all as read:', error);
    }
  }, [apiUrl, getSessionToken, fetchUnreadCount]);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const token = await getSessionToken();
      if (!token) return;

      await axios.delete(`${apiUrl}/api/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      fetchUnreadCount();
    } catch (error) {
      console.error('[Notifications] Error deleting notification:', error);
    }
  }, [apiUrl, getSessionToken, fetchUnreadCount]);

  const deleteAllNotifications = useCallback(async () => {
    try {
      const token = await getSessionToken();
      if (!token) return;

      await axios.delete(`${apiUrl}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setNotifications([]);
      fetchUnreadCount();
    } catch (error) {
      console.error('[Notifications] Error deleting all notifications:', error);
    }
  }, [apiUrl, getSessionToken, fetchUnreadCount]);

  const retryAction = useCallback(async (notification) => {
    if (!notification.related_id) {
      addToast('error', 'Retry Failed', 'Unable to retry: missing will ID');
      return false;
    }

    const currentRetryCount = notification.retry_count || 0;
    if (currentRetryCount >= 3) {
      addToast('error', 'Maximum Retries Reached', 'You have reached the maximum number of retry attempts (3).');
      return false;
    }

    const token = await getSessionToken();
    if (!token) {
      addToast('error', 'Authentication Required', 'Please log in again to retry this action.');
      return false;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    try {

      if (notification.action_type === 'retry_pdf') {
        addToast('info', 'Retrying...', 'Attempting to regenerate PDF documents...');
        
        const response = await axios.post(
          `${apiUrl}/api/wills/${notification.related_id}/generate-pdfs`,
          {},
          { headers }
        );
        
        await deleteNotification(notification.id);
        
        addToast('success', 'PDF Generation Successful', 'Your will documents have been generated successfully!');
        
        if (response.data.downloadUrls?.willPdf) {
          window.open(response.data.downloadUrls.willPdf, '_blank');
        }
        if (response.data.downloadUrls?.assessmentPdf) {
          setTimeout(() => {
            window.open(response.data.downloadUrls.assessmentPdf, '_blank');
          }, 500);
        }
        
        return true;
      } else if (notification.action_type === 'retry_email') {
        const recipientEmail = notification.metadata?.recipientEmail;
        if (!recipientEmail) {
          addToast('error', 'Retry Failed', 'Unable to retry: missing recipient email');
          return false;
        }

        addToast('info', 'Retrying...', `Attempting to send email to ${recipientEmail}...`);
        
        await axios.post(
          `${apiUrl}/api/wills/${notification.related_id}/share-email`,
          {
            recipientEmail,
            userId: user.id
          },
          { headers }
        );
        
        await deleteNotification(notification.id);
        
        addToast('success', 'Email Sent Successfully', `Will documents have been sent to ${recipientEmail}`);
        
        return true;
      }
    } catch (error) {
      console.error('[Retry] Error:', error);
      
      const errorMessage = error.response?.data?.error || error.message;
      
      try {
        const response = await axios.patch(
          `${apiUrl}/api/notifications/${notification.id}/increment-retry`,
          {},
          { headers }
        );
        
        const newRetryCount = response.data.retry_count || (currentRetryCount + 1);
        
        setNotifications(prev => prev.map(n => 
          n.id === notification.id 
            ? { ...n, retry_count: newRetryCount, action_type: newRetryCount >= 3 ? 'none' : n.action_type }
            : n
        ));
        
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
        
        const canRetryAgain = newRetryCount < 3;
        
        addToast(
          'error',
          'Retry Failed',
          `Attempt ${newRetryCount}/3 failed: ${errorMessage}${canRetryAgain ? ' You can try again.' : ' Maximum retries reached.'}`,
          canRetryAgain ? notification.action_type : 'none',
          notification.related_id
        );
        
        return false;
      } catch (updateError) {
        console.error('[Retry] Failed to increment retry count:', updateError);
        const updateErrorMsg = updateError.response?.data?.error || 'Could not track retry attempt.';
        const isMaxRetries = updateError.response?.data?.error?.includes('Maximum retry count');
        
        if (isMaxRetries) {
          setNotifications(prev => prev.map(n => 
            n.id === notification.id 
              ? { ...n, retry_count: 3, action_type: 'none' }
              : n
          ));
        }
        
        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
        
        addToast(
          'error',
          isMaxRetries ? 'Maximum Retries Reached' : 'Retry Tracking Failed',
          `${updateErrorMsg} ${isMaxRetries ? 'No more retry attempts allowed.' : 'The retry was attempted but not counted. Please refresh and try again if needed.'}`,
          'none',
          notification.related_id
        );
        
        return false;
      }
    }
  }, [apiUrl, user, addToast, deleteNotification, getSessionToken, fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();

      const interval = setInterval(() => {
        fetchNotifications();
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  const value = {
    toasts,
    addToast,
    removeToast,
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    retryAction,
    isLoading
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
