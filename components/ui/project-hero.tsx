'use client'

import { useState } from 'react'
import Image from 'next/image'
import { m } from 'motion/react'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

interface ProjectHeroProps {
  project: {
    id: string
    stack: readonly string[]
    githubUrl: string | null
    isLive: boolean
    liveUrl: string | null
    images: readonly string[]
    demoCredentials?: {
      email: string
      password: string
    } | null
  }
  title: string
  description: string
  heroAlt: string
  isRtl: boolean
  projectNumber: number
  labels: {
    project: string
    github: string
    live: string
    technologies: string
    demoAccount: string
    email: string
    password: string
    copy: string
    copied: string
  }
}

const getTechIconUrl = (tech: string) => {
  const slugMap: Record<string, string> = {
    expo: 'expo',
    'react native': 'react',
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
  const slug = slugMap[clean] || clean.replace(/\s+/g, '')
  return slug.startsWith('/') ? slug : `https://cdn.simpleicons.org/${slug}`
}

export default function ProjectHero({
  project,
  title,
  description,
  heroAlt,
  isRtl,
  projectNumber,
  labels,
}: ProjectHeroProps) {
  const shouldReduceMotion = useHydratedReducedMotion()
  const [copiedText, setCopiedText] = useState<'email' | 'password' | null>(null)

  const reveal = { initial: false as const, animate: { opacity: 1, y: 0 } }

  const handleCopy = async (text: string, type: 'email' | 'password') => {
    await navigator.clipboard.writeText(text)
    setCopiedText(type)
    window.setTimeout(() => setCopiedText(null), 1800)
  }

  return (
    <section
      data-editorial-hero='true'
      aria-labelledby='project-title'
      className='relative isolate min-h-[720px] overflow-hidden rounded-[2rem] bg-zinc-950 text-white shadow-2xl shadow-black/10 md:min-h-[calc(100svh-7rem)]'
    >
      <m.div
        className='absolute inset-0'
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={project.images[0]}
          alt={heroAlt}
          fill
          priority
          unoptimized
          sizes='(max-width: 1280px) 100vw, 1280px'
          className='object-contain object-top select-none'
        />
      </m.div>

      <div className='absolute inset-0 bg-black/60' aria-hidden='true' />

      <div className='relative flex min-h-[720px] flex-col justify-between p-6 sm:p-9 md:min-h-[calc(100svh-7rem)] md:p-12 lg:p-16'>
        <m.div
          {...reveal}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className='flex items-center justify-between gap-4 text-[0.7rem] font-semibold tracking-[0.24em] text-white/75 uppercase'
        >
          <span>
            {labels.project} {projectNumber.toString().padStart(2, '0')}
          </span>
          <span className='h-px flex-1 bg-white/25' aria-hidden='true' />
          <span>{project.id.replaceAll('-', ' ')}</span>
        </m.div>

        <div className='max-w-4xl'>
          <m.h1
            id='project-title'
            {...reveal}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.08,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`max-w-4xl font-semibold text-balance ${
              isRtl
                ? 'text-5xl leading-[1.08] tracking-[-0.035em] sm:text-6xl lg:text-7xl'
                : 'text-5xl leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl'
            }`}
          >
            {title}
          </m.h1>

          <m.p
            {...reveal}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.16,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className='mt-6 max-w-2xl text-base leading-7 text-pretty text-white/78 sm:text-lg sm:leading-8'
          >
            {description}
          </m.p>

          <m.div
            {...reveal}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.24,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className='mt-8 flex flex-wrap items-center gap-x-7 gap-y-4'
          >
            {project.isLive && project.liveUrl ? (
              <a
                href={project.liveUrl}
                target='_blank'
                rel='noreferrer'
                className='group inline-flex min-h-11 items-center gap-3 border-b border-white pb-1 text-sm font-semibold text-white transition-colors duration-150 outline-none hover:border-white/45 focus-visible:ring-2 focus-visible:ring-white'
              >
                {labels.live}
                <ArrowIcon isRtl={isRtl} />
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target='_blank'
                rel='noreferrer'
                className='group inline-flex min-h-11 items-center gap-3 border-b border-white/45 pb-1 text-sm font-semibold text-white transition-colors duration-150 outline-none hover:border-white focus-visible:ring-2 focus-visible:ring-white'
              >
                {labels.github}
                <ArrowIcon isRtl={isRtl} />
              </a>
            ) : null}
          </m.div>

          <m.div
            {...reveal}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.3,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className='mt-10 grid gap-7 border-t border-white/25 pt-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end'
          >
            <div>
              <h2 className='text-xs font-semibold tracking-[0.2em] text-white/60 uppercase'>
                {labels.technologies}
              </h2>
              <ul className='mt-4 flex flex-wrap gap-x-5 gap-y-3'>
                {project.stack.map((item) => (
                  <li
                    key={`${title}-${item}`}
                    className='flex items-center gap-2.5 text-sm text-white/90'
                  >
                    <span className='flex size-6 items-center justify-center' aria-hidden='true'>
                      <img
                        src={getTechIconUrl(item)}
                        alt=''
                        className={`size-4 object-contain ${
                          ['expo', 'next.js', 'nextdotjs', 'github'].includes(item.toLowerCase())
                            ? 'brightness-0 invert'
                            : ''
                        }`}
                      />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {project.demoCredentials ? (
              <div className='border-white/25 lg:border-s lg:ps-7'>
                <p className='text-xs font-semibold tracking-[0.18em] text-white/60 uppercase'>
                  {labels.demoAccount}
                </p>
                <div className='mt-3 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-white/85'>
                  <CredentialButton
                    label={labels.email}
                    value={project.demoCredentials.email}
                    copyLabel={labels.copy}
                    copiedLabel={labels.copied}
                    isCopied={copiedText === 'email'}
                    onCopy={() => handleCopy(project.demoCredentials!.email, 'email')}
                  />
                  <CredentialButton
                    label={labels.password}
                    value={project.demoCredentials.password}
                    copyLabel={labels.copy}
                    copiedLabel={labels.copied}
                    isCopied={copiedText === 'password'}
                    onCopy={() => handleCopy(project.demoCredentials!.password, 'password')}
                  />
                </div>
              </div>
            ) : null}
          </m.div>
        </div>
      </div>
    </section>
  )
}

function CredentialButton({
  label,
  value,
  copyLabel,
  copiedLabel,
  isCopied,
  onCopy,
}: {
  label: string
  value: string
  copyLabel: string
  copiedLabel: string
  isCopied: boolean
  onCopy: () => void
}) {
  return (
    <button
      type='button'
      onClick={onCopy}
      title={`${copyLabel} ${label}`}
      className='min-h-8 cursor-copy border-b border-dashed border-white/35 text-start transition-colors duration-150 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
    >
      <span className='text-white/55'>{label}: </span>
      {isCopied ? copiedLabel : value}
    </button>
  )
}

function ArrowIcon({ isRtl }: { isRtl: boolean }) {
  return (
    <svg
      viewBox='0 0 20 20'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      className={`size-4 transition-transform duration-150 group-hover:-translate-y-0.5 ${
        isRtl ? 'rotate-[-90deg]' : 'rotate-0'
      }`}
      aria-hidden='true'
    >
      <path d='M5 15 15 5M7 5h8v8' />
    </svg>
  )
}
