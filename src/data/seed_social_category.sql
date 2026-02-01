-- Seed Data for Social Category Analysis
-- District: Dakshina Kannada
-- Year: 2026

INSERT INTO social_category_analysis (
    district_id, time_period, category,
    male_trained, male_placed, female_trained, female_placed
) VALUES
('Dakshina Kannada', '2026', 'SC', 120, 80, 100, 70),
('Dakshina Kannada', '2026', 'ST', 80, 50, 60, 40),
('Dakshina Kannada', '2026', 'Minority', 150, 100, 140, 90),
('Dakshina Kannada', '2026', 'General', 200, 160, 180, 150)
ON CONFLICT (district_id, time_period, category) 
DO UPDATE SET
    male_trained = EXCLUDED.male_trained,
    male_placed = EXCLUDED.male_placed,
    female_trained = EXCLUDED.female_trained,
    female_placed = EXCLUDED.female_placed;
