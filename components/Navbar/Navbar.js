"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScrollToTop = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-mobile-header">
          <Link href="/" onClick={handleScrollToTop} className="nav-logo">GlobeHub</Link>
          <div className="nav-mobile-actions">
            <div id="google_translate_element" className="nav-translate"></div>
            <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)}>
              ☰
            </button>
          </div>
        </div>
        
        <div className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
          <Link href="/" onClick={(e) => { handleScrollToTop(e); setMenuOpen(false); }} className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Globe</Link>
          <Link href="/news" onClick={() => setMenuOpen(false)} className={`nav-link ${pathname === '/news' ? 'active' : ''}`}>News</Link>
          <Link href="/weather" onClick={() => setMenuOpen(false)} className={`nav-link ${pathname === '/weather' ? 'active' : ''}`}>Weather</Link>
          <Link href="/markets" onClick={() => setMenuOpen(false)} className={`nav-link ${pathname === '/markets' ? 'active' : ''}`}>Markets</Link>
          <Link href="/flights" onClick={() => setMenuOpen(false)} className={`nav-link ${pathname === '/flights' ? 'active' : ''}`}>Flights</Link>
        </div>
      </div>
    </nav>
  );
}
