"use client";
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { type BreadcrumbItem } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryCard } from '@/components/marketplace/category-card';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import axios from 'axios';
import { cn } from '@/lib/utils';

type Sector = { id: number; name: string; slug: string };
type Category = { id: number; name: string; slug: string; sector_id: number; image_url?: string | null; approved_offers_count?: number };
type Offer = { id: number; title: string; description: string; created_at: string };
type CategoryLite = { id: number; name: string; slug: string; sector: { slug: string; name: string } };

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Wholesale Marketplace', href: '/wholesale-marketplace' },
];

export default function MarketplaceIndex({ sectors = [], activeSector = null, categories = [] }: {
  sectors: Sector[];
  activeSector: Sector | null;
  categories: Category[];
}) {
  const [selectedSector, setSelectedSector] = useState<string | null>(activeSector?.slug ?? null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [allCategories, setAllCategories] = useState<CategoryLite[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ kind: 'offer'; item: Offer } | { kind: 'category'; item: CategoryLite }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // GSAP refs
  const heroRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const titleLeftRef = useRef<HTMLSpanElement>(null);
  const titleRightRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(taglineRef.current, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo([titleLeftRef.current, titleRightRef.current], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }, '-=0.2')
      .fromTo([inputRef.current, buttonRef.current], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, '-=0.3');

    // hover micro-interaction on the button
    const btnEl = buttonRef.current;
    const onEnter = () => gsap.to(btnEl, { scale: 1.04, duration: 0.2 });
    const onLeave = () => gsap.to(btnEl, { scale: 1.0, duration: 0.2 });
    if (btnEl) {
      btnEl.addEventListener('mouseenter', onEnter);
      btnEl.addEventListener('mouseleave', onLeave);
    }
    return () => {
      if (btnEl) {
        btnEl.removeEventListener('mouseenter', onEnter);
        btnEl.removeEventListener('mouseleave', onLeave);
      }
    };
  }, []);

  // Animate categories grid whenever sector changes
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('[data-cat-card]');
    gsap.fromTo(cards, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
  }, [activeSector?.slug, categories.length]);

  // Load offers for client-side search (public, approved ones)
  useEffect(() => {
    axios.get('/api/offers')
      .then((res) => setOffers(res.data))
      .catch(() => setOffers([]));
    axios.get('/api/categories')
      .then((res) => setAllCategories(res.data))
      .catch(() => setAllCategories([]));
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setIsSearching(true);
      const q = query.toLowerCase();
      const offerMatches = offers.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
      ).map((o) => ({ kind: 'offer' as const, item: o }));
      const categoryMatches = allCategories.filter(c =>
        c.name.toLowerCase().includes(q) || c.sector.name.toLowerCase().includes(q)
      ).map((c) => ({ kind: 'category' as const, item: c }));
      // Prioritize categories, then offers
      setSearchResults([
        ...categoryMatches.slice(0, 5),
        ...offerMatches.slice(0, 5),
      ]);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = () => {
    if (searchResults.length > 0 && searchQuery) {
      const first = searchResults[0];
      if (first.kind === 'category') {
        router.visit(route('marketplace.category', { sectorSlug: first.item.sector.slug, categorySlug: first.item.slug }));
      } else {
        router.visit(`/offers/${first.item.id}`);
      }
    }
  };

  const handleResultClick = (r: { kind: 'offer'; item: Offer } | { kind: 'category'; item: CategoryLite }) => {
    if (r.kind === 'offer') {
      router.visit(`/offers/${r.item.id}`);
    } else {
      router.visit(route('marketplace.category', { sectorSlug: r.item.sector.slug, categorySlug: r.item.slug }));
    }
  };

  const onSelectSector = (slug: string) => {
    const next = selectedSector === slug ? null : slug;
    setSelectedSector(next);
    const qs = next ? `?sector=${encodeURIComponent(next)}` : '';
    router.visit(`/wholesale-marketplace${qs}`, { preserveScroll: true, preserveState: true });
  };

  return (
    <PublicLayout breadcrumbs={breadcrumbs}>
      <Head title="Wholesale Marketplace" />

      {/* Hero-like header */}
      <section className="w-full bg-white dark:bg-gray-950 overflow-visible py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-50" ref={heroRef}>
          <div className="mb-2 opacity-0" ref={taglineRef}>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Explore sectors and discover wholesale offers</p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span ref={titleLeftRef} className="inline-block text-blue-700 dark:text-blue-600 opacity-0">Wholesale</span>{' '}
            <span ref={titleRightRef} className="inline-block text-gray-900 dark:text-gray-100 opacity-0">Marketplace</span>
          </h1>
          <div className="mt-6 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center relative z-50">
            <div className="w-full max-w-xl opacity-0 relative z-50" ref={inputRef}>
              <input
                type="text"
                placeholder="Search categories or offers..."
                className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {/* Dropdown Search Results */}
              {searchQuery && (searchResults.length > 0 || (!isSearching && searchResults.length === 0)) && (
                <div className="absolute z-[9999] mt-1 w-full bg-white dark:bg-gray-900 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto text-left custom-scrollbar">
                  {searchResults.slice(0, 10).map((r, idx) => (
                    <div
                      key={r.kind + '-' + (r.kind === 'offer' ? r.item.id : r.item.slug) + '-' + idx}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0"
                      onClick={() => handleResultClick(r)}
                    >
                      {r.kind === 'category' ? (
                        <>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{r.item.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">Category • {r.item.sector.name}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{r.item.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">Offer</div>
                        </>
                      )}
                    </div>
                  ))}
                  {!isSearching && searchResults.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">No results found</div>
                  )}
                </div>
              )}
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
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Left: Sectors single-select */}
          <div className="md:col-span-1 max-h-[520px] overflow-y-auto pr-2">
            <div className="space-y-2">
              {sectors.map((s) => {
                const active = selectedSector === s.slug;
                return (
                  <div
                    key={s.slug}
                    role="button"
                    aria-selected={active}
                    onClick={() => onSelectSector(s.slug)}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer select-none border transition-colors duration-200',
                      active
                        ? 'bg-blue-50/70 border-blue-200 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800'
                        : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20 border-transparent text-gray-700 dark:text-gray-200'
                    )}
                  >
                    <Checkbox
                      checked={active}
                      onCheckedChange={() => onSelectSector(s.slug)}
                      className={cn(
                        'h-4 w-4 transition-colors',
                        active ? 'data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500' : ''
                      )}
                    />
                    <span className="text-sm">{s.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Subcategories grid */}
          <div className="md:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {activeSector ? activeSector.name : 'Select a sector'}
              </div>
              {activeSector && (
                <Link href={route('marketplace.category', { sectorSlug: activeSector.slug, categorySlug: categories[0]?.slug ?? '' })}>
                  <span className="text-sm underline-offset-4 hover:underline">See all category offers →</span>
                </Link>
              )}
            </div>

            <div ref={gridRef} className="relative z-0 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <Link key={c.slug} href={route('marketplace.category', { sectorSlug: activeSector?.slug, categorySlug: c.slug })}>
                  <div data-cat-card>
                    <CategoryCard name={c.name} imageUrl={c.image_url} count={c.approved_offers_count ?? 0} />
                  </div>
                </Link>
              ))}
              {!categories.length && (
                <div className="text-sm text-muted-foreground">Select a sector to view its categories.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
