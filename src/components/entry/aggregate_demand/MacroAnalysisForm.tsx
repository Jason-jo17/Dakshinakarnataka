import React, { useState } from 'react';
import { Save, Info } from 'lucide-react';

export default function MacroAnalysisForm() {
  // 2C.1 Demographic Analysis
  const [demographics, setDemographics] = useState({
    districtTotal: 2089649,
    districtRural: 1093563,
    districtUrban: 996086,
    scTotal: 148178,
    stTotal: 82268
  });

  // 2C.3 GSDP Size (2018 base)
  const [gsdp, setGsdp] = useState({
    agriculture: 12419735,
    mining: 417070,
    manufacturing: 16193274,
    electricity: 1719721,
    construction: 7388971,
    trade: 19532044,
    finance: 42861943,
    public: 10750907
  });

  // 2C.5 Workforce Size
  const [workforce, setWorkforce] = useState({
    agriculture: 8264804,
    mining: 51833,
    manufacturing: 945956,
    electricity: 47946,
    construction: 939477,
    trade: 1916533,
    finance: 116625,
    public: 676423
  });

  const handleDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDemographics({ ...demographics, [e.target.name]: Number(e.target.value) });
  };

  const handleGsdpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGsdp({ ...gsdp, [e.target.name]: Number(e.target.value) });
  };

  const handleWorkforceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkforce({ ...workforce, [e.target.name]: Number(e.target.value) });
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-blue-800 text-sm">
        <Info className="w-5 h-5 shrink-0" />
        <p>Note: This sheet is optional. Use this if the DSC has district level GDP data or reliable estimates.</p>
      </div>

      {/* 2C.1 Demographics */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">2C.1 Demographic Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-slate-600 dark:text-slate-400 border-b border-slate-200 pb-2">Total Population</h4>
            <div className="space-y-2">
              <label className="block text-sm">Total</label>
              <input type="number" name="districtTotal" value={demographics.districtTotal} onChange={handleDemoChange} className="w-full input-standard" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Rural</label>
              <input type="number" name="districtRural" value={demographics.districtRural} onChange={handleDemoChange} className="w-full input-standard" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm">Urban</label>
              <input type="number" name="districtUrban" value={demographics.districtUrban} onChange={handleDemoChange} className="w-full input-standard" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-600 dark:text-slate-400 border-b border-slate-200 pb-2">SC Population</h4>
            <div className="space-y-2">
              <label className="block text-sm">Total SC</label>
              <input type="number" name="scTotal" value={demographics.scTotal} onChange={handleDemoChange} className="w-full input-standard" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-600 dark:text-slate-400 border-b border-slate-200 pb-2">ST Population</h4>
            <div className="space-y-2">
              <label className="block text-sm">Total ST</label>
              <input type="number" name="stTotal" value={demographics.stTotal} onChange={handleDemoChange} className="w-full input-standard" />
            </div>
          </div>
        </div>
      </div>

      {/* 2C.3 Sector Size (GSDP) */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">2C.3 Sector Size (GSDP in INR Lakhs)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(gsdp).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm capitalize mb-1">{key}</label>
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleGsdpChange}
                className="w-full input-standard"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2C.5 Workforce Size */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">2C.5 Workforce Size (State/District)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(workforce).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm capitalize mb-1">{key}</label>
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleWorkforceChange}
                className="w-full input-standard"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Save className="w-4 h-4" />
          Save Macro Analysis
        </button>
      </div>
    </div>
  );
}
