'use client'

import { LogoCloud } from '@/components/logo-cloud'
import { DATA } from '@/data/resume'
import { useTranslations } from 'next-intl'
import { m } from 'motion/react'

export default function Logos() {
  const t = useTranslations()

  return (
    <div className='relative w-full place-content-center pt-6 pb-1'>
      <section className='relative mx-auto max-w-5xl'>
        <h2 className='text-muted-foreground/85 mb-6 text-center text-sm font-normal sm:text-base'>
          {t(DATA.techStack.line1Key)}
        </h2>

        <LogoCloud logos={logos} />
      </section>

      {/* Curved glowing separator pattern transitioning to Who Am I */}
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className='after:border-border after:bg-secondary pointer-events-none absolute top-full right-0 left-0 -z-10 -mt-[124px] h-64 w-full overflow-hidden mask-[radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,oklch(0.88_0.02_80),transparent_70%)] before:opacity-40 after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t md:-mt-[192px] md:h-96 dark:before:bg-[radial-gradient(circle_at_bottom_center,#ffffff,transparent_70%)] dark:after:border-[#ffffff66] dark:after:bg-zinc-900'
      />
    </div>
  )
}

const logos = [
  {
    src: 'https://cdn.simpleicons.org/javascript',
    alt: 'JavaScript Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/typescript',
    alt: 'TypeScript Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/nextdotjs',
    alt: 'Next.js Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/react',
    alt: 'React Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/expo',
    alt: 'Expo Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/tailwindcss',
    alt: 'Tailwind CSS Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/prisma',
    alt: 'Prisma Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/drizzle',
    alt: 'Drizzle Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/nestjs',
    alt: 'NestJS Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/hono',
    alt: 'Hono Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/figma',
    alt: 'Figma Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/git',
    alt: 'Git Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/github',
    alt: 'GitHub Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/docker',
    alt: 'Docker Logo',
  },
]
