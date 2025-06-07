import { Waves } from 'lucide-react'; // Using Waves as a placeholder, can be replaced with a custom SVG
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-primary ${className}`}>
      <Waves className="h-8 w-8" />
      <span className="text-2xl font-bold font-headline">Migreen</span>
    </Link>
  );
}
