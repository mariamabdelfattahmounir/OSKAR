import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const QuickLaunchTemplates = () => {
  const { t } = useI18n();
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-slate-50/50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="space-y-0.5">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {t('dashboard.researcher.sectionQuickLaunchTitle')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t('dashboard.researcher.sectionQuickLaunchSub')}
        </p>
      </div>

      {/* Compact 4-column layout on Desktop (1 horizontal row), 2 columns on tablet, 1 column on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: RCT */}
        <div
          onClick={() => handleCardClick('/researcher/studies/create/rct')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-teal-500/30 dark:border-teal-500/40 shadow-xs flex flex-col justify-between space-y-3 hover:border-primary transition-all group cursor-pointer hover:shadow-md"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary dark:text-teal-300 text-[10px] font-extrabold uppercase tracking-wider">
                {t('dashboard.researcher.rctBadge')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-teal-950/40 text-primary dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon name="science" size="sm" />
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-900 dark:text-white pt-0.5 leading-snug">
              {t('dashboard.researcher.rctTitle')}
            </h3>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
              {t('dashboard.researcher.rctDesc')}
            </p>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-0.5">
              <span className="font-bold text-primary dark:text-teal-400 block text-[10px]">
                {t('dashboard.researcher.rctBestLabel')}
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                {t('dashboard.researcher.rctBestVal')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick('/researcher/studies/create/rct');
            }}
            className="w-full py-2 px-2 rounded-lg border border-primary/40 dark:border-teal-500/40 bg-white/80 dark:bg-slate-900/80 text-primary dark:text-teal-300 hover:bg-primary/10 dark:hover:bg-teal-950/40 text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap flex-nowrap cursor-pointer"
          >
            <Icon name="add_circle" size="sm" className="shrink-0 text-primary dark:text-teal-400" />
            <span className="whitespace-nowrap">{t('dashboard.researcher.ctaCreateRct')}</span>
          </button>
        </div>

        {/* Card 2: Retrospective Study */}
        <div
          onClick={() => handleCardClick('/researcher/studies/create/retrospective')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-sky-500/30 dark:border-sky-500/40 shadow-xs flex flex-col justify-between space-y-3 hover:border-sky-500 transition-all group cursor-pointer hover:shadow-md"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[10px] font-extrabold uppercase tracking-wider">
                {t('dashboard.researcher.retroBadge')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon name="history" size="sm" />
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-900 dark:text-white pt-0.5 leading-snug">
              {t('dashboard.researcher.retroTitle')}
            </h3>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
              {t('dashboard.researcher.retroDesc')}
            </p>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-0.5">
              <span className="font-bold text-sky-700 dark:text-sky-300 block text-[10px]">
                {t('dashboard.researcher.retroBestLabel')}
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                {t('dashboard.researcher.retroBestVal')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick('/researcher/studies/create/retrospective');
            }}
            className="w-full py-2 px-2 rounded-lg border border-sky-500/40 dark:border-sky-500/40 bg-white/80 dark:bg-slate-900/80 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap flex-nowrap cursor-pointer"
          >
            <Icon name="add_circle" size="sm" className="shrink-0 text-sky-600 dark:text-sky-400" />
            <span className="whitespace-nowrap">{t('dashboard.researcher.ctaCreateRetro')}</span>
          </button>
        </div>

        {/* Card 3: Prospective Cohort */}
        <div
          onClick={() => handleCardClick('/researcher/studies/create/prospective')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-500/30 dark:border-indigo-500/40 shadow-xs flex flex-col justify-between space-y-3 hover:border-indigo-500 transition-all group cursor-pointer hover:shadow-md"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider">
                {t('dashboard.researcher.prospectBadge')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon name="monitoring" size="sm" />
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-900 dark:text-white pt-0.5 leading-snug">
              {t('dashboard.researcher.prospectTitle')}
            </h3>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
              {t('dashboard.researcher.prospectDesc')}
            </p>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-0.5">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 block text-[10px]">
                {t('dashboard.researcher.prospectBestLabel')}
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                {t('dashboard.researcher.prospectBestVal')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick('/researcher/studies/create/prospective');
            }}
            className="w-full py-2 px-2 rounded-lg border border-indigo-500/40 dark:border-indigo-500/40 bg-white/80 dark:bg-slate-900/80 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap flex-nowrap cursor-pointer"
          >
            <Icon name="add_circle" size="sm" className="shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span className="whitespace-nowrap">{t('dashboard.researcher.ctaCreateProspect')}</span>
          </button>
        </div>

        {/* Card 4: Cross-Sectional */}
        <div
          onClick={() => handleCardClick('/researcher/studies/create/cross-sectional')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-500/30 dark:border-amber-500/40 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-500 transition-all group cursor-pointer hover:shadow-md"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                {t('dashboard.researcher.crossBadge')}
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon name="pie_chart" size="sm" />
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-900 dark:text-white pt-0.5 leading-snug">
              {t('dashboard.researcher.crossTitle')}
            </h3>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
              {t('dashboard.researcher.crossDesc')}
            </p>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-0.5">
              <span className="font-bold text-amber-700 dark:text-amber-300 block text-[10px]">
                {t('dashboard.researcher.crossBestLabel')}
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-[11px]">
                {t('dashboard.researcher.crossBestVal')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick('/researcher/studies/create/cross-sectional');
            }}
            className="w-full py-2 px-2 rounded-lg border border-amber-500/40 dark:border-amber-500/40 bg-white/80 dark:bg-slate-900/80 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-[11px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap flex-nowrap cursor-pointer"
          >
            <Icon name="add_circle" size="sm" className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="whitespace-nowrap">{t('dashboard.researcher.ctaCreateCross')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickLaunchTemplates;
