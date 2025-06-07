
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { HeadArea, PreSessionData } from '@/types';
import { availableTriggers, availableHeadAreas } from '@/types';
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  painIntensity: z.number().min(0).max(10),
  affectedArea: z.string().optional(), // Changed from array
  triggers: z.array(z.string()).optional(),
  notes: z.string().max(500, "Notes must be 500 characters or less.").optional(),
  sessionDuration: z.number().min(5).max(90),
}).refine(data => {
  if (data.painIntensity > 0 && !data.affectedArea) {
    return false;
  }
  return true;
}, {
  message: "Please select an affected area if pain intensity is greater than 0.",
  path: ["affectedArea"],
});

type PreSessionFormValues = z.infer<typeof formSchema>;

export default function StartTherapyPage() {
  const router = useRouter();
  const [recommendedDuration, setRecommendedDuration] = useState(30); // Default
  
  const form = useForm<PreSessionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      painIntensity: 0,
      affectedArea: undefined,
      triggers: [],
      notes: '',
      sessionDuration: 30,
    },
  });

  const painIntensity = form.watch('painIntensity');

  useEffect(() => {
    let newDuration = 20; // Default for pain 0-3
    if (painIntensity >= 7) {
      newDuration = 60;
    } else if (painIntensity >= 4) {
      newDuration = 45;
    }
    setRecommendedDuration(newDuration);
    form.setValue('sessionDuration', newDuration);
    if (painIntensity === 0) {
        form.setValue('affectedArea', 'none'); // Default to 'none' if no pain
    } else if (painIntensity > 0 && form.getValues('affectedArea') === 'none') {
        form.setValue('affectedArea', undefined); // Clear 'none' if pain is present
    }

  }, [painIntensity, form]);
  
  const onSubmit = (data: PreSessionFormValues) => {
    const preSessionDetails: PreSessionData = {
      painIntensity: data.painIntensity,
      affectedArea: data.affectedArea as HeadArea | undefined,
      triggers: data.triggers || [],
      preSessionNotes: data.notes,
      recommendedDuration: data.sessionDuration,
    };
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
              <Label htmlFor="painIntensity" className="text-lg">Pain Intensity: {form.watch('painIntensity')}/10</Label>
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

            {/* Affected Head Areas with Radio Buttons */}
            {painIntensity > 0 && (
              <div className="space-y-2">
                <Label className="text-lg">Affected Head Area</Label>
                <Controller
                  name="affectedArea"
                  control={form.control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3"
                    >
                      {availableHeadAreas.filter(area => area.id !== 'none').map((area) => (
                        <div key={area.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={area.id} id={`area-${area.id}`} />
                          <Label htmlFor={`area-${area.id}`} className="font-normal">{area.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
                {form.formState.errors.affectedArea && (
                  <p className="text-sm text-destructive">{form.formState.errors.affectedArea.message}</p>
                )}
              </div>
            )}

            {/* Potential Triggers */}
            <div className="space-y-2">
              <Label className="text-lg">Potential Triggers</Label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
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
                        min={5} 
                        max={90} 
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
              <Label htmlFor="notes" className="text-lg">Optional Pre-Session Notes</Label>
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
