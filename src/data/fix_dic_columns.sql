-- Fix Column Lengths (Run this to solve "value too long" errors)
-- This alters columns to TEXT to allow any length.

ALTER TABLE public.dic_master_companies 
    ALTER COLUMN employer_name TYPE TEXT,
    ALTER COLUMN address TYPE TEXT,
    ALTER COLUMN contact_person_name TYPE TEXT,
    ALTER COLUMN contact_person_email TYPE TEXT,
    ALTER COLUMN sector TYPE TEXT,
    ALTER COLUMN district_id TYPE TEXT;
