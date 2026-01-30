-- Create table for Key Employers Analysis (Table H)
create table if not exists key_employers_analysis (
  id uuid default uuid_generate_v4() primary key,
  district_id text not null,
  time_period text not null, -- Stores the Year (e.g. "2024")
  
  employer_name text not null,
  
  -- Recruited in past 12 months
  recruited_count numeric default 0,
  recruited_avg_salary numeric default 0,
  recruited_job_roles text,
  
  -- Contact Person
  contact_name text,
  contact_designation text,
  contact_phone text,
  
  -- Expected Recruitment this year
  expected_count numeric default 0,
  expected_salary numeric default 0,
  expected_job_role text,
  expected_place_of_deployment text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraint to ensure unique entries per employer per year per district
  unique(district_id, time_period, employer_name)
);

-- Enable RLS
alter table key_employers_analysis enable row level security;

-- Policy
create policy "Allow all operations for authenticated users" 
on key_employers_analysis for all 
using (true) 
with check (true);
