import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../../../design-system/components/Card';
import Button from '../../../design-system/components/Button';
import Badge from '../../../design-system/components/Badge';
import Icon from '../../../design-system/components/Icon';
import Modal from '../../../design-system/components/Modal';
import Checkbox from '../../../design-system/components/Checkbox';
import Alert from '../../../design-system/components/Alert';
import { reviewerService } from '../../../services/reviewer/reviewerService';

export const EvaluationPage = () => {
  const { id } = useParams();
  const evaluation = reviewerService.getEvaluationById(id);
  const complianceRules = reviewerService.getComplianceRules();

  // Rubric state
  const [rubricScores, setRubricScores] = useState({ ...evaluation.rubricScores });
  const [comments, setComments] = useState(evaluation.comments || '');

  // COI Modal state
  const [isCoiOpen, setIsCoiOpen] = useState(!evaluation.coiDeclared);
  const [coiConfirmed, setCoiConfirmed] = useState(evaluation.coiDeclared);

  // Verdict state
  const [verdict, setVerdict] = useState(evaluation.verdict);
  const [verdictSubmitted, setVerdictSubmitted] = useState(false);

  // ImageViewer state
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [zoom, setZoom] = useState(100);

  const handleRubricChange = (category, score) => {
    setRubricScores((prev) => ({ ...prev, [category]: score }));
  };

  const handleConfirmCoi = () => {
    setCoiConfirmed(true);
    setIsCoiOpen(false);
  };

  const handleSubmitVerdict = (v) => {
    setVerdict(v);
    setVerdictSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <Link to="/reviewer/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" icon="arrow_back">
              Back to Workspace
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">{evaluation.studyType}</Badge>
              <Badge variant={coiConfirmed ? 'success' : 'warning'} size="sm">
                {coiConfirmed ? 'COI Cleared' : 'COI Pending'}
              </Badge>
            </div>
            <h1 className="text-xl font-bold mt-1 text-white">{evaluation.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Submitted by {evaluation.researcherName} • {evaluation.institution}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!coiConfirmed && (
            <Button variant="warning" size="sm" icon="warning" onClick={() => setIsCoiOpen(true)}>
              Declare COI
            </Button>
          )}
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-200" icon="image" onClick={() => setShowImageViewer(true)}>
            View Imaging / DICOM Scans
          </Button>
        </div>
      </div>

      {verdictSubmitted && (
        <Alert type="tip" title="Evaluation Submitted">
          Decision <span className="font-bold uppercase tracking-wider">{verdict}</span> recorded and transmitted to institutional IRB board.
        </Alert>
      )}

      {/* Main Grid: Rubric & Compliance Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rubric Assessment Form (REV-01 to REV-08) */}
        <Card className="lg:col-span-2 space-y-6">
          <CardHeader>
            <CardTitle>Evaluation Rubric & Quality Scoring</CardTitle>
            <CardDescription>Score key protocol dimensions on a 5-point Likert scale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { key: 'scientificMethodology', title: '1. Scientific Methodology & Hypothesis Integrity', desc: 'Is the research rationale clearly defined with measurable endpoints?' },
              { key: 'ethicalCompliance', title: '2. Patient Safety & Ethical Safeguards', desc: 'Are risks minimized and informed consent protocols compliant with Declaration of Helsinki?' },
              { key: 'statisticalPower', title: '3. Statistical Power & Sample Derivation', desc: 'Is the primary endpoint sample size statistically justified?' },
              { key: 'dataProtection', title: '4. Data Confidentiality & Anonymization', desc: 'Is patient health information (PHI) protected under HIPAA/GDPR standards?' },
            ].map((item) => (
              <div key={item.key} className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</span>
                  <span className="text-xs font-mono font-bold text-teal-500">Score: {rubricScores[item.key]} / 5</span>
                </div>
                <p className="text-xs text-slate-500">{item.desc}</p>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => handleRubricChange(item.key, score)}
                      className={`w-9 h-9 rounded-lg font-bold text-xs transition-colors ${
                        rubricScores[item.key] === score
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Reviewer Final Comments & Recommendations
              </label>
              <textarea
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter detailed reviewer feedback..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Verdict Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
              <Button
                variant="primary"
                icon="check_circle"
                disabled={!coiConfirmed}
                onClick={() => handleSubmitVerdict('approved')}
              >
                Approve Protocol
              </Button>
              <Button
                variant="secondary"
                icon="edit_note"
                disabled={!coiConfirmed}
                onClick={() => handleSubmitVerdict('revisions_requested')}
              >
                Request Revisions
              </Button>
              <Button
                variant="danger"
                icon="cancel"
                disabled={!coiConfirmed}
                onClick={() => handleSubmitVerdict('rejected')}
              >
                Reject Protocol
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Assistant Panel (REV-09 to REV-12) */}
        <Card className="space-y-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Compliance Assistant</CardTitle>
              <Badge variant="primary">SPIRIT 2025</Badge>
            </div>
            <CardDescription className="text-xs">Automated regulatory audit checks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-xl text-center space-y-1">
              <div className="text-3xl font-black text-teal-600 dark:text-teal-400">{evaluation.complianceScore}%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Compliance Score</div>
            </div>

            <div className="space-y-3">
              {complianceRules.map((rule) => (
                <div key={rule.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{rule.code}</span>
                    <Badge variant={rule.status === 'pass' ? 'success' : 'warning'} size="sm">
                      {rule.status === 'pass' ? 'PASS' : 'WARN'}
                    </Badge>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">{rule.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflict of Interest (COI) Modal (REV-13 to REV-15) */}
      <Modal
        isOpen={isCoiOpen}
        onClose={() => setIsCoiOpen(false)}
        title="Conflict of Interest Disclosure"
        subtitle="Mandatory IRB Declaration prior to protocol evaluation"
      >
        <div className="space-y-4">
          <Alert type="warning" title="Mandatory Disclosure Required">
            You must verify that you have no financial, institutional, or personal conflicts of interest regarding this trial.
          </Alert>

          <div className="space-y-3 py-2">
            <Checkbox label="I confirm I have no financial interest in the sponsoring organization." defaultChecked />
            <Checkbox label="I confirm I am not a co-investigator on this study." defaultChecked />
            <Checkbox label="I agree to keep all protocol materials strictly confidential." defaultChecked />
          </div>

          <Button variant="primary" className="w-full" icon="verified" onClick={handleConfirmCoi}>
            Sign & Confirm COI Declaration
          </Button>
        </div>
      </Modal>

      {/* Medical Image / DICOM Viewer (REV-16 to REV-18) */}
      <Modal
        isOpen={showImageViewer}
        onClose={() => setShowImageViewer(false)}
        title="Medical Imaging & DICOM Scan Viewer"
        subtitle="Anonymized diagnostic scan preview"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg text-white text-xs">
            <div className="flex items-center gap-4">
              <span>Zoom: {zoom}%</span>
              <span>Brightness: {brightness}%</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon="zoom_in" onClick={() => setZoom((z) => Math.min(200, z + 20))}>
                Zoom In
              </Button>
              <Button variant="secondary" size="sm" icon="zoom_out" onClick={() => setZoom((z) => Math.max(50, z - 20))}>
                Zoom Out
              </Button>
              <Button variant="secondary" size="sm" icon="restart_alt" onClick={() => { setZoom(100); setBrightness(100); }}>
                Reset
              </Button>
            </div>
          </div>

          <div className="w-full h-80 bg-slate-950 rounded-xl flex items-center justify-center relative overflow-hidden border border-slate-800">
            <div
              className="text-center space-y-2 transition-all duration-150"
              style={{
                transform: `scale(${zoom / 100})`,
                filter: `brightness(${brightness}%)`,
              }}
            >
              <Icon name="biotech" size="2xl" className="text-teal-400 mx-auto" />
              <div className="text-xs font-mono text-slate-300">DICOM Slice #042 • Cardiac CT Angiography</div>
              <div className="text-[11px] text-slate-500">Anonymized Patient ID: #PAT-88219</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EvaluationPage;
