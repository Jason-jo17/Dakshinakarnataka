import React, { useState } from 'react';
import { Sparkles, Check, AlertCircle } from 'lucide-react';
import { useCredentialStore } from '../../store/useCredentialStore';

/**
 * CredentialSeeder Component
 * 
 * This component provides a UI to seed all training center and trainee credentials
 * into the credential store. Should only be accessible to District Admins.
 */
export const CredentialSeeder: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);
  const { generateCredential, clearCredentials } = useCredentialStore();

  const handleSeedCredentials = () => {
    setIsSeeding(true);
    setSeedResult(null);

    // Clear old credentials first to ensure we use the latest robust IDs
    clearCredentials();

    try {
      let count = 0;

      // Training Center/Institution Credentials
      const institutions = [
        { name: 'District Agriculture Training Centre Belthangady', username: 'institution_datcbelth', password: 'Pass@datc123' },
        { name: 'RUDSETI Ujire', username: 'institution_rudsetiujire', password: 'Pass@rudseti123' },
        { name: 'Horticulture', username: 'institution_horticulture', password: 'Pass@horti123' },
        { name: 'College of Fisheries, Mangaluru', username: 'institution_fisheries', password: 'Pass@fish123' },
        { name: 'Govt.ITI(M)Mangaluru-4', username: 'institution_govtitimng4', password: 'Pass@iti123' },
        { name: 'GOVT. ITI (WOMEN) MANGALORE', username: 'institution_itiwoman', password: 'Pass@women123' },
        { name: 'KGTTI Mangaluru', username: 'institution_kgtti', password: 'Pass@kgtti123' },
        { name: 'GTTC, MANGALORE', username: 'institution_gttc', password: 'Pass@gttc123' },
        { name: 'JNV DAKSHINA KANNADA', username: 'institution_jnv', password: 'Pass@jnv123' },
        { name: 'CEDOK', username: 'institution_cedok', password: 'Pass@cedok123' },
        { name: 'KV No.1 Mangaluru', username: 'institution_kv1', password: 'Pass@kv123' },
        { name: 'ICAR-Krishi Vigyan Kendra, Dakshina Kannada', username: 'institution_icar', password: 'Pass@icar123' }
      ];

      institutions.forEach((inst) => {
        const cred = generateCredential({
          role: 'institution',
          entityId: inst.name, // Use name as ID for seeded data consistency
          entityName: inst.name,
          email: `${inst.username}@dkdistrict.gov.in`
        });

        // Override with custom username/password for consistency
        cred.username = inst.username;
        cred.password = inst.password;
        count++;
      });

      // Student/Trainee Credentials
      const trainees = [
        {
          name: 'Preetham',
          email: 'preetham@sahyadri.edu',
          username: 'trainee_preetham',
          password: 'Pass@preetham123',
          linkedEntityId: 'Govt.ITI(M)Mangaluru-4'
        },
        {
          name: 'Rajesh Kumar',
          email: 'rajesh@student.edu',
          username: 'trainee_rajesh',
          password: 'Pass@rajesh123',
          linkedEntityId: 'Govt.ITI(M)Mangaluru-4'
        },
        {
          name: 'Priya Shetty',
          email: 'priya@student.edu',
          username: 'trainee_priya',
          password: 'Pass@priya123',
          linkedEntityId: 'GOVT. ITI (WOMEN) MANGALORE'
        },
        {
          name: 'Arun Bhat',
          email: 'arun@student.edu',
          username: 'trainee_arun',
          password: 'Pass@arun123',
          linkedEntityId: 'KGTTI Mangaluru'
        }
      ];

      trainees.forEach(trainee => {
        const cred = generateCredential({
          role: 'trainee',
          entityId: crypto.randomUUID(),
          entityName: trainee.name,
          linkedEntityId: trainee.linkedEntityId,
          email: trainee.email
        });

        // Override with custom username/password
        cred.username = trainee.username;
        cred.password = trainee.password;
        count++;
      });

      // Recruiter Credentials
      const recruiters = [
        {
          name: 'InUnity (Recruiter)',
          email: 'preetham+recruit@inunity.in',
          username: 'preetham+recruit@inunity.in',
          password: 'Password@2025'
        }
      ];

      recruiters.forEach(recruiter => {
        const cred = generateCredential({
          role: 'company',
          entityId: 'recruiter-inunity',
          entityName: recruiter.name,
          email: recruiter.email
        });

        // Override with custom username/password
        cred.username = recruiter.username;
        cred.password = recruiter.password;
        count++;
      });

      setSeedResult({
        success: true,
        message: `Successfully seeded ${count} credentials (${institutions.length} institutions, ${trainees.length} trainees, ${recruiters.length} recruiters)`,
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
            Seed Test Credentials
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Automatically generate credentials for all 12 training centers, 4 test trainees, and the InUnity recruiter.
            This will populate the Credential Manager with ready-to-use test accounts.
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
