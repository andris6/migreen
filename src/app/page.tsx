
'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-6">
        <div className="text-center lg:text-left">
          <Logo className="mb-6 text-5xl justify-center lg:justify-start" />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-primary mb-4 animate-fade-in-down">
            Welcome to Migreen
          </h1>
          <p className="text-lg text-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0">
            Your personalized companion for migraine relief through green light therapy. Track your sessions, gain insights, and find what works best for you.
          </p>
          <Button 
            size="lg" 
            onClick={() => router.push('/dashboard')}
            className="text-lg py-7 px-8"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5"/>
          </Button>
        </div>
        <div className="hidden lg:flex items-center justify-center">
            <Image 
                src="https://placehold.co/600x400.png"
                alt="Abstract illustration representing calm and relief"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
                data-ai-hint="calm abstract"
            />
        </div>
      </div>
    </div>
  );
}
