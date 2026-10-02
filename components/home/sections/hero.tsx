'use client'

import { useId } from 'react'
import { useTranslations } from 'next-intl'
import { m } from 'motion/react'
import Image from 'next/image'
import { Download01Icon } from '@hugeicons/core-free-icons'
import { MagneticLinkPreview } from '@/components/ui/magnetic-link-preview'
import { DATA } from '@/data/resume'
import ShinyText from '@/components/ui/shiny-text'
import Logos from '@/components/home/sections/logos'
import { Link } from '@/i18n/navigation'
import { AnimatedButtonContent, buttonVariants } from '@/components/ui/button'

export default function HeroV2() {
  const t = useTranslations()
  const portraitId = useId()
  const portraitShape =
    'M.06 .018H.94Q.982 .018 .982 .058V.842Q.982 .88 .946 .88H.73Q.686 .88 .66 .922L.624 .966Q.61 .982 .58 .982H.06Q.018 .982 .018 .942V.058Q.018 .018 .06 .018Z'

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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
      className='relative isolate flex w-full flex-col items-center justify-start overflow-hidden pt-24 pb-6 sm:pt-28 lg:pt-32'
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

      {/* Centered glow, clipped to the hero frame */}
      <m.div
        whileInView={{ opacity: [0.4, 0.8, 0.4] }}
        viewport={{ amount: 0.1 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          backgroundImage:
            'radial-gradient(circle 24rem at center, color-mix(in srgb, var(--primary) 16%, transparent), transparent)',
        }}
      />

      <m.div
        variants={staggerContainer}
        initial='hidden'
        animate='visible'
        className='relative z-10 mx-auto grid w-full items-center gap-8 px-6 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:px-10'
      >
        <div className='min-w-0 space-y-6 text-center lg:text-start'>
          {/* Main Title */}
          <m.div variants={staggerItem} className='mx-auto max-w-3xl lg:mx-0'>
            <h1 className='page-title'>
              <span className='text-foreground'>{t(DATA.hero.titleKey)}</span>{' '}
              <span className='from-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-transparent dark:from-white dark:to-white/65'>
                {t(DATA.hero.highlightKey)}
              </span>
            </h1>
          </m.div>

          {/* Subtitle */}
          <m.div variants={staggerItem} className='mx-auto max-w-xl lg:mx-0'>
            <p className='text-muted-foreground/80 max-w-xl text-base leading-relaxed font-normal text-pretty sm:text-lg md:text-xl'>
              {t(DATA.hero.subtitle)}
            </p>
          </m.div>

          {/* Primary actions */}
          <m.div
            variants={staggerItem}
            className='flex flex-wrap items-center justify-center gap-3 lg:justify-start'
          >
            <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MagneticLinkPreview
                url={DATA.profile.resumeURL}
                icon={Download01Icon}
                className='rounded-full px-8 py-4'
              >
                <ShinyText text={t(DATA.hero.cta)} disabled={false} speed={3} />
              </MagneticLinkPreview>
            </m.div>

            <Link
              href='/#projects'
              className={buttonVariants({ variant: 'animated', className: 'min-h-12 px-6' })}
            >
              <AnimatedButtonContent>{t('hero.viewWork')}</AnimatedButtonContent>
            </Link>
          </m.div>
        </div>
        <m.div
          variants={staggerItem}
          className='order-first mx-auto w-full max-w-64 lg:order-last lg:max-w-sm'
        >
          <div className='relative aspect-square w-full'>
            <div className='absolute inset-0' style={{ clipPath: `url(#${portraitId}-clip)` }}>
              <Image
                alt={t(DATA.profile.nameKey)}
                src={DATA.profile.avatarLight}
                fill
                sizes='(min-width: 1024px) 384px, 256px'
                priority
                className='object-cover dark:hidden'
              />
              <Image
                alt={t(DATA.profile.nameKey)}
                src={DATA.profile.avatarDark}
                fill
                sizes='(min-width: 1024px) 384px, 256px'
                priority
                className='hidden object-cover dark:block'
              />
            </div>
            <svg
              aria-hidden='true'
              className='pointer-events-none absolute inset-0 size-full'
              viewBox='0 0 1 1'
              preserveAspectRatio='none'
            >
              <defs>
                <clipPath id={`${portraitId}-clip`} clipPathUnits='objectBoundingBox'>
                  <path
                    d={portraitShape}
                    transform='translate(1 0) scale(-1 1)'
                    className='rtl:transform-none'
                  />
                </clipPath>
              </defs>
              <path
                d={portraitShape}
                transform='translate(1 0) scale(-1 1)'
                fill='none'
                className='stroke-border rtl:transform-none'
                strokeWidth='8'
                vectorEffect='non-scaling-stroke'
              />
            </svg>
            <div className='text-muted-foreground absolute start-0 bottom-1 flex h-[10%] w-[34%] items-center justify-center gap-2 text-xs lg:text-sm rtl:flex-row-reverse'>
              <span
                aria-hidden='true'
                className='size-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b98166] [corner-shape:round]'
              />
              <span dir='auto'>{t('hero.available')}</span>
            </div>
          </div>
        </m.div>
      </m.div>
      <div className='relative z-10 mt-6 w-full sm:mt-8'>
        <Logos />
      </div>
    </m.section>
  )
}
