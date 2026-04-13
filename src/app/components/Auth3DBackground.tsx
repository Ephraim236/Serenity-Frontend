import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, MeshDistortMaterial, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={[2, 1, 0]} scale={0.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#6366F1"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

function Particles({ count = 200 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  
  const particles = useMemo(() => {
    const temp = new THREE.Object3D()
    const positions: THREE.Object3D[] = []
    
    for (let i = 0; i < count; i++) {
      temp.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10
      )
      temp.updateMatrix()
      positions.push(temp.clone())
    }
    
    return positions
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        particle.position.y += Math.sin(state.clock.elapsedTime + i) * 0.002
        particle.updateMatrix()
        meshRef.current!.setMatrixAt(i, particle.matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#818CF8" transparent opacity={0.6} />
    </instancedMesh>
  )
}

function TorusAnimation() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <mesh ref={meshRef} position={[-2.5, -1, -2]} rotation={[Math.PI / 3, 0, 0]}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <meshStandardMaterial
        color="#A5B4FC"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#6366F1" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Particles count={150} />
      <FloatingGeometry />
      <TorusAnimation />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        rotateSpeed={0.2}
        autoRotate
        autoRotateSpeed={0.3}
      />
      
      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
      </EffectComposer>
    </>
  )
}

export default function Auth3DBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
    </div>
  )
}
