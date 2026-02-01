-- Fix RLS Policies for Social Category Analysis
DROP POLICY IF EXISTS "Allow authenticated read access" ON social_category_analysis;
DROP POLICY IF EXISTS "Allow authenticated insert/update access" ON social_category_analysis;

CREATE POLICY "Allow public read access" ON social_category_analysis
  FOR SELECT USING (true);

CREATE POLICY "Allow public all access" ON social_category_analysis
  FOR ALL USING (true) WITH CHECK (true);
