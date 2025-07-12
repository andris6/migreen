
'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-slate-950 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#38bdf81a,transparent)]"></div>
      </div>
      <div className="flex-grow flex items-center justify-center container grid grid-cols-1 gap-12 px-6">
        <div className="text-center">
          <Logo className="mb-6 text-5xl justify-center" />
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4 animate-fade-in-down">
            Your Migraine Solution, Instantly.
          </h1>
          <p className="text-lg text-foreground/80 mb-8 max-w-xl mx-auto">
            Your personalized companion for migraine relief through green light therapy. Track your sessions, gain insights, and find what works best for you.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="text-lg py-7 px-8"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5"/>
          </Button>
        </div>
      </div>
    </div>
  );
}
