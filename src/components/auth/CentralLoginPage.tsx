import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Shield, Map, GraduationCap, ArrowRight, User, Globe, School, ExternalLink, Briefcase, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { useAuthStore } from '../../store/useAuthStore';
import { DISTRICTS } from '../../data/districts';
import TraineeDetailsSection from '../pages/TraineeDetailsSection';
import InstitutionDataWizard from '../entry/institution/InstitutionDataWizard';
import EmployerSurveyForm from '../entry/employer/EmployerSurveyForm';

interface CentralLoginPageProps {
  forceTab?: 'super' | 'district' | 'institution' | 'student' | 'company';
}

export default function CentralLoginPage({ forceTab }: CentralLoginPageProps) {
  const { login, setDistrict } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'super' | 'district' | 'institution' | 'student' | 'company'>(forceTab || 'super');
  const [districtRole, setDistrictRole] = useState<'admin' | 'team'>('admin'); // Toggle for District Admin vs Team
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [selectedDistrictVal, setSelectedDistrictVal] = useState('Dakshina Kannada');



  // State for Data Entry Form Overlay
  const [showEntryForm, setShowEntryForm] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = formData.id.trim();
    const password = formData.password.trim();

    console.log(`[CentralLogin] Attempting login for: ${username}`);

    // 1. Direct Supabase Query
    const { data: userRecord, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error("[CentralLogin] DB Query Error:", error);
    }

    if (!userRecord) {
      console.warn("[CentralLogin] No user record found for credentials.");

      // If no local credentials found, show error or specific role behavior
      if (['company', 'student', 'institution'].includes(activeTab)) {
        alert(`Invalid credentials for ${activeTab} portal. Please check your username and password.`);
      } else {
        alert('Invalid credentials or account revoked. Please check your username and password.');
      }
      return;
    }

    console.log("[CentralLogin] Login successful for:", userRecord.entity_name);

    // Success: Login with the retrieved record
    login({
      id: userRecord.id,
      name: userRecord.entity_name,
      role: userRecord.role as any,
      managedEntityId: userRecord.entity_id || userRecord.linked_entity_id
    });

    if (userRecord.role === 'district_admin' || userRecord.role === 'district_team') {
      setDistrict(userRecord.entity_id || 'Dakshina Kannada');
    } else {
      setDistrict(null);
    }

    // REDIRECTION LOGIC
    if (userRecord.role === 'company') {
      const slug = userRecord.entity_name ? userRecord.entity_name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : 'company';
      navigate(`/company-survey/${slug}`);
    } else {
      navigate('/dashboard');
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
          <div className="flex-1 flex flex-col min-h-screen">
            <InstitutionDataWizard
              onSuccess={() => setShowEntryForm(false)}
              onCancel={() => setShowEntryForm(false)}
            />
          </div>
        )}
        {activeTab === 'company' && (
          <div className="flex-1 flex flex-col min-h-screen">
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex justify-between items-center sticky top-0 z-20">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Briefcase className="text-blue-600" />
                Employer Survey Form
              </h2>
              <button
                onClick={() => setShowEntryForm(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Back to Login
              </button>
            </div>
            <EmployerSurveyForm />
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

        {/* Left Column: Login Form (Span 7 or 12) */}
        <div className={forceTab ? "lg:col-span-12 max-w-2xl mx-auto w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px]" : "lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px]"}>
          {/* Admin Tabs - Hidden if forceTab is active */}
          {!forceTab && (
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
          )}

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
                <div className="space-y-4">
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

                  {/* Role Toggle */}
                  <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setDistrictRole('admin')}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${districtRole === 'admin'
                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                        }`}
                    >
                      District Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setDistrictRole('team')}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${districtRole === 'team'
                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                        }`}
                    >
                      District Team
                    </button>
                  </div>
                </div>
              )}


              {/* Instructions / Warning for Specific Roles */}
              {activeTab === 'student' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg p-4 text-left animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-0.5">
                      <GraduationCap className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div className="text-sm text-amber-800 dark:text-amber-200 flex-1">
                      <p className="font-medium mb-1">Trainee Data Collection</p>
                      <p>
                        Enter your Student ID and password to access your localized profile.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'institution' && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-lg p-4 text-left animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-0.5">
                      <School className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <div className="text-sm text-emerald-800 dark:text-emerald-200 flex-1">
                      <p className="font-medium mb-1">Institution Data Collection</p>
                      <p>
                        Please login with your institution credentials to update your profile and training center information.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions for Company */}
              {activeTab === 'company' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 text-left animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-0.5">
                      <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-200 flex-1">
                      <p className="font-medium mb-1">Employer Survey & Recruitment</p>
                      <p>
                        You will be redirected to the Employer Survey Form upon login to update your organization's data.
                      </p>
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

              <div className="pt-2 space-y-4">
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

                {/* Guest Access Option for Public Forms */}
                {['institution', 'company', 'student'].includes(activeTab) && (
                  <div className="border-t border-slate-100 dark:border-slate-700/50 pt-4 mt-2">
                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Don't have login credentials?</span> You can still contribute by filling the form as a guest. Data matches will be attempted based on your organization name to preserve continuity.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowEntryForm(true)}
                        className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all border
                          ${activeTab === 'institution' ? 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' :
                            activeTab === 'company' ? 'text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20' :
                              'text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                          }
                        `}
                      >
                        <User size={16} />
                        Continue as Guest
                      </button>
                    </div>
                  </div>
                )}
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
        {!forceTab && (
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
        )}
      </div>


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
  );
}
