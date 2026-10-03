import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import * as rootParams from 'next/root-params'
import { notFound } from 'next/navigation'
import { routing } from './routing'

export default getRequestConfig(async () => {
  const locale = await rootParams.locale()
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
