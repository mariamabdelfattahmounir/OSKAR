import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import { dashboardService } from '../../../services/dashboard/dashboardService';

export const ActiveStudiesSection = () => {
  const { t, isRtl } = useI18n();
  const studies = dashboardService.getActiveStudies();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t('dashboard.researcher.sectionStudiesTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('dashboard.researcher.sectionStudiesSub')}
          </p>
        </div>
        <Link
          to="/researcher/studies"
          className="text-xs font-bold text-primary dark:text-teal-400 hover:underline flex items-center gap-1 text-decoration-none"
        >
          <span>{t('dashboard.researcher.viewAllStudies')}</span>
          <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right text-xs align-middle">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 w-auto min-w-[220px]">{t('dashboard.researcher.thProtocol')}</th>
              <th className="py-3 px-4 whitespace-nowrap min-w-[150px]">{t('dashboard.researcher.thDesign')}</th>
              <th className="py-3 px-4 whitespace-nowrap min-w-[160px]">{t('dashboard.researcher.thStatus')}</th>
              <th className="py-3 px-4 whitespace-nowrap min-w-[100px]">{t('dashboard.researcher.thEnrollment')}</th>
              <th className="py-3 px-4 min-w-[140px]">{t('dashboard.researcher.thProgress')}</th>
              <th className="py-3 px-4 text-end whitespace-nowrap min-w-[130px]">{t('dashboard.researcher.thActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
            {studies.map((study) => (
              <tr
                key={study.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors align-middle"
              >
                <td className="py-3.5 px-4 space-y-0.5 align-middle">
                  <span className="font-bold text-slate-900 dark:text-white block leading-snug">
                    {study.title}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-primary dark:text-teal-400 block">
                    {study.id}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap align-middle">
                  {t(study.methodologyKey)}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap align-middle">
                  <span
                    className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      study.statusVariant === 'teal'
                        ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20'
                        : study.statusVariant === 'sky'
                        ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isRtl ? 'ml-1.5' : 'mr-1.5'
                      } ${
                        study.statusVariant === 'teal'
                          ? 'bg-teal-500'
                          : study.statusVariant === 'sky'
                          ? 'bg-sky-500'
                          : 'bg-emerald-500'
                      }`}
                    ></span>
                    <span className="whitespace-nowrap">{t(study.statusKey)}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-900 dark:text-white whitespace-nowrap align-middle">
                  {study.enrolled}
                </td>
                <td className="py-3.5 px-4 align-middle">
                  <div className="flex items-center gap-2.5 min-w-[130px]">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white shrink-0">
                      {study.progress}%
                    </span>
                    <div className="flex-grow bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          study.progress === 100 ? 'bg-emerald-500' : 'bg-primary'
                        }`}
                        style={{ width: `${study.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-end whitespace-nowrap align-middle">
                  <Link
                    to={study.actionRoute}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all text-decoration-none ${
                      study.statusVariant === 'emerald'
                        ? 'bg-primary text-white hover:bg-teal-700 shadow-xs'
                        : study.statusVariant === 'sky'
                        ? 'border border-primary text-primary dark:text-teal-300 hover:bg-primary/10'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon name={study.actionIcon} size="sm" />
                    <span>{t(study.actionKey)}</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveStudiesSection;
