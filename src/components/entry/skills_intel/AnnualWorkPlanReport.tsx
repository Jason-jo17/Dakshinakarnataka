import {
    PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { CheckCircle, Share, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const data = {
    plan_year: "2024-25",
    total_budget: 25750000,
    funding_sources: [
        { name: "State Budget", value: 18500000, color: "#3b82f6" },
        { name: "SDRF", value: 4200000, color: "#10b981" },
        { name: "Industry", value: 2050000, color: "#f59e0b" },
        { name: "Central", value: 1000000, color: "#6366f1" }
    ],
    monthly_allocation: [
        { month: "Apr", budget: 18.5 },
        { month: "May", budget: 14.2 },
        { month: "Jun", budget: 16.8 },
        { month: "Jul", budget: 21.0 },
        { month: "Aug", budget: 45.5 }, // Increased for new initiatives starting Aug
        { month: "Sep", budget: 35.8 },
        { month: "Oct", budget: 32.5 },
        { month: "Nov", budget: 29.8 },
        { month: "Dec", budget: 22.0 },
        { month: "Jan", budget: 17.5 },
        { month: "Feb", budget: 16.5 },
        { month: "Mar", budget: 13.4 }
    ],
    initiatives: [
        { name: "Placement & Apprenticeship Drive", start: 5, duration: 8, status: "On Track", progress: 0, budget: "50L" },
        { name: "Digital Outreach (CCTV/Biometric)", start: 5, duration: 8, status: "Planning", progress: 0, budget: "5L" },
        { name: "CEDOK Self-Employment", start: 5, duration: 8, status: "On Track", progress: 0, budget: "15L" },
        { name: "Interdepartmental Online Portal", start: 5, duration: 8, status: "Planning", progress: 0, budget: "30L" },
        { name: "IT Skilling Center", start: 1, duration: 6, status: "In Progress", progress: 40 },
        { name: "Healthcare Training", start: 3, duration: 10, status: "Planning", progress: 10 },
        { name: "CNC Manufacturing", start: 2, duration: 8, status: "In Progress", progress: 30 },
        { name: "Recruiter Pilot Program (InUnity)", start: 6, duration: 7, status: "Active", progress: 85, budget: "12L" }
    ]
};

const STATUS_COLORS = {
    "In Progress": "bg-blue-100 text-blue-800",
    "Planning": "bg-gray-100 text-gray-800",
    "On Track": "bg-green-100 text-green-800",
    "Delayed": "bg-red-100 text-red-800"
};

export default function AnnualWorkPlanReport() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Annual Work Plan & Budget</h1>
                    <p className="text-gray-500 text-sm">FY {data.plan_year} • Total Budget: ₹{(data.total_budget / 10000000).toFixed(2)} Cr</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <CheckCircle className="w-4 h-4 mr-1" /> Plan Approved
                    </span>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-600/20 text-sm font-medium hover:brightness-110 transition-all ml-2">
                        <Share className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Funding Sources */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Funding Sources</h3>
                    <div className="h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.funding_sources}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {data.funding_sources.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="text-xs text-gray-500">Total</span>
                            <div className="font-bold text-gray-900">₹1.57 Cr</div>
                        </div>
                    </div>
                </div>

                {/* Monthly Allocation */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Budget Allocation (₹ Lakhs)</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.monthly_allocation} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="budget" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBudget)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Gantt Chart (Custom Implementation) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Strategic Initiatives Timeline</h3>
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded"></div> In Progress</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> On Track</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded"></div> Delayed</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-300 rounded"></div> Planning</div>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-1 text-xs font-semibold text-gray-500 border-b border-gray-100 pb-2">
                        <div className="col-span-3 pl-2">Initiative</div>
                        {['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                            <div key={m} className="col-span-1 text-center">{m}</div>
                        ))}
                    </div>

                    {/* Rows */}
                    {data.initiatives.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-1 items-center hover:bg-gray-50 py-2 rounded transition-colors group">
                            <div className="col-span-3 pl-2">
                                <div className="font-medium text-sm text-gray-900">{item.name}</div>
                                <div className={`text-[10px] w-fit px-1.5 py-0.5 rounded mt-1 ${(STATUS_COLORS as any)[item.status]}`}>
                                    {item.status} • {item.progress}% {(item as any).budget && `• ₹${(item as any).budget}`}
                                </div>
                            </div>

                            {/* Timeline Bars */}
                            <div className="col-span-9 relative h-8 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 grid grid-cols-9 divide-x divide-gray-100">
                                    {[...Array(9)].map((_, i) => <div key={i}></div>)}
                                </div>

                                {/* The Bar */}
                                <div
                                    className={`absolute top-1.5 bottom-1.5 rounded shadow-sm opacity-90 transition-all group-hover:opacity-100 group-hover:shadow-md
                                  ${item.status === 'Delayed' ? 'bg-red-500' :
                                            item.status === 'On Track' ? 'bg-green-500' :
                                                item.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'}
                              `}
                                    style={{
                                        left: `${(item.start - 1) * (100 / 9)}%`,
                                        width: `${item.duration * (100 / 9)}%`
                                    }}
                                >
                                    {/* Progress Fill */}
                                    <div
                                        className="h-full bg-white/20"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- NEW SECTION: Implementation Progress & Resource Analysis --- */}
            <div className="border-t border-slate-200 pt-8 mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Implementation Progress & Resource Analysis
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Visual 1: Project Implementation Timeline (Gantt) - Col Span 8 */}
                    <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-900">Project Implementation Timeline</h3>
                            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                <button className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronLeft className="w-4 h-4 text-slate-500" /></button>
                                <span className="text-xs font-semibold text-slate-600 px-2">Jan – Dec 2024</span>
                                <button className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronRight className="w-4 h-4 text-slate-500" /></button>
                            </div>
                        </div>

                        {/* Gantt Header */}
                        <div className="grid grid-cols-12 gap-0 text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 text-center">
                            <div>Jan</div><div>Feb</div><div>Mar</div><div>Apr</div><div>May</div><div>Jun</div><div>Jul</div><div>Aug</div><div>Sep</div><div>Oct</div><div>Nov</div><div>Dec</div>
                        </div>

                        <div className="space-y-5 mt-2">
                            {/* Task 1 */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-slate-700">Reading Demand Aggregation</span>
                                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">On Track</span>
                                </div>
                                <div className="h-6 w-full bg-slate-100 rounded-full grid grid-cols-12 gap-0 p-0.5">
                                    <div className="col-start-1 col-span-3 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white relative">
                                        100%
                                    </div>
                                </div>
                            </div>

                            {/* Task 2 */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-slate-700">TP Empanelment</span>
                                    <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full text-[10px]">In Progress</span>
                                </div>
                                <div className="h-6 w-full bg-slate-100 rounded-full grid grid-cols-12 gap-0 p-0.5">
                                    <div className="col-start-3 col-span-4 bg-blue-600/70 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                                        65%
                                    </div>
                                </div>
                            </div>

                            {/* Task 3 */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-slate-700">Batch Commencement</span>
                                    <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Delayed</span>
                                </div>
                                <div className="h-6 w-full bg-slate-100 rounded-full grid grid-cols-12 gap-0 p-0.5">
                                    <div className="col-start-4 col-span-5 bg-amber-500/70 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                                        20%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual 2: Responsibility Workload - Col Span 4 */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="font-bold text-slate-900">Responsibility Workload</h3>
                            <div className="text-right">
                                <div className="text-lg font-bold text-slate-900 leading-none">128 Tasks</div>
                                <div className="text-emerald-600 text-xs font-bold">+12%</div>
                            </div>
                        </div>

                        <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2">
                            {/* Edu */}
                            <div className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-full bg-blue-100 rounded-t-lg transition-all group-hover:bg-blue-200" style={{ height: '40%' }}></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Edu</span>
                            </div>
                            {/* Labor */}
                            <div className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-full bg-blue-600 rounded-t-lg transition-all group-hover:bg-blue-700" style={{ height: '85%' }}></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Labor</span>
                            </div>
                            {/* Ind */}
                            <div className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-full bg-blue-600/60 rounded-t-lg transition-all group-hover:bg-blue-600/70" style={{ height: '100%' }}></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ind</span>
                            </div>
                            {/* Agri */}
                            <div className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-full bg-blue-600/40 rounded-t-lg transition-all group-hover:bg-blue-600/50" style={{ height: '60%' }}></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agri</span>
                            </div>
                            {/* Tour */}
                            <div className="flex flex-col items-center gap-2 w-full group">
                                <div className="w-full bg-blue-600/80 rounded-t-lg transition-all group-hover:bg-blue-600/90" style={{ height: '50%' }}></div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tour</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual 3: Mobilization Funnel - Col Span 4 */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-1">Mobilization Funnel</h3>
                        <p className="text-xs text-slate-400 mb-6">Overall Conversion: 64%</p>

                        <div className="space-y-3">
                            {/* Stage 1 */}
                            <div className="group transform transition-transform hover:scale-[1.02]">
                                <div className="h-10 bg-blue-600 text-white flex items-center justify-between px-4 rounded shadow-sm mx-auto w-full">
                                    <span className="text-xs font-bold">Mobilization</span>
                                    <span className="font-bold text-sm">14,200</span>
                                </div>
                            </div>
                            {/* Stage 2 - Add padding to simulate funnel */}
                            <div className="group transform transition-transform hover:scale-[1.02] px-4">
                                <div className="h-10 bg-blue-600/80 text-white flex items-center justify-between px-4 rounded shadow-sm w-full mx-auto">
                                    <span className="text-xs font-bold">Counselling</span>
                                    <span className="font-bold text-sm">9,840</span>
                                </div>
                            </div>
                            {/* Stage 3 */}
                            <div className="group transform transition-transform hover:scale-[1.02] px-8">
                                <div className="h-10 bg-blue-600/60 text-white flex items-center justify-between px-4 rounded shadow-sm w-full mx-auto">
                                    <span className="text-xs font-bold">Training</span>
                                    <span className="font-bold text-sm">8,200</span>
                                </div>
                            </div>
                            {/* Stage 4 */}
                            <div className="group transform transition-transform hover:scale-[1.02] px-12">
                                <div className="h-10 bg-blue-600/40 text-slate-900 flex items-center justify-between px-4 rounded shadow-sm w-full mx-auto">
                                    <span className="text-xs font-bold">Placement</span>
                                    <span className="font-bold text-sm">5,248</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual 4: DSC Meeting Heatmap - Col Span 4 */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-900">DSC Meeting Activity</h3>
                            <button className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded font-bold text-slate-600">View Calendar</button>
                        </div>

                        {/* 7x4 Grid */}
                        <div className="grid grid-cols-7 grid-rows-4 gap-2 mb-4">
                            {/* Row 1 */}
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/40"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>

                            {/* Row 2 */}
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/40"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/40"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/90 shadow-inner ring-1 ring-blue-500"></div> {/* High Activity */}

                            {/* Row 3 */}
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/70"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/40"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>

                            {/* Row 4 */}
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/40"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/80"></div> {/* High Activity */}
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                            <div className="aspect-square rounded-sm bg-blue-600/10"></div>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                            <span>Less Frequent</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-sm bg-blue-600/10"></div>
                                <div className="w-2 h-2 rounded-sm bg-blue-600/40"></div>
                                <div className="w-2 h-2 rounded-sm bg-blue-600/70"></div>
                                <div className="w-2 h-2 rounded-sm bg-blue-600/90"></div>
                            </div>
                            <span>Highly Active</span>
                        </div>
                    </div>

                    {/* Visual 5: Capacity Utilization Gauge - Col Span 4 */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                        <h3 className="font-bold text-slate-900 mb-4 w-full text-left">Capacity Utilization</h3>

                        {/* Gauge Container - Half Circle via overflow hidden */}
                        <div className="relative w-48 h-24 overflow-hidden mb-4">
                            {/* Track Circle (Bottom Layer) */}
                            <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-slate-100 box-border"></div>
                            <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-transparent border-t-blue-600 border-r-blue-600 box-border transform rotate-45"></div>
                        </div>

                        <div className="text-center -mt-8 relative z-10">
                            <div className="text-3xl font-bold text-slate-900">78%</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">of Target Met</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full mt-6">
                            <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                                <div className="text-[10px] text-slate-400 font-bold uppercase">Target Seats</div>
                                <div className="text-sm font-bold text-slate-900">12,500</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                                <div className="text-[10px] text-blue-400 font-bold uppercase">Filled Seats</div>
                                <div className="text-sm font-bold text-blue-700">9,750</div>
                            </div>
                        </div>
                    </div>

                    {/* Visual 6: Key Milestones & Activity Logs - Col Span 12 */}
                    <div className="lg:col-span-12 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-900">Key Milestones & Activity Logs</h3>
                            <button className="text-sm text-blue-600 font-semibold hover:underline">View All Logs</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Status</th>
                                        <th className="px-4 py-3">Activity</th>
                                        <th className="px-4 py-3">Department</th>
                                        <th className="px-4 py-3">Owner</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Deadline</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {/* Row 1 */}
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Completed
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-slate-900">Center Audit – Phase 1</td>
                                        <td className="px-4 py-3 text-slate-500">Industry & Commerce</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">RS</div>
                                                <span className="text-slate-700 font-medium">Rahul S.</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">12 Mar 2024</td>
                                    </tr>
                                    {/* Row 2 */}
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> In Review
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-slate-900">Curriculum Validation</td>
                                        <td className="px-4 py-3 text-slate-500">Higher Education</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">AK</div>
                                                <span className="text-slate-700 font-medium">Anita K.</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">25 Mar 2024</td>
                                    </tr>
                                    {/* Row 3 */}
                                    <tr className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Delayed
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-slate-900">Trainee Kits Distribution</td>
                                        <td className="px-4 py-3 text-slate-500">Skill Dev Society</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">VP</div>
                                                <span className="text-slate-700 font-medium">Vikram P.</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">18 Mar 2024</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
