-- Seed Data for Analysis Visuals
-- District: Dakshina Kannada
-- Year: 2026 (matching default state)

-- 1. Training Partner Analysis
INSERT INTO training_partner_analysis (
    district_id, time_period, training_partner, scheme_name, sector_name, course_name,
    male_trained, male_placed, male_self_employed, male_avg_salary,
    female_trained, female_placed, female_self_employed, female_avg_salary
) VALUES
('Dakshina Kannada', '2026', 'GTTC Mangalore', 'CMKKY', 'Automotive', 'CNC Operator', 45, 38, 5, 15000, 12, 10, 1, 15500),
('Dakshina Kannada', '2026', 'Keonics', 'PMKVY', 'IT-ITeS', 'Data Entry Operator', 20, 10, 2, 12000, 35, 28, 5, 12500),
('Dakshina Kannada', '2026', 'RUDSET Institute', 'NRLM', 'Agriculture', 'Dairy Farming', 50, 40, 8, 10000, 10, 8, 2, 10000),
('Dakshina Kannada', '2026', 'VITC', 'DDU-GKY', 'Electronics', 'Field Technician', 30, 25, 3, 13500, 5, 4, 0, 14000),
('Dakshina Kannada', '2026', 'Canara weighbridge', 'Apprenticeship', 'Logistics', 'Warehouse Packer', 15, 15, 0, 11000, 5, 5, 0, 11000);

-- 2. Sector Wise Analysis
INSERT INTO sectorwise_analysis (
    district_id, time_period, sector_name,
    male_trained, male_placed, male_self_employed, male_avg_salary,
    female_trained, female_placed, female_self_employed, female_avg_salary
) VALUES
('Dakshina Kannada', '2026', 'IT-ITeS', 150, 100, 20, 18000, 200, 160, 30, 18500),
('Dakshina Kannada', '2026', 'Healthcare', 40, 30, 5, 14000, 120, 110, 8, 14500),
('Dakshina Kannada', '2026', 'Automotive', 80, 70, 5, 16000, 10, 8, 0, 16000),
('Dakshina Kannada', '2026', 'Retail', 60, 45, 10, 11500, 90, 70, 15, 11500),
('Dakshina Kannada', '2026', 'Construction', 100, 85, 10, 13000, 5, 2, 0, 13000);

-- 3. Scheme Wise Analysis
INSERT INTO schemewise_analysis (
    district_id, time_period, scheme_name,
    male_trained, male_placed, male_self_employed, male_avg_salary,
    female_trained, female_placed, female_self_employed, female_avg_salary
) VALUES
('Dakshina Kannada', '2026', 'CMKKY', 120, 90, 15, 14500, 80, 60, 10, 14000),
('Dakshina Kannada', '2026', 'PMKVY', 80, 50, 10, 12500, 70, 45, 5, 12000),
('Dakshina Kannada', '2026', 'DDU-GKY', 50, 40, 2, 13500, 40, 35, 1, 13500),
('Dakshina Kannada', '2026', 'NRLM', 60, 45, 12, 10000, 100, 80, 18, 10000),
('Dakshina Kannada', '2026', 'Apprenticeship', 40, 40, 0, 11000, 20, 20, 0, 11000);
