
'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Sun, Moon, Bell, Vibrate, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const settingsSchema = z.object({
  defaultSessionLength: z.number().min(5).max(90),
});

type SettingsFormValues = Pick<AppSettings, 'defaultSessionLength'>;

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      defaultSessionLength: 30,
    },
  });

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    const loadedSettings = await getStoredSettings(user?.id);
    if (loadedSettings) {
      form.reset({
        defaultSessionLength: loadedSettings.defaultSessionLength,
      });
      setTheme(loadedSettings.darkMode ? 'dark' : 'light');
    }
    setIsLoading(false);
  }, [form, user, setTheme]);


  useEffect(() => {
    setMounted(true);
    loadSettings();
  }, [loadSettings]);


  const onSubmit = async (data: SettingsFormValues) => {
    const currentSettings = await getStoredSettings(user?.id) || { darkMode: theme === 'dark', notificationTime: "15min_before", vibrationFeedback: true };
    const newSettings: AppSettings = {
      ...currentSettings,
      defaultSessionLength: data.defaultSessionLength,
      darkMode: theme === 'dark',
    };
    await storeSettings(newSettings, user?.id);
    toast({ title: "Settings Saved", description: "Your preferences have been updated." });
  };
  
  const handleThemeChange = async (checked: boolean) => {
      const newTheme = checked ? 'dark' : 'light';
      setTheme(newTheme);
      // Immediately save theme change without waiting for form submission
      const currentSettings = await getStoredSettings(user?.id) || { defaultSessionLength: 30, notificationTime: "15min_before", vibrationFeedback: true };
      const newSettings: AppSettings = {
        ...currentSettings,
        darkMode: newTheme === 'dark',
      };
      await storeSettings(newSettings, user?.id);
  }

  if (!mounted || isLoading) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading settings...</p>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
       <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Application Settings</CardTitle>
            <CardDescription>Customize your Migreen experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="defaultSessionLength">Default Session Length (minutes)</Label>
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

            <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="darkModeToggle" className="flex items-center gap-2 font-medium">
                    {theme === 'dark' ? <Moon/> : <Sun/>}
                    Dark Mode
                </Label>
              <Switch
                id="darkModeToggle"
                checked={theme === 'dark'}
                onCheckedChange={handleThemeChange}
                aria-label="Toggle dark mode"
              />
            </div>
            
            <div className="space-y-2 opacity-50 cursor-not-allowed">
              <Label className="flex items-center gap-2"><Bell/>Notification Time (Conceptual)</Label>
              <Input value="15 minutes before" disabled />
              <p className="text-xs text-muted-foreground">Reminder notifications are a planned feature.</p>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg opacity-50 cursor-not-allowed">
              <Label className="flex items-center gap-2"><Vibrate/>Vibration Feedback (Conceptual)</Label>
              <Switch checked={true} disabled />
            </div>
          </CardContent>
          <CardFooter>
             <Button type="submit" size="lg" className="w-full text-lg py-6">
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

    