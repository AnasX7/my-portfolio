'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion, useScroll, useTransform } from 'motion/react'
import { Download } from 'lucide-react'
import { MagneticLinkPreview } from '@/components/ui/magnetic-link-preview'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WavingHand } from '@/components/ui/waving-hand'
import { DATA } from '@/data/resume'
import { GridPattern } from '@/components/ui/grid-pattern'
import { cn } from '@/lib/utils'
import ShinyText from '@/components/ui/shiny-text'

export default function Hero2() {
  const t = useTranslations()
  const locale = useLocale()
  const isArabic = locale === 'ar'

  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

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

  return (
    <motion.section
      id='home'
      style={{ y, opacity }}
      className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 -z-20 bg-background transition-colors duration-700 dark:bg-black' />
      <div
        className={cn(
          'absolute inset-0 -z-10 opacity-90 transition-colors duration-700',
          // 'bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(148,163,184,0.28),transparent_75%)]',
          'bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(226,232,240,0.15),transparent_100%)]'
        )}
      />
      <GridPattern
        width={60}
        height={60}
        x={-1}
        y={-1}
        strokeDasharray={'6 3'}
        className={cn(
          'absolute inset-0 -z-1 h-full w-full pointer-events-none opacity-20',
          'dark:opacity-30',
          '[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]'
        )}
      />

      {/* Main Content Container */}
      <motion.div
        variants={staggerContainer}
        initial='hidden'
        animate='visible'
        className='relative z-10 mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8 text-center'>
        {/* Welcome Badge */}
        <motion.div variants={staggerItem} className='mb-8'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/80 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors backdrop-blur-md dark:border-white/10 dark:bg-white/5'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-green-500 dark:bg-green-400' />
            <span className='text-sm font-medium text-muted-foreground'>
              {t(DATA.hero.badge)}
            </span>
          </motion.div>
        </motion.div>

        {/* Enhanced Name Header */}
        <motion.div variants={staggerItem} className='mb-6'>
          <motion.h1
            className={`flex justify-center items-center gap-1 md:gap-3 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight ${
              isArabic && 'leading-tight'
            }`}>
            <motion.span className='text-muted-foreground font-medium'>
              {t(DATA.hero.welcomeKey)}
            </motion.span>

            <motion.div
              whileHover={{
                scale: 1.1,
                rotate: isArabic ? 12 : -12,
                transition: { type: 'spring', stiffness: 400, damping: 10 },
              }}
              className='relative'>
              <Avatar className='relative z-10 size-14 rounded-2xl border-2 border-border/60 backdrop-blur-sm md:size-16 md:rounded-3xl lg:size-20 dark:border-white/20'>
                <AvatarImage
                  alt={t(DATA.profile.nameKey)}
                  src={DATA.profile.avatar}
                  className='object-cover'
                />
                <AvatarFallback className='bg-gradient-to-br from-purple-500 to-orange-500 text-white font-bold'>
                  {t(DATA.profile.initialsKey)}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <motion.span className='text-muted-foreground font-medium'>
              {t(DATA.profile.nameKey)}
            </motion.span>

            <motion.div
              animate={{
                rotate: [0, 14, -8, 14, -4, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut',
              }}>
              <WavingHand />
            </motion.div>
          </motion.h1>
        </motion.div>

        {/* Enhanced Main Title */}
        <motion.div variants={staggerItem} className='mb-8'>
          <h2
            className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight ${
              isArabic && 'leading-tight'
            }`}>
            <span className='mb-2 block text-foreground'>
              {t(DATA.hero.titleKey)}
            </span>
            <span className='block bg-gradient-to-r from-purple-400 to-orange-300 dark:from-purple-300 dark:to-orange-200 bg-clip-text text-transparent'>
              {t(DATA.hero.highlightKey)}
            </span>
          </h2>
        </motion.div>

        {/* Enhanced Subtitle */}
        <motion.div variants={staggerItem} className='mb-12'>
          <p className='mx-auto max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl  text-muted-foreground/90 leading-relaxed font-light'>
            {t(DATA.hero.subtitle)}
          </p>
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          variants={staggerItem}
          className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <MagneticLinkPreview
              url={DATA.profile.resumeURL}
              icon={Download}
              className='rounded-full'>
              <ShinyText text={t(DATA.hero.cta)} disabled={false} speed={3} />
            </MagneticLinkPreview>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2'>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className='flex h-10 w-6 justify-center rounded-full border-2 border-border/70 dark:border-white/30'>
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className='mt-2 h-3 w-1 rounded-full bg-foreground/60 dark:bg-white/60'
          />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
