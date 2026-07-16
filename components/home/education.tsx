'use client'

import { useState } from 'react'
import { m } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'
import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUpRightIcon } from '@hugeicons/core-free-icons'
import { getAboutMotion } from '@/components/home/about-motion'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

interface InstitutionLogoProps {
  name: string
  url: string
  fallbackChar: string
  logoBg?: string
  logoPadding?: boolean
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

const InstitutionLogo = ({
  name,
  url,
  fallbackChar,
  logoBg,
  logoPadding,
}: InstitutionLogoProps) => {
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

export default function Education() {
  const t = useTranslations()
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const reduceMotion = useHydratedReducedMotion()
  const motion = getAboutMotion(Boolean(reduceMotion), isRtl ? -1 : 1)

  return (
    <m.div variants={motion.list} className='flex flex-col gap-6 overflow-x-clip py-2'>
      {DATA.education.map((item) => {
        const fallbackChar = t(item.institutionKey).charAt(0)

        // 1. Grouped certifications layout (e.g. Meta Certifications)
        if (item.certifications) {
          return (
            <m.div
              key={item.id}
              variants={motion.item}
              className='border-border/20 flex flex-col border-b pb-6 last:border-0 last:pb-0'
            >
              {/* Institution Header Row (Static) */}
              <div className='flex items-center gap-4'>
                <InstitutionLogo
                  name={t(item.institutionKey)}
                  url={item.logo}
                  fallbackChar={fallbackChar}
                  logoBg={item.logoBg}
                  logoPadding={item.logoPadding}
                />
                <div className='flex min-w-0 flex-col'>
                  <span className='text-foreground text-base font-semibold sm:text-lg'>
                    {t(item.institutionKey)}
                  </span>
                  {item.totalDurationKey && (
                    <span className='text-muted-foreground mt-0.5 text-sm font-normal'>
                      {t(item.totalDurationKey)}
                    </span>
                  )}
                </div>
              </div>

              {/* Nested Certifications list connected by a vertical timeline line */}
              <m.div variants={motion.list} className='relative mt-4 flex flex-col gap-6 pl-14'>
                {/* Vertical Connector Line */}
                <m.div
                  variants={motion.timeline}
                  className='absolute top-0 bottom-4 left-[23px] w-0.5 origin-top bg-neutral-200 dark:bg-neutral-800'
                />

                {item.certifications.map((cert) => {
                  const certContent = (
                    <div className='flex min-w-0 flex-col sm:flex-1'>
                      <div className='flex items-start gap-1.5'>
                        <span className='text-foreground group-hover/cert:text-primary text-base font-semibold text-pretty break-words transition-colors'>
                          {t(cert.titleKey)}
                        </span>
                        {cert.url && (
                          <HugeiconsIcon
                            icon={ArrowUpRightIcon}
                            className='text-muted-foreground group-hover/cert:text-primary mt-1 size-3.5 shrink-0 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover/cert:translate-x-0 group-hover/cert:translate-y-0 group-hover/cert:opacity-100'
                          />
                        )}
                      </div>
                      {cert.credentialKey && (
                        <span className='text-muted-foreground mt-0.5 text-sm font-normal [overflow-wrap:anywhere]'>
                          {t(cert.credentialKey)}
                        </span>
                      )}
                    </div>
                  )

                  const certDate = (
                    <span className='text-muted-foreground/80 shrink-0 self-start pt-0 text-start text-xs font-normal whitespace-nowrap tabular-nums sm:self-auto sm:pt-0.5 sm:text-end sm:text-sm'>
                      {t(cert.dateKey)}
                    </span>
                  )

                  return (
                    <m.div key={cert.id} variants={motion.item} className='relative flex flex-col'>
                      {/* Timeline Dot */}
                      <div className='absolute top-1.5 left-[-37px] flex w-2.5 justify-center'>
                        <div className='border-background size-2.5 rounded-full border-2 bg-neutral-300 dark:bg-neutral-700' />
                      </div>

                      {/* Certification Item */}
                      {cert.url ? (
                        <a
                          href={cert.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='group/cert flex w-full cursor-pointer flex-col items-stretch gap-1 text-start focus:outline-hidden sm:flex-row sm:items-start sm:justify-between sm:gap-4'
                        >
                          {certContent}
                          {certDate}
                        </a>
                      ) : (
                        <div className='flex w-full flex-col items-stretch gap-1 text-start sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
                          {certContent}
                          {certDate}
                        </div>
                      )}
                    </m.div>
                  )
                })}
              </m.div>
            </m.div>
          )
        }

        // 2. Single educational layout (e.g. University)
        const dateBlock = (
          <span className='text-muted-foreground/80 ms-16 shrink-0 self-start pt-0 text-start text-xs font-normal whitespace-nowrap tabular-nums sm:ms-0 sm:self-auto sm:pt-0.5 sm:text-end sm:text-sm'>
            {t(item.dateKey!)}
          </span>
        )

        if (item.url) {
          return (
            <m.a
              key={item.id}
              variants={motion.item}
              href={item.url}
              target='_blank'
              rel='noopener noreferrer'
              className='group/edu border-border/20 flex flex-col items-stretch gap-2 border-b pb-6 last:border-0 last:pb-0 focus:outline-hidden sm:flex-row sm:items-start sm:justify-between sm:gap-4'
            >
              <div className='flex w-full min-w-0 items-start gap-4 sm:flex-1'>
                <InstitutionLogo
                  name={t(item.institutionKey)}
                  url={item.logo!}
                  fallbackChar={fallbackChar}
                  logoBg={item.logoBg}
                  logoPadding={item.logoPadding}
                />
                <div className='flex min-w-0 flex-col'>
                  <div className='flex items-start gap-1.5'>
                    <span className='text-foreground group-hover/edu:text-primary text-base font-semibold text-pretty break-words transition-colors sm:text-lg'>
                      {t(item.institutionKey)}
                    </span>
                    <HugeiconsIcon
                      icon={ArrowUpRightIcon}
                      className='text-muted-foreground group-hover/edu:text-primary mt-1 size-3.5 shrink-0 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover/edu:translate-x-0 group-hover/edu:translate-y-0 group-hover/edu:opacity-100'
                    />
                  </div>
                  <span className='text-muted-foreground mt-0.5 text-sm break-words whitespace-pre-line sm:text-base'>
                    {t(item.degreeKey!)}
                  </span>
                </div>
              </div>
              {dateBlock}
            </m.a>
          )
        }

        return (
          <m.div
            key={item.id}
            variants={motion.item}
            className='border-border/20 flex flex-col items-stretch gap-2 border-b pb-6 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4'
          >
            <div className='flex w-full min-w-0 items-start gap-4 sm:flex-1'>
              <InstitutionLogo
                name={t(item.institutionKey)}
                url={item.logo!}
                fallbackChar={fallbackChar}
                logoBg={item.logoBg}
                logoPadding={item.logoPadding}
              />
              <div className='flex min-w-0 flex-col'>
                <span className='text-foreground text-base font-semibold text-pretty break-words sm:text-lg'>
                  {t(item.institutionKey)}
                </span>
                <span className='text-muted-foreground mt-0.5 text-sm break-words whitespace-pre-line sm:text-base'>
                  {t(item.degreeKey!)}
                </span>
              </div>
            </div>
            {dateBlock}
          </m.div>
        )
      })}
    </m.div>
  )
}
