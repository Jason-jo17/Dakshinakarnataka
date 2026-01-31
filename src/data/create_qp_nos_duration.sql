-- Create table for QP NOS Duration Reference
create table if not exists qp_nos_duration (
  id uuid default gen_random_uuid() primary key,
  course_name text not null unique, -- QP NOS Name
  total_duration_hours numeric not null default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table qp_nos_duration enable row level security;

create policy "Allow all operations for authenticated users" 
on qp_nos_duration for all 
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
