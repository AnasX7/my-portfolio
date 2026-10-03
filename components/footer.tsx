'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowUpRight01Icon,
  Call02Icon,
  LaptopIcon,
  Location02Icon,
  Mail01Icon,
} from '@hugeicons/core-free-icons'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { DATA } from '@/data/resume'
import { buttonVariants } from '@/components/ui/button'
import { PROJECT_DETAILS_PUBLIC } from '@/lib/features'
import { useSmoothScroll } from '@/components/smooth-scroll-provider'
import FooterSignature from '@/components/footer-signature'

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'start center'],
  })
  const blurOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const { scrollTo } = useSmoothScroll()
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()
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
    <>
      <footer ref={footerRef} className='site-footer relative isolate w-full bg-transparent'>
        <m.div
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
          className='site-footer-inner relative isolate z-10 mx-auto py-6 sm:py-8 lg:py-12'
        >
          <div
            aria-hidden='true'
            className='footer-pattern pointer-events-none absolute inset-x-0 top-0 -z-15 h-[46%] dark:hidden'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(0,0,0,0.045)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
            }}
          />
          <div
            aria-hidden='true'
            className='footer-pattern pointer-events-none absolute inset-x-0 top-0 -z-15 hidden h-[46%] dark:block'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='0' y='0' width='80' height='80' fill='none' stroke='rgba(255,255,255,0.045)' stroke-width='1' rx='8' ry='8'/%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
            }}
          />
          <div className='footer-light' aria-hidden='true' />
          <div className='footer-navigation-grid relative z-10 grid grid-cols-12 gap-6 sm:gap-8'>
            {/* Left Column: Brand, Socials */}
            <m.div
              variants={staggerItem}
              className='col-span-12 flex flex-col items-center gap-3 text-center sm:col-span-4 sm:items-start sm:text-start'
            >
              <div className='flex min-w-0 items-center'>
                <button
                  type='button'
                  aria-label={t('header.home')}
                  onClick={() =>
                    pathname !== '/'
                      ? router.push('/')
                      : scrollTo(0, {
                          duration: 1.8,
                        })
                  }
                  className='group flex min-w-0 cursor-pointer items-center gap-3 text-start focus:outline-hidden'
                >
                  <div className='relative shrink-0'>
                    <Image
                      src={DATA.profile.avatarLight}
                      loading='eager'
                      alt={t(DATA.profile.nameKey)}
                      width={36}
                      height={36}
                      className='visible size-9 rounded-xl object-cover text-white shadow-lg transition-transform duration-300 group-hover:scale-105 dark:invisible'
                    />
                    <Image
                      src={DATA.profile.avatarDark}
                      loading='eager'
                      alt={t(DATA.profile.nameKey)}
                      width={36}
                      height={36}
                      className='invisible absolute inset-0 size-9 rounded-xl object-cover text-white shadow-lg transition-transform duration-300 group-hover:scale-105 dark:visible'
                    />
                    <span className='absolute -bottom-0.5 flex size-2.5 ltr:-right-0.5 ltr:left-auto rtl:right-auto rtl:-left-0.5'>
                      <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                      <span className='relative inline-flex size-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#34d399]' />
                    </span>
                  </div>
                  <div className='flex min-w-0 flex-col justify-center'>
                    <span className='text-foreground truncate text-lg leading-tight font-bold rtl:leading-[1.2]'>
                      {t(DATA.profile.nameKey)}
                    </span>
                    <span className='text-muted-foreground mt-0.5 truncate text-xs leading-none rtl:leading-[1.2]'>
                      {t(DATA.profile.roleKey)}
                    </span>
                  </div>
                </button>
              </div>

              {/* Social Buttons */}
              <div className='mt-0.5 flex justify-center gap-2 sm:justify-start'>
                {DATA.socials
                  .filter((social) => !social.url.startsWith('mailto:'))
                  .map((social, index) => (
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
              className='col-span-12 flex w-full flex-col items-center text-center sm:col-span-2 sm:col-start-6 sm:items-start sm:text-start'
            >
              <span className='text-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase'>
                {t('footer.explore')}
              </span>
              <div className='flex flex-row flex-wrap justify-center gap-x-4 gap-y-1.5 sm:flex-col sm:items-start sm:gap-2.5'>
                {DATA.footer.navItems.map(({ href, nameKey }) => (
                  <Link
                    className='text-muted-foreground hover:text-foreground after:bg-foreground relative inline-flex min-h-6 max-w-full items-center pb-0.5 text-xs transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100'
                    href={href.startsWith('#') && pathname !== '/' ? `/${href}` : href}
                    onNavigate={(event) => {
                      if (pathname === '/' && href.startsWith('#')) {
                        event.preventDefault()
                        scrollTo(href, { offset: -100, duration: 1.8 })
                      }
                    }}
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
              className='col-span-12 flex w-full flex-col items-center text-center sm:col-span-3 sm:col-start-9 sm:items-start sm:text-start'
            >
              <span className='text-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase'>
                {t('footer.selectedProjects')}
              </span>
              <div className='flex flex-row flex-wrap justify-center gap-x-4 gap-y-1.5 sm:flex-col sm:items-start sm:gap-2.5'>
                {DATA.projects.cards.slice(0, 3).map(({ id: slug }) =>
                  PROJECT_DETAILS_PUBLIC ? (
                    <Link
                      className='text-muted-foreground hover:text-foreground after:bg-foreground relative inline-flex min-h-6 max-w-full items-center pb-0.5 text-xs transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100'
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
                <Link
                  href='/projects'
                  className='text-foreground focus-visible:outline-ring mt-1 inline-flex min-h-8 items-center gap-1.5 text-xs font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4'
                >
                  {t('footer.viewAllProjects')}
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    aria-hidden='true'
                    className='size-3.5 shrink-0 rtl:-scale-x-100'
                  />
                </Link>
              </div>
            </m.div>

            {/* Contact Column */}
            <m.div
              variants={staggerItem}
              className='col-span-12 flex w-full flex-col items-center text-center sm:col-span-3 sm:items-start sm:text-start'
            >
              <span className='text-foreground mb-1.5 block text-xs font-semibold tracking-wider uppercase'>
                {t('footer.contactTitle')}
              </span>
              <div className='flex flex-col items-center gap-2.5 sm:items-start'>
                <a
                  href='mailto:anassalem.aa@gmail.com'
                  className='text-muted-foreground hover:text-foreground inline-flex min-h-6 items-center gap-2 text-xs transition-colors'
                >
                  <HugeiconsIcon icon={Mail01Icon} aria-hidden='true' className='size-4 shrink-0' />
                  <span dir='ltr' className='break-all'>
                    anassalem.aa@gmail.com
                  </span>
                </a>
                <a
                  href='tel:+971564949464'
                  className='text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-xs transition-colors'
                >
                  <HugeiconsIcon icon={Call02Icon} aria-hidden='true' className='size-4 shrink-0' />
                  <span dir='ltr'>+971 564949464</span>
                </a>
                <span className='text-muted-foreground inline-flex items-center gap-2 text-xs'>
                  <HugeiconsIcon
                    icon={Location02Icon}
                    aria-hidden='true'
                    className='size-4 shrink-0'
                  />
                  {t('footer.location')}
                </span>
                <span className='text-muted-foreground inline-flex items-center gap-2 text-xs'>
                  <HugeiconsIcon icon={LaptopIcon} aria-hidden='true' className='size-4 shrink-0' />
                  {t('footer.remoteWork')}
                </span>
              </div>
            </m.div>
          </div>

          <FooterSignature key={pathname} />

          {/* Bottom copyright section - Stacked and centered on mobile, row-aligned on sm+ */}
          <m.div
            variants={staggerItem}
            className='relative z-10 mt-auto flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:gap-4'
          >
            <p className='text-muted-foreground/60 text-xs font-light sm:text-start'>
              &copy; {currentYear} 𝓐𝓷𝖆𝔖. {t(DATA.footer.copyrightKey)}
            </p>
            <Link
              href='/privacy'
              className='text-muted-foreground hover:text-foreground text-xs underline underline-offset-4'
            >
              {t('contact.privacy.title')}
            </Link>
          </m.div>
        </m.div>
      </footer>
      <div className='viewport-bottom-blur' aria-hidden='true'>
        <m.span style={{ opacity: blurOpacity }} />
        <m.span style={{ opacity: blurOpacity }} />
      </div>
    </>
  )
}
