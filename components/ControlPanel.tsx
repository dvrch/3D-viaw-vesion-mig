
import React from 'react';
import { ModelInfo } from '../types';

interface ControlPanelProps {
  modelInfo: ModelInfo | null;
  isWireframe: boolean;
  setIsWireframe: (isWireframe: boolean) => void;
  onClearModel: () => void;
  onResetControls: () => void;
}

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void; }) => (
    <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium">{label}</span>
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <div className={`block w-10 h-6 rounded-full ${checked ? 'bg-brand-secondary' : 'bg-dark-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
        </div>
    </label>
);

export default function ControlPanel({ modelInfo, isWireframe, setIsWireframe, onClearModel, onResetControls }: ControlPanelProps): React.ReactElement {
  return (
    <aside className="w-full md:w-72 bg-dark-200 p-4 border-b md:border-r border-dark-300 flex-shrink-0 z-10">
      <div className="space-y-6 pt-16 md:pt-0">
        <h2 className="text-xl font-semibold border-b border-dark-300 pb-2">Controls</h2>

        {modelInfo ? (
            <div className="space-y-4">
              <div>
                  <h3 className="text-md font-semibold mb-2">Model Information</h3>
                  <div className="text-sm space-y-1 text-dark-content bg-dark-100 p-3 rounded-md">
                    <p className="truncate"><strong>Name:</strong> {modelInfo.name}</p>
                    <p><strong>Size:</strong> {formatBytes(modelInfo.size)}</p>
                  </div>
              </div>
              <div>
                  <h3 className="text-md font-semibold mb-2">View Options</h3>
                  <div className="space-y-3 bg-dark-100 p-3 rounded-md">
                      <Toggle label="Wireframe" checked={isWireframe} onChange={setIsWireframe} />
                      <button 
                        onClick={onResetControls} 
                        className="w-full text-sm bg-dark-300 hover:bg-slate-600 text-dark-content font-semibold py-2 px-4 rounded-md transition-colors"
                      >
                          Reset Camera
                      </button>
                  </div>
              </div>
               <button
                  onClick={onClearModel}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Clear Model
                </button>
            </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-dark-content text-sm">Upload a .glb model to begin.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
