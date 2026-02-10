-- Add sector column to ad_survey_employer table
ALTER TABLE ad_survey_employer ADD COLUMN IF NOT EXISTS sector VARCHAR(100);

-- Also add a unique constraint on employer_name and district_id to prevent duplicates during seeding if needed
-- ALTER TABLE ad_survey_employer ADD CONSTRAINT unique_employer_district UNIQUE (employer_name, district_id);
