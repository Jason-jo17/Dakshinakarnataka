import React, { useState } from 'react';
import { Shield, Map, Building, GraduationCap, ArrowRight, X, Copy, ExternalLink, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { DISTRICTS } from '../../data/districts';

// Organization/External Links Configuration
const EXTERNAL_LINKS = [
  {
    id: 'company',
    title: 'Company View',
    icon: Building,
    description: 'For Industries & Recruiters',
    url: 'https://inpulse-staging-recruitment.web.app/signin',
    credentials: {
      username: 'hr@inunity.in',
      password: 'hr@inunity.in'
    },
    color: 'blue'
  },
  {
    id: 'institution',
    title: 'Institution View',
    icon: UniversityIcon, // Defined below
    description: 'For Colleges & Universities',
    url: 'https://inpulse-staging-recruitment.web.app/signin',
    credentials: {
      username: 'tpo@sahyadri.com',
      password: 'tpo@sahyadri.com'
    },
    color: 'emerald'
  },
  {
    id: 'student',
    title: 'Student View',
    icon: GraduationCap,
    description: 'For Students & Learners',
    url: 'https://inpulse-staging-recruitment.web.app/signin',
    credentials: {
      username: 'bddhanush03@gmail.com',
      password: 'bddhanush03@gmail.com'
    },
    color: 'violet'
  }
];

// Helper Icon for Institution since 'University' might not be in the lucide version used, using Building2 fallback logic or simple SVG if needed. 
// Actually 'University' exists in newer Lucide, but let's use Building2 as safe bet or import it.
import { Building2 } from 'lucide-react';
function UniversityIcon(props: any) { return <Building2 {...props} />; }


const CentralLoginPage = () => {
  const { login, setDistrict } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'super' | 'district'>('super');
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [selectedDistrictVal, setSelectedDistrictVal] = useState('Dakshina Kannada');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExternal, setSelectedExternal] = useState<typeof EXTERNAL_LINKS[0] | null>(null);
  const [isGatekeeperVerified, setIsGatekeeperVerified] = useState(false);

  const handleInternalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Login
    if (activeTab === 'super') {
      login({
        id: 'super_admin',
        name: 'Super Admin',
        role: 'super_admin'
      });
      setDistrict(null); // Ensure district is reset for Super Admin initially
    } else {
      login({
        id: 'district_admin',
        name: `District Admin (${selectedDistrictVal})`,
        role: 'district_admin',
        managedEntityId: selectedDistrictVal
      });
      setDistrict(selectedDistrictVal);
    }
  };

  const openExternalModal = (item: typeof EXTERNAL_LINKS[0]) => {
    setSelectedExternal(item);
    setIsGatekeeperVerified(false);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 md:p-8 font-sans">

      {/* Header */}
      <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex justify-center mb-4">
          <img
            src="/assets/karnataka-emblem.png"
            alt="Government of Karnataka"
            className="h-20 w-auto object-contain drop-shadow-md"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Karnataka Skill Development Corporation
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Unified State-Level Skill Intelligence & Employment Portal
        </p>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

        {/* Left Col: Internal Login */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden order-2 lg:order-1">
          <div className="p-1 bg-slate-100 dark:bg-slate-900/50 flex">
            <button
              onClick={() => setActiveTab('super')}
              className={`flex-1 py-3 text-sm font-medium rounded-t-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'super'
                ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-blue-400 border-t-2 border-blue-500'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
            >
              <Globe size={18} /> State Admin
            </button>
            <button
              onClick={() => setActiveTab('district')}
              className={`flex-1 py-3 text-sm font-medium rounded-t-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'district'
                ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400 border-t-2 border-emerald-500'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
            >
              <Map size={18} /> District Admin
            </button>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {activeTab === 'super' ? 'State Level Access' : 'District Level Access'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {activeTab === 'super'
                  ? 'Access the comprehensive dashboard for all 31 districts of Karnataka.'
                  : 'Login to manage and view insights for a specific district.'}
              </p>
            </div>

            <form onSubmit={handleInternalLogin} className="space-y-5">

              {activeTab === 'district' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Select District
                  </label>
                  <div className="relative">
                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      value={selectedDistrictVal}
                      onChange={(e) => setSelectedDistrictVal(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white appearance-none"
                    >
                      {DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder={activeTab === 'super' ? "admin@karnataka.gov.in" : "admin@dk.gov.in"}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-slate-400 rounded-sm" />
                  {/* Simplified lock icon placeholder or import Lock */}
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] ${activeTab === 'super'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                    }`}
                >
                  Sign In to Dashboard <ArrowRight size={18} />
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-400">
                  Use any credentials for demo access.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: External Links Grid */}
        <div className="order-1 lg:order-2 space-y-6">
          <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 mb-2">
            <ExternalLink size={20} />
            <h3 className="text-lg font-bold">Role based access portals</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {EXTERNAL_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => openExternalModal(link)}
                className={`group relative overflow-hidden bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-${link.color}-500 dark:hover:border-${link.color}-500 shadow-sm hover:shadow-md transition-all text-left`}
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-${link.color}-500 group-hover:w-2 transition-all`} />
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-${link.color}-50 dark:bg-${link.color}-900/20 text-${link.color}-600 dark:text-${link.color}-400 group-hover:scale-110 transition-transform`}>
                    <link.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {link.title}
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 p-4 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300 flex gap-2">
              <span className="font-bold">Note:</span>
              Access credentials will be shared once you verify your identity. Use them to login to the respective portals.
            </p>
          </div>
        </div>
      </div>

      {/* Credentials Modal */}
      {modalOpen && selectedExternal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            <div className={`h-2 w-full bg-${selectedExternal.color}-500`} />

            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${selectedExternal.color}-50 dark:bg-${selectedExternal.color}-900/20 text-${selectedExternal.color}-600`}>
                    <selectedExternal.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {isGatekeeperVerified ? 'Login Credentials' : 'Verify Identity'}
                    </h3>
                    <p className="text-xs text-slate-500">for {selectedExternal.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {!isGatekeeperVerified ? (
                // Gatekeeper Form
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setIsGatekeeperVerified(true);
                }} className="space-y-4">

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
                    <p className="text-xs text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                      <Shield size={14} className="mt-0.5 flex-shrink-0" />
                      Security Check: Please authenticate to view credentials for this external portal.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Username</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your username"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter your password"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`w-full py-2.5 px-4 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 bg-${selectedExternal.color}-600`}
                    >
                      Verify & Show Credentials <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                // Credentials View
                <>
                  <div className="space-y-4 mb-8">
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="mb-3">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Username / Email</label>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <code className="text-sm font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 flex-1">
                            {selectedExternal.credentials.username}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(selectedExternal.credentials.username)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Copy Username"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <code className="text-sm font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 flex-1">
                            {selectedExternal.credentials.password}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(selectedExternal.credentials.password)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Copy Password"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setModalOpen(false)}
                      className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Close
                    </button>
                    <a
                      href={selectedExternal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setModalOpen(false)}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 bg-${selectedExternal.color}-600`}
                    >
                      Access Portal <ExternalLink size={16} />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CentralLoginPage;
