-- Update DIC Master Companies Schema for Seeding
-- Adding columns to match the provided CSV data

ALTER TABLE dic_master_companies 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS contact_person_phone VARCHAR(50);

-- Adding credential_id to link with users table for login
ALTER TABLE dic_master_companies
ADD COLUMN IF NOT EXISTS credential_id UUID REFERENCES users(id);
