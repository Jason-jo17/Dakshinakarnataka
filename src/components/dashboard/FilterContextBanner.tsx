import { Card, CardContent } from "../ui/card";
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
    onTabChange: (tab: string) => void;
}

export default function FilterContextBanner({ filters, onNavigate, onTabChange }: FilterContextBannerProps) {
    if (Object.values(filters).every(v => v === 'all')) return null;

    const banners = [];

    // Helper to create banner object
    const createBanner = (key: string, data: { title: string, subtitle: string, icon: any, stats: any[], action: any }) => (
        <div key={key} className="mb-4 animate-in fade-in slide-in-from-top-2">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                            <data.icon className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                {data.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mt-1">
                                {data.stats.map((stat: any, i: number) => (
                                    <span key={i} className="flex items-center gap-1">
                                        {stat.icon && <stat.icon size={14} />} {stat.label}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 max-w-2xl">
                                {data.subtitle}
                            </p>
                        </div>
                    </div>
                    {data.action && (
                        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                            {data.action}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    // 1. Institution
    if (filters.institution !== 'all') {
        const institutionDetails = {
            name: filters.institution,
            location: "Mangaluru, DK",
            students: 4500,
            established: 1960,
            description: "Showing specific insights for this institution."
        };
        banners.push(createBanner('institution', {
            title: institutionDetails.name,
            subtitle: institutionDetails.description,
            icon: Building2,
            stats: [
                { label: institutionDetails.location, icon: MapPin },
                { label: `${institutionDetails.students.toLocaleString()} Students`, icon: Users },
                { label: `Est. ${institutionDetails.established}`, icon: GraduationCap }
            ],
            action: (
                <>
                    <Button variant="outline" className="bg-white hover:bg-slate-50 border-slate-300 text-slate-700 w-full md:w-auto" onClick={() => window.open(`https://google.com/maps/search/${filters.institution}`, '_blank')}>
                        <ExternalLink size={14} className="mr-2" /> Website
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto shadow-md" onClick={() => onNavigate('map', 'institutions')}>
                        <MapPin size={16} className="mr-2" /> Locate on Map
                    </Button>
                </>
            )
        }));
    }

    // 2. Sector
    if (filters.sector !== 'all') {
        banners.push(createBanner('sector', {
            title: `${filters.sector} Sector`,
            subtitle: `Analyzing demand trends and skill gaps in ${filters.sector}.`,
            icon: Building2,
            stats: [
                { label: "High Demand", icon: Users },
                { label: "Growing @ 12%", icon: MapPin }
            ],
            action: (
                <Button className="bg-blue-600 text-white" onClick={() => onTabChange('demand')}>
                    View Skills Demand
                </Button>
            )
        }));
    }

    // 3. Industry
    if (filters.industry !== 'all') {
        banners.push(createBanner('industry', {
            title: `${filters.industry}`,
            subtitle: `Industry specific insights and hiring trends.`,
            icon: Building2,
            stats: [
                { label: "Active Recruiters: 45", icon: Users }
            ],
            action: (
                <Button className="bg-blue-600 text-white" onClick={() => onTabChange('accelerator')}>
                    View Ecosystem
                </Button>
            )
        }));
    }

    // 4. Skill Domain
    if (filters.domain !== 'all') {
        banners.push(createBanner('domain', {
            title: `Skill Domain: ${filters.domain}`,
            subtitle: `Analyzing proficiency and demand for ${filters.domain} across the district.`,
            icon: GraduationCap,
            stats: [
                { label: "Job Openings: 120+", icon: MapPin },
                { label: "Certified Students: 340", icon: Users }
            ],
            action: (
                <Button className="bg-blue-600 text-white" onClick={() => onTabChange('demand')}>
                    View Skill Demand
                </Button>
            )
        }));
    }

    // 5. Company Type
    if (filters.companyType !== 'all') {
        banners.push(createBanner('companyType', {
            title: `Company Type: ${filters.companyType}`,
            subtitle: `Insights into ${filters.companyType} ecosystem and hiring patterns.`,
            icon: MapPin,
            stats: [
                { label: "Active Companies: 15", icon: Building2 },
                { label: "Avg Salary: ₹6.5 LPA", icon: Users }
            ],
            action: (
                <Button className="bg-blue-600 text-white" onClick={() => onTabChange('accelerator')}>
                    View Ecosystem
                </Button>
            )
        }));
    }

    if (banners.length === 0) {
        // Fallback or generic message if filters exist but not handled above (e.g. branch)
        return (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-md border border-slate-200">
                            <Building2 className="text-slate-500" size={16} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-slate-700">Filter Active</div>
                            <div className="text-xs text-slate-500">
                                Customized view based on selection.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-6">
            {banners}
        </div>
    );
}
