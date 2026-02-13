
-- Check Total Count
SELECT COUNT(*) as total_rows FROM dic_master_companies;

-- Check District IDs present
SELECT district_id, COUNT(*) 
FROM dic_master_companies 
GROUP BY district_id;

-- Check specific match for 'Dakshina Kannada' (case sensitive check)
SELECT * 
FROM dic_master_companies 
WHERE district_id = 'Dakshina Kannada' 
LIMIT 5;

-- Check if any rows exist but are hidden (RLS check is implicit if you run this as admin)
-- If this returns 0 rows, then you need to run the Seeder.
