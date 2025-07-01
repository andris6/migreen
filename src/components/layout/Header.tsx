'use client';

import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu, Settings, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import NavLinks from './NavLinks';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { useTranslations } from 'next-intl';

interface HeaderProps {
  className?: string;
}

export function Header({ className: propClassName }: HeaderProps) {
  const t = useTranslations('Header');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const ThemeToggle = () => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label={t('toggle_theme')}
        className="group"
      >
        <Sun className="h-5 w-5 text-accent rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 text-accent rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">{t('toggle_theme')}</span>
      </Button>
  )

  if (!mounted) {
    return (
      <header className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        propClassName
      )}>
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Logo />
        </div>
      </header>
    );
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      propClassName
    )}>
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-2">
          <NavLinks />
        </nav>
        <div className="flex items-center space-x-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/settings" passHref>
            <Button variant="ghost" size="icon" aria-label={t('settings')} className="group">
              <Settings className="h-5 w-5 text-accent" />
            </Button>
          </Link>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('open_menu')} className="group">
                  <Menu className="h-6 w-6 text-accent" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-6">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo />
                <div className="mt-8 flex flex-col space-y-3">
                  <NavLinks isMobile={true} onMobileLinkClick={closeMobileMenu} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
