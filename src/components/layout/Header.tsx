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
import { Separator } from '../ui/separator';
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

  if (!mounted) {
    return (
      <header className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        propClassName
      )}>
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Logo className="ml-8 md:ml-8" />
          <div className="flex items-center space-x-3 mr-4">
          </div>
        </div>
      </header>
    );
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      propClassName
    )}>
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Logo className="ml-8 md:ml-8" />
        <div className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </div>
        <div className="flex items-center space-x-3 mr-4">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={t('toggle_theme')}
            className="group"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-accent group-hover:text-accent-foreground" /> : <Moon className="h-5 w-5 text-accent group-hover:text-accent-foreground" />}
          </Button>
          <Link href="/settings" passHref>
            <Button variant="ghost" size="icon" aria-label={t('settings')} className="group">
              <Settings className="h-5 w-5 text-accent group-hover:text-accent-foreground" />
            </Button>
          </Link>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('open_menu')} className="group">
                  <Menu className="h-6 w-6 text-accent group-hover:text-accent-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-6">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo className="ml-8"/>
                <div className="mt-6 flex flex-col space-y-3">
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
