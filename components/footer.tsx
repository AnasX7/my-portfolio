'use client'

import { m } from 'motion/react'
import { useLenis } from 'lenis/react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { DATA } from '@/data/resume'
import { buttonVariants } from '@/components/ui/button'

export default function Footer() {
  const lenis = useLenis()
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  // Stagger animation container
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 90, damping: 16 },
    },
  }

  return (
    <footer className='relative mt-12 w-full overflow-hidden bg-transparent'>
      {/* Grid Background with Infinite Scrolling Loop - Light Mode */}
      <m.div
        animate={{
          backgroundPosition: ['0px 0px', '80px 80px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className='absolute inset-0 -z-15 mask-[linear-gradient(to_bottom,transparent,black_30%)] dark:hidden'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(0,0,0,0.04)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Grid Background with Infinite Scrolling Loop - Dark Mode */}
      <m.div
        animate={{
          backgroundPosition: ['0px 0px', '80px 80px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className='absolute inset-0 -z-15 hidden mask-[linear-gradient(to_bottom,transparent,black_30%)] dark:block'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial Gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 -z-10 opacity-90 transition-colors duration-700 pointer-events-none',
          'bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(148,163,184,0.1),transparent_75%)]',
          'dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(226,232,240,0.02),transparent_100%)]',
        )}
      />

      {/* Floating Ambient Glow Light Bubble */}
      <m.div
        animate={{
          scale: [1, 1.15, 0.95, 1],
          x: [0, 20, -15, 0],
          y: [0, -20, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='bg-primary/5 dark:bg-primary/10 pointer-events-none absolute right-[-10%] bottom-[-20%] -z-10 h-100 w-100 rounded-full opacity-40 blur-[100px]'
      />

      <m.div
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        className='container mx-auto px-6 py-6 sm:py-8 md:max-w-5xl'
      >
        <div className='grid grid-cols-6 gap-6 sm:gap-8'>
          {/* Left Column: Brand, Socials */}
          <m.div
            variants={staggerItem}
            className='col-span-6 flex flex-col items-center gap-3 text-center sm:col-span-3 sm:items-start sm:text-start'
          >
            <div className='group relative flex flex-col items-center sm:items-start'>
              <button
                onClick={() =>
                  lenis?.scrollTo(0, {
                    duration: 1.8,
                  })
                }
                className='relative cursor-pointer overflow-visible text-center focus:outline-hidden sm:text-start'
              >
                {/* Main Name Signature */}
                <span
                  aria-hidden='true'
                  className={cn(
                    'font-black text-transparent select-none transition-transform duration-500 group-hover:scale-105 inline-block px-2',
                    'text-3xl sm:text-4xl leading-[0.8]',
                    'bg-linear-to-b from-foreground via-foreground/90 to-foreground/50 bg-clip-text',
                    'dark:from-white dark:via-white/90 dark:to-white/50',
                  )}
                >
                  𝓐𝓷𝖆𝔖
                </span>

                {/* Glow stroke behind */}
                <span
                  aria-hidden='true'
                  className={cn(
                    'absolute inset-0 -z-10 font-black text-transparent opacity-0 transition-all duration-500 group-hover:opacity-20 blur-lg inline-block px-2',
                    'text-3xl sm:text-4xl leading-[0.8]',
                    'bg-linear-to-b from-primary to-primary/50 bg-clip-text',
                  )}
                >
                  𝓐𝓷𝖆𝔖
                </span>
              </button>
            </div>

            {/* Social Buttons */}
            <div className='mt-0.5 flex justify-center gap-2 sm:justify-start'>
              {DATA.socials.map((social, index) => (
                <Link
                  key={`social-${social.url}-${index}`}
                  className={cn(
                    buttonVariants({ size: 'icon-sm', variant: 'outline' }),
                    'rounded-lg border-border/50 hover:bg-accent/50 transition-all duration-300 hover:scale-105 active:scale-95',
                  )}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={social.name}
                >
                  <social.icon className='size-4' />
                </Link>
              ))}
            </div>
          </m.div>

          {/* Middle Column: Sections */}
          <m.div
            variants={staggerItem}
            className='col-span-6 flex w-full flex-col items-center text-center sm:col-span-1 sm:items-start sm:text-start'
          >
            <span className='text-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase'>
              {t(DATA.sections.titleKey)}
            </span>
            <div className='flex flex-row flex-wrap justify-center gap-x-4 gap-y-1.5 sm:flex-col sm:items-start sm:gap-2.5'>
              {DATA.navItems.map(({ href, nameKey }) => (
                <Link
                  className='text-muted-foreground hover:text-foreground after:bg-foreground relative w-max pb-0.5 text-xs transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100'
                  href={href}
                  key={nameKey}
                >
                  {t(nameKey)}
                </Link>
              ))}
            </div>
          </m.div>

          {/* Right Column: Projects */}
          <m.div
            variants={staggerItem}
            className='col-span-6 flex w-full flex-col items-center text-center sm:col-span-2 sm:items-start sm:text-start'
          >
            <span className='text-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase'>
              {t(DATA.projects.titleKey)}
            </span>
            <div className='flex flex-row flex-wrap justify-center gap-x-4 gap-y-1.5 sm:flex-col sm:items-start sm:gap-2.5'>
              {DATA.projects.cards.map(({ githubUrl, titleKey }) => (
                <a
                  className='text-muted-foreground hover:text-foreground after:bg-foreground relative w-max pb-0.5 text-xs transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100'
                  href={githubUrl}
                  key={t(titleKey)}
                >
                  {t(titleKey)}
                </a>
              ))}
            </div>
          </m.div>
        </div>

        {/* Bottom copyright section - Stacked and centered on mobile, row-aligned on sm+ */}
        <m.div
          variants={staggerItem}
          className='mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:gap-4'
        >
          <p className='text-muted-foreground/60 text-xs font-light sm:text-start'>
            &copy; {currentYear} 𝓐𝓷𝖆𝔖. {t(DATA.footer.copyrightKey)}
          </p>

          {/* Stroked Backdrop Watermark */}
          <div
            className='text-muted-foreground/15 dark:text-muted-foreground/20 pointer-events-none text-3xl font-black tracking-widest select-none sm:text-4xl'
            style={{
              WebkitTextFillColor: 'transparent',
              WebkitTextStroke: '1px currentColor',
            }}
          >
            PORTFOLIO
          </div>
        </m.div>
      </m.div>
    </footer>
  )
}
