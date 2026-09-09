import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../../../design-system/components/Card';
import Input from '../../../design-system/components/Input';
import Badge, { StatusPill } from '../../../design-system/components/Badge';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../design-system/components/Table';
import { reviewerService } from '../../../services/reviewer/reviewerService';

export const ArchivePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const evaluations = reviewerService.getEvaluations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Study Evaluation Archive</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Historical record of completed IRB ethics reviews, decisions, and compliance logs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <Input
            placeholder="Search archive by study title or investigator..."
            icon="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Study Title & ID</TableHead>
                <TableHead>Methodology</TableHead>
                <TableHead>Investigator</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Completed Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evalItem) => (
                <TableRow key={evalItem.id}>
                  <TableCell className="font-semibold text-slate-900 dark:text-white max-w-md">
                    {evalItem.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="primary" size="sm">{evalItem.studyType}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">{evalItem.researcherName}</TableCell>
                  <TableCell>
                    <StatusPill status={evalItem.verdict || 'approved'} />
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{evalItem.submittedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchivePage;
