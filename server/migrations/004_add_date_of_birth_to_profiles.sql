-- Add date_of_birth column to profiles table for age verification
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Add comment to document the purpose
COMMENT ON COLUMN profiles.date_of_birth IS 'User date of birth for legal age verification in will creation';
