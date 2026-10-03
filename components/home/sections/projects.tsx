'use client'

import { TextReveal } from '@/components/ui/text-reveal'
import { useRef } from 'react'
import { m, useInView } from 'motion/react'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'
import { useSignatureWelcome } from '@/components/signature-entrance'
import { ProjectImageTransition } from '@/components/ui/page-transition'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import { Add01Icon } from '@hugeicons/core-free-icons'
import { DATA } from '@/data/resume'
import { Link } from '@/i18n/navigation'
import { AnimatedButtonContent, buttonVariants } from '@/components/ui/button'

export default function Projects({
  excludeId,
  limit,
  titleKey = 'projects.showcaseTitle',
  headerAction,
  headingLevel = 2,
  showMoreLink = false,
  imageTransition = true,
}: {
  excludeId?: string
  limit?: number
  titleKey?: string | null
  headerAction?: React.ReactNode
  headingLevel?: 1 | 2
  showMoreLink?: boolean
  imageTransition?: boolean
}) {
  const t = useTranslations()
  const CardHeading = titleKey ? 'h3' : 'h2'
  const trigger = useRef<HTMLDivElement>(null)
  const inView = useInView(trigger, { once: true, margin: '0px 0px -96px 0px' })
  const reducedMotion = useHydratedReducedMotion()
  const welcoming = useSignatureWelcome()
  const revealed = reducedMotion || (inView && !welcoming)

  return (
    <section id='projects' className='content-section relative scroll-mt-20'>
      <div className='section-inner'>
        {(titleKey || headerAction) && (
          <div
            className={
              headerAction
                ? 'mb-8 flex flex-wrap items-center justify-between gap-4'
                : 'mb-8 text-center'
            }
          >
            {titleKey && (
              <TextReveal
                as={headingLevel === 1 ? 'h1' : 'h2'}
                className={headingLevel === 1 ? 'page-title' : 'section-title'}
              >
                {t(titleKey)}
              </TextReveal>
            )}
            {headerAction}
          </div>
        )}
        <div className='relative'>
          {/* Observe the grid's resting top, independent of its animated height and position. */}
          <div
            ref={trigger}
            aria-hidden='true'
            className='pointer-events-none absolute top-0 h-px w-full'
          />
          <m.div
            data-project-grid=''
            initial={{ opacity: 0, y: 96 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 96 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    y: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.45, ease: 'easeOut' },
                  }
            }
            className='grid gap-5 focus-within:transform-none! focus-within:opacity-100! motion-reduce:transform-none! motion-reduce:opacity-100! sm:gap-6 md:grid-cols-2'
          >
            {DATA.projects.cards
              .filter((project) => project.id !== excludeId)
              .slice(0, limit)
              .map((project) => {
                const href = `/projects/${project.id}`
                const action = t('projects.viewDetails')

                return (
                  <article
                    key={project.id}
                    className='project-tile group relative isolate aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-950 text-white sm:aspect-[2/1]'
                  >
                    <ProjectImageTransition
                      name={`project-${project.id}-image-0`}
                      enabled={imageTransition}
                    >
                      <div className='absolute inset-0 overflow-hidden rounded-[inherit]'>
                        <Image
                          src={project.images[0]}
                          alt={t(project.imageAltKeys[0])}
                          fill
                          quality={90}
                          sizes='(min-width: 1152px) 540px, (min-width: 768px) 50vw, 100vw'
                          className='object-cover object-top'
                        />
                      </div>
                    </ProjectImageTransition>
                    <div
                      aria-hidden='true'
                      className='pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent'
                    />
                    <div className='project-tile-caption pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8'>
                      <TextReveal
                        as={CardHeading}
                        className='text-2xl leading-tight font-semibold tracking-tight sm:text-3xl'
                      >
                        {t(`projects.slugs.${project.id}`)}
                      </TextReveal>
                      <TextReveal
                        as='p'
                        delay={0.08}
                        className='mt-2 text-sm leading-relaxed text-white/80 sm:text-base'
                      >
                        {t(`projects.summaries.${project.id}`)}
                      </TextReveal>
                    </div>
                    {href && (
                      <Link
                        href={href}
                        prefetch={true}
                        aria-label={`${action}: ${t(project.titleKey)}`}
                        className='project-tile-link absolute inset-0 z-20 flex items-start justify-end rounded-[inherit] p-4 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white sm:p-6'
                      >
                        <span className='project-tile-action hidden min-h-11 items-center gap-3 rounded-full border border-white/20 bg-black/60 py-1.5 ps-1.5 pe-4 text-sm font-medium text-white backdrop-blur-md xl:inline-flex'>
                          <span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-black'>
                            <HugeiconsIcon icon={Add01Icon} aria-hidden='true' className='size-5' />
                          </span>
                          {action}
                        </span>
                      </Link>
                    )}
                  </article>
                )
              })}
          </m.div>
        </div>
        {showMoreLink && (
          <div className='mt-8 flex justify-center sm:mt-10'>
            <Link
              href='/projects'
              className={buttonVariants({
                variant: 'secondary',
                size: 'lg',
              })}
            >
              <AnimatedButtonContent>{t('projects.fewMore')}</AnimatedButtonContent>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
