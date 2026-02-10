-- Create the district_training_centers table
CREATE TABLE IF NOT EXISTS district_training_centers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sno SERIAL,
    training_center_name TEXT NOT NULL,
    center_address1 TEXT,
    center_address2 TEXT,
    block TEXT,
    district TEXT DEFAULT 'Dakshina Kannada',
    pincode TEXT,
    year_started TEXT, -- Added year_started
    
    -- Capacity
    class_room_count INTEGER,
    seating_capacity INTEGER,
    capacity_of_lab INTEGER,
    
    -- Residential Details
    is_residential CHAR(1) CHECK (is_residential IN ('Y', 'N')),
    hostel_capacity_men INTEGER,
    hostel_capacity_women INTEGER,
    distance_hostel_center TEXT,
    
    -- Contact Details
    contact_person_name TEXT,
    contact_role TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    
    -- Training Details
    schemes_empanelled TEXT,
    funding_source TEXT,
    scheme_url TEXT,
    trades_offered TEXT,
    sectors TEXT,
    
    -- Performance Metrics
    trained_last_year INTEGER,
    placed_last_year INTEGER,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE district_training_centers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for all users (including anonymous)
CREATE POLICY "Enable read access for all users" ON district_training_centers
    FOR SELECT
    USING (true);

-- Create policy to allow insert/update/delete for authenticated users only
CREATE POLICY "Enable write access for authenticated users" ON district_training_centers
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
