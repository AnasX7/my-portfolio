'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion, useScroll, useTransform } from 'motion/react'
import { Download } from 'lucide-react'
import { MagneticLinkPreview } from '@/components/ui/magnetic-link-preview'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WavingHand } from '@/components/ui/waving-hand'
import { DATA } from '@/data/resume'
import { cn } from '@/lib/utils'
import ShinyText from '@/components/ui/shiny-text'

export default function Hero2() {
  const t = useTranslations()
  const locale = useLocale()
  const isArabic = locale === 'ar'

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
      className='relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 -z-20 bg-background transition-colors duration-700' />

      {/* Grid Background with Rounded Corners - Light Mode */}
      <div
        className='absolute inset-0 -z-15 dark:hidden'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(0,0,0,0.08)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Grid Background with Rounded Corners - Dark Mode */}
      <div
        className='absolute inset-0 -z-15 hidden dark:block'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      <div
        className={cn(
          'absolute inset-0 -z-10 opacity-90 transition-colors duration-700',
          'bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(148,163,184,0.28),transparent_75%)]',
          'bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(226,232,240,0.15),transparent_100%)]'
        )}
      />
      {/* Main Content Container */}
      <motion.div
        variants={staggerContainer}
        initial='hidden'
        animate='visible'
        className='relative z-10 mx-auto max-w-352 px-4 sm:px-6 lg:px-8 text-center'>
        {/* Badge */}
        <motion.div
          variants={staggerItem}
          className={`${isArabic ? 'mb-6' : 'mb-8'}`}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/80 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors backdrop-blur-md dark:border-white/10 dark:bg-white/5'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-green-500 dark:bg-green-400' />
            <span className='text-sm font-medium text-muted-foreground'>
              {t(DATA.hero.badge)}
            </span>
          </motion.div>
        </motion.div>

        {/* Name Header */}
        <motion.div
          variants={staggerItem}
          className={`${isArabic ? 'mb-4' : 'mb-6'}`}>
          <motion.h1
            className={`flex justify-center items-center gap-1 md:gap-3 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight ${
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
              <Avatar className='relative z-10 size-14 rounded-2xl border-2 border-border/60 backdrop-blur-sm md:size-16 md:rounded-2xl dark:border-white/20'>
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

        {/* Main Title */}
        <motion.div
          variants={staggerItem}
          className={`${isArabic ? 'mb-6' : 'mb-8'}`}>
          <h2
            className={`text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight ${
              isArabic && 'md:leading-tight'
            }`}>
            <span className='mb-2 block text-foreground'>
              {t(DATA.hero.titleKey)}
            </span>
            <span className='block bg-gradient-to-b from-foreground to-foreground/65 text-transparent bg-clip-text dark:from-white dark:to-white/65'>
              {t(DATA.hero.highlightKey)}
            </span>
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          variants={staggerItem}
          className={`${isArabic ? 'mb-9' : 'mb-12'}`}>
          <p className='mx-auto max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground/90 leading-relaxed font-light'>
            {t(DATA.hero.subtitle)}
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={staggerItem}
          className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <MagneticLinkPreview
              url={DATA.profile.resumeURL}
              icon={Download}
              className='rounded-full px-8 py-4'>
              <ShinyText text={t(DATA.hero.cta)} disabled={false} speed={3} />
            </MagneticLinkPreview>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
