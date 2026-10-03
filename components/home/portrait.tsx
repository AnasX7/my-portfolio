'use client'

import { useId } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { DATA } from '@/data/resume'

// Matching commands let the cut corner unfold into the about section's rounded frame.
export function portraitPath(progress = 0) {
  const mix = (from: number, to: number) => from + (to - from) * progress
  return `M.06 .018H.94Q.982 .018 .982 .058V${mix(0.842, 0.942)}Q.982 ${mix(0.88, 0.982)} .946 ${mix(0.88, 0.982)}H.73Q.686 ${mix(0.88, 0.982)} .66 ${mix(0.922, 0.982)}L.624 ${mix(0.966, 0.982)}Q.61 .982 .58 .982H.06Q.018 .982 .018 .942V.058Q.018 .018 .06 .018Z`
}

export function Portrait({
  about = false,
  traveling = false,
}: {
  about?: boolean
  traveling?: boolean
}) {
  const t = useTranslations()
  // Set the SVG attribute directly: Safari retains it when CSS says transform: none.
  const transform = useLocale() === 'ar' ? undefined : 'translate(1 0) scale(-1 1)'
  const id = useId().replaceAll(':', '')
  return (
    <div className='relative size-full' data-portrait-art>
      <div className='absolute inset-0' style={{ clipPath: `url(#${id}-clip)` }}>
        <Image
          alt={traveling ? '' : t(DATA.profile.nameKey)}
          src={DATA.profile.avatarLight}
          fill
          sizes='(min-width: 1024px) 420px, 320px'
          priority={!about}
          className='object-cover dark:hidden'
        />
        <Image
          alt={traveling ? '' : t(DATA.profile.nameKey)}
          src={DATA.profile.avatarDark}
          fill
          sizes='(min-width: 1024px) 420px, 320px'
          priority={!about}
          className='hidden object-cover dark:block'
        />
        {traveling && (
          <div
            data-paper-light
            className='pointer-events-none absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-black/20 opacity-0'
          />
        )}
      </div>
      <svg
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 size-full'
        viewBox='0 0 1 1'
        preserveAspectRatio='none'
      >
        <defs>
          <clipPath id={`${id}-clip`} clipPathUnits='objectBoundingBox'>
            <path data-portrait-path d={portraitPath(about ? 1 : 0)} transform={transform} />
          </clipPath>
        </defs>
        <path
          data-portrait-path
          d={portraitPath(about ? 1 : 0)}
          transform={transform}
          fill='none'
          className='stroke-border'
          strokeWidth={about ? '1' : '8'}
          vectorEffect='non-scaling-stroke'
        />
      </svg>
      {!about && (
        <div
          data-portrait-availability
          className='text-muted-foreground absolute start-0 bottom-1 flex h-[10%] w-[34%] items-center justify-center gap-2 text-xs lg:text-sm rtl:flex-row-reverse'
        >
          <span
            aria-hidden='true'
            className='size-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b98166]'
          />
          <span dir='auto'>{t('hero.available')}</span>
        </div>
      )}
    </div>
  )
}
