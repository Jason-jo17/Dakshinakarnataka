-- Seed Credentials Script
-- This script populates the credential store with credentials for all training centers and test students
-- Run this AFTER running migrate_training_centers.sql

-- Note: This inserts data into the application's local storage via the credential store
-- You'll need to execute this through the application's credential generation interface
-- OR manually insert into a credentials table if you create one in Supabase

-- For now, this is a reference script. The actual credentials will be generated through the UI.
-- Below is the TypeScript/JavaScript code to seed credentials programmatically:

/*
// Seed Credentials - Run this in browser console after logging in as District Admin

const { useCredentialStore } = await import('./store/useCredentialStore');
const { generateCredential } = useCredentialStore.getState();

// Training Center Credentials
const trainingCenters = [
  { id: 'tc-001', name: 'District Agriculture Training Centre Belthangady' },
  { id: 'tc-002', name: 'RUDSETI Ujire' },
  { id: 'tc-003', name: 'Horticulture' },
  { id: 'tc-004', name: 'College of Fisheries, Mangaluru' },
  { id: 'tc-005', name: 'Govt.ITI(M)Mangaluru-4' },
  { id: 'tc-006', name: 'GOVT. ITI (WOMEN) MANGALORE' },
  { id: 'tc-007', name: 'KGTTI Mangaluru' },
  { id: 'tc-008', name: 'GTTC, MANGALORE' },
  { id: 'tc-009', name: 'JNV DAKSHINA KANNADA' },
  { id: 'tc-010', name: 'CEDOK' },
  { id: 'tc-011', name: 'KV No.1 Mangaluru' },
  { id: 'tc-012', name: 'ICAR-Krishi Vigyan Kendra, Dakshina Kannada' }
];

// Generate institution credentials
trainingCenters.forEach(tc => {
  const username = 'institution_' + tc.name.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20);
  
  generateCredential({
    role: 'institution',
    entityId: tc.id,
    entityName: tc.name,
    email: username + '@dkdistrict.gov.in'
  });
});

// Student/Trainee Credentials
const trainees = [
  { name: 'Preetham', email: 'preetham@sahyadri.edu', linkedTo: 'tc-005' },
  { name: 'Rajesh Kumar', email: 'rajesh@student.edu', linkedTo: 'tc-005' },
  { name: 'Priya Shetty', email: 'priya@student.edu', linkedTo: 'tc-006' },
  { name: 'Arun Bhat', email: 'arun@student.edu', linkedTo: 'tc-007' }
];

trainees.forEach(trainee => {
  generateCredential({
    role: 'trainee',
    entityId: crypto.randomUUID(),
    entityName: trainee.name,
    linkedEntityId: trainee.linkedTo,
    email: trainee.email
  });
});

console.log('Credentials seeded successfully!');
*/
