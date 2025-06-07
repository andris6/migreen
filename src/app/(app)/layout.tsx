'use client'; // Required for Header which uses useTheme

import { Header } from '@/components/layout/Header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-screen-2xl">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        Migreen &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
