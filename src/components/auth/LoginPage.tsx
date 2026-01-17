import React, { useState } from 'react';
import { Building2, Briefcase, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../store/useAuthStore';

interface LoginPageProps {
    onBack: () => void;
    onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLogin }) => {
    const login = useAuthStore(state => state.login);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [formData, setFormData] = useState({ id: '', password: '' });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedRole && formData.id) {
            // In a real app, validation would happen here
            login({
                id: formData.id,
                name: `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} User`,
                role: selectedRole,
                managedEntityId: formData.id
            });
            onLogin(selectedRole);
        }
    };

    if (!selectedRole) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
                <div className="max-w-4xl w-full">
                    <button
                        onClick={onBack}
                        className="mb-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-2"
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>

                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">Partner Portal</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-center mb-12">Select your organization type to continue</p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <RoleCard
                            icon={Building2}
                            title="Institution"
                            description="Colleges, Universities & Schools"
                            onClick={() => setSelectedRole('institution')}
                        />
                        <RoleCard
                            icon={Briefcase}
                            title="Company"
                            description="Industries & Recruiters"
                            onClick={() => setSelectedRole('company')}
                        />
                        <RoleCard
                            icon={Award}
                            title="CoE"
                            description="Centers of Excellence"
                            onClick={() => setSelectedRole('coe')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl w-full max-w-md">
                <button onClick={() => setSelectedRole(null)} className="mb-6 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 flex items-center gap-1">
                    <ArrowLeft size={14} /> Back to selection
                </button>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    {selectedRole === 'institution' ? 'Institution' : selectedRole === 'company' ? 'Company' : 'Center of Excellence'} Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Organization ID / Email
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 mt-4"
                    >
                        Login <ArrowRight size={16} />
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-400">
                        For demo purposes, enter any ID and Password.
                    </p>
                </div>
            </div>
        </div>
    );
};

const RoleCard = ({ icon: Icon, title, description, onClick }: { icon: any, title: string, description: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all text-left group"
    >
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </button>
);

export default LoginPage;
