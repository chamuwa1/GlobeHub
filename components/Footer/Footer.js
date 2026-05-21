"use client";

import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const privacyPolicyText = (
    <div className={styles.policyContent}>
      <h2>Privacy Policy</h2>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h3>1. Information We Collect</h3>
      <p>GlobeHub collects minimal personal information necessary to provide our services. We may collect location data if you explicitly grant permission to use the "Use my location" feature for weather updates.</p>
      <h3>2. Use of Third-Party APIs</h3>
      <p>We use external services like OpenWeatherMap, NewsData.io, and AlphaVantage. Your requests may be routed through these services to provide real-time global data. Please note that these third parties have their own privacy policies.</p>
      <h3>3. Cookies</h3>
      <p>We do not use tracking cookies for advertising. We only use functional cookies essential for running the application and maintaining your preferences.</p>
    </div>
  );

  const termsOfServiceText = (
    <div className={styles.policyContent}>
      <h2>Terms of Service</h2>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h3>1. Acceptance of Terms</h3>
      <p>By accessing and using GlobeHub, you accept and agree to be bound by the terms and provision of this agreement.</p>
      <h3>2. Educational & Informational Use</h3>
      <p>All data provided on GlobeHub (including weather, financial markets, and flight tracking) is for informational purposes only. We do not guarantee the absolute accuracy of the data and are not liable for decisions made based on it.</p>
      <h3>3. API Usage Limits</h3>
      <p>GlobeHub relies on free-tier APIs. We reserve the right to rate-limit users or temporarily disable features if usage exceeds our provider quotas.</p>
    </div>
  );

  const closeModal = () => setActiveModal(null);
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <h2 className={styles.brand}>GlobeHub</h2>
          <p className={styles.description}>
            Your ultimate global dashboard. Experience real-time weather, breaking news, live markets, and global flight tracking—all seamlessly integrated into one premium interface.
          </p>
        </div>
        
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} GlobeHub Inc. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <button onClick={() => setActiveModal('privacy')} className={styles.modalBtn}>Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className={styles.modalBtn}>Terms of Service</button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activeModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
            {activeModal === 'privacy' ? privacyPolicyText : termsOfServiceText}
          </div>
        </div>
      )}
    </footer>
  );
}
