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
    
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    
    res.json({ count: count || 0 });
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

router.patch('/:notificationId/increment-retry', authenticateUser, async (req, res) => {
  try {
    const userId = req.authenticatedUserId;
    const { notificationId } = req.params;
    
    const { data, error } = await supabase
      .rpc('increment_notification_retry', {
        notification_id: notificationId,
        requesting_user_id: userId,
        max_retries: 3
      });
    
    if (error) {
      if (error.message?.includes('Maximum retry count reached')) {
        return res.status(400).json({ error: 'Maximum retry count reached (3)', retry_count: 3 });
      }
      if (error.message?.includes('not found')) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      if (error.message?.includes('Unauthorized')) {
        return res.status(403).json({ error: 'Unauthorized: cannot modify another user\'s notification' });
      }
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Notification not found or unauthorized' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('[Notifications] Error incrementing retry count:', error);
    res.status(500).json({ error: 'Failed to increment retry count', details: error.message });
  }
});

// IMPORTANT: Specific routes must come BEFORE parameterized routes
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

router.patch('/:notificationId', authenticateUser, async (req, res) => {
  try {
    const userId = req.authenticatedUserId;
    const { notificationId } = req.params;
    const updateData = req.body;
    
    if (updateData.retry_count !== undefined && updateData.retry_count > 3) {
      return res.status(400).json({ error: 'Maximum retry count is 3' });
    }
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .update(updateData)
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
    console.error('[Notifications] Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
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
