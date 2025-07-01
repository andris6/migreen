
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
import { Sun, Moon, Bell, Vibrate } from 'lucide-react';
import { useTranslations } from 'next-intl';

const settingsSchema = z.object({
  defaultSessionLength: z.number().min(5).max(90),
});

type SettingsFormValues = Pick<AppSettings, 'defaultSessionLength'>;

export default function SettingsPage() {
  const t = useTranslations('SettingsPage');
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      defaultSessionLength: 30,
    },
  });

  useEffect(() => {
    setMounted(true);
    const loadedSettings = getStoredSettings();
    if (loadedSettings) {
      form.reset({
        defaultSessionLength: loadedSettings.defaultSessionLength,
      });
    }
  }, [form]);


  const onSubmit = (data: SettingsFormValues) => {
    const currentSettings = getStoredSettings() || { darkMode: theme === 'dark', notificationTime: "15min_before", vibrationFeedback: true };
    const newSettings: AppSettings = {
      ...currentSettings,
      defaultSessionLength: data.defaultSessionLength,
      darkMode: theme === 'dark',
    };
    storeSettings(newSettings);
    toast({ title: t('saveToastTitle'), description: t('saveToastDescription') });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
       <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="defaultSessionLength">{t('sessionLengthLabel')}</Label>
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
                    {t('darkModeLabel')}
                </Label>
              <Switch
                id="darkModeToggle"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                aria-label={t('darkModeSr')}
              />
            </div>
            
            <div className="space-y-2 opacity-50 cursor-not-allowed">
              <Label className="flex items-center gap-2"><Bell/>{t('notificationLabel')}</Label>
              <Input value={t('notificationPlaceholder')} disabled />
              <p className="text-xs text-muted-foreground">{t('notificationDescription')}</p>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg opacity-50 cursor-not-allowed">
              <Label className="flex items-center gap-2"><Vibrate/>{t('vibrationLabel')}</Label>
              <Switch checked={true} disabled />
            </div>
          </CardContent>
          <CardFooter>
             <Button type="submit" size="lg" className="w-full text-lg py-6">
              {t('saveButton')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
