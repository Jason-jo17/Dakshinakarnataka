import React, { useState } from 'react';
import { Sparkles, Check, AlertCircle } from 'lucide-react';
import { useCredentialStore } from '../../store/useCredentialStore';
import { supabase } from '../../lib/supabaseClient';

/**
 * CredentialSeeder Component
 * 
 * This component provides a UI to seed all training center and trainee credentials
 * into the credential store. Should only be accessible to District Admins.
 */
export const CredentialSeeder: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);
  const { generateCredential } = useCredentialStore();

  const handleSeedCredentials = async () => {
    setIsSeeding(true);
    setSeedResult(null);

    // Note: We no longer clearCredentials() to avoid deleting real requested credentials.
    // Instead, we rely on the upsert logic in the store to handle duplicates.

    try {
      let count = 0;

      // 1. Super Admin & District Admins (Multi-District)
      const administrative = [
        { role: 'super_admin', entityId: 'admin_global', entityName: 'Super Admin', username: 'super_admin', password: 'Pass@super123', email: 'admin@dkdistrict.gov.in' },
        { role: 'district_admin', entityId: 'Dakshina Kannada', entityName: 'District Admin (DK)', username: 'admin_dk', password: 'Pass@dk123', email: 'dk_admin@dkdistrict.gov.in' },
        { role: 'district_admin', entityId: 'Udupi', entityName: 'District Admin (Udupi)', username: 'admin_udupi', password: 'Pass@udupi123', email: 'udupi_admin@district.gov.in' },
        { role: 'district_admin', entityId: 'Uttara Kannada', entityName: 'District Admin (UK)', username: 'admin_uk', password: 'Pass@uk123', email: 'uk_admin@district.gov.in' },
        { role: 'district_admin', entityId: 'Kodagu', entityName: 'District Admin (Kodagu)', username: 'admin_kodagu', password: 'Pass@kodagu123', email: 'kodagu_admin@district.gov.in' }
      ];

      for (const admin of administrative) {
        await generateCredential(admin as any);
        count++;
      }

      // 2. Training Centers / Institutions (Full List of 12)
      const institutions = [
        { name: 'District Agriculture Training Centre Belthangady', username: 'institution_datcbgy' },
        { name: 'RUDSETI Ujire', username: 'institution_rudset' },
        { name: 'Horticulture Department', username: 'institution_horti' },
        { name: 'College of Fisheries, Mangaluru', username: 'institution_fisheries' },
        { name: 'Govt.ITI(M)Mangaluru-4', username: 'institution_giti_mng' },
        { name: 'Govt ITI (Women) Mangalore', username: 'institution_giti_wom' },
        { name: 'KGTTI Mangaluru', username: 'institution_kgtti' },
        { name: 'GTTC, Mangalore', username: 'institution_gttc' },
        { name: 'JNV Dakshina Kannada', username: 'institution_jnv' },
        { name: 'CEDOK Mangaluru', username: 'institution_cedok' },
        { name: 'KV No.1 Mangaluru', username: 'institution_kv1' },
        { name: 'ICAR-Krishi Vigyan Kendra', username: 'institution_kvk' }
      ];

      for (const inst of institutions) {
        await generateCredential({
          role: 'institution',
          entityId: inst.name,
          entityName: inst.name,
          username: inst.username,
          password: `Pass@${inst.username.split('_')[1]}123`,
          email: `${inst.username}@dkdistrict.gov.in`
        });
        count++;
      }

      // 3. Trainees (Expanded)
      const trainees = [
        { name: 'Preetham', username: 'trainee_preetham', email: 'preetham@sahyadri.edu', linkedEntityId: 'Govt.ITI(M)Mangaluru-4' },
        { name: 'Sanjay Kumar', username: 'trainee_sanjay', email: 'sanjay@kgtti.edu', linkedEntityId: 'KGTTI Mangaluru' },
        { name: 'Aditi Rao', username: 'trainee_aditi', email: 'aditi@gttc.edu', linkedEntityId: 'GTTC, Mangalore' },
        { name: 'Kavya Hegde', username: 'trainee_kavya', email: 'kavya@datc.edu', linkedEntityId: 'District Agriculture Training Centre Belthangady' }
      ];

      for (const t of trainees) {
        await generateCredential({
          role: 'trainee',
          entityId: crypto.randomUUID(),
          entityName: t.name,
          linkedEntityId: t.linkedEntityId,
          email: t.email,
          username: t.username,
          password: `Pass@${t.username.split('_')[1]}123`
        });
        count++;
      }

      // 4. Auto-Sync Companies from Employer Survey Table (Safer Select)
      try {
        const { data: employers, error: empError } = await supabase
          .from('ad_survey_employer')
          .select('employer_name, contact_person_email');

        if (!empError && employers) {
          // Unique companies by name
          const uniqueEmployers = Array.from(new Set(employers.map(e => e.employer_name as string).filter(Boolean)));

          for (const empName of uniqueEmployers) {
            const emp = employers.find(e => e.employer_name === empName);

            // Generate a unique password for each company
            const uniquePass = 'Pass@' + Math.random().toString(36).slice(-8).toUpperCase() + '2025';

            // Use the same username logic as the store
            const sanitizedName = empName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const username = `company_${sanitizedName}`;

            await generateCredential({
              role: 'company',
              entityId: `company-${sanitizedName}`,
              entityName: empName,
              email: (emp as any)?.contact_person_email || `${sanitizedName}@company.com`,
              username: username,
              password: uniquePass
            });
            count++;
          }
        } else if (empError) {
          console.warn("Could not sync companies (possibly missing column):", empError.message);
          // Don't throw here, just skip company sync if table/column isn't ready
        }
      } catch (err) {
        console.error("Critical error during company sync:", err);
      }

      setSeedResult({
        success: true,
        message: `Seeding Complete! Processed ${count} credentials. (Note: Company sync may have been skipped if schema is outdated).`,
        count
      });
    } catch (error) {
      setSeedResult({
        success: false,
        message: `Error seeding credentials: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Seed & Sync Credentials
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Generate credentials for all 12 district institutions, expanded trainees, and automatically <strong>sync login details for all registered companies</strong> in the survey database.
          </p>

          {seedResult && (
            <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${seedResult.success
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
              {seedResult.success ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${seedResult.success
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'
                }`}>
                {seedResult.message}
              </p>
            </div>
          )}

          <button
            onClick={handleSeedCredentials}
            disabled={isSeeding}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isSeeding ? 'Seeding...' : 'Seed All Credentials'}
          </button>

          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            <p className="font-medium mb-1">This will create:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>12 institution credentials (all training centers)</li>
              <li>4 trainee credentials (including preetham@sahyadri.edu)</li>
              <li>All with pattern: institution_[name] / trainee_[name]</li>
              <li>Passwords: Pass@[identifier]123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
