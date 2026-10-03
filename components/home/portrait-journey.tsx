'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Portrait, portraitPath } from '@/components/home/portrait'
import { startNativePortraitJourney } from '@/components/home/portrait-native-journey'
import { useHydratedReducedMotion } from '@/hooks/use-hydrated-reduced-motion'

export function PortraitJourney() {
  const [mounted, setMounted] = useState(false)
  const [touch, setTouch] = useState(false)
  const floating = useRef<HTMLDivElement>(null)
  const displacement = useRef<SVGFEDisplacementMapElement>(null)
  const filterId = `paper-${useId().replaceAll(':', '')}`
  const reducedMotion = useHydratedReducedMotion()

  useEffect(() => {
    const desktop = window.matchMedia('(pointer: fine) and (min-width: 768px)')
    const update = () => setTouch(!desktop.matches)
    update()
    setMounted(true)
    desktop.addEventListener('change', update)
    return () => desktop.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!mounted || reducedMotion) return
    const source = document.querySelector<HTMLElement>('[data-portrait-source]')
    const destination = document.querySelector<HTMLElement>('[data-portrait-destination]')
    const resting = destination?.querySelector<HTMLElement>('[data-portrait-resting]')
    const section = destination?.closest<HTMLElement>('#about')
    const traveler = floating.current
    if (!source || !destination || !resting || !section || !traveler) return

    if (touch) {
      const cleanup = startNativePortraitJourney({
        source,
        destination,
        resting,
        section,
        traveler,
      })
      if (cleanup) return cleanup
    }

    const landingOffset = 112 + (Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0)
    let frame = 0
    let disposed = false
    const paths = traveler.querySelectorAll<SVGPathElement>('[data-portrait-path]')
    const availability = traveler.querySelector<HTMLElement>('[data-portrait-availability]')
    const light = traveler.querySelector<HTMLElement>('[data-paper-light]')
    const art = traveler.querySelector<HTMLElement>('[data-portrait-art]')
    const clamp = (value: number) => Math.min(1, Math.max(0, value))
    const finePointer = window.matchMedia('(pointer: fine) and (min-width: 768px)')
    let bounds: { start: number; end: number } | null = null
    let phase = ''

    function measure() {
      if (!source || !section || !traveler) return
      const from = source.getBoundingClientRect()
      const start = Math.max(0, from.top + window.scrollY - window.innerHeight * 0.16)
      bounds = {
        start,
        end: Math.max(
          start + 1,
          section.getBoundingClientRect().top + window.scrollY - landingOffset,
        ),
      }
      // Scaling the fixed frame avoids animating layout dimensions on every scroll frame.
      traveler.style.width = `${from.width}px`
      traveler.style.height = `${from.height}px`
    }

    function update() {
      frame = 0
      if (!source || !destination || !resting || !section || !traveler) return
      if (!bounds) measure()
      if (!bounds) return
      const scroll = window.scrollY
      const progress = clamp((scroll - bounds.start) / (bounds.end - bounds.start))
      const eased = progress * progress * (3 - 2 * progress)
      const wave = Math.sin(progress * Math.PI)
      const traveling = progress > 0 && progress < 1
      const mix = (a: number, b: number) => a + (b - a) * eased

      const nextPhase = traveling ? 'traveling' : progress === 1 ? 'landed' : 'source'
      if (nextPhase !== phase) {
        source.style.visibility = traveling || progress === 1 ? 'hidden' : ''
        resting.style.visibility = progress < 1 ? 'hidden' : ''
        section.dataset.portraitLanded = String(progress === 1)
        traveler.style.visibility = traveling ? 'visible' : 'hidden'
        phase = nextPhase
      }
      if (!traveling) return
      const from = source.getBoundingClientRect()
      const to = destination.getBoundingClientRect()

      // Viewport coordinates keep the portrait continuous through both section boundaries.
      traveler.style.transformOrigin = 'top left'
      traveler.style.transform = `translate3d(${mix(from.left, to.left)}px, ${mix(from.top, to.top)}px, 0) scale(${mix(from.width, to.width) / from.width}, ${mix(from.height, to.height) / from.height})`
      const direction = document.documentElement.dir === 'rtl' ? -1 : 1
      if (art) {
        art.style.transform = `perspective(1000px) rotateY(${direction * wave * 18}deg) rotateX(${Math.sin(progress * Math.PI * 2) * 9}deg) rotateZ(${direction * wave * -5}deg)`
        art.style.filter =
          finePointer.matches && wave > 0.01
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
    function invalidate() {
      bounds = null
      schedule()
    }
    const observer = new ResizeObserver(invalidate)
    observer.observe(source)
    observer.observe(destination)
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', invalidate)
    // Font loading can shift both anchors without resizing the portrait itself.
    document.fonts.ready.then(invalidate)
    schedule()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', invalidate)
      source.style.visibility = ''
      resting.style.visibility = ''
      delete section.dataset.portraitLanded
      traveler.style.visibility = 'hidden'
    }
  }, [mounted, reducedMotion, filterId, touch])

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
