-- Create table for CCN Dependency (Cost Category Pre-requisites)
create table if not exists ccn_dependency (
  id uuid default uuid_generate_v4() primary key,
  category text not null,
  cost_per_hour numeric not null,
  valid_from date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Separate policies for select/insert/update/delete if needed, 
-- but for now assuming public access or authenticated access is handled globally.
-- Enable RLS
alter table ccn_dependency enable row level security;

-- Policy to allow all operations for authenticated users (adjust as per actual auth model)
create policy "Allow all operations for authenticated users" 
on ccn_dependency for all 
using (true) 
with check (true);
