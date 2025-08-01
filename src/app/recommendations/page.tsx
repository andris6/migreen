
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Wand2, AlertCircle, Clock, Calendar, ListChecks, Info } from 'lucide-react';
import { personalizedTherapyRecommendation, type PersonalizedTherapyRecommendationOutput } from '@/ai/flows/personalized-therapy-recommendation';
import { getStoredSessions, type TherapySession } from '@/lib/storage';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [sessionHistory, setSessionHistory] = useState<TherapySession[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedTherapyRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const numSessions = sessionHistory.length;

  const loadSessions = useCallback(async () => {
    setIsLoadingHistory(true);
    const sessions = await getStoredSessions(user?.id);
    setSessionHistory(sessions);
    setIsLoadingHistory(false);
  }, [user]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    if (numSessions < 3) { 
        setError("At least 3 therapy sessions are needed to generate personalized recommendations. Please log more sessions.");
        setIsLoading(false);
        return;
    }

    try {
      const historyString = JSON.stringify(sessionHistory, null, 2);
      const result = await personalizedTherapyRecommendation({ sessionHistory: historyString });
      setRecommendations(result);
    } catch (e) {
      console.error("AI Recommendation Error:", e);
      setError(`Failed to get recommendations. ${(e as Error).message || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-2xl"><Wand2 className="h-8 w-8 text-primary" /> AI Personalized Therapy Insights</CardTitle>
          <CardDescription>Get AI-powered suggestions to optimize your therapy regimen based on your session history.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>How It Works</AlertTitle>
              <AlertDescription>
                Our AI analyzes your recorded session history to identify patterns and provide personalized recommendations. The more sessions you log ({isLoadingHistory ? '...' : numSessions} recorded so far), the more accurate your insights will be. Your session data is sent for analysis when you click the button below.
              </AlertDescription>
            </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {recommendations && (
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Personalized Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full"><Clock className="h-5 w-5 text-primary"/></div>
                    <div>
                        <h4 className="font-semibold">Recommended Duration:</h4>
                        <p className="text-muted-foreground">{recommendations.recommendedDuration}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full"><Calendar className="h-5 w-5 text-primary"/></div>
                    <div>
                        <h4 className="font-semibold">Recommended Time of Day:</h4>
                        <p className="text-muted-foreground">{recommendations.recommendedTimeOfDay}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full"><ListChecks className="h-5 w-5 text-primary"/></div>
                    <div>
                        <h4 className="font-semibold">Other Adjustments:</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{recommendations.otherAdjustments}</p>
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">These are AI-generated suggestions. Always consult with a healthcare professional for medical advice.</p>
              </CardFooter>
            </Card>
          )}
          
          {isLoadingHistory && (
             <div className="flex items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Loading session history...</p>
            </div>
          )}

          {!isLoadingHistory && numSessions < 3 && !recommendations && !isLoading && ( 
            <Alert variant="default" className="border-accent text-accent-dark dark:text-accent-foreground">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertTitle>More Data Needed</AlertTitle>
              <AlertDescription>
                The AI needs at least 3 completed therapy sessions to provide meaningful insights. Keep logging your sessions to unlock personalized recommendations!
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter>
          <Button onClick={handleGetRecommendations} disabled={isLoading || isLoadingHistory || numSessions < 3} className="w-full text-lg py-6" size="lg">
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</>
            ) : (
              "Get AI Recommendations"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

    