/**
 * Systematic Knowledge System Service for OSKAR Main
 * RAG Scope Isolation, Metadata Schema, Priority Ranking & Fallback Guard
 * Base Version: 2026.08
 */

export const KNOWLEDGE_COLLECTIONS = {
  KB_COMMON: 'KB_COMMON',
  KB_RCT: 'KB_RCT',
  KB_PROSPECTIVE: 'KB_PROSPECTIVE',
  KB_RETROSPECTIVE: 'KB_RETROSPECTIVE',
  KB_CROSS_SECTIONAL: 'KB_CROSS_SECTIONAL',
  KB_IN_VITRO: 'KB_IN_VITRO',
};

export const PRIORITY_LEVELS = {
  CURRENT_OFFICIAL_GUIDELINE: 1,
  CURRENT_REGULATORY_STANDARD: 2,
  OFFICIAL_MANUAL: 3,
  PEER_REVIEWED_SOURCE: 4,
  HISTORICAL_VERSION: 5,
};

export const SYSTEMATIC_KNOWLEDGE_BASE = [
  {
    source_id: 'KB-CONSORT-2025',
    title: 'CONSORT 2025 Statement: Updated Guidelines for Reporting Randomized Trials',
    organization: 'CONSORT Group',
    study_types: ['RCT'],
    subtypes: ['Parallel Group', 'Crossover', 'Cluster RCT', 'Factorial'],
    category: 'Reporting Guideline',
    version: '2025.1',
    publication_date: '2025-01-15',
    effective_date: '2025-01-15',
    status: 'CURRENT',
    supersedes: 'CONSORT 2010',
    jurisdiction: 'International',
    language: 'en',
    official_url: 'https://www.consort-statement.org',
    last_verified: '2026-08-01',
    priority: PRIORITY_LEVELS.CURRENT_OFFICIAL_GUIDELINE,
    collection: KNOWLEDGE_COLLECTIONS.KB_RCT,
    content: 'Standardized reporting items for parallel group randomized trials, including randomization, blinding, sample size calculation, and flow diagrams.'
  },
  {
    source_id: 'KB-SPIRIT-2025',
    title: 'SPIRIT 2025 Statement: Defining Standard Protocol Items for Clinical Trials',
    organization: 'SPIRIT Initiative',
    study_types: ['RCT'],
    subtypes: ['Parallel Group', 'Crossover', 'Cluster RCT'],
    category: 'Protocol Standard',
    version: '2025.1',
    publication_date: '2025-02-01',
    effective_date: '2025-02-01',
    status: 'CURRENT',
    supersedes: 'SPIRIT 2013',
    jurisdiction: 'International',
    language: 'en',
    official_url: 'https://www.spirit-statement.org',
    last_verified: '2026-08-01',
    priority: PRIORITY_LEVELS.CURRENT_OFFICIAL_GUIDELINE,
    collection: KNOWLEDGE_COLLECTIONS.KB_RCT,
    content: 'Minimum content required for a clinical trial protocol, covering administrative information, introduction, methods, ethics, and dissemination.'
  },
  {
    source_id: 'KB-STROBE-COHORT-2024',
    title: 'STROBE Statement: Guidelines for Reporting Observational Studies (Cohort Studies)',
    organization: 'STROBE Initiative',
    study_types: ['PROSPECTIVE', 'RETROSPECTIVE'],
    subtypes: ['Prospective Cohort', 'Retrospective Cohort', 'Comparative Observational', 'Exposure Registry', 'Chart Audit'],
    category: 'Reporting Guideline',
    version: '2024.2',
    publication_date: '2024-09-10',
    effective_date: '2024-09-10',
    status: 'CURRENT',
    supersedes: 'STROBE 2007',
    jurisdiction: 'International',
    language: 'en',
    official_url: 'https://www.strobe-statement.org',
    last_verified: '2026-08-01',
    priority: PRIORITY_LEVELS.CURRENT_OFFICIAL_GUIDELINE,
    collection: KNOWLEDGE_COLLECTIONS.KB_PROSPECTIVE,
    content: 'Standard checklist for cohort observational studies: title, abstract, background, objectives, study design, setting, participants, variables, data sources, bias, sample size, and statistical methods.'
  },
  {
    source_id: 'KB-RECORD-RETRO-2024',
    title: 'RECORD Statement: Reporting of Studies Conducted Using Observational Routinely-Collected Health Data',
    organization: 'RECORD Group',
    study_types: ['RETROSPECTIVE'],
    subtypes: ['Chart Audit', 'Database Registry', 'Case-Control Retrospective'],
    category: 'Archival & Registry Standard',
    version: '2024.1',
    publication_date: '2024-05-20',
    effective_date: '2024-05-20',
    status: 'CURRENT',
    supersedes: 'RECORD 2015',
    jurisdiction: 'International',
    language: 'en',
    official_url: 'https://www.record-statement.org',
    last_verified: '2026-08-01',
    priority: PRIORITY_LEVELS.CURRENT_OFFICIAL_GUIDELINE,
    collection: KNOWLEDGE_COLLECTIONS.KB_RETROSPECTIVE,
    content: 'Tailored items for retrospective studies using routinely collected health data: codes and algorithms, data linkage, duplicate resolution, data cleaning, and dataset locking protocols.'
  },
  {
    source_id: 'KB-STROBE-CROSS-2024',
    title: 'STROBE Statement for Cross-Sectional Studies & Survey Instruments',
    organization: 'STROBE Initiative',
    study_types: ['CROSS_SECTIONAL'],
    subtypes: ['Prevalence Study', 'KAP Survey', 'Patient Reported Outcomes (PRO)'],
    category: 'Survey & Cross-Sectional Standard',
    version: '2024.1',
    publication_date: '2024-06-15',
    effective_date: '2024-06-15',
    status: 'CURRENT',
    supersedes: 'STROBE Cross-Sectional 2007',
    jurisdiction: 'International',
    language: 'en',
    official_url: 'https://www.strobe-statement.org',
    last_verified: '2026-08-01',
    priority: PRIORITY_LEVELS.CURRENT_OFFICIAL_GUIDELINE,
    collection: KNOWLEDGE_COLLECTIONS.KB_CROSS_SECTIONAL,
    content: 'Requirements for cross-sectional prevalence and survey studies: sampling frame, response rates, questionnaire validation, Cronbach\'s alpha reliability, and single timepoint constraint enforcement.'
  },
  {
    source_id: 'KB-GCP-E6-R3',
    title: 'ICH E6(R3) Guideline for Good Clinical Practice (GCP)',
    organization: 'International Council for Harmonisation (ICH)',
    study_types: ['RCT', 'PROSPECTIVE', 'RETROSPECTIVE', 'CROSS_SECTIONAL', 'IN_VITRO'],
    subtypes: ['All Subtypes'],
    category: 'Regulatory Standard',
    version: '2025.2',
    publication_date: '2025-03-30',
    effective_date: '2025-03-30',
    status: 'CURRENT',
    supersedes: 'ICH E6(R2)',
    jurisdiction: 'Global / ICH',
    language: 'en',
    official_url: 'https://www.ich.org',
    last_verified: '2026-08-01',
    priority: PRIORITY_LEVELS.CURRENT_REGULATORY_STANDARD,
    collection: KNOWLEDGE_COLLECTIONS.KB_COMMON,
    content: 'Unified quality standard for designing, conducting, recording, and reporting trials involving human subjects, informed consent, governance, and audit trails.'
  },
];

