"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch weather');
      }
      
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(`/api/weather?city=${encodeURIComponent(city.trim())}`);
    }
  };

  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(`/api/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
      },
      () => {
        setError('Unable to retrieve your location. Please check permissions.');
        setLoading(false);
      }
    );
  };

  const popularCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];

  return (
    <main className={styles.main}>
      <div id="google_translate_element"></div>
      
      <div className={`glass-panel ${styles.container}`}>
        <h1 className={styles.title}>Global Weather</h1>
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input 
            type="text" 
            placeholder="Enter city name..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>Search</button>
          <button type="button" onClick={getLocationWeather} className={styles.locationButton} title="Use my location">
            📍
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}
        
        {loading && <div className={styles.loading}>Loading weather data...</div>}

        {!loading && !weatherData && !error && (
          <div className={styles.emptyState}>
            <h2>Welcome to Global Weather</h2>
            <p>Search for a city or use your location to get real-time weather updates and forecasts.</p>
            <div className={styles.suggestions}>
              {popularCities.map(c => (
                <button 
                  key={c} 
                  type="button" 
                  onClick={() => fetchWeather(`/api/weather?city=${encodeURIComponent(c)}`)} 
                  className={styles.suggestionBadge}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && weatherData && weatherData.current && (() => {
          const getAqiText = (aqi) => {
            switch(aqi) {
              case 1: return { text: 'Good', color: '#86efac' };
              case 2: return { text: 'Fair', color: '#fef08a' };
              case 3: return { text: 'Moderate', color: '#fdba74' };
              case 4: return { text: 'Poor', color: '#fca5a5' };
              case 5: return { text: 'Very Poor', color: '#dc2626' };
              default: return { text: 'Unknown', color: '#94a3b8' };
            }
          };
          const formatTime = (timestamp) => {
            return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          };
          const aqiInfo = weatherData.aqi?.list?.[0]?.main?.aqi ? getAqiText(weatherData.aqi.list[0].main.aqi) : null;
          const weather = weatherData.current;
          const forecast = weatherData.forecast;

          return (
          <div className={styles.weatherDashboard}>
            <div className={styles.currentWeather}>
              <div className={styles.mainInfo}>
                <h2>{weather.name}, {weather.sys.country}</h2>
                <div className={styles.tempGroup}>
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
                    alt={weather.weather[0].description} 
                    className={styles.weatherIcon}
                  />
                  <div className={styles.temperature}>
                    {Math.round(weather.main.temp)}°C
                  </div>
                </div>
                <div className={styles.description}>
                  {weather.weather[0].description}
                </div>
              </div>
              
              <div className={styles.detailsGrid}>
                <div className={`${styles.detailCard} animate-fade-in-up`} style={{ animationDelay: '0.1s' }}>
                  <span className={styles.detailLabel}>Humidity</span>
                  <span className={styles.detailValue}>{weather.main.humidity}%</span>
                </div>
                <div className={`${styles.detailCard} animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
                  <span className={styles.detailLabel}>Wind</span>
                  <span className={styles.detailValue}>{Math.round(weather.wind.speed * 3.6)} km/h</span>
                </div>
                <div className={`${styles.detailCard} animate-fade-in-up`} style={{ animationDelay: '0.3s' }}>
                  <span className={styles.detailLabel}>Pressure</span>
                  <span className={styles.detailValue}>{weather.main.pressure} hPa</span>
                </div>
                <div className={`${styles.detailCard} animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
                  <span className={styles.detailLabel}>Visibility</span>
                  <span className={styles.detailValue}>{(weather.visibility ? weather.visibility / 1000 : 10).toFixed(1)} km</span>
                </div>
                {aqiInfo && (
                  <div className={styles.detailCard} style={{ borderColor: aqiInfo.color, boxShadow: `0 0 10px ${aqiInfo.color}40` }}>
                    <span className={styles.detailLabel}>Air Quality</span>
                    <span className={styles.detailValue} style={{ color: aqiInfo.color }}>{aqiInfo.text}</span>
                  </div>
                )}
                {weather.sys?.sunrise && (
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Sunrise 🌅</span>
                    <span className={styles.detailValue}>{formatTime(weather.sys.sunrise)}</span>
                  </div>
                )}
                {weather.sys?.sunset && (
                  <div className={styles.detailCard}>
                    <span className={styles.detailLabel}>Sunset 🌇</span>
                    <span className={styles.detailValue}>{formatTime(weather.sys.sunset)}</span>
                  </div>
                )}
              </div>
            </div>

            {forecast && (
              <div className={styles.forecastSection}>
                <h3>5-Day Forecast</h3>
                <div className={styles.forecastScroll}>
                  {forecast.list.filter((_, i) => i % 8 === 0).map((item, idx) => (
                    <div key={item.dt} className={`${styles.forecastCard} animate-fade-in-up`} style={{ animationDelay: `${0.5 + idx * 0.1}s` }}>
                      <div className={styles.forecastTime}>
                        {new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <img 
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} 
                        alt={item.weather[0].description} 
                        className={styles.forecastIcon}
                      />
                      <div className={styles.forecastTemp}>{Math.round(item.main.temp)}°C</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          );
        })()}
      </div>
    </main>
  );
}
