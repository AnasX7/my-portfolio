'use client'

import { useState } from 'react'
import { m } from 'motion/react'
import { cn } from '@/lib/utils'
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

  return (
    <section className='mt-12 flex flex-col gap-12 sm:mt-16 sm:gap-16'>
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

      {/* Skills Section */}
      <div className='mx-auto w-full max-w-2xl px-4 sm:px-6 lg:max-w-6xl'>
        <m.div
          initial='hidden'
          whileInView='show'
          viewport={aboutViewport}
          variants={motion.section}
          className='flex flex-col gap-8'
        >
          {/* Skills Badge List */}
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
        </m.div>
      </div>
    </section>
  )
}
