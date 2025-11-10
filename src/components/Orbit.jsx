'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Orbit = ({ radius, isMobile = false }) => {
  const orbitRef = useRef()
  
  // Create orbit path - use fewer points on mobile for performance
  const orbitGeometry = useMemo(() => {
    const points = []
    const segments = isMobile ? 64 : 100
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [radius, isMobile])
  
  useFrame(({ clock }) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })
  
  return (
    <line ref={orbitRef}>
      <bufferGeometry attach="geometry" {...orbitGeometry} />
      <lineBasicMaterial 
        attach="material" 
        color="#ffffff" 
        transparent 
        opacity={isMobile ? 0.2 : 0.3} 
        linewidth={2}
      />
    </line>
  )
}

export default Orbit 