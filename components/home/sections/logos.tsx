import { LogoCloud } from '@/components/logo-cloud'
import { DATA } from '@/data/resume'
import { useTranslations } from 'next-intl'

export default function Logos() {
  const t = useTranslations()

  return (
    <div className='w-full place-content-center py-6'>
      <section className='relative mx-auto max-w-5xl'>
        <h2 className='text-muted-foreground/85 mb-6 text-center text-sm font-normal sm:text-base'>
          {t(DATA.techStack.line1Key)}
        </h2>

        <LogoCloud logos={logos} />
      </section>
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
