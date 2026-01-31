-- Create table for Education / Dropout Analysis
CREATE TABLE IF NOT EXISTS scenario_education_dropout (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    district_id TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('dise', 'alternate')),
    education_level TEXT NOT NULL, -- 'Class 5 to 6', 'Class 6 to 7', etc.
    
    -- Year Headers (Stored per row for simplicity in this constrained app, though usually separate)
    year1_label TEXT DEFAULT '2015-16',
    year2_label TEXT DEFAULT '2016-17',
    
    -- Year 1 Data
    year1_m NUMERIC,
    year1_f NUMERIC,
    year1_total NUMERIC,
    
    -- Year 2 Data
    year2_m NUMERIC,
    year2_f NUMERIC,
    year2_total NUMERIC,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    UNIQUE(district_id, source_type, education_level)
);

-- Create table for ITI Data
CREATE TABLE IF NOT EXISTS scenario_iti_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    district_id TEXT NOT NULL,
    indicator TEXT NOT NULL, -- 'Number of ITI', 'Number of Trades', 'Number of Seats'
    category TEXT NOT NULL, -- 'Govt', 'Pvt', 'Total'
    
    rural NUMERIC,
    urban NUMERIC,
    total NUMERIC,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    UNIQUE(district_id, indicator, category)
);

-- Create table for ITI Enrolment (Simple key-value store for this section)
CREATE TABLE IF NOT EXISTS scenario_iti_enrolment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    district_id TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'ncvt', 'alternate'
    enrolment_number NUMERIC,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    UNIQUE(district_id, source_type)
);

-- Enable RLS
ALTER TABLE scenario_education_dropout ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_iti_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_iti_enrolment ENABLE ROW LEVEL SECURITY;

-- Permissive Policies (to avoid "new row violates RLS" errors)
CREATE POLICY "Allow All Education Access" ON scenario_education_dropout FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All ITI Access" ON scenario_iti_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All ITI Enrolment Access" ON scenario_iti_enrolment FOR ALL USING (true) WITH CHECK (true);

-- Grant Permissions
GRANT ALL ON scenario_education_dropout TO authenticated;
GRANT ALL ON scenario_iti_data TO authenticated;
GRANT ALL ON scenario_iti_enrolment TO authenticated;
GRANT ALL ON scenario_education_dropout TO service_role;
GRANT ALL ON scenario_iti_data TO service_role;
GRANT ALL ON scenario_iti_enrolment TO service_role;
