import React from 'react';
import { OfferCard } from '@/components/offer-card';

interface OfferGridProps {
  offers: Array<{
    id: number;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
      email: string;
      avatar?: string;
    };
  }>;
  loading?: boolean;
}

export function OfferGrid({ offers, loading = false }: OfferGridProps) {
  if (loading) {
    return (
      <div className="w-full text-center py-8">
        <div className="animate-pulse">Loading offers...</div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-neutral-500 dark:text-neutral-400">No offers found</p>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {offers.map((offer) => (
        <div key={offer.id} className="w-full h-full flex">
          <OfferCard offer={offer} />
        </div>
      ))}
    </div>
  );
}
