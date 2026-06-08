import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, OrbitControls, MeshDistortMaterial, Stars, Text, Icosahedron } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import * as THREE from 'three'

interface Auth3DBackgroundProps {
  theme?: 'salon' | 'spa' | 'default'
  showWelcome?: boolean
  userName?: string
}

// Advanced Glassmorphic Cube
function GlassmorphicCube({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.01
      meshRef.current.rotation.y += speed * 0.015
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.1}
        transparent
        opacity={0.4}
        envMapIntensity={1}
      />
    </mesh>
  )
}

// Morphing Sphere Animation
function MorphingSphere({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      meshRef.current.scale.y = 1 + Math.cos(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.6, 4]} />
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2.5}
        roughness={0.15}
        metalness={0.85}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// Salon Design - Hair styling elements (Enhanced)
function SalonDesign() {
  const meshRef = useRef<THREE.Mesh>(null)
  const meshRef2 = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
    if (meshRef2.current) {
      meshRef2.current.rotation.z = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        {/* Styling scissors representation */}
        <mesh ref={meshRef} position={[2, 1, 0]} scale={0.6}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#F472B6"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
        
        {/* Hair strand representation */}
        <mesh ref={meshRef2} position={[-2, 0, -1]} scale={0.5}>
          <torusGeometry args={[1, 0.2, 16, 50]} />
          <meshStandardMaterial
            color="#FBBF24"
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
      
      {/* Additional glassmorphic elements */}
      <GlassmorphicCube position={[-3, 2, -1]} color="#EC4899" speed={1.5} />
      <MorphingSphere position={[3, -1, 0]} color="#F59E0B" />
    </>
  )
}

// Spa Design - Relaxing spa elements (Enhanced)
function SpaDesign() {
  const meshRef = useRef<THREE.Mesh>(null)
  const bubbleRefs = useRef<THREE.Mesh[]>([])
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
    bubbleRefs.current.forEach((bubble, i) => {
      if (bubble) {
        bubble.position.y += 0.01
        if (bubble.position.y > 3) bubble.position.y = -3
      }
    })
  })

  const bubbles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.2
    }))
  }, [])

  return (
    <>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.8}>
        {/* Lotus flower representation */}
        <mesh ref={meshRef} position={[0, 0, 0]} scale={0.8}>
          <dodecahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#6EE7B7"
            attach="material"
            distort={0.4}
            speed={1.5}
            roughness={0.1}
            metalness={0.3}
          />
        </mesh>
        
        {/* Floating bubbles */}
        {bubbles.map((bubble, i) => (
          <mesh 
            key={i} 
            ref={el => { if (el) bubbleRefs.current[i] = el }}
            position={bubble.position}
            scale={bubble.scale}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color="#A7F3D0"
              transparent
              opacity={0.5}
              roughness={0}
              metalness={0.1}
            />
          </mesh>
        ))}
      </Float>

      {/* Additional glassmorphic elements */}
      <GlassmorphicCube position={[2.5, 1.5, -1]} color="#34D399" speed={0.8} />
      <MorphingSphere position={[-2.5, -1, 0]} color="#10B981" />
    </>
  )
}

// Default Design - Generic geometric (Enhanced)
function DefaultDesign() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef} position={[2, 1, 0]} scale={0.8}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color="#2563EB"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* Additional glassmorphic elements */}
      <GlassmorphicCube position={[-2, -1.5, 0]} color="#3B82F6" speed={1.2} />
      <MorphingSphere position={[2.5, -2, -1]} color="#60A5FA" />
    </>
  )
}

function Particles({ count = 200, color = "#818CF8" }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const velocities = useRef<number[][]>([])
  
  const particles = useMemo(() => {
    const temp = new THREE.Object3D()
    const positions: THREE.Object3D[] = []
    velocities.current = []
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 10
      
      temp.position.set(x, y, z)
      temp.updateMatrix()
      positions.push(temp.clone())
      
      // Random velocity for each particle
      velocities.current.push([
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01
      ])
    }
    
    return positions
  }, [count])

  useFrame((state) => {
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        const vel = velocities.current[i]
        particle.position.x += vel[0]
        particle.position.y += vel[1]
        particle.position.z += vel[2]
        
        // Wrap around boundaries
        if (particle.position.x > 10) particle.position.x = -10
        if (particle.position.x < -10) particle.position.x = 10
        if (particle.position.y > 10) particle.position.y = -10
        if (particle.position.y < -10) particle.position.y = 10
        
        particle.updateMatrix()
        meshRef.current!.setMatrixAt(i, particle.matrix)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </instancedMesh>
  )
}

function TorusAnimation({ color = "#A5B4FC" }) {
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
        color={color}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

function WelcomeAnimation({ show, name }: { show: boolean; name: string }) {
  const [visible, setVisible] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  
  useEffect(() => {
    if (show) {
      setTimeout(() => setVisible(true), 100)
    }
  }, [show])
  
  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })
  
  if (!visible) return null
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, 2, 0]}>
        <Text
          fontSize={0.5}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Welcome{name ? `, ${name}` : ''}!
        </Text>
      </group>
    </Float>
  )
}

function Scene({ theme = 'default', showWelcome = false, userName = '' }: { theme?: 'salon' | 'spa' | 'default', showWelcome?: boolean, userName?: string }) {
  const particleColor = theme === 'salon' ? '#EC4899' : theme === 'spa' ? '#6EE7B7' : '#60A5FA'
  const accentColor = theme === 'salon' ? '#F472B6' : theme === 'spa' ? '#34D399' : '#3B82F6'
  const mainColor = theme === 'salon' ? '#DB2777' : theme === 'spa' ? '#10B981' : '#2563EB'
  
  return (
    <>
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color={mainColor} />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color={accentColor} />
      <pointLight position={[0, 0, 10]} intensity={0.6} color={particleColor} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Particles count={200} color={particleColor} />
      
      {theme === 'salon' && <SalonDesign />}
      {theme === 'spa' && <SpaDesign />}
      {theme === 'default' && <DefaultDesign />}
      
      <TorusAnimation color={accentColor} />
      
      {showWelcome && <WelcomeAnimation show={showWelcome} name={userName} />}
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        rotateSpeed={0.2}
        autoRotate
        autoRotateSpeed={0.3}
      />
      
      <EffectComposer>
        <Bloom intensity={2} luminanceThreshold={0.15} luminanceSmoothing={0.85} />
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
      </EffectComposer>
    </>
  )
}

export default function Auth3DBackground({ theme = 'default', showWelcome = false, userName = '' }: Auth3DBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas 
        camera={{ position: [0, 0, 5.5], fov: 60 }} 
        dpr={[1, 2]}
        performance={{ min: 0.5, max: 1 }}
      >
        <Scene theme={theme} showWelcome={showWelcome} userName={userName} />
      </Canvas>
    </div>
  )
}
