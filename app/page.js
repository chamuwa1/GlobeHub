"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import Hero from '../components/Hero/Hero';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

export default function Home() {
  const globeEl = useRef();
  const allLabelsRef = useRef([]);
  const [mounted, setMounted] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [filteredLabels, setFilteredLabels] = useState([]);
  
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Map Data
  useEffect(() => {
    const loadLabels = async () => {
      try {
        const citiesRes = await fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_populated_places_simple.geojson');
        const citiesData = await citiesRes.json();
        
        // Categorize by population to prevent collisions
        const mappedLabels = citiesData.features.map(f => {
          const pop = f.properties.pop_max;
          let tier = 3; // Small cities
          if (pop > 10000000) tier = 1; // Mega cities
          else if (pop > 2000000) tier = 2; // Major cities
          
          return {
            lat: f.geometry.coordinates[1],
            lng: f.geometry.coordinates[0],
            name: f.properties.name,
            tier: tier
          };
        });
        
        allLabelsRef.current = mappedLabels;
        
        // Initial filter: only show Tier 1 (Mega cities) to avoid clutter
        setFilteredLabels(mappedLabels.filter(l => l.tier === 1));
      } catch (err) {
        console.error("Failed to load map labels", err);
      }
    };
    
    loadLabels();
  }, []);

  // Zoom listener
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      if (globeEl.current) {
        const alt = globeEl.current.pointOfView()?.altitude;
        if (alt === undefined) return;
        
        let visibleTiers = [1]; // Always show mega cities
        
        // Altitude is usually ~2.5 when fully zoomed out, and ~0.1 when zoomed in
        if (alt < 1.5) {
          visibleTiers.push(2); // Show major cities as you get closer
        }
        if (alt < 0.6) {
          visibleTiers.push(3); // Show all smaller cities when very close
        }
        
        const newLabels = allLabelsRef.current.filter(l => visibleTiers.includes(l.tier));
        
        setFilteredLabels(prev => {
          if (prev.length !== newLabels.length) return newLabels;
          return prev;
        });
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [mounted]);

  const handleGlobeClick = async ({ lat, lng }) => {
    setModalData(null);
    setLoadingModal(true);
    setModalError(null);
    
    try {
      // 1. Fetch weather & reverse geocode
      const weatherRes = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
      const weatherData = await weatherRes.json();
      
      if (!weatherRes.ok) throw new Error(weatherData.error || 'Failed to fetch weather');
      
      // Determine exact location string (City, State, Country)
      let locationName = weatherData.current?.name || 'Unknown Location';
      const countryCode = weatherData.current?.sys?.country;
      
      if (weatherData.geo && weatherData.geo.length > 0) {
        const loc = weatherData.geo[0];
        // Combine name, state, and country if they exist
        locationName = [loc.name, loc.state, loc.country].filter(Boolean).join(', ');
      } else if (countryCode) {
        locationName = `${locationName}, ${countryCode}`;
      }

      // 2. Fetch local news using country code
      let newsData = [];
      if (countryCode) {
        const newsRes = await fetch(`/api/news?country=${countryCode.toLowerCase()}`);
        const newsResult = await newsRes.json();
        if (newsRes.ok && newsResult.results) {
          newsData = newsResult.results.slice(0, 3); // top 3 local news
        }
      }
      
      setModalData({
        locationString: locationName,
        weather: weatherData.current,
        news: newsData
      });
      
    } catch (err) {
      setModalError(err.message);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleGlobeInteraction = (e) => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    if (!controls) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    let clientX = e.clientX;
    let clientY = e.clientY;
    
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    
    if (clientX === undefined || clientY === undefined) return;
    
    const pointerX = clientX - rect.left;
    const pointerY = clientY - rect.top;
    
    const distance = Math.sqrt(Math.pow(pointerX - centerX, 2) + Math.pow(pointerY - centerY, 2));
    const altitude = globeEl.current.pointOfView()?.altitude || 2.5;
    
    // Estimate visual radius of the globe in pixels based on altitude
    const baseRadius = (Math.min(rect.width, rect.height) / 2) * (2.2 / altitude);
    
    // On touch devices, grant a significantly larger hit area so users can easily rotate/zoom
    // while still keeping the extreme corners/edges available for scrolling down the page.
    const isTouch = e.touches && e.touches.length > 0;
    const padding = isTouch ? 100 : 20;
    
    // Enable controls only if pointer is within the visual bounds of the globe
    if (distance < baseRadius + padding) {
      controls.enableZoom = true;
      controls.enableRotate = true;
      if (isTouch) e.currentTarget.style.touchAction = 'none'; // Prevent browser scroll to allow 3D rotation
    } else {
      controls.enableZoom = false;
      controls.enableRotate = false;
      if (isTouch) e.currentTarget.style.touchAction = 'auto'; // Allow browser scroll
    }
  };

  const resetGlobeInteraction = () => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    if (controls) {
      controls.enableZoom = false;
      controls.enableRotate = false;
    }
  };

  const scrollToGlobe = () => {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <main id="main-scroll-container" className={styles.mainContainer}>
      <Hero scrollToGlobe={scrollToGlobe} />
      
      {/* Globe Section */}
      <section className={styles.globeSection}>
      
      {/* Loading overlay */}
      {loadingModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.loadingPulse}>Extracting global data...</div>
        </div>
      )}
      
      {/* Error overlay */}
      {modalError && (
        <div className={styles.modalOverlay} onClick={() => setModalError(null)}>
          <div className={`glass-panel ${styles.modalContent}`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setModalError(null)}>✕</button>
            <h2 style={{color: '#fca5a5'}}>Data Not Found</h2>
            <p>We couldn't pull data for this exact coordinate (likely an ocean). Try clicking a landmass!</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalData && (
        <div className={styles.modalOverlay} onClick={() => setModalData(null)}>
          <div className={`glass-panel ${styles.modalContent}`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setModalData(null)}>✕</button>
            
            <div className={styles.modalHeader}>
              <h2>{modalData.locationString}</h2>
              <div className={styles.weatherSummary}>
                {modalData.weather.weather?.[0]?.icon && (
                  <img src={`https://openweathermap.org/img/wn/${modalData.weather.weather[0].icon}.png`} alt="weather icon" />
                )}
                <span>{Math.round(modalData.weather.main?.temp)}°C, {modalData.weather.weather?.[0]?.description}</span>
              </div>
            </div>
            
            <div className={styles.modalBody}>
              <h3>Top Local News</h3>
              {modalData.news.length > 0 ? (
                <div className={styles.miniNewsList}>
                  {modalData.news.map((item, i) => (
                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={styles.miniNewsItem}>
                      <h4>{item.title}</h4>
                      <span className={styles.newsSource}>{item.source_id}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className={styles.noNews}>No local news found for this region.</p>
              )}
              
              <div className={styles.modalActions}>
                 <button onClick={() => router.push(`/weather`)}>Go to Advanced Weather</button>
              </div>
            </div>
          </div>
        </div>
      )}



      {mounted && (
        <div 
          className={styles.globeContainer}
          onMouseMove={handleGlobeInteraction}
          onTouchStart={handleGlobeInteraction}
          onTouchMove={handleGlobeInteraction}
          onMouseLeave={resetGlobeInteraction}
          onTouchEnd={resetGlobeInteraction}
        >
          <Globe
            ref={globeEl}
            globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
            animateIn={true}
            onGlobeReady={() => {
              if (window.innerWidth < 768 && globeEl.current) {
                // Pull camera back on portrait mobile screens so globe fits horizontally
                globeEl.current.pointOfView({ altitude: 3.5 }, 0);
              }
            }}
            onGlobeClick={handleGlobeClick}
            
            /* Dynamic Labels */
            labelsData={filteredLabels}
            labelLat={d => d.lat}
            labelLng={d => d.lng}
            labelText={d => d.name}
            labelSize={d => d.tier === 1 ? 1.5 : (d.tier === 2 ? 1.0 : 0.6)}
            labelDotRadius={d => d.tier === 1 ? 0.3 : 0.2}
            labelColor={d => d.tier === 1 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(147, 197, 253, 0.8)'}
            labelResolution={3}
            
            /* High-quality renderer */
            rendererConfig={{ antialias: true, alpha: true }}
          />
        </div>
      )}
      </section>
    </main>
  );
}
