-- Create table for Cost Category Analysis
CREATE TABLE IF NOT EXISTS cost_category_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id TEXT NOT NULL,
  time_period TEXT NOT NULL, -- Year, e.g., '2024'
  
  sector_name TEXT NOT NULL,
  course_name TEXT NOT NULL, -- QP NOS
  total_duration TEXT NOT NULL,
  cost_category TEXT NOT NULL, -- as per CCN
  
  -- Number of Trainees in LY
  trained INTEGER DEFAULT 0,
  placed INTEGER DEFAULT 0,
  avg_salary NUMERIC DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicates for same combination in same year/district
  UNIQUE(district_id, time_period, sector_name, course_name, cost_category)
);

-- RLS Policies
ALTER TABLE cost_category_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access" ON cost_category_analysis
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert/update access" ON cost_category_analysis
  FOR ALL USING (auth.role() = 'authenticated');
