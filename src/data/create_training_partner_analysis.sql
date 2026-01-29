-- Create table for Training Partner Analysis
CREATE TABLE IF NOT EXISTS training_partner_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id TEXT NOT NULL,
  time_period TEXT NOT NULL, -- Year, e.g., '2024'
  
  training_partner TEXT NOT NULL,
  scheme_name TEXT NOT NULL,
  sector_name TEXT NOT NULL,
  course_name TEXT NOT NULL, -- QP NOS
  
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
  
  -- Prevent duplicates for same combination in same year/district
  UNIQUE(district_id, time_period, training_partner, scheme_name, sector_name, course_name)
);

-- RLS Policies
ALTER TABLE training_partner_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON training_partner_analysis
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert/update access" ON training_partner_analysis
  FOR ALL USING (auth.role() = 'authenticated');
