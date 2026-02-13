-- Generic User Drafts Table for Form Persistence
CREATE TABLE IF NOT EXISTS user_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES credentials(id) ON DELETE CASCADE,
    guest_id VARCHAR(100), -- guest identifier (e.g. fingerprint or session)
    form_type VARCHAR(50) NOT NULL, -- e.g. 'employer_survey'
    state JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_user_drafts_user ON user_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_drafts_guest ON user_drafts(guest_id);

-- Enable RLS
ALTER TABLE user_drafts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own drafts" 
ON user_drafts FOR ALL 
TO authenticated 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow guest draft management" 
ON user_drafts FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);
