import React, { useState } from 'react';
import Icon from '../../../design-system/components/Icon';
import { generateReviewerToken } from '../../../services/studyStorageService';

export const ExternalReviewerModal = ({ studyId, isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [tokenGenerated, setTokenGenerated] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!email.trim()) return;
    const res = generateReviewerToken(studyId, email);
    setTokenGenerated(res);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest dark:bg-dark-card max-w-md w-full p-6 rounded-2xl border border-surface-container-high dark:border-gray-700 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3 border-surface-container dark:border-gray-700">
          <h3 className="text-sm font-bold text-on-surface dark:text-white flex items-center gap-2">
            <Icon name="person_add" size="sm" className="text-primary dark:text-teal-400" />
            <span>De-identified External Reviewer Access</span>
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <Icon name="close" size="sm" />
          </button>
        </div>

        {tokenGenerated ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 text-xs text-emerald-800 dark:text-emerald-300">
            <p className="font-bold flex items-center gap-1.5">
              <Icon name="check_circle" size="sm" />
              <span>De-identified Package Ready</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              Read-only de-identified token issued for <span className="font-mono font-bold">{tokenGenerated.email}</span>.
              All patient MRNs and personal identifiers are automatically masked.
            </p>
            <div className="p-2.5 rounded bg-emerald-950/20 font-mono text-[10px] text-emerald-500 border border-emerald-500/20 select-all">
              https://oskar-research.org/reviewer/access?token={tokenGenerated.tokenId}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-bold text-on-surface dark:text-gray-200">Reviewer Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reviewer@journal.org"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-surface-container-high dark:border-gray-700 bg-surface dark:bg-gray-800 text-on-surface dark:text-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-[11px] text-on-surface-variant dark:text-gray-300 space-y-1">
              <span className="font-bold text-primary dark:text-teal-300 block">De-identification Guard:</span>
              <p>The external reviewer will only receive pseudonymized participant codes, aggregated metrics, and verified variable dictionary schemas. Original MRNs remain 100% masked.</p>
            </div>

            <button
              type="button"
              disabled={!email.trim()}
              onClick={handleGenerate}
              className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-teal-700 transition-all cursor-pointer shadow-md disabled:opacity-40"
            >
              Generate De-identified Reviewer Package
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalReviewerModal;
