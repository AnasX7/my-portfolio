import { Spotlight } from '@/components/ui/spotlight'
import HeroSection from '@/components/home/sections/hero'
import AboutSection from '@/components/home/sections/about'
import ProjectSection from '@/components/home/sections/projects'
import ContactSection from '@/components/home/sections/contact'
import LogoCloudSection from '@/components/home/sections/logos'

export default function Home() {
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
