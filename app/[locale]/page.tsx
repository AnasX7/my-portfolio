import { Spotlight } from '@/components/ui/spotlight'
import HeroSection from '@/components/home/sections/hero'
// import TechLogosSection from '@/components/home/sections/tech-logos'
import AboutSection from '@/components/home/sections/about'
import ProjectSection from '@/components/home/sections/projects'
import ContactSection from '@/components/home/sections/contact'
// import CurvedLoop from '@/components/ui/curved-loop'

export default function Home() {
  return (
    <>
      <Spotlight />
      <HeroSection />
      <div className='relative'>
        {/* <div dir='ltr' className='absolute w-full bottom-40 sm:bottom-0'>
          <CurvedLoop
            marqueeText='Powered ✦ By ✦ Modern ✦ Technologies ✦ Nextjs ✦ Recat ✦ Expo ✦ Tailwind ✦ Typescript ✦ Javascript ✦ HTML ✦ CSS ✦ Nodejs ✦ Express ✦ Prisma ✦ Laravel ✦ Git ✦ Github✦ Docker ✦ Figma ✦'
            speed={1}
            curveAmount={400}
            direction='right'
            interactive={true}
          />
        </div> */}
      </div>
      {/* <TechLogosSection /> */}
      <AboutSection />
      <ProjectSection />
      <ContactSection />
    </>
  )
}
