'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { ArrowUpLeftIcon, ArrowUpRightIcon } from '@hugeicons/core-free-icons'
import { DATA } from '@/data/resume'
import { Card, CardDecorator, CardDescription, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Link, useRouter } from '@/i18n/navigation'
import { MagneticLinkPreview } from '@/components/ui/magnetic-link-preview'
import ScrollStack, { ScrollStackItem } from '@/components/ui/scroll-stack'
import { PROJECT_DETAILS_PUBLIC } from '@/lib/features'
import { cn } from '@/lib/utils'

const getTechIconUrl = (tech: string) => {
  const slugMap: Record<string, string> = {
    'next.js': 'nextdotjs',
    expo: 'expo',
    'react native': 'react',
    hono: 'hono',
    prisma: 'prisma',
    'better auth': 'betterauth',
    turborepo: 'turborepo',
    nativewind: 'tailwindcss',
    zustand: '/icons/zustand.svg',
    'react query': 'reactquery',
    axios: 'axios',
    typescript: 'typescript',
    laravel: 'laravel',
    tailwindcss: 'tailwindcss',
    postgresql: 'postgresql',
    docker: 'docker',
  }
  const clean = tech.toLowerCase().trim()
  if (clean === 'better auth') {
    return 'https://cdn.simpleicons.org/betterauth/000000'
  }
  const slug = slugMap[clean] || clean.replace(/\s+/g, '')
  if (slug.startsWith('/')) {
    return slug
  }
  return `https://cdn.simpleicons.org/${slug}`
}

