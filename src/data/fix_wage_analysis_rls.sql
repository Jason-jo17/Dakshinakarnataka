-- Fix RLS Policies for Wage Analysis
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON wage_analysis;
DROP POLICY IF EXISTS "Allow public all access" ON wage_analysis;

CREATE POLICY "Allow public all access" ON wage_analysis
  FOR ALL USING (true) WITH CHECK (true);
