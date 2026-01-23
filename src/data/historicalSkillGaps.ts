export const HISTORICAL_SKILL_GAPS = {
  // Overall District Skill Gap (%)
  overallGap: [
    { year: 2020, gap: 35, demand: 850, supply: 553, placed: 2100 },
    { year: 2021, gap: 33, demand: 920, supply: 616, placed: 2350 },
    { year: 2022, gap: 30, demand: 980, supply: 686, placed: 2700 },
    { year: 2023, gap: 32, demand: 1050, supply: 714, placed: 2850 },
    { year: 2024, gap: 28, demand: 1045, supply: 753, placed: 3400 },
  ],

  // Sector-wise Historical Gaps (2020-2024)
  sectorGaps: {
    'IT/ITES': [
      { year: 2020, demand: 520, supply: 350, gap: 33, avgSalary: 4.2 },
      { year: 2021, demand: 580, supply: 390, gap: 33, avgSalary: 4.5 },
      { year: 2022, demand: 650, supply: 445, gap: 32, avgSalary: 4.8 },
      { year: 2023, demand: 720, supply: 490, gap: 32, avgSalary: 5.0 },
      { year: 2024, demand: 850, supply: 620, gap: 27, avgSalary: 5.5 },
    ],
    'BPO/KPO': [
      { year: 2020, demand: 380, supply: 420, gap: -11, avgSalary: 3.2 },
      { year: 2021, demand: 400, supply: 450, gap: -13, avgSalary: 3.4 },
      { year: 2022, demand: 420, supply: 480, gap: -14, avgSalary: 3.5 },
      { year: 2023, demand: 435, supply: 520, gap: -20, avgSalary: 3.6 },
      { year: 2024, demand: 450, supply: 580, gap: -29, avgSalary: 3.8 },
    ],
    'Manufacturing': [
      { year: 2020, demand: 140, supply: 180, gap: -29, avgSalary: 3.8 },
      { year: 2021, demand: 150, supply: 190, gap: -27, avgSalary: 4.0 },
      { year: 2022, demand: 160, supply: 205, gap: -28, avgSalary: 4.2 },
      { year: 2023, demand: 170, supply: 220, gap: -29, avgSalary: 4.3 },
      { year: 2024, demand: 180, supply: 240, gap: -33, avgSalary: 4.5 },
    ],
    'Logistics': [
      { year: 2020, demand: 80, supply: 55, gap: 31, avgSalary: 3.0 },
      { year: 2021, demand: 88, supply: 60, gap: 32, avgSalary: 3.1 },
      { year: 2022, demand: 95, supply: 67, gap: 29, avgSalary: 3.2 },
      { year: 2023, demand: 105, supply: 75, gap: 29, avgSalary: 3.3 },
      { year: 2024, demand: 120, supply: 85, gap: 29, avgSalary: 3.5 },
    ],
    'Construction': [
      { year: 2020, demand: 150, supply: 195, gap: -30, avgSalary: 3.2 },
      { year: 2021, demand: 158, supply: 205, gap: -30, avgSalary: 3.4 },
      { year: 2022, demand: 165, supply: 215, gap: -30, avgSalary: 3.5 },
      { year: 2023, demand: 172, supply: 228, gap: -33, avgSalary: 3.6 },
      { year: 2024, demand: 180, supply: 240, gap: -33, avgSalary: 3.8 },
    ],
    'Tourism': [
      { year: 2020, demand: 55, supply: 42, gap: 24, avgSalary: 2.8 },
      { year: 2021, demand: 62, supply: 48, gap: 23, avgSalary: 2.9 },
      { year: 2022, demand: 70, supply: 54, gap: 23, avgSalary: 3.0 },
      { year: 2023, demand: 78, supply: 60, gap: 23, avgSalary: 3.1 },
      { year: 2024, demand: 85, supply: 65, gap: 24, avgSalary: 3.2 },
    ],
    'Healthcare': [
      { year: 2020, demand: 45, supply: 32, gap: 29, avgSalary: 3.5 },
      { year: 2021, demand: 50, supply: 35, gap: 30, avgSalary: 3.6 },
      { year: 2022, demand: 55, supply: 38, gap: 31, avgSalary: 3.8 },
      { year: 2023, demand: 60, supply: 42, gap: 30, avgSalary: 4.0 },
      { year: 2024, demand: 65, supply: 45, gap: 31, avgSalary: 4.2 },
    ],
    'Retail': [
      { year: 2020, demand: 180, supply: 210, gap: -17, avgSalary: 2.5 },
      { year: 2021, demand: 185, supply: 220, gap: -19, avgSalary: 2.6 },
      { year: 2022, demand: 190, supply: 230, gap: -21, avgSalary: 2.7 },
      { year: 2023, demand: 195, supply: 242, gap: -24, avgSalary: 2.8 },
      { year: 2024, demand: 200, supply: 250, gap: -25, avgSalary: 3.0 },
    ],
  },

  // Skill-wise Historical Gaps (2020-2024)
  skillGaps: {
    'Python': [
      { year: 2020, demand: 220, supply: 145, gap: 34, jobs: 220, avgSalary: 4.5 },
      { year: 2021, demand: 260, supply: 175, gap: 33, jobs: 260, avgSalary: 5.0 },
      { year: 2022, demand: 310, supply: 215, gap: 31, jobs: 310, avgSalary: 5.8 },
      { year: 2023, demand: 350, supply: 245, gap: 30, jobs: 350, avgSalary: 6.5 },
      { year: 2024, demand: 398, supply: 280, gap: 30, jobs: 398, avgSalary: 7.5 },
    ],
    'Java/Spring': [
      { year: 2020, demand: 185, supply: 140, gap: 24, jobs: 185, avgSalary: 5.0 },
      { year: 2021, demand: 210, supply: 160, gap: 24, jobs: 210, avgSalary: 5.5 },
      { year: 2022, demand: 235, supply: 180, gap: 23, jobs: 235, avgSalary: 6.2 },
      { year: 2023, demand: 260, supply: 200, gap: 23, jobs: 260, avgSalary: 7.0 },
      { year: 2024, demand: 285, supply: 220, gap: 23, jobs: 285, avgSalary: 9.0 },
    ],
    'Cloud/DevOps': [
      { year: 2020, demand: 35, supply: 12, gap: 66, jobs: 35, avgSalary: 6.0 },
      { year: 2021, demand: 52, supply: 18, gap: 65, jobs: 52, avgSalary: 7.0 },
      { year: 2022, demand: 72, supply: 25, gap: 65, jobs: 72, avgSalary: 8.5 },
      { year: 2023, demand: 95, supply: 35, gap: 63, jobs: 95, avgSalary: 10.0 },
      { year: 2024, demand: 120, supply: 45, gap: 63, jobs: 120, avgSalary: 11.5 },
    ],
    'Data Science': [
      { year: 2020, demand: 65, supply: 28, gap: 57, jobs: 65, avgSalary: 6.5 },
      { year: 2021, demand: 85, supply: 38, gap: 55, jobs: 85, avgSalary: 7.5 },
      { year: 2022, demand: 105, supply: 50, gap: 52, jobs: 105, avgSalary: 8.5 },
      { year: 2023, demand: 128, supply: 62, gap: 52, jobs: 128, avgSalary: 9.5 },
      { year: 2024, demand: 150, supply: 75, gap: 50, jobs: 150, avgSalary: 10.0 },
    ],
    'MERN Stack': [
      { year: 2020, demand: 85, supply: 52, gap: 39, jobs: 85, avgSalary: 4.0 },
      { year: 2021, demand: 105, supply: 65, gap: 38, jobs: 105, avgSalary: 4.5 },
      { year: 2022, demand: 128, supply: 82, gap: 36, jobs: 128, avgSalary: 5.0 },
      { year: 2023, demand: 152, supply: 100, gap: 34, jobs: 152, avgSalary: 5.5 },
      { year: 2024, demand: 180, supply: 120, gap: 33, jobs: 180, avgSalary: 6.0 },
    ],
    'React/Frontend': [
      { year: 2020, demand: 125, supply: 88, gap: 30, jobs: 125, avgSalary: 4.5 },
      { year: 2021, demand: 152, supply: 108, gap: 29, jobs: 152, avgSalary: 5.0 },
      { year: 2022, demand: 180, supply: 128, gap: 29, jobs: 180, avgSalary: 5.8 },
      { year: 2023, demand: 210, supply: 152, gap: 28, jobs: 210, avgSalary: 6.5 },
      { year: 2024, demand: 245, supply: 180, gap: 27, jobs: 245, avgSalary: 7.5 },
    ],
    'Soft Skills': [
      { year: 2020, demand: 220, supply: 125, gap: 43, jobs: 0, avgSalary: 0 },
      { year: 2021, demand: 240, supply: 138, gap: 43, jobs: 0, avgSalary: 0 },
      { year: 2022, demand: 260, supply: 152, gap: 42, jobs: 0, avgSalary: 0 },
      { year: 2023, demand: 280, supply: 165, gap: 41, jobs: 0, avgSalary: 0 },
      { year: 2024, demand: 300, supply: 180, gap: 40, jobs: 0, avgSalary: 0 },
    ],
  },

  // External Factors (Economic Indicators)
  economicFactors: [
    { year: 2020, gdpGrowth: -6.6, itGrowth: 2.3, kdemInvestment: 0, exports: 2800 },
    { year: 2021, gdpGrowth: 9.1, itGrowth: 15.5, kdemInvestment: 200, exports: 3000 },
    { year: 2022, gdpGrowth: 7.2, itGrowth: 11.4, kdemInvestment: 450, exports: 3200 },
    { year: 2023, gdpGrowth: 7.6, itGrowth: 8.4, kdemInvestment: 650, exports: 3400 },
    { year: 2024, gdpGrowth: 6.8, itGrowth: 12.0, kdemInvestment: 850, exports: 3500 },
  ],
};
