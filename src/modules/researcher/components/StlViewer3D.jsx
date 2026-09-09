import React, { useState } from 'react';
import Icon from '../../../design-system/components/Icon';

export const StlViewer3D = ({ title = '3D Dental Scan & Imaging Viewer', onSave }) => {
  const [activeView, setActiveView] = useState('upper'); // upper, lower, occlusion
  const [wireframe, setWireframe] = useState(false);
  const [rotation, setRotation] = useState(45);

  return (
    <div className="p-4 rounded-2xl bg-surface-container-lowest dark:bg-dark-card border border-surface-container-high dark:border-gray-700/60 space-y-4">
      <div className="flex items-center justify-between border-b pb-3 border-surface-container dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Icon name="view_in_ar" size="md" className="text-primary dark:text-teal-400" />
          <h4 className="text-xs font-bold text-on-surface dark:text-white">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('upper')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${activeView === 'upper' ? 'bg-primary text-white' : 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400'}`}
          >
            Upper Arch STL
          </button>
          <button
            type="button"
            onClick={() => setActiveView('lower')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${activeView === 'lower' ? 'bg-primary text-white' : 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400'}`}
          >
            Lower Arch STL
          </button>
          <button
            type="button"
            onClick={() => setActiveView('occlusion')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${activeView === 'occlusion' ? 'bg-primary text-white' : 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-400'}`}
          >
            Occlusion Alignment
          </button>
        </div>
      </div>

      {/* Simulated 3D Viewport */}
      <div className="relative h-48 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
        <div className="absolute top-2 left-2 flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
          <span>Active Mesh: {activeView.toUpperCase()}_MODEL.stl</span>
          <span>Triangles: 142,850</span>
        </div>

        <div className="text-center space-y-2 transform transition-transform" style={{ transform: `rotate(${rotation}deg)` }}>
          <div className="w-24 h-24 mx-auto border-4 border-teal-500/40 rounded-full flex items-center justify-center animate-pulse">
            <Icon name="orthopedics" size="lg" className="text-teal-400" />
          </div>
          <span className="text-[11px] font-mono text-teal-300 font-bold block">
            {wireframe ? '[Wireframe Rendering Active]' : '[Solid Mesh Model Active]'}
          </span>
        </div>

        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            className="px-2 py-1 rounded bg-slate-800 text-white font-mono text-[10px] hover:bg-slate-700 cursor-pointer"
          >
            Toggle Wireframe
          </button>
          <button
            type="button"
            onClick={() => setRotation((r) => (r + 45) % 360)}
            className="px-2 py-1 rounded bg-slate-800 text-white font-mono text-[10px] hover:bg-slate-700 cursor-pointer"
          >
            Rotate Mesh 45°
          </button>
        </div>
      </div>
    </div>
  );
};

export default StlViewer3D;
