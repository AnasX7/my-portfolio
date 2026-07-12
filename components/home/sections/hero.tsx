'use client'

import { useLocale, useTranslations } from 'next-intl'
import { m, useReducedMotion } from 'motion/react'
import { Download } from 'lucide-react'
import { MagneticLinkPreview } from '@/components/ui/magnetic-link-preview'
import { DATA } from '@/data/resume'
import { cn } from '@/lib/utils'
import ShinyText from '@/components/ui/shiny-text'

export default function HeroV2() {
  const t = useTranslations()
  const locale = useLocale()
  const isArabic = locale === 'ar'
  const shouldReduceMotion = useReducedMotion()

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
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  } as const

  const floatAnimation = (delay: number, duration: number, xOffset = 5, yOffset = 8, rotateOffset = 3) => ({
    y: [0, -yOffset, 0],
    x: [0, xOffset, 0],
    rotate: [0, rotateOffset, 0],
    transition: {
      duration,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay,
    },
  })

  const techIcons = [
    {
      name: 'React',
      src: 'https://cdn.simpleicons.org/react',
      className: 'absolute z-0 top-[5%] -left-12 sm:-left-16 size-12 rounded-2xl border border-border/40 bg-background/60 p-2.5 shadow-lg backdrop-blur-xs dark:border-white/10 dark:bg-white/5 flex items-center justify-center',
      delay: 0,
      duration: 3.8,
      xOffset: 4,
      yOffset: 10,
      rotateOffset: -3,
      invertDark: false,
    },
    {
      name: 'TypeScript',
      src: 'https://cdn.simpleicons.org/typescript',
      className: 'absolute z-0 top-[15%] -right-12 sm:-right-16 size-12 rounded-2xl border border-border/40 bg-background/60 p-2.5 shadow-lg backdrop-blur-xs dark:border-white/10 dark:bg-white/5 flex items-center justify-center',
      delay: 0.6,
      duration: 4.2,
      xOffset: -5,
      yOffset: 12,
      rotateOffset: 4,
      invertDark: false,
    },
    {
      name: 'Next.js',
      src: 'https://cdn.simpleicons.org/nextdotjs',
      className: 'absolute z-0 bottom-[18%] -left-14 sm:-left-20 size-12 rounded-2xl border border-border/40 bg-background/60 p-2.5 shadow-lg backdrop-blur-xs dark:border-white/10 dark:bg-white/5 flex items-center justify-center',
      delay: 1.2,
      duration: 4.6,
      xOffset: 6,
      yOffset: 8,
      rotateOffset: -2,
      invertDark: true,
    },
    {
      name: 'NestJS',
      src: 'https://cdn.simpleicons.org/nestjs',
      className: 'absolute z-0 bottom-[10%] -right-14 sm:-right-20 size-12 rounded-2xl border border-border/40 bg-background/60 p-2.5 shadow-lg backdrop-blur-xs dark:border-white/10 dark:bg-white/5 flex items-center justify-center',
      delay: 1.8,
      duration: 4,
      xOffset: -4,
      yOffset: 11,
      rotateOffset: 3,
      invertDark: false,
    },
  ]

  return (
    <m.section
      id='home'
      className='relative flex w-full flex-col items-center justify-start overflow-hidden pt-20 pb-8 sm:pt-24 sm:pb-10 lg:pt-28 lg:pb-12'
    >
      {/* Background */}
      <div className='bg-background absolute inset-0 -z-20 transition-colors duration-700' />

      {/* Grid Background with Rounded Corners - Light Mode */}
      <div
        className='absolute inset-0 -z-15 dark:hidden mask-[linear-gradient(to_bottom,black_60%,transparent)]'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Grid Background with Rounded Corners - Dark Mode */}
      <div
        className='absolute inset-0 -z-15 hidden dark:block mask-[linear-gradient(to_bottom,black_60%,transparent)]'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      <div
        className={cn(
          'absolute inset-0 -z-10 opacity-90 transition-colors duration-700',
          'bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(148,163,184,0.28),transparent_75%)]',
          'bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(226,232,240,0.15),transparent_100%)]',
        )}
      />
      {/* Main Content Container */}
      <m.div
        variants={staggerContainer}
        initial='hidden'
        animate='visible'
        className='relative z-10 mx-auto max-w-352 px-6 text-center sm:px-8 md:px-12 lg:px-16'
      >
        {/* Centered Tilted Avatar Card */}
        <m.div
          variants={staggerItem}
          className='mb-8 flex justify-center'
        >
          <div className='relative w-fit select-none'>
            {/* Tilted Avatar Card */}
            <m.div
              whileHover={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: 1.05,
                      rotate: 0,
                      transition: { type: 'spring', stiffness: 200, damping: 15 },
                    }
              }
              style={shouldReduceMotion ? {} : { rotate: -4 }}
              className='border-border/60 relative z-10 size-32 cursor-pointer rounded-[2rem] border-2 bg-muted/30 p-2 shadow-xl backdrop-blur-md select-none sm:size-36 md:size-40 dark:border-white/10 dark:bg-white/5'
            >
              <div className='h-full w-full overflow-hidden rounded-[1.75rem]'>
                <img
                  alt={t(DATA.profile.nameKey)}
                  src={DATA.profile.avatar}
                  className='h-full w-full object-cover select-none'
                />
              </div>
            </m.div>

            {/* Floating Tech Icons */}
            {techIcons.map((icon) => (
              <m.div
                key={icon.name}
                animate={
                  shouldReduceMotion
                    ? {}
                    : floatAnimation(
                        icon.delay,
                        icon.duration,
                        icon.xOffset,
                        icon.yOffset,
                        icon.rotateOffset,
                      )
                }
                className={icon.className}
              >
                <img
                  src={icon.src}
                  alt={icon.name}
                  className={cn(
                    'size-6 object-contain pointer-events-none select-none transition-all duration-300',
                    icon.invertDark && 'dark:brightness-0 dark:invert',
                  )}
                />
              </m.div>
            ))}
          </div>
        </m.div>

        {/* Main Title */}
        <m.div variants={staggerItem} className={`${isArabic ? 'mb-1.5' : 'mb-3'} max-w-3xl mx-auto`}>
          <h2
            className={`text-2xl font-semibold tracking-tight text-balance sm:text-3xl md:text-4xl lg:text-5xl ${
              isArabic ? 'leading-[1.15] md:leading-[1.2]' : 'leading-tight'
            }`}
          >
            <span className='text-foreground'>{t(DATA.hero.titleKey)}</span>{' '}
            <span className='from-foreground to-foreground/65 bg-linear-to-b bg-clip-text text-transparent dark:from-white dark:to-white/65'>
              {t(DATA.hero.highlightKey)}
            </span>
          </h2>
        </m.div>

        {/* Subtitle */}
        <m.div variants={staggerItem} className='mb-8 max-w-xl mx-auto'>
          <p className='text-muted-foreground/80 mx-auto max-w-xl text-base leading-relaxed font-normal text-pretty sm:text-lg md:text-xl'>
            {t(DATA.hero.subtitle)}
          </p>
        </m.div>

        {/* CTA and Social Media Buttons Row */}
        <m.div
          variants={staggerItem}
          className='flex flex-row flex-wrap items-center justify-center gap-4'
        >
          <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <MagneticLinkPreview
              url={DATA.profile.resumeURL}
              icon={Download}
              className='rounded-full px-8 py-4'
            >
              <ShinyText text={t(DATA.hero.cta)} disabled={false} speed={3} />
            </MagneticLinkPreview>
          </m.div>

          {/* Social Buttons with Link Preview & Point Animations */}
          <div className='flex flex-row items-center gap-3'>
            {DATA.socials.slice(0, 3).map((social) => {
              const IconComponent = social.icon
              return (
                <div key={social.name} className='group relative'>
                  <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <MagneticLinkPreview
                      url={social.url}
                      className={cn(
                        'size-12 p-0 min-h-0 flex items-center justify-center rounded-full border border-border/50 bg-background/60 backdrop-blur-md shadow-xs transition-all duration-300',
                        'before:bg-none after:bg-none after:bg-background/60 after:backdrop-blur-md',
                        'dark:border-white/10 dark:bg-white/5 dark:after:bg-[#0a0a0a]/50',
                      )}
                    >
                      <IconComponent className='text-muted-foreground size-5 transition-transform duration-300 group-hover:scale-110 dark:text-gray-300' />
                    </MagneticLinkPreview>
                  </m.div>
                </div>
              )
            })}
          </div>
        </m.div>
      </m.div>
    </m.section>
  )
}
