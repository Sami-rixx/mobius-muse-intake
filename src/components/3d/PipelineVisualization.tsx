import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Node positions (Collect, Validate, Consume)
const NODE_POSITIONS = [
  { x: -8, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
  { x: 8, y: 0, z: 0 },
];

// Node configurations
const NODE_CONFIGS = [
  {
    label: 'COLLECT',
    description: 'Web Intake Form',
    color: '#2FA6A0',
    subLabel: 'Step 1: School & Policy',
  },
  {
    label: 'VALIDATE',
    description: 'Blueprint Gatechecker',
    color: '#C9A96E',
    subLabel: 'Step 2: Subject Roster',
  },
  {
    label: 'CONSUME',
    description: 'Workload Balancer',
    color: '#1B3A5C',
    subLabel: 'Step 3: Teachers',
  },
];

// Gate node component
function GateNode({ position, config }: { position: { x: number; y: number; z: number }; config: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Subtle pulsing animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group position={[position.x, position.y, position.z]}>
      {/* Gate structure - two vertical bars and a horizontal bar */}
      <group rotation={[0, Math.PI / 4, 0]}>
        {/* Vertical bars */}
        <mesh ref={meshRef} position={[-0.5, 0, 0]}>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshStandardMaterial
            color={config.color}
            metalness={0.8}
            roughness={0.2}
            emissive={config.color}
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshStandardMaterial
            color={config.color}
            metalness={0.8}
            roughness={0.2}
            emissive={config.color}
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Horizontal bar */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1.2, 0.2, 0.2]} />
          <meshStandardMaterial
            color={config.color}
            metalness={0.8}
            roughness={0.2}
            emissive={config.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
      
      {/* Label */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.4}
        color={config.color}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/fraunces/v20/6ae84K2ZUe4Qb7N6-CpE3-I635pN.woff"
      >
        {config.label}
      </Text>
      
      {/* Sub-label */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.25}
        color="#A0A0A0"
        anchorX="center"
        anchorY="middle"
      >
        {config.subLabel}
      </Text>
      
      {/* Description */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.2}
        color="#6B7280"
        anchorX="center"
        anchorY="middle"
      >
        {config.description}
      </Text>
    </group>
  );
}

// Flow line between nodes
function FlowLine({ from, to, color }: { from: { x: number; y: number; z: number }; to: { x: number; y: number; z: number }; color: string }) {
  const points = [
    new THREE.Vector3(from.x, from.y, from.z),
    new THREE.Vector3(to.x, to.y, to.z),
  ];
  
  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          count={2}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color={color} linewidth={2} />
    </line>
  );
}

// Möbius strip background element
function MobiusStrip() {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const u = 0;
  const v = 0;
  
  // Create a simple Möbius strip
  for (let i = 0; i <= 100; i++) {
    const theta = (i / 100) * Math.PI * 2;
    const phi = (i / 100) * Math.PI;
    const r = 20;
    
    // Möbius strip parametric equations
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const z = (r / 2) * Math.sin(phi) * Math.cos(theta / 2);
    
    vertices.push(x, y, z);
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
  
  return (
    <lineLoop>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(vertices)}
          count={vertices.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="#1B3A5C" transparent opacity={0.1} />
    </lineLoop>
  );
}

export function PipelineVisualization() {
  return (
    <group>
      {/* Möbius strip in background */}
      <MobiusStrip />
      
      {/* Pipeline nodes */}
      {NODE_POSITIONS.map((position, index) => (
        <GateNode key={index} position={position} config={NODE_CONFIGS[index]} />
      ))}
      
      {/* Flow lines */}
      <FlowLine from={NODE_POSITIONS[0]} to={NODE_POSITIONS[1]} color="#2FA6A0" />
      <FlowLine from={NODE_POSITIONS[1]} to={NODE_POSITIONS[2]} color="#C9A96E" />
      
      {/* Loop back connection (subtle) */}
      <FlowLine from={NODE_POSITIONS[2]} to={NODE_POSITIONS[0]} color="#1B3A5C" />
    </group>
  );
}
