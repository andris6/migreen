import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';

// A list of all locales that are supported
const locales = ['en', 'hu', 'de', 'fr', 'es', 'pt', 'zh', 'ja'];

export default getRequestConfig(async () => {
  // Read the locale from the cookie
  const locale = cookies().get('NEXT_LOCALE')?.value || 'en';

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
