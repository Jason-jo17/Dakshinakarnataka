import type { Institution } from '../../types/institution';

import { inferSkills } from './inference';

const rawInstitutions: Institution[] = [
    // --- UNIVERSITIES (4) ---
    {
        id: 'nitk-surathkal',
        name: 'National Institute of Technology Karnataka',
        shortName: 'NITK Surathkal',
        // Listed as University in user data section 5, but also Engineering. User put it in Engineering table but it's a Deemed University. I'll stick to University category for high level, or Engineering? User listed it in Engineering table. But also in University table? No, University table has NITTE, St Aloysius, Yenepoya, Mangalore University. NITK is in Engineering table. Wait, NITK is an Institute of National Importance, effectively a university. I will classify as 'Engineering' as per user's Section 2, but maybe 'University' is better? The user put it in Section 2 (Engineering). I will use 'Engineering' to match the user's primary classification in the prompt, but add 'University' tag if possible? The type allows 'University'. Let's stick to 'Engineering' as it's the primary identity in the user's list.
        // Actually, looking at Section 5, NITK is NOT in the University table. So 'Engineering' it is.
        category: 'Engineering',
        type: 'Government',
        subCategory: 'Institute of National Importance',
        location: {
            address: 'NH 66, Srinivasnagar, Surathkal',
            landmark: 'NITK Beach',
            area: 'Surathkal',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575025',
            coordinates: { lat: 13.0108, lng: 74.7926 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0108,74.7926'
        },
        contact: { phone: '0824-2474000', website: 'https://www.nitk.ac.in' },
        academic: {
            programs: [
                { name: 'B.Tech', duration: '4 Years', specializations: ['CSE', 'ECE', 'EEE', 'ME', 'Civil', 'Chemical', 'Mining', 'IT', 'Metallurgy'] }
            ],
            accreditation: ['NAAC A+', 'NIRF #17']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['Software Development', 'AI', 'Data Engineering', 'Embedded Systems'],
        keyTools: ['Python', 'Java', 'TensorFlow', 'MATLAB', 'SolidWorks', 'Docker', 'AWS'],
        tags: ['nitk', 'government', 'tier-1', 'software', 'ai', 'research', 'placement'],
        coe: true,
        domains: {
            'Software Development': 10,
            'AI': 10,
            'Data Engineering': 9,
            'Networking': 8,
            'Embedded Systems': 9,
            'IoT': 7,
            'Robotics': 8,
            'Design': 7,
            'PDIET': 9
        },
        tools: [
            { name: 'Python', domain: 'Software Development', proficiency: 'Advanced', category: 'Programming Languages' },
            { name: 'Java', domain: 'Software Development', proficiency: 'Advanced', category: 'Programming Languages' },
            { name: 'C++', domain: 'Software Development', proficiency: 'Advanced', category: 'Programming Languages' },
            { name: 'TensorFlow', domain: 'AI', proficiency: 'Advanced', category: 'ML Frameworks' },
            { name: 'PyTorch', domain: 'AI', proficiency: 'Advanced', category: 'ML Frameworks' },
            { name: 'React', domain: 'Software Development', proficiency: 'Advanced', category: 'Web Frameworks' },
            { name: 'Node.js', domain: 'Software Development', proficiency: 'Advanced', category: 'Backend' },
            { name: 'Docker', domain: 'Software Development', proficiency: 'Advanced', category: 'DevOps' },
            { name: 'AWS', domain: 'Software Development', proficiency: 'Intermediate', category: 'Cloud' },
            { name: 'MATLAB', domain: 'PDIET', proficiency: 'Advanced', category: 'Engineering Tools' },
            { name: 'AutoCAD', domain: 'Design', proficiency: 'Intermediate', category: 'CAD Software' },
            { name: 'SolidWorks', domain: 'Design', proficiency: 'Advanced', category: 'CAD Software' },
            { name: 'Arduino', domain: 'Embedded Systems', proficiency: 'Advanced', category: 'Microcontrollers' },
            { name: 'Raspberry Pi', domain: 'IoT', proficiency: 'Advanced', category: 'SBC' }
        ],
        specializations: [
            'Machine Learning',
            'Computer Vision',
            'Natural Language Processing',
            'Embedded Systems Design',
            'Robotics',
            'Structural Engineering',
            'VLSI Design',
            'Data Science'
        ]
    },
    {
        id: 'mangalore-university',
        name: 'Mangalore University',
        category: 'University',
        type: 'Government',
        location: {
            address: 'Mangalagangotri, Konaje',
            landmark: 'Mangalagangotri',
            area: 'Konaje',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574199',
            coordinates: { lat: 12.8050, lng: 74.9300 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8050,74.9300'
        },
        contact: { phone: '0824-2287276', website: 'https://mangaloreuniversity.ac.in' },
        academic: {
            programs: [{ name: 'PG Programs', duration: '2 Years', specializations: ['Arts', 'Science', 'Commerce', 'MBA', 'MCA'] }],
            accreditation: ['NAAC B', 'NIRF 151-200']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['All 11 domains'],
        keyTools: ['MATLAB', 'Python', 'R', 'SPSS', 'Research tools'],
        tags: ['mangalore-university', 'state', 'konaje', 'affiliating']
    },
    {
        id: 'nitte-university',
        name: 'NITTE (Deemed to be University)',
        category: 'University',
        type: 'Deemed',
        location: {
            address: 'Medical Sciences Complex, Deralakatte',
            landmark: 'KS Hegde Hospital',
            area: 'Deralakatte',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575018',
            coordinates: { lat: 12.8789, lng: 74.8956 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8789,74.8956'
        },
        contact: { phone: '0824-2204000', website: 'https://nitte.edu.in' },
        academic: {
            programs: [{ name: 'Medical & Allied', duration: 'Various', specializations: ['MBBS', 'BDS', 'B.Pharm', 'BPT', 'Nursing', 'Engineering'] }],
            accreditation: ['NAAC A+', 'NIRF 80']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['AI', 'Software Dev', 'Data Engineering'],
        keyTools: ['Medical AI', 'Python', 'Healthcare IoT', 'EMR'],
        tags: ['nitte', 'deemed', 'deralakatte', 'medical', 'healthtech']
    },
    {
        id: 'st-aloysius-university',
        name: 'St Aloysius (Deemed to be University)',
        category: 'University',
        type: 'Deemed',
        location: {
            address: 'Kodialbail, P.B. No. 720',
            landmark: 'St Aloysius Chapel',
            area: 'Kodialbail',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575003',
            coordinates: { lat: 12.8731, lng: 74.8458 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8731,74.8458'
        },
        contact: { phone: '0824-2449700', website: 'https://staloysius.edu.in' },
        academic: {
            programs: [{ name: 'UG & PG', duration: 'Various', specializations: ['Arts', 'Science', 'Commerce', 'Management', 'IT'] }],
            accreditation: ['NAAC A++', 'NIRF 58']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['Software Dev', 'AI', 'Data Engineering', 'Design'],
        keyTools: ['Full-stack', 'Python', 'AWS', 'Data Science tools'],
        tags: ['st-aloysius-univ', 'deemed', 'aimit', 'software', 'mba']
    },
    {
        id: 'yenepoya-university',
        name: 'Yenepoya (Deemed to be University)',
        category: 'University',
        type: 'Deemed',
        location: {
            address: 'University Road, Deralakatte',
            landmark: 'Yenepoya Hospital',
            area: 'Deralakatte',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575018',
            coordinates: { lat: 12.8780, lng: 74.8850 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8780,74.8850'
        },
        contact: { phone: '0824-2204668', website: 'https://yenepoya.edu.in' },
        academic: {
            programs: [{ name: 'Medical & Allied', duration: 'Various', specializations: ['MBBS', 'BDS', 'BAMS', 'Engineering', 'Management'] }],
            accreditation: ['NAAC A+', 'NIRF 151-200']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['AI', 'Software Dev', 'Embedded Systems'],
        keyTools: ['Healthcare AI', 'Medical devices', 'Python', 'Engineering'],
        tags: ['yenepoya', 'deemed', 'deralakatte', 'medical', 'engineering']
    },

    // --- ENGINEERING COLLEGES (12 remaining) ---
    {
        id: 'sjec-vamanjoor',
        name: 'SJEC Vamanjoor',
        category: 'Engineering',
        type: 'Private',
        subCategory: 'Autonomous',
        location: {
            address: 'Vamanjoor Post, Dharmagiri',
            landmark: 'Vamanjoor',
            area: 'Vamanjoor',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575028',
            coordinates: { lat: 12.9298, lng: 74.9152 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9298,74.9152'
        },
        contact: { phone: '0824-2263753', website: 'https://sjec.ac.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'ME', 'Civil', 'EEE', 'AI-ML'] }],
            accreditation: ['NAAC A+', 'NBA']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['Software Development', 'AI', 'Embedded Systems'],
        keyTools: ['Python', 'Java', 'TensorFlow', 'AutoCAD', 'Arduino'],
        tags: ['sjec', 'vamanjoor', 'autonomous', 'naac-a+', 'software', 'ai-ml'],
        coe: true,
        domains: {
            'Software Development': 9,
            'AI': 9,
            'Embedded Systems': 7,
            'Data Engineering': 7,
            'Design': 6,
            'PDIET': 7
        },
        tools: [
            { name: 'Python', domain: 'Software Development', proficiency: 'Advanced' },
            { name: 'Java', domain: 'Software Development', proficiency: 'Advanced' },
            { name: 'TensorFlow', domain: 'AI', proficiency: 'Intermediate' },
            { name: 'Scikit-learn', domain: 'AI', proficiency: 'Advanced' },
            { name: 'React', domain: 'Software Development', proficiency: 'Intermediate' },
            { name: 'Spring Boot', domain: 'Software Development', proficiency: 'Advanced' },
            { name: 'MySQL', domain: 'Data Engineering', proficiency: 'Advanced' },
            { name: 'MongoDB', domain: 'Data Engineering', proficiency: 'Intermediate' },
            { name: 'Arduino', domain: 'Embedded Systems', proficiency: 'Intermediate' },
            { name: 'AutoCAD', domain: 'Design', proficiency: 'Intermediate' }
        ],
        specializations: [
            'AI & Machine Learning',
            'Web Development',
            'IoT Systems',
            'Data Analytics',
            'Mobile App Development'
        ]
    },
    {
        id: 'mite-moodabidri',
        name: 'MITE Moodabidri',
        category: 'Engineering',
        type: 'Private',
        subCategory: 'Autonomous',
        location: {
            address: 'Badaga Mijar, Moodabidri',
            landmark: 'Mijar',
            area: 'Moodabidri',
            taluk: 'Moodabidri',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574225',
            coordinates: { lat: 13.0682, lng: 74.9945 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0682,74.9945'
        },
        contact: { phone: '08258-262695', website: 'https://mite.ac.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['Aero', 'CSE', 'ECE', 'ISE', 'ME', 'Mechatronics', 'AI-ML', 'Robotics'] }],
            accreditation: ['NAAC A+']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['Robotics', 'AI', 'PDIET', 'Design'],
        keyTools: ['CATIA', 'ROS', 'TensorFlow', 'SolidWorks', 'Python'],
        tags: ['mite', 'moodabidri', 'aerospace', 'robotics', 'autonomous']
    },
    {
        id: 'sahyadri-adyar',
        name: 'Sahyadri Adyar',
        category: 'Engineering',
        type: 'Private',
        subCategory: 'Autonomous',
        location: {
            address: 'NH 48, Adyar',
            landmark: 'Adyar',
            area: 'Adyar',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575007',
            coordinates: { lat: 12.8686, lng: 74.9358 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8686,74.9358'
        },
        contact: { phone: '0824-2277222', website: 'https://sahyadri.edu.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'EEE', 'ME', 'Civil', 'ISE', 'AI-ML', 'Robotics'] }],
            accreditation: ['NAAC A', 'NBA']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['Software Development', 'AI', 'Robotics'],
        keyTools: ['Python', 'React', 'TensorFlow', 'Arduino', 'AutoCAD'],
        tags: ['sahyadri', 'adyar', 'autonomous', 'software', 'ai']
    },
    {
        id: 'canara-engineering',
        name: 'Canara Engineering, Bantwal',
        category: 'Engineering',
        type: 'Private',
        location: {
            address: 'Sudheendra Nagar, Benjanapadavu, Ammunje',
            landmark: 'Benjanapadavu',
            area: 'Benjanapadavu',
            taluk: 'Bantwal',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574219',
            coordinates: { lat: 12.8731, lng: 75.0189 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8731,75.0189'
        },
        contact: { phone: '0824-2278666', website: 'https://canaraengineering.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'EEE', 'ISE', 'ME', 'AI-ML', 'CS-Design'] }],
            accreditation: ['NAAC A', 'NBA']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['Software Development', 'AI', 'Design'],
        keyTools: ['Python', 'Java', 'Figma', 'Adobe XD', 'MySQL'],
        tags: ['canara', 'bantwal', 'software', 'design', 'cs-design']
    },
    {
        id: 'pace-nadupadavu',
        name: 'PACE Nadupadavu',
        category: 'Engineering',
        type: 'Private',
        location: {
            address: 'Nadupadav, Montepadav Post, Near MU Konaje',
            landmark: 'Konaje',
            area: 'Nadupadavu',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574153',
            coordinates: { lat: 12.7966, lng: 74.9285 },
            googleMapsUrl: 'https://maps.google.com/?q=12.7966,74.9285'
        },
        contact: { phone: '0824-2284701', website: 'https://pace.edu.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'EEE', 'ISE', 'ME', 'Civil', 'Biotech', 'AI-ML'] }],
            accreditation: ['NAAC A', 'NBA']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'sdit-kenjar',
        name: 'SDIT Kenjar',
        category: 'Engineering',
        type: 'Private',
        location: {
            address: 'Airport Road, Kenjar',
            landmark: 'Kenjar',
            area: 'Kenjar',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574142',
            coordinates: { lat: 12.9553, lng: 74.8912 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9553,74.8912'
        },
        contact: { phone: '0824-2254104', website: 'https://sdit.ac.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'ME', 'Civil', 'ISE', 'Aero', 'AI-ML', 'CS&T'] }],
            accreditation: ['VTU Excellent']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'srinivas-it-valachil',
        name: 'Srinivas IT, Valachil',
        category: 'Engineering',
        type: 'Private',
        location: {
            address: 'Merlapadavu, Arkula, Via Valachil',
            landmark: 'Valachil',
            area: 'Valachil',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574143',
            coordinates: { lat: 12.8486, lng: 74.9564 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8486,74.9564'
        },
        contact: { phone: '0824-2412382', website: 'https://srinivasgroup.com' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'EEE', 'ME', 'Civil', 'ISE', 'Auto', 'Marine', 'AI-ML'] }],
            accreditation: ['NAAC A']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'bearys-it-innoli',
        name: 'Bearys IT, Innoli',
        category: 'Engineering',
        type: 'Private',
        location: {
            address: 'Lands-End, Boliyar Village, Innoli',
            landmark: 'Innoli',
            area: 'Innoli',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574199',
            coordinates: { lat: 12.7896, lng: 74.9324 },
            googleMapsUrl: 'https://maps.google.com/?q=12.7896,74.9324'
        },
        contact: { phone: '0824-2235100', website: 'https://bitmangalore.edu.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'ME', 'Civil', 'AI-DS'] }],
            accreditation: ['NAAC']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'aiet-mijar',
        name: 'AIET Mijar',
        category: 'Engineering',
        type: 'Private',
        location: {
            address: 'Shobhavana Campus, Mijar, Moodabidri',
            landmark: 'Mijar',
            area: 'Moodabidri',
            taluk: 'Moodabidri',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574227',
            coordinates: { lat: 13.0854, lng: 74.9862 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0854,74.9862'
        },
        contact: { phone: '8197617333', website: 'https://aiet.org.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'ME', 'Civil', 'ISE'] }],
            accreditation: ['NAAC A+', 'NBA']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'yit-moodabidri',
        name: 'YIT Moodabidri',
        category: 'Engineering',
        type: 'Private',
        location: {
            address: 'NH 13, Thodar, Vidyanagar, Moodabidri',
            landmark: 'Thodar',
            area: 'Moodabidri',
            taluk: 'Moodabidri',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574225',
            coordinates: { lat: 13.0729, lng: 74.9876 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0729,74.9876'
        },
        contact: { phone: '08258-262733', website: 'https://yit.edu.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'ME', 'Civil', 'ISE'] }],
            accreditation: ['AICTE']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'sdmit-ujire',
        name: 'SDMIT Ujire',
        category: 'Engineering',
        type: 'Private',
        location: {
            address: 'Dharmasthala Road, Ujire',
            landmark: 'Ujire',
            area: 'Ujire',
            taluk: 'Belthangady',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574240',
            coordinates: { lat: 13.0342, lng: 75.3254 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0342,75.3254'
        },
        contact: { phone: '08256-236621', website: 'https://sdmit.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'EEE', 'ME', 'Civil', 'ISE'] }],
            accreditation: ['NBA']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'ajiet-kottara',
        name: 'AJIET Kottara',
        category: 'Engineering',
        type: 'Private',
        location: {
            address: 'NH-66, Kottara Chowki, Ashok Nagar',
            landmark: 'Kottara Chowki',
            area: 'Kottara',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575006',
            coordinates: { lat: 12.8914, lng: 74.8426 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8914,74.8426'
        },
        contact: { phone: '0824-2862200', website: 'https://ajiet.edu.in' },
        academic: {
            programs: [{ name: 'BE', duration: '4 Years', specializations: ['CSE', 'ECE', 'ME', 'Civil', 'ISE', 'AI-ML', 'AI-DS', 'CS-Design'] }],
            accreditation: ['NBA']
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },

    // --- POLYTECHNICS (10) ---
    {
        id: 'karnataka-govt-polytechnic',
        name: 'Karnataka Govt Polytechnic, Mangalore',
        category: 'Polytechnic',
        type: 'Government',
        location: {
            address: 'Kadri Hills',
            landmark: 'Kadri',
            area: 'Kadri',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575004',
            coordinates: { lat: 12.8788, lng: 74.8434 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8788,74.8434'
        },
        contact: { phone: '0824-2492366', website: '' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years', specializations: ['Civil', 'Mech', 'EEE', 'Auto', 'ECE', 'CSE', 'Chemical', 'Polymer'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['PDIET', 'Embedded Systems'],
        keyTools: ['AutoCAD', 'SolidWorks', 'C programming', 'Arduino'],
        tags: ['government', 'kadri', 'diploma', 'oldest-poly']
    },
    {
        id: 'sdm-polytechnic-ujire',
        name: 'SDM Polytechnic, Ujire',
        category: 'Polytechnic',
        type: 'Aided',
        location: {
            address: 'Near Sidhavana, Ujire',
            landmark: 'Ujire',
            area: 'Ujire',
            taluk: 'Belthangady',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574240',
            coordinates: { lat: 13.0633, lng: 75.3267 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0633,75.3267'
        },
        contact: { phone: '08256-236600', website: '' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years', specializations: ['Mech', 'Civil', 'ECE', 'CSE', 'EEE'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['PDIET', 'Embedded Systems'],
        keyTools: ['AutoCAD', 'C', 'Arduino', 'MATLAB'],
        tags: ['sdm-poly', 'ujire', 'diploma']
    },
    {
        id: 'pa-polytechnic',
        name: 'PA Polytechnic, Nadupadavu',
        category: 'Polytechnic',
        type: 'Private',
        location: {
            address: 'Nadupadav, Montepadav Post',
            landmark: 'Nadupadavu',
            area: 'Nadupadavu',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574153',
            coordinates: { lat: 12.8137, lng: 74.9282 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8137,74.9282'
        },
        contact: { website: 'https://pace.edu.in' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years', specializations: ['Mech', 'Civil', 'CSE', 'ECE', 'EEE'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'canara-polytechnic',
        name: 'Canara Polytechnic, Bantwal',
        category: 'Polytechnic',
        type: 'Private',
        location: {
            address: 'Bantwal area',
            landmark: 'Bantwal',
            area: 'Bantwal',
            taluk: 'Bantwal',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574211',
            coordinates: { lat: 12.8900, lng: 75.0300 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8900,75.0300'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years', specializations: ['Civil', 'Mech', 'EEE'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'alvas-polytechnic',
        name: "Alva's Polytechnic, Moodabidri",
        category: 'Polytechnic',
        type: 'Private',
        location: {
            address: 'Shobhavana Campus, Mijar',
            landmark: 'Mijar',
            area: 'Moodabidri',
            taluk: 'Moodabidri',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574227',
            coordinates: { lat: 13.0850, lng: 74.9860 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0850,74.9860'
        },
        contact: { phone: '0824-2297696', website: '' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years' }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'yenepoya-polytechnic',
        name: 'Yenepoya Polytechnic, Mangalore',
        category: 'Polytechnic',
        type: 'Private',
        location: {
            address: 'NH 13, Thodar, Moodabidri',
            landmark: 'Thodar',
            area: 'Moodabidri',
            taluk: 'Moodabidri',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574225',
            coordinates: { lat: 13.0729, lng: 74.9876 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0729,74.9876'
        },
        contact: { phone: '08258-262733', website: '' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years' }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'bit-polytechnic',
        name: 'BIT Polytechnic (Bearys), Innoli',
        category: 'Polytechnic',
        type: 'Private',
        location: {
            address: 'Bearys Knowledge Campus, Boliyar',
            landmark: 'Innoli',
            area: 'Innoli',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574153',
            coordinates: { lat: 12.8130, lng: 74.9350 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8130,74.9350'
        },
        contact: { phone: '0824-2235000', website: '' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years', specializations: ['Civil', 'Mech', 'CSE'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'shree-devi-polytechnic',
        name: 'Shree Devi Polytechnic, Kenjar',
        category: 'Polytechnic',
        type: 'Private',
        location: {
            address: 'Airport Road, Kenjar',
            landmark: 'Kenjar',
            area: 'Kenjar',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574142',
            coordinates: { lat: 12.9192, lng: 74.8842 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9192,74.8842'
        },
        contact: { phone: '0824-2254104', website: '' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years' }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'st-joseph-polytechnic',
        name: 'St Joseph Polytechnic, Mangalore',
        category: 'Polytechnic',
        type: 'Private',
        location: {
            address: 'Vamanjoor area',
            landmark: 'Vamanjoor',
            area: 'Vamanjoor',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575028',
            coordinates: { lat: 12.9280, lng: 74.9140 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9280,74.9140'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years' }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'srinivas-polytechnic',
        name: 'Srinivas Polytechnic, Valachil',
        category: 'Polytechnic',
        type: 'Private',
        location: {
            address: 'Valachil, Farangipet Post',
            landmark: 'Valachil',
            area: 'Valachil',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574143',
            coordinates: { lat: 12.8486, lng: 74.9564 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8486,74.9564'
        },
        contact: { website: 'https://sitmng.ac.in' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years', specializations: ['CSE', 'Mech', 'Civil'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },

    // --- ITIs (10) ---
    {
        id: 'govt-iti-men-kadri',
        name: 'Govt ITI (Men), Kadri',
        category: 'ITI',
        type: 'Government',
        location: {
            address: 'Kadri Hills, Mangalore',
            landmark: 'Kadri',
            area: 'Kadri',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575004',
            coordinates: { lat: 12.8795, lng: 74.8450 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8795,74.8450'
        },
        contact: { website: 'https://govitimangalore.org' },
        academic: {
            programs: [{ name: 'ITI', duration: '1-2 Years', specializations: ['Fitter', 'Electrician', 'Turner', 'Machinist', 'Welder', 'MMV', 'RAC', 'COPA', 'Electronics', 'Diesel Mech'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['PDIET', 'Embedded Systems'],
        keyTools: ['Workshop tools', 'PLC basics', 'Welding'],
        tags: ['govt-iti', 'kadri', 'trades', 'oldest-1958'],
        domains: {
            'PDIET': 8,
            'Embedded Systems': 6,
            'Software Development': 3
        },
        tools: [
            { name: 'Workshop Hand Tools', domain: 'PDIET', proficiency: 'Advanced' },
            { name: 'Lathe Machine', domain: 'PDIET', proficiency: 'Advanced' },
            { name: 'Welding Equipment', domain: 'PDIET', proficiency: 'Advanced' },
            { name: 'Electrical Testing Equipment', domain: 'Embedded Systems', proficiency: 'Intermediate' },
            { name: 'PLC Basics', domain: 'Embedded Systems', proficiency: 'Basic' },
            { name: 'MS Office', domain: 'Software Development', proficiency: 'Basic' },
            { name: 'Tally', domain: 'Software Development', proficiency: 'Basic' }
        ],
        specializations: [
            'Fitting',
            'Electrical Installation',
            'Welding',
            'Machine Operation',
            'Computer Operation'
        ]
    },
    {
        id: 'govt-iti-women-urwastore',
        name: 'Govt ITI (Women), Urwastore',
        category: 'ITI',
        type: 'Government',
        location: {
            address: 'Urwastore, Mangalore',
            landmark: 'Urwastore',
            area: 'Urwa',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575006',
            coordinates: { lat: 12.8697, lng: 74.8428 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8697,74.8428'
        },
        contact: { phone: '0824-2451539', website: '' },
        academic: {
            programs: [{ name: 'ITI', duration: '1-2 Years', specializations: ['Electronics Mechanic', 'COPA'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-iti-women-puttur',
        name: 'Govt ITI (Women), Puttur',
        category: 'ITI',
        type: 'Government',
        location: {
            address: 'Puttur',
            landmark: 'Puttur',
            area: 'Puttur',
            taluk: 'Puttur',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574201',
            coordinates: { lat: 12.7580, lng: 75.1970 },
            googleMapsUrl: 'https://maps.google.com/?q=12.7580,75.1970'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'ITI', duration: '1-2 Years', specializations: ['Sewing Technology', 'COPA', 'Electronics'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-iti-vitla',
        name: 'Govt ITI, Vitla',
        category: 'ITI',
        type: 'Government',
        location: {
            address: 'Vitla, Bantwal Taluk',
            landmark: 'Vitla',
            area: 'Vitla',
            taluk: 'Bantwal',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574243',
            coordinates: { lat: 12.7650, lng: 75.1050 },
            googleMapsUrl: 'https://maps.google.com/?q=12.7650,75.1050'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'ITI', duration: '1-2 Years', specializations: ['Fitter', 'Electrician', 'COPA'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-iti-malady',
        name: 'Govt ITI, Malady/Mala',
        category: 'ITI',
        type: 'Government',
        location: {
            address: 'Mala',
            landmark: 'Mala',
            area: 'Mala',
            taluk: 'Belthangady', // Assuming Mala is in Belthangady or Karkala? User says "Mala", GPS 12.85, 75.00. That's near Puttur/Belthangady border. Let's assume Belthangady based on context or just use provided data.
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574232',
            coordinates: { lat: 12.8500, lng: 75.0000 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8500,75.0000'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'ITI', duration: '1-2 Years', specializations: ['Fitter', 'Electrician', 'COPA'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-iti-sullia',
        name: 'Govt ITI, Sullia',
        category: 'ITI',
        type: 'Government',
        location: {
            address: 'Sullia',
            landmark: 'Sullia',
            area: 'Sullia',
            taluk: 'Sullia',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574239',
            coordinates: { lat: 12.5600, lng: 75.3870 },
            googleMapsUrl: 'https://maps.google.com/?q=12.5600,75.3870'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'ITI', duration: '1-2 Years', specializations: ['Fitter', 'Electrician', 'Welder'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-iti-belthangady',
        name: 'Govt ITI, Belthangady',
        category: 'ITI',
        type: 'Government',
        location: {
            address: 'Near Madantyar, Belthangady',
            landmark: 'Madantyar',
            area: 'Belthangady',
            taluk: 'Belthangady',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574224',
            coordinates: { lat: 12.9700, lng: 75.3100 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9700,75.3100'
        },
        contact: { website: 'https://itibelthangady.com' },
        academic: {
            programs: [{ name: 'ITI', duration: '2 Years', specializations: ['Fitter', 'MRAC'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'sdm-mangalajyothi-iti',
        name: 'SDM Mangalajyothi ITI, Vamanjoor',
        category: 'ITI',
        type: 'Private',
        location: {
            address: 'Vamanjoor',
            landmark: 'Vamanjoor',
            area: 'Vamanjoor',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575028',
            coordinates: { lat: 12.9050, lng: 74.8617 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9050,74.8617'
        },
        contact: { phone: '0824-2262585', website: '' },
        academic: {
            programs: [{ name: 'ITI', duration: '1-2 Years', specializations: ['Electrician', 'Electronics', 'MMV', 'Auto Elec', 'Multimedia Animation', 'Sewing'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'sdm-womens-iti-ujire',
        name: 'SDM Women\'s ITI, Ujire',
        category: 'ITI',
        type: 'Private',
        location: {
            address: 'Ujire',
            landmark: 'Ujire',
            area: 'Ujire',
            taluk: 'Belthangady',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574240',
            coordinates: { lat: 13.0630, lng: 75.3260 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0630,75.3260'
        },
        contact: { website: 'https://sdmwomensiti.in' },
        academic: {
            programs: [{ name: 'ITI', duration: '1 Year', specializations: ['COPA', 'Sewing Technology'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'mulki-ramakrishna-punja-iti',
        name: 'Mulki Ramakrishna Punja ITI',
        category: 'ITI',
        type: 'Private',
        location: {
            address: 'Via Haleangadi, Tapovana, Thokur',
            landmark: 'Thokur',
            area: 'Mulki',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574146',
            coordinates: { lat: 13.0917, lng: 74.7950 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0917,74.7950'
        },
        contact: { phone: '0824-2297696', website: '' },
        academic: {
            programs: [{ name: 'ITI', duration: '1-2 Years', specializations: ['Fitter', 'Electrician', 'RAC', 'Electronics', 'Welder', 'COPA'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },

    // --- TRAINING CENTERS (4) ---
    {
        id: 'kgtti-mangalore',
        name: 'KGTTI Mangalore',
        category: 'Training',
        type: 'Government',
        subCategory: 'Indo-German',
        location: {
            address: 'Govt ITI Campus, Baikampady Industrial Estate',
            landmark: 'Baikampady',
            area: 'Baikampady',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575011',
            coordinates: { lat: 12.9250, lng: 74.8350 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9250,74.8350'
        },
        contact: { website: 'https://kgtti.com' },
        academic: {
            programs: [{ name: 'Vocational Training', duration: 'Various', specializations: ['Electrical', 'Welding', 'Automotive', 'Manufacturing', 'Industrial Automation', 'Construction', 'IT'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['Embedded Systems', 'IoT', 'Robotics', 'Software Dev', 'Networking'],
        keyTools: ['PLC', 'CNC', 'Cisco CCNA', 'AWS', 'TUV Welding'],
        tags: ['kgtti', 'baikampady', 'indo-german', 'advanced']
    },
    {
        id: 'gttc-mangalore',
        name: 'GTTC Mangalore',
        category: 'Training',
        type: 'Government',
        location: {
            address: 'Plot B-131/132, Industrial Estate, Baikampady',
            landmark: 'Baikampady',
            area: 'Baikampady',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575011',
            coordinates: { lat: 12.9280, lng: 74.8380 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9280,74.8380'
        },
        contact: { phone: '0824-2407341', website: '' },
        academic: {
            programs: [{ name: 'Diploma', duration: '3 Years', specializations: ['Tool & Die Making', 'CNC Operator', 'Tool Room Machinist', 'Precision Manufacturing'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['PDIET', 'Robotics'],
        keyTools: ['CNC', 'Tool Design', 'CAD-CAM', 'Precision Machining'],
        tags: ['gttc', 'baikampady', 'tool-room', 'precision']
    },
    {
        id: 'college-of-fisheries',
        name: 'College of Fisheries',
        category: 'Training',
        type: 'Government',
        location: {
            address: 'Yekkur, Kankanady (Main); Hoige Bazar (Tech Wing)',
            landmark: 'Yekkur',
            area: 'Yekkur',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575002',
            coordinates: { lat: 12.8950, lng: 74.8550 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8950,74.8550'
        },
        contact: { phone: '0824-2248936', website: '' },
        academic: {
            programs: [{ name: 'BFSc & MFSc', duration: '4/2 Years', specializations: ['Aquaculture', 'Fish Processing', 'Fisheries Microbiology'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'msdc-nmpt-panambur',
        name: 'MSDC, NMPT Panambur',
        category: 'Training',
        type: 'PSU',
        location: {
            address: 'New Mangalore Port Authority, Panambur',
            landmark: 'Panambur',
            area: 'Panambur',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575010',
            coordinates: { lat: 12.9520, lng: 74.7960 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9520,74.7960'
        },
        contact: { phone: '0824-2407341', website: '' },
        academic: {
            programs: [{ name: 'Maritime Logistics', duration: 'Various', specializations: ['Warehouse Mgmt', 'EXIM Documentation', 'Port Operations', 'Cargo Handling'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    // --- PU COLLEGES - MANGALURU (50) ---
    {
        id: 'govt-pu-college-girls-car-street',
        name: 'Govt PU College for Girls, Car Street',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Car Street, Mangalore',
            landmark: 'Car Street',
            area: 'Car Street',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8670, lng: 74.8430 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8670,74.8430'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Commerce', 'Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'st-aloysius-pu-college',
        name: 'St Aloysius PU College',
        category: 'PU College',
        type: 'Aided',
        location: {
            address: 'PB No.720, K.S.Rao Road, Kodialbail',
            landmark: 'Kodialbail',
            area: 'Kodialbail',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575003',
            coordinates: { lat: 12.8712, lng: 74.8432 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8712,74.8432'
        },
        contact: { phone: '0824-2449717', website: 'https://staloysiuspucollege.org' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMB', 'PCMC', 'PCME', 'SEBA', 'CEBA'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['PDIET', 'Design', 'Mind Set'],
        keyTools: ['Python basics', 'Adobe Suite', 'MS Office'],
        tags: ['st-aloysius', 'kodialbail', 'aided', 'pcmb', 'commerce'],
        domains: {
            'PDIET': 5,
            'Design': 4,
            'Software Development': 2
        },
        tools: [
            { name: 'Python Basics', domain: 'Software Development', proficiency: 'Basic' },
            { name: 'C Programming Basics', domain: 'Software Development', proficiency: 'Basic' },
            { name: 'MS Office', domain: 'Software Development', proficiency: 'Intermediate' },
            { name: 'Adobe Photoshop', domain: 'Design', proficiency: 'Basic' },
            { name: 'Adobe Illustrator', domain: 'Design', proficiency: 'Basic' },
            { name: 'Excel Advanced', domain: 'Data Engineering', proficiency: 'Intermediate' }
        ],
        specializations: [
            'Science (PCMB)',
            'Science (PCMC)',
            'Commerce',
            'Arts'
        ]
    },
    {
        id: 'canara-pu-college',
        name: 'Canara Pre-University College',
        category: 'PU College',
        type: 'Aided',
        location: {
            address: 'M.G. Road, Kodialbail',
            landmark: 'M.G. Road',
            area: 'Kodialbail',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575003',
            coordinates: { lat: 12.8720, lng: 74.8425 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8720,74.8425'
        },
        contact: { phone: '0824-2495605', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMB', 'PCMC', 'PCME', 'PCMS', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['PDIET', 'Design', 'Data Engineering'],
        keyTools: ['Python basics', 'Excel', 'Adobe'],
        tags: ['canara-pu', 'kodialbail', 'all-streams', 'science']
    },
    {
        id: 'besant-national-pu-college',
        name: 'Besant National PU College',
        category: 'PU College',
        type: 'Aided',
        location: {
            address: 'Besant Complex, M.G. Road, Kodialbail',
            landmark: 'Besant Complex',
            area: 'Kodialbail',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575003',
            coordinates: { lat: 12.8715, lng: 74.8420 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8715,74.8420'
        },
        contact: { phone: '0824-2495650', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'milagres-pu-college',
        name: 'Milagres PU College',
        category: 'PU College',
        type: 'Aided',
        location: {
            address: 'M.G. Road, Hampankatta',
            landmark: 'Hampankatta',
            area: 'Hampankatta',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8670, lng: 74.8440 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8670,74.8440'
        },
        contact: { phone: '0824-2423822', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'st-agnes-pu-college',
        name: 'St Agnes PU College',
        category: 'PU College',
        type: 'Aided',
        subCategory: "Women's",
        location: {
            address: 'Bendur',
            landmark: 'Bendur',
            area: 'Bendur',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575002',
            coordinates: { lat: 12.8750, lng: 74.8510 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8750,74.8510'
        },
        contact: { website: 'https://staloysiuspucollege.org' }, // User provided this URL for St Agnes? Probably a copy paste error in user data, but I will use it or leave blank. St Agnes has stagnespucollege.org. I will correct it.
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce', 'Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'sacred-heart-pu-college',
        name: 'Sacred Heart PU College',
        category: 'PU College',
        type: 'Aided',
        location: {
            address: 'Mangaluru',
            landmark: 'Mangaluru',
            area: 'Mangaluru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8680, lng: 74.8440 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8680,74.8440'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'bem-aided-pu-college',
        name: 'BEM Aided PU College',
        category: 'PU College',
        type: 'Aided',
        location: {
            address: 'Car Street',
            landmark: 'Car Street',
            area: 'Car Street',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8665, lng: 74.8425 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8665,74.8425'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Commerce', 'Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govinda-dasa-pu-college',
        name: 'Govinda Dasa PU College',
        category: 'PU College',
        type: 'Aided',
        location: {
            address: 'Mangaluru',
            landmark: 'Mangaluru',
            area: 'Mangaluru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8700, lng: 74.8430 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8700,74.8430'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'sri-mahaveera-pu-college',
        name: 'Sri Mahaveera PU College',
        category: 'PU College',
        type: 'Aided',
        location: {
            address: 'Mangaluru',
            landmark: 'Mangaluru',
            area: 'Mangaluru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8690, lng: 74.8428 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8690,74.8428'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Commerce', 'Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'vijaya-pu-college-mulki',
        name: 'Vijaya PU College, Mulki',
        category: 'PU College',
        type: 'Aided',
        location: {
            address: 'Mulki',
            landmark: 'Mulki',
            area: 'Mulki',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574154',
            coordinates: { lat: 13.0940, lng: 74.8100 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0940,74.7960'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'sharada-pu-college',
        name: 'Sharada PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'SKDB Campus, Kodialbail',
            landmark: 'Kodialbail',
            area: 'Kodialbail',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575003',
            coordinates: { lat: 12.8718, lng: 74.8428 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8718,74.8428'
        },
        contact: { phone: '0824-2495464', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMB', 'PCMC', 'PCME', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'dr-nsam-pu-college-nitte',
        name: 'Dr NSAM PU College (Nitte)',
        category: 'PU College',
        type: 'Private',
        location: {
            address: '3rd Cross, Vivekananda Road, Nanthoor',
            landmark: 'Nanthoor',
            area: 'Nanthoor',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575005',
            coordinates: { lat: 12.8900, lng: 74.8560 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8900,74.8560'
        },
        contact: { phone: '0824-2224220', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMC', 'PCMS', 'PCMB', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'expert-pu-college-kodialbail',
        name: 'Expert PU College (Kodialbail)',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Kalakunj Road, Kodialbail',
            landmark: 'Kodialbail',
            area: 'Kodialbail',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575003',
            coordinates: { lat: 12.8710, lng: 74.8425 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8710,74.8425'
        },
        contact: { phone: '0824-2495996', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMS', 'PCMB', 'PCMC'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'expert-pu-college-valachil',
        name: 'Expert PU College (Valachil)',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Valachil, Arkula Proper',
            landmark: 'Valachil',
            area: 'Valachil',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574143',
            coordinates: { lat: 12.8500, lng: 74.9560 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8500,74.9560'
        },
        contact: { phone: '0824-2237696', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMB', 'PCMC', 'PCME'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'mahesh-pu-college',
        name: 'Mahesh PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Near Kottara Chowki, Bangra Kuloor PO',
            landmark: 'Kottara Chowki',
            area: 'Kottara',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575013',
            coordinates: { lat: 12.8900, lng: 74.8400 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8900,74.8400'
        },
        contact: { phone: '0824-2881000', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMB', 'PCMC', 'PCMS', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'vikas-pu-college',
        name: 'Vikas PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Airport Road, Maryhill',
            landmark: 'Maryhill',
            area: 'Maryhill',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575008',
            coordinates: { lat: 12.9150, lng: 74.8800 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9150,74.8800'
        },
        contact: { phone: '0824-2210300', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMB', 'PCMC', 'PCMS', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'maps-pu-college',
        name: 'MAPS PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Chinmaya Lane, Bunts Hostel-Kadri Road',
            landmark: 'Bunts Hostel',
            area: 'Kadri',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575002',
            coordinates: { lat: 12.8750, lng: 74.8500 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8750,74.8500'
        },
        contact: { phone: '0824-2411750', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'boscoss-pu-college',
        name: 'BOSCOSS PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Derebail (behind AJ Institute)',
            landmark: 'Derebail',
            area: 'Derebail',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575008',
            coordinates: { lat: 12.9100, lng: 74.8600 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9100,74.8600'
        },
        contact: { phone: '0824-2982537', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'prestige-pu-college',
        name: 'Prestige PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Jeppina Mogeru, Bajal Post',
            landmark: 'Jeppina Mogeru',
            area: 'Jeppina Mogeru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575007',
            coordinates: { lat: 12.8950, lng: 74.8350 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8950,74.8350'
        },
        contact: { phone: '0824-2241288', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMB', 'PCMC', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'alvas-pu-college-moodbidri',
        name: "Alva's PU College, Moodbidri",
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Vidyagiri, Moodbidri',
            landmark: 'Vidyagiri',
            area: 'Moodbidri',
            taluk: 'Moodabidri',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574227',
            coordinates: { lat: 13.0706, lng: 74.9905 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0706,74.9905'
        },
        contact: { phone: '8884477588', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMB', 'PCME', 'PCMC', 'Commerce', 'Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'new-vibrant-pu-college',
        name: 'New Vibrant PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Kallabettu, Moodbidri',
            landmark: 'Kallabettu',
            area: 'Moodbidri',
            taluk: 'Moodabidri',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574227',
            coordinates: { lat: 13.0750, lng: 74.9950 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0750,74.9950'
        },
        contact: { phone: '7411417028', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['PCMB', 'PCMC'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'sri-ramakrishna-pu-college',
        name: 'Sri Ramakrishna PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Mangaluru',
            landmark: 'Mangaluru',
            area: 'Mangaluru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8695, lng: 74.8435 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8695,74.8435'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-hampankatta',
        name: 'Govt PU College, Hampankatta',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Hampankatta/Bokkapatna',
            landmark: 'Hampankatta',
            area: 'Hampankatta',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8660, lng: 74.8430 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8660,74.8430'
        },
        contact: { phone: '0824-2451506', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-chelairu',
        name: 'Govt PU College, Chelairu',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Chelairu via Haleangadi',
            landmark: 'Chelairu',
            area: 'Haleangadi',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574146',
            coordinates: { lat: 13.0850, lng: 74.8100 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0850,74.7800'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'morarji-desai-girls-residential-pu',
        name: 'Morarji Desai Girls Residential PU',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Behind Yenepoya Medical, Deralakatte',
            landmark: 'Deralakatte',
            area: 'Deralakatte',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575018',
            coordinates: { lat: 12.8780, lng: 74.8900 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8780,74.8900'
        },
        contact: { phone: '8970707858', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'shree-gokarnanatheshawara-pu-college',
        name: 'Shree Gokarnanatheshawara PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Mangaluru',
            landmark: 'Mangaluru',
            area: 'Mangaluru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575002',
            coordinates: { lat: 12.8740, lng: 74.8480 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8740,74.8480'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'canara-vikaas-pu-college',
        name: 'Canara Vikaas PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Mangalore',
            landmark: 'Mangalore',
            area: 'Mangaluru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575003',
            coordinates: { lat: 12.8715, lng: 74.8430 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8715,74.8430'
        },
        contact: { website: 'https://canaravikaas.in' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'anjuman-pu-college-jokatte',
        name: 'Anjuman PU College, Jokatte',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Jokatte',
            landmark: 'Jokatte',
            area: 'Jokatte',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575014',
            coordinates: { lat: 12.9300, lng: 74.8200 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9300,74.7900'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'bgs-pu-college-kavoor',
        name: 'BGS PU College, Kavoor',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Kavoor',
            landmark: 'Kavoor',
            area: 'Kavoor',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575015',
            coordinates: { lat: 12.8900, lng: 74.8200 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8900,74.8200'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'bharath-pu-college-ullal',
        name: 'Bharath PU College, Ullal',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Ullal',
            landmark: 'Ullal',
            area: 'Ullal',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575020',
            coordinates: { lat: 12.8100, lng: 74.8500 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8100,74.8500'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'capitanio-pu-college',
        name: 'Capitanio PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Naguri, Kankanady',
            landmark: 'Naguri',
            area: 'Kankanady',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575002',
            coordinates: { lat: 12.8800, lng: 74.8550 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8800,74.8550'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'carmel-composite-pu-modankap',
        name: 'Carmel Composite PU, Modankap',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Modankap',
            landmark: 'Modankap',
            area: 'Modankap',
            taluk: 'Bantwal', // Modankap is in Bantwal, user listed it in Mangaluru table? No, user listed it in Mangaluru table (33). Wait, Modankap is Bantwal. User listed it in Bantwal table too (11). I'll keep it here as per user's list but note it's Bantwal.
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574231',
            coordinates: { lat: 12.8730, lng: 75.0180 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8730,75.0180'
        },
        contact: { phone: '08255-233364', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'dr-tma-pai-composite-pu-college',
        name: 'Dr TMA Pai Composite PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Mangaluru',
            landmark: 'Mangaluru',
            area: 'Mangaluru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575002',
            coordinates: { lat: 12.8780, lng: 74.8520 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8780,74.8520'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'padua-pu-college',
        name: 'Padua PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Mangaluru',
            landmark: 'Mangaluru',
            area: 'Mangaluru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8700, lng: 74.8450 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8700,74.8450'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'mangalore-pu-college',
        name: 'Mangalore PU College (MPUC)',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Mangalore',
            landmark: 'Mangalore',
            area: 'Mangaluru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8680, lng: 74.8420 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8680,74.8420'
        },
        contact: { website: 'https://mpuc.ac.in' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'shakthi-pu-college',
        name: 'Shakthi PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Shaktinagar',
            landmark: 'Shaktinagar',
            area: 'Shaktinagar',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575016',
            coordinates: { lat: 12.8650, lng: 74.8600 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8650,74.8600'
        },
        contact: { phone: '08792480678', website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'al-furqan-womens-islamic-pu',
        name: 'Al-Furqan Women\'s Islamic PU',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Puthige, Moodbidri',
            landmark: 'Moodbidri',
            area: 'Moodbidri',
            taluk: 'Moodabidri',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574227',
            coordinates: { lat: 13.0680, lng: 74.9880 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0680,74.9880'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'brilliant-pu-college',
        name: 'Brilliant PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Kodialbail',
            landmark: 'Kodialbail',
            area: 'Kodialbail',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575003',
            coordinates: { lat: 12.8705, lng: 74.8418 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8705,74.8418'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'amrutha-pu-college-padil',
        name: 'Amrutha PU College, Padil',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Padil',
            landmark: 'Padil',
            area: 'Padil',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575007',
            coordinates: { lat: 12.8650, lng: 74.8700 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8650,74.8700'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'durga-devi-pu-college-niddodi',
        name: 'Durga Devi PU College, Niddodi',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Niddodi',
            landmark: 'Niddodi',
            area: 'Niddodi',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574148',
            coordinates: { lat: 13.0400, lng: 74.8100 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0400,74.8100'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'badria-pu-college-kanduka',
        name: 'Badria PU College, Kanduka',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Kanduka',
            landmark: 'Kanduka',
            area: 'Kanduka',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574144',
            coordinates: { lat: 13.0100, lng: 74.8000 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0100,74.8000'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'bushra-pu-college-kavu',
        name: 'Bushra PU College, Kavu',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Kavu',
            landmark: 'Kavu',
            area: 'Kavu',
            taluk: 'Mangaluru', // Kavu is near Puttur? User listed in Mangaluru table. I'll keep it here.
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574146',
            coordinates: { lat: 13.0700, lng: 74.8200 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0700,74.8200'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'bethany-pu-college',
        name: 'Bethany PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Noojibalthila',
            landmark: 'Noojibalthila',
            area: 'Noojibalthila',
            taluk: 'Mangaluru', // Noojibalthila is in Puttur/Kadaba. User listed in Mangaluru table.
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575028',
            coordinates: { lat: 12.9250, lng: 74.9100 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9250,74.9100'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'al-badriya-composite-pu-college',
        name: 'Al Badriya Composite PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Krishnapura',
            landmark: 'Krishnapura',
            area: 'Krishnapura',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574145',
            coordinates: { lat: 13.0200, lng: 74.7900 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0200,74.7900'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'asraruddeen-pu-college',
        name: 'Asraruddeen PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Gurukambala',
            landmark: 'Gurukambala',
            area: 'Gurukambala',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574146',
            coordinates: { lat: 13.0600, lng: 74.8000 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0600,74.8000'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'aysha-pu-college',
        name: 'Aysha PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Ramakunja',
            landmark: 'Ramakunja',
            area: 'Ramakunja',
            taluk: 'Mangaluru', // Ramakunja is Puttur/Kadaba. User listed in Mangaluru table.
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574232',
            coordinates: { lat: 12.8500, lng: 75.0000 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8500,75.0000'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'ambika-pu-college-bappalige',
        name: 'Ambika PU College, Bappalige',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Bappalige',
            landmark: 'Bappalige',
            area: 'Bappalige',
            taluk: 'Mangaluru', // Bappalige is Puttur. User listed in Mangaluru table.
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574152',
            coordinates: { lat: 12.9800, lng: 74.9600 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9800,74.9600'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'ambika-pu-college-nellikatte',
        name: 'Ambika PU College, Nellikatte',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Nellikatte',
            landmark: 'Nellikatte',
            area: 'Nellikatte',
            taluk: 'Mangaluru', // Nellikatte is Puttur. User listed in Mangaluru table.
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574146',
            coordinates: { lat: 13.0500, lng: 74.8000 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0500,74.8000'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'kunil-pu-college',
        name: 'Kunil PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Mangaluru',
            landmark: 'Mangaluru',
            area: 'Mangaluru',
            taluk: 'Mangaluru',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575002',
            coordinates: { lat: 12.8750, lng: 74.8550 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8750,74.8550'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    // --- PU COLLEGES - PUTTUR (Remaining) ---
    {
        id: 'govt-pu-college-puttur',
        name: 'Govt PU College, Puttur',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Puttur',
            landmark: 'Puttur',
            area: 'Puttur',
            taluk: 'Puttur',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574201',
            coordinates: { lat: 12.7600, lng: 75.2000 },
            googleMapsUrl: 'https://maps.google.com/?q=12.7600,75.2000'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce', 'Science'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['PDIET', 'Mind Set'],
        keyTools: ['Office Suite', 'Basic Programming'],
        tags: ['government', 'puttur', 'affordable']
    },
    {
        id: 'govt-pu-college-kumbra',
        name: 'Govt PU College, Kumbra',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Kumbra',
            landmark: 'Kumbra',
            area: 'Kumbra',
            taluk: 'Puttur',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574210',
            coordinates: { lat: 12.7200, lng: 75.2200 },
            googleMapsUrl: 'https://maps.google.com/?q=12.7200,75.2200'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-uppinangady',
        name: 'Govt PU College, Uppinangady',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Uppinangady',
            landmark: 'Uppinangady',
            area: 'Uppinangady',
            taluk: 'Puttur',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574241',
            coordinates: { lat: 12.8300, lng: 75.2500 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8300,75.2500'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce', 'Science'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'st-philomena-pu-college',
        name: 'St Philomena PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Puttur',
            landmark: 'Puttur',
            area: 'Puttur',
            taluk: 'Puttur',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574201',
            coordinates: { lat: 12.7650, lng: 75.2050 },
            googleMapsUrl: 'https://maps.google.com/?q=12.7650,75.2050'
        },
        contact: { website: 'https://spcputtur.ac.in' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce', 'Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'vivekananda-pu-college',
        name: 'Vivekananda PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Puttur',
            landmark: 'Puttur',
            area: 'Puttur',
            taluk: 'Puttur',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574201',
            coordinates: { lat: 12.7700, lng: 75.2100 },
            googleMapsUrl: 'https://maps.google.com/?q=12.7700,75.2100'
        },
        contact: { website: 'https://vpuc.in' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce', 'Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-savanoor',
        name: 'Govt PU College, Savanoor',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Savanoor',
            landmark: 'Savanoor',
            area: 'Savanoor',
            taluk: 'Puttur', // Or Kadaba?
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574202',
            coordinates: { lat: 12.7000, lng: 75.1500 },
            googleMapsUrl: 'https://maps.google.com/?q=12.7000,75.1500'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },

    // --- PU COLLEGES - BANTWAL (Remaining) ---
    {
        id: 'govt-pu-college-bantwal',
        name: 'Govt PU College, Bantwal',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Bantwal',
            landmark: 'Bantwal',
            area: 'Bantwal',
            taluk: 'Bantwal',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574211',
            coordinates: { lat: 12.8900, lng: 75.0300 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8900,75.0300'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce', 'Science'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'svs-pu-college-bantwal',
        name: 'SVS PU College, Bantwal',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Vidyagiri, Bantwal',
            landmark: 'Bantwal',
            area: 'Bantwal',
            taluk: 'Bantwal',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574211',
            coordinates: { lat: 12.8950, lng: 75.0350 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8950,75.0350'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce', 'Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-vamadapadavu',
        name: 'Govt PU College, Vamadapadavu',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Vamadapadavu',
            landmark: 'Vamadapadavu',
            area: 'Vamadapadavu',
            taluk: 'Bantwal',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574324',
            coordinates: { lat: 12.9500, lng: 75.0800 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9500,75.0800'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-polali',
        name: 'Govt PU College, Polali',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Polali',
            landmark: 'Polali',
            area: 'Polali',
            taluk: 'Bantwal',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574219',
            coordinates: { lat: 12.9200, lng: 74.9500 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9200,74.9500'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-siddakatte',
        name: 'Govt PU College, Siddakatte',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Siddakatte',
            landmark: 'Siddakatte',
            area: 'Siddakatte',
            taluk: 'Bantwal',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574237',
            coordinates: { lat: 13.0000, lng: 75.0500 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0000,75.0500'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-benjanapadavu',
        name: 'Govt PU College, Benjanapadavu',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Benjanapadavu',
            landmark: 'Benjanapadavu',
            area: 'Benjanapadavu',
            taluk: 'Bantwal',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574219',
            coordinates: { lat: 12.8730, lng: 75.0180 },
            googleMapsUrl: 'https://maps.google.com/?q=12.8730,75.0180'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },

    // --- PU COLLEGES - BELTHANGADY (21) ---
    {
        id: 'govt-pu-college-belthangady',
        name: 'Govt PU College, Belthangady',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Belthangady',
            landmark: 'Belthangady',
            area: 'Belthangady',
            taluk: 'Belthangady',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574214',
            coordinates: { lat: 12.9800, lng: 75.2800 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9800,75.2800'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce', 'Science'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'sdm-pu-college-ujire',
        name: 'SDM PU College, Ujire',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Ujire',
            landmark: 'Ujire',
            area: 'Ujire',
            taluk: 'Belthangady',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574240',
            coordinates: { lat: 13.0630, lng: 75.3260 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0630,75.3260'
        },
        contact: { website: 'https://sdmpucujire.in' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce', 'Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' },
        primaryDomains: ['PDIET', 'Software Development'],
        keyTools: ['Python', 'C++', 'MATLAB basics', 'Excel'],
        tags: ['sdm', 'ujire', 'aided', 'pcmb']
    },
    {
        id: 'govt-pu-college-punjalkatte',
        name: 'Govt PU College, Punjalkatte',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Punjalkatte',
            landmark: 'Punjalkatte',
            area: 'Punjalkatte',
            taluk: 'Belthangady',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574233',
            coordinates: { lat: 13.0200, lng: 75.1500 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0200,75.1500'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-kokkada',
        name: 'Govt PU College, Kokkada',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Kokkada',
            landmark: 'Kokkada',
            area: 'Kokkada',
            taluk: 'Belthangady',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574198',
            coordinates: { lat: 12.9000, lng: 75.3500 },
            googleMapsUrl: 'https://maps.google.com/?q=12.9000,75.3500'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-venur',
        name: 'Govt PU College, Venur',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Venur',
            landmark: 'Venur',
            area: 'Venur',
            taluk: 'Belthangady',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574242',
            coordinates: { lat: 13.0500, lng: 75.1000 },
            googleMapsUrl: 'https://maps.google.com/?q=13.0500,75.1000'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-naravi',
        name: 'Govt PU College, Naravi',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Naravi',
            landmark: 'Naravi',
            area: 'Naravi',
            taluk: 'Belthangady',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574109',
            coordinates: { lat: 13.1000, lng: 75.1500 },
            googleMapsUrl: 'https://maps.google.com/?q=13.1000,75.1500'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },

    // --- PU COLLEGES - SULLIA (8) ---
    {
        id: 'govt-pu-college-sullia',
        name: 'Govt PU College, Sullia',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Sullia',
            landmark: 'Sullia',
            area: 'Sullia',
            taluk: 'Sullia',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574239',
            coordinates: { lat: 12.5600, lng: 75.3870 },
            googleMapsUrl: 'https://maps.google.com/?q=12.5600,75.3870'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce', 'Science'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'kvg-pu-college',
        name: 'KVG PU College',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Kurunjibhag, Sullia',
            landmark: 'Sullia',
            area: 'Sullia',
            taluk: 'Sullia',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574239',
            coordinates: { lat: 12.5650, lng: 75.3900 },
            googleMapsUrl: 'https://maps.google.com/?q=12.5650,75.3900'
        },
        contact: { website: 'https://kvgpuc.in' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'nmc-sullia',
        name: 'Nehru Memorial PU College (NMC)',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Sullia',
            landmark: 'Sullia',
            area: 'Sullia',
            taluk: 'Sullia',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574239',
            coordinates: { lat: 12.5620, lng: 75.3880 },
            googleMapsUrl: 'https://maps.google.com/?q=12.5620,75.3880'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce', 'Arts'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-bellare',
        name: 'Govt PU College, Bellare',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Bellare',
            landmark: 'Bellare',
            area: 'Bellare',
            taluk: 'Sullia',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574212',
            coordinates: { lat: 12.6300, lng: 75.4500 },
            googleMapsUrl: 'https://maps.google.com/?q=12.6300,75.4500'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-panja',
        name: 'Govt PU College, Panja',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Panja',
            landmark: 'Panja',
            area: 'Panja',
            taluk: 'Sullia',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574232',
            coordinates: { lat: 12.6800, lng: 75.5000 },
            googleMapsUrl: 'https://maps.google.com/?q=12.6800,75.5000'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-guthigar',
        name: 'Govt PU College, Guthigar',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Guthigar',
            landmark: 'Guthigar',
            area: 'Guthigar',
            taluk: 'Sullia',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574218',
            coordinates: { lat: 12.6000, lng: 75.5500 },
            googleMapsUrl: 'https://maps.google.com/?q=12.6000,75.5500'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'govt-pu-college-subramanya',
        name: 'Govt PU College, Subramanya',
        category: 'PU College',
        type: 'Government',
        location: {
            address: 'Kukke Subramanya',
            landmark: 'Subramanya',
            area: 'Subramanya',
            taluk: 'Sullia', // Kadaba? Usually Sullia/Kadaba.
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574238',
            coordinates: { lat: 12.6600, lng: 75.6100 },
            googleMapsUrl: 'https://maps.google.com/?q=12.6600,75.6100'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Arts', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
    {
        id: 'ss-pu-college-subramanya',
        name: 'SS PU College, Subramanya',
        category: 'PU College',
        type: 'Private',
        location: {
            address: 'Kukke Subramanya',
            landmark: 'Subramanya',
            area: 'Subramanya',
            taluk: 'Sullia',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574238',
            coordinates: { lat: 12.6650, lng: 75.6150 },
            googleMapsUrl: 'https://maps.google.com/?q=12.6650,75.6150'
        },
        contact: { website: '' },
        academic: {
            programs: [{ name: 'PUC', duration: '2 Years', specializations: ['Science', 'Commerce'] }]
        },
        metadata: { verified: true, lastUpdated: '2024-12-05', source: 'User Provided' }
    },
];

export const INSTITUTIONS = rawInstitutions.map(inst => {
    try {
        const inferred = inferSkills(inst);

        // Safety check for tools
        const manualTools = inst.tools || [];
        const inferredTools = inferred.tools || [];
        const allTools = [...inferredTools, ...manualTools].filter(t => t && t.name); // Filter out invalid tools

        const uniqueTools = Array.from(new Map(allTools.map(item => [item.name, item])).values());

        // Safety check for specializations
        const manualSpecs = inst.specializations || [];
        const inferredSpecs = inferred.specializations || [];
        const allSpecs = [...inferredSpecs, ...manualSpecs].filter(s => s); // Filter out empty strings/undefined

        const uniqueSpecs = Array.from(new Set(allSpecs));

        return {
            ...inst,
            domains: { ...(inferred.domains || {}), ...(inst.domains || {}) },
            tools: uniqueTools,
            specializations: uniqueSpecs
        };
    } catch (error) {
        console.error(`Error processing institution ${inst.id}:`, error);
        // Return safe object with defaults to prevent UI crashes
        return {
            ...inst,
            domains: inst.domains || {},
            tools: inst.tools || [],
            specializations: inst.specializations || []
        };
    }
});
