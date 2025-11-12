'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        className: 'border border-gray-200 dark:border-gray-700',
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
        },
      }}
    />
  );
}
