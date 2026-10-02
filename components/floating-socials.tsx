'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Liquid } from 'liquid-gooey'
import { DATA } from '@/data/resume'

const positions = [
  [0, -168],
  [-65, -152],
  [-118, -118],
  [-152, -65],
  [-168, 0],
]

export function FloatingSocials() {
  const t = useTranslations('socialMenu')
  const direction = useLocale() === 'ar' ? 1 : -1
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    function dismiss(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  return (
    <div
      ref={ref}
      className='pointer-events-none fixed start-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-60 size-14 sm:start-6'
    >
      <Liquid
        className='size-14'
        fill='var(--secondary)'
        blur={6}
        filterPadding={200}
        shadow='inset 0 0 0 1px var(--border), 0 4px 16px rgba(0,0,0,.15)'
      >
        <Liquid.Item radius={28} className='relative z-10 size-14'>
          <button
            ref={trigger}
            type='button'
            aria-label={open ? t('close') : t('open')}
            aria-expanded={open}
            aria-controls={id}
            title={t('open')}
            onClick={() => setOpen(!open)}
            className='text-foreground focus-visible:outline-ring pointer-events-auto flex size-14 items-center justify-center rounded-full outline-offset-4 [corner-shape:round] focus-visible:outline-2'
          >
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.8'
              className='size-6'
            >
              {open ? (
                <path d='m6 6 12 12M6 18 18 6' />
              ) : (
                <>
                  <circle cx='18' cy='5' r='3' />
                  <circle cx='6' cy='12' r='3' />
                  <circle cx='18' cy='19' r='3' />
                  <path d='m8.6 10.5 6.8-4M8.6 13.5l6.8 4' />
                </>
              )}
            </svg>
          </button>
        </Liquid.Item>
        <nav id={id} aria-label={t('open')} inert={!open}>
          {DATA.socials.map((social, index) => {
            const Icon = social.icon
            const [x, y] = positions[index]
            return (
              <Liquid.Item
                key={social.name}
                x={open ? x * direction : 0}
                y={open ? y : 0}
                transition='bouncy'
                delay={open ? index * 25 : 0}
                radius={28}
                className='absolute top-0 left-0 size-14'
              >
                <a
                  href={social.url}
                  target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel='noopener noreferrer'
                  aria-label={social.name}
                  title={social.name}
                  onClick={() => setOpen(false)}
                  className={`text-foreground hover:text-muted-foreground focus-visible:outline-ring flex size-14 items-center justify-center rounded-full outline-offset-4 transition-opacity duration-150 [corner-shape:round] focus-visible:outline-2 motion-reduce:transition-none ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
                >
                  <Icon aria-hidden='true' className='size-5' />
                </a>
              </Liquid.Item>
            )
          })}
        </nav>
      </Liquid>
    </div>
  )
}
