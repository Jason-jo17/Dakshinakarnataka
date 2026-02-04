import React, { useState } from 'react';
import { Shield, Map, GraduationCap, ArrowRight, User, Globe, School, ExternalLink, X, Briefcase, ChevronRight, FileText } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { useAuthStore } from '../../store/useAuthStore';
import { DISTRICTS } from '../../data/districts';
import TraineeDetailsSection from '../pages/TraineeDetailsSection';
import InstitutionEntryForm from '../entry/InstitutionEntryForm';
import TrainingCenterSection from '../pages/TrainingCenterSection';

export default function CentralLoginPage() {
  const { login, setDistrict } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'super' | 'district' | 'institution' | 'student' | 'company'>('super');
  const [activeInstTab, setActiveInstTab] = useState<'profile' | 'center'>('profile'); // New inner tab state
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [selectedDistrictVal, setSelectedDistrictVal] = useState('Dakshina Kannada');

  // State for the "Portal Access" modal (Gatekeeper success state)
  const [portalData, setPortalData] = useState<any>(null);

  // State for Data Entry Form Overlay
  const [showEntryForm, setShowEntryForm] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Logic: Internal roles log in directly. External roles show the Portal Link modal after "Authentication".
    switch (activeTab) {
      case 'super':
        login({ id: 'super_admin', name: 'Super Admin', role: 'super_admin' });
        setDistrict(null);
        break;
      case 'district':
        login({
          id: 'district_admin',
          name: `District Admin (${selectedDistrictVal})`,
          role: 'district_admin',
          managedEntityId: selectedDistrictVal
        });
        setDistrict(selectedDistrictVal);
        break;

      // --- External Portals (Gatekeeper Pattern) ---
      case 'institution':
        setPortalData({
          title: 'Institution Portal',
          description: 'Access for Colleges & Universities',
          url: 'https://inpulse-staging-recruitment.web.app/signin',
          credentials: 'User: tpo@sahyadri.com\nPassword: tpo@sahyadri.com',
          icon: School,
          color: 'emerald'
        });
        break;
      case 'student':
        setPortalData({
          title: 'Student Portal',
          description: 'Access for Students & Learners',
          url: 'https://inpulse-staging-recruitment.web.app/signin',
          credentials: 'User: bddhanush03@gmail.com\nPassword: bddhanush03@gmail.com',
          icon: GraduationCap,
          color: 'violet'
        });
        break;
      case 'company':
        setPortalData({
          title: 'Company Portal',
          description: 'Access for Industries & Recruiters',
          url: 'https://inpulse-staging-recruitment.web.app/signin',
          credentials: 'User: hr@inunity.in\nPassword: hr@inunity.in',
          icon: Briefcase,
          color: 'blue'
        });
        break;
    }
  };

  // --- Render Data Entry Overlay ---
  if (showEntryForm) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 overflow-auto animate-in fade-in duration-300">
        {activeTab === 'student' && (
          <div className="p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <GraduationCap className="text-violet-600" />
                  Trainee Data Collection Form
                </h2>
                <button
                  onClick={() => setShowEntryForm(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-700"
                >
                  Back to Login
                </button>
              </div>
              <TraineeDetailsSection onBack={() => setShowEntryForm(false)} />
            </div>
          </div>
        )}
        {activeTab === 'institution' && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {/* Overlay Header with Tabs */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <School className="text-emerald-600" />
                    Institution Data Collection
                  </h2>

                  {/* Tabs */}
                  <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
                    <button
                      onClick={() => setActiveInstTab('profile')}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeInstTab === 'profile'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                      Institution Profile
                    </button>
                    <button
                      onClick={() => setActiveInstTab('center')}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeInstTab === 'center'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                    >
                      Training Center (1E.1)
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowEntryForm(false)}
                  className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Back to Login
                </button>
              </div>

              {/* Tab Content */}
              {activeInstTab === 'profile' ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <InstitutionEntryForm
                    onSuccess={() => setActiveInstTab('center')} // Auto-advance to next tab
                    onCancel={() => setShowEntryForm(false)}
                  />
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <TrainingCenterSection
                    onBack={() => setActiveInstTab('profile')}
                    isRestricted={false}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 md:p-8 font-sans relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
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

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Login Form (Span 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px]">
          {/* Admin Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={() => setActiveTab('super')}
              className={`py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-all
                  ${activeTab === 'super'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 border-t-2 border-t-blue-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Globe size={18} />
              State Admin
            </button>
            <button
              onClick={() => setActiveTab('district')}
              className={`py-4 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-all
                  ${activeTab === 'district'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 border-t-2 border-t-blue-600'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Map size={18} />
              District Admin
            </button>
          </div>

          <div className="p-8 flex-1 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                {activeTab === 'super' && 'State Level Access'}
                {activeTab === 'district' && 'District Admin Access'}
                {activeTab === 'institution' && <><School className="text-emerald-500" /> Institution Login</>}
                {activeTab === 'company' && <><Briefcase className="text-blue-500" /> Company Login</>}
                {activeTab === 'student' && <><GraduationCap className="text-violet-500" /> Trainee Login</>}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {activeTab === 'super' && 'Access the comprehensive dashboard for all 31 districts of Karnataka.'}
                {activeTab === 'district' && 'Manage and monitor skill development in your district.'}
                {activeTab === 'institution' && 'Login to access the Institution Portal.'}
                {activeTab === 'company' && 'Login to post jobs and manage recruitment.'}
                {activeTab === 'student' && 'Login to view your courses and placement status.'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5 max-w-lg">
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white appearance-none"
                    >
                      {DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Instructions / Warning for Specific Roles */}
              {(activeTab === 'student' || activeTab === 'institution') && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4 text-left animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-amber-600 dark:text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-sm text-amber-800 dark:text-amber-200 flex-1">
                      <p className="font-medium mb-1">Important:</p>
                      <p className="mb-3">
                        Please ensure you have filled out the
                        <span className="font-bold"> Data Collection Form </span>
                        shared by the District Office before logging in.
                      </p>
                      {/* Data Entry Trigger Button */}
                      <button
                        type="button"
                        onClick={() => setShowEntryForm(true)}
                        className="text-white bg-amber-600 hover:bg-amber-700 font-medium rounded-lg text-xs px-4 py-2 flex items-center gap-2 transition-colors shadow-sm"
                      >
                        <FileText size={14} />
                        Fill Data Collection Form Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {['institution', 'company', 'student'].includes(activeTab) ? 'User ID / Email' : 'Username'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder={
                      activeTab === 'institution' ? 'e.g. tpo@sahyadri.com' :
                        activeTab === 'company' ? 'e.g. hr@company.com' :
                          activeTab === 'student' ? 'e.g. student@email.com' :
                            "admin@karnataka.gov.in"
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
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
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]
                      ${activeTab === 'super' || activeTab === 'district' ? 'bg-blue-600 hover:bg-blue-700' :
                      activeTab === 'institution' ? 'bg-emerald-600 hover:bg-emerald-700' :
                        activeTab === 'company' ? 'bg-blue-600 hover:bg-blue-700' :
                          'bg-violet-600 hover:bg-violet-700'
                    }
                    `}
                >
                  {['institution', 'company', 'student'].includes(activeTab) ? 'Login to Portal' : 'Sign In to Dashboard'}
                  <ArrowRight size={18} />
                </button>
                {['super', 'district'].includes(activeTab) && (
                  <div className="text-center mt-4">
                    <p className="text-xs text-slate-400">Use any credentials for demo access.</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Portal Cards (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
            <ExternalLink size={20} />
            Role based access portals
          </h3>

          <PortalCard
            title="Company View"
            description="For Industries & Recruiters"
            icon={Briefcase}
            color="blue"
            isActive={activeTab === 'company'}
            onClick={() => { setActiveTab('company'); setShowEntryForm(false); }}
          />

          <PortalCard
            title="Institution View"
            description="For Colleges & Universities"
            icon={School}
            color="emerald"
            isActive={activeTab === 'institution'}
            onClick={() => { setActiveTab('institution'); setShowEntryForm(false); }}
          />

          <PortalCard
            title="Student View"
            description="For Students & Learners"
            icon={GraduationCap}
            color="violet"
            isActive={activeTab === 'student'}
            onClick={() => { setActiveTab('student'); setShowEntryForm(false); }}
          />

          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mt-6">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">Note:</span> Access credentials will be shared once you verify your identity. Use them to login to the respective portals.
            </p>
          </div>
        </div>

      </div>

      {/* Portal Access Modal (Gatekeeper Success) */}
      {portalData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setPortalData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className={`p-4 rounded-full mb-4 bg-${portalData.color}-50 text-${portalData.color}-600`}>
                <portalData.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{portalData.title}</h3>
              <p className="text-slate-500 dark:text-slate-400">{portalData.description}</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-6 border border-slate-100 dark:border-slate-700">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">Access Credentials</p>
              <div className="font-mono text-sm text-slate-700 dark:text-slate-300 space-y-1">
                {portalData.credentials.split('\n').map((line: string, i: number) => (
                  <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                    <span>{line.trim()}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(line.split(':')[1]?.trim() || line)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-sans font-medium"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPortalData(null)}
                className="flex-1 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <a
                href={portalData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow"
                onClick={() => setPortalData(null)}
              >
                <span>Go to Portal</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

function PortalCard({ title, description, icon: Icon, color, isActive, onClick }: any) {
  let activeClass = isActive
    ? `ring-2 ring-${color}-500 border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20`
    : 'hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md';

  let iconClass = "text-slate-600 dark:text-slate-400";
  let bgClass = "bg-white dark:bg-slate-800";

  if (isActive) {
    if (color === 'blue') {
      activeClass = "ring-2 ring-blue-500 border-blue-500 shadow-md transform scale-[1.02]";
      iconClass = "text-blue-600";
    }
    if (color === 'emerald') {
      activeClass = "ring-2 ring-emerald-500 border-emerald-500 shadow-md transform scale-[1.02]";
      iconClass = "text-emerald-600";
    }
    if (color === 'violet') {
      activeClass = "ring-2 ring-violet-500 border-violet-500 shadow-md transform scale-[1.02]";
      iconClass = "text-violet-600";
    }
  }

  // Safely building the button
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-4 rounded-xl border border-slate-200 dark:border-slate-700 transition-all text-left group ${bgClass} ${activeClass}`}
    >
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 mr-4 ${isActive ? 'bg-white/80 dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900'} ${iconClass}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h4 className={`font-bold text-base ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
          {title}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      {isActive && (
        <div className={`text-${color}-600 opacity-100`}>
          <ChevronRight size={20} />
        </div>
      )}
    </button>
  )
}
