'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { AnimatedButtonContent, buttonVariants } from '@/components/ui/button'
import ContactForm from '@/components/home/contact-form'

export default function Contact() {
  const t = useTranslations()

  return (
    <section id='contact' className='mt-12 scroll-mt-20 px-4 py-10 sm:mt-16 sm:px-6 sm:py-16'>
      <div className='mx-auto max-w-6xl space-y-4 sm:space-y-5'>
        <div className='bg-card border-border/60 flex flex-col gap-8 rounded-[2.5rem] border p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between'>
          <h2 className='section-title max-w-lg whitespace-pre-line'>{t('contact.headline')}</h2>
          <div className='flex flex-wrap gap-3'>
            <a href='#contact-form' className={buttonVariants({ variant: 'primary', size: 'lg' })}>
              <AnimatedButtonContent>{t('contact.startProject')}</AnimatedButtonContent>
            </a>
            <a
              href='tel:+971564949464'
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
          <ContactForm />
          <div className='contact-panel flex flex-col justify-between gap-12 rounded-[2.5rem] p-6 sm:p-10'>
            <nav
              aria-label={t('sections.title')}
              className='flex flex-col items-start gap-5 sm:gap-6'
            >
              <Link
                href='/#about'
                className='text-3xl leading-tight font-semibold transition-colors hover:text-white/65 sm:text-4xl'
              >
                {t('header.about')}
              </Link>
              <Link
                href='/projects'
                className='text-3xl leading-tight font-semibold transition-colors hover:text-white/65 sm:text-4xl'
              >
                {t('header.projects')}
              </Link>
              <a
                href='mailto:anassalem.aa@gmail.com'
                className='text-3xl leading-tight font-semibold transition-colors hover:text-white/65 sm:text-4xl'
              >
                {t('contact.emailMe')}
              </a>
            </nav>
            <div className='space-y-6'>
              <p className='max-w-sm text-base leading-relaxed text-white/65'>
                {t('contact.subtitle')}
              </p>
              <div className='flex flex-wrap gap-3'>
                <a
                  href='mailto:anassalem.aa@gmail.com'
                  dir='ltr'
                  className={buttonVariants({ variant: 'inverse' })}
                >
                  <AnimatedButtonContent>anassalem.aa@gmail.com</AnimatedButtonContent>
                </a>
                <a
                  href='https://github.com/AnasX7'
                  className={buttonVariants({ variant: 'inverse' })}
                >
                  <AnimatedButtonContent>GitHub</AnimatedButtonContent>
                </a>
                <a
                  href='https://linkedin.com/in/anassalem7'
                  className={buttonVariants({ variant: 'inverse' })}
                >
                  <AnimatedButtonContent>LinkedIn</AnimatedButtonContent>
                </a>
              </div>
              <p className='text-sm text-white/55'>
                {t('footer.location')} · {t('footer.remoteWork')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
