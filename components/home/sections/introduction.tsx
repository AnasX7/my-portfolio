'use client'

import { TextReveal, TextRevealGroup } from '@/components/ui/text-reveal'
import { useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'
import { Portrait } from '@/components/home/portrait'
import { PortraitJourney } from '@/components/home/portrait-journey'

export default function Introduction() {
  const t = useTranslations()

  return (
    <section
      id='about'
      aria-labelledby='about-heading'
      className='content-section about-introduction scroll-mt-24'
    >
      <div className='section-inner'>
        <div>
          <TextReveal as='h2' id='about-heading' className='section-title mb-6'>
            {t('header.about')}
          </TextReveal>
          <div className='about-intro-grid grid items-start gap-10 lg:gap-14'>
            <TextRevealGroup className='about-intro-copy space-y-7 text-base leading-loose sm:text-lg'>
              {(['first', 'second', 'third'] as const).map((key) => (
                <TextReveal as='p' key={key} className='text-muted-foreground text-pretty'>
                  <strong className='text-foreground font-semibold'>
                    {t(`about.intro.${key}Lead`)}
                  </strong>{' '}
                  {t(`about.intro.${key}`)}
                </TextReveal>
              ))}
            </TextRevealGroup>
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
        </div>
      </div>
      <PortraitJourney />
    </section>
  )
}
