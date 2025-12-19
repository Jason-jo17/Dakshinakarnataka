// Dakshina Kannada District Engineering Ecosystem - Dashboard Data
// Source: Research conducted December 2024

export const dashboardData = {
    // Overview KPIs
    overview: {
        totalOpenings: 1000,
        skilledTalent: 3400,
        skillGapPercentage: 28,
        placementRate: 62,
        avgFresherSalary: 4.2,
        trends: {
            openings: { direction: 'up', value: 15 },
            skillGap: { direction: 'down', value: 5 },
            placementRate: { direction: 'up', value: 4 }
        }
    },

    // Student Supply Data
    supply: {
        totalStudents: 34700,
        annualGraduates: 8675,
        certifiedStudents: 3400,
        readinessScore: 72,
        totalInstitutions: 17
    },

    // Institutions with actual data
    institutions: [
        {
            id: 1,
            name: "NITK Surathkal",
            type: "Engineering",
            taluk: "Surathkal",
            total_students: 4500,
            assessed_students: 1050,
            placed_students: 756,
            avg_skill_score: 85,
            status: "Active",
            placement_rate: 75,
            highest_package: 55.0,
            average_package: 16.25,
            median_package: 14.0,
            top_recruiters: ["Google", "Microsoft", "Amazon", "Goldman Sachs", "Adobe"],
            nirf_rank: 17,
            naac_grade: "A++",
            swtt_level: 4
        },
        {
            id: 2,
            name: "Srinivas Institute of Technology",
            type: "Engineering",
            taluk: "Valachil",
            total_students: 2000,
            assessed_students: 514,
            placed_students: 447,
            avg_skill_score: 72,
            status: "Active",
            placement_rate: 86.9,
            highest_package: 8.0,
            average_package: 4.48,
            median_package: 4.0,
            top_recruiters: ["Infosys", "TCS", "Wipro", "Cognizant"],
            swtt_level: 3
        },
        {
            id: 3,
            name: "St Joseph Engineering College",
            type: "Engineering",
            taluk: "Vamanjoor",
            total_students: 3360,
            assessed_students: 596,
            placed_students: 424,
            avg_skill_score: 68,
            status: "Active",
            placement_rate: 71.1,
            highest_package: 24.5,
            average_package: 5.6,
            median_package: 5.6,
            top_recruiters: ["Infosys", "TCS", "Bosch", "Cognizant"],
            nirf_rank: 160,
            naac_grade: "A+",
            swtt_level: 3
        },
        {
            id: 4,
            name: "Sahyadri College of Engineering",
            type: "Engineering",
            taluk: "Adyar",
            total_students: 3120,
            assessed_students: 434,
            placed_students: 310,
            avg_skill_score: 70,
            status: "Active",
            placement_rate: 71,
            highest_package: 72.00,
            average_package: 6.3,
            median_package: 4.75,
            top_recruiters: ["TCS", "Infosys", "Wipro", "Bosch", "Rolls Royce"],
            nirf_rank: 167,
            naac_grade: "A",
            swtt_level: 3
        },
        {
            id: 5,
            name: "Yenepoya Institute of Technology",
            type: "Engineering",
            taluk: "Moodbidri",
            total_students: 1200,
            assessed_students: 222,
            placed_students: 178,
            avg_skill_score: 65,
            status: "Active",
            placement_rate: 80,
            highest_package: 12.0,
            average_package: 4.5,
            median_package: 4.0,
            top_recruiters: ["Infosys", "Wipro", "Accenture"],
            swtt_level: 3
        },
        {
            id: 6,
            name: "Bearys Institute of Technology",
            type: "Engineering",
            taluk: "Innoli",
            total_students: 1200,
            assessed_students: 98,
            placed_students: 70,
            avg_skill_score: 63,
            status: "Active",
            placement_rate: 71.4,
            highest_package: 25.0,
            average_package: 5.0,
            median_package: 4.0,
            top_recruiters: ["TCS", "Infosys", "Tech Mahindra"],
            swtt_level: 2
        },
        {
            id: 7,
            name: "Canara Engineering College",
            type: "Engineering",
            taluk: "Benjanapadavu",
            total_students: 3000,
            assessed_students: 346,
            placed_students: 201,
            avg_skill_score: 62,
            status: "Active",
            placement_rate: 58,
            highest_package: 23.68,
            average_package: 4.0,
            median_package: 4.0,
            top_recruiters: ["Infosys", "Cognizant", "Accenture", "Bosch"],
            swtt_level: 2
        },
        {
            id: 8,
            name: "PA College of Engineering",
            type: "Engineering",
            taluk: "Nadupadavu",
            total_students: 2000,
            assessed_students: 500,
            placed_students: 350,
            avg_skill_score: 64,
            status: "Active",
            placement_rate: 70,
            highest_package: 12.0,
            average_package: 4.2,
            median_package: 4.0,
            top_recruiters: ["TCS", "Wipro", "L&T"],
            swtt_level: 2
        },
        {
            id: 9,
            name: "Shree Devi Institute of Technology",
            type: "Engineering",
            taluk: "Kenjar",
            total_students: 2400,
            assessed_students: 530,
            placed_students: 318,
            avg_skill_score: 61,
            status: "Active",
            placement_rate: 60,
            highest_package: 16.0,
            average_package: 4.5,
            median_package: 4.0,
            top_recruiters: ["Infosys", "TCS", "Wipro"],
            swtt_level: 2
        },
        {
            id: 10,
            name: "AJ Institute of Engineering",
            type: "Engineering",
            taluk: "Kottara Chowki",
            total_students: 1920,
            assessed_students: 300,
            placed_students: 191,
            avg_skill_score: 60,
            status: "Active",
            placement_rate: 64,
            highest_package: 8.0,
            average_package: 3.8,
            median_package: 3.5,
            top_recruiters: ["Infosys", "TCS", "Wipro"],
            swtt_level: 2
        }
    ],

    // Centers of Excellence with actual data
    centersOfExcellence: [
        {
            id: 1,
            name: "NITK STEP Incubator",
            location: "NITK Surathkal",
            focus_area: "Technology Entrepreneurship",
            performance_score: 92,
            training_completion_rate: 88,
            status: "High Performing",
            trainings_conducted: 45,
            students_trained: 850,
            placement_rate: 85,
            utilization_rate: 78,
            equipment_usage_score: 82,
            faculty_readiness_score: 90,
            industry_alignment_score: 88,
            budget_allocated: 5.0,
            budget_utilized: 4.2,
            notable_achievements: "Practo, Delhivery, Nestaway alumni"
        },
        {
            id: 2,
            name: "Sahyadri ACIC",
            location: "Sahyadri College, Adyar",
            focus_area: "Innovation & Incubation",
            performance_score: 78,
            training_completion_rate: 75,
            status: "High Performing",
            trainings_conducted: 28,
            students_trained: 420,
            placement_rate: 70,
            utilization_rate: 65,
            equipment_usage_score: 70,
            faculty_readiness_score: 75,
            industry_alignment_score: 72,
            budget_allocated: 2.3,
            budget_utilized: 1.8,
            notable_achievements: "22 startups incubated, 12 active"
        },
        {
            id: 3,
            name: "SJEC NAIN Center",
            location: "St Joseph Engineering College",
            focus_area: "Industry Partnership",
            performance_score: 72,
            training_completion_rate: 68,
            status: "Average",
            trainings_conducted: 22,
            students_trained: 380,
            placement_rate: 68,
            utilization_rate: 58,
            equipment_usage_score: 65,
            faculty_readiness_score: 70,
            industry_alignment_score: 75,
            budget_allocated: 1.5,
            budget_utilized: 1.1,
            notable_achievements: "KCCI, IMTMA partnerships"
        },
        {
            id: 4,
            name: "STPI Mangaluru",
            location: "Derebail, Mangaluru",
            focus_area: "Software Technology",
            performance_score: 85,
            training_completion_rate: 80,
            status: "High Performing",
            trainings_conducted: 35,
            students_trained: 650,
            placement_rate: 82,
            utilization_rate: 75,
            equipment_usage_score: 78,
            faculty_readiness_score: 82,
            industry_alignment_score: 85,
            budget_allocated: 12.0,
            budget_utilized: 10.5,
            notable_achievements: "250+ companies, ₹3,500 cr exports"
        }
    ],

    // Industry Demand with actual companies
    industryDemand: [
        {
            id: 1,
            company_name: "Infosys BPM Mangaluru",
            company_type: "Large Enterprise",
            sector: "IT/ITES",
            job_role: "Process Executive",
            demand_count: 38,
            projection_period: "6 Months",
            skills_required: "MS Excel, Communication, Voice Process",
            avg_salary: "3.4-4.5 LPA",
            location: "Kamblapadavu"
        },
        {
            id: 2,
            company_name: "Cognizant",
            company_type: "Large Enterprise",
            sector: "IT/ITES",
            job_role: "Business Analyst",
            demand_count: 27,
            projection_period: "6 Months",
            skills_required: "Data Analysis, Mortgage Processing, SQL",
            avg_salary: "4.5-6.0 LPA",
            location: "Bendoorwell"
        },
        {
            id: 3,
            company_name: "EG Danmark A/S",
            company_type: "GCC",
            sector: "IT/ITES",
            job_role: "Java Developer",
            demand_count: 15,
            projection_period: "12 Months",
            skills_required: "Java, Spring Boot, Microservices",
            avg_salary: "6.0-10.0 LPA",
            location: "Mangaluru"
        },
        {
            id: 4,
            company_name: "Winman Software",
            company_type: "SME",
            sector: "IT/ITES",
            job_role: "Full Stack Developer",
            demand_count: 12,
            projection_period: "12 Months",
            skills_required: "MERN Stack, Python, React",
            avg_salary: "5.0-8.0 LPA",
            location: "Mangaluru"
        },
        {
            id: 5,
            company_name: "UniCourt (Mangalore Infotech)",
            company_type: "Startup",
            sector: "IT/ITES",
            job_role: "Python Developer",
            demand_count: 10,
            projection_period: "6 Months",
            skills_required: "Python, Django, Flask, AWS",
            avg_salary: "6.0-12.0 LPA",
            location: "Mangaluru"
        },
        {
            id: 6,
            company_name: "Bix Bytes Solutions",
            company_type: "SME",
            sector: "IT/ITES",
            job_role: "MERN Developer",
            demand_count: 8,
            projection_period: "6 Months",
            skills_required: "MongoDB, Express, React, Node.js",
            avg_salary: "4.0-7.0 LPA",
            location: "Mangaluru"
        },
        {
            id: 7,
            company_name: "BOSE Professional",
            company_type: "GCC",
            sector: "Manufacturing",
            job_role: "Audio Engineer",
            demand_count: 6,
            projection_period: "12 Months",
            skills_required: "Audio Technology, Embedded Systems",
            avg_salary: "8.0-15.0 LPA",
            location: "Mangaluru"
        }
    ],

    // Skills demand actual data
    skillsDemand: [
        {
            name: "Python Programming",
            demand: 398,
            supply: 280,
            gap: 118,
            gapPercentage: 30,
            avgSalary: "5.0-10.0 LPA",
            topCompanies: ["UniCourt", "Winman", "Bix Bytes"]
        },
        {
            name: "Java/Spring Boot",
            demand: 285,
            supply: 220,
            gap: 65,
            gapPercentage: 23,
            avgSalary: "6.0-12.0 LPA",
            topCompanies: ["EG Danmark", "Infosys", "Cognizant"]
        },
        {
            name: "React.js/Frontend",
            demand: 245,
            supply: 180,
            gap: 65,
            gapPercentage: 27,
            avgSalary: "5.0-10.0 LPA",
            topCompanies: ["Winman", "Bix Bytes", "Idaksh"]
        },
        {
            name: "MERN Stack",
            demand: 180,
            supply: 120,
            gap: 60,
            gapPercentage: 33,
            avgSalary: "4.0-8.0 LPA",
            topCompanies: ["Bix Bytes", "Winman", "Startups"]
        },
        {
            name: "Cloud (AWS/GCP)",
            demand: 120,
            supply: 45,
            gap: 75,
            gapPercentage: 63,
            avgSalary: "7.0-16.0 LPA",
            topCompanies: ["UniCourt", "EG Danmark", "IT Services"]
        },
        {
            name: "DevOps/Kubernetes",
            demand: 95,
            supply: 30,
            gap: 65,
            gapPercentage: 68,
            avgSalary: "6.5-14.0 LPA",
            topCompanies: ["Tech MNCs", "GCCs"]
        },
        {
            name: "Data Science/Analytics",
            demand: 150,
            supply: 75,
            gap: 75,
            gapPercentage: 50,
            avgSalary: "6.0-12.0 LPA",
            topCompanies: ["Cognizant", "Analytics Firms"]
        },
        {
            name: "Mobile Development",
            demand: 110,
            supply: 85,
            gap: 25,
            gapPercentage: 23,
            avgSalary: "5.0-12.0 LPA",
            topCompanies: ["Product Companies"]
        },
        {
            name: "Embedded Systems",
            demand: 85,
            supply: 110,
            gap: -25,
            gapPercentage: -29,
            avgSalary: "4.5-9.0 LPA",
            topCompanies: ["BOSE", "Bosch", "Auto"]
        },
        {
            name: "Soft Skills/Communication",
            demand: 300,
            supply: 180,
            gap: 120,
            gapPercentage: 40,
            avgSalary: "N/A",
            topCompanies: ["All BPO/IT"]
        }
    ],

    // Placement trends actual data
    placementTrends: [
        { year: '2020', rate: 58, avgPackage: 3.8, studentsPlaced: 2100 },
        { year: '2021', rate: 62, avgPackage: 4.0, studentsPlaced: 2350 },
        { year: '2022', rate: 68, avgPackage: 4.3, studentsPlaced: 2700 },
        { year: '2023', rate: 64, avgPackage: 4.5, studentsPlaced: 2850 },
        { year: '2024', rate: 72, avgPackage: 4.8, studentsPlaced: 3400 }
    ],

    // Top recruiters with actual data
    topRecruiters: [
        { name: "Infosys BPM", sector: "IT/ITES", hires: 450, avgSal: "3.4-4.5 LPA", employees: 2500 },
        { name: "Cognizant", sector: "IT/ITES", hires: 380, avgSal: "4.5-6.0 LPA", employees: 2000 },
        { name: "TCS", sector: "IT/ITES", hires: 320, avgSal: "3.6-4.2 LPA", employees: 1000 },
        { name: "Wipro", sector: "IT/ITES", hires: 180, avgSal: "3.8-4.5 LPA", employees: 800 },
        { name: "Tech Mahindra", sector: "IT/ITES", hires: 120, avgSal: "3.5-4.2 LPA", employees: 600 },
        { name: "Bosch", sector: "Automotive", hires: 95, avgSal: "4.5-7.0 LPA", employees: 400 },
        { name: "L&T", sector: "Construction", hires: 85, avgSal: "4.0-6.0 LPA", employees: 350 }
    ],

    // Salary benchmarks by role
    salaryBenchmarks: [
        { role: "Software Developer", min: 3.5, avg: 5.5, max: 16.25, demand: "Very High" },
        { role: "Data Scientist", min: 5.0, avg: 8.0, max: 20.0, demand: "High" },
        { role: "Full Stack Dev", min: 4.0, avg: 6.5, max: 12.0, demand: "Very High" },
        { role: "Cloud Engineer", min: 5.0, avg: 9.0, max: 16.0, demand: "High" },
        { role: "DevOps Engineer", min: 5.0, avg: 8.5, max: 14.0, demand: "High" },
        { role: "Business Analyst", min: 4.0, avg: 6.0, max: 10.0, demand: "Medium" },
        { role: "Process Executive", min: 2.5, avg: 3.5, max: 5.0, demand: "Very High" },
        { role: "Embedded Engineer", min: 3.5, avg: 5.5, max: 9.0, demand: "Medium" }
    ],

    // Training programs actual data
    trainingPrograms: [
        {
            name: "KDEM Technovanza",
            type: "Government",
            participants: 1000,
            status: "Active",
            skills: ["Python", "Java", "Cloud", "AI/ML"],
            duration: "6 months",
            placement_assistance: true
        },
        {
            name: "Infosys Winternship",
            type: "Corporate",
            participants: 500,
            status: "Active",
            skills: ["Software Dev", "Digital Skills"],
            duration: "76 days",
            placement_assistance: true
        },
        {
            name: "STPI Data Science Training",
            type: "Government",
            participants: 200,
            status: "Completed",
            skills: ["Python", "ML", "Data Analytics"],
            duration: "6 months",
            placement_assistance: true
        },
        {
            name: "PMKVY Karnataka",
            type: "Government",
            participants: 5500,
            status: "Active",
            skills: ["AI", "5G", "Cybersecurity", "Drones"],
            duration: "3-6 months",
            placement_assistance: false
        },
        {
            name: "KGTTI German Training",
            type: "Vocational",
            participants: 6000,
            status: "Active",
            skills: ["Welding", "CNC", "Industrial Automation"],
            duration: "2 years",
            placement_assistance: true
        }
    ],

    // KDEM targets
    kdemTargets: {
        current2024: {
            companies: 225,
            revenue: 4500,
            jobs: 30000
        },
        target2026: {
            companies: 500,
            revenue: 8000,
            jobs: 100000
        },
        target2034: {
            companies: 4000,
            revenue: 40000,
            jobs: 200000
        }
    }
};

export default dashboardData;
