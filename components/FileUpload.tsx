
import React, { useState, useCallback } from 'react';
import ModelIcon from './icons/ModelIcon';

interface FileUploadProps {
  onFileLoad: (file: File) => void;
}

export default function FileUpload({ onFileLoad }: FileUploadProps): React.ReactElement {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File | null | undefined) => {
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      onFileLoad(file);
    } else {
      alert('Please upload a .glb or .gltf file.');
    }
  }, [onFileLoad]);
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full max-w-lg h-80 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center p-8 transition-colors ${
          isDragging ? 'border-brand-secondary bg-dark-300/50' : 'border-dark-300 bg-dark-200'
        }`}
      >
        <input
          id="file-upload"
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <ModelIcon />
          <p className="mt-4 text-lg font-semibold text-dark-content">
            Drag & Drop your .glb file here
          </p>
          <p className="mt-1 text-sm text-gray-400">or click to browse</p>
        </label>
      </div>
    </div>
  );
}
