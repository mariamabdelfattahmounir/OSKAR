import React from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '../../../design-system/components/Card';
import Icon from '../../../design-system/components/Icon';

export const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Super Administrator Workspace</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Global platform administration, tenant provisioning, and system audit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Platform Users</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">1,248</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Icon name="manage_accounts" size="xl" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Institutions</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">34</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
            <Icon name="account_balance" size="xl" />
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Uptime</div>
            <div className="text-3xl font-black text-emerald-500 mt-1">99.99%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Icon name="dns" size="xl" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
