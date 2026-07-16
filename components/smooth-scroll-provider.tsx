'use client'

import Lenis, { type ScrollToOptions } from 'lenis'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1.2,
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
