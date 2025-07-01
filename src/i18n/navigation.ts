
import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import {locales, localePrefix} from './routing';

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    localePrefix
  });
