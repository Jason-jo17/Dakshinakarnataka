import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'institution' | 'company' | 'coe' | 'guest';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    managedEntityId?: string | number; // ID of the institution/company/coe they manage
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'dk-directory-auth',
        }
    )
);
