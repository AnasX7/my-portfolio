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
    const finePointer = window.matchMedia('(pointer: fine) and (min-width: 768px)')
    let viewportWidth = window.innerWidth
    let viewportHeight = window.innerHeight
    let progress: number | null = null
    let previousTime: number | null = null
    let bounds: {
      start: number
      end: number
      from: { left: number; top: number; width: number; height: number }
      to: { left: number; top: number; width: number; height: number }
    } | null = null
    let phase = ''

    function measure() {
      if (!source || !destination || !section || !traveler) return
      const from = source.getBoundingClientRect()
      const to = destination.getBoundingClientRect()
      const documentRect = (rect: DOMRect) => ({
        left: rect.left,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      })
      const start = Math.max(0, from.top + window.scrollY - viewportHeight * 0.16)
      bounds = {
        from: documentRect(from),
        to: documentRect(to),
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

    function update(time: number) {
      frame = 0
      if (!source || !destination || !resting || !section || !traveler) return
      if (!bounds) measure()
      if (!bounds) return
      const scroll = window.scrollY
      const target = clamp((scroll - bounds.start) / (bounds.end - bounds.start))
      // Desktop already receives Lenis-smoothed input. Touch gets a brief, time-based
      // catch-up so sparse swipe events don't jump the morph straight to the target.
      const elapsed = previousTime === null ? 1000 / 60 : Math.min(64, time - previousTime)
      previousTime = time
      if (
        progress === null ||
        finePointer.matches ||
        scroll > bounds.end + viewportHeight ||
        scroll < bounds.start - viewportHeight
      ) {
        progress = target
      } else {
        progress += (target - progress) * (1 - Math.exp(-elapsed / 80))
        if (Math.abs(target - progress) < 0.0005) progress = target
      }
      if (progress !== target) schedule()
      else previousTime = null
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
      const { from, to } = bounds

      // Cache document coordinates; only compensate for native scrolling each frame.
      // This keeps the handoffs aligned without repeated layout reads.
      traveler.style.transformOrigin = 'top left'
      traveler.style.transform = `translate3d(${mix(from.left, to.left)}px, ${mix(from.top, to.top) - scroll}px, 0) scale(${mix(from.width, to.width) / from.width}, ${mix(from.height, to.height) / from.height})`
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
    function onResize() {
      // Touch browser chrome changes height while scrolling; preserve the range.
      // Width changes (including orientation) and desktop resizing remeasure it.
      if (!finePointer.matches && viewportWidth === window.innerWidth) return
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
      invalidate()
    }
    const observer = new ResizeObserver(invalidate)
    observer.observe(source)
    observer.observe(destination)
    observer.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    // Font loading can shift both anchors without resizing the portrait itself.
    document.fonts.ready.then(invalidate)
    schedule()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
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
