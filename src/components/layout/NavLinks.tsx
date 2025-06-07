
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, ListChecks, BarChart3, Cog, Brain } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/therapy/start', label: 'Therapy', icon: ListChecks },
  { href: '/history', label: 'History', icon: BarChart3 },
  { href: '/recommendations', label: 'AI Insights', icon: Brain },
];

interface NavLinksProps {
  isMobile?: boolean;
  onMobileLinkClick?: () => void; // New prop to handle mobile link clicks
}

export default function NavLinks({ isMobile = false, onMobileLinkClick }: NavLinksProps) {
  const pathname = usePathname();

  const handleClick = () => {
    if (isMobile && onMobileLinkClick) {
      onMobileLinkClick();
    }
  };

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={handleClick} // Call handleClick on link click
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            pathname === item.href ? 'bg-accent text-accent-foreground' : 'text-foreground/70',
            isMobile ? 'text-base' : ''
          )}
        >
          <item.icon className={cn('h-5 w-5', isMobile ? 'h-6 w-6' : '')} />
          {item.label}
        </Link>
      ))}
    </>
  );
}
