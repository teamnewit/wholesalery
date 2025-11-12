import { AppHeader } from '@/components/app-header';
import { ToastProvider } from '@/components/ui/toast-provider';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

interface PublicLayoutProps {
  breadcrumbs?: BreadcrumbItem[];
}

export default function PublicLayout({ breadcrumbs = [], children }: PropsWithChildren<PublicLayoutProps>) {
  return (
    <>
      <ToastProvider />
      <AppHeader breadcrumbs={breadcrumbs} />
      <main className="min-h-[calc(100svh-4rem)]">
        {children}
      </main>
    </>
  );
}
