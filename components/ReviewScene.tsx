'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { REVIEW_STAGES, ReviewLens, ReviewStage } from './StaticReviewPipeline';

const STAGE_COLORS = ['#6C7BFF', '#3FB68B', '#E8B44F', '#E4572E'];
const STAGE_POSITIONS: [number, number, number][] = [
  [-3.15, 0, 0],
  [-1.05, 0.35, -0.1],
  [1.05, -0.2, 0.05],
  [3.15, 0.15, -0.05],
];

type StageBlockProps = {
  stage: ReviewStage;
  index: number;
  selected: boolean;
  lens: ReviewLens;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
};

function StageBlock({ stage, index, selected, lens, reducedMotion, onSelect }: StageBlockProps) {
  const group = useRef<THREE.Group>(null);
  const color = STAGE_COLORS[index];
  const emphasis = lens === 'risk' && stage.id === 'review' ? 1.35 : lens === 'tests' && stage.id === 'tests' ? 1.25 : 1;

  useFrame((_, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += delta * 0.12;
    group.current.position.y += Math.sin(Date.now() * 0.001 + index) * delta * 0.035;
  });

  return (
    <group ref={group} position={STAGE_POSITIONS[index]} scale={selected ? emphasis * 1.1 : emphasis} onClick={(event) => { event.stopPropagation(); onSelect(stage.id); }}>
      <mesh castShadow={false} receiveShadow={false}>
        <boxGeometry args={[1.45, 1.45, 1.45]} />
        <meshStandardMaterial color={selected ? '#F5F7FA' : color} emissive={selected ? color : '#000000'} emissiveIntensity={selected ? 0.35 : 0.05} roughness={0.34} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0, 0.74]}>
        <planeGeometry args={[0.88, 0.88]} />
        <meshBasicMaterial color={selected ? color : '#0F1115'} transparent opacity={0.82} />
      </mesh>
    </group>
  );
}

function PipelineObjects({ selectedId, lens, reducedMotion, onSelect }: { selectedId: string; lens: ReviewLens; reducedMotion: boolean; onSelect: (id: string) => void }) {
  const connectorMaterial = <meshBasicMaterial color="#596273" transparent opacity={0.45} />;

  return (
    <>
      {REVIEW_STAGES.map((stage, index) => (
        <StageBlock key={stage.id} stage={stage} index={index} selected={selectedId === stage.id} lens={lens} reducedMotion={reducedMotion} onSelect={onSelect} />
      ))}
      {[[-2.1, 0.05, 0], [0, 0.05, 0], [2.1, 0.05, 0]].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.1, 8]} />
          {connectorMaterial}
        </mesh>
      ))}
      <mesh position={[0, -1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.2, 3.6]} />
        <meshStandardMaterial color="#171A21" roughness={0.82} metalness={0.05} />
      </mesh>
    </>
  );
}

export default function ReviewScene({ selectedId, lens, reducedMotion, onSelect }: { selectedId: string; lens: ReviewLens; reducedMotion: boolean; onSelect: (id: string) => void }) {
  return (
    <div className="h-[360px] w-full overflow-hidden border border-white/10 bg-[#0B0D11] sm:h-[430px]" aria-label="Interactive 3D review pipeline">
      <Canvas
        camera={{ position: [0, 2.2, 8.6], fov: 40 }}
        dpr={[1, 1]}
        gl={{ antialias: false, powerPreference: 'low-power' }}
        onCreated={({ gl }) => { gl.setClearColor('#0B0D11'); }}
        frameloop="demand"
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[2, 5, 5]} intensity={2.2} />
        <pointLight position={[-4, 2, 2]} intensity={10} distance={12} color="#6C7BFF" />
        <PipelineObjects selectedId={selectedId} lens={lens} reducedMotion={reducedMotion} onSelect={onSelect} />
        <OrbitControls enablePan={false} minDistance={6.5} maxDistance={11} maxPolarAngle={Math.PI / 2.05} minPolarAngle={Math.PI / 3.5} />
      </Canvas>
    </div>
  );
}
