'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { m, AnimatePresence, Variants } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Menu01Icon, Cancel01Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { AnimatedThemeToggler } from './ui/animated-theme-toggler'
import { Button } from './ui/button'
import LanguageSwitcher from './ui/language-switcher'
import { DATA } from '@/data/resume'
import { useSmoothScroll } from './smooth-scroll-provider'

const DESKTOP_MEDIA_QUERY = '(min-width: 64rem)'

export default function Header() {
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const mobileMenuId = useId()
  const mobileMenuTitleId = useId()
  const headerHomeRef = useRef<HTMLButtonElement>(null)
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null)
  const mobileMenuPanelRef = useRef<HTMLDivElement>(null)

  const { scrollTo, pauseScroll } = useSmoothScroll()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY)
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMobileMenuOpen(false)
    }

    desktopMediaQuery.addEventListener('change', handleDesktopChange)
    return () => desktopMediaQuery.removeEventListener('change', handleDesktopChange)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const panel = mobileMenuPanelRef.current
    const headerHome = headerHomeRef.current
    const trigger = mobileMenuTriggerRef.current
    if (!panel) return

    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    const preventViewportScroll = (event: Event) => {
      if (event.cancelable) event.preventDefault()
    }
    const getFocusableElements = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )

    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus()
    } else {
      panel.focus()
    }

    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.addEventListener('wheel', preventViewportScroll, {
      capture: true,
      passive: false,
    })
    document.addEventListener('touchmove', preventViewportScroll, {
      capture: true,
      passive: false,
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsMobileMenuOpen(false)
        return
      }

      if (event.key !== 'Tab') return

      const currentFocusableElements = getFocusableElements()
      if (currentFocusableElements.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }

      const firstFocusable = currentFocusableElements[0]
      const lastFocusable = currentFocusableElements[currentFocusableElements.length - 1]

      if (!panel.contains(document.activeElement)) {
        event.preventDefault()
        ;(event.shiftKey ? lastFocusable : firstFocusable)?.focus()
        return
      }

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable?.focus()
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocumentOverflow
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('wheel', preventViewportScroll, true)
      document.removeEventListener('touchmove', preventViewportScroll, true)
      const focusTarget = window.matchMedia(DESKTOP_MEDIA_QUERY).matches ? headerHome : trigger
      focusTarget?.focus()
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    return pauseScroll()
  }, [isMobileMenuOpen, pauseScroll])

  const mobileMenuVariants: Variants = {
    closed: {
      opacity: 0,
      y: -8,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: {
        duration: 0.15,
        ease: 'easeOut',
      },
    },
  }

  const mobileItemVariants = {
    closed: { opacity: 0, y: 8 },
    open: { opacity: 1, y: 0 },
  }

  return (
    <>
      <header
        className={`site-header fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'site-header-scrolled border-border/50 bg-background/95 lg:bg-background/50 border-b shadow-sm lg:backdrop-blur-md'
            : 'bg-transparent'
        } ${isMobileMenuOpen ? 'pointer-events-none opacity-40' : ''}`}
        inert={isMobileMenuOpen}
      >
        <div className='site-header-inner mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8'>
          <div className='flex h-14 items-center justify-between'>
            <div className='flex min-w-0 items-center'>
              <button
                ref={headerHomeRef}
                onClick={() =>
                  pathname !== '/'
                    ? router.push('/')
                    : scrollTo(0, {
                        duration: 3,
                      })
                }
                className='group flex min-w-0 cursor-pointer items-center gap-3 text-start'
              >
                <div className='relative shrink-0'>
                  <Image
                    src={DATA.profile.avatarLight}
                    alt={t(DATA.profile.nameKey)}
                    width={36}
                    height={36}
                    className='visible size-9 rounded-xl object-cover text-white shadow-lg transition-transform duration-300 group-hover:scale-105 dark:invisible'
                  />
                  <Image
                    src={DATA.profile.avatarDark}
                    alt={t(DATA.profile.nameKey)}
                    width={36}
                    height={36}
                    className='invisible absolute inset-0 size-9 rounded-xl object-cover text-white shadow-lg transition-transform duration-300 group-hover:scale-105 dark:visible'
                  />
                  {/* Glowing Status Indicator Dot overlaying the avatar (adapts to LTR/RTL bottom corner) */}
                  <span className='absolute -bottom-0.5 flex size-2.5 ltr:-right-0.5 ltr:left-auto rtl:right-auto rtl:-left-0.5'>
                    <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
                    <span className='relative inline-flex size-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#34d399]'></span>
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

            <nav className='absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full px-1.5 py-1 lg:flex'>
              {DATA.navItems.map((item) => (
                <div
                  key={item.nameKey}
                  className='relative'
                  onMouseEnter={() => setHoveredItem(item.nameKey)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href={
                      item.href.startsWith('#') && pathname !== '/' ? `/${item.href}` : item.href
                    }
                    aria-label={t(item.nameKey)}
                    onNavigate={(event) => {
                      if (pathname === '/' && item.href.startsWith('#')) {
                        event.preventDefault()
                        scrollTo(item.href, { offset: -100, duration: 1.8 })
                      }
                    }}
                    className='text-muted-foreground hover:text-foreground focus-visible:outline-ring relative inline-flex h-8 items-center rounded-full px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4'
                  >
                    {hoveredItem === item.nameKey && (
                      <m.div
                        className='bg-secondary dark:bg-secondary/80 absolute inset-0 rounded-full'
                        layoutId='navbar-hover'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className='relative z-10'>{t(item.nameKey)}</span>
                  </Link>
                </div>
              ))}
            </nav>

            <div className='hidden items-center space-x-3 lg:flex'>
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <LanguageSwitcher />
              </m.div>

              <m.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <AnimatedThemeToggler />
              </m.div>
            </div>

            <m.button
              ref={mobileMenuTriggerRef}
              type='button'
              className='text-foreground hover:bg-muted flex size-11 items-center justify-center rounded-lg p-2 transition-colors duration-200 lg:hidden'
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              whileTap={{ scale: 0.96 }}
              aria-label={t('header.toggleMenu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileMenuId}
            >
              <HugeiconsIcon icon={Menu01Icon} className='size-6' />
            </m.button>
          </div>
        </div>
      </header>

      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <>
            <m.div
              className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden='true'
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <m.div
              ref={mobileMenuPanelRef}
              id={mobileMenuId}
              role='dialog'
              aria-modal='true'
              aria-labelledby={mobileMenuTitleId}
              tabIndex={-1}
              className='border-border bg-background fixed inset-x-3 top-2 z-50 mx-auto max-h-[calc(100svh-1rem)] max-w-xl overflow-hidden rounded-3xl border shadow-2xl lg:hidden'
              variants={mobileMenuVariants}
              initial='closed'
              animate='open'
              exit='exit'
            >
              <div className='border-border flex items-center justify-between border-b border-dashed py-[clamp(0.5rem,2.5svh,1rem)] ps-6 pe-3'>
                <h2
                  id={mobileMenuTitleId}
                  className='text-muted-foreground text-xs font-medium tracking-widest uppercase'
                >
                  {t('header.mobileMenu')}
                </h2>
                <Button
                  variant='ghost'
                  size='icon-lg'
                  className='size-11 rounded-xl'
                  aria-label={t('header.closeMenu')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HugeiconsIcon icon={Cancel01Icon} aria-hidden='true' className='size-5' />
                </Button>
              </div>
              <div className='px-5 sm:px-6'>
                <nav aria-labelledby={mobileMenuTitleId}>
                  {DATA.navItems.map((item, index) => (
                    <m.div key={item.nameKey} variants={mobileItemVariants}>
                      <Link
                        href={
                          item.href.startsWith('#') && pathname !== '/'
                            ? `/${item.href}`
                            : item.href
                        }
                        className='group border-border text-foreground hover:text-muted-foreground focus-visible:outline-ring flex min-h-[clamp(3rem,14svh,7rem)] items-center gap-4 border-b border-dashed py-[clamp(0.25rem,2svh,1rem)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4'
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span
                          aria-hidden='true'
                          className='text-muted-foreground self-start pt-2 font-mono text-[11px] tabular-nums'
                        >
                          0{index + 1}
                        </span>
                        <span className='flex-1 text-[clamp(1.5rem,4svh,2.25rem)] font-medium tracking-tight'>
                          {t(item.nameKey)}
                        </span>
                        <HugeiconsIcon
                          icon={ArrowUpRight01Icon}
                          aria-hidden='true'
                          className='text-muted-foreground size-6 transition-transform duration-150 group-hover:-translate-y-0.5 rtl:-scale-x-100'
                        />
                      </Link>
                    </m.div>
                  ))}
                </nav>

                <m.div
                  className='flex items-center justify-between gap-3 py-[clamp(0.5rem,2.5svh,1rem)]'
                  variants={mobileItemVariants}
                >
                  <LanguageSwitcher />
                  <AnimatedThemeToggler className='size-11 rounded-xl' />
                </m.div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
