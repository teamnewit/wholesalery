import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

export type CategoryCardProps = {
  name: string;
  imageUrl?: string | null;
  count?: number;
  className?: string;
};

export function CategoryCard({ name, imageUrl, count, className }: CategoryCardProps) {
  return (
    <Card
      className={cn(
        'group relative transition border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900 pb-0',
        'hover:border-blue-300/70 dark:hover:border-blue-700/70 hover:shadow-md',
        'rounded-xl',
        className
      )}
    >
      <CardContent className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="h-8 w-8 object-contain" />
            ) : (
              <span className="h-8 w-8 rounded-full bg-blue-100" />
            )}
          </span>
          <div className="flex-1">
            <div className="text-sm font-semibold tracking-tight leading-none text-gray-900 dark:text-gray-100">{name}</div>
            {typeof count === 'number' && (
              <div className="mt-1 text-xs text-muted-foreground">
                {count} {count === 1 ? 'offer' : 'offers'}
              </div>
            )}
          </div>
          <svg
            className="h-4 w-4 text-blue-600 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0"
            viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
