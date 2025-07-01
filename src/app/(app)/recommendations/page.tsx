'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Wand2, AlertCircle } from 'lucide-react';
import { personalizedTherapyRecommendation, type PersonalizedTherapyRecommendationOutput } from '@/ai/flows/personalized-therapy-recommendation';
import { getStoredSessions, type TherapySession, type HeadArea } from '@/lib/storage';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslations } from 'next-intl';

function formatHeadAreaForAI(area?: HeadArea): string {
  if (!area || area === 'none') return 'N/A';
  return area.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatSessionHistoryForAI(sessions: TherapySession[]): string {
  if (sessions.length === 0) {
    return "No session history available.";
  }
  return sessions.map(s => 
    `Session on ${new Date(s.startTime).toLocaleDateString()}:
    - Pain (Pre): ${s.painIntensity}/10
    - Affected Area: ${formatHeadAreaForAI(s.affectedArea)}
    - Triggers: ${s.triggers.join(', ') || 'N/A'}
    - Duration: ${s.actualDuration} mins
    - Relief (Post): ${s.reliefScore}/10
    - Medication Taken: ${s.medicationTaken ? 'Yes' : 'No'}
    - Notes (Pre-Session): ${s.preSessionNotes || 'N/A'}
    - Notes (Post-Session): ${s.postSessionNotes || 'N/A'}
    `).join('\n\n');
}


export default function RecommendationsPage() {
  const t = useTranslations('RecommendationsPage');
  const [sessionHistory, setSessionHistory] = useState<string>('');
  const [recommendations, setRecommendations] = useState<PersonalizedTherapyRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numSessions, setNumSessions] = useState(0);

  useEffect(() => {
    const sessions = getStoredSessions();
    setNumSessions(sessions.length);
    const formattedHistory = formatSessionHistoryForAI(sessions);
    setSessionHistory(formattedHistory);
  }, []);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    if (numSessions < 3) { 
        setError(t('errorMinSessions'));
        setIsLoading(false);
        return;
    }

    try {
      const result = await personalizedTherapyRecommendation({ sessionHistory });
      setRecommendations(result);
    } catch (e) {
      console.error("AI Recommendation Error:", e);
      setError(t('errorGeneric', { message: (e as Error).message || 'Please try again later.' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Wand2 className="h-6 w-6 text-primary" /> {t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">{t('historySummaryTitle')}</h3>
            <ScrollArea className="h-48 w-full rounded-md border p-3 bg-muted/50">
              <pre className="text-xs whitespace-pre-wrap">{sessionHistory || t('loadingHistory')}</pre>
            </ScrollArea>
            <p className="text-xs text-muted-foreground mt-1">{t('sessionsRecorded', { count: numSessions })}</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('errorTitle')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {recommendations && (
            <Card className="bg-primary/10 border-primary">
              <CardHeader>
                <CardTitle className="text-primary">{t('recommendationsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold">{t('recDuration')}</h4>
                  <p>{recommendations.recommendedDuration}</p>
                </div>
                <div>
                  <h4 className="font-semibold">{t('recTime')}</h4>
                  <p>{recommendations.recommendedTimeOfDay}</p>
                </div>
                <div>
                  <h4 className="font-semibold">{t('recAdjustments')}</h4>
                  <p className="whitespace-pre-wrap">{recommendations.otherAdjustments}</p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">{t('disclaimer')}</p>
              </CardFooter>
            </Card>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGetRecommendations} disabled={isLoading || numSessions < 3} className="w-full">
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('generatingButton')}</>
            ) : (
              t('generateButton')
            )}
          </Button>
        </CardFooter>
      </Card>
       {numSessions < 3 && !recommendations && !isLoading && ( 
         <Alert variant="default" className="border-accent bg-accent/10 text-accent">
            <AlertCircle className="h-4 w-4 text-accent" />
            <AlertTitle>{t('moreDataNeededTitle')}</AlertTitle>
            <AlertDescription>
              {t('moreDataNeededDescription')}
            </AlertDescription>
          </Alert>
      )}
    </div>
  );
}
