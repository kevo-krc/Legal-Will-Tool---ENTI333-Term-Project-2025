-- Add storage fields to wills table for PDF storage
ALTER TABLE wills
ADD COLUMN IF NOT EXISTS storage_base_path TEXT,
ADD COLUMN IF NOT EXISTS pdf_filename VARCHAR(255);

-- Add comment for documentation
COMMENT ON COLUMN wills.storage_base_path IS 'Base storage path format: will-documents/user_{user_id}/will_{will_id}';
COMMENT ON COLUMN wills.pdf_filename IS 'PDF filename (e.g., draft.pdf)';
