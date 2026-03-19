import dynamic from 'next/dynamic'
import { setRequestLocale } from 'next-intl/server'
import { Spotlight } from '@/components/ui/spotlight'
import HeroSection from '@/components/home/sections/hero'

const LogoCloudSection = dynamic(() => import('@/components/home/sections/logos'))
const AboutSection = dynamic(() => import('@/components/home/sections/about'))
const ProjectSection = dynamic(() => import('@/components/home/sections/projects'))
const ContactSection = dynamic(() => import('@/components/home/sections/contact'))

type Props = {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Spotlight />
      <HeroSection />
      <LogoCloudSection />
      <AboutSection />
      <ProjectSection />
      <ContactSection />
    </>
  )
}
