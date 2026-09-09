import React, { useState } from 'react';
import Icon from '../../../design-system/components/Icon';

export const CephalometricLandmarkCard = () => {
  const [landmarks, setLandmarks] = useState([
    { id: 'S', name: 'Sella (S)', coord: 'X: 124.5, Y: 88.2', status: 'Verified' },
    { id: 'N', name: 'Nasion (N)', coord: 'X: 185.1, Y: 72.0', status: 'Verified' },
    { id: 'A', name: 'Subspinale (A)', coord: 'X: 172.4, Y: 142.8', status: 'Verified' },
    { id: 'B', name: 'Supramentale (B)', coord: 'X: 165.0, Y: 188.4', status: 'Verified' },
  ]);

  const [angles] = useState({
    sna: '82.4° (Normal: 82° ± 2°)',
    snb: '79.8° (Normal: 80° ± 2°)',
    anb: '2.6° (Class I Skeletal Pattern)',
  });

  return (
    <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-4">
      <div className="flex items-center justify-between border-b pb-3 border-surface-container dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Icon name="straighten" size="md" className="text-primary dark:text-teal-400" />
          <h4 className="text-xs font-bold text-on-surface dark:text-white">Cephalometric API Landmark Tracing & Angular Analysis</h4>
        </div>
        <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
          API Connected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-2">
          <span className="font-bold text-on-surface dark:text-gray-200 block text-[11px]">Detected Cephalometric Landmarks</span>
          <div className="space-y-1">
            {landmarks.map((l) => (
              <div key={l.id} className="p-2 rounded-lg bg-surface-container dark:bg-gray-800 flex items-center justify-between font-mono text-[11px]">
                <span className="font-bold text-primary dark:text-teal-300">{l.name}</span>
                <span className="text-gray-500">{l.coord}</span>
                <span className="text-emerald-500 font-bold">{l.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-bold text-on-surface dark:text-gray-200 block text-[11px]">Computed Skeletal Angular Parameters</span>
          <div className="p-3.5 rounded-xl bg-surface-container dark:bg-gray-800 space-y-2 text-[11px] font-mono">
            <div><span className="text-gray-400">SNA Angle:</span> <span className="font-bold text-on-surface dark:text-white">{angles.sna}</span></div>
            <div><span className="text-gray-400">SNB Angle:</span> <span className="font-bold text-on-surface dark:text-white">{angles.snb}</span></div>
            <div><span className="text-gray-400">ANB Differential:</span> <span className="font-bold text-emerald-600 dark:text-emerald-400">{angles.anb}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CephalometricLandmarkCard;
