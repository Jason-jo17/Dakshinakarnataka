import type { Institution } from '../types/institution';

export const userInstitutions: Institution[] = [
    {
        "id": "nitk-surathkal",
        "name": "National Institute of Technology Karnataka",
        "category": "Engineering",
        "type": "Government",
        "subCategory": "Institute of National Importance",
        "location": {
            "address": "NH 66, Srinivasnagar, Surathkal, Mangaluru - 575025",
            "landmark": "",
            "area": "Srinivasnagar",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575025",
            "coordinates": {
                "lat": 13.0108,
                "lng": 74.7926
            },
            "googleMapsUrl": "https://maps.google.com/?q=13.0108,74.7926"
        },
        "contact": {
            "website": "https://www.nitk.ac.in"
        },
        "coe": true,
        "programs": [
            {
                "name": "B.Tech Computer Science & Engg",
                "duration": "4 Years",
                "seats": 115
            },
            {
                "name": "B.Tech Artificial Intelligence",
                "duration": "4 Years",
                "seats": 40
            },
            {
                "name": "M.Tech Mechatronics",
                "duration": "2 Years",
                "seats": 35
            },
            {
                "name": "M.Tech VLSI Design",
                "duration": "2 Years",
                "seats": 35
            }
        ],
        "domains": {
            "Material Science": 10,
            "System Design": 10,
            "Robotics": 9,
            "Wireless Networking": 9,
            "Electric Mobility": 9,
            "3D Printing": 9,
            "Software Development": 10,
            "AI": 10
        },
        "tools": [
            {
                "name": "Formalloy 3D Metal Printer",
                "domain": "Additive Manufacturing",
                "proficiency": "Expert"
            },
            {
                "name": "NI ELVIS II",
                "domain": "Electronics Prototyping",
                "proficiency": "Expert"
            },
            {
                "name": "Qualnet",
                "domain": "Networking",
                "proficiency": "Advanced"
            },
            {
                "name": "NS-2",
                "domain": "Networking",
                "proficiency": "Advanced"
            },
            {
                "name": "HIL Simulators",
                "domain": "Electric Mobility",
                "proficiency": "Expert"
            },
            {
                "name": "LiDAR (Terrestrial/Aerial)",
                "domain": "Surveying",
                "proficiency": "Expert"
            },
            {
                "name": "HR-FESEM (Zeiss/JEOL)",
                "domain": "Material Science",
                "proficiency": "Expert"
            },
            {
                "name": "Blue Prism",
                "domain": "RPA",
                "proficiency": "Intermediate"
            },
            {
                "name": "Python",
                "domain": "Software Development",
                "proficiency": "Expert"
            }
        ],
        "specializations": [
            "Nanotechnology",
            "Smart Grids",
            "Advanced Robotics"
        ],
        "tags": [
            "tier-1",
            "research",
            "government",
            "coe"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "placement": {
            "rate": 93,
            "year": "2023-24",
            "packages": {
                "highest": 55,
                "average": 16.25,
                "median": 14.21
            },
            "topRecruiters": [
                "BEL",
                "GAIL",
                "MRPL",
                "HPCL",
                "BPCL",
                "C-DOT",
                "Google",
                "Microsoft"
            ],
            "analysis": "Institute of National Importance. Strong PSU recruitment (Chemical/Mechanical) provided a safety net. IT/CSE maintained high medians despite market saturation. 'Circuital' vs 'Core' divide is pronounced.",
            "highlights": [
                "93% Placement (UG)",
                "Strong PSU Network",
                "Highest Package 55 LPA",
                "Median Salary 14.21 LPA"
            ]
        }
    },
    {
        "id": "sahyadri-college",
        "name": "Sahyadri College of Engineering & Management",
        "category": "Engineering",
        "type": "Private",
        "location": {
            "address": "Sahyadri Campus, N.H-48, Adyar, Mangalore - 575007",
            "landmark": "",
            "area": "N.H-48",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575007",
            "coordinates": {
                "lat": 12.8665,
                "lng": 74.9254
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.8665,74.9254"
        },
        "contact": {
            "website": "https://sahyadri.edu.in"
        },
        "coe": true,
        "programs": [
            {
                "name": "B.E. Computer Science & Engg",
                "duration": "4 Years",
                "seats": 240
            },
            {
                "name": "B.E. CSE (AI & ML)",
                "duration": "4 Years",
                "seats": 180
            },
            {
                "name": "B.E. Robotics & Automation",
                "duration": "4 Years",
                "seats": 60
            },
            {
                "name": "M.Tech (CSE)",
                "duration": "2 Years",
                "seats": 18
            },
            {
                "name": "MBA",
                "duration": "2 Years",
                "seats": 180
            }
        ],
        "domains": {
            "Embedded Systems": 10,
            "Robotics": 9,
            "IoT": 9,
            "Electronics Manufacturing": 9,
            "Neuro-Engineering": 8,
            "Software Development": 10
        },
        "tools": [
            {
                "name": "5-Zone Reflow Oven",
                "domain": "Electronics Manufacturing",
                "proficiency": "Expert"
            },
            {
                "name": "Pick-and-Place Machine",
                "domain": "Electronics Manufacturing",
                "proficiency": "Expert"
            },
            {
                "name": "ENOBIO-8",
                "domain": "Neuro-Engineering",
                "proficiency": "Advanced"
            },
            {
                "name": "Wave Tank",
                "domain": "Marine Engineering",
                "proficiency": "Advanced"
            },
            {
                "name": "Gas Chromatography",
                "domain": "Chemical Analysis",
                "proficiency": "Advanced"
            },
            {
                "name": "CNC Machining Centers",
                "domain": "Manufacturing",
                "proficiency": "Expert"
            },
            {
                "name": "ROS (Robot Operating System)",
                "domain": "Robotics",
                "proficiency": "Expert"
            },
            {
                "name": "MATLAB",
                "domain": "Robotics",
                "proficiency": "Advanced"
            },
            {
                "name": "Java",
                "domain": "Software Development",
                "proficiency": "Advanced"
            },
            {
                "name": "Keil uVision",
                "domain": "Embedded Systems",
                "proficiency": "Expert"
            },
            {
                "name": "AWS IoT Core",
                "domain": "IoT",
                "proficiency": "Advanced"
            }
        ],
        "specializations": [
            "Startups",
            "Embedded Systems",
            "Marine Engineering",
            "Robotics"
        ],
        "tags": [
            "innovation-hub",
            "startups",
            "industry-integrated"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "placement": {
            "rate": 57,
            "year": "2023-24",
            "packages": {
                "highest": 72.00,
                "average": 6.3,
                "median": 4.75
            },
            "topRecruiters": [
                "Belc (Japan)",
                "Microsoft",
                "IMV Corporation",
                "Aisan",
                "JEMS",
                "Japan Research Inst."
            ],
            "analysis": "The 'Japanese Corridor' strategy has created a high-value niche, with over 10 companies offering >30 LPA. However, the overall placement rate (57%) shows a 'Barbell Distribution'—exceptional top-end, but challenges for the mass tier.",
            "highlights": [
                "Japanese Talent Corridor",
                "Top Offer 72.00 LPA",
                "Innovation Hub",
                "Barbell Salary Distribution"
            ]
        }
    },
    {
        "id": "mite-moodbidri",
        "name": "Mangalore Institute of Technology & Engineering (MITE)",
        "category": "Engineering",
        "type": "Private",
        "location": {
            "address": "Badaga Mijar, Moodbidri - 574225",
            "landmark": "",
            "area": "Moodbidri - 574225",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "574225",
            "coordinates": {
                "lat": 13.0476,
                "lng": 74.9878
            },
            "googleMapsUrl": "https://maps.google.com/?q=13.0476,74.9878"
        },
        "contact": {
            "website": "https://mite.ac.in"
        },
        "coe": true,
        "programs": [
            {
                "name": "B.E. Mechatronics",
                "duration": "4 Years",
                "seats": 60
            },
            {
                "name": "B.E. Aeronautical Engineering",
                "duration": "4 Years",
                "seats": 60
            },
            {
                "name": "B.E. CSE (IoT & Cyber Security)",
                "duration": "4 Years",
                "seats": 60
            },
            {
                "name": "B.E. Robotics & AI",
                "duration": "4 Years",
                "seats": 60
            },
            {
                "name": "B.E. Computer Science & Engg",
                "duration": "4 Years",
                "seats": 240
            },
            {
                "name": "MBA",
                "duration": "2 Years",
                "seats": 150
            }
        ],
        "domains": {
            "Mechatronics": 10,
            "Automation": 10,
            "Digital Manufacturing": 9,
            "Aeronautical Design": 8,
            "IoT": 8,
            "Software Development": 8
        },
        "tools": [
            {
                "name": "Siemens NX",
                "domain": "PLM/Design",
                "proficiency": "Expert"
            },
            {
                "name": "Teamcenter",
                "domain": "PLM",
                "proficiency": "Expert"
            },
            {
                "name": "Bosch Hydraulics/Pneumatics",
                "domain": "Automation",
                "proficiency": "Expert"
            },
            {
                "name": "PLC",
                "domain": "Automation",
                "proficiency": "Advanced"
            },
            {
                "name": "Catia",
                "domain": "Aeronautical Design",
                "proficiency": "Intermediate"
            },
            {
                "name": "ANSYS",
                "domain": "Aeronautical Design",
                "proficiency": "Advanced"
            },
            {
                "name": "Python",
                "domain": "Software Development",
                "proficiency": "Advanced"
            },
            {
                "name": "Bosch Rexroth PLC Tools",
                "domain": "Automation",
                "proficiency": "Expert"
            }
        ],
        "specializations": [
            "Mechatronics",
            "Industrial Automation",
            "Aerospace"
        ],
        "tags": [
            "siemens-coe",
            "bosch-coc",
            "automation"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "placement": {
            "rate": 86,
            "year": "2023-24",
            "packages": {
                "highest": 50,
                "average": 5.5,
                "median": 4.60
            },
            "topRecruiters": [
                "Amazon",
                "Accenture",
                "Cognizant",
                "Wipro",
                "Tech Mahindra",
                "PWC",
                "EY",
                "KPMG",
                "BOSCH"
            ],
            "analysis": "Remarkable retention of placement rate (86%) in a tough market, significantly outperforming peers. Strong presence of 'Big 4' indicates a focus on tech-consulting roles.",
            "highlights": [
                "86% Placement Rate",
                "Highest Package 50 LPA",
                "Big 4 Recruiters",
                "High Retention Rate"
            ]
        }
    },
    {
        "id": "st-joseph-engineering",
        "name": "St. Joseph Engineering College",
        "category": "Engineering",
        "type": "Private",
        "location": {
            "address": "Vamanjoor, Mangalore - 575028",
            "landmark": "",
            "area": "Mangalore - 575028",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575028",
            "coordinates": {
                "lat": 12.9237,
                "lng": 74.8996
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.9237,74.8996"
        },
        "contact": {
            "website": "https://sjec.ac.in"
        },
        "coe": true,
        "programs": [
            {
                "name": "Computer Science & Engg",
                "duration": "4 Years",
                "seats": 240,
                "specializations": []
            },
            {
                "name": "Electronics & Communication",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "Mechanical Engineering",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "Artificial Intelligence & Machine Learning",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Computer Science & Business Systems",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "CSE (Data Science)",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Electronics Engg (VLSI Design)",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Electrical & Electronics",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Civil Engineering PG",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "MCA",
                "duration": "2 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "MBA",
                "duration": "2 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "MBA (Innovation & Venture)",
                "duration": "2 Years",
                "seats": 30,
                "specializations": []
            }
        ],
        "domains": {
            "RPA (Robotic Process Automation)": 10,
            "VLSI Design": 9,
            "Data Science": 8,
            "Embedded Systems": 8,
            "Software Development": 9,
            "Business Systems": 7
        },
        "tools": [
            {
                "name": "Blue Prism",
                "domain": "RPA",
                "proficiency": "Expert"
            },
            {
                "name": "Cadence",
                "domain": "VLSI",
                "proficiency": "Advanced"
            },
            {
                "name": "Synopsys",
                "domain": "VLSI",
                "proficiency": "Advanced"
            },
            {
                "name": "Xilinx FPGA",
                "domain": "Embedded Systems",
                "proficiency": "Advanced"
            },
            {
                "name": "3D Printers",
                "domain": "Prototyping",
                "proficiency": "Intermediate"
            },
            {
                "name": "Xilinx Vivado",
                "domain": "VLSI Design",
                "proficiency": "Advanced"
            },
            {
                "name": "R Programming",
                "domain": "Data Science",
                "proficiency": "Intermediate"
            },
            {
                "name": "Tableau",
                "domain": "Data Science",
                "proficiency": "Intermediate"
            }
        ],
        "specializations": [
            "RPA",
            "VLSI",
            "Healthcare Tech",
            "Business Systems"
        ],
        "tags": [
            "autonomous",
            "rpa-center",
            "vlsi"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "placement": {
            "rate": 76.95,
            "year": "2024-25",
            "packages": {
                "highest": 10,
                "average": 6.0,
                "median": 5.60
            },
            "topRecruiters": [
                "Infosys",
                "Rinex Technologies",
                "Novigo Solutions",
                "Yazaki India",
                "Tech Mahindra"
            ],
            "analysis": "Boasts the highest median salary (5.6 LPA) among Tier-2 colleges. 'Bell Curve' distribution ensures consistent outcomes. Strong performance in 'Pool Campus' drives.",
            "highlights": [
                "Highest Tier-2 Median (5.6 LPA)",
                "Stable Placement Rate (77%)",
                "Strong Alumni Network",
                "Consistent Outcomes"
            ]
        },
        "academic": {
            "programs": [
                {
                    "name": "Computer Science & Engg",
                    "duration": "4 Years",
                    "seats": 240,
                    "specializations": []
                },
                {
                    "name": "Electronics & Communication",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "Mechanical Engineering",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "Artificial Intelligence & Machine Learning",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Computer Science & Business Systems",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "CSE (Data Science)",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Electronics Engg (VLSI Design)",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Electrical & Electronics",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Civil Engineering PG",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "MCA",
                    "duration": "2 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "MBA",
                    "duration": "2 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "MBA (Innovation & Venture)",
                    "duration": "2 Years",
                    "seats": 30,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "yenepoya-deemed-university",
        "name": "Yenepoya Deemed To Be University",
        "category": "University",
        "type": "Private",
        "subCategory": "Deemed-to-be University",
        "location": {
            "address": "University Road, Deralakatte, Mangaluru -",
            "landmark": "",
            "area": "Deralakatte",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575018",
            "coordinates": {
                "lat": 12.8098,
                "lng": 74.8872
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.8098,74.8872"
        },
        "contact": {
            "website": "https://yenepoya.edu.in"
        },
        "coe": true,
        "programs": [
            {
                "name": "Artificial Intelligence & Machine Learning",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "Computer Science & Engineering",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "CSE (Artificial Intelligence)",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "CSE (Cyber Security)",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "CSE (Data Science)",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "CSE (IoT)",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Computer Engg (Software Engg) Computer Applications",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "BCA",
                "duration": "4 Years",
                "seats": 840,
                "specializations": []
            },
            {
                "name": "MCA Management",
                "duration": "2 Years",
                "seats": 300,
                "specializations": []
            },
            {
                "name": "BBA",
                "duration": "4 Years",
                "seats": 660,
                "specializations": []
            },
            {
                "name": "MBA Design",
                "duration": "2 Years",
                "seats": 360,
                "specializations": []
            },
            {
                "name": "B.Des (Communication Design)",
                "duration": "4 Years",
                "seats": 30,
                "specializations": []
            },
            {
                "name": "B.Des (Fashion Design)",
                "duration": "4 Years",
                "seats": 30,
                "specializations": []
            }
        ],
        "domains": {
            "Artificial Intelligence": 10,
            "Design": 9,
            "Cloud Computing": 8,
            "Cyber Security": 8,
            "Software Development": 9,
            "Data Engineering": 9
        },
        "tools": [
            {
                "name": "Adobe Creative Suite",
                "domain": "Design",
                "proficiency": "Advanced"
            },
            {
                "name": "TensorFlow",
                "domain": "AI",
                "proficiency": "Advanced"
            },
            {
                "name": "AWS Cloud",
                "domain": "Cloud Computing",
                "proficiency": "Advanced"
            },
            {
                "name": "Figma",
                "domain": "UI/UX",
                "proficiency": "Intermediate"
            },
            {
                "name": "PyTorch",
                "domain": "Artificial Intelligence",
                "proficiency": "Advanced"
            },
            {
                "name": "Python",
                "domain": "Software Development",
                "proficiency": "Expert"
            },
            {
                "name": "Tableau",
                "domain": "Data Engineering",
                "proficiency": "Intermediate"
            },
            {
                "name": "Wireshark",
                "domain": "Cyber Security",
                "proficiency": "Advanced"
            }
        ],
        "specializations": [
            "Design",
            "AI & ML",
            "Cyber Security",
            "Design Thinking"
        ],
        "tags": [
            "deemed-university",
            "design-school",
            "deep-tech"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "Artificial Intelligence & Machine Learning",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "Computer Science & Engineering",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "CSE (Artificial Intelligence)",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "CSE (Cyber Security)",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "CSE (Data Science)",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "CSE (IoT)",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Computer Engg (Software Engg) Computer Applications",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "BCA",
                    "duration": "4 Years",
                    "seats": 840,
                    "specializations": []
                },
                {
                    "name": "MCA Management",
                    "duration": "2 Years",
                    "seats": 300,
                    "specializations": []
                },
                {
                    "name": "BBA",
                    "duration": "4 Years",
                    "seats": 660,
                    "specializations": []
                },
                {
                    "name": "MBA Design",
                    "duration": "2 Years",
                    "seats": 360,
                    "specializations": []
                },
                {
                    "name": "B.Des (Communication Design)",
                    "duration": "4 Years",
                    "seats": 30,
                    "specializations": []
                },
                {
                    "name": "B.Des (Fashion Design)",
                    "duration": "4 Years",
                    "seats": 30,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "alvas-engineering",
        "name": "Alva's Institute of Engineering & Technology",
        "category": "Engineering",
        "type": "Private",
        "location": {
            "address": "Shobhavana Campus, Mijar, Moodbidri - 574225",
            "landmark": "",
            "area": "Mijar",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "574225",
            "coordinates": {
                "lat": 13.0245,
                "lng": 74.9789
            },
            "googleMapsUrl": "https://maps.google.com/?q=13.0245,74.9789"
        },
        "contact": {
            "website": "https://aiet.org.in"
        },
        "coe": false,
        "programs": [
            {
                "name": "B.E. Agriculture Engineering",
                "duration": "4 Years",
                "seats": 60
            },
            {
                "name": "B.E. Computer Science & Design",
                "duration": "4 Years",
                "seats": 60
            },
            {
                "name": "B.E. CSE (Data Science)",
                "duration": "4 Years",
                "seats": 60
            },
            {
                "name": "B.E. Computer Science & Engg",
                "duration": "4 Years",
                "seats": 240
            }
        ],
        "domains": {
            "Agriculture Technology": 8,
            "Data Science": 8,
            "Software Development": 9,
            "Design": 7
        },
        "tools": [
            {
                "name": "Python",
                "domain": "Data Science",
                "proficiency": "Advanced"
            },
            {
                "name": "R",
                "domain": "Data Analysis",
                "proficiency": "Intermediate"
            },
            {
                "name": "Tableau",
                "domain": "Data Visualization",
                "proficiency": "Intermediate"
            },
            {
                "name": "GIS Tools",
                "domain": "Agriculture Tech",
                "proficiency": "Intermediate"
            },
            {
                "name": "Adobe XD",
                "domain": "Design",
                "proficiency": "Intermediate"
            },
            {
                "name": "React.js",
                "domain": "Software Development",
                "proficiency": "Intermediate"
            }
        ],
        "specializations": [
            "Agriculture Tech",
            "Data Science"
        ],
        "tags": [
            "agriculture-tech",
            "design",
            "agriculture"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        }
    },
    {
        "id": "canara-engineering",
        "name": "Canara Engineering College",
        "category": "Engineering",
        "type": "Private",
        "location": {
            "address": "Benjanapadavu, Bantwal - 574219",
            "landmark": "",
            "area": "Bantwal - 574219",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "574219",
            "coordinates": {
                "lat": 12.889,
                "lng": 75.012
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.889,75.012"
        },
        "contact": {
            "website": "https://canaraengineering.in"
        },
        "coe": false,
        "programs": [
            {
                "name": "Computer Science & Engg",
                "duration": "4 Years",
                "seats": 180,
                "specializations": []
            },
            {
                "name": "Information Science & Engg",
                "duration": "4 Years",
                "seats": 180,
                "specializations": []
            },
            {
                "name": "Electronics & Communication",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "Artificial Intelligence & Machine Learning",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "Computer Science & Design",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Computer Science & Business Systems",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Mechanical Engineering",
                "duration": "4 Years",
                "seats": 30,
                "specializations": []
            }
        ],
        "domains": {
            "Business Systems": 8,
            "Information Science": 8,
            "Software Development": 9,
            "Information Technology": 8
        },
        "tools": [
            {
                "name": "Java",
                "domain": "Software Development",
                "proficiency": "Advanced"
            },
            {
                "name": "SAP (Basic)",
                "domain": "Business Systems",
                "proficiency": "Intermediate"
            },
            {
                "name": "SQL",
                "domain": "Database",
                "proficiency": "Advanced"
            },
            {
                "name": "C++",
                "domain": "Software Development",
                "proficiency": "Advanced"
            },
            {
                "name": "Oracle DB",
                "domain": "Information Technology",
                "proficiency": "Intermediate"
            }
        ],
        "specializations": [
            "Business Systems",
            "Software Engineering"
        ],
        "tags": [
            "business-tech",
            "coding"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "Computer Science & Engg",
                    "duration": "4 Years",
                    "seats": 180,
                    "specializations": []
                },
                {
                    "name": "Information Science & Engg",
                    "duration": "4 Years",
                    "seats": 180,
                    "specializations": []
                },
                {
                    "name": "Electronics & Communication",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "Artificial Intelligence & Machine Learning",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "Computer Science & Design",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Computer Science & Business Systems",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Mechanical Engineering",
                    "duration": "4 Years",
                    "seats": 30,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "kvg-college-engineering",
        "name": "K.V.G. College of Engineering",
        "category": "Engineering",
        "type": "Private",
        "location": {
            "address": "of Engineering Kurunjibhag, Sullia - 574327",
            "landmark": "",
            "area": "Sullia - 574327",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "574327",
            "coordinates": {
                "lat": 12.56,
                "lng": 75.39
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.56,75.39"
        },
        "contact": {
            "website": "https://kvgce.in"
        },
        "coe": false,
        "programs": [
            {
                "name": "Computer Science & Engg",
                "duration": "4 Years",
                "seats": 180,
                "specializations": []
            },
            {
                "name": "CSE (Artificial Intelligence & ML)",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "Electronics & Communication",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Civil Engineering PG",
                "duration": "4 Years",
                "seats": 30,
                "specializations": []
            },
            {
                "name": "MBA",
                "duration": "2 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "M.Tech (CSE)",
                "duration": "2 Years",
                "seats": 18,
                "specializations": []
            },
            {
                "name": "M.Tech (Digital Electronics)",
                "duration": "2 Years",
                "seats": 18,
                "specializations": []
            },
            {
                "name": "M.Tech (Construction Tech)",
                "duration": "2 Years",
                "seats": 18,
                "specializations": []
            }
        ],
        "domains": {
            "Construction Technology": 9,
            "Digital Electronics": 8,
            "Civil Engineering": 8,
            "Software Development": 8
        },
        "tools": [
            {
                "name": "AutoCAD Civil 3D",
                "domain": "Construction",
                "proficiency": "Advanced"
            },
            {
                "name": "STAAD.Pro",
                "domain": "Structural Analysis",
                "proficiency": "Advanced"
            },
            {
                "name": "MATLAB",
                "domain": "Digital Electronics",
                "proficiency": "Advanced"
            },
            {
                "name": "VHDL/Verilog",
                "domain": "VLSI",
                "proficiency": "Intermediate"
            },
            {
                "name": "Python",
                "domain": "Software Development",
                "proficiency": "Intermediate"
            }
        ],
        "specializations": [
            "Construction",
            "Digital Electronics"
        ],
        "tags": [
            "rural-tech",
            "civil-engineering"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "Computer Science & Engg",
                    "duration": "4 Years",
                    "seats": 180,
                    "specializations": []
                },
                {
                    "name": "CSE (Artificial Intelligence & ML)",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "Electronics & Communication",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Civil Engineering PG",
                    "duration": "4 Years",
                    "seats": 30,
                    "specializations": []
                },
                {
                    "name": "MBA",
                    "duration": "2 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "M.Tech (CSE)",
                    "duration": "2 Years",
                    "seats": 18,
                    "specializations": []
                },
                {
                    "name": "M.Tech (Digital Electronics)",
                    "duration": "2 Years",
                    "seats": 18,
                    "specializations": []
                },
                {
                    "name": "M.Tech (Construction Tech)",
                    "duration": "2 Years",
                    "seats": 18,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "gttc-mangalore",
        "name": "Govt Tool Room & Training Centre (GTTC)",
        "category": "Polytechnic",
        "type": "Government",
        "subCategory": "Training Centre",
        "location": {
            "address": "Baikampady, Mangalore",
            "landmark": "",
            "area": "Mangalore",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575001",
            "coordinates": {
                "lat": 12.94,
                "lng": 74.82
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.94,74.82"
        },
        "contact": {
            "website": "https://gttc.karnataka.gov.in"
        },
        "coe": true,
        "programs": [
            {
                "name": "Tool & Die Making",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Artificial Intelligence & Machine Learning",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Precision Manufacturing",
                "duration": "4 Years",
                "seats": 30,
                "specializations": []
            }
        ],
        "domains": {
            "Tool & Die": 10,
            "Precision Manufacturing": 10,
            "CNC Machining": 10,
            "Artificial Intelligence": 7,
            "Manufacturing": 10
        },
        "tools": [
            {
                "name": "CNC Mills",
                "domain": "Manufacturing",
                "proficiency": "Expert"
            },
            {
                "name": "CNC Lathes",
                "domain": "Manufacturing",
                "proficiency": "Expert"
            },
            {
                "name": "EDM (Wire/Spark)",
                "domain": "Tool Making",
                "proficiency": "Expert"
            },
            {
                "name": "Mastercam",
                "domain": "CAM",
                "proficiency": "Advanced"
            },
            {
                "name": "SolidWorks",
                "domain": "Tool & Die",
                "proficiency": "Expert"
            },
            {
                "name": "CNC Controllers (Fanuc/Siemens)",
                "domain": "CNC Machining",
                "proficiency": "Expert"
            },
            {
                "name": "Python",
                "domain": "Artificial Intelligence",
                "proficiency": "Intermediate"
            }
        ],
        "specializations": [
            "Tool & Die",
            "Precision Manufacturing",
            "High Precision Mfg"
        ],
        "tags": [
            "vocational",
            "high-precision",
            "government",
            "precision-mfg"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "Tool & Die Making",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Artificial Intelligence & Machine Learning",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Precision Manufacturing",
                    "duration": "4 Years",
                    "seats": 30,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "karavali-college-hotel-management",
        "name": "Karavali College of Hotel Management",
        "category": "University",
        "type": "Private",
        "location": {
            "address": "Neerumarga, Mangalore",
            "landmark": "",
            "area": "Mangalore - 575029",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575029",
            "coordinates": {
                "lat": 12.9,
                "lng": 74.95
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.9,74.95"
        },
        "contact": {
            "website": "https://karavalicollege.ac.in"
        },
        "coe": false,
        "programs": [
            {
                "name": "Hotel Management & Catering Tech",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            }
        ],
        "domains": {
            "Hospitality Management": 9,
            "Culinary Arts": 8,
            "Food & Beverage": 8
        },
        "tools": [
            {
                "name": "IDS Next",
                "domain": "Hotel ERP",
                "proficiency": "Intermediate"
            },
            {
                "name": "Opera PMS",
                "domain": "Hospitality",
                "proficiency": "Intermediate"
            },
            {
                "name": "Commercial Kitchen Equip",
                "domain": "Culinary",
                "proficiency": "Advanced"
            }
        ],
        "specializations": [
            "Hospitality",
            "Catering"
        ],
        "tags": [
            "hospitality",
            "service-industry"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "Hotel Management & Catering Tech",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "st-aloysius-deemed-university",
        "name": "St. Aloysius Deemed To Be University",
        "category": "University",
        "type": "Private",
        "subCategory": "Deemed-to-be University",
        "location": {
            "address": "Light House Hill Road, Kodialbail, Mangaluru - 575003",
            "landmark": "",
            "area": "Kodialbail",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575003",
            "coordinates": {
                "lat": 12.873,
                "lng": 74.846
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.873,74.846"
        },
        "contact": {
            "website": "https://staloysius.edu.in"
        },
        "coe": false,
        "programs": [
            {
                "name": "Computer Science & Engg",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "CSE (Artificial Intelligence & ML)",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Electronics & Communication",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Information Science & Engg Computer Applications",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "BCA Management",
                "duration": "4 Years",
                "seats": 310,
                "specializations": []
            },
            {
                "name": "BBA",
                "duration": "4 Years",
                "seats": 360,
                "specializations": []
            }
        ],
        "domains": {
            "Software Development": 9,
            "Data Analytics": 8,
            "Management": 9
        },
        "tools": [
            {
                "name": "Java",
                "domain": "Software Development",
                "proficiency": "Advanced"
            },
            {
                "name": "SQL",
                "domain": "Software Development",
                "proficiency": "Advanced"
            },
            {
                "name": "Microsoft Excel",
                "domain": "Management",
                "proficiency": "Expert"
            },
            {
                "name": "Power BI",
                "domain": "Data Analytics",
                "proficiency": "Intermediate"
            }
        ],
        "specializations": [
            "Big Data",
            "Management"
        ],
        "tags": [
            "heritage-institution",
            "liberal-arts"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "Computer Science & Engg",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "CSE (Artificial Intelligence & ML)",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Electronics & Communication",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Information Science & Engg Computer Applications",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "BCA Management",
                    "duration": "4 Years",
                    "seats": 310,
                    "specializations": []
                },
                {
                    "name": "BBA",
                    "duration": "4 Years",
                    "seats": 360,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "govt-polytechnic-mangalore",
        "name": "Karnataka (Govt.) Polytechnic",
        "category": "Polytechnic",
        "type": "Government",
        "location": {
            "address": "Mangalore",
            "landmark": "",
            "area": "Mangalore - 575004",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575004",
            "coordinates": {
                "lat": 12.885,
                "lng": 74.855
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.885,74.855"
        },
        "contact": {
            "website": "https://gptmangalore.karnataka.gov.in"
        },
        "coe": false,
        "programs": [
            {
                "name": "Electrical & Electronics",
                "duration": "4 Years",
                "seats": 90,
                "specializations": []
            },
            {
                "name": "Mechanical Engineering",
                "duration": "4 Years",
                "seats": 90,
                "specializations": []
            },
            {
                "name": "Automobile Engineering",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Chemical Engineering",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Electronics & Communication",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Computer Science",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Civil Engineering",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Polymer Technology",
                "duration": "4 Years",
                "seats": 40,
                "specializations": []
            }
        ],
        "domains": {
            "Software Development": 7,
            "Automotive Tech": 8,
            "Material Science": 7
        },
        "tools": [
            {
                "name": "C Programming",
                "domain": "Software Development",
                "proficiency": "Intermediate"
            },
            {
                "name": "AutoCAD",
                "domain": "Automotive Tech",
                "proficiency": "Intermediate"
            },
            {
                "name": "Polymer Testing Tools",
                "domain": "Material Science",
                "proficiency": "Intermediate"
            }
        ],
        "specializations": [
            "Automobile",
            "Polymer"
        ],
        "tags": [
            "government",
            "diploma"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "Electrical & Electronics",
                    "duration": "4 Years",
                    "seats": 90,
                    "specializations": []
                },
                {
                    "name": "Mechanical Engineering",
                    "duration": "4 Years",
                    "seats": 90,
                    "specializations": []
                },
                {
                    "name": "Automobile Engineering",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Chemical Engineering",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Electronics & Communication",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Computer Science",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Civil Engineering",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Polymer Technology",
                    "duration": "4 Years",
                    "seats": 40,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "st-agnes-college",
        "name": "St. Agnes College (Autonomous)",
        "category": "University",
        "type": "Aided",
        "location": {
            "address": "(Autonomous) Bendore, Mangalore - 575002",
            "landmark": "",
            "area": "Mangalore - 575002",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575002",
            "coordinates": {
                "lat": 12.88,
                "lng": 74.86
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.88,74.86"
        },
        "contact": {
            "website": "https://stagnescollege.edu.in"
        },
        "coe": false,
        "programs": [
            {
                "name": "BCA",
                "duration": "4 Years",
                "seats": 140,
                "specializations": []
            },
            {
                "name": "MCA",
                "duration": "2 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "MBA",
                "duration": "2 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "BBA",
                "duration": "4 Years",
                "seats": 80,
                "specializations": []
            }
        ],
        "domains": {
            "Software Development": 8,
            "Management": 8,
            "Web Development": 7
        },
        "tools": [
            {
                "name": "Java",
                "domain": "Software Development",
                "proficiency": "Advanced"
            },
            {
                "name": "PHP",
                "domain": "Web Development",
                "proficiency": "Intermediate"
            },
            {
                "name": "Microsoft Excel",
                "domain": "Management",
                "proficiency": "Advanced"
            },
            {
                "name": "Tally Prime",
                "domain": "Management",
                "proficiency": "Intermediate"
            }
        ],
        "specializations": [
            "Computer Applications",
            "Management"
        ],
        "tags": [
            "autonomous",
            "women-college"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "BCA",
                    "duration": "4 Years",
                    "seats": 140,
                    "specializations": []
                },
                {
                    "name": "MCA",
                    "duration": "2 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "MBA",
                    "duration": "2 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "BBA",
                    "duration": "4 Years",
                    "seats": 80,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "st-philomena-puttur",
        "name": "St. Philomena College",
        "category": "University",
        "type": "Aided",
        "location": {
            "address": "Philonagar, Darbe, Puttur - 574202",
            "landmark": "",
            "area": "Darbe",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "574202",
            "coordinates": {
                "lat": 12.76,
                "lng": 75.2
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.76,75.2"
        },
        "contact": {
            "website": "https://spcputtur.ac.in"
        },
        "coe": false,
        "programs": [
            {
                "name": "BCA",
                "duration": "4 Years",
                "seats": 240,
                "specializations": []
            },
            {
                "name": "BBA",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "MCA",
                "duration": "2 Years",
                "seats": 60,
                "specializations": []
            }
        ],
        "domains": {
            "Software Development": 8,
            "Management": 7
        },
        "tools": [
            {
                "name": "C++",
                "domain": "Software Development",
                "proficiency": "Intermediate"
            },
            {
                "name": "Visual Basic",
                "domain": "Software Development",
                "proficiency": "Intermediate"
            },
            {
                "name": "Microsoft Office",
                "domain": "Management",
                "proficiency": "Advanced"
            }
        ],
        "specializations": [
            "Computer Applications"
        ],
        "tags": [
            "rural-education",
            "aided"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "BCA",
                    "duration": "4 Years",
                    "seats": 240,
                    "specializations": []
                },
                {
                    "name": "BBA",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "MCA",
                    "duration": "2 Years",
                    "seats": 60,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "shree-devi-info-science",
        "name": "Shree Devi College of Information Science",
        "category": "University",
        "type": "Private",
        "location": {
            "address": "Mangalore",
            "landmark": "",
            "area": "Mangalore - 575003",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575003",
            "coordinates": {
                "lat": 12.89,
                "lng": 74.84
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.89,74.84"
        },
        "contact": {
            "website": "https://sdc.ac.in"
        },
        "coe": false,
        "programs": [
            {
                "name": "BCA",
                "duration": "4 Years",
                "seats": 480,
                "specializations": []
            }
        ],
        "domains": {
            "Software Development": 9,
            "Web Technologies": 8
        },
        "tools": [
            {
                "name": "Python",
                "domain": "Software Development",
                "proficiency": "Intermediate"
            },
            {
                "name": "Java",
                "domain": "Software Development",
                "proficiency": "Intermediate"
            },
            {
                "name": "HTML/CSS",
                "domain": "Web Technologies",
                "proficiency": "Advanced"
            }
        ],
        "specializations": [
            "IT Services"
        ],
        "tags": [
            "high-intake",
            "private"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "BCA",
                    "duration": "4 Years",
                    "seats": 480,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "aj-institute-engineering",
        "name": "A. J. Institute of Engineering & Technology",
        "category": "Engineering",
        "type": "Private",
        "location": {
            "address": "of Engineering & Tech Kottara Chowki, Boloor, Mangaluru - 575006",
            "landmark": "",
            "area": "Boloor",
            "taluk": "Mangaluru",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "575006",
            "coordinates": {
                "lat": 12.905,
                "lng": 74.835
            },
            "googleMapsUrl": "https://maps.google.com/?q=12.905,74.835"
        },
        "contact": {
            "website": "https://ajiet.edu.in"
        },
        "coe": false,
        "programs": [
            {
                "name": "Electronics & Communication",
                "duration": "4 Years",
                "seats": 180,
                "specializations": []
            },
            {
                "name": "Computer Science & Engg",
                "duration": "4 Years",
                "seats": 150,
                "specializations": []
            },
            {
                "name": "CSE (IoT & Cyber Security)",
                "duration": "4 Years",
                "seats": 120,
                "specializations": []
            },
            {
                "name": "CSE (Artificial Intelligence & ML)",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Artificial Intelligence & Data Science",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Information Science & Engg",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Electronics Engg (VLSI Design)",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Mechanical Engineering",
                "duration": "4 Years",
                "seats": 60,
                "specializations": []
            },
            {
                "name": "Civil Engineering PG",
                "duration": "4 Years",
                "seats": 30,
                "specializations": []
            },
            {
                "name": "MCA",
                "duration": "2 Years",
                "seats": 120,
                "specializations": []
            }
        ],
        "domains": {
            "Cyber Security": 9,
            "IoT": 8,
            "Software Development": 8,
            "VLSI Design": 7
        },
        "tools": [
            {
                "name": "Wireshark",
                "domain": "Cyber Security",
                "proficiency": "Advanced"
            },
            {
                "name": "Kali Linux",
                "domain": "Cyber Security",
                "proficiency": "Intermediate"
            },
            {
                "name": "Arduino IDE",
                "domain": "IoT",
                "proficiency": "Intermediate"
            },
            {
                "name": "Verilog",
                "domain": "VLSI Design",
                "proficiency": "Intermediate"
            }
        ],
        "specializations": [
            "Cyber Security",
            "IoT"
        ],
        "tags": [
            "cyber-security",
            "iot"
        ],
        "metadata": {
            "verified": true,
            "lastUpdated": "2024-12-05",
            "source": "User Provided"
        },
        "academic": {
            "programs": [
                {
                    "name": "Electronics & Communication",
                    "duration": "4 Years",
                    "seats": 180,
                    "specializations": []
                },
                {
                    "name": "Computer Science & Engg",
                    "duration": "4 Years",
                    "seats": 150,
                    "specializations": []
                },
                {
                    "name": "CSE (IoT & Cyber Security)",
                    "duration": "4 Years",
                    "seats": 120,
                    "specializations": []
                },
                {
                    "name": "CSE (Artificial Intelligence & ML)",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Artificial Intelligence & Data Science",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Information Science & Engg",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Electronics Engg (VLSI Design)",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Mechanical Engineering",
                    "duration": "4 Years",
                    "seats": 60,
                    "specializations": []
                },
                {
                    "name": "Civil Engineering PG",
                    "duration": "4 Years",
                    "seats": 30,
                    "specializations": []
                },
                {
                    "name": "MCA",
                    "duration": "2 Years",
                    "seats": 120,
                    "specializations": []
                }
            ]
        }
    },
    {
        "id": "mit-manipal",
        "name": "Manipal Institute of Technology (MIT)",
        "category": "Engineering",
        "type": "Private",
        "subCategory": "Constituent College of MAHE",
        "location": {
            "address": "Manipal, Udupi - 576104",
            "landmark": "Manipal",
            "area": "Manipal",
            "taluk": "Udupi",
            "district": "Dakshina Kannada", // Technically Udupi, but part of the cluster analysis
            "state": "Karnataka",
            "pincode": "576104",
            "coordinates": { "lat": 13.3525, "lng": 74.7928 },
            "googleMapsUrl": "https://maps.google.com/?q=13.3525,74.7928"
        },
        "contact": { "website": "https://manipal.edu/mit.html" },
        "metadata": { "verified": true, "lastUpdated": "2024-12-05", "source": "User Provided" },
        "placement": {
            "rate": 80.10,
            "year": "2024-25",
            "packages": {
                "highest": 69.25,
                "average": 12.31,
                "median": 10.05
            },
            "topRecruiters": ["Microsoft", "Amazon", "Google", "Intel", "L&T", "Deloitte"],
            "analysis": "V-shaped recovery in placement rates. 'Creamy Layer' secures >50 LPA offers. Significant jump in median salary to 10.05 LPA in 2025 indicates rising floor for graduates.",
            "highlights": ["80% Placement Rate (2025)", "Highest Package 69.25 LPA", "Median Salary 10.05 LPA"]
        }
    },
    {
        "id": "nmamit-nitte",
        "name": "NMAM Institute of Technology (NMAMIT)",
        "category": "Engineering",
        "type": "Private",
        "subCategory": "Constituent College of Nitte University",
        "location": {
            "address": "Nitte, Karkala Taluk - 574110",
            "landmark": "Nitte",
            "area": "Nitte",
            "taluk": "Karkala",
            "district": "Dakshina Kannada", // Technically Udupi, but part of the cluster
            "state": "Karnataka",
            "pincode": "574110",
            "coordinates": { "lat": 13.1825, "lng": 74.9342 },
            "googleMapsUrl": "https://maps.google.com/?q=13.1825,74.9342"
        },
        "contact": { "website": "https://nmamit.nitte.edu.in" },
        "metadata": { "verified": true, "lastUpdated": "2024-12-05", "source": "User Provided" },
        "placement": {
            "rate": 70, // Estimated from volume drop
            "year": "2023-24",
            "packages": {
                "highest": 52.00,
                "average": 7.5, // Estimated
                "median": 5.50
            },
            "topRecruiters": ["Japanese Firms", "Tech Giants"],
            "analysis": "Consistent high-value offers (>50 LPA). Unique 'Japanese Internship Strategy' facilitates global careers. Median salary growth (5.5 LPA) reflects curriculum value.",
            "highlights": ["Highest Package 52 LPA", "Japanese Internships", "Median Growth"]
        }
    },
    {
        "id": "canara-engineering",
        "name": "Canara Engineering College",
        "category": "Engineering",
        "type": "Private",
        "location": {
            "address": "Benjanapadavu, Bantwal - 574219",
            "landmark": "Benjanapadavu",
            "area": "Benjanapadavu",
            "taluk": "Bantwal",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "574219",
            "coordinates": { "lat": 12.8956, "lng": 74.9823 },
            "googleMapsUrl": "https://maps.google.com/?q=12.8956,74.9823"
        },
        "contact": { "website": "https://canaraengineering.in" },
        "metadata": { "verified": true, "lastUpdated": "2024-12-05", "source": "User Provided" },
        "placement": {
            "rate": 65, // Estimated
            "year": "2023-24",
            "packages": {
                "highest": 15.00,
                "average": 4.5,
                "median": 4.00
            },
            "topRecruiters": ["SAP", "Accenture", "Tata Electronics"],
            "analysis": "Cost-effective option with decent returns. Correction in highest package (15 LPA) reflects a grounded market.",
            "highlights": ["Median Salary 4.00 LPA", "Highest Package 15 LPA", "Core Recruiters"]
        }
    },
    {
        "id": "alvas-engineering",
        "name": "Alva's Institute of Engineering & Technology",
        "category": "Engineering",
        "type": "Private",
        "location": {
            "address": "Shobhavana Campus, Mijar, Moodbidri - 574225",
            "landmark": "Mijar",
            "area": "Moodbidri",
            "taluk": "Moodbidri",
            "district": "Dakshina Kannada",
            "state": "Karnataka",
            "pincode": "574225",
            "coordinates": { "lat": 13.0850, "lng": 74.9860 },
            "googleMapsUrl": "https://maps.google.com/?q=13.0850,74.9860"
        },
        "contact": { "website": "https://aiet.org.in" },
        "metadata": { "verified": true, "lastUpdated": "2024-12-05", "source": "User Provided" },
        "placement": {
            "rate": 66,
            "year": "2023-24",
            "packages": {
                "highest": 18.00,
                "average": 4.5,
                "median": 4.00
            },
            "topRecruiters": ["Mass Recruiters"],
            "analysis": "Sharp decline in placement rate (66%) highlights vulnerability of 'Pooled Campus' model during mass recruiter hiring freezes.",
            "highlights": ["Pooled Campus Model", "Placement Rate 66%", "Median Salary 4.00 LPA"]
        }
    }
];
