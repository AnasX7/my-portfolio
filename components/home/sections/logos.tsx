import { LogoCloud } from '@/components/logo-cloud'
import { DATA } from '@/data/resume'
import { useTranslations } from 'next-intl'

export default function Logos() {
  const t = useTranslations()

  return (
    <div className='bg-card/65 border-border w-full place-content-center border-y-2 border-dashed py-8'>
      <section className='relative mx-auto max-w-5xl'>
        <h2 className='text-foreground mb-5 text-center text-xl font-medium tracking-tight text-balance md:text-3xl'>
          <span className='text-muted-foreground'>{t(DATA.techStack.line1Key)}</span>
          <br />
          <span className='font-semibold'>{t(DATA.techStack.line2Key)}</span>
        </h2>
        <div className='bg-border mx-auto my-5 h-px max-w-sm [mask-image:linear-gradient(to_right,transparent,black,transparent)]' />

        <LogoCloud logos={logos} />

        <div className='bg-border mt-5 h-px [mask-image:linear-gradient(to_right,transparent,black,transparent)]' />
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
    src: 'https://cdn.simpleicons.org/express',
    alt: 'Express Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/hono',
    alt: 'Hono Logo',
  },
  {
    src: 'https://cdn.simpleicons.org/laravel',
    alt: 'Laravel Logo',
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
