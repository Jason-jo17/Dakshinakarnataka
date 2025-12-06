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
    }
];
