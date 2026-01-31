-- Create tables for College Enrollment Analysis
-- Fixed: district_id is TEXT (not UUID) to match existing tables

-- 1. Graduate Level Courses (Bachelors)
CREATE TABLE IF NOT EXISTS college_enrollments_graduate (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id TEXT NOT NULL,
    college_name TEXT NOT NULL,
    course_name TEXT NOT NULL,
    duration_years NUMERIC,
    male_count INTEGER DEFAULT 0,
    female_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(district_id, college_name, course_name)
);

-- 2. Post Graduate Level Courses (Masters)
CREATE TABLE IF NOT EXISTS college_enrollments_postgraduate (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id TEXT NOT NULL,
    college_name TEXT NOT NULL,
    course_name TEXT NOT NULL,
    duration_years NUMERIC,
    male_count INTEGER DEFAULT 0,
    female_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(district_id, college_name, course_name)
);

-- 3. Diploma / Certificate Level Courses
CREATE TABLE IF NOT EXISTS college_enrollments_diploma (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id TEXT NOT NULL,
    college_name TEXT NOT NULL,
    course_name TEXT NOT NULL,
    duration_years NUMERIC,
    male_count INTEGER DEFAULT 0,
    female_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(district_id, college_name, course_name)
);

-- Enable RLS
ALTER TABLE college_enrollments_graduate ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_enrollments_postgraduate ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_enrollments_diploma ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users" ON college_enrollments_graduate FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON college_enrollments_graduate FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON college_enrollments_graduate FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON college_enrollments_graduate FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON college_enrollments_postgraduate FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON college_enrollments_postgraduate FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON college_enrollments_postgraduate FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON college_enrollments_postgraduate FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON college_enrollments_diploma FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON college_enrollments_diploma FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON college_enrollments_diploma FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON college_enrollments_diploma FOR DELETE USING (auth.role() = 'authenticated');
