import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../../../design-system/components/Card';
import Icon from '../../../design-system/components/Icon';

export const InstitutionDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Institutional Oversight Workspace</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage institutional IRB accounts, seat allocations, and compliance reporting.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active IRB Submissions</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">28</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
            <Icon name="domain" size="xl" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Allocated Researcher Seats</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">45 / 50</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Icon name="badge" size="xl" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Global Audit Status</div>
            <div className="text-3xl font-black text-emerald-500 mt-1">100% PASS</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Icon name="verified_user" size="xl" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InstitutionDashboardPage;
