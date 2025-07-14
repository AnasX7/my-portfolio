'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { StatefulLink } from '../ui/stateful-Link'

export default function Hero() {
  const t = useTranslations('Hero')
  const locale = useLocale()

  const isArabic = locale === 'ar'

  return (
    <div className='relative flex min-h-[80vh] flex-col items-center justify-center w-full px-4 py-8 sm:py-12 md:py-16 overflow-hidden sm:px-6 lg:px-8'>
      <section className='leading-relaxed mx-auto max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl space-y-8 md:space-y-10 text-center'>
        <Link
          href='#link'
          className={`group ${
            isArabic && 'sm:mt-6'
          } mx-auto flex w-fit items-center gap-3 sm:gap-4 rounded-3xl border-[2px] border-white/5 bg-gradient-to-tr from-zinc-300/10 via-gray-400/10 to-transparent p-1 ${
            isArabic ? 'pr-3 sm:pr-4' : 'pl-3 sm:pl-4'
          }  shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-white/10 dark:from-zinc-300/10 dark:via-gray-400/10 dark:to-transparent backdrop-blur-md hover:bg-white/20 dark:hover:bg-zinc-900/40`}>
          <span className='text-foreground text-xs sm:text-sm dark:text-zinc-100'>
            {t('action')}
          </span>
          <span className='block h-4 w-0.5 border-l bg-zinc-300 dark:bg-zinc-700'></span>

          <div className='bg-background dark:bg-zinc-800 group-hover:bg-muted dark:group-hover:bg-zinc-700 size-6 overflow-hidden rounded-full duration-500'>
            <div
              className={`flex w-12 ${
                isArabic ? 'translate-x-1/2' : '-translate-x-1/2'
              } duration-500 ease-in-out ${
                isArabic
                  ? 'group-hover:-translate-x-0'
                  : 'group-hover:translate-x-0'
              }`}>
              <span className='flex size-6'>
                {isArabic ? (
                  <ArrowLeft className='m-auto size-3' />
                ) : (
                  <ArrowRight className='m-auto size-3' />
                )}
              </span>
              <span className='flex size-6'>
                {isArabic ? (
                  <ArrowLeft className='m-auto size-3' />
                ) : (
                  <ArrowRight className='m-auto size-3' />
                )}
              </span>
            </div>
          </div>
        </Link>
        <h2
          className={`mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-transparent  ${
            isArabic && 'leading-tight'
          }`}>
          {t('title')}{' '}
          <span className='bg-gradient-to-r from-purple-300 to-orange-200 bg-clip-text text-transparent'>
            {t('highlight')}
          </span>
        </h2>

        <p className='mx-auto max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl text-gray-400/90 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed'>
          {t('Subtitle')}
        </p>

        <div className='flex justify-center mt-8 sm:mt-10'>
          <StatefulLink
            href='https://flowcv.com/resume/j9n4st328u'
            className='w-full inline-flex justify-center items-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-fit px-6 sm:px-8 md:px-10 py-3 sm:py-4'>
            {t('CTA')}
          </StatefulLink>
        </div>
      </section>
    </div>
  )
}
