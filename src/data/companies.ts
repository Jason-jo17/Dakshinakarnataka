import type { Institution } from '../types/institution';

export const COMPANIES: Institution[] = [
    {
        id: 'mrpl',
        name: 'Mangalore Refinery and Petrochemicals Ltd (MRPL)',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Kuthethoor / Katipalla (Via Surathkal)',
            landmark: 'Via Surathkal',
            area: 'Surathkal',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575030',
            coordinates: { lat: 12.9937, lng: 74.8256 }, // Approx
            googleMapsUrl: ''
        },
        contact: { website: '' },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        academic: {
            programs: [
                { name: 'Graduate Apprentice Trainee (GAT)', duration: '1 year', seats: 50 },
                { name: 'Executive Trainee', duration: 'Permanent', seats: 20 }
            ]
        },
        domains: {
            'Chemical Engineering': 10,
            'Process Safety': 9,
            'Polymer Science': 8,
            'Embedded Systems': 7 // DCS/SCADA
        },
        tools: [
            { name: 'DCS', domain: 'Embedded Systems', category: 'Automation', proficiency: 'Advanced' },
            { name: 'SCADA', domain: 'Embedded Systems', category: 'Automation', proficiency: 'Advanced' },
            { name: 'SAP', domain: 'Business', category: 'ERP', proficiency: 'Intermediate' },
            { name: 'Process Simulation', domain: 'Chemical Engineering', category: 'Simulation', proficiency: 'Advanced' }
        ],
        coe: true,
        tags: ['Oil Refining', 'Petrochemicals', 'PSU']
    },
    {
        id: 'mcf',
        name: 'Mangalore Chemicals & Fertilizers (MCF)',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Panambur (Opposite New Mangalore Port)',
            landmark: 'Opposite New Mangalore Port',
            area: 'Panambur',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575010',
            coordinates: { lat: 12.9437, lng: 74.8156 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Production Engineer Trainee', duration: '1 year', seats: 15 },
                { name: 'Diploma Trainee', duration: '1 year', seats: 20 }
            ]
        },
        domains: {
            'Chemical Engineering': 9,
            'Process Safety': 9,
            'Embedded Systems': 7
        },
        tools: [
            { name: 'PLC', domain: 'Embedded Systems', category: 'Automation', proficiency: 'Intermediate' },
            { name: 'VFDs', domain: 'Embedded Systems', category: 'Automation', proficiency: 'Intermediate' },
            { name: 'Ammonia Process Tech', domain: 'Chemical Engineering', category: 'Chemical', proficiency: 'Advanced' }
        ],
        tags: ['Fertilizers', 'Chemicals']
    },
    {
        id: 'infosys-mudipu',
        name: 'Infosys (Mudipu)',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Mudipu (SEZ Campus)',
            landmark: 'SEZ Campus',
            area: 'Mudipu',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574153',
            coordinates: { lat: 12.8237, lng: 74.9856 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Systems Engineer', duration: 'Permanent', seats: 500 },
                { name: 'Operations Executive', duration: 'Permanent', seats: 200 }
            ]
        },
        domains: {
            'Software Development': 10,
            'Business': 8,
            'AI': 7
        },
        tools: [
            { name: 'Java', domain: 'Software Development', category: 'Development', proficiency: 'Advanced' },
            { name: 'Python', domain: 'Software Development', category: 'Development', proficiency: 'Advanced' },
            { name: 'Angular', domain: 'Software Development', category: 'Web', proficiency: 'Advanced' },
            { name: 'Finacle', domain: 'Business', category: 'Banking', proficiency: 'Advanced' }
        ],
        coe: true,
        tags: ['IT Services', 'Consulting', 'Banking']
    },
    {
        id: 'infosys-kottara',
        name: 'Infosys (Kottara)',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Kottara (City Campus)',
            landmark: 'City Campus',
            area: 'Kottara',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575006',
            coordinates: { lat: 12.8937, lng: 74.8356 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Systems Engineer', duration: 'Permanent', seats: 100 }
            ]
        },
        domains: {
            'Software Development': 9,
            'Business': 7
        },
        tools: [
            { name: 'Java', domain: 'Software Development', category: 'Development', proficiency: 'Advanced' },
            { name: 'Python', domain: 'Software Development', category: 'Development', proficiency: 'Advanced' }
        ],
        tags: ['IT Services']
    },
    {
        id: 'syngene',
        name: 'Syngene International',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Plot IP-38, Mangalore SEZ (MSEZ), Bajpe',
            landmark: 'MSEZ',
            area: 'Bajpe',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574142',
            coordinates: { lat: 12.9637, lng: 74.8856 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Research Associate', duration: 'Permanent', seats: 30 },
                { name: 'QC Analyst', duration: 'Permanent', seats: 20 }
            ]
        },
        domains: {
            'Biotechnology': 10,
            'Healthcare': 9,
            'Chemical Engineering': 8
        },
        tools: [
            { name: 'HPLC', domain: 'Biotechnology', category: 'Lab', proficiency: 'Advanced' },
            { name: 'GC-MS', domain: 'Biotechnology', category: 'Lab', proficiency: 'Advanced' },
            { name: 'LIMS', domain: 'Biotechnology', category: 'Lab', proficiency: 'Intermediate' }
        ],
        coe: true,
        tags: ['Pharma', 'Biotech', 'CRAMS']
    },
    {
        id: 'diya-systems',
        name: 'Diya Systems (GlowTouch)',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Maryhill, Kavoor (Near Helipad)',
            landmark: 'Near Helipad',
            area: 'Kavoor',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575015',
            coordinates: { lat: 12.9237, lng: 74.8456 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Technical Support Engineer', duration: 'Permanent', seats: 100 },
                { name: 'Software Developer', duration: 'Permanent', seats: 50 }
            ]
        },
        domains: {
            'Software Development': 8,
            'Networking': 8,
            'Business': 7
        },
        tools: [
            { name: 'LAMP Stack', domain: 'Software Development', category: 'Web', proficiency: 'Advanced' },
            { name: 'Windows Server', domain: 'Networking', category: 'OS', proficiency: 'Intermediate' },
            { name: 'Salesforce', domain: 'Business', category: 'CRM', proficiency: 'Intermediate' }
        ],
        tags: ['Tech Support', 'BPO', 'App Development']
    },
    {
        id: 'robosoft',
        name: 'Robosoft Technologies',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Santhekatte, Udupi (North of Mangalore)',
            landmark: 'Santhekatte',
            area: 'Udupi',
            taluk: 'Udupi',
            district: 'Dakshina Kannada', // Technically Udupi but included as per request
            state: 'Karnataka',
            pincode: '576105',
            coordinates: { lat: 13.3637, lng: 74.7656 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Trainee Software Engineer', duration: 'Permanent', seats: 50 },
                { name: 'UI/UX Designer', duration: 'Permanent', seats: 10 }
            ]
        },
        domains: {
            'Software Development': 10,
            'Design': 9,
            'AI': 7
        },
        tools: [
            { name: 'Swift', domain: 'Software Development', category: 'Mobile', proficiency: 'Advanced' },
            { name: 'Kotlin', domain: 'Software Development', category: 'Mobile', proficiency: 'Advanced' },
            { name: 'Web 3.0', domain: 'Software Development', category: 'Web', proficiency: 'Intermediate' },
            { name: 'Blockchain', domain: 'Software Development', category: 'Tech', proficiency: 'Intermediate' }
        ],
        coe: true,
        tags: ['Product Engineering', 'Mobile App']
    },
    {
        id: 'novigo',
        name: 'Novigo Solutions',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Karuna Pride, Falnir (Mother Teresa Road)',
            landmark: 'Mother Teresa Road',
            area: 'Falnir',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8637, lng: 74.8456 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'RPA Developer', duration: 'Permanent', seats: 20 },
                { name: 'SharePoint Engineer', duration: 'Permanent', seats: 15 }
            ]
        },
        domains: {
            'Software Development': 9,
            'AI': 8, // RPA
            'Business': 7
        },
        tools: [
            { name: 'UiPath', domain: 'AI', category: 'RPA', proficiency: 'Advanced' },
            { name: 'Power Platform', domain: 'Software Development', category: 'Low-Code', proficiency: 'Intermediate' },
            { name: 'Azure', domain: 'Software Development', category: 'Cloud', proficiency: 'Intermediate' }
        ],
        tags: ['RPA', 'Cloud', 'Automation']
    },
    {
        id: 'campco',
        name: 'Campco Chocolate Factory',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Kemminje, Puttur',
            landmark: 'Kemminje',
            area: 'Puttur',
            taluk: 'Puttur',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574201',
            coordinates: { lat: 12.7637, lng: 75.2056 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Food Technologist', duration: 'Permanent', seats: 10 },
                { name: 'Maintenance Engineer', duration: 'Permanent', seats: 5 }
            ]
        },
        domains: {
            'Agriculture Tech': 9,
            'Biotechnology': 7, // Food Tech
            'Embedded Systems': 6 // Machinery
        },
        tools: [
            { name: 'Vertical Ball Mills', domain: 'Embedded Systems', category: 'Machinery', proficiency: 'Intermediate' },
            { name: 'VAM Cooling', domain: 'Embedded Systems', category: 'Machinery', proficiency: 'Intermediate' }
        ],
        tags: ['Food Processing', 'Chocolate']
    },
    {
        id: 'kiocl',
        name: 'KIOCL Limited',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Panambur',
            landmark: 'Panambur',
            area: 'Panambur',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575010',
            coordinates: { lat: 12.9337, lng: 74.8056 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Graduate Apprentice', duration: '1 year', seats: 30 },
                { name: 'Junior Manager', duration: 'Permanent', seats: 10 }
            ]
        },
        domains: {
            'Construction': 8, // Mining/Metallurgy
            'Embedded Systems': 8
        },
        tools: [
            { name: 'Blast Furnace Automation', domain: 'Embedded Systems', category: 'Automation', proficiency: 'Advanced' },
            { name: 'Thermal Engineering Tools', domain: 'Construction', category: 'Engineering', proficiency: 'Intermediate' }
        ],
        tags: ['Mining', 'Iron Ore', 'PSU']
    },
    {
        id: 'winman',
        name: 'Winman Software',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Balmatta / PVS Junction',
            landmark: 'PVS Junction',
            area: 'Balmatta',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575003',
            coordinates: { lat: 12.8737, lng: 74.8456 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Product Software Programmer', duration: 'Permanent', seats: 20 },
                { name: 'Tax Specialist', duration: 'Permanent', seats: 10 }
            ]
        },
        domains: {
            'Software Development': 9,
            'Business': 9 // Fintech/Tax
        },
        tools: [
            { name: '.NET', domain: 'Software Development', category: 'Development', proficiency: 'Advanced' },
            { name: 'SQL Server', domain: 'Software Development', category: 'Database', proficiency: 'Intermediate' },
            { name: 'Crystal Reports', domain: 'Business', category: 'Reporting', proficiency: 'Intermediate' }
        ],
        tags: ['Fintech', 'Taxation']
    },
    {
        id: 'sequent',
        name: 'Sequent Scientific (Alivira)',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Plot 120, Baikampady Industrial Area',
            landmark: 'Baikampady',
            area: 'Baikampady',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575011',
            coordinates: { lat: 12.9537, lng: 74.8256 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Analyst (R&D)', duration: 'Permanent', seats: 10 },
                { name: 'Production Chemist', duration: 'Permanent', seats: 15 }
            ]
        },
        domains: {
            'Biotechnology': 9, // Pharma
            'Healthcare': 8
        },
        tools: [
            { name: 'Wet Chemistry Analysis', domain: 'Biotechnology', category: 'Lab', proficiency: 'Advanced' },
            { name: 'GC', domain: 'Biotechnology', category: 'Lab', proficiency: 'Intermediate' }
        ],
        tags: ['Pharma', 'Veterinary']
    },
    {
        id: 'lamina',
        name: 'Lamina Suspension Products',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Plot 17-20, Baikampady Industrial Area',
            landmark: 'Baikampady',
            area: 'Baikampady',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575011',
            coordinates: { lat: 12.9637, lng: 74.8156 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Diploma Engineer Trainee', duration: '1 year', seats: 20 },
                { name: 'Quality Inspector', duration: 'Permanent', seats: 10 }
            ]
        },
        domains: {
            'Design': 8, // CAD/CAM
            'Construction': 7 // Metallurgy
        },
        tools: [
            { name: 'CAD/CAM', domain: 'Design', category: 'Design', proficiency: 'Intermediate' },
            { name: 'Heat Treatment Furnaces', domain: 'Construction', category: 'Manufacturing', proficiency: 'Intermediate' }
        ],
        tags: ['Automotive', 'Manufacturing']
    },
    {
        id: 'bindu',
        name: 'SG Corporates (Bindu)',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Narimogaru, Puttur',
            landmark: 'Narimogaru',
            area: 'Puttur',
            taluk: 'Puttur',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '574202',
            coordinates: { lat: 12.7537, lng: 75.2156 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Production Supervisor', duration: 'Permanent', seats: 10 },
                { name: 'Microbiologist', duration: 'Permanent', seats: 5 }
            ]
        },
        domains: {
            'Biotechnology': 8, // Microbiology
            'Logistics': 8,
            'Agriculture Tech': 7
        },
        tools: [
            { name: 'Automated Bottling Lines', domain: 'Embedded Systems', category: 'Manufacturing', proficiency: 'Intermediate' },
            { name: 'RO Plants', domain: 'Biotechnology', category: 'Manufacturing', proficiency: 'Intermediate' }
        ],
        tags: ['Beverages', 'FMCG']
    },
    {
        id: 'cognizant',
        name: 'Cognizant',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'State Bank Road / MG Road',
            landmark: 'State Bank',
            area: 'Mangalore',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8687, lng: 74.8400 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Programmer Analyst Trainee', duration: 'Permanent', seats: 100 }
            ]
        },
        domains: {
            'Software Development': 9,
            'Healthcare': 8 // Healthcare BPO
        },
        tools: [
            { name: 'SQL', domain: 'Software Development', category: 'Database', proficiency: 'Intermediate' },
            { name: 'Java', domain: 'Software Development', category: 'Development', proficiency: 'Advanced' },
            { name: 'Selenium', domain: 'Software Development', category: 'Testing', proficiency: 'Intermediate' }
        ],
        tags: ['IT Services', 'Healthcare']
    },
    {
        id: 'invenger',
        name: 'Invenger Technologies',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Kottara Chowki / Lalbagh',
            landmark: 'Kottara Chowki',
            area: 'Mangalore',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575006',
            coordinates: { lat: 12.8837, lng: 74.8356 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Software Developer', duration: 'Permanent', seats: 30 }
            ]
        },
        domains: {
            'Software Development': 9,
            'Business': 8 // Insurance/Banking
        },
        tools: [
            { name: 'Java', domain: 'Software Development', category: 'Development', proficiency: 'Advanced' },
            { name: 'Spring Boot', domain: 'Software Development', category: 'Development', proficiency: 'Advanced' }
        ],
        tags: ['InsurTech', 'Banking']
    },
    {
        id: 'codecraft',
        name: 'CodeCraft Technologies',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'K.S. Rao Road, Mangalore',
            landmark: 'K.S. Rao Road',
            area: 'Mangalore',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575001',
            coordinates: { lat: 12.8700, lng: 74.8420 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Software Engineer', duration: 'Permanent', seats: 20 }
            ]
        },
        domains: {
            'Software Development': 10,
            'AI': 7
        },
        tools: [
            { name: 'React Native', domain: 'Software Development', category: 'Mobile', proficiency: 'Advanced' },
            { name: 'Node.js', domain: 'Software Development', category: 'Web', proficiency: 'Advanced' },
            { name: 'AWS', domain: 'Software Development', category: 'Cloud', proficiency: 'Intermediate' }
        ],
        tags: ['Web', 'Mobile', 'Cloud']
    },
    {
        id: 'basf',
        name: 'BASF India Ltd',
        type: 'Private',
        category: 'Company',
        location: {
            address: 'Baikampady Industrial Area',
            landmark: 'Baikampady',
            area: 'Baikampady',
            taluk: 'Mangalore',
            district: 'Dakshina Kannada',
            state: 'Karnataka',
            pincode: '575011',
            coordinates: { lat: 12.9600, lng: 74.8200 },
            googleMapsUrl: ''
        },
        metadata: { verified: true, lastUpdated: '2024-03-15', source: 'User' },
        contact: { website: '' },
        academic: {
            programs: [
                { name: 'Production Trainee', duration: '1 year', seats: 15 }
            ]
        },
        domains: {
            'Chemical Engineering': 10,
            'Process Safety': 9
        },
        tools: [
            { name: 'Chemical Process Control', domain: 'Chemical Engineering', category: 'Automation', proficiency: 'Advanced' }
        ],
        tags: ['Chemicals', 'Polymers']
    }
];
