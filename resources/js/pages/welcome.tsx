'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import axios from 'axios';
import { AppHeader } from '@/components/app-header';
import gsap from 'gsap';
import { OfferGrid } from '@/components/offer-grid';
import { HeroSection } from '@/components/hero';
import { Offer } from '@/types/hero';

type Sector = {
  id: number;
  name: string;
  slug: string;
  image_url?: string;
  categories_count?: number;
};

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const [offers, setOffers] = useState<Offer[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectorsLoading, setSectorsLoading] = useState(true);
  
  // Create Account section refs
  const createAccountRef = useRef<HTMLDivElement>(null);
  const accountHeaderRef = useRef<HTMLDivElement>(null);
  const supplierCardRef = useRef<HTMLDivElement>(null);
  const buyerCardRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    axios.get('/api/offers')
      .then(response => {
        setOffers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching offers:', error);
        setLoading(false);
      });

    axios.get('/api/sectors')
      .then(response => {
        setSectors(response.data);
        setSectorsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching sectors:', error);
        setSectorsLoading(false);
      });
  }, []);
  

  // Create Account section animations
  useEffect(() => {
    if (!createAccountRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
            
            // Animate header
            timeline.fromTo(accountHeaderRef.current,
              { y: 50, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8 }
            );
            
            // Animate cards with stagger
            timeline.fromTo([supplierCardRef.current, buyerCardRef.current],
              { y: 60, opacity: 0, scale: 0.9 },
              { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.2 },
              '-=0.4'
            );
            
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(createAccountRef.current);

    return () => observer.disconnect();
  }, []);

  // Helper function to get icon SVG for a sector
  const getSectorIcon = (slug: string) => {
    const icons: Record<string, React.ReactElement> = {
      'agriculture': (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      ),
      'apparel-clothing': (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      ),
      'beauty-personal-care': (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      ),
      'chemicals': (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      ),
      'construction-real-estate': (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      ),
      'consumer-electronics': (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ),
      'electrical-equipment': (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
    };
    
    return icons[slug] || (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    );
  };

  return (
    <>
      {/* Optional: add font preload if you want */}
      <link rel="preconnect" href="https://fonts.bunny.net" />
      <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      
      {/* Use the AppHeader component */}
      <AppHeader />
      
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
        {/* Hero Section */}
        <HeroSection offers={offers} />

        {/* B2B Features Section */}
        <section className="w-full bg-gray-50 dark:bg-gray-900/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3 tracking-wider">WHY WHOLESALERY</p>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Connect, Trade, and Grow Your Business
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Join thousands of buyers and suppliers who trust Wholesalery for their B2B transactions. 
                  Our platform simplifies wholesale trading with powerful tools and verified partners.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    type="button"
                    className="px-6 py-2.5 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
                    onClick={() => window.location.href = '/register/buyer'}
                  >
                    Start as Buyer
                  </button>
                  <button 
                    type="button"
                    className="px-6 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => window.location.href = '/register/supplier'}
                  >
                    Join as Supplier
                  </button>
                </div>
              </div>

              {/* Right Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                  <div className="w-12 h-12 mb-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Instant Quotes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get competitive pricing from verified suppliers in seconds.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                  <div className="w-12 h-12 mb-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Verified Suppliers</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect with pre-vetted, reliable suppliers worldwide.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                  <div className="w-12 h-12 mb-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure Payments</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Trade with confidence using secure payment options.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                  <div className="w-12 h-12 mb-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Global Network</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access a worldwide network of wholesale partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Offers Section */}
        <section className="w-full bg-white dark:bg-gray-950 py-20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200 dark:bg-cyan-800 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 tracking-wider">LATEST DEALS</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">🎁 Latest Offers</h2>
              <p className="text-[#706f6c] dark:text-[#A1A09A]">
                Hand-picked deals, updated in real time.
              </p>
            </div>
            <OfferGrid offers={offers} loading={loading} />
          </div>
        </section>


        {/* Product Categories Section */}
        <section className="w-full bg-white dark:bg-gray-950 py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 opacity-0" ref={accountHeaderRef}>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 tracking-wider">WIDE RANGE OF PRODUCTS</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Explore Our Products</h2>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {sectorsLoading ? (
                <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                  Loading sectors...
                </div>
              ) : sectors.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                  No sectors available
                </div>
              ) : (
                <>
                  {sectors.slice(0, 7).map((sector) => (
                    <div 
                      key={sector.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700/50 flex flex-col h-full"
                      onClick={() => window.location.href = `/wholesale-marketplace?sector=${sector.slug}`}
                    >
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {getSectorIcon(sector.slug)}
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        {sector.name}
                        <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">
                        {sector.categories_count ? `${sector.categories_count} categories` : 'Explore products'}
                      </p>
                    </div>
                  ))}

                  {/* View All Sectors Card */}
                  {sectors.length > 7 && (
                    <div 
                      className="bg-blue-600 dark:bg-blue-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group text-white"
                      onClick={() => window.location.href = '/wholesale-marketplace'}
                    >
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">+{sectors.length - 7}</div>
                        <p className="text-sm mb-4 opacity-90">More sectors with offers from suppliers worldwide</p>
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center mx-auto">
                          View all
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        
        <div className="hidden h-14.5 lg:block"></div>
      </div>
    </>
  );
}
