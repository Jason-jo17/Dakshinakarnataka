-- Seed file to reset or initialize District Skill Matrix data
-- This is useful for testing the initial state or reverting changes.

-- 1. Optional: Truncate the table to start fresh (WARNING: Deletes all data)
-- TRUNCATE TABLE public.district_skill_matrix;

-- 2. Insert dummy data (if needed) or allow the frontend to handle upserts.
-- Since the application uses upsert logic based on district_id and row_id, 
-- simply accessing the page and clicking save will populate the table.

-- Example of how to manually insert a record if needed via SQL:
/*
INSERT INTO public.district_skill_matrix (district_id, row_id, variable_a, variable_b, indicator_value, district_score, evidence_url, updated_at)
VALUES 
('Dakshina Kannada', '1.1a', NULL, NULL, 0, 0, NULL, NOW()),
('Dakshina Kannada', '1.1b', 10, 100, 10.0, 1, 'http://example.com/evidence', NOW());
*/

-- 3. Resetting a specific district without deleting everything
-- DELETE FROM public.district_skill_matrix WHERE district_id = 'Dakshina Kannada';
