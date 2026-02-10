import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

export type UserRole = 'super_admin' | 'district_admin' | 'institution' | 'company' | 'coe' | 'training_center' | 'trainee';

export interface CredentialParams {
    entityId: string;
    entityName: string;
    role: UserRole;
    email?: string; // Optional contact email
    linkedEntityId?: string; // For trainees to link to an institution
    username?: string; // Manual override
    password?: string; // Manual override
}

export interface GeneratedCredential {
    id: string;
    username: string;
    password: string; // Storing plain text for the "Master Sheet" visualization requirement
    role: UserRole;
    entityId: string;
    entityName: string;
    email?: string; // Optional contact email
    linkedEntityId?: string; // Linked institution ID for trainees
    generatedAt: string;
    status: 'active' | 'revoked';
}

interface CredentialStore {
    credentials: GeneratedCredential[];
    addCredential: (cred: GeneratedCredential) => void;
    revokeCredential: (id: string) => void;
    generateCredential: (params: CredentialParams) => GeneratedCredential;
    syncWithDatabase: () => Promise<void>;
    clearCredentials: () => void;
}

export const useCredentialStore = create<CredentialStore>()(
    persist(
        (set, get) => ({
            credentials: [],
            addCredential: (cred) => set((state) => ({ credentials: [...state.credentials, cred] })),
            revokeCredential: (id) => set((state) => ({
                credentials: state.credentials.map((c) =>
                    c.id === id ? { ...c, status: 'revoked' } : c
                )
            })),
            clearCredentials: () => set({ credentials: [] }),
            generateCredential: (params) => {
                const username = params.username || `${params.role}_${params.entityName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toLowerCase()}_${Math.floor(Math.random() * 1000)}`;
                const password = params.password || (Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase());

                const newCred: GeneratedCredential = {
                    id: crypto.randomUUID(),
                    username: username.toLowerCase(),
                    password: password,
                    role: params.role,
                    entityId: params.entityId,
                    entityName: params.entityName,
                    email: params.email,
                    linkedEntityId: params.linkedEntityId,
                    generatedAt: new Date().toISOString(),
                    status: 'active'
                };

                get().addCredential(newCred);
                return newCred;
            },
            syncWithDatabase: async () => {
                const { data: employers, error } = await supabase
                    .from('ad_survey_employer')
                    .select('id, employer_name, sector')
                    .eq('district_id', 'Dakshina Kannada');

                if (error) {
                    console.error("Error syncing credentials:", error);
                    return;
                }

                if (employers) {
                    const currentCreds = get().credentials;
                    const newCreds: GeneratedCredential[] = [];

                    employers.forEach(emp => {
                        const exists = currentCreds.some(c => c.entityId === emp.id);
                        if (!exists) {
                            // Generate a consistent username/password for seeded data if possible, or random
                            const username = `company_${emp.employer_name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toLowerCase()}`;
                            const password = `Pass@${Math.floor(1000 + Math.random() * 9000)}`;

                            newCreds.push({
                                id: crypto.randomUUID(),
                                username: username,
                                password: password,
                                role: 'company',
                                entityId: emp.id,
                                entityName: emp.employer_name,
                                generatedAt: new Date().toISOString(),
                                status: 'active'
                            });
                        }
                    });

                    if (newCreds.length > 0) {
                        set(state => ({
                            credentials: [...state.credentials, ...newCreds]
                        }));
                    }
                }
            }
        }),
        {
            name: 'dk-directory-credentials',
        }
    )
);
