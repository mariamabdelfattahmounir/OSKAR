import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

export const StudyCreateRctPage = () => {
  const { isRtl } = useI18n();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [draftSaved, setDraftSaved] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Step 1 State: Overview & Subtype (RCT-01..04)
  const [subtype, setSubtype] = useState('parallel'); // parallel, crossover, cluster, non_inferiority
  const [title, setTitle] = useState('Comparative Efficacy of Adjunctive Laser Therapy in RCT Endodontics');
  const [pi, setPi] = useState('Dr. Sara Ali - Principal Investigator');
  const [institution, setInstitution] = useState('University of Dental Sciences');
  const [coResearchers, setCoResearchers] = useState([]);
  const [targetN, setTargetN] = useState(128);
  const [alpha, setAlpha] = useState(0.05);
  const [power, setPower] = useState(80);
  const [dropoutRate, setDropoutRate] = useState(10);

  // Step 2 State: Protocol & Documents (RCT-05..07)
  const [protocolFile, setProtocolFile] = useState(null);
  const [irbFile, setIrbFile] = useState(null);
  const [irbNumber, setIrbNumber] = useState('IRB-2026-145');
  const [nctNumber, setNctNumber] = useState('NCT-2026-00125');

  // Step 3 State: Methodology (RCT-08..14)
  const [randomizationMethod, setRandomizationMethod] = useState('block');
  const [blindingProtocol, setBlindingProtocol] = useState('double');
  const [allocationConcealment, setAllocationConcealment] = useState('pharmacy');
  const [analysisStrategy, setAnalysisStrategy] = useState('itt');
  const [primaryEndpoint, setPrimaryEndpoint] = useState('Mean reduction in probing depth (mm) at 6 months');
  const [secondaryEndpoints, setSecondaryEndpoints] = useState('');
  const [unblindingEnabled, setUnblindingEnabled] = useState(true);
  const [unblindingDetails, setUnblindingDetails] = useState('');
  const [arms, setArms] = useState([
    { armId: 'arm_1', armName: 'Intervention Arm A', armType: 'intervention', regimen: 'Active Treatment' },
    { armId: 'arm_2', armName: 'Control Arm B', armType: 'control', regimen: 'Placebo / Standard' }
  ]);

  // Step 4 State: CRF Schema & Visits (RCT-15..19)
  const [crfModules, setCrfModules] = useState({
    demographics: true,
    dentalExam: true,
    perioOcclusal: true,
    imaging: true
  });
  const [visits, setVisits] = useState([
    { visitNumber: 1, visitName: isRtl ? 'زيارة الأساس (اليوم 0)' : 'Baseline Visit', targetInterval: 'Day 0', procedures: 'Consent, Exam, Randomization' },
    { visitNumber: 2, visitName: isRtl ? 'متابعة 1 شهر' : 'Follow-up Visit 1', targetInterval: '1 Month', procedures: 'Clinical Assessment, Probing Depth' },
    { visitNumber: 3, visitName: isRtl ? 'الزيارة النهائية (6 أشهر)' : 'Final Visit', targetInterval: '6 Months', procedures: 'Final Outcome Evaluation, 3D Scans' }
  ]);

  React.useEffect(() => {
    if (isRtl) {
      if (title.includes('Comparative Efficacy')) {
        setTitle('دراسة مقارنة لفاعلية الليزر المساعد في معالجة الجذور العشوائية المحكمة');
      }
      if (pi.includes('Dr. Sara')) {
        setPi('د. سارة علي — الباحث الرئيسي');
      }
      if (institution.includes('University')) {
        setInstitution('جامعة علوم طب الأسنان');
      }
      if (primaryEndpoint.includes('Mean reduction')) {
        setPrimaryEndpoint('متوسط انخفاض عمق الجيوب (مم) بعد 6 أشهر');
      }
    }
  }, [isRtl]);

  // Handlers
  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleAddCoResearcher = () => {
    setCoResearchers([...coResearchers, { id: Date.now(), email: '', role: 'data_entry' }]);
  };

  const handleUpdateCoResearcher = (id, field, value) => {
    setCoResearchers(coResearchers.map(co => co.id === id ? { ...co, [field]: value } : co));
  };

  const handleRemoveCoResearcher = (id) => {
    setCoResearchers(coResearchers.filter(co => co.id !== id));
  };

  const handleProtocolFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProtocolFile({
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });
    }
  };

  const handleIrbFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIrbFile({
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      });
    }
  };

  const handleAddArm = () => {
    const num = arms.length + 1;
    setArms([...arms, {
      armId: 'arm_' + num,
      armName: isRtl ? `مجموعة التجربة ${String.fromCharCode(64 + num)}` : 'Arm ' + String.fromCharCode(64 + num),
      armType: 'intervention',
      regimen: isRtl ? 'التدخل المحدد' : 'Specified Intervention'
    }]);
  };

  const handleUpdateArm = (index, field, value) => {
    const updated = [...arms];
    updated[index][field] = value;
    setArms(updated);
  };

  const handleRemoveArm = (index) => {
    if (arms.length > 2) {
      setArms(arms.filter((_, i) => i !== index));
    }
  };

  const handleAddVisit = () => {
    const num = visits.length + 1;
    setVisits([...visits, {
      visitNumber: num,
      visitName: isRtl ? `زيارة متابعة ${num}` : 'Follow-up Visit ' + num,
      targetInterval: '3 Months',
      procedures: isRtl ? 'التقييم السريري' : 'Clinical Assessment'
    }]);
  };

  const handleUpdateVisit = (index, field, value) => {
    const updated = [...visits];
    updated[index][field] = value;
    setVisits(updated);
  };

  const handleRemoveVisit = (index) => {
    if (visits.length > 2) {
      setVisits(visits.filter((_, i) => i !== index));
    }
  };

  const validateAndNext = (nextStep) => {
    setValidationError('');
    setCurrentStep(nextStep);
  };

  const handleSubmitProtocol = () => {
    if (!title.trim() || !pi.trim()) {
      setValidationError(isRtl ? 'يرجى استكمال الحقول المطلوبة قبل التقديم.' : 'Please complete all required protocol fields before submission.');
      return;
    }

    const payload = {
      id: 'STU-RCT-' + Date.now().toString().slice(-6),
      type: 'RCT',
      title,
      pi,
      subtype,
      irbNumber,
      targetN: parseInt(targetN, 10) || 128,
      status: 'Active Protocol',
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('oskar_studies_registry') || '[]');
      existing.unshift(payload);
      localStorage.setItem('oskar_studies_registry', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }

    navigate('/researcher/studies');
  };

  const content = {
    ar: {
      headerBadge: 'مسار الدراسة المعشاة ذات الشواهد الموحد',
      pageTitle: 'إعداد بروتوكول التجربة السريرية المعشاة',
      pageSubtitle: 'تكوين معايير البروتوكول، طرائق العشوائية، تصميم التعمية، مجموعات التدخل، ونماذج السجل السريري.',
      unsavedDraft: 'مسودة غير محفوظة',
      saveDraft: 'حفظ مسودة',
      step1Num: 'الخطوة 01', step1Title: 'نظرة عامة والتصنيف',
      step2Num: 'الخطوة 02', step2Title: 'البروتوكول والوثائق',
      step3Num: 'الخطوة 03', step3Title: 'منهجية التجربة',
      step4Num: 'الخطوة 04', step4Title: 'نماذج السجل والزيارات',
      step5Num: 'الخطوة 05', step5Title: 'المراجعة والاعتماد',
      valTitle: 'يرجى استكمال الحقول المطلوبة قبل الانتقال',
      s1Heading: 'الخطوة 1: التصنيف الفرعي للتجربة ونظرة عامة',
      s1Sub: 'تحديد معلمات التصميم السريري، حجم العينة، مستويات المعنوية، وبيانات الباحث الرئيسي.',
      lblSubtype: 'التصنيف الفرعي للتجربة المعشاة',
      lblTitle: 'عنوان بروتوكول التجربة السريرية',
      phTitle: 'مثال: تقييم العلاج بالليزر المساعد في المعالجات اللبية المعشاة',
      lblPi: 'الباحث الرئيسي',
      phPi: 'د. سارة العلي - استشاري طب الأسنان',
      lblInst: 'المؤسسة الأكاديمية / الجامعة',
      phInst: 'جامعة العلوم الطبية والأسنان',
      lblCo: 'الفريق البحثي المشارك وصلاحيات الوصول',
      btnAddCo: '+ إضافة باحث مشارك',
      lblTargetN: 'حجم العينة المستهدف',
      lblAlpha: 'مستوى المعنوية (α)',
      lblPower: 'القوة الإحصائية (1-β) %',
      lblDropout: 'نسبة التسرب المتوقعة %',
      btnNext1: 'الانتقال للخطوة 2: وثائق البروتوكول',
      s2Heading: 'الخطوة 2: رفع وثيقة البروتوكول والموافقات الأخلاقية',
      s2Sub: 'تحميل ملف البروتوكول السريري وشهادات موافقة الأخلاقيات.',
      lblProtoFile: 'ملف بروتوكول التجربة السريرية (.pdf, .docx)',
      lblIrbFile: 'شهادة موافقة لجنة الأخلاقيات (.pdf, .docx, .jpg)',
      btnSelectFile: 'اختيار ملف',
      lblIrbNo: 'رقم موافقة لجنة الأخلاقيات',
      phIrbNo: 'مثال: IRB-2026-145',
      lblNctNo: 'معرف سجل التجارب السريرية',
      phNctNo: 'مثال: NCT-2026-00125',
      aiStatusTitle: 'حالة الاستخراج الآلي للبروتوكول السريري',
      aiStatusDesc: 'عند رفع وثيقة البروتوكول، يتم التحقق والتأكد من عناصر المعايير السريرية تلقائياً.',
      btnBack: 'السابق',
      btnNext2: 'الانتقال للخطوة 3: منهجية التجربة',
      s3Heading: 'الخطوة 3: منهجية التجربة وهيكلية المعايير السريرية',
      s3Sub: 'تكوين طرائق العشوائية، بروتوكولات التعمية، إخفاء التخصيص، ومجموعات المعالجة.',
      lblRandMethod: 'طريقة العشوائية',
      lblBlinding: 'بروتوكول التعمية',
      lblConcealment: 'إخفاء التخصيص',
      lblAnalysis: 'استراتيجية التحليل الإحصائي',
      lblPrimaryEp: 'النتيجة السريرية الرئيسية',
      phPrimaryEp: 'مثال: متوسط انخفاض عمق الجيب السني بالملم عند 6 أشهر',
      lblSecondaryEp: 'المحصلات الثانوية',
      phSecondaryEp: 'مثال: نسبة النزف عند السبر، تغير مستوى التعلق السني',
      unblindTitle: 'بروتوكول فك التعمية الطارئ',
      unblindSub: 'تفعيل إجراءات فك التعمية للباحث الرئيسي في حالات الأحداث الجسيمة المسببة للخطر.',
      phUnblind: 'أدخل تفاصيل ومراحل فك التعمية في الحالات الطارئة...',
      armsTitle: 'مجموعات المعالجة والتدخل السريري',
      armsSub: 'تحديد المجموعات التجريبية ومجموعات الشواهد المقارنة.',
      btnAddArm: '+ إضافة مجموعة',
      btnNext3: 'الانتقال للخطوة 4: نماذج السجل والزيارات',
      s4Heading: 'الخطوة 4: نماذج السجل السريري الإلكتروني وجدول الزيارات الممتد',
      s4Sub: 'تحديد وحدات جمع البيانات والجدول الزمني للزيارات الطولية.',
      crfTitle: 'وحدات جمع البيانات السريرية النشطة',
      mod1Title: 'الوحدة 1: الموافقة التنويرية والبيانات الديموغرافية (إجباري)',
      mod1Sub: 'الموافقة الإلكترونية للمشارك، البيانات الشخصية، والتاريخ الطبي.',
      mod2Title: 'الوحدة 2: الفحص السريري ومخطط الأسنان',
      mod2Sub: 'تفعيل مخطط الأسنان الشامل (من 11 إلى 48) والفحص الأولي.',
      mod3Title: 'الوحدة 3: تقييم أنسجة حول الأسنان والإطباق',
      mod3Sub: 'قياس عمق الجيب، النزف، الانحسار، ومسافة الأوفرجيت/الأوفربيت.',
      mod4Title: 'الوحدة 4: المسح ثلاثي الأبعاد والصور الشعاعية',
      mod4Sub: 'رفع ملفات STL الفكية، الأشعة الذروية، ومجموعات الصور السريرية.',
      visitsTitle: 'بناء جدول الزيارات الطولية',
      visitsSub: 'تحديد جدول مواعيد الزيارات والإجراءات المطلوبة لكل زيارة.',
      btnAddVisit: '+ إضافة زيارة',
      btnNext4: 'الانتقال للخطوة 5: المراجعة والاعتماد',
      s5Heading: 'الخطوة 5: مراجعة بروتوكول التجربة وإطلاق بيئة العمل',
      s5Sub: 'مراجعة كافة معايير وتفاصيل التجربة قبل الاعتماد والتسجيل.',
      card1Title: 'حوكمة البروتوكول والتصنيف',
      card2Title: 'الوثائق والأخلاقيات',
      card3Title: 'معمارية المنهجية',
      card4Title: 'المجموعات واستراتيجية التحليل',
      card5Title: 'نماذج السجل الإلكتروني والجدول الزمني',
      btnSubmit: 'اعتماد البروتوكول وإطلاق بيئة العمل',
    },
    en: {
      headerBadge: 'SPIRIT 2025 & CONSORT 2025 Standardized RCT Workflow',
      pageTitle: 'Create Randomized Controlled Trial (RCT)',
      pageSubtitle: 'Configure trial protocol parameters, randomization method, blinding design, intervention arms, and clinical data schema.',
      unsavedDraft: 'Unsaved Draft',
      saveDraft: 'Save Draft',
      step1Num: 'STEP 01', step1Title: 'RCT Overview',
      step2Num: 'STEP 02', step2Title: 'Protocol & Documents',
      step3Num: 'STEP 03', step3Title: 'RCT Methodology',
      step4Num: 'STEP 04', step4Title: 'CRF Schema',
      step5Num: 'STEP 05', step5Title: 'Review & Launch',
      valTitle: 'Please complete the required fields before advancing',
      s1Heading: 'Step 1: RCT Trial Subtype & Protocol Overview',
      s1Sub: 'Specify trial design parameters, target sample size, significance bounds, and investigator information.',
      lblSubtype: 'RCT Trial Subtype Design',
      lblTitle: 'RCT Protocol Title',
      phTitle: 'e.g., Evaluation of Laser Adjunctive Therapy in Periodontal RCT',
      lblPi: 'Principal Investigator (PI)',
      phPi: 'e.g., Dr. Sara Ali',
      lblInst: 'Academic Institution / College',
      phInst: 'e.g., University of Dental Sciences',
      lblCo: 'Co-Researchers & Permissions',
      btnAddCo: '+ Add Co-Researcher',
      lblTargetN: 'Target Sample Size (N)',
      lblAlpha: 'Alpha Level (α)',
      lblPower: 'Power (1-β) %',
      lblDropout: 'Dropout Rate %',
      btnNext1: 'Proceed to Step 2: Protocol Files',
      s2Heading: 'Step 2: SPIRIT 2025 Protocol & IRB Document Upload',
      s2Sub: 'Upload your clinical protocol document and ethical approval certificates.',
      lblProtoFile: 'RCT Protocol Document (.pdf, .docx)',
      lblIrbFile: 'IRB Ethical Approval Certificate (.pdf, .docx, .jpg)',
      btnSelectFile: 'Select File',
      lblIrbNo: 'IRB Approval Number',
      phIrbNo: 'e.g., IRB-2026-145',
      lblNctNo: 'Clinical Trial Registry Number (NCT / Saudi FDA)',
      phNctNo: 'e.g., NCT-2026-00125',
      aiStatusTitle: 'SPIRIT 2025 AI Extraction Status',
      aiStatusDesc: 'Upload your protocol PDF to trigger automated verification and SPIRIT 2025 parsing.',
      btnBack: 'Back',
      btnNext2: 'Proceed to Step 3: RCT Methodology',
      s3Heading: 'Step 3: RCT Methodology & CONSORT 2025 Architecture',
      s3Sub: 'Configure randomization methods, blinding protocols, allocation concealment, and trial arms.',
      lblRandMethod: 'Randomization Method',
      lblBlinding: 'Blinding Protocol',
      lblConcealment: 'Allocation Concealment',
      lblAnalysis: 'Analysis Set Strategy',
      lblPrimaryEp: 'Primary Clinical Endpoint',
      phPrimaryEp: 'e.g., Mean reduction in probing depth (mm) at 6 months',
      lblSecondaryEp: 'Secondary Endpoints (Optional)',
      phSecondaryEp: 'e.g., Bleeding on probing %, CAL change (mm)',
      unblindTitle: 'Emergency Unblinding Protocol Checkpoint',
      unblindSub: 'Enables code-break procedures for principal investigators during serious adverse events (SAE).',
      phUnblind: 'Specify emergency code-break procedures, notification rules, and medical monitor contacts...',
      armsTitle: 'Trial Arms & Intervention Groups',
      armsSub: 'Define intervention and control comparison groups.',
      btnAddArm: '+ Add Arm',
      btnNext3: 'Proceed to Step 4: CRF Schema',
      s4Heading: 'Step 4: RCT Case Report Form (CRF) Schema & Longitudinal Visit Schedule',
      s4Sub: 'Configure data collection modules and longitudinal follow-up visit timeline.',
      crfTitle: 'Active Clinical Data Collection Modules',
      mod1Title: 'Module 1: Informed Consent & Demographics (Mandatory)',
      mod1Sub: 'Mandatory participant e-consent, demographics & systemic medical history.',
      mod2Title: 'Module 2: Dental Examination & FDI Chart Setup',
      mod2Sub: 'Enables FDI tooth-by-tooth charting (Teeth 11–48) and baseline dental exam.',
      mod3Title: 'Module 3: Periodontal & Occlusal Assessment Setup',
      mod3Sub: 'Enables probing depth, BOP %, recession, CAL, overjet/overbite collection.',
      mod4Title: 'Module 4: 3D Scans & Radiographic Attachments Setup',
      mod4Sub: 'Enables STL 3D scans (upper/lower), periapical X-rays & photo sets.',
      visitsTitle: 'Longitudinal Visit Schedule Builder',
      visitsSub: 'Configure protocol visit timeline, intervals, and assigned procedures.',
      btnAddVisit: '+ Add Visit',
      btnNext4: 'Proceed to Step 5: Review & Launch',
      s5Heading: 'Step 5: Review RCT Protocol & Launch Workspace',
      s5Sub: 'Review trial design specifications before protocol registry submission.',
      card1Title: 'RCT Protocol Governance (RCT-01 - RCT-04)',
      card2Title: 'Documents & Ethics (RCT-05 - RCT-07)',
      card3Title: 'Methodology Architecture (RCT-08 - RCT-11)',
      card4Title: 'Arms & Analysis Strategy (RCT-12 - RCT-14)',
      card5Title: 'CRF Setup & Longitudinal Timeline (RCT-15 - RCT-19)',
      btnSubmit: 'Submit Protocol & Open Workspace',
    }
  };

  const t = isRtl ? content.ar : content.en;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 text-on-surface dark:text-gray-100 font-sans antialiased" id="rct-workflow-app">
      {/* Page Header */}
      <div className="border-b border-surface-container-high dark:border-gray-700/60 pb-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-primary dark:text-teal-400 font-semibold uppercase tracking-wider">
            <Icon name="clinical_notes" size="sm" />
            <span id="rct-header-badge">{t.headerBadge}</span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary dark:text-teal-300 font-mono text-xs font-bold whitespace-nowrap">
            Study Type: RCT
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 id="rct-title" className="text-2xl sm:text-3xl font-bold text-on-surface dark:text-white tracking-tight">
              {t.pageTitle}
            </h1>
            <p id="rct-subtitle" className="text-xs sm:text-sm text-on-surface-variant dark:text-gray-300 max-w-2xl mt-1">
              {t.pageSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 rounded-xl border border-primary/30 bg-primary/10 text-primary dark:text-teal-300 font-bold text-xs hover:bg-primary/20 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Icon name="save" size="sm" />
              <span id="rct-btn-draft">{draftSaved ? (isRtl ? 'تم حفظ المسودة!' : 'Saved Draft!') : t.saveDraft}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Navigation Header */}
      <div className="bg-surface-container-lowest dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-surface-container-high dark:border-gray-700/60 shadow-xs">
        <div className="grid grid-cols-5 gap-2 text-xs font-medium">
          {[
            { step: 1, num: t.step1Num, label: t.step1Title },
            { step: 2, num: t.step2Num, label: t.step2Title },
            { step: 3, num: t.step3Num, label: t.step3Title },
            { step: 4, num: t.step4Num, label: t.step4Title },
            { step: 5, num: t.step5Num, label: t.step5Title },
          ].map((s) => {
            const isActive = currentStep === s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step)}
                id={`rct-step-btn-${s.step}`}
                className={`rct-step-btn p-2.5 rounded-xl border flex items-center justify-center sm:justify-start gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary dark:text-teal-300 font-bold shadow-xs'
                    : 'border-surface-container-high dark:border-gray-700 text-on-surface-variant dark:text-gray-400 hover:bg-surface-container-low'
                }`}
              >
                <span
                  className={`rct-step-badge w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    isActive
                      ? 'bg-primary text-white dark:bg-teal-400 dark:text-gray-950'
                      : 'bg-surface-container-high dark:bg-gray-700 text-on-surface-variant dark:text-gray-400'
                  }`}
                >
                  {s.step}
                </span>
                <div className="text-start hidden md:block leading-tight">
                  <span className="block text-[9px] uppercase font-mono tracking-wider opacity-75">{s.num}</span>
                  <span className="font-bold text-[11px] truncate block">{s.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Validation Banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <Icon name="error" size="sm" className="text-rose-500" />
            <span>{validationError}</span>
          </div>
          <button
            type="button"
            onClick={() => setValidationError('')}
            className="text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* STEP PANELS CONTAINER */}
      <div className="space-y-6">
        {/* STEP 01: RCT OVERVIEW & SUBTYPE */}
        {currentStep === 1 && (
          <div className="rct-panel bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 shadow-xs space-y-6">
            <div className="border-b border-surface-container dark:border-gray-700 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-on-surface dark:text-white">
                {t.s1Heading}
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-gray-400">
                {t.s1Sub}
              </p>
            </div>

            {/* RCT Subtype Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">
                {t.lblSubtype} <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {[
                  { id: 'parallel', title: isRtl ? 'المجموعات المتوازية' : 'Parallel Group', desc: isRtl ? 'مقارنة معيارية بين مجموعتين مستقلتين.' : 'Standard parallel arm comparison trial.' },
                  { id: 'crossover', title: isRtl ? 'التصميم التبخلي' : 'Crossover Trial', desc: isRtl ? 'فترات تتابع مع فترة غسيل سريرية.' : 'Sequential periods with washout.' },
                  { id: 'cluster', title: isRtl ? 'العشوائية العنقودية' : 'Cluster Randomized', desc: isRtl ? 'عشوائية حسب المراكز أو العيادات.' : 'Randomization by clinic or group.' },
                  { id: 'non_inferiority', title: isRtl ? 'دراسة التكافؤ' : 'Non-Inferiority', desc: isRtl ? 'اختبار هامش عدم الدونية (δ).' : 'Tests non-inferiority margin δ.' },
                ].map((item) => {
                  const isSelected = subtype === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSubtype(item.id)}
                      className={`rct-subtype-card cursor-pointer p-4 rounded-xl space-y-2 transition-all ${
                        isSelected
                          ? 'border-2 border-primary dark:border-teal-400 bg-primary/10 dark:bg-teal-950/40 shadow-xs'
                          : 'border border-surface-container-high dark:border-gray-700 bg-surface-container-lowest dark:bg-dark-card hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`rct-subtype-title text-xs ${isSelected ? 'font-extrabold text-primary dark:text-teal-300' : 'font-bold text-on-surface dark:text-white'}`}>
                          {item.title}
                        </span>
                        <span className={`rct-subtype-badge w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${isSelected ? 'bg-primary dark:bg-teal-400 text-white dark:text-gray-950' : 'border border-gray-400 bg-transparent'}`}>
                          {isSelected ? '✓' : ''}
                        </span>
                      </div>
                      <p className={`text-[11px] ${isSelected ? 'text-on-surface dark:text-gray-200' : 'text-on-surface-variant dark:text-gray-400'}`}>
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Core Trial Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblTitle} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.phTitle}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblPi} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={pi}
                  onChange={(e) => setPi(e.target.value)}
                  placeholder={t.phPi}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblInst}
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder={t.phInst}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                />
              </div>

              {/* Co-Researchers Builder */}
              <div className="md:col-span-2 space-y-2 p-3.5 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-surface-container dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface dark:text-white block">
                    {t.lblCo}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCoResearcher}
                    className="text-primary dark:text-teal-400 font-bold hover:underline text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Icon name="add" size="sm" /> {t.btnAddCo}
                  </button>
                </div>

                <div className="space-y-2">
                  {coResearchers.map((co) => (
                    <div key={co.id} className="flex items-center gap-2">
                      <input
                        type="email"
                        value={co.email}
                        onChange={(e) => handleUpdateCoResearcher(co.id, 'email', e.target.value)}
                        placeholder="co-researcher@university.edu"
                        className="flex-1 bg-surface-container-lowest dark:bg-dark-card p-2 rounded-lg border border-surface-container-high dark:border-gray-700 outline-none text-xs text-on-surface dark:text-white"
                      />
                      <select
                        value={co.role}
                        onChange={(e) => handleUpdateCoResearcher(co.id, 'role', e.target.value)}
                        className="bg-surface-container-lowest dark:bg-dark-card p-2 rounded-lg border border-surface-container-high dark:border-gray-700 outline-none text-xs text-on-surface dark:text-white"
                      >
                        <option value="read_only">{isRtl ? 'قراءة فقط' : 'Read-Only'}</option>
                        <option value="data_entry">{isRtl ? 'إدخال بيانات' : 'Data Entry'}</option>
                        <option value="full_edit">{isRtl ? 'تعديل كامل' : 'Full Edit'}</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleRemoveCoResearcher(co.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Size Parameters */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblTargetN} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={targetN}
                  min="2"
                  max="10000"
                  onChange={(e) => setTargetN(e.target.value)}
                  placeholder="128"
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-mono font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-on-surface dark:text-gray-200">{t.lblAlpha}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={alpha}
                    onChange={(e) => setAlpha(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-on-surface dark:text-gray-200">{t.lblPower}</label>
                  <input
                    type="number"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-on-surface dark:text-gray-200">{t.lblDropout}</label>
                  <input
                    type="number"
                    value={dropoutRate}
                    onChange={(e) => setDropoutRate(e.target.value)}
                    className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-container dark:border-gray-700">
              <button
                type="button"
                onClick={() => validateAndNext(2)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-teal-700 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
              >
                <span>{t.btnNext1}</span>
                <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 02: PROTOCOL DOCUMENT UPLOAD & AI PARSING */}
        {currentStep === 2 && (
          <div className="rct-panel bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 shadow-xs space-y-6">
            <div className="border-b border-surface-container dark:border-gray-700 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-on-surface dark:text-white">
                {t.s2Heading}
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-gray-400">
                {t.s2Sub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document Upload 1: Protocol Document */}
              <div className="p-5 border-2 border-dashed border-surface-container-high dark:border-gray-700 rounded-2xl bg-surface-container-low/50 dark:bg-dark-surface/50 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-teal-400 flex items-center justify-center mx-auto">
                  <Icon name="description" size="md" />
                </div>
                <div>
                  <span className="font-bold text-xs text-on-surface dark:text-white block">
                    {t.lblProtoFile} <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] text-on-surface-variant dark:text-gray-400">Format: .pdf, .docx</span>
                </div>
                <input
                  type="file"
                  id="rct-file-input"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleProtocolFileChange}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('rct-file-input').click()}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700 font-bold text-xs text-on-surface dark:text-white hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  {t.btnSelectFile}
                </button>

                {protocolFile && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between text-emerald-700 dark:text-emerald-300 font-mono">
                    <span className="font-bold truncate">{protocolFile.fileName} ({protocolFile.fileSize})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-white font-bold shrink-0">Selected</span>
                  </div>
                )}
              </div>

              {/* Document Upload 2: Ethical / IRB Approval */}
              <div className="p-5 border-2 border-dashed border-surface-container-high dark:border-gray-700 rounded-2xl bg-surface-container-low/50 dark:bg-dark-surface/50 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-teal-400 flex items-center justify-center mx-auto">
                  <Icon name="verified" size="md" />
                </div>
                <div>
                  <span className="font-bold text-xs text-on-surface dark:text-white block">
                    {t.lblIrbFile} <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] text-on-surface-variant dark:text-gray-400">Format: .pdf, .docx, .jpg</span>
                </div>
                <input
                  type="file"
                  id="rct-irb-file-input"
                  accept=".pdf,.docx,.jpg"
                  className="hidden"
                  onChange={handleIrbFileChange}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('rct-irb-file-input').click()}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700 font-bold text-xs text-on-surface dark:text-white hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  {t.btnSelectFile}
                </button>

                {irbFile && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between text-emerald-700 dark:text-emerald-300 font-mono">
                    <span className="font-bold truncate">{irbFile.fileName} ({irbFile.fileSize})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500 text-white font-bold shrink-0">Selected</span>
                  </div>
                )}
              </div>

              {/* Registration & IRB Strings */}
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblIrbNo} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={irbNumber}
                  onChange={(e) => setIrbNumber(e.target.value)}
                  placeholder={t.phIrbNo}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblNctNo}
                </label>
                <input
                  type="text"
                  value={nctNumber}
                  onChange={(e) => setNctNumber(e.target.value)}
                  placeholder={t.phNctNo}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                />
              </div>
            </div>

            {/* AI Extraction Status Box */}
            <div className="p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-surface-container dark:border-gray-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary dark:text-teal-400 font-bold">
                  <Icon name="psychology" size="sm" />
                  <span>{t.aiStatusTitle}</span>
                </div>
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${protocolFile ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-600 dark:text-amber-300'}`}>
                  {protocolFile ? (isRtl ? 'تم التحقق من الهيكل' : 'Verified SPIRIT Schema') : (isRtl ? 'في انتظار رفع الملف' : 'Pending Protocol Upload')}
                </span>
              </div>
              <p className="text-on-surface-variant dark:text-gray-400 text-[11px]">
                {t.aiStatusDesc}
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-surface-container dark:border-gray-700">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold text-xs hover:bg-surface-container-low transition-all flex items-center gap-2 cursor-pointer"
              >
                <Icon name="arrow_back" size="sm" className={isRtl ? 'rotate-180' : ''} />
                <span>{t.btnBack}</span>
              </button>
              <button
                type="button"
                onClick={() => validateAndNext(3)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-teal-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{t.btnNext2}</span>
                <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 03: RCT METHODOLOGY CONFIGURATION */}
        {currentStep === 3 && (
          <div className="rct-panel bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 shadow-xs space-y-6">
            <div className="border-b border-surface-container dark:border-gray-700 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-on-surface dark:text-white">
                {t.s3Heading}
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-gray-400">
                {t.s3Sub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Randomization Method */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblRandMethod} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={randomizationMethod}
                  onChange={(e) => setRandomizationMethod(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                >
                  <option value="simple">{isRtl ? 'عشوائية بسيطة' : 'Simple Randomization'}</option>
                  <option value="block">{isRtl ? 'عشوائية بالكتل المترادفة' : 'Permuted Block Randomization'}</option>
                  <option value="stratified">{isRtl ? 'عشوائية طبقية' : 'Stratified Randomization'}</option>
                  <option value="minimization">{isRtl ? 'التقليل الأدنى التكيفي' : 'Minimization (Covariate-Adaptive)'}</option>
                </select>
              </div>

              {/* Blinding Protocol */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblBlinding} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={blindingProtocol}
                  onChange={(e) => setBlindingProtocol(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                >
                  <option value="double">{isRtl ? 'مزدوج التعمية' : 'Double-Blind (Participant & Investigator)'}</option>
                  <option value="single">{isRtl ? 'أحادي التعمية' : 'Single-Blind (Participant Only)'}</option>
                  <option value="triple">{isRtl ? 'ثلاثي التعمية' : 'Triple-Blind (Participant, PI, Statistician)'}</option>
                  <option value="open">{isRtl ? 'دراسة مفتوحة بدون تعمية' : 'Open-Label (Unblinded)'}</option>
                </select>
              </div>

              {/* Allocation Concealment */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblConcealment} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={allocationConcealment}
                  onChange={(e) => setAllocationConcealment(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                >
                  <option value="pharmacy">{isRtl ? 'صيدلية مركزية أو نظام شبكي آلي' : 'Central Pharmacy / Web Randomization System'}</option>
                  <option value="snose">{isRtl ? 'أظرف معتمة مغلقة متسلسلة' : 'Sequentially Numbered Opaque Sealed Envelopes (SNOSE)'}</option>
                  <option value="ivrs">{isRtl ? 'نظام استجابة تفاعلي شبكي' : 'Interactive Voice / Web Response System (IVRS/IWRS)'}</option>
                </select>
              </div>

              {/* Analysis Set Strategy */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblAnalysis} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={analysisStrategy}
                  onChange={(e) => setAnalysisStrategy(e.target.value)}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                >
                  <option value="itt">{isRtl ? 'تحليل حسب نية العلاج' : 'Intention-To-Treat (ITT) Primary Strategy'}</option>
                  <option value="per_protocol">{isRtl ? 'تحليل حسب البروتوكول' : 'Per-Protocol (PP) Secondary Strategy'}</option>
                </select>
              </div>

              {/* Primary Endpoint */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblPrimaryEp} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={primaryEndpoint}
                  onChange={(e) => setPrimaryEndpoint(e.target.value)}
                  placeholder={t.phPrimaryEp}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                />
              </div>

              {/* Secondary Endpoints */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-on-surface dark:text-gray-200">
                  {t.lblSecondaryEp}
                </label>
                <input
                  type="text"
                  value={secondaryEndpoints}
                  onChange={(e) => setSecondaryEndpoints(e.target.value)}
                  placeholder={t.phSecondaryEp}
                  className="w-full bg-surface-container-low dark:bg-dark-surface p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white font-medium"
                />
              </div>

              {/* Emergency Unblinding Protocol Checkpoint */}
              <div className="md:col-span-2 p-3.5 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-surface-container dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Icon name="lock_reset" size="sm" className="text-amber-500" />
                    <div>
                      <span className="font-bold text-xs text-on-surface dark:text-white block">
                        {t.unblindTitle}
                      </span>
                      <span className="text-[11px] text-on-surface-variant dark:text-gray-400 block">
                        {t.unblindSub}
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={unblindingEnabled}
                      onChange={(e) => setUnblindingEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] ltr:after:left-[2px] rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                {unblindingEnabled && (
                  <div className="pt-2 border-t border-surface-container dark:border-gray-700/60">
                    <textarea
                      rows={2}
                      value={unblindingDetails}
                      onChange={(e) => setUnblindingDetails(e.target.value)}
                      placeholder={t.phUnblind}
                      className="w-full bg-surface-container-lowest dark:bg-dark-card p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 outline-none text-xs text-on-surface dark:text-white"
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Repeatable Trial Arms Builder */}
              <div className="md:col-span-2 space-y-3 p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-surface-container dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-on-surface dark:text-white block">
                      {t.armsTitle} <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] text-on-surface-variant dark:text-gray-400">
                      {t.armsSub}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddArm}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs hover:bg-teal-700 flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Icon name="add" size="sm" /> {t.btnAddArm}
                  </button>
                </div>

                <div className="space-y-2">
                  {arms.map((arm, idx) => (
                    <div
                      key={arm.armId || idx}
                      className="p-3 rounded-lg bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs items-center"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-gray-400">Arm Name</label>
                        <input
                          type="text"
                          value={arm.armName}
                          onChange={(e) => handleUpdateArm(idx, 'armName', e.target.value)}
                          className="bg-surface-container-low dark:bg-dark-surface p-2 rounded-md border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-gray-400">Arm Type</label>
                        <select
                          value={arm.armType}
                          onChange={(e) => handleUpdateArm(idx, 'armType', e.target.value)}
                          className="bg-surface-container-low dark:bg-dark-surface p-2 rounded-md border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white"
                        >
                          <option value="intervention">Intervention</option>
                          <option value="control">Control</option>
                          <option value="placebo">Placebo</option>
                          <option value="standard_of_care">Standard of Care</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex flex-col gap-1">
                          <label className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-gray-400">Regimen</label>
                          <input
                            type="text"
                            value={arm.regimen}
                            onChange={(e) => handleUpdateArm(idx, 'regimen', e.target.value)}
                            className="bg-surface-container-low dark:bg-dark-surface p-2 rounded-md border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white"
                          />
                        </div>
                        {arms.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveArm(idx)}
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-surface-container dark:border-gray-700">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold text-xs hover:bg-surface-container-low transition-all flex items-center gap-2 cursor-pointer"
              >
                <Icon name="arrow_back" size="sm" className={isRtl ? 'rotate-180' : ''} />
                <span>{t.btnBack}</span>
              </button>
              <button
                type="button"
                onClick={() => validateAndNext(4)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-teal-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{t.btnNext3}</span>
                <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 04: RCT CLINICAL CRF SCHEMA & VISIT TIMELINE */}
        {currentStep === 4 && (
          <div className="rct-panel bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 shadow-xs space-y-6">
            <div className="border-b border-surface-container dark:border-gray-700 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-on-surface dark:text-white">
                {t.s4Heading}
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-gray-400">
                {t.s4Sub}
              </p>
            </div>

            {/* CRF Data Collection Modules Selection */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">
                {t.crfTitle}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="p-3.5 rounded-xl border border-primary/30 bg-primary/10 dark:bg-teal-950/30 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={crfModules.demographics}
                    disabled
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <span className="font-bold text-on-surface dark:text-white block">{t.mod1Title}</span>
                    <span className="text-[11px] text-on-surface-variant dark:text-gray-400 block">{t.mod1Sub}</span>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl border border-primary/30 bg-primary/10 dark:bg-teal-950/30 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={crfModules.dentalExam}
                    onChange={(e) => setCrfModules({ ...crfModules, dentalExam: e.target.checked })}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <span className="font-bold text-on-surface dark:text-white block">{t.mod2Title}</span>
                    <span className="text-[11px] text-on-surface-variant dark:text-gray-400 block">{t.mod2Sub}</span>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl border border-primary/30 bg-primary/10 dark:bg-teal-950/30 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={crfModules.perioOcclusal}
                    onChange={(e) => setCrfModules({ ...crfModules, perioOcclusal: e.target.checked })}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <span className="font-bold text-on-surface dark:text-white block">{t.mod3Title}</span>
                    <span className="text-[11px] text-on-surface-variant dark:text-gray-400 block">{t.mod3Sub}</span>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl border border-primary/30 bg-primary/10 dark:bg-teal-950/30 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={crfModules.imaging}
                    onChange={(e) => setCrfModules({ ...crfModules, imaging: e.target.checked })}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <span className="font-bold text-on-surface dark:text-white block">{t.mod4Title}</span>
                    <span className="text-[11px] text-on-surface-variant dark:text-gray-400 block">{t.mod4Sub}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Repeatable Longitudinal Visit Schedule Builder */}
            <div className="space-y-3 p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-surface-container dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-on-surface dark:text-white block">
                    {t.visitsTitle} <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] text-on-surface-variant dark:text-gray-400">
                    {t.visitsSub}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddVisit}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs hover:bg-teal-700 flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <Icon name="add" size="sm" /> {t.btnAddVisit}
                </button>
              </div>

              <div className="space-y-2">
                {visits.map((v, idx) => (
                  <div
                    key={v.visitNumber || idx}
                    className="p-3 rounded-lg bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs items-center"
                  >
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-gray-400">Visit Name</label>
                      <input
                        type="text"
                        value={v.visitName}
                        onChange={(e) => handleUpdateVisit(idx, 'visitName', e.target.value)}
                        className="bg-surface-container-low dark:bg-dark-surface p-2 rounded-md border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-gray-400">Target Interval</label>
                      <input
                        type="text"
                        value={v.targetInterval}
                        onChange={(e) => handleUpdateVisit(idx, 'targetInterval', e.target.value)}
                        className="bg-surface-container-low dark:bg-dark-surface p-2 rounded-md border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-on-surface-variant dark:text-gray-400">Procedures</label>
                        <input
                          type="text"
                          value={v.procedures}
                          onChange={(e) => handleUpdateVisit(idx, 'procedures', e.target.value)}
                          className="bg-surface-container-low dark:bg-dark-surface p-2 rounded-md border border-surface-container-high dark:border-gray-700 focus:border-primary outline-none text-on-surface dark:text-white"
                        />
                      </div>
                      {visits.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVisit(idx)}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold p-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-surface-container dark:border-gray-700">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold text-xs hover:bg-surface-container-low transition-all flex items-center gap-2 cursor-pointer"
              >
                <Icon name="arrow_back" size="sm" className={isRtl ? 'rotate-180' : ''} />
                <span>{t.btnBack}</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-teal-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{t.btnNext4}</span>
                <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 05: RCT REVIEW & LAUNCH */}
        {currentStep === 5 && (
          <div className="rct-panel bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 shadow-xs space-y-6">
            <div className="border-b border-surface-container dark:border-gray-700 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-on-surface dark:text-white">
                {t.s5Heading}
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-gray-400">
                {t.s5Sub}
              </p>
            </div>

            {/* Checkpoints Comprehensive Review Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Card 1: Overview & Governance */}
              <div className="p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-surface-container dark:border-gray-700 space-y-2">
                <span className="font-bold text-primary dark:text-teal-300 block uppercase tracking-wider text-[10px]">
                  {t.card1Title}
                </span>
                <div className="space-y-1">
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Title:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white">{title || 'Untitled Protocol'}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">PI:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white">{pi || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Subtype:</span>{' '}
                    <span className="font-bold text-primary dark:text-teal-300 capitalize">{subtype.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Sample Size (N):</span>{' '}
                    <span className="font-mono font-bold text-on-surface dark:text-white">{targetN}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Documents & Ethics */}
              <div className="p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-surface-container dark:border-gray-700 space-y-2">
                <span className="font-bold text-primary dark:text-teal-300 block uppercase tracking-wider text-[10px]">
                  {t.card2Title}
                </span>
                <div className="space-y-1 font-mono text-[11px]">
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Protocol File:</span>{' '}
                    <span className={`font-bold ${protocolFile ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {protocolFile ? protocolFile.fileName : 'Not uploaded'}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">IRB Certificate:</span>{' '}
                    <span className={`font-bold ${irbFile ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {irbFile ? irbFile.fileName : 'Not uploaded'}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">IRB Approval #:</span>{' '}
                    <span className="font-bold text-primary dark:text-teal-300">{irbNumber || 'Pending'}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Methodology Architecture */}
              <div className="p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-surface-container dark:border-gray-700 space-y-2">
                <span className="font-bold text-primary dark:text-teal-300 block uppercase tracking-wider text-[10px]">
                  {t.card3Title}
                </span>
                <div className="space-y-1">
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Randomization:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white capitalize">{randomizationMethod}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Concealment:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white capitalize">{allocationConcealment}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Blinding:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white capitalize">{blindingProtocol}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Emergency Unblinding:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white">{unblindingEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Trial Arms & Endpoints */}
              <div className="p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-surface-container dark:border-gray-700 space-y-2">
                <span className="font-bold text-primary dark:text-teal-300 block uppercase tracking-wider text-[10px]">
                  {t.card4Title}
                </span>
                <div className="space-y-1">
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Trial Arms:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white">{arms.map(a => a.armName).join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Analysis Strategy:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white uppercase">{analysisStrategy}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Primary Endpoint:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white">{primaryEndpoint || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Card 5: CRF & Longitudinal Visits */}
              <div className="md:col-span-2 p-4 rounded-xl bg-surface-container-low dark:bg-dark-surface border border-surface-container dark:border-gray-700 space-y-2">
                <span className="font-bold text-primary dark:text-teal-300 block uppercase tracking-wider text-[10px]">
                  {t.card5Title}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Active CRF Modules:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white">
                      {Object.keys(crfModules).filter(k => crfModules[k]).join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant dark:text-gray-400">Configured Timeline Visits:</span>{' '}
                    <span className="font-bold text-on-surface dark:text-white">
                      {visits.map(v => v.visitName).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-surface-container dark:border-gray-700">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold text-xs hover:bg-surface-container-low transition-all flex items-center gap-2 cursor-pointer"
              >
                <Icon name="arrow_back" size="sm" className={isRtl ? 'rotate-180' : ''} />
                <span>{t.btnBack}</span>
              </button>
              <button
                type="button"
                id="rct-submit-btn"
                onClick={handleSubmitProtocol}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-teal-700 transition-all shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Icon name="rocket_launch" size="sm" />
                <span>{t.btnSubmit}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyCreateRctPage;
