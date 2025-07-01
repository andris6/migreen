
'use client';

import { usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Header } from './Header';

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('Footer');
  const pathname = usePathname();
  
  // Conditionally hide header and footer for the full-screen therapy session
  const isTherapySessionPage = pathname === '/therapy/session';

  // Conditionally hide header and footer for the marketing home page
  const isHomePage = pathname === '/';

  const showHeaderFooter = !isTherapySessionPage && !isHomePage;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeaderFooter && <Header />}

      <main className={cn(
        "flex-grow",
        // Add container and padding only for pages with header/footer
        showHeaderFooter && "container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      )}>
        {children}
      </main>
      
      {showHeaderFooter && (
        <footer className="py-4 text-center text-xs text-muted-foreground border-t">
          {t('copyright', { year: new Date().getFullYear() })}
        </footer>
      )}
    </div>
  );
}
