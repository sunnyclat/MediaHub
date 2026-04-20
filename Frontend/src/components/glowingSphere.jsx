import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import './glowingSphere.css';

function GlowingOrb({ mousePosition }) {
  const meshRef = useRef();
  const lightRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base auto rotation
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.1;
      
      // Mouse-influenced rotation (more responsive)
      if (mousePosition) {
        meshRef.current.rotation.y += mousePosition.x * 0.02;
        meshRef.current.rotation.x += mousePosition.y * 0.02;
      }
    }
    
    if (lightRef.current) {
      // Pulsating glow effect
      const time = state.clock.elapsedTime;
      lightRef.current.intensity = 1.5 + Math.sin(time * 2) * 0.5;
    }
  });

  return (
    <>
      <Sphere 
        ref={meshRef} 
        args={[2, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#00ffff" : "#00cccc"}
          emissive="#00ffff"
          emissiveIntensity={hovered ? 0.8 : 0.5}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Inner glow sphere */}
      <Sphere args={[1.8, 32, 32]}>
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.2}
        />
      </Sphere>
      
      {/* Outer glow */}
      <Sphere ref={lightRef} args={[2.5, 32, 32]}>
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.08}
          side={2}
        />
      </Sphere>
      
      {/* Point lights for glow effect */}
      <pointLight color="#00ffff" intensity={2} distance={10} />
      <pointLight color="#ff00ff" intensity={0.8} position={[3, 3, 3]} distance={8} />
      <pointLight color="#00ff88" intensity={0.5} position={[-3, -3, 3]} distance={8} />
    </>
  );
}

export default function GlowingSphere() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div className="sphere-container" ref={containerRef}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <color attach="background" args={['#0a0a0f']} />
        <ambientLight intensity={0.2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
        />
        <GlowingOrb mousePosition={mousePosition} />
      </Canvas>
      <div className="sphere-instructions">
        Move your mouse to interact
      </div>
    </div>
  );
}
