'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 'var(--z-navbar)',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(8, 8, 8, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      padding: scrolled ? '1rem 0' : '1.5rem 0',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img loading="lazy" decoding="async" src="/logo.png" alt="BerberEskişehir VIP Logo" style={{ height: '40px', objectFit: 'contain' }} />
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="nav-links">
          <Link href="#hizmetler" style={{ fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Hizmetler</Link>
          <Link href="#ekip" style={{ fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Ekibimiz</Link>
          <Link href="#galeri" style={{ fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Galeri</Link>
          <Link href="#fiyatlar" style={{ fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Fiyatlar</Link>
          <Link href="#iletisim" style={{ fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>İletişim</Link>
          
          <Link href="/randevu" className="btn btn-primary btn-sm" style={{ marginLeft: '1rem' }}>
            Randevu Al
          </Link>
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
