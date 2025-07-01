'use client';

import { Header } from '@/components/layout/Header';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations('Footer');
  const isTherapySessionPage = pathname === '/therapy/session';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        className={cn(
          'transition-all duration-300 ease-in-out',
          isTherapySessionPage ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        )}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className={cn(
        "py-4 text-center text-xs text-muted-foreground border-t transition-opacity duration-300",
        isTherapySessionPage ? 'opacity-0' : 'opacity-100'
      )}>
        {t('copyright', { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}
