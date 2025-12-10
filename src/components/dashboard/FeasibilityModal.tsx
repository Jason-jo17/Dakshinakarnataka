// INSTITUTIONS import removed
import { X, CheckCircle2, MapPin } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeasibilityModalProps {
    onClose: () => void;
    onApprove: () => void;
    type: 'CoE' | 'Outreach';
    title: string;
}

const FeasibilityModal: React.FC<FeasibilityModalProps> = ({ onClose, onApprove, type, title }) => {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="bg-primary p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Feasibility Check: {title}
                        </h2>
                        <p className="text-white/80 text-sm mt-1">AI-Driven Validation Report</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800 text-center">
                            <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Student Density</h4>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">High</p>
                            <span className="text-xs text-emerald-700 dark:text-emerald-300">12,000+ local</span>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-center">
                            <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Industry Proximity</h4>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">8 km</p>
                            <span className="text-xs text-blue-700 dark:text-blue-300">Avg distance</span>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800 text-center">
                            <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Skill Gap</h4>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">Critical</p>
                            <span className="text-xs text-amber-700 dark:text-amber-300">40% shortage</span>
                        </div>
                    </div>

                    {/* Impact Analysis */}
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white mb-3">Projected Impact</h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                <CheckCircle2 className="text-success shrink-0 mt-0.5" size={18} />
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Talent Pipeline</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Expected to train 450+ students annually in specific domain skills.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                <CheckCircle2 className="text-success shrink-0 mt-0.5" size={18} />
                                <div>
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">Placement Boost</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Projected 15% increase in campus placements for associated colleges.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Visualization Placeholder */}
                    {/* Geometric Cluster Analysis */}
                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-white font-bold flex items-center gap-2">
                                <MapPin className="text-blue-400" size={18} />
                                Geometric Cluster Analysis
                            </h4>
                            <span className="text-xs text-slate-400">Spatial optimization for {type}</span>
                        </div>

                        <div className="h-64 w-full bg-slate-950/50 rounded-lg border border-slate-800 p-2 relative overflow-hidden">
                            {/* Legend */}
                            <div className="absolute top-2 right-2 bg-slate-900/80 p-2 rounded border border-slate-700 z-10 text-xs">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> <span className="text-slate-300">Colleges</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div> <span className="text-slate-300">Industry Hubs</span>
                                </div>
                            </div>

                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis type="number" dataKey="x" name="Longitude" hide domain={[0, 100]} />
                                    <YAxis type="number" dataKey="y" name="Latitude" hide domain={[0, 100]} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />

                                    {/* Simulated Clusters */}
                                    <Scatter name="Colleges" data={[
                                        { x: 30, y: 70 }, { x: 35, y: 65 }, { x: 25, y: 75 }, { x: 40, y: 60 }, // Cluster 1
                                        { x: 80, y: 30 }, { x: 85, y: 35 }, { x: 75, y: 25 }, // Cluster 2
                                        { x: 50, y: 50 }, // Outlier
                                    ]} fill="#3b82f6" />

                                    <Scatter name="Industry Hubs" data={[
                                        { x: 32, y: 68 }, // Near Cluster 1 ~ High Feasibility
                                        { x: 82, y: 32 }, // Near Cluster 2
                                        { x: 60, y: 20 },
                                    ]} fill="#22c55e" shape="star" />

                                    {/* CoE Optimal Location Marker */}
                                    <Scatter name="Optimal CoE Location" data={[{ x: 33, y: 67 }]} fill="#f59e0b" shape="cross" />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                        <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 rounded transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                onApprove();
                            }}
                            className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded shadow-lg transition-transform active:scale-95 font-semibold flex items-center gap-2"
                        >
                            <CheckCircle2 size={18} />
                            Approve & Generate Proposal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeasibilityModal;
