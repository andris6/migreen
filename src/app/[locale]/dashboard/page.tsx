
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BarChart3, Brain, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations('DashboardPage');

  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2 animate-fade-in-down">
          {t('title')}
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-3 lg:col-span-1 bg-primary/10 border-primary/20 hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Lightbulb className="w-8 h-8 text-primary" />
              {t('startTherapyTitle')}
            </CardTitle>
            <CardDescription>{t('startTherapyDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              {t('startTherapyContent')}
            </p>
            <Link href="/therapy/start" passHref>
              <Button className="w-full text-lg py-6" size="lg">
                {t('startTherapyButton')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="md:col-span-3 lg:col-span-2 grid gap-8 md:grid-cols-2">
            <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-primary" />
                {t('viewHistoryTitle')}
                </CardTitle>
                <CardDescription>{t('viewHistoryDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">
                {t('viewHistoryContent')}
                </p>
                <Link href="/history" passHref>
                <Button variant="outline" className="w-full">
                    {t('viewHistoryButton')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </Link>
            </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                <Brain className="w-7 h-7 text-primary" />
                {t('aiRecommendationsTitle')}
                </CardTitle>
                <CardDescription>{t('aiRecommendationsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">
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
      </div>

      <section>
        <Card className="border-dashed">
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
