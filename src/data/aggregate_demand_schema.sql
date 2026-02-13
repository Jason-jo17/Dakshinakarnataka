-- Aggregate Demand Tables

-- 1. Survey of Employer (Template 2A)
CREATE TABLE IF NOT EXISTS ad_survey_employer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id VARCHAR(100) NOT NULL,
  employer_name VARCHAR(255) NOT NULL,
  employer_address TEXT,
  
  -- Company Details
  registration_number VARCHAR(100),
  company_type VARCHAR(100),
  sector VARCHAR(255),
  sub_sector VARCHAR(255),
  business_activity TEXT,
  manufacturing_location TEXT,
  state VARCHAR(100) DEFAULT 'Karnataka',

  -- Recruited in past 12 months
  recruited_past_12m_num INTEGER DEFAULT 0,
  recruited_past_12m_avg_salary DECIMAL(10, 2) DEFAULT 0,
  recruited_job_roles TEXT,
  skill_gaps_observed TEXT,
  
  -- Contact Person
  contact_person_name VARCHAR(255),
  contact_person_designation VARCHAR(255),
  contact_person_phone VARCHAR(50),
  contact_person_email VARCHAR(255),
  contact_department VARCHAR(255),
  
  -- Expected Recruitment this year
  expected_recruit_num INTEGER DEFAULT 0,
  expected_recruit_salary DECIMAL(10, 2) DEFAULT 0,
  expected_recruit_job_role TEXT,
  expected_recruit_qualification VARCHAR(255),
  place_of_recruitment VARCHAR(255),
  
  created_by_credential_id UUID, -- Links to the Auth User ID (Credential ID)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Skill Gap Study Metadata (Template 2B - Header)
CREATE TABLE IF NOT EXISTS ad_skill_gap_study (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id VARCHAR(100) NOT NULL,
  study_month_year VARCHAR(50),
  sample_size INTEGER,
  study_duration VARCHAR(100),
  study_done_by VARCHAR(255),
  
  -- Scope of Study (Yes/No)
  covers_govt_agenda BOOLEAN DEFAULT FALSE,
  covers_agri BOOLEAN DEFAULT FALSE,
  covers_gpdp BOOLEAN DEFAULT FALSE,
  covers_new_industries BOOLEAN DEFAULT FALSE,
  covers_self_emp BOOLEAN DEFAULT FALSE,
  
  -- If No, qualitative fields
  govt_agenda_schemes TEXT,
  agri_demand_likely TEXT,
  gpdp_projects_planned TEXT,
  new_industries_licenses TEXT,
  self_emp_likely_numbers TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Skill Gap Study Demand Data (Template 2B - Table)
CREATE TABLE IF NOT EXISTS ad_skill_gap_demand (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  study_id UUID REFERENCES ad_skill_gap_study(id) ON DELETE CASCADE,
  sector VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  indicative_requirement INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Macro Analysis (Template 2C)
CREATE TABLE IF NOT EXISTS ad_macro_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'Demographic', 'GSDP', 'Workforce', 'Productivity'
  indicator VARCHAR(255) NOT NULL, -- e.g. 'Total Population', 'Agriculture GSDP'
  value DECIMAL(15, 2),
  year VARCHAR(20),
  
  -- Extra fields for specific template needs
  sector VARCHAR(100), -- For GSDP/Workforce breakdown
  sub_category VARCHAR(100), -- 'Rural', 'Urban', 'SC', 'ST'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Demand GPDP & Government Agenda (Template 2D)
-- Part 1: Demographics / Metadata
CREATE TABLE IF NOT EXISTS ad_gpdp_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id VARCHAR(100) NOT NULL,
  total_gram_panchayats INTEGER,
  gpdp_submitted_on DATE,
  total_blocks INTEGER,
  total_villages INTEGER,
  total_clusters INTEGER,
  pop_total INTEGER,
  pop_rural INTEGER,
  pop_urban INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Part 1: Key Projects (GPDP)
CREATE TABLE IF NOT EXISTS ad_gpdp_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metadata_id UUID REFERENCES ad_gpdp_metadata(id) ON DELETE CASCADE,
  project_name VARCHAR(255),
  num_gps_covered INTEGER,
  indicative_cost DECIMAL(15, 2), -- 'Indicative' column
  role_construction VARCHAR(255),
  role_onm VARCHAR(255),
  count_construction INTEGER DEFAULT 0,
  count_onm INTEGER DEFAULT 0
);

-- Part 2: Other Government Development Agenda
CREATE TABLE IF NOT EXISTS ad_govt_agenda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metadata_id UUID REFERENCES ad_gpdp_metadata(id) ON DELETE CASCADE,
  project_name VARCHAR(255),
  block_name VARCHAR(100),
  indicative_cost DECIMAL(15, 2),
  role_construction VARCHAR(255),
  role_onm VARCHAR(255),
  count_construction INTEGER DEFAULT 0,
  count_onm INTEGER DEFAULT 0
);

