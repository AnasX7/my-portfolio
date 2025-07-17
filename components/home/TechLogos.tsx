'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { DATA } from '@/data/resume'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { Badge } from '@/components/ui/badge'
import { SparklesCore } from '@/components/ui/sparkles'
import Logos from '@/components/ui/logos'

export default function TechLogos() {
  const t = useTranslations()
  const locale = useLocale()

  const isArabic = locale === 'ar'

  return (
    <motion.section
      initial={{ opacity: 0, filter: 'blur(10px)', y: 40 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
      className='pb-16'>
      <div className='group relative m-auto max-w-7xl px-6 overflow-hidden'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className='flex flex-col items-center md:flex-row'>
          <div
            className={`md:max-w-44 ${
              isArabic ? 'md:border-l md:pl-6' : 'md:border-r md:pr-6'
            }`}>
            <motion.p
              initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
              className='text-end text-sm hidden md:block'>
              {t(DATA.techLogos.titleKey)}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, amount: 0.3 }}
              className='md:hidden mb-4 flex justify-center'>
              <Badge
                variant='outline'
                className='rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-sm font-medium'>
                <Sparkles className='mr-1 h-3.5 w-3.5 text-primary' />
                {t(DATA.techLogos.titleKey)}
              </Badge>
            </motion.div>
          </div>

          <div
            dir='ltr'
            className='relative py-6 md:w-[calc(100%-11rem)] min-h-20'>
            <InfiniteSlider speedOnHover={20} speed={40} gap={88}>
              <Logos />
            </InfiniteSlider>

            <div className='bg-linear-to-r from-background absolute inset-y-0 left-0 w-20'></div>
            <div className='bg-linear-to-l from-background absolute inset-y-0 right-0 w-20'></div>
            <ProgressiveBlur
              className='pointer-events-none absolute left-0 top-0 h-full w-20'
              direction='left'
              blurIntensity={1}
            />
            <ProgressiveBlur
              className='pointer-events-none absolute right-0 top-0 h-full w-20'
              direction='right'
              blurIntensity={1}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className='relative -mt-32 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#ffffff,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-zinc-500 dark:after:border-[#ffffff66] after:bg-white dark:after:bg-zinc-900'>
        <SparklesCore
          id='tsparticles'
          background='transparent'
          particleDensity={300}
          className='absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]'
        />
      </motion.div>
    </motion.section>
  )
}
