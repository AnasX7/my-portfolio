'use client'

import { useState } from 'react'
import { m } from 'motion/react'
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
  const shouldInvert = [
    'Next.js',
    'Expo',
    'Prisma',
    'Vercel',
    'Railway',
    'GitHub',
    'Better Auth',
    'shadcn/ui',
    'Codex',
  ].includes(name)

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center select-none ${
        name === 'Motion' ? 'h-4 w-8' : name === 'Figma' ? 'size-5' : 'size-4'
      }`}
    >
      {name === 'Motion' ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1260 454'
          fill='currentColor'
          aria-hidden='true'
          className='size-full text-foreground/75'
        >
          <path d='M475.753 0L226.8 453.6L0 453.6L194.392 99.4116C224.526 44.5081 299.724 0 362.353 0L475.753 0Z' />
          <path d='M1031.93 113.4C1031.93 50.7709 1082.7 0 1145.33 0C1207.96 0 1258.73 50.7709 1258.73 113.4C1258.73 176.029 1207.96 226.8 1145.33 226.8C1082.7 226.8 1031.93 176.029 1031.93 113.4Z' />
          <path d='M518.278 0L745.078 0L496.125 453.6L269.325 453.6L518.278 0Z' />
          <path d='M786.147 0L1012.95 0L818.555 354.188C788.422 409.092 713.223 453.6 650.594 453.6L537.194 453.6L786.147 0Z' />
        </svg>
      ) : error || !url ? (
        <span aria-hidden='true' className='text-muted-foreground text-xs font-medium uppercase'>
          {fallbackChar}
        </span>
      ) : (
        <img
          src={url}
          alt=''
          aria-hidden='true'
          onError={() => setError(true)}
          className={`pointer-events-none size-full object-contain select-none ${
            shouldInvert ? 'dark:brightness-0 dark:invert' : ''
          }`}
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
    <>
      {/* Work Experience Section */}
      <section className='mt-12 sm:mt-16'>
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
      </section>

      {/* Education Section */}
      <section className='mt-12 sm:mt-16'>
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

      {/* Skills Section */}
      <section className='mt-12 sm:mt-16'>
        <div className='mx-auto w-full max-w-2xl px-4 sm:px-6 lg:max-w-6xl'>
          <m.div
            initial='hidden'
            whileInView='show'
            viewport={aboutViewport}
            variants={motion.section}
            className='flex flex-col gap-7'
          >
            <m.div variants={motion.section} className='flex flex-col gap-6'>
              <m.h2
                variants={motion.heading}
                className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'
              >
                {t(DATA.about.card4.titleKey)}
              </m.h2>
              <m.div variants={motion.list} className='grid gap-y-6 sm:gap-y-8'>
                {DATA.about.card4.skillGroups.map((group) => (
                  <m.div
                    key={group.id}
                    variants={motion.section}
                    className='grid grid-cols-1 gap-y-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-8 sm:gap-y-0 lg:grid-cols-[13rem_minmax(0,1fr)]'
                  >
                    <m.h3
                      variants={motion.heading}
                      className='text-muted-foreground text-base font-normal sm:text-lg'
                    >
                      {t(group.titleKey)}
                    </m.h3>
                    <m.div
                      variants={motion.list}
                      className='flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3'
                    >
                      {group.skills.map((skill) => (
                        <m.div
                          key={skill.name}
                          variants={motion.skill}
                          className='text-foreground/75 flex shrink-0 items-center gap-2 text-sm leading-tight whitespace-nowrap sm:text-base'
                        >
                          <SkillLogo
                            name={skill.name}
                            url={skill.logo}
                            fallbackChar={skill.name.charAt(0)}
                          />
                          <span>{skill.name}</span>
                        </m.div>
                      ))}
                    </m.div>
                  </m.div>
                ))}
              </m.div>
            </m.div>
          </m.div>
        </div>
      </section>
    </>
  )
}
