import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import { dashboardService } from '../../../services/dashboard/dashboardService';

export const DashboardUpdatesSection = () => {
  const { t, isRtl } = useI18n();
  const updates = dashboardService.getDashboardNotifications();

  const cardBorderStyles = {
    red: 'border-red-500/30 dark:border-red-500/40 bg-red-500/5 dark:bg-red-950/20',
    amber: 'border-amber-500/30 dark:border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20',
    sky: 'border-sky-500/30 dark:border-sky-500/40 bg-sky-500/5 dark:bg-sky-950/20',
    emerald: 'border-emerald-500/30 dark:border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20',
  };

  const badgeStyles = {
    red: 'bg-red-500/20 text-red-800 dark:text-red-200',
    amber: 'bg-amber-500/20 text-amber-800 dark:text-amber-200',
    sky: 'bg-sky-500/20 text-sky-800 dark:text-sky-200',
    emerald: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200',
  };

  const buttonStyles = {
    red: 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-200 hover:bg-red-500/20',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20',
    sky: 'bg-sky-500/10 border-sky-500/30 text-sky-800 dark:text-sky-200 hover:bg-sky-500/20',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-500/20',
  };

  return (
    <div className="bg-slate-50/70 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-primary dark:text-teal-400">
            <Icon name="notifications_active" size="md" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t('dashboard.researcher.sectionUpdatesTitle')}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('dashboard.researcher.sectionUpdatesSub')}
          </p>
        </div>

        {/* Count Badge */}
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary dark:text-teal-300 font-mono text-xs font-extrabold border border-primary/30 shadow-xs shrink-0">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span>{t('dashboard.researcher.updatesCountBadge')}</span>
        </span>
      </div>

      {/* Grid of 4 Notification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {updates.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border space-y-3 flex flex-col justify-between shadow-xs transition-all ${
              cardBorderStyles[item.colorVariant]
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      item.colorVariant === 'red'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-300'
                        : item.colorVariant === 'amber'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300'
                        : item.colorVariant === 'sky'
                        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-300'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                    }`}
                  >
                    <Icon name={item.icon} size="sm" />
                  </div>
                  <span
                    className={`font-semibold text-xs ${
                      item.colorVariant === 'red'
                        ? 'text-red-700 dark:text-red-300'
                        : item.colorVariant === 'amber'
                        ? 'text-amber-700 dark:text-amber-300'
                        : item.colorVariant === 'sky'
                        ? 'text-sky-700 dark:text-sky-300'
                        : 'text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {t(item.typeKey)}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    badgeStyles[item.colorVariant]
                  }`}
                >
                  {t(item.badgeKey)}
                </span>
              </div>

              <span className="text-[11px] font-mono font-bold text-primary dark:text-teal-400 block">
                {item.studyId}
              </span>

              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                {t(item.titleKey)}
              </h4>

              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed italic">
                {t(item.descKey)}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <span>{item.author}</span>
                <span>{isRtl ? item.timestampAr : item.timestampEn}</span>
              </div>
            </div>

            <Link
              to={item.route}
              className={`w-full py-2 rounded-lg border text-xs font-semibold text-center transition-all text-decoration-none block ${
                buttonStyles[item.colorVariant]
              }`}
            >
              <span>{t(item.ctaKey)}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardUpdatesSection;