export default function Projects() {
  const t = useTranslations()

  return (
    <section id='projects' className='relative mt-12 sm:mt-16'>
      <div className='mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-6xl'>
        <h2 className='text-foreground mb-8 text-2xl font-bold tracking-tight sm:text-3xl'>
          {t('projects.title')}
        </h2>
        <ScrollStack>
          {DATA.projects.cards.map((project) => (
            <ScrollStackItem key={project.titleKey}>
              <ProjectCard
                slug={project.id}
                title={t(project.titleKey)}
                description={t(project.descriptionKey)}
                stack={project.stack}
                githubUrl={project.githubUrl}
                isLive={project.isLive}
                liveUrl={project.liveUrl}
                images={project.images}
                imageAlts={project.imageAltKeys.map((key) => t(key))}
                demoCredentials={(project as any).demoCredentials}
              />
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  )
}

interface ProjectCardProps {
  slug: string
  title: string
  description: string
  stack: string[]
  githubUrl?: string | null
  isLive: boolean
  liveUrl?: string | null
  images: string[]
  imageAlts: string[]
  demoCredentials?: {
    email: string
    password: string
  } | null
}

function ProjectCard({
  slug,
  title,
  description,
  stack,
  githubUrl,
  isLive,
  liveUrl,
  images,
  imageAlts,
  demoCredentials,
}: ProjectCardProps) {
  const t = useTranslations()
  const local = useLocale()
  const isRtl = local === 'ar'
  const router = useRouter()

  // Copy state
  const [copiedText, setCopiedText] = useState<'email' | 'password' | null>(null)

  const handleCopy = (e: React.MouseEvent, text: string, type: 'email' | 'password') => {
    e.stopPropagation() // Prevent triggering card navigation
    navigator.clipboard.writeText(text)
    setCopiedText(type)
    setTimeout(() => setCopiedText(null), 2000)
  }

  // Click card to navigate
  const handleCardClick = (e: React.MouseEvent) => {
    if (!PROJECT_DETAILS_PUBLIC) return

    const target = e.target as HTMLElement
    // Ignore interactive elements
    if (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('code') ||
      target.closest('svg')
    ) {
      return
    }
    router.push(`/projects/${slug}`)
  }

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        'bg-card border-border/60 hover:border-border/80 relative flex h-auto flex-col gap-4 overflow-hidden rounded-3xl p-5 transition-all hover:brightness-[1.03] sm:gap-6 sm:p-6 lg:h-80 lg:flex-row lg:gap-8 lg:p-6',
        PROJECT_DETAILS_PUBLIC && 'cursor-pointer',
      )}
    >
      <CardDecorator />
      <div className='z-10 flex h-full w-full flex-col gap-4 p-0 sm:gap-6 lg:w-[65%] lg:justify-center lg:gap-4'>
        <CardTitle className='w-fit text-xl font-semibold md:text-2xl'>{title}</CardTitle>
        <CardDescription className='text-sm md:text-base'>{description}</CardDescription>

        {/* Demo Credentials */}
        {demoCredentials && (
          <div className='text-muted-foreground flex w-fit flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-zinc-500/10 bg-zinc-500/5 px-3 py-1.5 font-mono text-xs select-none dark:border-zinc-400/10 dark:bg-zinc-400/5'>
            <span className='text-foreground flex items-center gap-1.5 font-sans font-medium'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='size-3.5'
              >
                <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
                <path d='M7 11V7a5 5 0 0 1 10 0v4' />
              </svg>
              {isRtl ? 'حساب تجريبي:' : 'Demo Account:'}
            </span>
            <span>
              {isRtl ? 'البريد:' : 'Email:'}{' '}
              <code
                onClick={(e) => handleCopy(e, demoCredentials.email, 'email')}
                className='text-foreground cursor-pointer rounded bg-zinc-500/10 px-1.5 py-0.5 transition-all select-all hover:bg-zinc-500/20 active:scale-95 dark:bg-zinc-400/10 dark:hover:bg-zinc-400/20'
                title={isRtl ? 'اضغط للنسخ' : 'Click to copy'}
              >
                {copiedText === 'email' ? (isRtl ? 'تم النسخ!' : 'Copied!') : demoCredentials.email}
              </code>
            </span>
            <span className='text-zinc-400'>•</span>
            <span>
              {isRtl ? 'الرمز:' : 'Password:'}{' '}
              <code
                onClick={(e) => handleCopy(e, demoCredentials.password, 'password')}
                className='text-foreground cursor-pointer rounded bg-zinc-500/10 px-1.5 py-0.5 transition-all select-all hover:bg-zinc-500/20 active:scale-95 dark:bg-zinc-400/10 dark:hover:bg-zinc-400/20'
                title={isRtl ? 'اضغط للنسخ' : 'Click to copy'}
              >
                {copiedText === 'password'
                  ? isRtl
                    ? 'تم النسخ!'
                    : 'Copied!'
                  : demoCredentials.password}
              </code>
            </span>
          </div>
        )}

        {/* Tech stack logos representation */}
        <div className='flex flex-wrap items-center gap-3'>
          {stack.map((item) => {
            const iconUrl = getTechIconUrl(item)
            return (
              <div
                key={`${title}-${item}`}
                className='bg-secondary/40 border-border/40 hover:bg-secondary/80 flex size-9 items-center justify-center rounded-lg border p-1.5 transition-all duration-200'
                title={item}
              >
                <img
                  src={iconUrl}
                  alt={item}
                  className={`size-6 object-contain ${
                    ['expo', 'next.js', 'nextdotjs', 'github', 'prisma', 'better auth'].includes(
                      item.toLowerCase(),
                    )
                      ? 'dark:brightness-0 dark:invert'
                      : ''
                  }`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      const textNode = document.createElement('span')
                      textNode.className = 'text-xs font-medium px-1'
                      textNode.innerText = item
                      parent.appendChild(textNode)
                    }
                  }}
                />
              </div>
            )
          })}
        </div>

        <div className='mt-2 flex flex-wrap items-center gap-4'>
          {githubUrl ? (
            <Link
              href={githubUrl}
              target='_blank'
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-2',
              )}
            >
              <svg
                role='img'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                className='fill-foreground dark:fill-foreground size-4'
              >
                <title>GitHub</title>
                <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
              </svg>
              <span className='text-sm font-medium'>{t('projects.github')}</span>
            </Link>
          ) : null}

          {isLive && liveUrl ? (
            <MagneticLinkPreview
              url={liveUrl}
              icon={isRtl ? ArrowUpLeftIcon : ArrowUpRightIcon}
              variant='outline'
              className='flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium'
            >
              {t('projects.live')}
            </MagneticLinkPreview>
          ) : null}

          {PROJECT_DETAILS_PUBLIC ? (
            <Link
              href={`/projects/${slug}`}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'rounded-full px-5 py-2.5 text-sm font-medium',
              )}
            >
              {t('projects.viewDetails')}
            </Link>
          ) : null}
        </div>
      </div>

      {/* Show only the first image in static display (takes 1/3 on desktop) */}
      <div className='relative flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-900/5 sm:h-80 lg:h-full lg:w-[35%] dark:bg-zinc-100/5'>
        <Image
          src={images[0]}
          alt={imageAlts[0] ?? title}
          width={400}
          height={400}
          style={{ width: 'auto', height: 'auto' }}
          className='pointer-events-none max-h-[85%] max-w-[85%] object-contain transition-transform duration-500 select-none group-hover:scale-105'
        />
      </div>
    </Card>
  )
}
