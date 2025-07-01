
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';

export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (value: string) => {
    router.replace(pathname, {locale: value});
  };

  return (
    <Select onValueChange={onSelectChange} value={locale}>
      <SelectTrigger className="w-auto gap-2 border-0 bg-transparent text-foreground/80 shadow-none ring-offset-0 focus:ring-0 focus:ring-offset-0">
        <Globe className="h-5 w-5" />
        <SelectValue placeholder={t('placeholder')} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>{t(loc)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
