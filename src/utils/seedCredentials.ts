// Credential Seeder Script
// Run this in the browser console when logged in as District Admin
// Navigate to: Credential Manager page

import { useCredentialStore } from '../store/useCredentialStore';

export const seedAllCredentials = async () => {
  const { generateCredential } = useCredentialStore.getState();

  console.log('🌱 Starting credential seeding...');

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

  console.log(`📚 Generating ${institutions.length} institution credentials...`);

  for (const inst of institutions) {
    const cred = await generateCredential({
      role: 'institution',
      entityId: inst.name, // Use name as ID for seeded data consistency
      entityName: inst.name,
      email: `${inst.username}@dkdistrict.gov.in`
    });

    // Override with custom username/password for consistency
    cred.username = inst.username;
    cred.password = inst.password;

    console.log(`✅ Generated: ${inst.name} (${inst.username})`);
  }

  // Student/Trainee Credentials
  const trainees = [
    {
      name: 'Preetham',
      email: 'preetham@sahyadri.edu',
      username: 'trainee_preetham',
      password: 'Pass@preetham123',
      linkedInstitution: 'Govt.ITI(M)Mangaluru-4',
      linkedEntityId: 'Govt.ITI(M)Mangaluru-4'
    },
    {
      name: 'Rajesh Kumar',
      email: 'rajesh@student.edu',
      username: 'trainee_rajesh',
      password: 'Pass@rajesh123',
      linkedInstitution: 'Govt.ITI(M)Mangaluru-4',
      linkedEntityId: 'Govt.ITI(M)Mangaluru-4'
    },
    {
      name: 'Priya Shetty',
      email: 'priya@student.edu',
      username: 'trainee_priya',
      password: 'Pass@priya123',
      linkedInstitution: 'GOVT. ITI (WOMEN) MANGALORE',
      linkedEntityId: 'GOVT. ITI (WOMEN) MANGALORE'
    },
    {
      name: 'Arun Bhat',
      email: 'arun@student.edu',
      username: 'trainee_arun',
      password: 'Pass@arun123',
      linkedInstitution: 'KGTTI Mangaluru',
      linkedEntityId: 'KGTTI Mangaluru'
    }
  ];

  console.log(`👨‍🎓 Generating ${trainees.length} trainee credentials...`);

  for (const trainee of trainees) {
    const cred = await generateCredential({
      role: 'trainee',
      entityId: crypto.randomUUID(),
      entityName: trainee.name,
      linkedEntityId: trainee.linkedEntityId,
      email: trainee.email
    });

    // Override with custom username/password
    cred.username = trainee.username;
    cred.password = trainee.password;

    console.log(`✅ Generated: ${trainee.name} → ${trainee.linkedInstitution} (${trainee.username})`);
  }

  // Recruiter Credentials
  const recruiters = [
    {
      name: 'InUnity (Recruiter)',
      email: 'preetham+recruit@inunity.in',
      username: 'preetham+recruit@inunity.in',
      password: 'Password@2025'
    }
  ];

  console.log(`💼 Generating ${recruiters.length} recruiter credentials...`);

  for (const recruiter of recruiters) {
    const cred = await generateCredential({
      role: 'company',
      entityId: 'recruiter-inunity',
      entityName: recruiter.name,
      email: recruiter.email
    });

    // Override with custom username/password
    cred.username = recruiter.username;
    cred.password = recruiter.password;

    console.log(`✅ Generated: ${recruiter.name} (${recruiter.username})`);
  }

  console.log('🎉 Credential seeding complete!');
  console.log('📋 Total credentials generated:', institutions.length + trainees.length + recruiters.length);

  return {
    institutions: institutions.length,
    trainees: trainees.length,
    recruiters: recruiters.length,
    total: institutions.length + trainees.length + recruiters.length
  };
};

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log('💡 Run: seedAllCredentials() to generate all credentials');
}
