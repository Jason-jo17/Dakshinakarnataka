-- migration_v5_fix_drafts_and_uuids.sql
-- Run this in Supabase SQL Editor to resolve PGRST205 and 22P02 errors

-- 1. Create the user_drafts table (Fixes PGRST205)
CREATE TABLE IF NOT EXISTS public.user_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT, -- Changed to TEXT to support non-UUID identifiers
    guest_id TEXT,
    form_type VARCHAR(100) NOT NULL,
    state JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, form_type),
    UNIQUE(guest_id, form_type)
);

-- 2. Resolve UUID mismatch in ad_survey_employer (Fixes 22P02)
-- We need to change the column to TEXT so it can store identifiers like "recruiter-inunity"
ALTER TABLE public.ad_survey_employer ALTER COLUMN created_by_credential_id TYPE TEXT;

-- 3. Enable RLS and permissions for drafts
ALTER TABLE public.user_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for authenticated" ON public.user_drafts;
CREATE POLICY "Allow all for authenticated" ON public.user_drafts
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for anon" ON public.user_drafts;
CREATE POLICY "Allow all for anon" ON public.user_drafts
    FOR ALL TO anon
    USING (true)
    WITH CHECK (true);

-- 4. Fix Delete Policy for ad_survey_employer
-- Allows anyone to delete for now (matches current SELECT/INSERT permissions)
DROP POLICY IF EXISTS "Allow delete to everyone" ON public.ad_survey_employer;
CREATE POLICY "Allow delete to everyone" ON public.ad_survey_employer
FOR DELETE TO authenticated, anon
USING (true);

-- 5. Force schema cache reload
NOTIFY pgrst, 'reload schema';
