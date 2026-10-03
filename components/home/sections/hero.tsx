'use client'

import { TextReveal } from '@/components/ui/text-reveal'
import { useTranslations } from 'next-intl'
import { m } from 'motion/react'
import { Portrait } from '@/components/home/portrait'
import { Download01Icon } from '@hugeicons/core-free-icons'
import { MagneticLinkPreview } from '@/components/ui/magnetic-link-preview'
import { DATA } from '@/data/resume'
import ShinyText from '@/components/ui/shiny-text'
import Logos from '@/components/home/sections/logos'
import { Link } from '@/i18n/navigation'
import { AnimatedButtonContent, buttonVariants } from '@/components/ui/button'
import { useSignatureWelcome } from '@/components/signature-entrance'

export default function HeroV2() {
  const t = useTranslations()
  const welcoming = useSignatureWelcome()
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const staggerItem = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  } as const

  return (
    <m.section
      id='home'
      className='relative isolate flex w-full flex-col items-center justify-start overflow-hidden px-6 pt-24 pb-6 sm:px-8 sm:pt-28 lg:px-10 lg:pt-32'
    >
      {/* Background */}
      <div className='bg-background absolute inset-0 -z-20 transition-colors duration-700' />

      {/* Grid Background with Rounded Corners - Light Mode */}
      <div
        className='hero-pattern absolute inset-0 -z-15 dark:hidden'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Grid Background with Rounded Corners - Dark Mode */}
      <div
        className='hero-pattern absolute inset-0 -z-15 hidden dark:block'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Responsive glow, clipped to the hero frame */}
      <div
        className='pointer-events-none absolute inset-0 -z-10 opacity-60 lg:translate-x-1/4 lg:rtl:-translate-x-1/4'
        style={{
          backgroundImage:
            'radial-gradient(circle 24rem at center, color-mix(in srgb, var(--primary) 16%, transparent), transparent)',
        }}
      />

      <m.div
        variants={staggerContainer}
        initial='hidden'
        animate={welcoming ? 'hidden' : 'visible'}
        className='relative z-10 mx-auto grid w-full items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12'
      >
        <div className='min-w-0 space-y-6 text-center lg:text-start'>
          {/* Main Title */}
          <div className='mx-auto max-w-3xl lg:mx-0'>
            <TextReveal as='h1' className='page-title'>
              <span className='text-foreground'>{t(DATA.hero.titleKey)}</span>{' '}
              <span className='from-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-transparent dark:from-white dark:to-white/65'>
                {t(DATA.hero.highlightKey)}
              </span>
            </TextReveal>
          </div>

          {/* Subtitle */}
          <div className='mx-auto max-w-xl lg:mx-0'>
            <TextReveal
              as='p'
              delay={0.08}
              className='text-muted-foreground/80 max-w-xl text-base leading-relaxed font-normal text-pretty sm:text-lg md:text-xl'
            >
              {t(DATA.hero.subtitle)}
            </TextReveal>
          </div>

          {/* Primary actions */}
          <m.div
            variants={staggerItem}
            className='flex flex-wrap items-center justify-center gap-3 lg:justify-start'
          >
            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MagneticLinkPreview
                url={DATA.profile.resumeURL}
                icon={Download01Icon}
                variant='primary'
              >
                <ShinyText text={t(DATA.hero.cta)} disabled={false} speed={3} />
              </MagneticLinkPreview>
            </m.div>

            <Link href='/#projects' className={buttonVariants({ variant: 'secondary' })}>
              <AnimatedButtonContent>{t('hero.viewWork')}</AnimatedButtonContent>
            </Link>
          </m.div>
        </div>
        <m.div
          variants={staggerItem}
          className='order-first mx-auto w-full max-w-64 lg:order-last lg:max-w-sm'
        >
          <div data-portrait-source className='relative aspect-square w-full'>
            <Portrait />
          </div>
        </m.div>
      </m.div>
      <div className='relative z-10 mt-6 w-full sm:mt-8'>
        <Logos />
      </div>
    </m.section>
  )
}
