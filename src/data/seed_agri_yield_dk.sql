-- Seed Data for Agri Yield Analysis (Dakshina Kannada)

DELETE FROM agri_yield_analysis WHERE district_id = 'Dakshina Kannada';

INSERT INTO agri_yield_analysis (
    district_id,
    crop_name,
    area_hectares,
    production_tonnes,
    district_yield,
    state_max_yield,
    india_max_yield,
    yield_gap_state,
    yield_gap_india,
    remarks
) VALUES
('Dakshina Kannada', 'Arecanut', 93151, 1253263, 13.45, 14.32, 14.32, 0.87, 0.87, 'Whole Year'),
('Dakshina Kannada', 'Arhar/Tur', 1, 1, 1, 1.22, 22.85, 0.22, 21.85, 'Kharif'),
('Dakshina Kannada', 'Bajra', 8, 9, 1.13, 2.3, 4.17, 1.17, 3.04, 'Kharif'),
('Dakshina Kannada', 'Black pepper', 7146, 3021, 0.42, 0.5, 5.1, 0.08, 4.68, 'Whole Year'),
('Dakshina Kannada', 'Cardamom', 4, 1, 0.25, 0.25, 0.31, 0, 0.06, 'Whole Year'),
('Dakshina Kannada', 'Cashewnut', 14095, 20652, 1.47, 1.74, 1.94, 0.27, 0.47, 'Whole Year'),
('Dakshina Kannada', 'Coconut', 31986, 353426000, 11049.40, 11049.40, 32957.75, 0, 21908.35, 'Whole Year - Prod in Nuts?'),
('Dakshina Kannada', 'Coriander', 2, 1, 0.5, 0.5, 9.5, 0, 9, 'Whole Year'),
('Dakshina Kannada', 'Cowpea(Lobia) Kharif', 4, 1, 0.25, 0.74, 3.16, 0.49, 2.91, 'Kharif'),
('Dakshina Kannada', 'Cowpea(Lobia) Rabi', 2, 1, 0.5, 0.74, 3.16, 0.24, 2.66, 'Rabi'),
('Dakshina Kannada', 'Jowar', 1, 1, 1, 2.38, 5.96, 1.38, 4.96, 'Rabi'),
('Dakshina Kannada', 'Moong(Green Gram)', 3, 0, 0, 0.63, 1.8, 0.63, 1.8, 'Summer'),
('Dakshina Kannada', 'Other Rabi pulses', 1, 0, 0, 1.19, 4.04, 1.19, 4.04, 'Rabi'),
('Dakshina Kannada', 'Other Kharif pulses', 3, 2, 0.67, 1.2, 4, 0.53, 3.33, 'Kharif'),
('Dakshina Kannada', 'Rice Kharif', 10260, 29455, 2.87, 4.22, 5.5, 1.35, 2.63, 'Kharif'),
('Dakshina Kannada', 'Rice Rabi', 2368, 6157, 2.6, 4.22, 5.5, 1.62, 2.9, 'Rabi'),
('Dakshina Kannada', 'Small millets', 26, 10, 0.38, 1.4, 3, 1.02, 2.62, 'Kharif'),
('Dakshina Kannada', 'Sugarcane', 5, 453, 90.6, 118.22, 140, 27.62, 49.4, 'Whole Year'),
('Dakshina Kannada', 'Sweet potato', 1, 19, 19, 20.52, 48.63, 1.52, 29.63, 'Whole Year'),
('Dakshina Kannada', 'Tapioca', 1, 13, 13, 13.01, 67.13, 0.01, 54.13, 'Whole Year'),
('Dakshina Kannada', 'Tobacco', 1, 1, 1, 1.28, 7.7, 0.28, 6.7, 'Whole Year'),
('Dakshina Kannada', 'Urad Kharif', 1, 0, 0, 0.57, 1.85, 0.57, 1.85, 'Kharif'),
('Dakshina Kannada', 'Urad Rabi', 1, 0, 0, 0.57, 1.85, 0.57, 1.85, 'Rabi'),
('Dakshina Kannada', 'Wheat', 2, 2, 1, 2.04, 5.77, 1.04, 4.77, 'Rabi');
