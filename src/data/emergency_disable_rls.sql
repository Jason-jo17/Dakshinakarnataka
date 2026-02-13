-- EMERGENCY: Disable RLS temporarily to allow seeding
-- Run this BEFORE seeding if you keep getting policy violations.

ALTER TABLE public.dic_master_companies DISABLE ROW LEVEL SECURITY;

-- Verify it is disabled (should return 'f' for rowsecurity)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'dic_master_companies';
