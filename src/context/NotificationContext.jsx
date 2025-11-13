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
    isLoading
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
