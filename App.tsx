
import React, { useState, useCallback } from 'react';
import { ModelInfo } from './types';
import Viewer3D from './components/Viewer3D';
import ControlPanel from './components/ControlPanel';
import FileUpload from './components/FileUpload';
import Chatbot from './components/Chatbot';

export default function App(): React.ReactElement {
  const [modelFileUrl, setModelFileUrl] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [resetControls, setResetControls] = useState<() => void>(() => () => {});
  
  const handleFileLoad = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setModelFileUrl(url);
    setModelInfo({
      name: file.name,
      size: file.size,
    });
  }, []);

  const handleClearModel = useCallback(() => {
    if (modelFileUrl) {
      URL.revokeObjectURL(modelFileUrl);
    }
    setModelFileUrl(null);
    setModelInfo(null);
    setIsWireframe(false);
  }, [modelFileUrl]);

  return (
    <div className="min-h-screen bg-dark-100 text-dark-content flex flex-col md:flex-row overflow-hidden">
      <header className="absolute top-0 left-0 p-4 z-20">
          <h1 className="text-2xl font-bold text-white">
            Visio<span className="text-brand-secondary">3D</span>
          </h1>
      </header>

      <ControlPanel
        modelInfo={modelInfo}
        isWireframe={isWireframe}
        setIsWireframe={setIsWireframe}
        onClearModel={handleClearModel}
        onResetControls={resetControls}
      />

      <main className="flex-1 h-screen flex flex-col relative">
        {modelFileUrl ? (
          <Viewer3D
            modelUrl={modelFileUrl}
            isWireframe={isWireframe}
            setResetControls={setResetControls}
          />
        ) : (
          <FileUpload onFileLoad={handleFileLoad} />
        )}
      </main>

      <Chatbot />
    </div>
  );
}
