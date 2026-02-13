-- Debug Script: Check Active RLS Policies
-- Run this to see what policies are actually active on the table

SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    tablename = 'dic_master_companies';

-- Check table info to verify column types
SELECT 
    column_name, 
    data_type, 
    character_maximum_length 
FROM 
    information_schema.columns 
WHERE 
    table_name = 'dic_master_companies';
