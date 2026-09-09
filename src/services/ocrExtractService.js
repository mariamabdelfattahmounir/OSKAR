/**
 * OSKAR Main - AI & OCR Protocol Analysis Service Provider
 * Processes uploaded protocol documents, examination forms, and raw historical datasets to extract structured research blueprints.
 */

export const extractProtocolBlueprint = async (file, studyType) => {
  // Simulate intelligent RAG extraction delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const fileName = file ? (typeof file === 'string' ? file : file.name) : 'Protocol_Document.pdf';

  if (studyType === 'PROSPECTIVE') {
    return {
      fileName,
      status: 'Extracted & Verified',
      population: 'Adult outpatients requiring single implant restorations in posterior mandibular/maxillary sites.',
      recruitmentSetting: 'Dental University Outpatient Clinics - Department of Implantology',
      targetN: 120,
      inclusionCriteria: [
        'Age between 18 and 60 years',
        'Single tooth missing in premolar/molar region with adjacent natural teeth',
        'Adequate bone height (>= 10mm) and width (>= 6mm)',
        'Good oral hygiene (Full Mouth Plaque Score <= 20%)',
      ],
      exclusionCriteria: [
        'Uncontrolled diabetes mellitus (HbA1c > 8.0%)',
        'Heavy smokers (> 15 cigarettes per day)',
        'History of head/neck radiation or bisphosphonate therapy',
        'Severe parafunctional habits (uncontrolled bruxism)',
      ],
      variables: [
        { id: 'v1', category: 'Demographic', name: 'Age', type: 'Continuous', unit: 'Years' },
        { id: 'v2', category: 'Demographic', name: 'Gender', type: 'Categorical', options: ['Male', 'Female'] },
        { id: 'v3', category: 'Clinical', name: 'Bone Density', type: 'Categorical', options: ['D1', 'D2', 'D3', 'D4'] },
        { id: 'v4', category: 'Clinical', name: 'Implant ISQ Stability', type: 'Continuous', unit: 'ISQ Units' },
        { id: 'v5', category: 'Outcome', name: 'Marginal Bone Loss (MBL)', type: 'Continuous', unit: 'mm' },
      ],
      confounders: ['Smoking Habits', 'Periodontal Maintenance Compliance', 'Prosthetic Abutment Material'],
      visitSchedule: [
        { code: 'T0', name: 'Baseline Visit', timing: 'Day 0 (Surgery)', tolerance: '± 0 days' },
        { code: 'T1', name: '3-Month Follow-up', timing: '90 Days', tolerance: '± 7 days' },
        { code: 'T2', name: '6-Month Follow-up', timing: '180 Days', tolerance: '± 14 days' },
        { code: 'T3', name: '12-Month Final Follow-up', timing: '365 Days', tolerance: '± 14 days' },
      ]
    };
  } else if (studyType === 'RETROSPECTIVE') {
    return {
      fileName,
      status: 'Extracted & Verified',
      parsedHeaders: [
        { rawHeader: 'pt_mrn_id', mappedVariable: 'MRN Source ID', confidence: 99 },
        { rawHeader: 'endo_tx_date', mappedVariable: 'Treatment Date', confidence: 96 },
        { rawHeader: 'tooth_fdi', mappedVariable: 'FDI Tooth Number', confidence: 98 },
        { rawHeader: 'pai_score_post', mappedVariable: 'Primary Outcome (PAI)', confidence: 94 },
        { rawHeader: 'patient_age', mappedVariable: 'Patient Age', confidence: 95 },
      ],
      rowCount: 250,
      suspectDuplicatesCount: 2,
      dataDictionary: [
        { field: 'pt_mrn_id', label: 'Archival MRN Number', type: 'Identifier', sample: 'MRN-4401', approved: true },
        { field: 'endo_tx_date', label: 'Treatment Date', type: 'Date', sample: '2019-04-12', approved: true },
        { field: 'patient_age', label: 'Age at Treatment', type: 'Continuous', sample: '42', approved: true },
        { field: 'tooth_fdi', label: 'FDI Tooth Code', type: 'Categorical', sample: '16', approved: true },
        { field: 'pai_score_post', label: 'Primary Outcome (PAI)', type: 'Binary', sample: '1 (Success)', approved: true },
      ]
    };
  }

  return {
    fileName,
    status: 'Extracted',
    extractedContent: 'Protocol structural elements parsed cleanly.',
  };
};

export default {
  extractProtocolBlueprint,
};
