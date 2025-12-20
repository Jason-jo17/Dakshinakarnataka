import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Filter, RefreshCw, X, Check } from "lucide-react";

interface FilterState {
    sector: string;
    industry: string;
    domain: string;
    institution: string;
    branch: string;
    companyType: string;
}

interface FloatingFilterProps {
    currentFilters: FilterState;
    onApply: (filters: FilterState) => void;
}

export default function FloatingFilter({ currentFilters, onApply }: FloatingFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    // Temporary state to hold changes before applying
    const [tempFilters, setTempFilters] = useState<FilterState>(currentFilters);
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 100 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<HTMLDivElement>(null);
    const dragStartPos = useRef({ x: 0, y: 0 });

    // Sync temp filters when prop changes (if not open, or force sync logic)
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
        setIsOpen(false);
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
        // Optional: Auto apply on reset? Or let user click apply. Let's let them click apply or apply immediately? 
        // User asked for "submit option", so let's keep it manual.
    };

    // Simple Drag Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        if (isOpen) return; // Disable drag when open to prevent issues interacting with form
        setIsDragging(true);
        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            e.preventDefault();
            setPosition({
                x: e.clientX - dragStartPos.current.x,
                y: e.clientY - dragStartPos.current.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={dragRef}
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 50
            }}
            className="flex flex-col items-end"
        >
            {/* Toggle Button (Draggable Handle) */}
            {!isOpen && (
                <div
                    onMouseDown={handleMouseDown}
                    className="cursor-move shadow-xl rounded-full transition-transform hover:scale-105 active:scale-95 bg-blue-600 text-white p-4 flex items-center justify-center pointer-events-auto"
                    title="Drag me! Click to simple filter."
                >
                    <Filter size={24} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                </div>
            )}

            {/* Expanded Form */}
            {isOpen && (
                <Card className="w-[350px] md:w-[600px] shadow-2xl border-slate-200 animate-in zoom-in-95 duration-200 origin-bottom-right">
                    <CardContent className="p-4 flex flex-col gap-4 relative">
                        <div className="flex items-center justify-between border-b pb-3 mb-1">
                            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                <Filter size={18} className="text-blue-600" />
                                Filter Dashboard
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select value={tempFilters.sector} onValueChange={(v) => handleChange('sector', v)}>
                                <SelectTrigger><SelectValue placeholder="Sector" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sectors</SelectItem>
                                    <SelectItem value="IT/ITES">IT/ITES</SelectItem>
                                    <SelectItem value="BPO/KPO">BPO/KPO</SelectItem>
                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={tempFilters.industry} onValueChange={(v) => handleChange('industry', v)}>
                                <SelectTrigger><SelectValue placeholder="Industry" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Industries</SelectItem>
                                    <SelectItem value="Software Development">Software Development</SelectItem>
                                    <SelectItem value="Electronics Manufacturing">Electronics Manufacturing</SelectItem>
                                    <SelectItem value="Automotive Components">Automotive Components</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={tempFilters.branch || 'all'} onValueChange={(v) => handleChange('branch', v)}>
                                <SelectTrigger><SelectValue placeholder="Branch" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Branches</SelectItem>
                                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                                    <SelectItem value="Electronics & Communication">Electronics & Comm</SelectItem>
                                    <SelectItem value="Mechanical">Mechanical</SelectItem>
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
                                </SelectContent>
                            </Select>

                            <Select value={tempFilters.institution} onValueChange={(v) => handleChange('institution', v)}>
                                <SelectTrigger><SelectValue placeholder="Institution" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Institutions</SelectItem>
                                    <SelectItem value="NITK Surathkal">NITK Surathkal</SelectItem>
                                    <SelectItem value="Srinivas Institute">Srinivas Institute</SelectItem>
                                    <SelectItem value="Sahyadri College">Sahyadri College</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={tempFilters.companyType || 'all'} onValueChange={(v) => handleChange('companyType', v)}>
                                <SelectTrigger><SelectValue placeholder="Company Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="MNC">MNC</SelectItem>
                                    <SelectItem value="Startup">Startup</SelectItem>
                                    <SelectItem value="SME">SME</SelectItem>
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
            )}

            {/* Click to open trigger (if not open) - overlaying the drag handle but handling click */}
            {!isOpen && (
                <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => {
                        // Prevent click if it was a drag
                        if (!isDragging) setIsOpen(true);
                    }}
                />
            )}
        </div>
    );
}
