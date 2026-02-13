-- Migration to add status column for draft persistence
ALTER TABLE ad_survey_employer 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'submitted';

-- Update previous records to 'submitted'
UPDATE ad_survey_employer 
SET status = 'submitted' 
WHERE status IS NULL;

-- Ensure status is 'submitted' for new items by default
-- The application will explicitly set 'draft' for auto-saves
ALTER TABLE ad_survey_employer 
ALTER COLUMN status SET DEFAULT 'submitted';
