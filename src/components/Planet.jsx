'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture, Text } from '@react-three/drei'
import * as THREE from 'three'

const Planet = ({ planet, onHover, onLeave, onClick, isMobile }) => {
  const { id, size, distance, speed, color, texture, name } = planet
  const planetRef = useRef()
  const textRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [tapped, setTapped] = useState(false)
  
  // Load texture if available, otherwise use color
  const planetTexture = texture ? useTexture(texture) : null
  
  // Increase planet size by multiplying the radius by 1.3
  // Make planets slightly larger on mobile for better visibility
  const planetSize = size * (isMobile ? 1.5 : 1.3)
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    
    // Calculate planet position in orbit
    const angle = time * speed
    const x = Math.cos(angle) * distance
    const z = Math.sin(angle) * distance
    
    if (planetRef.current) {
      planetRef.current.position.x = x
      planetRef.current.position.z = z
      planetRef.current.rotation.y += 0.01
      
      // Update text position to follow planet
      if (textRef.current) {
        textRef.current.position.x = x
        textRef.current.position.z = z
        textRef.current.position.y = planetSize + 1.5 // Position text above planet
        
        // Make text always face camera
        textRef.current.lookAt(0, 0, 0)
        textRef.current.rotation.y = Math.PI
      }
    }
  })
  
  const handlePointerOver = (e) => {
    e.stopPropagation()
    // Only show hover effect on desktop
    if (!isMobile) {
      setHovered(true)
      onHover && onHover()
      document.body.style.cursor = 'pointer'
    }
  }
  
  const handlePointerOut = (e) => {
    e.stopPropagation()
    if (!isMobile) {
      setHovered(false)
      onLeave && onLeave()
      document.body.style.cursor = 'auto'
    }
  }
  
  const handleClick = (e) => {
    e.stopPropagation()
    
    // On mobile, first tap shows info, second tap navigates
    if (isMobile) {
      if (!tapped) {
        setTapped(true)
        setHovered(true)
        onHover && onHover()
        // Reset after 3 seconds
        setTimeout(() => {
          setTapped(false)
          setHovered(false)
          onLeave && onLeave()
        }, 3000)
      } else {
        // Second tap navigates
        onClick && onClick()
      }
    } else {
      // Desktop: direct navigation
      onClick && onClick()
    }
  }
  
  return (
    <>
      {/* Subtle glow ring for better visibility on mobile */}
      {isMobile && (
        <Sphere args={[planetSize * 1.15, 16, 16]} position={[planetRef.current?.position.x || distance, 0, planetRef.current?.position.z || 0]}>
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={0.15} 
            side={THREE.BackSide} 
          />
        </Sphere>
      )}
      
      <Sphere
        ref={planetRef}
        args={[planetSize, isMobile ? 24 : 32, isMobile ? 24 : 32]}
        position={[distance, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {planetTexture ? (
          <meshStandardMaterial 
            map={planetTexture} 
            emissive={hovered ? color : '#000000'} 
            emissiveIntensity={hovered ? 0.5 : 0}
          />
        ) : (
          <meshStandardMaterial 
            color={color} 
            emissive={hovered ? color : '#000000'} 
            emissiveIntensity={hovered ? 0.5 : 0}
          />
        )}
      </Sphere>
      
      {/* Highlight ring when hovered */}
      {hovered && (
        <Sphere args={[planetSize * 1.2, isMobile ? 24 : 32, isMobile ? 24 : 32]} position={[planetRef.current?.position.x || distance, 0, planetRef.current?.position.z || 0]}>
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={0.2} 
            side={THREE.BackSide} 
          />
        </Sphere>
      )}
      
      <Text
        ref={textRef}
        position={[distance, planetSize + 1.5, 0]}
        fontSize={isMobile ? 1.5 : 1.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
        outlineOpacity={0.8}
      >
        {name}
      </Text>
      
      {/* Pulsing indicator for tap targets on mobile */}
      {isMobile && !tapped && (
        <Sphere args={[planetSize * 1.3, 16, 16]} position={[planetRef.current?.position.x || distance, 0, planetRef.current?.position.z || 0]}>
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={0.1 + Math.sin(Date.now() * 0.002) * 0.05} 
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </>
  )
}

export default Planet 