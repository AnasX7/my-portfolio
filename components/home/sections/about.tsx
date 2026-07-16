'use client'

import { useState } from 'react'
import { m, useMotionValue, useTransform, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'
import { AnimatedSpan, Terminal, TypingAnimation } from '@/components/ui/terminal'
import WorkExperience from '@/components/home/work-experience'
import Education from '@/components/home/education'
import { useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'
import { aboutViewport, getAboutMotion } from '@/components/home/about-motion'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

interface SkillLogoProps {
  name: string
  url: string
  fallbackChar: string
}

const SkillLogo = ({ name, url, fallbackChar }: SkillLogoProps) => {
  const [error, setError] = useState(false)

  const shouldInvert = ['Next.js', 'Expo', 'Prisma', 'GitHub'].includes(name)

  return (
    <div className='relative flex size-5 shrink-0 items-center justify-center select-none'>
      {error ? (
        <span className='text-[10px] font-bold uppercase'>{fallbackChar}</span>
      ) : (
        <img
          src={url}
          alt={name}
          onError={() => setError(true)}
          className={cn(
            'size-5 object-contain pointer-events-none select-none',
            shouldInvert && 'dark:brightness-0 dark:invert',
          )}
        />
      )}
    </div>
  )
}

export default function About() {
  const t = useTranslations()
  const reduceMotion = useHydratedReducedMotion()
  const motion = getAboutMotion(Boolean(reduceMotion))

  // 3D Parallax Tilt state
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Use springs to smooth out coordinate transformations
  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })

  // Transform cursor offsets into 3D degrees of rotation
  const rotateX = useTransform(springY, [-150, 150], [12, -12])
  const rotateY = useTransform(springX, [-150, 150], [-12, 12])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    // Coordinates relative to card center
    const mouseX = e.clientX - rect.left - width / 2
    const mouseY = e.clientY - rect.top - height / 2
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <section className='mt-12 flex flex-col gap-12 sm:mt-16 sm:gap-16'>
      {/* Skills Section */}
      <div className='mx-auto w-full max-w-2xl px-4 sm:px-6 lg:max-w-6xl'>
        <m.div
          initial='hidden'
          whileInView='show'
          viewport={aboutViewport}
          variants={motion.section}
          className='grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12'
        >
          {/* Left Side: Skills Badge List */}
          <m.div variants={motion.section} className='flex flex-col gap-6'>
            <m.h2
              variants={motion.heading}
              className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'
            >
              {t(DATA.about.card4.titleKey)}
            </m.h2>
            <m.div variants={motion.list} className='flex flex-wrap gap-3'>
              {DATA.about.card4.skills.map((skill) => {
                const fallbackChar = skill.name.charAt(0)
                return (
                  <m.div
                    key={skill.name}
                    variants={motion.skill}
                    whileHover={reduceMotion ? undefined : { y: -3, scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                    className={cn(
                      'border-black/10 bg-black/[0.02] flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-medium text-foreground backdrop-blur-xs select-none transition-all duration-300 dark:border-white/10 dark:bg-white/5 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] hover:border-black/20 dark:hover:border-white/20',
                    )}
                  >
                    <SkillLogo name={skill.name} url={skill.logo} fallbackChar={fallbackChar} />
                    <span>{skill.name}</span>
                  </m.div>
                )
              })}
            </m.div>
          </m.div>

          {/* Right Side: Interactive 3D Parallax holographic terminal */}
          <m.div
            variants={motion.item}
            className='relative flex aspect-square w-full items-center justify-center p-4 lg:aspect-4/3 lg:justify-end lg:pr-0'
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1000 }}
          >
            <m.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className='relative flex h-full w-full max-w-[460px] items-center justify-center rounded-2xl select-none'
            >
              {/* Floating Radial Background Gradient */}
              <div className='absolute inset-0 -z-10 opacity-0 blur-2xl [background:radial-gradient(circle_at_center,rgba(245,240,225,0.12)_0%,transparent_70%)] dark:opacity-100'></div>

              {/* Improved Holographic Terminal with depth transform */}
              <m.div
                style={{ transform: 'translateZ(30px)' }}
                className='w-full pr-4 pl-4 lg:pr-0 lg:pl-4'
              >
                <Terminal className='w-full rounded-xl border p-5 shadow-2xl'>
                  {(start) => (
                    <>
                      <TypingAnimation start={start}>&gt; npx anas@latest skills</TypingAnimation>

                      {DATA.about.card4.terminalSkills.map((skill) => (
                        <AnimatedSpan
                          key={skill.name}
                          delay={skill.delay}
                          className='font-medium text-emerald-500 dark:text-emerald-400'
                          start={start}
                        >
                          <span>✔ {skill.name}</span>
                        </AnimatedSpan>
                      ))}
                    </>
                  )}
                </Terminal>
              </m.div>
            </m.div>
          </m.div>
        </m.div>
      </div>

      {/* Work Experience Section */}
      <div className='mx-auto w-full max-w-2xl px-4 sm:px-6 lg:max-w-6xl'>
        <m.div
          initial='hidden'
          whileInView='show'
          viewport={aboutViewport}
          variants={motion.section}
          className='flex flex-col gap-6'
        >
          <m.h2
            variants={motion.heading}
            className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'
          >
            {t('about.card3.title')}
          </m.h2>
          <WorkExperience />
        </m.div>
      </div>

      {/* Education Section */}
      <div className='mx-auto w-full max-w-2xl px-4 sm:px-6 lg:max-w-6xl'>
        <m.div
          initial='hidden'
          whileInView='show'
          viewport={aboutViewport}
          variants={motion.section}
          className='flex flex-col gap-6'
        >
          <m.h2
            variants={motion.heading}
            className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'
          >
            {t('about.card5.title')}
          </m.h2>
          <Education />
        </m.div>
      </div>
    </section>
  )
}
