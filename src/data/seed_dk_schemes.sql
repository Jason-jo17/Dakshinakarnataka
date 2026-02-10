-- Clear existing data for DK to avoid duplicates during re-seed
DELETE FROM public.district_schemes WHERE district_name = 'Dakshina Kannada';

INSERT INTO public.district_schemes 
(sno, scheme_name, funding_source, sector, trade, annual_intake, district_name)
VALUES
-- ==========================================
-- 1. CMKKY SCHEMES (TOP PRIORITY)
-- ==========================================
-- CMKKY (ITI)
(1, 'CMKKY', 'State', 'ITI Men-Automotive', 'Auto Electrical Maintenance Jr. Technician', 20, 'Dakshina Kannada'),
(2, 'CMKKY', 'State', 'ITI Men-Automotive', 'Automobile Repair and Maintenance Jr. Technician', 20, 'Dakshina Kannada'),
(3, 'CMKKY', 'State', 'ITI Men-ITES and related', 'Internet of Things Application Jr. Technician', 17, 'Dakshina Kannada'),
(4, 'CMKKY', 'State', 'ITI Women-Capital goods & manufacturing', 'Jr. Welding Technician using simulated learning Technique', 20, 'Dakshina Kannada'),
(5, 'CMKKY', 'State', 'ITI Women-IT & ITES', 'Internet of things', 40, 'Dakshina Kannada'),

-- CMKKY (KGTTI)
(6, 'CMKKY', 'State', 'KGTTI-IT', 'Cisco IT Essentials', 240, 'Dakshina Kannada'),
(7, 'CMKKY', 'State', 'KGTTI-IT', 'CCNA', 60, 'Dakshina Kannada'),
(8, 'CMKKY', 'State', 'KGTTI-IT', 'Tally Prime', 300, 'Dakshina Kannada'),
(9, 'CMKKY', 'State', 'KGTTI-Welding', 'Welding Technician', 80, 'Dakshina Kannada'),
(10, 'CMKKY', 'State', 'KGTTI-RAC', 'RAC-Technician', 80, 'Dakshina Kannada'),

-- CMKKY (GTTC)
(11, 'CMKKY', 'State', 'GTTC-Goods and Capital (Mechanical)', 'CAD-CAM', 84, 'Dakshina Kannada'),
(12, 'CMKKY', 'State', 'GTTC-Goods and Capital (Mechanical)', 'CNC Machine Program', 76, 'Dakshina Kannada'),
(13, 'CMKKY', 'State', 'GTTC-Goods and Capital (Mechanical)', 'Industrial Automation Specialist', 78, 'Dakshina Kannada'),

-- KSDC-CMKKY (CEDOK)
(14, 'KSDC-CMKKY scheme', 'State', 'CEDOK-CMKKY Trained Candidates', 'Self-Employment', 304, 'Dakshina Kannada'),


-- ==========================================
-- 2. OTHER TECH / VOCATIONAL / INDUSTRIAL
-- ==========================================
-- SANKLAP, SCP, TSP (KGTTI)
(15, 'SANKLAP', 'Central', 'KGTTI-Welding', 'Welding-TIG MIG/MAG', 20, 'Dakshina Kannada'),
(16, 'SCP', 'State', 'KGTTI-IT', 'Cisco IT Essentials', 40, 'Dakshina Kannada'),
(17, 'SCP', 'State', 'KGTTI-IT', 'Cisco Certified Network Associate (CCNA)', 20, 'Dakshina Kannada'),
(18, 'SCP', 'State', 'KGTTI-IT', 'Tally Prime', 20, 'Dakshina Kannada'),
(19, 'SCP', 'State', 'KGTTI-Welding', 'Welding Technician', 20, 'Dakshina Kannada'),
(20, 'SCP', 'State', 'KGTTI-RAC', 'RAC-Technician', 20, 'Dakshina Kannada'),
(21, 'TSP', 'State', 'KGTTI-IT', 'Cisco IT Essentials', 20, 'Dakshina Kannada'),
(22, 'TSP', 'State', 'KGTTI-IT', 'Cisco Certified Network Associate (CCNA)', 20, 'Dakshina Kannada'),
(23, 'TSP', 'State', 'KGTTI-IT', 'Tally Prime', 20, 'Dakshina Kannada'),

-- AITT (GTTC)
(24, 'AITT', 'State', 'GTTC-Goods and Capital (Mechanical)', 'CNC Programmer', 10, 'Dakshina Kannada'),
(25, 'AITT', 'State', 'GTTC-Goods and Capital (Mechanical)', 'Designer Mechanical', 8, 'Dakshina Kannada'),

-- PMKVY
(26, 'PMKVY 4.0', 'Central', 'PM Shri Jawahar Vidyalaya Mudipu-IT- Ites', 'Sr. Associate Desktop Publishing', 30, 'Dakshina Kannada'),
(27, 'PMKVY-4.0-CSCM', 'Central', 'KV1-IT-ITeS under PMKVY', 'Self-Employment', 11, 'Dakshina Kannada'),


