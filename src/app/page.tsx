'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/layout/Logo";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Optional: redirect immediately if preferred
    // router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-6 text-center">
      <Logo className="mb-8 text-5xl" />
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">
        Welcome to Migreen
      </h1>
      <p className="text-lg text-foreground/80 mb-8 max-w-2xl">
        Your personalized companion for migraine relief through green light therapy. Track your sessions, gain insights, and find what works best for you.
      </p>
      <Button 
        size="lg" 
        onClick={() => router.push('/dashboard')}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Get Started
      </Button>
    </div>
  );
}
