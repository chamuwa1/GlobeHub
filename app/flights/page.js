"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function Flights() {
  const [flightNumber, setFlightNumber] = useState('');
  const [airportCode, setAirportCode] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchFlights = async (e) => {
    if (e) e.preventDefault();
    
    if (!flightNumber.trim() && !airportCode.trim()) {
      setError('Please enter a flight number or an arrival airport to track flights.');
      setFlights([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      let url = '/api/flights?';
      if (flightNumber) url += `flight_iata=${encodeURIComponent(flightNumber)}&`;
      if (airportCode) url += `arr_iata=${encodeURIComponent(airportCode)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch flight data');
      setFlights(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={`glass-panel ${styles.container}`}>
        <h1 className={styles.title}>Live Flight Tracker ✈️</h1>
        
        <form onSubmit={fetchFlights} className={styles.searchSection}>
          <input 
            type="text" 
            placeholder="Flight Number (e.g. AA100)" 
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className={styles.input}
          />
          <input 
            type="text" 
            placeholder="Arrival Airport (Name or IATA)" 
            value={airportCode}
            onChange={(e) => setAirportCode(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.searchButton}>Track Flights</button>
        </form>

        {error && <div className={styles.error}>{error}</div>}
        
        {loading ? (
          <div className={styles.loading}>Tracking flights...</div>
        ) : (
          <div className={styles.grid}>
            {flights.length === 0 && !error && !hasSearched && (
              <div className={styles.empty}>Enter a flight number or airport to see real-time status.</div>
            )}
            {flights.length === 0 && !error && hasSearched && (
              <div className={styles.error}>No active flights found. Please check that you entered a valid correct flight number or airport name.</div>
            )}
            {flights.map((flight, idx) => (
              <div key={idx} className={`${styles.card} animate-fade-in-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className={styles.cardHeader}>
                  <h3>{flight.airline?.name} {flight.flight?.iata}</h3>
                  <span className={styles.status} data-status={flight.flight_status}>
                    {flight.flight_status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.route}>
                    <div>
                      <p className={styles.label}>DEPARTURE</p>
                      <h4>{flight.departure?.iata}</h4>
                      <p>{flight.departure?.terminal ? `Terminal ${flight.departure.terminal}` : 'Terminal N/A'}</p>
                    </div>
                    <div className={styles.arrow}>✈️</div>
                    <div>
                      <p className={styles.label}>ARRIVAL</p>
                      <h4>{flight.arrival?.iata}</h4>
                      <p>{flight.arrival?.terminal ? `Terminal ${flight.arrival.terminal}` : 'Terminal N/A'}</p>
                    </div>
                  </div>
                  <div className={styles.details}>
                     <p>Delay: {flight.arrival?.delay || 0} mins</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
