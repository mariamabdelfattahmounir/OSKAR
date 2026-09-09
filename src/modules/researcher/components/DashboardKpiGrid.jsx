import React from 'react';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import { dashboardService } from '../../../services/dashboard/dashboardService';

export const DashboardKpiGrid = () => {
  const { t } = useI18n();
  const kpis = dashboardService.getKpiMetrics();

  const accentStyles = {
    teal: 'border-teal-500/20 dark:border-teal-500/30 hover:border-teal-500/50',
    sky: 'border-sky-500/20 dark:border-sky-500/30 hover:border-sky-500/50',
    emerald: 'border-emerald-500/20 dark:border-emerald-500/30 hover:border-emerald-500/50',
    indigo: 'border-indigo-500/20 dark:border-indigo-500/30 hover:border-indigo-500/50',
  };

  const iconBgStyles = {
    teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className={`bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border transition-all shadow-xs flex flex-col justify-between space-y-3 ${
            accentStyles[kpi.accentColor] || 'border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                iconBgStyles[kpi.accentColor]
              }`}
            >
              <Icon name={kpi.icon} size="md" />
            </div>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider ${
                kpi.statusBadge === 'APPROVED'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : kpi.statusBadge === 'EXPORTS'
                  ? 'text-indigo-500 dark:text-indigo-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {kpi.statusBadge || `METRIC ${kpi.metricNumber}`}
            </span>
          </div>

          <div className="space-y-0.5 pt-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t(kpi.labelKey)}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white block">
              {kpi.value}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
              {t(kpi.subKey)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardKpiGrid;
