import { getLocale, getTranslations } from 'next-intl/server'
import HeroSection from '@/components/home/sections/hero'
import Introduction from '@/components/home/sections/introduction'
import AboutSection from '@/components/home/sections/about'
import ProjectSection from '@/components/home/sections/projects'
import ContactSection from '@/components/home/sections/contact'
import { DATA } from '@/data/resume'
import { SITE_URL } from '@/lib/constants'
import { localizedUrl, serializeJsonLd } from '@/lib/seo'
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
    '@id': `${SITE_URL}/#person`,
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

  return serializeJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      jsonLd,
      {
        '@type': 'ProfilePage',
        url: localizedUrl('/', locale),
        inLanguage: locale,
        name: locale === 'ar' ? 'ملف أنس سالم' : 'Anas Salem Portfolio',
        mainEntity: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Anas Salem',
        inLanguage: ['en', 'ar'],
        author: { '@id': `${SITE_URL}/#person` },
      },
    ],
  })
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
