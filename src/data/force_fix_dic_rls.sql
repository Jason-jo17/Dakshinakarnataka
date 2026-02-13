
-- Force enable RLS but add a permissive policy for all authenticated users to INSERT
-- This is necessary because the Seeder runs as the currently logged-in user.

ALTER TABLE public.dic_master_companies ENABLE ROW LEVEL SECURITY;

-- 1. DROP all existing INSERT policies to clear conflicts
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Enable insert for district admins" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Allow insert for everyone" ON public.dic_master_companies;

-- 2. Create a BROAD INSERT policy for authenticated users
CREATE POLICY "Allow insert for authenticated users"
ON public.dic_master_companies
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Just in case the user is running as anon (unlikely but possible if session lost)
CREATE POLICY "Allow insert for anon during development"
ON public.dic_master_companies
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Ensure SELECT/UPDATE policies are also present
DROP POLICY IF EXISTS "Allow read access for all" ON public.dic_master_companies;
CREATE POLICY "Allow read access for all"
ON public.dic_master_companies
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow update for authenticated" ON public.dic_master_companies;
CREATE POLICY "Allow update for authenticated"
ON public.dic_master_companies
FOR UPDATE
TO authenticated
USING (true);
