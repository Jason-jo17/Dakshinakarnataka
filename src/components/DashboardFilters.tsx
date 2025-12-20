
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Filter, RefreshCw, Search, X, ChevronDown, ChevronUp } from "lucide-react";

interface FilterState {
    sector: string;
    industry: string;
    domain: string;
    institution: string;
    branch?: string;
    companyType?: string;
}

interface DashboardFiltersProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

export default function DashboardFilters({ filters, onFilterChange }: DashboardFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleChange = (key: keyof FilterState, value: string) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const handleReset = () => {
        onFilterChange({
            sector: 'all',
            industry: 'all',
            branch: 'all',
            domain: 'all',
            institution: 'all',
            companyType: 'all'
        });
        setSearchQuery("");
    };

    return (
        <Card className="mb-6 bg-white border-slate-200 shadow-sm transition-all duration-200">
            <CardContent className="p-4 flex flex-col gap-4">
                {/* Top Row: Search Bar & Filter Toggle */}
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search skills, companies, or institutions..."
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle Button */}
                    <Button
                        variant={isExpanded ? "secondary" : "outline"}
                        className={`flex items-center gap-2 h-[42px] px-4 min-w-[120px] justify-between transition-all ${isExpanded ? 'bg-slate-100 text-slate-900 border-slate-300' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className="flex items-center gap-2">
                            <Filter size={18} className={isExpanded ? "text-blue-600" : "text-slate-500"} />
                            <span>Filters</span>
                        </div>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                </div>

                {/* Collapsible Filter Section */}
                {isExpanded && (
                    <div className="flex flex-col gap-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="h-px bg-slate-100 w-full" />

                        {/* First Row: Sector, Industry, Branch */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Sector Filter */}
                            <Select value={filters.sector} onValueChange={(v: string) => handleChange('sector', v)}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Sector" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sectors</SelectItem>
                                    <SelectItem value="IT/ITES">IT/ITES</SelectItem>
                                    <SelectItem value="BPO/KPO">BPO/KPO</SelectItem>
                                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                    <SelectItem value="Automotive">Automotive</SelectItem>
                                    <SelectItem value="Electronics">Electronics & Hardware</SelectItem>
                                    <SelectItem value="Construction">Construction & Infrastructure</SelectItem>
                                    <SelectItem value="Energy">Energy & Power</SelectItem>
                                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                                    <SelectItem value="Telecom">Telecom</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Industry Filter */}
                            <Select value={filters.industry} onValueChange={(v: string) => handleChange('industry', v)}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Industries</SelectItem>
                                    <SelectItem value="Software Development">Software Development</SelectItem>
                                    <SelectItem value="BPO Services">BPO Services</SelectItem>
                                    <SelectItem value="Product Design">Product Design & Development</SelectItem>
                                    <SelectItem value="Electronics Manufacturing">Electronics Manufacturing</SelectItem>
                                    <SelectItem value="Embedded Systems">Embedded Systems</SelectItem>
                                    <SelectItem value="Automation">Industrial Automation</SelectItem>
                                    <SelectItem value="Automotive Components">Automotive Components</SelectItem>
                                    <SelectItem value="Construction Engineering">Construction Engineering</SelectItem>
                                    <SelectItem value="Power Generation">Power Generation & Distribution</SelectItem>
                                    <SelectItem value="Data Analytics">Data Analytics & BI</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Engineering Branch Filter */}
                            <Select value={filters.branch || 'all'} onValueChange={(v: string) => handleChange('branch', v)}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Engineering Branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Branches</SelectItem>
                                    <SelectItem value="Computer Science">Computer Science & Engineering</SelectItem>
                                    <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                                    <SelectItem value="Electrical & Electronics">Electrical & Electronics</SelectItem>
                                    <SelectItem value="Mechanical">Mechanical Engineering</SelectItem>
                                    <SelectItem value="Civil">Civil Engineering</SelectItem>
                                    <SelectItem value="Information Science">Information Science & Engineering</SelectItem>
                                    <SelectItem value="Instrumentation">Instrumentation Engineering</SelectItem>
                                    <SelectItem value="Chemical">Chemical Engineering</SelectItem>
                                    <SelectItem value="Industrial">Industrial Engineering</SelectItem>
                                    <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Second Row: Domain/Skills, Institution, Date */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Domain/Skill Filter - Comprehensive */}
                            <Select value={filters.domain} onValueChange={(v: string) => handleChange('domain', v)}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Skill Domain" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    <SelectItem value="all">All Skills</SelectItem>

                                    {/* Software/IT Skills */}
                                    <SelectItem value="SoftwareDev_Header" disabled className="font-semibold text-blue-700 opacity-100">— Software Development —</SelectItem>
                                    <SelectItem value="Python">Python Programming</SelectItem>
                                    <SelectItem value="Java/Spring">Java & Spring Boot</SelectItem>
                                    <SelectItem value="JavaScript">JavaScript & TypeScript</SelectItem>
                                    <SelectItem value="React">React.js / Frontend</SelectItem>
                                    <SelectItem value="Node.js">Node.js / Backend</SelectItem>
                                    <SelectItem value="Full Stack MERN">Full Stack MERN</SelectItem>
                                    <SelectItem value=".NET">.NET Framework</SelectItem>
                                    <SelectItem value="PHP">PHP & Laravel</SelectItem>

                                    {/* Cloud & DevOps */}
                                    <SelectItem value="Cloud_Header" disabled className="font-semibold text-purple-700 opacity-100">— Cloud & DevOps —</SelectItem>
                                    <SelectItem value="AWS">Amazon Web Services (AWS)</SelectItem>
                                    <SelectItem value="GCP">Google Cloud Platform (GCP)</SelectItem>
                                    <SelectItem value="Azure">Microsoft Azure</SelectItem>
                                    <SelectItem value="Docker">Docker & Containerization</SelectItem>
                                    <SelectItem value="Kubernetes">Kubernetes</SelectItem>
                                    <SelectItem value="CI/CD">CI/CD Pipelines</SelectItem>

                                    {/* Data Science & AI */}
                                    <SelectItem value="Data_Header" disabled className="font-semibold text-green-700 opacity-100">— Data Science & AI —</SelectItem>
                                    <SelectItem value="Data Science">Data Science & Analytics</SelectItem>
                                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                                    <SelectItem value="AI/ML">Artificial Intelligence</SelectItem>
                                    <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                                    <SelectItem value="Data Engineering">Data Engineering</SelectItem>

                                    {/* Electronics & Hardware */}
                                    <SelectItem value="Electronics_Header" disabled className="font-semibold text-orange-700 opacity-100">— Electronics & Hardware —</SelectItem>
                                    <SelectItem value="Embedded Systems">Embedded Systems (C/C++)</SelectItem>
                                    <SelectItem value="PCB Design">PCB Design & Layout</SelectItem>
                                    <SelectItem value="VLSI">VLSI Design</SelectItem>
                                    <SelectItem value="IoT">Internet of Things (IoT)</SelectItem>
                                    <SelectItem value="Robotics">Robotics & Automation</SelectItem>
                                    <SelectItem value="Microcontrollers">Microcontrollers (Arduino, PIC)</SelectItem>
                                    <SelectItem value="FPGA">FPGA Programming</SelectItem>

                                    {/* Mechanical Engineering */}
                                    <SelectItem value="Mechanical_Header" disabled className="font-semibold text-red-700 opacity-100">— Mechanical Engineering —</SelectItem>
                                    <SelectItem value="CAD/CAM">CAD/CAM (AutoCAD, SolidWorks)</SelectItem>
                                    <SelectItem value="CNC">CNC Programming & Machining</SelectItem>
                                    <SelectItem value="3D Printing">3D Printing & Additive Manufacturing</SelectItem>
                                    <SelectItem value="Welding">Precision Welding (MIG/TIG)</SelectItem>
                                    <SelectItem value="Product Design">Product Design & Development</SelectItem>
                                    <SelectItem value="Manufacturing">Manufacturing Processes</SelectItem>
                                    <SelectItem value="HVAC">HVAC Design</SelectItem>

                                    {/* Civil Engineering */}
                                    <SelectItem value="Civil_Header" disabled className="font-semibold text-amber-700 opacity-100">— Civil Engineering —</SelectItem>
                                    <SelectItem value="Structural Analysis">Structural Analysis & Design</SelectItem>
                                    <SelectItem value="Construction Management">Construction Management</SelectItem>
                                    <SelectItem value="AutoCAD Civil">AutoCAD Civil 3D</SelectItem>
                                    <SelectItem value="Revit">Revit Architecture</SelectItem>
                                    <SelectItem value="Project Planning">Project Planning (MS Project, Primavera)</SelectItem>
                                    <SelectItem value="Surveying">Surveying & Geomatics</SelectItem>

                                    {/* Electrical Engineering */}
                                    <SelectItem value="Electrical_Header" disabled className="font-semibold text-yellow-700 opacity-100">— Electrical Engineering —</SelectItem>
                                    <SelectItem value="Power Systems">Power Systems & Protection</SelectItem>
                                    <SelectItem value="PLC">PLC Programming (Siemens, Allen Bradley)</SelectItem>
                                    <SelectItem value="SCADA">SCADA Systems</SelectItem>
                                    <SelectItem value="Electrical Design">Electrical Design (ETAP, EPLAN)</SelectItem>
                                    <SelectItem value="Renewable Energy">Solar & Wind Energy Systems</SelectItem>

                                    {/* Soft Skills */}
                                    <SelectItem value="Soft_Header" disabled className="font-semibold text-slate-700 opacity-100">— Professional Skills —</SelectItem>
                                    <SelectItem value="Communication">Communication Skills</SelectItem>
                                    <SelectItem value="Project Management">Project Management</SelectItem>
                                    <SelectItem value="MS Office">MS Office & Excel</SelectItem>
                                    <SelectItem value="Technical Writing">Technical Writing</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Institution Filter - All 10 Dakshina Kannada Colleges */}
                            <Select value={filters.institution} onValueChange={(v: string) => handleChange('institution', v)}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Institution" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Institutions</SelectItem>
                                    <SelectItem value="NITK Surathkal">NITK Surathkal (NIRF #17)</SelectItem>
                                    <SelectItem value="Srinivas Institute">Srinivas Institute of Technology</SelectItem>
                                    <SelectItem value="St Joseph Engineering">St Joseph Engineering College</SelectItem>
                                    <SelectItem value="Sahyadri College">Sahyadri College of Engineering</SelectItem>
                                    <SelectItem value="Yenepoya Institute">Yenepoya Institute of Technology</SelectItem>
                                    <SelectItem value="Bearys Institute">Bearys Institute of Technology</SelectItem>
                                    <SelectItem value="Canara Engineering">Canara Engineering College</SelectItem>
                                    <SelectItem value="PA College">PA College of Engineering</SelectItem>
                                    <SelectItem value="Shree Devi Institute">Shree Devi Institute of Technology</SelectItem>
                                    <SelectItem value="AJ Institute">AJ Institute of Engineering</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Company Type Filter */}
                            <Select value={filters.companyType || 'all'} onValueChange={(v: string) => handleChange('companyType', v)}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Company Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Company Types</SelectItem>
                                    <SelectItem value="GCC">Global Capability Center (GCC)</SelectItem>
                                    <SelectItem value="Large Enterprise">Large Enterprise (2000+ employees)</SelectItem>
                                    <SelectItem value="SME">SME (Small & Medium)</SelectItem>
                                    <SelectItem value="Startup">Startup</SelectItem>
                                    <SelectItem value="MNC">MNC (Multinational)</SelectItem>
                                    <SelectItem value="Indian IT Services">Indian IT Services</SelectItem>
                                    <SelectItem value="Product Company">Product Company</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reset Button - Moved to bottom right of expanded section */}
                        <div className="flex justify-end pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                onClick={handleReset}
                            >
                                <RefreshCw size={14} className="mr-2" />
                                Reset All Filters
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card >
    );
}
