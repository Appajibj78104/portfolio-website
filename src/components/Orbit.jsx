'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Orbit = ({ radius }) => {
  const orbitRef = useRef()
  
  // Create orbit path
  const points = []
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ))
  }
  
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points)
  
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
        opacity={0.3} 
        linewidth={2}
      />
    </line>
  )
}

export default Orbit 