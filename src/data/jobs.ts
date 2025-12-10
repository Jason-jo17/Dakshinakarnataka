export interface Job {
    job_id: string;
    role: string;
    company: string;
    location: string;
    salary: string;
    requirements: string;
    application_type: string;
    apply_link_or_contact: string;
    source_citation: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export const JOBS: Job[] = [
    {
        "job_id": "DK_JOB_001",
        "role": "Rapid Delivery Partner",
        "company": "Blinkit Private Limited",
        "location": "Attavar, Mangalore",
        "salary": "₹35,000 - ₹70,000 per month (Performance Based)",
        "requirements": "2-wheeler, Smartphone, Driving License. No English required.",
        "application_type": "App",
        "apply_link_or_contact": "Download Blinkit Partner App",
        "source_citation": "[1, 2]",
        "coordinates": { "lat": 12.8615, "lng": 74.8455 }
    },
    {
        "job_id": "DK_JOB_002",
        "role": "Rapid Delivery Partner",
        "company": "Blinkit Private Limited",
        "location": "Kodiabail, Mangalore",
        "salary": "₹35,000 - ₹70,000 per month (Performance Based)",
        "requirements": "2-wheeler, Smartphone, Driving License. No English required.",
        "application_type": "App",
        "apply_link_or_contact": "Download Blinkit Partner App",
        "source_citation": "[1, 2]",
        "coordinates": { "lat": 12.8750, "lng": 74.8400 }
    },
    {
        "job_id": "DK_JOB_003",
        "role": "Content Creator (STEM)",
        "company": "Jnanaseva Educational Trust",
        "location": "Remote (Work from Home)",
        "salary": "Part-time / Per Module Basis",
        "requirements": "Strong subject knowledge in Physics, Chemistry, Maths or Biology for JEE/NEET.",
        "application_type": "Email",
        "apply_link_or_contact": "info@jnanaseva.co.in",
        "source_citation": "[3, 4]"
    },
    {
        "job_id": "DK_JOB_004",
        "role": "Content Creator (STEM)",
        "company": "Jnanaseva Educational Trust",
        "location": "Mangalore (On-site)",
        "salary": "Part-time / Per Module Basis",
        "requirements": "Strong subject knowledge in Physics, Chemistry, Maths or Biology for JEE/NEET.",
        "application_type": "Email",
        "apply_link_or_contact": "info@jnanaseva.co.in",
        "source_citation": "[3, 4]",
        "coordinates": { "lat": 12.8700, "lng": 74.8500 }
    },
    {
        "job_id": "DK_JOB_005",
        "role": "Retail Sales Executive",
        "company": "More Retail",
        "location": "Valencia, Mangalore",
        "salary": "₹14,500 - ₹16,000 per month",
        "requirements": "12th Pass eligible. Customer handling skills.",
        "application_type": "Walk-in",
        "apply_link_or_contact": "Visit More Retail Valencia Store",
        "source_citation": "[5]",
        "coordinates": { "lat": 12.8600, "lng": 74.8550 }
    },
    {
        "job_id": "DK_JOB_006",
        "role": "Retail Sales Executive",
        "company": "More Retail",
        "location": "BC Road, Bantwal",
        "salary": "₹14,500 - ₹16,000 per month",
        "requirements": "12th Pass eligible. Customer handling skills.",
        "application_type": "Walk-in",
        "apply_link_or_contact": "Visit More Retail BC Road Store",
        "source_citation": "[5]",
        "coordinates": { "lat": 12.8900, "lng": 75.0300 }
    },
    {
        "job_id": "DK_JOB_007",
        "role": "Kitchen Staff",
        "company": "Laziz Pizza",
        "location": "Padil, Mangalore",
        "salary": "₹10,000 - ₹15,000 per month",
        "requirements": "Food preparation, hygiene maintenance. No English required.",
        "application_type": "Walk-in",
        "apply_link_or_contact": "Near Hotel Vrindavan, Padil",
        "source_citation": "[6]",
        "coordinates": { "lat": 12.8550, "lng": 74.8700 }
    },
    {
        "job_id": "DK_JOB_008",
        "role": "Kitchen Staff",
        "company": "Laziz Pizza",
        "location": "Bajpe, Mangalore",
        "salary": "₹10,000 - ₹15,000 per month",
        "requirements": "Food preparation, hygiene maintenance. No English required.",
        "application_type": "Walk-in",
        "apply_link_or_contact": "Opposite Jumma Masjid, Bajpe",
        "source_citation": "[6]",
        "coordinates": { "lat": 12.9800, "lng": 74.8800 }
    },
    {
        "job_id": "DK_JOB_009",
        "role": "Research Internship",
        "company": "NITK STEP",
        "location": "Surathkal",
        "salary": "Stipend varies by project (VRITIKA program)",
        "requirements": "Engineering/Science background. Research and coding skills.",
        "application_type": "Website",
        "apply_link_or_contact": "https://step.nitk.ac.in/",
        "source_citation": "[7]",
        "coordinates": { "lat": 13.0100, "lng": 74.7950 }
    },
    {
        "job_id": "DK_JOB_010",
        "role": "Growth Engineering Intern",
        "company": "Sahyadri SHINE Foundation",
        "location": "Adyar, Mangalore",
        "salary": "Unpaid / Credit-based / Stipend (Role dependent)",
        "requirements": "Interest in startups, prototyping, AI models.",
        "application_type": "Email",
        "apply_link_or_contact": "shine@sahyadri.edu.in",
        "source_citation": "[8, 9]",
        "coordinates": { "lat": 12.8650, "lng": 74.9200 }
    },
    {
        "job_id": "DK_JOB_011",
        "role": "Food Delivery Partner",
        "company": "Swiggy",
        "location": "Kavoor, Mangalore",
        "salary": "₹15,000 - ₹35,000 per month (Weekly Payouts)",
        "requirements": "Vehicle ownership, valid ID. Flexible hours.",
        "application_type": "App",
        "apply_link_or_contact": "Download Swiggy Delivery Partner App",
        "source_citation": "[1, 10]",
        "coordinates": { "lat": 12.9200, "lng": 74.8400 }
    },
    {
        "job_id": "DK_JOB_012",
        "role": "Food Delivery Partner",
        "company": "Swiggy",
        "location": "Vamanjoor, Mangalore",
        "salary": "₹15,000 - ₹35,000 per month (Weekly Payouts)",
        "requirements": "Vehicle ownership, valid ID. Flexible hours.",
        "application_type": "App",
        "apply_link_or_contact": "Download Swiggy Delivery Partner App",
        "source_citation": "[1, 10]",
        "coordinates": { "lat": 12.9100, "lng": 74.8900 }
    },
    {
        "job_id": "DK_JOB_013",
        "role": "Sales Officer",
        "company": "Cocoguru Coconut Industries",
        "location": "Puttur, Dakshina Kannada",
        "salary": "₹20,000 - ₹55,000 per month",
        "requirements": "Marketing skills, Local language proficiency.",
        "application_type": "Website",
        "apply_link_or_contact": "https://cocoguru.com/careers/",
        "source_citation": "[11]",
        "coordinates": { "lat": 12.7650, "lng": 75.2050 }
    },
    {
        "job_id": "DK_JOB_014",
        "role": "Telecaller",
        "company": "Sharadhi Financial",
        "location": "Bantwal, Dakshina Kannada",
        "salary": "₹8,000 - ₹62,000 per month (Includes Incentives)",
        "requirements": "12th Pass. Computer Knowledge. Fluent Kannada.",
        "application_type": "Online Platform",
        "apply_link_or_contact": "Apply via JobHai",
        "source_citation": "[12]",
        "coordinates": { "lat": 12.8950, "lng": 75.0350 }
    },
    {
        "job_id": "DK_JOB_015",
        "role": "Back Office Executive",
        "company": "Recall Solutions",
        "location": "Padil, Mangalore",
        "salary": "₹2.0 - ₹3.5 Lakhs Per Annum",
        "requirements": "Graduate preferred, Computer typing skills.",
        "application_type": "Consultancy Visit",
        "apply_link_or_contact": "Paradise Commercial Complex, Padil",
        "source_citation": "[13]",
        "coordinates": { "lat": 12.8580, "lng": 74.8720 }
    },
    {
        "job_id": "DK_JOB_016",
        "role": "Sales Advisor",
        "company": "H&M",
        "location": "Nexus Fiza Mall, Mangalore",
        "salary": "Market Standard (Hourly/Monthly)",
        "requirements": "Interest in fashion, customer service, flexible shifts.",
        "application_type": "Corporate Portal",
        "apply_link_or_contact": "https://career.hm.com/",
        "source_citation": "[14]",
        "coordinates": { "lat": 12.8550, "lng": 74.8350 }
    },
    {
        "job_id": "DK_JOB_017",
        "role": "Burger & Pizza Maker",
        "company": "Dakshin Rang Veg",
        "location": "Kavoor, Mangalore",
        "salary": "₹13,000 - ₹17,000 per month",
        "requirements": "Cooking skills, hygiene. No English required.",
        "application_type": "App",
        "apply_link_or_contact": "Apply via Apna App",
        "source_citation": "[15]",
        "coordinates": { "lat": 12.9220, "lng": 74.8420 }
    },
    {
        "job_id": "DK_JOB_018",
        "role": "Ecommerce Operations Executive",
        "company": "Indic Organics",
        "location": "Derebail, Mangalore",
        "salary": "₹14,000 - ₹16,000 per month",
        "requirements": "Computer knowledge, 10th Pass eligible.",
        "application_type": "Online Platform",
        "apply_link_or_contact": "Apply via JobHai",
        "source_citation": "[16]",
        "coordinates": { "lat": 12.8900, "lng": 74.8450 }
    },
    {
        "job_id": "DK_JOB_019",
        "role": "Counter Sales Executive",
        "company": "Tanishq Jewellers",
        "location": "Bendoor, Mangalore",
        "salary": "₹18,000 - ₹25,000 per month",
        "requirements": "Good communication, trust, customer handling.",
        "application_type": "Walk-in",
        "apply_link_or_contact": "Visit Tanishq Store Bendoor",
        "source_citation": "[5]",
        "coordinates": { "lat": 12.8750, "lng": 74.8550 }
    },
    {
        "job_id": "DK_JOB_020",
        "role": "Back Office Executive",
        "company": "Sr Fast Connect Services",
        "location": "Mangalore City",
        "salary": "₹25,000 - ₹35,000 per month",
        "requirements": "Basic Computer Skills. No English Required.",
        "application_type": "Online Platform",
        "apply_link_or_contact": "Apply via Apna",
        "source_citation": "[17]",
        "coordinates": { "lat": 12.8700, "lng": 74.8400 }
    },
    {
        "job_id": "DK_JOB_021",
        "role": "Senior Python Developer",
        "company": "Novigo Solutions",
        "location": "Mangalore",
        "salary": "₹8.0 - ₹12.0 Lakhs Per Annum",
        "requirements": "5+ years exp in Python, Django, Cloud Tech. AI interest is a plus.",
        "application_type": "LinkedIn",
        "apply_link_or_contact": "https://novigosolutions.com/careers",
        "source_citation": "[18]",
        "coordinates": { "lat": 12.8680, "lng": 74.8420 }
    },
    {
        "job_id": "DK_JOB_022",
        "role": "AI/ML Engineer",
        "company": "CodeCraft Technologies",
        "location": "Bejai, Mangalore",
        "salary": "₹6.0 - ₹10.0 Lakhs Per Annum",
        "requirements": "TensorFlow, PyTorch, Data Science fundamentals.",
        "application_type": "Email",
        "apply_link_or_contact": "careers@codecraft.com",
        "source_citation": "[19]",
        "coordinates": { "lat": 12.8850, "lng": 74.8400 }
    },
    {
        "job_id": "DK_JOB_023",
        "role": "Data Scientist",
        "company": "Novigo Solutions",
        "location": "Mangalore",
        "salary": "₹7.0 - ₹14.0 Lakhs Per Annum",
        "requirements": "Python, SQL, Machine Learning models.",
        "application_type": "LinkedIn",
        "apply_link_or_contact": "https://novigosolutions.com/careers",
        "source_citation": "[18]",
        "coordinates": { "lat": 12.8680, "lng": 74.8420 }
    },
    {
        "job_id": "DK_JOB_024",
        "role": "React Native Developer",
        "company": "CodeCraft Technologies",
        "location": "Bejai, Mangalore",
        "salary": "₹4.0 - ₹8.0 Lakhs Per Annum",
        "requirements": "Mobile app development, React Native, Redux.",
        "application_type": "Email",
        "apply_link_or_contact": "careers@codecraft.com",
        "source_citation": "[19]",
        "coordinates": { "lat": 12.8850, "lng": 74.8400 }
    },
    {
        "job_id": "DK_JOB_025",
        "role": "Process Associate (Non-Voice)",
        "company": "Atlantic Data Bureau Services",
        "location": "Mangalore",
        "salary": "₹15,000 - ₹22,000 per month",
        "requirements": "Any Graduate. Typing speed > 30 WPM. Basic Excel.",
        "application_type": "Walk-in",
        "apply_link_or_contact": "Atlantic Data, PVS Building",
        "source_citation": "[20]",
        "coordinates": { "lat": 12.8750, "lng": 74.8380 }
    },
    {
        "job_id": "DK_JOB_026",
        "role": "Software Engineer Level 1",
        "company": "Mphasis",
        "location": "Mudipu, Mangalore",
        "salary": "₹3.5 - ₹5.0 Lakhs Per Annum",
        "requirements": "BE/BTech (CS/IT/EC). Good communication.",
        "application_type": "Website",
        "apply_link_or_contact": "https://careers.mphasis.com",
        "source_citation": "[21]",
        "coordinates": { "lat": 12.8250, "lng": 74.9830 }
    },
    {
        "job_id": "DK_JOB_027",
        "role": "Staff Nurse",
        "company": "Father Muller Medical College Hospital",
        "location": "Kankanady, Mangalore",
        "salary": "₹18,000 - ₹30,000 per month",
        "requirements": "B.Sc Nursing / GNM. Registered with Nursing Council.",
        "application_type": "Walk-in",
        "apply_link_or_contact": "HR Department, Father Muller",
        "source_citation": "[22]",
        "coordinates": { "lat": 12.8640, "lng": 74.8560 }
    },
    {
        "job_id": "DK_JOB_028",
        "role": "Guest Relations Executive",
        "company": "The Ocean Pearl",
        "location": "Navabharath Circle, Mangalore",
        "salary": "₹15,000 - ₹25,000 per month",
        "requirements": "Hotel Management degree or Diploma. Fluent English.",
        "application_type": "Email",
        "apply_link_or_contact": "hr@oceanpearl.in",
        "source_citation": "[23]",
        "coordinates": { "lat": 12.8730, "lng": 74.8430 }
    },
    {
        "job_id": "DK_JOB_029",
        "role": "Showroom Manager",
        "company": "City Centre Mall (Fashion Store)",
        "location": "K.S. Rao Road, Mangalore",
        "salary": "₹20,000 - ₹28,000 per month",
        "requirements": "Retail experience 2+ years. Leadership skills.",
        "application_type": "Walk-in",
        "apply_link_or_contact": "City Centre Mall Office",
        "source_citation": "[24]",
        "coordinates": { "lat": 12.8710, "lng": 74.8410 }
    }
];
