export interface TraineeDetails {
  id: string; // Unique ID for React keys
  sno: number; // Serial Number for display

  // Candidate Details
  candidate_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  parent_guardian_name: string;
  date_of_birth: string; // dd/mm/yyyy
  gender: 'Male' | 'Female' | 'Other';
  social_category: 'General' | 'SC' | 'ST' | 'Others';
  residential_pincode: string;
  district: string;
  is_rural_candidate: 'Rural' | 'Urban'; // Mapped from UI question "Candidate stays in Rural/ Urban Area?"
  state_ut: string;
  mobile_number: string;
  email_id: string;
  qualification_at_entry: string;

  // Training Details
  training_center_name: string;
  training_city: string;
  training_center_pincode: string;
  training_district: string;
  training_state: string;
  training_programme_name: string;
  enrollment_date: string; // dd-mm-yyyy
  training_start_date: string; // dd-mm-yyyy
  training_end_date: string; // dd-mm-yyyy
  assessment_date: string; // dd-mm-yyyy
  certification_date: string; // dd-mm-yyyy
  is_nsfq_aligned: 'Yes' | 'No';
  qualification_pack_name: string;
  sector_skill_council: string;
  is_certified: 'Yes' | 'No';
  trainer_name: string;

  // Post-Training Details
  is_employed: 'Yes' | 'No';
  employment_type: 'Wage' | 'Self';
  employment_start_date: string; // dd/mm/yyyy
  job_role: string;
  sector: string;
  employer_name: string;
  salary_fixed: string;
  salary_variable: string;
  work_district: string;
  work_state: string;
  work_place_type: 'Rural' | 'Urban';

  // Time Series Analysis
  age_at_joining: string;
  course_duration: string;
  assessment_gap: string;
  certification_gap: string;
  delay_in_employment: string;
  cycle_time: string;
}
