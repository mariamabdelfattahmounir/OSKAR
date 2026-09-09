import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const ResearcherDashboardHeader = () => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
      <div className="space-y-1 max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-primary dark:text-teal-400 font-bold uppercase tracking-wider">
          <Icon name="space_dashboard" size="sm" />
          <span>{t('dashboard.researcher.workspaceBadge')}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('dashboard.researcher.pageTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('dashboard.researcher.pageSubtitle')}
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Link
          to="/researcher/studies/new"
          className="px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-teal-700 transition-all shadow-sm flex items-center gap-1.5 text-decoration-none"
        >
          <Icon name="add_circle" size="sm" />
          <span>{t('dashboard.researcher.ctaNewProtocol')}</span>
        </Link>
        <Link
          to="/researcher/sample-size"
          className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 text-decoration-none shadow-xs"
        >
          <Icon name="calculate" size="sm" />
          <span>{t('dashboard.researcher.ctaSampleSize')}</span>
        </Link>
      </div>
    </div>
  );
};

export default ResearcherDashboardHeader;
