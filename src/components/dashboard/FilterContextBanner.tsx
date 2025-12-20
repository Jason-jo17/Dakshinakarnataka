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
}

export default function FilterContextBanner({ filters, onNavigate }: FilterContextBannerProps) {
    if (Object.values(filters).every(v => v === 'all')) return null;

    // Helper to render consistent banner structure
    const renderBanner = ({ title, subtitle, icon: Icon, stats, action }: any) => (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm border border-blue-100">
                            <Icon className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                {title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mt-1">
                                {stats.map((stat: any, i: number) => (
                                    <span key={i} className="flex items-center gap-1">
                                        {stat.icon && <stat.icon size={14} />} {stat.label}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-2 max-w-2xl">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                    {action && (
                        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                            {action}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    // 1. Institution Filter Selected
    if (filters.institution !== 'all') {
        const institutionDetails = {
            name: filters.institution,
            location: "Mangaluru, DK",
            students: 4500,
            established: 1960,
            description: "Showing specific insights for this institution."
        };
        return renderBanner({
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
        });
    }

    // 2. Sector Filter Selected
    if (filters.sector !== 'all') {
        return renderBanner({
            title: `${filters.sector} Sector`,
            subtitle: `Analyzing demand trends and skill gaps in ${filters.sector}.`,
            icon: Building2, // Customizable icon
            stats: [
                { label: "High Demand", icon: Users },
                { label: "Growing @ 12%", icon: MapPin } // Mock data
            ],
            action: (
                <Button className="bg-blue-600 text-white" onClick={() => onNavigate('demand')}>
                    View Skills Demand
                </Button>
            )
        });
    }

    // 3. Industry Filter Selected
    if (filters.industry !== 'all') {
        return renderBanner({
            title: `${filters.industry}`,
            subtitle: `Industry specific insights and hiring trends.`,
            icon: Building2,
            stats: [
                { label: "Active Recruiters: 45", icon: Users }
            ],
            action: (
                <Button className="bg-blue-600 text-white" onClick={() => onNavigate('placements')}>
                    View Placements
                </Button>
            )
        });
    }

    // 4. Skill Domain Filter Selected
    if (filters.domain !== 'all') {
        return renderBanner({
            title: `Skill Domain: ${filters.domain}`,
            subtitle: `Analyzing proficiency and demand for ${filters.domain} across the district.`,
            icon: GraduationCap,
            stats: [
                { label: "Job Openings: 120+", icon: MapPin },
                { label: "Certified Students: 340", icon: Users }
            ],
            action: (
                <Button className="bg-blue-600 text-white" onClick={() => onNavigate('demand')}>
                    View Skill Demand
                </Button>
            )
        });
    }

    // 5. Company Type Filter Selected
    if (filters.companyType !== 'all') {
        return renderBanner({
            title: `Company Type: ${filters.companyType}`,
            subtitle: `Insights into ${filters.companyType} ecosystem and hiring patterns.`,
            icon: MapPin,
            stats: [
                { label: "Active Companies: 15", icon: Building2 },
                { label: "Avg Salary: ₹6.5 LPA", icon: Users }
            ],
            action: (
                <Button className="bg-blue-600 text-white" onClick={() => onNavigate('accelerator')}>
                    View Ecosystem
                </Button>
            )
        });
    }

    // Default Fallback (Branch, Domain, etc.)
    return renderBanner({
        title: "Filtered View Active",
        subtitle: "Showing customized data based on your selection.",
        icon: Building2,
        stats: [],
        action: (
            <Button className="bg-blue-600 text-white" onClick={() => onNavigate('overview')}>
                Back to Overview
            </Button>
        )
    });
}
