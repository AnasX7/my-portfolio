import type { MetadataRoute } from 'next'
import { DATA } from '@/data/resume'
import { routing } from '@/i18n/routing'
import { localizedUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/projects',
    '/privacy',
    ...DATA.projects.cards.map((project) => `/projects/${project.id}`),
  ]
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(path, locale),
    })),
  )
}
