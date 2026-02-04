import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, ReferenceLine } from 'recharts';
import { cn } from '../../lib/utils';
import { AlertTriangle, TrendingUp, XCircle, CheckCircle2 } from 'lucide-react';

// From Template 3B.1: Demand Supply Gap Manufacturing and Service
// 2×2 Matrix: Supply (Y-axis) vs Demand (X-axis)
const TRADE_MATRIX = [
    // Quadrant 1: High Supply, Low Demand — OVERSUPPLY (top-left)
    { trade: 'Fitter', sector: 'Manufacturing', supply: 6230, demand: 3800, x: 3800, y: 6230, quadrant: 'oversupply' },
    { trade: 'Turner', sector: 'Manufacturing', supply: 3400, demand: 2100, x: 2100, y: 3400, quadrant: 'oversupply' },

    // Quadrant 2: High Supply, High Demand — BALANCED (top-right)
    { trade: 'Electrician', sector: 'Multi-sector', supply: 8420, demand: 9200, x: 9200, y: 8420, quadrant: 'balanced' },
    { trade: 'Welder', sector: 'Construction', supply: 4850, demand: 5100, x: 5100, y: 4850, quadrant: 'balanced' },
    { trade: 'COPA', sector: 'IT/ITES', supply: 5180, demand: 4900, x: 4900, y: 5180, quadrant: 'balanced' },

    // Quadrant 3: Low Supply, Low Demand — EMERGING/NICHE (bottom-left)
    { trade: 'Plastic Processing', sector: 'Manufacturing', supply: 420, demand: 380, x: 380, y: 420, quadrant: 'niche' },
    { trade: 'Leather Goods', sector: 'Manufacturing', supply: 340, demand: 290, x: 290, y: 340, quadrant: 'niche' },

    // Quadrant 4: Low Supply, High Demand — CRITICAL GAP (bottom-right)
    { trade: 'Data Analyst', sector: 'IT/ITES', supply: 1200, demand: 12400, x: 12400, y: 1200, quadrant: 'gap' },
    { trade: 'Solar Installer', sector: 'Renewable Energy', supply: 850, demand: 6800, x: 6800, y: 850, quadrant: 'gap' },
    { trade: 'Healthcare Technician', sector: 'Healthcare', supply: 2100, demand: 8400, x: 8400, y: 2100, quadrant: 'gap' },
    { trade: 'Warehouse Operator', sector: 'Logistics', supply: 1800, demand: 8500, x: 8500, y: 1800, quadrant: 'gap' },
    { trade: 'CNC Operator', sector: 'Manufacturing', supply: 1450, demand: 4900, x: 4900, y: 1450, quadrant: 'gap' },
];

const QUADRANT_COLORS = {
    oversupply: 'hsl(var(--warning))',
    balanced: 'hsl(var(--success))',
    niche: 'hsl(var(--muted))',
    gap: 'hsl(var(--danger))',
};

const QUADRANT_LABELS = {
    oversupply: 'Excess Capacity',
    balanced: 'Well-Matched',
    niche: 'Emerging/Low Volume',
    gap: 'Critical Shortage',
};

