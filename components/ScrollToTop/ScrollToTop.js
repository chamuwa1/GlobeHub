"use client";

import { useState, useEffect } from 'react';
import styles from './ScrollToTop.module.css';

export default function ScrollToTop() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down half a screen
      if (window.scrollY > window.innerHeight / 2) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showTopBtn) return null;

  return (
    <button 
      className={styles.topButton} 
      onClick={scrollToTop} 
      aria-label="Scroll to top" 
      title="Go to top"
    >
      ↑
    </button>
  );
}
