-- Add registration_number column to dic_master_companies
ALTER TABLE dic_master_companies 
ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100);

-- Enable RLS just in case (though usually enabled)
ALTER TABLE dic_master_companies ENABLE ROW LEVEL SECURITY;
