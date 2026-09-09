import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../../../design-system/components/Card';
import Button from '../../../design-system/components/Button';
import Badge, { StatusPill } from '../../../design-system/components/Badge';
import Icon from '../../../design-system/components/Icon';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../design-system/components/Table';
import { reviewerService } from '../../../services/reviewer/reviewerService';

export const DashboardPage = () => {
  const evaluations = reviewerService.getEvaluations();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reviewer & IRB Workspace</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ethics committee portal for clinical protocol evaluation, compliance checking, and approval workflows.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Reviews</div>
            <div className="text-3xl font-black text-amber-500 mt-1">1</div>
            <div className="text-[11px] text-slate-400 mt-1">Requires decision within 7 days</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Icon name="pending_actions" size="xl" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Reviews</div>
            <div className="text-3xl font-black text-emerald-500 mt-1">12</div>
            <div className="text-[11px] text-slate-400 mt-1">Past 90 days</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Icon name="task_alt" size="xl" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Compliance Score</div>
            <div className="text-3xl font-black text-teal-400 mt-1">92.4%</div>
            <div className="text-[11px] text-slate-400 mt-1">SPIRIT 2025 Audit Standard</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Icon name="verified" size="xl" />
          </div>
        </Card>
      </div>

      {/* Assigned Evaluations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Protocol Evaluations</CardTitle>
          <CardDescription>Review submitted study protocols, rubrics, and automated compliance reports.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Study Title & Investigator</TableHead>
                <TableHead>Methodology</TableHead>
                <TableHead>Compliance Score</TableHead>
                <TableHead>COI Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evalItem) => (
                <TableRow key={evalItem.id}>
                  <TableCell className="max-w-md">
                    <div className="font-semibold text-slate-900 dark:text-white">{evalItem.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{evalItem.researcherName} • {evalItem.institution}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="primary" size="sm">{evalItem.studyType}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900 dark:text-white">{evalItem.complianceScore}%</div>
                    <div className="text-[11px] text-emerald-500">{evalItem.spiritCompliance}</div>
                  </TableCell>
                  <TableCell>
                    {evalItem.coiDeclared ? (
                      <Badge variant="success" size="sm">Declared Clear</Badge>
                    ) : (
                      <Badge variant="warning" size="sm">Declaration Required</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-slate-500">{evalItem.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/reviewer/evaluations/${evalItem.id}`}>
                      <Button variant="primary" size="sm" icon="rate_review">
                        Evaluate Protocol
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
