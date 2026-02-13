-- DIC Master Sheet Table
-- This table stores the authoritative list of companies for the DIC (District Industries Centre)
CREATE TABLE IF NOT EXISTS dic_master_companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employer_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    district_id VARCHAR(100) DEFAULT 'Dakshina Kannada',
    
    -- Contact Person Details
    contact_person_name VARCHAR(255),
    contact_person_email VARCHAR(255),
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'registered', -- 'registered', 'survey_pending', 'surveyed'
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE dic_master_companies ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read (for admin purposes)
CREATE POLICY "Allow authenticated users to read dic_master" 
ON dic_master_companies FOR SELECT 
TO authenticated 
USING (true);

-- Allow all authenticated users to insert/update (for admin purposes)
CREATE POLICY "Allow authenticated users to insert dic_master" 
ON dic_master_companies FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update dic_master" 
ON dic_master_companies FOR UPDATE 
TO authenticated 
USING (true);
