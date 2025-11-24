'use client';

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Offer } from '@/types/hero';

interface HeroSectionProps {
  offers: Offer[];
}

export function HeroSection({ offers }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Offer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Refs for GSAP animations
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLSpanElement>(null);
  const indirectRef = useRef<HTMLSpanElement>(null);
  const endToEndRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const leftIllustrationRef = useRef<HTMLDivElement>(null);
  const rightIllustrationRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const marqueeTween = useRef<gsap.core.Tween | null>(null);
  const marqueeGroupRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useEffect(() => {
    if (!heroRef.current) return;

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate tagline
    timeline.fromTo(taglineRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    );

    // Animate headline parts with staggered effect
    timeline.fromTo([controlRef.current, indirectRef.current, endToEndRef.current],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
      '-=0.4'
    );

    // Animate input and button
    timeline.fromTo([inputRef.current, buttonRef.current],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.2 },
      '-=0.4'
    );

    // Fade in logos container
    timeline.fromTo(logosRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 0.9, duration: 0.6 },
      '-=0.2'
    );

    // Animate illustrations
    timeline.fromTo([leftIllustrationRef.current, rightIllustrationRef.current],
      { opacity: 0, scale: 0.8 },
      { opacity: 0.2, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
      '-=1'
    );

    // References for listeners and marquee tween
    const btnEl = buttonRef.current;
    const logosEl = logosRef.current;
    const trackEl = marqueeTrackRef.current;

    // Button hover handlers
    const onBtnEnter = () => btnEl && gsap.to(btnEl, { scale: 1.05, duration: 0.3 });
    const onBtnLeave = () => btnEl && gsap.to(btnEl, { scale: 1, duration: 0.3 });
    if (btnEl) {
      btnEl.addEventListener('mouseenter', onBtnEnter);
      btnEl.addEventListener('mouseleave', onBtnLeave);
    }

    // GSAP marquee tween
    if (trackEl) {
      marqueeTween.current = gsap.fromTo(trackEl, { xPercent: 0 }, { xPercent: -50, duration: 20, ease: 'none', repeat: -1 });
    }

    // Hover pause/resume for marquee
    const onMarqueeEnter = () => marqueeTween.current?.pause();
    const onMarqueeLeave = () => marqueeTween.current?.resume();
    if (logosEl) {
      logosEl.addEventListener('mouseenter', onMarqueeEnter);
      logosEl.addEventListener('mouseleave', onMarqueeLeave);
    }

    // Cleanup
    return () => {
      if (btnEl) {
        btnEl.removeEventListener('mouseenter', onBtnEnter);
        btnEl.removeEventListener('mouseleave', onBtnLeave);
      }
      if (logosEl) {
        logosEl.removeEventListener('mouseenter', onMarqueeEnter);
        logosEl.removeEventListener('mouseleave', onMarqueeLeave);
      }
      if (marqueeTween.current) {
        marqueeTween.current.kill();
        marqueeTween.current = null;
      }
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setIsSearching(true);
      // Filter offers based on search query
      const results = offers.filter(offer => 
        offer.title.toLowerCase().includes(query.toLowerCase()) ||
        offer.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = () => {
    if (searchResults.length > 0 && searchQuery) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleResultClick = (offerId: number) => {
    window.location.href = `/offers/${offerId}`;
  };

  const partnerLogos = [
    { label: 'Wholesalery', labelKey: 'wholesalery', src: '/images/partners/wholesalery.png' },
    { label: 'Berlo', labelKey: 'berlo', src: '/images/partners/berlo.png' },
    { label: 'Dialdist', labelKey: 'dialdist', src: '/images/partners/dialdist.png' },
    { label: 'Lifespan', labelKey: 'lifespan', src: '/images/partners/lifespan.png' },
    { label: 'Watchdropship', labelKey: 'watchdropship', src: '/images/partners/watchdropship.png' },
  ];

  return (
    <section className="w-full bg-white dark:bg-gray-950 overflow-hidden py-18 min-h-[40vh] items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={heroRef}>
        {/* Top Tagline */}
        <div className="text-center mb-4 opacity-0" ref={taglineRef}>
          <p className="text-sm text-gray-500 dark:text-gray-400">Wholesalery - Where retail meets wholesale</p>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col items-center">
          {/* Headline */}
          <h1 className="text-center text-5xl font-bold tracking-tight mb-10 max-w-4xl">
            <span className="text-blue-700 dark:text-blue-600 inline-block opacity-0" ref={controlRef}>WHOLESALERY</span>{' '}
            <span className="text-gray-900 dark:text-gray-100 inline-block opacity-0" ref={indirectRef}>B2B MARKETPLACE</span>
            <br />
            <span className="text-gray-900 dark:text-gray-100 inline-block opacity-0" ref={endToEndRef}>FOR MODERN BUSINESS.</span>
          </h1>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-16 opacity-0" ref={inputRef}>
            <div className="relative w-full">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Search brands, products, GTINs..." 
                    className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="opacity-0" ref={buttonRef}>
                  <button 
                    type="button" 
                    className="w-full sm:w-auto px-6 py-3 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors duration-300 dark:bg-blue-700 dark:hover:bg-blue-600 whitespace-nowrap"
                    onClick={handleSearchSubmit}
                  >
                    Search
                  </button>
                </div>
              </div>
              
              {/* Dropdown Search Results */}
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                  {searchResults.slice(0, 5).map(offer => (
                    <div 
                      key={offer.id} 
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0"
                      onClick={() => handleResultClick(offer.id)}
                    >
                      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">{offer.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{offer.description}</p>
                    </div>
                  ))}
                  {searchResults.length > 5 && (
                    <div className="p-3 text-center text-sm text-blue-600 dark:text-blue-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                      View all {searchResults.length} results
                    </div>
                  )}
                </div>
              )}
              
              {searchQuery && searchResults.length === 0 && !isSearching && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-4 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No results found for "{searchQuery}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Partner Logos */}
          <div className="w-full mt-4 flex justify-center">
            <div className="relative w-full max-w-xl overflow-hidden opacity-0" ref={logosRef}>
              <div className="pointer-events-none absolute left-0 top-0 h-full w-12 z-10" aria-hidden
                   style={{ background: 'linear-gradient(to right, var(--background), transparent)' }} />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-12 z-10" aria-hidden
                   style={{ background: 'linear-gradient(to left, var(--background), transparent)' }} />
              <div className="whitespace-nowrap">
                <div className="flex items-center will-change-transform" ref={marqueeTrackRef}>
                  <div className="flex items-center gap-x-12" ref={marqueeGroupRef}>
                    {partnerLogos.map((logo) => (
                      <div key={`g1-${logo.labelKey}`} className="h-6 shrink-0 flex items-center">
                        <img
                          src={logo.src}
                          alt={logo.label}
                          className="h-6 w-auto object-contain opacity-80"
                          loading="lazy"
                          decoding="async"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const img = e.currentTarget;
                            img.style.display = 'none';
                            const fallback = img.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                        <span className="text-sm font-medium text-gray-500 hidden">{logo.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-x-12" aria-hidden>
                    {partnerLogos.map((logo, idx) => (
                      <div key={`g2-${logo.labelKey}`} className={`h-6 shrink-0 flex items-center ${idx === 0 ? 'ml-12' : ''}`}>
                        <img
                          src={logo.src}
                          alt={logo.label}
                          className="h-6 w-auto object-contain opacity-80"
                          loading="lazy"
                          decoding="async"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            const img = e.currentTarget;
                            img.style.display = 'none';
                            const fallback = img.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                        <span className="text-sm font-medium text-gray-500 hidden">{logo.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Left Side Illustration (Pallet) */}
        <div className="absolute left-0 bottom-0 w-1/4 max-w-xs opacity-0 hidden lg:block" ref={leftIllustrationRef}>
          <img src="/images/pellet.svg" alt="Pallet illustration" className="w-full h-full object-contain" />
        </div>
        
        {/* Right Side Illustration (Box) */}
        <div className="absolute right-0 top-10 w-1/4 max-w-xs opacity-0 hidden lg:block" ref={rightIllustrationRef}>
          <img src="/images/box.svg" alt="Box illustration" className="w-full h-full object-contain" />
        </div>
      </div>
    </section>
  );
}
