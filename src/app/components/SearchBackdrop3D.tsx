import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

function Particles({ count = 2000 }) {
  const ref = useRef<any>(null);
  
  // Generate random positions for particles
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return positions;
  }, [count]);

  // Animate particles
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.05;
      ref.current.rotation.y += delta * 0.07;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function FloatingShapes() {
  const meshRef1 = useRef<any>(null);
  const meshRef2 = useRef<any>(null);
  const meshRef3 = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (meshRef1.current) {
      meshRef1.current.rotation.x = t * 0.2;
      meshRef1.current.rotation.y = t * 0.3;
      meshRef1.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
    
    if (meshRef2.current) {
      meshRef2.current.rotation.x = t * 0.15;
      meshRef2.current.rotation.z = t * 0.2;
      meshRef2.current.position.y = Math.sin(t * 0.3 + 1) * 0.15;
    }
    
    if (meshRef3.current) {
      meshRef3.current.rotation.y = t * 0.25;
      meshRef3.current.position.y = Math.sin(t * 0.4 + 2) * 0.12;
    }
  });

  return (
    <>
      {/* Left floating shape */}
      <mesh ref={meshRef1} position={[-2, 0, 0]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* Right floating shape */}
      <mesh ref={meshRef2} position={[2.2, 0.2, 0]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          transparent 
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Center floating shape */}
      <mesh ref={meshRef3} position={[0, -0.3, 0]}>
        <tetrahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial 
          color="#93c5fd" 
          transparent 
          opacity={0.12}
          wireframe
        />
      </mesh>
    </>
  );
}

export function SearchBackdrop3D() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-sky-50/30 to-blue-50/50 dark:from-blue-950/30 dark:via-sky-950/20 dark:to-blue-950/30" />
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Particles count={1500} />
        <FloatingShapes />
      </Canvas>
    </div>
  );
}