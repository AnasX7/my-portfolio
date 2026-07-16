'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'
import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronRightIcon } from '@hugeicons/core-free-icons'
import { getAboutMotion } from '@/components/home/about-motion'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

interface CompanyLogoProps {
  name: string
  url: string
  fallbackChar: string
  logoBg?: string
  logoPadding?: boolean
}

const CompanyLogo = ({ name, url, fallbackChar, logoBg, logoPadding }: CompanyLogoProps) => {
  const [error, setError] = useState(false)
  const hasImage = !error && url

  return (
    <div
      className={cn(
        'text-foreground relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border shadow-xs select-none',
        logoPadding
          ? 'border-border dark:border-white/20'
          : 'border-border/40 dark:border-white/10',
        (!logoBg || !logoPadding) && 'bg-zinc-900/50 dark:bg-white/5',
        hasImage && logoPadding && 'p-2',
      )}
      style={logoBg && logoPadding ? { backgroundColor: logoBg } : undefined}
    >
      {error || !url ? (
        <DefaultCompanyLogo />
      ) : (
        <img
          src={url}
          alt={name}
          onError={() => setError(true)}
          className={cn(
            'pointer-events-none size-full select-none',
            logoPadding ? 'object-contain' : 'rounded-full object-cover',
          )}
        />
      )}
    </div>
  )
}

const DefaultCompanyLogo = () => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128' className='size-full'>
    {/* Light Mode Group */}
    <g className='block dark:hidden'>
      <path fill='#e7e2dc' d='M0 0h128v128H0z' />
      <path fill='#9db3c8' d='M48 16h64v112H48z' />
      <path fill='#788fa5' d='M16 80h32v48H16z' />
      <path fill='#56687a' d='M48 80h32v48H48z' />
    </g>
    {/* Dark Mode Group */}
    <g className='hidden dark:block'>
      <path fill='#38434f' d='M0 0h128v128H0z' />
      <path fill='#9db3c8' d='M48 16h64v112H48z' />
      <path fill='#788fa5' d='M16 80h32v48H16z' />
      <path fill='#56687a' d='M48 80h32v48H48z' />
    </g>
  </svg>
)

