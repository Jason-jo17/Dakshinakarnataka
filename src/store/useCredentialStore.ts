import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

export type UserRole = 'super_admin' | 'district_admin' | 'district_team' | 'institution' | 'company' | 'coe' | 'training_center' | 'trainee' | 'guest';

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
    loading: boolean;
    addCredential: (cred: GeneratedCredential) => Promise<void>;
    revokeCredential: (id: string) => Promise<void>;
    generateCredential: (params: CredentialParams) => Promise<GeneratedCredential>;
    syncWithDatabase: () => Promise<void>;
    clearCredentials: () => Promise<void>;
    updatePassword: (id: string, newPassword: string) => Promise<void>;
}

export const useCredentialStore = create<CredentialStore>()(
    (set, get) => ({
        credentials: [],
        loading: false,
        addCredential: async (cred) => {
            const { error } = await supabase.from('users').upsert({
                id: cred.id,
                username: cred.username,
                password_hash: cred.password, // Plain text for "Master Sheet" requirement
                role: cred.role,
                entity_id: cred.entityId,
                entity_name: cred.entityName,
                email: cred.email,
                status: cred.status,
                linked_entity_id: cred.linkedEntityId,
                created_at: cred.generatedAt
            }, {
                onConflict: 'username' // Resolve conflicts based on username instead of ID if needed
            });

            if (error) {
                console.error("Error adding credential to DB:", error);
                throw error;
            }

            set((state) => ({ credentials: [...state.credentials, cred] }));
        },
        revokeCredential: async (id) => {
            const { error } = await supabase
                .from('users')
                .update({ status: 'revoked' })
                .eq('id', id);

            if (error) {
                console.error("Error revoking credential in DB:", error);
                throw error;
            }

            set((state) => ({
                credentials: state.credentials.map((c) =>
                    c.id === id ? { ...c, status: 'revoked' } : c
                )
            }));
        },
        clearCredentials: async () => {
            // For seeding/clearing - typically we might not actually delete all users in a real DB
            // but for this pilot's seeder we might.
            const { error } = await supabase.from('users').delete().neq('role', 'super_admin');

            if (error) {
                console.error("Error clearing credentials in DB:", error);
            }

            set({ credentials: [] });
        },
        generateCredential: async (params) => {
            let username = params.username;

            if (!username) {
                const sanitizedName = params.entityName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                if (params.role === 'company') {
                    username = `company_${sanitizedName}`;
                } else if (params.role === 'institution') {
                    username = `inst_${sanitizedName}`;
                } else {
                    username = `${params.role}_${sanitizedName.substring(0, 10)}_${Math.floor(Math.random() * 1000)}`;
                }
            }

            username = username.toLowerCase();

            // 1. Check if user already exists
            const { data: existingUser, error: checkError } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .maybeSingle();

            if (existingUser && !checkError) {
                console.log(`[CredentialStore] Reusing existing credential for: ${username}`);
                const cred: GeneratedCredential = {
                    id: existingUser.id,
                    username: existingUser.username,
                    password: existingUser.password_hash,
                    role: existingUser.role as any,
                    entityId: existingUser.entity_id,
                    entityName: existingUser.entity_name,
                    email: existingUser.email,
                    linkedEntityId: existingUser.linked_entity_id,
                    generatedAt: existingUser.created_at,
                    status: existingUser.status as any
                };

                // Add to local state if missing
                set((state) => {
                    if (!state.credentials.find(c => c.username === username)) {
                        return { credentials: [...state.credentials, cred] };
                    }
                    return state;
                });

                return cred;
            }

            const password = params.password || (Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase());

            const newCred: GeneratedCredential = {
                id: crypto.randomUUID(),
                username: username,
                password: password,
                role: params.role,
                entityId: params.entityId,
                entityName: params.entityName,
                email: params.email,
                linkedEntityId: params.linkedEntityId,
                generatedAt: new Date().toISOString(),
                status: 'active'
            };

            await get().addCredential(newCred);
            return newCred;
        },
        syncWithDatabase: async () => {
            set({ loading: true });
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false })
                .range(0, 9999);

            if (error) {
                console.error("Error syncing credentials:", error);
                set({ loading: false });
                return;
            }

            if (data) {
                const mappedCreds: GeneratedCredential[] = data.map(u => ({
                    id: u.id,
                    username: u.username,
                    password: u.password_hash,
                    role: u.role as UserRole,
                    entityId: u.entity_id,
                    entityName: u.entity_name,
                    email: u.email,
                    status: u.status as any,
                    linkedEntityId: u.linked_entity_id,
                    generatedAt: u.created_at
                }));
                set({ credentials: mappedCreds, loading: false });
            } else {
                set({ loading: false });
            }
        },
        updatePassword: async (id: string, newPassword: string) => {
            const { error } = await supabase
                .from('users')
                .update({ password_hash: newPassword })
                .eq('id', id);

            if (error) {
                console.error("Error updating password in DB:", error);
                throw error;
            }

            // Sync with local state
            set((state) => ({
                credentials: state.credentials.map(c =>
                    c.id === id ? { ...c, password: newPassword } : c
                )
            }));
        }
    })
);
