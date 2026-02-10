-- Add missing columns to district_schemes table if they don't exist
DO $$
BEGIN
    -- Add 'district' column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'district_schemes' AND column_name = 'district') THEN
        ALTER TABLE public.district_schemes ADD COLUMN district VARCHAR(100) DEFAULT 'Dakshina Kannada';
    END IF;

    -- Add 'funding_source' column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'district_schemes' AND column_name = 'funding_source') THEN
        ALTER TABLE public.district_schemes ADD COLUMN funding_source VARCHAR(100);
    END IF;

    -- Add 'sector' column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'district_schemes' AND column_name = 'sector') THEN
        ALTER TABLE public.district_schemes ADD COLUMN sector VARCHAR(100);
    END IF;

    -- Add 'trade' column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'district_schemes' AND column_name = 'trade') THEN
        ALTER TABLE public.district_schemes ADD COLUMN trade VARCHAR(255);
    END IF;

    -- Add 'annual_intake' column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'district_schemes' AND column_name = 'annual_intake') THEN
        ALTER TABLE public.district_schemes ADD COLUMN annual_intake INTEGER DEFAULT 0;
    END IF;

      -- Add 'scheme_name' column (renaming from name if needed, or ensuring it exists)
      -- Assuming 'name' might exist from old schema, we want 'scheme_name' to match our seed.
      -- If 'name' exists but 'scheme_name' does not, we can assume 'name' is the intended 'scheme_name' or just add 'scheme_name'.
      -- For safety, I will ensure 'scheme_name' exists.
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'district_schemes' AND column_name = 'scheme_name') THEN
        ALTER TABLE public.district_schemes ADD COLUMN scheme_name VARCHAR(255);
    END IF;

END $$;
