'use client'

import { m } from 'motion/react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { DATA } from '@/data/resume'
import { buttonVariants } from '@/components/ui/button'
import { PROJECT_DETAILS_PUBLIC } from '@/lib/features'
import { useSmoothScroll } from '@/components/smooth-scroll-provider'

export default function Footer() {
  const { scrollTo } = useSmoothScroll()
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
        whileInView={{
          backgroundPosition: ['0px 0px', '80px 80px'],
        }}
        viewport={{ amount: 0.1 }}
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
        whileInView={{
          backgroundPosition: ['0px 0px', '80px 80px'],
        }}
        viewport={{ amount: 0.1 }}
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

      {/* Bottom Ambient Backlight Beam (Shining Upward, breathing in sync) */}
      <m.div
        whileInView={{
          opacity: [0.4, 0.8, 0.4],
        }}
        viewport={{ amount: 0.1 }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='from-primary/10 dark:from-primary/15 pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-20 origin-bottom bg-linear-to-t to-transparent'
      />

      {/* Bottom Glowing Accent Line (Core + Animating Bloom) */}
      <div className='via-primary/30 dark:via-primary/50 pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[1px] bg-linear-to-r from-transparent to-transparent' />
      <m.div
        whileInView={{
          opacity: [0.15, 0.45, 0.15],
          scaleY: [1, 1.4, 1],
        }}
        viewport={{ amount: 0.1 }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className='via-primary/20 dark:via-primary/40 pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[3px] origin-bottom bg-linear-to-r from-transparent to-transparent blur-[2px]'
      />

      <m.div
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        className='mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'
      >
        <div className='grid grid-cols-12 gap-6 sm:gap-8'>
          {/* Left Column: Brand, Socials */}
          <m.div
            variants={staggerItem}
            className='col-span-12 flex flex-col items-center gap-3 text-center sm:col-span-6 sm:items-start sm:text-start'
          >
            <div className='group relative flex flex-col items-center sm:items-start'>
              <button
                type='button'
                aria-label={t('header.home')}
                onClick={() =>
                  scrollTo(0, {
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

            {/* Active Status Badge */}
            <div className='border-border/30 flex w-fit items-center gap-2.5 rounded-full border bg-zinc-950/80 px-4 py-1.5 text-sm font-medium text-zinc-200 backdrop-blur-xs select-none dark:bg-zinc-900/60 dark:text-zinc-200'>
              <span className='relative flex size-2.5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
                <span className='relative inline-flex size-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399]'></span>
              </span>
              <span>{t('contact.availableForWork')}</span>
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
            className='col-span-12 flex w-full flex-col items-center text-center sm:col-span-2 sm:col-start-8 sm:items-start sm:text-start'
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
            className='col-span-12 flex w-full flex-col items-center text-center sm:col-span-2 sm:col-start-11 sm:items-start sm:text-start'
          >
            <span className='text-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase'>
              {t(DATA.projects.titleKey)}
            </span>
            <div className='flex flex-row flex-wrap justify-center gap-x-4 gap-y-1.5 sm:flex-col sm:items-start sm:gap-2.5'>
              {DATA.projects.cards.map(({ id: slug }) =>
                PROJECT_DETAILS_PUBLIC ? (
                  <Link
                    className='text-muted-foreground hover:text-foreground after:bg-foreground relative w-max pb-0.5 text-xs transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100'
                    href={`/projects/${slug}`}
                    key={slug}
                  >
                    {t(`projects.slugs.${slug}`)}
                  </Link>
                ) : (
                  <span className='text-muted-foreground text-xs' key={slug}>
                    {t(`projects.slugs.${slug}`)}
                  </span>
                ),
              )}
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
