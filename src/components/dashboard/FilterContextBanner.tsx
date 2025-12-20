import { MapPin, Users, GraduationCap, Building2, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

interface FilterContextBannerProps {
    filters: {
        sector: string;
        industry: string;
        domain: string;
        institution: string;
        branch: string;
        companyType: string;
    };
    onNavigate: (view: any, tab?: string) => void;
}

export default function FilterContextBanner({ filters, onNavigate }: FilterContextBannerProps) {
    if (filters.institution === 'all' && filters.sector === 'all' && filters.industry === 'all') return null;

    // Logic to determine what to show
    const isInstitutionSelected = filters.institution !== 'all';

    // Mock Data Lookup (In real app, find from dashboardData)
    const institutionDetails = {
        name: filters.institution,
        location: "Mangaluru, DK",
        principal: "Dr. Smith",
        students: 4500,
        established: 1960,
        description: "A premier engineering institute in the region known for high placement rates."
    };

    if (isInstitutionSelected) {
        return (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                    <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                                <Building2 className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    {institutionDetails.name}
                                    <span className="text-xs font-normal px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">Autonomous</span>
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mt-1">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {institutionDetails.location}</span>
                                    <span className="flex items-center gap-1"><Users size={14} /> {institutionDetails.students.toLocaleString()} Students</span>
                                    <span className="flex items-center gap-1"><GraduationCap size={14} /> Est. {institutionDetails.established}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 max-w-2xl">
                                    {institutionDetails.description} Showing specific insights for this institution.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                            <Button
                                variant="outline"
                                className="bg-white hover:bg-slate-50 border-slate-300 text-slate-700 w-full md:w-auto"
                                onClick={() => window.open(`https://google.com/maps/search/${filters.institution}`, '_blank')}
                            >
                                <ExternalLink size={14} className="mr-2" /> Website
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto shadow-md hover:shadow-lg transition-all"
                                onClick={() => onNavigate('map', 'institutions')} // Assuming onNavigate can switch views
                            >
                                <MapPin size={16} className="mr-2" /> Navigate to Map
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Generic fallback for other filters if needed
    return (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 hidden md:block">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md border border-slate-200">
                        <FilterIcon filters={filters} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-slate-700">Filtered View Active</div>
                        <div className="text-xs text-slate-500">
                            Showing data for
                            {filters.sector !== 'all' && <span className="font-medium text-slate-900 mx-1">{filters.sector}</span>}
                            {filters.industry !== 'all' && <span className="font-medium text-slate-900 mx-1">{filters.industry}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FilterIcon({ filters }: { filters: any }) {
    if (filters.sector !== 'all') return <BriefcaseIcon />;
    return <FilterGenericIcon />;
}

const BriefcaseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);
const FilterGenericIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
);
