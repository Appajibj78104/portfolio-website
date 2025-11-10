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
  const [isLandscape, setIsLandscape] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [legendOpen, setLegendOpen] = useState(false)
  const controlsRef = useRef()
  
  // Detect mobile devices and orientation
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setIsMobile(width <= 768)
      setIsLandscape(width > height && width <= 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])
  
  const handlePlanetHover = (planet) => {
    setHoveredPlanet(planet)
  }
  
  const handlePlanetLeave = () => {
    setHoveredPlanet(null)
  }
  
  const handlePlanetClick = (planet) => {
    setShowHint(false) // Hide hint after first interaction
    onPlanetClick(planet.id)
  }
  
  const handleSunClick = () => {
    setShowHint(false) // Hide hint after first interaction
    onPlanetClick('home')
  }
  
  const handleLegendClick = (planetId) => {
    setShowHint(false)
    if (isMobile) {
      setLegendOpen(false) // Close legend after selection on mobile
    }
    onPlanetClick(planetId)
  }
  
  return (
    <motion.div 
      className={`${styles.solarSystemContainer} ${isLandscape ? styles.landscapeMode : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      role="main"
      aria-label="Interactive 3D solar system portfolio navigation"
    >
      {/* Skip navigation for accessibility */}
      <a href="#portfolio-nav" className={styles.skipLink}>
        Skip to navigation
      </a>
      
      <Canvas 
        camera={{ 
          position: isMobile ? (isLandscape ? [0, 30, 0] : [0, 45, 0]) : [0, 30, 0], // Increased mobile camera distance
          fov: isMobile ? (isLandscape ? 65 : 75) : 60 // Wider field of view on mobile
        }}
        className={styles.canvas}
        aria-hidden="true"
        style={{ touchAction: 'none' }} // Ensure canvas can receive all touch events
      >
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.2} />
        
        <Suspense fallback={null}>
          <Sun onClick={handleSunClick} isMobile={isMobile} />
          
          {planets.map((planet) => (
            <group key={planet.id}>
              <Orbit radius={planet.distance} isMobile={isMobile} />
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
            count={isMobile ? 2000 : 5000} 
            factor={4} 
            saturation={0} 
          />
          
          <OrbitControls 
            ref={controlsRef}
            enableZoom={true}
            minDistance={isMobile ? 15 : 5} // Allow closer zoom on mobile
            maxDistance={isMobile ? 80 : 50} // Allow much farther zoom on mobile to see all planets
            enablePan={false}
            autoRotate
            autoRotateSpeed={isMobile ? 0.3 : 0.5}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={isMobile ? 0.5 : 1}
            zoomSpeed={isMobile ? 0.8 : 1} // Faster zoom on mobile
            touches={{
              ONE: 2, // TOUCH.ROTATE
              TWO: 1  // TOUCH.DOLLY (pinch to zoom)
            }}
          />
        </Suspense>
      </Canvas>
      
      {hoveredPlanet && !isMobile && (
        <PlanetInfo planet={hoveredPlanet} />
      )}
      
      {hoveredPlanet && isMobile && (
        <motion.div 
          className={styles.planetInfoModal}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className={styles.modalContent}>
            <h3 style={{ color: hoveredPlanet.color }}>{hoveredPlanet.name}</h3>
            <p>{hoveredPlanet.description}</p>
            <div className={styles.clickPrompt}>Tap again to explore</div>
          </div>
        </motion.div>
      )}
      
      <div className={styles.instructions} role="status" aria-live="polite">
        {isMobile ? (
          <>
            <p>Tap a planet to preview (tap again to explore)</p>
            <p>Pinch to zoom | Drag to rotate</p>
          </>
        ) : (
          <>
            <p>Click on a planet to explore that section</p>
            <p>Drag to rotate | Scroll to zoom</p>
          </>
        )}
      </div>
      
      {/* Zoom Controls for Mobile */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          bottom: isLandscape ? '20px' : '120px',
          left: '20px', // Changed from right to left to avoid conflicts
          display: 'flex',
          flexDirection: 'row', // Changed to row for better layout
          gap: '15px',
          zIndex: 15,
          pointerEvents: 'none' // Allow touches to pass through container
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling
              if (controlsRef.current) {
                const camera = controlsRef.current.object;
                const target = controlsRef.current.target;
                const direction = camera.position.clone().sub(target).normalize();
                camera.position.addScaledVector(direction, -5); // Zoom in
                controlsRef.current.update();
              }
            }}
            onTouchStart={(e) => {
              e.stopPropagation(); // Prevent touch event from bubbling
            }}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              border: '2px solid rgba(51, 102, 255, 0.5)',
              background: 'rgba(10, 10, 10, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(51, 102, 255, 0.4)',
              transition: 'all 0.3s ease',
              pointerEvents: 'auto', // Only button receives touches
              WebkitTapHighlightColor: 'transparent'
            }}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (controlsRef.current) {
                const camera = controlsRef.current.object;
                const target = controlsRef.current.target;
                const direction = camera.position.clone().sub(target).normalize();
                camera.position.addScaledVector(direction, 5); // Zoom out
                controlsRef.current.update();
              }
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              border: '2px solid rgba(51, 102, 255, 0.5)',
              background: 'rgba(10, 10, 10, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(51, 102, 255, 0.4)',
              transition: 'all 0.3s ease',
              pointerEvents: 'auto', // Only button receives touches
              WebkitTapHighlightColor: 'transparent'
            }}
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
      )}
      
      {/* Title Section - Rebuilt with proper positioning */}
      <div 
        className={styles.title}
        style={{
          position: 'absolute',
          top: '80px',
          left: isMobile ? '50%' : '3%',
          transform: isMobile ? 'translateX(-50%)' : 'none',
          textAlign: isMobile ? 'center' : 'left',
          zIndex: 10,
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? '90%' : '600px',
          padding: isMobile ? '20px' : '0'
        }}
      >
        <h1 style={{ 
          fontSize: isMobile ? '1.5rem' : '3rem',
          margin: '0 0 1rem 0',
          background: 'linear-gradient(90deg, #3366ff, #6633cc)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.3,
          fontWeight: 700
        }}>
          Welcome to Portfolio Website
        </h1>
        <h2 style={{
          fontSize: isMobile ? '1.2rem' : '2.5rem',
          margin: '0 0 1rem 0',
          color: '#f8f8f8',
          lineHeight: 1.3,
          fontWeight: 600
        }}>
          APPAJI B.
        </h2>
        {!isMobile && (
          <p style={{
            fontSize: '1.2rem',
            color: '#b0b0b0',
            margin: 0
          }}>
            Navigate through my professional universe
          </p>
        )}
        
        {/* Tap hint for mobile */}
        {showHint && isMobile && (
          <div style={{
            marginTop: '1rem',
            padding: '0.6rem 1rem',
            background: 'rgba(88, 86, 214, 0.15)',
            border: '1px solid rgba(88, 86, 214, 0.3)',
            borderRadius: '25px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>👆</span>
            <span style={{ fontSize: '0.85rem', color: '#f8f8f8' }}>Tap any planet to explore</span>
          </div>
        )}
      </div>
      
      <motion.div 
        className={`${styles.legend} ${isMobile ? styles.mobileLegend : ''} ${isMobile && legendOpen ? styles.legendOpen : ''}`}
        initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 50 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        role="navigation"
        aria-label="Portfolio sections navigation"
        id="portfolio-nav"
      >
        {isMobile && (
          <button 
            className={styles.legendToggle}
            onClick={() => setLegendOpen(!legendOpen)}
            aria-label={legendOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={legendOpen}
          >
            {legendOpen ? '✕' : '☰'}
          </button>
        )}
        <div className={styles.legendContent}>
          <h3>
            Portfolio Sections
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '0.9rem',
              opacity: 0.7,
              animation: 'bounce 1.5s ease-in-out infinite'
            }}>
              👇
            </span>
          </h3>
          <ul role="list">
            <li 
              className={styles.legendItem}
              onClick={() => handleLegendClick('home')}
              onKeyPress={(e) => e.key === 'Enter' && handleLegendClick('home')}
              tabIndex={0}
              role="button"
              aria-label="Navigate to Home section"
            >
              <span className={styles.colorDot} style={{ backgroundColor: '#ffcc00' }} aria-hidden="true"></span>
              <span>Home</span>
            </li>
            {planets.map((planet) => (
              <li 
                key={planet.id} 
                onClick={() => handleLegendClick(planet.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleLegendClick(planet.id)}
                className={styles.legendItem}
                tabIndex={0}
                role="button"
                aria-label={`Navigate to ${planet.name} section: ${planet.description}`}
              >
                <span className={styles.colorDot} style={{ backgroundColor: planet.color }} aria-hidden="true"></span>
                <span>{planet.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SolarSystem 