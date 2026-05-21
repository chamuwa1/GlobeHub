"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const handleScrollToTop = (e) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" onClick={handleScrollToTop} className="nav-logo">GlobeHub</Link>
        <div className="nav-links">
          <Link href="/" onClick={handleScrollToTop} className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Globe</Link>
          <Link href="/news" className={`nav-link ${pathname === '/news' ? 'active' : ''}`}>News</Link>
          <Link href="/weather" className={`nav-link ${pathname === '/weather' ? 'active' : ''}`}>Weather</Link>
          <Link href="/markets" className={`nav-link ${pathname === '/markets' ? 'active' : ''}`}>Markets</Link>
          <Link href="/flights" className={`nav-link ${pathname === '/flights' ? 'active' : ''}`}>Flights</Link>
        </div>
        <div id="google_translate_element" className="nav-translate"></div>
      </div>
    </nav>
  );
}
