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
                className={`flex items-center gap-2 border-slate-200 ${isOpen ? 'bg-slate-100 ring-2 ring-blue-100 border-blue-300' : 'bg-white hover:bg-slate-50'}`}
            >
                <Filter size={16} className={isOpen ? "text-blue-600" : "text-slate-500"} />
                <span className="text-sm font-medium text-slate-700">Filters</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Content */}
            {isOpen && (
                <>
                    {/* Backdrop to close on click outside */}
                    <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)}></div>

                    <Card className="absolute right-0 top-full mt-2 w-[90vw] md:w-[600px] bg-white shadow-xl border-slate-200 animate-in fade-in zoom-in-95 duration-150 z-50 origin-top-right">
                        <CardContent className="p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b pb-3 mb-1">
                                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                    <Filter size={18} className="text-blue-600" />
                                    Filter Dashboard Data
                                </h3>
                                <button onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-1">
                                <Select value={tempFilters.sector} onValueChange={(v) => handleChange('sector', v)}>
                                    <SelectTrigger><SelectValue placeholder="Sector" /></SelectTrigger>
                                    <SelectContent>
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
                                    <SelectTrigger><SelectValue placeholder="Industry" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Industries</SelectItem>
                                        <SelectItem value="Software Development">Software Development</SelectItem>
                                        <SelectItem value="Electronics Manufacturing">Electronics Manufacturing</SelectItem>
                                        <SelectItem value="Automotive Components">Automotive Components</SelectItem>
                                        <SelectItem value="Banking & Finance">Banking & Finance</SelectItem>
                                        <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={tempFilters.branch} onValueChange={(v) => handleChange('branch', v)}>
                                    <SelectTrigger><SelectValue placeholder="Branch" /></SelectTrigger>
                                    <SelectContent>
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
                                    <SelectTrigger><SelectValue placeholder="Skill Domain" /></SelectTrigger>
                                    <SelectContent>
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
                                    <SelectTrigger><SelectValue placeholder="Institution" /></SelectTrigger>
                                    <SelectContent>
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
                                    <SelectTrigger><SelectValue placeholder="Company Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="MNC">MNC</SelectItem>
                                        <SelectItem value="Startup">Startup</SelectItem>
                                        <SelectItem value="SME">SME</SelectItem>
                                        <SelectItem value="Govt/Public">Govt/Public Sector</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t mt-2">
                                <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500">
                                    <RefreshCw size={14} className="mr-2" /> Reset
                                </Button>
                                <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
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
