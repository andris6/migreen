'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BarChart3, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2">
          Welcome to Your Migreen Dashboard
        </h1>
        <p className="text-lg text-foreground/80">
          Start a new therapy session or review your progress.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              Start Therapy
            </CardTitle>
            <CardDescription>Begin your green light therapy session.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Input your current pain level and potential triggers to get a personalized session.
            </p>
            <Link href="/therapy/start" passHref>
              <Button className="w-full">
                New Session <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              View History
            </CardTitle>
            <CardDescription>Review your past sessions and track progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Analyze your pain levels, relief scores, and therapy durations over time.
            </p>
            <Link href="/history" passHref>
              <Button variant="outline" className="w-full">
                See History <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Get personalized insights for your therapy.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Leverage AI to discover optimal therapy durations and times based on your data.
            </p>
            <Link href="/recommendations" passHref>
              <Button variant="outline" className="w-full">
                Get Insights <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section>
        {/* Placeholder for a quick summary or recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70">Your recent activity and key stats will appear here.</p>
            {/* Example: Last session details or average relief score */}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
