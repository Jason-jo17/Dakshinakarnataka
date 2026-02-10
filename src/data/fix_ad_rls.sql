-- Enable RLS on the table
ALTER TABLE ad_survey_employer ENABLE ROW LEVEL SECURITY;

-- Allow public read access (or restricted to authenticated users if you prefer)
CREATE POLICY "Allow public read access" ON ad_survey_employer
    FOR SELECT USING (true);

-- Allow authenticated users (like seeds or admins) to insert/update
CREATE POLICY "Allow authenticated insert/update" ON ad_survey_employer
    FOR ALL USING (auth.role() = 'authenticated');