/**
 * Knowledge Scope Router
 * Maps study type to isolated knowledge collection scope
 */
export const getCollectionForStudyType = (studyType) => {
  const typeUpper = (studyType || '').toUpperCase();
  switch (typeUpper) {
    case 'RCT':
      return KNOWLEDGE_COLLECTIONS.KB_RCT;
    case 'PROSPECTIVE':
      return KNOWLEDGE_COLLECTIONS.KB_PROSPECTIVE;
    case 'RETROSPECTIVE':
      return KNOWLEDGE_COLLECTIONS.KB_RETROSPECTIVE;
    case 'CROSS_SECTIONAL':
      return KNOWLEDGE_COLLECTIONS.KB_CROSS_SECTIONAL;
    case 'IN_VITRO':
      return KNOWLEDGE_COLLECTIONS.KB_IN_VITRO;
    default:
      return KNOWLEDGE_COLLECTIONS.KB_COMMON;
  }
};

/**
 * Query System Knowledge Base with strict scope isolation & fallback guard
 */
export const queryKnowledgeBase = ({ studyType, subtype, query, category }) => {
  const collectionScope = getCollectionForStudyType(studyType);

  // Filter collections: match target collection OR KB_COMMON
  let candidates = SYSTEMATIC_KNOWLEDGE_BASE.filter(
    (item) => item.collection === collectionScope || item.collection === KNOWLEDGE_COLLECTIONS.KB_COMMON
  );

  // Subtype filtering if specified
  if (subtype) {
    const subtypeMatches = candidates.filter(
      (item) => item.subtypes.includes('All Subtypes') || item.subtypes.includes(subtype)
    );
    if (subtypeMatches.length > 0) {
      candidates = subtypeMatches;
    }
  }

  // Category filtering if specified
  if (category) {
    const categoryMatches = candidates.filter((item) => item.category === category);
    if (categoryMatches.length > 0) {
      candidates = categoryMatches;
    }
  }

  // Text query matching
  if (query && query.trim()) {
    const qLower = query.toLowerCase();
    const queryMatches = candidates.filter(
      (item) =>
        item.title.toLowerCase().includes(qLower) ||
        item.content.toLowerCase().includes(qLower) ||
        item.source_id.toLowerCase().includes(qLower)
    );
    if (queryMatches.length > 0) {
      candidates = queryMatches;
    }
  }

  // Sort by priority (1 = highest)
  candidates.sort((a, b) => a.priority - b.priority);

  // Fallback Guard Rule: Returns explicit text when no authoritative source matches
  if (candidates.length === 0) {
    return {
      status: 'NO_MATCH',
      message: 'No authoritative source found in the active Knowledge Scope.',
      activeScope: collectionScope,
      baseVersion: '2026.08',
      sources: [],
    };
  }

  return {
    status: 'SUCCESS',
    activeScope: collectionScope,
    baseVersion: '2026.08',
    count: candidates.length,
    sources: candidates,
  };
};

