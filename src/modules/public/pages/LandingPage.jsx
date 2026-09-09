import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const LandingPage = () => {
  const { isRtl } = useI18n();

  return (
    <div className="w-full space-y-12 pb-16 font-sans">
      {/* Section 1: Hero & Capabilities (#capabilities) */}
      <section id="capabilities" className="pt-12 md:pt-20 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Hero Left Column */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2.5 text-primary bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest">
                {isRtl ? 'نظام oskar للبحوث الطبية والإحصاء' : 'oskar medstat research system'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {isRtl
                ? 'بمجرد اعتماد البروتوكول البحثي، تبدأ رحلة التنفيذ.'
                : 'Once the protocol is approved, the work begins.'}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {isRtl
                ? 'بيئة عمل تشغيلية متكاملة تنطلق فور الموافقة الأكاديمية على مقترح البحث والبروتوكول، لتوجيه جمع البيانات والإحصاء الطبي بدقة متناهية.'
                : 'An operational workspace that begins after your research proposal and protocol are approved, then seamlessly guides study execution, data collection, and statistical analysis.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/login"
                className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-md flex items-center gap-2 group text-decoration-none"
              >
                <span>{isRtl ? 'ابدأ بحثك الآن' : 'Start your research'}</span>
                <Icon
                  name="arrow_forward"
                  size="md"
                  className={`transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                />
              </Link>
              
              <a
                href="#services"
                className="px-8 py-4 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-decoration-none"
              >
                <span>{isRtl ? 'استكشف الخدمات والباقات' : 'Explore Services & Rates'}</span>
                <Icon name="south" size="md" />
              </a>
            </div>
          </div>

          {/* Hero Right Image Card (Canonical HeroDentalLab Asset) */}
          <div className="relative rounded-2xl overflow-hidden h-[420px] md:h-[520px] border border-slate-200 dark:border-slate-800 shadow-xl group">
            <img 
              src="/assets/logo/HeroDentalLab.png" 
              alt="Modern medical & dental workstation" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 max-w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-md mb-3 inline-block">
                {isRtl ? 'ملاحظات ميدانية / 01' : 'FIELD NOTES / 01'}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold leading-snug">
                {isRtl ? 'تتحول الإشارات السريرية إلى ركائز علمية.' : 'Clinical signals transform into scientific pillars.'}
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-md">
                {isRtl ? 'مسارات إحصائية دقيقة مصممة خصيصاً للتجارب والدراسات الطبية.' : 'Rigorous statistical pathways tailored for medical trials.'}
              </p>
            </div>

            <div className={`absolute top-6 ${isRtl ? 'right-6' : 'left-6'} bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-lg`}>
              <Icon name="insights" size="lg" className="text-primary" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'وضوح سريري' : 'Clinical Clarity'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isRtl ? 'نزاهة وجودة البيانات' : 'Structured Data Validation'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 01 / Approval Gate Banner */}
        <div className="mt-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">
                {isRtl ? '01 / بوابة الاعتماد' : '01 / APPROVAL GATE'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {isRtl ? 'اعتماد مقترح البحث والبروتوكول هو نقطة الانطلاق.' : 'Protocol approval is the starting line.'}
              </h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {isRtl
                  ? 'تبقى مهام التنفيذ محمية ومغلقة حتى صدور الموافقة الأكاديمية الرسمية. وبعد الاعتماد، يفتح oskar مسار العمل التشغيلي الكامل للدراسة.'
                  : 'Execution tasks remain protected until official academic approval is issued. Once approved, OSKAR opens the complete trial operational workflow.'}
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 text-primary mb-6">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-sm font-bold tracking-wide uppercase">
                  {isRtl ? 'تسلسل التفعيل' : 'ACTIVATION SEQUENCE'}
                </span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-slate-900 dark:text-slate-100">
                  <span className="font-bold text-primary text-sm w-6">01</span>
                  <span className="font-medium text-sm md:text-base">
                    {isRtl ? 'رفع مقترح البحث المعتمد' : 'Upload Approved Research Proposal'}
                  </span>
                </li>
                <li class="flex items-center gap-4 text-slate-900 dark:text-slate-100">
                  <span className="font-bold text-primary text-sm w-6">02</span>
                  <span className="font-medium text-sm md:text-base">
                    {isRtl ? 'تهيئة بروتوكول الدراسة المقبول' : 'Provision Accepted Trial Protocol'}
                  </span>
                </li>
                <li class="flex items-center gap-4 text-slate-900 dark:text-slate-100">
                  <span className="font-bold text-primary text-sm w-6">03</span>
                  <span className="font-medium text-sm md:text-base">
                    {isRtl ? 'جمع وتتبع وتحليل البيانات السريرية' : 'Collect, Track & Analyze Clinical Data'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Divider Bar */}
      <section className="bg-slate-950 border-y border-slate-800 text-white py-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            oskar <span class="w-1.5 h-1.5 rounded-full bg-primary"></span> medstat
          </div>
          <h3 className="text-xl md:text-2xl font-medium max-w-3xl leading-relaxed text-slate-200">
            {isRtl
              ? '"نؤمن بأن البحث الطبي الرصين لا يبدأ بالأرقام، بل بالسؤال السريري المصاغ بعناية فائقة."'
              : '"We believe rigorous medical research does not start with numbers, but with a meticulously formulated clinical question."'}
          </h3>
          <div className={`text-xs font-mono text-slate-400 border-primary ${isRtl ? 'border-r-2 pr-4' : 'border-l-2 pl-4'}`}>
            {isRtl ? 'المنهجية / 002' : 'METHODOLOGY / 002'}
          </div>
        </div>
      </section>

      {/* Section 3: Methodology (#methodology) */}
      <section id="methodology" className="py-16 md:py-20 px-4 md:px-8 max-w-[1400px] mx-auto bg-slate-100 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 rounded-3xl my-8 scroll-mt-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden h-[450px] lg:h-[520px] shadow-lg border border-slate-200 dark:border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80" 
              alt="Clinical Researcher Analyzing Medical Statistics" 
              className="w-full h-full object-cover max-w-full"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950/90 to-transparent text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded mb-2 inline-block">
                {isRtl ? 'مسار السلسلة السريرية' : 'CLINICAL WORKFLOW'}
              </span>
              <p className="text-sm text-slate-200">
                {isRtl ? 'من صياغة البروتوكول وحتى النشر في المجلات المحكمة.' : 'From protocol formulation to peer-reviewed journal publication.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">
              {isRtl ? '03 / منهجية العمل' : '03 / METHODOLOGY'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {isRtl ? 'من اعتماد البروتوكول إلى النشر العلمي' : 'From Protocol Approval to Publication'}
            </h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              {isRtl
                ? 'يحمي oskar نزاهة الدراسة من خلال توجيه الباحثين عبر أساليب إحصائية قياسية مع مراقبة وتدقيق كاملين.'
                : 'OSKAR protects study integrity by guiding researchers through standard statistical methods with full auditing and verification.'}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {isRtl ? 'صياغة السؤال السريري' : 'Formulate Clinical Question'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isRtl ? 'تحديد الفروض بدقة، والنتائج الرئيسية، ومعايير الشمول والاستبعاد.' : 'Define precise hypotheses, primary endpoints, and inclusion/exclusion criteria.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {isRtl ? 'حساب حجم العينة والقوة الإحصائية' : 'Sample Size & Power Calculation'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isRtl ? 'حساب حجم العينة المطلوب مع تعديلات معدل التسرب وأخطاء التقدير.' : 'Compute required sample size with dropout rate and error adjustments.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {isRtl ? 'تحليل النتائج وتصدير الجداول' : 'Analyze Results & Export Tables'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {isRtl ? 'تنفيذ الاختبارات المعلمية واللامعلمية، وتصدير ملفات معتمدة لـ SPSS و CSV.' : 'Execute parametric and non-parametric tests, exporting approved SPSS and CSV datasets.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Service Catalog Section (#services) */}
      <section id="services" className="py-16 md:py-20 px-4 md:px-8 max-w-[1400px] mx-auto scroll-mt-28 w-full space-y-16">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">
            {isRtl ? '04 / أسعار الخدمات البحثية والتحليل الإحصائي' : '04 / COMMERCIAL SERVICES'}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {isRtl ? 'خدمات الدراسات والتحليل الإحصائي السريري' : 'Biostatistical & Research Service Rates'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            {isRtl
              ? 'أسعار محددة وشفافة لكل بروتوكول دراسة سريرية ولكل تحليل إحصائي للباحثين السريريين.'
              : 'Transparent per-study protocols and per-analysis biostatistical rates for clinical researchers.'}
          </p>
        </div>

        {/* Group 1: Clinical Study Services (4 Color-Coded Cards) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Icon name="science" size="md" className="text-primary" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isRtl ? '1. خدمات بروتوكولات الدراسات السريرية' : 'Clinical Study Protocol Services'}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-primary">$35 - $125 {isRtl ? '/ لكل دراسة' : '/ study'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. RCT (Teal Theme) */}
            <div className="bg-white dark:bg-slate-900 border-2 border-teal-500 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-[10px] font-bold">SPIRIT 2025</span>
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Icon name="clinical_notes" size="sm" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block mb-1">
                    {isRtl ? 'تجربة سريرية تجريبية' : 'EXPERIMENTAL TRIAL'}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isRtl ? 'التجربة العشوائية المحكمة (RCT)' : 'Randomized Controlled Trial (RCT)'}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isRtl
                    ? 'بروتوكول التجربة السريرية الكامل، خطة العشوائية المعماة، وإعدادات تحليل النية بالمعالجة مقارنة بمجموعة الشواهد.'
                    : 'Experimental trial protocol comparing randomized intervention vs. control arms with blind outcome evaluation.'}
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-teal-500" />
                    <span>{isRtl ? 'العشوائية بالكتل المترتبة' : 'Permuted Block Randomization'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-teal-500" />
                    <span>{isRtl ? 'الترميز التعمية المزدوج / الثلاثي' : 'Double / Triple-Blind Coding'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-teal-500" />
                    <span>{isRtl ? 'تحليل ITT وجدول SPIRIT الزمني' : 'ITT Analysis & SPIRIT Schedule'}</span>
                  </div>
                </div>
              </div>
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-6">
                <div>
                  <span className="text-2xl font-black text-teal-600 dark:text-teal-400">$125</span>
                  <span className="text-[11px] text-slate-400 font-semibold block">{isRtl ? '/ دراسة' : '/ study'}</span>
                </div>
                <Link to="/login" className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-all text-decoration-none">
                  {isRtl ? 'اختيار' : 'Select'}
                </Link>
              </div>
            </div>

            {/* 2. Retrospective Study (Warm Amber Theme) */}
            <div className="bg-white dark:bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold">RECORD & STROBE</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Icon name="history" size="sm" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                    {isRtl ? 'دراسة أرشيفية' : 'ARCHIVAL COHORT'}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isRtl ? 'الدراسة الاستعادية الأرشيفية' : 'Retrospective Study'}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isRtl
                    ? 'استخراج وتحليل السجلات السريرية التاريخية (.xlsx, .csv, .sav) مع قاموس المصطلحات وتجهيل التحديد.'
                    : 'Extraction and analysis of pre-existing historical datasets (.xlsx, .csv, .sav) with dictionary mapping.'}
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-amber-500" />
                    <span>{isRtl ? 'استيراد السجلات (.xlsx, .csv, .sav)' : 'Dataset Ingestion (.xlsx, .csv, .sav)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-amber-500" />
                    <span>{isRtl ? 'تجهيل هوية المصدر والبيانات' : 'Source ID De-identification'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-amber-500" />
                    <span>{isRtl ? 'فاحص التكرار وسجل الأهلية' : 'Duplicate Scanner & Eligibility Log'}</span>
                  </div>
                </div>
              </div>
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-6">
                <div>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">$65</span>
                  <span className="text-[11px] text-slate-400 font-semibold block">{isRtl ? '/ دراسة' : '/ study'}</span>
                </div>
                <Link to="/login" className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all text-decoration-none">
                  {isRtl ? 'اختيار' : 'Select'}
                </Link>
              </div>
            </div>

            {/* 3. Prospective Cohort (Indigo Theme) */}
            <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold">STROBE Cohort</span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon name="groups" size="sm" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                    {isRtl ? 'دراسة ملاحظاتية' : 'OBSERVATIONAL TRIAL'}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isRtl ? 'الدراسة المستقبلية الملاحظاتية' : 'Prospective Cohort Study'}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isRtl
                    ? 'متابعة طولية لعينات المرضى عبر الزمن من زيارة الأساس (T0) وحتى زيارات المتابعة (T1..Tn).'
                    : 'Longitudinal tracking of patient cohorts forward in time across baseline (T0) and follow-up visits (T1..Tn).'}
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-indigo-500" />
                    <span>{isRtl ? 'زيارة الأساس (T0) والمتابعة (T1..Tn)' : 'Baseline (T0) & Follow-up (T1..Tn)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-indigo-500" />
                    <span>{isRtl ? 'جدولة المواعيد المستهدفة' : 'Target Window Scheduling'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-indigo-500" />
                    <span>{isRtl ? 'حساب معدل السقوط والإصابة' : 'Incidence Rate Calculation'}</span>
                  </div>
                </div>
              </div>
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-6">
                <div>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">$85</span>
                  <span className="text-[11px] text-slate-400 font-semibold block">{isRtl ? '/ دراسة' : '/ study'}</span>
                </div>
                <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all text-decoration-none">
                  {isRtl ? 'اختيار' : 'Select'}
                </Link>
              </div>
            </div>

            {/* 4. Cross-Sectional Study (Emerald Theme) */}
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">STROBE & AXIS</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Icon name="pie_chart" size="sm" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                    {isRtl ? 'دراسة مسحية ومقطعية' : 'SURVEY & PREVALENCE'}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isRtl ? 'الدراسة المسحية المقطعية' : 'Cross-Sectional Study'}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isRtl
                    ? 'تقييم مسحي في نقطة زمنية واحدة مع منشئ استبيانات تفاعلي ومقاييس سريرية معتمدة.'
                    : 'Single point-in-time survey assessment with interactive Questionnaire Builder and validated instruments.'}
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-emerald-500" />
                    <span>{isRtl ? 'المقاييس المعتمدة (OHIP, GOHAI)' : 'Validated Scales (OHIP, GOHAI)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-emerald-500" />
                    <span>{isRtl ? 'معامل ثبات كرونباخ ألفا (α ≥ 0.70)' : "Cronbach's Alpha (α ≥ 0.70)"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="check_circle" size="sm" className="text-emerald-500" />
                    <span>{isRtl ? 'مركز توزيع الروابط ورموز QR' : 'Multi-Channel Link & QR Hub'}</span>
                  </div>
                </div>
              </div>
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-6">
                <div>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">$35</span>
                  <span className="text-[11px] text-slate-400 font-semibold block">{isRtl ? '/ دراسة' : '/ study'}</span>
                </div>
                <Link to="/login" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all text-decoration-none">
                  {isRtl ? 'اختيار' : 'Select'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Group 2: Sample Size Services */}
        <div className="space-y-6 pt-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider">
              {isRtl ? 'القوة الإحصائية الحيوية' : 'BIOSTATISTICAL POWER'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {isRtl ? 'خدمات حساب حجم العينة والقوة الإحصائية' : 'Sample Size Calculation Services'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isRtl ? 'تقارير مبررات حجم العينة وتقدير القوة الإحصائية للدراسة.' : 'Statistical power estimation and sample size justification reports.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-primary">
                  {isRtl ? 'تحليل القوة' : 'POWER ANALYSIS'}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'حساب حجم العينة الأساسي' : 'Basic Sample Size Calculation'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isRtl
                    ? 'تقدير القوة القياسي لمقارنة متوسطين أو نسبتين مع تعديل معدل الفقد 15%.'
                    : 'Standard 2-Means or 2-Proportions power estimation with 15% dropout rate adjustment.'}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                <span className="text-xl font-black text-primary">$20</span>
                <Link to="/login" className="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors text-decoration-none">
                  {isRtl ? 'اختيار' : 'Select'}
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-primary">
                  {isRtl ? 'تحليل القوة' : 'POWER ANALYSIS'}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'حساب حجم العينة المتقدم' : 'Advanced Sample Size Calculation'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isRtl
                    ? 'تقرير مبررات حجم العينة لاختبارات ANOVA أحادي الاتجاه وكاي تربيع والتجارب متعددة المجموعات.'
                    : 'One-Way ANOVA, Chi-Square, and multi-arm trial sample size justification report.'}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                <span className="text-xl font-black text-primary">$35</span>
                <Link to="/login" className="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors text-decoration-none">
                  {isRtl ? 'اختيار' : 'Select'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Group 3: Statistical Analysis Services */}
        <div className="space-y-6 pt-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider">
              {isRtl ? 'المحرك الإحصائي' : 'STATISTICAL ENGINE'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {isRtl ? 'خدمات التحليل الإحصائي السريري' : 'Biostatistical Analysis Services'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isRtl ? 'المعاملية واللامعاملية والمعالجة الإحصائية متعددة المتغيرات.' : 'Parametric, non-parametric, and multivariate statistical processing.'}
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-primary">
                  {isRtl ? 'المحرك الوصفي' : 'DESCRIPTIVE ENGINE'}
                </span>
                <h4 class="text-base font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'التحليل الإحصائي الوصفي الأساسي' : 'Basic Statistical Analysis'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isRtl
                    ? 'الإحصاء الوصفي، اختبار التوزيع الطبيعي (Shapiro-Wilk)، وتوليد جدول الوصف الأول.'
                    : 'Descriptive statistics, Shapiro-Wilk normality testing, and Table 1 baseline generation.'}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                <span className="text-xl font-black text-primary">$50</span>
                <Link to="/login" className="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors text-decoration-none">
                  {isRtl ? 'اختيار' : 'Select'}
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-primary">
                  {isRtl ? 'اختبار الفروض' : 'HYPOTHESIS TESTING'}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'التحليل الإحصائي الاستدلالي' : 'Inferential Statistical Analysis'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isRtl
                    ? 'الاختبارات المعلمية (t-test, ANOVA) واللامعلمية (Mann-Whitney, Kruskal-Wallis).'
                    : 'Parametric (t-test, ANOVA) and non-parametric (Mann-Whitney, Kruskal-Wallis) tests.'}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                <span className="text-xl font-black text-primary">$80</span>
                <Link to="/login" className="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors text-decoration-none">
                  {isRtl ? 'اختيار' : 'Select'}
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-primary">
                  {isRtl ? 'المحرك المتقدم' : 'MULTIVARIATE ENGINE'}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {isRtl ? 'التحليل الإحصائي المتقدم' : 'Advanced Statistical Analysis'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isRtl
                    ? 'الانحدار اللوجستي والخطاطي متعدد المتغيرات، منحنيات بقاء كابلان-ماير، وتصدير SPSS.'
                    : 'Multivariate logistic/linear regression, Kaplan-Meier survival curves, and SPSS exports.'}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                <span className="text-xl font-black text-primary">$130</span>
                <Link to="/login" className="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors text-decoration-none">
                  {isRtl ? 'اختيار' : 'Select'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Value Cards Section */}
        <div className="bg-slate-100 dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 max-w-5xl mx-auto mt-12">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-mono font-bold text-primary uppercase">
              {isRtl ? 'النزاهة الإحصائية السريرية' : 'BIOSTATISTICAL INTEGRITY'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isRtl ? 'مسارات عمل سريرية وإحصائية منظمة' : 'Structured Clinical & Biostatistical Workflows'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isRtl ? 'تتبع خدمات OSKAR إرشادات التقرير السريرية الدولية للبحوث المحكمة الموجهة للنشر.' : 'OSKAR services follow international clinical reporting guidelines for peer-reviewed research.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-sm font-bold text-primary">
                <Icon name="verified_user" size="sm" />
                <span>{isRtl ? 'مسارات بحثية هيكلية' : 'Structured Research Workflows'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isRtl ? 'دمج معايير SPIRIT 2025 و STROBE و RECORD و AXIS ضمن هيكل البروتوكول ومسارات جمع البيانات.' : 'SPIRIT 2025, STROBE, RECORD, and AXIS standards incorporated into protocol structure and data collection workflows.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-sm font-bold text-primary">
                <Icon name="rate_review" size="sm" />
                <span>{isRtl ? 'مراجعة وتحكم الباحث الرئيسي' : 'Researcher Review & Control'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isRtl ? 'تحكم كامل وعمليات تدقيق صريحة للباحث الرئيسي قبل إغلاق قاعدة البيانات وتصدير جداول النشر.' : 'Explicit Principal Investigator verification and audit controls before dataset locking and publication table export.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-sm font-bold text-primary">
                <Icon name="assignment_turned_in" size="sm" />
                <span>{isRtl ? 'جمع بيانات مخصص للمنهجية' : 'Methodology-Specific Data Collection'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isRtl ? 'نماذج جمع بيانات إلكترونية مصممة خصيصاً للتجارب السريرية والدراسات الطولية أو المسحية والأرشيفية.' : 'Tailored electronic CRFs engineered specifically for clinical trials, longitudinal cohorts, surveys, or historical archives.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-sm font-bold text-primary">
                <Icon name="equalizer" size="sm" />
                <span>{isRtl ? 'معالجة إحصائية منظمة' : 'Organized Statistical Processing'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isRtl ? 'حسابات إحصائية معلمية ولا معملية قياسية مجهزة للتصدير المباشر إلى SPSS و CSV والأوراق العلمية.' : 'Standardized parametric and non-parametric statistical calculations formatted for direct SPSS, CSV, and manuscript export.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: About (#about) */}
      <section id="about" className="bg-slate-950 py-16 md:py-24 text-white scroll-mt-28 w-full">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">
              {isRtl ? '05 / عن المنصة والرؤية' : '05 / ABOUT OSKAR'}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-white">
              {isRtl
                ? 'اعتماد واضح أولاً. ثم تنفيذ بحثي قابل للتتبع ثانياً.'
                : 'Clear approval first. Traceable research execution next.'}
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              {isRtl
                ? 'تم تصميم oskar خصيصاً للأطباء والباحثين السريريين والمؤسسات الأكاديمية. نحن نقضي على الأخطاء الإجرائية، ونحافظ على صحة البيانات، ونضمن توافق جميع المخرجات الإحصائية مع المعايير الدولية للنشر.'
                : 'oskar is engineered specifically for clinicians, biostatisticians, and academic research institutions. We eliminate procedural errors, safeguard data validity, and ensure every statistical output meets rigorous peer-review standards.'}
            </p>
            <Link
              to="/login"
              className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-md inline-flex items-center gap-2 text-decoration-none"
            >
              <span>{isRtl ? 'ابدأ بحثك الآن' : 'Start your research'}</span>
              <Icon
                name="arrow_forward"
                size="md"
                className={`transition-transform ${isRtl ? 'rotate-180' : ''}`}
              />
            </Link>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-[400px] border border-slate-800 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" 
              alt="High-tech digital data visualization" 
              className="w-full h-full object-cover max-w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm font-bold text-white">
                {isRtl ? 'سلسلة المعالجة الإحصائية الآلية' : 'Automated Statistical Pipeline'}
              </p>
              <p className="text-xs text-slate-300">
                {isRtl ? 'تحقق مستمر ومخرجات بحثية قابلة للتكرار العلمي.' : 'Continuous validation & reproducible research artifacts.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
