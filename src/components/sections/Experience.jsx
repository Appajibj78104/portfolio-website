'use client'

import { motion } from 'framer-motion'
import styles from '@/styles/components/sections/Section.module.scss'

const Experience = ({ onBackClick }) => {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.starBackground}></div>
      
      <motion.button 
        className={styles.backButton}
        onClick={onBackClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Back to Solar System
      </motion.button>
      
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className={styles.title}
          style={{ color: '#33cc66' }} // Green for Experience
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Experience
        </motion.h1>
        
        <motion.div 
          className={styles.sectionContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className={styles.experienceTimeline}>
            {/* Nokia Internship */}
            <motion.div 
              className={styles.experienceCard}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className={styles.experienceHeader}>
                <div className={styles.experienceTitle}>
                  <h3>Software Engineer Intern</h3>
                  <h4>Nokia - RAN R&D (Transport & OAM)</h4>
                </div>
                <div className={styles.experienceMeta}>
                  <span className={styles.date}>Aug 2025 – Present</span>
                  <span className={styles.location}>📍 Bangalore, India</span>
                </div>
              </div>
              
              <div className={styles.experienceDescription}>
                <ul>
                  <li>
                    <strong>5G/4G RAN Systems Development:</strong> Engineered 5G/4G RAN transport and OAM systems using C++, achieving system reliability through comprehensive testing and seamless integration with telecom protocol stacks.
                  </li>
                  <li>
                    <strong>Cloud-Native Architecture:</strong> Architected Docker containerization strategy for cloud-native RAN components, accelerating deployment efficiency by 80% and enabling horizontal scalability across multiple production environments.
                  </li>
                  <li>
                    <strong>Performance Optimization:</strong> Spearheaded agile development sprints focusing on feature design and performance optimization, delivering 15% system performance enhancement across all critical telecom software modules.
                  </li>
                  <li>
                    <strong>CI/CD Pipeline Automation:</strong> Automated CI/CD pipeline implementation for build and validation processes, reducing deployment time by 50% and improving code quality through comprehensive automated testing frameworks.
                  </li>
                </ul>
              </div>
              
              <div className={styles.techStack}>
                <span className={styles.techBadge}>C++</span>
                <span className={styles.techBadge}>Docker</span>
                <span className={styles.techBadge}>5G/4G RAN</span>
                <span className={styles.techBadge}>CI/CD</span>
                <span className={styles.techBadge}>Agile</span>
                <span className={styles.techBadge}>Telecom Protocols</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className={styles.experienceSummary}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3>Key Achievements</h3>
            <div className={styles.achievements}>
              <div className={styles.achievementCard}>
                <div className={styles.achievementNumber}>80%</div>
                <div className={styles.achievementText}>Deployment Efficiency Increase</div>
              </div>
              <div className={styles.achievementCard}>
                <div className={styles.achievementNumber}>15%</div>
                <div className={styles.achievementText}>System Performance Enhancement</div>
              </div>
              <div className={styles.achievementCard}>
                <div className={styles.achievementNumber}>50%</div>
                <div className={styles.achievementText}>Reduced Deployment Time</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Experience 