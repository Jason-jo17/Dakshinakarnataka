import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuthStore } from '../../../store/useAuthStore';
import { Calendar, Target, TrendingUp, BookOpen, Layers, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AsIsData {
    dscMeetings: {
        total: number;
        targetReached: boolean;
        previousYear: number;
        currentYear: number;
    };
    dscActivities: {
        mobilisation: { prev: number; curr: number };
        rozgarMelas: { prev: number; curr: number };
    };
    population: {
        sc: { rural: number; urban: number; total: number };
        st: { rural: number; urban: number; total: number };
        general: { rural: number; urban: number; total: number };
    };
    youth: {
        percentage: number;
        youthCount: number;
        othersCount: number;
    };
    dropout: {
        boys: number[];
        girls: number[];
    };
    iti: {
        trades: Array<{ name: string; capacity: number; enrolled: number }>;
    };
    // Supplemental Data for New Charts
    sectors: Array<{ name: string; female: number; male: number }>;
    schemes: Array<{ name: string; female: number; male: number }>;
    costs: Array<{ sector: string; cost: number; placedCost: number }>;
}

export const AsIsAnalysis: React.FC = () => {
    const { currentDistrict } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AsIsData | null>(null);

    useEffect(() => {
        // Always fetch, but fall back to mock if empty
        if (currentDistrict) fetchAllData();
    }, [currentDistrict]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // 1. DSC Activities (Meetings & Mobilisation)
            const { data: dscData } = await supabase
                .from('scenario_dsc_activities')
                .select('*')
                .eq('district_id', currentDistrict);

            let meetingsPrev = 0;
            let meetingsCurr = 0;
            let mobPrev = 0;
            let mobCurr = 0;
            let rozPrev = 0;
            let rozCurr = 0;

            if (dscData && dscData.length > 0) {
                dscData.forEach((row: any) => {
                    const name = row.activity_name?.toLowerCase() || '';
                    const p = Number(row.count_2019_20) || 0;
                    const c = Number(row.count_2020_21_h1) || 0;

                    if (name.includes('meeting')) {
                        meetingsPrev += p;
                        meetingsCurr += c;
                    }
                    if (name.includes('mobilisation')) {
                        mobPrev += p;
                        mobCurr += c;
                    }
                    if (name.includes('rozgar')) {
                        rozPrev += p;
                        rozCurr += c;
                    }
                });
            } else {
                // Mock Data Fallback
                meetingsPrev = 12; meetingsCurr = 14;
                mobPrev = 1500; mobCurr = 1850;
                rozPrev = 450; rozCurr = 620;
            }

            // 2. Population (SC, ST, General)
            const { data: popData } = await supabase
                .from('population_analysis')
                .select('*')
                .eq('district_id', currentDistrict)
                .eq('source_type', 'census_2011');

            const pop = {
                sc: { rural: 0, urban: 0, total: 0 },
                st: { rural: 0, urban: 0, total: 0 },
                general: { rural: 0, urban: 0, total: 0 }
            };

            if (popData && popData.length > 0) {
                popData.forEach((row: any) => {
                    const cat = row.category?.toLowerCase();
                    const r = Number(row.rural_population) || 0;
                    const u = Number(row.urban_population) || 0;
                    if (cat === 'sc') { pop.sc.rural = r; pop.sc.urban = u; pop.sc.total = r + u; }
                    else if (cat === 'st') { pop.st.rural = r; pop.st.urban = u; pop.st.total = r + u; }
                    else { pop.general.rural = r; pop.general.urban = u; pop.general.total = r + u; }
                });
            } else {
                // Mock Data
                pop.sc = { rural: 145000, urban: 45000, total: 190000 };
                pop.st = { rural: 85000, urban: 15000, total: 100000 };
                pop.general = { rural: 850000, urban: 650000, total: 1500000 };
            }

            // 3. Youth Share
            const { data: youthData } = await supabase
                .from('youth_share_analysis')
                .select('*')
                .eq('district_id', currentDistrict);

            let youthTotal = 0;
            if (youthData && youthData.length > 0) {
                youthData.forEach((row: any) => {
                    if (row.category === 'Total') {
                        youthTotal = Number(row.total_youth_population) || 0;
                    }
                });
            } else {
                youthTotal = 650000; // Mock
            }

            let grandPop = pop.sc.total + pop.st.total + pop.general.total;
            if (grandPop === 0 && youthTotal > 0) grandPop = youthTotal * 2.5;

            // 4. Dropout (Boys vs Girls)
            const { data: dropData } = await supabase
                .from('education_dropout_analysis')
                .select('*')
                .eq('district_id', currentDistrict);

            let boysDrop = [0, 0, 0, 0];
            let girlsDrop = [0, 0, 0, 0];

            if (dropData && dropData.length > 0) {
                dropData.forEach((row: any) => {
                    const level = row.education_level?.toLowerCase() || '';
                    const b = Number(row.boys_dropout_count) || 0;
                    const g = Number(row.girls_dropout_count) || 0;

                    if (level.includes('1-5') || level.includes('primary')) { boysDrop[0] = b; girlsDrop[0] = g; }
                    if (level.includes('6-8') || level.includes('upper')) { boysDrop[1] = b; girlsDrop[1] = g; }
                    if (level.includes('9-10') || level.includes('secondary')) { boysDrop[2] = b; girlsDrop[2] = g; }
                    if (level.includes('11-12') || level.includes('puc')) { boysDrop[3] = b; girlsDrop[3] = g; }
                });
            } else {
                boysDrop = [120, 350, 890, 1200];
                girlsDrop = [80, 210, 650, 950];
            }

            // 5. ITI Capacity (Mocked as before, but ensure it always shows)
            const trades = [
                { name: 'Electrician', capacity: 120, enrolled: 110 },
                { name: 'Fitter', capacity: 100, enrolled: 85 },
                { name: 'COPA', capacity: 80, enrolled: 78 },
                { name: 'Welder', capacity: 60, enrolled: 45 },
                { name: 'Mechanic', capacity: 60, enrolled: 30 }
            ];

            // 6. NEW: Sectorwise Mock Data
            // Ideally fetch from 'sectorwise_analysis'
            const sectorsMock = [
                { name: 'IT-ITeS', female: 1200, male: 800 },
                { name: 'Electronics', female: 900, male: 1100 },
                { name: 'Healthcare', female: 1500, male: 400 },
                { name: 'Retail', female: 600, male: 550 },
                { name: 'Auto', female: 50, male: 950 },
                { name: 'BFSI', female: 700, male: 600 },
                { name: 'Apparel', female: 1100, male: 200 },
                { name: 'Logistics', female: 100, male: 800 },
            ];

            // 7. NEW: Program/Scheme Mock Data
            // Ideally fetch from 'schemewise_analysis'
            const schemesMock = [
                { name: 'PMKVY', female: 2500, male: 3000 },
                { name: 'DDU-GKY', female: 1800, male: 1200 },
                { name: 'NULM', female: 900, male: 600 },
                { name: 'CMKKY', female: 1100, male: 1400 },
            ];

            // 8. NEW: Cost Analysis Mock Data
            // Ideally fetch from 'cost_category_analysis'
            const costsMock = [
                { sector: 'IT-ITeS', cost: 4500000, placedCost: 12000 },
                { sector: 'Healthcare', cost: 3800000, placedCost: 15000 },
                { sector: 'Electronics', cost: 3200000, placedCost: 18000 },
                { sector: 'Auto', cost: 2900000, placedCost: 22000 },
                { sector: 'Retail', cost: 1500000, placedCost: 9000 },
            ];


            setData({
                dscMeetings: {
                    total: meetingsPrev + meetingsCurr,
                    targetReached: meetingsCurr >= meetingsPrev,
                    previousYear: meetingsPrev,
                    currentYear: meetingsCurr
                },
                dscActivities: {
                    mobilisation: { prev: mobPrev, curr: mobCurr },
                    rozgarMelas: { prev: rozPrev, curr: rozCurr }
                },
                population: pop,
                youth: {
                    percentage: grandPop > 0 ? Math.round((youthTotal / grandPop) * 100) : 0,
                    youthCount: youthTotal,
                    othersCount: grandPop - youthTotal
                },
                dropout: {
                    boys: boysDrop,
                    girls: girlsDrop
                },
                iti: {
                    trades: trades
                },
                sectors: sectorsMock,
                schemes: schemesMock,
                costs: costsMock
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) return <div className="p-10 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;

    // --- Derived Values & Color Scales ---
    const maxMeet = Math.max(data.dscMeetings.previousYear, data.dscMeetings.currentYear, 1);
    const hMeetPrev = (data.dscMeetings.previousYear / maxMeet) * 100;
    const hMeetCurr = (data.dscMeetings.currentYear / maxMeet) * 100;

    const maxAct = Math.max(
        data.dscActivities.mobilisation.prev, data.dscActivities.mobilisation.curr,
        data.dscActivities.rozgarMelas.prev, data.dscActivities.rozgarMelas.curr, 1
    );
    const hMobPrev = (data.dscActivities.mobilisation.prev / maxAct) * 100;
    const hMobCurr = (data.dscActivities.mobilisation.curr / maxAct) * 100;
    const hRozPrev = (data.dscActivities.rozgarMelas.prev / maxAct) * 100;
    const hRozCurr = (data.dscActivities.rozgarMelas.curr / maxAct) * 100;

    const getRuralPct = (cat: any) => cat.total > 0 ? (cat.rural / cat.total) * 100 : 0;
    const youthPct = data.youth.percentage;
    const dashArray = `${youthPct}, 100`;

    const maxDrop = Math.max(...data.dropout.boys, ...data.dropout.girls, 10);
    const scaleY = (val: number) => 60 - ((val / maxDrop) * 40 + 10);
    const dBoys = `M0 ${scaleY(data.dropout.boys[0])} L33 ${scaleY(data.dropout.boys[1])} L66 ${scaleY(data.dropout.boys[2])} L100 ${scaleY(data.dropout.boys[3])}`;
    const dGirls = `M0 ${scaleY(data.dropout.girls[0])} L33 ${scaleY(data.dropout.girls[1])} L66 ${scaleY(data.dropout.girls[2])} L100 ${scaleY(data.dropout.girls[3])}`;

    // Simple formatter for currency
    const formatCurrency = (val: number) => {
        if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(1)} Cr`;
        if (val >= 100000) return `₹ ${(val / 100000).toFixed(1)} L`;
        return `₹ ${val.toLocaleString()}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Operational & Demographic "As Is" Analysis</h2>
                <p className="text-gray-500 mt-1">Current state assessment of district skilling, demographics, and infrastructure.</p>
            </div>

            {/* SECTION 1: Operational Metrics (Visual Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

                {/* 1. DSC Meetings Comparison */}
                <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm">DSC Meetings</h3>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-900">{data.dscMeetings.total}</span>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    {data.dscMeetings.targetReached ? '+Target Met' : 'On Track'}
                                </span>
                            </div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <Target className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>

                    <div className="flex items-end gap-4 h-32 mt-4 px-4 pb-2 border-b border-gray-100">
                        <div className="flex-1 flex flex-col justify-end gap-1 relative">
                            <div className="w-full bg-blue-200 rounded-t-sm relative transition-all hover:bg-blue-300" style={{ height: `${hMeetPrev}%` }}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">{data.dscMeetings.previousYear}</div>
                            </div>
                            <span className="text-[10px] text-gray-400 text-center">Prev Year</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-end gap-1 relative">
                            <div className="w-full bg-blue-600 rounded-t-sm relative transition-all hover:bg-blue-700" style={{ height: `${hMeetCurr}%` }}>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-600">{data.dscMeetings.currentYear}</div>
                            </div>
                            <span className="text-[10px] text-gray-400 text-center">Curr Year</span>
                        </div>
                    </div>
                </div>

                {/* 2. DSC Activities Performance */}
                <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm group hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm">Activities Performance</h3>
                            <h4 className="text-lg font-bold text-gray-800">Mobilisation vs Rozgar Melas</h4>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>

                    <div className="flex items-end justify-around h-40 pt-6">
                        <div className="flex gap-4 items-end">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-bold text-gray-600">{data.dscActivities.mobilisation.prev}</span>
                                <div className="w-12 bg-indigo-300 rounded-t hover:bg-indigo-400 transition-colors" style={{ height: `${hMobPrev}px` }}></div>
                                <span className="text-[10px] text-gray-500">Prev</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-bold text-gray-600">{data.dscActivities.mobilisation.curr}</span>
                                <div className="w-12 bg-indigo-600 rounded-t hover:bg-indigo-700 transition-colors" style={{ height: `${hMobCurr}px` }}></div>
                                <span className="text-[10px] text-gray-500">Curr</span>
                            </div>
                        </div>

                        <div className="h-full w-px bg-gray-100 mx-4"></div>

                        <div className="flex gap-4 items-end">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-bold text-gray-600">{data.dscActivities.rozgarMelas.prev}</span>
                                <div className="w-12 bg-teal-300 rounded-t hover:bg-teal-400 transition-colors" style={{ height: `${hRozPrev}px` }}></div>
                                <span className="text-[10px] text-gray-500">Prev</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-bold text-gray-600">{data.dscActivities.rozgarMelas.curr}</span>
                                <div className="w-12 bg-teal-600 rounded-t hover:bg-teal-700 transition-colors" style={{ height: `${hRozCurr}px` }}></div>
                                <span className="text-[10px] text-gray-500">Curr</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-around mt-2 text-xs font-bold text-gray-800 uppercase tracking-widest opacity-60">
                        <span>Mobilisation</span>
                        <span>Rozgar Melas</span>
                    </div>
                </div>

                {/* 3. Population by Category */}
                <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-gray-800 font-bold">Population by Category — Rural vs Urban</h3>
                        <div className="flex gap-4 text-xs">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded-[2px]"></div> Rural</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-200 rounded-[2px]"></div> Urban</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="relative">
                            <div className="flex justify-between text-xs font-semibold mb-1 text-gray-600">
                                <span>SC ({Math.round(getRuralPct(data.population.sc))}% Rural)</span>
                                <span>{data.population.sc.total.toLocaleString()}</span>
                            </div>
                            <div className="h-6 w-full bg-gray-100 rounded-full flex overflow-hidden">
                                <div className="bg-blue-600 h-full hover:bg-blue-700 transition delay-75" style={{ width: `${getRuralPct(data.population.sc)}%` }}></div>
                                <div className="bg-blue-200 h-full flex-1 hover:bg-blue-300 transition"></div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex justify-between text-xs font-semibold mb-1 text-gray-600">
                                <span>ST ({Math.round(getRuralPct(data.population.st))}% Rural)</span>
                                <span>{data.population.st.total.toLocaleString()}</span>
                            </div>
                            <div className="h-6 w-full bg-gray-100 rounded-full flex overflow-hidden">
                                <div className="bg-blue-600 h-full hover:bg-blue-700 transition delay-100" style={{ width: `${getRuralPct(data.population.st)}%` }}></div>
                                <div className="bg-blue-200 h-full flex-1 hover:bg-blue-300 transition"></div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex justify-between text-xs font-semibold mb-1 text-gray-600">
                                <span>General ({Math.round(getRuralPct(data.population.general))}% Rural)</span>
                                <span>{data.population.general.total.toLocaleString()}</span>
                            </div>
                            <div className="h-6 w-full bg-gray-100 rounded-full flex overflow-hidden">
                                <div className="bg-blue-600 h-full hover:bg-blue-700 transition delay-150" style={{ width: `${getRuralPct(data.population.general)}%` }}></div>
                                <div className="bg-blue-200 h-full flex-1 hover:bg-blue-300 transition"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Youth Population Share */}
                <div className="lg:col-span-4 bg-slate-900 p-6 rounded-xl text-white shadow-sm flex flex-col items-center justify-center relative min-h-[250px]">
                    <h3 className="absolute top-5 left-5 text-gray-300 font-medium text-sm">Youth Population</h3>

                    <div className="relative w-40 h-40">
                        <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                            <path
                                className="text-gray-700"
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className="text-blue-500"
                                strokeDasharray={dashArray}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <span className="text-3xl font-bold">{data.youth.percentage}%</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Aged 15-35</span>
                        </div>
                    </div>

                    <div className="w-full mt-6 grid grid-cols-2 gap-4 text-center border-t border-gray-700 pt-4">
                        <div>
                            <div className="text-lg font-bold">{(data.youth.youthCount / 1000).toFixed(1)}k</div>
                            <div className="text-xs text-gray-400">Youth 15-35</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold">{(data.youth.othersCount / 1000).toFixed(1)}k</div>
                            <div className="text-xs text-gray-400">Others</div>
                        </div>
                    </div>
                </div>

                {/* 5. School Dropout Rates */}
                <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm group hover:border-pink-300 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm">School Dropout Rates</h3>
                            <h4 className="font-bold text-gray-800">Boys vs Girls Trend</h4>
                        </div>
                        <div className="p-2 bg-pink-50 rounded-lg group-hover:bg-pink-100 transition-colors">
                            <TrendingUp className="w-5 h-5 text-pink-600" />
                        </div>
                    </div>

                    <div className="h-44 relative mt-2">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 60" preserveAspectRatio="none">
                            <line x1="0" y1="0" x2="100" y2="0" stroke="#f3f4f6" strokeWidth="0.5" />
                            <line x1="0" y1="15" x2="100" y2="15" stroke="#f3f4f6" strokeWidth="0.5" />
                            <line x1="0" y1="30" x2="100" y2="30" stroke="#f3f4f6" strokeWidth="0.5" />
                            <line x1="0" y1="45" x2="100" y2="45" stroke="#f3f4f6" strokeWidth="0.5" />
                            <line x1="0" y1="60" x2="100" y2="60" stroke="#f3f4f6" strokeWidth="0.5" />

                            <path
                                d={dBoys}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2.5"
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                            />
                            <path
                                d={dGirls}
                                fill="none"
                                stroke="#ec4899"
                                strokeWidth="2.5"
                                vectorEffect="non-scaling-stroke"
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="absolute inset-x-0 bottom-0 flex justify-between items-end pb-0 pointer-events-none translate-y-6">
                            <span className="text-[10px] text-gray-500 font-medium">Class 5</span>
                            <span className="text-[10px] text-gray-500 font-medium">Class 8</span>
                            <span className="text-[10px] text-gray-500 font-medium">Class 10</span>
                            <span className="text-[10px] text-gray-500 font-medium">Class 12</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-8 text-xs font-semibold">
                        <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"><div className="w-2 h-2 bg-blue-600 rounded-full"></div> Boys</span>
                        <span className="flex items-center gap-1 text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100"><div className="w-2 h-2 bg-pink-600 rounded-full"></div> Girls</span>
                    </div>
                </div>

                {/* 6. ITI Capacity vs Enrollment */}
                <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm group hover:border-orange-300 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm">ITI Performance</h3>
                            <h4 className="font-bold text-gray-800">Capacity vs Enrollment</h4>
                        </div>
                        <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                            <BookOpen className="w-5 h-5 text-orange-600" />
                        </div>
                    </div>

                    <div className="space-y-5 mt-2 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                        {data.iti.trades.map((trade, idx) => {
                            const pct = trade.capacity > 0 ? (trade.enrolled / trade.capacity) * 100 : 0;
                            const barColor = pct > 80 ? 'bg-green-500' : pct > 50 ? 'bg-blue-500' : 'bg-orange-500';

                            return (
                                <div key={idx} className="relative">
                                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1 z-10 relative">
                                        <span>{trade.name}</span>
                                        <span className="text-gray-500 font-normal">{trade.enrolled} / {trade.capacity}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden relative">
                                        <div className={`h-full ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* SECTION 2: Advanced Visualizations (Sector, Scheme, Cost) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 7. Sector Wise Training */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm">Sector Analysis</h3>
                            <h4 className="font-bold text-gray-800 text-lg">Trained Candidates by Sector</h4>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Layers className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.sectors} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10, fill: '#6b7280' }} />
                                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f9fafb' }}
                                />
                                <Legend />
                                <Bar dataKey="male" name="Male" stackId="a" fill="#60a5fa" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="female" name="Female" stackId="a" fill="#f472b6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 8. Scheme Wise Training */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm">Scheme Analysis</h3>
                            <h4 className="font-bold text-gray-800 text-lg">Performance by Scheme</h4>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <PieChartIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.schemes} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f3f4f6" />
                                <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f9fafb' }}
                                />
                                <Legend />
                                <Bar dataKey="male" name="Male" stackId="a" fill="#34d399" />
                                <Bar dataKey="female" name="Female" stackId="a" fill="#fbbf24" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 9. Cost Analysis */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-gray-500 font-medium text-sm">Financial Analysis</h3>
                            <h4 className="font-bold text-gray-800 text-lg">Total Training Cost & Efficiency by Sector</h4>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <IndianRupee className="w-5 h-5 text-amber-600" />
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.costs} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="sector" tick={{ fontSize: 12, fill: '#6b7280' }} />
                                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" tickFormatter={(val) => `₹${val / 100000}L`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tickFormatter={(val) => `₹${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number, name: string) => [formatCurrency(value), name === 'cost' ? 'Total Cost' : 'Cost/Placement']}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="cost" name="Total Allocation (Left Axis)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                                <Bar yAxisId="right" dataKey="placedCost" name="Cost per Placement (Right Axis)" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};
