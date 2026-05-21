"use client";

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function News() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['business', 'entertainment', 'environment', 'food', 'health', 'politics', 'science', 'sports', 'technology', 'top', 'world'];

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/news?language=en`;
      if (query) url += `&q=${encodeURIComponent(query)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch news');
      }
      
      setNews(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews();
  };

  return (
    <main className={styles.main}>
      <div className={`glass-panel ${styles.container}`}>
        <h1 className={styles.title}>Global News Hub</h1>
        
        <form onSubmit={handleSearch} className={styles.filterSection}>
          <div className={styles.searchGroup}>
            <input 
              type="text" 
              placeholder="Search keywords..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>Search</button>
          </div>
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className={styles.dropdown}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </form>

        {error && <div className={styles.error}>{error}</div>}
        
        {loading ? (
          <div className={styles.loading}>Fetching latest news...</div>
        ) : (
          <div className={styles.newsGrid}>
            {news.length === 0 && !error && (
              <div className={styles.noResults}>No news articles found for your criteria.</div>
            )}
            {news.map((article, idx) => (
              <a href={article.link} target="_blank" rel="noopener noreferrer" key={idx} className={styles.newsCard}>
                <div className={styles.imageContainer}>
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title} className={styles.newsImage} />
                  ) : (
                    <div className={styles.placeholderImage}>📰</div>
                  )}
                </div>
                <div className={styles.newsContent}>
                  <h3 className={styles.newsTitle}>{article.title}</h3>
                  <p className={styles.newsDescription}>
                    {article.description ? (article.description.substring(0, 100) + '...') : 'No description available.'}
                  </p>
                  <div className={styles.newsMeta}>
                    <span className={styles.newsSource}>{article.source_id}</span>
                    <span className={styles.newsDate}>
                      {new Date(article.pubDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
