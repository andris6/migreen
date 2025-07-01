
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BarChart3, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2 animate-fade-in-down">
          Your Migreen Dashboard
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Start a new therapy session or review your progress.
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-3 lg:col-span-1 bg-primary/10 border-primary/20 hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Lightbulb className="w-8 h-8 text-primary" />
              New Session
            </CardTitle>
            <CardDescription>Begin your green light therapy session to find relief.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/therapy/start" passHref>
              <Button className="w-full text-lg py-6" size="lg">
                Start Therapy <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="md:col-span-3 lg:col-span-2 grid gap-8 md:grid-cols-2">
            <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-primary" />
                History & Insights
                </CardTitle>
                <CardDescription>Analyze past sessions to discover patterns.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/history" passHref>
                <Button variant="outline" className="w-full">
                    View History <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </Link>
            </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                <Brain className="w-7 h-7 text-primary" />
                AI Recommendations
                </CardTitle>
                <CardDescription>Get personalized suggestions to optimize your therapy.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/recommendations" passHref>
                <Button variant="outline" className="w-full">
                    Get Insights <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </Link>
            </CardContent>
            </Card>
        </div>
      </div>

      <section>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70">Your recent activity and key stats will appear here.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
