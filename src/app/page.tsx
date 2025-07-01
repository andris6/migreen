'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations('HomePage');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-6 text-center">
      <Logo className="mb-8 text-5xl" />
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">
        {t('title')}
      </h1>
      <p className="text-lg text-foreground/80 mb-8 max-w-2xl">
        {t('subtitle')}
      </p>
      <Button 
        size="lg" 
        onClick={() => router.push('/dashboard')}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {t('getStarted')}
      </Button>
    </div>
  );
}
