-- Table for Sectorwise Scenario
CREATE TABLE IF NOT EXISTS scenario_sectorwise_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    district_id TEXT NOT NULL,
    sector_name TEXT NOT NULL,
    female_val NUMERIC DEFAULT 0,
    male_val NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(district_id, sector_name)
);

-- Table for Schemewise / Programwise Scenario
CREATE TABLE IF NOT EXISTS scenario_schemewise_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    district_id TEXT NOT NULL,
    scheme_name TEXT NOT NULL,
    female_val NUMERIC DEFAULT 0,
    male_val NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(district_id, scheme_name)
);

-- RLS Policies
ALTER TABLE scenario_sectorwise_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_schemewise_analysis ENABLE ROW LEVEL SECURITY;

-- Sectorwise Policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON scenario_sectorwise_analysis;
CREATE POLICY "Enable read access for authenticated users" ON scenario_sectorwise_analysis
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON scenario_sectorwise_analysis;
CREATE POLICY "Enable insert access for authenticated users" ON scenario_sectorwise_analysis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON scenario_sectorwise_analysis;
CREATE POLICY "Enable update access for authenticated users" ON scenario_sectorwise_analysis
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON scenario_sectorwise_analysis;
CREATE POLICY "Enable delete access for authenticated users" ON scenario_sectorwise_analysis
    FOR DELETE USING (auth.role() = 'authenticated');

-- Schemewise Policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON scenario_schemewise_analysis;
CREATE POLICY "Enable read access for authenticated users" ON scenario_schemewise_analysis
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON scenario_schemewise_analysis;
CREATE POLICY "Enable insert access for authenticated users" ON scenario_schemewise_analysis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON scenario_schemewise_analysis;
CREATE POLICY "Enable update access for authenticated users" ON scenario_schemewise_analysis
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON scenario_schemewise_analysis;
CREATE POLICY "Enable delete access for authenticated users" ON scenario_schemewise_analysis
    FOR DELETE USING (auth.role() = 'authenticated');
