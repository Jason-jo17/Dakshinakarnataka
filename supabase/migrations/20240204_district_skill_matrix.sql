
create table district_skill_matrix (
  id uuid default gen_random_uuid() primary key,
  district_id text not null,
  row_id text not null,
  variable_a numeric,
  variable_b numeric,
  indicator_value numeric,
  district_score numeric,
  evidence_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add unique constraint to ensure one entry per district per row
alter table district_skill_matrix add constraint district_skill_matrix_district_row_unique unique (district_id, row_id);

-- Enable RLS
alter table district_skill_matrix enable row level security;

-- Create policies (start with permissive for development)
create policy "Enable all access for authenticated users" on district_skill_matrix
  for all using (true) with check (true);
