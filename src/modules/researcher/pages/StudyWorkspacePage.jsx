import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import { studyService } from '../../../services/studies/studyService';

export const StudyWorkspacePage = () => {
  const { t, isRtl } = useI18n();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('participants');
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [patSearch, setPatSearch] = useState('');

  useEffect(() => {
    const active = studyService.getSelectedActiveStudy();
    setSelectedStudy(active);
  }, []);

  const displayTitle = selectedStudy
    ? (isRtl ? (selectedStudy.titleAr || selectedStudy.title) : selectedStudy.title)
    : t('studyWorkspace.studyTitle');

  const displayId = selectedStudy?.id || 'OSKAR-DENT-2026-01';
  const displayPi = selectedStudy?.pi || (isRtl ? 'د. سارة محمود' : 'Dr. Sarah Med');
  const displayIrb = selectedStudy?.irbStatus || 'IRB-2026-145';
  const displayType = selectedStudy
    ? (isRtl ? (selectedStudy.typeAr || selectedStudy.type) : selectedStudy.type)
    : t('studyWorkspace.badgeRct');

  // Prototype demo participants
  const participants = [
    {
      id: 'PAT-2026-00125',
      name: isRtl ? 'أحمد علي محمد' : 'Ahmed Ali Mohammed',
      demo: isRtl ? '24 سنة • ذكر' : '24 yrs • Male',
      consent: '25/08/2026',
      visits: isRtl ? 'الزيارة 3 من 3 (نهائي)' : 'Visit 3 of 3 (Final)',
      scans: '6 STL Files',
      statusKey: 'statusPatCompleted',
      statusVariant: 'emerald',
      statusText: isRtl ? 'مكتمل' : 'Completed',
    },
    {
      id: 'PAT-2026-00126',
      name: isRtl ? 'فاطمة حسن الكحلاني' : 'Fatima Hassan Al-Kahlani',
      demo: isRtl ? '28 سنة • أنثى' : '28 yrs • Female',
      consent: '26/08/2026',
      visits: isRtl ? 'الزيارة 2 من 3 (متابعة)' : 'Visit 2 of 3 (Progress)',
      scans: '3 STL Files',
      statusKey: 'statusPatActive',
      statusVariant: 'sky',
      statusText: isRtl ? 'متابعة نشطة' : 'Active Follow-Up',
    },
    {
      id: 'PAT-2026-00127',
      name: isRtl ? 'خالد عمر منصور' : 'Khaled Omar Mansoor',
      demo: isRtl ? '42 سنة • ذكر' : '42 yrs • Male',
      consent: '27/08/2026',
      visits: isRtl ? 'الزيارة 1 من 3 (خط الأساس)' : 'Visit 1 of 3 (Baseline)',
      scans: '2 STL Files',
      statusKey: 'statusPatActive',
      statusVariant: 'sky',
      statusText: isRtl ? 'متابعة نشطة' : 'Active Follow-Up',
    },
  ];

  const filteredParticipants = participants.filter((p) => {
    if (!patSearch.trim()) return true;
    const q = patSearch.toLowerCase();
    return p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6 sm:space-y-7 font-sans">
      {/* 01. Context Header */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <Link
              to="/researcher/studies"
              className="text-primary dark:text-teal-400 font-semibold hover:underline flex items-center gap-1 text-decoration-none"
            >
              <Icon name="arrow_back" size="sm" className={isRtl ? 'rotate-180' : ''} />
              <span>{t('studyWorkspace.backToStudies')}</span>
            </Link>
            <span className="text-slate-400">•</span>
            <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary dark:text-teal-300 font-mono font-bold">
              {displayId}
            </span>
            <span className="text-slate-400">•</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold uppercase text-[10px]">
              {displayType}
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            {displayTitle}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {isRtl
              ? `جامعة علوم الأسنان • الباحث الرئيسي: ${displayPi} • اعتماد الأخلاقيات: ${displayIrb} • التجربة السريرية: NCT-EXAMPLE-2026`
              : `University of Dental Sciences • Principal Investigator: ${displayPi} • Ethics Approval: ${displayIrb} • Clinical Trial: NCT-EXAMPLE-2026`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Link
            to="/researcher/study/continue"
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-teal-700 transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap text-decoration-none"
          >
            <Icon name="person_add" size="sm" />
            <span>{t('studyWorkspace.btnAddParticipant')}</span>
          </Link>
          <Link
            to="/researcher/statistics"
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap text-decoration-none"
          >
            <Icon name="equalizer" size="sm" />
            <span>{t('studyWorkspace.btnAnalyzeStudy')}</span>
          </Link>
        </div>
      </div>

      {/* 02. Functional Study Workspace Navigation Sub-Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold scrollbar-none pb-px">
          {[
            { id: 'participants', icon: 'group', key: 'tabParticipants' },
            { id: 'protocol', icon: 'description', key: 'tabProtocol' },
            { id: 'schema', icon: 'schema', key: 'tabSchema' },
            { id: 'statistics', icon: 'calculate', key: 'tabStatistics' },
            { id: 'export', icon: 'download', key: 'tabExport' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-primary text-primary dark:text-teal-300 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <Icon name={tab.icon} size="sm" />
              <span>{t(`studyWorkspace.${tab.key}`)}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 03. Workspace Tab Content Panels */}
      <div className="space-y-6">
        {/* TAB PANEL 1: PARTICIPANTS & DATASET */}
        {activeTab === 'participants' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('studyWorkspace.headingParticipants')}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-teal-300 text-xs font-bold">
                  {t('studyWorkspace.activeCountBadge')}
                </span>
              </div>
              <input
                type="text"
                value={patSearch}
                onChange={(e) => setPatSearch(e.target.value)}
                placeholder={t('studyWorkspace.searchPatPlaceholder')}
                className="bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg text-xs outline-none border border-slate-200 dark:border-slate-700 focus:border-primary w-full sm:w-64 text-slate-900 dark:text-white"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3.5 whitespace-nowrap">{t('studyWorkspace.thPatId')}</th>
                    <th className="py-2.5 px-3.5 whitespace-nowrap">{t('studyWorkspace.thPatName')}</th>
                    <th className="py-2.5 px-3.5 whitespace-nowrap">{t('studyWorkspace.thPatDemo')}</th>
                    <th className="py-2.5 px-3.5 whitespace-nowrap">{t('studyWorkspace.thPatConsent')}</th>
                    <th className="py-2.5 px-3.5 whitespace-nowrap">{t('studyWorkspace.thPatVisits')}</th>
                    <th className="py-2.5 px-3.5 whitespace-nowrap">{t('studyWorkspace.thPatScans')}</th>
                    <th className="py-2.5 px-3.5 whitespace-nowrap">{t('studyWorkspace.thPatStatus')}</th>
                    <th className="py-2.5 px-3.5 text-end whitespace-nowrap">{t('studyWorkspace.thPatAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3.5 font-mono font-bold text-primary dark:text-teal-400 whitespace-nowrap">
                        {p.id}
                      </td>
                      <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {p.name}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {p.demo}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-900 dark:text-white whitespace-nowrap">
                        {p.consent}
                      </td>
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {p.visits}
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold text-[11px] border border-purple-500/20 whitespace-nowrap">
                          {p.scans}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${
                            p.statusVariant === 'emerald'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                              : 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              p.statusVariant === 'emerald' ? 'bg-emerald-500' : 'bg-sky-500'
                            } ${isRtl ? 'ml-1.5' : 'mr-1.5'}`}
                          />
                          <span>{p.statusText}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-end whitespace-nowrap">
                        <Link
                          to="/researcher/study/continue"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-teal-700 text-xs font-semibold whitespace-nowrap transition-all shadow-xs text-decoration-none"
                        >
                          <Icon name="visibility" size="sm" className="shrink-0" />
                          <span className="whitespace-nowrap">{t('studyWorkspace.btnOpenRecord')}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB PANEL 2: PROTOCOL & ETHICS */}
        {activeTab === 'protocol' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('studyWorkspace.protocolHeading')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('studyWorkspace.protocolSub')}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                {t('studyWorkspace.irbStatusApproved')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-1.5 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block font-semibold">
                  {t('studyWorkspace.p1Lbl')}
                </span>
                <span className="font-mono font-bold text-primary dark:text-teal-400 text-sm block">
                  {displayIrb}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                  {t('studyWorkspace.p1Val')}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-1.5 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block font-semibold">
                  {t('studyWorkspace.p2Lbl')}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm block">
                  NCT-EXAMPLE-2026
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {t('studyWorkspace.p2Val')}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-1.5 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block font-semibold">
                  {t('studyWorkspace.p3Lbl')}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm block">
                  N = 350 (Power = 0.85)
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {t('studyWorkspace.p3Val')}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {t('studyWorkspace.protocolSummaryTitle')}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('studyWorkspace.protocolSummaryBody')}
              </p>
            </div>
          </div>
        )}

        {/* TAB PANEL 3: DATA COLLECTION SCHEMA */}
        {activeTab === 'schema' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-5">
            <div className="space-y-0.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t('studyWorkspace.schemaHeading')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('studyWorkspace.schemaSub')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary dark:text-teal-300">
                    {isRtl ? '1. وحدة الموافقة المسبقة' : '1. Informed Consent Module'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
                    {isRtl ? 'خانه اختيار موثقة' : 'Verified Checkbox'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {isRtl
                    ? 'طابع زمني لتدقيق الموافقة الإلكترونية، التوقيع الرقمي، والتحقق من الإقرار.'
                    : 'Electronic consent audit timestamp, digital signature, statement verification.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary dark:text-teal-300">
                    {isRtl ? '2. الديموغرافيا والتاريخ الطبي' : '2. Demographics & History'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
                    {isRtl ? '10 عناصر مخاطر PDF' : '10 PDF Risk Items'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {isRtl
                    ? 'العمر، الجنس، التواصل، المهنة، عوامل الخطر الطبية (السكري، التدخين، أمراض القلب).'
                    : 'Age, gender, contact, occupation, medical risk factors (Diabetes, Smoking, Cardiovascular).'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary dark:text-teal-300">
                    {isRtl ? '3. الفحص السريري ومخطط الأسنان' : '3. Clinical Exam & Dental Chart'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
                    {isRtl ? 'شبكة FDI لـ 32 سناً' : 'FDI 32 Teeth Grid'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {isRtl
                    ? 'شبكة فحص الأسنان الشاملة معيار FDI (سليم، تسوس، حشوة، مفقود، تاج).'
                    : 'Comprehensive FDI tooth status grid (Sound, Caries, Filled, Missing, Crown).'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary dark:text-teal-300">
                    {isRtl ? '4. اللثة والإطباق' : '4. Periodontal & Occlusal'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
                    {isRtl ? 'سبر 6 نقاط ملم' : '6-Point Probing mm'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {isRtl
                    ? 'عمق السبر (ملم)، النزف عند السبر (BOP %)، مؤشر اللويحة (%)، درجات الحركة.'
                    : 'Probing depth (mm), Bleeding on Probing (BOP %), Plaque Index (%), Mobility grade.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB PANEL 4: STATISTICAL ENGINE */}
        {activeTab === 'statistics' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('studyWorkspace.statsHeading')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('studyWorkspace.statsSub')}
                </p>
              </div>
              <Link
                to="/researcher/statistics"
                className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-teal-700 transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap text-decoration-none shrink-0"
              >
                <Icon name="play_arrow" size="sm" />
                <span>{t('studyWorkspace.btnOpenFullEngine')}</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-2 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isRtl ? 'اختبار t الزوجي' : 'Paired t-Test'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
                    {isRtl ? 'جاهز' : 'Ready'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {isRtl
                    ? 'مقارنة عمق السبر قبل وبعد التدخل العلاجي (p < 0.001).'
                    : 'Pre- and post-intervention probing depth comparison (p < 0.001).'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-2 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isRtl ? 'تحليل التباين الأحادي' : 'One-Way ANOVA'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-[10px]">
                    {isRtl ? 'جاهز' : 'Ready'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {isRtl
                    ? 'تباين فقدان العظم عبر 3 مجموعات معالجة لسطح الزرعات.'
                    : 'Bone loss variance across 3 implant surface treatment cohorts.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-2 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isRtl ? 'تحليل البقاء' : 'Kaplan-Meier Survival'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300 font-mono text-[10px]">
                    {isRtl ? 'قيد الإجراء' : 'In Progress'}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {isRtl
                    ? 'حساب منحنى بقاء الزرعات على مدى 5 سنوات.'
                    : '5-year implant survival curve computation.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB PANEL 5: EXPORT & PUBLICATION */}
        {activeTab === 'export' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('studyWorkspace.exportHeading')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('studyWorkspace.exportSub')}
                </p>
              </div>
              <Link
                to="/researcher/statistics"
                className="px-4 py-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-teal-700 transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap text-decoration-none shrink-0"
              >
                <Icon name="download" size="sm" />
                <span>{t('studyWorkspace.btnOpenExportSuite')}</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-2 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {isRtl
                    ? 'جدول APA 7th رقم 1: الخصائص الديموغرافية الأساسية'
                    : 'APA 7th Table 1: Baseline Demographics'}
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isRtl
                    ? 'جدول ملخص منسق مع المتوسط (الانحراف المعياري) والنسب التكرارية.'
                    : 'Formatted summary table with M (SD) and frequency percentages.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-2 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {isRtl ? 'مجموعة البيانات الخام (.CSV / .SPSS)' : 'Raw Dataset (.CSV / .SPSS)'}
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isRtl
                    ? 'قياسات الدراسة والزيارات التتبعية بعد إزالة الهوية السريرية.'
                    : 'Complete de-identified trial measurements and longitudinal visits.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 space-y-2 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {isRtl ? 'تقرير الأبحاث السريرية (.PDF)' : 'Clinical Research Report (.PDF)'}
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isRtl
                    ? 'تقرير رسمي تجميعي مجمع من سجلات المشاركون المعتمدين.'
                    : 'Authoritative study report compiled from approved participant records.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyWorkspacePage;
