
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Settings, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import NavLinks from './NavLinks';

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Logo className="ml-0 md:ml-2" /> {/* Added ml-2 for medium screens and up, default ml-0 for small */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}
          </Button>
          <Link href="/settings" passHref>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5 text-primary" />
            </Button>
          </Link>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-6">
                <Logo className="ml-2"/> {/* Added ml-2 for mobile sheet */}
                <div className="mt-6 flex flex-col space-y-3">
                  <NavLinks isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
