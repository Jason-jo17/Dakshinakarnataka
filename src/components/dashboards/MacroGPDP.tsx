import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { cn } from '../../lib/utils';
import { TrendingUp, Building2, Hammer, Zap } from 'lucide-react';
import { AIInsights } from '../common/AIInsights';

// Macro demand: Karnataka GSDP growth by sector (private economy)
const MACRO_GSDP = [
  { year: 2024, finance: 10.8, manufacturing: 16.2, trade: 19.5, construction: 8.4, agriculture: 7.6, public: 6.2, total: 68.7 },
  { year: 2025, finance: 12.2, manufacturing: 17.3, trade: 21.6, construction: 9.1, agriculture: 8.1, public: 6.9, total: 75.2 },
  { year: 2026, finance: 13.8, manufacturing: 18.5, trade: 23.9, construction: 9.8, agriculture: 8.7, public: 7.7, total: 82.4 },
  { year: 2027, finance: 15.6, manufacturing: 19.8, trade: 26.5, construction: 10.6, agriculture: 9.3, public: 8.6, total: 90.4 },
  { year: 2028, finance: 17.6, manufacturing: 21.2, trade: 29.3, construction: 11.4, agriculture: 10.0, public: 9.6, total: 99.1 },
];

// CAGR by sector
const SECTOR_CAGR = [
  { sector: 'Finance', cagr: 12.8 },
  { sector: 'Public Admin', cagr: 11.6 },
  { sector: 'Trade', cagr: 10.7 },
  { sector: 'Manufacturing', cagr: 6.9 },
  { sector: 'Construction', cagr: 7.8 },
  { sector: 'Agriculture', cagr: 7.2 },
];

// GPDP Government Projects (Template: GPDP demand data)
const GPDP_PROJECTS = [
  { project: 'Rural Road Construction', budget: 42000000, constructionWorkers: 28, oandmWorkers: 6, duration: 12, sector: 'Construction' },
  { project: 'Drinking Water Pipeline', budget: 38000000, constructionWorkers: 22, oandmWorkers: 5, duration: 10, sector: 'Infrastructure' },
  { project: 'Community Hall Development', budget: 15000000, constructionWorkers: 12, oandmWorkers: 3, duration: 8, sector: 'Construction' },
  { project: 'Solar Street Lighting', budget: 8500000, constructionWorkers: 8, oandmWorkers: 4, duration: 6, sector: 'Renewable' },
  { project: 'Anganwadi Renovation', budget: 6200000, constructionWorkers: 6, oandmWorkers: 2, duration: 5, sector: 'Social' },
  { project: 'Watershed Management', budget: 12000000, constructionWorkers: 10, oandmWorkers: 3, duration: 12, sector: 'Agriculture' },
  { project: 'School Building Upgrade', budget: 22000000, constructionWorkers: 18, oandmWorkers: 4, duration: 9, sector: 'Education' },
  { project: 'PHC Equipment Upgrade', budget: 9500000, constructionWorkers: 4, oandmWorkers: 2, duration: 4, sector: 'Healthcare' },
];

const GPDP_ROLE_DEMAND = [
  { role: 'Mason', construction: 42, oandm: 0 },
  { role: 'Plumber', construction: 18, oandm: 8 },
  { role: 'Electrician', construction: 15, oandm: 12 },
  { role: 'Carpenter', construction: 12, oandm: 3 },
  { role: 'Welder', construction: 8, oandm: 0 },
  { role: 'Painter', construction: 10, oandm: 5 },
  { role: 'Equipment Mechanic', construction: 5, oandm: 8 },
];

