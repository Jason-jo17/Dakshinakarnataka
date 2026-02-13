-- Allow public (guest) access to read the master company list
-- This is necessary for slug matching on guest survey links

CREATE POLICY "Allow public read access to dic_master" 
ON dic_master_companies FOR SELECT 
TO anon 
USING (true);
