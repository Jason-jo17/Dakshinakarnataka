-- Migration Script: Fix Training Center Data Access
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON district_training_centers;
DROP POLICY IF EXISTS "Enable read access for all users" ON district_training_centers;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON district_training_centers;
DROP POLICY IF EXISTS "Enable insert for authenticated" ON district_training_centers;
DROP POLICY IF EXISTS "Enable update for authenticated" ON district_training_centers;
DROP POLICY IF EXISTS "Enable delete for authenticated" ON district_training_centers;

-- Step 2: Create new policies
-- Allow read access for all users (including anonymous)
CREATE POLICY "Enable read access for all users" ON district_training_centers
    FOR SELECT
    USING (true);

-- Allow insert for authenticated users only
CREATE POLICY "Enable insert for authenticated" ON district_training_centers
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Allow update for authenticated users only
CREATE POLICY "Enable update for authenticated" ON district_training_centers
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Allow delete for authenticated users only
CREATE POLICY "Enable delete for authenticated" ON district_training_centers
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Step 3: Seed training center data
-- Delete existing data for Dakshina Kannada
DELETE FROM district_training_centers WHERE district = 'Dakshina Kannada';

-- Insert training centers
INSERT INTO district_training_centers (
    training_center_name,
    center_address1,
    pincode,
    contact_person_name,
    contact_phone,
    contact_email,
    schemes_empanelled,
    trades_offered,
    trained_last_year,
    placed_last_year,
    district
) VALUES
(
    'District Agriculture Training Centre Belthangady',
    'Near ADA Office, Ambedkar Bhavan Old Bridge Road, Belthangady',
    '574214',
    'Assistant Director of Agriculture',
    '8277931067',
    'datcbgy@gmail.com',
    'Training of Farmers and Agriculture Extension Staffs',
    'Agriculture',
    1848,
    0,
    'Dakshina Kannada'
),
(
    'RUDSETI Ujire',
    'RUDSET Institute Siddavana, Ujire, Belthangady Tq',
    '574240',
    'M SURESH',
    '6364561982',
    'rudsetujr@gmail.com',
    'NRLM',
    'Self Employment',
    762,
    0,
    'Dakshina Kannada'
),
(
    'Horticulture',
    'VVG4+566, Upper, Bendoor, Mangaluru',
    '575002',
    'Darshan',
    '8151069391',
    'ddhdk@yahoo.com',
    'Department Schemes',
    'Horticulture',
    5952,
    0,
    'Dakshina Kannada'
),
(
    'College of Fisheries, Mangaluru',
    'Yekkur, Kankanady P.O. Mangaluru',
    '575002',
    'Dean Fisheries',
    '0824-2248936',
    'deanfisheries@gmail.com',
    'PMMSY Scheme',
    'Fisheries',
    50,
    0,
    'Dakshina Kannada'
),
(
    'Govt.ITI(M)Mangaluru-4',
    'Kadri Hiis Mangaluru-4',
    '575004',
    'Principal',
    '0824-2211285',
    'govtiti.mangaluru@gmail.com',
    'CMKKY',
    'Auto Electrical Maintenance Jr.Technician',
    20,
    14,
    'Dakshina Kannada'
),
(
    'GOVT. ITI (WOMEN) MANGALORE',
    'KONCHADY POST, MANGALORE',
    '575008',
    'SHIVAKUMAR S.',
    '9880119147',
    'govitiw.mangalore@gmail.com',
    'CMKKY',
    'Jr. Welding Technician',
    20,
    18,
    'Dakshina Kannada'
),
(
    'KGTTI Mangaluru',
    '2nd Floor, Govt. ITI (Women) Building, Airport road, Konchady',
    '575008',
    'Mr. Giridhar Salian',
    '8553306561',
    'director.mangalore@kgtti.com',
    'CMKKY',
    'Cisco, Tally, Welding, RAC',
    700,
    0,
    'Dakshina Kannada'
),
(
    'GTTC, MANGALORE',
    'PLOT NO.7E, INDUSTRIAL AREA, BAIKAMPADY, MANGALORE',
    '575011',
    'Mr.Lakshminarayana C R',
    '9008263660',
    'gttcmng@gmail.com',
    'CMKKY',
    'CAD-CAM, CNC, Automation',
    238,
    11,
    'Dakshina Kannada'
),
(
    'JNV DAKSHINA KANNADA',
    'PM SHRI SCHOOL JAWAHAR NAVODAYA VIDYALAYA MUDIPU',
    '574153',
    'Ashok K',
    '9448888375',
    'jnvmangalore@gmail.com',
    'School Protocol',
    'Sr. Associate DESKTOP Publishing',
    30,
    0,
    'Dakshina Kannada'
),
(
    'CEDOK',
    'Skill Development Office, Urwa Market Building',
    '575006',
    'Arvind',
    '9945729807',
    'cedokmangaluru1@gmail.com',
    'CMKKY',
    'Self Employment',
    846,
    0,
    'Dakshina Kannada'
),
(
    'KV No.1 Mangaluru',
    'KENDRIYA VIDYALAYA NO.1 MANGALURU, PANAMBUR',
    '575010',
    'Mr Tek chand',
    '9890271714',
    'santosh_kannan@yahoo.com',
    'PMKVY-4.0-CSCM',
    'Skill Training',
    1,
    11,
    'Dakshina Kannada'
),
(
    'ICAR-Krishi Vigyan Kendra, Dakshina Kannada',
    'P.B. No. 515, Kankanady, Mangaluru',
    '575002',
    'Dr. T.J. Ramesha',
    '8794706468',
    'kvkdk@rediffmail.com',
    'ICAR',
    'Agriculture Extension',
    0,
    0,
    'Dakshina Kannada'
);

-- Verify the data was inserted
SELECT COUNT(*) as total_centers FROM district_training_centers WHERE district = 'Dakshina Kannada';
