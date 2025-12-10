import React from 'react';
import { X, Lightbulb } from 'lucide-react';

interface InsightModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: any;
    type: 'skill' | 'industry' | 'education';
    onViewReport?: () => void;
}

const InsightModal: React.FC<InsightModalProps> = ({ isOpen, onClose, title, data, type, onViewReport }) => {
    if (!isOpen) return null;

    const getContent = () => {
        if (type === 'skill') {
            return (
                <div className="space-y-4">
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2">Gap Analysis Breakdown</h4>
                        <p className="text-sm text-gray-700">
                            {data.skill} is a Top {data.priority} priority skill with a {data.gap}% gap.
                        </p>
                        <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border border-gray-100">
                            {data.priority === 'High' ? (
                                <p><strong>Critical Shortage (&gt;40%):</strong> Immediate intervention required. Local industries struggle to find qualified candidates, leading to potential outsourcing.</p>
                            ) : (
                                <p><strong>Moderate Shortage (20-40%):</strong> Emerging gap. Proactive training programs can prevent this from becoming a critical bottleneck.</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase">Avg Entry Salary</p>
                            <p className="font-bold text-gray-800">₹3.5L - ₹6.0L</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-100 shadow-sm">
                            <p className="text-xs text-gray-500 uppercase">Growth Potential</p>
                            <p className="font-bold text-success">High (+24%)</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Recommended Actions</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>Enroll in certified {data.skill} workshops</li>
                            <li>Build a portfolio project targeting local industries</li>
                            <li>Seek mentorship from {data.priority === 'High' ? 'senior professionals' : 'peers'}</li>
                        </ul>
                    </div>
                </div>
            );
        }
        if (type === 'industry') {
            return (
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500">Current Demand</p>
                            <p className="text-2xl font-bold text-indigo-600">{data.demand}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Avg Salary</p>
                            <p className="text-2xl font-bold text-emerald-600">₹{data.avg_salary}L</p>
                        </div>
                    </div>

                    <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                        <h4 className="font-semibold text-rose-800 mb-1">Talent Gap Alert</h4>
                        <p className="text-sm text-rose-700">
                            There are {data.demand - data.available} unfilled positions in this sector.
                            Opportunity for rapid career advancement.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-2 text-sm">Top Employers in Dakshina Kannada</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Infosys', 'CodeCraft', 'Novigo', 'Robosoft'].map(c => (
                                <span key={c} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">{c}</span>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="space-y-4">
                <p className="text-gray-600">{data.name} offers strong career foundations.</p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-indigo-50 p-3 rounded">
                        <span className="block text-xs text-indigo-500">Students</span>
                        <span className="font-bold text-indigo-700">{data.students}</span>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded">
                        <span className="block text-xs text-indigo-500">Share</span>
                        <span className="font-bold text-indigo-700">{data.percentage}%</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-primary p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Lightbulb size={20} className="text-warning" />
                        <h3 className="font-bold text-lg">{title}</h3>
                    </div>
                    <button onClick={onClose} className="hover:bg-primary/80 p-1 rounded transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {getContent()}
                </div>
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-2"
                    >
                        Close
                    </button>
                    {onViewReport && (
                        <button
                            onClick={() => {
                                onClose(); // Close modal first
                                onViewReport();
                            }}
                            className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2 rounded ml-2 shadow-sm"
                        >
                            View Detailed Report
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InsightModal;