export default function MacroGPDP() {
  const totalConstructionWorkers = GPDP_PROJECTS.reduce((sum, p) => sum + p.constructionWorkers, 0);
  const totalOandMWorkers = GPDP_PROJECTS.reduce((sum, p) => sum + p.oandmWorkers, 0);
  const totalBudget = GPDP_PROJECTS.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="w-full space-y-6 p-6 bg-background">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Macro Demand + GPDP Government Projects</h2>
        <p className="text-sm text-muted-foreground mt-1">Combined projection: private sector (GSDP growth) + public works (GP demand)</p>
      </div>

      {/* Inference */}
      <div className="rounded-xl border-l-4 border-l-primary bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">Combined Demand Insight</p>
            <p className="text-sm text-muted-foreground">
              Karnataka GSDP projected to grow from <span className="font-bold text-primary">₹68.7L Cr</span> (2024) to
              <span className="font-bold text-primary"> ₹99.1L Cr</span> (2028) — weighted CAGR 9.2%.
              Finance (12.8% CAGR) & Trade (10.7%) fastest-growing sectors.
              Government projects add <span className="font-bold text-success">{totalConstructionWorkers} construction + {totalOandMWorkers} O&M</span> workers
              from 8 GPDP initiatives (₹{(totalBudget / 10000000).toFixed(1)} Cr budget).
            </p>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'GSDP 2028 (Projected)', value: '₹99.1L Cr', icon: Building2, color: 'text-primary' },
          { label: 'Highest CAGR Sector', value: 'Finance (12.8%)', icon: TrendingUp, color: 'text-success' },
          { label: 'GPDP Projects', value: '8 Active', icon: Hammer, color: 'text-warning' },
          { label: 'GPDP Workers Needed', value: `${totalConstructionWorkers + totalOandMWorkers}`, icon: Zap, color: 'text-danger' },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase">{kpi.label}</span>
              <kpi.icon className={cn('h-5 w-5', kpi.color)} />
            </div>
            <p className="text-2xl font-black text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Macro GSDP Projection */}
        <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">Karnataka GSDP Growth (2024-2028)</h3>
          <p className="text-sm text-muted-foreground mb-6">6 sector projections in ₹L Cr</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MACRO_GSDP}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${v}L`} />
              <Tooltip formatter={(v: number) => [`₹${v.toFixed(1)}L Cr`]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="finance" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Finance" />
              <Area type="monotone" dataKey="trade" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Trade" />
              <Area type="monotone" dataKey="manufacturing" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.6} name="Mfg" />
              <Area type="monotone" dataKey="construction" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Const" />
              <Area type="monotone" dataKey="agriculture" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Agri" />
              <Area type="monotone" dataKey="public" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Public" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sector CAGR */}
        <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">Sector Growth Rates (CAGR %)</h3>
          <p className="text-sm text-muted-foreground mb-6">Ranked by compound annual growth</p>
          <div className="space-y-4">
            {SECTOR_CAGR.sort((a, b) => b.cagr - a.cagr).map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-foreground">{s.sector}</span>
                  <span className="text-sm font-bold text-primary">{s.cagr.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-success rounded-full"
                    style={{ width: `${(s.cagr / 13) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GPDP Project List */}
        <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">GPDP Government Projects (FY 2024-25)</h3>
          <p className="text-sm text-muted-foreground mb-6">8 active projects with worker requirements</p>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {GPDP_PROJECTS.map((proj, i) => (
              <div key={i} className="p-3 rounded-lg border border-border bg-muted/10">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{proj.project}</p>
                    <p className="text-xs text-muted-foreground">{proj.sector} • {proj.duration} months</p>
                  </div>
                  <span className="text-xs font-bold text-primary">₹{(proj.budget / 10000000).toFixed(2)}Cr</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">
                    Construction: <span className="font-bold text-foreground">{proj.constructionWorkers}</span>
                  </span>
                  <span className="text-muted-foreground">
                    O&M: <span className="font-bold text-foreground">{proj.oandmWorkers}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
            <span className="font-bold text-muted-foreground">Total Budget:</span>
            <span className="font-bold text-primary">₹{(totalBudget / 10000000).toFixed(2)} Cr</span>
          </div>
        </div>

        {/* GPDP Role Breakdown */}
        <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
          <h3 className="text-lg font-bold text-foreground mb-1">GPDP: Role-Wise Worker Demand</h3>
          <p className="text-sm text-muted-foreground mb-6">Construction vs O&M breakdown</p>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={GPDP_ROLE_DEMAND} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="role" tick={{ fontSize: 10 }} width={95} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="construction" fill="hsl(var(--primary))" name="Construction" stackId="a" />
              <Bar dataKey="oandm" fill="hsl(var(--success))" name="O&M" stackId="a" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <AIInsights context="macroeconomic demand and government project analysis" />
    </div>
  );
}
