export const REVIEWER_EVALUATIONS = [
  {
    id: 'rev_eval_101',
    studyId: 'std_rct_001',
    title: 'Efficacy of Novel Oral Anticoagulant in Post-Operative Cardiac Patients',
    studyType: 'Randomized Controlled Trial (RCT)',
    researcherName: 'Dr. Sarah Med',
    institution: 'Harvard Medical School',
    submittedDate: '2026-03-01',
    dueDate: '2026-03-15',
    status: 'pending_review',
    complianceScore: 94,
    spiritCompliance: 'Fully Compliant',
    coiDeclared: false,
    rubricScores: {
      scientificMethodology: 4, // out of 5
      ethicalCompliance: 5,
      statisticalPower: 4,
      dataProtection: 5,
    },
    comments: '',
    verdict: null, // 'approved' | 'revision_requested' | 'rejected'
  },
  {
    id: 'rev_eval_102',
    studyId: 'std_retro_002',
    title: 'Ten-Year Retrospective Outcome Analysis of Minimally Invasive Joint Replacement',
    studyType: 'Retrospective Study',
    researcherName: 'Dr. Sarah Med',
    institution: 'Harvard Medical School',
    submittedDate: '2026-02-15',
    dueDate: '2026-03-01',
    status: 'completed',
    complianceScore: 88,
    spiritCompliance: 'Substantially Compliant',
    coiDeclared: true,
    rubricScores: {
      scientificMethodology: 4,
      ethicalCompliance: 4,
      statisticalPower: 4,
      dataProtection: 5,
    },
    comments: 'Protocol approved with minor recommendations regarding historical sample selection bias mitigation.',
    verdict: 'approved',
  },
];

export const COMPLIANCE_RULES = [
  { id: 'rule_1', code: 'SPIRIT-01', name: 'Title contains trial design description', category: 'Methodology', status: 'pass' },
  { id: 'rule_2', code: 'SPIRIT-02', name: 'Trial registration number declared', category: 'Registration', status: 'pass' },
  { id: 'rule_3', code: 'SPIRIT-03', name: 'Sample size calculation formula attached', category: 'Statistics', status: 'pass' },
  { id: 'rule_4', code: 'SPIRIT-04', name: 'Blinding & Randomization concealment protocol', category: 'Randomization', status: 'pass' },
  { id: 'rule_5', code: 'SPIRIT-05', name: 'Conflict of Interest disclosure completed', category: 'Ethics', status: 'warning' },
];

export const reviewerService = {
  getEvaluations: () => REVIEWER_EVALUATIONS,
  getEvaluationById: (id) => REVIEWER_EVALUATIONS.find((e) => e.id === id) || REVIEWER_EVALUATIONS[0],
  getComplianceRules: () => COMPLIANCE_RULES,
};

export default reviewerService;
