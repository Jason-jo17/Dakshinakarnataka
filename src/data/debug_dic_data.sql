-- Check count of rows
SELECT COUNT(*) as total_rows FROM dic_master_companies;

-- Check for specific company
SELECT * FROM dic_master_companies 
WHERE employer_name ILIKE '%Fernandes Brothers%';

-- Check column values
SELECT employer_name, contact_person_name, contact_person_email, sector 
FROM dic_master_companies 
LIMIT 5;