-- ==========================================
-- 3. LIVELIHOOD / SELF-EMPLOYMENT
-- ==========================================
-- CEDOK (Excluding CMKKY one moved to top)
(28, 'SDEL General', 'State', 'CEDOK-women’s', 'Self-Employment', 90, 'Dakshina Kannada'),
(29, 'SDEL General', 'State', 'CEDOK-SC St candidates', 'Self-Employment', 60, 'Dakshina Kannada'),
(30, 'SDEL General', 'State', 'CEDOK-GFGC students', 'Self-Employment', 71, 'Dakshina Kannada'),
(31, 'SDEL General', 'State', 'CEDOK-General candidates', 'Self-Employment', 30, 'Dakshina Kannada'),
(32, 'SDEL General', 'State', 'CEDOK-SCP', 'Self-Employment', 25, 'Dakshina Kannada'),
(33, 'KSDC', 'State', 'CEDOK-ITI Students', 'Self-Employment', 90, 'Dakshina Kannada'),
(34, 'KSDC', 'State', 'CEDOK-General candidates', 'Self-Employment', 30, 'Dakshina Kannada'),

-- NRLM (RUDISET UJJERE)
(35, 'NRLM (RUDISET UJJERE)', 'Central', 'Process EDPs', 'Cell phone Repairs and Service', 424, 'Dakshina Kannada'),
(36, 'NRLM (RUDISET UJJERE)', 'Central', 'Process EDPs', 'TV Technician', 0, 'Dakshina Kannada'),
(37, 'NRLM (RUDISET UJJERE)', 'Central', 'Process EDPs', 'Desktop Publishing', 0, 'Dakshina Kannada'),
(38, 'NRLM (RUDISET UJJERE)', 'Central', 'Agricultural EDPs', 'Dairy Farming and Vermi Compost Making', 123, 'Dakshina Kannada'),
(39, 'NRLM (RUDISET UJJERE)', 'Central', 'General EDPs', 'General EDP', 119, 'Dakshina Kannada'),
(40, 'NRLM (RUDISET UJJERE)', 'Central', 'Product EDPs', 'Vastra Chitra Kala Udyami (Embroidery & Fabric Painting)', 96, 'Dakshina Kannada'),
(41, 'NRLM', 'State', 'CEDOK-SHG Members', 'Self-Employment', 120, 'Dakshina Kannada'),

-- Sanjeevini
(42, 'Sanjeevini-KSRLPS', 'State', 'Rural Livelihood', 'Modular Training programme KSRLPS Krishi Saki Sanjeevini programme', 133, 'Dakshina Kannada'),


-- ==========================================
-- 4. FISHERIES
-- ==========================================
(43, 'PMMSY Scheme (3 Days Non Residential Training)', 'Central', 'Fisheries', '3 Days Non Residential Training programme', 50, 'Dakshina Kannada'),
(44, 'PM-Mastaya Sampada Jagrukta Abhiyan', 'Central', 'Fisheries', '1 day awareness program to seek progress and implementation of PMMSJA', 1000, 'Dakshina Kannada'),
(45, 'Skill Development Training Programmes to SC fishers', 'Central', 'Fisheries', 'Farmers/ Fisheries Products', 60, 'Dakshina Kannada'),


-- ==========================================
-- 5. AGRICULTURE & HORTICULTURE (BOTTOM)
-- ==========================================
-- Horticulture (Centrally Sponsored)
(46, 'Centrally sponsored scheme', 'Central', 'Horticulture', 'Training on Apiculture', 185, 'Dakshina Kannada'),
(47, 'Centrally sponsored scheme', 'Central', 'Horticulture', 'Training on Apiculture', 228, 'Dakshina Kannada'),
(48, 'Centrally sponsored scheme', 'Central', 'Horticulture', 'Training on Cultivation practices of Oil palm', 55, 'Dakshina Kannada'),

