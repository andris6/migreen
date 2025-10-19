
'use client';

import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Menu, Settings, Sun, Moon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import NavLinks from '@/components/layout/NavLinks';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';

interface HeaderProps {
  className?: string;
}

export function Header({ className: propClassName }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logOut } = useAuth();

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
        aria-label="Toggle theme"
        className="group"
      >
        <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
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
          <ThemeToggle />
          
          {user ? (
            <>
              <Link href="/settings" passHref>
                <Button variant="ghost" size="icon" aria-label="Settings" className="group">
                  <Settings className="h-6 w-6" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logOut} aria-label="Log Out">
                <LogOut className="h-6 w-6" />
              </Button>
            </>
          ) : (
             <div className="hidden md:flex items-center space-x-1">
                <Button asChild variant="ghost"><Link href="/login">Log In</Link></Button>
                <Button asChild><Link href="/signup">Sign Up</Link></Button>
             </div>
          )}

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="group">
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-6">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo />
                <div className="mt-8 flex h-full flex-col">
                  <div className="flex flex-col space-y-3">
                    <NavLinks isMobile={true} onMobileLinkClick={closeMobileMenu} />
                  </div>
                  <div className="mt-auto flex flex-col space-y-2 pt-4">
                     <Separator className="my-2" />
                     {user ? (
                        <div className='flex flex-col space-y-2'>
                          <p className="px-3 text-sm text-muted-foreground">{user.email}</p>
                           <SheetClose asChild>
                             <Button asChild variant="ghost" className='justify-start text-base'>
                              <Link href="/settings"><Settings className="mr-2 h-5 w-5"/> Settings</Link>
                             </Button>
                           </SheetClose>
                           <SheetClose asChild>
                             <Button variant="ghost" onClick={logOut} className='justify-start text-base'>
                               <LogOut className="mr-2 h-5 w-5" /> Log Out
                             </Button>
                           </SheetClose>
                        </div>
                     ) : (
                       <div className="flex flex-col space-y-2">
                         <SheetClose asChild>
                           <Button asChild variant="outline"><Link href="/login">Log In</Link></Button>
                         </SheetClose>
                         <SheetClose asChild>
                           <Button asChild><Link href="/signup">Sign Up</Link></Button>
                         </SheetClose>
                       </div>
                     )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
