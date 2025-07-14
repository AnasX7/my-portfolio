'use client'

import { ArrowRight, Download } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { LinkPreview } from '../ui/link-preview'

export default function Hero() {
  const t = useTranslations('Hero')
  const locale = useLocale()

  const isArabic = locale === 'ar'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='relative flex min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex-col items-center justify-center w-full px-4 py-8 sm:py-12 md:py-16 overflow-hidden sm:px-6 lg:px-8  dark:from-transparent dark:to-transparent'>
      <motion.section
        initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className='leading-relaxed mx-auto max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl space-y-8 md:space-y-10 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}>
          <Link
            href='#link'
            className={`group ${
              isArabic && 'sm:mt-6'
            } mx-auto flex w-fit items-center gap-3 sm:gap-4 rounded-3xl border-[2px] border-zinc-200 bg-gradient-to-tr from-zinc-100 via-white to-zinc-50 p-1 ${
              isArabic ? 'pr-3 sm:pr-4' : 'pl-3 sm:pl-4'
            }  shadow-md shadow-zinc-200/50 transition-colors duration-300 dark:border-white/10 dark:from-zinc-300/10 dark:via-gray-400/10 dark:to-transparent dark:shadow-zinc-950/5 backdrop-blur-md hover:bg-zinc-100 dark:hover:bg-zinc-900/40`}>
            <span className='text-foreground text-xs sm:text-sm dark:text-zinc-100'>
              {t('action')}
            </span>
            <span className='block h-4 w-0.5 border-l bg-zinc-300 dark:bg-zinc-700'></span>

            <div className='bg-white dark:bg-zinc-800 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 size-6 overflow-hidden rounded-full duration-500 border border-zinc-200 dark:border-transparent'>
              <div
                className={`flex w-12 ${
                  isArabic ? 'translate-x-1/2' : '-translate-x-1/2'
                } duration-500 ease-in-out ${
                  isArabic
                    ? 'group-hover:-translate-x-0'
                    : 'group-hover:translate-x-0'
                }`}>
                <span className='flex size-6'>
                  <ArrowRight
                    className={`m-auto size-3 ${isArabic && 'rotate-180'}`}
                  />
                </span>
                <span className='flex size-6'>
                  <ArrowRight
                    className={`m-auto size-3 ${isArabic && 'rotate-180'}`}
                  />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`mx-auto bg-[linear-gradient(180deg,_rgba(0,0,0,0.6)_0%,_rgba(0,0,0,0.4)_80%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-transparent ${
            isArabic && 'leading-tight'
          }`}>
          {t('title')}{' '}
          <motion.span
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='bg-gradient-to-r from-purple-400 to-orange-300 dark:bg-gradient-to-r dark:from-purple-300 dark:to-orange-200 bg-clip-text text-transparent'>
            {t('highlight')}
          </motion.span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className='mx-auto max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl text-zinc-600 dark:text-zinc-400/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed'>
          {t('Subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className='flex justify-center mt-8 sm:mt-10'>
          <LinkPreview
            url='https://flowcv.com/resume/j9n4st328u'
            className='neumorphic-button hover:shadow-[0_0_20px_rgba(155, 135, 245, 0.5)] cursor-pointer relative w-full overflow-hidden rounded-2xl border-[2px] dark:border-white/10 bg-gradient-to-b from-white/10 to-white/5  text-black dark:text-white shadow-lg transition-all duration-300 dark:hover:border-[#ffffff]/30 sm:w-auto 
            inline-flex justify-center items-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-fit px-6 sm:px-8 md:px-10 py-3 sm:py-4 gap-2'>
            {t('CTA')}
            <Download className='size-4' />
          </LinkPreview>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}
