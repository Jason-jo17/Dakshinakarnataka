-- 1. Add missing columns to dic_master_companies
ALTER TABLE dic_master_companies
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS contact_person_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS credential_id UUID, -- Link to users table
ADD COLUMN IF NOT EXISTS contact_person_name_2 VARCHAR(255); -- Added Primary Contact 2

-- 2. Fix RLS Policies (Drop first to avoid "already exists" error)
DROP POLICY IF EXISTS "Allow authenticated users to read dic_master" ON dic_master_companies;
DROP POLICY IF EXISTS "Allow authenticated users to insert dic_master" ON dic_master_companies;
DROP POLICY IF EXISTS "Allow authenticated users to update dic_master" ON dic_master_companies;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON dic_master_companies; -- Potentially created by user

-- 3. Re-create Policies
CREATE POLICY "Allow authenticated users to read dic_master" 
ON dic_master_companies FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated users to insert dic_master" 
ON dic_master_companies FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update dic_master" 
ON dic_master_companies FOR UPDATE 
TO authenticated 
USING (true);
