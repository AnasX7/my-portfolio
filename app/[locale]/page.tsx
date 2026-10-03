import { getLocale, getTranslations } from 'next-intl/server'
import HeroSection from '@/components/home/sections/hero'
import Introduction from '@/components/home/sections/introduction'
import AboutSection from '@/components/home/sections/about'
import ProjectSection from '@/components/home/sections/projects'
import ContactSection from '@/components/home/sections/contact'
import { DATA } from '@/data/resume'
import { SITE_URL } from '@/lib/constants'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('seo')

  return {
    title: t('title'),
    description: t('description'),
  }
}

function getPersonJsonLd(locale: string, description: string) {
  const githubUrl = DATA.socials.find((s) => s.name === 'GitHub')?.url
  const linkedInUrl = DATA.socials.find((s) => s.name === 'LinkedIn')?.url

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Anas Salem',
    url: SITE_URL,
    image: `${SITE_URL}/avatar-light.jpg`,
    jobTitle: locale === 'ar' ? 'مهندس برمجيات' : 'Software Engineer',
    description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: locale === 'ar' ? 'أبوظبي' : 'Abu Dhabi',
      addressCountry: 'AE',
    },
    sameAs: [githubUrl, linkedInUrl].filter(Boolean),
  }

  // Escape < as \u003c to prevent closing the script tag from translated content
  return JSON.stringify(jsonLd).replace(/</g, '\\u003c')
}

export default async function Home() {
  const locale = await getLocale()
  const t = await getTranslations('seo')
  const personJsonLd = getPersonJsonLd(locale, t('description'))

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      <main className='main-frame'>
        <HeroSection />
        <Introduction />
        <AboutSection />
        <ProjectSection limit={6} showMoreLink />
        <ContactSection />
      </main>
    </>
  )
}
