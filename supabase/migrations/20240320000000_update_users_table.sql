-- Update users table with new fields
ALTER TABLE users
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS subscription_plan TEXT CHECK (subscription_plan IN ('basic', 'standard', 'premium')),
ADD COLUMN IF NOT EXISTS referral_code TEXT,
ADD COLUMN IF NOT EXISTS activation_token UUID,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS activated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for activation token
CREATE INDEX IF NOT EXISTS idx_users_activation_token ON users(activation_token);

-- Create index for referral code
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

-- Update existing users to be active
UPDATE users SET is_active = TRUE WHERE is_active IS NULL;

-- Add RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy for users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy for users to delete their own data
CREATE POLICY "Users can delete own data" ON users
  FOR DELETE USING (auth.uid() = id);

-- Policy for service role to manage all users
CREATE POLICY "Service role can manage all users" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create function to handle user activation
CREATE OR REPLACE FUNCTION handle_user_activation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = TRUE AND OLD.is_active = FALSE THEN
    NEW.activated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user activation
DROP TRIGGER IF EXISTS on_user_activation ON users;
CREATE TRIGGER on_user_activation
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_activation(); 