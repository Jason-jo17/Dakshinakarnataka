-- Employer Survey V2 (Detailed)
CREATE TABLE IF NOT EXISTS employer_surveys_v2 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id VARCHAR(100), -- Linked to auth user ID if available
  
  -- Company Information
  company_name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100),
  company_type VARCHAR(50), -- 'Private Limited', 'Public Limited', 'MNC', etc.
  industry_sector VARCHAR(100),
  sub_sector VARCHAR(100),
  business_activity TEXT,
  
  -- Location
  office_address TEXT,
  manufacturing_location TEXT, -- If different
  district VARCHAR(100) DEFAULT 'Dakshina Kannada',
  state VARCHAR(100) DEFAULT 'Karnataka',
  
  -- Company Size
  workforce_total INTEGER DEFAULT 0,
  workforce_skilled INTEGER DEFAULT 0,
  workforce_unskilled INTEGER DEFAULT 0,
  
  -- Past 12-Month Hiring (JSON Array)
  -- [{ jobRole, numberOfPeople, averageSalary, skillGapsObserved }]
  hiring_past_12m JSONB DEFAULT '[]',
  
  -- Expected Hiring Next Year (JSON Array)
  -- [{ jobRole, expectedNumber, salaryRange: {min, max}, requiredSkills: [], requiredCertifications: [], placeOfDeployment }]
  hiring_next_year JSONB DEFAULT '[]',
  
  -- Contact Person (JSON Object)
  -- { name, designation, department, phone, email }
  contact_person JSONB DEFAULT '{}',
  
  -- Metadata
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'submitted'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
