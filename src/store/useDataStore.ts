import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INSTITUTIONS } from '../data/institutions';
import { dashboardData } from '../data/dashboardData';
import type { Institution } from '../types/institution';

// Define types based on dashboardData interfaces (simplified for now if not exported)
// ideally we should export these from types/dashboard.ts or similar if they existed
// extending from dashboardData.ts structure

export interface CenterOfExcellence {
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

export interface IndustryDemand {
    id: number;
    company_name: string;
    company_type: string;
    sector: string;
    job_role: string;
    demand_count: number;
    projection_period: string;
    skills_required: string;
    avg_salary: string;
    location: string;
}

interface DataState {
    institutions: Institution[];
    coes: CenterOfExcellence[];
    industryDemands: IndustryDemand[];
    
    addInstitution: (inst: Institution) => void;
    addCoe: (coe: CenterOfExcellence) => void;
    addIndustryDemand: (demand: IndustryDemand) => void;
    
    // Actions to update could be added here
}

export const useDataStore = create<DataState>()(
    persist(
        (set) => ({
            institutions: [...INSTITUTIONS],
            coes: [...dashboardData.centersOfExcellence],
            industryDemands: [...dashboardData.industryDemand],

            addInstitution: (inst) => set((state) => ({ 
                institutions: [...state.institutions, inst] 
            })),
            
            addCoe: (coe) => set((state) => ({ 
                coes: [...state.coes, coe] 
            })),
            
            addIndustryDemand: (demand) => set((state) => ({ 
                industryDemands: [...state.industryDemands, demand] 
            })),
        }),
        {
            name: 'dk-directory-data-storage', // unique name
            partialize: (state) => ({
                // We only want to persist *new* data ideally, or all of it. 
                // For simplicity, we persist all. 
                // However, deep merging with fresh code updates (hardcoded data changes) is tricky with simple persist.
                // For this prototype, if we persist all, the user won't see code updates unless they clear cache.
                // A better approach for this hybrid model is to store only "userAdded" lists and merge on hydration.
                // But simplified requirement: persist data.
                institutions: state.institutions,
                coes: state.coes,
                industryDemands: state.industryDemands
            }),
        }
    )
);
