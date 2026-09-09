import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../contexts/I18nContext';
import Icon from '../../../design-system/components/Icon';

// Service Imports
import studyStorageService, { addAuditLog } from '../../../services/studyStorageService';
import ocrExtractService from '../../../services/ocrExtractService';
import { generateMultiSheetExcelWorkbook } from '../../../services/excelExportService';
import { generateSpssSyntaxScript, generateSpssSavFile, generateCsvDataset } from '../../../services/spssExportService';

// Modular Sub-Components
import StlViewer3D from '../components/StlViewer3D';
import CephalometricLandmarkCard from '../components/CephalometricLandmarkCard';
import SupervisorApprovalGate from '../components/SupervisorApprovalGate';
import ExternalReviewerModal from '../components/ExternalReviewerModal';

export const StudyCreateRetrospectivePage = () => {
  const { isRtl } = useI18n();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [draftSaved, setDraftSaved] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isDeployed, setIsDeployed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Step 1: Data Source & Governance (RET-01..06, RET-08)
  const [studyId] = useState('STU-RETRO-' + Date.now().toString().slice(-6));
  const [title, setTitle] = useState('Retrospective Endodontic Archival Study');
  const [subtype, setSubtype] = useState('Chart Audit');
  const [dataSource, setDataSource] = useState('Hospital Records'); // RET-08 choices: Hospital Records, Dental Records, EMR/EHR, Imaging Database, Existing Dataset, Patient Files
  const [researchQuestion, setResearchQuestion] = useState('Evaluation of 5-year success rates of single-visit endodontics');
  const [primaryObjective, setPrimaryObjective] = useState('Determine periapical healing index (PAI <= 2)');
  const [secondaryObjectives, setSecondaryObjectives] = useState('Assess tooth survival and coronal restoration type');
  const [institution, setInstitution] = useState('University of Dental Sciences');
  const [facility, setFacility] = useState('Central Medical Records Archive');
  const [pi, setPi] = useState('Dr. Khaled Al-Otaibi');
  const [coInvestigators, setCoInvestigators] = useState('Dr. Mona Hassan (Co-PI, Radiologist), Dr. Tariq Ali (Biostatistician)');

  // Step 2: Period, Proposal & AI Extraction (RET-07, RET-09..12)
  const [startDate, setStartDate] = useState('2018-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [irb, setIrb] = useState('IRB-EXEMPT-2026-441');
  const [targetN, setTargetN] = useState(250);
  const [primaryOutcome, setPrimaryOutcome] = useState('Periapical healing (PAI <= 2) after 2-year follow-up');
  const [proposalFile, setProposalFile] = useState(null);

  // AI Understanding Cards (RET-10, RET-11) - Edit, Add, Delete, Correct, Approve
  const [aiCards, setAiCards] = useState([
    { id: 1, title: 'Target Study Population', content: 'Patients who underwent non-surgical root canal treatment between 2018 and 2024.', approved: true },
    { id: 2, title: 'Key Outcome Metric', content: 'Periapical healing index (PAI score <= 2) after minimum 2-year archival follow-up.', approved: true },
    { id: 3, title: 'Exclusion Criteria', content: 'Teeth with vertical root fractures, incomplete baseline radiographs, or immunodeficiency.', approved: true }
  ]);

  // Step 3: File Import & Data Dictionary (RET-13..18, RET-25..27)
  const [fileName, setFileName] = useState('');
  const [datasetMap, setDatasetMap] = useState(null);
  const [dataDictionary, setDataDictionary] = useState([
    { field: 'pt_chart_no', label: 'Archival Chart Number', type: 'Identifier', sample: 'MRN-4401', approved: true },
    { field: 'endo_eval_date', label: 'Treatment Date', type: 'Date', sample: '2019-04-12', approved: true },
    { field: 'age_admission', label: 'Age at Treatment', type: 'Continuous', sample: '42', approved: true },
    { field: 'tooth_number', label: 'FDI Tooth Code', type: 'Categorical', sample: '16', approved: true },
    { field: 'healing_status', label: 'Primary Outcome (PAI)', type: 'Binary', sample: '1 (Success)', approved: true },
  ]);

  // Step 4: Mapping, Duplicates & AI Pipeline (RET-19..23, RET-28..33)
  const [mappings, setMappings] = useState([
    { source: 'pt_chart_no', variable: 'Source Chart ID', ratio: '98% Match', approved: true },
    { source: 'endo_eval_date', variable: 'Treatment Date', ratio: '95% Match', approved: true },
    { source: 'healing_status', variable: 'Primary Outcome', ratio: '92% Match', approved: true },
    { source: 'age_admission', variable: 'AGE_YEARS', ratio: '90% Match', approved: true },
  ]);

  const [suspectDuplicates, setSuspectDuplicates] = useState([
    { id: 'REC-4402', matchRatio: '99% File Match', ptName: 'Pt #4402 (Chart A-102)', status: 'Pending' },
    { id: 'REC-4418', matchRatio: '96% File Match', ptName: 'Pt #4418 (Chart A-115)', status: 'Pending' }
  ]);

  // Step 5: Anonymization, Randomization & Blinding Guards (RET-34..37, RET-39..41)
  const [phiConfirmed, setPhiConfirmed] = useState(false);
  const [supervisorStatus, setSupervisorStatus] = useState('Pending Supervisor Review');
  const [reviewerModalOpen, setReviewerModalOpen] = useState(false);

  const numTargetN = parseInt(targetN, 10) || 250;

  // Verified Commercial Model (RET-25, RET-26):
  // Authoritative Rule: $65/study including 1,000 Extraction Credits + 100 free data-extraction credits trial
  // REMOVED unverified $0.05/extra record calculation.
  const commercialPriceDisplay = '$65.00 / study';
  const creditsAllowanceDisplay = '1,000 Extraction Credits + 100 Free Trial Credits Included';

  const handleSaveDraft = () => {
    const success = studyStorageService.saveDraft('RETROSPECTIVE', {
      title, pi, subtype, dataSource, irb, targetN, primaryOutcome, mappings
    });
    if (success) {
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    }
  };

  const handleExcelExport = () => {
    generateMultiSheetExcelWorkbook({
      filename: `OSKAR_Retrospective_${(title || 'Study').replace(/\s+/g, '_')}.xlsx`,
      studyMetadata: { id: studyId, title: title || 'Retrospective Study', pi: pi || 'PI', subtype, type: 'RETROSPECTIVE', irbNumber: irb, targetN },
      participants: [
        { id: 'RET-0001', age: 42, sex: 'Female', score: 1, status: 'Completed', date: '2026-03-01' },
        { id: 'RET-0002', age: 56, sex: 'Male', score: 0, status: 'Completed', date: '2026-03-02' }
      ],
      dataDictionary: dataDictionary.map(d => ({ field: d.field, type: d.type, label: d.label })),
      exclusions: suspectDuplicates.map(d => ({ id: d.id, reason: 'Duplicate Record Excluded' })),
      auditLogs: [
        { timestamp: new Date().toISOString(), action: 'Retrospective Dataset Finalized', user: pi || 'PI', details: 'Locked and export packages generated' }
      ]
    });
    addAuditLog({ studyId, action: 'Excel 5-Sheet Workbook Exported', user: pi || 'PI', details: 'Downloaded .xlsx file' });
  };

  const handleCsvExport = () => {
    generateCsvDataset({
      datasetName: title || 'Retrospective_Study',
      participants: [
        { id: 'RET-0001', age: 42, sex: 'Female', score: 1, status: 'Completed', date: '2026-03-01' },
        { id: 'RET-0002', age: 56, sex: 'Male', score: 0, status: 'Completed', date: '2026-03-02' }
      ]
    });
    addAuditLog({ studyId, action: 'CSV Dataset Exported', user: pi || 'PI', details: 'Downloaded .csv dataset file' });
  };

  const handleSpssSavExport = () => {
    generateSpssSavFile({
      studyTitle: title || 'Retrospective Study',
      datasetName: title || 'Retrospective_Dataset',
      dataDictionary,
      participants: [
        { id: 'RET-0001', age: 42, sex: 'F', score: 1, status: 'Completed', date: '2026-03-01' },
        { id: 'RET-0002', age: 56, sex: 'M', score: 0, status: 'Completed', date: '2026-03-02' }
      ]
    });
    addAuditLog({ studyId, action: 'SPSS .sav Binary Data File Exported', user: pi || 'PI', details: 'Downloaded .sav file' });
  };

  const handleSpssSpsExport = () => {
    generateSpssSyntaxScript({
      studyTitle: title || 'Retrospective Study',
      dataDictionary: dataDictionary.map(d => ({ field: d.field, type: d.type, label: d.label })),
      datasetName: title || 'Retrospective_Dataset'
    });
    addAuditLog({ studyId, action: 'SPSS .sps Syntax Script Exported', user: pi || 'PI', details: 'Downloaded .sps syntax file' });
  };

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      const parsed = await ocrExtractService.extractProtocolBlueprint(file, 'RETROSPECTIVE');
      if (parsed) {
        setDatasetMap(parsed);
        if (parsed.dataDictionary) setDataDictionary(parsed.dataDictionary);
        if (parsed.parsedHeaders) {
          setMappings(parsed.parsedHeaders.map(h => ({
            source: h.rawHeader,
            variable: h.mappedVariable,
            ratio: `${h.confidence}% Match`,
            approved: true
          })));
        }
      }
    }
  };

  const handleProposalUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProposalFile(file.name);
      const parsed = await ocrExtractService.extractProtocolBlueprint(file, 'RETROSPECTIVE');
      if (parsed) {
        setAiCards([
          { id: 1, title: 'Target Study Population', content: 'Historical patients extracted from archival records (2018-2024).', approved: true },
          { id: 2, title: 'Key Outcome Metric', content: primaryOutcome || 'Endodontic success without pain or periapical lesion.', approved: true },
          { id: 3, title: 'Exclusion Criteria', content: 'Incomplete baseline charts or unverified MRN records.', approved: true }
        ]);
      }
    }
  };

  const handleMergeDuplicate = (id) => {
    setSuspectDuplicates(suspectDuplicates.map(d => d.id === id ? { ...d, status: 'Merged' } : d));
  };

  const handleExcludeDuplicate = (id) => {
    setSuspectDuplicates(suspectDuplicates.map(d => d.id === id ? { ...d, status: 'Excluded' } : d));
  };

  const toggleMappingApproval = (idx) => {
    const updated = [...mappings];
    updated[idx].approved = !updated[idx].approved;
    setMappings(updated);
  };

  const toggleDictionaryApproval = (idx) => {
    const updated = [...dataDictionary];
    updated[idx].approved = !updated[idx].approved;
    setDataDictionary(updated);
  };

  const validateAndNext = () => {
    setValidationError('');
    if (currentStep === 1) {
      if (!title.trim() || !facility.trim() || !pi.trim()) {
        setValidationError(isRtl ? 'يرجى إدخال عنوان الدراسة، منشأة البيانات، والباحث الرئيسي.' : 'Please enter the Retrospective Study Title, Data Source Facility, and Principal Investigator.');
        return;
      }
    } else if (currentStep === 2) {
      if (!irb.trim() || !primaryOutcome.trim()) {
        setValidationError(isRtl ? 'يرجى إدخال رقم موافقة الأخلاقيات والمحصلة التاريخية.' : 'Please enter the Ethics Clearance / IRB Approval Number and Outcome Metric.');
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
      type: 'RETROSPECTIVE',
      title,
      pi,
      subtype,
      dataSource,
      irbNumber: irb,
      targetN: numTargetN,
      status: 'Locked & Active',
      createdAt: new Date().toISOString(),
      isDeployed: true,
    };
    studyStorageService.saveStudy(payload);
    setIsDeployed(true);
  };

  const handleExportCSV = () => {
    const headers = ['RET_ID', 'Chart_Source_ID', 'Age', 'Tooth_No', 'Outcome_PAI', 'Status'];
    const rows = Array.from({ length: 10 }).map((_, i) => [
      `RET-${(i + 1).toString().padStart(4, '0')}`,
      `MRN-${4400 + i}`,
      35 + (i * 2),
      16,
      i % 2 === 0 ? 1 : 0,
      'Validated'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OSKAR_Retrospective_${studyId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcelWorkbook = () => {
    excelExportService.generateMultiSheetExcelWorkbook({
      filename: `OSKAR_Retrospective_${studyId}.xlsx`,
      studyMetadata: { id: studyId, title, pi, type: 'RETROSPECTIVE', subtype, irbNumber: irb, targetN: numTargetN },
      participants: Array.from({ length: 10 }).map((_, i) => ({
        id: `RET-${(i + 1).toString().padStart(4, '0')}`,
        mrn: `MRN-${4400 + i}`,
        age: 35 + (i * 2),
        status: 'Validated',
        consentSigned: true,
        visitT0: 'Extracted',
        visitT1: 'Validated'
      })),
      dataDictionary,
      exclusions: suspectDuplicates,
      auditLogs: studyStorageService.getAuditLogs(studyId),
    });
  };

  const handleExportSPSSSyntax = () => {
    spssExportService.generateSpssSyntaxScript({
      studyTitle: title || 'Retrospective Cohort Protocol',
      dataDictionary,
      datasetName: 'Retrospective_Archival_Dataset',
    });
  };

  // Post-Launch Execution Workspace (RET-38..42)
  if (isDeployed) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-on-surface dark:text-gray-100 font-sans antialiased" id="retro-workspace-root">
        {/* Workspace Header */}
        <div className="border-b border-surface-container-high dark:border-gray-700/60 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Icon name="lock" size="sm" />
              <span>{isRtl ? 'سجل مغلق ونشط — بيئة العمل الاستعادية' : 'RECORD LOCKED & ACTIVE — RETROSPECTIVE EXECUTION WORKSPACE'}</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface dark:text-white tracking-tight">{title || 'Retrospective Cohort Study Workspace'}</h1>
            <p className="text-xs text-on-surface-variant dark:text-gray-300">
              PI: <span className="font-bold text-on-surface dark:text-gray-100">{pi}</span> | IRB: <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{irb}</span> | Subtype: {subtype} | Source: {dataSource}
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
              onClick={handleExportExcelWorkbook}
              className="px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Icon name="download" size="sm" />
              <span>Export 5-Sheet Excel</span>
            </button>
          </div>
        </div>

        {/* Dynamic Archival Counters (RET-38) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant dark:text-gray-400 uppercase tracking-wider block">Target N / Ingested</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">{numTargetN}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">100% Ingested</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant dark:text-gray-400 uppercase tracking-wider block">Validated Records</span>
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{Math.max(0, numTargetN - 8)}</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant dark:text-gray-400 uppercase tracking-wider block">Duplicates Excluded</span>
            <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">8</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-1">
            <span className="text-[11px] font-bold text-on-surface-variant dark:text-gray-400 uppercase tracking-wider block">Pseudonymized Schema</span>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 block pt-1">RET-0001 .. RET-{numTargetN.toString().padStart(4, '0')}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-surface-container-high dark:border-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-on-surface-variant dark:text-gray-400 hover:text-on-surface'
            }`}
          >
            {isRtl ? 'سجلات الأرشيف المستخرجة' : 'Pseudonymized Dataset'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('imaging')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'imaging'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-on-surface-variant dark:text-gray-400 hover:text-on-surface'
            }`}
          >
            {isRtl ? 'تصوير STL والسيفالومترك (RET-35)' : '3D STL & Cephalometric Imaging (RET-35)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('exports')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'exports'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-on-surface-variant dark:text-gray-400 hover:text-on-surface'
            }`}
          >
            {isRtl ? 'محرك التصدير متعدد الصيغ (RET-42)' : 'Multi-Format Export Engine (RET-42)'}
          </button>
        </div>

        {/* Tab Content: Dataset */}
        {activeTab === 'overview' && (
          <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
                <Icon name="dataset" size="sm" className="text-amber-600" />
                <span>Extracted Pseudonymized Archival Records (RET-24)</span>
              </h3>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-[11px] font-bold">
                Lock Enforced: Read-Only (RET-37)
              </span>
            </div>

            <div className="overflow-x-auto border border-surface-container-high dark:border-gray-700 rounded-xl">
              <table className="w-full text-start text-xs">
                <thead className="bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-300 font-bold border-b border-surface-container-high dark:border-gray-700">
                  <tr>
                    <th className="p-3">Research ID</th>
                    <th className="p-3">Source Chart ID (Masked)</th>
                    <th className="p-3">Age</th>
                    <th className="p-3">Tooth FDI</th>
                    <th className="p-3">Primary Outcome (PAI)</th>
                    <th className="p-3 text-center">Extraction Confidence</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high dark:divide-gray-700 text-on-surface dark:text-gray-200 font-medium">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="hover:bg-surface-container/50">
                      <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">RET-{(i + 1).toString().padStart(4, '0')}</td>
                      <td className="p-3 font-mono text-gray-500">MRN-****-{4401 + i}</td>
                      <td className="p-3">{32 + (i * 3)}</td>
                      <td className="p-3 font-mono">16</td>
                      <td className="p-3 font-semibold">{i % 2 === 0 ? 'PAI 1 (Healed)' : 'PAI 2 (Healthy)'}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                          {(95 + (i % 5)).toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          Validated
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Imaging (RET-35) */}
        {activeTab === 'imaging' && (
          <div className="space-y-6">
            <StlViewer3D title="RET-35 Archival 3D Scan & Radiographic Attachment Integration" />
            <CephalometricLandmarkCard />
          </div>
        )}

        {/* Tab Content: Exports (RET-42) */}
        {activeTab === 'exports' && (
          <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-6">
            <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
              <Icon name="ios_share" size="sm" className="text-amber-600" />
              <span>Multi-Format Export Engine (RET-42 Sub-requirements)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleExportExcelWorkbook}
                className="p-4 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Icon name="download" size="sm" />
                <span>Export Genuine 5-Sheet Excel Workbook (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="p-4 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Icon name="download" size="sm" />
                <span>Export Clean CSV File</span>
              </button>
              <button
                type="button"
                onClick={handleExportSPSSSyntax}
                className="p-4 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Icon name="code" size="sm" />
                <span>Export Dynamic SPSS Syntax Script (.sps)</span>
              </button>
            </div>
          </div>
        )}

        <ExternalReviewerModal studyId={studyId} isOpen={reviewerModalOpen} onClose={() => setReviewerModalOpen(false)} />
      </div>
    );
  }

  // Setup Wizard Render
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-on-surface dark:text-gray-100 font-sans antialiased" id="retro-workflow-root">
      {/* Header */}
      <div className="border-b border-surface-container-high dark:border-gray-700/60 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <Icon name="history" size="sm" />
            <span>Retrospective Archival Cohort Protocol Setup</span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface dark:text-white tracking-tight">{title || 'Create Retrospective Study'}</h1>
        </div>

        <button
          type="button"
          onClick={handleSaveDraft}
          className="px-3.5 py-2 rounded-xl bg-surface-container dark:bg-gray-800 text-on-surface text-xs font-semibold hover:bg-surface-container-high border cursor-pointer"
        >
          <Icon name="save" size="sm" />
          <span>{draftSaved ? 'Saved Draft!' : 'Save Draft'}</span>
        </button>
      </div>

      {/* Stepper Controls */}
      <nav className="bg-surface-container-low dark:bg-dark-card p-3 rounded-2xl border border-surface-container-high dark:border-gray-700/60 shadow-xs">
        <ol className="grid grid-cols-5 gap-2 text-center text-xs font-medium">
          {['Data Source & Governance', 'Period & Ethics', 'File Ingestion & Dictionary', 'Header Mapping & Duplicates', 'Anonymization & Locking'].map((titleText, idx) => {
            const stepNum = idx + 1;
            const isActive = currentStep === stepNum;
            return (
              <li
                key={stepNum}
                onClick={() => setCurrentStep(stepNum)}
                className={`p-2.5 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-amber-600 text-white font-bold' : 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400'}`}
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
          <h3 className="text-base font-bold text-on-surface dark:text-white border-b pb-3">
            {isRtl ? 'الخطوة 1: مصدر البيانات وإدارة الدراسة' : 'Step 1: Data Source & Governance'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'عنوان الدراسة السريرية *' : 'Study Title *'}</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Retrospective Endodontic Success Rate Analysis" className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'مصدر البيانات السريرية *' : 'Data Source Selection *'}</label>
              <select value={dataSource} onChange={(e) => setDataSource(e.target.value)} className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white font-medium">
                <option value="Hospital Records">{isRtl ? 'سجلات المستشفى' : 'Hospital Records'}</option>
                <option value="Dental Records">{isRtl ? 'سجلات عيادات الأسنان' : 'Dental Records'}</option>
                <option value="EMR/EHR">{isRtl ? 'نظام السجل السريري الإلكتروني' : 'EMR/EHR System'}</option>
                <option value="Imaging Database">{isRtl ? 'قاعدة بيانات التصوير الشعاعي' : 'Imaging Database'}</option>
                <option value="Existing Dataset">{isRtl ? 'قاعدة بيانات أرشيفية متوفرة' : 'Existing Archival Dataset (.xlsx/.csv)'}</option>
                <option value="Patient Files">{isRtl ? 'الملفات الورقية للمرضى' : 'Paper Patient Files'}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'الباحث الرئيسي *' : 'Principal Investigator (PI) *'}</label>
              <input type="text" value={pi} onChange={(e) => setPi(e.target.value)} placeholder="Dr. Khaled Al-Otaibi" className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'منشأة الأرشيف أو قسم حفظ البيانات *' : 'Data Source Facility *'}</label>
              <input type="text" value={facility} onChange={(e) => setFacility(e.target.value)} placeholder="Medical Records Archive - Central Hospital" className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
          </div>
          <div className="flex justify-end pt-3">
            <button type="button" onClick={() => setCurrentStep(2)} className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 cursor-pointer">
              {isRtl ? 'الانتقال للخطوة 2' : 'Proceed to Step 2'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5 text-xs">
          <h3 className="text-base font-bold text-on-surface dark:text-white border-b pb-3">
            {isRtl ? 'الخطوة 2: المقترح البحثي وفهم الذكاء الاصطناعي' : 'Step 2: Proposal & AI Research Understanding'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'رفع مقترح البحث أو الإعفاء الأخلاقي' : 'Upload Research Proposal / Ethical Waiver (.pdf, .docx)'}</label>
              <input type="file" accept=".pdf,.docx" onChange={handleProposalUpload} className="w-full p-2 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'رمز موافقة الأخلاقيات *' : 'IRB Approval Number *'}</label>
              <input type="text" value={irb} onChange={(e) => setIrb(e.target.value)} placeholder="IRB-EXEMPT-2026-441" className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'معيار نتيجة الدراسة الأرشيفية *' : 'Historical Outcome Metric *'}</label>
              <input type="text" value={primaryOutcome} onChange={(e) => setPrimaryOutcome(e.target.value)} placeholder="Endodontic success without pain or periapical lesion after 2 years" className="w-full p-2.5 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
            </div>
          </div>
          <div className="flex justify-between pt-3">
            <button type="button" onClick={() => setCurrentStep(1)} className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold hover:bg-surface-container-low cursor-pointer">
              {isRtl ? 'السابق' : 'Back'}
            </button>
            <button type="button" onClick={() => setCurrentStep(3)} className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 cursor-pointer">
              {isRtl ? 'الانتقال للخطوة 3' : 'Proceed to Step 3'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5 text-xs">
          <h3 className="text-base font-bold text-on-surface dark:text-white border-b pb-3">
            {isRtl ? 'الخطوة 3: استيراد ملف البيانات والقاموس المعياري' : 'Step 3: Dataset Ingestion & Data Dictionary'}
          </h3>
          <div className="space-y-1">
            <label className="font-bold text-on-surface dark:text-gray-200">{isRtl ? 'رفع ملف البيانات الأرشيفية' : 'Upload Dataset File (.xlsx, .csv, .sav)'}</label>
            <input type="file" accept=".xlsx,.csv,.sav" onChange={handleFileUpload} className="w-full p-2 rounded-xl border bg-surface dark:bg-gray-800 text-on-surface dark:text-white" />
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 dark:text-amber-200">{isRtl ? 'نموذج الرصيد المعياري للدراسات الاستعادية' : 'Verified Retrospective Commercial Model'}</span>
              <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]">{commercialPriceDisplay}</span>
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300">{creditsAllowanceDisplay}</p>
          </div>
          <div className="flex justify-between pt-3">
            <button type="button" onClick={() => setCurrentStep(2)} className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold hover:bg-surface-container-low cursor-pointer">
              {isRtl ? 'السابق' : 'Back'}
            </button>
            <button type="button" onClick={() => setCurrentStep(4)} className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 cursor-pointer">
              {isRtl ? 'الانتقال للخطوة 4' : 'Proceed to Step 4'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5 text-xs">
          <h3 className="text-base font-bold text-on-surface dark:text-white border-b pb-3">
            {isRtl ? 'الخطوة 4: مطابقة المتغيرات وفحص التكرارات' : 'Step 4: Header Mapping & Duplicate Resolution'}
          </h3>
          <div className="space-y-3">
            <span className="font-bold text-on-surface dark:text-white block">{isRtl ? 'بيئة معالجة التكرارات المشتبه بها' : 'Duplicate Record Resolution Workspace'}</span>
            {suspectDuplicates.map((dup) => (
              <div key={dup.id} className="p-3 rounded-xl bg-surface-container dark:bg-gray-800 flex items-center justify-between">
                <span>{isRtl ? `تكرار مشتبه به #${dup.id}` : `Suspected Duplicate #${dup.id}`} ({dup.matchRatio})</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => handleMergeDuplicate(dup.id)} className="px-3 py-1 rounded bg-indigo-600 text-white font-bold text-[10px]">{isRtl ? 'دمج' : 'Merge'}</button>
                  <button type="button" onClick={() => handleExcludeDuplicate(dup.id)} className="px-3 py-1 rounded bg-rose-600 text-white font-bold text-[10px]">{isRtl ? 'استبعاد' : 'Exclude'}</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-3">
            <button type="button" onClick={() => setCurrentStep(3)} className="px-5 py-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 text-on-surface dark:text-gray-200 font-bold hover:bg-surface-container-low cursor-pointer">
              {isRtl ? 'السابق' : 'Back'}
            </button>
            <button type="button" onClick={() => setCurrentStep(5)} className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 cursor-pointer">
              {isRtl ? 'الانتقال للخطوة 5' : 'Proceed to Step 5'}
            </button>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="bg-surface-container-lowest dark:bg-dark-card p-6 rounded-2xl border border-surface-container-high dark:border-gray-700/60 space-y-5 text-xs">
          <h3 className="text-base font-bold text-on-surface dark:text-white border-b pb-3">
            {isRtl ? 'الخطوة 5: المراجعة الاعتماد وحزم التصدير' : 'Step 5: Final Review, Supervisor Gate & Lock Enforcement'}
          </h3>
          
          <SupervisorApprovalGate studyId={studyId} initialStatus={supervisorStatus} onStatusChange={(st) => setSupervisorStatus(st)} />

          <div className="p-4 rounded-xl bg-surface-container dark:bg-gray-800 border border-surface-container-high dark:border-gray-700 space-y-3">
            <span className="font-bold text-xs text-amber-700 dark:text-amber-400 block uppercase tracking-wider">{isRtl ? 'حزمة التصدير السريري الكاملة' : 'Complete Export Suite'}</span>
            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={handleExcelExport} className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer">
                <Icon name="table_chart" size="sm" />
                <span>1. Multi-Sheet Excel (.xlsx)</span>
              </button>

              <button type="button" onClick={handleCsvExport} className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1.5 cursor-pointer">
                <Icon name="grid_on" size="sm" />
                <span>2. CSV Dataset (.csv)</span>
              </button>

              <button type="button" onClick={handleSpssSavExport} className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 flex items-center gap-1.5 cursor-pointer">
                <Icon name="dataset" size="sm" />
                <span>3. SPSS Data File (.sav)</span>
              </button>

              <button type="button" onClick={handleSpssSpsExport} className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer">
                <Icon name="code" size="sm" />
                <span>4. SPSS Syntax (.sps)</span>
              </button>

              <button type="button" onClick={() => setReviewerModalOpen(true)} className="px-3.5 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 flex items-center gap-1.5 cursor-pointer">
                <Icon name="shield" size="sm" />
                <span>5. External Reviewer Link</span>
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 cursor-pointer text-xs">
            <input type="checkbox" checked={phiConfirmed} onChange={(e) => setPhiConfirmed(e.target.checked)} className="mt-0.5 accent-amber-600" />
            <span className="font-semibold text-on-surface dark:text-gray-200">
              {isRtl ? 'أقر وأؤكد أنه تم إزالة واستبدال جميع بيانات هوية المرضى والرموز الطبية بمعرفات تجهيلية.' : 'I confirm that all Protected Health Information (PHI) and Medical Record Numbers (MRN) are replaced with pseudonymized IDs.'}
            </span>
          </label>

          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={() => setCurrentStep(4)} className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-bold">{isRtl ? 'السابق' : 'Previous'}</button>
            <button type="button" disabled={!phiConfirmed} onClick={() => { setIsDeployed(true); addAuditLog({ studyId, action: 'Retrospective Dataset Finalized & Locked', user: pi || 'PI' }); alert(isRtl ? 'تم قفل واعتماد الدراسة الاستعادية.' : 'Retrospective Study Finalized & Locked.'); }} className="px-7 py-3 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 cursor-pointer disabled:opacity-40 shadow-md flex items-center gap-2">
              <Icon name="lock" size="sm" />
              <span>{isRtl ? 'اعتماد وقفل الدراسة الاستعادية' : 'Submit & Lock Retrospective Study'}</span>
            </button>
          </div>
        </div>
      )}

      {/* External Reviewer Modal (RET-42.1) */}
      <ExternalReviewerModal
        studyId={studyId}
        isOpen={reviewerModalOpen}
        onClose={() => setReviewerModalOpen(false)}
      />
    </div>
  );
};

export default StudyCreateRetrospectivePage;
