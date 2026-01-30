-- Create table for Placement Location Analysis (Table F)
create table if not exists placement_location_analysis (
  id uuid default uuid_generate_v4() primary key,
  district_id text not null,
  time_period text not null, -- Stores the Year (e.g. "2024")
  
  sector_name text not null,
  course_name text not null,
  
  -- Number
  trained numeric default 0,
  placed numeric default 0,
  
  -- Details of placed candidates: Gender
  gender_m numeric default 0,
  gender_f numeric default 0,
  gender_total numeric default 0,
  
  -- Details of placed candidates: Placement Location
  location_rural numeric default 0,
  location_urban numeric default 0,
  
  -- Details of placed candidates: Migration
  migration_no numeric default 0,
  migration_within_district numeric default 0,
  migration_within_state numeric default 0,
  migration_outside_state numeric default 0,
  migration_overseas numeric default 0,
  migration_total numeric default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraint to ensure unique entries per course per year per district
  unique(district_id, time_period, sector_name, course_name)
);

-- Enable RLS
alter table placement_location_analysis enable row level security;

-- Policy
create policy "Allow all operations for authenticated users" 
on placement_location_analysis for all 
using (true) 
with check (true);
