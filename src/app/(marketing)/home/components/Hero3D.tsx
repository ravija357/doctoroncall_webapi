"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

function FloatingObject({ position, color, size, speed, type }: { position: [number, number, number], color: string, size: number, speed: number, type: 'sphere' | 'cross' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y += Math.sin(time * speed) * 0.005;
    meshRef.current.rotation.x += 0.005 * speed;
    meshRef.current.rotation.y += 0.003 * speed;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={1} floatIntensity={1}>
      {type === 'sphere' ? (
        <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
          <MeshDistortMaterial
            color={color}
            speed={speed * 2}
            distort={0.3}
            radius={1}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.6}
          />
        </Sphere>
      ) : (
        <mesh ref={meshRef} position={position}>
          <boxGeometry args={[size, size * 0.3, size * 0.3]} />
          <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
          {/* Add vertical part of the cross */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[size, size * 0.3, size * 0.3]} />
            <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
          </mesh>
        </mesh>
      )}
    </Float>
  );
}

function Scene() {
  const objects = useMemo(() => {
    const list = [];
    for (let i = 0; i < 40; i++) {
        const distance = 10 + Math.random() * 500; // Large scale for logarithmic effect
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * distance * 0.5;
        const y = (Math.random() - 0.5) * distance * 0.5;
        const z = -distance;
        
        list.push({
            position: [x, y, z] as [number, number, number],
            color: i % 2 === 0 ? '#70c0fa' : '#9ad4fc',
            size: 1 + Math.random() * 3,
            speed: 0.2 + Math.random() * 0.5,
            type: Math.random() > 0.7 ? 'cross' : 'sphere' as const
        });
    }
    return list;
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      
      {objects.map((obj, i) => (
        <FloatingObject key={i} {...obj} />
      ))}
      
      <Environment preset="city" />
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Canvas
        gl={{ 
            logarithmicDepthBuffer: true,
            antialias: true,
            alpha: true 
        }}
        camera={{ position: [0, 0, 20], fov: 45, far: 10000 }}
      >
        <Scene />
      </Canvas>
      {/* Overlay gradient to blend with page */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
    </div>
  );
}
