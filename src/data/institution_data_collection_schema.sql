-- Institution Data Collection Schema

-- Template 1B: Schemes Operating
CREATE TABLE IF NOT EXISTS institution_schemes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id VARCHAR(100) NOT NULL, -- Link to Auth ID
  scheme_name VARCHAR(255) NOT NULL,
  affiliated_centers TEXT, -- Comma separated or description
  sector VARCHAR(100),
  trades TEXT, -- Comma separated
  annual_intake INTEGER DEFAULT 0,
  contact_person VARCHAR(255),
  contact_phone VARCHAR(50),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template 1C: Trainer Data
CREATE TABLE IF NOT EXISTS institution_trainers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id VARCHAR(100) NOT NULL,
  trainer_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  qualification VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  experience_years DECIMAL(4, 1),
  sector_trade VARCHAR(255), -- Domain expertise
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Template 1E uses 'district_training_centers' and 1F uses 'trainee_details'
