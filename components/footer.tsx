'use client'

import { motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { DATA } from '@/data/resume'

export default function Footer() {
  const lenis = useLenis()
  const t = useTranslations()

  const currentYear = new Date().getFullYear()

  // Stagger animation container similar to Hero
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <footer className='bg-card/55 relative mt-32 w-full overflow-hidden rounded-t-[4rem] border'>
      {/* Grid Background - Light Mode */}
      <div
        className='absolute inset-0 dark:hidden'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(0,0,0,0.04)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Grid Background - Dark Mode */}
      <div
        className='absolute inset-0 hidden dark:block'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial Gradient overlay (softer for footer) */}
      <div
        className={cn(
          'absolute inset-0 -z-10 opacity-90 transition-colors duration-700 pointer-events-none',
          'bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(148,163,184,0.15),transparent_75%)]',
          'dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(226,232,240,0.05),transparent_100%)]',
        )}
      />

      {/* Top border with gradient fade */}
      <div className='via-border absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-50' />

      {/* Ambient Lights */}
      <div className='bg-primary/10 pointer-events-none absolute right-[-10%] bottom-[-20%] -z-10 h-125 w-125 rounded-full opacity-0 blur-[120px] transition-opacity duration-700 dark:opacity-50' />

      <motion.div
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
        className='container mx-auto flex flex-col items-center justify-center px-4 py-20 sm:py-24'
      >
        {/* Name / Hero Text */}
        <motion.div
          variants={staggerItem}
          className='group relative mb-12 flex flex-col items-center justify-center text-center'
        >
          {/* Main "Portfolio" Text with Hero Styling */}
          <button
            onClick={() =>
              lenis?.scrollTo(0, {
                duration: 3,
              })
            }
            className='relative cursor-pointer'
          >
            <h1
              className={cn(
                'font-black tracking-tighter text-transparent select-none transition-transform duration-500 group-hover:scale-105',
                'text-[10vw] sm:text-[80px] md:text-[100px] lg:text-[120px] leading-[0.8]',
                'bg-linear-to-b from-foreground via-foreground/90 to-foreground/50 bg-clip-text',
                'dark:from-white dark:via-white/90 dark:to-white/50',
              )}
            >
              𝓐𝓷𝖆𝔖
            </h1>

            {/* Glow / Stroke effect behind */}
            <h1
              className={cn(
                'absolute inset-0 -z-10 font-black tracking-tighter text-transparent opacity-0 transition-all duration-500 group-hover:opacity-10 blur-xl',
                'text-[10vw] sm:text-[80px] md:text-[100px] lg:text-[120px] leading-[0.8]',
                'bg-linear-to-b from-primary to-primary/50 bg-clip-text',
              )}
            >
              𝓐𝓷𝖆𝔖
            </h1>

            {/* Portfolio Overlay Text */}
            <div
              className='text-muted-foreground/20 pointer-events-none absolute top-[110%] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-black tracking-widest select-none'
              style={{
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: '1px currentColor',
              }}
            >
              PORTFOLIO
            </div>
          </button>
        </motion.div>

        {/* Social Links - Clean & Professional */}
        <motion.div
          variants={staggerItem}
          className='z-10 mb-16 flex flex-wrap justify-center gap-6'
        >
          {DATA.socials.map((social) => (
            <Link
              key={social.name}
              href={social.url}
              target='_blank'
              className='text-muted-foreground hover:text-foreground transition-colors'
              aria-label={social.name}
            >
              <social.icon className='size-6' />
            </Link>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          variants={staggerItem}
          className='via-border mb-8 h-px w-full max-w-xs bg-linear-to-r from-transparent to-transparent'
        />

        {/* Copyright */}
        <motion.div
          variants={staggerItem}
          className='text-muted-foreground/60 flex flex-col items-center gap-2 text-center text-sm font-light'
        >
          <p>
            &copy; {currentYear} 𝓐𝓷𝖆𝔖, {t(DATA.footer.copyrightKey)}.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  )
}
