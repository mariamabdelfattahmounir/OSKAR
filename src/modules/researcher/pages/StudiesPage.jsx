import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import { studyService } from '../../../services/studies/studyService';

export const StudiesPage = () => {
  const { t, isRtl } = useI18n();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [methodologyFilter, setMethodologyFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('recent');

  const allStudies = studyService.getStudies();

  // Filter Logic
  let filtered = allStudies.filter((study) => {
    // 1. Tab Filter
    if (activeTab !== 'all') {
      const matchTab = study.tabStatus || study.status;
      if (matchTab.toLowerCase() !== activeTab.toLowerCase()) return false;
    }

    // 2. Search Filter (Title, ID, Investigator)
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const matchTitle = (study.title || '').toLowerCase().includes(q) || (study.titleAr || '').toLowerCase().includes(q);
      const matchId = (study.id || '').toLowerCase().includes(q);
      const matchPi = (study.pi || '').toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchPi) return false;
    }

    // 3. Methodology Filter
    if (methodologyFilter !== 'all') {
      if ((study.typeId || '').toLowerCase() !== methodologyFilter.toLowerCase()) return false;
    }

    return true;
  });

  // Sorting Logic
  filtered.sort((a, b) => {
    if (sortFilter === 'title') {
      const titleA = isRtl ? (a.titleAr || a.title) : a.title;
      const titleB = isRtl ? (b.titleAr || b.title) : b.title;
      return titleA.localeCompare(titleB);
    } else if (sortFilter === 'progress') {
      return (b.progress || 0) - (a.progress || 0);
    } else {
      // Recent (default)
      return (b.lastModified || '').localeCompare(a.lastModified || '');
    }
  });

  // Prototype counts for tabs
  const tabCounts = {
    all: 14,
    active: 3,
    drafts: 4,
    completed: 6,
    archived: 1,
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6 sm:space-y-7 font-sans">
      {/* 01. Page Introduction / Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 text-xs text-primary dark:text-teal-400 font-bold uppercase tracking-wider">
            <Icon name="science" size="sm" />
            <span>{t('studiesPage.workspaceBadge')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('studiesPage.pageTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('studiesPage.pageSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            to="/researcher/studies/continue"
            className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap text-decoration-none"
          >
            <Icon name="history_edu" size="sm" />
            <span>{t('studiesPage.ctaContinueStudy')}</span>
          </Link>
          <Link
            to="/researcher/studies/new"
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-teal-700 transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap text-decoration-none"
          >
            <Icon name="add_circle" size="sm" />
            <span>{t('studiesPage.ctaNewStudy')}</span>
          </Link>
        </div>
      </div>

      {/* 02. Study Organization Filter Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold scrollbar-none pb-px">
          {[
            { id: 'all', key: 'tabAll', badgeClass: 'bg-primary/10 text-primary dark:text-teal-300' },
            { id: 'active', key: 'tabActive', badgeClass: 'bg-teal-500/10 text-teal-700 dark:text-teal-300' },
            { id: 'drafts', key: 'tabDrafts', badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300' },
            { id: 'completed', key: 'tabCompleted', badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
            { id: 'archived', key: 'tabArchived', badgeClass: 'bg-slate-500/10 text-slate-700 dark:text-slate-400' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 border-b-2 font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-primary text-primary dark:text-teal-300'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{t(`studiesPage.${tab.key}`)}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${tab.badgeClass}`}>
                {tabCounts[tab.id]}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* 03. Search & Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Icon
            name="search"
            size="sm"
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRtl ? 'right-3' : 'left-3'}`}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('studiesPage.searchPlaceholder')}
            className={`w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-2 focus:outline-none focus:border-primary ${
              isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-between md:justify-end">
          <select
            value={methodologyFilter}
            onChange={(e) => setMethodologyFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">{t('studiesPage.filterAllMethodologies')}</option>
            <option value="rct">{t('studiesPage.filterRct')}</option>
            <option value="retro">{t('studiesPage.filterRetro')}</option>
            <option value="prospect">{t('studiesPage.filterProspect')}</option>
            <option value="cross">{t('studiesPage.filterCross')}</option>
          </select>

          <select
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="recent">{t('studiesPage.sortRecent')}</option>
            <option value="title">{t('studiesPage.sortTitle')}</option>
            <option value="progress">{t('studiesPage.sortProgress')}</option>
          </select>
        </div>
      </div>

      {/* 04. Clinical Studies List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filtered.length > 0 ? (
          filtered.map((study) => {
            const displayType = isRtl ? (study.typeAr || study.type) : study.type;
            const displayTitle = isRtl ? (study.titleAr || study.title) : study.title;
            const displayDesc = isRtl ? (study.descAr || study.desc) : study.desc;
            const displayStatus = isRtl ? (study.statusLabelAr || study.statusLabelEn) : study.statusLabelEn;

            let badgeTypeStyle = 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20';
            if (study.typeId === 'retro') badgeTypeStyle = 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20';
            if (study.typeId === 'cross') badgeTypeStyle = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
            if (study.typeId === 'rct') badgeTypeStyle = 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20';

            let badgeStatusStyle = 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20';
            let statusDot = 'bg-teal-500';
            if (study.statusVariant === 'sky') {
              badgeStatusStyle = 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20';
              statusDot = 'bg-sky-500';
            } else if (study.statusVariant === 'emerald') {
              badgeStatusStyle = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
              statusDot = 'bg-emerald-500';
            } else if (study.statusVariant === 'amber') {
              badgeStatusStyle = 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20';
              statusDot = 'bg-amber-500';
            }

            return (
              <div
                key={study.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider border ${badgeTypeStyle}`}>
                      {displayType}
                    </span>
                    <span className={`inline-flex items-center whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeStatusStyle}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot} ${isRtl ? 'ml-1.5' : 'mr-1.5'}`}></span>
                      <span className="whitespace-nowrap">{displayStatus}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-primary dark:text-teal-400 block">
                      {study.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>

                  {/* Progress & Metrics */}
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>{t('studiesPage.labelEnrollment')}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {study.enrolled} / {study.sampleSize} {isRtl ? 'مريض' : 'patients'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className={`font-mono font-bold text-xs ${study.progress === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary dark:text-teal-400'}`}>
                        {study.progress}%
                      </span>
                      <div className="flex-grow bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${study.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                          style={{ width: `${study.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-2">
                  <span className={`text-[10px] ${study.statusVariant === 'amber' ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                    {study.irbStatus}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      studyService.setSelectedActiveStudy(study);
                      navigate('/researcher/studies/view');
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0"
                  >
                    <Icon name="visibility" size="sm" className="shrink-0" />
                    <span className="whitespace-nowrap">{t('studiesPage.btnViewStudy')}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-xs text-slate-500 dark:text-slate-400">
            {isRtl ? 'لا توجد دراسات مطابقة للبحث أو المنهجية المحددة' : 'No studies matching the selected filter or search term.'}
          </div>
        )}
      </div>

      {/* 05. End-of-List Create New Study Action Panel */}
      <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-primary dark:text-teal-400 uppercase tracking-wider">
            <Icon name="add_circle" size="sm" />
            <span>{t('studiesPage.endCtaTag')}</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {t('studiesPage.endCtaTitle')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('studiesPage.endCtaSub')}
          </p>
        </div>

        <div className="shrink-0">
          <Link
            to="/researcher/studies/new"
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-teal-700 transition-all shadow-sm flex items-center gap-2 whitespace-nowrap text-decoration-none"
          >
            <Icon name="add_circle" size="sm" />
            <span>{t('studiesPage.ctaNewStudy')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudiesPage;
