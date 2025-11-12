"use client";
import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { type BreadcrumbItem } from '@/types';
import { OfferGrid } from '@/components/offer-grid';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

type Offer = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  user?: { id: number; name: string };
};

export default function MarketplaceCategory({ sector, category, offers = [] }: {
  sector: { name: string; slug: string };
  category: { id: number; name: string; slug: string };
  offers: Offer[];
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Wholesale Marketplace', href: '/wholesale-marketplace' },
    { title: sector.name, href: `/wholesale-marketplace?sector=${encodeURIComponent(sector.slug)}` },
    { title: category.name, href: `/category/${sector.slug}/${category.slug}` },
  ];

  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const titleLeftRef = useRef<HTMLSpanElement>(null);
  const titleRightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(taglineRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      .fromTo([titleLeftRef.current, titleRightRef.current], { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 }, '-=0.2');
  }, [category.slug]);

  // Mock filters (no backend yet)
  // Keep a small checkbox group for Availability, and add dropdown + slider controls.
  const availabilityOptions = ['In stock', 'Preorder'] as const;
  const [availability, setAvailability] = useState<Set<string>>(new Set());
  const isAvailChecked = (v: string) => availability.has(v);
  const toggleAvail = (v: string) => {
    setAvailability((prev) => {
      const next = new Set(prev);
      next.has(v) ? next.delete(v) : next.add(v);
      return next;
    });
  };
  const [origin, setOrigin] = useState<string>('');
  const [originOpen, setOriginOpen] = useState(false);
  const [moq, setMoq] = useState<number>(100);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openMobileFilters = () => setMobileFiltersOpen(true);
  const closeMobileFilters = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.25 } });
    if (panelRef.current && backdropRef.current) {
      tl.to(panelRef.current, { x: '100%' }, 0)
        .to(backdropRef.current, { opacity: 0 }, 0)
        .add(() => setMobileFiltersOpen(false));
    } else {
      setMobileFiltersOpen(false);
    }
  };

  useEffect(() => {
    if (mobileFiltersOpen) {
      // Ensure initial states
      if (panelRef.current) gsap.set(panelRef.current, { x: '100%' });
      if (backdropRef.current) gsap.set(backdropRef.current, { opacity: 0 });
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.25 } });
      if (panelRef.current && backdropRef.current) {
        tl.to(backdropRef.current, { opacity: 1 }, 0)
          .to(panelRef.current, { x: '0%' }, 0);
      }
    }
  }, [mobileFiltersOpen]);

  return (
    <PublicLayout breadcrumbs={breadcrumbs}>
      <Head title={`${category.name} • ${sector.name}`} />
      {/* Hero-like header (no search) */}
      <section className="w-full bg-white dark:bg-gray-950 overflow-hidden py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center" ref={heroRef}>
          <div className="mb-2 opacity-0" ref={taglineRef}>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{sector.name}</p>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            <span ref={titleLeftRef} className="inline-block text-blue-700 dark:text-blue-600 opacity-0">{category.name}</span>{' '}
            <span ref={titleRightRef} className="inline-block text-gray-900 dark:text-gray-100 opacity-0">Offers</span>
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile filters trigger */}
        <div className="mb-4 md:hidden flex justify-end">
          <button
            type="button"
            onClick={openMobileFilters}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M3 5.75A.75.75 0 013.75 5h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 5.75zm2 4A.75.75 0 015.75 9h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 9.75zm3 4a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5A.75.75 0 018 13.75z" clipRule="evenodd" />
            </svg>
            Filters
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="hidden md:block space-y-5">
            {/* Availability (checkbox row style) */}
            <div>
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Availability</div>
              <div className="space-y-2">
                {availabilityOptions.map((label) => {
                  const checked = isAvailChecked(label);
                  return (
                    <button
                      type="button"
                      key={label}
                      onClick={() => toggleAvail(label)}
                      className={cn(
                        'w-full group flex items-center gap-3 rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-left transition cursor-pointer',
                        'hover:bg-gray-50 dark:hover:bg-gray-800',
                        checked && 'bg-blue-600/10 border-blue-600/40 text-blue-700 dark:text-blue-400'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-4 w-4 items-center justify-center rounded-[4px] border',
                          checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 dark:border-gray-700'
                        )}
                        aria-hidden
                      >
                        {checked && (
                          <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Origin (dropdown styled like search results) */}
            <div className="relative">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Origin</div>
              <button
                type="button"
                onClick={() => setOriginOpen((v) => !v)}
                className={cn(
                  'w-full flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-left cursor-pointer',
                  'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition'
                )}
              >
                <span className="text-sm text-foreground/90">{origin || 'Any'}</span>
                <svg className={cn('h-4 w-4 transition', originOpen ? 'rotate-180' : '')} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>
              {originOpen && (
                <div className="absolute z-[9999] mt-1 w-full bg-white dark:bg-gray-900 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto text-left custom-scrollbar">
                  {['', 'EU', 'US', 'Asia'].map((opt) => (
                    <button
                      key={opt || 'Any'}
                      type="button"
                      onClick={() => { setOrigin(opt); setOriginOpen(false); }}
                      className={cn(
                        'w-full px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer',
                        origin === opt && 'bg-blue-600/5 text-blue-700 dark:text-blue-400'
                      )}
                    >
                      <span>{opt || 'Any'}</span>
                      {origin === opt && (
                        <svg viewBox="0 0 20 20" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MOQ (slider, themed) */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">MOQ</div>
                <div className="text-xs text-muted-foreground">{moq}+ units</div>
              </div>
              <div className="px-1">
                {(() => {
                  const pct = Math.round((moq / 1000) * 100);
                  const lightTrack = `linear-gradient(to right, #2563eb 0%, #2563eb ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`;
                  const darkTrack = `linear-gradient(to right, #60a5fa 0%, #60a5fa ${pct}%, #374151 ${pct}%, #374151 100%)`;
                  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
                  return (
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={50}
                      value={moq}
                      onChange={(e) => setMoq(parseInt(e.target.value, 10))}
                      className="w-full themed-slider"
                      style={{ background: isDark ? darkTrack : lightTrack }}
                    />
                  );
                })()}
              </div>
            </div>
          </aside>

          <div>
            {offers.length ? (
              <OfferGrid offers={offers as any} />
            ) : (
              <div className="text-sm text-muted-foreground">No offers yet in this category.</div>
            )}
          </div>
        </div>

        {/* Mobile filters drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[10000]">
            <div ref={backdropRef} className="absolute inset-0 bg-black/40" onClick={closeMobileFilters} />
            <div ref={panelRef} className="absolute inset-y-0 right-0 w-11/12 max-w-sm bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl p-4 overflow-y-auto custom-scrollbar">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium">Filters</div>
                <button
                  type="button"
                  onClick={closeMobileFilters}
                  aria-label="Close filters"
                  className="inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Availability (checkbox row style) */}
              <div className="space-y-5">
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Availability</div>
                  <div className="space-y-2">
                    {availabilityOptions.map((label) => {
                      const checked = isAvailChecked(label);
                      return (
                        <button
                          type="button"
                          key={label}
                          onClick={() => toggleAvail(label)}
                          className={cn(
                            'w-full group flex items-center gap-3 rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-left transition',
                            'hover:bg-gray-50 dark:hover:bg-gray-800',
                            checked && 'bg-blue-600/10 border-blue-600/40 text-blue-700 dark:text-blue-400'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-flex h-4 w-4 items-center justify-center rounded-[4px] border',
                              checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 dark:border-gray-700'
                            )}
                            aria-hidden
                          >
                            {checked && (
                              <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                          <span className="text-sm">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Origin (dropdown styled like search results) */}
                <div className="relative">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Origin</div>
                  <button
                    type="button"
                    onClick={() => setOriginOpen((v) => !v)}
                    className={cn(
                      'w-full flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 text-left cursor-pointer',
                      'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition'
                    )}
                  >
                    <span className="text-sm text-foreground/90">{origin || 'Any'}</span>
                    <svg className={cn('h-4 w-4 transition', originOpen ? 'rotate-180' : '')} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {originOpen && (
                    <div className="absolute z-[10001] mt-1 w-full bg-white dark:bg-gray-900 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto text-left custom-scrollbar">
                      {['', 'EU', 'US', 'Asia'].map((opt) => (
                        <button
                          key={opt || 'Any'}
                          type="button"
                          onClick={() => { setOrigin(opt); setOriginOpen(false); }}
                          className={cn(
                            'w-full px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer',
                            origin === opt && 'bg-blue-600/5 text-blue-700 dark:text-blue-400'
                          )}
                        >
                          <span>{opt || 'Any'}</span>
                          {origin === opt && (
                            <svg viewBox="0 0 20 20" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* MOQ (slider, themed) */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">MOQ</div>
                    <div className="text-xs text-muted-foreground">{moq}+ units</div>
                  </div>
                  <div className="px-1">
                    {(() => {
                      const pct = Math.round((moq / 1000) * 100);
                      const lightTrack = `linear-gradient(to right, #2563eb 0%, #2563eb ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`;
                      const darkTrack = `linear-gradient(to right, #60a5fa 0%, #60a5fa ${pct}%, #374151 ${pct}%, #374151 100%)`;
                      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
                      return (
                        <input
                          type="range"
                          min={0}
                          max={1000}
                          step={50}
                          value={moq}
                          onChange={(e) => setMoq(parseInt(e.target.value, 10))}
                          className="w-full themed-slider"
                          style={{ background: isDark ? darkTrack : lightTrack }}
                        />
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
