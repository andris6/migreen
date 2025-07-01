
import { Leaf } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const t = useTranslations('Logo');
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm", className)}>
      <div className="p-1.5 bg-primary rounded-lg">
        <Leaf className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold font-headline">{t('appName')}</span>
    </Link>
  );
}
