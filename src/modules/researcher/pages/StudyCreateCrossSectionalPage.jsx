import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';
import QuestionnaireBuilder from '../components/QuestionnaireBuilder';
import InstrumentSelector from '../components/InstrumentSelector';
import DistributionHub from '../components/DistributionHub';
import { calculateCronbachAlpha } from '../../../services/statisticalService';
import { generateMultiSheetExcelWorkbook } from '../../../services/excelExportService';
import { generateSpssSyntaxScript } from '../../../services/spssExportService';
import { saveStudy, addAuditLog } from '../../../services/studyStorageService';
import { SupervisorApprovalGate } from '../components/SupervisorApprovalGate';
import { ExternalReviewerModal } from '../components/ExternalReviewerModal';
import { StlViewer3D } from '../components/StlViewer3D';
import { CephalometricLandmarkCard } from '../components/CephalometricLandmarkCard';

export const StudyCreateCrossSectionalPage = () => {
  const { isRtl } = useI18n();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [draftSaved, setDraftSaved] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Step 1: Objective & Target (CS-01, CS-02, CS-06)
  const [title, setTitle] = useState(
    isRtl
      ? 'مسح مقطعي لتقييم جودة الحياة المتعلقة بالصحة الفموية (OHIP-14) لدى مرضى التعويضات السنية'
      : 'Cross-Sectional Assessment of Oral Health-Related Quality of Life (OHIP-14)'
  );
  const [subtype, setSubtype] = useState('Prevalence Survey');
  const [pi, setPi] = useState(
    isRtl ? 'د. مريم الشمري - قسم طب أسنان المجتمع' : 'Dr. Maryam Al-Shammari - Community Dentistry'
  );
  const [targetPop, setTargetPop] = useState(
    isRtl
      ? 'البالغون المراجعون للعيادات التخصصية خلال الفصل الدراسي الثاني'
      : 'Adults attending specialized outpatient clinics during Q2'
  );

  // Step 2: Protocol & Consent (CS-03..05)
  const [irbNumber, setIrbNumber] = useState('IRB-2026-SURV-331');
  const [consentText, setConsentText] = useState(
    isRtl
      ? 'أهلاً بكم في هذا المسح البحثي السريري. المشاركة طوعية بالكامل، وسرية، ومجهولة الهوية. بالنقر على "أوافق"، فإنك توافق على المشاركة.'
      : 'Welcome to this clinical research survey. Participation is entirely voluntary, confidential, and anonymized. By clicking "I Agree", you consent to participate.'
  );

  // Step 3: Sample Size & Questionnaire Builder (CS-08..18)
  const [targetN, setTargetN] = useState('384');
  const [marginError, setMarginError] = useState('5');
  const [samplingMethod, setSamplingMethod] = useState('Convenience Sampling');
  const [selectedInstruments, setSelectedInstruments] = useState(['OHIP-14']);
  const [builderQuestions, setBuilderQuestions] = useState([]);

  // Post-Launch Execution State (CS-25..37)
  const [isDeployed, setIsDeployed] = useState(false);
  const [supervisorStatus, setSupervisorStatus] = useState('Pending Supervisor Review');
  const [showDentalImaging, setShowDentalImaging] = useState(false);
  const [responseCount, setResponseCount] = useState(142);
  const [participants, setParticipants] = useState([
    { id: 'CS-0001', age: 24, sex: 'Male', status: 'Completed', score: 12, date: '2026-03-01' },
    { id: 'CS-0002', age: 27, sex: 'Female', status: 'Completed', score: 8, date: '2026-03-02' },
    { id: 'CS-0003', age: 31, sex: 'Male', status: 'Completed', score: 15, date: '2026-03-03' },
  ]);

  // Step 4: Alpha Reliability & Distribution (CS-19, CS-25..26)
  const getMatrixFromParticipants = () => {
    if (participants && participants.length >= 2) {
      return participants.map((p, idx) => {
        const base = p.score || 10;
        return [
          Math.max(1, Math.min(5, Math.round(base / 3))),
          Math.max(1, Math.min(5, Math.round((base + (idx % 2)) / 3))),
          Math.max(1, Math.min(5, Math.round((base + (idx % 3)) / 3))),
          Math.max(1, Math.min(5, Math.round((base - (idx % 2)) / 3))),
          Math.max(1, Math.min(5, Math.round((base + 1) / 3))),
        ];
      });
    }
    return null;
  };
  const alphaData = calculateCronbachAlpha(getMatrixFromParticipants() || undefined);
  const [publicUrl] = useState('https://oskar-medstat.org/survey/live?id=CS-2026-881');

  // Modal States
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regAge, setRegAge] = useState(25);
  const [regSex, setRegSex] = useState('Female');
  const [aiGuardWarning, setAiGuardWarning] = useState('');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [signature, setSignature] = useState('');
  const [showDataCollection, setShowDataCollection] = useState(false);
  const [showReviewerModal, setShowReviewerModal] = useState(false);

  const handleSaveDraft = () => {
    saveStudy({
      id: 'STU-CS-DRAFT',
      title,
      pi,
      subtype,
      targetN,
      status: 'Draft',
      type: 'CROSS_SECTIONAL'
    });
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleExcelExport = () => {
    generateMultiSheetExcelWorkbook({
      filename: `OSKAR_CrossSectional_${(title || 'Study').replace(/\s+/g, '_')}.xlsx`,
      studyMetadata: { id: 'STU-CS-2026', title, pi, subtype, type: 'CROSS_SECTIONAL', irbNumber, targetN },
      participants,
      dataDictionary: [
        { field: 'ID', type: 'Identifier', label: 'Research ID' },
        { field: 'AGE', type: 'Numeric', label: 'Participant Age' },
        { field: 'SEX', type: 'Categorical', label: 'Sex' },
        { field: 'SCORE', type: 'Numeric', label: 'OHIP-14 Score (0-56)' },
        { field: 'STATUS', type: 'Categorical', label: 'Data Collection Status' },
        { field: 'DATE', type: 'Date', label: 'Response Date' },
      ],
      exclusions: [],
      auditLogs: [
        { timestamp: new Date().toISOString(), action: 'Survey Deployed & Live', user: pi, details: 'Cross-sectional survey launched' },
        { timestamp: new Date().toISOString(), action: 'Multi-Sheet Excel Workbook Exported', user: pi, details: 'Downloaded 5-sheet workbook' }
      ]
    });
  };

  const handleSpssExport = () => {
    generateSpssSyntaxScript({
      studyTitle: title,
      dataDictionary: [
        { field: 'ID', type: 'Identifier', label: 'Research ID' },
        { field: 'AGE', type: 'Numeric', label: 'Participant Age' },
        { field: 'SEX', type: 'Categorical', label: 'Sex' },
        { field: 'SCORE', type: 'Numeric', label: 'OHIP-14 Score (0-56)' },
        { field: 'STATUS', type: 'Categorical', label: 'Data Collection Status' },
      ],
      datasetName: 'CS_Survey_Data'
    });
  };

  const toggleInstrument = (instId) => {
    if (selectedInstruments.includes(instId)) {
      setSelectedInstruments(selectedInstruments.filter((i) => i !== instId));
    } else {
      setSelectedInstruments([...selectedInstruments, instId]);
    }
  };

  const validateAndNext = () => {
    setValidationError('');
    if (currentStep === 1) {
      if (!title.trim() || !pi.trim() || !targetPop.trim()) {
        setValidationError(isRtl ? 'يرجى إدخال عنوان المسح، الباحث الرئيسي، وإطار العينة.' : 'Please enter the Survey Title, Principal Investigator, and Target Population.');
        return;
      }
    } else if (currentStep === 2) {
      if (!irbNumber.trim() || !consentText.trim()) {
        setValidationError(isRtl ? 'يرجى إدخال رقم موافقة الأخلاقيات ونص الموافقة المستنيرة.' : 'Please enter the IRB Certificate Number and Respondent Consent Text.');
        return;
      }
    }
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleSubmit = () => {
    if (!title.trim() || !pi.trim() || !irbNumber.trim()) {
      setValidationError(isRtl ? 'يرجى استكمال الحقول المطلوبة قبل التقديم.' : 'Please complete required fields before submitting.');
      return;
    }
    setIsDeployed(true);
    const payload = {
      id: 'STU-CS-' + Date.now().toString().slice(-6),
      type: 'CROSS_SECTIONAL',
      title,
      pi,
      subtype,
      irbNumber,
      targetN: parseInt(targetN, 10) || 384,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('oskar_studies_registry') || '[]');
      existing.unshift(payload);
      localStorage.setItem('oskar_studies_registry', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }
  };

  // Participant Registration & AI Guard Validation
  const handleRegisterParticipant = () => {
    setAiGuardWarning('');
    if (regAge < 18 || regAge > 60) {
      setAiGuardWarning(isRtl ? '⚠️ تنبيه AI Guard: سن المشارك خارج النطاق الفعلي المعرف بالبروتوكول (18-60 سنة).' : '⚠️ AI Guard Warning: Participant age outside protocol range (18-60 years).');
      return;
    }

    setShowRegisterModal(false);
    setShowConsentModal(true);
  };

  const handleConsentSign = () => {
    if (!signature.trim()) return;
    setShowConsentModal(false);
    setShowDataCollection(true);
  };

  const handleCompleteDataCollection = () => {
    const nextId = `CS-000${participants.length + 1}`;
    const newP = {
      id: nextId,
      age: parseInt(regAge, 10) || 25,
      sex: regSex,
      status: 'Completed',
      score: Math.floor(Math.random() * 15) + 5,
      date: new Date().toISOString().split('T')[0],
    };

    setParticipants([newP, ...participants]);
    setResponseCount(responseCount + 1);
    setShowDataCollection(false);
    setSignature('');
  };

  const content = {
    ar: {
      headerBadge: 'مسار المسح المقطعي السريري المعياري',
      pageTitle: 'إعداد ونشر المسح المقطعي',
      pageSubtitle: 'تقييم النقطة الزمنية الواحدة، منشئ الاستبيانات السريرية، ومحسب ثبات كرونباخ ألفا (α ≥ 0.70).',
      unsavedDraft: 'مسودة غير محفوظة',
      saveDraft: 'حفظ مسودة',
      step1Num: 'الخطوة 01', step1Title: 'هدف المسح والمستهدفين',
      step2Num: 'الخطوة 02', step2Title: 'البروتوكول والموافقة',
      step3Num: 'الخطوة 03', step3Title: 'بناء الاستبيان والأدوات',
      step4Num: 'الخطوة 04', step4Title: 'اختبار ألفا والقنوات',
      step5Num: 'الخطوة 05', step5Title: 'المراجعة والتوزيع',
      valTitle: 'يرجى استكمال الحقول المطلوبة قبل الانتقال',
      s1Heading: 'معلومات المسح والمجتمع المستهدف (CS-01, CS-02, CS-06)',
      lblTitle: 'عنوان المسح المقطعي',
      phTitle: 'مثال: مسح مقطعي لتقييم جودة الحياة المتعلقة بالصحة الفموية لدى مرضى التعويضات السنية',
      lblSubtype: 'نموذج المسح المقطعي',
      lblPi: 'الباحث الرئيسي',
      phPi: 'د. مريم الشمري - قسم طب أسنان المجتمع',
      lblTargetPop: 'المجتمع المستهدف وإطار المعاينة',
      phTargetPop: 'مثال: البالغون المراجعون للعيادات التخصصية خلال الفصل الدراسي الثاني',
      s2Heading: 'الأخلاقيات والموافقة المستنيرة (CS-03..05)',
      lblIrb: 'رقم موافقة لجنة الأخلاقيات',
      phIrb: 'مثال: IRB-2026-SURV-331',
      lblConsentText: 'نص الموافقة المستنيرة للمشاركين',
      s3Heading: 'حجم العينة وبناء أسئلة الاستبيان (CS-08..18)',
      lblTargetN: 'حجم العينة المستهدف',
      lblMarginError: 'نسبة هامش الخطأ',
      lblSamplingMethod: 'طريقة المعاينة',
      sampAlertText: 'تنبيه المنهجية: عشوائية اختيار العينة تختلف تماماً عن التخصيص العشوائي للعلاج (المعطل افتراضياً).',
      s4Heading: 'ثبات كرونباخ ألفا وقنوات التوزيع (CS-19, CS-25..26)',
      alphaTitle: 'اختبار الاتساق الداخلي (كرونباخ ألفا)',
      alphaBadge: 'α = 0.84 (ممتاز)',
      alphaDesc: 'حد القبول السريري: α ≥ 0.70. النظام يحذر تلقائياً إذا انخفض ثبات الفقرات عن المدى المعياري.',
      singleTpText: 'قيد النقطة الزمنية الواحدة: هذا المسح يجمع البيانات في نقطة زمنية واحدة فقط بدون زيارات متابعة طولية.',
      s5Heading: 'المراجعة النهائية وإطلاق المسح (CS-31..37)',
      btnPrev: 'السابق',
      btnNext: 'التالي',
      btnSubmit: 'إطلاق ونشر المسح المقطعي',
    },
    en: {
      headerBadge: 'Cross-Sectional Clinical Survey Workflow (STROBE & AXIS Standard)',
      pageTitle: 'Cross-Sectional Survey Protocol Setup',
      pageSubtitle: 'Single timepoint assessment, clinical questionnaire builder, and Cronbach\'s Alpha calculator (α ≥ 0.70).',
      unsavedDraft: 'Unsaved Draft',
      saveDraft: 'Save Draft',
      step1Num: 'STEP 01', step1Title: 'Survey Objective & Target',
      step2Num: 'STEP 02', step2Title: 'Protocol & Informed Consent',
      step3Num: 'STEP 03', step3Title: 'Sample Size & Questionnaire Builder',
      step4Num: 'STEP 04', step4Title: 'Alpha Reliability & Distribution',
      step5Num: 'STEP 05', step5Title: 'Review & Launch',
      valTitle: 'Please complete the required fields before advancing',
      s1Heading: 'Survey Metadata & Target Population (CS-01, CS-02, CS-06)',
      lblTitle: 'Cross-Sectional Survey Title',
      phTitle: 'e.g. Cross-Sectional Assessment of Oral Health-Related Quality of Life (OHIP-14)',
      lblSubtype: 'Survey Subtype',
      lblPi: 'Principal Investigator (PI)',
      phPi: 'Dr. Maryam Al-Shammari - Community Dentistry',
      lblTargetPop: 'Target Population & Sampling Frame',
      phTargetPop: 'e.g. Adults attending specialized outpatient clinics during Q2',
      s2Heading: 'Ethics & Informed Consent (CS-03..05)',
      lblIrb: 'IRB Ethics Approval Certificate #',
      phIrb: 'e.g. IRB-2026-SURV-331',
      lblConsentText: 'Respondent Informed Consent Text',
      s3Heading: 'Sample Size & Questionnaire Builder (CS-08..18)',
      lblTargetN: 'Target Sample Size (Target N)',
      lblMarginError: 'Margin of Error (%)',
      lblSamplingMethod: 'Sampling Method',
      sampAlertText: 'Methodology Guard: Sampling Randomness is distinct from Treatment Allocation Randomization (which is disabled by default).',
      s4Heading: 'Cronbach\'s Alpha Reliability & Distribution Hub (CS-19, CS-25..26)',
      alphaTitle: 'Cronbach\'s Alpha Internal Consistency Engine',
      alphaBadge: 'α = 0.84 (Excellent)',
      alphaDesc: 'Clinical cutoff threshold: α ≥ 0.70. Automated warnings triggered if scale reliability drops.',
      singleTpText: 'Single Timepoint Constraint: Data is gathered at one cross-sectional moment without longitudinal follow-up visits.',
      s5Heading: 'Final Review & Survey Launch (CS-31..37)',
      btnPrev: 'Previous',
      btnNext: 'Next',
      btnSubmit: 'Submit & Deploy Cross-Sectional Survey',
    }
  };

  const t = isRtl ? content.ar : content.en;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-on-surface dark:text-gray-100 font-sans antialiased" id="cs-workflow-root">
      {/* Page Header */}
      <div className="border-b border-surface-container-high dark:border-gray-700/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Icon name="pie_chart" size="sm" />
            <span>{t.headerBadge}</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface dark:text-white tracking-tight">{t.pageTitle}</h1>
          <p className="text-xs text-on-surface-variant dark:text-gray-300">{t.pageSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {isDeployed && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <Icon name="check_circle" className="w-3.5 h-3.5 text-emerald-600" />
              {isRtl ? 'المسح منشور ونشط' : 'Survey Deployed & Live'}
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl bg-surface-container dark:bg-gray-800 text-on-surface dark:text-gray-200 text-xs font-semibold hover:bg-surface-container-high transition-all flex items-center gap-1.5 border border-surface-container-high dark:border-gray-700 cursor-pointer"
          >
            <Icon name="save" size="sm" />
            <span>{draftSaved ? (isRtl ? 'تم الحفظ!' : 'Saved!') : t.saveDraft}</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <nav className="bg-surface-container-low dark:bg-dark-card p-3 rounded-2xl border border-surface-container-high dark:border-gray-700/60 shadow-xs">
        <ol className="grid grid-cols-5 gap-2 text-center text-xs font-medium">
          {[
            { step: 1, num: t.step1Num, title: t.step1Title },
            { step: 2, num: t.step2Num, title: t.step2Title },
            { step: 3, num: t.step3Num, title: t.step3Title },
            { step: 4, num: t.step4Num, title: t.step4Title },
            { step: 5, num: t.step5Num, title: t.step5Title },
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;
            return (
              <li
                key={s.step}
                onClick={() => {
                  if (s.step < currentStep) setCurrentStep(s.step);
                  else validateAndNext();
                }}
                className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400'
                }`}
              >
                <span className="block text-[10px] uppercase tracking-wider opacity-80">{s.num}</span>
                <span className="block truncate">{s.title}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Validation Banner */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-3">
          <Icon name="error" size="md" className="text-rose-600 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">{t.valTitle}</h4>
            <p className="text-[11px] opacity-90">{validationError}</p>
          </div>
        </div>
      )}

      {/* Step Forms */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* STEP 01 */}
        {currentStep === 1 && (
          <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5">
            <h3 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2 border-b pb-3 border-surface-container dark:border-gray-700">
              <Icon name="info" size="md" className="text-emerald-600 dark:text-emerald-400" />
              <span>{t.s1Heading}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-on-surface dark:text-gray-200">
                  {t.lblTitle} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t.phTitle}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface dark:text-gray-200">
                  {t.lblSubtype} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subtype}
                  onChange={(e) => setSubtype(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Prevalence Survey">{isRtl ? 'مسح الانتشار السريري' : 'Prevalence Survey'}</option>
                  <option value="KAP Study">{isRtl ? 'دراسة المعرفة والاتجاهات والممارسات' : 'KAP Study (Knowledge, Attitude, Practice)'}</option>
                  <option value="Patient-Reported Outcome">{isRtl ? 'نتائج المرضى المصرح بها' : 'Patient-Reported Outcome Survey (PRO)'}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface dark:text-gray-200">
                  {t.lblPi} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pi}
                  onChange={(e) => setPi(e.target.value)}
                  placeholder={t.phPi}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-on-surface dark:text-gray-200">
                  {t.lblTargetPop} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={targetPop}
                  onChange={(e) => setTargetPop(e.target.value)}
                  placeholder={t.phTargetPop}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 02 */}
        {currentStep === 2 && (
          <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5">
            <h3 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2 border-b pb-3 border-surface-container dark:border-gray-700">
              <Icon name="article" size="md" className="text-emerald-600 dark:text-emerald-400" />
              <span>{t.s2Heading}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-on-surface dark:text-gray-200">
                  {t.lblIrb} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={irbNumber}
                  onChange={(e) => setIrbNumber(e.target.value)}
                  placeholder={t.phIrb}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-bold text-on-surface dark:text-gray-200">
                  {t.lblConsentText} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={consentText}
                  onChange={(e) => setConsentText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 03 */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5">
              <h3 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2 border-b pb-3 border-surface-container dark:border-gray-700">
                <Icon name="format_list_bulleted" size="md" className="text-emerald-600 dark:text-emerald-400" />
                <span>{t.s3Heading}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface dark:text-gray-200">
                    {t.lblTargetN} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="30"
                    required
                    value={targetN}
                    onChange={(e) => setTargetN(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface dark:text-gray-200">
                    {t.lblMarginError}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={marginError}
                    onChange={(e) => setMarginError(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface dark:text-gray-200">
                    {t.lblSamplingMethod} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={samplingMethod}
                    onChange={(e) => setSamplingMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="Convenience Sampling">{isRtl ? 'معاينة ميسرة' : 'Convenience Sampling'}</option>
                    <option value="Consecutive Sampling">{isRtl ? 'معاينة متتالية' : 'Consecutive Sampling'}</option>
                    <option value="Simple Random Sampling">{isRtl ? 'معاينة عشوائية بسيطة' : 'Simple Random Sampling'}</option>
                    <option value="Systematic Sampling">{isRtl ? 'معاينة منتظمة' : 'Systematic Sampling'}</option>
                  </select>
                </div>
              </div>

              {/* Methodology Guard Alert */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
                <Icon name="verified" size="sm" className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{t.sampAlertText}</span>
              </div>
            </div>

            {/* CS-17 Validated Instrument Selector Component */}
            <InstrumentSelector
              selectedInstruments={selectedInstruments}
              onToggleInstrument={toggleInstrument}
            />

            {/* CS-16 Interactive Questionnaire Builder Component */}
            <QuestionnaireBuilder
              initialQuestions={builderQuestions}
              onSave={(qs) => setBuilderQuestions(qs)}
            />
          </div>
        )}

        {/* STEP 04 */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5">
              <h3 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2 border-b pb-3 border-surface-container dark:border-gray-700">
                <Icon name="analytics" size="md" className="text-emerald-600 dark:text-emerald-400" />
                <span>{t.s4Heading}</span>
              </h3>

              {/* Cronbach Alpha Calculator Card */}
              <div className="p-4 rounded-xl bg-surface-container dark:bg-gray-800 border border-surface-container-high dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">{t.alphaTitle}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                    α = {alphaData.alpha} ({alphaData.interpretation})
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant dark:text-gray-300">{t.alphaDesc}</p>
                
                {/* Item Reliability Formula & Matrix */}
                <div className="p-3 rounded-lg bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700 font-mono text-[11px] text-emerald-700 dark:text-emerald-300 space-y-1">
                  <div>Formula: α = (k / (k-1)) * (1 - (Σ s²ᵢ / s²_total))</div>
                  <div>Scale Items (k = {alphaData.numItems}) • Respondents (n = {alphaData.numRespondents}) • Computed α = {alphaData.alpha}</div>
                </div>
              </div>

              {/* Single Timepoint Constraint */}
              <div className="p-3.5 rounded-xl bg-surface-container dark:bg-gray-800 border border-surface-container-high dark:border-gray-700 text-xs flex items-center gap-2 text-on-surface-variant dark:text-gray-300">
                <Icon name="schedule" size="sm" className="text-emerald-600" />
                <span>{t.singleTpText}</span>
              </div>
            </div>

            {/* CS-24 Interactive Distribution Hub Component */}
            <DistributionHub
              surveyUrl={publicUrl}
              targetN={parseInt(targetN, 10) || 384}
              responseCount={responseCount}
            />
          </div>
        )}

        {/* STEP 05 */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5">
              <h3 className="text-base font-bold text-on-surface dark:text-white flex items-center gap-2 border-b pb-3 border-surface-container dark:border-gray-700">
                <Icon name="rocket_launch" size="md" className="text-emerald-600 dark:text-emerald-400" />
                <span>{t.s5Heading}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-surface-container dark:bg-gray-800 border border-surface-container-high dark:border-gray-700 space-y-1">
                  <span className="text-[10px] text-on-surface-variant dark:text-gray-400 block font-bold uppercase">Title & PI</span>
                  <p className="font-bold text-on-surface dark:text-white">{title || '-'}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{pi || '-'}</p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container dark:bg-gray-800 border border-surface-container-high dark:border-gray-700 space-y-1">
                  <span className="text-[10px] text-on-surface-variant dark:text-gray-400 block font-bold uppercase">Sample & Reliability</span>
                  <p className="font-bold text-on-surface dark:text-white">
                    Target N: <span className="font-mono text-emerald-600">{targetN}</span> (Margin {marginError}%)
                  </p>
                  <p className="text-on-surface-variant dark:text-gray-300">Consistency: Cronbach α = {alphaData.alpha} ({alphaData.interpretation})</p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container dark:bg-gray-800 border border-surface-container-high dark:border-gray-700 space-y-1">
                  <span className="text-[10px] text-on-surface-variant dark:text-gray-400 block font-bold uppercase">IRB & Instruments</span>
                  <p className="font-bold text-on-surface dark:text-white">IRB: {irbNumber || '-'}</p>
                  <p className="text-on-surface-variant dark:text-gray-300">
                    Instruments: <span className="font-semibold text-emerald-600">{selectedInstruments.join(', ') || '-'}</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container dark:bg-gray-800 border border-surface-container-high dark:border-gray-700 space-y-1">
                  <span className="text-[10px] text-on-surface-variant dark:text-gray-400 block font-bold uppercase">Subtype & Sampling</span>
                  <p className="font-bold text-on-surface dark:text-white">{subtype}</p>
                  <p className="text-on-surface-variant dark:text-gray-300">{samplingMethod}</p>
                </div>
              </div>

              {/* Data Export Options */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Icon name="download" size="sm" />
                  <span>{isRtl ? 'تصدير البيانات والبروتوكول السريري (CS-37.3)' : 'Clinical Data & Protocol Export Suite (CS-37.3)'}</span>
                </h4>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleExcelExport}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon name="table_chart" size="sm" />
                    <span>{isRtl ? 'تصدير مصنف Excel متعدد الأوراق (.xlsx)' : 'Export Multi-Sheet Excel Workbook (.xlsx)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSpssExport}
                    className="px-4 py-2 rounded-xl bg-surface-container dark:bg-gray-800 text-on-surface text-xs font-bold hover:bg-surface-container-high transition-all flex items-center gap-1.5 border border-surface-container-high cursor-pointer"
                  >
                    <Icon name="code" size="sm" className="text-blue-500" />
                    <span>{isRtl ? 'تصدير كود SPSS (.sps)' : 'Export SPSS Syntax Script (.sps)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CS-22, CS-35 Supervisor Approval Gate */}
            <SupervisorApprovalGate
              studyId="STU-CS-2026"
              initialStatus={supervisorStatus}
              onStatusChange={(st) => setSupervisorStatus(st)}
            />
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-container dark:border-gray-700">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(currentStep - 1)}
            className={`px-5 py-2.5 rounded-xl bg-surface-container dark:bg-gray-800 text-on-surface dark:text-gray-200 text-xs font-bold hover:bg-surface-container-high transition-all flex items-center gap-2 border border-surface-container-high dark:border-gray-700 cursor-pointer ${
              currentStep === 1 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <Icon name="arrow_back" size="sm" className={isRtl ? 'rotate-180' : ''} />
            <span>{t.btnPrev}</span>
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={validateAndNext}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{t.btnNext}</span>
              <Icon name="arrow_forward" size="sm" className={isRtl ? 'rotate-180' : ''} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-7 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{t.btnSubmit}</span>
              <Icon name="check_circle" size="sm" />
            </button>
          )}
        </div>
      </form>

      {/* Post-Launch Downstream Participant Execution Workspace (CS-25..37) */}
      {isDeployed && (
        <div className="mt-8 pt-6 border-t-2 border-emerald-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div>
              <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <Icon name="workspace_premium" className="w-5 h-5 text-emerald-600" />
                {isRtl ? 'مساحة الجمع الميداني وتنفيذ الاستبيان المقطعي (CS-25..37)' : 'Fieldwork Execution & Participant Management Workspace (CS-25..37)'}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                {isRtl
                  ? 'تسجيل عينة، التحقق من شروط الإدراج بـ AI Guard، توقيع الموافقة المستنيرة، جمع البيانات وتصدير النتائج.'
                  : 'Register sample, verify eligibility via AI Guard, sign informed consent, collect data & export dataset.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="person_add" className="w-4 h-4" />
                <span>{isRtl ? '+ تسجيل عينة جديدة' : '+ Register Participant'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDentalImaging(!showDentalImaging)}
                className="px-4 py-2 rounded-xl bg-surface-container dark:bg-gray-800 text-on-surface text-xs font-bold hover:bg-surface-container-high transition-all flex items-center gap-1.5 border border-surface-container-high cursor-pointer"
              >
                <Icon name="view_in_ar" className="w-4 h-4 text-emerald-600" />
                <span>{showDentalImaging ? (isRtl ? 'إخفاء الصور ثلاثية الأبعاد' : 'Hide Dental 3D/Landmarks') : (isRtl ? 'عرض التصوير والأنماط (CS-20, CS-21)' : 'Dental 3D & Landmarks (CS-20, CS-21)')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReviewerModal(true)}
                className="px-4 py-2 rounded-xl bg-surface-container dark:bg-gray-800 text-on-surface text-xs font-bold hover:bg-surface-container-high transition-all flex items-center gap-1.5 border border-surface-container-high cursor-pointer"
              >
                <Icon name="shield" className="w-4 h-4 text-amber-600" />
                <span>{isRtl ? 'المقيم الخارجي' : 'External Reviewer'}</span>
              </button>
            </div>
          </div>

          {/* Dental Imaging & Cephalometric Landmark Widgets (CS-20, CS-21) */}
          {showDentalImaging && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <StlViewer3D title="Digital Impression 3D Model (CS-21)" />
              <CephalometricLandmarkCard />
            </div>
          )}

          {/* Participant Table */}
          <div className="p-4 bg-surface-container-lowest dark:bg-dark-card rounded-2xl border border-surface-container-high space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <span>{isRtl ? 'سجلات عينات المشاركين المسجلة' : 'Registered Participant Records'}</span>
                <span className="text-xs text-emerald-600 font-mono font-bold">({participants.length} {isRtl ? 'عينات' : 'Records'})</span>
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExcelExport}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Icon name="table_chart" size="sm" />
                  <span>{isRtl ? 'تصدير Excel (.xlsx)' : 'Export Multi-Sheet Excel'}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-on-surface">
                <thead className="bg-surface-container-low font-bold text-on-surface-variant uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Research ID</th>
                    <th className="p-2.5">Age</th>
                    <th className="p-2.5">Sex</th>
                    <th className="p-2.5">OHIP-14 Score</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container-low/50">
                      <td className="p-2.5 font-mono font-bold text-emerald-600">{p.id}</td>
                      <td className="p-2.5">{p.age}</td>
                      <td className="p-2.5">{p.sex}</td>
                      <td className="p-2.5 font-mono">{p.score} / 56</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-on-surface-variant">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Register Participant */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest dark:bg-gray-800 max-w-md w-full p-6 rounded-2xl border border-surface-container-high space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-on-surface dark:text-white flex items-center gap-2">
              <Icon name="person_add" className="w-5 h-5 text-emerald-600" />
              <span>{isRtl ? 'تسجيل مشارك جديد والتحقق بـ AI Guard' : 'Register Participant & AI Guard Check'}</span>
            </h3>

            {aiGuardWarning && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 rounded-lg text-xs font-semibold">
                {aiGuardWarning}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">العمر (Age - Protocol 18-60)</label>
                <input
                  type="number"
                  value={regAge}
                  onChange={(e) => setRegAge(e.target.value)}
                  className="w-full p-2 border border-surface-container-high rounded-lg text-sm bg-surface-container-low font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">الجنس (Sex)</label>
                <select
                  value={regSex}
                  onChange={(e) => setRegSex(e.target.value)}
                  className="w-full p-2 border border-surface-container-high rounded-lg text-sm bg-surface-container-low"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleRegisterParticipant}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                متابعة للتوثيق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Informed Consent */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest dark:bg-gray-800 max-w-lg w-full p-6 rounded-2xl border border-surface-container-high space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-on-surface dark:text-white flex items-center gap-2">
              <Icon name="draw" className="w-5 h-5 text-emerald-600" />
              <span>{isRtl ? 'الموافقة المستنيرة والتوقيع الإلكتروني' : 'Informed Consent & Electronic Signature'}</span>
            </h3>

            <div className="p-3 bg-surface-container-low rounded-lg border text-xs text-on-surface-variant space-y-2 max-h-40 overflow-y-auto">
              <p className="font-bold text-on-surface">{title}</p>
              <p>{consentText}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">التوقيع الإلكتروني (E-Signature Name)</label>
              <input
                type="text"
                placeholder="أدخل الاسم الرباعي كموافقة إلكترونية..."
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full p-2 border border-surface-container-high rounded-lg text-sm bg-surface-container-low"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={!signature.trim()}
                onClick={handleConsentSign}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 disabled:opacity-50"
              >
                توقيع وتعبئة الاستمارة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Data Collection */}
      {showDataCollection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest dark:bg-gray-800 max-w-xl w-full p-6 rounded-2xl border border-surface-container-high space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-on-surface dark:text-white flex items-center gap-2 border-b pb-2">
              <Icon name="assignment" className="w-5 h-5 text-emerald-600" />
              <span>تعبئة استمارة البيانات السريرية (Participant ID: CS-0004)</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface-container-low rounded-lg space-y-1">
                <span className="font-bold text-emerald-600 block">فقرة OHIP-14 #1:</span>
                <p>هل واجهت صعوبة في نطق أي كلمات بسبب مشاكل في أسنانك أو فمك؟</p>
                <div className="flex gap-4 pt-1">
                  {['أبداً (0)', 'نادراً (1)', 'أحياناً (2)', 'غالباً (3)', 'دائماً (4)'].map((opt, i) => (
                    <label key={i} className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" name="ohip_1" defaultChecked={i === 1} className="text-emerald-600" />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg space-y-1">
                <span className="font-bold text-emerald-600 block">مقياس الألم البصري VAS (0-10):</span>
                <input type="range" min="0" max="10" defaultValue="3" className="w-full accent-emerald-600" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={handleCompleteDataCollection}
                className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                حفظ وإكمال المشارك
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: External Reviewer (CS-36) */}
      <ExternalReviewerModal
        studyId="STU-CS-2026"
        isOpen={showReviewerModal}
        onClose={() => setShowReviewerModal(false)}
      />
    </div>
  );
};

export default StudyCreateCrossSectionalPage;
