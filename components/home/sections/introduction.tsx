'use client'

import { m } from 'motion/react'
import { useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'
import { Portrait } from '@/components/home/portrait'
import { PortraitJourney } from '@/components/home/portrait-journey'
import { aboutViewport, getAboutMotion } from '@/components/home/about-motion'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

export default function Introduction() {
  const t = useTranslations()
  const motion = getAboutMotion(useHydratedReducedMotion())

  return (
    <section id='about' aria-labelledby='about-heading' className='about-introduction scroll-mt-24'>
      <div className='mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10'>
        <m.div
          initial='hidden'
          whileInView='show'
          viewport={aboutViewport}
          variants={motion.section}
        >
          <m.h2 id='about-heading' variants={motion.heading} className='section-title mb-6'>
            {t('header.about')}
          </m.h2>
          <div className='about-intro-grid grid items-start gap-10 lg:gap-14'>
            <div className='about-intro-copy space-y-7 text-base leading-loose sm:text-lg'>
              {(['first', 'second', 'third'] as const).map((key) => (
                <m.p
                  key={key}
                  variants={motion.heading}
                  className='text-muted-foreground text-pretty'
                >
                  <strong className='text-foreground font-semibold'>
                    {t(`about.intro.${key}Lead`)}
                  </strong>{' '}
                  {t(`about.intro.${key}`)}
                </m.p>
              ))}
            </div>
            <div className='about-intro-photo mx-auto w-full max-w-[420px]'>
              <div data-portrait-destination className='relative aspect-square w-full'>
                <div data-portrait-resting className='absolute inset-0'>
                  <Portrait about />
                </div>
                <nav
                  aria-label={t('socialMenu.open')}
                  className='portrait-socials absolute right-5 bottom-5 left-5 flex justify-end gap-2'
                  dir='ltr'
                >
                  {DATA.socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      aria-label={social.name}
                      target={social.url.startsWith('https:') ? '_blank' : undefined}
                      rel={social.url.startsWith('https:') ? 'noopener noreferrer' : undefined}
                      className='flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md transition-[background-color,transform] duration-200 [corner-shape:round] hover:-translate-y-1 hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
                    >
                      <social.icon className='size-4' aria-hidden='true' />
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </m.div>
      </div>
      <PortraitJourney />
    </section>
  )
}
