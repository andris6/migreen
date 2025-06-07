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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { HeadDiagram } from '@/components/therapy/HeadDiagram';
import type { HeadArea, PreSessionData } from '@/types';
import { availableTriggers } from '@/types';
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  painIntensity: z.number().min(0).max(10),
  affectedAreas: z.array(z.string()).min(0, "Please select at least one affected area if pain intensity > 0."),
  triggers: z.array(z.string()).optional(),
  notes: z.string().max(500, "Notes must be 500 characters or less.").optional(),
  sessionDuration: z.number().min(5).max(90),
});

type PreSessionFormValues = z.infer<typeof formSchema>;

export default function StartTherapyPage() {
  const router = useRouter();
  const [recommendedDuration, setRecommendedDuration] = useState(30); // Default
  
  const form = useForm<PreSessionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      painIntensity: 0,
      affectedAreas: [],
      triggers: [],
      notes: '',
      sessionDuration: 30,
    },
  });

  const painIntensity = form.watch('painIntensity');

  useEffect(() => {
    let newDuration = 20; // Default for pain 0-3
    if (painIntensity >= 7) {
      newDuration = 60; // For pain 7-10, default to 60 (user can select up to 90)
    } else if (painIntensity >= 4) {
      newDuration = 45; // For pain 4-6
    }
    setRecommendedDuration(newDuration);
    form.setValue('sessionDuration', newDuration);
  }, [painIntensity, form]);
  
  useEffect(() => {
    // If pain is 0, clear affected areas validation requirement, or ensure it's empty.
    // This specific zod schema handles it by min(0), but for complex logic, this is where it would go.
    if (painIntensity === 0) {
        form.setValue('affectedAreas', []);
        // Potentially clear errors for affectedAreas if pain is 0
        // form.clearErrors('affectedAreas'); 
    }
  }, [painIntensity, form]);


  const onSubmit = (data: PreSessionFormValues) => {
    const preSessionDetails: PreSessionData = {
      painIntensity: data.painIntensity,
      affectedAreas: data.affectedAreas as HeadArea[],
      triggers: data.triggers || [],
      notes: data.notes,
      recommendedDuration: data.sessionDuration, // This is now user-confirmed/adjusted duration
    };
    // Store in session storage to pass to the therapy session page
    sessionStorage.setItem('preSessionData', JSON.stringify(preSessionDetails));
    router.push('/therapy/session');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Start New Therapy Session</CardTitle>
          <CardDescription>Log your current symptoms to tailor your session.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Pain Intensity */}
            <div className="space-y-2">
              <Label htmlFor="painIntensity" className="text-lg">Pain Intensity: {form.getValues('painIntensity')}/10</Label>
              <Controller
                name="painIntensity"
                control={form.control}
                render={({ field }) => (
                  <Slider
                    id="painIntensity"
                    min={0}
                    max={10}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    aria-label="Pain intensity slider"
                  />
                )}
              />
            </div>

            {/* Affected Head Areas */}
            {painIntensity > 0 && (
              <div className="space-y-2">
                <Label className="text-lg">Affected Head Areas</Label>
                 <Controller
                    name="affectedAreas"
                    control={form.control}
                    render={({ field }) => (
                        <HeadDiagram
                        selectedAreas={field.value as HeadArea[]}
                        onChange={field.onChange}
                        />
                    )}
                    />
                {form.formState.errors.affectedAreas && (
                  <p className="text-sm text-destructive">{form.formState.errors.affectedAreas.message}</p>
                )}
              </div>
            )}

            {/* Potential Triggers */}
            <div className="space-y-2">
              <Label className="text-lg">Potential Triggers</Label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {availableTriggers.map((trigger) => (
                  <Controller
                    key={trigger.id}
                    name="triggers"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`trigger-${trigger.id}`}
                          checked={field.value?.includes(trigger.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), trigger.id])
                              : field.onChange((field.value || []).filter((id) => id !== trigger.id));
                          }}
                        />
                        <Label htmlFor={`trigger-${trigger.id}`} className="font-normal">{trigger.name}</Label>
                      </div>
                    )}
                  />
                ))}
              </div>
            </div>
            
            {/* Session Duration Recommendation */}
            <div className="space-y-2">
                <Label htmlFor="sessionDuration" className="text-lg">Session Duration: {form.watch('sessionDuration')} minutes</Label>
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Recommended Duration</AlertTitle>
                    <AlertDescription>
                        Based on your pain level, we recommend a {recommendedDuration}-minute session. You can adjust this below. Max: 90 minutes.
                    </AlertDescription>
                </Alert>
                <Controller
                    name="sessionDuration"
                    control={form.control}
                    render={({ field }) => (
                        <Slider
                        id="sessionDuration"
                        min={5} // Minimum session 5 mins
                        max={90} // Max session 90 mins
                        step={5}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        aria-label="Session duration slider"
                        />
                    )}
                />
            </div>

            {/* Optional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-lg">Optional Notes</Label>
              <Controller
                name="notes"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    id="notes"
                    placeholder="Any additional details, e.g., specific food eaten, activities..."
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
              Start Therapy Session
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
