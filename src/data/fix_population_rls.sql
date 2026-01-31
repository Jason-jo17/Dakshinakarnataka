-- EMERGENCY FIX: Unblock RLS completely for scenario_population_data

-- 1. Ensure RLS is enabled (ironically, to apply the policy)
ALTER TABLE scenario_population_data ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to remove any "authenticated" checks that might be failing
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON scenario_population_data;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON scenario_population_data;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON scenario_population_data;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON scenario_population_data;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON scenario_population_data;

-- 3. Create a PERMISSIVE policy that allows everything for everyone (checking true)
-- This confirms if it's strictly an RLS blocking issue.
CREATE POLICY "Allow All Access" ON scenario_population_data
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. Grant explicit permissions to the roles Supabase uses
GRANT ALL ON scenario_population_data TO postgres;
GRANT ALL ON scenario_population_data TO anon;
GRANT ALL ON scenario_population_data TO authenticated;
GRANT ALL ON scenario_population_data TO service_role;
