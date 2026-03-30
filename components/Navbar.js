'use client';

import { useState, useEffect } from 'react';
import Text from "./Text";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [activeSegment, setActiveSegment] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSegment('');
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSegment(entry.target.id);
        }
      });
    }, { threshold: 0.15, rootMargin: "-10% 0px -40% 0px" });

    const sections = ['map', 'overview', 'explorer', 'farmer-success', 'protection'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const links = [
    { en: 'Crop Map', bn: 'শস্য মানচিত্র', href: '/#map', id: 'map' },
    { en: 'Sector Overview', bn: 'সেক্টর ওভারভিউ', href: '/#overview', id: 'overview' },
    { en: 'Explore Agricultural Sectors', bn: 'কৃষি খাতসমূহ অনুসন্ধান', href: '/#explorer', id: 'explorer' },
    { en: 'Farmer Success Hub', bn: 'কৃষক সাফল্য হাব', href: '/#farmer-success', id: 'farmer-success' },
    { en: 'AI Disease Scanner', bn: 'এআই রোগ নির্ণয়', href: '/#protection', id: 'protection' },
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-[#05111e]/95 backdrop-blur-xl border-b border-white/10 py-3 px-4 md:px-8 flex justify-between items-center shadow-2xl">
      <div className="flex gap-4 md:gap-8 items-center">
        <Link href="/" className="font-playfair font-black text-emerald-400 text-lg md:text-xl whitespace-nowrap mr-2 md:mr-4 tracking-tighter hover:scale-110 transition-all duration-300 cursor-pointer flex items-center gap-2 group">
          <span className="bg-emerald-500 text-[#05111e] px-2 py-0.5 rounded text-sm group-hover:bg-white transition-colors duration-300">কৃষি</span>
          <span className="text-white group-hover:text-emerald-400 transition-colors duration-300 tracking-widest font-mono text-xs uppercase">Intelligenz</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-4 items-center">
          {links.map((link, i) => {
            const isActive = activeSegment === link.id;
            
            return (
              <Link 
                key={i}
                href={link.href} 
                className={`font-mono text-[0.65rem] font-bold tracking-[0.2em] uppercase transition-all duration-500 no-underline whitespace-nowrap px-4 py-2 rounded-xl flex items-center gap-2 ${
                  isActive 
                  ? 'text-emerald-400 bg-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.1)]' 
                  : 'text-white/30 hover:text-white hover:bg-white/5'
                }`}
              >
                <Text en={link.en} bn={link.bn} />
                {isActive && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#05111e]/98 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="flex flex-col py-4 px-4 space-y-2">
            {links.map((link, i) => {
              const isActive = activeSegment === link.id;
              
              return (
                <Link 
                  key={i}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-mono text-sm font-bold tracking-[0.1em] uppercase transition-all duration-300 no-underline px-4 py-3 rounded-xl flex items-center justify-between ${
                    isActive 
                    ? 'text-emerald-400 bg-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.1)]' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Text en={link.en} bn={link.bn} />
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* <div className="flex items-center gap-6">
        <div className="text-[10px] font-black text-white/20 tracking-widest uppercase hidden sm:block">KrishiBangla v2.0</div>
      </div> */}
    </nav>
  );
}
