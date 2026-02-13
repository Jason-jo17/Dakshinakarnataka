-- Migration to fix missing contact_person_email column in ad_survey_employer
-- Run this in the Supabase SQL Editor

DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='ad_survey_employer' 
        AND column_name='contact_person_email'
    ) THEN
        ALTER TABLE ad_survey_employer ADD COLUMN contact_person_email VARCHAR(255);
    END IF;
END $$;
