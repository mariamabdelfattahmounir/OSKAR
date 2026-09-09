import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const StatisticalToolsGrid = () => {
  const { t } = useI18n();

  return (
    <div className="space-y-3.5">
      <div className="space-y-0.5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {t('dashboard.researcher.sectionToolsTitle')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('dashboard.researcher.sectionToolsSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Tool 1: Statistical Engine */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3.5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary dark:text-teal-400 flex items-center justify-center">
                <Icon name="analytics" size="md" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                {t('dashboard.researcher.engineAccessBadge')}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t('dashboard.researcher.engineTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('dashboard.researcher.engineDesc')}
            </p>
            <div className="pt-0.5 text-[11px] font-mono text-primary dark:text-teal-400 font-semibold">
              {t('dashboard.researcher.engineCaps')}
            </div>
          </div>
          <Link
            to="/researcher/statistics"
            className="w-full py-2.5 rounded-xl bg-primary text-white hover:bg-teal-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs text-decoration-none"
          >
            <Icon name="play_arrow" size="sm" />
            <span>{t('dashboard.researcher.ctaOpenEngine')}</span>
          </Link>
        </div>

        {/* Tool 2: Sample Size Calculator */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3.5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary dark:text-teal-400 flex items-center justify-center">
                <Icon name="calculate" size="md" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-bold">
                {t('dashboard.researcher.calcAccessBadge')}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t('dashboard.researcher.calcTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('dashboard.researcher.calcDesc')}
            </p>
            <div className="pt-0.5 text-[11px] font-mono text-primary dark:text-teal-400 font-semibold">
              {t('dashboard.researcher.calcCaps')}
            </div>
          </div>
          <Link
            to="/researcher/sample-size"
            className="w-full py-2.5 rounded-xl border border-primary text-primary dark:text-teal-300 hover:bg-primary hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs text-decoration-none"
          >
            <Icon name="function" size="sm" />
            <span>{t('dashboard.researcher.ctaTryCalc')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StatisticalToolsGrid;
