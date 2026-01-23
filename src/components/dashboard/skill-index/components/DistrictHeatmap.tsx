
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Badge } from '../../../ui/badge';

interface DistrictRow {
  name: string;
  rank: number;
  overall: number;
  D1: number;
  D2: number;
  D3: number;
  D4: number;
  D5: number;
}

const DistrictHeatmap: React.FC<{ districts: DistrictRow[] }> = ({ districts }) => {
  const getCellColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 65) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>State-wise District Performance Matrix</CardTitle>
        <CardDescription>Comparing Dakshina Kannada rank and indicator scores against peers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>District</TableHead>
              <TableHead className="text-center">Overall KSI</TableHead>
              <TableHead className="text-center" title="Access & Infra">Acc.</TableHead>
              <TableHead className="text-center" title="Training Quality">Qual.</TableHead>
              <TableHead className="text-center" title="Placements">Place.</TableHead>
              <TableHead className="text-center" title="Labor Activation">Activ.</TableHead>
              <TableHead className="text-center" title="Skill Matching">Match.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {districts.map((d) => (
              <TableRow key={d.name} className={d.name === 'Dakshina Kannada' ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''}>
                <TableCell className="font-semibold text-slate-500">#{d.rank}</TableCell>
                <TableCell className="font-medium">
                  {d.name}
                  {d.name === 'Dakshina Kannada' && <Badge variant="outline" className="ml-2 text-[10px] border-blue-200 text-blue-600">YOU</Badge>}
                </TableCell>
                <TableCell className="text-center font-bold text-slate-800">{d.overall.toFixed(1)}</TableCell>

                <TableCell className="text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${getCellColor(d.D1)}`}>{d.D1}</span></TableCell>
                <TableCell className="text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${getCellColor(d.D2)}`}>{d.D2}</span></TableCell>
                <TableCell className="text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${getCellColor(d.D3)}`}>{d.D3}</span></TableCell>
                <TableCell className="text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${getCellColor(d.D4)}`}>{d.D4}</span></TableCell>
                <TableCell className="text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${getCellColor(d.D5)}`}>{d.D5}</span></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DistrictHeatmap;