export default function GapAnalysis() {
    const criticalGaps = TRADE_MATRIX.filter(t => t.quadrant === 'gap');
    const oversupplied = TRADE_MATRIX.filter(t => t.quadrant === 'oversupply');
    const balanced = TRADE_MATRIX.filter(t => t.quadrant === 'balanced');

    return (
        <div className="w-full space-y-6 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gap Analysis: Supply vs Demand</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">2×2 matrix identifying training-job mismatches</p>
            </div>

            {/* Inference */}
            <div className="rounded-xl border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Critical Action Required</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-red-600 dark:text-red-400">{criticalGaps.length} trades have severe gaps</span> (high demand, low supply) —
                            Data Analyst (10× shortfall), Solar Installer (8× gap), Healthcare Tech (4× gap).
                            Meanwhile, <span className="font-bold text-amber-600 dark:text-amber-400">{oversupplied.length} trades are oversupplied</span> (Fitter, Turner) —
                            consider repurposing or shutting underutilized batches.
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Critical Gaps</span>
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-3xl font-black text-red-600 dark:text-red-400">{criticalGaps.length}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Immediate expansion needed</p>
                </div>

                <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Balanced</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{balanced.length}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Maintain current levels</p>
                </div>

                <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Oversupplied</span>
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-3xl font-black text-amber-600 dark:text-amber-400">{oversupplied.length}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Consider scaling down</p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Trades</span>
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{TRADE_MATRIX.length}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Mapped in analysis</p>
                </div>
            </div>

            {/* 2×2 Scatter Matrix */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Supply-Demand Alignment Matrix</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Identify trades by quadrant (replicate Excel Template 3B.1)</p>
                    </div>
                    <div className="flex flex-col gap-2 text-xs">
                        {Object.entries(QUADRANT_LABELS).map(([key, label]) => (
                            <div key={key} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{
                                    background: QUADRANT_COLORS[key as keyof typeof QUADRANT_COLORS].replace('hsl(var(', '').replace('))', '') === '--warning' ? '#f59e0b' :
                                        QUADRANT_COLORS[key as keyof typeof QUADRANT_COLORS].replace('hsl(var(', '').replace('))', '') === '--success' ? '#10b981' :
                                            QUADRANT_COLORS[key as keyof typeof QUADRANT_COLORS].replace('hsl(var(', '').replace('))', '') === '--muted' ? '#94a3b8' : '#ef4444'
                                }} />
                                <span className="text-slate-500 dark:text-slate-400">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={500}>
                    <ScatterChart margin={{ top: 20, right: 80, bottom: 60, left: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Demand"
                            domain={[0, 13000]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            label={{ value: 'DEMAND →', position: 'bottom', offset: 40, fontSize: 12, fontWeight: 'bold', fill: '#0f172a' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Supply"
                            domain={[0, 10000]}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            label={{ value: '← SUPPLY', angle: -90, position: 'left', offset: 50, fontSize: 12, fontWeight: 'bold', fill: '#0f172a' }}
                        />
                        <ZAxis range={[100, 500]} />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={({ payload }) => payload?.[0] ? (
                                <div className="rounded-lg border bg-white dark:bg-slate-900 p-3 shadow-lg border-slate-200 dark:border-slate-800">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{payload[0].payload.trade}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{payload[0].payload.sector}</p>
                                    <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                        <p>Supply: <span className="font-bold">{payload[0].payload.supply.toLocaleString()}</span></p>
                                        <p>Demand: <span className="font-bold">{payload[0].payload.demand.toLocaleString()}</span></p>
                                        <p>Gap: <span className={cn('font-bold',
                                            payload[0].payload.demand > payload[0].payload.supply ? 'text-red-600' : 'text-amber-600'
                                        )}>{(payload[0].payload.demand - payload[0].payload.supply).toLocaleString()}</span></p>
                                    </div>
                                </div>
                            ) : null}
                        />
                        <Scatter data={TRADE_MATRIX}>
                            {TRADE_MATRIX.map((trade, i) => (
                                <Cell
                                    key={i}
                                    fill={
                                        trade.quadrant === 'oversupply' ? '#f59e0b' :
                                            trade.quadrant === 'balanced' ? '#10b981' :
                                                trade.quadrant === 'niche' ? '#94a3b8' : '#ef4444'
                                    }
                                    fillOpacity={0.7}
                                />
                            ))}
                        </Scatter>
                        {/* Quadrant dividers at median points */}
                        <ReferenceLine x={6500} stroke="#cbd5e1" strokeDasharray="8 4" />
                        <ReferenceLine y={5000} stroke="#cbd5e1" strokeDasharray="8 4" />
                    </ScatterChart>
                </ResponsiveContainer>

                {/* Quadrant labels overlaid on chart */}
                <div className="grid grid-cols-2 gap-4 mt-6 text-xs font-bold uppercase tracking-wider">
                    <div className="text-amber-600 text-right pr-16 bg-amber-50 dark:bg-amber-900/10 p-2 rounded">← High Supply, Low Demand<br />(Excess Capacity)</div>
                    <div className="text-emerald-600 pl-16 bg-emerald-50 dark:bg-emerald-900/10 p-2 rounded">High Supply, High Demand →<br />(Well-Matched)</div>
                    <div className="text-slate-500 text-right pr-16 bg-slate-50 dark:bg-slate-800 p-2 rounded">← Low Supply, Low Demand<br />(Niche/Emerging)</div>
                    <div className="text-red-600 pl-16 bg-red-50 dark:bg-red-900/10 p-2 rounded">Low Supply, High Demand →<br />(Critical Gap)</div>
                </div>
            </div>

            {/* Top 5 Lists per Quadrant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        Top 5 Critical Gaps (Scale Up)
                    </h3>
                    <div className="space-y-3">
                        {criticalGaps.slice(0, 5).map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.trade}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.sector}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-red-600 dark:text-red-400">Gap: {(t.demand - t.supply).toLocaleString()}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{((t.demand / t.supply) - 1).toFixed(1)}× shortfall</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6">
                    <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Top Oversupplied Trades (Review)
                    </h3>
                    <div className="space-y-3">
                        {oversupplied.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{t.trade}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.sector}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Excess: {(t.supply - t.demand).toLocaleString()}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{((t.supply / t.demand) - 1).toFixed(1)}× oversupply</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
