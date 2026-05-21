"use client";

import { useState, useEffect } from 'react';
import styles from './SplashScreen.module.css';

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setShow(true);
    
    // Simulate loading global assets for 2.5s
    setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setShow(false);
      }, 800); // Wait for fade out animation
    }, 2500);
  }, []);

  if (!show) return null;

  return (
    <div className={`${styles.splashContainer} ${fading ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <span className={styles.globeIcon} style={{ WebkitTextFillColor: 'initial', color: 'initial' }}>🌍</span>
        </div>
        <h1 className={styles.title}>GlobeHub</h1>
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
        <p className={styles.statusText}>Initializing Global Systems...</p>
      </div>
    </div>
  );
}
