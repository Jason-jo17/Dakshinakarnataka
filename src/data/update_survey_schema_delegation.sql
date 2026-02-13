-- Schema Update for Delegate Workflow
-- Adds columns to track delegation status and details

ALTER TABLE public.ad_survey_employer
ADD COLUMN IF NOT EXISTS delegate_name TEXT,
ADD COLUMN IF NOT EXISTS delegate_email TEXT,
ADD COLUMN IF NOT EXISTS is_delegated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS delegation_status VARCHAR(50) DEFAULT 'none'; -- 'pending', 'filled', 'approved'

-- Add audit columns for delegation if needed
ADD COLUMN IF NOT EXISTS delegated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS filled_by_delegate_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by_primary_at TIMESTAMP WITH TIME ZONE;
