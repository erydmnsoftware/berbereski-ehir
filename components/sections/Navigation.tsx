"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { label: 'Hakkımızda', href: '#about' },
  { label: 'Hizmetler', href: '#services' },
  { label: 'Ekibimiz', href: '#team' },
  { label: 'Fiyatlar', href: '#pricing' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMenuOpen(false);
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[90px] flex items-center border-b border-[#333333] transition-all duration-300 ${
        scrolled ? 'bg-[#111111]/95 backdrop-blur-[12px]' : 'bg-[#111111]/80 backdrop-blur-[12px]'
      }`}
    >
      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 flex items-center justify-between">
        <Link href="/" className="text-white font-medium text-[20px] tracking-[-0.02em] flex items-center gap-3">
          <img loading="lazy" decoding="async" src="/logo.png" alt="BerberOS Logo" className="h-16 object-contain" />
          BerberOS
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[14px] text-[#a0a0a0] hover:text-white transition-colors duration-300 tracking-[0.01em]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <Link
          href="/randevu"
          className="hidden md:block text-[14px] font-medium text-white border border-white px-6 py-3 hover:bg-white hover:text-[#111111] transition-all duration-300"
        >
          Randevu Al
        </Link>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[90px] left-0 right-0 bg-[#111111]/95 backdrop-blur-[12px] border-b border-[#333333] md:hidden">
          <div className="flex flex-col p-5 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-[16px] text-[#a0a0a0] hover:text-white transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/randevu"
              onClick={() => setMenuOpen(false)}
              className="text-center text-[14px] font-medium text-white border border-white px-6 py-3 hover:bg-white hover:text-[#111111] transition-all duration-300 mt-2"
            >
              Randevu Al
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
