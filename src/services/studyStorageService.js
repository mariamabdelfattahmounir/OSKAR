/**
 * OSKAR Main - Central Study Storage Service & Lifecycle Persistence Provider
 * Manages studies, protocol drafts, participant registries, visit data, audit logs, and reviewer tokens.
 */

const KEYS = {
  STUDIES_REGISTRY: 'oskar_studies_registry',
  STUDY_DRAFTS: 'oskar_study_drafts',
  PARTICIPANT_REGISTRY: 'oskar_participant_registry',
  AUDIT_LOGS: 'oskar_audit_logs',
  REVIEWER_TOKENS: 'oskar_reviewer_tokens',
};

// Initial default seed studies for clean demonstration if storage is empty
const INITIAL_STUDIES = [
  {
    id: 'STU-PROS-202601',
    type: 'PROSPECTIVE',
    title: 'Prospective Evaluation of Peri-Implant Marginal Bone Loss over 12 Months',
    pi: 'Dr. Sarah Al-Mansoor',
    subtype: 'Prospective Cohort',
    irbNumber: 'IRB-2026-MED-8849',
    targetN: 120,
    status: 'Active Protocol',
    createdAt: new Date().toISOString(),
    isDeployed: true,
  },
  {
    id: 'STU-RETRO-202602',
    type: 'RETROSPECTIVE',
    title: 'Retrospective Analysis of Endodontic Success Rates (2018-2024)',
    pi: 'Dr. Khaled Al-Otaibi',
    subtype: 'Chart Audit',
    facility: 'Medical Records Archive - Central Hospital',
    irbNumber: 'IRB-EXEMPT-2026-441',
    targetN: 250,
    status: 'Locked & Active',
    createdAt: new Date().toISOString(),
    isDeployed: true,
  },
  {
    id: 'STU-CROSS-202603',
    type: 'CROSS_SECTIONAL',
    title: 'Oral Health-Related Quality of Life Assessment (OHIP-14 & GOHAI)',
    pi: 'Dr. Mona Hassan',
    subtype: 'Patient Reported Outcomes (PRO)',
    irbNumber: 'IRB-2026-SURVEY-9902',
    targetN: 300,
    status: 'Active Survey',
    createdAt: new Date().toISOString(),
    isDeployed: true,
  }
];

export const getStudies = () => {
  try {
    const raw = localStorage.getItem(KEYS.STUDIES_REGISTRY);
    if (!raw) {
      localStorage.setItem(KEYS.STUDIES_REGISTRY, JSON.stringify(INITIAL_STUDIES));
      return INITIAL_STUDIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load studies registry:', e);
    return INITIAL_STUDIES;
  }
};

export const saveStudy = (studyData) => {
  try {
    const existing = getStudies();
    const idx = existing.findIndex((s) => s.id === studyData.id);
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...studyData, updatedAt: new Date().toISOString() };
    } else {
      existing.unshift({
        ...studyData,
        createdAt: studyData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    localStorage.setItem(KEYS.STUDIES_REGISTRY, JSON.stringify(existing));
    addAuditLog({
      studyId: studyData.id,
      action: 'Study Saved/Updated',
      user: studyData.pi || 'Investigator',
      details: `Study ${studyData.title} saved with status: ${studyData.status || 'Draft'}`,
    });
    return true;
  } catch (e) {
    console.error('Failed to save study:', e);
    return false;
  }
};

export const getStudyById = (id) => {
  const studies = getStudies();
  return studies.find((s) => s.id === id) || null;
};

// Draft Persistence
export const saveDraft = (studyType, draftData) => {
  try {
    const drafts = JSON.parse(localStorage.getItem(KEYS.STUDY_DRAFTS) || '{}');
    drafts[studyType] = {
      ...draftData,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(KEYS.STUDY_DRAFTS, JSON.stringify(drafts));
    return true;
  } catch (e) {
    console.error('Failed to save draft:', e);
    return false;
  }
};

export const loadDraft = (studyType) => {
  try {
    const drafts = JSON.parse(localStorage.getItem(KEYS.STUDY_DRAFTS) || '{}');
    return drafts[studyType] || null;
  } catch (e) {
    console.error('Failed to load draft:', e);
    return null;
  }
};

// Audit Trail Logs
export const getAuditLogs = (studyId) => {
  try {
    const logs = JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
    if (!studyId) return logs;
    return logs.filter((l) => l.studyId === studyId);
  } catch (e) {
    console.error('Failed to load audit logs:', e);
    return [];
  }
};

export const addAuditLog = ({ studyId, action, user, details }) => {
  try {
    const logs = JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
    const newEntry = {
      id: 'AUD-' + Date.now().toString().slice(-6),
      studyId: studyId || 'GLOBAL',
      timestamp: new Date().toLocaleString(),
      isoTimestamp: new Date().toISOString(),
      action,
      user: user || 'System Guard',
      details: details || 'Action executed cleanly',
    };
    logs.unshift(newEntry);
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs));
    return newEntry;
  } catch (e) {
    console.error('Failed to add audit log:', e);
    return null;
  }
};

// Participant Registry Persistence
export const getParticipants = (studyId) => {
  try {
    const all = JSON.parse(localStorage.getItem(KEYS.PARTICIPANT_REGISTRY) || '{}');
    return all[studyId] || [];
  } catch (e) {
    console.error('Failed to load participants:', e);
    return [];
  }
};

export const saveParticipant = (studyId, participant) => {
  try {
    const all = JSON.parse(localStorage.getItem(KEYS.PARTICIPANT_REGISTRY) || '{}');
    const list = all[studyId] || [];
    const idx = list.findIndex((p) => p.id === participant.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...participant, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...participant, createdAt: new Date().toISOString() });
    }
    all[studyId] = list;
    localStorage.setItem(KEYS.PARTICIPANT_REGISTRY, JSON.stringify(all));
    addAuditLog({
      studyId,
      action: 'Participant Updated',
      user: 'Investigator',
      details: `Participant ${participant.id} status updated to: ${participant.status}`,
    });
    return list;
  } catch (e) {
    console.error('Failed to save participant:', e);
    return [];
  }
};

// De-identified Reviewer Tokens
export const generateReviewerToken = (studyId, email, expiresDays = 30) => {
  try {
    const tokens = JSON.parse(localStorage.getItem(KEYS.REVIEWER_TOKENS) || '[]');
    const newToken = {
      tokenId: 'REV-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      studyId,
      email,
      created: new Date().toISOString(),
      expires: new Date(Date.now() + expiresDays * 86400000).toISOString(),
      status: 'ACTIVE',
    };
    tokens.unshift(newToken);
    localStorage.setItem(KEYS.REVIEWER_TOKENS, JSON.stringify(tokens));
    addAuditLog({
      studyId,
      action: 'De-identified Reviewer Token Generated',
      user: 'Principal Investigator',
      details: `Generated secure read-only token for reviewer ${email}`,
    });
    return newToken;
  } catch (e) {
    console.error('Failed to generate reviewer token:', e);
    return null;
  }
};

export default {
  getStudies,
  saveStudy,
  getStudyById,
  saveDraft,
  loadDraft,
  getAuditLogs,
  addAuditLog,
  getParticipants,
  saveParticipant,
  generateReviewerToken,
};
