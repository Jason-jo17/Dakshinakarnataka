-- Fix RLS for Social Category Sector Analysis and Cost Category Analysis

-- 1. Social Category Sector Analysis (Table I)
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON social_category_sector_analysis;
DROP POLICY IF EXISTS "Allow authenticated read access" ON social_category_sector_analysis;
DROP POLICY IF EXISTS "Allow authenticated insert/update access" ON social_category_sector_analysis;

CREATE POLICY "Allow public all access" ON social_category_sector_analysis
  FOR ALL USING (true) WITH CHECK (true);

-- 2. Cost Category Analysis (Table E)
DROP POLICY IF EXISTS "Allow authenticated read access" ON cost_category_analysis;
DROP POLICY IF EXISTS "Allow authenticated insert/update access" ON cost_category_analysis;

CREATE POLICY "Allow public all access" ON cost_category_analysis
  FOR ALL USING (true) WITH CHECK (true);
