'use client'

import { usePathname } from 'next/navigation'
import Lenis, { type ScrollToOptions } from 'lenis'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { shouldEnableRichMotion } from '@/lib/motion-policy'

type ScrollTarget = number | string | HTMLElement

type SmoothScrollContextValue = {
  enabled: boolean
  scrollTo: (target: ScrollTarget, options?: ScrollToOptions) => void
}

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null)

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const previousPath = useRef(pathname)
  const scrollPositions = useRef(new Map<string, number>())
  const traversingHistory = useRef(false)
  const navigating = useRef(false)
  const [enabled, setEnabled] = useState(false)
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const narrowViewport = window.matchMedia('(max-width: 767px)')

    const updatePreference = () => {
      setEnabled(
        shouldEnableRichMotion({
          prefersReducedMotion: reducedMotion.matches,
          hasCoarsePointer: coarsePointer.matches,
          hasNarrowViewport: narrowViewport.matches,
        }),
      )
    }

    updatePreference()
    reducedMotion.addEventListener('change', updatePreference)
    coarsePointer.addEventListener('change', updatePreference)
    narrowViewport.addEventListener('change', updatePreference)

    return () => {
      reducedMotion.removeEventListener('change', updatePreference)
      coarsePointer.removeEventListener('change', updatePreference)
      narrowViewport.removeEventListener('change', updatePreference)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setLenis(null)
      return
    }

    const instance = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    setLenis(instance)

    return () => {
      instance.destroy()
    }
  }, [enabled])

  const scrollTo = useCallback(
    (target: ScrollTarget, options?: ScrollToOptions) => {
      if (lenis) {
        lenis.scrollTo(target, options)
        return
      }

      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'auto' })
        return
      }

      const element =
        typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target

      element?.scrollIntoView({ behavior: 'auto', block: 'start' })
    },
    [lenis],
  )

  useEffect(() => {
    const rememberScroll = () => {
      if (!navigating.current) scrollPositions.current.set(previousPath.current, window.scrollY)
    }
    const onNavigationClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (
        !link ||
        link.download ||
        link.target === '_blank' ||
        link.origin !== window.location.origin
      )
        return
      if (link.pathname === window.location.pathname) return
      rememberScroll()
      navigating.current = true
    }
    const onHistoryNavigation = () => {
      if (window.location.pathname === previousPath.current) return
      rememberScroll()
      navigating.current = true
      traversingHistory.current = true
    }
    document.addEventListener('click', onNavigationClick, true)
    window.addEventListener('scroll', rememberScroll, { passive: true })
    window.addEventListener('popstate', onHistoryNavigation)
    return () => {
      document.removeEventListener('click', onNavigationClick, true)
      window.removeEventListener('scroll', rememberScroll)
      window.removeEventListener('popstate', onHistoryNavigation)
    }
  }, [])

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return
    const restoringHistory = traversingHistory.current
    const target = restoringHistory ? (scrollPositions.current.get(pathname) ?? 0) : 0
    previousPath.current = pathname
    navigating.current = false
    traversingHistory.current = false
    lenis?.resize()
    const arrivingAtAnchor =
      !restoringHistory && window.location.pathname === pathname && window.location.hash
    const destination = arrivingAtAnchor ? window.scrollY : target
    const resetScroll = () => {
      lenis?.stop()
      scrollTo(destination, { immediate: true, force: true })
      lenis?.start()
    }
    // Stop outgoing momentum, then synchronize after Next's own scroll restoration.
    resetScroll()
    const frame = requestAnimationFrame(resetScroll)
    return () => cancelAnimationFrame(frame)
  }, [pathname, lenis, scrollTo])

  const value = useMemo(() => ({ enabled, scrollTo }), [enabled, scrollTo])

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
}

export function useSmoothScroll() {
  const value = useContext(SmoothScrollContext)

  if (!value) {
    throw new Error('useSmoothScroll must be used within SmoothScrollProvider')
  }

  return value
}
