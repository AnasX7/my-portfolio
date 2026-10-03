import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/constants'
import { getPathname } from '@/i18n/navigation'

export function localizedUrl(path: string, locale: string) {
  return new URL(getPathname({ locale, href: path }), SITE_URL).href
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image = {
    url: `/images/og/${locale === 'ar' ? 'ar' : 'en'}.jpg`,
    width: 1200,
    height: 630,
    alt: locale === 'ar' ? 'أنس سالم — مهندس برمجيات' : 'Anas Salem — Software Engineer',
  },
}: {
  locale: string
  path: string
  title: string
  description: string
  image?: { url: string; alt: string; width?: number; height?: number }
}): Metadata {
  const url = localizedUrl(path, locale)
  const socialImage = { ...image, url: new URL(image.url, SITE_URL).href }
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Anas Salem',
      locale: locale === 'ar' ? 'ar_AE' : 'en_US',
      alternateLocale: [locale === 'ar' ? 'en_US' : 'ar_AE'],
      images: [socialImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [socialImage] },
  }
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function projectBreadcrumbs(locale: string, title: string, slug: string) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'ar' ? 'الرئيسية' : 'Home',
        item: localizedUrl('/', locale),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'ar' ? 'المشاريع' : 'Projects',
        item: localizedUrl('/projects', locale),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: localizedUrl(`/projects/${slug}`, locale),
      },
    ],
  }
}
