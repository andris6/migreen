'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BarChart3, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations('DashboardPage');

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold font-headline text-primary mb-2">
          {t('title')}
        </h1>
        <p className="text-lg text-foreground/80">
          {t('subtitle')}
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              {t('startTherapyTitle')}
            </CardTitle>
            <CardDescription>{t('startTherapyDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {t('startTherapyContent')}
            </p>
            <Link href="/therapy/start" passHref>
              <Button className="w-full">
                {t('startTherapyButton')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              {t('viewHistoryTitle')}
            </CardTitle>
            <CardDescription>{t('viewHistoryDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {t('viewHistoryContent')}
            </p>
            <Link href="/history" passHref>
              <Button variant="outline" className="w-full">
                {t('viewHistoryButton')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              {t('aiRecommendationsTitle')}
            </CardTitle>
            <CardDescription>{t('aiRecommendationsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              {t('aiRecommendationsContent')}
            </p>
            <Link href="/recommendations" passHref>
              <Button variant="outline" className="w-full">
                {t('aiRecommendationsButton')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>{t('quickOverviewTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/70">{t('quickOverviewContent')}</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
