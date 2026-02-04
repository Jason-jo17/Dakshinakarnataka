import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'super_admin' | 'district_admin' | 'admin' | 'institution' | 'company' | 'coe' | 'guest' | 'trainee';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    managedEntityId?: string | number; // ID of the institution/company/coe they manage
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    currentDistrict: string | null;
    login: (user: User) => void;
    logout: () => void;
    setDistrict: (district: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            currentDistrict: 'Dakshina Kannada', // Default
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false, currentDistrict: null }),
            setDistrict: (district) => set({ currentDistrict: district }),
        }),
        {
            name: 'dk-directory-auth',
        }
    )
);
