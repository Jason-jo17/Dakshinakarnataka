import React from 'react';
import { Award, MapPin, ExternalLink, Cpu, Beaker, GraduationCap, Settings, CreditCard } from 'lucide-react';
import { INSTITUTIONS } from '../../data/institutions';

interface COEViewProps {
    onNavigate: (view: 'map' | 'dashboard' | 'institutions', id?: string) => void;
}

const COEView: React.FC<COEViewProps> = ({ onNavigate }) => {
    // Filter for "COE-like" institutions
    const coes = INSTITUTIONS.filter(inst =>
        inst.category === 'University' ||
        inst.category === 'Research' ||
        (inst.category === 'Engineering' && inst.name.includes('NITK')) ||
        (inst.category === 'Engineering' && inst.name.includes('Sahyadri'))
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Centers of Excellence</h1>
                <p className="text-slate-500 dark:text-slate-400">Specialized hubs for advanced research, innovation, and skill development.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Manual Highlight Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg col-span-1 md:col-span-2 lg:col-span-3 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="text-yellow-400" />
                            <span className="font-bold text-blue-100 uppercase tracking-wide text-xs">Flagship Hub</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Karnataka Digital Economy Mission (KDEM)</h2>
                        <p className="text-blue-100 max-w-2xl">
                            The primary node for the "Beyond Bengaluru" initiative, driving the growth of the Mangaluru Fintech and IT cluster.
                        </p>
                    </div>
                    <button
                        onClick={() => onNavigate('map')}
                        className="px-6 py-3 bg-white text-blue-800 font-bold rounded-lg shadow hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                        View Hub Details
                    </button>
                </div>

                {/* List of COEs */}
                {coes.map(inst => (
                    <div key={inst.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-32 bg-slate-100 dark:bg-slate-700 relative">
                            {/* Placeholder pattern/image */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
                            <div className="absolute top-4 left-4 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                                {inst.category === 'Research' ? <Beaker size={20} className="text-purple-600" /> :
                                    inst.category === 'University' ? <GraduationCap size={20} className="text-blue-600" /> :
                                        <Cpu size={20} className="text-orange-600" />}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1" title={inst.name}>{inst.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-slate-500 mb-4">
                                <MapPin size={14} />
                                {inst.location.area}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="text-sm">
                                    <span className="text-slate-500">Focus Area:</span>
                                    <span className="ml-2 font-medium text-slate-800 dark:text-slate-200">
                                        {inst.category === 'Research' ? 'Advanced Materials' : 'Cybersecurity & AI'}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-slate-500">Industry Partners:</span>
                                    <span className="ml-2 font-medium text-slate-800 dark:text-slate-200">3 Active</span>
                                </div>
                            </div>

                            <button
                                onClick={() => onNavigate('map', inst.id)}
                                className="w-full py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2"
                            >
                                Visit Profile <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Placeholder COEs to fill grid if filters are empty */}
                {[1, 2].map((i) => (
                    <div key={`mock-${i}`} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden opacity-75">
                        <div className="h-32 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center">
                            <span className="text-slate-400 font-medium">Coming Soon</span>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Future COE Node {i}</h3>
                            <p className="text-sm text-slate-500">Planned expansion for Marine Engineering and Fisheries technology.</p>
                        </div>
                    </div>
                ))}
                {/* Recommended / Priority COEs from Strategy */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recommended Centers of Excellence</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30 flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-lg text-purple-600 dark:text-purple-200">
                                <Cpu size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">AI & Robotics Center</h3>
                                <p className="text-xs text-slate-500">Proposed for NITK Surathkal</p>
                            </div>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-xl border border-orange-100 dark:border-orange-900/30 flex items-center gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-800 rounded-lg text-orange-600 dark:text-orange-200">
                                <Settings size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Auto-Component Hub</h3>
                                <p className="text-xs text-slate-500">Proposed for Canara Engineering</p>
                            </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-200">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">FinTech Lab</h3>
                                <p className="text-xs text-slate-500">Proposed for St. Aloysius</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default COEView;
