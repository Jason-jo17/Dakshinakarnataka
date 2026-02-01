-- Seed initial data for Agri Yield Analysis (Dakshina Kannada)
-- Note: Replace 'dakshina_kannada' if the district ID differs in your system.

INSERT INTO agri_yield_analysis (
    district_id, crop_name, area_hectares, production_tonnes, district_yield, state_max_yield, india_max_yield, yield_gap_state, yield_gap_india
) VALUES 
('Dakshina Kannada', 'Rice', 99744, 300673, 3.09, 4.04, 5.9, 0.95, 2.81),
('Dakshina Kannada', 'Ragi', 46139, 70598, 2.00, 2.29, 5.0, 0.29, 3.00),
('Dakshina Kannada', 'Tobacco', 44109, 34780, 0.79, 1.22, 5.86, 0.43, 5.07),
('Dakshina Kannada', 'Cotton(lint)', 43453, 54633, 1.26, 3.13, 7.28, 1.87, 6.02),
('Dakshina Kannada', 'Horse-gram', 30805, 16915, 0.55, 1.00, 1.20, 0.45, 0.65),
('Dakshina Kannada', 'Cowpea(Lobia)', 27655, 10567, 0.42, 0.47, 4.45, 0.05, 4.03),
('Dakshina Kannada', 'Maize', 26257, 84402, 3.44, 7.60, 15.0, 4.16, 11.56),
('Dakshina Kannada', 'Coconut', 23277, 246158000, 10575.16, 17458.63, 31578.95, 6883.47, 21003.79),
('Dakshina Kannada', 'Urad', 13038, 6936, 0.53, 0.67, 2.33, 0.14, 1.80),
('Dakshina Kannada', 'Other Rabi pulses', 11083, 8297, 0.75, 1.00, 4.04, 0.25, 3.29),
('Dakshina Kannada', 'Jowar', 9854, 12048, 1.24, 3.04, 5.53, 1.80, 4.29),
('Dakshina Kannada', 'Sugarcane', 9345, 861142, 92.15, 112.10, 134.55, 19.95, 42.40),
('Dakshina Kannada', 'Moong(Green Gram)', 4463, 2303, 0.52, 0.57, 2.28, 0.05, 1.76),
('Dakshina Kannada', 'Other Kharif pulses', 4355, 2696, 0.62, 1.00, 3.96, 0.38, 3.34),
('Dakshina Kannada', 'Arhar/Tur', 3767, 3457, 0.92, 1.04, 3.83, 0.12, 2.91),
('Dakshina Kannada', 'Ginger', 3372, 44689.6, 13.25, 18.27, 27.99, 5.02, 14.74),
('Dakshina Kannada', 'Arecanut', 3130, 27947, 8.93, 14.08, 14.08, 5.15, 5.15),
('Dakshina Kannada', 'Turmeric', 2345, 8794, 3.75, 6.47, 964.80, 2.72, 961.05),
('Dakshina Kannada', 'Sesamum', 1729, 1608, 0.93, 1.55, 6.25, 0.62, 5.32)
ON CONFLICT (district_id, crop_name) DO UPDATE SET
    area_hectares = EXCLUDED.area_hectares,
    production_tonnes = EXCLUDED.production_tonnes,
    district_yield = EXCLUDED.district_yield,
    state_max_yield = EXCLUDED.state_max_yield,
    india_max_yield = EXCLUDED.india_max_yield,
    yield_gap_state = EXCLUDED.yield_gap_state,
    yield_gap_india = EXCLUDED.yield_gap_india;
