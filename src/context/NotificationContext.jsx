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
      const unread = response.data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('[Notifications] Error fetching notifications:', error);
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
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('[Notifications] Error marking as read:', error);
    }
  }, [apiUrl, getSessionToken]);

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
      setUnreadCount(0);
    } catch (error) {
      console.error('[Notifications] Error marking all as read:', error);
    }
  }, [apiUrl, getSessionToken]);

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
      const deletedNotif = notifications.find((n) => n.id === notificationId);
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('[Notifications] Error deleting notification:', error);
    }
  }, [apiUrl, getSessionToken, notifications]);

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
      setUnreadCount(0);
    } catch (error) {
      console.error('[Notifications] Error deleting all notifications:', error);
    }
  }, [apiUrl, getSessionToken]);

  const retryAction = useCallback(async (notification) => {
    if (!notification.related_id) {
      addToast('error', 'Retry Failed', 'Unable to retry: missing will ID');
      return;
    }

    const currentRetryCount = notification.retry_count || 0;
    if (currentRetryCount >= 3) {
      addToast('error', 'Maximum Retries Reached', 'You have reached the maximum number of retry attempts (3).');
      return;
    }

    try {
      if (notification.action_type === 'retry_pdf') {
        addToast('info', 'Retrying...', 'Attempting to regenerate PDF documents...');
        
        const response = await axios.post(`${apiUrl}/wills/${notification.related_id}/generate-pdfs`);
        
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
        
        await axios.post(`${apiUrl}/wills/${notification.related_id}/share-email`, {
          recipientEmail,
          userId: user.id
        });
        
        await deleteNotification(notification.id);
        
        addToast('success', 'Email Sent Successfully', `Will documents have been sent to ${recipientEmail}`);
        
        return true;
      }
    } catch (error) {
      console.error('[Retry] Error:', error);
      
      const newRetryCount = currentRetryCount + 1;
      const errorMessage = error.response?.data?.error || error.message;
      
      addToast(
        'error',
        'Retry Failed',
        `Attempt ${newRetryCount}/3 failed: ${errorMessage}`,
        newRetryCount < 3 ? notification.action_type : 'none',
        notification.related_id
      );
      
      return false;
    }
  }, [apiUrl, user, addToast, deleteNotification]);

  useEffect(() => {
    if (user) {
      fetchNotifications();

      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

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
