-- Create table for Social Category Analysis by Sector (Table I)
create table if not exists social_category_sector_analysis (
  id uuid default uuid_generate_v4() primary key,
  district_id text not null,
  time_period text not null, -- Stores the Year (e.g. "2024")
  
  sector_name text not null,
  
  -- SC
  sc_trained numeric default 0,
  sc_placed numeric default 0,
  
  -- ST
  st_trained numeric default 0,
  st_placed numeric default 0,
  
  -- Minority
  minority_trained numeric default 0,
  minority_placed numeric default 0,
  
  -- Gen
  gen_trained numeric default 0,
  gen_placed numeric default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Constraint to ensure unique entries per sector per year per district
  unique(district_id, time_period, sector_name)
);

-- Enable RLS
alter table social_category_sector_analysis enable row level security;

-- Policy
create policy "Allow all operations for authenticated users" 
on social_category_sector_analysis for all 
using (true) 
with check (true);
