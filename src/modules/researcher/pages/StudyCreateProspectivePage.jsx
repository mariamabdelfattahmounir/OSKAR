import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

// Service Imports
import studyStorageService from '../../../services/studyStorageService';
import ocrExtractService from '../../../services/ocrExtractService';
import excelExportService from '../../../services/excelExportService';
import spssExportService from '../../../services/spssExportService';

// Modular Sub-Components
import StlViewer3D from '../components/StlViewer3D';
import CephalometricLandmarkCard from '../components/CephalometricLandmarkCard';
import SupervisorApprovalGate from '../components/SupervisorApprovalGate';
import ExternalReviewerModal from '../components/ExternalReviewerModal';

export const StudyCreateProspectivePage = () => {
  const { isRtl } = useI18n();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [draftSaved, setDraftSaved] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isDeployed, setIsDeployed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Step 1: Overview, Logo & Governance (PRO-01..06)
  const [studyId] = useState('STU-PROS-' + Date.now().toString().slice(-6));
  const [title, setTitle] = useState('Prospective Dental Implant Cohort Study');
  const [subtype, setSubtype] = useState('Prospective Cohort');
  const [pi, setPi] = useState('Dr. Sarah Al-Mansoor');
  const [coInvestigators, setCoInvestigators] = useState('Dr. Sarah Al-Mansoor (PI), Dr. Tariq Al-Otaibi (Co-PI)');
  const [logoFile, setLogoFile] = useState(null);

  // Step 2: Protocol, Exam Form & AI Extraction (PRO-03..18, PRO-20..21)
  const [protocolFileName, setProtocolFileName] = useState('');
  const [examFormFileName, setExamFormFileName] = useState('');
  const [irb, setIrb] = useState('IRB-2026-PROS-099');
  const [registry, setRegistry] = useState('NCT-2026-PROS');
  const [targetPop, setTargetPop] = useState('Adult outpatients requiring single implant restorations.');

  // AI Protocol Blueprint Cards (PRO-08..18) - Add, Edit, Delete, Approve Controls (PRO-20)
  const [blueprintCards, setBlueprintCards] = useState([
    { id: 'bp-pop', category: 'PRO-08 Target Population', title: 'Target Population', value: 'Adult outpatients requiring single implant restorations.', approved: true },
    { id: 'bp-setting', category: 'PRO-09 Setting', title: 'Recruitment Setting', value: 'Dental University Hospital Outpatient Clinics', approved: true },
    { id: 'bp-inc', category: 'PRO-11 Inclusion', title: 'Inclusion Criteria', value: 'Age 18-60, single missing tooth, adequate bone height (>= 10mm).', approved: true },
    { id: 'bp-exc', category: 'PRO-12 Exclusion', title: 'Exclusion Criteria', value: 'Uncontrolled diabetes (HbA1c > 8%), heavy smokers (>15 cig/day).', approved: true },
    { id: 'bp-vars', category: 'PRO-13..15 Variables', title: 'Demographic & Clinical Variables', value: 'Age (Years), Gender, Smoking, FDI Site, Bone Density (HU), MBL (mm).', approved: true },
    { id: 'bp-outcomes', category: 'PRO-16 Outcomes', title: 'Primary & Secondary Outcomes', value: 'Primary: Marginal Bone Loss (MBL mm). Secondary: ISQ Stability.', approved: true },
  ]);

  // Step 3: Sample & Conditional Allocation (PRO-22..25)
  const [targetN, setTargetN] = useState(120);
  const [power, setPower] = useState(80);
  const [alpha] = useState('0.05');
  const [inclusion, setInclusion] = useState(`Age between 18 and 60 years\nIndicated for at least one dental implant\nStable periodontal health post initial therapy`);
  const [exclusion, setExclusion] = useState(`Uncontrolled Diabetes (HbA1c > 8%)\nHeavy smoking (> 15 cigarettes/day)\nMetabolic bone diseases or Bisphosphonate therapy`);
  const [primaryExposure, setPrimaryExposure] = useState('Implant Surface Micro-topography (SLA vs Anodized)');
  const [primaryEndpoint, setPrimaryEndpoint] = useState('Marginal Bone Loss in millimeters (MBL mm)');

  // Randomization & Blinding Guards (PRO-22..25) - Permanently OFF by default for Observational Studies
  const [randomizationEnabled, setRandomizationEnabled] = useState(false);
  const [blindingEnabled, setBlindingEnabled] = useState(false);

  // Step 4: Visit Schedule & CRF Modules (PRO-19, PRO-26..30)
  const [visits, setVisits] = useState([
    { id: 'T0', code: 'T0', name: isRtl ? 'زيارة الأساس (T0)' : 'Baseline Visit', timing: 'Day 0', tolerance: '± 0 days', modules: 'Demographics, FDI Chart, Radiographic', isBaseline: true },
    { id: 'T1', code: 'T1', name: isRtl ? 'متابعة 3 أشهر (T1)' : '3-Month Follow-up', timing: '90 Days', tolerance: '± 7 days', modules: 'Periodontal, Radiographic', isBaseline: false },
    { id: 'T2', code: 'T2', name: isRtl ? 'متابعة 12 شهراً (T2)' : '12-Month Follow-up', timing: '365 Days', tolerance: '± 14 days', modules: 'FDI Chart, Periodontal, Radiographic', isBaseline: false },
  ]);

  useEffect(() => {
    if (isRtl) {
      if (title.includes('Prospective Dental')) {
        setTitle('دراسة تتبع مستقبلية لزرعات الأسنان وفقدان العظم الحافي');
      }
      if (pi.includes('Sarah')) {
        setPi('د. سارة المنصور');
        setCoInvestigators('د. سارة المنصور (الباحث الرئيسي)، د. طارق العتيبي (باحث مشارك)');
      }
      if (targetPop.includes('Adult outpatients')) {
        setTargetPop('المرضى المراجعون البالغون الذين يحتاجون لترميم زرعة واحدة.');
      }
    }
  }, [isRtl]);

  const [crfModules, setCrfModules] = useState({
    demographics: true,
    fdiChart: true,
    perioExam: true,
    radiographic: true,
    cephalometric: true,
  });

  // Step 5 & Post-Launch Workspace (PRO-31..37)
  const [supervisorStatus, setSupervisorStatus] = useState('Pending Supervisor Review');
  const [participants, setParticipants] = useState([
    { id: 'PR-0001', name: 'Pt. A. Al-Hassan', mrn: 'MRN-9901', age: 44, hba1c: 6.2, status: 'Active (T1 Complete)', consentSigned: true, visitT0: 'Completed', visitT1: 'Completed', visitT2: 'Scheduled (2026-10-15)' },
    { id: 'PR-0002', name: 'Pt. M. Al-Salem', mrn: 'MRN-9902', age: 38, hba1c: 6.8, status: 'Active (T0 Complete)', consentSigned: true, visitT0: 'Completed', visitT1: 'Scheduled (2026-09-20)', visitT2: 'Pending' },
  ]);

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [newPtName, setNewPtName] = useState('');
  const [newPtMrn, setNewPtMrn] = useState('');
  const [newPtAge, setNewPtAge] = useState(45);
  const [hba1cInput, setHba1cInput] = useState(6.5);
  const [eligibilityResult, setEligibilityResult] = useState(null);

  // Consent & Signature (PRO-37.2..5)
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [selectedPtForConsent, setSelectedPtForConsent] = useState(null);

  // Withdrawal Workspace (PRO-37.10 - All 7 Categories)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedPtForWithdraw, setSelectedPtForWithdraw] = useState(null);
  const [withdrawCategory, setWithdrawCategory] = useState('Subject Request / Withdrawal of Consent');
  const [withdrawReasonNotes, setWithdrawReasonNotes] = useState('');

  // External Reviewer Modal (PRO-37.12)
  const [reviewerModalOpen, setReviewerModalOpen] = useState(false);

  const numTargetN = parseInt(targetN, 10) || 120;
  const numEnrolled = participants.length;
  const isTargetReached = numEnrolled >= numTargetN; // PRO-37.11

  // Load saved draft or study if available
  useEffect(() => {
    const draft = studyStorageService.loadDraft('PROSPECTIVE');
    if (draft) {
      if (draft.title) setTitle(draft.title);
      if (draft.pi) setPi(draft.pi);
      if (draft.irb) setIrb(draft.irb);
      if (draft.targetN) setTargetN(draft.targetN);
    }
  }, []);

  const handleSaveDraft = () => {
    const success = studyStorageService.saveDraft('PROSPECTIVE', {
      title, pi, subtype, irb, targetN, primaryExposure, primaryEndpoint, visits
    });
    if (success) {
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    }
  };

  const handleProtocolUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProtocolFileName(file.name);
      // Trigger AI Extraction Service (PRO-08..18)
      const extracted = await ocrExtractService.extractProtocolBlueprint(file, 'PROSPECTIVE');
      if (extracted) {
        if (extracted.targetPop) setTargetPop(extracted.targetPop);
        setBlueprintCards([
          { id: 'bp-pop', category: 'PRO-08 Population', title: 'Extracted Population', value: extracted.population, approved: true },
          { id: 'bp-setting', category: 'PRO-09 Setting', title: 'Recruitment Setting', value: extracted.recruitmentSetting, approved: true },
          { id: 'bp-inc', category: 'PRO-11 Inclusion', title: 'Inclusion Criteria', value: extracted.inclusionCriteria.join('; '), approved: true },
          { id: 'bp-exc', category: 'PRO-12 Exclusion', title: 'Exclusion Criteria', value: extracted.exclusionCriteria.join('; '), approved: true },
          { id: 'bp-outcomes', category: 'PRO-16 Outcomes', title: 'Extracted Outcomes', value: 'Primary: Marginal Bone Loss (MBL mm)', approved: true }
        ]);
      }
    }
  };

  const handleAddVisit = () => {
    const nextIdx = visits.length;
    setVisits([
      ...visits,
      {
        id: `T${nextIdx}`,
        code: `T${nextIdx}`,
        name: isRtl ? `زيارة متابعة T${nextIdx}` : `Follow-up Visit T${nextIdx}`,
        timing: `${nextIdx * 180} Days`,
        tolerance: '± 14 days',
        modules: 'Periodontal Assessment, Radiographic',
        isBaseline: false,
      },
    ]);
  };

  const handleRemoveVisit = (id) => {
    if (visits.length > 2) {
      setVisits(visits.filter((v) => v.id !== id));
    }
  };

  const toggleBlueprintApproval = (id) => {
    setBlueprintCards(blueprintCards.map(c => c.id === id ? { ...c, approved: !c.approved } : c));
  };

  const handleDeleteBlueprintCard = (id) => {
    setBlueprintCards(blueprintCards.filter(c => c.id !== id));
  };

  const validateAndNext = () => {
    setValidationError('');
    if (currentStep === 1) {
      if (!title.trim() || !pi.trim()) {
        setValidationError(isRtl ? 'يرجى إدخال عنوان الدراسة والباحث الرئيسي للمتابعة.' : 'Please enter the study title and Principal Investigator to proceed.');
        return;
      }
    } else if (currentStep === 2) {
      if (!irb.trim() || !targetPop.trim()) {
        setValidationError(isRtl ? 'يرجى إدخال رقم موافقة الأخلاقيات والعينة المستهدفة.' : 'Please enter the Ethics Approval Number (IRB) and Target Population.');
        return;
      }
    } else if (currentStep === 3) {
      if (!primaryExposure.trim() || !primaryEndpoint.trim()) {
        setValidationError(isRtl ? 'يرجى تحديد عامل التعرض والنتيجة الرئيسية.' : 'Please specify the Primary Exposure Factor and Outcome Metric.');
        return;
      }
    }
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleSubmit = () => {
    if (!title.trim() || !pi.trim() || !irb.trim()) {
      setValidationError(isRtl ? 'يرجى استكمال الحقول المطلوبة قبل التقديم.' : 'Please complete required fields before submitting.');
      return;
    }
    const payload = {
      id: studyId,
      type: 'PROSPECTIVE',
      title,
      pi,
      subtype,
      irbNumber: irb,
      targetN: numTargetN,
      status: supervisorStatus.includes('Approved') ? 'Active Protocol' : 'Pending Supervisor Review',
      createdAt: new Date().toISOString(),
      isDeployed: true,
    };
    studyStorageService.saveStudy(payload);
    setIsDeployed(true);
  };

  // Eligibility Checklist & AI Guard (PRO-35, PRO-36)
  const handleCheckEligibility = () => {
    const valHbA1c = parseFloat(hba1cInput);
    const age = parseInt(newPtAge, 10);

    if (valHbA1c > 8.0) {
      setEligibilityResult({
        type: 'HARD_BLOCK',
        message: isRtl ? 'حظر إجباري: نسبة HbA1c > 8.0% تتجاوز معايير الشمول السريرية.' : 'AI Guard Hard Block: HbA1c > 8.0% violates inclusion criteria.',
      });
    } else if (age < 18 || age > 60) {
      setEligibilityResult({
        type: 'HARD_BLOCK',
        message: isRtl ? 'حظر إجباري: العمر خارج النطاق المستهدف (18-60 سنة).' : 'AI Guard Hard Block: Age outside required 18-60 cohort.',
      });
    } else if (valHbA1c >= 7.5) {
      setEligibilityResult({
        type: 'SOFT_WARNING',
        message: isRtl ? 'تحذير آلي: نسبة السكري الحدودية (HbA1c = 7.5%-8.0%). يتطلب تقييم طبيب الغدد.' : 'AI Guard Soft Warning: Borderline HbA1c (7.5-8.0%). Endocrinology clearance recommended.',
      });
    } else {
      setEligibilityResult({
        type: 'ELIGIBLE',
        message: isRtl ? 'مستوفٍ لمعايير الشمول' : 'Fully Eligible for Enrollment',
      });
    }
  };

  const handleRegisterParticipant = () => {
    if (eligibilityResult && eligibilityResult.type === 'HARD_BLOCK') return;

    const nextNum = (participants.length + 1).toString().padStart(4, '0');
    const newPt = {
      id: `PR-${nextNum}`,
      name: newPtName || `Participant ${nextNum}`,
      mrn: newPtMrn || `MRN-${9900 + participants.length + 1}`,
      age: newPtAge,
      hba1c: hba1cInput,
      status: 'Enrolled (T0 Baseline)',
      consentSigned: false,
      visitT0: 'Scheduled Today',
      visitT1: 'Pending',
      visitT2: 'Pending',
    };
    const updated = studyStorageService.saveParticipant(studyId, newPt);
    setParticipants(updated.length > 0 ? updated : [...participants, newPt]);
    setRegisterModalOpen(false);
    setNewPtName('');
    setNewPtMrn('');
    setEligibilityResult(null);
  };

  const handleExecuteWithdrawal = () => {
    if (!selectedPtForWithdraw) return;
    const updated = participants.map((p) =>
      p.id === selectedPtForWithdraw.id
        ? { ...p, status: `Withdrawn (${withdrawCategory})`, withdrawNotes: withdrawReasonNotes }
        : p
    );
    setParticipants(updated);
    studyStorageService.addAuditLog({
      studyId,
      action: 'Participant Withdrawn',
      user: 'Investigator',
      details: `Participant ${selectedPtForWithdraw.id} withdrawn under category: ${withdrawCategory}`,
    });
    setWithdrawModalOpen(false);
    setSelectedPtForWithdraw(null);
  };

  const handleExportExcelWorkbook = () => {
    excelExportService.generateMultiSheetExcelWorkbook({
      filename: `OSKAR_Prospective_${studyId}.xlsx`,
      studyMetadata: { id: studyId, title, pi, type: 'PROSPECTIVE', subtype, irbNumber: irb, targetN: numTargetN },
      participants,
      dataDictionary: [
        { field: 'PR_ID', label: 'Participant Research ID', type: 'Identifier', sample: 'PR-0001', approved: true },
        { field: 'MBL_T0', label: 'Baseline Bone Level (mm)', type: 'Continuous', sample: '0.2', approved: true },
        { field: 'MBL_T1', label: '3-Month Bone Loss (mm)', type: 'Continuous', sample: '0.5', approved: true },
      ],
      auditLogs: studyStorageService.getAuditLogs(studyId),
    });
  };

  const handleExportSpssSyntax = () => {
    spssExportService.generateSpssSyntaxScript({
      studyTitle: title || 'Prospective Implant Cohort',
      dataDictionary: [
        { field: 'PR_ID', label: 'Participant ID', type: 'Identifier' },
        { field: 'AGE', label: 'Patient Age', type: 'Continuous' },
        { field: 'MBL_T0', label: 'Baseline Marginal Bone Level (mm)', type: 'Continuous' },
        { field: 'MBL_T1', label: '3-Month Marginal Bone Loss (mm)', type: 'Continuous' },
      ],
      datasetName: 'Prospective_Dataset',
    });
  };

  // Post-Launch Execution Workspace (PRO-34..37)
  if (isDeployed) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-on-surface dark:text-gray-100 font-sans antialiased" id="pros-workspace-root">
        {/* Target Reached Banner (PRO-37.11) */}
        {isTargetReached && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <Icon name="verified" size="md" className="text-emerald-600" />
              <div>
                <h4 className="text-sm font-extrabold">{isRtl ? 'تم الوصول لحجم العينة المستهدف!' : 'TARGET SAMPLE N REACHED!'}</h4>
                <p className="text-[11px] opacity-90">{isRtl ? `تم تسجيل ${numEnrolled} من أصل ${numTargetN} مشارك.` : `Enrolled ${numEnrolled} of ${numTargetN} target participants.`}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px]">Protocol Ready for Lock</span>
          </div>
        )}

        {/* Workspace Header */}
        <div className="border-b border-surface-container-high dark:border-gray-700/60 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Icon name="groups" size="sm" />
              <span>{isRtl ? 'دراسة مستقبلية نشطة — بيئة متابعة المشاركين والزيارات الطولية' : 'ACTIVE PROSPECTIVE STUDY WORKSPACE'}</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface dark:text-white tracking-tight">{title || 'Prospective Implant Cohort Study'}</h1>
            <p className="text-xs text-on-surface-variant dark:text-gray-300">
              PI: <span className="font-bold text-on-surface dark:text-gray-100">{pi}</span> | IRB: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{irb}</span> | Subtype: {subtype}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReviewerModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-surface-container dark:bg-gray-800 text-on-surface dark:text-gray-200 text-xs font-semibold hover:bg-surface-container-high transition-all flex items-center gap-1.5 border border-surface-container-high dark:border-gray-700 cursor-pointer"
            >
              <Icon name="person_add" size="sm" />
              <span>{isRtl ? 'مُراجع خارجي مجهّل' : 'De-identified Reviewer'}</span>
            </button>
            <button
              type="button"
              onClick={() => setRegisterModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Icon name="person_add" size="sm" />
              <span>{isRtl ? '+ تسجيل مشارك جديد' : '+ Register Participant (PRO-35)'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Sample Counters (PRO-34) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant dark:text-gray-400 uppercase tracking-wider block">Target Sample N</span>
            <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">{numTargetN}</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant dark:text-gray-400 uppercase tracking-wider block">Enrolled</span>
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{numEnrolled}</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant dark:text-gray-400 uppercase tracking-wider block">Active Follow-up</span>
            <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">{participants.filter(p => p.status.includes('Active')).length}</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant dark:text-gray-400 uppercase tracking-wider block">Protocol Complete</span>
            <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400">0</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant dark:text-gray-400 uppercase tracking-wider block">Withdrawn (7 Categories)</span>
            <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">{participants.filter(p => p.status.includes('Withdrawn')).length}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-surface-container-high dark:border-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-on-surface-variant dark:text-gray-400 hover:text-on-surface'
            }`}
          >
            {isRtl ? 'المشاركون والجدول الطولي' : 'Participants & Longitudinal Schedule'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('imaging')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'imaging'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-on-surface-variant dark:text-gray-400 hover:text-on-surface'
            }`}
          >
            {isRtl ? 'تصوير STL والسيفالومترك (PRO-29, 30)' : '3D STL & Cephalometric Imaging (PRO-29, 30)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exports')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'exports'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-on-surface-variant dark:text-gray-400 hover:text-on-surface'
            }`}
          >
            {isRtl ? 'تصدير Excel 5-Sheet و SPSS (PRO-37.13)' : 'Multi-Sheet Excel & SPSS Export (PRO-37.13)'}
          </button>
        </div>

        {/* Tab Content: Participants Table */}
        {activeTab === 'overview' && (
          <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-4">
            <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
              <Icon name="clinical_notes" size="sm" className="text-indigo-600" />
              <span>Sequential Participant Registry (PR-0001) &amp; Visit Timeline (PRO-33, PRO-37.1)</span>
            </h3>

            <div className="overflow-x-auto border border-surface-container-high dark:border-gray-700 rounded-xl">
              <table className="w-full text-start text-xs">
                <thead className="bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-300 font-bold border-b border-surface-container-high dark:border-gray-700">
                  <tr>
                    <th className="p-3">Research ID</th>
                    <th className="p-3">Participant Name</th>
                    <th className="p-3">Informed Consent</th>
                    <th className="p-3">T0 Baseline</th>
                    <th className="p-3">T1 3-Month</th>
                    <th className="p-3">T2 12-Month</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high dark:divide-gray-700 text-on-surface dark:text-gray-200 font-medium">
                  {participants.map((pt) => (
                    <tr key={pt.id} className="hover:bg-surface-container/50">
                      <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{pt.id}</td>
                      <td className="p-3">{pt.name} ({pt.mrn})</td>
                      <td className="p-3">
                        {pt.consentSigned ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 w-fit">
                            <Icon name="check_circle" size="xs" /> Signed (e-Sig)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setSelectedPtForConsent(pt); setConsentModalOpen(true); }}
                            className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[10px] hover:bg-amber-500/20 cursor-pointer"
                          >
                            Sign Informed Consent
                          </button>
                        )}
                      </td>
                      <td className="p-3 text-emerald-600 font-semibold">{pt.visitT0}</td>
                      <td className="p-3 text-indigo-600">{pt.visitT1}</td>
                      <td className="p-3 text-gray-400 font-mono text-[11px]">{pt.visitT2}</td>
                      <td className="p-3 text-center">
                        {!pt.status.includes('Withdrawn') && (
                          <button
                            type="button"
                            onClick={() => { setSelectedPtForWithdraw(pt); setWithdrawModalOpen(true); }}
                            className="text-rose-500 hover:text-rose-700 font-bold text-[11px] cursor-pointer"
                          >
                            Withdraw Patient
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Imaging (PRO-29, PRO-30) */}
        {activeTab === 'imaging' && (
          <div className="space-y-6">
            <StlViewer3D title="PRO-29 3D Dental STL Scanner Integration" />
            <CephalometricLandmarkCard />
          </div>
        )}

        {/* Tab Content: Exports (PRO-37.13) */}
        {activeTab === 'exports' && (
          <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-4">
            <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
              <Icon name="ios_share" size="sm" className="text-indigo-600" />
              <span>Multi-Sheet Excel Workbook &amp; SPSS Syntax Exporter (PRO-37.13)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={handleExportExcelWorkbook}
                className="p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon name="download" size="sm" />
                <span>Download Genuine 5-Sheet Excel Workbook (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={handleExportSpssSyntax}
                className="p-4 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Icon name="code" size="sm" />
                <span>Export Dynamic SPSS Syntax Script (.sps)</span>
              </button>
            </div>
          </div>
        )}

        {/* Participant Registration Modal (PRO-35, PRO-36) */}
        {registerModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest dark:bg-dark-card max-w-md w-full p-6 rounded-2xl border border-surface-container-high dark:border-gray-700 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3 border-surface-container dark:border-gray-700">
                <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
                  <Icon name="person_add" size="sm" className="text-indigo-600" />
                  <span>Participant Registration &amp; AI Guard Checklist</span>
                </h3>
                <button type="button" onClick={() => setRegisterModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <Icon name="close" size="sm" />
                </button>
              </div>

              {eligibilityResult && (
                <div className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2 ${
                  eligibilityResult.type === 'HARD_BLOCK' ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300' :
                  eligibilityResult.type === 'SOFT_WARNING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300' :
                  'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                }`}>
                  <Icon name={eligibilityResult.type === 'HARD_BLOCK' ? 'block' : 'warning'} size="sm" className="mt-0.5" />
                  <span>{eligibilityResult.message}</span>
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="block font-bold text-on-surface dark:text-gray-200">Participant Name / Code</label>
                  <input
                    type="text"
                    value={newPtName}
                    onChange={(e) => setNewPtName(e.target.value)}
                    placeholder="e.g. Pt. K. Al-Otaibi"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-on-surface dark:text-gray-200">Age (18-60)</label>
                    <input
                      type="number"
                      value={newPtAge}
                      onChange={(e) => setNewPtAge(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-on-surface dark:text-gray-200">HbA1c Level (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={hba1cInput}
                      onChange={(e) => setHba1cInput(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckEligibility}
                  className="w-full py-2 rounded-xl bg-surface-container dark:bg-gray-800 text-primary dark:text-teal-300 font-bold border border-primary/30 hover:bg-surface-container-high cursor-pointer"
                >
                  Run AI Eligibility Checklist (Hard Block vs Soft Warning)
                </button>

                <button
                  type="button"
                  disabled={eligibilityResult && eligibilityResult.type === 'HARD_BLOCK'}
                  onClick={handleRegisterParticipant}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all cursor-pointer shadow-md disabled:opacity-40"
                >
                  Register Participant &amp; Issue PR-0001 ID
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal Modal (PRO-37.10 - All 7 Categories) */}
        {withdrawModalOpen && selectedPtForWithdraw && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest dark:bg-dark-card max-w-md w-full p-6 rounded-2xl border border-surface-container-high dark:border-gray-700 space-y-4 shadow-2xl text-xs">
              <div className="flex items-center justify-between border-b pb-3 border-surface-container dark:border-gray-700">
                <h3 className="font-bold text-on-surface dark:text-white flex items-center gap-2">
                  <Icon name="person_remove" size="sm" className="text-rose-500" />
                  <span>Participant Withdrawal Workspace (7 Categories)</span>
                </h3>
                <button type="button" onClick={() => setWithdrawModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <Icon name="close" size="sm" />
                </button>
              </div>

              <p className="text-on-surface dark:text-gray-200">
                Withdraw Participant: <span className="font-bold text-indigo-600">{selectedPtForWithdraw.id} ({selectedPtForWithdraw.name})</span>
              </p>

              <div className="space-y-1">
                <label className="block font-bold text-on-surface dark:text-gray-200">Standard Withdrawal Category</label>
                <select
                  value={withdrawCategory}
                  onChange={(e) => setWithdrawCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white"
                >
                  <option value="Adverse Event">1. Adverse Event</option>
                  <option value="Subject Request / Withdrawal of Consent">2. Subject Request / Withdrawal of Consent</option>
                  <option value="Protocol Violation">3. Protocol Violation</option>
                  <option value="Lost to Follow-up">4. Lost to Follow-up</option>
                  <option value="Investigator Decision">5. Investigator Decision</option>
                  <option value="Lack of Efficacy">6. Lack of Efficacy</option>
                  <option value="Technical / Administrative Reason">7. Technical / Administrative Reason</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-on-surface dark:text-gray-200">Clinical Justification Notes</label>
                <textarea
                  rows={2}
                  value={withdrawReasonNotes}
                  onChange={(e) => setWithdrawReasonNotes(e.target.value)}
                  placeholder="Enter clinical notes for withdrawal record..."
                  className="w-full px-3 py-2 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleExecuteWithdrawal}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all cursor-pointer shadow-md"
              >
                Execute Withdrawal &amp; Update Audit Log
              </button>
            </div>
          </div>
        )}

        {/* External Reviewer Modal */}
        <ExternalReviewerModal studyId={studyId} isOpen={reviewerModalOpen} onClose={() => setReviewerModalOpen(false)} />
      </div>
    );
  }

  // Setup Wizard Render (Steps 1 to 5)
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-on-surface dark:text-gray-100 font-sans antialiased" id="pros-workflow-root">
      {/* Stepper Header */}
      <div className="border-b border-surface-container-high dark:border-gray-700/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Icon name="groups" size="sm" />
            <span>Prospective Observational Cohort Protocol Setup</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface dark:text-white tracking-tight">{title || 'Create Prospective Study'}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl bg-surface-container dark:bg-gray-800 text-on-surface dark:text-gray-200 text-xs font-semibold hover:bg-surface-container-high transition-all flex items-center gap-1.5 border border-surface-container-high dark:border-gray-700 cursor-pointer"
          >
            <Icon name="save" size="sm" />
            <span>{draftSaved ? (isRtl ? 'تم الحفظ!' : 'Saved Draft!') : (isRtl ? 'حفظ مسودة' : 'Save Draft')}</span>
          </button>
        </div>
      </div>

      {/* Stepper Controls */}
      <nav className="bg-surface-container-low dark:bg-dark-card p-3 rounded-2xl border border-surface-container-high dark:border-gray-700/60 shadow-xs">
        <ol className="grid grid-cols-5 gap-2 text-center text-xs font-medium">
          {['Scope & Governance', 'Protocol & Documents', 'Cohort & Exposure', 'Visit Schedule & CRF', 'Review & Approval'].map((titleText, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            return (
              <li
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`p-2.5 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-indigo-600 text-white font-bold' : 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400'}`}
              >
                <span className="block text-[10px] uppercase">STEP 0{stepNum}</span>
                <span className="block truncate">{titleText}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <Icon name="error" size="sm" />
          <span>{validationError}</span>
        </div>
      )}

      {/* STEP FORMS */}
      {currentStep === 1 && (
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5 text-xs">
          <h3 className="text-base font-bold text-on-surface dark:text-white border-b pb-3">Step 1: Overview &amp; Logo Upload (PRO-01..06)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">Study Title *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Prospective Implant Bone Loss Evaluation" className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">Principal Investigator (PI) *</label>
              <input type="text" value={pi} onChange={(e) => setPi(e.target.value)} placeholder="Dr. Sarah Al-Mansoor" className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">University Logo Upload (PNG Transparent PRO-06)</label>
              <input type="file" accept="image/png" onChange={(e) => e.target.files && setLogoFile(e.target.files[0].name)} className="w-full p-2 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
          </div>
          <div className="flex justify-end pt-3">
            <button type="button" onClick={validateAndNext} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer">
              {isRtl ? 'الانتقال للخطوة 2' : 'Proceed to Step 2'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5 text-xs">
          <h3 className="text-base font-bold text-on-surface dark:text-white border-b pb-3">
            {isRtl ? 'الخطوة 2: بروتوكول البحث وبطاقات الذكاء الاصطناعي' : 'Step 2: Protocol Upload & AI Blueprint Cards'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'رفع وثيقة البروتوكول' : 'Upload Protocol Document (.pdf, .docx)'}</label>
              <input type="file" accept=".pdf,.docx" onChange={handleProtocolUpload} className="w-full p-2 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'رمز موافقة الأخلاقيات *' : 'IRB Approval Number *'}</label>
              <input type="text" value={irb} onChange={(e) => setIrb(e.target.value)} placeholder="IRB-2026-MED-8849" className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
          </div>

          <div className="space-y-3 pt-3">
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{isRtl ? 'بطاقات مخطط بروتوكول الذكاء الاصطناعي' : 'AI Protocol Blueprint Cards'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {blueprintCards.map((card) => (
                <div key={card.id} className="p-3.5 rounded-xl bg-surface-container dark:bg-gray-800 border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-600">{card.title}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => toggleBlueprintApproval(card.id)} className="cursor-pointer">
                        <Icon name={card.approved ? "check_circle" : "radio_button_unchecked"} size="sm" className={card.approved ? "text-emerald-500" : "text-gray-400"} />
                      </button>
                      <button type="button" onClick={() => handleDeleteBlueprintCard(card.id)} className="text-rose-500 text-xs font-bold p-1 cursor-pointer">✕</button>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-300">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-3">
            <button type="button" onClick={() => setCurrentStep(1)} className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold hover:bg-surface-container-low cursor-pointer">
              {isRtl ? 'السابق' : 'Back'}
            </button>
            <button type="button" onClick={validateAndNext} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer">
              {isRtl ? 'الانتقال للخطوة 3' : 'Proceed to Step 3'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5 text-xs">
          <h3 className="text-base font-bold text-on-surface dark:text-white border-b pb-3">
            {isRtl ? 'الخطوة 3: حجم العينة وعامل التعرض الرئيسي' : 'Step 3: Sample Size & Primary Exposure'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'حجم العينة المستهدف *' : 'Target Sample N *'}</label>
              <input type="number" value={targetN} onChange={(e) => setTargetN(e.target.value)} className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'عامل التعرض الرئيسي *' : 'Primary Exposure *'}</label>
              <input type="text" value={primaryExposure} onChange={(e) => setPrimaryExposure(e.target.value)} className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <span className="font-bold text-amber-800 dark:text-amber-300 block">{isRtl ? 'قيد التخصيص الشرطي' : 'Conditional Allocation Guard'}</span>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">{isRtl ? 'العشوائية والتعمية معطلة افتراضياً في الدراسات المستقبلية الملاحظاتية.' : 'Randomization and blinding remain OFF by default in observational cohort protocols.'}</p>
          </div>
          <div className="flex justify-between pt-3">
            <button type="button" onClick={() => setCurrentStep(2)} className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold hover:bg-surface-container-low cursor-pointer">
              {isRtl ? 'السابق' : 'Back'}
            </button>
            <button type="button" onClick={validateAndNext} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer">
              {isRtl ? 'الانتقال للخطوة 4' : 'Proceed to Step 4'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5 text-xs">
          <h3 className="text-base font-bold text-on-surface dark:text-white border-b pb-3">
            {isRtl ? 'الخطوة 4: جدول الزيارات ومخطط المتابعة الطولية' : 'Step 4: Visit Schedule & Longitudinal Follow-up'}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-on-surface dark:text-white">{isRtl ? 'جدول الزيارات الطولية' : 'Longitudinal Visit Schedule Builder'}</span>
              <button type="button" onClick={handleAddVisit} className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs cursor-pointer">+ Add Visit</button>
            </div>
            {visits.map((v) => (
              <div key={v.id} className="p-3 rounded-xl bg-surface-container dark:bg-gray-800 flex items-center justify-between font-mono">
                <span className="font-bold text-indigo-600">{v.code} ({v.name})</span>
                <span>{v.timing}</span>
                {visits.length > 2 && <button type="button" onClick={() => handleRemoveVisit(v.id)} className="text-rose-500 font-bold cursor-pointer">✕</button>}
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-3">
            <button type="button" onClick={() => setCurrentStep(3)} className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold hover:bg-surface-container-low cursor-pointer">
              {isRtl ? 'السابق' : 'Back'}
            </button>
            <button type="button" onClick={() => setCurrentStep(5)} className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 cursor-pointer">
              {isRtl ? 'الانتقال للخطوة 5' : 'Proceed to Step 5'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5 text-xs">
          <h3 className="text-base font-bold text-on-surface dark:text-white border-b pb-3">
            {isRtl ? 'الخطوة 5: الاعتماد وإطلاق مساحة العمل' : 'Step 5: Supervisor Approval Gate & Protocol Launch'}
          </h3>
          <SupervisorApprovalGate studyId={studyId} initialStatus={supervisorStatus} onStatusChange={(st) => setSupervisorStatus(st)} />
          <div className="flex justify-between items-center pt-3">
            <button type="button" onClick={() => setCurrentStep(4)} className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold hover:bg-surface-container-low cursor-pointer">
              {isRtl ? 'السابق' : 'Back'}
            </button>
            <button type="button" onClick={handleSubmit} className="px-7 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer shadow-md">
              {isRtl ? 'اعتماد البروتوكول وفتح بيئة الدراسة النشطة' : 'Submit Protocol & Open Active Workspace'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyCreateProspectivePage;
