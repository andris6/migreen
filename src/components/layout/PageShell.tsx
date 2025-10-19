
'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/reset-password';
  const isHomePage = pathname === '/';
  const isTherapySessionPage = pathname === '/therapy/session';
  
  // Routes with header/footer are the main app routes.
  // We hide it for landing, auth, and the full-screen therapy session.
  const shouldRenderHeaderFooter = !isTherapySessionPage && !isHomePage && !isAuthPage;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {shouldRenderHeaderFooter && <Header />}

      <main className={cn(
        "flex-grow",
        // Add container and padding only for pages with header/footer
        shouldRenderHeaderFooter && "container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      )}>
        {children}
      </main>
      
      {shouldRenderHeaderFooter && (
        <footer className="py-4 text-center text-xs text-muted-foreground border-t">
          Migreen © {new Date().getFullYear()}
        </footer>
      )}
    </div>
  );
}
