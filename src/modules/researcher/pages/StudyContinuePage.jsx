import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const StudyContinuePage = () => {
  const { isRtl } = useI18n();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialType = (searchParams.get('type') || searchParams.get('methodology') || 'RCT').toUpperCase();
  const initialTypeNormalized = ['RCT', 'PROSPECTIVE', 'RETROSPECTIVE', 'CROSS_SECTIONAL'].includes(initialType)
    ? initialType
    : initialType.includes('CROSS')
    ? 'CROSS_SECTIONAL'
    : initialType.includes('RETRO')
    ? 'RETROSPECTIVE'
    : initialType.includes('PROSPECT')
    ? 'PROSPECTIVE'
    : 'RCT';

  const [currentStep, setCurrentStep] = useState(1);
  const [studyTitle, setStudyTitle] = useState('Longitudinal Assessment of Periodontal Regeneration in Patients');
  const [studyType, setStudyType] = useState(initialTypeNormalized);
  const [piName, setPiName] = useState('Dr. Sarah Al-Mansoor, MD, PhD');
  const [supervisor, setSupervisor] = useState('Prof. Khalid Al-Otaibi');
  const [irbId, setIrbId] = useState('IRB-KSU-2026-088');
  const [registryId, setRegistryId] = useState('NCT05891234');
  const [protocolFileName, setProtocolFileName] = useState('');
  const [examFileName, setExamFileName] = useState('periodontal_exam_form_v2.pdf');
  const [piSignoff, setPiSignoff] = useState(false);

  const t = {
    en: {
      headerBadge: 'OSKAR CONTINUATION & INGESTION PORTAL',
      headerTitle: 'Continue Existing Study Workflow',
      headerSubtitle: 'Ingest ongoing clinical trials, upload existing examination forms, review AI schema mappings, and synthesize electronic CRFs.',
      modeBadge: 'Mode B: Active Study Ingestion',
      step1Nav: '1. Metadata',
      step2Nav: '2. Form Ingestion',
      step3Nav: '3. AI Mapping',
      step4Nav: '4. CRF Synthesis',
      step5Nav: '5. PI Sign-off',
      step1Title: 'Step 1: Existing Study Metadata & Methodology',
      step1Sub: 'Enter core identification details and select the scientific design for your ongoing study.',
      lblTitle: 'Study Title',
      lblType: 'Select Study Methodology',
      typeRct: 'RCT Trial',
      descRct: 'Randomized Controlled Trial',
      typeProspective: 'Prospective Cohort',
      descProspective: 'Forward longitudinal tracking',
      typeRetrospective: 'Retrospective Cohort',
      descRetrospective: 'Archival historical dataset',
      typeCross: 'Cross-Sectional',
      descCross: 'Point-in-time survey',
      lblPi: 'Principal Investigator (PI)',
      lblSupervisor: 'Academic Supervisor (Conditional)',
      lblOptionalTag: '(Optional)',
      lblConditionalTag: '(Conditional / Optional)',
      lblIrb: 'IRB / Ethics Approval ID',
      lblRegistry: 'Clinical Trial Registry ID',
      lblLogo: 'University / Institution Logo',
      step2Title: 'Step 2: Protocol Document & Existing Examination Form',
      step2Sub: 'Upload your study proposal document and pre-existing clinical examination form template.',
      formatNoticeTitle: 'Source Format Specification:',
      formatNoticeText: 'Exact supported file formats for Existing Examination Form are SOURCE-UNSPECIFIED / TBD. You may select any study document or clinical form file for prototype analysis.',
      lblDocProtocol: 'A. Research Proposal / Protocol',
      lblDocExam: 'B. Existing Examination Form',
      dropProtocolTitle: 'Select Research Protocol File',
      dropProtocolSub: 'PDF, DOCX, or text proposal document',
      dropExamTitle: 'Select Existing Examination Form',
      dropExamSub: 'Existing clinical examination instrument / form',
      btnBrowseFile: 'Browse File',
      btnBrowseForm: 'Browse Form File',
      step3Title: 'Step 3: AI Schema Extraction & Variable Mapping',
      step3Sub: 'Review extracted fields from your form and map them to OSKAR standardized research variables.',
      mockAiBadge: 'Prototype Simulated Extraction — Requires Verification',
      thRaw: 'Extracted Field Label',
      thVar: 'OSKAR Standard Variable',
      thType: 'Data Type',
      thStatus: 'Verification Status',
      thAction: 'Actions',
      stMapped: 'Auto-Mapped',
      stReview: 'Needs Review',
      btnEdit: 'Edit',
      step4Title: 'Step 4: Electronic CRF / Data-Collection Structure Synthesis',
      step4Sub: 'Synthesized data collection inputs based on your selected methodology standards.',
      step5Title: 'Step 5: Protocol Matching & Researcher Sign-off',
      step5Sub: 'Review protocol cross-checks and provide formal Principal Investigator sign-off.',
      check1Title: 'Variables Matched',
      check1Desc: '5 of 5 extracted form variables successfully matched with standard OSKAR data dictionary.',
      check2Title: 'CRF Structure Synthesized',
      check2Desc: 'Electronic CRF schema synthesized according to selected methodology standards.',
      check3Title: 'Ethics & De-Identification',
      check3Desc: 'Participant identification isolated from patient source records for IRB compliance.',
      lblSignoffText: 'I hereby certify as Principal Investigator (PI) that I have audited the extracted schema, verified the variable mappings, and approve the synthesized Electronic CRF structure for active study execution in OSKAR.',
      btnPrev: 'Previous Step',
      btnNext: 'Proceed to Next Step',
      btnApprove: 'Approve & Open Study Workspace',
    },
    ar: {
      headerBadge: 'بوابة أوسكار لمتابعة واستيراد الدراسات القائمة',
      headerTitle: 'مسار استيراد ومتابعة دراسة قائمة',
      headerSubtitle: 'استيراد الدراسات السريرية الجارية، رفع نماذج الفحص القائمة، تدقيق مطابقة المتغيرات بالذكاء الاصطناعي، وبناء الاستمارة الإلكترونية.',
      modeBadge: 'النمط الثاني: استيراد دراسة جارية',
      step1Nav: '1. البيانات الأساسية',
      step2Nav: '2. استيراد النموذج',
      step3Nav: '3. مطابقة المتغيرات',
      step4Nav: '4. بناء الاستمارة',
      step5Nav: '5. اعتماد الباحث',
      step1Title: 'الخطوة 1: البيانات الأساسية والمنهجية للدراسة القائمة',
      step1Sub: 'أدخل بيانات التعريف الرئيسية واختر التصميم المنهجي العلمي لدراستك الجارية.',
      lblTitle: 'عنوان الدراسة السريرية',
      lblType: 'اختر المنهجية البحثية',
      typeRct: 'تجربة عشوائية محكمة',
      descRct: 'تجربة سريرية عشوائية محكمة',
      typeProspective: 'دراسة مستقبلية',
      descProspective: 'متابعة طولية لعينات المرضى',
      typeRetrospective: 'دراسة استعادية',
      descRetrospective: 'قاعدة بيانات وأرشيف تاريخي',
      typeCross: 'دراسة مقطعية',
      descCross: 'مسح تقييمي في نقطة زمنية',
      lblPi: 'الباحث الرئيسي',
      lblSupervisor: 'المشرف الأكاديمي (شرطي)',
      lblOptionalTag: '(اختياري)',
      lblConditionalTag: '(شرطي / اختياري)',
      lblIrb: 'رمز موافقة لجنة الأخلاقيات',
      lblRegistry: 'رمز السجل العالمي للتجارب السريرية',
      lblLogo: 'شعار الجامعة / المؤسسة البحثية',
      step2Title: 'الخطوة 2: وثيقة البروتوكول ونموذج الفحص القائم',
      step2Sub: 'قم برفع مقترح الدراسة ونموذج الفحص الطبي المستمر المعتمد.',
      formatNoticeTitle: 'تنبيه الصيغ المدعومة لنموذج الفحص:',
      formatNoticeText: 'الصيغ الفنية المدعومة لنموذج الفحص القائم غير محددة بالخصائص المصدرية. يمكنك اختيار أي ملف وثيقة سريرية لمعاينته في النموذج التجريبي.',
      lblDocProtocol: 'أ. مقترح/بروتوكول البحث',
      lblDocExam: 'ب. نموذج الفحص الطبي القائم',
      dropProtocolTitle: 'اختر ملف بروتوكول البحث',
      dropProtocolSub: 'وثيقة بصيغة PDF أو DOCX',
      dropExamTitle: 'اختر ملف نموذج الفحص السريري',
      dropExamSub: 'نموذج الفحص الطبي القائم للدراسة',
      btnBrowseFile: 'استعراض الملف',
      btnBrowseForm: 'استعراض نموذج الفحص',
      step3Title: 'الخطوة 3: استخراج المتغيرات ومطابقة المخطط الإحصائي',
      step3Sub: 'مراجعة الحقول المستخرجة من النموذج ومطابقتها مع قاموس متغيرات أوسكار المعياري.',
      mockAiBadge: 'استخراج افتراضي تجريبي — يتطلب تدقيق الباحث',
      thRaw: 'مسمى الحقل المستخرج',
      thVar: 'متغير OSKAR المعياري',
      thType: 'نوع البيانات',
      thStatus: 'حالة التحقق',
      thAction: 'الإجراءات',
      stMapped: 'مطابق تلقائياً',
      stReview: 'يتطلب المراجعة',
      btnEdit: 'تعديل',
      step4Title: 'الخطوة 4: بناء استمارة جمع البيانات الإلكترونية',
      step4Sub: 'تم توليد هيكلية الاستمارة السريرية وفق المعايير المنهجية المختارة.',
      step5Title: 'الخطوة 5: مطابقة البروتوكول واعتماد الباحث الرئيسي',
      step5Sub: 'مراجعة المطابقة النهائية واعتماد الاستمارة لبدء مساحة العمل السريرية.',
      check1Title: 'مطابقة المتغيرات',
      check1Desc: 'تمت مطابقة 5 من 5 من متغيرات النموذج المستخرجة مع قاموس أوسكار الإحصائي.',
      check2Title: 'توليد استمارة جمع البيانات الإلكترونية',
      check2Desc: 'تم بناء مخطط استمارة جمع البيانات السريرية وفق المعايير المنهجية.',
      check3Title: 'التجهيل والامتثال الأخلاقي',
      check3Desc: 'تم عزل هوية المشارك البحثية عن السجلات المرضية الأصلية لضمان معايير لجنة الأخلاقيات.',
      lblSignoffText: 'أقر أنا الباحث الرئيسي بأنني قمت بتدقيق المخطط المستخرج، والتحقق من مطابقة المتغيرات، وأعتمد هيكل استمارة جمع البيانات الإلكترونية لبدء العمل في المنصة.',
      btnPrev: 'الخطوة السابقة',
      btnNext: 'الانتقال للخطوة التالية',
      btnApprove: 'اعتماد وفتح مساحة عمل الدراسة',
    },
  }[isRtl ? 'ar' : 'en'];

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleApprove = () => {
    if (!piSignoff) {
      alert(
        isRtl
          ? 'يرجى تحديد مربع الاعتماد الرسمي قبل المتابعة.'
          : 'Please check the PI formal sign-off confirmation box before proceeding.'
      );
      return;
    }

    const newStudy = {
      id: `STD-2026-CONT-${Math.floor(100 + Math.random() * 900)}`,
      title: studyTitle,
      type: studyType,
      subtype: 'Continued Existing Study',
      pi: piName,
      status: 'Active (Ingested)',
      irbNumber: irbId,
      targetN: 150,
      createdAt: new Date().toISOString(),
    };

    try {
      const registry = JSON.parse(localStorage.getItem('oskar_studies_registry') || '[]');
      registry.unshift(newStudy);
      localStorage.setItem('oskar_studies_registry', JSON.stringify(registry));
      localStorage.setItem('oskar_current_active_study_view', JSON.stringify(newStudy));
    } catch (e) {
      console.error(e);
    }

    navigate('/researcher/studies');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6" id="continue-study-wizard">
      {/* 01. Header Bar */}
      <div className="border-b border-slate-200 dark:border-gray-700/60 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-primary dark:text-teal-400 font-bold uppercase tracking-wider">
            <Icon name="history_edu" size="sm" />
            <span>{t.headerBadge}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.headerTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
            {t.headerSubtitle}
          </p>
        </div>

        {/* Mode Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold shrink-0">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          <span>{t.modeBadge}</span>
        </div>
      </div>

      {/* 02. Stepper Navigation */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-gray-700/60 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center" id="wizard-steps-nav">
          {[
            { num: 1, label: t.step1Nav },
            { num: 2, label: t.step2Nav },
            { num: 3, label: t.step3Nav },
            { num: 4, label: t.step4Nav },
            { num: 5, label: t.step5Nav },
          ].map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`p-2.5 rounded-xl border-2 font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  s.num === 5 ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary dark:text-teal-300'
                    : isCompleted
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-transparent text-slate-500 dark:text-gray-400'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    isActive
                      ? 'bg-primary text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-300'
                  }`}
                >
                  {s.num}
                </span>
                <span className="truncate max-w-full">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 03. Step Content Containers */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-gray-700/60 shadow-xs space-y-6">
        {/* STEP 1: Metadata & Study Type */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-gray-700 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.step1Title}</h2>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">{t.step1Sub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Study Title (REQUIRED) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1">
                  <span>{t.lblTitle}</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={studyTitle}
                  onChange={(e) => setStudyTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                  placeholder="Enter full official study title..."
                />
              </div>

              {/* Study Type Selection (REQUIRED) */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1">
                  <span>{t.lblType}</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { value: 'RCT', title: t.typeRct, desc: t.descRct },
                    { value: 'PROSPECTIVE', title: t.typeProspective, desc: t.descProspective },
                    { value: 'RETROSPECTIVE', title: t.typeRetrospective, desc: t.descRetrospective },
                    { value: 'CROSS_SECTIONAL', title: t.typeCross, desc: t.descCross },
                  ].map((typeItem) => (
                    <label
                      key={typeItem.value}
                      className={`p-3.5 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        studyType === typeItem.value
                          ? 'border-primary bg-primary/5 dark:bg-teal-900/20'
                          : 'border-slate-200 dark:border-gray-700 hover:border-primary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cont-study-type"
                        value={typeItem.value}
                        checked={studyType === typeItem.value}
                        onChange={() => setStudyType(typeItem.value)}
                        className="mt-0.5 text-primary focus:ring-primary"
                      />
                      <div>
                        <span
                          className={`text-xs font-extrabold block ${
                            studyType === typeItem.value
                              ? 'text-primary dark:text-teal-300'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {typeItem.title}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400 block mt-0.5">
                          {typeItem.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Principal Investigator (REQUIRED - Readonly) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1">
                  <span>{t.lblPi}</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={piName}
                  readOnly
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold cursor-not-allowed"
                />
              </div>

              {/* Academic Supervisor (CONDITIONAL) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1">
                  <span>{t.lblSupervisor}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-normal">{t.lblOptionalTag}</span>
                </label>
                <input
                  type="text"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                  placeholder="Enter supervisor name if academic study..."
                />
              </div>

              {/* IRB / Ethics Approval ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1">
                  <span>{t.lblIrb}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-normal">{t.lblOptionalTag}</span>
                </label>
                <input
                  type="text"
                  value={irbId}
                  onChange={(e) => setIrbId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                  placeholder="e.g. IRB-2026-XXXX"
                />
              </div>

              {/* Clinical Trial Registry ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1">
                  <span>{t.lblRegistry}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-normal">{t.lblOptionalTag}</span>
                </label>
                <input
                  type="text"
                  value={registryId}
                  onChange={(e) => setRegistryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                  placeholder="e.g. NCT01234567"
                />
              </div>

              {/* Institution / University Logo */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center gap-1">
                  <span>{t.lblLogo}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-normal">{t.lblOptionalTag}</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center text-slate-500 dark:text-gray-400">
                    <Icon name="corporate_fare" size="md" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="text-xs text-slate-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary dark:file:text-teal-300 hover:file:bg-primary/20 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Protocol & Form Upload */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-gray-700 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.step2Title}</h2>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">{t.step2Sub}</p>
            </div>

            {/* Format Disclaimer Box */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <Icon name="info" size="sm" className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">{t.formatNoticeTitle}</span>
                <span>{t.formatNoticeText}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document A: Protocol Document */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center justify-between">
                  <span>{t.lblDocProtocol}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-normal">{t.lblOptionalTag}</span>
                </label>
                <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-950 text-center space-y-3 hover:border-primary transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary dark:text-teal-300 flex items-center justify-center mx-auto">
                    <Icon name="description" size="md" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{t.dropProtocolTitle}</p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">{t.dropProtocolSub}</p>
                  </div>
                  <input
                    type="file"
                    id="protocol-file-input"
                    className="hidden"
                    onChange={(e) => setProtocolFileName(e.target.files[0]?.name || '')}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('protocol-file-input')?.click()}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-gray-200 hover:bg-slate-200 text-xs font-bold border border-slate-200 dark:border-gray-700 cursor-pointer"
                  >
                    <span>{t.btnBrowseFile}</span>
                  </button>
                  {protocolFileName && (
                    <div className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-bold">
                      {protocolFileName}
                    </div>
                  )}
                </div>
              </div>

              {/* Document B: Existing Examination Form */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-900 dark:text-gray-200 flex items-center justify-between">
                  <span>{t.lblDocExam}</span>
                  <span className="text-xs text-teal-600 dark:text-teal-400 font-bold">{t.lblConditionalTag}</span>
                </label>
                <div className="p-6 rounded-2xl border-2 border-dashed border-teal-500/40 dark:border-teal-400/40 bg-teal-500/5 dark:bg-teal-900/10 text-center space-y-3 hover:border-primary transition-all">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center mx-auto">
                    <Icon name="assignment" size="md" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{t.dropExamTitle}</p>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">{t.dropExamSub}</p>
                  </div>
                  <input
                    type="file"
                    id="exam-file-input"
                    className="hidden"
                    onChange={(e) => setExamFileName(e.target.files[0]?.name || examFileName)}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('exam-file-input')?.click()}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 text-xs font-bold shadow-sm cursor-pointer"
                  >
                    <span>{t.btnBrowseForm}</span>
                  </button>
                  {examFileName && (
                    <div className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-bold">
                      {examFileName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: AI Variable Mapping Table */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-gray-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.step3Title}</h2>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">{t.step3Sub}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold whitespace-nowrap self-start sm:self-center">
                {t.mockAiBadge}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-gray-700/60 rounded-xl">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-gray-300 border-b border-slate-200 dark:border-gray-700 font-bold">
                  <tr>
                    <th className="p-3">{t.thRaw}</th>
                    <th className="p-3">{t.thVar}</th>
                    <th className="p-3">{t.thType}</th>
                    <th className="p-3">{t.thStatus}</th>
                    <th className="p-3 text-center">{t.thAction}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-700/60">
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Patient Full Name / Initial</td>
                    <td className="p-3 font-mono text-primary dark:text-teal-400 font-bold">participant_identifier</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">String (Pseudonymized)</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                        {t.stMapped}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button type="button" className="text-xs text-primary dark:text-teal-400 font-bold hover:underline">
                        {t.btnEdit}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Probing Depth (PD) mm</td>
                    <td className="p-3 font-mono text-primary dark:text-teal-400 font-bold">probing_depth_mm</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">Numeric (Continuous)</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                        {t.stMapped}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button type="button" className="text-xs text-primary dark:text-teal-400 font-bold hover:underline">
                        {t.btnEdit}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Clinical Attachment Level (CAL)</td>
                    <td className="p-3 font-mono text-primary dark:text-teal-400 font-bold">attachment_level_mm</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">Numeric (Continuous)</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                        {t.stMapped}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button type="button" className="text-xs text-primary dark:text-teal-400 font-bold hover:underline">
                        {t.btnEdit}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Bleeding on Probing (BOP %)</td>
                    <td className="p-3 font-mono text-primary dark:text-teal-400 font-bold">bop_percentage</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">Numeric (Percentage)</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[10px]">
                        {t.stReview}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button type="button" className="text-xs text-primary dark:text-teal-400 font-bold hover:underline">
                        {t.btnEdit}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">Smoker Status (Pack-years)</td>
                    <td className="p-3 font-mono text-primary dark:text-teal-400 font-bold">smoking_history</td>
                    <td className="p-3 text-slate-600 dark:text-gray-300">Categorical / Ordinal</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                        {t.stMapped}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button type="button" className="text-xs text-primary dark:text-teal-400 font-bold hover:underline">
                        {t.btnEdit}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STEP 4: Electronic CRF Synthesis Preview */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-gray-700 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.step4Title}</h2>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">{t.step4Sub}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-gray-700/60 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-700 pb-3">
                <div className="flex items-center gap-2">
                  <Icon name="dynamic_form" size="sm" className="text-primary dark:text-teal-400" />
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {studyType === 'RCT'
                      ? isRtl ? 'نموذج زيارات الدراسة العشوائية المحكمة' : 'RCT Longitudinal Visit Schema (SPIRIT Standard)'
                      : studyType === 'PROSPECTIVE'
                      ? isRtl ? 'مخطط التتبع الطولي للدراسة المستقبلية' : 'Prospective Longitudinal Cohort Tracking (STROBE Standard)'
                      : studyType === 'CROSS_SECTIONAL'
                      ? isRtl ? 'تقييم المسح المقطعي في نقطة زمنية' : 'Point-in-Time Survey Assessment (AXIS Standard)'
                      : isRtl ? 'هيكلية المتغيرات للأرشيف التاريخي' : 'Historical Mapped Data Structure (RECORD Standard)'}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-teal-300 font-mono text-[10px] font-bold">
                  {studyType}
                </span>
              </div>

              {/* Dynamic Structure View */}
              <div className="space-y-3 text-xs">
                {studyType === 'RCT' && (
                  <>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-teal-500/10 text-teal-600 font-mono font-bold text-[10px] flex items-center justify-center">T0</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {isRtl ? 'زيارة الأساس والعشوائية (T0)' : 'Baseline Assessment & Randomization Visit (T0)'}
                        </span>
                      </div>
                      <span className="text-slate-500 dark:text-gray-400 text-[11px]">Demographics, Probing Depth, Blinded Randomization</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-600 font-mono font-bold text-[10px] flex items-center justify-center">T1</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {isRtl ? 'زيارة التقييم الأولى (3 أشهر)' : 'Follow-up Evaluation Visit 1 (3 Months)'}
                        </span>
                      </div>
                      <span className="text-slate-500 dark:text-gray-400 text-[11px]">Attachment Level, Bleeding Index, Adverse Events</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-600 font-mono font-bold text-[10px] flex items-center justify-center">T2</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {isRtl ? 'زيارة النتيجة النهائية (6 أشهر)' : 'Final Endpoint Visit 2 (6 Months)'}
                        </span>
                      </div>
                      <span className="text-slate-500 dark:text-gray-400 text-[11px]">Primary Endpoint Evaluation, ITT Analysis Export</span>
                    </div>
                  </>
                )}

                {studyType === 'PROSPECTIVE' && (
                  <>
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-600 font-mono font-bold text-[10px] flex items-center justify-center">T0</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {isRtl ? 'قياس الأساس الملاحظاتي (T0)' : 'Baseline Observational Enrollment (T0)'}
                        </span>
                      </div>
                      <span className="text-slate-500 dark:text-gray-400 text-[11px]">Exposure Cohort Classification, Baseline Biomarkers</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-600 font-mono font-bold text-[10px] flex items-center justify-center">T1..Tn</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {isRtl ? 'زيارات المتابعة الطولية (T1 إلى Tn)' : 'Longitudinal Follow-up Visits (T1..Tn Schedule)'}
                        </span>
                      </div>
                      <span className="text-slate-500 dark:text-gray-400 text-[11px]">Incidence Rate Calculations, Outcome Tracking</span>
                    </div>
                  </>
                )}

                {studyType === 'CROSS_SECTIONAL' && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-600 font-mono font-bold text-[10px] flex items-center justify-center">S0</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {isRtl ? 'استمارة التقييم المسحي المقطعي' : 'Point-in-Time Survey Assessment Instrument'}
                      </span>
                    </div>
                    <span className="text-slate-500 dark:text-gray-400 text-[11px]">Validated Instruments (OHIP/GOHAI), Cronbach α Check</span>
                  </div>
                )}

                {studyType === 'RETROSPECTIVE' && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 font-mono font-bold text-[10px] flex items-center justify-center">REC</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {isRtl ? 'سجل البيانات التاريخية المشفورة' : 'Historical Mapped Record (No Automatic T0/T1 Visits)'}
                      </span>
                    </div>
                    <span className="text-slate-500 dark:text-gray-400 text-[11px]">Pseudonymized RET-xxxx IDs, Historical Field Mapping</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Protocol Matching & PI Signoff */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 dark:border-gray-700 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.step5Title}</h2>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">{t.step5Sub}</p>
            </div>

            {/* Check Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Icon name="verified" size="sm" />
                  <span>{t.check1Title}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{t.check1Desc}</p>
              </div>

              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-800 dark:text-teal-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Icon name="task" size="sm" />
                  <span>{t.check2Title}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{t.check2Desc}</p>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary dark:text-teal-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Icon name="shield" size="sm" />
                  <span>{t.check3Title}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{t.check3Desc}</p>
              </div>
            </div>

            {/* Formal Approval Confirmation Box */}
            <div className="p-5 rounded-2xl border-2 border-primary/40 dark:border-teal-400/40 bg-slate-50 dark:bg-slate-950 space-y-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="pi-signoff-checkbox"
                  checked={piSignoff}
                  onChange={(e) => setPiSignoff(e.target.checked)}
                  className="mt-1 text-primary focus:ring-primary rounded cursor-pointer"
                />
                <label
                  htmlFor="pi-signoff-checkbox"
                  className="text-xs font-semibold text-slate-900 dark:text-gray-200 leading-relaxed cursor-pointer"
                >
                  {t.lblSignoffText}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 04. Wizard Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-700/60">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Icon name="arrow_forward" size="sm" className={isRtl ? '' : 'rotate-180'} />
            <span>{t.btnPrev}</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-teal-700 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.btnNext}</span>
              <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApprove}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="verified" size="sm" />
              <span>{t.btnApprove}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyContinuePage;

