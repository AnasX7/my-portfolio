import dynamic from 'next/dynamic'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Spotlight } from '@/components/ui/spotlight'
import HeroSection from '@/components/home/sections/hero'
import { DATA } from '@/data/resume'
import { SITE_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const LogoCloudSection = dynamic(() => import('@/components/home/sections/logos'))
const WhoAmISection = dynamic(() => import('@/components/home/who-am-i'))
const AboutSection = dynamic(() => import('@/components/home/sections/about'))
const ProjectSection = dynamic(() => import('@/components/home/sections/projects'))
const ContactSection = dynamic(() => import('@/components/home/sections/contact'))

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })

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
    image: `${SITE_URL}/avatar-1.jpg`,
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

export default async function Home({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'seo' })
  const personJsonLd = getPersonJsonLd(locale, t('description'))

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: personJsonLd }} />
      <Spotlight />
      <HeroSection />
      <LogoCloudSection />
      <WhoAmISection />
      <AboutSection />
      <ProjectSection />
      <ContactSection />
    </>
  )
}
