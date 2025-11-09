
import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';
// FIX: Import OrbitControls type from three-stdlib to match @react-three/drei's component ref type.
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface ModelProps {
  modelUrl: string;
  isWireframe: boolean;
}

function Model({ modelUrl, isWireframe }: ModelProps) {
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.wireframe = isWireframe;
      }
    });
  }, [scene, isWireframe]);

  // The previous cast to React.ReactNode was likely causing runtime errors
  // by preventing the @react-three/fiber reconciler from handling this element.
  // With consistent React versions, this should render correctly.
  return <primitive object={scene} />;
}

interface Viewer3DProps {
  modelUrl: string;
  isWireframe: boolean;
  setResetControls: React.Dispatch<React.SetStateAction<() => void>>;
}

const LoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center bg-dark-200">
        <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-brand-secondary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-medium text-dark-content">Loading 3D Model...</p>
        </div>
    </div>
);

export default function Viewer3D({ modelUrl, isWireframe, setResetControls }: Viewer3DProps): React.ReactElement {
    const controlsRef = useRef<OrbitControlsImpl>(null!);

    useEffect(() => {
        setResetControls(() => () => {
            if (controlsRef.current) {
                controlsRef.current.reset();
            }
        });
    }, [setResetControls]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Canvas camera={{ fov: 45, position: [0, 2, 5] }} className="bg-dark-200">
        <Stage environment="city" intensity={0.6}>
          <Model modelUrl={modelUrl} isWireframe={isWireframe} />
        </Stage>
        <OrbitControls ref={controlsRef} makeDefault />
      </Canvas>
    </Suspense>
  );
}