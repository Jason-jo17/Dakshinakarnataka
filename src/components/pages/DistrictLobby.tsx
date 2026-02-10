
import { LayoutDashboard, Database, ArrowRight, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';


interface DistrictLobbyProps {
    onSelectOption: (option: 'dashboard' | 'portal' | 'plan' | string) => void;
    userName?: string;
}

export default function DistrictLobby({ onSelectOption, userName }: DistrictLobbyProps) {
    const logout = useAuthStore(state => state.logout);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            {/* Header */}
            <div className="w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    KSDC Admin
                </h1>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                            Welcome back, {userName || 'District Admin'}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Select an option to proceed
                        </p>
                    </div>


                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Dashboard Option */}
                        <button
                            onClick={() => onSelectOption('dashboard')}
                            className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 text-left"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                    <LayoutDashboard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-blue-600 transition-colors" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                                District Dashboard
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                View analytics, maps, and reports for your district. Monitor key performance indicators and skill gaps.
                            </p>
                        </button>

                        {/* Data Entry Option */}
                        <button
                            onClick={() => onSelectOption('portal')}
                            className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 text-left"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                    <Database className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                                <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-purple-600 transition-colors" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                                Data Entry Portal
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Add or modify institutions, companies, jobs, and other entities. Manage the core dataset directly.
                            </p>
                        </button>
                    </div>

                    {/* District Team - Assign Work Section */}
                    <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-8">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                            District Team Management
                        </h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div
                                onClick={() => onSelectOption('assign-work')}
                                className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                        <LayoutDashboard className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">Assign Work</h4>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                    Delegate tasks to team members and track progress.
                                </p>
                                <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:underline">
                                    Manage Assignments <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

