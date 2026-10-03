import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en',

  localePrefix: 'always',
  // Each public URL has one language, independent of cookies and browser preferences.
  localeDetection: false,
})
