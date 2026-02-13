-- Re-enable RLS after seeding is complete
-- Run this AFTER the seed is done to secure the table.

ALTER TABLE public.dic_master_companies ENABLE ROW LEVEL SECURITY;

-- Verify it is enabled (should return 't' for rowsecurity)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'dic_master_companies';
