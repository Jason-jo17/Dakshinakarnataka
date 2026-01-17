import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Filter, RefreshCw, X, Check, ChevronDown } from "lucide-react";

interface FilterState {
    sector: string;
    industry: string;
    domain: string;
    institution: string;
    branch: string;
    companyType: string;
}

interface HeaderFilterProps {
    currentFilters: FilterState;
    onApply: (filters: FilterState) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function HeaderFilter({ currentFilters, onApply, isOpen, onOpenChange }: HeaderFilterProps) {
    // Local temp state still needed
    const [tempFilters, setTempFilters] = useState<FilterState>(currentFilters);

    useEffect(() => {
        if (!isOpen) {
            setTempFilters(currentFilters);
        }
    }, [currentFilters, isOpen]);

    const handleChange = (key: keyof FilterState, value: string) => {
        setTempFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        onApply(tempFilters);
        onOpenChange(false);
    };

    const handleReset = () => {
        const resetState = {
            sector: 'all',
            industry: 'all',
            branch: 'all',
            domain: 'all',
            institution: 'all',
            companyType: 'all'
        };
        setTempFilters(resetState);
    };

    return (
        <div className="relative inline-block text-left z-50">
            {/* Header Trigger Button */}
            <Button
                variant="outline"
                onClick={() => onOpenChange(!isOpen)}
                className={`flex items-center gap-2 border-slate-200 dark:border-slate-700 ${isOpen ? 'bg-secondary/10 ring-2 ring-secondary/20 border-secondary' : 'bg-surface hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
                <Filter size={16} className={isOpen ? "text-secondary" : "text-icon"} />
                <span className="text-sm font-medium text-text">Filters</span>
                <ChevronDown size={14} className={`text-icon transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Content */}
            {isOpen && (
                <>
                    {/* Backdrop to close on click outside */}
                    <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)}></div>

                    <Card className="absolute right-0 top-full mt-2 w-[90vw] md:w-[600px] bg-surface shadow-xl border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150 z-50 origin-top-right">
                        <CardContent className="p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3 mb-1">
                                <h3 className="font-semibold text-text flex items-center gap-2">
                                    <Filter size={18} className="text-secondary" />
                                    Filter Dashboard Data
                                </h3>
                                <button onClick={() => onOpenChange(false)} className="text-icon hover:text-text">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
                                <Select value={tempFilters.sector} onValueChange={(v) => handleChange('sector', v)}>
                                    <SelectTrigger className="bg-background border-slate-200 dark:border-slate-700"><SelectValue placeholder="Sector" /></SelectTrigger>
                                    <SelectContent className="bg-surface border-slate-200 dark:border-slate-700">
                                        <SelectItem value="all">All Sectors</SelectItem>
                                        <SelectItem value="IT/ITES">IT/ITES</SelectItem>
                                        <SelectItem value="BPO/KPO">BPO/KPO</SelectItem>
                                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                                        <SelectItem value="Construction">Construction</SelectItem>
                                        <SelectItem value="Education">Education</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={tempFilters.industry} onValueChange={(v) => handleChange('industry', v)}>
                                    <SelectTrigger className="bg-background border-slate-200 dark:border-slate-700"><SelectValue placeholder="Industry" /></SelectTrigger>
                                    <SelectContent className="bg-surface border-slate-200 dark:border-slate-700">
                                        <SelectItem value="all">All Industries</SelectItem>
                                        <SelectItem value="Software Development">Software Development</SelectItem>
                                        <SelectItem value="Electronics Manufacturing">Electronics Manufacturing</SelectItem>
                                        <SelectItem value="Automotive Components">Automotive Components</SelectItem>
                                        <SelectItem value="Banking & Finance">Banking & Finance</SelectItem>
                                        <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={tempFilters.branch} onValueChange={(v) => handleChange('branch', v)}>
                                    <SelectTrigger className="bg-background border-slate-200 dark:border-slate-700"><SelectValue placeholder="Branch" /></SelectTrigger>
                                    <SelectContent className="bg-surface border-slate-200 dark:border-slate-700">
                                        <SelectItem value="all">All Branches</SelectItem>
                                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        <SelectItem value="Information Science">Information Science</SelectItem>
                                        <SelectItem value="Electronics & Communication">Electronics & Comm</SelectItem>
                                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                                        <SelectItem value="Data Science">Artificial Intelligence & DS</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={tempFilters.domain} onValueChange={(v) => handleChange('domain', v)}>
                                    <SelectTrigger className="bg-background border-slate-200 dark:border-slate-700"><SelectValue placeholder="Skill Domain" /></SelectTrigger>
                                    <SelectContent className="bg-surface border-slate-200 dark:border-slate-700">
                                        <SelectItem value="all">All Skills</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Java/Spring">Java</SelectItem>
                                        <SelectItem value="React">React</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                                        <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                                        <SelectItem value="DevOps">DevOps</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={tempFilters.institution} onValueChange={(v) => handleChange('institution', v)}>
                                    <SelectTrigger className="bg-background border-slate-200 dark:border-slate-700"><SelectValue placeholder="Institution" /></SelectTrigger>
                                    <SelectContent className="bg-surface border-slate-200 dark:border-slate-700">
                                        <SelectItem value="all">All Institutions</SelectItem>
                                        <SelectItem value="NITK Surathkal">NITK Surathkal</SelectItem>
                                        <SelectItem value="Srinivas Institute">Srinivas Institute</SelectItem>
                                        <SelectItem value="Sahyadri College">Sahyadri College</SelectItem>
                                        <SelectItem value="Mangalore Institute">Mangalore Institute (MITE)</SelectItem>
                                        <SelectItem value="Canara Engineering">Canara Engineering College</SelectItem>
                                        <SelectItem value="St Joseph College">St Joseph Engineering College</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={tempFilters.companyType} onValueChange={(v) => handleChange('companyType', v)}>
                                    <SelectTrigger className="bg-background border-slate-200 dark:border-slate-700"><SelectValue placeholder="Company Type" /></SelectTrigger>
                                    <SelectContent className="bg-surface border-slate-200 dark:border-slate-700">
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="MNC">MNC</SelectItem>
                                        <SelectItem value="Startup">Startup</SelectItem>
                                        <SelectItem value="SME">SME</SelectItem>
                                        <SelectItem value="Govt/Public">Govt/Public Sector</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                                <Button variant="ghost" size="sm" onClick={handleReset} className="text-icon hover:text-text">
                                    <RefreshCw size={14} className="mr-2" /> Reset
                                </Button>
                                <Button onClick={handleApply} className="bg-secondary hover:brightness-110 text-white">
                                    <Check size={16} className="mr-2" /> Apply Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
