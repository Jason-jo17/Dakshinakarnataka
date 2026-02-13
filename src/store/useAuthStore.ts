import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

export type UserRole = 'super_admin' | 'district_admin' | 'district_team' | 'admin' | 'institution' | 'company' | 'coe' | 'guest' | 'trainee';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    email?: string;
    managedEntityId?: string | number; // ID of the institution/company/coe they manage
    isVerified?: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    currentDistrict: string | null;
    login: (user: User) => void;
    logout: () => void;
    setDistrict: (district: string | null) => void;
    setVerified: (verified: boolean) => void;
    updatePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            currentDistrict: 'Dakshina Kannada', // Default
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false, currentDistrict: null }),
            setDistrict: (district) => set({ currentDistrict: district }),
            setVerified: (verified) => set((state) => ({
                user: state.user ? { ...state.user, isVerified: verified } : null
            })),
            updatePassword: async (newPassword) => {
                const { user } = get();
                if (!user) return;

                const { error } = await supabase
                    .from('users')
                    .update({ password_hash: newPassword })
                    .eq('id', user.id);

                if (error) throw error;

                // Since we don't store password in useAuthStore's user object directly 
                // (it's in useCredentialStore for management), we just confirm success.
                // If there was a password field in User interface, we'd update it here.
            }
        }),
        {
            name: 'dk-directory-auth',
        }
    )
);
