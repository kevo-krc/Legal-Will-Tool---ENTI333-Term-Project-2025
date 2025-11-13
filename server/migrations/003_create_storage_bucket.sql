-- Create storage bucket for will PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('will-documents', 'will-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload their own will documents
CREATE POLICY "Users can upload their own will documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'will-documents' 
  AND (storage.foldername(name))[1] = CONCAT('user_', auth.uid()::text)
);

-- Policy: Users can view their own will documents
CREATE POLICY "Users can view their own will documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'will-documents' 
  AND (storage.foldername(name))[1] = CONCAT('user_', auth.uid()::text)
);

-- Policy: Users can update their own will documents
CREATE POLICY "Users can update their own will documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'will-documents' 
  AND (storage.foldername(name))[1] = CONCAT('user_', auth.uid()::text)
);

-- Policy: Users can delete their own will documents
CREATE POLICY "Users can delete their own will documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'will-documents' 
  AND (storage.foldername(name))[1] = CONCAT('user_', auth.uid()::text)
);
