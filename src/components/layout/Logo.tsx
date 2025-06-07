import { Waves } from 'lucide-react'; // Using Waves as a placeholder, can be replaced with a custom SVG
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-primary ${className}`}>
      <Waves className="h-7 w-7" /> {/* Adjusted size */}
      <span className="text-xl font-bold font-headline">Migreen</span> {/* Adjusted size */}
    </Link>
  );
}
