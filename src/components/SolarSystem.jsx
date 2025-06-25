'use client'

import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import Sun from './Sun'
import Planet from './Planet'
import Orbit from './Orbit'
import PlanetInfo from './ui/PlanetInfo'
import { planets } from '@/constants/planetData'
import styles from '@/styles/components/SolarSystem.module.scss'

const SolarSystem = ({ onPlanetClick }) => {
  const [hoveredPlanet, setHoveredPlanet] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const controlsRef = useRef()
  
  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const handlePlanetHover = (planet) => {
    setHoveredPlanet(planet)
  }
  
  const handlePlanetLeave = () => {
    setHoveredPlanet(null)
  }
  
  const handlePlanetClick = (planet) => {
    onPlanetClick(planet.id)
  }
  
  const handleSunClick = () => {
    onPlanetClick('home')
  }
  
  const handleLegendClick = (planetId) => {
    onPlanetClick(planetId)
  }
  
  return (
    <motion.div 
      className={styles.solarSystemContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <Canvas 
        camera={{ position: isMobile ? [0, 35, 0] : [0, 30, 0], fov: isMobile ? 70 : 60 }}
        className={styles.canvas}
      >
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.2} />
        
        <Suspense fallback={null}>
          <Sun onClick={handleSunClick} />
          
          {planets.map((planet) => (
            <group key={planet.id}>
              <Orbit radius={planet.distance} />
              <Planet 
                planet={planet}
                onHover={() => handlePlanetHover(planet)}
                onLeave={handlePlanetLeave}
                onClick={() => handlePlanetClick(planet)}
                isMobile={isMobile}
              />
            </group>
          ))}
          
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
          />
          
          <OrbitControls 
            ref={controlsRef}
            enableZoom={true}
            minDistance={isMobile ? 8 : 5}
            maxDistance={isMobile ? 60 : 50}
            enablePan={false}
            autoRotate
            autoRotateSpeed={isMobile ? 0.3 : 0.5}
          />
        </Suspense>
      </Canvas>
      
      {hoveredPlanet && (
        <PlanetInfo planet={hoveredPlanet} />
      )}
      
      <div className={styles.instructions}>
        <p>Click on a planet to explore that section</p>
        <p>Drag to rotate | Scroll to zoom</p>
      </div>
      
      <motion.div 
        className={styles.title}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h1>Welcome to Portfolio Website</h1>
        <h2>APPAJI B.</h2>
        <p>Navigate through my professional universe</p>
      </motion.div>
      
      <div className={`${styles.legend} ${isMobile ? styles.mobileLegend : ''}`}>
        <h3>Portfolio Sections</h3>
        <ul>
          <li 
            className={styles.legendItem}
            onClick={() => handleLegendClick('home')}
          >
            <span className={styles.colorDot} style={{ backgroundColor: '#ffcc00' }}></span>
            <span>Home</span>
          </li>
          {planets.map((planet) => (
            <li 
              key={planet.id} 
              onClick={() => handleLegendClick(planet.id)}
              className={styles.legendItem}
            >
              <span className={styles.colorDot} style={{ backgroundColor: planet.color }}></span>
              <span>{planet.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default SolarSystem 