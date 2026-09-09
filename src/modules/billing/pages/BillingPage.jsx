import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const BillingPage = () => {
  const { isRtl } = useI18n();
  const navigate = useNavigate();

  // Exact 9 Commercial Services Catalog
  const studyServices = [
    {
      id: 'rct',
      code: 'SPIRIT 2025',
      badgeClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      icon: 'clinical_notes',
      iconClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      borderClass: 'border-2 border-teal-500',
      accentColor: 'text-teal-600 dark:text-teal-400',
      buttonBg: 'bg-teal-600 hover:bg-teal-700 text-white',
      checkColor: 'text-teal-500',
      category: isRtl ? 'تجربة سريرية تجريبية' : 'EXPERIMENTAL TRIAL',
      title: isRtl ? 'التجربة العشوائية المحكمة (RCT)' : 'Randomized Controlled Trial (RCT)',
      price: '$125',
      unit: isRtl ? '/ دراسة' : '/ study',
      description: isRtl
        ? 'بروتوكول التجربة السريرية الكامل، خطة العشوائية المعماة، وإعدادات تحليل النية بالمعالجة مقارنة بمجموعة الشواهد.'
        : 'Experimental trial protocol comparing randomized intervention vs. control arms with blind outcome evaluation.',
      features: [
        isRtl ? 'العشوائية بالكتل المترتبة' : 'Permuted Block Randomization',
        isRtl ? 'الترميز والتعمية المزدوجة / الثلاثية' : 'Double / Triple-Blind Coding',
        isRtl ? 'تحليل ITT وجدول SPIRIT الزمني' : 'ITT Analysis & SPIRIT Schedule',
      ],
      cta: isRtl ? 'إنشاء تجربة عشوائية محكمة' : 'Create RCT Study',
      route: '/researcher/studies/create/rct',
    },
    {
      id: 'retrospective',
      code: 'RECORD & STROBE',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      icon: 'history',
      iconClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      borderClass: 'border-2 border-amber-500/40',
      accentColor: 'text-amber-600 dark:text-amber-400',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      checkColor: 'text-amber-500',
      category: isRtl ? 'دراسة أرشيفية' : 'ARCHIVAL COHORT',
      title: isRtl ? 'الدراسة الاستعادية الأرشيفية' : 'Retrospective Study',
      price: '$65',
      unit: isRtl ? '/ دراسة' : '/ study',
      description: isRtl
        ? 'استخراج وتحليل السجلات السريرية التاريخية (.xlsx, .csv, .sav) مع قاموس المصطلحات وتجهيل التحديد.'
        : 'Extraction and analysis of pre-existing historical datasets (.xlsx, .csv, .sav) with dictionary mapping.',
      features: [
        isRtl ? 'استيراد السجلات (.xlsx, .csv, .sav)' : 'Dataset Ingestion (.xlsx, .csv, .sav)',
        isRtl ? 'تجهيل هوية المصدر والبيانات' : 'Source ID De-identification',
        isRtl ? 'فاحص التكرار وسجل الأهلية' : 'Duplicate Scanner & Eligibility Log',
      ],
      cta: isRtl ? 'إنشاء دراسة استعادية' : 'Create Retrospective Study',
      route: '/researcher/studies/create/retrospective',
    },
    {
      id: 'prospective',
      code: 'STROBE Cohort',
      badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      icon: 'groups',
      iconClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      borderClass: 'border-2 border-indigo-500/40',
      accentColor: 'text-indigo-600 dark:text-indigo-400',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      checkColor: 'text-indigo-500',
      category: isRtl ? 'دراسة ملاحظاتية' : 'OBSERVATIONAL TRIAL',
      title: isRtl ? 'الدراسة المستقبلية الملاحظاتية' : 'Prospective Cohort Study',
      price: '$85',
      unit: isRtl ? '/ دراسة' : '/ study',
      description: isRtl
        ? 'متابعة طولية لعينات المرضى عبر الزمن من زيارة الأساس (T0) وحتى زيارات المتابعة (T1..Tn).'
        : 'Longitudinal tracking of patient cohorts forward in time across baseline (T0) and follow-up visits (T1..Tn).',
      features: [
        isRtl ? 'زيارة الأساس (T0) والمتابعة (T1..Tn)' : 'Baseline (T0) & Follow-up (T1..Tn)',
        isRtl ? 'جدولة المواعيد المستهدفة' : 'Target Window Scheduling',
        isRtl ? 'حساب معدل السقوط والإصابة' : 'Incidence Rate Calculation',
      ],
      cta: isRtl ? 'إنشاء دراسة مستقبلية' : 'Create Prospective Study',
      route: '/researcher/studies/create/prospective',
    },
    {
      id: 'cross_sectional',
      code: 'STROBE & AXIS',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      icon: 'pie_chart',
      iconClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      borderClass: 'border-2 border-emerald-500/40',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      checkColor: 'text-emerald-500',
      category: isRtl ? 'دراسة مسحية ومقطعية' : 'SURVEY & PREVALENCE',
      title: isRtl ? 'الدراسة المسحية المقطعية' : 'Cross-Sectional Study',
      price: '$35',
      unit: isRtl ? '/ دراسة' : '/ study',
      description: isRtl
        ? 'تقييم مسحي في نقطة زمنية واحدة مع منشئ استبيانات تفاعلي ومقاييس سريرية معتمدة.'
        : 'Single point-in-time survey assessment with interactive Questionnaire Builder and validated instruments.',
      features: [
        isRtl ? 'المقاييس المعتمدة (OHIP, GOHAI)' : 'Validated Scales (OHIP, GOHAI)',
        isRtl ? 'معامل ثبات كرونباخ ألفا (α ≥ 0.70)' : "Cronbach's Alpha (α ≥ 0.70)",
        isRtl ? 'مركز توزيع الروابط ورموز QR' : 'Multi-Channel Link & QR Hub',
      ],
      cta: isRtl ? 'إنشاء دراسة مسحية' : 'Create Cross-Sectional Study',
      route: '/researcher/studies/create/cross-sectional',
    },
  ];

  const sampleSizeServices = [
    {
      id: 'basic_sample_size',
      category: isRtl ? 'تحليل القوة الإحصائية' : 'POWER ANALYSIS',
      title: isRtl ? 'حساب حجم العينة الأساسي' : 'Basic Sample Size Calculation',
      price: '$20',
      unit: isRtl ? '/ حساب' : '/ calculation',
      description: isRtl
        ? 'تقدير القوة القياسي لمقارنة متوسطين أو نسبتين مع تعديل معدل الفقد 15%.'
        : 'Standard 2-Means or 2-Proportions power estimation with 15% dropout rate adjustment.',
      cta: isRtl ? 'فتح حاسبة حجم العينة' : 'Open Calculator',
      route: '/researcher/sample-size',
    },
    {
      id: 'advanced_sample_size',
      category: isRtl ? 'تحليل القوة الإحصائية' : 'POWER ANALYSIS',
      title: isRtl ? 'حساب حجم العينة المتقدم' : 'Advanced Sample Size Calculation',
      price: '$35',
      unit: isRtl ? '/ حساب' : '/ calculation',
      description: isRtl
        ? 'تقرير مبررات حجم العينة لاختبارات ANOVA أحادي الاتجاه وكاي تربيع والتجارب متعددة المجموعات.'
        : 'One-Way ANOVA, Chi-Square, and multi-arm trial sample size justification report.',
      cta: isRtl ? 'فتح حاسبة حجم العينة' : 'Open Calculator',
      route: '/researcher/sample-size',
    },
  ];

  const statAnalysisServices = [
    {
      id: 'basic_stat_analysis',
      category: isRtl ? 'المحرك الوصفي' : 'DESCRIPTIVE ENGINE',
      title: isRtl ? 'التحليل الإحصائي الوصفي الأساسي' : 'Basic Statistical Analysis',
      price: '$50',
      unit: isRtl ? '/ تحليل' : '/ analysis',
      description: isRtl
        ? 'الإحصاء الوصفي، اختبار التوزيع الطبيعي (Shapiro-Wilk)، وتوليد جدول الوصف الأول.'
        : 'Descriptive statistics, Shapiro-Wilk normality testing, and Table 1 baseline generation.',
      cta: isRtl ? 'فتح المحرك الإحصائي' : 'Open Statistical Engine',
      route: '/researcher/statistics',
    },
    {
      id: 'inferential_stat_analysis',
      category: isRtl ? 'اختبار الفروض' : 'HYPOTHESIS TESTING',
      title: isRtl ? 'التحليل الإحصائي الاستدلالي' : 'Inferential Statistical Analysis',
      price: '$80',
      unit: isRtl ? '/ تحليل' : '/ analysis',
      description: isRtl
        ? 'الاختبارات المعلمية (t-test, ANOVA) واللامعلمية (Mann-Whitney, Kruskal-Wallis).'
        : 'Parametric (t-test, ANOVA) and non-parametric (Mann-Whitney, Kruskal-Wallis) tests.',
      cta: isRtl ? 'فتح المحرك الإحصائي' : 'Open Statistical Engine',
      route: '/researcher/statistics',
    },
    {
      id: 'advanced_stat_analysis',
      category: isRtl ? 'المحرك المتقدم' : 'MULTIVARIATE ENGINE',
      title: isRtl ? 'التحليل الإحصائي المتقدم' : 'Advanced Statistical Analysis',
      price: '$130',
      unit: isRtl ? '/ تحليل' : '/ analysis',
      description: isRtl
        ? 'الانحدار اللوجستي والخطاطي متعدد المتغيرات، منحنيات بقاء كابلان-ماير، وتصدير SPSS.'
        : 'Multivariate logistic/linear regression, Kaplan-Meier survival curves, and SPSS exports.',
      cta: isRtl ? 'فتح المحرك الإحصائي' : 'Open Statistical Engine',
      route: '/researcher/statistics',
    },
  ];

  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-8 font-sans antialiased text-slate-900 dark:text-white" id="billing-root">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary dark:text-teal-400 uppercase tracking-wider">
          <Icon name="payments" size="sm" />
          <span>
            {isRtl ? 'كتالوج الخدمات والتعرفات — OSKAR MedStat' : 'OSKAR Commercial Catalog & Service Pricing'}
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isRtl ? 'التعرفات والكتالوج البحثي' : 'Research Services & Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl mt-1 leading-relaxed">
              {isRtl
                ? 'استكشف بروتوكولات الدراسات السريرية المعتمدة، حاسبة حجم العينة والقوة الإحصائية، وخدمات المحرك الإحصائي السريري.'
                : 'Explore approved study protocols, biostatistical power calculators, and clinical statistical engine services.'}
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Reassurance Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs min-w-0">
        <div className="flex items-center gap-3 p-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:text-teal-400 flex items-center justify-center shrink-0">
            <Icon name="account_tree" size="sm" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">{isRtl ? 'مسارات بحثية مهيكلة' : 'Structured Workflows'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{isRtl ? 'معايير ICH E9 و SPIRIT' : 'ICH E9 & SPIRIT compliant'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:text-teal-400 flex items-center justify-center shrink-0">
            <Icon name="verified_user" size="sm" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">{isRtl ? 'تحكم كامل ومراجعة للباحث' : 'Researcher Control'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{isRtl ? 'إشراف ومصادقة مستمرة' : 'Continuous review & sign-off'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:text-teal-400 flex items-center justify-center shrink-0">
            <Icon name="assignment" size="sm" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">{isRtl ? 'جمع بيانات مخصص' : 'Methodology Forms'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{isRtl ? 'نماذج eCRF واستبيانات' : 'eCRF & survey instruments'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:text-teal-400 flex items-center justify-center shrink-0">
            <Icon name="analytics" size="sm" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block truncate">{isRtl ? 'معالجة إحصائية حيوية' : 'Biostatistical Engine'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{isRtl ? 'تصدير SPSS و Excel جاهز' : 'SPSS & Excel export ready'}</span>
          </div>
        </div>
      </div>

      {/* SECTION A: Study Protocol Services */}
      <div className="space-y-4 min-w-0">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 min-w-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icon name="science" size="md" className="text-primary dark:text-teal-400 shrink-0" />
            <h2 className="text-lg font-bold">
              {isRtl ? '1. خدمات بروتوكولات الدراسات السريرية' : '1. Clinical Study Protocol Services'}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-primary dark:text-teal-400">$35 - $125 {isRtl ? '/ لكل دراسة' : '/ study'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 min-w-0">
          {studyServices.map((s) => (
            <div
              key={s.id}
              className={`bg-white dark:bg-slate-900 ${s.borderClass} rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full min-w-0`}
            >
              <div className="space-y-4 min-w-0">
                <div className="flex items-center justify-between min-w-0">
                  <span className={`px-2.5 py-1 rounded-full ${s.badgeClass} font-mono text-[10px] font-bold truncate`}>
                    {s.code}
                  </span>
                  <div className={`w-9 h-9 rounded-xl ${s.iconClass} flex items-center justify-center shrink-0`}>
                    <Icon name={s.icon} size="sm" />
                  </div>
                </div>

                <div className="min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${s.accentColor} block mb-1 truncate`}>
                    {s.category}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {s.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {s.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {s.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 min-w-0">
                      <Icon name="check_circle" size="sm" className={`${s.checkColor} shrink-0`} />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 min-w-0">
                <div className="shrink-0">
                  <span className={`text-xl sm:text-2xl font-black font-mono ${s.accentColor}`}>{s.price}</span>
                  <span className="text-[10px] text-slate-400 font-semibold block">{s.unit}</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(s.route)}
                  className={`w-full sm:w-auto px-3.5 py-2 ${s.buttonBg} rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer text-center justify-center`}
                >
                  {s.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION B: Statistical & Sample Size Services */}
      <div className="space-y-6 pt-4 min-w-0">
        {/* Subsection 1: Sample Size */}
        <div className="space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 min-w-0 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Icon name="calculate" size="md" className="text-primary dark:text-teal-400 shrink-0" />
              <h2 className="text-lg font-bold">
                {isRtl ? '2. خدمات حساب حجم العينة والقوة الإحصائية' : '2. Sample Size Calculation Services'}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-primary dark:text-teal-400">$20 - $35 {isRtl ? '/ لكل حساب' : '/ calculation'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0">
            {sampleSizeServices.map((ss) => (
              <div key={ss.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-w-0">
                <div className="space-y-2 min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase text-primary dark:text-teal-400 block truncate">
                    {ss.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {ss.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ss.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 min-w-0">
                  <div className="shrink-0">
                    <span className="text-xl sm:text-2xl font-black text-primary dark:text-teal-300 font-mono">{ss.price}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">{ss.unit}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(ss.route)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-teal-700 transition-all shadow-xs cursor-pointer text-center justify-center"
                  >
                    {ss.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subsection 2: Statistical Engine */}
        <div className="space-y-4 pt-2 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 min-w-0 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Icon name="analytics" size="md" className="text-primary dark:text-teal-400 shrink-0" />
              <h2 className="text-lg font-bold">
                {isRtl ? '3. خدمات التحليل الإحصائي السريري' : '3. Biostatistical Analysis Services'}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-primary dark:text-teal-400">$50 - $130 {isRtl ? '/ لكل تحليل' : '/ analysis'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
            {statAnalysisServices.map((st) => (
              <div key={st.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-w-0">
                <div className="space-y-2 min-w-0">
                  <span className="text-[10px] font-mono font-bold uppercase text-primary dark:text-teal-400 block truncate">
                    {st.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 min-w-0">
                  <div className="shrink-0">
                    <span className="text-xl sm:text-2xl font-black text-primary dark:text-teal-300 font-mono">{st.price}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">{st.unit}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(st.route)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-teal-700 transition-all shadow-xs cursor-pointer text-center justify-center"
                  >
                    {st.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Useful Information Section: How OSKAR Services Work */}
      <div className="bg-slate-50 dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 space-y-6 min-w-0">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono font-bold uppercase text-primary dark:text-teal-400 tracking-wider">
            {isRtl ? 'دليل تنفيذ الخدمات' : 'SERVICE WORKFLOW GUIDE'}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isRtl ? 'كيف تعمل خدمات منصة OSKAR' : 'How OSKAR Services Work'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {isRtl ? 'خطوات مبسطة لبدء وإنجاز متطلبات البحث السريري بمرونة واحترافية.' : 'Streamlined steps to initiate and complete clinical research requirements.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 min-w-0">
            <span className="text-xs font-mono font-black text-primary dark:text-teal-400 block">01</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{isRtl ? 'اختيار الخدمة' : 'Choose a Service'}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isRtl ? 'حدد نوع الدراسة أو الخدمة الإحصائية المناسبة لبروتوكولك البحثي.' : 'Select the appropriate study design or biostatistical service module.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 min-w-0">
            <span className="text-xs font-mono font-black text-primary dark:text-teal-400 block">02</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{isRtl ? 'تحديد الاشتراطات' : 'Configure Requirements'}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isRtl ? 'قم بإدخال المتغيرات، خطة العينة، ونماذج الجمع المطلوبة.' : 'Input clinical variables, sample parameters, and eCRF forms.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 min-w-0">
            <span className="text-xs font-mono font-black text-primary dark:text-teal-400 block">03</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{isRtl ? 'مراجعة النتائج' : 'Review & Verify'}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isRtl ? 'راجع المبررات العلمية والإحصائية وصادق على صحة الإعدادات.' : 'Examine scientific rationale, power curves, and validated output.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 min-w-0">
            <span className="text-xs font-mono font-black text-primary dark:text-teal-400 block">04</span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{isRtl ? 'تنفيذ مسار العمل' : 'Proceed with Workflow'}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isRtl ? 'انطلق في إدارة الدراسة وتصدير ملفات SPSS و Excel بكل يسر.' : 'Execute clinical data collection and export SPSS & Excel packages.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
