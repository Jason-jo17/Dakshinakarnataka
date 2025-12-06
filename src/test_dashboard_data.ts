import { INSTITUTIONS } from './data/institutions';

console.log(`Total Institutions: ${INSTITUTIONS.length}`);

const companies = INSTITUTIONS.filter(i => i.category === 'Company');
const colleges = INSTITUTIONS.filter(i => i.category !== 'Company');

console.log(`Companies: ${companies.length}`);
console.log(`Colleges: ${colleges.length}`);

const companyDemand: Record<string, number> = {};
companies.forEach(c => {
    Object.keys(c.domains || {}).forEach(d => {
        companyDemand[d] = (companyDemand[d] || 0) + 1;
    });
});

const collegeSupply: Record<string, number> = {};
colleges.forEach(c => {
    Object.keys(c.domains || {}).forEach(d => {
        collegeSupply[d] = (collegeSupply[d] || 0) + 1;
    });
});

const radarData = [
    'Software Development', 'Chemical Engineering', 'Biotechnology',
    'Embedded Systems', 'Business', 'Healthcare'
].map(d => ({
    subject: d,
    A: Math.round(((collegeSupply[d] || 0) / colleges.length) * 100), // Student Reality
    B: Math.round(((companyDemand[d] || 0) / companies.length) * 100), // Industry Expectation
    fullMark: 100
}));

console.log('Radar Data:');
console.log(JSON.stringify(radarData, null, 2));
