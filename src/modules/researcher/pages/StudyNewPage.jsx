import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const StudyNewPage = () => {
  const { isRtl } = useI18n();

  const content = {
    ar: {
      portalHeaderBadge: 'بوابة اختيار منهجية البحث الطبي — OSKAR',
      portalTitle: 'إنشاء دراسة جديدة أو متابعة دراسة قائمة',
      portalSubtitle: 'اختر بين بدء بروتوكول بحثي جديد من الصفر أو متابعة واستيراد بيانات نموذج فحص لدراسة قائمة.',
      modeATitle: 'الخيار الأول: إنشاء دراسة سريرية جديدة',
      modeADesc: 'اختر أحد قوالب المنهجية السريرية أدناه لبدء سير العمل الموحد لبناء البروتوكول من الصفر.',
      modeBTitle: 'الخيار الثاني: متابعة واستيراد دراسة قائمة',
      modeBDesc: 'قم باستيراد نموذج فحص أو بروتوكول دراسة جارية لاستخراج المتغيرات وبناء الاستمارة الإلكترونية.',
      modeBBtn: 'متابعة دراسة قائمة',
      cStatusActive: 'مسار نشط',

      c1Title: 'التجربة العشوائية المحكمة',
      c1Std: 'معايير SPIRIT 2025 & CONSORT 2025',
      c1Desc: 'تصميم سريري تجريبي يقارن بين مجموعات التدخل والمراقبة العشوائية مع التقييم المعمى وتقييم الحجب وتحليل النية بالمعالجة.',
      c1B1: 'العشوائية بكتل متغيرة وطبقات سريرية',
      c1B2: 'التعمية المزدوجة/الثلاثية وفك الترميز الطارئ',
      c1B3: 'جدول SPIRIT ومخطط الزيارات الطولية',
      c1Btn: 'بدء مسار بروتوكول RCT',

      c2Title: 'الدراسة المستقبلية الملاحظاتية',
      c2Std: 'معايير STROBE Cohort',
      c2Desc: 'متابعة طولية لعينات المرضى عبر الزمن من زيارة الأساس (T0) وحتى زيارات المتابعة (T1..Tn) بدون تعيين اختباري إجباري.',
      c2B1: 'زيارة الأساس (T0) وجدول الزيارات الطولية (T1..Tn)',
      c2B2: 'جدولة وحدات CRF وسماحيات النوافذ الزمانية',
      c2B3: 'العشوائية والتعمية الشرطية (معطلة افتراضياً)',
      c2Btn: 'بدء مسار الدراسة المستقبلية',

      c3Title: 'الدراسة الاستعادية الأرشيفية',
      c3Std: 'معايير RECORD & STROBE',
      c3Desc: 'استخراج وتحليل قواعد البيانات والأرشيفات التاريخية (.xlsx, .csv, .sav) مع التعديل الآلي للمتغيرات وفحص التكرارات.',
      c3B1: 'استيراد قواعد البيانات التاريخية (.xlsx, .csv, .sav)',
      c3B2: 'مطابقة الأعمدة بالذكاء الاصطناعي مع الاعتماد البشري',
      c3B3: 'فحص التكرارات والتجهيل المعياري وسجل الاستبعاد',
      c3Btn: 'بدء مسار الدراسة الاستعادية',

      c4Title: 'الدراسة المقطعية',
      c4Std: 'معايير STROBE & AXIS',
      c4Desc: 'تقييم مسحي في نقطة زمنية واحدة مع منشئ الاستبيانات السريرية، المقاييس المعتمدة، وااختبار ثبات كرونباخ ألفا (α ≥ 0.70).',
      c4B1: 'منشئ الاستبيانات والمقاييس المعيارية المعتمدة',
      c4B2: 'اختبار ثبات كرونباخ ألفا (α ≥ 0.70)',
      c4B3: 'مركز التوزيع عبر الرابط، QR والبريد الإلكتروني',
      c4Btn: 'بدء مسار المسح المقطعي',
    },
    en: {
      portalHeaderBadge: 'OSKAR Study Methodology Selection Portal',
      portalTitle: 'Create or Continue Study',
      portalSubtitle: 'Select whether to initiate a new research protocol or continue ingesting an existing ongoing study.',
      modeATitle: 'Mode A: Create a New Study',
      modeADesc: 'Select a clinical methodology below to launch a standardized protocol workflow from scratch.',
      modeBTitle: 'Mode B: Continue an Existing Study',
      modeBDesc: 'Ingest ongoing study data & upload existing examination forms for AI schema extraction.',
      modeBBtn: 'Continue Study',
      cStatusActive: 'Active Workflow',

      c1Title: 'Randomized Controlled Trial (RCT)',
      c1Std: 'SPIRIT 2025 & CONSORT 2025 Standard',
      c1Desc: 'Experimental clinical trial design comparing randomized intervention vs. control arms with blind outcome evaluation, allocation concealment, and ITT analysis strategies.',
      c1B1: 'Permuted Block & Stratified Randomization',
      c1B2: 'Double-Blind / Triple-Blind & Emergency Code-break',
      c1B3: 'SPIRIT Schedule & Longitudinal Visit Schema',
      c1Btn: 'Launch RCT Protocol Workflow',

      c2Title: 'Prospective Observational Cohort',
      c2Std: 'STROBE Cohort Standard',
      c2Desc: 'Longitudinal tracking of patient cohorts forward in time across baseline (T0) and follow-up visits (T1..Tn) without mandatory treatment assignment.',
      c2B1: 'Baseline (T0) & Longitudinal Visit Schedule (T1..Tn)',
      c2B2: 'Visit-Based CRF Scheduling & Target Windows',
      c2B3: 'Conditional Randomization & Blinding (Disabled by default)',
      c2Btn: 'Launch Prospective Workflow',

      c3Title: 'Retrospective Archival Cohort',
      c3Std: 'RECORD & STROBE Standard',
      c3Desc: 'Extraction and analysis of pre-existing historical datasets (.xlsx, .csv, .sav) with AI dictionary mapping, duplicate detection, and eligibility logs.',
      c3B1: 'Historical Dataset Ingestion (.xlsx, .csv, .sav)',
      c3B2: 'AI Column Mapping & Human Verification Workspace',
      c3B3: 'Duplicate Scanner, Re-ID (RET-xxxx) & Exclusion Log',
      c3Btn: 'Launch Retrospective Workflow',

      c4Title: 'Cross-Sectional Survey',
      c4Std: 'STROBE & AXIS Standard',
      c4Desc: "Single point-in-time survey assessment with interactive Questionnaire Builder, validated instruments (OHIP, GOHAI), Cronbach's Alpha (α ≥ 0.70), and QR/Link distribution.",
      c4B1: 'Questionnaire Builder & Validated Instruments (OHIP/GOHAI)',
      c4B2: "Cronbach's Alpha Reliability Check (α ≥ 0.70)",
      c4B3: 'Multi-Channel Link, QR Code & Email Distribution Hub',
      c4Btn: 'Launch Cross-Sectional Workflow',
    },
  };

  const t = isRtl ? content.ar : content.en;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-on-surface dark:text-gray-100 font-sans antialiased" id="study-selection-portal">
      {/* Page Header */}
      <div className="border-b border-surface-container-high dark:border-gray-700/60 pb-6 space-y-4">
        <div className="flex items-center gap-2 text-xs text-primary dark:text-teal-400 font-semibold uppercase tracking-wider">
          <Icon name="schema" size="sm" />
          <span id="portal-header-badge">{t.portalHeaderBadge}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 id="portal-title" className="text-2xl sm:text-3xl font-bold text-on-surface dark:text-white tracking-tight">
              {t.portalTitle}
            </h1>
            <p id="portal-subtitle" className="text-sm text-on-surface-variant dark:text-gray-300 max-w-2xl mt-1">
              {t.portalSubtitle}
            </p>
          </div>
        </div>

        {/* Dual Mode Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Mode A Banner */}
          <div className="p-4 rounded-xl bg-primary/5 dark:bg-teal-900/20 border border-primary/30 dark:border-teal-500/30 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 mt-0.5">
              <Icon name="add_circle" size="md" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-primary dark:text-teal-300">{t.modeATitle}</h3>
              <p className="text-xs text-on-surface-variant dark:text-gray-300 leading-relaxed">{t.modeADesc}</p>
            </div>
          </div>

          {/* Mode B Banner / Continue Action */}
          <div className="p-4 rounded-xl bg-surface-container-low dark:bg-dark-card border border-teal-500/40 dark:border-teal-400/40 shadow-xs flex items-center justify-between gap-3 group hover:border-primary transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="history_edu" size="md" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-on-surface dark:text-white">{t.modeBTitle}</h3>
                <p className="text-xs text-on-surface-variant dark:text-gray-300 leading-relaxed">{t.modeBDesc}</p>
              </div>
            </div>
            <Link
              to="/researcher/study/continue"
              className="px-3.5 py-2.5 rounded-lg bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-sm text-decoration-none"
            >
              <span>{t.modeBBtn}</span>
              <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </div>

      {/* Methodology Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="portal-grid">
        {/* Card 1: RCT */}
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border-2 border-primary dark:border-teal-400 shadow-md space-y-4 flex flex-col justify-between group hover:shadow-lg transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-teal-300 flex items-center justify-center">
                  <Icon name="clinical_notes" size="md" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-primary dark:text-teal-300">{t.c1Title}</h2>
                  <span className="text-[10px] font-mono font-bold text-primary/80 dark:text-teal-400 uppercase tracking-wider block">
                    {t.c1Std}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold whitespace-nowrap">
                {t.cStatusActive}
              </span>
            </div>
            <p className="text-xs text-on-surface dark:text-gray-200 leading-relaxed">{t.c1Desc}</p>
            <div className="pt-2 border-t border-surface-container dark:border-gray-700/60 text-[11px] space-y-1.5 text-on-surface-variant dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-emerald-600 dark:text-emerald-400" />
                <span>{t.c1B1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-emerald-600 dark:text-emerald-400" />
                <span>{t.c1B2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-emerald-600 dark:text-emerald-400" />
                <span>{t.c1B3}</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-surface-container dark:border-gray-700">
            <Link
              to="/researcher/studies/create/rct"
              className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs hover:bg-teal-700 transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap text-decoration-none cursor-pointer"
            >
              <span>{t.c1Btn}</span>
              <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>

        {/* Card 2: Prospective Cohort */}
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-indigo-500/30 dark:border-indigo-400/30 shadow-sm space-y-4 flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Icon name="groups" size="md" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-indigo-700 dark:text-indigo-300">{t.c2Title}</h2>
                  <span className="text-[10px] font-mono font-bold text-indigo-600/80 dark:text-indigo-400 uppercase tracking-wider block">
                    {t.c2Std}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold whitespace-nowrap">
                {t.cStatusActive}
              </span>
            </div>
            <p className="text-xs text-on-surface dark:text-gray-200 leading-relaxed">{t.c2Desc}</p>
            <div className="pt-2 border-t border-surface-container dark:border-gray-700/60 text-[11px] space-y-1.5 text-on-surface-variant dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-indigo-600 dark:text-indigo-400" />
                <span>{t.c2B1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-indigo-600 dark:text-indigo-400" />
                <span>{t.c2B2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-indigo-600 dark:text-indigo-400" />
                <span>{t.c2B3}</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-surface-container dark:border-gray-700">
            <Link
              to="/researcher/studies/create/prospective"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap text-decoration-none cursor-pointer"
            >
              <span>{t.c2Btn}</span>
              <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>

        {/* Card 3: Retrospective Cohort */}
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-amber-500/30 dark:border-amber-400/30 shadow-sm space-y-4 flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Icon name="history" size="md" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-amber-700 dark:text-amber-300">{t.c3Title}</h2>
                  <span className="text-[10px] font-mono font-bold text-amber-600/80 dark:text-amber-400 uppercase tracking-wider block">
                    {t.c3Std}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold whitespace-nowrap">
                {t.cStatusActive}
              </span>
            </div>
            <p className="text-xs text-on-surface dark:text-gray-200 leading-relaxed">{t.c3Desc}</p>
            <div className="pt-2 border-t border-surface-container dark:border-gray-700/60 text-[11px] space-y-1.5 text-on-surface-variant dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-amber-600 dark:text-amber-400" />
                <span>{t.c3B1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-amber-600 dark:text-amber-400" />
                <span>{t.c3B2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-amber-600 dark:text-amber-400" />
                <span>{t.c3B3}</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-surface-container dark:border-gray-700">
            <Link
              to="/researcher/studies/create/retrospective"
              className="w-full py-3 px-4 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap text-decoration-none cursor-pointer"
            >
              <span>{t.c3Btn}</span>
              <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>

        {/* Card 4: Cross-Sectional Survey */}
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-emerald-500/30 dark:border-emerald-400/30 shadow-sm space-y-4 flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Icon name="pie_chart" size="md" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-emerald-700 dark:text-emerald-300">{t.c4Title}</h2>
                  <span className="text-[10px] font-mono font-bold text-emerald-600/80 dark:text-emerald-400 uppercase tracking-wider block">
                    {t.c4Std}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold whitespace-nowrap">
                {t.cStatusActive}
              </span>
            </div>
            <p className="text-xs text-on-surface dark:text-gray-200 leading-relaxed">{t.c4Desc}</p>
            <div className="pt-2 border-t border-surface-container dark:border-gray-700/60 text-[11px] space-y-1.5 text-on-surface-variant dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-emerald-600 dark:text-emerald-400" />
                <span>{t.c4B1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-emerald-600 dark:text-emerald-400" />
                <span>{t.c4B2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check_circle" size="sm" className="text-emerald-600 dark:text-emerald-400" />
                <span>{t.c4B3}</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-surface-container dark:border-gray-700">
            <Link
              to="/researcher/studies/create/cross-sectional"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap text-decoration-none cursor-pointer"
            >
              <span>{t.c4Btn}</span>
              <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyNewPage;
