'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Download } from 'lucide-react'
import { MagneticLinkPreview } from '@/components/ui/magnetic-link-preview'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { WavingHand } from '@/components/ui/waving-hand'
import { DATA } from '@/data/resume'

export default function Hero() {
  const t = useTranslations()
  const locale = useLocale()

  const isArabic = locale === 'ar'

  return (
    <motion.div
      id='home'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className='relative flex min-h-dvh flex-col items-center justify-center w-full px-4 py-8 sm:py-12 md:py-16 overflow-hidden sm:px-6 lg:px-8  dark:from-transparent dark:to-transparent'>
      <motion.section
        initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        className='leading-relaxed mx-auto max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl space-y-5 md:space-y-6 lg:space-y-8 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
            className={`flex justify-center items-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter ${
              isArabic && 'leading-tight'
            }`}>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}>
              {t(DATA.hero.welcomeKey)}
            </motion.span>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.5,
                rotate: isArabic ? 12 : -12,
              }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.8,
                type: 'spring',
                stiffness: 200,
              }}>
              <Avatar className='size-12 sm:size-14 md:size-16 lg:size-20 border-4 rounded-2xl md:rounded-3xl mx-1 sm:mx-2'>
                <AvatarImage
                  alt={t(DATA.profile.nameKey)}
                  src={DATA.profile.avatar}
                />
                <AvatarFallback>{t(DATA.profile.initialsKey)}</AvatarFallback>
              </Avatar>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}>
              {t(DATA.profile.nameKey)}
            </motion.span>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}>
              <WavingHand />
            </motion.div>
          </motion.h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: 'easeOut' }}
          className={`mx-auto bg-[linear-gradient(180deg,_rgba(0,0,0,0.6)_0%,_rgba(0,0,0,0.4)_80%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-transparent ${
            isArabic && 'leading-tight'
          }`}>
          {t(DATA.hero.titleKey)}{' '}
          <motion.span
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 1.6 }}
            className='bg-gradient-to-r from-purple-400 to-orange-300 dark:bg-gradient-to-r dark:from-purple-300 dark:to-orange-200 bg-clip-text text-transparent'>
            {t(DATA.hero.highlightKey)}
          </motion.span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease: 'easeOut' }}
          className='mx-auto max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl text-muted-foreground dark:text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed'>
          {t(DATA.hero.subtitle)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2, ease: 'easeOut' }}
          className='flex justify-center mt-8 sm:mt-10'>
          <MagneticLinkPreview url={DATA.profile.resumeURL} icon={Download}>
            {t(DATA.hero.cta)}
          </MagneticLinkPreview>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
