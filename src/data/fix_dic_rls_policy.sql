-- Enable RLS on the table (ensure it is on)
ALTER TABLE public.dic_master_companies ENABLE ROW LEVEL SECURITY;

-- Drop existing insert policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.dic_master_companies;
DROP POLICY IF EXISTS "Enable insert for district admins" ON public.dic_master_companies;

-- Create a permissive insert policy for authenticated users (since this is an admin tool)
CREATE POLICY "Enable insert for authenticated users" 
ON public.dic_master_companies 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Also ensure update/select policies exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.dic_master_companies;
CREATE POLICY "Enable read access for all users" 
ON public.dic_master_companies 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.dic_master_companies;
CREATE POLICY "Enable update for authenticated users" 
ON public.dic_master_companies 
FOR UPDATE 
TO authenticated 
USING (true);
