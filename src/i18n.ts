
import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';
import {notFound} from 'next/navigation';

const locales = ['en', 'hu', 'de', 'fr', 'es', 'pt', 'zh', 'ja'];

export default getRequestConfig(async () => {
  // Read the locale from the cookie.
  const locale = cookies().get('NEXT_LOCALE')?.value || 'en';

  // Validate that the locale is supported.
  if (!locales.includes(locale)) {
    notFound();
  }

  return {
    locale,
    // Load the messages for the selected locale.
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
