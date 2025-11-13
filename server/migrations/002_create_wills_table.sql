-- Create wills table for storing will documents and questionnaire data
CREATE TABLE IF NOT EXISTS wills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  
  -- User Information
  user_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- Jurisdiction Information
  country VARCHAR(10) NOT NULL CHECK (country IN ('CA', 'US')),
  jurisdiction VARCHAR(100) NOT NULL,
  jurisdiction_full_name VARCHAR(255) NOT NULL,
  
  -- Legal Compliance
  compliance_statement TEXT,
  compliance_generated_at TIMESTAMPTZ,
  
  -- Questionnaire Data (JSON format)
  qa_data JSONB DEFAULT '[]'::jsonb,
  questionnaire_round INTEGER DEFAULT 1 CHECK (questionnaire_round >= 1 AND questionnaire_round <= 3),
  questionnaire_completed BOOLEAN DEFAULT false,
  
  -- Will Content
  will_content TEXT,
  assessment_content TEXT,
  
  -- PDF Paths (stored in Supabase Storage)
  will_pdf_path VARCHAR(500),
  assessment_pdf_path VARCHAR(500),
  
  -- Disclaimer and Consent
  disclaimer_accepted BOOLEAN DEFAULT false,
  disclaimer_accepted_at TIMESTAMPTZ,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_wills_user_id ON wills(user_id);

-- Create index on account_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_wills_account_number ON wills(account_number);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_wills_status ON wills(status);

-- Enable Row Level Security
ALTER TABLE wills ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view only their own wills
CREATE POLICY "Users can view own wills"
  ON wills
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own wills
CREATE POLICY "Users can insert own wills"
  ON wills
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update only their own wills
CREATE POLICY "Users can update own wills"
  ON wills
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete only their own wills
CREATE POLICY "Users can delete own wills"
  ON wills
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_wills_updated_at
  BEFORE UPDATE ON wills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
