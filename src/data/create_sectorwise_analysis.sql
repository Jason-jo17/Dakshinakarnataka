-- Create table for Sectorwise Analysis
CREATE TABLE IF NOT EXISTS sectorwise_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id TEXT NOT NULL,
  time_period TEXT NOT NULL, -- Year, e.g., '2024'
  sector_name TEXT NOT NULL,
  
  -- Male Data
  male_trained INTEGER DEFAULT 0,
  male_placed INTEGER DEFAULT 0,
  male_self_employed INTEGER DEFAULT 0,
  male_avg_salary NUMERIC DEFAULT 0,
  
  -- Female Data
  female_trained INTEGER DEFAULT 0,
  female_placed INTEGER DEFAULT 0,
  female_self_employed INTEGER DEFAULT 0,
  female_avg_salary NUMERIC DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicates for same sector in same year/district
  UNIQUE(district_id, time_period, sector_name)
);

-- RLS Policies
ALTER TABLE sectorwise_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON sectorwise_analysis
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert/update access" ON sectorwise_analysis
  FOR ALL USING (auth.role() = 'authenticated');
