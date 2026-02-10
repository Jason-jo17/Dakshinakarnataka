import { useState } from 'react';
import { Save, Trash2, Info } from 'lucide-react';

interface PrimarySectorData {
  id: string;
  category: string;
  crop: string;
  area: number;
  production: number;
  yieldDist: number;
  yieldGapState: number;
  yieldGapIndia: number;
  skillingGap: string;
  courseKVK: boolean;
  courseTP: boolean;
  courseKVIC: boolean;
  courseOthers: string;
  sourceOutside: string;
  potentialReg: number;
  potentialRPL: number;
}

interface ForestProduce {
  id: string;
  type: string;
  significance: string;
  number: number;
  production: string;
  keyMarkets: string;
  skillIntervention: string;
  course: string;
  ifNot: string;
  remark: string;
}

export default function PrimaryDemandForm() {
  const [data, setData] = useState<PrimarySectorData[]>([]);
  const [newRow, setNewRow] = useState<Partial<PrimarySectorData>>({});

  const [forestData, setForestData] = useState<ForestProduce[]>([]);
  const [newForest, setNewForest] = useState<Partial<ForestProduce>>({});

  const addRow = () => {
    if (!newRow.crop) return;
    setData([...data, {
      id: crypto.randomUUID(),
      category: newRow.category || 'Agriculture',
      crop: newRow.crop || '',
      area: Number(newRow.area) || 0,
      production: Number(newRow.production) || 0,
      yieldDist: Number(newRow.yieldDist) || 0,
      yieldGapState: Number(newRow.yieldGapState) || 0,
      yieldGapIndia: Number(newRow.yieldGapIndia) || 0,
      skillingGap: newRow.skillingGap || 'No',
      courseKVK: newRow.courseKVK || false,
      courseTP: newRow.courseTP || false,
      courseKVIC: newRow.courseKVIC || false,
      courseOthers: newRow.courseOthers || '',
      sourceOutside: newRow.sourceOutside || '',
      potentialReg: Number(newRow.potentialReg) || 0,
      potentialRPL: Number(newRow.potentialRPL) || 0
    }]);
    setNewRow({ category: newRow.category }); // Keep category selected
  };

  const addForestRow = () => {
    if (!newForest.type) return;
    setForestData([...forestData, {
      id: crypto.randomUUID(),
      type: newForest.type || '',
      significance: newForest.significance || '',
      number: Number(newForest.number) || 0,
      production: newForest.production || '',
      keyMarkets: newForest.keyMarkets || '',
      skillIntervention: newForest.skillIntervention || '',
      course: newForest.course || '',
      ifNot: newForest.ifNot || '',
      remark: newForest.remark || ''
    }]);
    setNewForest({});
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
        <h4 className="font-semibold flex items-center gap-2 mb-2">
          <Info className="w-4 h-4" /> Template 2F: Primary Sector Demand
        </h4>
        <p>Consult with KVK, Animal Husbandry, Fishery, and Horticulture officials. Focus on main crops and demand for productivity improvement skilling.</p>
      </div>

      {/* Primary Sector Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-200 pb-2">
          2F.1 Primary Sector Data Entry
        </h3>

        {/* Add Row Form - Split into 2 lines for space */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4 bg-slate-50 p-4 rounded-md">
          <div className="col-span-1">
            <label className="block text-xs font-medium mb-1">Category</label>
            <select
              value={newRow.category || 'Agriculture'}
              onChange={e => setNewRow({ ...newRow, category: e.target.value })}
              className="w-full input-standard text-xs"
            >
              <option>Agriculture</option>
              <option>Horticulture</option>
              <option>Animal Husbandry</option>
              <option>Fisheries</option>
              <option>Sericulture</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium mb-1">Crop/Activity *</label>
            <input type="text" value={newRow.crop || ''} onChange={e => setNewRow({ ...newRow, crop: e.target.value })} className="w-full input-standard text-xs" placeholder="Required" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Area (Hec)</label>
            <input type="number" value={newRow.area || ''} onChange={e => setNewRow({ ...newRow, area: Number(e.target.value) })} className="w-full input-standard text-xs" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Prod (Ton)</label>
            <input type="number" value={newRow.production || ''} onChange={e => setNewRow({ ...newRow, production: Number(e.target.value) })} className="w-full input-standard text-xs" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Dist Yield</label>
            <input type="number" value={newRow.yieldDist || ''} onChange={e => setNewRow({ ...newRow, yieldDist: Number(e.target.value) })} className="w-full input-standard text-xs" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Gap State</label>
            <input type="number" value={newRow.yieldGapState || ''} onChange={e => setNewRow({ ...newRow, yieldGapState: Number(e.target.value) })} className="w-full input-standard text-xs" />
          </div>

          {/* Line 2 */}
          <div>
            <label className="block text-xs font-medium mb-1">Gap India</label>
            <input type="number" value={newRow.yieldGapIndia || ''} onChange={e => setNewRow({ ...newRow, yieldGapIndia: Number(e.target.value) })} className="w-full input-standard text-xs" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Can Skilling help?</label>
            <select
              value={newRow.skillingGap || 'No'}
              onChange={e => setNewRow({ ...newRow, skillingGap: e.target.value })}
              className="w-full input-standard text-xs"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1">Courses Avail</label>
            <div className="flex gap-2 items-center text-xs">
              <label><input type="checkbox" checked={newRow.courseKVK || false} onChange={e => setNewRow({ ...newRow, courseKVK: e.target.checked })} /> KVK</label>
              <label><input type="checkbox" checked={newRow.courseTP || false} onChange={e => setNewRow({ ...newRow, courseTP: e.target.checked })} /> TP</label>
              <label><input type="checkbox" checked={newRow.courseKVIC || false} onChange={e => setNewRow({ ...newRow, courseKVIC: e.target.checked })} /> KVIC</label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Potential Trg</label>
            <input type="number" value={newRow.potentialReg || ''} onChange={e => setNewRow({ ...newRow, potentialReg: Number(e.target.value) })} className="w-full input-standard text-xs" placeholder="Regular" />
          </div>
          <div className="flex items-end">
            <button
              onClick={addRow}
              disabled={!newRow.crop}
              className="w-full py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Row
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Crop</th>
                <th className="p-2 border">Area</th>
                <th className="p-2 border">Prod</th>
                <th className="p-2 border">Yield</th>
                <th className="p-2 border">Gap(St)</th>
                <th className="p-2 border">Gap(In)</th>
                <th className="p-2 border">Skill?</th>
                <th className="p-2 border">Sources</th>
                <th className="p-2 border">Pot. Trg</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.id}>
                  <td className="p-2 border">{row.category}</td>
                  <td className="p-2 border font-medium">{row.crop}</td>
                  <td className="p-2 border">{row.area}</td>
                  <td className="p-2 border">{row.production}</td>
                  <td className="p-2 border">{row.yieldDist}</td>
                  <td className="p-2 border text-red-600">{row.yieldGapState}</td>
                  <td className="p-2 border text-red-600">{row.yieldGapIndia}</td>
                  <td className="p-2 border">{row.skillingGap}</td>
                  <td className="p-2 border">
                    {[row.courseKVK && 'KVK', row.courseTP && 'TP', row.courseKVIC && 'KVIC'].filter(Boolean).join(', ')}
                  </td>
                  <td className="p-2 border">{row.potentialReg}</td>
                  <td className="p-2 border text-center">
                    <button onClick={() => setData(data.filter(r => r.id !== row.id))} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Non-Timber Forest Produce Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-200 pb-2">
          2F.3 Non-Timber Forest Produce
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 bg-slate-50 p-4 rounded-md">
          <div>
            <label className="block text-xs font-medium mb-1">Type *</label>
            <input type="text" value={newForest.type || ''} onChange={e => setNewForest({ ...newForest, type: e.target.value })} className="w-full input-standard text-xs" placeholder="e.g. Honey" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Significance</label>
            <input type="text" value={newForest.significance || ''} onChange={e => setNewForest({ ...newForest, significance: e.target.value })} className="w-full input-standard text-xs" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Number Involved</label>
            <input type="number" value={newForest.number || ''} onChange={e => setNewForest({ ...newForest, number: Number(e.target.value) })} className="w-full input-standard text-xs" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Production</label>
            <input type="text" value={newForest.production || ''} onChange={e => setNewForest({ ...newForest, production: e.target.value })} className="w-full input-standard text-xs" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1">Skill Intervention</label>
            <input type="text" value={newForest.skillIntervention || ''} onChange={e => setNewForest({ ...newForest, skillIntervention: e.target.value })} className="w-full input-standard text-xs" placeholder="How skill dev helps?" />
          </div>
          <div className="flex items-end">
            <button
              onClick={addForestRow}
              disabled={!newForest.type}
              className="w-full py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Row
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Significance</th>
                <th className="p-2 border">Number</th>
                <th className="p-2 border">Production</th>
                <th className="p-2 border">Skill Help?</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {forestData.map(row => (
                <tr key={row.id}>
                  <td className="p-2 border">{row.type}</td>
                  <td className="p-2 border">{row.significance}</td>
                  <td className="p-2 border">{row.number}</td>
                  <td className="p-2 border">{row.production}</td>
                  <td className="p-2 border">{row.skillIntervention}</td>
                  <td className="p-2 border text-center">
                    <button onClick={() => setForestData(forestData.filter(r => r.id !== row.id))} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Save className="w-4 h-4" />
          Save Primary Sector Data
        </button>
      </div>
    </div>
  );
}