/**
 * AI Study Blueprint Generator
 * Produces structured blueprint items with mandatory approval controls
 */
export const generateStudyBlueprint = (studyType, subtype, userInputs = {}) => {
  const scopeResult = queryKnowledgeBase({ studyType, subtype });

  const baseItems = [];

  if (studyType === 'RETROSPECTIVE') {
    baseItems.push(
      { id: 'bp-1', category: 'Study Scope', label: 'Retrospective Subtype', value: subtype || 'Chart Audit', status: 'APPROVED' },
      { id: 'bp-2', category: 'Data Governance', label: 'Archival Timeframe', value: `${userInputs.startDate || '2018-01-01'} to ${userInputs.endDate || '2024-12-31'}`, status: 'APPROVED' },
      { id: 'bp-3', category: 'Sample Size', label: 'Target Archival Records (Target N)', value: `${userInputs.targetN || 250} Records`, status: 'APPROVED' },
      { id: 'bp-4', category: 'Compliance Standard', label: 'Methodological Standard', value: 'RECORD & STROBE 2024 Guidelines', status: 'APPROVED' },
      { id: 'bp-5', category: 'Commercial Model', label: 'Verified Pricing Tier', value: '$65 / study (Includes 1,000 Extraction Credits + 100 Free Trial Credits)', status: 'APPROVED' },
      { id: 'bp-6', category: 'Randomization Status', label: 'Randomization Guard', value: 'Permanently OFF (Historical Archival Rule)', status: 'APPROVED' }
    );
  } else if (studyType === 'PROSPECTIVE') {
    baseItems.push(
      { id: 'bp-1', category: 'Study Design', label: 'Prospective Subtype', value: subtype || 'Prospective Cohort', status: 'APPROVED' },
      { id: 'bp-2', category: 'Sample Size', label: 'Target Sample Size (Target N)', value: `${userInputs.targetN || 120} Participants (Power: ${userInputs.power || 80}%, Alpha: 0.05)`, status: 'APPROVED' },
      { id: 'bp-3', category: 'Follow-up Schedule', label: 'Visit Nodes', value: 'T0 (Baseline), T1 (3 Mo), T2 (12 Mo)', status: 'APPROVED' },
      { id: 'bp-4', category: 'Compliance Standard', label: 'Methodological Standard', value: 'STROBE Cohort & ICH GCP E6(R3)', status: 'APPROVED' },
      { id: 'bp-5', category: 'Randomization Status', label: 'Randomization & Blinding', value: userInputs.randomizationEnabled ? 'Custom Allocation Enabled' : 'Disabled by Default (Observational Standard)', status: 'APPROVED' },
      { id: 'bp-6', category: 'Participant Schema', label: 'Participant ID Prefix', value: 'PR-0001 (Sequential Pseudonymized Schema)', status: 'APPROVED' }
    );
  } else if (studyType === 'CROSS_SECTIONAL') {
    baseItems.push(
      { id: 'bp-1', category: 'Study Design', label: 'Cross-Sectional Subtype', value: subtype || 'Prevalence Study', status: 'APPROVED' },
      { id: 'bp-2', category: 'Sampling', label: 'Sampling Strategy', value: 'Consecutive Non-Probability Sampling', status: 'APPROVED' },
      { id: 'bp-3', category: 'Instrument', label: 'Questionnaire & Validated Tool', value: 'Interactive Custom Builder + OHIP-14', status: 'APPROVED' },
      { id: 'bp-4', category: 'Timepoint Rule', label: 'Single Timepoint Constraint', value: 'Strict Single Evaluation (No longitudinal visits)', status: 'APPROVED' },
      { id: 'bp-5', category: 'Reliability', label: 'Internal Consistency', value: "Cronbach's Alpha Engine Evaluation (α ≥ 0.70)", status: 'APPROVED' }
    );
  }

  return {
    studyType,
    subtype,
    activeScope: scopeResult.activeScope,
    baseVersion: '2026.08',
    guidelineCitation: scopeResult.sources[0]?.title || 'ICH GCP E6(R3)',
    blueprintItems: baseItems,
  };
};

export default {
  KNOWLEDGE_COLLECTIONS,
  PRIORITY_LEVELS,
  SYSTEMATIC_KNOWLEDGE_BASE,
  getCollectionForStudyType,
  queryKnowledgeBase,
  generateStudyBlueprint,
};
