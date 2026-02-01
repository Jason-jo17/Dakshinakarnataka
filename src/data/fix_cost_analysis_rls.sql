-- Fix RLS Policies for Cost Category Analysis
DROP POLICY IF EXISTS "Allow authenticated read access" ON cost_category_analysis;
DROP POLICY IF EXISTS "Allow authenticated insert/update access" ON cost_category_analysis;

CREATE POLICY "Allow public read access" ON cost_category_analysis
  FOR SELECT USING (true);

CREATE POLICY "Allow public all access" ON cost_category_analysis
  FOR ALL USING (true) WITH CHECK (true);
