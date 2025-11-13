-- Migration: Create atomic retry increment function with user authorization
-- Description: This function safely increments the retry_count for notifications
--              while enforcing user ownership and preventing race conditions.
-- Created: 2025-11-13

-- Drop ALL existing function signatures (for idempotency and security)
-- This ensures legacy insecure versions are completely removed
DROP FUNCTION IF EXISTS increment_notification_retry(UUID, INTEGER);
DROP FUNCTION IF EXISTS increment_notification_retry(UUID, UUID, INTEGER);

-- Create the atomic retry increment function
CREATE OR REPLACE FUNCTION increment_notification_retry(
  notification_id UUID, 
  requesting_user_id UUID,
  max_retries INTEGER
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  type VARCHAR,
  title VARCHAR,
  message TEXT,
  is_read BOOLEAN,
  action_type VARCHAR,
  related_id UUID,
  metadata JSONB,
  retry_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) 
SECURITY INVOKER
AS $$
DECLARE
  current_count INTEGER;
  notification_owner UUID;
BEGIN
  -- Lock the notification row and fetch current retry count and owner
  -- FOR UPDATE prevents concurrent modifications
  SELECT notifications.retry_count, notifications.user_id 
  INTO current_count, notification_owner
  FROM notifications
  WHERE notifications.id = notification_id
  FOR UPDATE;
  
  -- Check if notification exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Notification not found';
  END IF;
  
  -- Enforce user authorization - users can only increment their own notifications
  IF notification_owner != requesting_user_id THEN
    RAISE EXCEPTION 'Unauthorized: cannot increment retry count for another user''s notification';
  END IF;
  
  -- Check if maximum retries already reached
  IF current_count >= max_retries THEN
    RAISE EXCEPTION 'Maximum retry count reached';
  END IF;
  
  -- Atomically increment retry count (capped at max_retries)
  RETURN QUERY
  UPDATE notifications
  SET retry_count = LEAST(notifications.retry_count + 1, max_retries)
  WHERE notifications.id = notification_id
  RETURNING notifications.*;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users (Supabase)
-- Note: SECURITY INVOKER ensures RLS policies still apply
-- Must specify full function signature with parameter types
GRANT EXECUTE ON FUNCTION increment_notification_retry(uuid, uuid, integer) TO authenticated;

-- Comments for documentation
COMMENT ON FUNCTION increment_notification_retry IS 
  'Atomically increments notification retry_count with user authorization. 
   Uses SELECT FOR UPDATE to prevent race conditions.
   Enforces user ownership - users can only increment their own notifications.
   Maximum retry count is enforced (typically 3).';
