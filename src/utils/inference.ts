import type { Institution } from '../types/institution';

type DomainName = 'Software Development' | 'AI' | 'Data Engineering' | 'Networking' | 'Embedded Systems' | 'IoT' | 'Robotics' | 'Design' | 'PDIET' | 'Biotechnology' | 'Agriculture Tech' | 'Hospitality' | 'Logistics' | 'Healthcare' | 'Business' | 'Construction';

interface InferredData {
    domains: { [key in DomainName]?: number };
    tools: {
        name: string;
        domain: string;
        proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
        category?: string;
    }[];
    specializations: string[];
}

export const inferSkills = (institution: Institution): InferredData => {
    const data: InferredData = {
        domains: {},
        tools: [],
        specializations: []
    };

    // Helper to add tool if not exists
    const addTool = (name: string, domain: string, proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert', category?: string) => {
        if (!data.tools.find(t => t.name === name)) {
            data.tools.push({ name, domain, proficiency, category });
        }
    };

    // Helper to set domain score
    const setDomain = (domain: DomainName, score: number) => {
        data.domains[domain] = Math.max(data.domains[domain] || 0, score);
    };

    // 1. Engineering Colleges
    if (institution.category === 'Engineering') {
        // Default Engineering Domains
        setDomain('Software Development', 8);
        setDomain('AI', 7);
        setDomain('Embedded Systems', 7);
        setDomain('Data Engineering', 7);
        setDomain('Design', 6);
        setDomain('PDIET', 7);
    }

    // Shared Program-based Inference (Engineering, University, Degree College)
    if (['Engineering', 'University', 'Degree College'].includes(institution.category)) {
        // Check programs for specifics
        const programs = institution.academic?.programs || [];
        // Combine specializations and program names for matching
        const specs = [...programs.flatMap(p => p.specializations || []), ...programs.map(p => p.name)];

        if (specs.some(s => s.includes('CSE') || s.includes('ISE') || s.includes('Computer') || s.includes('Information Science') || s.includes('BCA') || s.includes('MCA'))) {
            setDomain('Software Development', 9);
            addTool('Python', 'Software Development', 'Advanced', 'Programming Languages');
            addTool('Java', 'Software Development', 'Advanced', 'Programming Languages');
            addTool('C++', 'Software Development', 'Advanced', 'Programming Languages');
            addTool('SQL', 'Data Engineering', 'Intermediate', 'Database');
            addTool('Git', 'Software Development', 'Intermediate', 'DevOps');
            data.specializations.push('Web Development', 'Software Engineering');
        }

        if (specs.some(s => s.includes('AI') || s.includes('Artificial Intelligence') || s.includes('Machine Learning'))) {
            setDomain('AI', 9);
            setDomain('Data Engineering', 8);
            addTool('TensorFlow', 'AI', 'Intermediate', 'ML Frameworks');
            addTool('Python', 'AI', 'Advanced', 'Programming Languages');
            addTool('PyTorch', 'AI', 'Intermediate', 'ML Frameworks');
            addTool('Scikit-learn', 'AI', 'Intermediate', 'ML Libraries');
            data.specializations.push('Machine Learning', 'Data Science');
        }

        if (specs.some(s => s.includes('Data Science') || s.includes('Big Data'))) {
            setDomain('Data Engineering', 9);
            setDomain('AI', 8);
            addTool('Python', 'Data Engineering', 'Advanced', 'Programming Languages');
            addTool('Pandas', 'Data Engineering', 'Advanced', 'Data Analysis');
            addTool('Tableau', 'Data Engineering', 'Intermediate', 'Visualization');
            addTool('SQL', 'Data Engineering', 'Advanced', 'Database');
            data.specializations.push('Data Analytics', 'Big Data');
        }

        if (specs.some(s => s.includes('Cyber Security') || s.includes('Information Security'))) {
            setDomain('Networking', 9);
            setDomain('Software Development', 7);
            addTool('Wireshark', 'Networking', 'Intermediate', 'Security Tools');
            addTool('Kali Linux', 'Networking', 'Intermediate', 'OS');
            addTool('Burp Suite', 'Networking', 'Intermediate', 'Security Tools');
            addTool('Python', 'Software Development', 'Intermediate', 'Scripting');
            data.specializations.push('Ethical Hacking', 'Network Security');
        }

        if (specs.some(s => s.includes('IoT') || s.includes('Internet of Things'))) {
            setDomain('IoT', 9);
            setDomain('Embedded Systems', 8);
            addTool('Arduino', 'IoT', 'Advanced', 'Microcontrollers');
            addTool('Raspberry Pi', 'IoT', 'Advanced', 'SBC');
            addTool('MQTT', 'IoT', 'Intermediate', 'Protocols');
            addTool('Python', 'IoT', 'Intermediate', 'Scripting');
            data.specializations.push('IoT Architecture', 'Sensor Networks');
        }

        if (specs.some(s => s.includes('Robotics') || s.includes('Mechatronics') || s.includes('Automation'))) {
            setDomain('Robotics', 9);
            setDomain('Embedded Systems', 8);
            setDomain('PDIET', 7);
            addTool('ROS', 'Robotics', 'Intermediate', 'Frameworks');
            addTool('MATLAB', 'Robotics', 'Advanced', 'Simulation');
            addTool('PLC', 'Robotics', 'Intermediate', 'Automation');
            addTool('Python', 'Robotics', 'Intermediate', 'Scripting');
            data.specializations.push('Industrial Automation', 'Robotics Control');
        }

        if (specs.some(s => s.includes('ECE') || s.includes('Electronics') || s.includes('Communication'))) {
            setDomain('Embedded Systems', 9);
            setDomain('IoT', 8);
            addTool('Verilog', 'Embedded Systems', 'Advanced', 'Hardware');
            addTool('MATLAB', 'Embedded Systems', 'Advanced', 'Simulation');
            addTool('Arduino', 'Embedded Systems', 'Intermediate', 'Microcontrollers');
            data.specializations.push('VLSI Design', 'Embedded Systems');
        }

        if (specs.some(s => s.includes('ME') || s.includes('Mechanical') || s.includes('Aeronautical') || s.includes('Automobile'))) {
            setDomain('Design', 8);
            setDomain('PDIET', 9);
            addTool('AutoCAD', 'Design', 'Advanced', 'CAD');
            addTool('SolidWorks', 'Design', 'Advanced', 'CAD');
            addTool('ANSYS', 'Design', 'Intermediate', 'Simulation');
            if (specs.some(s => s.includes('Aeronautical'))) {
                addTool('CATIA', 'Design', 'Intermediate', 'Aerospace CAD');
            }
            data.specializations.push('CAD/CAM', 'Thermal Engineering');
        }

        if (specs.some(s => s.includes('Civil') || s.includes('Construction'))) {
            setDomain('Design', 7);
            setDomain('Construction', 8);
            addTool('AutoCAD', 'Design', 'Advanced', 'CAD');
            addTool('Revit', 'Design', 'Intermediate', 'BIM');
            addTool('STAAD.Pro', 'Design', 'Intermediate', 'Structural Analysis');
            addTool('Primavera', 'Construction', 'Intermediate', 'Project Management');
        }

        if (specs.some(s => s.includes('Biotechnology') || s.includes('Medical'))) {
            setDomain('Biotechnology', 9);
            setDomain('Healthcare', 7);
            addTool('Bioinformatics Tools', 'Biotechnology', 'Intermediate', 'Research');
            addTool('Lab Equipment', 'Biotechnology', 'Advanced', 'Lab');
        }

        if (specs.some(s => s.includes('Agriculture'))) {
            setDomain('Agriculture Tech', 9);
            addTool('GIS', 'Agriculture Tech', 'Intermediate', 'Mapping');
            addTool('Precision Farming Tools', 'Agriculture Tech', 'Intermediate', 'Farming');
        }

        if (specs.some(s => s.includes('MBA') || s.includes('BBA') || s.includes('Business') || s.includes('Management'))) {
            setDomain('Business', 9);
            addTool('Excel', 'Business', 'Advanced', 'Office');
            addTool('Tally', 'Business', 'Intermediate', 'Accounting');
            addTool('ERP', 'Business', 'Intermediate', 'Management');
            addTool('Power BI', 'Business', 'Intermediate', 'Analytics');
        }

        if (specs.some(s => s.includes('Hotel') || s.includes('Hospitality'))) {
            setDomain('Hospitality', 9);
            setDomain('Business', 7);
            addTool('Hotel Management Software', 'Hospitality', 'Intermediate', 'Management');
        }

        if (specs.some(s => s.includes('Logistics') || s.includes('Supply Chain'))) {
            setDomain('Logistics', 9);
            setDomain('Business', 7);
            addTool('SAP', 'Logistics', 'Intermediate', 'ERP');
            addTool('Logistics Software', 'Logistics', 'Intermediate', 'Management');
        }

        // Cloud & DevOps Inference (from CSE/ISE programs usually, or specific electives)
        if (specs.some(s => s.includes('Cloud') || s.includes('DevOps') || s.includes('CSE') || s.includes('ISE'))) {
            // Add Cloud/DevOps tools for CS students generally, but with lower confidence if not explicit
            const isExplicit = specs.some(s => s.includes('Cloud') || s.includes('DevOps'));
            if (isExplicit) {
                setDomain('Software Development', 9);
                addTool('AWS', 'Software Development', 'Intermediate', 'Cloud');
                addTool('Docker', 'Software Development', 'Intermediate', 'DevOps');
                addTool('Kubernetes', 'Software Development', 'Intermediate', 'DevOps');
            } else {
                // General CS exposure
                addTool('AWS', 'Software Development', 'Basic', 'Cloud');
                addTool('Git', 'Software Development', 'Intermediate', 'DevOps');
            }
        }
    }

    // 2. Polytechnics
    else if (institution.category === 'Polytechnic') {
        setDomain('PDIET', 8);
        setDomain('Embedded Systems', 6);
        setDomain('Software Development', 4);

        addTool('AutoCAD', 'Design', 'Intermediate', 'CAD');
        addTool('C Programming', 'Software Development', 'Intermediate', 'Programming Languages');
        addTool('Workshop Tools', 'PDIET', 'Advanced', 'Mechanical');

        const programs = institution.academic?.programs || [];
        const specs = programs.flatMap(p => p.specializations || []);

        if (specs.some(s => s.includes('CSE') || s.includes('Computer'))) {
            setDomain('Software Development', 6);
            addTool('Java', 'Software Development', 'Basic', 'Programming Languages');
            addTool('HTML/CSS', 'Software Development', 'Intermediate', 'Web');
        }
    }

    // 3. ITIs
    else if (institution.category === 'ITI') {
        setDomain('PDIET', 9);
        setDomain('Embedded Systems', 5);

        addTool('Workshop Hand Tools', 'PDIET', 'Advanced', 'Mechanical');
        addTool('Measuring Instruments', 'PDIET', 'Advanced', 'Mechanical');

        const programs = institution.academic?.programs || [];
        const specs = programs.flatMap(p => p.specializations || []);

        if (specs.some(s => s.includes('Electrician') || s.includes('Electronics'))) {
            setDomain('Embedded Systems', 6);
            addTool('Multimeter', 'Embedded Systems', 'Advanced', 'Testing');
            addTool('Soldering Iron', 'Embedded Systems', 'Advanced', 'Electronics');
        }

        if (specs.some(s => s.includes('COPA'))) {
            setDomain('Software Development', 4);
            addTool('MS Office', 'Software Development', 'Intermediate', 'Office');
            addTool('Typing', 'Software Development', 'Advanced', 'Office');
            addTool('Internet Tools', 'Software Development', 'Intermediate', 'Web');
        }
    }

    // 4. PU Colleges
    else if (institution.category === 'PU College') {
        setDomain('Software Development', 2);
        setDomain('PDIET', 3);

        addTool('MS Office', 'Software Development', 'Basic', 'Office');

        const programs = institution.academic?.programs || [];
        const specs = programs.flatMap(p => p.specializations || []);

        if (specs.some(s => s.includes('PCMC') || s.includes('PCMS'))) {
            setDomain('Software Development', 3);
            addTool('Python Basics', 'Software Development', 'Basic', 'Programming Languages');
            addTool('C++ Basics', 'Software Development', 'Basic', 'Programming Languages');
        }
    }

    // 5. Training Centers
    else if (institution.category === 'Training') {
        setDomain('PDIET', 9);
        // Specifics usually depend on the center name
        if (institution.name.includes('GTTC') || institution.name.includes('KGTTI')) {
            setDomain('Embedded Systems', 8);
            setDomain('Robotics', 7);
            addTool('CNC Programming', 'PDIET', 'Advanced', 'Manufacturing');
            addTool('PLC', 'Embedded Systems', 'Advanced', 'Automation');
        }
    }

    return data;
};
