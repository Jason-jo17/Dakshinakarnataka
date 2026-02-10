-- Create district_schemes table if not exists
CREATE TABLE IF NOT EXISTS public.district_schemes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sno SERIAL,
    scheme_name VARCHAR(255) NOT NULL,
    funding_source VARCHAR(100), -- Central/State/Other
    sector VARCHAR(100),
    trade VARCHAR(255),
    annual_intake INTEGER DEFAULT 0, -- Mapped to "Number trained last year"
    
    -- Additional fields from interface
    scheme_url VARCHAR(255),
    affiliated_centers TEXT,
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    
    district VARCHAR(100) DEFAULT 'Dakshina Kannada',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.district_schemes ENABLE ROW LEVEL SECURITY;

-- Policy for viewing
CREATE POLICY "Enable read access for all users" ON public.district_schemes
  FOR SELECT USING (true);

-- Policy for inserting (admin only, for seeding)
CREATE POLICY "Enable insert for authenticated users only" ON public.district_schemes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
