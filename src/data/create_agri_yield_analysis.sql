-- Create table for Agri Yield Analysis
CREATE TABLE IF NOT EXISTS agri_yield_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    district_id TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    area_hectares NUMERIC DEFAULT 0,
    production_tonnes NUMERIC DEFAULT 0,
    district_yield NUMERIC DEFAULT 0,
    state_max_yield NUMERIC DEFAULT 0,
    india_max_yield NUMERIC DEFAULT 0,
    yield_gap_state NUMERIC DEFAULT 0,
    yield_gap_india NUMERIC DEFAULT 0,
    people_involved NUMERIC,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(district_id, crop_name)
);

-- Note: Ensure uuid-ossp extension is enabled if not already
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS
ALTER TABLE agri_yield_analysis ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Enable read access for all users" ON agri_yield_analysis;
CREATE POLICY "Enable read access for all users" ON agri_yield_analysis
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON agri_yield_analysis;
CREATE POLICY "Enable insert for authenticated users" ON agri_yield_analysis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated users" ON agri_yield_analysis;
CREATE POLICY "Enable update for authenticated users" ON agri_yield_analysis
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated users" ON agri_yield_analysis;
CREATE POLICY "Enable delete for authenticated users" ON agri_yield_analysis
    FOR DELETE USING (auth.role() = 'authenticated');
