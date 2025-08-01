'use client'

import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'
import ContactForm from '@/components/home/contact-form'

export default function Contact() {
  const t = useTranslations()

  return (
    <section id='contact' className='mt-20 sm:mt-32'>
      <div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-5xl'>
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: 'blur(10px)',
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className='flex flex-col items-center py-10'>
          <h2 className='text-2xl md:text-4xl text-center font-bold mb-4 text-foreground dark:text-foreground'>
            {t(DATA.contact.titleKey)}
          </h2>
          <p className='text-muted-foreground dark:text-muted-foreground text-sm md:text-lg text-center max-w-2xl'>
            {t(DATA.contact.subtitleKey)}
          </p>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.95,
            filter: 'blur(10px)',
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}>
          <ContactForm />
        </motion.div>
      </div>
    </section>
  )
}
