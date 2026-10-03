import { portraitPath } from '@/components/home/portrait'

// Touch experiment: the browser owns movement and handoffs on one scroll timeline.
export function startNativePortraitJourney({
  source,
  destination,
  resting,
  section,
  traveler,
}: {
  source: HTMLElement
  destination: HTMLElement
  resting: HTMLElement
  section: HTMLElement
  traveler: HTMLElement
}): (() => void) | null {
  if (
    !('ScrollTimeline' in window) ||
    !CSS.supports('animation-timeline', 'scroll()') ||
    !CSS.supports('animation-range', '0px 1px')
  )
    return null

  const paths = traveler.querySelectorAll<SVGPathElement>('[data-portrait-path]')
  const originalPaths = Array.from(paths, (path) => ({
    path,
    d: path.getAttribute('d'),
    stroke: path.getAttribute('stroke-width'),
  }))
  const art = traveler.querySelector<HTMLElement>('[data-portrait-art]')
  const light = traveler.querySelector<HTMLElement>('[data-paper-light]')
  const availability = traveler.querySelector<HTMLElement>('[data-portrait-availability]')
  const timeline = new ScrollTimeline({ source: document.scrollingElement, axis: 'y' })
  let animations: Animation[] = []
  let frame = 0
  let shapeFrame = 0
  let range: { start: number; end: number } | null = null
  let shapeProgress = -1
  let disposed = false
  let viewportWidth = window.innerWidth
  let viewportHeight = window.innerHeight
  const landingOffset = 112 + (Number.parseFloat(getComputedStyle(section).scrollMarginTop) || 0)
  const originalFilter = art?.style.filter
  if (art) art.style.filter = ''
  const originalPosition = traveler.style.position
  const originalVisibility = traveler.style.visibility
  const originalOpacity = traveler.style.opacity

  function measure() {
    frame = 0
    if (disposed) return
    const from = source.getBoundingClientRect()
    const to = destination.getBoundingClientRect()
    const scroll = window.scrollY
    // The hero's entrance temporarily translates its parent by 30px. Measure
    // the resting anchor so the scroll path doesn't retain that entrance offset.
    const entranceTransform = source.parentElement
      ? getComputedStyle(source.parentElement).transform
      : 'none'
    const entranceY =
      entranceTransform && entranceTransform !== 'none'
        ? new DOMMatrixReadOnly(entranceTransform).m42
        : 0
    const fromTop = from.top + scroll - entranceY
    const toTop = to.top + scroll
    const start = Math.max(0, fromTop - viewportHeight * 0.16)
    const end = Math.max(start + 1, section.getBoundingClientRect().top + scroll - landingOffset)
    range = { start, end }
    const options: KeyframeAnimationOptions = {
      timeline,
      rangeStart: `${start}px`,
      rangeEnd: `${end}px`,
      fill: 'both',
      easing: 'linear',
    }
    const next: Animation[] = []
    const animate = (element: HTMLElement, keyframes: Keyframe[]) => {
      next.push(element.animate(keyframes, options))
    }
    // Absolute positioning lets native page scrolling handle the viewport offset.
    // Fixed positioning would require subtracting scrollY in JavaScript every frame.
    traveler.style.position = 'absolute'
    traveler.style.visibility = 'visible'
    traveler.style.opacity = '0'
    traveler.style.width = `${from.width}px`
    traveler.style.height = `${from.height}px`
    traveler.style.transformOrigin = 'top left'
    try {
      const transforms = Array.from({ length: 121 }, (_, index) => {
        const progress = index / 120
        const eased = progress * progress * (3 - 2 * progress)
        const mix = (a: number, b: number) => a + (b - a) * eased
        return {
          offset: progress,
          transform: `translate3d(${mix(from.left, to.left)}px, ${mix(fromTop, toTop)}px, 0) scale(${mix(from.width, to.width) / from.width}, ${mix(from.height, to.height) / from.height})`,
        }
      })
      animate(traveler, transforms)
      const step = 'steps(1, end)'
      animate(traveler, [
        { offset: 0, opacity: 0, easing: step },
        { offset: 0.000001, opacity: 1, easing: step },
        { offset: 0.999999, opacity: 1, easing: step },
        { offset: 1, opacity: 0 },
      ])
      animate(source, [
        { offset: 0, opacity: 1, easing: step },
        { offset: 0.000001, opacity: 0 },
        { offset: 1, opacity: 0 },
      ])
      animate(resting, [{ opacity: 0, easing: step }, { opacity: 1 }])
      const direction = document.documentElement.dir === 'rtl' ? -1 : 1
      if (art)
        animate(
          art,
          Array.from({ length: 121 }, (_, index) => {
            const progress = index / 120
            const wave = Math.sin(progress * Math.PI)
            return {
              offset: progress,
              transform: `perspective(1000px) rotateY(${direction * wave * 18}deg) rotateX(${Math.sin(progress * Math.PI * 2) * 9}deg) rotateZ(${direction * wave * -5}deg)`,
            }
          }),
        )
      if (light)
        animate(
          light,
          Array.from({ length: 121 }, (_, index) => ({
            offset: index / 120,
            opacity: Math.sin((index / 120) * Math.PI) * 0.65,
          })),
        )
      if (availability)
        animate(availability, [
          { offset: 0, opacity: 1 },
          { offset: 0.2, opacity: 0 },
          { offset: 1, opacity: 0 },
        ])
    } catch {
      next.forEach((animation) => animation.cancel())
      // Fail open if a browser advertises the API but rejects ranged animations.
      cleanup()
      return
    }
    animations.forEach((animation) => animation.cancel())
    animations = next
    traveler.dataset.nativeScroll = 'true'
    cancelAnimationFrame(shapeFrame)
    updateShape()
  }
  // SVG attribute morphing still needs JavaScript. It uses the original curve,
  // with no smoothing delay or layout reads; movement, tilt and lighting stay native.
  function updateShape() {
    shapeFrame = 0
    if (disposed || !range) return
    const progress = Math.min(
      1,
      Math.max(0, (window.scrollY - range.start) / (range.end - range.start)),
    )
    // Preserve the original CSS fade/slide and delay once the portrait lands.
    section.dataset.portraitLanded = String(progress === 1)
    if (progress === shapeProgress) return
    shapeProgress = progress
    const eased = progress * progress * (3 - 2 * progress)
    paths.forEach((path) => path.setAttribute('d', portraitPath(eased)))
    paths[1]?.setAttribute('stroke-width', String(8 - 7 * eased))
  }
  function scheduleShape() {
    if (!disposed && !shapeFrame) shapeFrame = requestAnimationFrame(updateShape)
  }
  function schedule() {
    if (!disposed && !frame) frame = requestAnimationFrame(measure)
  }
  function resize() {
    // Ignore address-bar height changes, but refresh for orientation/layout changes.
    if (viewportWidth === window.innerWidth) return
    viewportWidth = window.innerWidth
    viewportHeight = window.innerHeight
    schedule()
  }
  const observer = new ResizeObserver(schedule)
  function cleanup() {
    disposed = true
    cancelAnimationFrame(frame)
    cancelAnimationFrame(shapeFrame)
    observer.disconnect()
    window.removeEventListener('resize', resize)
    window.removeEventListener('scroll', scheduleShape)
    animations.forEach((animation) => animation.cancel())
    originalPaths.forEach(({ path, d, stroke }) => {
      if (d === null) path.removeAttribute('d')
      else path.setAttribute('d', d)
      if (stroke === null) path.removeAttribute('stroke-width')
      else path.setAttribute('stroke-width', stroke)
    })
    if (art && originalFilter !== undefined) art.style.filter = originalFilter
    traveler.style.position = originalPosition
    traveler.style.visibility = originalVisibility
    traveler.style.opacity = originalOpacity
    delete traveler.dataset.nativeScroll
    delete section.dataset.portraitLanded
  }
  measure()
  if (disposed) return null
  observer.observe(source)
  observer.observe(destination)
  observer.observe(document.body)
  window.addEventListener('resize', resize)
  window.addEventListener('scroll', scheduleShape, { passive: true })
  document.fonts.ready.then(schedule)
  return cleanup
}
