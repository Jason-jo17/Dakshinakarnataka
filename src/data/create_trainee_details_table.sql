-- Create Trainee Details Table (1F.1)

CREATE TABLE IF NOT EXISTS trainee_details (
  -- Candidate Details
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255),
  parent_guardian_name VARCHAR(255),
  date_of_birth DATE,
  gender VARCHAR(50), -- Male, Female, Other
  social_category VARCHAR(50), -- General, SC, ST, Others
  residential_pincode VARCHAR(10),
  district VARCHAR(100),
  is_rural_candidate BOOLEAN, -- True for Rural, False for Urban
  state_ut VARCHAR(100),
  mobile_number VARCHAR(20),
  email_id VARCHAR(255),
  qualification_at_entry VARCHAR(255),

  -- Training Details
  training_center_name VARCHAR(255),
  training_city VARCHAR(100),
  training_center_pincode VARCHAR(10),
  training_district VARCHAR(100),
  training_state VARCHAR(100),
  training_programme_name VARCHAR(255),
  enrollment_date DATE,
  training_start_date DATE,
  training_end_date DATE,
  assessment_date DATE,
  certification_date DATE,
  is_nsfq_aligned BOOLEAN,
  qualification_pack_name VARCHAR(255),
  sector_skill_council VARCHAR(255),
  is_certified BOOLEAN,
  trainer_name VARCHAR(255),

  -- Post-Training Details
  is_employed BOOLEAN,
  employment_type VARCHAR(50), -- Wage, Self
  employment_start_date DATE,
  job_role VARCHAR(255),
  sector VARCHAR(255),
  employer_name VARCHAR(255),
  salary_fixed DECIMAL(10, 2),
  salary_variable DECIMAL(10, 2),
  work_district VARCHAR(100),
  work_state VARCHAR(100),
  work_place_type VARCHAR(50), -- Rural, Urban

  -- Time Series Analysis (Calculated or Entered)
  age_at_joining INTEGER,
  course_duration_days INTEGER,
  assessment_gap_days INTEGER,
  certification_gap_days INTEGER,
  delay_in_employment_days INTEGER,
  cycle_time_days INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
