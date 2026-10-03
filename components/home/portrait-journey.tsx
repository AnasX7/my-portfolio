'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Portrait, portraitPath } from '@/components/home/portrait'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

export function PortraitJourney() {
  const [mounted, setMounted] = useState(false)
  const floating = useRef<HTMLDivElement>(null)
  const displacement = useRef<SVGFEDisplacementMapElement>(null)
  const filterId = `paper-${useId().replaceAll(':', '')}`
  const reducedMotion = useHydratedReducedMotion()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || reducedMotion) return
    const source = document.querySelector<HTMLElement>('[data-portrait-source]')
    const destination = document.querySelector<HTMLElement>('[data-portrait-destination]')
    const resting = destination?.querySelector<HTMLElement>('[data-portrait-resting]')
    const section = destination?.closest<HTMLElement>('#about')
    const traveler = floating.current
    if (!source || !destination || !resting || !section || !traveler) return

    const landingOffset = 112 + (Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0)
    let frame = 0
    let disposed = false
    const paths = traveler.querySelectorAll<SVGPathElement>('[data-portrait-path]')
    const availability = traveler.querySelector<HTMLElement>('[data-portrait-availability]')
    const light = traveler.querySelector<HTMLElement>('[data-paper-light]')
    const art = traveler.querySelector<HTMLElement>('[data-portrait-art]')
    const clamp = (value: number) => Math.min(1, Math.max(0, value))

    function update() {
      frame = 0
      if (!source || !destination || !resting || !section || !traveler) return
      const from = source.getBoundingClientRect()
      const to = destination.getBoundingClientRect()
      const scroll = window.scrollY
      const start = Math.max(0, from.top + scroll - window.innerHeight * 0.16)
      const end = Math.max(start + 1, section.getBoundingClientRect().top + scroll - landingOffset)
      const progress = clamp((scroll - start) / (end - start))
      const eased = progress * progress * (3 - 2 * progress)
      const wave = Math.sin(progress * Math.PI)
      const traveling = progress > 0 && progress < 1
      const mix = (a: number, b: number) => a + (b - a) * eased

      source.style.visibility = traveling || progress === 1 ? 'hidden' : ''
      resting.style.visibility = progress < 1 ? 'hidden' : ''
      section.dataset.portraitLanded = String(progress === 1)
      traveler.style.visibility = traveling ? 'visible' : 'hidden'
      if (!traveling) return

      // Viewport coordinates keep the portrait continuous through both section boundaries.
      traveler.style.width = `${mix(from.width, to.width)}px`
      traveler.style.height = `${mix(from.height, to.height)}px`
      traveler.style.transform = `translate3d(${mix(from.left, to.left)}px, ${mix(from.top, to.top)}px, 0)`
      const direction = document.documentElement.dir === 'rtl' ? -1 : 1
      if (art) {
        art.style.transform = `perspective(1000px) rotateY(${direction * wave * 18}deg) rotateX(${Math.sin(progress * Math.PI * 2) * 9}deg) rotateZ(${direction * wave * -5}deg)`
        art.style.filter =
          wave > 0.01
            ? `url(#${filterId}) drop-shadow(0 ${wave * 20}px ${wave * 24}px rgb(0 0 0 / ${wave * 0.16}))`
            : ''
      }
      displacement.current?.setAttribute('scale', String(wave * 12))
      paths.forEach((path) => path.setAttribute('d', portraitPath(eased)))
      paths[1]?.setAttribute('stroke-width', String(8 - 7 * eased))
      if (availability) availability.style.opacity = String(clamp(1 - progress * 5))
      if (light) light.style.opacity = String(wave * 0.65)
    }
    function schedule() {
      if (!disposed && !frame) frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(source)
    observer.observe(destination)
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Font loading can shift both anchors without resizing the portrait itself.
    document.fonts.ready.then(schedule)
    schedule()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      source.style.visibility = ''
      resting.style.visibility = ''
      delete section.dataset.portraitLanded
      traveler.style.visibility = 'hidden'
    }
  }, [mounted, reducedMotion, filterId])

  if (!mounted) return null
  return createPortal(
    <div
      ref={floating}
      aria-hidden='true'
      className='pointer-events-none invisible fixed top-0 left-0 z-30'
      style={{ visibility: 'hidden', width: 384, height: 384 }}
    >
      <svg width='0' height='0' className='absolute' aria-hidden='true'>
        <defs>
          <filter
            id={filterId}
            x='-15%'
            y='-15%'
            width='130%'
            height='130%'
            colorInterpolationFilters='sRGB'
          >
            <feTurbulence
              type='fractalNoise'
              baseFrequency='0.004 0.012'
              numOctaves='1'
              seed='7'
              result='paper-wave'
            />
            <feDisplacementMap
              ref={displacement}
              in='SourceGraphic'
              in2='paper-wave'
              scale='0'
              xChannelSelector='R'
              yChannelSelector='G'
            />
          </filter>
        </defs>
      </svg>
      <Portrait traveling />
    </div>,
    document.body,
  )
}
