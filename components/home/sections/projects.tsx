'use client'

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
}: {
  excludeId?: string
  limit?: number
  titleKey?: string | null
  headerAction?: React.ReactNode
  headingLevel?: 1 | 2
  showMoreLink?: boolean
}) {
  const t = useTranslations()
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  const CardHeading = titleKey ? 'h3' : 'h2'

  return (
    <section id='projects' className='relative mt-12 scroll-mt-20 sm:mt-16'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6'>
        {(titleKey || headerAction) && (
          <div
            className={
              headerAction
                ? 'mb-8 flex flex-wrap items-center justify-between gap-4'
                : 'mb-8 text-center'
            }
          >
            {titleKey && (
              <Heading className={headingLevel === 1 ? 'page-title' : 'section-title'}>
                {t(titleKey)}
              </Heading>
            )}
            {headerAction}
          </div>
        )}
        <div className='grid gap-5 sm:gap-6 md:grid-cols-2'>
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
                  <ProjectImageTransition name={`project-${project.id}-image-0`}>
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
                    <CardHeading className='text-2xl leading-tight font-semibold tracking-tight sm:text-3xl'>
                      {t(`projects.slugs.${project.id}`)}
                    </CardHeading>
                    <p className='mt-2 text-sm leading-relaxed text-white/80 sm:text-base'>
                      {t(`projects.summaries.${project.id}`)}
                    </p>
                  </div>
                  {href && (
                    <Link
                      href={href}
                      prefetch={true}
                      aria-label={`${action}: ${t(project.titleKey)}`}
                      className='project-tile-link absolute inset-0 z-20 flex items-start justify-end rounded-[inherit] p-4 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white sm:p-6'
                    >
                      <span className='project-tile-action hidden min-h-11 items-center gap-3 rounded-full border border-white/20 bg-black/60 py-1.5 ps-1.5 pe-4 text-sm font-medium text-white backdrop-blur-md md:inline-flex'>
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
        </div>
        {showMoreLink && (
          <div className='mt-8 flex justify-center sm:mt-10'>
            <Link
              href='/projects'
              className={buttonVariants({
                variant: 'animated',
                className:
                  'min-h-14 px-8 py-3 [&_.inner]:text-base [&_.inner]:font-semibold [&_.inner]:text-foreground',
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
