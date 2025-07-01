
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isHomePage = pathname === '/';
  const isTherapySessionPage = pathname === '/therapy/session';
  
  const isProtectedRoute = !isHomePage && !isAuthPage;

  useEffect(() => {
    if (!loading && !user && isProtectedRoute) {
      router.replace('/login');
    }
  }, [user, loading, isProtectedRoute, router, pathname]);

  if (loading && isProtectedRoute) {
    return (
       <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="space-y-8">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid gap-8 md:grid-cols-3">
                    <Skeleton className="h-48 w-full md:col-span-3 lg:col-span-1" />
                    <div className="md:col-span-3 lg:col-span-2 grid gap-8 md:grid-cols-2">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
                <Skeleton className="h-24 w-full" />
            </div>
        </main>
         <footer className="py-4 text-center text-xs text-muted-foreground border-t">
          Migreen © {new Date().getFullYear()}
        </footer>
      </div>
    );
  }

  // Conditionally hide header and footer for specific pages
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
