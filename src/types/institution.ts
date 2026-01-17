export interface Institution {
    // Identity
    id: string;
    name: string;
    shortName?: string;
    logo?: string;

    // Classification
    category: 'Engineering' | 'Polytechnic' | 'ITI' | 'Training' | 'University' | 'Research' | 'Hospital' | 'Company' | 'PU College' | 'Degree College' | 'School' | 'High School';
    type: 'Government' | 'Private' | 'Aided' | 'Deemed' | 'PSU';
    subCategory?: string; // e.g., 'VTU Autonomous', 'NAAC A++', etc.

    // Location
    location: {
        address: string;
        landmark: string;
        area: string;
        taluk: string;
        district: 'Dakshina Kannada';
        state: 'Karnataka';
        pincode: string;
        coordinates: {
            lat: number;  // decimal format
            lng: number;  // decimal format
        };
        googleMapsUrl: string;
    };

    // Contact
    contact: {
        phone?: string;
        email?: string;
        website: string;
        officeHours?: string;
    };

    // Academic (for educational institutions)
    academic?: {
        affiliation?: string; // e.g., 'VTU Belagavi'
        established?: number;
        accreditation?: string[]; // e.g., ['NAAC A+', 'NBA']
        ranking?: {
            nirf?: number;
            state?: number;
        };
        programs: {
            name: string;
            duration: string;
            seats?: number;
            specializations?: string[];
        }[];
        facilities?: string[];
    };

    // Allow programs at top level for backward compatibility/ease of use
    programs?: {
        name: string;
        duration: string;
        seats?: number;
        specializations?: string[];
    }[];

    // Placement (for colleges)
    placement?: {
        rate: number; // percentage
        year: string;
        packages: {
            highest: number; // LPA
            average: number;
            median?: number;
        };
        studentsPlaced?: number;
        topRecruiters: string[];
        sectorWise?: {
            sector: string;
            percentage: number;
        }[];
        // New Strategic Fields
        analysis?: string; // Executive summary or specific analysis for the institution
        highlights?: string[]; // Key takeaways (e.g., "Japanese Corridor", "50 LPA Milestone")
    };

    // Company (for companies/PSUs)
    company?: {
        sector: string;
        employees: number;
        revenue?: string;
        established?: number;
        hiring: {
            positions: string[];
            qualifications: string[];
            annualHiring: number;
            salaryRange: string;
            process: string[];
        };
    };

    // Hospital (for healthcare)
    hospital?: {
        beds: number;
        specialties: string[];
        accreditation: string[];
        emergency: boolean;
        ambulance: boolean;
    };
    // Metadata
    metadata: {
        verified: boolean;
        lastUpdated: string;
        source: string;
    };

    // Rich Metadata (New)
    // Rich Metadata (Legacy - to be migrated)
    primaryDomains?: string[];
    keyTools?: string[];
    tags?: string[];
    coe?: boolean;

    // Skill-Based Discovery (Phase 1)
    domains?: {
        [key: string]: number | undefined;
    };

    tools?: {
        name: string;
        domain: string;
        proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
        category?: string;
    }[];

    specializations?: string[];
}
