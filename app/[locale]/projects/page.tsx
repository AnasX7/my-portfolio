import { getTranslations } from 'next-intl/server'
import Projects from '@/components/home/sections/projects'
import Contact from '@/components/home/sections/contact'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return { title: t('projects.detail.all') }
}

export default async function ProjectsPage() {
  const t = await getTranslations('projects')
  return (
    <main className='main-frame pt-20'>
      <section className='relative isolate overflow-hidden px-6 py-12 text-center sm:px-8 sm:py-16'>
        <div aria-hidden='true' className='hero-pattern pointer-events-none absolute inset-0 -z-10'>
          <div
            className='size-full bg-(--site-layout-line) opacity-60'
            style={{
              maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='none' stroke='white' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
              maskSize: '80px 80px',
            }}
          />
        </div>
        <h1 className='page-title mx-auto max-w-4xl whitespace-pre-line'>{t('introTitle')}</h1>
        <p className='text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty sm:text-lg md:text-xl'>
          {t('introSubtitle')}
        </p>
      </section>
      <Projects titleKey={null} />
      <Contact />
    </main>
  )
}
