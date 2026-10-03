'use client'

import { TextReveal } from '@/components/ui/text-reveal'

import { useTranslations } from 'next-intl'
import { AnimatedButtonContent, buttonVariants } from '@/components/ui/button'
import DeferredContactForm from '@/components/home/deferred-contact-form'
import { PaperPlane } from '@/components/icons/paper-plane'

export default function Contact() {
  const t = useTranslations()

  return (
    <section id='contact' className='content-section scroll-mt-20'>
      <div className='section-inner space-y-4 sm:space-y-5'>
        <div className='contact-panel flex flex-col gap-8 rounded-[2.5rem] p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between'>
          <TextReveal as='h2' className='section-title max-w-lg whitespace-pre-line text-white!'>
            {t('contact.headline')}
          </TextReveal>
          <div className='flex flex-wrap gap-3'>
            <a href='#contact-form' className={buttonVariants({ variant: 'primary', size: 'lg' })}>
              <AnimatedButtonContent>{t('contact.startProject')}</AnimatedButtonContent>
            </a>
            <a
              href='https://wa.me/971564949464'
              target='_blank'
              rel='noopener noreferrer'
              className={buttonVariants({
                variant: 'secondary',
                size: 'lg',
              })}
            >
              <AnimatedButtonContent>{t('contact.call')}</AnimatedButtonContent>
            </a>
          </div>
        </div>
        <div className='grid gap-4 sm:gap-5 md:grid-cols-2'>
          <DeferredContactForm />
          <div className='contact-panel group/plane flex flex-col items-center justify-center gap-8 rounded-[2.5rem] p-6 py-12 text-center sm:p-10'>
            <div
              aria-hidden='true'
              className='aspect-square w-full max-w-60 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/plane:translate-x-2.5 motion-safe:group-hover/plane:-translate-y-2 motion-reduce:transition-none lg:max-w-80 rtl:motion-safe:group-hover/plane:-translate-x-2.5'
            >
              <div className='motion-safe:animate-plane-float h-full w-full [--plane-tilt:2deg] rtl:[--plane-tilt:-2deg]'>
                <PaperPlane className='rtl:-rotate-90' />
              </div>
            </div>
            <TextReveal
              as='p'
              className='max-w-sm text-base leading-relaxed text-white/65 sm:text-lg'
            >
              {t('contact.Illustration.subtitle')}
            </TextReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
