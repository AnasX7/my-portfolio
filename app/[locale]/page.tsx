import { Spotlight } from '@/components/ui/spotlight'
import { PageBackground } from '@/components/home/page-background'
import HeroSection from '@/components/home/sections/hero'
import TechLogosSection from '@/components/home/sections/tech-logos'
import AboutSection from '@/components/home/sections/about'
import ProjectSection from '@/components/home/sections/projects'
import ContactSection from '@/components/home/sections/contact'

export default function Home() {
  return (
    <>
      <Spotlight />
      <PageBackground />
      <HeroSection />
      <TechLogosSection />
      <AboutSection />
      <ProjectSection />
      <ContactSection />
    </>
  )
}
