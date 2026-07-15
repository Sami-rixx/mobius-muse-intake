import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';
import { PipelineVisualization } from './PipelineVisualization';
import { FloatingParticles } from './FloatingParticles';

// Loader fallback
function Loader() {
  return null; // We'll add a proper loader later
}

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 50, near: 0.1, far: 1000 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} color="#C9A96E" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color="#2FA6A0"
        castShadow
      />
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.3}
        color="#1B3A5C"
      />
      
      <Suspense fallback={<Loader />}>
        <PipelineVisualization />
        <FloatingParticles count={30} />
        <Environment preset="city" />
      </Suspense>
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.2}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
