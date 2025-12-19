import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import DashboardFilters from '../DashboardFilters';
import OverviewPanel from '../panels/OverviewPanel';
import SupplyPanel from '../panels/SupplyPanel';
import DemandPanel from '../panels/DemandPanel';
import GapPanel from '../panels/GapPanel';
import PlacementPanel from '../panels/PlacementPanel';
import CoePanel from '../panels/CoePanel';
import AcceleratorPanel from '../panels/AcceleratorPanel';
import InsightsPanel from '../panels/InsightsPanel';

const DistrictDashboard: React.FC<{ onNavigate: (view: any, tab?: string) => void }> = () => {
    const [filters, setFilters] = useState({
        sector: 'all',
        industry: 'all',
        domain: 'all',
        institution: 'all'
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">
                                District Skill Command Center
                            </h1>
                            <p className="text-sm text-slate-600">
                                Real-time insights on skill demand, supply, gaps, and infrastructure.
                            </p>
                        </div>

                        {/* Logo/Badge */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">DK</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-6 pb-20">
                {/* Filters */}
                <DashboardFilters filters={filters} onFilterChange={setFilters} />

                {/* Tab Navigation */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1 bg-white p-1 rounded-lg shadow-sm h-auto">
                        <TabsTrigger
                            value="overview"
                            className="rounded-md py-2.5 text-xs font-medium"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="demand"
                            className="rounded-md py-2.5 text-xs font-medium"
                        >
                            Skill Demand
                        </TabsTrigger>
                        <TabsTrigger
                            value="supply"
                            className="rounded-md py-2.5 text-xs font-medium"
                        >
                            Skill Supply
                        </TabsTrigger>
                        <TabsTrigger
                            value="gap"
                            className="rounded-md py-2.5 text-xs font-medium"
                        >
                            Gap Analysis
                        </TabsTrigger>
                        <TabsTrigger
                            value="accelerator"
                            className="rounded-md py-2.5 text-xs font-medium"
                        >
                            Accelerator
                        </TabsTrigger>
                        <TabsTrigger
                            value="placements"
                            className="rounded-md py-2.5 text-xs font-medium"
                        >
                            Placements
                        </TabsTrigger>
                        <TabsTrigger
                            value="coe"
                            className="rounded-md py-2.5 text-xs font-medium"
                        >
                            Infrastructure (COE)
                        </TabsTrigger>
                        <TabsTrigger
                            value="insights"
                            className="rounded-md py-2.5 text-xs font-medium"
                        >
                            Insights
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab Contents */}
                    <TabsContent value="overview" className="space-y-6">
                        <OverviewPanel filters={filters} />
                    </TabsContent>

                    <TabsContent value="demand" className="space-y-6">
                        <DemandPanel filters={filters} />
                    </TabsContent>

                    <TabsContent value="supply" className="space-y-6">
                        <SupplyPanel filters={filters} />
                    </TabsContent>

                    <TabsContent value="gap" className="space-y-6">
                        <GapPanel filters={filters} />
                    </TabsContent>

                    <TabsContent value="accelerator" className="space-y-6">
                        <AcceleratorPanel filters={filters} />
                    </TabsContent>

                    <TabsContent value="placements" className="space-y-6">
                        <PlacementPanel filters={filters} />
                    </TabsContent>

                    <TabsContent value="coe" className="space-y-6">
                        <CoePanel filters={filters} />
                    </TabsContent>

                    <TabsContent value="insights" className="space-y-6">
                        <InsightsPanel filters={filters} />
                    </TabsContent>
                </Tabs>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-12 pb-8">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                        <div>
                            <strong>Dakshina Kannada District</strong> • Karnataka Digital Economy Mission (KDEM)
                        </div>
                        <div>
                            Last Updated: December 2024 • Data Source: Official Placement Reports & Industry Surveys
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DistrictDashboard;
