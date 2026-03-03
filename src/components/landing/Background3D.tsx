"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, useScroll } from "@react-three/drei";
import * as THREE from "three";


function FloatingCore() {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        temp.push(new THREE.Vector3(x, y, z));
    }
    return temp;
  }, []);

  return (
    <group>
      {particles.map((pos, i) => (
        <Float key={i} speed={Math.random() * 2} floatIntensity={Math.random() * 5}>
          <mesh position={pos}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#70C0FA" emissive="#70C0FA" emissiveIntensity={2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#70C0FA" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ffffff" />
        
        <FloatingCore />
        
        <fog attach="fog" args={["#70C0FA", 5, 15]} />
      </Canvas>
    </div>
  );
}
