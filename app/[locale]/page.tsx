import { Spotlight } from '@/components/ui/spotlight'
import { PageBackground } from '@/components/home/page-background'
import HeroSection from '@/components/home/hero'
import TechLogosSection from '@/components/home/TechLogos'
import AboutSection from '@/components/home/about'

export default function Home() {
  return (
    <>
      <Spotlight />
      <PageBackground />
      <HeroSection />
      <TechLogosSection />
      <AboutSection />
    </>
  )
}
