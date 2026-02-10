-- Seed Data for District Skill Matrix (Dakshina Kannada)

-- Insert Assessment
WITH new_assessment AS (
  INSERT INTO dsm_assessments (district_id, assessment_year, overall_score, maturity_level, benchmark_scores, priority_matrix)
  VALUES (
    'Dakshina Kannada',
    '2023-24',
    58.8,
    'Developing',
    '{ "state_average": 52.3, "top_district": 74.2, "bottom_district": 38.5 }'::jsonb,
    '[
        { "name": "Industry Linkages", "effort": 80, "impact": 90 },
        { "name": "Digital Learning", "effort": 60, "impact": 75 },
        { "name": "Workshop Equipment", "effort": 90, "impact": 85 },
        { "name": "Placement Cell", "effort": 40, "impact": 60 },
        { "name": "Trainer Qual.", "effort": 50, "impact": 40 }
    ]'::jsonb
  )
  RETURNING id
)
-- Insert Dimensions
INSERT INTO dsm_dimensions (assessment_id, category, score, max_score, indicators)
SELECT
  id,
  unnest(ARRAY[
    'Infrastructure Capacity',
    'Human Resources',
    'Curriculum & Pedagogy',
    'Industry Linkages',
    'Placement Services',
    'Governance & Management',
    'Innovation & Technology',
    'Social Inclusion'
  ]),
  unnest(ARRAY[72, 65, 58, 48, 62, 55, 42, 68]),
  100,
  unnest(ARRAY[
    '[
        { "name": "ITI Buildings Quality", "score": 78, "weight": 0.3 },
        { "name": "Workshop Equipment", "score": 68, "weight": 0.4 },
        { "name": "Hostel Facilities", "score": 70, "weight": 0.3 }
    ]'::jsonb,
    '[
        { "name": "Trainer Availability", "score": 60, "weight": 0.4 },
        { "name": "Trainer Qualification", "score": 75, "weight": 0.35 },
        { "name": "Support Staff", "score": 58, "weight": 0.25 }
    ]'::jsonb,
    '[
        { "name": "Industry Alignment", "score": 62, "weight": 0.4 },
        { "name": "Practical Training %", "score": 55, "weight": 0.35 },
        { "name": "Assessment Quality", "score": 57, "weight": 0.25 }
    ]'::jsonb,
    '[
        { "name": "MoUs with Industry", "score": 45, "weight": 0.3 },
        { "name": "Guest Lectures", "score": 52, "weight": 0.3 },
        { "name": "Internship Placement", "score": 47, "weight": 0.4 }
    ]'::jsonb,
    '[
        { "name": "Placement Cell Active", "score": 68, "weight": 0.4 },
        { "name": "Job Fair Frequency", "score": 55, "weight": 0.3 },
        { "name": "Alumni Network", "score": 62, "weight": 0.3 }
    ]'::jsonb,
    '[
        { "name": "Committee Meetings", "score": 60, "weight": 0.3 },
        { "name": "Financial Management", "score": 58, "weight": 0.4 },
        { "name": "Data Systems", "score": 48, "weight": 0.3 }
    ]'::jsonb,
    '[
        { "name": "Digital Learning", "score": 38, "weight": 0.4 },
        { "name": "Modern Equipment", "score": 45, "weight": 0.35 },
        { "name": "R&D Activities", "score": 43, "weight": 0.25 }
    ]'::jsonb,
    '[
        { "name": "SC/ST Enrollment", "score": 72, "weight": 0.35 },
        { "name": "Women Enrollment", "score": 65, "weight": 0.35 },
        { "name": "PWD Facilities", "score": 67, "weight": 0.3 }
    ]'::jsonb
  ])
FROM new_assessment;
