'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

// A simple cookie handler
const setCookie = (name: string, value: string, days: number) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

const getCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return null;
  }
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const [currentLocale, setCurrentLocale] = useState('en');

  useEffect(() => {
    const localeFromCookie = getCookie('NEXT_LOCALE') || 'en';
    setCurrentLocale(localeFromCookie);
  }, []);


  const onSelectChange = (value: string) => {
    setCookie('NEXT_LOCALE', value, 365);
    window.location.reload();
  };

  return (
    <Select onValueChange={onSelectChange} value={currentLocale}>
      <SelectTrigger className="w-auto gap-2 border-0 bg-transparent text-foreground/80 shadow-none ring-offset-0 focus:ring-0 focus:ring-offset-0">
        <Globe className="h-5 w-5" />
        <SelectValue placeholder={t('placeholder')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('en')}</SelectItem>
        <SelectItem value="hu">{t('hu')}</SelectItem>
        <SelectItem value="de">{t('de')}</SelectItem>
        <SelectItem value="fr">{t('fr')}</SelectItem>
        <SelectItem value="es">{t('es')}</SelectItem>
        <SelectItem value="pt">{t('pt')}</SelectItem>
        <SelectItem value="zh">{t('zh')}</SelectItem>
        <SelectItem value="ja">{t('ja')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
