
import { userInstitutions } from './src/data/user_institutions';
import { legacyInstitutions } from './src/data/legacy_institutions';

const legacyIdMap: Record<string, string> = {
    'st-joseph-engineering': 'sjec-vamanjoor',
    'mite-moodbidri': 'mite-moodabidri',
    'sahyadri-college': 'sahyadri-adyar',
    'alvas-engineering': 'alva-s-institute-of-engg-tech',
    'canara-engineering': 'canara-engineering-college',
    'nitte-university': 'nitte-university-deemed',
    'aj-institute-engineering': 'ajiet-kottara',
    'govt-polytechnic-mangalore': 'karnataka-govt-polytechnic',
    'st-aloysius-deemed-university': 'st-aloysius-university',
    'yenepoya-deemed-university': 'yenepoya-university'
};

const uniqueUserInstitutions = Array.from(
    new Map(userInstitutions.map(item => [item.id, item])).values()
);

const processedIds = new Set(uniqueUserInstitutions.map(i => i.id));
const processedLegacyIds = new Set(Object.values(legacyIdMap));

const remainingLegacyInstitutions = legacyInstitutions.filter(l =>
    !processedIds.has(l.id) &&
    !processedLegacyIds.has(l.id) &&
    !userInstitutions.some(u => u.id === l.id)
);

console.log('User Institutions:', uniqueUserInstitutions.length);
console.log('Legacy Institutions:', legacyInstitutions.length);
console.log('Remaining Legacy:', remainingLegacyInstitutions.length);
console.log('Total (User + Remaining):', uniqueUserInstitutions.length + remainingLegacyInstitutions.length);
