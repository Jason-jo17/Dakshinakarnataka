import React, { useState } from 'react';
import { X, Search, CheckCircle2, Circle, Building2, MapPin } from 'lucide-react';
import { INSTITUTIONS } from '../../data/institutions';

interface PartnerSelectionModalProps {
    onClose: () => void;
    onConfirm: (selectedInstitutions: any[]) => void; // Using any[] for now, ideally Institution type
    sector?: string; // e.g., "Engineering", "Research" to filter initial list
}

const PartnerSelectionModal: React.FC<PartnerSelectionModalProps> = ({ onClose, onConfirm, sector }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Filter institutions - exclude Companies, focusing on education partners
    const filteredInstitutions = INSTITUTIONS.filter(inst =>
        inst.category !== 'Company' &&
        (inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inst.location.area.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleConfirm = () => {
        const selected = INSTITUTIONS.filter(inst => selectedIds.has(inst.id));
        onConfirm(selected);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-indigo-600 p-6 rounded-t-xl text-white flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold">Select Partner Institutions</h2>
                        <p className="text-indigo-100 text-sm mt-1">Choose colleges to include in this MoU proposal</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-indigo-500 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Search & Stats */}
                <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 shrink-0">
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search colleges by name or location..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                        <span>{filteredInstitutions.length} institutions found</span>
                        <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                            {selectedIds.size} selected
                        </span>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="space-y-2">
                        {filteredInstitutions.map((inst) => {
                            const isSelected = selectedIds.has(inst.id);
                            return (
                                <div
                                    key={inst.id}
                                    onClick={() => toggleSelection(inst.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-4 ${isSelected
                                            ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-500'
                                            : 'bg-white border-gray-200 hover:border-indigo-300 dark:bg-slate-800 dark:border-slate-700'
                                        }`}
                                >
                                    <div className={`p-2 rounded-full shrink-0 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}>
                                        {isSelected ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 dark:text-white">{inst.name}</h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            <span className="flex items-center gap-1"><Building2 size={12} /> {inst.category}</span>
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {inst.location.area}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-xl flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={selectedIds.size === 0}
                        className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Generate Proposal ({selectedIds.size})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartnerSelectionModal;
