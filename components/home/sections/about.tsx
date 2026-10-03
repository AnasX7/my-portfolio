'use client'

import { m } from 'motion/react'
import WorkExperience from '@/components/home/work-experience'
import { SkillItem } from '@/components/home/skill-item'
import Education from '@/components/home/education'
import { useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'
import { aboutViewport, getAboutMotion } from '@/components/home/about-motion'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

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
            <m.h2 variants={motion.heading} className='section-title'>
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
            <m.h2 variants={motion.heading} className='section-title'>
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
              <m.h2 variants={motion.heading} className='section-title'>
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
                        <m.div key={skill.name} variants={motion.skill}>
                          <SkillItem name={skill.name} logo={skill.logo} />
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
