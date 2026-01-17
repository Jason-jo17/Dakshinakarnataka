# Platform Data & Schemas

## 1. Core Data Models

### 1.1 Institution (`src/types/institution.ts`)
The central entity representing any organization (College, Company, Hospital, etc.).

**Structure:**
```typescript
interface Institution {
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
            lat: number;
            lng: number;
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
        affiliation?: string;
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

    // Backward compatibility shortcut
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
            highest: number;
            average: number;
            median?: number;
        };
        studentsPlaced?: number;
        topRecruiters: string[];
        sectorWise?: {
            sector: string;
            percentage: number;
        }[];
        analysis?: string;
        highlights?: string[];
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

    // Inferred/Derived Data
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
    tags?: string[];
    coe?: boolean; // Center of Excellence
}
```

### 1.2 Job (`src/data/jobs.ts`)
Represents a job listing.

**Structure:**
```typescript
interface Job {
    job_id: string;
    role: string;
    company: string;
    location: string;
    salary: string;
    requirements: string;
    application_type: string;
    apply_link_or_contact: string;
    source_citation: string;
    coordinates?: { lat: number; lng: number };
}
```

### 1.3 Dashboard Data (`src/data/dashboardData.ts`)
Aggregated metrics and KPIs for the dashboard.

**Overview KPI:**
```typescript
interface DashboardOverview {
    totalOpenings: number;
    skilledTalent: number;
    skillGapPercentage: number;
    placementRate: number;
    avgFresherSalary: number;
    trends: {
       openings: { direction: 'up' | 'down'; value: number };
       skillGap: { direction: 'up' | 'down'; value: number };
       placementRate: { direction: 'up' | 'down'; value: number };
    };
}
```

**Supply Data:**
```typescript
interface SupplyData {
    totalStudents: number;
    annualGraduates: number;
    certifiedStudents: number;
    readinessScore: number;
    totalInstitutions: number;
}
```

**Center of Excellence:**
```typescript
interface CenterOfExcellence {
     id: number;
     name: string;
     location: string;
     focus_area: string;
     performance_score: number;
     training_completion_rate: number;
     status: string;
     trainings_conducted: number;
     students_trained: number;
     placement_rate: number;
     utilization_rate: number;
     equipment_usage_score: number;
     faculty_readiness_score: number;
     industry_alignment_score: number;
     budget_allocated: number;
     budget_utilized: number;
     notable_achievements: string;
}
```

**Industry Demand:**
```typescript
interface IndustryDemand {
    id: number;
    company_name: string;
    company_type: string; // e.g., 'Large Enterprise', 'GCC', 'SME', 'Startup'
    sector: string;
    job_role: string;
    demand_count: number;
    projection_period: string; // e.g., '6 Months'
    skills_required: string;
    avg_salary: string;
    location: string;
}
```

**Skills Demand:**
```typescript
interface SkillDemand {
    name: string;
    demand: number;
    supply: number;
    gap: number;
    gapPercentage: number;
    avgSalary: string;
    topCompanies: string[];
}
```

**Placement Trends:**
```typescript
interface PlacementTrend {
    year: string;
    rate: number;
    avgPackage: number;
    studentsPlaced: number;
}
```

**Training Programs:**
```typescript
interface TrainingProgram {
    name: string;
    type: string; // e.g., 'Government', 'Corporate', 'Vocational'
    participants: number;
    status: string;
    skills: string[];
    duration: string;
    placement_assistance: boolean;
}
```

### 1.4 AI Response (`src/types/ai.ts`)
Structure for AI interactions.
```typescript
interface GeminiResponse {
    text: string;
    groundingChunks: any[];
}
```

### 1.5 Scalable Parsing Data (`src/scripts/parse_aicte.ts`)
Intermediate structures used during data ingestion.
```typescript
interface ParsedInstitution {
    name: string;
    address: string;
    programs: {
        name: string;
        seats: number;
    }[];
    rawId?: string;
}
```

## 2. Data Sources & Flow

| Source File | Description | Usage |
|-------------|-------------|-------|
| `src/data/companies.ts` | Hardcoded list of companies/industries. | Merged into main `INSTITUTIONS` list. |
| `src/data/user_institutions.ts` | User-managed/overridden institution data. | Highest priority in merge logic. |
| `src/data/legacy_institutions.ts` | Imported/scraped legacy data. | Base data, overridden by user data. |
| `src/data/institutions.ts` | **Aggregation Layer**. | Merges User + Legacy + Companies -> Exports `INSTITUTIONS`. |
| `src/data/jobs.ts` | Job listings. | Used in Jobs view/portal. |
| `src/data/dashboardData.ts` | Analytical data. | Used in Executive Dashboard. |

## 3. Enumerated Values & taxonomies

### Institution Categories
- Engineering
- Polytechnic
- ITI
- Training
- University
- Research
- Hospital
- Company

### Domains (Inferred)
- Software Development
- Civil Engineering
- Mechanical Engineering
- Electrical Engineering
- Biotechnology
- Healthcare
- Business
- Design
- Logistics

### Tool Categories
- Development (Languages/Frameworks)
- Design (CAD/Modeling)
- Analysis (Simulation)
- Management (ERP/CRM)
- Manufacturing (CNC/PLC)
- Lab (Equipment)
