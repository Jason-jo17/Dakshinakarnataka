-- migration_fix_missing_survey_columns.sql
-- Run this in the Supabase SQL Editor to fix survey submission errors

-- 1. Ensure all expected columns exist in ad_survey_employer
ALTER TABLE public.ad_survey_employer
ADD COLUMN IF NOT EXISTS district_id VARCHAR(100) DEFAULT 'Dakshina Kannada',
ADD COLUMN IF NOT EXISTS employer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS employer_address TEXT,
ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS company_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS sector VARCHAR(255),
ADD COLUMN IF NOT EXISTS sub_sector VARCHAR(255),
ADD COLUMN IF NOT EXISTS business_activity TEXT,
ADD COLUMN IF NOT EXISTS manufacturing_location TEXT,
ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT 'Karnataka',
ADD COLUMN IF NOT EXISTS created_by_credential_id UUID,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE,

-- Past Hiring
ADD COLUMN IF NOT EXISTS recruited_past_12m_num INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS recruited_past_12m_avg_salary NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS recruited_job_roles TEXT,
ADD COLUMN IF NOT EXISTS skill_gaps_observed TEXT,

-- Contact Info
ADD COLUMN IF NOT EXISTS contact_person_name TEXT,
ADD COLUMN IF NOT EXISTS contact_person_designation TEXT,
ADD COLUMN IF NOT EXISTS contact_person_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_person_email TEXT,
ADD COLUMN IF NOT EXISTS contact_department TEXT,

-- Future Hiring
ADD COLUMN IF NOT EXISTS expected_recruit_num INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS expected_recruit_salary NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS expected_recruit_job_role TEXT,
ADD COLUMN IF NOT EXISTS expected_recruit_qualification TEXT,
ADD COLUMN IF NOT EXISTS place_of_recruitment TEXT;

-- 2. Force a schema cache reload
-- This is critical for the "Could not find column... in schema cache" error
NOTIFY pgrst, 'reload schema';

-- 3. Fix RLS Policies (Critical for Guest Submissions)
-- Enable RLS but allow anyone to insert (for public survey)
ALTER TABLE public.ad_survey_employer ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts" ON public.ad_survey_employer;
CREATE POLICY "Allow public inserts" ON public.ad_survey_employer 
FOR INSERT TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow individual read" ON public.ad_survey_employer;
CREATE POLICY "Allow individual read" ON public.ad_survey_employer 
FOR SELECT TO anon, authenticated 
USING (true); -- Note: In production you might want to restrict this more

-- 4. In case the above fails, you can also run this (often works better in some Supabase versions)
ALTER TABLE public.ad_survey_employer ALTER COLUMN employer_name TYPE VARCHAR(255); -- Dummy change to trigger reload
