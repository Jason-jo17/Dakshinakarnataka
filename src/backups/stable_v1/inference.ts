import type { Institution } from '../../types/institution';

type DomainName = 'Software Development' | 'AI' | 'Data Engineering' | 'Networking' | 'Embedded Systems' | 'IoT' | 'Robotics' | 'Design' | 'PDIET';

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

        // Check programs for specifics
        const programs = institution.academic?.programs || [];
        const specs = programs.flatMap(p => p.specializations || []);

        if (specs.some(s => s.includes('CSE') || s.includes('ISE') || s.includes('Computer'))) {
            setDomain('Software Development', 9);
            addTool('Python', 'Software Development', 'Advanced', 'Programming Languages');
            addTool('Java', 'Software Development', 'Advanced', 'Programming Languages');
            addTool('C++', 'Software Development', 'Advanced', 'Programming Languages');
            addTool('SQL', 'Data Engineering', 'Intermediate', 'Database');
            addTool('Git', 'Software Development', 'Intermediate', 'DevOps');
            data.specializations.push('Web Development', 'Software Engineering');
        }

        if (specs.some(s => s.includes('AI') || s.includes('Artificial Intelligence'))) {
            setDomain('AI', 9);
            addTool('TensorFlow', 'AI', 'Intermediate', 'ML Frameworks');
            addTool('Python', 'AI', 'Advanced', 'Programming Languages');
            data.specializations.push('Machine Learning', 'Data Science');
        }

        if (specs.some(s => s.includes('ECE') || s.includes('Electronics'))) {
            setDomain('Embedded Systems', 9);
            setDomain('IoT', 8);
            addTool('Verilog', 'Embedded Systems', 'Advanced', 'Hardware');
            addTool('MATLAB', 'Embedded Systems', 'Advanced', 'Simulation');
            addTool('Arduino', 'Embedded Systems', 'Intermediate', 'Microcontrollers');
            data.specializations.push('VLSI Design', 'Embedded Systems');
        }

        if (specs.some(s => s.includes('ME') || s.includes('Mechanical'))) {
            setDomain('Design', 8);
            setDomain('PDIET', 9);
            addTool('AutoCAD', 'Design', 'Advanced', 'CAD');
            addTool('SolidWorks', 'Design', 'Advanced', 'CAD');
            addTool('ANSYS', 'Design', 'Intermediate', 'Simulation');
            data.specializations.push('CAD/CAM', 'Thermal Engineering');
        }

        if (specs.some(s => s.includes('Civil'))) {
            setDomain('Design', 7);
            addTool('AutoCAD', 'Design', 'Advanced', 'CAD');
            addTool('Revit', 'Design', 'Intermediate', 'BIM');
            addTool('STAAD.Pro', 'Design', 'Intermediate', 'Structural Analysis');
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
