import styles from '../../app/page.module.css';

export default function Hero({ scrollToGlobe }) {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroOverlay}>
        <div className={`glass-panel ${styles.panel}`}>
          <h1 className={styles.title}>
            Welcome to GlobeHub <span style={{ WebkitTextFillColor: 'initial', color: 'initial' }}>🌍</span>
          </h1>
          <p className={styles.subtitle}>
            Your interactive dashboard for global news, live weather, real-time markets, and flight tracking.
          </p>
          <button onClick={scrollToGlobe} className={styles.exploreButton}>
            Explore the Globe ↓
          </button>
        </div>
      </div>
    </section>
  );
}
