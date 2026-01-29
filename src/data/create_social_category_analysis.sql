-- Create table for Social Category Analysis
CREATE TABLE IF NOT EXISTS social_category_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id TEXT NOT NULL, -- Assuming district_id corresponds to the authenticated user's district or selected district
  time_period TEXT NOT NULL, -- Year, e.g., '2024', '2025'
  category TEXT NOT NULL CHECK (category IN ('SC', 'ST', 'Minority', 'General')),
  male_trained INTEGER DEFAULT 0,
  male_placed INTEGER DEFAULT 0,
  female_trained INTEGER DEFAULT 0,
  female_placed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(district_id, time_period, category)
);

-- Enable Row Level Security (RLS)
ALTER TABLE social_category_analysis ENABLE ROW LEVEL SECURITY;

-- Policy for reading data (allow formatted authenticated users)
CREATE POLICY "Allow authenticated read access" ON social_category_analysis
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for inserting/updating data (allow authenticated users)
CREATE POLICY "Allow authenticated insert/update access" ON social_category_analysis
  FOR ALL USING (auth.role() = 'authenticated');
