// Canonical baseline demonstration studies matching prototype/pages/researcher/studies.html 1:1
export const PROTOTYPE_STUDIES = [
  {
    id: 'STD-2026-001',
    title: 'Triple-Drug Immunotherapy in Renal Cell Carcinoma',
    titleAr: 'العلاج المناعي الثلاثي في سرطان الخلايا الكلوية',
    desc: 'Evaluating multi-agent immunotherapy efficacy in advanced renal cell carcinoma cohorts.',
    descAr: 'تقييم فاعلية العلاج المناعي متعدد العوامل في حالات سرطان الخلايا الكلوية المتقدمة.',
    type: 'PROSPECTIVE TRIAL',
    typeAr: 'دراسة مستقبلية',
    typeId: 'prospect',
    status: 'active',
    statusKey: 'status_active',
    statusLabelEn: 'Active Fieldwork',
    statusLabelAr: 'الجمع الميداني للبيانات',
    statusVariant: 'teal',
    tabStatus: 'active',
    enrolled: '240',
    sampleSize: '350',
    progress: 68,
    irbStatus: 'IRB-KFMC-2026-88 • Approved',
    pi: 'Dr. Sarah Med',
    actionKey: 'btnViewStudy',
    actionIcon: 'visibility',
    actionRoute: '/researcher/study/view',
    lastModified: '2026-03-08',
  },
  {
    id: 'STD-2026-002',
    title: 'Cardiac Biomarkers in Acute Myocarditis Patients',
    titleAr: 'المؤشرات الحيوية للقلب لدى مرضى التهاب عضلة القلب الحاد',
    desc: 'Retrospective chart audit analyzing troponin trajectory and 1-year cardiac mortality.',
    descAr: 'تدقيق استعادي للسجلات الطبية لتحليل مسار التروبونين ومعدل الوفيات خلال سنة.',
    type: 'RETROSPECTIVE COHORT',
    typeAr: 'دراسة استعادية',
    typeId: 'retro',
    status: 'active',
    statusKey: 'status_statistical',
    statusLabelEn: 'Statistical Analysis',
    statusLabelAr: 'التحليل الإحصائي',
    statusVariant: 'sky',
    tabStatus: 'active',
    enrolled: '1,200',
    sampleSize: '1,200',
    progress: 85,
    irbStatus: 'IRB-KKUH-2025-42 • Approved',
    pi: 'Dr. Ahmed Al-Mansoor',
    actionKey: 'btnViewStudy',
    actionIcon: 'visibility',
    actionRoute: '/researcher/study/view',
    lastModified: '2026-03-07',
  },
  {
    id: 'STD-2026-003',
    title: 'Marginal Bone Loss Evaluation in Dental Implants',
    titleAr: 'تقييم فقدان العظم الحافي في زراعة الأسنان',
    desc: 'Radiographic assessment of peri-implant marginal bone level changes at 5-year follow-up.',
    descAr: 'تقييم إشعاعي لتغيرات مستوى العظم الحافي حول الزرعات السنية عند التتبع لـ 5 سنوات.',
    type: 'CROSS-SECTIONAL SURVEY',
    typeAr: 'دراسة مقطعية',
    typeId: 'cross',
    status: 'completed',
    statusKey: 'status_complete',
    statusLabelEn: 'Complete & Verified',
    statusLabelAr: 'مكتمل ومكتمل التدقيق',
    statusVariant: 'emerald',
    tabStatus: 'completed',
    enrolled: '500',
    sampleSize: '500',
    progress: 100,
    irbStatus: 'IRB-KSU-2025-109 • Approved',
    pi: 'Dr. Tariq Hassan',
    actionKey: 'btnViewStudy',
    actionIcon: 'visibility',
    actionRoute: '/researcher/study/view',
    lastModified: '2026-03-05',
  },
  {
    id: 'STD-2026-004',
    title: 'Efficacy of SGLT2 Inhibitors in Diabetic Nephropathy',
    titleAr: 'فاعلية مثبطات SGLT2 في الاعتلال الكلوي السكري',
    desc: 'Double-blind placebo-controlled trial assessing eGFR decline mitigation in type 2 diabetes.',
    descAr: 'تجربة مزدوجة التعمية مع مجموعة ضابطة لتقييم الحد من تدهور ترشيح الكلى لمرضى السكري.',
    type: 'RANDOMIZED TRIAL (RCT)',
    typeAr: 'دراسة عشوائية محكمة',
    typeId: 'rct',
    status: 'drafts',
    statusKey: 'status_draft',
    statusLabelEn: 'Draft Protocol',
    statusLabelAr: 'مسودة بروتوكول',
    statusVariant: 'amber',
    tabStatus: 'drafts',
    enrolled: '0',
    sampleSize: '200',
    progress: 0,
    irbStatus: 'Pending IRB Submission',
    pi: 'Dr. Sarah Med',
    actionKey: 'btnViewStudy',
    actionIcon: 'visibility',
    actionRoute: '/researcher/study/view',
    lastModified: '2026-03-01',
  },
];

export const studyService = {
  getStudies: () => {
    let registry = [];
    try {
      registry = JSON.parse(localStorage.getItem('oskar_studies_registry') || '[]');
    } catch (e) {
      registry = [];
    }

    // Transform any dynamic localStorage studies to match structure
    const dynamicStudies = registry.map((s, idx) => ({
      id: s.id || `STD-2026-REG-${idx + 1}`,
      title: s.title || s.protocolTitle || 'Untitled Research Protocol',
      titleAr: s.titleAr || s.title || 'بروتوكول بحثي جديد',
      desc: s.desc || s.summary || 'Custom user created protocol study.',
      descAr: s.descAr || s.desc || 'بروتوكول مخصص مضاف بواسطة الباحث.',
      type: (s.type || s.methodology || 'RCT').toUpperCase(),
      typeAr: s.typeAr || s.type || 'دراسة سريرية',
      typeId: (s.typeId || s.type || 'rct').toLowerCase(),
      status: s.status || 'active',
      statusKey: 'status_active',
      statusLabelEn: s.statusLabelEn || 'Active Fieldwork',
      statusLabelAr: s.statusLabelAr || 'الجمع الميداني للبيانات',
      statusVariant: 'teal',
      tabStatus: s.tabStatus || 'active',
      enrolled: String(s.enrolled || 0),
      sampleSize: String(s.sampleSize || 100),
      progress: s.progress || 10,
      irbStatus: s.irbStatus || 'IRB-PENDING',
      pi: s.pi || 'Dr. Researcher',
      actionKey: 'btnViewStudy',
      actionIcon: 'visibility',
      actionRoute: '/researcher/study/view',
      lastModified: s.lastModified || new Date().toISOString().split('T')[0],
    }));

    return [...PROTOTYPE_STUDIES, ...dynamicStudies];
  },

  getStudyById: (id) => {
    const all = studyService.getStudies();
    return all.find((s) => s.id === id) || all[0];
  },

  setSelectedActiveStudy: (study) => {
    try {
      localStorage.setItem('oskar_current_active_study_view', JSON.stringify(study));
    } catch (e) {}
  },

  getSelectedActiveStudy: () => {
    try {
      const raw = localStorage.getItem('oskar_current_active_study_view');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return PROTOTYPE_STUDIES[0];
  },
};

export default studyService;
