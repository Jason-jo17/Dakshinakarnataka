

import { Card } from '../../ui/card';
import KSIScorecard from './components/KSIScorecard';
import DimensionRadar from './components/DimensionRadar';
import DistanceToIdealBars from './components/DistanceToIdealBars';
import DistrictHeatmap from './components/DistrictHeatmap';
import BenchmarkComparison from './components/BenchmarkComparison';
import IndicatorBreakdown from './components/IndicatorBreakdown';

export default function SkillIndexTab() {
  // KSI Calculation for Dakshina Kannada (From Prompt)
  const dkKSI = {
    overallScore: 68.5,
    rank: 8,      // Among 31 Karnataka districts
    category: 'FrontRunner',
    dimensions: [
      { id: 'D1', name: 'Access & Infrastructure', score: 75, rank: 6 },
      { id: 'D2', name: 'Training Quality', score: 72, rank: 7 },
      { id: 'D3', name: 'Placements', score: 68, rank: 9 },
      { id: 'D4', name: 'Labor Activation', score: 62, rank: 11 },
      { id: 'D5', name: 'Skill Matching', score: 66, rank: 10 },
    ],
    trend: {
      previousYear: 64.2,
      change: 4.3,
      projectedScore2030: 82.0,
      onTrack: true,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Karnataka Skill Index (KSI)
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Measuring Dakshina Kannada's distance to ideal performance across 5 dimensions and 19 indicators
        </p>
      </div>

      {/* KSI Hero Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KSIScorecard
            score={dkKSI.overallScore}
            rank={dkKSI.rank}
            totalDistricts={31}
            category={dkKSI.category}
            trend={dkKSI.trend}
          />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-[140px] flex flex-col justify-center">
            <div className="text-sm text-blue-700 font-medium">State Rank</div>
            <div className="text-4xl font-bold text-blue-600 mt-2">#8</div>
            <div className="text-xs text-blue-700 mt-1 opacity-80">of 31 districts</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 min-h-[140px] flex flex-col justify-center">
            <div className="text-sm text-green-700 font-medium">YoY Improvement</div>
            <div className="text-4xl font-bold text-green-600 mt-2">+4.3</div>
            <div className="text-xs text-green-700 mt-1 opacity-80">points (64.2 → 68.5)</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 min-h-[140px] flex flex-col justify-center">
            <div className="text-sm text-purple-700 font-medium">2030 Projection</div>
            <div className="text-4xl font-bold text-purple-600 mt-2">82.0</div>
            <div className="text-xs text-purple-700 mt-1 opacity-80">On track ✓</div>
          </Card>
        </div>
      </div>

      {/* Dimension Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dimension Radar Chart */}
        <DimensionRadar
          dimensions={dkKSI.dimensions}
          stateAverage={{
            D1: 62,
            D2: 58,
            D3: 55,
            D4: 54,
            D5: 52,
          }}
        />

        {/* Distance to Ideal */}
        <DistanceToIdealBars
          dimensions={dkKSI.dimensions.map(d => ({
            name: d.name,
            current: d.score,
            target: 100,
            distance: 100 - d.score,
          }))}
        />
      </div>

      {/* District Heatmap - All 31 Karnataka Districts (Selection) */}
      <DistrictHeatmap
        districts={[
          { name: 'Bengaluru Urban', D1: 92, D2: 88, D3: 95, D4: 85, D5: 90, overall: 90.0, rank: 1 },
          { name: 'Bengaluru Rural', D1: 78, D2: 75, D3: 80, D4: 72, D5: 76, overall: 76.2, rank: 2 },
          { name: 'Mysuru', D1: 80, D2: 76, D3: 78, D4: 74, D5: 75, overall: 76.6, rank: 3 },
          { name: 'Mangaluru', D1: 72, D2: 70, D3: 75, D4: 68, D5: 72, overall: 71.4, rank: 4 },
          { name: 'Hubballi-Dharwad', D1: 70, D2: 68, D3: 72, D4: 65, D5: 68, overall: 68.6, rank: 5 },
          { name: 'Belagavi', D1: 68, D2: 65, D3: 70, D4: 62, D5: 65, overall: 66.0, rank: 6 },
          { name: 'Tumakuru', D1: 65, D2: 62, D3: 68, D4: 60, D5: 63, overall: 63.6, rank: 7 },
          { name: 'Dakshina Kannada', D1: 75, D2: 72, D3: 68, D4: 62, D5: 66, overall: 68.5, rank: 8 },
          { name: 'Udupi', D1: 74, D2: 70, D3: 65, D4: 60, D5: 64, overall: 66.6, rank: 9 },
          { name: 'Hassan', D1: 70, D2: 65, D3: 60, D4: 58, D5: 60, overall: 62.6, rank: 10 },
        ]}
      />

      {/* Benchmark Comparison */}
      <BenchmarkComparison
        dakshinaKannada={dkKSI.dimensions}
        stateAverage={[
          { dimension: 'Access & Infrastructure', score: 62 },
          { dimension: 'Training Quality', score: 58 },
          { dimension: 'Placements', score: 55 },
          { dimension: 'Labor Activation', score: 54 },
          { dimension: 'Skill Matching', score: 52 },
        ]}
        bestPerformer={{
          name: 'Bengaluru Urban',
          scores: [
            { dimension: 'Access & Infrastructure', score: 92 },
            { dimension: 'Training Quality', score: 88 },
            { dimension: 'Placements', score: 95 },
            { dimension: 'Labor Activation', score: 85 },
            { dimension: 'Skill Matching', score: 90 },
          ],
        }}
      />

      {/* Detailed Indicator Breakdown - REAL DATA */}
      <IndicatorBreakdown
        indicators={[
          // D1: Access & Infrastructure
          {
            id: 'D1.1',
            dimension: 'D1',
            name: 'ITI seats per 1000 youth',
            rawValue: 15.2,
            normalizedScore: 76,
            stateAverage: 12.5,
            bestPerformer: 18.8,
            trend: 'improving',
            unit: 'seats/1000',
          },
          {
            id: 'D1.2',
            dimension: 'D1',
            name: 'Training centers per lakh population',
            rawValue: 2.8,
            normalizedScore: 70,
            stateAverage: 2.2,
            bestPerformer: 4.2,
            trend: 'improving',
            unit: 'centers/lakh',
          },
          {
            id: 'D1.3',
            dimension: 'D1',
            name: 'Rural training access ratio',
            rawValue: 0.65,
            normalizedScore: 65,
            stateAverage: 0.52,
            bestPerformer: 0.88,
            trend: 'stagnating',
            unit: 'ratio',
          },
          {
            id: 'D1.4',
            dimension: 'D1',
            name: 'Female enrollment ratio',
            rawValue: 32.5,
            normalizedScore: 65,
            stateAverage: 28.2,
            bestPerformer: 48.5,
            trend: 'improving',
            unit: '%',
          },
          // D2: Training Quality
          {
            id: 'D2.1',
            dimension: 'D2',
            name: 'Training completion rate',
            rawValue: 72,
            normalizedScore: 72,
            stateAverage: 65,
            bestPerformer: 88,
            trend: 'improving',
            unit: '%',
          },
          {
            id: 'D2.2',
            dimension: 'D2',
            name: 'Assessment pass rate',
            rawValue: 68,
            normalizedScore: 68,
            stateAverage: 62,
            bestPerformer: 85,
            trend: 'stagnating',
            unit: '%',
          },
          {
            id: 'D2.3',
            dimension: 'D2',
            name: 'Trainer-to-trainee ratio',
            rawValue: 0.045,
            normalizedScore: 56,
            stateAverage: 0.038,
            bestPerformer: 0.082,
            trend: 'declining',
            unit: 'ratio',
          },
          {
            id: 'D2.4',
            dimension: 'D2',
            name: 'Industry-aligned curriculum coverage',
            rawValue: 75,
            normalizedScore: 75,
            stateAverage: 68,
            bestPerformer: 92,
            trend: 'improving',
            unit: '%',
          },
          // D3: Placements
          {
            id: 'D3.1',
            dimension: 'D3',
            name: 'Placement rate (within 90 days)',
            rawValue: 52,
            normalizedScore: 65,
            stateAverage: 45,
            bestPerformer: 78,
            trend: 'improving',
            unit: '%',
          },
          {
            id: 'D3.2',
            dimension: 'D3',
            name: 'Job retention rate (6 months)',
            rawValue: 68,
            normalizedScore: 68,
            stateAverage: 58,
            bestPerformer: 85,
            trend: 'improving',
            unit: '%',
          },
          {
            id: 'D3.3',
            dimension: 'D3',
            name: 'Wage premium post-training',
            rawValue: 26,
            normalizedScore: 52,
            stateAverage: 18,
            bestPerformer: 45,
            trend: 'stagnating',
            unit: '%',
          },
          // D4: Labor Activation
          {
            id: 'D4.1',
            dimension: 'D4',
            name: 'Youth unemployment rate',
            rawValue: 14.5,
            normalizedScore: 57,
            stateAverage: 16.8,
            bestPerformer: 8.2,
            trend: 'improving',
            unit: '%',
          },
          {
            id: 'D4.2',
            dimension: 'D4',
            name: 'Skill gap closure rate',
            rawValue: 18,
            normalizedScore: 36,
            stateAverage: 12,
            bestPerformer: 38,
            trend: 'improving',
            unit: '%',
          },
          // D5: Skill Matching
          {
            id: 'D5.1',
            dimension: 'D5',
            name: 'Apprenticeship engagement rate',
            rawValue: 8.5,
            normalizedScore: 43,
            stateAverage: 6.2,
            bestPerformer: 16.5,
            trend: 'improving',
            unit: 'per 1000',
          },
          {
            id: 'D5.2',
            dimension: 'D5',
            name: 'Industry partnership density',
            rawValue: 28,
            normalizedScore: 56,
            stateAverage: 18,
            bestPerformer: 45,
            trend: 'improving',
            unit: 'MoUs',
          },
          {
            id: 'D5.4',
            dimension: 'D5',
            name: 'Skill utilization rate',
            rawValue: 62,
            normalizedScore: 53,
            stateAverage: 48,
            bestPerformer: 82,
            trend: 'improving',
            unit: '%',
          },
        ]}
      />
    </div>
  );
}
