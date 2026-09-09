import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../../../design-system/components/Card';
import Badge from '../../../design-system/components/Badge';
import Icon from '../../../design-system/components/Icon';

export const SupervisorDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Supervisor Workspace</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Supervise departmental research protocols, team progress, and institutional submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Supervised PIs</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">8</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
            <Icon name="groups" size="xl" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Department Protocols</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">14</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Icon name="science" size="xl" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Approvals</div>
            <div className="text-3xl font-black text-amber-500 mt-1">3</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Icon name="pending" size="xl" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupervisorDashboardPage;