export default function WorkExperience() {
  const t = useTranslations()
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const reduceMotion = useHydratedReducedMotion()
  const motion = getAboutMotion(Boolean(reduceMotion), isRtl ? -1 : 1)

  // Manage expanded items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <m.div variants={motion.list} className='flex flex-col gap-6 py-2'>
      {DATA.workExperience.map((item) => {
        const fallbackChar = t(item.companyKey).charAt(0)

        // 1. Grouped roles layout (e.g. GTK TECH Pro)
        if (item.roles) {
          return (
            <m.div
              key={item.id}
              variants={motion.item}
              className='border-border/20 flex flex-col border-b pb-6 last:border-0 last:pb-0'
            >
              {/* Company Header Row (Static) */}
              <div className='flex items-center gap-4'>
                <CompanyLogo
                  name={t(item.companyKey)}
                  url={item.logo}
                  fallbackChar={fallbackChar}
                  logoBg={item.logoBg}
                  logoPadding={item.logoPadding}
                />
                <div className='flex min-w-0 flex-col'>
                  <span className='text-foreground text-base font-semibold sm:text-lg'>
                    {t(item.companyKey)}
                  </span>
                  {item.totalDurationKey && (
                    <span className='text-muted-foreground mt-0.5 text-sm font-normal'>
                      {t(item.totalDurationKey)}
                    </span>
                  )}
                  {item.globalLocationKey && (
                    <span className='text-muted-foreground/75 mt-0.5 text-xs font-normal sm:text-sm'>
                      {t(item.globalLocationKey)}
                    </span>
                  )}
                </div>
              </div>

              {/* Nested Roles list connected by a vertical timeline line */}
              <m.div variants={motion.list} className='relative mt-4 flex flex-col gap-6 pl-14'>
                {/* Vertical Connector Line */}
                <m.div
                  variants={motion.timeline}
                  className='absolute top-0 bottom-4 left-[23px] w-0.5 origin-top bg-neutral-200 dark:bg-neutral-800'
                />

                {item.roles.map((role) => {
                  const isExpanded = !!expandedItems[role.id]
                  return (
                    <m.div key={role.id} variants={motion.item} className='relative flex flex-col'>
                      {/* Timeline Dot */}
                      <div className='absolute top-1.5 left-[-37px] flex w-2.5 justify-center'>
                        <div className='border-background size-2.5 rounded-full border-2 bg-neutral-300 dark:bg-neutral-700' />
                      </div>

                      {/* Accordion Role Toggle Button */}
                      <button
                        onClick={() => toggleItem(role.id)}
                        className='group flex cursor-pointer items-start justify-between gap-4 text-start focus:outline-hidden'
                      >
                        <div className='flex min-w-0 flex-col'>
                          <div className='flex items-center gap-1.5'>
                            <span className='text-foreground group-hover:text-primary text-base font-semibold transition-colors'>
                              {t(role.titleKey)}
                            </span>
                            <HugeiconsIcon
                              icon={ChevronRightIcon}
                              className={cn(
                                'size-4 text-muted-foreground transition-transform duration-300',
                                isRtl
                                  ? isExpanded
                                    ? 'rotate-270'
                                    : 'rotate-180'
                                  : isExpanded
                                    ? '-rotate-90'
                                    : 'rotate-0',
                              )}
                            />
                          </div>
                          <span className='text-muted-foreground mt-0.5 text-sm font-normal'>
                            {t(role.employmentTypeKey)}
                          </span>
                        </div>

                        {/* Role Date Range */}
                        <span className='text-muted-foreground/80 shrink-0 pt-0.5 text-right text-xs font-normal sm:text-sm'>
                          {t(role.dateKey)}
                        </span>
                      </button>

                      {/* Collapsible Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <m.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{
                              height: 'auto',
                              opacity: 1,
                              marginTop: 8,
                              transition: {
                                height: { duration: 0.35, ease: 'easeOut' },
                                opacity: { duration: 0.25, delay: 0.1 },
                              },
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              marginTop: 0,
                              transition: {
                                height: { duration: 0.3, ease: 'easeIn' },
                                opacity: { duration: 0.15 },
                              },
                            }}
                            className='overflow-hidden'
                          >
                            <p className='text-muted-foreground/90 text-sm leading-relaxed text-pretty whitespace-pre-line sm:text-base'>
                              {t(role.descriptionKey)}
                            </p>

                            {/* Skills Pills */}
                            {role.skills && (
                              <div className='mt-3 flex flex-wrap gap-1.5'>
                                {role.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className='text-muted-foreground rounded-full border border-black/10 bg-black/[0.01] px-2.5 py-0.5 text-xs font-normal select-none dark:border-white/10 dark:bg-white/[0.03]'
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </m.div>
                  )
                })}
              </m.div>
            </m.div>
          )
        }

        // 2. Single role layout (e.g. Specialized Council, Freelance)
        const isExpanded = !!expandedItems[item.id]
        return (
          <m.div
            key={item.id}
            layout='position'
            variants={motion.item}
            transition={{ layout: { duration: 0.2 } }}
            className='border-border/20 flex flex-col border-b pb-6 last:border-0 last:pb-0'
          >
            {/* Header Row */}
            <button
              onClick={() => toggleItem(item.id)}
              className='group flex cursor-pointer items-start justify-between gap-4 text-start focus:outline-hidden'
            >
              <div className='flex min-w-0 items-start gap-4'>
                <CompanyLogo
                  name={t(item.companyKey)}
                  url={item.logo}
                  fallbackChar={fallbackChar}
                  logoBg={item.logoBg}
                  logoPadding={item.logoPadding}
                />
                <div className='flex min-w-0 flex-col'>
                  <div className='flex items-center gap-1.5'>
                    <span className='text-foreground group-hover:text-primary truncate text-base font-semibold transition-colors sm:text-lg'>
                      {t(item.titleKey!)}
                    </span>
                    <HugeiconsIcon
                      icon={ChevronRightIcon}
                      className={cn(
                        'size-4 text-muted-foreground transition-transform duration-300',
                        isRtl
                          ? isExpanded
                            ? 'rotate-270'
                            : 'rotate-180'
                          : isExpanded
                            ? '-rotate-90'
                            : 'rotate-0',
                      )}
                    />
                  </div>
                  <span className='text-muted-foreground mt-0.5 text-sm font-medium sm:text-base'>
                    {t(item.companyKey)} ·{' '}
                    <span className='text-muted-foreground/80 font-normal'>
                      {t(item.employmentTypeKey!)}
                    </span>
                  </span>
                  <span className='text-muted-foreground/75 mt-0.5 text-xs font-normal sm:text-sm'>
                    {t(item.locationKey!)}
                  </span>
                </div>
              </div>

              {/* Date Column */}
              <span className='text-muted-foreground/80 shrink-0 pt-0.5 text-right text-xs font-normal sm:pt-1 sm:text-sm'>
                {t(item.dateKey!)}
              </span>
            </button>

            {/* Collapsible Content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <m.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    marginTop: 12,
                    transition: {
                      height: { duration: 0.35, ease: 'easeOut' },
                      opacity: { duration: 0.25, delay: 0.1 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    marginTop: 0,
                    transition: {
                      height: { duration: 0.3, ease: 'easeIn' },
                      opacity: { duration: 0.15 },
                    },
                  }}
                  className={cn('overflow-hidden', isRtl ? 'pr-16' : 'pl-16')}
                >
                  <p className='text-muted-foreground/90 text-sm leading-relaxed text-pretty whitespace-pre-line sm:text-base'>
                    {t(item.descriptionKey!)}
                  </p>

                  {/* Skills Pills */}
                  {item.skills && (
                    <div className='mt-3 flex flex-wrap gap-1.5'>
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className='text-muted-foreground rounded-full border border-black/10 bg-black/[0.01] px-2.5 py-0.5 text-xs font-normal select-none dark:border-white/10 dark:bg-white/[0.03]'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        )
      })}
    </m.div>
  )
}
