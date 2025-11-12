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

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  
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

        {/* Content */}
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow p-2 sm:p-4 md:p-6 lg:p-8">
          <main className="flex w-full flex-col-reverse lg:flex-row max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1280px]">
            <div className="flex-1 p-6 pb-12 text-[13px] leading-[20px] lg:p-10">
              <h1 className="mb-3 text-xl font-bold">🎁 Latest Offers</h1>
              <p className="mb-3 text-[#706f6c] dark:text-[#A1A09A]">
                Hand-picked deals, updated in real time.
              </p>
              <OfferGrid offers={offers} loading={loading} />
            </div>
            {/* You can add a side illustration or svg here, if needed */}
          </main>
        </div>

        {/* Create Account Section */}
        <section className="w-full bg-white dark:bg-gray-950 py-20 relative overflow-hidden" ref={createAccountRef}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-200 dark:bg-cyan-800 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-16 opacity-0" ref={accountHeaderRef}>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 tracking-wider">SCALE YOUR BUSINESS</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            </div>

            {/* Benefits Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-full mx-auto">
              {/* Supplier Benefits Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-cyan-200 dark:border-cyan-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 opacity-0" ref={supplierCardRef}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Benefits For Supplier</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Increase Your Brand Visibility Across the Wholesale Market</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Offer Your Products to Qualified Buyers</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Enjoy Suitable Environment for B2B Deals</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Build Long-Term Partnerships with Retailers and Industry Professionals</p>
                  </div>
                </div>
                <button className="mt-6 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                  Explore More
                </button>
              </div>

              {/* Buyer Benefits Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 opacity-0" ref={buyerCardRef}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Benefits For Buyer</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Access a Broad Selection of Products</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Post Sourcing Requests with Exact Product Requirements</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Optimize Time and Budget with Intelligent Offer Comparisons</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">Establish Partnerships with Reliable Suppliers</p>
                  </div>
                </div>
                <button className="mt-6 px-6 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-400 text-white rounded-lg transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                  Explore More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories Section */}
        <section className="w-full bg-white dark:bg-gray-950 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 opacity-0" ref={accountHeaderRef}>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 tracking-wider">WIDE RANGE OF PRODUCTS</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Explore Our Products</h2>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
              {/* Agriculture */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700/50"
                onClick={() => window.location.href = '/categories/agriculture'}
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  Agriculture
                  <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">Agricultural Machinery & Farm Equipment, Agrochemicals, Animal...</p>
              </div>

              {/* Apparel */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700/50 flex flex-col h-full"
                onClick={() => window.location.href = '/categories/apparel'}
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  Apparel
                  <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">Accessories, Baby Clothing, Childrens Clothing, Men's Clothing, Other Apparel...</p>
              </div>

              {/* Beauty & Personal Care */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700/50 flex flex-col h-full"
                onClick={() => window.location.href = '/categories/beauty'}
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  Beauty & Personal Care
                  <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">Baby Care, Beauty Supplies & Equipment, Men Care, Other Beauty &...</p>
              </div>

              {/* Chemicals */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700/50 flex flex-col h-full"
                onClick={() => window.location.href = '/categories/chemicals'}
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  Chemicals
                  <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">Adhesives Sealants, Agrochemicals, Automotive Fluid & Chemicals, Basic...</p>
              </div>

              {/* Construction */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700/50 flex flex-col h-full"
                onClick={() => window.location.href = '/categories/construction'}
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  Construction
                  <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">Balustrades & Handrails, Bathrooms, Building Glass, Building Materials...</p>
              </div>

              {/* Consumer Electronics */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700/50 flex flex-col h-full"
                onClick={() => window.location.href = '/categories/electronics'}
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  Consumer Electronics
                  <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">Cables, Adapters & Connectors, Camera & Accessories, Chargers...</p>
              </div>

              {/* Electrical Equipment */}
              <div 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-700/50 flex flex-col h-full"
                onClick={() => window.location.href = '/categories/electrical'}
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  Electrical Equipment & ...
                  <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex-grow">Batteries, Connectors & Terminals, Electrical Instruments, Electrical...</p>
              </div>

              {/* View All Categories Card */}
              <div 
                className="bg-blue-600 dark:bg-blue-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group text-white"
                onClick={() => window.location.href = '/categories'}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">+24</div>
                  <p className="text-sm mb-4 opacity-90">Categories with offers from suppliers worldwide</p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center mx-auto">
                    View all
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <div className="hidden h-14.5 lg:block"></div>
      </div>
    </>
  );
}
