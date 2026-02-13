-- Comprehensive Fix for DIC Master Seeding
-- 1. Fix Schema: Ensure columns are wide enough to hold data
-- "Mangalore Refinery & Petrochemicals Limited" (45 chars) might be hitting a limit if UTF8 bytes are counted or if limit is small.
-- We will switch to TEXT for flexibility or VARCHAR(255).

ALTER TABLE public.dic_master_companies 
    ALTER COLUMN employer_name TYPE TEXT,
    ALTER COLUMN address TYPE TEXT,
    ALTER COLUMN contact_person_name TYPE TEXT,
    ALTER COLUMN contact_person_email TYPE TEXT,
    ALTER COLUMN sector TYPE TEXT,
    ALTER COLUMN district_id TYPE TEXT;

-- 2. Reset RLS Policies
-- Completely drop existing policies to remove conflicts
DROP POLICY IF EXISTS "Allow authenticated users to read dic_master" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Allow authenticated users to insert dic_master" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Allow authenticated users to update dic_master" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Enable insert for district admins" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.dic_master_companies;
DROP POLICY IF EXISTS "seed_admin_insert" ON public.dic_master_companies;
DROP POLICY IF EXISTS "seed_admin_select" ON public.dic_master_companies;
DROP POLICY IF EXISTS "seed_admin_update" ON public.dic_master_companies;

-- Enable RLS
ALTER TABLE public.dic_master_companies ENABLE ROW LEVEL SECURITY;

-- 3. Create New Permissive Policies for Authenticated Users (Seeder/Admin)
-- We need INSERT, SELECT (to check existence), and UPDATE.

CREATE POLICY "seed_admin_insert" 
ON public.dic_master_companies 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "seed_admin_select" 
ON public.dic_master_companies 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "seed_admin_update" 
ON public.dic_master_companies 
FOR UPDATE 
TO authenticated 
USING (true);

-- 4. Verification Query (Optional, for user to run manually if needed)
-- SELECT count(*) FROM dic_master_companies;
