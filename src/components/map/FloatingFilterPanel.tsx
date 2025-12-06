import React, { useState } from 'react';
import { Filter, X, Award, Users, Briefcase } from 'lucide-react';

interface FloatingFilterPanelProps {
    selectedDomains: string[];
    onToggleDomain: (domain: string) => void;
    selectedTools: string[];
    onToggleTool: (tool: string) => void;
    selectedDegrees: string[];
    onToggleDegree: (degree: string) => void;
    showCoeOnly: boolean;
    onToggleCoe: () => void;
    showPopulationView: boolean;
    onTogglePopulationView: () => void;
    showJobs: boolean;
    onToggleJobs: () => void;
    className?: string;
}

const DOMAINS = [
    'Software Development', 'AI', 'Data Engineering', 'Networking', 'Embedded Systems',
    'IoT', 'Robotics', 'Design', 'PDIET', 'Biotechnology', 'Agriculture Tech',
    'Hospitality', 'Logistics', 'Healthcare', 'Business', 'Construction'
];

const POPULAR_TOOLS = [
    'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker', 'AutoCAD', 'MATLAB', 'CNC', 'Welding',
    'Excel', 'Tally', 'ERP', 'Power BI', 'Revit', 'Primavera', 'GIS', 'SAP'
];

const DEGREES = ['BE', 'B.Tech', 'M.Tech', 'MBA', 'MCA', 'BBA', 'BCA', 'Diploma', 'ITI', 'PhD', 'Medical', 'Nursing'];

export const FloatingFilterPanel: React.FC<FloatingFilterPanelProps> = ({
    selectedDomains,
    onToggleDomain,
    selectedTools,
    onToggleTool,
    selectedDegrees,
    onToggleDegree,
    showCoeOnly,
    onToggleCoe,
    showPopulationView,
    onTogglePopulationView,
    showJobs,
    onToggleJobs,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasMoved, setHasMoved] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        const element = e.currentTarget as HTMLElement;
        const rect = element.getBoundingClientRect();
        const parentRect = element.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };

        let currentX = position.x;
        let currentY = position.y;

        if (!hasMoved) {
            currentX = rect.left - parentRect.left;
            currentY = rect.top - parentRect.top;
            setPosition({ x: currentX, y: currentY });
            setHasMoved(true);
        }

        setIsDragging(true);
        setDragOffset({
            x: e.clientX - currentX,
            y: e.clientY - currentY
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove as any);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove as any);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={`absolute bg-white p-2 rounded-md shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors ${className}`}
                style={hasMoved ? { left: position.x, top: position.y } : { right: '1rem', top: '1rem' }}
                title="Open Filters"
            >
                <Filter className="w-5 h-5 text-slate-600" />
            </button>
        );
    }

    return (
        <div
            style={hasMoved ? { left: position.x, top: position.y } : { right: '1rem', top: '1rem' }}
            className={`absolute z-[1000] w-72 bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col max-h-[85vh] ${className}`}
        >
            <div
                onMouseDown={handleMouseDown}
                className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-lg cursor-move select-none"
            >
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 pointer-events-none">
                    <Filter className="w-4 h-4 text-primary" />
                    Filters
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar space-y-5">
                {/* Toggles */}
                <div className="space-y-2">
                    {/* Jobs Toggle */}
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-md border border-green-100">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-bold text-green-800">View Active Jobs</span>
                        </div>
                        <button
                            onClick={onToggleJobs}
                            className={`w-8 h-4 rounded-full transition-colors relative ${showJobs ? 'bg-green-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${showJobs ? 'left-4.5' : 'left-0.5'}`}></div>
                        </button>
                    </div>

                    {/* COE Toggle */}
                    <div className="flex items-center justify-between p-2 bg-amber-50 rounded-md border border-amber-100">
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-bold text-amber-800">Center of Excellence</span>
                        </div>
                        <button
                            onClick={onToggleCoe}
                            className={`w-8 h-4 rounded-full transition-colors relative ${showCoeOnly ? 'bg-amber-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${showCoeOnly ? 'left-4.5' : 'left-0.5'}`}></div>
                        </button>
                    </div>

                    {/* Population View Toggle */}
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md border border-blue-100">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-blue-800">Population View (Seats)</span>
                        </div>
                        <button
                            onClick={onTogglePopulationView}
                            className={`w-8 h-4 rounded-full transition-colors relative ${showPopulationView ? 'bg-blue-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${showPopulationView ? 'left-4.5' : 'left-0.5'}`}></div>
                        </button>
                    </div>
                </div>

                {/* Domain Filter */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase">By Domain / Sector</p>
                        {selectedDomains.length > 0 && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                                {selectedDomains.length}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {DOMAINS.map(domain => (
                            <button
                                key={domain}
                                onClick={() => onToggleDomain(domain)}
                                className={`text-[11px] px-2.5 py-1.5 rounded-md border transition-all font-medium text-left ${selectedDomains.includes(domain)
                                    ? 'bg-primary text-white border-primary shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:bg-slate-50'
                                    }`}
                            >
                                {domain}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Degree Filter */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase">By Degree</p>
                        {selectedDegrees.length > 0 && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">
                                {selectedDegrees.length}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {DEGREES.map(degree => (
                            <button
                                key={degree}
                                onClick={() => onToggleDegree(degree)}
                                className={`text-[11px] px-2.5 py-1.5 rounded-md border transition-all font-medium text-left ${selectedDegrees.includes(degree)
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-purple-500/30 hover:bg-slate-50'
                                    }`}
                            >
                                {degree}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tool Filter */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase">By Tool</p>
                        {selectedTools.length > 0 && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                                {selectedTools.length}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {POPULAR_TOOLS.map(tool => (
                            <button
                                key={tool}
                                onClick={() => onToggleTool(tool)}
                                className={`text-[11px] px-2.5 py-1.5 rounded-md border transition-all font-medium text-left ${selectedTools.includes(tool)
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500/30 hover:bg-slate-50'
                                    }`}
                            >
                                {tool}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {(selectedDomains.length > 0 || selectedTools.length > 0 || selectedDegrees.length > 0 || showCoeOnly) && (
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-lg text-center">
                    <p className="text-[10px] text-slate-500">
                        Showing filtered results
                    </p>
                </div>
            )}
        </div>
    );
};
