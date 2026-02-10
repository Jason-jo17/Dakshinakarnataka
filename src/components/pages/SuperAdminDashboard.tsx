import { useState } from 'react';
import { Search, MapPin, ChevronRight, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { DISTRICTS } from '../../data/districts';

const SuperAdminDashboard = () => {
    const { setDistrict, logout } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState("");

    const allOptions = ["Comprehensive", ...DISTRICTS];

    const filteredDistricts = allOptions.filter(d =>
        d.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDistrictSelect = (district: string) => {
        setDistrict(district);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
                <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src="/assets/karnataka-emblem.png"
                            alt="Government of Karnataka"
                            className="h-12 w-auto object-contain"
                        />
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white">State Admin Overview</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Karnataka Skill Development Corporation</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search District..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={logout}
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors md:px-4 md:py-2 flex items-center gap-2 text-sm font-medium"
                        >
                            <LogOut size={18} /> <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Select a District</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Choose a district to view its detailed skill intelligence dashboard, institutions, and demand analysis.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
                    {filteredDistricts.length > 0 ? (
                        filteredDistricts.map((district) => (
                            <button
                                key={district}
                                onClick={() => handleDistrictSelect(district)}
                                className="group relative bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-32 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                                    <MapPin size={64} />
                                </div>

                                <div className="flex justify-between items-start z-10">
                                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <MapPin size={20} />
                                    </div>
                                </div>

                                <div className="z-10 mt-auto">
                                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {district}
                                    </h3>
                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0">
                                        View Dashboard <ChevronRight size={12} className="ml-1" />
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-slate-500">
                            <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No districts found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>

                {/* District Progress Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">District Data Entry Progress</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Live status of data collection across the state</p>
                        </div>
                        <div className="text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                            State Average: 68%
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-700 text-xs uppercase font-semibold text-slate-600 dark:text-slate-300">
                                <tr>
                                    <th className="px-6 py-3">District</th>
                                    <th className="px-6 py-3 text-right">Institutions</th>
                                    <th className="px-6 py-3 text-right">Trainers</th>
                                    <th className="px-6 py-3 text-right">Trainees</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredDistricts.slice(0, 10).map((district, idx) => {
                                    // Mock Data Generation based on index
                                    const instCount = Math.floor(Math.random() * 50) + 10;
                                    const trainerCount = Math.floor(instCount * 2.5);
                                    const traineeCount = Math.floor(trainerCount * 15);
                                    const status = idx % 3 === 0 ? 'Completed' : idx % 3 === 1 ? 'In Progress' : 'Pending Verification';
                                    const statusColor = status === 'Completed' ? 'bg-green-100 text-green-700' : status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700';

                                    return (
                                        <tr key={district} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{district}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-right">{instCount}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-right">{trainerCount}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-right">{traineeCount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                                                {new Date().toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminDashboard;
