import React, { useState } from 'react';
import Icon from '../../../design-system/components/Icon';
import { addAuditLog } from '../../../services/studyStorageService';

export const SupervisorApprovalGate = ({ studyId, initialStatus = 'Pending Supervisor Review', onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const [comments, setComments] = useState('');
  const [history, setHistory] = useState([
    { timestamp: new Date(Date.now() - 7200000).toLocaleString(), user: 'Dr. Sarah (PI)', status: 'Submitted for Review', notes: 'Initial protocol submission.' },
  ]);

  const handleApprove = () => {
    const nextStatus = 'Approved by Dept Head';
    setStatus(nextStatus);
    const newEntry = {
      timestamp: new Date().toLocaleString(),
      user: 'Prof. Tariq Al-Otaibi (Supervisor)',
      status: 'Approved',
      notes: comments || 'Protocol approved without revisions.',
    };
    setHistory([newEntry, ...history]);
    addAuditLog({ studyId, action: 'Supervisor Approval Granted', user: 'Prof. Tariq Al-Otaibi', details: newEntry.notes });
    if (onStatusChange) onStatusChange(nextStatus);
    setComments('');
  };

  const handleRequestChanges = () => {
    const nextStatus = 'Changes Requested';
    setStatus(nextStatus);
    const newEntry = {
      timestamp: new Date().toLocaleString(),
      user: 'Prof. Tariq Al-Otaibi (Supervisor)',
      status: 'Changes Requested',
      notes: comments || 'Please clarify inclusion criteria age bounds.',
    };
    setHistory([newEntry, ...history]);
    addAuditLog({ studyId, action: 'Supervisor Requested Revisions', user: 'Prof. Tariq Al-Otaibi', details: newEntry.notes });
    if (onStatusChange) onStatusChange(nextStatus);
    setComments('');
  };

  const handleResubmit = () => {
    const nextStatus = 'Resubmitted for Review';
    setStatus(nextStatus);
    const newEntry = {
      timestamp: new Date().toLocaleString(),
      user: 'Dr. Sarah (PI)',
      status: 'Resubmitted',
      notes: 'Updated protocol criteria as requested by supervisor.',
    };
    setHistory([newEntry, ...history]);
    addAuditLog({ studyId, action: 'Protocol Resubmitted to Supervisor', user: 'Dr. Sarah', details: newEntry.notes });
    if (onStatusChange) onStatusChange(nextStatus);
  };

  return (
    <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-4 text-xs">
      <div className="flex items-center justify-between border-b pb-3 border-surface-container dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Icon name="verified_user" size="md" className="text-primary dark:text-teal-400" />
          <h4 className="font-bold text-on-surface dark:text-white">Supervisor Approval Gate & Revisions Loop</h4>
        </div>
        <span className={`px-2.5 py-1 rounded font-mono text-[11px] font-bold ${
          status.includes('Approved') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
          status.includes('Changes') ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-primary/10 text-primary dark:text-teal-300'
        }`}>
          Status: {status}
        </span>
      </div>

      <div className="space-y-3">
        <textarea
          rows={2}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Enter supervisor notes / revision requests..."
          className="w-full p-2.5 rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white"
        />

        <div className="flex items-center justify-end gap-2">
          {status.includes('Changes') ? (
            <button
              type="button"
              onClick={handleResubmit}
              className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-teal-700 transition-all cursor-pointer shadow-sm"
            >
              Resubmit Revised Protocol
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRequestChanges}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-all cursor-pointer shadow-sm"
              >
                Request Revisions
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all cursor-pointer shadow-sm"
              >
                Approve Protocol
              </button>
            </>
          )}
        </div>

        {/* History Loop */}
        <div className="space-y-1.5 pt-2 border-t border-surface-container dark:border-gray-700">
          <span className="font-bold text-on-surface-variant dark:text-gray-400 text-[10px] uppercase block">Approval History Log</span>
          {history.map((h, idx) => (
            <div key={idx} className="p-2 rounded-lg bg-surface-container dark:bg-gray-800 flex items-center justify-between text-[11px]">
              <span className="font-mono text-gray-500">{h.timestamp}</span>
              <span className="font-bold text-on-surface dark:text-white">{h.user}</span>
              <span className="font-semibold text-primary dark:text-teal-300">{h.status}</span>
              <span className="text-gray-400 text-[10px] truncate max-w-xs">{h.notes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupervisorApprovalGate;
