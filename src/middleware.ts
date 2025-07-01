
import createMiddleware from 'next-intl/middleware';
 
// A list of all locales that are supported
const locales = ['en', 'hu', 'de', 'fr', 'es', 'pt', 'zh', 'ja'];
 
export default createMiddleware({
  locales,
  // Used when no locale matches
  defaultLocale: 'en',

  // Don't add a locale prefix to the URL
  localePrefix: 'never'
});
 
export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
