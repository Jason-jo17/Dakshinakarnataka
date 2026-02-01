-- Fix RLS Policies for Analysis Tables to allow Public/Anon access
-- This is necessary because the demo app uses simulated auth (client-side state) 
-- and does not establish a real Supabase session, causing default "authenticated" policies to fail.

-- 1. Training Partner Analysis
DROP POLICY IF EXISTS "Allow authenticated read access" ON training_partner_analysis;
DROP POLICY IF EXISTS "Allow authenticated insert/update access" ON training_partner_analysis;

CREATE POLICY "Allow public read access" ON training_partner_analysis
  FOR SELECT USING (true);

CREATE POLICY "Allow public all access" ON training_partner_analysis
  FOR ALL USING (true) WITH CHECK (true);

-- 2. Sectorwise Analysis
DROP POLICY IF EXISTS "Allow authenticated read access" ON sectorwise_analysis;
DROP POLICY IF EXISTS "Allow authenticated insert/update access" ON sectorwise_analysis;

CREATE POLICY "Allow public read access" ON sectorwise_analysis
  FOR SELECT USING (true);

CREATE POLICY "Allow public all access" ON sectorwise_analysis
  FOR ALL USING (true) WITH CHECK (true);

-- 3. Schemewise Analysis
DROP POLICY IF EXISTS "Allow authenticated read access" ON schemewise_analysis;
DROP POLICY IF EXISTS "Allow authenticated insert/update access" ON schemewise_analysis;

CREATE POLICY "Allow public read access" ON schemewise_analysis
  FOR SELECT USING (true);

CREATE POLICY "Allow public all access" ON schemewise_analysis
  FOR ALL USING (true) WITH CHECK (true);
