'use client'

import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { useInView } from 'motion/react'
import { useTranslations } from 'next-intl'

function FormPlaceholder() {
  const t = useTranslations('contact')
  return (
    <div className='contact-panel rounded-[2.5rem] p-6 sm:p-10' aria-busy='true'>
      <h3 className='mb-8 text-3xl leading-tight font-semibold sm:text-4xl'>{t('title')}</h3>
      <div className='space-y-6' aria-hidden='true'>
        <div className='contact-input h-16 rounded-2xl' />
        <div className='contact-input h-16 rounded-2xl' />
        <div className='contact-input h-40 rounded-2xl' />
        <div />
        <div className='h-14 rounded-full bg-white/10' />
      </div>
    </div>
  )
}

const ContactForm = dynamic(() => import('./contact-form'), { loading: FormPlaceholder })

export default function DeferredContactForm() {
  const ref = useRef<HTMLDivElement>(null)
  const nearby = useInView(ref, { once: true, margin: '600px 0px' })

  return (
    <div id='contact-form' ref={ref} className='scroll-mt-24'>
      {nearby ? <ContactForm /> : <FormPlaceholder />}
    </div>
  )
}
