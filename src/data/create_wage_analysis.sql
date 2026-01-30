-- Create table for Wage Analysis (Table G)
create table if not exists wage_analysis (
  id uuid default uuid_generate_v4() primary key,
  district_id text not null,
  time_period text not null, -- Stores the Year (e.g. "2024")
  
  sector_name text not null,
  course_name text not null,
  
  -- Avg Wages
  avg_wage_rural_male numeric default 0,
  avg_wage_rural_female numeric default 0,
  avg_wage_urban_male numeric default 0,
  avg_wage_urban_female numeric default 0,
  
  -- Number of trainees placed
  placed_trainees numeric default 0,
  
  -- Number of placed trainees distribution
  placed_above_10_percent_min numeric default 0,  -- getting 10% or more above min wage
  placed_within_10_percent_min numeric default 0, -- Getting +/- 10% of the min wage
  placed_below_min numeric default 0,             -- Getting lower that min wage
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraint to ensure unique entries per course per year per district
  unique(district_id, time_period, sector_name, course_name)
);

-- Enable RLS
alter table wage_analysis enable row level security;

-- Policy
create policy "Allow all operations for authenticated users" 
on wage_analysis for all 
using (true) 
with check (true);