-- 6. Self Employment (Template 2E)
-- 2E.1 Training Centre / Scheme Targets
CREATE TABLE IF NOT EXISTS ad_self_emp_trainees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id VARCHAR(100) NOT NULL,
  training_centre VARCHAR(255),
  scheme VARCHAR(100),
  sector VARCHAR(100),
  -- Previous Year
  prev_trained_m INTEGER DEFAULT 0,
  prev_trained_f INTEGER DEFAULT 0,
  prev_se_m INTEGER DEFAULT 0,
  prev_se_f INTEGER DEFAULT 0,
  prev_we_m INTEGER DEFAULT 0,
  prev_we_f INTEGER DEFAULT 0,
  -- This Year Plan
  curr_trained_target INTEGER DEFAULT 0,
  curr_se_target INTEGER DEFAULT 0,
  curr_we_target INTEGER DEFAULT 0,
  -- Next Year Plan
  next_to_train_target INTEGER DEFAULT 0,
  next_se_target INTEGER DEFAULT 0,
  next_we_target INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2E.2 Mudra Loans
CREATE TABLE IF NOT EXISTS ad_self_emp_mudra (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id VARCHAR(100) NOT NULL,
  lead_bank VARCHAR(255),
  branch_details VARCHAR(255),
  contact_person VARCHAR(255),
  sector VARCHAR(100),
  -- Last Year Sanctioned
  sishu_num_ly INTEGER DEFAULT 0,
  sishu_amt_ly DECIMAL(15, 2) DEFAULT 0,
  kishore_num_ly INTEGER DEFAULT 0,
  kishore_amt_ly DECIMAL(15, 2) DEFAULT 0,
  tarun_num_ly INTEGER DEFAULT 0,
  tarun_amt_ly DECIMAL(15, 2) DEFAULT 0,
  -- Next Year Plan
  sishu_num_ny INTEGER DEFAULT 0,
  sishu_amt_ny DECIMAL(15, 2) DEFAULT 0,
  kishore_num_ny INTEGER DEFAULT 0,
  kishore_amt_ny DECIMAL(15, 2) DEFAULT 0,
  tarun_num_ny INTEGER DEFAULT 0,
  tarun_amt_ny DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Primary Sector (Template 2F)
CREATE TABLE IF NOT EXISTS ad_primary_sector (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id VARCHAR(100) NOT NULL,
  category VARCHAR(100), -- 'Agriculture', 'Horticulture', etc.
  crop_name VARCHAR(255),
  area_hectare DECIMAL(12, 2) DEFAULT 0,
  production_tonnes DECIMAL(12, 2) DEFAULT 0,
  -- Yield Analysis
  district_yield DECIMAL(10, 2) DEFAULT 0,
  yield_gap_state DECIMAL(10, 2) DEFAULT 0,
  yield_gap_india DECIMAL(10, 2) DEFAULT 0,
  -- Skilling
  can_skilling_address_gap BOOLEAN DEFAULT FALSE,
  course_avail_kvk BOOLEAN DEFAULT FALSE,
  course_avail_tp BOOLEAN DEFAULT FALSE,
  course_avail_kvic BOOLEAN DEFAULT FALSE,
  course_avail_others VARCHAR(255),
  source_outside_district VARCHAR(255),
  -- Potential
  potential_trainees_regular INTEGER DEFAULT 0,
  potential_trainees_rpl INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2F.3 Non-Timber Forest Produce
CREATE TABLE IF NOT EXISTS ad_forest_produce (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id VARCHAR(100) NOT NULL,
  produce_type VARCHAR(255), -- 'Edible plant products', 'Medicinal plants', etc.
  significance VARCHAR(255),
  number_involved INTEGER,
  production_qty VARCHAR(100),
  key_markets VARCHAR(255),
  skill_dev_intervention VARCHAR(255),
  course_available VARCHAR(255),
  if_not_reason VARCHAR(255),
  remark TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aggregate Demand Summary (Consolidation Sheet)
CREATE TABLE IF NOT EXISTS ad_demand_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  district_id VARCHAR(100) NOT NULL,
  sector_category VARCHAR(50), -- 'Primary', 'Secondary', 'Services'
  sector VARCHAR(255),
  role VARCHAR(255),
  
  -- The input columns from other sheets (can be pre-filled or manual)
  demand_survey INTEGER DEFAULT 0,
  demand_skill_gap INTEGER DEFAULT 0,
  demand_gpdp INTEGER DEFAULT 0,
  demand_self_emp INTEGER DEFAULT 0,
  demand_primary INTEGER DEFAULT 0,
  
  -- The User Input Field
  most_realistic_estimate INTEGER DEFAULT 0,
  
  -- Optional Sector Based Estimates (Yellow columns)
  est_agriculture INTEGER DEFAULT 0,
  est_mining INTEGER DEFAULT 0,
  est_manufacturing INTEGER DEFAULT 0,
  est_electricity INTEGER DEFAULT 0, -- Gas Water
  est_construction INTEGER DEFAULT 0,
  est_trade INTEGER DEFAULT 0, -- Hotel Transport Communication
  est_finance INTEGER DEFAULT 0, -- Real Estate & Professional
  est_public_admin INTEGER DEFAULT 0, -- Defence and Other
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);