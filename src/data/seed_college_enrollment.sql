-- Seed data for College Enrollments (Dakshina Kannada)
-- Fixed: district_id is hardcoded string for 'Dakshina Kannada' (assuming 'dk' or checking dist list, but will user text lookup)
-- Actually, existing query was: (SELECT id FROM districts WHERE name = 'Dakshina Kannada') which returns TEXT.
-- So the query itself was fine, the table type was wrong.

-- 1. Graduate
INSERT INTO college_enrollments_graduate (district_id, college_name, course_name, duration_years, male_count, female_count)
VALUES 
    ('Dakshina Kannada', 'St Aloysius College', 'B.Com', 3, 450, 550),
    ('Dakshina Kannada', 'St Aloysius College', 'B.Sc', 3, 300, 400),
    ('Dakshina Kannada', 'Canara College', 'B.Com', 3, 200, 250),
    ('Dakshina Kannada', 'SDM College', 'BBA', 3, 150, 100),
    ('Dakshina Kannada', 'Sahyadri College of Engineering', 'B.E (CS)', 4, 120, 100)
ON CONFLICT (district_id, college_name, course_name) 
DO UPDATE SET male_count = EXCLUDED.male_count, female_count = EXCLUDED.female_count;

-- 2. Post Graduate
INSERT INTO college_enrollments_postgraduate (district_id, college_name, course_name, duration_years, male_count, female_count)
VALUES 
    ('Dakshina Kannada', 'Mangalore University', 'MBA', 2, 60, 40),
    ('Dakshina Kannada', 'Mangalore University', 'M.Sc (Chem)', 2, 30, 50),
    ('Dakshina Kannada', 'St Aloysius College', 'M.Com', 2, 40, 60)
ON CONFLICT (district_id, college_name, course_name) 
DO UPDATE SET male_count = EXCLUDED.male_count, female_count = EXCLUDED.female_count;

-- 3. Diploma
INSERT INTO college_enrollments_diploma (district_id, college_name, course_name, duration_years, male_count, female_count)
VALUES 
    ('Dakshina Kannada', 'Karnataka Polytechnic', 'Diploma in CS', 3, 80, 40),
    ('Dakshina Kannada', 'Karnataka Polytechnic', 'Diploma in Mech', 3, 100, 5),
    ('Dakshina Kannada', 'Women''s Polytechnic', 'Diploma in Fashion', 3, 0, 60)
ON CONFLICT (district_id, college_name, course_name) 
DO UPDATE SET male_count = EXCLUDED.male_count, female_count = EXCLUDED.female_count;
