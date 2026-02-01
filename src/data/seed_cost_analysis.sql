-- Seed Data for Cost Category Analysis
-- District: Dakshina Kannada
-- Year: 2026

INSERT INTO cost_category_analysis (
    district_id, time_period, sector_name, course_name, total_duration, cost_category,
    trained, placed, avg_salary
) VALUES
('Dakshina Kannada', '2026', 'IT-ITeS', 'Junior Software Developer', '400', 'Category 1', 50, 45, 25000),
('Dakshina Kannada', '2026', 'Electronics', 'Field Technician', '300', 'Category 1', 40, 30, 18000),
('Dakshina Kannada', '2026', 'Healthcare', 'General Duty Assistant', '240', 'Category 2', 60, 55, 15000),
('Dakshina Kannada', '2026', 'Automotive', 'Automotive Service Technician', '350', 'Category 1', 30, 25, 20000),
('Dakshina Kannada', '2026', 'Construction', 'Mason General', '200', 'Category 3', 80, 60, 12000)
ON CONFLICT (district_id, time_period, sector_name, course_name, cost_category) 
DO UPDATE SET
    trained = EXCLUDED.trained,
    placed = EXCLUDED.placed,
    avg_salary = EXCLUDED.avg_salary,
    total_duration = EXCLUDED.total_duration;
