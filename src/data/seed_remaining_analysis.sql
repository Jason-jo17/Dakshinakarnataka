-- Seed Data for Remaining Analysis Modules
-- District: Dakshina Kannada, Year: 2026

-- 1. Social Category Sector Analysis (Table I)
INSERT INTO social_category_sector_analysis (
    district_id, time_period, sector_name,
    sc_trained, sc_placed,
    st_trained, st_placed,
    minority_trained, minority_placed,
    gen_trained, gen_placed
) VALUES
('Dakshina Kannada', '2026', 'IT-ITeS', 50, 30, 20, 10, 80, 60, 100, 80),
('Dakshina Kannada', '2026', 'Electronics', 40, 25, 15, 8, 50, 35, 70, 50),
('Dakshina Kannada', '2026', 'Healthcare', 60, 50, 30, 25, 90, 80, 120, 100),
('Dakshina Kannada', '2026', 'Construction', 70, 50, 40, 30, 60, 40, 80, 60),
('Dakshina Kannada', '2026', 'Automotive', 30, 20, 10, 5, 40, 30, 50, 40)
ON CONFLICT (district_id, time_period, sector_name) 
DO UPDATE SET
    sc_trained = EXCLUDED.sc_trained, sc_placed = EXCLUDED.sc_placed,
    st_trained = EXCLUDED.st_trained, st_placed = EXCLUDED.st_placed,
    minority_trained = EXCLUDED.minority_trained, minority_placed = EXCLUDED.minority_placed,
    gen_trained = EXCLUDED.gen_trained, gen_placed = EXCLUDED.gen_placed;

-- 2. Cost Category Analysis (Table E)
INSERT INTO cost_category_analysis (
    district_id, time_period, sector_name, course_name, total_duration, cost_category,
    trained, placed, avg_salary
) VALUES
('Dakshina Kannada', '2026', 'Retail', 'Retail Associate', '200', 'Category 3', 100, 80, 12000),
('Dakshina Kannada', '2026', 'Logistics', 'Warehouse Packer', '180', 'Category 3', 80, 70, 11000)
ON CONFLICT (district_id, time_period, sector_name, course_name, cost_category) 
DO UPDATE SET
    trained = EXCLUDED.trained,
    placed = EXCLUDED.placed,
    avg_salary = EXCLUDED.avg_salary;
