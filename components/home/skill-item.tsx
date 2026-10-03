'use client'

import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ApiIcon, HierarchyIcon, WorkflowCircle01Icon } from '@hugeicons/core-free-icons'
import { DATA } from '@/data/resume'

const skillLogos: Record<string, string> = Object.fromEntries(
  DATA.about.card4.skillGroups.flatMap((group) =>
    group.skills.map((skill) => [skill.name, skill.logo]),
  ),
)

const workSkillLogos: Record<string, string> = {
  'React.js': skillLogos.React,
  'React Native': skillLogos.React,
  'Google Maps API': 'https://cdn.simpleicons.org/googlemaps',
  Dokploy: '/icons/dokploy.svg',
  'GitHub Actions': 'https://cdn.simpleicons.org/githubactions',
  Laravel: 'https://cdn.simpleicons.org/laravel',
  PHP: 'https://cdn.simpleicons.org/php',
  MySQL: 'https://cdn.simpleicons.org/mysql',
  HTML5: 'https://cdn.simpleicons.org/html5',
}

const conceptIcons = {
  'CI/CD': WorkflowCircle01Icon,
  Monorepo: HierarchyIcon,
  'REST APIs': ApiIcon,
}

interface SkillLogoProps {
  name: string
  url: string
  fallbackChar: string
}

export const SkillLogo = ({ name, url, fallbackChar }: SkillLogoProps) => {
  const [error, setError] = useState(false)
  const shouldInvert = [
    'Next.js',
    'Expo',
    'HeroUI Native',
    'Turborepo',
    'Three.js',
    'Cal.com',
    'Resend',
    'Prisma',
    'Vercel',
    'Railway',
    'GitHub',
    'Better Auth',
    'shadcn/ui',
    'Codex',
    'Dokploy',
  ].includes(name)

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center select-none ${
        name === 'Motion' ? 'h-4 w-8' : name === 'Figma' ? 'size-5' : 'size-4'
      }`}
    >
      {name === 'Motion' ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1260 454'
          fill='currentColor'
          aria-hidden='true'
          className='text-foreground/75 size-full'
        >
          <path d='M475.753 0L226.8 453.6L0 453.6L194.392 99.4116C224.526 44.5081 299.724 0 362.353 0L475.753 0Z' />
          <path d='M1031.93 113.4C1031.93 50.7709 1082.7 0 1145.33 0C1207.96 0 1258.73 50.7709 1258.73 113.4C1258.73 176.029 1207.96 226.8 1145.33 226.8C1082.7 226.8 1031.93 176.029 1031.93 113.4Z' />
          <path d='M518.278 0L745.078 0L496.125 453.6L269.325 453.6L518.278 0Z' />
          <path d='M786.147 0L1012.95 0L818.555 354.188C788.422 409.092 713.223 453.6 650.594 453.6L537.194 453.6L786.147 0Z' />
        </svg>
      ) : error || !url ? (
        <span aria-hidden='true' className='text-muted-foreground text-xs font-medium uppercase'>
          {fallbackChar}
        </span>
      ) : (
        <img
          loading='lazy'
          decoding='async'
          src={url}
          alt=''
          aria-hidden='true'
          onError={() => setError(true)}
          className={`pointer-events-none size-full object-contain select-none ${
            shouldInvert ? 'dark:brightness-0 dark:invert' : ''
          }`}
        />
      )}
    </div>
  )
}

export function SkillItem({ name, logo }: { name: string; logo?: string }) {
  const conceptIcon = conceptIcons[name as keyof typeof conceptIcons]

  return (
    <div className='text-foreground/75 flex shrink-0 items-center gap-2 text-sm leading-tight whitespace-nowrap sm:text-base'>
      {conceptIcon ? (
        <HugeiconsIcon icon={conceptIcon} className='size-4 shrink-0' aria-hidden='true' />
      ) : (
        <SkillLogo
          name={name}
          url={logo ?? skillLogos[name] ?? workSkillLogos[name] ?? ''}
          fallbackChar={name.charAt(0)}
        />
      )}
      <span>{name}</span>
    </div>
  )
}
