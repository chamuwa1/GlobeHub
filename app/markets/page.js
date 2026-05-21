"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import styles from './page.module.css';

export default function Markets() {
  const [filter, setFilter] = useState('crypto'); // 'crypto' or 'stock'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/markets?type=${filter}`);
        const result = await res.json();
        
        if (!res.ok) throw new Error(result.error || 'Failed to fetch market data');
        
        if (filter === 'crypto') {
          setData(result.data || []);
        } else {
          // Alpha Vantage TOP_GAINERS_LOSERS format
          if (result.data.top_gainers) {
             setData(result.data.top_gainers.slice(0, 20));
          } else {
             setData([]);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarkets();
  }, [filter]);

  return (
    <main className={styles.main}>
      <div className={`glass-panel ${styles.container}`}>
        <h1 className={styles.title}>Global Markets 📈</h1>
        
        <div className={styles.filterSection}>
          <button 
            className={`${styles.filterBtn} ${filter === 'crypto' ? styles.active : ''}`}
            onClick={() => setFilter('crypto')}
          >
            Cryptocurrency
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'stock' ? styles.active : ''}`}
            onClick={() => setFilter('stock')}
          >
            Top Stocks (Gainers)
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        
        {loading ? (
          <div className={styles.loading}>Fetching live market data...</div>
        ) : (
          <div className={styles.grid}>
            {filter === 'crypto' && data.map((coin, idx) => (
              <div key={coin.id} className={`${styles.card} animate-fade-in-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className={styles.cardHeader}>
                  <img src={coin.image} alt={coin.name} className={styles.coinIcon} />
                  <div>
                    <h3>{coin.name}</h3>
                    <span className={styles.symbol}>{coin.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h2>${coin.current_price.toLocaleString()}</h2>
                  <p className={coin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}>
                    {coin.price_change_percentage_24h?.toFixed(2)}% (24h)
                  </p>
                </div>
                <div className={styles.chartContainer}>
                  {coin.sparkline_in_7d?.price && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={coin.sparkline_in_7d.price.map((p, i) => ({ value: p, index: i }))}>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Line type="monotone" dataKey="value" stroke={coin.price_change_percentage_24h >= 0 ? '#86efac' : '#fca5a5'} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            ))}

            {filter === 'stock' && data.map((stock, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3>{stock.ticker}</h3>
                    <span className={styles.symbol}>Stock</span>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h2>${parseFloat(stock.price).toFixed(2)}</h2>
                  <p className={styles.positive}>
                    +{stock.change_percentage}
                  </p>
                  <p className={styles.volume}>Vol: {stock.volume}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
