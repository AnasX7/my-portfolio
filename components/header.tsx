'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ThemeSwitcher } from './ui/theme-switcher'
import { useTheme } from 'next-themes'
import { useLenis } from 'lenis/react'
import LanguageSwitcher from './ui/language-switcher'
import { DATA } from '@/data/resume'

export default function Header() {
  const t = useTranslations()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const lenis = useLenis()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  }

  const mobileMenuVariants: Variants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        staggerChildren: 0.1,
      },
    },
  }

  const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  }

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'border-b border-border/50 bg-background/10 shadow-sm backdrop-blur-md'
            : 'bg-transparent'
        }`}
        variants={containerVariants}
        initial='hidden'
        animate='visible'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <motion.div
              className='flex items-center space-x-3'
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <button
                onClick={() =>
                  lenis?.scrollTo(0, {
                    duration: 3,
                  })
                }
                className='flex items-center space-x-3 cursor-pointer'>
                <div className='relative'>
                  <Image
                    src={DATA.profile.avatar}
                    alt={t(DATA.profile.nameKey)}
                    width={36}
                    height={36}
                    className='h-9 w-9 rounded-xl shadow-lg text-white'
                  />
                  <div className='absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-green-400'></div>
                </div>
                <div className='flex flex-col'>
                  <span className='text-lg font-bold text-foreground'>
                    {t(DATA.profile.nameKey)}
                  </span>
                  <span className='-mt-1 text-xs text-muted-foreground'>
                    {t(DATA.profile.roleKey)}
                  </span>
                </div>
              </button>
            </motion.div>

            <nav className='hidden items-center space-x-1 lg:flex'>
              {DATA.navItems.map((item) => (
                <motion.div
                  key={item.nameKey}
                  variants={itemVariants}
                  className='relative'
                  onMouseEnter={() => setHoveredItem(item.nameKey)}
                  onMouseLeave={() => setHoveredItem(null)}>
                  <button
                    role='link'
                    aria-label={t(item.nameKey)}
                    onClick={() =>
                      lenis?.scrollTo(item.href, {
                        offset: -100,
                        duration: 3,
                      })
                    }
                    className='relative cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors duration-200 hover:text-foreground'>
                    {hoveredItem === item.nameKey && (
                      <motion.div
                        className='absolute inset-0 rounded-lg bg-gradient-to-tr from-zinc-200/60 via-zinc-300/60 to-transparent dark:from-zinc-500/60 dark:via-zinc-600/60 dark:to-transparent'
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
                  </button>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className='hidden items-center space-x-3 lg:flex'
              variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <LanguageSwitcher />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <ThemeSwitcher
                  defaultValue='system'
                  onChange={setTheme}
                  value={theme as 'light' | 'dark' | 'system'}
                />
              </motion.div>
            </motion.div>

            <motion.button
              className='rounded-lg p-2 text-foreground transition-colors duration-200 hover:bg-muted lg:hidden'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}>
              {isMobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className='fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className='fixed right-4 top-16 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl lg:hidden'
              variants={mobileMenuVariants}
              initial='closed'
              animate='open'
              exit='closed'>
              <div className='space-y-6 p-6'>
                <div className='space-y-1'>
                  {DATA.navItems.map((item) => (
                    <motion.div
                      key={item.nameKey}
                      variants={mobileItemVariants}>
                      <Link
                        href={item.href}
                        className='block rounded-lg px-4 py-3 font-medium text-foreground transition-colors duration-200 hover:bg-muted'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        {t(item.nameKey)}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className='flex flex-row space-x-3 border-t border-border pt-6'
                  variants={mobileItemVariants}>
                  <ThemeSwitcher
                    defaultValue='system'
                    onChange={setTheme}
                    value={theme as 'light' | 'dark' | 'system'}
                  />

                  <LanguageSwitcher />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
