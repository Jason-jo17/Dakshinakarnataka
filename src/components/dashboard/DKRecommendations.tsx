import React, { useState } from 'react';
import { X, Sparkles, MapPin, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import FeasibilityModal from './FeasibilityModal';
import ProposalModal from './ProposalModal';



interface DKRecommendationsProps {
    onClose: () => void;
}

const DKRecommendations: React.FC<DKRecommendationsProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'coe' | 'outreach'>('coe');
    const [activeModal, setActiveModal] = useState<'feasibility' | 'proposal' | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleAction = (item: any, action: 'feasibility' | 'proposal') => {
        setSelectedItem(item);
        setActiveModal(action);
    };

    // Simulate AI Analysis Data based on "real" patterns in the mock data
    // Logic: Puttur has agriculture, needs IoT. Mangalore has IT, needs AI specialization.
    const coeRecommendations = [
        {
            id: 1,
            title: "IoT & Agri-Tech CoE",
            location: "Puttur",
            institution: "VC Puttur",
            reasoning: "High density of agricultural industries (CAMPCO, Bindu) but low supply of embedded systems talent. 12,000+ students available.",
            impact: "High",
            type: "Infrastructure",
            partner: "CAMPCO"
        },
        {
            id: 2,
            title: "FinTech & Blockchain Lab",
            location: "Mangaluru",
            institution: "St. Joseph (SJEC)",
            reasoning: "Proximity to banking hubs (Karnataka Bank HQ). Current CS curriculum lacks specialized financial engineering modules.",
            impact: "Medium",
            type: "Curriculum",
            partner: "Karnataka Bank"
        },
        {
            id: 3,
            title: "Marine Engineering Research",
            location: "Surathkal",
            institution: "NITK Surathkal",
            reasoning: "Leverage NMPT port proximity. Critical shortage of naval architects reported by local shipping logistics firms.",
            impact: "High",
            type: "Research",
            partner: "NMPT"
        }
    ];

    const outreachRecommendations = [
        {
            id: 1,
            company: "Tesla / Ather Energy",
            sector: "EV Manufacturing",
            match: "98% Fit",
            reasoning: "Excess supply of Mechanical & Electrical engineers in Belthangady/Puttur. Low local demand leading to brain drain.",
            action: "Host Campus Drive"
        },
        {
            id: 2,
            company: "Zoho Corp",
            sector: "SaaS Product",
            match: "92% Fit",
            reasoning: "Strong pool of Tier-2/3 college talent with raw coding skills. Matches Zoho's rural hiring model perfectly.",
            action: "Setup Satellite Office"
        }
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shrink-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-yellow-300 animate-pulse" />
                            <h2 className="text-xl font-bold">DK Intelligence Recommendations</h2>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-white/80 text-sm mt-2">
                        AI-driven policy suggestions to bridge the gap between Education Supply and Industry Demand.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-slate-700 shrink-0">
                    <button
                        onClick={() => setActiveTab('coe')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'coe'
                            ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50 dark:bg-slate-700 dark:text-violet-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        Accreditation & CoE Strategy
                    </button>
                    <button
                        onClick={() => setActiveTab('outreach')}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'outreach'
                            ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50 dark:bg-slate-700 dark:text-violet-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                    >
                        Industry Outreach Targets
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-900/50">
                    {activeTab === 'coe' ? (
                        <div className="space-y-4">
                            {coeRecommendations.map(rec => (
                                <div key={rec.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <span className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                                                <Building size={20} />
                                            </span>
                                            <div>
                                                <h3 className="font-bold text-gray-800 dark:text-gray-200">{rec.title}</h3>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <MapPin size={12} /> {rec.location} • {rec.institution}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${rec.impact === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {rec.impact} Impact
                                        </span>
                                    </div>
                                    <div className="mt-3 pl-11">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {rec.reasoning}
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={() => handleAction({ title: rec.title, college: rec.location }, 'feasibility')}
                                                className="text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
                                            >
                                                View Feasibility
                                            </button>
                                            <button
                                                onClick={() => handleAction({ title: rec.title, college: rec.institution }, 'proposal')}
                                                className="text-xs font-semibold bg-violet-600 text-white px-3 py-1.5 rounded hover:bg-violet-700 transition-colors flex items-center gap-1"
                                            >
                                                <CheckCircle2 size={12} /> Approve Proposal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {outreachRecommendations.map(rec => (
                                <div key={rec.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 border-l-4 border-l-indigo-500">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{rec.company}</h3>
                                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">
                                                {rec.sector}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-2xl font-bold text-emerald-600">{rec.match}</span>
                                            <span className="text-xs text-gray-500">Talent Match</span>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-slate-700 pt-3">
                                        {rec.reasoning}
                                    </p>
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            onClick={() => handleAction({ title: `Hiring Partnership with ${rec.company}`, college: rec.company }, 'proposal')}
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                        >
                                            Initiate {rec.action} <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Nested Modals */}
            {activeModal === 'feasibility' && selectedItem && (
                <FeasibilityModal
                    title={selectedItem.title}
                    type="CoE"
                    onClose={() => setActiveModal(null)}
                    onApprove={() => setActiveModal('proposal')}
                />
            )}

            {activeModal === 'proposal' && selectedItem && (
                <ProposalModal
                    title={selectedItem.title}
                    recipientName={selectedItem.college}
                    onClose={() => setActiveModal(null)}
                />
            )}
        </div>
    );
};

export default DKRecommendations;
