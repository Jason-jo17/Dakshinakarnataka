import React, { useState } from 'react';
import { Save, Plus, Trash2, Info } from 'lucide-react';

interface GPDPProject {
  id: string;
  projectName: string;
  numGps: number;
  indicative: string;
  roleCons: string;
  roleOnm: string;
  countCons: number;
  countOnm: number;
}

interface GovtAgenda {
  id: string;
  projectName: string;
  block: string;
  indicative: string;
  roleCons: string;
  roleOnm: string;
  countCons: number;
  countOnm: number;
}

export default function DemandGPDPForm() {
  // Part 1: Metadata
  const [metadata, setMetadata] = useState({
    district: 'Dakshina Kannada',
    gramPanchayats: '',
    submittedOn: '',
    block: '',
    village: '',
    cluster: '',
    popTotal: 2089649,
    popRural: 1093563,
    popUrban: 996086
  });

  // Part 1: Key Projects
  const [projects, setProjects] = useState<GPDPProject[]>([]);
  const [newProject, setNewProject] = useState<Partial<GPDPProject>>({});

  // Part 2: Govt Agenda
  const [agenda, setAgenda] = useState<GovtAgenda[]>([]);
  const [newAgenda, setNewAgenda] = useState<Partial<GovtAgenda>>({});

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const addProject = () => {
    if (!newProject.projectName) return;
    setProjects([...projects, {
      id: crypto.randomUUID(),
      projectName: newProject.projectName || '',
      numGps: Number(newProject.numGps) || 0,
      indicative: newProject.indicative || '',
      roleCons: newProject.roleCons || '',
      roleOnm: newProject.roleOnm || '',
      countCons: Number(newProject.countCons) || 0,
      countOnm: Number(newProject.countOnm) || 0
    }]);
    setNewProject({});
  };

  const addAgenda = () => {
    if (!newAgenda.projectName) return;
    setAgenda([...agenda, {
      id: crypto.randomUUID(),
      projectName: newAgenda.projectName || '',
      block: newAgenda.block || '',
      indicative: newAgenda.indicative || '',
      roleCons: newAgenda.roleCons || '',
      roleOnm: newAgenda.roleOnm || '',
      countCons: Number(newAgenda.countCons) || 0,
      countOnm: Number(newAgenda.countOnm) || 0
    }]);
    setNewAgenda({});
  };

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <h4 className="font-semibold flex items-center gap-2 mb-2">
          <Info className="w-4 h-4" /> Instructions (Template 2D)
        </h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Part 1: Captures demand arising from increased govt spending through Panchayats.</li>
          <li>Part 2: Captures demand likely to arise from other government spending in the district.</li>
          <li>Coordinate with Gram Panchayats and other departments to estimate this demand.</li>
        </ul>
      </div>

      {/* Part 1: Metadata */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-200 pb-2">
          2D.1 District & GP Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <input type="text" value={metadata.district} disabled className="w-full input-standard bg-slate-100" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Gram Panchayats</label>
            <input type="number" name="gramPanchayats" value={metadata.gramPanchayats} onChange={handleMetadataChange} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GPDP Submitted On</label>
            <input type="date" name="submittedOn" value={metadata.submittedOn} onChange={handleMetadataChange} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Block</label>
            <input type="text" name="block" value={metadata.block} onChange={handleMetadataChange} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Village</label>
            <input type="text" name="village" value={metadata.village} onChange={handleMetadataChange} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cluster</label>
            <input type="text" name="cluster" value={metadata.cluster} onChange={handleMetadataChange} className="w-full input-standard" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500">Total Population</label>
            <div className="text-lg font-medium">{metadata.popTotal}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500">Rural Population</label>
            <div className="text-lg font-medium">{metadata.popRural}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500">Urban Population</label>
            <div className="text-lg font-medium">{metadata.popUrban}</div>
          </div>
        </div>
      </div>

      {/* Part 1: Key Projects Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-200 pb-2">
          2D.2 Key Projects (GPDP) & Manpower Estimation
        </h3>

        {/* Add New Row */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs mb-1">Project Name *</label>
            <input type="text" value={newProject.projectName || ''} onChange={e => setNewProject({ ...newProject, projectName: e.target.value })} className="w-full input-standard" placeholder="Project Name (Required)" />
          </div>
          <div>
            <label className="block text-xs mb-1">No. GPs</label>
            <input type="number" value={newProject.numGps || ''} onChange={e => setNewProject({ ...newProject, numGps: Number(e.target.value) })} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-xs mb-1">Indicative</label>
            <input type="text" value={newProject.indicative || ''} onChange={e => setNewProject({ ...newProject, indicative: e.target.value })} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-xs mb-1">Role (Cons)</label>
            <input type="text" value={newProject.roleCons || ''} onChange={e => setNewProject({ ...newProject, roleCons: e.target.value })} className="w-full input-standard" placeholder="Helper/Mason" />
          </div>
          <div>
            <label className="block text-xs mb-1">Count (Cons)</label>
            <input type="number" value={newProject.countCons || ''} onChange={e => setNewProject({ ...newProject, countCons: Number(e.target.value) })} className="w-full input-standard" />
          </div>
          <div>
            <button
              onClick={addProject}
              disabled={!newProject.projectName}
              className="w-full h-[38px] flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-2 border">Project</th>
                <th className="px-4 py-2 border">Num GPs</th>
                <th className="px-4 py-2 border">Indicative</th>
                <th className="px-4 py-2 border">Role (Const)</th>
                <th className="px-4 py-2 border">Num (Const)</th>
                <th className="px-4 py-2 border">Role (O&M)</th>
                <th className="px-4 py-2 border">Num (O&M)</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-2 border">{p.projectName}</td>
                  <td className="px-4 py-2 border">{p.numGps}</td>
                  <td className="px-4 py-2 border">{p.indicative}</td>
                  <td className="px-4 py-2 border bg-blue-50 dark:bg-blue-900/20">{p.roleCons}</td>
                  <td className="px-4 py-2 border bg-blue-50 dark:bg-blue-900/20">{p.countCons}</td>
                  <td className="px-4 py-2 border bg-green-50 dark:bg-green-900/20">{p.roleOnm}</td>
                  <td className="px-4 py-2 border bg-green-50 dark:bg-green-900/20">{p.countOnm}</td>
                  <td className="px-4 py-2 border text-center">
                    <button onClick={() => setProjects(projects.filter(x => x.id !== p.id))} className="text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: Govt Agenda Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-200 pb-2">
          Part 2 - Other Government Development Agenda
        </h3>

        {/* Add New Row */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs mb-1">Project Name *</label>
            <input type="text" value={newAgenda.projectName || ''} onChange={e => setNewAgenda({ ...newAgenda, projectName: e.target.value })} className="w-full input-standard" placeholder="Project Name (Required)" />
          </div>
          <div>
            <label className="block text-xs mb-1">Block Where</label>
            <input type="text" value={newAgenda.block || ''} onChange={e => setNewAgenda({ ...newAgenda, block: e.target.value })} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-xs mb-1">Indicative</label>
            <input type="text" value={newAgenda.indicative || ''} onChange={e => setNewAgenda({ ...newAgenda, indicative: e.target.value })} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-xs mb-1">Role (Cons)</label>
            <input type="text" value={newAgenda.roleCons || ''} onChange={e => setNewAgenda({ ...newAgenda, roleCons: e.target.value })} className="w-full input-standard" />
          </div>
          <div>
            <label className="block text-xs mb-1">Count (Cons)</label>
            <input type="number" value={newAgenda.countCons || ''} onChange={e => setNewAgenda({ ...newAgenda, countCons: Number(e.target.value) })} className="w-full input-standard" />
          </div>
          <div>
            <button
              onClick={addAgenda}
              disabled={!newAgenda.projectName}
              className="w-full h-[38px] flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-2 border">Project</th>
                <th className="px-4 py-2 border">Block</th>
                <th className="px-4 py-2 border">Indicative</th>
                <th className="px-4 py-2 border">Role (Const)</th>
                <th className="px-4 py-2 border">Num (Const)</th>
                <th className="px-4 py-2 border">Role (O&M)</th>
                <th className="px-4 py-2 border">Num (O&M)</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {agenda.map(a => (
                <tr key={a.id}>
                  <td className="px-4 py-2 border">{a.projectName}</td>
                  <td className="px-4 py-2 border">{a.block}</td>
                  <td className="px-4 py-2 border">{a.indicative}</td>
                  <td className="px-4 py-2 border bg-blue-50 dark:bg-blue-900/20">{a.roleCons}</td>
                  <td className="px-4 py-2 border bg-blue-50 dark:bg-blue-900/20">{a.countCons}</td>
                  <td className="px-4 py-2 border bg-green-50 dark:bg-green-900/20">{a.roleOnm}</td>
                  <td className="px-4 py-2 border bg-green-50 dark:bg-green-900/20">{a.countOnm}</td>
                  <td className="px-4 py-2 border text-center">
                    <button onClick={() => setAgenda(agenda.filter(x => x.id !== a.id))} className="text-red-600 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
          Save GPDP Data
        </button>
      </div>
    </div>
  );
}
