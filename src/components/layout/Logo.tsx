import { Waves } from 'lucide-react'; // Using Waves as a placeholder, can be replaced with a custom SVG
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const t = useTranslations('Logo');
  return (
    <Link href="/" className={`flex items-center gap-2 text-primary ${className}`}>
      <Waves className="h-7 w-7" /> {/* Adjusted size */}
      <span className="text-xl font-bold font-headline">{t('appName')}</span> {/* Adjusted size */}
    </Link>
  );
}
