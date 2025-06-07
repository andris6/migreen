'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { Settings as AppSettings } from '@/types';
import { getStoredSettings, storeSettings } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const settingsSchema = z.object({
  defaultSessionLength: z.number().min(5).max(90),
  // notificationTime: z.string(), // Conceptual
  // vibrationFeedback: z.boolean(), // Conceptual
});

type SettingsFormValues = Pick<AppSettings, 'defaultSessionLength'>; // Removed vibrationFeedback for now


export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      defaultSessionLength: 30,
      // vibrationFeedback: true, // Default value if used
    },
  });

  useEffect(() => {
    setMounted(true);
    const loadedSettings = getStoredSettings();
    if (loadedSettings) {
      form.reset({
        defaultSessionLength: loadedSettings.defaultSessionLength,
        // vibrationFeedback: loadedSettings.vibrationFeedback,
      });
      // Theme is handled by next-themes, but we could sync if storing in our settings obj
      // setTheme(loadedSettings.darkMode ? 'dark' : 'light');
    }
  }, [form, setTheme]);


  const onSubmit = (data: SettingsFormValues) => {
    const currentSettings = getStoredSettings() || { darkMode: theme === 'dark', notificationTime: "15min_before", vibrationFeedback: true }; // Provide defaults for other settings
    const newSettings: AppSettings = {
      ...currentSettings,
      defaultSessionLength: data.defaultSessionLength,
      // vibrationFeedback: data.vibrationFeedback,
      darkMode: theme === 'dark', // Sync theme from next-themes
    };
    storeSettings(newSettings);
    toast({ title: "Settings Saved", description: "Your preferences have been updated." });
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Application Settings</CardTitle>
          <CardDescription>Customize your Migreen experience.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Default Session Length */}
            <div className="space-y-2">
              <Label htmlFor="defaultSessionLength" className="text-lg">Default Session Length (minutes)</Label>
              <Controller
                name="defaultSessionLength"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="defaultSessionLength"
                    type="number"
                    min="5"
                    max="90"
                    step="5"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value,10))}
                    value={field.value}
                  />
                )}
              />
              {form.formState.errors.defaultSessionLength && (
                <p className="text-sm text-destructive">{form.formState.errors.defaultSessionLength.message}</p>
              )}
            </div>

            {/* Dark Mode Toggle - using next-themes */}
            <div className="flex items-center justify-between space-y-2">
              <Label htmlFor="darkModeToggle" className="text-lg">Dark Mode</Label>
              <Switch
                id="darkModeToggle"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Switch>
            </div>
            
            {/* Conceptual Settings (placeholders) */}
            <div className="space-y-2 opacity-50">
              <Label className="text-lg">Notification Time (Conceptual)</Label>
              <Input value="15 minutes before" disabled />
              <p className="text-xs text-muted-foreground">Reminder notifications are a planned feature.</p>
            </div>

            <div className="flex items-center justify-between space-y-2 opacity-50">
              <Label className="text-lg">Vibration Feedback (Conceptual)</Label>
              <Switch checked={true} disabled />
            </div>


            <Button type="submit" className="w-full text-lg py-3">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
