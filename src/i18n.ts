import {getRequestConfig} from 'next-intl/server';
 
// This function is temporarily simplified to use a static locale.
// This helps to isolate and resolve a persistent build-time configuration issue.
export default getRequestConfig(async () => {
  const locale = 'en';
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
