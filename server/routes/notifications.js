const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { authenticateUser } = require('../middleware/auth');

router.get('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.authenticatedUserId;
    
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    res.json(notifications || []);
  } catch (error) {
    console.error('[Notifications] Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.get('/unread-count', authenticateUser, async (req, res) => {
  try {
    const userId = req.authenticatedUserId;
    
    const { data, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    
    res.json({ count: data || 0 });
  } catch (error) {
    console.error('[Notifications] Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.authenticatedUserId;
    const { type, title, message, action_type, related_id, metadata } = req.body;
    
    if (!type || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields: type, title, message' });
    }
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        action_type: action_type || 'none',
        related_id,
        metadata: metadata || {}
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(notification);
  } catch (error) {
    console.error('[Notifications] Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

router.patch('/:notificationId/read', authenticateUser, async (req, res) => {
  try {
    const userId = req.authenticatedUserId;
    const { notificationId } = req.params;
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error('[Notifications] Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

router.patch('/mark-all-read', authenticateUser, async (req, res) => {
  try {
    const userId = req.authenticatedUserId;
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('[Notifications] Error marking all as read:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

router.delete('/:notificationId', authenticateUser, async (req, res) => {
  try {
    const userId = req.authenticatedUserId;
    const { notificationId } = req.params;
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('[Notifications] Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

router.delete('/', authenticateUser, async (req, res) => {
  try {
    const userId = req.authenticatedUserId;
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'All notifications deleted' });
  } catch (error) {
    console.error('[Notifications] Error deleting all notifications:', error);
    res.status(500).json({ error: 'Failed to delete all notifications' });
  }
});

router.delete('/cleanup/old', authenticateUser, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString());
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Old notifications cleaned up' });
  } catch (error) {
    console.error('[Notifications] Error cleaning up old notifications:', error);
    res.status(500).json({ error: 'Failed to cleanup old notifications' });
  }
});

module.exports = router;
