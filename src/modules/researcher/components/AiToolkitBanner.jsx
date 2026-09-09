import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import { dashboardService } from '../../../services/dashboard/dashboardService';

export const AiToolkitBanner = () => {
  const { t } = useI18n();
  const credits = dashboardService.getAiCreditsInfo();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left Quota Block */}
        <div className="space-y-2.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider">
              {t('dashboard.researcher.aiBannerTag')}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold">
              {t('dashboard.researcher.aiStatusActive')}
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {t('dashboard.researcher.aiBannerTitle')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('dashboard.researcher.aiBannerDesc')}
          </p>

          {/* Progress Bar */}
          <div className="space-y-1 pt-0.5">
            <div className="flex items-baseline justify-between text-xs font-mono">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {credits.used} / {credits.total}{' '}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  {t('dashboard.researcher.aiRemainingText')}
                </span>
              </span>
              <span className="font-bold text-primary dark:text-teal-400 text-xs">
                {credits.percentage}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full w-full"></div>
            </div>
          </div>
        </div>

        {/* Center Features Highlight List */}
        <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-6 space-y-2 text-xs text-slate-800 dark:text-slate-200 font-medium">
          <div className="flex items-center gap-2">
            <Icon name="check_circle" size="sm" className="text-primary dark:text-teal-400" />
            <span>{t('dashboard.researcher.aiFeat1')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="check_circle" size="sm" className="text-primary dark:text-teal-400" />
            <span>{t('dashboard.researcher.aiFeat2')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="check_circle" size="sm" className="text-primary dark:text-teal-400" />
            <span>{t('dashboard.researcher.aiFeat3')}</span>
          </div>
        </div>

        {/* Right Action CTA */}
        <div className="shrink-0 flex flex-col items-start lg:items-end justify-center gap-1.5 border-t lg:border-t-0 border-slate-200 dark:border-slate-800 pt-3 lg:pt-0">
          <Link
            to="/billing"
            className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-teal-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm text-decoration-none"
          >
            <Icon name="credit_card" size="sm" />
            <span>{t('dashboard.researcher.ctaTopup')}</span>
          </Link>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {t('dashboard.researcher.aiPlanNote')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AiToolkitBanner;
