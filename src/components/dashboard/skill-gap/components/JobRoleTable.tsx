
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table';
import { Badge } from '../../../ui/badge';

interface JobRole {
  id: number;
  role: string;
  nsqfLevel: number;
  currentGap: number;
  projectedGap2030: number;
  avgWage: number;
  trainingHours: number;
}

const JobRoleTable: React.FC<{ roles: JobRole[] }> = ({ roles }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Job Roles & Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Role</TableHead>
              <TableHead>NSQF Level</TableHead>
              <TableHead className="text-right">Current Gap</TableHead>
              <TableHead className="text-right">2030 Gap (Proj)</TableHead>
              <TableHead className="text-right">Avg Wage (LPA)</TableHead>
              <TableHead className="text-right">Training H</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.role}</TableCell>
                <TableCell>
                  <Badge variant="secondary">Level {role.nsqfLevel}</Badge>
                </TableCell>
                <TableCell className="text-right text-red-600 font-medium">{role.currentGap}</TableCell>
                <TableCell className="text-right">{role.projectedGap2030}</TableCell>
                <TableCell className="text-right">₹{role.avgWage}</TableCell>
                <TableCell className="text-right text-slate-500">{role.trainingHours} hrs</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default JobRoleTable;
