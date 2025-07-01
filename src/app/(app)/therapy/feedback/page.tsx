'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { PreSessionData, TherapySession } from '@/types';
import { storeSession } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

const formSchema = z.object({
  reliefScore: z.number().min(0).max(10),
  medicationTaken: z.boolean(),
  notes: z.string().max(500, "Notes must be 500 characters or less.").optional(),
});

type PostSessionFormValues = z.infer<typeof formSchema>;

export default function FeedbackPage() {
  const t = useTranslations('FeedbackPage');
  const router = useRouter();
  const { toast } = useToast();
  const [preSessionData, setPreSessionData] = useState<PreSessionData | null>(null);
  const [actualDuration, setActualDuration] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null);

  const form = useForm<PostSessionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reliefScore: 0,
      medicationTaken: false,
      notes: '',
    },
  });

  useEffect(() => {
    const storedPreData = sessionStorage.getItem('preSessionData');
    const storedActualDuration = sessionStorage.getItem('actualDuration');
    const storedStartTime = sessionStorage.getItem('sessionStartTime');

    if (storedPreData && storedActualDuration && storedStartTime) {
      setPreSessionData(JSON.parse(storedPreData) as PreSessionData);
      setActualDuration(parseInt(storedActualDuration, 10));
      setSessionStartTime(storedStartTime);
    } else {
      toast({ title: t('errorTitle'), description: t('errorMissingData'), variant: "destructive" });
      router.replace('/therapy/start');
    }
  }, [router, toast, t]);

  const onSubmit = (data: PostSessionFormValues) => {
    if (!preSessionData || actualDuration === null || sessionStartTime === null) {
      toast({ title: t('errorTitle'), description: t('errorSave'), variant: "destructive" });
      return;
    }

    const therapySession: TherapySession = {
      ...preSessionData,
      reliefScore: data.reliefScore,
      medicationTaken: data.medicationTaken,
      postSessionNotes: data.notes,
      id: new Date().toISOString() + Math.random().toString(36).substring(2,9),
      startTime: sessionStartTime,
      actualDuration: actualDuration,
      endTime: new Date().toISOString(),
    };

    storeSession(therapySession);
    toast({ title: t('saveToastTitle'), description: t('saveToastDescription') });

    sessionStorage.removeItem('preSessionData');
    sessionStorage.removeItem('actualDuration');
    sessionStorage.removeItem('sessionStartTime');
    
    router.push('/history');
  };

  if (!preSessionData || actualDuration === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('title')}</CardTitle>
          <CardDescription>{t('description', { duration: actualDuration })}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="reliefScore" className="text-lg">{t('reliefScoreLabel', { score: form.watch('reliefScore') })}</Label>
              <Controller
                name="reliefScore"
                control={form.control}
                render={({ field }) => (
                  <Slider
                    id="reliefScore"
                    min={0}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    aria-label={t('reliefScoreSr')}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between space-y-2">
              <Label htmlFor="medicationTaken" className="text-lg">{t('medsLabel')}</Label>
              <Controller
                name="medicationTaken"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    id="medicationTaken"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label={t('medsSr')}
                  />
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-lg">{t('notesLabel')}</Label>
              <Controller
                name="notes"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    id="notes"
                    placeholder={t('notesPlaceholder')}
                    {...field}
                    className="min-h-[100px]"
                  />
                )}
              />
              {form.formState.errors.notes && (
                <p className="text-sm text-destructive">{form.formState.errors.notes.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full text-lg py-6">
              {t('saveButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
