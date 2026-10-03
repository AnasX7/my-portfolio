import { TextReveal } from '@/components/ui/text-reveal'
import { getLocale, getTranslations } from 'next-intl/server'
import { pageMetadata, localizedUrl, serializeJsonLd } from '@/lib/seo'
import { DATA } from '@/data/resume'
import Projects from '@/components/home/sections/projects'
import Contact from '@/components/home/sections/contact'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return pageMetadata({
    locale: await getLocale(),
    path: '/projects',
    title: `${t('projects.detail.all')} | ${t('common.name')}`,
    description: t('seo.projectsDescription'),
  })
}

export default async function ProjectsPage() {
  const t = await getTranslations('projects')
  const locale = await getLocale()
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: t('detail.all'),
            url: localizedUrl('/projects', locale),
            inLanguage: locale,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: DATA.projects.cards.map((project, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: t(project.titleKey.replace('projects.', '')),
                url: localizedUrl(`/projects/${project.id}`, locale),
              })),
            },
          }),
        }}
      />
      <main className='main-frame pt-20'>
        <section className='relative isolate overflow-hidden px-6 py-12 text-center sm:px-8 sm:py-16'>
          <div
            aria-hidden='true'
            className='hero-pattern pointer-events-none absolute inset-0 -z-10'
          >
            <div
              className='size-full bg-(--site-layout-line) opacity-60'
              style={{
                maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='none' stroke='white' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
                maskSize: '80px 80px',
              }}
            />
          </div>
          <TextReveal as='h1' className='page-title mx-auto max-w-4xl whitespace-pre-line'>
            {t('introTitle')}
          </TextReveal>
          <TextReveal
            as='p'
            className='text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg md:text-xl'
          >
            {t('introSubtitle')}
          </TextReveal>
        </section>
        <Projects titleKey={null} imageTransition={false} />
        <Contact />
      </main>
    </>
  )
}
