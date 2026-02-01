-- Seed Data for Wage Analysis
-- District: Dakshina Kannada, Year: 2026

INSERT INTO wage_analysis (
    district_id, time_period, sector_name, course_name,
    avg_wage_rural_male, avg_wage_rural_female,
    avg_wage_urban_male, avg_wage_urban_female,
    placed_trainees,
    placed_above_10_percent_min,
    placed_within_10_percent_min,
    placed_below_min
) VALUES
('Dakshina Kannada', '2026', 'IT-ITeS', 'Junior Software Developer', 18000, 18000, 25000, 24000, 100, 80, 15, 5),
('Dakshina Kannada', '2026', 'Electronics', 'Field Technician', 15000, 14000, 18000, 18000, 80, 50, 20, 10),
('Dakshina Kannada', '2026', 'Healthcare', 'General Duty Assistant', 12000, 12000, 16000, 16000, 120, 70, 40, 10),
('Dakshina Kannada', '2026', 'Automotive', 'Service Technician', 14000, 13000, 19000, 18000, 50, 30, 15, 5),
('Dakshina Kannada', '2026', 'Construction', 'Mason General', 11000, 10000, 14000, 13000, 90, 40, 30, 20)
ON CONFLICT (district_id, time_period, sector_name, course_name) 
DO UPDATE SET
    avg_wage_rural_male = EXCLUDED.avg_wage_rural_male,
    avg_wage_rural_female = EXCLUDED.avg_wage_rural_female,
    avg_wage_urban_male = EXCLUDED.avg_wage_urban_male,
    avg_wage_urban_female = EXCLUDED.avg_wage_urban_female,
    placed_trainees = EXCLUDED.placed_trainees,
    placed_above_10_percent_min = EXCLUDED.placed_above_10_percent_min,
    placed_within_10_percent_min = EXCLUDED.placed_within_10_percent_min,
    placed_below_min = EXCLUDED.placed_below_min;
