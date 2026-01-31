CREATE TABLE IF NOT EXISTS scenario_share_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    district_id TEXT NOT NULL,
    parameter TEXT NOT NULL, -- 'ST', 'Women'
    trainee_share NUMERIC,
    placement_share NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(district_id, parameter)
);

-- Add RLS policies
ALTER TABLE scenario_share_analysis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON scenario_share_analysis;
CREATE POLICY "Enable read access for authenticated users" ON scenario_share_analysis
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON scenario_share_analysis;
CREATE POLICY "Enable insert access for authenticated users" ON scenario_share_analysis
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update access for authenticated users" ON scenario_share_analysis;
CREATE POLICY "Enable update access for authenticated users" ON scenario_share_analysis
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON scenario_share_analysis;
CREATE POLICY "Enable delete access for authenticated users" ON scenario_share_analysis
    FOR DELETE USING (auth.role() = 'authenticated');
