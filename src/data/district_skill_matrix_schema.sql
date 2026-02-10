-- District Skill Matrix Schema

-- 1. Assessment Run (Header)
CREATE TABLE IF NOT EXISTS dsm_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id VARCHAR(100) NOT NULL,
  assessment_year VARCHAR(20) NOT NULL, -- e.g. "2023-24"
  overall_score DECIMAL(5, 2),
  maturity_level VARCHAR(50),
  
  -- JSONB useful for nested/variable structures
  benchmark_scores JSONB, -- { "state_average": 52.3, "top_district": 74.2, ... }
  priority_matrix JSONB,  -- Array of { name, effort, impact } objects
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Dimensions (Details)
CREATE TABLE IF NOT EXISTS dsm_dimensions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES dsm_assessments(id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  score DECIMAL(5, 2),
  max_score DECIMAL(5, 2) DEFAULT 100,
  
  -- Array of indicator objects inside JSONB
  -- [ { "name": "...", "score": 78, "weight": 0.3 }, ... ]
  indicators JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Enable RLS but allow select for authenticated users for now)
ALTER TABLE dsm_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dsm_dimensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON dsm_assessments FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON dsm_dimensions FOR SELECT USING (true);

-- Allow authenticated users to insert/update (for data entry portal)
CREATE POLICY "Allow authenticated insert" ON dsm_assessments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON dsm_assessments FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON dsm_dimensions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON dsm_dimensions FOR UPDATE USING (auth.role() = 'authenticated');
