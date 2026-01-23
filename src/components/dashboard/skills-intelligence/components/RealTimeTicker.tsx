
import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';

interface Metrics {
  activeTrainees: number;
  placementsThisMonth: number;
  openVacancies: number;
  newRegistrations: number;
}

const RealTimeTicker: React.FC<{ metrics: Metrics }> = ({ metrics }) => {
  // Simple simulator to make numbers change slightly to simulate "real-time"
  const [displayMetrics, setDisplayMetrics] = useState(metrics);

  useEffect(() => {
    const interval = setInterval(() => {
        // Randomly perturb one metric
        const key = Object.keys(metrics)[Math.floor(Math.random() * 4)] as keyof Metrics;
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        
        setDisplayMetrics(prev => ({
            ...prev,
            [key]: Math.max(0, prev[key] + change)
        }));
    }, 3000);

    return () => clearInterval(interval);
  }, [metrics]);

  return (
    <div className="bg-slate-900 text-white rounded-lg p-3 flex flex-wrap lg:flex-nowrap items-center gap-6 shadow-md overflow-hidden relative">
      <div className="flex items-center gap-2 text-green-400 font-bold text-sm whitespace-nowrap animate-pulse">
        <Radio size={16} />
        LIVE
      </div>
      
      <div className="flex-1 flex items-center justify-around gap-4 overflow-x-auto no-scrollbar">
        <TickerItem label="Active Trainees" value={displayMetrics.activeTrainees} color="text-blue-300" />
        <div className="h-8 w-px bg-slate-700 hidden lg:block"></div>
        <TickerItem label="Placements (Dec)" value={displayMetrics.placementsThisMonth} color="text-green-300" />
        <div className="h-8 w-px bg-slate-700 hidden lg:block"></div>
        <TickerItem label="Open Vacancies" value={displayMetrics.openVacancies} color="text-yellow-300" />
        <div className="h-8 w-px bg-slate-700 hidden lg:block"></div>
        <TickerItem label="New Registrations" value={displayMetrics.newRegistrations} color="text-purple-300" />
      </div>
    </div>
  );
};

const TickerItem = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex flex-col items-center min-w-[100px]">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</span>
        <span className={`text-xl font-mono font-bold ${color}`}>{value.toLocaleString()}</span>
    </div>
);

export default RealTimeTicker;
