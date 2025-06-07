
'use client'; // Required for Header which uses useTheme and usePathname

import { Header } from '@/components/layout/Header';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTherapySessionPage = pathname === '/therapy/session';

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        className={cn(
          'transition-all duration-500 ease-in-out',
          isTherapySessionPage ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        )}
      />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-screen-2xl">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        Migreen &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