-- Publicity and Literature (Zilla Panchayath) - Horticulture
(49, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Managing Emerging pest and diseases of coconut and Arecanut', 61, 'Dakshina Kannada'),
(50, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Cultivation Practices of Minor Fruits', 25, 'Dakshina Kannada'),
(51, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Apiculture', 51, 'Dakshina Kannada'),
(52, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Integrated Nutrient Management in Coconut and Arecanut', 100, 'Dakshina Kannada'),
(53, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Integrated Nutrient Management in Coconut and Arecanut', 72, 'Dakshina Kannada'),
(54, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Cultivation Practices of Jack fruit', 151, 'Dakshina Kannada'),
(55, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Oil palm Mega Drive', 75, 'Dakshina Kannada'),
(56, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Scope for employment under Horticulture sector and information regarding Schemes', 80, 'Dakshina Kannada'),
(57, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Scope for employment under Horticulture sector and information regarding Schemes', 138, 'Dakshina Kannada'),
(58, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Information on Crop insurance, crop survey, MGNREGa and cultivation of minor fruits', 90, 'Dakshina Kannada'),
(59, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Information on Crop insurance, crop survey, MGNREGa and cultivation of minor fruits', 90, 'Dakshina Kannada'),
(60, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Apiculture and Horticulture schemes', 85, 'Dakshina Kannada'),
(61, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding alternative crops for Arecanut', 89, 'Dakshina Kannada'),
(62, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Importance of Soil testing', 91, 'Dakshina Kannada'),
(63, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Mushroom cultivation', 139, 'Dakshina Kannada'),
(64, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Grafting method', 101, 'Dakshina Kannada'),
(65, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Grafting method', 97, 'Dakshina Kannada'),
(66, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Cultivation practices of Plantation crops', 60, 'Dakshina Kannada'),
(67, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Information regarding Horticulture schemes and vegetable cultivation', 75, 'Dakshina Kannada'),
(68, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Information regarding Arecanut leaf spot management practices, cultivation of oil palm, Drip irrigation and cultivation of Appemidi mango and minor fruits', 30, 'Dakshina Kannada'),
(69, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Information regarding Arecanut leaf spot management practices, cultivation of oil palm, Drip irrigation and cultivation of Appemidi mango and minor fruits', 83, 'Dakshina Kannada'),
(70, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Jasmine cultivation', 34, 'Dakshina Kannada'),
(71, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Arecanut cultivation', 40, 'Dakshina Kannada'),
(72, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Fruits and Vegetable cultivation', 45, 'Dakshina Kannada'),
(73, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Information regarding Horticulture schemes and Jasmine cultivation', 66, 'Dakshina Kannada'),
(74, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Mushroom cultivation', 83, 'Dakshina Kannada'),
(75, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Arecanut cultivation and alternate crops for arecanut', 110, 'Dakshina Kannada'),
(76, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Information on Horticultural crops and horticultural schemes', 80, 'Dakshina Kannada'),
(77, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training on Oil palm cultivation practices and drip irrigation', 25, 'Dakshina Kannada'),
(78, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Mushroom cultivation', 170, 'Dakshina Kannada'),
(79, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Mushroom cultivation', 86, 'Dakshina Kannada'),
(80, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training on Importance of drip irrigation', 52, 'Dakshina Kannada'),
(81, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training on Apiculture', 50, 'Dakshina Kannada'),
(82, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Information on Horticultural crops', 92, 'Dakshina Kannada'),
(83, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Information on Micro irrigation, Integrated nutrient management and Management of Arecanut leaf spot', 67, 'Dakshina Kannada'),
(84, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training on cultivation of fruit crops and nutmeg crop', 72, 'Dakshina Kannada'),
(85, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Management of Arecanut leaf spot disease', 44, 'Dakshina Kannada'),
(86, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Cultivation practices of Black pepper and Minor fruits', 63, 'Dakshina Kannada'),
(87, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Information on Crop insurance, Crop survey, MGNREGA and Minor fruits', 62, 'Dakshina Kannada'),
(88, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Information on Horticultural schemes', 80, 'Dakshina Kannada'),
(89, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training on Apiculture', 56, 'Dakshina Kannada'),
(90, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Information on Horticultural crops', 53, 'Dakshina Kannada'),
(91, 'Publicity and Literature', 'Zilla Panchayath (ZP scheme)', 'Horticulture', 'Training regarding Jasmine cultivation', 75, 'Dakshina Kannada'),

-- Sub Mission on Agriculture Extension
(92, 'Sub Mission on Agriculture Extension', 'Central', 'Agriculture', 'Mushroom Cultivation', 219, 'Dakshina Kannada'),
(93, 'Sub Mission on Agriculture Extension', 'Central', 'Agriculture', 'Honey Bee Rearing', 131, 'Dakshina Kannada'),
(94, 'Sub Mission on Agriculture Extension', 'Central', 'Agriculture', 'Organic Farming', 81, 'Dakshina Kannada'),
(95, 'Sub Mission on Agriculture Extension', 'Central', 'Agriculture', 'Dairy Farming', 21, 'Dakshina Kannada'),
(96, 'Sub Mission on Agriculture Extension', 'Central', 'Agriculture', 'Integrated Nutrient Management In Arecanut', 70, 'Dakshina Kannada'),
(97, 'Sub Mission on Agriculture Extension', 'Central', 'Agriculture', 'Jasmine Cultivation', 52, 'Dakshina Kannada'),
(98, 'Sub Mission on Agriculture Extension', 'Central', 'Agriculture', 'Paddy Cultivation and Nutrient Management', 50, 'Dakshina Kannada'),
(99, 'Sub Mission on Agriculture Extension', 'Central', 'Agriculture', 'Soil Heath & Testing', 20, 'Dakshina Kannada'),
(100, 'Sub Mission on Agriculture Extension', 'Central', 'Agriculture', 'Crop Survey', 85, 'Dakshina Kannada'),
(101, 'Sub Mission on Agriculture Extension', 'Central', 'Agriculture', 'Nutrient Management In Horticulture Crops', 25, 'Dakshina Kannada');
